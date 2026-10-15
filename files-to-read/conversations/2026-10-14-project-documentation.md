# Conversation — 2026-10-14 Project documentation (Overview + Architecture)

## Summary
Started a structured technical documentation set under `docs/`. Built one document at a time:
Overview first, then Architecture.

## Request
Create a `docs/` folder with markdown files for: Overview, Architecture, Data layer, API layer,
Auth & permissions, Business logic, Config & environment, Conventions. Build one by one.

## Docs created
- `docs/README.md` — index of all 8 planned documents with status markers.
- `docs/00-overview.md` — what the app does, domain flow, 7 roles, 12 feature areas, tech stack,
  notable architecture decisions, top-level layout, local run instructions, scripts table, new-dev
  orientation, known rough edges.
- `docs/01-architecture.md` — folder structure + decision rule for where files go, the two action
  file conventions, duplication strategy, naming conventions, request flow diagram, middleware
  specifics, server vs client census, 4 data-fetching patterns, rendering strategy numbers, forms,
  caches, theming, "adding a feature" recipe, architecture risk table.

## Key findings worth remembering
- DB is **MySQL** (not PostgreSQL as AGENTS.md claims).
- No `fetch()` anywhere in `src/` — server actions are used as RPC for BOTH reads and writes.
- 47× `force-dynamic`, 0 loading.tsx, 0 error.tsx, 0 useActionState, 0 generateStaticParams.
  Everything renders dynamically on every request; `router.refresh()` is the only working
  invalidation.
- `revalidatePath` has 159 call sites but is effectively a no-op (targets are all force-dynamic).
- ~40% of .tsx files are duplicated copies (130 byte-identical + 30 diverged). Highest-risk
  4× forks: `book_details/EditionsInfo.tsx` (admin 1072L vs 1048L in the other 3),
  ShopDistributionList, StoresList, TranslationInfo. 2× fork:
  `ManageOrderDetailsModal.tsx` (admin 1969L vs ops 1936L).
- 11 finance_officer_dashboard pages are 1-line re-exports of admin pages; `src/lib/finance-nav.ts`
  bridges the hrefs.
- Middleware imports Prisma → `runtime = 'nodejs'`, DB connection on every request (10s menu cache).
- `/api` is excluded from the middleware matcher → all 3 route handlers unauthenticated.
- No ThemeProvider; theming is CSS vars + a blocking inline script in root layout.
- Migration caveat: prisma/migrations covers only ~13 of 43 models.

## Files changed
- ADDED `docs/README.md`
- ADDED `docs/00-overview.md`
- ADDED `docs/01-architecture.md`
- ADDED `docs/02-data-layer.md` (Prisma/MySQL: singleton, 43 models in 9 domains, hub table is
  `bookedition` with 11 referencing tables, 11 enums, migration gap, indexes)
- ADDED `files-to-read/conversations/2026-10-14-project-documentation.md`

## Round 2 — Data layer
- Wrote `docs/02-data-layer.md`. Read `prisma/schema.prisma` (900 lines, READ ONLY, NOT modified —
  user gave explicit go-ahead).
- Key schema facts recorded: 43 models / 11 enums; `bookedition` is the hub (11 referencing
  tables); 2 real unique keys on books (unique_identification_code, book_sku); NO unique on
  accounts.account_email; soft-delete `is_deleted` is opt-in per query; `deletedAt @default(now())`
  is meaningless; `updatedAt` is manual (no @updatedAt) on ~39 of 43 models; money is Float.
- Duplicate FK columns confirmed: `bookedition.book_id` (orphan) + `bookedition.bookId` (real);
  same in `translatorbook`.
- Real column typos that must be used verbatim in queries: `visiblitiy_to_printer`,
  `quantity_deliverd`, `price_per_peice`, `count_remning_for_transfer`.
- `printer_delivery_records.storeId`, `retail_purchases.created_by`, `orders.delivered_by` are bare
  Ints with NO FK relation. `payments.orderid`, `round_payments.orderid`, `books.default_edition_id`,
  `printorder.edition` are Strings, not FKs.
- `payments` has 5 dead printer columns annotated "not using these fields as of 2026-08-23".
  `dashboardmenu` table is fully dead (superseded by menus + menu_management).
- Confirmed migrations = 12 folders, only 13 of 43 models. FULLTEXT index exists only as
  `scripts/add-fulltext-index.sql`, not in migrations nor schema.

## Blockers / notes
- Prisma schema was read-only accessed by subagents and directly; NOT modified.
- Still to write: 04 Auth & permissions, 05 Business logic, 06 Config &
  environment, 07 Conventions.

## Round 3 — API layer
- Wrote `docs/03-api-layer.md`. Used 4 parallel explore agents + a targeted PowerShell
  signature/auth/error extraction pass to cover all 51 action files + 3 route handlers.
- Scale: 50 "use server" modules, ~318 exported functions. No shared ActionResult type
  anywhere — every action returns an inline inferred object literal.
