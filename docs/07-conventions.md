# 07 — Conventions

> **Scope:** naming, error handling, and the patterns to follow when adding features.
> This is the document to read before your first contribution.

---

## 1. The short version

This codebase has **strong implicit conventions and no enforced ones**. There is no ESLint
naming rule, no import-boundary lint, no Prettier config, no Husky hooks, and no CI. The
conventions below were derived by reading 562 files — follow them, because consistency is the
only review signal reviewers have.

**The single most important thing to know:**

> Server-action getters are plain exported async functions. They are called **as normal
> functions from server components** (`await getBooks()`) and **as RPC from client components**
> (`await getBooks()` after hydration). This dual use is why most actions have no `read`/`write`
> prefix, why getters live next to mutations in the same file, and why there is no API layer.

---

## 2. Naming

### 2.1 Files

| Entity | Convention | Example | Count |
|---|---|---|---|
| **Server actions** | kebab-case + `-actions.ts` | `order-actions.ts` | 36 |
| **Co-located actions** | bare `actions.ts` in the route folder | `round-books/actions.ts` | 10 |
| **Read-only action modules** | `get-*.ts` or `dashboard-stats.ts` | `get-books.ts`, `get-daily-report.ts` | 5 |
| **Components** | PascalCase + `.tsx` | `BooksTable.tsx` | 258 |
| **Client components** | `*Client.tsx` suffix | `StoreDetailsClient.tsx` | 39 |
| **shadcn primitives** | kebab-case | `alert-dialog.tsx` | 28 |
| **lib modules** | kebab-case | `calendar-utils.ts`, `printer-utils.ts` | 18 |
| **Validation schemas** | kebab-case + `-schema.ts` in `lib/validation/` | `book-schema.ts` | 4 |
| **Hooks / stores** | `use-*.ts` | `use-sidebar-store.ts` | 3 |

**Folders** are snake_case **or** kebab-case, mixed freely:

| Style | Examples |
|---|---|
| snake_case (50) | `admin_dashboard`, `manage_orders`, `manage_payment`, `document_management`, `retail_management`, `activity_log`, `book_details` |
| kebab-case (37) | `round-books`, `payments-due`, `low-stock`, `delivery-records`, `translation-work`, `books-in-collective` |
| single word (108) | `books`, `stores`, `printing`, `production`, `profile` |

**Do not "fix" these.** Renaming a route folder breaks bookmarks, `revalidatePath` targets and
every cross-dashboard import. Match whatever the sibling routes in the same dashboard do.

### 2.2 Component suffixes — use these

