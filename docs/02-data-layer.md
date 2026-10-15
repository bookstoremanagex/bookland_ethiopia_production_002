# 02 — Data layer

> **Scope:** DB schema, ORM models, relationships, migrations.
> See also [`00-overview.md`](./00-overview.md) and [`01-architecture.md`](./01-architecture.md).
>
> ⚠️ `prisma/schema.prisma` is **protected** — never edit it. See `AGENTS.md`.

---

## 1. ORM setup

| Fact | Value |
|---|---|
| ORM | **Prisma 6.19.3** (`prisma` devDep, `@prisma/client` runtime dep) |
| Database | **MySQL / MariaDB** (`provider = "mysql"`) |
| Connection string | `env("DATABASE_URL")` |
| Client output | **Custom:** `../src/generated/prisma` → `src/generated/prisma` |
| Binary targets | `native`, `rhel-openssl-3.0.x` (the RHEL one exists for Vercel/Amazon Linux 2023) |
| Generators | **Two**: `client` (custom output, the one in use) and `client_standard` (default output, effectively unused) |
| Model count | **43 models, 11 enums** |
| Schema size | 900 lines |
| Import | `import prisma from "@/lib/prisma"` (default export) |

### 1.1 The Prisma singleton — `src/lib/prisma.ts`

```ts
import { PrismaClient } from "../generated/prisma";   // NOT "@prisma/client"

const prismaClientSingleton = () => new PrismaClient();

declare global { var prismaGlobalV2: undefined | ReturnType<typeof prismaClientSingleton> }

const prisma = globalThis.prismaGlobalV2 ?? prismaClientSingleton();
export default prisma;

// Reuse one client in dev and serverless (e.g. Vercel) to avoid connection churn.
globalThis.prismaGlobalV2 = prisma;
```

The `globalThis` pinning prevents a new connection pool on every dev hot-reload and every
serverless cold start. The global key is `prismaGlobalV2` (not `prismaGlobal`) — presumably to
avoid colliding with a stale HMR-cached client from an earlier version.

**Never instantiate `PrismaClient` anywhere else.** Always `import prisma from "@/lib/prisma"`.

### 1.2 Two quirks worth knowing

1. **Custom output means `@prisma/client` is unused at runtime.** Everything imports from
   `src/generated/prisma`. `next.config.ts` reflects this:
   ```ts
   serverExternalPackages: ["@prisma/client", "prisma"],
   outputFileTracingIncludes: { "**": ["./src/generated/prisma/**/*"] },
   ```
   The generated folder is **committed to git** (~62 MB) so Vercel builds can skip regeneration.
   Run `pnpm exec prisma generate` after any schema change — but you shouldn't be changing it.

2. **The client is frequently accessed through `(prisma as any)`.** This is a long-standing
   workaround for the client lagging behind the schema:
   ```ts
   // src/middleware.ts:22
   const management = await (prisma as any).menu_management.findMany({ ... });
   ```
   The cast is deliberate — the committed client in `src/generated/prisma/` was verified to
   contain all 43 models, so these casts are now vestigial but harmless. **Prefer plain
   `prisma.<model>`** in new code so a genuinely-stale client fails loudly instead of silently
   losing type safety.

---

## 2. Schema-wide conventions

Every business table follows the same shape. Learn it once:

```prisma
model X {
  id         Int       @id @default(autoincrement())
  // ... domain fields
  is_deleted Boolean   @default(false)
  updatedAt  DateTime             // required, manually set (no @updatedAt)
  createdAt  DateTime  @default(now())
  deletedAt  DateTime  @default(now())   // default now() — a known quirk, see §2.1
}
```

### 2.1 Conventions and their gotchas