- Five real return shapes documented: {success,data}, {success,count} (never fails),
  {success,enabled} (checkCurrentUserRole), {success} only (~60 mutations),
  {success,data:null} with NO error key (getLastBackupTime).
- Four auth patterns in actions: (A) role gate on session.role, (B) session presence only,
  (C) checkCurrentUserRole permission, (D) none. ~30 of 41 modules have ZERO auth.
- 9 permission names in use: Adding/Editing/Deleting Books, Adding/Editing/Deleting BookShops,
  Adding/Editing/Deleting Stores. Plus "Viewing Books" at RSC level.
- Route handlers: GET /api/editions (no auth, 200 on error), POST /api/upload-check-image and
  /api/upload-payment-image (no auth, no size/MIME check, public Blob bucket).
- Key undocumented-until-now findings: approvePaymentInternal is exported despite the name;
  recordPrinterDeliveries duplicated verbatim in store-inventory-actions.ts:24 and
  transfer-actions.ts:172; isAutoDeliveryOrder defined in 5 places; deleteOrder hard-deletes
  payments; searchBooks totalCount is the page size; getShopTotalDebt vs getAllShopsDebt
  disagree; generateSqlDump caps PK-less tables at 100 rows.

## Files changed (cumulative)
- ADDED docs/README.md … docs/05-business-logic.md
- ADDED files-to-read/conversations/2026-10-14-project-documentation.md

## Round 5 — Business logic
- Wrote `docs/05-business-logic.md`. Used 2 parallel explore agents with "quote the real code
  expressions" instruction + a targeted read of edition-actions updateEditionField,
  printer-utils.ts, printer-resolution.ts, reorderBooks.
- Central invariant found: alreadyTransferred = total_print_count − count_remning_for_transfer
  (derived, never stored). All central-balance writes are SHIFTS ({decrement}/{increment}) to
  preserve it. Breaks in exactly 3 places (documented in §12).
- Debt formula documented with exact arithmetic + the getShopTotalDebt vs getAllShopsDebt
  divergence (L56 hardcoded empty approvedPrevPayments) + 2 more divergent inline copies.
- approveOrder: paidRatio = (COLLATERAL ? 0 : amount_paid)/old_total; itemPaid = itemValue ×
  paidRatio; itemRemaining = itemValue − itemPaid; newTotal overwrites order.total_amount.
- approvePaymentInternal is strict per-order (no waterfall) and TRUNCATES overpayment;
  updateCheckStatus("CLEARED") DOES waterfall and DROPS the remainder. Direct contradiction.
- Key new findings: CHECK + falsy check_id in createOrder creates a DIRECT/APPROVED payment
  while order.amount_paid stays 0; updateOrder does NOT zero amount_paid for CHECK (diverges
  from createOrder); deleteOrder step 2b deletes payments by checkId (wipes sibling orders');
  recordPrinterDeliveries tier 2 is unreachable dead code, tier 4 silently skips recording;
  recordPrinterDeliveries alreadyDelivered is per-ITEM not per-store; the overflow branch
  attaches to a REAL order so syncEditionPrintCount counts it (re-inflates stock);
  printer-inventory-actions update/delete use ABSOLUTE stale writes (lost-update race) while
  the store equivalents use relative; transferToStore has no quantity>0 guard;
  store reductions write no reversal delivery record; syncEditionPrintCount's DB filter uses
  only the "Auto-delivery" prefix while the JS helper uses two.

## Files changed (cumulative)
- ADDED docs/README.md … docs/05-business-logic.md

## Round 4 — Auth and permissions
- Wrote `docs/04-auth-and-permissions.md`. Read dashboard-menu-registry.ts + auth-actions.ts
  in full; extracted the 48-entry roleTypes seed array and every checkCurrentUserRole call site
  via grep.
- Documented THREE (actually four) independent auth systems: session cookie, dashboard routing
  (rolePathMap), menu on/off (404 gate), fine-grained permissions (roletypes/roles).
- MAJOR BUG FOUND: 5 call sites pass snake_case permission names that do NOT exist in the
  roletypes table, so checkCurrentUserRole returns enabled:false and those UI gates ALWAYS DENY
  for non-ADMIN users:
    * ReportDamageButton.tsx:73 "adding_damaged_books" (real: "Add DamagedBooks")
    * StoreInventoryTable.tsx:82 "adding_stores" (real: "Adding Stores")
    * BookShopManagement.tsx:59 "adding_book_store" (real: "Adding BookShop")
    * CreateCheckButton.tsx:34 "adding_checks" (real: "Create Check")
    * book_details/ShopDistributionList.tsx:150 x4 copies "adding_edition" (no such permission)
- 48 permissions seeded but only 10 are enforced by any server action; 38 are dead UI toggles.
- addAccountAction auto-grants 8 view permissions (10 strings in the array) on creation.
- Session is unsigned JSON with no server-side store -> cannot revoke; 7-day maxAge never
  refreshed. No AUTH_SECRET exists anywhere.
- Printer resolved by session.email via getPrinterForSessionFull; but getPrinterDeliveries /
  approveDelivery trust the caller-supplied printerId.
- middleware rolePathMap has only 6 entries (no Printer) and is duplicated at L55-62 and L114-121.
  getRedirectPath has 10 entries including 3 routes that don't exist (sales_staff_dashboard,
  delivery_and_sales_dashboard, delivery_sample_dashboard).

