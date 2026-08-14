# Conversation — 2026-08-14 (full project detailed read)

## Summary
- User asked to read the full project in detail; performed the full startup-routine context load and re-read the core codebase deeply.

## Key decisions
- No code changes; this session was a comprehensive read/context-loading session.

## Files read (key)
- Infra: `package.json`, `src/middleware.ts`, `src/app/layout.tsx` (theme CSS vars from localStorage), `src/app/page.tsx`, `src/lib/prisma.ts` (generated client at `src/generated/prisma`), `src/lib/retail-prisma.ts` (`src/generated/retail-prisma`), `src/lib/calendar-context.tsx` (Ethiopian/Gregorian).
- State/config: `src/store/use-editions-store.ts`, `src/store/use-sidebar-store.ts`, `src/lib/dashboard-menu-config.ts` (full admin menu tree), `src/lib/module-mapping.ts` (dynamic page imports for catch-all dashboards).
- Actions: `order-actions.ts` (FULL — getShopTotalDebt/getAllShopsDebt/getBookStockData/createOrder/updateOrder/approveOrder/deleteOrder/removeBookFromOrder/getBookStockBreakdown/markOrderDelivered), `auth-actions.ts` (accounts→printer→retail fallback login, cookie session), `transfer-actions.ts` (FULLTEXT searchBooks + transferToStore + recordPrinterDeliveries), `retail-purchase-actions.ts` (createRetailPurchase/approveRetailPurchase).
- UI (focus area): `ManageOrderDetailsModal.tsx` (FULL, 1802 lines — store-allocation grid, Auto-Fill, ignore book, edition qty override, remove book, custom/Store Info print modes, RecordPaymentModal wiring, delete/edit order, advanced op dialog), `ManageOrdersPageContent.tsx` (FULL, 615 lines — tanstack table, mo_page localStorage pagination restore).
- Conversations: 2026-08-12 full read, 2026-08-13 inventory filters, 2026-08-13 new edition form (5 sub-sessions).

## Architecture confirmed
- Next.js 15.5.15 App Router + Turbopack, React 19, Prisma 6 (two generated clients: main DB + retail DB), Tailwind 4, shadcn/ui, zod, zustand, framer-motion, @tanstack/react-table, sonner, ethiopian-date, xlsx, tiptap.
- ~42 server-action files in `src/app/actions/`.
- Role dashboards (12): admin, delivery_dashboard_full, delivery_and_sales, delivery_sample, retail_shop, sales_staff, inventory_manager, operation_manager(_full), finance_officer(_full), printer_full, viewer, retail_manager.
- Ordering flow: OrderModal/AddOrderModal → createOrder (FIFO by earliest edition, optional lock_books → locked_editions) → ManageOrderDetailsModal approval (per-edition per-store allocation, allocation_summary text) → approveOrder (deduct store/printer stock, upsert bookshopeditions, rebuild order_items, delete locks, notifications to DELIVERY_AND_SALES + per-account Delivery Account/Delivery Sample) → markOrderDelivered.
- Debt model: orderDebt + roundDebt + previousDebt + lastOrderDebt (getShopTotalDebt / getAllShopsDebt).

## Blockers / Reminders (unchanged)
- `payments.is_for_previous_debts` column may still be missing in DB.
- `npx prisma generate` must be run before locked_editions code works (schema defined, client may be stale).