| Suffix | Count | Means | Example |
|---|---|---|---|
| `*Table.tsx` | 70 | A list rendered with shadcn `Table` | `BooksTable.tsx` |
| `*Modal.tsx` | 17 | Full-screen overlay for a task | `AddOrderModal.tsx` |
| `*Dialog.tsx` | 12 | Small confirmation / option overlay | `RoundDetailDialog.tsx` |
| `*Form.tsx` | 5 | A react-hook-form + zod form | `AddBookForm.tsx` |
| `*Button.tsx` | 9 | A button that opens a drawer/dialog | `CreatePrintOrderButton.tsx` |
| `*Client.tsx` | 39 | The client half of a server page | `DebtBreakdownClient.tsx` |
| `*Content.tsx` | 9 | A page body (server or client) | `ManageOrdersPageContent.tsx` |
| `*Info.tsx` | 14 | A tab/section of a detail page | `EditionsInfo.tsx` |
| `*List.tsx` | 11 | A list (delivery dashboard's convention) | `OrdersList.tsx` |
| `*View.tsx` | 4 | A composed read-only view | `DeliveryRecordsView.tsx` |

Note the **delivery dashboard drops the `Client` suffix entirely** (`RoundBookDetail.tsx`,
`BooksList.tsx`) while admin/inventory/ops/viewer use it. Follow the tree you're editing.

### 2.3 Functions

| Kind | Convention | Example |
|---|---|---|
| Read | `get<Thing>` / `get<Things>` / `search<Things>` | `getBooks`, `getShopTotalDebt`, `searchBooks` |
| Read (aggregate) | `get<Domain>Stats` | `getInventoryStats`, `getFinanceStats` |
| Create | `create<Thing>` | `createOrder`, `createPayment` |
| Update (whole) | `update<Thing>` | `updateBook`, `updateOrder` |
| Update (partial) | `set<Thing><Field>` or `update<Thing><Field>` | `setOrderHideRemaining`, `updatePaymentMemo` |
| Update (toggle) | `toggle<Thing><Aspect>` | `toggleEditionVisibilityToPrinter` |
| Update (single cell) | `update<Thing>Field` | `updateEditionField` |
| Delete | `delete<Thing>` | `deleteBook`, `deleteOrder` |
| Approval | `approve<Thing>` / `mark<Thing><State>` | `approveOrder`, `markOrderDelivered` |
| Auth | `check*` / `is*` | `checkCurrentUserRole`, `checkIsAdminUser` |
| Session | `getCurrentSession` | — |
| UI-only props | `dashboardRoot`, `basePath`, `className` | in the 5 `ProfileClient.tsx` copies |

### 2.4 Types

- **No shared domain type layer.** `src/types/` holds only `ethiopian-date.d.ts` (an ambient
  module declaration for a package with no types).
- Every table component declares its **own local `interface`/`type`** for its rows, and the
  server page hands them over with `as never[]` or `as any[]`.
- Prisma return types are avoided entirely via `(prisma as any).<model>`.
- Two shared result types exist: `ShopDebtData` (exported from `order-actions.ts:100`) and
  `TopSellerRow` / `TopSellersResult` (`top-sellers-actions.ts:6`).

```tsx
// src/app/admin_dashboard/books/page.tsx — the canonical handoff
const response = await getBooks();
const books = response.success ? response.data : [];

// src/components/admin_dashboard_components/BooksTable.tsx:1
"use client";
interface BookRow { id: number; title: string; /* … */ }
export default function BooksTable({ data }: { data: BookRow[] }) { … }
```

**When adding a feature, follow this.** Extracting a real shared type is an improvement, not a
violation — but it will touch 100+ files if done globally, so scope it to your feature.

### 2.5 Imports

| Kind | Convention | Count |
|---|---|---|
| Cross-module | `@/...` alias | 1,242 |
| npm | bare package name | 1,226 |
| Local sibling | relative `./` or `../` | 617 |

⚠️ **Prisma is imported inconsistently:** 100× via `@/lib/prisma`, 28× via a relative
`../../../../lib/prisma`. Use the alias. The relative ones are all `books/[id]` and
`stores/[id]` detail pages.

---

## 3. Error handling

### 3.1 Server actions — always return, never throw

The universal shape. **Actions never throw to the client**; `Error`s thrown inside a
`$transaction` callback are caught by the outer `try` and returned as `error`.

```ts
try {
  // …work…
  return { success: true, data };
} catch (error: any) {
  console.error("Human-readable context:", error);
  return { success: false, error: error?.message || "Failed to do the thing" };
}
```

**Three failure styles, in descending order of frequency:**

| Style | Example |
|---|---|
| Static literal — preferred | `error: "Failed to fetch orders"` |
| Template with runtime values | `` error: `Cannot assign ${qty} units. Only ${rem} remaining.` `` |
| Raw passthrough — avoid | `error: error.message \|\| "…"` leaks Prisma internals |

⚠️ ~15 actions leak `error.message` verbatim. **Don't copy that.** Use a static or template
message and let the `console.error` carry the detail.

### 3.2 Client components — branch on `success`

```tsx
const result = await createBook(formData);
if (result.success) {
  toast.success("Book added successfully!");
  reset();
  router.push(`${dashboardRoot}/books`);
  router.refresh();
} else {
  toast.error(result.error || "Failed to add book. Please try again.");
}
```

Observed counts: `toast.error` **605**, `toast.success` **232**. Failure messaging is the
dominant pattern — keep it.

### 3.3 Console usage

| Call | Count | Use |
|---|---|---|
| `console.error` | 196 | ✅ Every action's `catch` |
| `console.log` | **12** | ⚠️ Stray debug output (e.g. `translation-project-actions.ts:99,111` logs **full payloads**) |
| `console.warn` | 5 | The `recordPrinterDeliveries` no-printer bail-out |

Don't add `console.log`. The existing 12 are bugs, not precedent.

### 3.4 Validation

Four actions validate with zod on create, and **none validate on update**:

| Action | Schema | On update? |
|---|---|---|
| `createBook` | `bookSchema` | `updateBook` — ❌ none |
| `createStore` | `storeSchema` | `updateStore` — ❌ none |
| `createTranslator` | `translatorSchema` | n/a |
| `createTranslationProject` | `translationProjectSchema` | `updateTranslationProject` — ❌ none |

The 5 document modules (`contract`, `invoice`, `delivery-note`, `print-agreement`,
`approval-document`) each define an **inline zod schema at the top of the action file**, call
`.parse()` **inside** the `try`, and spread `Partial<Input>` verbatim on update.

If you add a form, the expected pattern is react-hook-form + zod in the **client** component,
and — if you want server-side enforcement — a second `safeParse` in the action. Most actions
don't, which is why the schema files are under-used.

### 3.5 What is never done

| Never | Notes |
|---|---|
| Custom error classes | None exist |
| Result/discriminated-union types | No `ActionResult<T>` anywhere |
| React error boundaries | **0 `error.tsx`**, 0 `global-error.tsx` |
| `loading.tsx` | **0 exist** |
| Global `<Toaster/>` per dashboard | One instance in `src/app/layout.tsx:70` |
| Server-side logging service | Console only |

---

## 4. Style

### 4.1 Formatting

**No Prettier config.** Formatting is whatever the file was written with:

| Aspect | Reality |
|---|---|
| Indent | 2 spaces (4 in `check-actions.ts`) |
| Quotes | Double (`'...'` in `check-actions.ts`) |
| Semicolons | Present in most files; **3 action files omit the `;` on line 1**: `check-actions.ts`, `printer-actions.ts`, `printer-inventory-actions.ts` |
| Trailing commas | Inconsistent |

Match the file you are editing.

### 4.2 Styling tokens — heavy, opinionated, consistent

| Token | Occurrences | Meaning |
|---|---|---|
| `font-black` | **5,307** | The default weight. Bold headings/buttons. |
| `uppercase` | 4,571 | Labels, table headers, nav items |
| `tracking-widest` | 3,590 | Same |
| `rounded-xl` | 1,802 | The default corner radius |

Semantics: `text-primarycolor` (brand `#408A71`), `text-destructive` (errors),
`text-muted-foreground` (secondary), `bg-muted`/`bg-muted/50` (table stripes and panel fills),
`font-black uppercase tracking-widest` (the standard heading treatment).

**Copy the adjacent markup's classes** rather than inventing new ones. There is no design token
system beyond `globals.css` — consistency is maintained by copy-paste.

### 4.3 Component export style

| Category | Style | Count |
|---|---|---|
| UI components | **default export** | 203 |
| Server actions / lib utilities | **named exports** | 127 |
| Both | layouts + re-export shim pages | 79 |
| `index.ts` barrel files | **none anywhere in the repo** | 0 |

---

## 5. Database conventions

### 5.1 The model shape

```prisma
model X {
  id         Int      @id @default(autoincrement())
  // domain fields
  is_deleted Boolean  @default(false)
  updatedAt  DateTime             // ⚠️ no @updatedAt — set manually
  createdAt  DateTime  @default(now())
  deletedAt  DateTime  @default(now())   // ⚠️ meaningless
}
```

### 5.2 The five rules

1. **Filter `is_deleted: false` on every read**, including nested relations
   (`include: { bookedition: { where: { is_deleted: false } } }`).
2. **Set `updatedAt: new Date()` on every write.**
3. **Use `$transaction`** for anything touching more than one table.
4. **Never hard-delete** — set `is_deleted: true`. (Three exceptions: `deleteOrder` on
   `orders`, and the `deleteMany` calls inside it; `deletePrintOrderPayment`;
   `printorder_items.deleteMany` in `updatePrintOrder`.)
5. **Use `{ increment }` / `{ decrement }`** rather than read-modify-write JS arithmetic, so
   the operation stays atomic.

### 5.3 Transaction style

```ts
// Interactive — when you need tx threaded into a helper, or the body branches/loops
await prisma.$transaction(async (tx) => { … }, { timeout: 15000 });

// Array — when it's a fixed, non-conditional set of writes
await prisma.$transaction([
  prisma.bookeditionstores.update({ … }),
  prisma.bookedition.update({ … }),
], { timeout: 15000 });
```

Timeout is in milliseconds, **not seconds**. 15,000 = 15 s. The largest is `approveOrder` at
**180,000** (180 s).

### 5.4 Money

`Float` everywhere. Compute with `Math.round(...)` when writing a quantity to an int column
(`Math.round(Number(a.quantity))` in `approveOrder`). Set money to `null` to clear it, not `""`.

---

## 6. The refresh pattern

**`revalidatePath` is effectively a no-op in this app** — every route is `force-dynamic`, so
there is no cached render to invalidate. The 159 existing calls are cargo-culted ceremony.

**What actually works:**

```tsx
const result = await someAction(args);
if (result.success) {
  toast.success("Done");
  router.refresh();               // ← this
}
```

52 `router.refresh()` calls across 35 files. `router.push(path)` for navigation.
`router.replace(path, { scroll: false })` to push filter state into the URL.

**Add `revalidatePath` anyway** — it costs nothing and matches convention. Just don't rely on it.

The one place `revalidatePath(path, "layout")` matters is **menu toggling**, because the sidebar
lives in the layout.

---

## 7. Adding a feature — the full recipe

This is the sequence a change actually follows in this codebase.

### Step 1 — Server action

Add to `src/app/actions/<domain>-actions.ts` (or a new file if the domain is new).

```ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";

export async function doThing(data: { label: string; amount?: number }) {
  // 1. AUTH — pick a pattern deliberately.
  //    Most modules have none; that's a bug, not a licence.
  //      role gate:   if (!session || session.role !== "ADMIN") …
  //      session:     if (!session) …
  //      permission:  const p = await checkCurrentUserRole("Adding Books"); if (!p.enabled) …
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    // 2. VALIDATE (zod) — only 4 of 41 modules do this
    // 3. WRITE — updatedAt: new Date(); where: { is_deleted: false } on reads
    //    $transaction for multi-table writes
    const result = await (prisma as any).someModel.create({ data: { …, updatedAt: new Date() } });
    return { success: true, data: result };
  } catch (error) {
    console.error("DoThing:", error);
    return { success: false, error: "Failed to do the thing" };
  } finally {
    // 4. REValidate — inert but conventional
    revalidatePath("/admin_dashboard/the-section");
  }
}
```

### Step 2 — Server page

Add `page.tsx` under the dashboard(s) that need it.

```tsx
// src/app/admin_dashboard/the_section/page.tsx     ← SERVER component, no "use client"
import { getThings } from "@/app/actions/thing-actions";
import ThingsTable from "./ThingsTable";            // ← client leaf

export const dynamic = "force-dynamic";            // ← matches every sibling

export default async function Page() {
  const res = await getThings();
  const things = res.success ? res.data : [];
  return <ThingsTable data={things as never[]} />;  // ← note the cast
}
```

Use `Promise.all([...])` when there is more than one independent read.

### Step 3 — Client component

Next to the page.

```tsx
// src/app/admin_dashboard/the_section/ThingsTable.tsx
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ThingRow { id: number; label: string }   // local, per-file

export default function ThingsTable({ data }: { data: ThingRow[] }) {
  const router = useRouter();

  async function handleDelete(id: number) {
    const res = await deleteThing(id);
    if (res.success) { toast.success("Deleted"); router.refresh(); }
    else             { toast.error(res.error || "Failed to delete"); }
  }
  // …table markup using components/ui/{table,button,dialog,input}.tsx
}
```

### Step 4 — Register the menu

**Only if this is a new top-level section.** Without this, middleware may 404 the route.

1. Add the entry to `src/lib/dashboard-menu-registry.ts` under the right `DashboardDef`:
   ```ts
   { name: "The Section", paths: ["/the_section"] }
   ```
2. Add the icon/label to `src/lib/dashboard-menu-config.ts`.
3. Run `seedDashboardMenus()` from `menu-seed-actions.ts` (the "Seed Menus" button in
   Settings → Menu Management) to create the `menus` row and turn the assignment on.

Admin, Delivery and Printer sidebars are **hard-coded** — edit the sidebar component directly.

### Step 5 — Decide the duplication strategy

This is the biggest judgement call in the codebase:

| Strategy | When | Cost |
|---|---|---|
| **Copy the file** into the other dashboard | The feature differs per role (edit buttons, columns, permissions) | Drift is inevitable — already present in the 4× `EditionsInfo` set |
| **One-line re-export** | A role needs a *read-only* view of exactly what admin has | None — this is what all 11 finance pages do |
| **Lift to `src/components/`** | Two or more dashboards need it identically | Best outcome, rarely chosen — **prefer this** |

```tsx
// src/app/finance_officer_dashboard/books/page.tsx
export { default } from "@/app/admin_dashboard/finance/books/page";
```

If you lift to `src/components/`, remember `finance-nav.ts` exists to build hrefs that work from
both the admin and finance roots.

### Step 6 — Add `loading.tsx` if the page is slow

Nothing else provides one — there are zero `loading.tsx` files in the app. A slow page shows a
blank frame until the whole RSC payload resolves.

---

## 8. Code review checklist

Before you open a PR:

- [ ] `npx tsc --noEmit` is clean
- [ ] `npm run lint` run — remember `ignoreDuringBuilds: true` means CI won't catch it
- [ ] Server action has **an auth check** (the surrounding modules often don't — yours should)
- [ ] Every read filters `is_deleted: false`, **including nested includes**
- [ ] Every write sets `updatedAt: new Date()`
- [ ] Multi-table writes use `$transaction` with an **ms** timeout
- [ ] Errors are static or templated — **not** raw `error.message` passthrough
- [ ] No `console.log`; `console.error` in every `catch`
- [ ] Server page is a server component; interactivity is in a `"use client"` leaf
- [ ] New route added to `dashboard-menu-registry.ts` + seeded, if it's a menu section
- [ ] If copied to another dashboard, **the copy actually needs it**
- [ ] Money rounded where it lands in an int column

---

## 9. Things not to do

| Don't | Why |
|---|---|
| Edit `prisma/schema.prisma` | Protected by `AGENTS.md` |
| Run `prisma migrate dev/deploy/db push` | Migrations cover only 13 of 43 models — a fresh DB is broken |
| Run `git commit` / `git push` | Prohibited by `AGENTS.md` |
| Install or remove npm packages | Requires explicit permission |
| `new PrismaClient()` | Use `@/lib/prisma` |
| Use `deletedAt` to filter or report | It defaults to `now()` at creation and is never set on delete |
| Add a `login`/`logout` alternative | The session model is fixed and unsigned — see doc 04 |
| Rename a route folder | Breaks routes, `revalidatePath` targets, imports |
| "Fix" column typos in queries | `visiblitiy_to_printer`, `quantity_deliverd`, `price_per_peice`, `count_remning_for_transfer` are the real names |
| Introduce a barrel `index.ts` | Zero exist; imports are direct |
| Add `useActionState` / `<form action>` | Zero exist; the codebase is `onSubmit` + imperative `await` |
| Add `loading.tsx`/`error.tsx` | Actually fine and encouraged — there just aren't any yet |
| Add `AUTH_SECRET` / signing | Would be a security change — raise it with the user first |

---

## 10. Contributing workflow

### 10.1 Session context

`files-to-read/` is a session journal, not documentation. Per `AGENTS.md`:

1. Read the project folders
2. Read `files-to-read/session-context.md` for current state
3. Read the most recent file in `files-to-read/conversations/`
4. Reply **"This is a continued conversation"**

After meaningful work, add a new file to `files-to-read/conversations/YYYY-MM-DD-HH-MM-SS.md`
with: date, summary, decisions, files changed, blockers.

> ⚠️ **The most recent snapshot (`2026-10-14`) is accurate; older ones describe a schema that
> no longer matches** (several reference PostgreSQL and models that were later renamed). Trust
> the code and `docs/` over the older snapshots.

### 10.2 Commit style

```
311ac3a update
301b9bf new page added
8a2877c update: correcting the period report page of the delivery side
b10b3d4 update: cost display on the payment managment section updated
d278071 update: debt breakdown page created
```

Lowercase, single line, usually starting with `update:`. Not conventional-commit, not always
present. The working branch is `main`.

### 10.3 Before committing

```bash
npx tsc --noEmit     # must be clean
npm run lint         # 0 errors (warnings are tolerated — many pre-exist)
```

There is no test suite and no test runner configured.

---

## 11. Quick reference

| I want to… | Look here |
|---|---|
| Add a DB field or model | **Don't** — ask the user; `prisma/schema.prisma` is protected |
| Add a write operation | `src/app/actions/<domain>-actions.ts` |
| Add a read operation | Same file. Export a `get*` async function |
| Add a page | `<dashboard>/<section>/page.tsx` (server) + a client leaf beside it |
| Reuse a dialog / table / form | `src/components/ui/` |
| Make a field editable inline | `update<Thing>Field` with a whitelist |
| Hide a menu section | `admin_dashboard/settings/menus` — registry + seed |
| Grant someone a permission | `admin_dashboard/settings/accounts/[id]` |
| Add a role | `accounts.account_type` **+** `getRedirectPath` **+** `middleware.rolePathMap` (×2) **+** `dashboard-menu-registry.ts` |
| Change the brand colour | `admin_dashboard/settings/theme` → `settings-actions.ts` |
| Upload a file | `put()` from `@vercel/blob` with a `<prefix>/` |
| Format a date | `src/lib/calendar-utils.ts` (`formatDate`, …) — never raw `toLocaleDateString` |

---

_Last reviewed: 2026-10-14._