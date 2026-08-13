# Conversation — 2026-08-12 (full project detailed read)

## Summary
- User asked to read the full project in detail; performed a full startup-routine context load and read the core codebase deeply.

## Key decisions
- No code changes; this session was a comprehensive read/context-loading session.

## Files read (key)
- Infra: `package.json`, `src/middleware.ts`, `src/lib/prisma.ts`, `src/lib/retail-prisma.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/store/*`, `src/lib/calendar-{context,utils}.ts`, `src/lib/server-calendar.ts`, `src/lib/dashboard-menu-config.ts`, `src/lib/module-mapping.ts`, `src/lib/seed.ts`, `src/lib/get-first-printer-name.ts`.
- Schemas: main via `src/generated/prisma/schema.prisma` (MySQL, ~40 models incl. accounts/books/bookedition/bookeditionstores/orders/locked_editions/printorder/retail_purchases/roundbooks/checks/payments), retail via `prisma/retail/retail_schema.prisma` (retail_books/reatil_book_editions/retail_orders/customers/users).
- Actions: order-actions.ts (createOrder/updateOrder/approveOrder/deleteOrder/removeBookFromOrder/getAllShopsDebt/getBookStockBreakdown/markOrderDelivered), transfer-actions.ts (searchBooks FULLTEXT + transferToStore + recordPrinterDeliveries), payment-actions.ts (createPayment/approvePayment/rejectPayment/setPaymentPending/deletePayment with linked-order-first distribution), auth-actions.ts (cookie session, accounts→printer→retail users fallback), retail-actions.ts (retail DB CRUD + importBookToRetail), retail-purchase-actions.ts (createRetailPurchase/approveRetailPurchase), delivery-actions.ts, dashboard-stats.ts.
- UI: ManageOrdersPageContent, ManageOrderDetailsModal (1784 lines, current focus area — allocation grid, custom/Store Info print modes, delete/edit order, advanced edition-qty editor), AddOrderModal, OrderModal (shared, tabs Select/Selected/Info, FIFO totals, auto/manual total), admin_sideboard.tsx.

## Architecture confirmed
- Next.js 15.5.15 App Router + Turbopack, React 19, TypeScript, Prisma 6 (MySQL, two clients), Tailwind 4, shadcn/ui, zod, zustand, framer-motion, @tanstack/react-table, sonner, ethiopian-date.
- Role dashboards: admin, delivery_dashboard_full, delivery_and_sales, retail_shop, sales_staff, inventory_manager, operation_manager, finance_officer, printer_full, viewer, retail_manager.
- ~40 server-action files in src/app/actions/.
- Ordering flow: OrderModal → createOrder (FIFO by earliest edition, lock_books → locked_editions) → approveOrder (deduct store/printer stock, upsert bookshopeditions with paidRatio, rebuild order_items, delete locks, notifications to DELIVERY_AND_SALES + per-account Delivery Account/Delivery Sample) → markOrderDelivered.
- Debt model: orderDebt + roundDebt + previousDebt + lastOrderDebt in getAllShopsDebt.

## Blockers / Reminders (unchanged)
- `payments.is_for_previous_debts` column still may be missing in DB.
- `npx prisma generate` must be run before locked_editions code works.
