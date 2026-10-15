# 01 — Architecture

> **Scope:** folder structure, request flow, server vs. client components, rendering strategy.
> See also [`00-overview.md`](./00-overview.md).

---

## 1. The shape of the system

The app is a **single Next.js application with no separate backend**. There is no API server, no
GraphQL, no tRPC. Everything the browser can do goes through one of three doors:

| Door | Where | Used for |
|---|---|---|
| **Server Components** | `page.tsx` / `layout.tsx` that are not `"use client"` | Initial page data. Run on the server, render once, stream HTML. |
| **Server Actions** | 51 files with `"use server"` (41 in `src/app/actions/`, 10 co-located) | *Everything else* — both reads and writes. |
| **Route handlers** | 3 files in `src/app/api/*/route.ts` | Two unauthenticated Blob upload endpoints and one edition listing. |

There is **no `fetch()` anywhere in `src/`** — all data access is Prisma. This is a
*server-action-as-RPC* architecture: the same exported function is callable from a server
component (as a plain `await getBooks()`) and from a client component (as an RPC call that
round-trips to the server). That dual-use is the single most important thing to understand
about this codebase.

---

## 2. Folder structure

```
src/
├── middleware.ts                      # auth + role routing + menu on/off (runs on EVERY request)
├── app/
│   ├── layout.tsx                     # root: fonts, theme bootstrap script, <Toaster/>
│   ├── page.tsx                       # login page (server shell)
│   ├── LoginPageClient.tsx            #   └─ client login form
│   ├── not-found.tsx                  # global 404
│   ├── globals.css                    # Tailwind v4 theme tokens (@theme inline)
│   │
│   ├── actions/                       # 41 shared server-action modules (~9,700 LOC)
│   │   ├── order-actions.ts           #   1,436 LOC — the order engine
│   │   ├── print-order-actions.ts     #     598
│   │   ├── store-inventory-actions.ts #     517
│   │   ├── payment-actions.ts         #     423
│   │   ├── edition-actions.ts         #     369
│   │   ├── transfer-actions.ts        #     369
│   │   └── … 34 more (kebab-case, all `"use server"`)
│   │
│   ├── api/                           # 3 route handlers (unauthenticated — see §3)
│   │   ├── editions/route.ts
│   │   ├── upload-check-image/route.ts
│   │   └── upload-payment-image/route.ts
│   │
│   ├── admin_dashboard/               # 179 files — the superset app
│   ├── operation_manager_full_dashboard/
│   ├── inventory_manager_dashboard/
│   ├── finance_officer_dashboard/     # mostly 1-line re-exports of admin pages
│   ├── viewer_dashboard/
│   ├── delivery_dashboard_full/
│   └── printer_full/
│
├── components/
│   ├── ui/                            # 28 shadcn primitives
│   ├── sidebar_components/            # 3 sideboards (admin / finance / generic)
│   ├── admin_dashboard_components/    # + book_details/, home_dashboard/
│   ├── deliver_full_dashboard_components/
│   ├── printer_full_dashboard_components/
│   ├── form_components/                # 4 react-hook-form + zod forms
│   ├── {inventory,operation_manager_full,viewer}_dashboard_components/
│   ├── CalendarClientWrapper.tsx      # the calendar provider mount
│   └── CalendarToggle.tsx
│
├── lib/                               # 18 modules — no barrel index
│   ├── prisma.ts                      # PrismaClient singleton (globalThis cached)
│   ├── calendar-utils.ts              # Ethiopian ⇄ Gregorian formatting
│   ├── calendar-context.tsx           # the ONE "use client" file in lib/
│   ├── dashboard-menu-registry.ts     # menu on/off source of truth (read by middleware)
│   ├── dashboard-menu-config.ts       # icon/label catalogue for sidebars
│   ├── finance-nav.ts                 # admin ⇄ finance href builders
│   ├── printer-utils.ts               # client-safe printer attribution helpers
│   ├── printer-resolution.ts          # server-only Prisma-backed variant
│   ├── module-mapping.ts              # dynamic() import map
│   ├── utils.ts                       # cn()
│   └── validation/*.ts                # 4 zod schemas
│
├── store/                             # 2 zustand slices (use-sidebar-store, use-editions-store)
├── hooks/use-mobile.ts                # shadcn's useIsMobile
├── types/ethiopian-date.d.ts          # ambient types for the ethiopian-date package
└── generated/prisma/                  # COMMITTED Prisma client output (~62 MB)
```