| Convention | Rule | Gotcha |
|---|---|---|
| **Soft delete** | `is_deleted Boolean @default(false)` on nearly every model | Soft-deleted rows are **not** excluded by Prisma automatically. Every query must pass `where: { is_deleted: false }` explicitly. Forgetting it silently returns deleted data. |
| **`deletedAt`** | Present on ~30 models, `DateTime @default(now())` | ⚠️ It defaults to **now() at creation**, not null. It is effectively meaningless as a "deleted at" timestamp — nothing sets it on delete. Do not use it to filter or report. |
| **`updatedAt`** | `DateTime` (required, **no** `@updatedAt` attribute) | ⚠️ Must be set manually in every `update`/`create` call: `updatedAt: new Date()`. Only 4 models use the real Prisma `@updatedAt` (`orders`, `printer_delivery_records`, `printorder_items` — actually only those with the attribute in the schema). |
| **PK** | `Int @id @default(autoincrement())` | Every model. No UUIDs, no natural keys. |
| **Money** | `Float` (MySQL `DOUBLE`) | ⚠️ Floating point for currency — expect rounding drift on large totals. |
| **Dates** | `DateTime` for real timestamps; `String` where a year/copyright is stored | `books.publication_year` is a `String`, not an Int. |
| **Indexes** | `@@index([fk])` on most foreign keys, named via `map: "<Table>_<col>_fkey"` | Index names are DB-level artifacts, not Prisma defaults. |
| **Cascade** | `onDelete: Cascade` on inventory/line-item FKs; `onDelete: SetNull` on `damagedbooks` polymorphic FKs; **unspecified** on `roundbooks`, `retail_purchases.created_by`, `printer_delivery_records.storeId` | |
| **No domain types** | `src/types/` holds only `ethiopian-date.d.ts` | Model shapes are re-declared inline in every consuming component as `as never[]` / `as any[]`. |

### 2.2 Naming style

The schema mixes four conventions, often within one model:

| Style | Where | Example |
|---|---|---|
| lowercase single-word | Most models | `books`, `orders`, `stores`, `printer`, `checks`, `notes` |
| `snake_case` compound | Newer models | `locked_editions`, `round_books`/`roundbooks`, `printorder_items`, `retail_purchases`, `local_backup_records`, `bookshopeditions` |
| PascalCase | Two legacy models | `activityLogs`, `BookEdition*` table names in migrations |
| camelCase FKs | Common | `bookShopId`, `editionId`, `printerId` |

⚠️ **Table names in the DB are PascalCase for early tables** (`Books`, `Stores`, `Accounts`,
`BookEdition`, `Printer`, `PrintOrder`) because they were created by migration before the
`@@map` convention settled. Newer tables are snake_case. You address tables through Prisma
model names, so this only matters when writing raw SQL (which `backup-actions.ts` and
`check_hierarchy.mjs` do).

---

## 3. The models

43 models, grouped into 9 domains. **Bold** = central to the domain.

### 3.1 Catalogue & production

| Model | Purpose | Key fields |
|---|---|---|
| **`books`** | Title-level record. 26 fields. | `title`, `short_name`, `author`, `pen_name`, `unique_identification_code` (unique), `book_sku` (unique), `isbn`, `category`, `language`, `book_sort_index` (manual ordering, default 10000), `productionstatus` (enum), `available_for_retail`, `default_edition_id` (**String**, not FK), 9 book-level cost fields, `book_image_url` |
| **`bookedition`** | The physical/priceable unit. 27 fields. | `edition_name`, `selling_price`, `production_price`, `cover_price`, ~18 cost buckets, `number_of_pages`, `total_print_count`, `count_remning_for_transfer`, `visiblitiy_to_printer` (note the typo — it is the real column name), `bookId` |
| `damagedbooks` | Loss/damage register | `type` (enum), any of `book_id`/`edition_id`/`store_id`/`printer_id`, `count`, `account_id` |

⚠️ `bookedition` has **both** `book_id Int?` (line 50, orphan/unused) and `bookId Int` (line 52,
the real FK). Same pattern in `translatorbook` (`book_id Int?` + `bookId Int`). Query on
`bookId`; ignore `book_id`.

### 3.2 Stock holders

| Model | Purpose | Key fields |
|---|---|---|
| **`stores`** | Internal warehouses | `name`, `location`, `phone`, `email`, `status` |
| **`bookeditionstores`** | Stock quantity of an edition at a store | `editionId`, `storeId`, `quantity` (default 0) |
| `printer` | External print partners | `name`, `location`, `phone`, `email`, `status` |
| **`bookeditionprinters`** | Edition ⇄ printer stock ("collective") | `editionId`, `printerId`, `quantity` |
| `locked_editions` | Soft reservation of edition stock | `editionId`, `amount_locked`, `order_id`, `status` (enum) |

**Inventory lives in two parallel tables.** `bookeditionstores.quantity` is sellable warehouse
stock; `bookeditionprinters.quantity` is stock still at / attributed to a printer. Transfers
move quantity between them and write a `printer_delivery_records` row.

