# 04 — Auth and permissions

> **Scope:** how sessions work, roles, protected routes, middleware.
> See also [`03-api-layer.md`](./03-api-layer.md) for per-action auth requirements.

---

## 1. Three independent auth systems

There is no auth library (`next-auth`, `jose`, `iron-session` — none are installed). Everything
is hand-rolled, and **three unrelated systems** sit on top of each other:

| System | Where it lives | Granularity | Enforcement |
|---|---|---|---|
| **A. Session cookie** | `session` HTTP cookie, plain JSON | "who am I" (id + role string) | Middleware + `getCurrentSession()` |
| **B. Dashboard routing** | `rolePathMap` in `middleware.ts` + `getRedirectPath` in `auth-actions.ts` | which dashboard root a role may use | Middleware redirects |
| **C. Menu on/off** | `menus` + `menu_management` tables, `dashboard-menu-registry.ts` | which sections of 4 dashboards are visible/visible-at-all | Middleware returns **404** |
| **D. Fine-grained permissions** | `roletypes` + `roles` tables via `checkCurrentUserRole()` | 48 named permissions | Server actions + 11 RSC page guards |

They are **not coordinated**. A role can pass B and C and still be blocked by D, or pass
everything and be completely unable to perform an action because the action has no D check.

```
        loginAction()  ──►  sets `session` cookie { id, name, email, role }
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
           middleware.ts (B + C)           server actions (D)
           ├─ session present?               ├─ getCurrentSession()
           ├─ right dashboard root?          ├─ session.role === "ADMIN"?
           ├─ menu enabled? → 404             └─ checkCurrentUserRole("…")?
           └─ "/" + session → redirect              │
                                                     ▼
                                            { success: false, error }
```

---

## 2. The session

### 2.1 Cookie definition

Set in `src/app/actions/auth-actions.ts:89-94`:

```ts
(await cookies()).set("session", JSON.stringify(sessionData), {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7,     // 7 days
  path: "/",
});
```

| Attribute | Value |
|---|---|
| Name | `session` |
| Value | `JSON.stringify({ id, name, email, role })` |
| `httpOnly` | `true` |
| `secure` | `true` only in production |
| `maxAge` | 604800 (7 days), sliding — **never refreshed**, so a session dies 7 days after login regardless of activity |
| `path` | `/` |
| `sameSite` | **not set** (browsers default to `Lax`) |
| `domain` | not set |
| **signature / encryption** | **none** |

Payload shape — exactly 4 keys:

```ts
const sessionData = {
  id: account.id,              // number — accounts.id
  name: account.name,
  email: account.account_email,  // NOTE: always the email, even when login used a phone number
  role: account.account_type,    // string — e.g. "ADMIN", "Delivery Account"
};
```

### 2.2 Reading it

```ts
// src/app/actions/auth-actions.ts:116
export async function getCurrentSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  try { return JSON.parse(sessionCookie); } catch { return null; }
}
```

No signature check, no DB lookup, no expiry check, no `account_status` check. **Whatever is in
the cookie is trusted.** It is imported by ~35 files and called 9–11 times inside a single
action in the busiest modules (`order-actions.ts`, `payment-actions.ts`).

### 2.3 A second, non-security cookie

`calendar-preference` (`"gregorian" | "ethiopian"`) is set by `src/lib/calendar-context.tsx` and
read by `src/lib/server-calendar.ts`. Not an auth concern.

### 2.4 Why this matters

| Issue | Consequence |
|---|---|
| Unsigned cookie | Anyone who can set the `session` cookie can claim any role. Middleware `JSON.parse`s it and trusts `role` verbatim (`middleware.ts:52`). |
| No server-side session store | **Sessions cannot be revoked.** `deleteAccountAction` soft-deletes the account but the cookie keeps working until it expires, because `getCurrentSession()` never touches the DB. |
| No sliding expiry | Users are silently logged out after 7 days with no warning. |
| `secure` is conditional | In non-production over HTTP the cookie is transmitted in clear. |

**If you need to harden this**, the minimal change is to HMAC the JSON with a server secret and
verify in `getCurrentSession()` + middleware. No env var exists for this today (`AUTH_SECRET`,
`SESSION_SECRET`, `JWT_SECRET` are all absent).

