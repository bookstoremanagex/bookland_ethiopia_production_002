# Conversation Log — 2026-08-16 (full project detailed read)

## Summary
- User asked to read the full project in detail. Completed startup routine (glob, session-context, last conversation) and dispatched 4 parallel exploration agents covering the entire codebase.

## Areas read
- **Infra/core**: package.json (Next 15.5.15, React 19.1, Prisma 6.19.3, Tailwind v4), two Prisma clients (main + retail, both MySQL), middleware role→dashboard map (12 roles), Ethiopian/Gregorian calendar system (client default ethiopian, server default gregorian), MODULE_MAP (78 entries), menu config, zustand stores, zod schemas, seed.ts (menus + 49 roletypes + 50 books), API routes.
- **Actions**: all 41 files in `src/app/actions/` — order-actions (FIFO allocation, locks, approveOrder w/ stock deduction), payment-actions (waterfall debt distribution), transfer-actions, store-inventory-actions, retail-purchase-actions, check-actions, print-order-actions, retail-actions (second DB), etc.
- **Admin dashboard**: every route (manage_orders incl. 1802-line ManageOrderDetailsModal, manage_payment incl. 2711-line ManagePaymentDetailClient, books/editions/damaged, book_shops, stores, checks, printing, finance, statistics, reports, production, retail-shop, retail_management, round-books, document_management, notes, notifications, settings, activity_log, profile).
- **Other dashboards**: both eras — catch-all `[...slug]` (viewer, sales_staff, inventory_manager, retail_manager, operation_manager, delivery_and_sales, delivery_sample, finance_officer via GenericAppSidebar + MODULE_MAP) vs full explicit-route (delivery_dashboard_full, finance_officer_full_dashboard, operation_manager_full_dashboard, printer_full, retail_shop_dashboard).

## Key decisions
- No code changes; pure read/context-loading session.

## Notable findings (highest-value)
- **DB is MySQL** (schema.prisma), not PostgreSQL as AGENTS.md/session-context claim; `transfer-actions.searchBooks` uses MySQL FULLTEXT `MATCH...AGAINST`.
- **Non-atomic payment distribution** in payment-actions/check-actions/updateShopTotals/updateShopDebt — multi-order update loops not in transactions; partial failure leaves drift.
- **Dead variable bug**: `getShopTotalDebt` has `approvedPrevPayments = []` never populated → previous-debt never reduced (getAllShopsDebt does it correctly).
- **New retail books created with `deletedAt: now`** (retail-actions createRetailBook + importBookToRetail).
- **Unsigned session cookie** with role trusted from client; many money actions gated only by session presence.
- **CHECK payment not linked to order** (no orderid) → waterfall pays oldest debts first when check clears.
- **finance/page.tsx and delivery_sample/page.tsx are placeholders**; operation_manager_full_dashboard sidebar has ~11 dangling links; PrintTrackingSection.tsx is dead code.
- `npx prisma generate` required before locked_editions code works; `payments.is_for_previous_debts` column may be missing.

## Blockers / Reminders
- Never modify `prisma/schema.prisma`; never run prisma CLI/git commit without permission.
- `npx prisma generate` must be run before locked_editions code works.