### 3.3 Printing

| Model | Purpose | Key fields |
|---|---|---|
| **`printorder`** | A printing job for one printer ("project") | `project_name`, `printerId`, `quality`, `count`, `total_price`, `additional_price`, `status` (enum), `tracking` (enum), `startDate`, `endDate`, `edition` (**String**, legacy) |
| **`printorder_items`** | Editions inside a project | `printorder_id`, `bookEditionId`, `quantity`, `price_per_book`, `total_price`, `content` (Text), `status` (enum) |
| `printorder_payments` | Instalments against a project | `printorder_id`, `amount`, `payment_date`, `reference`, `bookEditionId?` |
| `printer_delivery_records` | Proof copies left a printer for a store | `printorder_item_id`, `storeId?`, `quantity_deliverd` (typo is real), `approvedByPrinter`, `approvedByPrinterAt` |

⚠️ **`printer_delivery_records` has no relation to `stores`.** `storeId Int?` is a bare integer
with no `@relation`. This is deliberate-ish: it lets a delivery reference a deleted store. But
it means you cannot `include: { store: true }` — every consumer resolves the store by a manual
second query.

### 3.4 Retail & distribution

| Model | Purpose | Key fields |
|---|---|---|
| `bookshopes` | Retail/wholesale customers | `name`, `location`, `branch`, `previousDebt` (default 0) |
| **`bookshopeditions`** | What a shop currently holds — the debt ledger | `bookShopId`, `bookEditionId`, `quantity`, `price_per_peice` (typo is real), `total_price`, `already_paid`, `remaining_amount` |
| **`orders`** | A sale/delivery order to a shop | `bookShopId`, `order_type` (`"requested"` \| `"on round"`), `total_amount`, `amount_paid`, `payment_type` (`DIRECT`\|`CHECK`), `check_id`, `is_approved`, `status`, `allocation_summary` (Text), `delivery`, `delivered_by`, `hide_remaining`, `order_made_by_id` |
| `order_items` | Order lines | `orderId`, `bookEditionId`, `quantity`, `price_at_order` (frozen snapshot) |
| `retail_purchases` | Walk-in/individual sales | `name`, `date`, `total_amount`, `amount_paid`, `status` (enum), `created_by` (bare Int, no FK) |
| `retail_purchase_items` | Walk-in sale lines | `purchase_id`, `edition_id`, `quantity`, `unit_price` |

### 3.5 Money

| Model | Purpose | Key fields |
|---|---|---|
| **`payments`** | Money received from a book shop | `shopId`, `amount`, `payment_type`, `checkId`, `image` (Blob URL), `status`, `orderid` (**String**), `is_for_previous_debts`, `memo` |
| `checks` | Bank cheques | `username`, `bankname`, `type` (enum), `amount` (**String**), `recordeddate`, `expirydate`, `imageUrl`, `status` (enum) |
| `payment_records_from_shop_to_printer` | Money a shop hands a printer, per order | `shopId`, `orderId`, `printerId`, `amount`, `status` — all optional, all real FKs |

⚠️ **`payments` carries dead printer columns.** `is_for_printer`, `printer_id`, `printer`,
`printer_payment_memo`, `payment_for_printer` are all annotated
`// not using these fields as of 2026-08-23`. The `printer` relation is still live in the schema,
so Prisma will still resolve it — but no application code writes to these columns.

⚠️ **Money is inconsistently typed.** `payments.amount` is `Float`, but `checks.amount` and
`round_checks.amount` are `String`. And `payments.orderid` / `round_payments.orderid` are
`String`, while `orders.id` is `Int`. They are **not** foreign keys — they are free-text
references. Any join on them must parse.

### 3.6 Rounds (consignment / credit)

| Model | Purpose | Key fields |
|---|---|---|
| `roundbooks` | A book+edition pool placed on a round | `bookId`, `editionId`, `starting_amount`, `returned_amount`, `allocated`, `status` |
| `roundrecords` | One shop's slice of a round | `roundbookId`, `bookshop_id`, `totalprice`, `status` (`PENDING` default) |
| `round_payments` | Payments against a round record | `shopId`, `amount`, `payment_type`, `checkId`, `status`, `memo`, `orderid` (String) |
| `round_checks` | Cheque metadata for a round payment | mirrors `checks` minus `expirydate`, plus `memo` |