---

## 3. Login

### 3.1 Flow

```
LoginPageClient.tsx  onSubmit
      │  email (or phone), password
      ▼
loginAction(email, password)          auth-actions.ts:23
      │  1. accounts.findFirst({ account_email, is_deleted: false, account_status: true })
      │  2. accounts.findFirst({ phonenumber, is_deleted: false, account_status: true })
      │  3. printer.findFirst({ OR: [phone, email], is_deleted: false })
      │        └─► accounts.findFirst({ account_email: printer.email })
      │            └─► accounts.findFirst({ name: printer.name })
      ▼
bcrypt.compare(password, account.password)
      │
      ├─ valid ─► cookies().set("session", …) ─► { success: true, redirectPath, user }
      └─ invalid ─► { success: false, error: "Invalid email or password" }
```

Client side: `LoginPageClient.tsx:26-44` calls the action, then
`router.push(result.redirectPath)` (`:35`). **No progressive enhancement** — no
`<form action={…}>`, so the form does nothing without JS.

### 3.2 Contract

```ts
export async function loginAction(email: string, password: string)
```

| Outcome | Shape |
|---|---|
| Success | `{ success: true, redirectPath: string, user: { id, name, email, role } }` |
| Bad credentials / not found / wrong password | `{ success: false, error: "Invalid email or password" }` |
| Thrown | `{ success: false, error: "An unexpected error occurred" }` (after `console.error("Login error:", error)`) |

All three failure modes return the **same message** — no user enumeration.

### 3.3 Notable details

- **Step 3 is a legacy fallback.** Printers historically existed only in the `printer` table;
  matching by `printer.email` then by `printer.name` lets them log in. This is how
  `/printer_full` accounts work.
- `account_status: true` is checked, so a deactivated account cannot log in — **but an existing
  session cookie for that account keeps working**, because `getCurrentSession()` doesn't re-check.
- **`accounts.account_email` has no unique index** (only `unique_identification_code` on `books`
  and `book_sku` do), so duplicate emails resolve to whichever row MySQL returns first.
- No rate limiting, no lockout, no failed-attempt tracking.
- `src/app/page.tsx` passes `DATABASE_URL` into `LoginPageClient` as a prop, which serializes the
  raw connection string into the browser payload. It is never displayed but it is on the wire.

### 3.4 Password storage

| Operation | Implementation |
|---|---|
| Hash | `bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS \|\| "10"))` |
| Verify | `bcrypt.compare(password, account.password)` |
| Where hashing happens | `settings/accounts/add_account/actions.ts:26`, `settings/accounts/[id]/actions.ts:8`, and all 5 `*/profile/actions.ts` |

Salt rounds default to **10** (`BCRYPT_SALT_ROUNDS` is optional).

---

## 4. Logout

```ts
// src/app/actions/auth-actions.ts:111
export async function logoutAction() {
  (await cookies()).delete("session");
  return { success: true; }        // ← actual code returns { success: true }
}
```

- No auth check — returns success unconditionally.
- Called from 5 `ProfileClient.tsx` copies and `UserMenu.tsx:45`.
- `UserMenu` shows a confirm `AlertDialog`, then `router.push("/")` + `router.refresh()`.
- Because there is no server-side session, logout is purely "delete the browser cookie".

---

## 5. Roles

### 5.1 The two role maps have diverged

**`getRedirectPath()` — `auth-actions.ts:7`** (used on login):

| `account_type` | redirect to | route exists? |
|---|---|---|
| `ADMIN` | `/admin_dashboard` | ✅ |
| `Operations Manager` | `/operation_manager_full_dashboard` | ✅ |
| `Inventory Manager` | `/inventory_manager_dashboard` | ✅ |
| `Finance Officer` | `/finance_officer_dashboard` | ✅ |
| `Sales Staff` | `/sales_staff_dashboard` | ❌ **404** |
| `Delivery and Sales Management` | `/delivery_and_sales_dashboard` | ❌ **404** |
| `Delivery Sample` | `/delivery_sample_dashboard` | ❌ **404** |
| `Printer` | `/printer_full` | ✅ |
| `Viewer` | `/viewer_dashboard` | ✅ |
| `Delivery Account` | `/delivery_dashboard_full` | ✅ |
| *anything else* | `/admin_dashboard` | |