## Round 6 — Config and environment
- Wrote `docs/06-config-and-environment.md`. Verified .env keys, root file listing, absence of
  vercel.json/.nvmrc/Dockerfile/.env.example/.npmrc, read verify-prisma-engines.mjs,
  check-database.mjs, load-env.mjs, pnpm-workspace.yaml, .gitignore, and measured
  src/generated/prisma = 33 files, 151,918,667 bytes (152 MB).
- CONFIRMED: only 3 env vars referenced anywhere — DATABASE_URL, BLOB_READ_WRITE_TOKEN,
  BCRYPT_SALT_ROUNDS (+4 build-script-only vars: REQUIRE_DATABASE, DATABASE_CHECK_TIMEOUT_MS,
  CHECK_DATABASE_ON_BUILD, VERCEL/CI). No AUTH_SECRET of any kind.
- CONFIRMED: createLocalBackup returns the ENTIRE SQL dump string to the browser
  (`data: { id, fileName, fileSizeBytes, content: dump.sql }`) — nothing written to disk.
- Repo size issue quantified: 5 x 21.2 MB `query_engine-windows.dll.node.tmpNNNNN` files
  (106 MB of stale download leftovers) + 21.2 MB real engine + 17.5 MB RHEL engine
  + 3.1 MB index.d.ts, all committed to git.
- 3 scripts write to the DB with no dry-run/confirm: backfill-total-print-count,
  backfill-legacy-totals, fix-auto-delivery-printers.
- pnpm-workspace.yaml has NO workspace packages (only ignoredBuiltDependencies).

## Files changed (final cumulative)
- ADDED docs/README.md
- ADDED docs/00-overview.md, 01-architecture.md, 02-data-layer.md, 03-api-layer.md,
  04-auth-and-permissions.md, 05-business-logic.md, 06-config-and-environment.md,
  07-conventions.md
- ADDED files-to-read/conversations/2026-10-14-project-documentation.md
- ALL 8 DOCS COMPLETE.

## Round 7 — Conventions (final)
- Wrote `docs/07-conventions.md`. Measured: 3 action files omit the semicolon on "use server";
  prisma imported 100x via @/ alias vs 28x relative; toast.error 605 vs toast.success 232;
  console.log 12 (stray debug), console.error 196, console.warn 5.
- Styling token counts measured: font-black 5307, uppercase 4571, tracking-widest 3590,
  rounded-xl 1802.
- Git commit style: lowercase one-liners, usually "update: ...". Branch is main.
- Doc includes the full 6-step adding-a-feature recipe, a code review checklist, a "things not
  to do" table, and a quick-reference lookup table.
- ALL 8 PLANNED DOCUMENTS WRITTEN AND INDEXED.

## !! SECURITY ISSUE FOUND — NOT WRITTEN INTO THE DOCS !!
The `origin` remote URL embeds a live GitHub personal access token:
  https://ghp_<token>@github.com/bookstoremanagex/bookland_ethiopia_production_002.git
This token is in the local .git/config, so it is NOT committed, but it IS exposed to anything
that reads .git/config and it leaks into `git remote -v` output and any `git push` invocation
that echoes the URL. Flagged to the user. Recommended fix: revoke the token, then
  git remote set-url origin https://github.com/bookstoremanagex/bookland_ethiopia_production_002.git
and configure credentials via a credential manager instead.

## Round 8 — Admin user guide
- Created docs/How to use the admin/ with exactly 6 files (the user's max).
- Used 3 parallel explore agents to map the admin sidebar, Home dashboard, Settings pages, and the
  operational workflows (books/stores/orders/printing/checks/finance/statistics/documents).
- Files: README.md (index + daily routine + full menu map + known problems),
  01-getting-started-and-settings.md, 02-books-editions-stores.md, 03-printing.md,
  04-orders-shops-and-payments.md, 05-finance-reports-and-documents.md.
- Tone: non-technical, uses the app's actual UI labels verbatim, ⚠️ for mistakes/gotchas,
  💡 for tips, plus quick-reference tables at the end of each file.
- Key UI facts discovered: finance/page.tsx is a placeholder rendering the literal word "page";
  there is NO /admin_dashboard/settings index (the "Back to Settings" button 404s); delete-book
  redirects to /admin_dashboard/inventory which doesn't exist; printing/payments is not in the
  sidebar; the admin sidebar spells "Document Managment" (missing e); low-stock threshold is 500;
  auto-fill-all re-sorts book cards in the approval modal; payment approval is STRICT per-order
  (no waterfall) while check CLEARED DOES waterfall; collateral cheques never reduce debt.