### 3.7 Translation

| Model | Purpose | Key fields |
|---|---|---|
| `translator` | A translator | `name`, `pen_name`, `phoneNumber`, `email` |
| `translatorbook` | A translator ⇄ book assignment | `bookId`, `translator_id`, `Status` (enum, capital S), `cost`, `payment_status` (enum), `currently_paid`, `startDate`, `endDate` |

### 3.8 Identity & permissions

| Model | Purpose | Key fields |
|---|---|---|
| `accounts` | Login users | `account_type` (role string), `account_email`, `phonenumber`, `password` (bcrypt), `account_status`, `name`, `roles[]`, `notes[]`, `activitylogs[]`, `damagedbooks[]`, `orders[]` |
| `roletypes` | Permission catalogue (~47 rows seeded) | `rolename` (unique), `role_detail` |
| `roles` | account ⇄ roletype grant | `accountId`, `roletypeId`, `role_status` |

Note there are **two** role systems: `accounts.account_type` (coarse dashboard access, used by
middleware) and the `roles`/`roletypes` join (fine-grained permission checks, used by
`checkCurrentUserRole`). See [`04-auth-and-permissions.md`](./04-auth-and-permissions.md).

### 3.9 Communication, config & registers

| Model | Purpose |
|---|---|
| `notification` | In-app notification. `notification_to` (enum), `accountId` (@@map `account_id`), `details` (LongText JSON string), `is_read` |
| `notes` | Per-account scratchpad |
| `activityLogs` | Audit trail. `action` (Text), `details` (LongText JSON), `ipAddress`, `userAgent` |
| `menus` | Self-referencing menu tree (`parentId` + `order`, relation `MenuHierarchy`) |
| `menu_management` | Menu on/off per role. `@@unique([account_type, menuId])` |
| `dashboardmenu` | **Legacy/dead.** A per-role JSON blob (`menus String @db.LongText`, `role` unique). Superseded by `menus` + `menu_management`. No code writes to it. |
| `settings` | Single-row theme config (`primaryColor` default `#408A71`, `badgeColor`, `toastBgColor`, `toastTextColor`) |
| `contracts`, `print_agreements`, `delivery_notes`, `invoices`, `approval_documents` | Five **isolated document registers**. None has an FK to orders, print orders, or deliveries — they are standalone CRUD. |
| `local_backup_records` | Log of generated `.sql` dumps: `databaseName`, `fileSizeBytes`, `status` |

---

## 4. Relationship map

```
                            ┌───────────┐
                            │  accounts │────┬── roles ──── roletypes
                            └─────┬─────┘    ├── notes
                                  │          ├── activityLogs
                       order_made_by_id    └── damagedbooks (account_id)

  ┌────────┐ 1:N  ┌──────────────────┐ 1:N  ┌──────────────┐
  │ books  │──────│   bookedition    │──────│order_items   │
  └───┬────┘      │  (the hub table) │      └──────┬───────┘
      │           └───┬────┬────┬───┘             │
      │               │    │    │                 │
      │      bookeditionstores│  └─ printer_delivery_records
      │      (editionId+storeId)   (via printorder_items)
      │               │
      │           bookeditionprinters
      │           (editionId+printerId)
      │               │
      │           locked_editions
      │               │
      │           bookshopeditions ──┐
      │           retail_purchase_items
      │           printorder_items ──→ printorder ──→ printer
      │           roundbooks ──→ roundrecords ──→ round_payments ──→ round_checks
      │           damagedbooks
      │           translatorbook ──→ translator
      │
      └── books_productionstatus (enum)

  ┌──────────┐ 1:N  ┌───────┐ 1:N  ┌──────────────┐
  │bookshopes│──────│orders │──────│order_items   │
  └────┬─────┘      └───┬───┘      └──────────────┘
       │  │            │
       │  │            ├── checks? (check_id)
       │  │            └── locked_editions (order_id)
       │  ├── bookshopeditions
       │  ├── payments ──→ checks?
       │  ├── roundrecords
       │  └── payment_records_from_shop_to_printer ──→ printer
       │
  ┌────────┐ 1:N  ┌────────────────────┐
  │ stores │──────│ bookeditionstores  │
  └────────┘       └────────────────────┘

  ┌──────────┐ 1:N  ┌─────────────────┐ 1:N  ┌──────────────────────┐
  │ printer  │──────│ printorder      │──────│ printorder_items     │
  └────┬─────┘      └────────┬────────┘      └──────────┬───────────┘
       │                    │                          │
       │           printorder_payments         printer_delivery_records
       │                                                │
  bookeditionprinters                          (storeId: bare Int, no FK)
  payments (dead columns)
  damagedbooks
```

