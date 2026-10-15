# 00 — Overview

> **Scope:** what the application does, the technology stack, and how to run it locally.
> Sections 01–07 are listed in [`README.md`](./README.md).

---

## 1. What the app does

**Bookland Ethiopia** is a multi-role internal operations system for an Ethiopian book
publisher/importer-distributor. It manages the whole chain from **manuscript → printing →
warehouse → retail book shop → payment → debt settlement**, plus the parallel tracks of
**translation** and **legal/paperwork documents**.

It is an internal back-office tool, not a public storefront. There is no customer-facing
storefront; the only "external" audiences are partner printers and retail book shops, both
of which log in with their own accounts and see only their own slice of the data.

### 1.1 The core business flow

```
  Production                Printing               Distribution              Retail                Settlement
┌──────────────┐        ┌────────────────┐       ┌──────────────┐      ┌────────────────┐      ┌──────────────┐
│ Book         │──────▶ │ Print order    │──────▶│ Store        │─────▶│ Book shop      │─────▶│ Payment      │
│ + Edition    │        │ (project) for  │       │ (warehouse)  │      │ order / round  │      │ (cash/check) │
│ costs &      │        │ a Printer      │       │ inventory    │      │ allocation     │      │ + debt       │
│ prices       │        └────────────────┘       └──────────────┘      └────────────────┘      └──────────────┘
└──────────────┘
```

1. A **book** is created; **editions** (the physical/priceable unit) are added with selling
   price plus ~20 cost buckets (printing, binding, design, translation, transport…).
2. A **print order** (project) is issued to a **printer**, containing **print order items**
   that reference editions. Printers get their own dashboard and can update statuses.
3. Printed copies move **printer → store (warehouse)**, either as an explicit transfer or
   auto-attributed delivery records. Store stock is the sellable inventory.
4. The **delivery/sales team** creates **orders** to a **book shop** (or round/credit
   consignments). The order fills quantity FIFO across editions, may lock stock while
   pending, and is approved by an admin, which decrements inventory and writes the shop's
   holding ledger (`bookshopeditions`).
5. **Payments** (DIRECT cash or by **check**) reduce the shop's balance; the residual is
   **debt**, surfaced in Manage Payment, Payments Due, Daily/Period Reports.

### 1.2 Who uses it (roles)

`accounts.account_type` is the role. Seven dashboards are implemented:

| Role | Dashboard root | What they own |
|---|---|---|
| `ADMIN` | `/admin_dashboard` | Everything — the full management console |
| `Operations Manager` | `/operation_manager_full_dashboard` | Production, printing, orders, delivery reports |
| `Inventory Manager` | `/inventory_manager_dashboard` | Books/editions catalogue, store inventory, low stock, damage |
| `Finance Officer` | `/finance_officer_dashboard` | Read-mostly finance views (shops, editions, costs, printing, payments due, reports) |
| `Viewer` | `/viewer_dashboard` | Read-only data portal across catalogue, stores, shops, statistics |
| `Delivery Account` | `/delivery_dashboard_full` | Shop orders, walk-in sales, rounds, payments, notes |
| `Printer` | `/printer_full` | Their own print projects, collective stock, deliveries to approve, payments |

See `docs/04-auth-and-permissions.md` (not yet written) for the session model, the
menu on/off permission system, and the per-permission role grants.

### 1.3 Feature areas

| Area | Where | What it covers |
|---|---|---|
| Catalogue | `admin_dashboard/books`, `inventory_manager_dashboard/books`, … | Books, editions, cover images, reorder/sort, shelf view, per-book detail tabs |
| Production | `*/production/*` | Production status pipeline, translators, translation projects, translation books, low stock |
| Printing | `*/printing/*` | Printers, print orders/projects, books-in-print list, printing info, delivery records, printer payments |
| Stores & inventory | `*/stores*`, `store-inventory-actions` | Warehouses, store↔edition stock, store-to-store transfers, printer→store transfers |
| Retail shops | `admin_dashboard/book_shops`, `book-shop-actions` | Book shop profiles, per-shop edition holdings, previous debt |
| Orders & delivery | `*/manage*orders*`, `delivery_dashboard_full/*` | Create/approve/deliver shop orders, delete, allocations, delivery receipts |
| Walk-in / retail sales | `delivery_dashboard_full/walk-in-customer`, `retail-purchase-actions` | Retail purchases with approval and payment tracking |
| Rounds (credit) | `*/round-books/*` | Round book allocation to shops, round records, round payments & checks, deduction |
| Finance & debt | `*/finance/*`, `manage_payment` | Shop debt breakdown, payments due, daily/period reports, costs, revenue, income |
| Cheques | `*/checks/*` | Check register, images, status (PENDING/CLEARED/DELIVERED/BOUNCED/CANCELLED) |
| Documents | `*/document_management/*` | Contracts, print agreements, delivery notes, invoices, approval documents |
| Notes & notifications | `*/notes`, `*/notifications` | Per-account notes; in-app notification inbox |
| Admin/ops | `admin_dashboard/settings/*`, `activity_log`, `backup` | Accounts & permissions, menu on/off, theme, audit log, DB backup |