**Sizing:** 562 files in `src/`, 526 TS/TSX files excluding the generated client, ~125k LOC.

### 2.1 Where things live — the decision rule

| If you are adding… | Put it in |
|---|---|
| A server action that multiple dashboards need | `src/app/actions/<domain>-actions.ts` |
| A server action only one route tree needs | `<route folder>/actions.ts` |
| A component used by one route | **in the route folder**, next to `page.tsx` |
| A component used by several routes of one dashboard | `src/components/<role>_dashboard_components/` |
| A component used by all dashboards | `src/components/` root or `src/components/ui/` |
| A reusable primitive | `src/components/ui/` (via shadcn CLI) |

### 2.2 Two competing action-file conventions

Both exist and both are in active use:

- `src/app/actions/<domain>-actions.ts` — 36 files (shared, kebab-case)
- `<route>/actions.ts` — 10 files (co-located)

The 10 co-located files are all dashboard-specific: five `profile/actions.ts` copies
(one per dashboard, three byte-identical), two `round-books/actions.ts` (admin vs. delivery),
and three account-management files under `admin_dashboard/settings/accounts/`.

### 2.3 Duplication is a deliberate (and costly) strategy

**~130 byte-identical files plus ~30 diverged forks — roughly 40% of the `.tsx` files are
copies of another file in the tree.** There is no shared-component abstraction layer for
dashboard code; instead the same table is copied per role.

The highest-risk forked sets (same name, **already diverged** — a fix must be applied 4×):

| Component | admin | inventory | ops | viewer |
|---|---|---|---|---|
| `book_details/EditionsInfo.tsx` | **1,072 L** | 1,048 | 1,048 | 1,048 |
| `book_details/ShopDistributionList.tsx` | 487 | 473 | 473 | 473 |
| `book_details/StoresList.tsx` | 212 | 185 | 185 | 185 |
| `book_details/TranslationInfo.tsx` | 275 | 242 | 242 | 242 |
| `books/[id]/EditableBookContent.tsx` | 422 | 422 | 422 | 422 |

Large single files that get copied: `ManageOrderDetailsModal.tsx` (admin 1,969 L vs. ops
1,936 L — 33 lines of drift), `CreatePrintOrderButton.tsx` (1,187 L), `PrintOrderDetailClient.tsx`
(1,357 L), `PrintingBooksListTable.tsx` (806 L).

The **opposite** strategy is used where a role only needs a read-only view: a one-line
re-export. Eleven `finance_officer_dashboard/*/page.tsx` files are literally
`export { default } from "@/app/admin_dashboard/finance/.../page"`. `src/lib/finance-nav.ts`
exists solely to build correct hrefs across those two roots.

**When you add a feature, decide deliberately:** copy-and-diverges (the dominant pattern),
re-export (for identical read-only views), or lift to `src/components/` (the correct pattern,
rarely used).

### 2.4 Naming conventions in practice

| Entity | Convention | Example | Count |
|---|---|---|---|
| Route folders | snake_case **or** kebab-case, mixed freely | `manage_orders` vs `round-books` | 50 snake / 37 kebab |
| Component files | PascalCase | `BooksTable.tsx`, `EditionsInfo.tsx` | 258 |
| Non-component modules | kebab-case | `src/app/actions/*.ts`, `src/lib/*.ts` | 67 |
| Client components | `*Client.tsx` suffix | `StoreDetailsClient.tsx` | 39 |
| Hooks/stores | `use-*.ts` | `use-sidebar-store.ts` | 3 |
| Server actions | `*-actions.ts` or `actions.ts` | `order-actions.ts` | 46 |
| Dynamic segments | `[id]`, `[roundId]`, `[shopId]` | | 38 folders |

Component suffix vocabulary is productive and consistent: `*Table.tsx` (70), `*Modal.tsx` (17),
`*Dialog.tsx` (12), `*Form.tsx` (5), `*Button.tsx` (9), `*Info.tsx` (14), `*Content.tsx` (9),
`*List.tsx` (11), `*View.tsx` (4).