### 4.1 The hub: `bookedition`

`bookedition` is referenced by **11** other tables:

`bookeditionstores` · `bookeditionprinters` · `locked_editions` · `bookshopeditions` ·
`order_items` · `retail_purchase_items` · `printorder_items` · `roundbooks` ·
`damagedbooks` · `translatorbook` (via `books`) · and indirectly every report

That is why almost every query in the app is `bookedition → books` and why every table
component needs `title` + `edition_name` joined in.

### 4.2 Referential-integrity notes

| Relationship | `onDelete` | Risk |
|---|---|---|
| `bookeditionstores.editionId` / `.storeId` | `Cascade` | Deleting an edition wipes its stock rows |
| `bookeditionprinters.editionId` / `.printerId` | `Cascade` | same |
| `locked_editions.editionId` / `.order_id` | `Cascade` | deleting an order releases its locks automatically |
| `bookshopeditions.*` | `Cascade` | deleting a shop wipes its holdings **and its debt ledger** |
| `orders.bookShopId` | `Cascade` | deleting a shop wipes order history |
| `printorder.printerId`, `printorder_items.*` | `Cascade` | deleting a printer wipes all their print history |
| `damagedbooks.*` (5 FKs) | `SetNull` | intentional — damage reports survive deletion of the referenced entity |
| `roundbooks.editionId` → `bookedition` | **unspecified** | MySQL default is `RESTRICT`; deleting an edition with a round book will fail |
| `roundbooks.bookId` → `books` | **unspecified** | same |
| `retail_purchases.created_by` | **no relation** | bare `Int?`, never validated |
| `printer_delivery_records.storeId` | **no relation** | bare `Int?`, never validated |
| `orders.delivered_by` | **no relation** | bare `Int?` |
| `payments.orderid` | **String** | free text, not an FK |
| `round_payments.orderid` | **String** | free text, not an FK |
| `books.default_edition_id` | **String** | free text, not an FK |
| `printorder.edition` | **String** | legacy free-text field |

⚠️ **The app almost never hard-deletes** — everything is soft-deleted via `is_deleted`, which
sidesteps most cascade risk. But `DeleteBook`, `deleteEdition`, `deleteStore`,
`deleteBookShop` etc. all check `is_deleted` before acting. Verify before you assume.

---

## 5. Enums

11 enums, all defined at the bottom of the schema:

| Enum | Values | Used by |
|---|---|---|
| `locked_editions_status` | `locked`, `unlocked` | `locked_editions` |
| `retail_purchase_status` | `PENDING`, `APPROVED`, `PARTIALLY_PAID`, `PAID` | `retail_purchases` |
| `check_types` | `COLLATERAL`, `PAYMENT` | `checks`, `round_checks` |
| `check_status` | `PENDING`, `CLEARED`, `DELIVERED`, `BOUNCED`, `CANCELLED` | `checks`, `round_checks` |
| `notification_to` | `ADMIN`, `FINANCE`, `OPERATION_MANAGER`, `DATA_VIEWER`, `DELIVERY_AND_SALES`, `INVENTORY_MANAGER`, `RETAIL_MANAGER`, `PRINTER` | `notification` |
| `damagedbooks_type` | `STORE`, `PRINTING`, `DESIGN`, `PREPRINTING`, `DISTRIBUTION`, `SALES`, `LOST` | `damagedbooks` |
| `printorder_status` | `NOT_STARTED`, `STARTED`, `ONPROGRESS`, `FAILED`, `COMPLETED`, `REPRINT` | `printorder`, `printorder_items` |
| `translatorbook_Status` | `NOT_STARTED`, `STARTED`, `ONPROGRESS`, `COMPLETED` | `translatorbook` (note capital `S`) |
| `translatorbook_payment_status` | `PENDING`, `CURRENTLY_PAID`, `SUCCEEDED` | `translatorbook` |
| `printorder_tracking` | `NOT_SET`, `SHORTAGE_DETECTED`, `NOT_READY`, `PRINTING`, `DISTRIBUTION`, `SALES` | `printorder` |
| `books_productionstatus` | `ON_PRODUCTION`, `TRANSLATION`, `DESIGN`, `PRINTING`, `PREPRINTING`, `DISTRIBUTION`, `SALES` | `books` |