---

## 2. Tech stack

### 2.1 Runtime & framework

| Concern | Choice |
|---|---|
| Framework | **Next.js 15.5.15** (App Router, `src/app`, Turbopack in dev) |
| UI runtime | **React 19.1.0** |
| Language | **TypeScript 5.9** (`strict: true`) |
| API style | **React Server Components + Server Actions** (no separate REST backend) |
| Auth | Hand-rolled: bcryptjs password + an httpOnly `session` cookie (JSON) |
| DB | **MySQL** (see note below) |
| ORM | **Prisma 6.19** |
| Styling | **Tailwind CSS v4** (CSS-first; no `tailwind.config.*`) |
| Components | **shadcn/ui** (New York style) on **Radix**, `lucide-react` icons |
| Toasts | `sonner` |
| Tables / charts | `@tanstack/react-table`, `recharts` |
| Forms | `react-hook-form` + `zod` |
| Rich text | `@tiptap/react` (the shared rich-text-editor primitive) |
| Drag & drop | `@dnd-kit/*` (menu / sidebar reordering) |
| Client state | `zustand` (`use-sidebar-store`, `use-editions-store`) |
| Excel export | `xlsx` |
| File uploads | `@vercel/blob` |
| Dates | `date-fns` + `ethiopian-date` (Ethiopian ⇄ Gregorian calendar support) |
| Deploy | **Vercel** |

### 2.2 Notable architecture decisions

- **Custom Prisma output path.** The schema generates the client into `src/generated/prisma`
  (not `node_modules/@prisma/client`). `src/lib/prisma.ts` imports from there, `next.config.ts`
  traces only that folder, and the **generated client is committed to git** so Vercel builds
  don't have to regenerate it.
- **MySQL, not PostgreSQL.** `AGENTS.md` says PostgreSQL, but the schema's
  `datasource db` uses `provider = "mysql"`. Trust the schema.
- **Multi-dashboard pattern.** Each role has its own route tree under `src/app/<role>_dashboard*/`.
  Where a role only needs a read-only view, its page is a one-line re-export of the admin
  implementation, e.g. `finance_officer_dashboard/books/page.tsx` →
  `export { default } from "@/app/admin_dashboard/finance/books/page"`.
- **Menu on/off system.** A registry (`src/lib/dashboard-menu-registry.ts`) maps role → menu
  name → path; `menu_management` rows toggle menus per account type; `middleware.ts` returns
  404 for disabled menus. Admin, Delivery and Printer sidebars are hard-coded and unaffected.
- **Ethiopian calendar first-class.** All user-facing dates go through `src/lib/calendar-utils.ts`
  with a cookie-backed preference (`calendar-preference` = `gregorian | ethiopian`).

### 2.3 Top-level layout

```
bookland_ethiopia_production_002/
├── prisma/
│   ├── schema.prisma              # PROTECTED — do not modify (43 models, 11 enums)
│   └── migrations/                # historical; only cover ~13 of 43 models
├── scripts/                       # DB diagnostics, backfills, build guards (.mjs)
├── public/
└── src/
    ├── app/
    │   ├── page.tsx               # login page
    │   ├── actions/               # 43 shared server-action modules
    │   ├── api/                   # 3 route handlers (editions, 2 upload endpoints)
    │   ├── admin_dashboard/
    │   ├── operation_manager_full_dashboard/
    │   ├── inventory_manager_dashboard/
    │   ├── finance_officer_dashboard/
    │   ├── viewer_dashboard/
    │   ├── delivery_dashboard_full/
    │   └── printer_full/
    ├── components/
    │   ├── ui/                    # shadcn primitives
    │   ├── sidebar_components/
    │   └── *_dashboard_components/
    ├── generated/prisma/          # committed Prisma client output
    ├── lib/                       # prisma singleton, calendar, menu registry, validation schemas
    ├── store/                     # zustand slices
    ├── hooks/, types/
    └── middleware.ts              # auth + role + menu gating
```

---

## 3. Running locally

### 3.1 Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20+ (developed on 24.x — no `.nvmrc`/`engines` is committed) |
| Package manager | **pnpm** (see note below) |
| Database | MySQL / MariaDB, reachable from your machine |

### 3.2 Install

```bash
pnpm install
```