**`rolePathMap` — `middleware.ts:55-62`** has only **6** entries: `ADMIN`,
`Operations Manager`, `Inventory Manager`, `Finance Officer`, `Viewer`, `Delivery Account`.
It is **duplicated a second time inside the same file** at lines 114-121 for the `/` redirect.

**Consequences:**
- A `Printer` logs in → correctly redirected to `/printer_full` → but middleware's
  `rolePathMap[role]` is `undefined` → `allowedPath = "/admin_dashboard"`. The printer is *not*
  blocked from `/printer_full` (that check only fires for paths starting with another
  dashboard's root), so it works — but the role is not actually modelled in middleware.
- `Sales Staff`, `Delivery and Sales Management`, and `Delivery Sample` accounts log in to a
  **404**.
- `notification_to` enum has 8 values (`ADMIN, FINANCE, OPERATION_MANAGER, DATA_VIEWER,
  DELIVERY_AND_SALES, INVENTORY_MANAGER, RETAIL_MANAGER, PRINTER`) which use **different**
  strings again (`FINANCE` ≠ `"Finance Officer"`). Notifications for `FINANCE` are never shown to
  the Finance Officer's own dashboard unless it queries by `accountId`.

### 5.2 Roles in use vs. dashboard roots

| `account_type` | Dashboard root | Layout | Sidebar | Menu-managed? |
|---|---|---|---|---|
| `ADMIN` | `/admin_dashboard` | ✅ | `admin_sideboard.tsx` | ❌ hard-coded |
| `Operations Manager` | `/operation_manager_full_dashboard` | ✅ | `OperationManagerFullSidebar` | ✅ |
| `Inventory Manager` | `/inventory_manager_dashboard` | ✅ | `generic_sideboard` | ✅ |
| `Finance Officer` | `/finance_officer_dashboard` | ✅ | `finance_officer_sideboard` | ✅ |
| `Viewer` | `/viewer_dashboard` | ✅ | `ViewerSidebar` | ✅ |
| `Delivery Account` | `/delivery_dashboard_full` | ✅ | `DeliverSidebar` | ❌ hard-coded |
| `Printer` | `/printer_full` | ✅ | `PrinterFullSidebar` | ❌ hard-coded |

---

## 6. Middleware — `src/middleware.ts`

```ts
export const runtime = 'nodejs';   // required — the file imports @/lib/prisma
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

`runtime: 'nodejs'` is mandatory because `getEnabledMenuNames()` queries Prisma. This means the
middleware opens a DB connection on essentially every request.

### 6.1 The gates, in order

| # | Line | Condition | Action |
|---|---|---|---|
| **0** | 43 | `isPublicPath = pathname === "/" \|\| startsWith("/_next") \|\| startsWith("/api") \|\| pathname.includes(".")` | bypass everything below |
| **1** | 45-47 | no `session` cookie && not public | `redirect("/")` |
| **2** | 50-83 | `session` && not public | **cross-dashboard rewrite** — if the path starts with another role's dashboard root, string-replace the prefix with the caller's own root and redirect. `/admin_dashboard/books` → `/viewer_dashboard/books` |
| **3** | 86-101 | path under a managed dashboard root | resolve the menu name; if not `alwaysOn` and not enabled → **`new NextResponse("Not Found", { status: 404 })`** |
| **4** | 102-105 | `JSON.parse(session.value)` throws | `redirect("/")` |
| **5** | 109-128 | `session` && `pathname === "/"` | redirect to the role's dashboard root |

**Gate 2 is a rewrite, not a block.** A Viewer typing `/admin_dashboard/finance/books` is
redirected to `/viewer_dashboard/finance/books` — which doesn't exist, so they get a 404 from
the router. But `/admin_dashboard/books` → `/viewer_dashboard/books` **works**, because that
route exists. The security model relies on the destination not existing, not on an explicit deny.

### 6.2 Gate 0 is broader than it looks

```ts
const isPublicPath = … || pathname.includes(".");
```

**Any path containing a literal dot is public.** `/admin_dashboard/books/1.5/edit` would skip
authentication entirely. In practice no such route exists, but the rule is too permissive.

Combined with the matcher excluding `api`, **`/api/*` is fully unauthenticated** — see
[`03-api-layer.md` §3](./03-api-layer.md).

### 6.3 The menu cache

```ts
const menuCache = new Map<string, { enabled: Set<string>; fetchedAt: number }>();
const CACHE_TTL_MS = 10_000;

async function getEnabledMenuNames(accountType: string): Promise<Set<string>> { … }
```
- Query: `(prisma as any).menu_management.findMany({ where: { account_type, is_deleted: false }, include: { menus: true } })`
- 10-second in-process TTL, keyed by `accountType`.
- Comment: *"Cache enabled menu lookups to avoid a DB round-trip on every request."*
- In-process only — a serverless cold start loses it, and a menu toggle takes up to 10 s to take
  effect (plus the client must `router.refresh()`).

---

## 7. The menu on/off system

### 7.1 Source of truth

`src/lib/dashboard-menu-registry.ts` — `DASHBOARD_MENU_REGISTRY`, a `DashboardDef[]`:

```ts
interface DashboardMenuDef { name: string; paths: string[]; alwaysOn?: boolean }
interface DashboardDef {
  accountType: string;   // value used in menu_management.account_type
  roleKey: string;       // passed to getEnabledMenuNamesForRole
  rootPath: string;      // dashboard root, also the Home path
  menus: DashboardMenuDef[];
}
```

**Only 4 dashboards are managed** — Operations Manager (17 menus), Finance Officer (12),
Inventory Manager (10), Viewer (12). **Admin, Delivery and Printer sidebars are hard-coded and
cannot be toggled.**

Full contents:

| Dashboard | Menus |
|---|---|
| **Operations Manager** | Home `alwaysOn`, Notifications, Notes, Profile, Delivery Sample, Manage Orders, Books, Translators, Translation Work, Translation Books, Printers, Manage Printing, Books List, Delivery Records, Printing Info, Completed Deliveries, Pending Deliveries |
| **Finance Officer** | Home `alwaysOn`, Profile, Book Shop, Books, Shop Table, Edition Table, Costs, Printing, Round Info, Payments Due, Daily Report, Period Report |
| **Inventory Manager** | Home `alwaysOn`, Profile, Books (`/books` + `/statistics/books`), Book Shelf, Damaged Books, Production - Books, Low Stock, Manage Store, Store Options, Stores (`/statistics/stores`) |
| **Viewer** | Home `alwaysOn`, Profile, Books, Book Shelf, Statistics (`/statistics` + 3 subpaths), Stores, Book Shops, Completed Deliveries, Pending Deliveries, Translators, Translation Work, Printing Info |

### 7.2 Path → menu resolution

```ts
// src/lib/dashboard-menu-registry.ts:119
export function getMenuNameForPath(dashboard: DashboardDef, pathname: string): string | null
```
Longest-prefix wins, so `/books/shelf` → `"Book Shelf"` (not `"Books"`). Matching is
`pathname === prefix || pathname.startsWith(prefix + "/")`, and `paths: [""]` matches only the
exact root.

⚠️ **A path not covered by any entry returns `null`, and `null` means "allow".** New routes must
be added to the registry or middleware will not protect them — but they also won't 404, so this
fails open by design.

### 7.3 The two role vocabularies

| Function | Takes | Example |
|---|---|---|
| `getEnabledMenuNamesForRole(role)` | **role key** | `"finance_officer"` |
| `saveMenuAssignments(accountType, menuIds)` | **account type** | `"Finance Officer"` |

The bridge is `ROLE_TO_ACCOUNT_TYPE` at `menu-actions.ts:54-59`:

```ts
const ROLE_TO_ACCOUNT_TYPE: Record<string, string> = {
  finance_officer: "Finance Officer",
  inventory_manager: "Inventory Manager",
  operation_manager: "Operations Manager",
  viewer: "Viewer",
};
```

### 7.4 Client-side enforcement

Each sidebar fetches its enabled menu list on mount and filters its hard-coded item list:

```ts
// src/components/sidebar_components/generic_sideboard.tsx:99-108
useEffect(() => {
  const res = await getEnabledMenuNamesForRole(role);
  setEnabled(res.data);
}, [role]);
```

The sidebars are:
| Sidebar | How it filters |
|---|---|
| `sidebar_components/generic_sideboard.tsx` | `role` prop; used by Inventory |
| `sidebar_components/finance_officer_sideboard.tsx` | hard-coded `finance_officer` |
| `operation_manager_full_dashboard_components/OperationManagerFullSidebar.tsx` | hard-coded `operation_manager` |
| `viewer_dashboard_components/ViewerSidebar.tsx` | hard-coded `viewer` |
| `sidebar_components/admin_sideboard.tsx` | **no filtering** — all items always shown |

Menu state lives in `menu_management` rows. `saveMenuAssignments` soft-deletes unwanted rows
rather than deleting them, and `seedDashboardMenus()` turns everything back on.

---

## 8. Fine-grained permissions

### 8.1 The tables

```
accounts ──┬── roles ──── roletypes
           │  (accountId,   (rolename @unique,
            roletypeId,     role_detail)
            role_status)
```

`roles.role_status` is the on/off flag. A permission is granted when
`roletypes.rolename = <name>` AND a `roles` row exists for this account with `role_status: true`.

### 8.2 The only checker

```ts
// src/app/actions/book-shop-actions.ts:7
export async function checkCurrentUserRole(roleName: string) {
  const session = await getCurrentSession();
  if (!session?.id) return { success: true, enabled: false };
  if (session.role === "ADMIN") return { success: true, enabled: true };   // ADMIN bypasses everything
  try {
    const roletype = await (prisma as any).roletypes.findFirst({ where: { rolename: roleName, is_deleted: false } });
    if (!roletype) return { success: true, enabled: false };
    const role = await (prisma as any).roles.findFirst({ where: { accountId: session.id, roletypeId: roletype.id, is_deleted: false } });
    return { success: true, enabled: role?.role_status === true };
  } catch { return { success: false, enabled: false, error: "Failed to check role." }; }
}
```

Key properties:
- **`ADMIN` always returns `enabled: true`** — the bypass is first, before any DB lookup.
- A missing permission name returns `{ success: true, enabled: false }` — **not** an error.
- It lives in `book-shop-actions.ts`, so every other module imports it from there.

### 8.3 The 48 seeded permissions

`src/lib/seed.ts` — `roleTypes` array (48 entries):

| Group | Permissions |
|---|---|
| Books (4) | Viewing Books, Editing Books, Adding Books, Deleting Books |
| Stores (4) | Adding Stores, Viewing Stores, Editing Stores, Deleting Stores |
| Damaged books (4) | Add DamagedBooks, Delete DamagedBooks, Edit DamagedBooks, View DamagedBooks |
| Book shops (4) | Adding BookShop, Viewing BookShops, Editing BookShops, Deleting BookShops |
| Money (2) | Record Payment, Create Check |
| Printers (3) | Register Printer, Edit Printers, Delete Printer |
| Contracts (4) | Viewing / Editing / Creating / Deleting Contract Documents |
| Print agreements (4) | Viewing / Editing / Creating / Deleting Print Agreements |
| Delivery notes (4) | Creating / Editing / Viewing / Deleting Delivery Notes |
| Invoices (4) | Creating / Viewing / Editing / Deleting Invoice Document |
| Approval documents (4) | Creating / Editing / Viewing / Deleting Approval Document |
| Notes (4) | Creating / Viewing / Updating / Deleting Notes |
| Profile (2) | Editing Profile, Editing Password |

### 8.4 Where permissions are actually enforced

**Only 10 server actions use `checkCurrentUserRole`:**

| Action | Permission | File:line |
|---|---|---|
| `createBook` | `Adding Books` | `book-actions.ts:54` |
| `updateBook` | `Editing Books` | `book-actions.ts:242` |
| `reorderBooks` | `Editing Books` | `book-actions.ts:286` |
| `deleteBook` | `Deleting Books` | `book-actions.ts:315` |
| `createBookShop` | `Adding BookShop` | `book-shop-actions.ts:38` |
| `updateBookShop` | `Editing BookShops` | `book-shop-actions.ts:62` |
| `updateShopPreviousDebt` | `Editing BookShops` | `book-shop-actions.ts:87` |
| `deleteBookShop` | `Deleting BookShops` | `book-shop-actions.ts:105` |
| `createStore` | `Adding Stores` | `store-actions.ts:9` |
| `updateStore` | `Editing Stores` | `store-actions.ts:36` |
| `deleteStore` | `Deleting Stores` | `store-actions.ts:60` |

**38 of the 48 permissions are never checked by any code.** Only 10 are wired up.

### 8.5 The page-level gate

11 server `page.tsx` files render an inline "Access Denied" card rather than redirecting:

```tsx
// src/app/admin_dashboard/books/page.tsx:10-20
const permission = await checkCurrentUserRole("Viewing Books");
if (!permission.enabled) {
  return (
    <div>
      <h2 className="text-2xl font-black text-destructive uppercase tracking-tight mb-2">Access Denied</h2>
      <p className="text-muted-foreground">You do not have permission to view books.</p>
    </div>
  );
}
```

Gated pages: `admin_dashboard/books`, `books/[id]`, `books/settings`, `books/add_book`,
`book_shops`, `stores`, `stores/[id]`, `stores/add_stores`.

⚠️ **This is UI-only.** The gate hides the page; the underlying action (`getBooks`,
`getBookShops`, `getStores`) has no permission check, so the data is still reachable by calling
the action directly.

### 8.6 ⚠️ Five call sites use permission names that don't exist

These pass snake_case identifiers, but the `roletypes` table uses Title Case. Since a missing
roletype returns `{ enabled: false }`, **these UI gates always deny for every non-ADMIN user**:

| Call site | Passed name | Actual roletype name |
|---|---|---|
| `admin_dashboard/books/damaged/ReportDamageButton.tsx:73` | `"adding_damaged_books"` | `Add DamagedBooks` |
| `admin_dashboard/books/editions/[id]/StoreInventoryTable.tsx:82` | `"adding_stores"` | `Adding Stores` |
| `admin_dashboard/book_shops/BookShopManagement.tsx:59` | `"adding_book_store"` | `Adding BookShop` |
| `admin_dashboard/checks/CreateCheckButton.tsx:34` | `"adding_checks"` | `Create Check` |
| `book_details/ShopDistributionList.tsx:150` **× 4 copies** | `"adding_edition"` | *(no such permission at all)* |

### 8.7 Account creation auto-grants

`addAccountAction` (`settings/accounts/add_account/actions.ts`) creates the account, then reads
**every** `roletypes` row and creates a `roles` grant for all of them with:

```ts
role_status: viewingPermissions.has(rt.rolename)
```

where `viewingPermissions` is a fixed set of **8 view-only permissions**:

```
"Viewing Books", "Viewing Stores", "Viewing BookShops", "Record Payment",
"Viewing Contract Documents", "Viewing Print Agreements", "Viewing Delivery Notes",
"Viewing Invoice Document", "Viewing Approval Document", "Viewing Notes"
```

(10 strings in the array.) Every other permission starts at `role_status: false`.

The admin grants the rest by hand in **Settings → Accounts → [account]**, via
`toggleRoleAction(accountId, roleName, enabled)`:
- `roletypes.findFirst({ rolename })` → if missing, `roles.create`
- else `roles.findFirst({ accountId, roletypeId })` → `roles.update({ role_status: enabled })`

`checkRoleAction(accountId, roleName)` reads the current flag for the toggle UI.

⚠️ **None of the five account-management actions has an auth guard.** See
[`03-api-layer.md` §5.20](./03-api-layer.md).

---

## 9. Printer identity

`/printer_full` does not use a permission table. It resolves the printer from the session email:

```ts
// src/app/actions/printer-full-actions.ts:6
export async function getPrinterForSessionFull() {
  const session = await getCurrentSession();
  if (!session?.email) return null;
  return (prisma as any).printer.findFirst({ where: { email: session.email, is_deleted: false }, … });
}
```

Pages then `notFound()` when it returns null:
```tsx
// src/app/printer_full/page.tsx:9-12
const printer = await getPrinterForSessionFull();
if (!printer) notFound();
```

Two more printer-scoped actions exist but **trust the caller-supplied id** rather than deriving
it from the session:

- `getPrinterDeliveries(printerId)` — returns delivery records for any printer
- `approveDelivery(deliveryId, printerId)` — has an ownership check
  (`"Access denied - this delivery does not belong to your printer"`), but it checks against the
  `printerId` **argument**, not the session

---

## 10. Where auth is *not* checked

Summary only — full detail in [`03-api-layer.md` §4](./03-api-layer.md).

| Layer | Coverage |
|---|---|
| Server actions with a role gate | 6 (`approveOrder`, `removeBookFromOrder`, `removeBooksFromOrder`, `deleteOrder`, `getLocalBackups`, `createLocalBackup`) |
| Server actions with a session-presence check | ~25 |
| Server actions with a `checkCurrentUserRole` check | 11 |
| **Server actions with no auth at all** | **~200 across 30 modules** |
| Route handlers with auth | **0 of 3** |
| Server pages with an inline Access Denied gate | 11 |
| Server pages relying on middleware only | ~174 |

The modules with **no auth whatsoever**, including writes:

```
print-order-actions.ts      edition-actions.ts         store-inventory-actions.ts
transfer-actions.ts         damaged-book-actions.ts    book-shop-edition-actions.ts
book-actions.ts (2 fns)     order-actions.ts (4 fns)   menu-actions.ts
menu-seed-actions.ts        settings/accounts/*        check-actions.ts (2 fns)
contract / invoice / delivery-note / print-agreement / approval-document actions
admin + delivery round-books actions                     settings-actions.ts
printer-actions.ts          statistics / dashboard-stats / reports
translation-project-actions.ts   translator-actions.ts
```

---

## 11. Risk table

| Risk | Location | Impact |
|---|---|---|
| Unsigned session cookie | `auth-actions.ts:89` | Anyone who can set the `session` cookie claims any role; middleware trusts `role` verbatim |
| No server-side sessions | `getCurrentSession()` | Deleting or deactivating an account does **not** revoke its live session |
| No sliding expiry | `maxAge: 7d`, never refreshed | Forced logout after 7 days regardless of activity |
| `pathname.includes(".")` marks a path public | `middleware.ts:43` | Any dotted URL bypasses auth entirely |
| `/api` excluded from the matcher | `middleware.ts:142` | Full edition catalogue readable; unauthenticated arbitrary file upload to a public bucket |
| 3 roles redirect to non-existent routes | `auth-actions.ts:13-15` | `Sales Staff`, `Delivery and Sales Management`, `Delivery Sample` log in to a 404 |
| `rolePathMap` duplicated + missing `Printer` | `middleware.ts:55-62`, `114-121` | Printer not modelled in middleware; edits to one copy miss the other |
| Gate 2 rewrites instead of blocking | `middleware.ts:72-83` | Relies on the destination not existing rather than an explicit deny |
| Menu lookup fails open | `getMenuNameForPath` returns `null` → allow | Unregistered routes are unprotected by the menu system |
| 38 of 48 permissions unused | §8.3 vs §8.4 | The permission UI implies control that doesn't exist |
| 5 call sites pass non-existent permission names | §8.6 | Those UI buttons never appear for non-ADMIN users |
| Account actions have no auth | `settings/accounts/*/actions.ts` | Password reset / account creation / role grant for any account id |
| `changePasswordAction(userId, …)` trusts the argument | 5 `profile/actions.ts` | Cross-account password change |
| `getPrinterDeliveries(printerId)` trusts the argument | `printer-delivery-actions.ts:11` | Reads another printer's deliveries |
| No `AUTH_SECRET` anywhere | `.env` | Nothing exists to sign with; hardening requires adding one |
| Middleware opens a DB connection per request | `middleware.ts:3,10` | Latency + connection pressure app-wide |
| Login has no rate limiting | `loginAction` | Unbounded brute force |
| `DATABASE_URL` serialized to the client | `app/page.tsx:9-15` | Connection string in the browser payload |
| `notification_to` enum strings ≠ `account_type` strings | schema vs `auth-actions.ts` | `FINANCE`, `DATA_VIEWER`, `RETAIL_MANAGER` notifications don't reach the matching dashboard |
| Menu cache is in-process, 10 s TTL | `middleware.ts:13` | Toggles take up to 10 s; lost on cold start |

---

_Last reviewed: 2026-10-14._