### 5.1 Enum vs. String — the schema is inconsistent

Several status fields that behave like enums are declared as plain `String` and are only
constrained by convention and comments:

```prisma
orders.order_type        String  // "requested" or "on round"
orders.payment_type      String? @default("DIRECT")   // "DIRECT" | "CHECK"
orders.status            String  @default("Pending")
payments.payment_type    String  // "DIRECT" | "CHECK"
payments.status          String  @default("PENDING")   // "PENDING" | "APPROVED"
round_payments.payment_type String // "DIRECT" | "CHECK"
round_payments.status    String  @default("PENDING")   // "PENDING" | "APPROVED"
roundrecords.status      String  @default("PENDING")
books.status             String  @default("available")
printer.status           String  @default("available")
stores.status            String  @default("available")
local_backup_records.status String @default("success") // "success" | "failed"
```

**The application validates these at runtime, not the database.** Match the exact string
literals above — casing matters (`"Pending"` vs `"PENDING"` for `orders.status`).

---

## 6. Indexes and unique constraints

### 6.1 Unique constraints (only 4)

| Constraint | Model | Field |
|---|---|---|
| `Books_unique_identification_code_key` | `books` | `unique_identification_code` |
| `Books_book_sku_key` | `books` | `book_sku` |
| `DashboardMenu_role_key` | `dashboardmenu` | `role` (dead table) |
| `menu_management @@unique([account_type, menuId])` | `menu_management` | composite |
| `menus.name` (`@unique`) | `menus` | `name` |
| `roletypes.rolename` (`@unique`) | `roletypes` | `rolename` |

⚠️ **Neither `accounts.account_email` nor `printer.email` is unique.** `loginAction` uses
`accounts.findFirst({ where: { account_email } })`, so a duplicate email silently resolves to
whichever row MySQL returns first.

### 6.2 Declared indexes

| Model | Indexes |
|---|---|
| `books` | `book_sku`, `unique_identification_code`, `title`, `author`, `category` — plus a **FULLTEXT** index applied out-of-band (see §7.2) |
| `bookedition` | `bookId` |
| `bookeditionstores` | `editionId`, `storeId` |
| `bookeditionprinters` | `editionId`, `printerId` |
| `bookshopeditions` | `bookEditionId`, `bookShopId` |
| `damagedbooks` | all 5 FKs |
| `menus` | `parentId` |
| `menu_management` | `account_type` (+ the composite unique) |
| `printorder` | `printerId` |
| `printorder_items` | `printorder_id`, `bookEditionId` |
| `roles` | `accountId`, `roletypeId` |
| `roletypes` | `rolename` |
| `translatorbook` | `bookId`, `translator_id` |
| `notification` | `accountId` |
| `activityLogs`, `notes` | `accountId` |
| `retail_purchase_items` | `purchase_id`, `edition_id` |
| `local_backup_records` | `createdAt` |

### 6.3 Notable **missing** indexes

High-volume, frequently-filtered tables with **no index at all**:

| Table | Missing index on | Why it hurts |
|---|---|---|
| `orders` | `createdAt`, `is_approved`, `bookShopId` | The debt report filters and groups on these on every page load |
| `order_items` | `orderId`, `bookEditionId` | `bookEditionId` is used by every stock-breakdown query |
| `payments` | `shopId`, `createdAt`, `status` | Daily/period reports scan this |
| `bookshopeditions` | *(indexed)* but no `remaining_amount` index | debt rollups |
| `printer_delivery_records` | `printorder_item_id`, `storeId` | delivery-record pages |
| `locked_editions` | `order_id` | lock lookup on order edit |
| `bookedition` | `visiblitiy_to_printer`, `productionstatus`-ish fields | filters |

Because every dashboard query is a full table scan over `orders` / `order_items` /
`payments`, **performance degrades linearly with history**. This is the single highest-impact
schema improvement available — but it requires a migration, and the migration story is broken
(§7).

---

## 7. Migrations

### 7.1 What exists