**Known inconsistencies** (document them, don't "fix" them casually — renaming breaks routes):

- `admin_dashboard/` mixes all four styles across 22 route groups: `manage_orders` (snake) next
  to `round-books` (kebab) next to `low-stock` (kebab) next to `document_management` (snake).
- The same feature is named differently per dashboard: `manage_orders` (admin) vs
  `manage-orders` (ops); `reports/pending_deliveries` (admin) vs `reports/pending-deliveries`
  (ops, viewer); `production/translations/books` (admin) vs `production/translation-books` (ops).
- `components/sidebar_components/*_sideboard.tsx` is spelled *sideboard*, a different file family
  from the `*Sidebar.tsx` components in `*_dashboard_components/`.
- `components/deliver_full_dashboard_components/` (route folder is `delivery_dashboard_full`).
- `book_details/` is singular while its siblings `stores/`, `book_shops/` are plural.

### 2.5 Export style

- **UI components → default export.** `export default function BooksTable() {...}`
- **Server actions, lib utilities → named exports.** `export async function createOrder(...)`
- **Route files → default export** (Next.js requirement).
- Sidebars are the exception: `sidebar_components/*_sideboard.tsx` use named exports
  (`export function AdminAppSidebar`), `*_dashboard_components/*Sidebar.tsx` use default.
- **No `index.ts` barrel files anywhere in the repo.**

---

## 3. Request flow

```
Browser request
      │
      ▼
┌──────────────────────────────────────────────────────────────────┐
│  src/middleware.ts        (runtime = "nodejs", Prisma imported)  │
│                                                                  │
│  1. Read `session` cookie                                      │
│  2. No session + non-public path  → redirect "/"                  │
│  3. Session + other dashboard   → rewrite path prefix, redirect  │
│  4. Menu disabled for role      → 404 "Not Found"                │
│  5. Unparseable cookie          → redirect "/"                  │
│  6. Session + "/"               → redirect to role dashboard     │
│                                                                  │
│  Menu lookup cached 10 s in an in-process Map.                   │
│  Matcher: /((?!api|_next/static|_next/image|favicon.ico).*)      │
└──────────────────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────────────────────┐
│  app/layout.tsx        fonts · theme bootstrap script · <Toaster> │
│  └─ <dashboard>/layout.tsx                                       │
│       session = await getCurrentSession()                        │
│       <CalendarClientWrapper> → <SidebarProvider>               │
│         sidebar · header (SidebarTrigger, menu search,           │
│         calendar toggle, UserMenu) · {children}                 │
│       export const dynamic = "force-dynamic"                     │
└──────────────────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────────────────────┐
│  page.tsx (Server Component, async)                              │
│                                                                  │
│  Option A (dominant):  await getBooks(); await getTopSellers();  │
│        … then render <ClientTable data={…} />                    │
│  Option B:  await Promise.all([…]) for parallel reads            │
│  Option C:  raw prisma.<model>.findMany() + notFound()           │
│  Option D:  the page itself is "use client" (18 pages) — the     │
│        client fetches its own data on mount                      │
└──────────────────────────────────────────────────────────────────┘
      │
      ▼
HTML + RSC payload → browser hydrates the client components
      │
      ▼  user clicks / submits / changes a filter
┌──────────────────────────────────────────────────────────────────┐
│  client component → await someServerAction(args)                │
│        ├── returns { success, data }  → setState / toast         │
│        ├── returns { success, error }  → toast.error(...)         │
│        ├── revalidatePath("/some/route")   ← no-op here, see §6  │
│        └── router.refresh() / router.push(...)                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.1 Middleware specifics

```ts
export const runtime = 'nodejs';              // required — imports @/lib/prisma
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
```

- Because middleware imports Prisma, it **must** run on the Node runtime, not Edge, and it
  opens a DB connection. The 10-second `menuCache` (`Map<accountType, {enabled, fetchedAt}>`)
  is the only mitigation — see `src/middleware.ts:13-32`.
- `/api/*` is **excluded from the matcher**, so all three route handlers are unauthenticated.
  `GET /api/editions` returns every non-deleted edition to anyone; the two upload endpoints
  accept arbitrary `FormData` and push it to a public Blob bucket with no auth, size limit, or
  MIME check.
- Inside the handler, `pathname.includes('.')` marks a path public — any URL containing a
  literal dot bypasses auth entirely.
- `rolePathMap` appears **twice** in the file (lines 55-62 and 114-121) — keep them in sync
  if you edit one.

### 3.2 Layouts — no composition

There are exactly **8 `layout.tsx` files**: the root plus one per dashboard. There are **zero**
route groups `(group)`, zero parallel routes, zero intercepting routes, zero `template.tsx`, and
**zero nested layouts below a dashboard**. The hierarchy is flat:

```
app/layout.tsx → <dashboard>/layout.tsx → page.tsx
```

All seven dashboard layouts are near-identical and differ only in the sidebar component,
title, footer, and whether the header uses the `h-16/z-30` variant (Inventory, Finance) or the
sticky-`top-0/z-10` variant (Admin, Ops, Viewer, Delivery, Printer). Only Admin passes
`accountId` to its sidebar and renders `AdminMenuSearch`.

**No layout calls `redirect()`.** Auth enforcement is entirely middleware plus ad-hoc
`notFound()` inside pages. This means a dashboard can render with `session === null` if it is
reached in a way the middleware doesn't cover.

---

## 4. Server vs. client components

### 4.1 The census

| Metric | Count |
|---|---|
| Files in `src/` | 562 |
| `"use client"` | **262** (47%) — 160 in `app/`, 101 in `components/`, 1 in `lib/` |
| `"use server"` | **51** — 41 in `app/actions/`, 10 co-located |
| Client `page.tsx` files | **18** |
| Client `layout.tsx` files | **0** |
| Client `route.ts` files | **0** |

### 4.2 The convention

> **`page.tsx` = server (fetch + prop-drill) → co-located `*Client.tsx` / `*Table.tsx` = client (interactivity).**

The server page does the Prisma work and the client component does everything else.
Representative pairs:

| Server page | Client leaf |
|---|---|
| `admin_dashboard/books/page.tsx:22-45` — `await getBooks()` → `<BooksTable data={…}/>` | `components/admin_dashboard_components/BooksTable.tsx` |
| `admin_dashboard/stores/[id]/page.tsx:24-44` — raw `prisma.stores.findUnique`, `notFound()` | `StoreDetailsClient.tsx` |
| `printer_full/page.tsx:9-12` — `await getPrinterForSessionFull()`, `notFound()` | `PrinterFullHomeDashboard.tsx` |
| `admin_dashboard/manage_payment/[id]/debts-breakdown/page.tsx:12-91` — 3 sequential Prisma reads | `DebtBreakdownClient.tsx` |
| `admin_dashboard/printing/delivery-records/page.tsx:10-135` — `Promise.all` | `DeliveryRecordsView.tsx` + `AllDeliveryRecordsTable.tsx` |

### 4.3 The 18 exceptions (client `page.tsx` files)

These pages are `"use client"` from line 1 and fetch their own data on mount:

```
admin_dashboard/document_management/{approval_documents,contracts,delivery_notes,
                                      invoices,print_agreements}/{page.tsx,[id]/page.tsx}   (10)
admin_dashboard/finance/{daily-report,period-report}/page.tsx                               (2)
admin_dashboard/settings/accounts/add_account/page.tsx                                       (1)
admin_dashboard/settings/theme/page.tsx                                                      (1)
admin_dashboard/stores/options/page.tsx        (inventory copy also)                        (2)
delivery_dashboard_full/{daily-report,period-report}/page.tsx                                (2)
```

All of them are heavy interactive CRUD screens (TanStack Table + dialogs + form state). The
`DailyReportPage` and `PeriodReportPage` bodies are **duplicated** between admin and delivery
as a result.

`src/app/not-found.tsx` is also a client component because it calls `window.history.back()`.

### 4.4 Serialization rules in force

**A server page cannot pass Prisma objects to a client component.** The generated Prisma
types include `Decimal`, `BigInt`, and `Date`, none of which survive the RSC serialization
boundary. The codebase's workarounds, in order of frequency:

1. **Inline interfaces + `as never[]`** — `data={books as never[]}` then re-declare the shape
   in the client file. Used at almost every server→client hand-off.
2. **Inline interfaces + `as any[]`** — same idea, looser.
3. **Field-by-field prop drilling** for smaller payloads.
4. **JSON round-trip** in a few older files (`JSON.parse(JSON.stringify(x))`).

There is **no shared domain type layer**. `src/types/` contains exactly one file
(`ethiopian-date.d.ts`, an ambient module declaration). Every table declares its own row
interface locally, which is why the fork-and-divide duplication is survivable — and also why
schema changes must be chased through ~130 files.

### 4.5 Server-only code

Three `lib/` modules touch the database or `next/headers` but **none are marked with
`import "server-only"`** — protection is by convention only:

- `lib/prisma.ts`, `lib/printer-resolution.ts`, `lib/get-first-printer-name.ts` (Prisma)
- `lib/server-calendar.ts` (`next/headers`)

The safety net is structural: **zero `"use client"` files import Prisma, `next/headers`, or
any server-only module.** Verified across all 262 client files. If you add a Prisma import to
a client component, the build breaks — which is the intended guardrail.

Prisma is imported two ways, inconsistently: `@/lib/prisma` (66 files) and relative
`../../../../lib/prisma` (7 files, all `books/[id]` and `stores/[id]` detail pages). Prefer
the alias.

---

## 5. Data-fetching patterns

There are exactly four, and they appear in this order of prevalence.

### 5.1 Server component calls the getter directly (dominant)

Server-action getters are **plain exported async functions**, so a server component just
`await`s them. No `useActionState`, no indirection:

```tsx
// src/app/admin_dashboard/books/page.tsx
const response = await getBooks();                              // :22
const books = response.success ? response.data : [];            // :23
return <BooksTable data={books as never[]} />;
```

Same page can gate on permissions in the server component:

```tsx
// src/app/admin_dashboard/books/page.tsx:10
if (!(await checkCurrentUserRole("Viewing Books"))) {
  return <AccessDeniedCard />;    // renders inline, does NOT redirect
}
```

Representative call sites: `admin_dashboard/page.tsx:140` (inside a 14-way `Promise.all`),
`finance_officer_dashboard/page.tsx:19`, `printer_full/page.tsx:9`,
`admin_dashboard/statistics/income/page.tsx:8`, `admin_dashboard/manage_orders/page.tsx:6-13`.

### 5.2 Client component calls the getter on mount / on interaction

The same function, invoked as an RPC. Trigger shapes:

| Trigger | Example |
|---|---|
| `useEffect(…, [])` on mount | `admin_dashboard/profile/ProfileClient.tsx:45` → `getProfileData()` |
| `useEffect` on filter change | `admin_dashboard/finance/daily-report/page.tsx:74` → `getDailyReportData(isoDate)` |
| `useCallback` wired to a `<Select>` | `admin_dashboard/statistics/income/IncomeStats.tsx:51` → `getIncomeStats(value)` |
| `onClick` | `admin_dashboard/books/BooksPrintDialog.tsx:117` → `getBooksStorePrintData()` |
| debounced search | `delivery_dashboard_full/walk-in-customer/WalkInCustomer.tsx:409` → `searchBooks(...)` |
| **30-second polling** | `sidebar_components/admin_sideboard.tsx:147`, `generic_sideboard.tsx:83` — sidebar badges |

⚠️ The sidebars poll every 30 s. On Vercel that is a server-action round-trip hitting Prisma
every 30 seconds per open session — a real cost multiplier.

### 5.3 Parallel loading with `Promise.all`

**28 occurrences**, 17 of them in server components. The showpiece is the admin dashboard:

```tsx
// src/app/admin_dashboard/page.tsx:83-142 — 14 queries in one Promise.all
await Promise.all([
  prisma.books.count({...}), prisma.bookshopes.count({...}),
  prisma.bookshopeditions.findMany({...}), prisma.notification.findMany({...}),
  prisma.orders.findMany({...}), prisma.bookeditionstores.findMany({...}),
  /* … 7 more prisma queries … */
  getTopSellers("all_time"), getLastBackupTime(),
]);
```

Others: `printing/manage/page.tsx:6` (`[orders, printers, editions, books]`),
`printing/list/page.tsx:30`, `printing/delivery-records/page.tsx:10`,
`books/damaged/page.tsx:8` (`[damagedBooks, books, editions, stores]`),
`statistics/page.tsx:73,85` (parallelizes an N+1 fan-out).

**Obvious candidates that were not parallelized:** `viewer_dashboard/page.tsx:19-24` (4
sequential awaits), `admin_dashboard/stores/page.tsx:21-22`,
`admin_dashboard/manage_orders/page.tsx:6-13`,
`admin_dashboard/manage_payment/[id]/debts-breakdown/page.tsx:12,48,60`.

### 5.4 Direct Prisma in server components

57 server `page.tsx` files bypass the action layer and query Prisma inline — typically for
`findUnique` + `notFound()` on detail pages:

```tsx
// src/app/admin_dashboard/stores/[id]/page.tsx
const store = await prisma.stores.findUnique({ where: { id: Number(params.id) }, include: {...} });
if (!store) notFound();
return <StoreDetailsClient store={store} />;
```

This is acceptable for detail pages but it means **business rules are not uniformly enforced** —
an action module may guard a write while a page reads the same table unguarded.

---

## 6. Rendering strategy

This is the section with the most surprising findings. Short version:

> **The app opts out of the Next.js rendering model almost entirely. Every route is
> `force-dynamic`. There is no static generation, no ISR, no tag cache, no `use cache`, no
> Suspense streaming, and no `useActionState`. Client-side `router.refresh()` is the only
> cache invalidation that actually does anything.**

### 6.1 The numbers

| Mechanism | Count | Notes |
|---|---|---|
| `export const dynamic = "force-dynamic"` | **47** | Every single one. No other value used. |
| `export const revalidate` | 0 | |
| `generateStaticParams` | 0 | No pre-rendering at all |
| `dynamicParams` / `fetchCache` | 0 | |
| `unstable_cache` / React `cache()` | 0 | No request-scoped memoization |
| `"use cache"` / `cacheTag` / `cacheLife` | 0 | |
| `revalidateTag` | **0** | |
| `revalidatePath` | **159** | All hard-coded paths. Effectively inert — see §6.3 |
| `useActionState` / `useFormState` / `useFormStatus` / `useOptimistic` | **0** | |
| `<form action={…}>` | **0** | 38 `<form onSubmit={…}>` instead |
| `router.refresh()` | 52 | The real invalidation mechanism |
| `router.push()` / `replace()` | 31 / 2 | Navigation |
| `loading.tsx` | **0** | |
| `error.tsx` / `global-error.tsx` | **0** | No error boundaries anywhere |
| `not-found.tsx` | 1 | Root only |
| `<Suspense>` | **2** | Both inert — see §6.4 |
| `useTransition` | 1 | `admin_dashboard/backup/BackupClient.tsx:93` |
| `export const runtime` | 1 | `middleware.ts:10` → `'nodejs'` |

### 6.2 Why everything is dynamic

All 7 dashboard layouts export `force-dynamic`, and **a `force-dynamic` layout makes every
route beneath it dynamic**. The 40 individual pages that also declare it are therefore
redundant. The admin layout carries the explanation:

```tsx
// src/app/admin_dashboard/layout.tsx:8-9
// Admin pages use Prisma; avoid connecting to MySQL during Vercel's build prerender pass.
export const dynamic = "force-dynamic";
```

That is a build-time concern (Vercel was trying to connect to MySQL during prerender), solved
at the layout level and then copied to 40 pages defensively. `src/app/page.tsx:4` does the
same for the login page.

### 6.3 `revalidatePath` is a no-op here

159 call sites across 30 files, all with hard-coded paths like:

```ts
revalidatePath("/admin_dashboard/manage_orders");
revalidatePath("/admin_dashboard/printing/manage");
revalidatePath("/admin_dashboard", "layout");
```

Because every target route is `force-dynamic`, there is no cached render to invalidate. These
calls are harmless but perform no work. **Do not rely on `revalidatePath` as your refresh
strategy here** — follow the existing convention instead:

```tsx
// src/app/delivery_dashboard_full/round-books/RoundBooksList.tsx:82-87
const result = await deleteRoundBook(id);
if (result.success) { toast.success(...); router.refresh(); }
```

Some call sites point at routes that do not exist and always have:
`notification-actions.ts:73,78` → `/delivery_and_sales_dashboard`, `/sales_staff_dashboard`;
`payment-actions.ts:235,236` → `/delivery_and_sales_dashboard`, `/delivery_sample_dashboard`;
`print-order-actions.ts:367,385` → `/printer_dashboard` (the real folder is `printer_full`).

There is one `revalidatePath(path, "layout")` pattern that *does* matter:
`menu-actions.ts:164`, `menu-seed-actions.ts:95`, `notification-actions.ts:72-79` — toggling a
menu must invalidate the sidebar, which lives in the layout.

### 6.4 No streaming, no loading states, no error boundaries

- **No `loading.tsx` anywhere.** Every navigation shows a blank frame until the whole RSC
  payload resolves. On a `force-dynamic` page running a 14-way `Promise.all`, that is a real
  wait with no feedback.
- **No `error.tsx` or `global-error.tsx`.** A server-component throw becomes Next's default
  overlay in dev and the generic production error page. There is no `'use client'` error
  boundary in the codebase.
- **Exactly 2 `<Suspense>` boundaries**, both functionally inert:

  ```tsx
  // admin_dashboard/production/translation_work/new/page.tsx:6-21
  const [books, translators] = await Promise.all([...]);   // already awaited here
  return <Suspense fallback={<>Loading form…</>}>
           <NewTranslationProjectForm books={…} translators={…} />
         </Suspense>;
  ```

  The `Promise.all` is resolved before the boundary renders and the wrapped component is
  `"use client"` with data already as props — it can never suspend.

- `src/components/ui/skeleton.tsx` exists but is only consumed by `sidebar.tsx`; no route uses it.

**Consequence:** if you add a slow page, add a `loading.tsx` next to it. Nothing else provides
one.

### 6.5 Forms: no progressive enhancement

Every one of the 38 `<form>` elements is a client component that intercepts submit with
`onSubmit` and imperatively awaits a server action. There is no `action` attribute, no
`method`, no `useFormStatus`.

Four forms use react-hook-form + zod (all in `src/components/form_components/`):

| Form | Schema | Resolver |
|---|---|---|
| `AddBookForm.tsx` | `lib/validation/book-schema` | `:56` |
| `AddStoreForm.tsx` | `lib/validation/store-schema` | `:25` |
| `AddTranslatorForm.tsx` | `lib/validation/translator-schema` | `:26` |
| `NewTranslationProjectForm.tsx` | `lib/validation/translation-project-schema` | `:53` (`as any` — zod v4 / RHF typing gap) |

```tsx
// src/components/form_components/AddBookForm.tsx:89-133
const onSubmit = async (data: BookFormValues) => {
  if (imageFile) {
    const fd = new FormData(); fd.append("file", imageFile);
    const up = await uploadBookImageAction(fd);              // 2 sequential actions
    if (!up.success) { toast.error(...); return; }
  }
  const res = await createBook({ ...data, book_image_url: up.url });
  if (res.success) { toast.success(...); reset(); router.push(...); router.refresh(); }
  else             { toast.error(res.error); }
};
return <form onSubmit={handleSubmit(onSubmit)} …>;
```

The other 34 forms (including every dialog and modal in the app) use plain `useState` +
`onSubmit`, with hand-rolled `isSaving`/`isLoading` booleans since `useFormStatus` isn't used.

Every form is therefore JS-required. Fine for an internal tool; just be aware nothing works
without hydration.

### 6.6 Search params

Next 15 made `searchParams` async, and the codebase follows it correctly:

```tsx
// src/app/admin_dashboard/finance/books/page.tsx:28
export default async function Page({ searchParams }: { searchParams: Promise<{search?: string; page?: string}> }) {
  const { search, page } = await searchParams;
```

Filter state is also pushed into the URL from the client with
`router.replace(qs ? `…?${qs}` : "…", { scroll: false })` — see
`admin_dashboard/production/low-stock/LowStockFilters.tsx:31`.

---

## 7. The custom caches

Only two caches exist in the app, neither of them a Next.js cache:

1. **Middleware menu cache** — `src/middleware.ts:13-14`, a 10-second in-process `Map`.
   Comment: *"Cache enabled menu lookups to avoid a DB round-trip on every request."*
2. **Prisma client singleton** — `src/lib/prisma.ts:11-16`, pinned to `globalThis.prismaGlobalV2`
   so dev hot-reloads and serverless invocations don't churn connections.

`next/font` at the root is the only build-time optimization Next.js performs here.

---

## 8. Theming

There is **no `ThemeProvider`**. `next-themes` is imported exactly once — in
`components/ui/sonner.tsx` — and never mounted, so `useTheme()` there always returns the
default. Theming is done with CSS custom properties:

- `src/app/globals.css` defines the brand palette in `@theme inline`:
  `--color-primarycolor` (`#408A71`), `--color-secondarycolor` (`#285A48`),
  `--color-badgecolor`, `--color-toastbg`, `--color-toasttext`, `--color-tertiarycolor`,
  `--color-quaternarycolor`, plus an `oklch`-based neutral scale.
- `src/app/layout.tsx:29-64` injects a **blocking inline `<script>`** in `<head>` that reads
  `localStorage` for `primarycolor` / `badgecolor` / `toastbgcolor` / `toasttextcolor`, derives a
  darkened `--secondarycolor`, and sets the vars before first paint.
- Runtime changes go through `admin_dashboard/settings/theme` → `settings-actions.ts` (single-row
  `settings` table) → localStorage.

---

## 9. Adding a feature — the pattern this codebase follows

1. **Add or extend a server action** in `src/app/actions/<domain>-actions.ts`. Return
   `{ success: true, data }` or `{ success: false, error: string }` — never throw to the client.
   Add `revalidatePath("/admin_dashboard/<section>")` to match convention (inert but harmless).
2. **Add a `page.tsx`** under the dashboard(s) that need it. Server component. `await` the
   getter(s), use `Promise.all` when there is more than one, render `notFound()` for missing
   entities.
3. **Add a client component** next to it — `*Table.tsx` for lists, `*Client.tsx` for
   interactive screens, `*Modal.tsx` / `*Dialog.tsx` for overlays. Call actions from
   `onClick`/`onSubmit`, show `toast.success/error`, then `router.refresh()`.
4. **Register the menu** if it's a new section — add it to
   `src/lib/dashboard-menu-registry.ts` (source of truth for the on/off system) and
   `src/lib/dashboard-menu-config.ts` (icon + label), then run `seedDashboardMenus` via
   `menu-seed-actions.ts`. Missing this means middleware 404s the route for non-`alwaysOn` menus.
5. **Copy to the other dashboards** if the feature is shared — and accept the duplication, or
   deliberately choose a re-export page instead.
6. **Add `loading.tsx`** if the page does anything slow, because nothing else provides one.

---

## 10. Architecture risks worth knowing

| Issue | Where | Impact |
|---|---|---|
| Middleware opens a DB connection on every request | `src/middleware.ts:3,10` | Latency + connection pressure on every request in the app |
| `/api/*` excluded from the auth matcher | `src/middleware.ts:142` | `GET /api/editions` leaks the full edition catalogue; the two upload routes accept unauthenticated uploads to a public bucket |
| `pathname.includes('.')` marks a path public | `src/middleware.ts:43` | Any dotted URL bypasses auth |
| No error boundaries, no loading states | whole app | A failing page drops the user on Next's generic error screen; slow pages show a blank frame |
| `revalidatePath` does nothing | 159 call sites | False confidence — actual refreshes rely on `router.refresh()` |
| 40% of `.tsx` files are copies | 130 identical + 30 diverged | Schema/feature changes must be applied 2–5×; drift is already present in the 4× `EditionsInfo` and 2× `ManageOrderDetailsModal` sets |
| `DATABASE_URL` passed to a client component | `app/page.tsx:9-15` → `LoginPageClient.tsx:12` | The raw connection string is serialized into the browser payload |
| Session fetched up to 9–11× per action | `order-actions.ts`, `payment-actions.ts` | Repeated `cookies()` parses; no `cache()` memoization |
| 30-second sidebar polling | `admin_sideboard.tsx:147`, `generic_sideboard.tsx:83` | Per-session Prisma round-trips on a serverless runtime |
| `as never[]` / `as any[]` at every server→client hand-off | ~130 call sites | Type safety stops at the component boundary; schema drift surfaces at runtime |

---

_Last reviewed: 2026-10-14._