`postinstall` runs `prisma generate`, which writes the client to `src/generated/prisma`.
You can force it with `pnpm exec prisma generate`.

> **Note on lockfiles:** both `pnpm-lock.yaml` and `package-lock.json` are committed, but the
> installed `node_modules` uses the pnpm store layout and `package.json` has a pnpm-only
> `onlyBuiltDependencies` block. **Use pnpm** — `npm install` resolves different versions.

### 3.3 Environment

Create `.env` in the project root (gitignored). There is **no `.env.example`** in the repo, so
here is the full list of what the app actually reads:

```bash
# Required — MySQL connection string used by Prisma
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/bookland"

# Required for file uploads (book covers, cheque images, payment receipts, invoice images)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Optional — bcrypt cost factor (default 10)
BCRYPT_SALT_ROUNDS="10"
```

Only `DATABASE_URL` is required to boot; the others degrade gracefully (uploads fail
without Blob, passwords hash with 10 rounds by default).

### 3.4 Database

The schema is at `prisma/schema.prisma` (**do not modify**).

```bash
# Create the client (no DB needed)
pnpm exec prisma generate

# Apply migrations — NOTE: see caveat below
pnpm exec prisma migrate deploy

# Sanity-check connectivity
pnpm run check:database
```

> ⚠️ **Migration caveat:** `prisma/migrations/` only covers ~13 of the 43 models and stops at
> 2026-05-07. The live database was created with direct DDL, not by replaying migrations.
> `prisma migrate deploy` against an empty MySQL instance will produce an incomplete schema.
> For a fresh environment, provision the database from the production schema, not from
> migrations. This is covered in more detail in `docs/02-data-layer.md`.

### 3.5 Dev server

```bash
pnpm dev          # next dev --turbopack
```

Open **http://localhost:3000**. Log in with an existing account.

### 3.6 Production build & run

```bash
pnpm run build    # prisma generate → verify engines → next build
pnpm start        # next start
```

`build` hard-fails if the RHEL Prisma engine binary is missing
(`scripts/verify-prisma-engines.mjs`), so a missing engine surfaces at build time, not runtime.

### 3.7 Scripts reference

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev --turbopack` | Dev server on port 3000 |
| `build` | `prisma generate && verify-prisma-engines && next build` | Production build |
| `build:turbo` | same + `next build --turbopack` | Experimental Turbopack build |
| `start` | `next start` | Serve the production build |
| `lint` | `eslint` | Lint (flat config; warnings don't fail) |
| `check:database` | `node scripts/check-database.mjs` | `SELECT 1` connectivity probe |
| `verify:prisma-engines` | `node scripts/verify-prisma-engines.mjs` | Assert the RHEL engine exists |

One-off maintenance scripts live in `scripts/`. Three of them **write to the database**
(`backfill-total-print-count.mjs`, `backfill-legacy-totals.mjs`,
`fix-auto-delivery-printers.mjs`) and read `DATABASE_URL` from `.env` with no dry-run flag —
run them only against a database you intend to change.

---

## 4. Quick orientation for a new developer

1. Read `AGENTS.md` for the hard rules (never edit `prisma/schema.prisma`; no `git commit`/`push`
   or Prisma CLI without permission; no npm installs without permission).
2. Log in as an admin and click through `/admin_dashboard` — it is the superset of the app.
3. Data reads/writes almost always happen in `src/app/actions/*.ts` (43 files, one per domain).
   If you're adding a feature, that's where you start.
4. Read `src/lib/prisma.ts` once (singleton client), then the one or two action modules for
   your domain.
5. UI: pick the dashboard the feature belongs to, copy an existing page/table in that tree,
   and reuse the shadcn primitives in `src/components/ui/`.

---

## 5. Known rough edges (worth documenting as you read)

- `prisma/migrations` is not a complete history of the schema (see §3.4).
- No `.env.example`, no CI config, no `.nvmrc`/`engines` pin.
- Session cookie is unsigned JSON; middleware trusts the `role` inside it. Any mitigation or
  migration to signed sessions is tracked in `docs/04-auth-and-permissions.md`.
- `DATABASE_URL` is passed from `src/app/page.tsx` into the client `LoginPageClient` as a prop,
  which serializes it into the RSC payload. Worth removing.
- Three `account_type` redirect targets in `auth-actions.ts` (`sales_staff_dashboard`,
  `delivery_and_sales_dashboard`, `delivery_sample_dashboard`) have no matching routes.
- `src/generated/prisma` is committed to git (~62 MB, including several stale
  `query_engine-windows.dll.node.tmp*` files).
- The two `/api/upload-*` route handlers are outside the auth matcher and do not check the
  session.

---

_Last reviewed: 2026-10-14._