`prisma/migrations/` contains **12 migration folders** plus `migration_lock.toml`
(`provider = "mysql"`). All are dated 2026-04-24 → 2026-05-07.

| Folder | Size | Contents |
|---|---|---|
| `20260424121450_001` | 30 L | `CREATE TABLE Books` + unique indexes |
| `20260426154226_002` | 15 L | `CREATE TABLE Stores` |
| `20260430135342_004` | 31 L | `CREATE TABLE Accounts`, `CREATE TABLE Roles` + FK |
| `20260430141809_005` | 2 L | `ALTER TABLE accounts ADD COLUMN name` |
| `20260506042607_006` | 2 L | `ALTER TABLE books ADD COLUMN productionstatus ENUM(...)` |
| `20260506050550_007` | 36 L | `CREATE TABLE Translator`, `TranslatorBook` + 2 FKs (RESTRICT) |
| `20260506091259_008` | 29 L | `ALTER TABLE books ADD COLUMN default_edition_id`; `CREATE TABLE BookEdition` + FK |
| `20260506100357_009` | 19 L | `CREATE TABLE BookEditionStores` + 2 FKs (CASCADE) |
| `20260506105309_010` | 40 L | `CREATE TABLE BookShopes`, `BookShopEditions` + 2 FKs |
| `20260507042356_011` | 4 L | `ALTER TABLE bookedition ADD COLUMN editing_cost, other_expenses, transportation_cost` |
| `20260507045547_012` | 29 L | `CREATE TABLE DamagedBooks` + 4 FKs (SET NULL) |
| `20260507052744_013` | 37 L | `CREATE TABLE Printer`, `PrintOrder` + FK |

### 7.2 ⚠️ Critical: migrations cover only 13 of 43 models

These **30 models have no migration at all**:

```
bookeditionprinters   locked_editions        orders                 order_items
dashboardmenu          menus                  menu_management        printorder_payments
printer_delivery_records  printorder_items   roletypes              notification
activityLogs           notes                  contracts              roundbooks
roundrecords           round_payments         round_checks           print_agreements
delivery_notes         invoices               approval_documents     settings
checks                 payments               payment_records_from_shop_to_printer
retail_purchases       retail_purchase_items  local_backup_records   translator (partial)
```

Consequences:

1. **`prisma migrate deploy` against a fresh MySQL database produces a schema that is missing
   ~30 tables.** The app will boot (Prisma only errors on the query that touches the missing
   table) and then fail unpredictably across the dashboard.
2. **The live production database was created with direct DDL**, not by replaying migrations.
   The migrations are a historical artifact of the first two weeks of development.
3. **`prisma migrate dev` is unsafe here** — it will try to diff the schema against a database
   it doesn't understand and generate destructive migrations.

**Treat `prisma/schema.prisma` as the source of truth, not the migrations.** For a new
environment, provision the database by importing a production dump or applying
`SHOW CREATE TABLE` output from a live instance. `pnpm exec prisma db push` is the closest
supported path for a fresh DB, but verify carefully — it will drop anything not in the schema.

`prisma/schema.prisma` is protected by `AGENTS.md`: **never modify it**, and never run Prisma
CLI commands without explicit permission.

### 7.3 Schema drift that was applied out-of-band

Two changes bypassed migrations entirely:

1. **`scripts/add-fulltext-index.sql`** — a manual, run-once file:
   ```sql
   CREATE FULLTEXT INDEX books_fulltext_title_author_isbn_idx
     ON Books(title, author, isbn);
   ```
   It is not wired to any npm script. Not present in `prisma/schema.prisma` (Prisma does not
   model fulltext indexes), and **not present in `prisma/migrations/`**. A fresh database
   created from the schema alone will not have it.

2. **`ensureBackupTable()` in `src/app/actions/backup-actions.ts:7-28`** — runs
   `CREATE TABLE IF NOT EXISTS local_backup_records` at runtime. The app self-migrates that
   one table on first use.

### 7.4 Column names that differ from Prisma's default mapping

The schema uses `map:` to pin several DB-level names. These matter if you ever write raw SQL:

| Prisma field | DB column |
|---|---|
| `notification.accountId` | `account_id` (`@map("account_id")`) |
| `damagedbooks.account_id` | `account_id` (already matches) |
| `bookedition.bookId` | FK named `BookEdition_bookId_fkey` |

