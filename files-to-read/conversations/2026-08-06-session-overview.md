# Conversation — 2026-08-06 (project overview session)

## Summary
- Loaded full project context and read the entire codebase in detail.
- Startup routine completed: reviewed directory structure, session-context.md, and most recent conversation (2026-08-03-14-40-00).

## Key Decisions
- Deep-dived the full ordering flow (create → approve → deliver).
- **Built "Delete Order" for pending orders** in Manage Order details modal.

## Ordering Flow (studied in detail)
- **Create**: `OrderModal` (shared) → `createOrder()` (order-actions.ts:279). FIFO across editions, `getBookStockData` (store stock − locked). Creates order + order_items; optional `locked_editions` lock + CHECK payment.
- **Stock feed**: `searchBooks()` (transfer-actions.ts) returns `editionStock` (stock minus locked) + `hasStoreStock`.
- **Approval**: `approveOrder()` (order-actions.ts:593) transaction: deduct store/printer stock (guarded), upsert `bookshopeditions` with proportional paid (paidRatio × itemValue), rebuild order_items, delete locks, mark Approved, notify DDL + delivery accounts + delivery sample.
- **Deliver**: `markOrderDelivered()` sets delivery/delivered_by (must be approved first).
- **Types**: `order_type` "requested" | "on round". Debt via `getAllShopsDebt()` (orderDebt/roundDebt/prevDebt/lastOrderDebt).

## Blockers (unchanged)
- `payments.is_for_previous_debts` column missing; `prisma generate` needed for `locked_editions`.

## Delete Order Feature (implemented)
- `src/app/actions/order-actions.ts` → `deleteOrder(orderId)`: ADMIN-only, rejects approved orders. Transaction deletes `locked_editions` (releases locked stock), payments linked via `orderid` (num or ORD-n) + auto-created CHECK payment (checkId + PENDING), `order_items`, then the `orders` row. Activity log + revalidate.
- `ManageOrderDetailsModal.tsx`: "Delete Order" button in footer (pending only) → AlertDialog warning listing what gets reverted (locks released, payment removed, amounts undone) → confirm calls `deleteOrder`.
- `ManageOrdersPageContent.tsx`: new `onDeleted` prop removes the order from the client list and closes the modal.
- Verified: `npx tsc --noEmit` passes.

## Files Read (key infra)
- `src/middleware.ts` — cookie-based auth + role path map (ADMIN→/admin_dashboard, Delivery Account→/delivery_dashboard_full, Retail Shop→/retail_shop_dashboard, etc.)
- `src/lib/prisma.ts` / `retail-prisma.ts` — two Prisma clients (main + retail).
- `src/lib/module-mapping.ts` — catch-all dynamic route map for admin dashboard pages.
- `src/lib/dashboard-menu-config.ts` — full admin menu tree (stores, statistics, checks, printing, finance, document_management, settings…).

## Architecture Confirmed
- Next.js 15.5.15 (App Router, Turbopack) + React 19 + TypeScript + Prisma 6 (PostgreSQL) + Tailwind 4 + shadcn/ui + zod + zustand.
- **Main** schema client at `src/generated/prisma`; **retail** schema client at `src/generated/retail-prisma`.
- Dashboard apps: admin, delivery_dashboard_full, delivery_and_sales, retail_shop, sales_staff, inventory_manager, operation_manager, finance_officer, printer_full, viewer, translator.
- Server actions in `/src/app/actions/` (~40 files: order, payment, check, retail, printing, transfer, store, book, delivery…).

## Blockers / Reminders
- DB column `payments.is_for_previous_debts` still missing in DB (user handling manually) — pages depending on it 500 until added.
- `locked_editions` FK references `orders.id`; `npx prisma generate` needed before that feature works.