Index names in `@@index([...], map: "...")` all follow the `<Table>_<column>_fkey` pattern for
older tables — which is why the SQL looks like it uses `book_id` FK names while the Prisma field
is `bookId`.

---

## 8. How data actually gets written

All writes go through the server actions in `src/app/actions/` (see
[`03-api-layer.md`](./03-api-layer.md) and [`05-business-logic.md`](./05-business-logic.md)).
The patterns you'll see:

| Pattern | Example |
|---|---|
| **Explicit `updatedAt: new Date()`** | Every `update`/`create` sets it manually, because the models don't use `@updatedAt`. |
| **`where: { is_deleted: false }` on every read** | Not automatic — omitting it silently includes soft-deleted rows. |
| **Transactions for multi-table writes** | `approveOrder` decrements `bookeditionstores`, upserts `bookshopeditions`, sets `is_approved`, writes `allocation_summary`, and releases locks inside `prisma.$transaction(...)`. |
| **Manual quantity arithmetic** | Inventory is `Float`/`Int` arithmetic in JS, not DB triggers or constraints. There is no CHECK constraint preventing negative quantities anywhere. |
| **No unique-constraint upserts except where explicit** | `bookshopeditions` upsert uses `bookShopId_bookEditionId` as a manual composite key, which has **no DB unique index** backing it. |

### 8.1 Soft-delete and reads

Since `is_deleted` is opt-in per query, the risk of showing deleted data is real. The convention
is to filter at the top level only:

```ts
// typical
await prisma.books.findMany({ where: { is_deleted: false }, orderBy: { book_sort_index: "asc" }, include: { bookedition: true } });
```

Nested relations are **not** filtered — `include: { bookedition: true }` will return
soft-deleted editions unless you add `include: { bookedition: { where: { is_deleted: false } } }`.
When in doubt, check both.

---

## 9. Working with the data layer

### Do

- `import prisma from "@/lib/prisma"` — never `new PrismaClient()`.
- Filter `is_deleted: false` on every read, including nested relations.
- Set `updatedAt: new Date()` on every write.
- Use `prisma.$transaction(...)` for any write touching more than one table.
- Reach for `Promise.all` when a page needs several independent reads.

### Don't

- Don't edit `prisma/schema.prisma`. Ask the user.
- Don't run `prisma migrate dev` / `migrate deploy` / `db push` without explicit permission.
- Don't assume a migration exists for a table. It probably doesn't.
- Don't use `deletedAt` for anything — it defaults to `now()` at creation.
- Don't trust `Float` for money arithmetic across many rows.
- Don't rely on `@unique` for `account_email` — there isn't one.
- Don't add a new `as any[]` type — extend the existing local interface pattern instead, or
  flag it.

---

## 10. Summary of data-layer risks

| Risk | Location | Impact |
|---|---|---|
| Migrations cover 13/43 models | `prisma/migrations/` | Fresh DB from migrations is broken; schema must be provisioned manually |
| Fulltext index not in migrations or schema | `scripts/add-fulltext-index.sql` | Search silently degrades on a fresh DB |
| `is_deleted` not auto-filtered | every model | Deleted rows leak into reports if a query forgets |
| `deletedAt @default(now())` | ~30 models | The column is meaningless |
| `Float` for all money | everywhere | Rounding drift |
| No index on `orders`/`order_items`/`payments` high-volume columns | §6.3 | Dashboard performance degrades linearly with history |
| `locked_editions.order_id` FK conflict | `retail-purchase-actions.ts#createRetailPurchase` | Writes a retail-purchase id into an `orders` FK. Works only because the FK is not enforced at the DB level in production. Known blocker, also noted in `files-to-read/session-context.md`. |
| Dead columns and a dead table | `payments.*printer*`, `dashboardmenu` | Schema confusion; `dashboardmenu` should be deleted |
| Bare-Int references with no FK | `retail_purchases.created_by`, `printer_delivery_records.storeId`, `orders.delivered_by` | No referential integrity; require manual joins |
| Duplicate FK fields | `bookedition.book_id` + `bookId`, `translatorbook.book_id` + `bookId` | Querying the wrong one returns nothing |
| Typos in column names | `visiblitiy_to_printer`, `quantity_deliverd`, `price_per_peice`, `count_remning_for_transfer` | These **are** the real names. Do not "fix" them in queries. |

---

_Last reviewed: 2026-10-14._