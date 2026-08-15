# Conversation — 2026-08-15 (full project detailed read)

## Summary
- User asked to read the full project in detail; completed the startup-routine context load and dispatched 4 parallel exploration agents covering the entire codebase.

## Files/areas read
- Infra: `package.json`, `src/app/layout.tsx` (theme CSS vars from localStorage), `src/lib/prisma.ts` / `retail-prisma.ts` (two generated clients: `src/generated/prisma` + `src/generated/retail-prisma`), `src/middleware.ts` (role → dashboard redirect + cross-dashboard rewrite), `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `components.json`, retail schema (`prisma/retail/retail_schema.prisma`).
- Lib/store/hooks: `module-mapping.ts` (MODULE_MAP dynamic imports for catch-all dashboards), `dashboard-menu-config.ts` (full admin menu tree), `calendar-context.tsx` + `calendar-utils.ts` + `server-calendar.ts` (Ethiopian/Gregorian), `seed.ts` (menus + 46 roletypes + 50 books), validation schemas (book/store/translator/translation-project), `use-sidebar-store`, `use-editions-store`, `use-mobile`, `get-first-printer-name`, `relative-time`.
- Actions: all 40 files in `src/app/actions/` — order-actions (FIFO allocation, locks, approveOrder w/ store deduction), payment-actions (waterfall debt distribution), transfer-actions, store/printer-inventory-actions, retail-purchase-actions, check-actions, print-order-actions, retail-actions (second DB), etc.
- Admin dashboard: every route (manage_orders incl. 1802-line ManageOrderDetailsModal + 2711-line ManagePaymentDetailClient, book_shops, books/editions/damaged, stores, checks, printing, finance, statistics, retail-shop, retail_management, reports, production, document_management, round-books, notes, notifications, settings).
- Other dashboards: delivery_dashboard_full, delivery_and_sales_dashboard, delivery_sample_dashboard, printer_full, retail_shop_dashboard, retail_manager_dashboard, sales_staff_dashboard, inventory_manager_dashboard, finance_officer_dashboard(_full), operation_manager_dashboard(_full), viewer_dashboard — catch-all vs explicit-route split.

## Key decisions
- No code changes; pure read/context-loading session.

## Notable findings
- Two parallel dashboard "eras": catch-all `[...slug]` (GenericAppSidebar + MODULE_MAP → admin pages) vs explicit-route "full" dashboards (custom sidebars).
- `printer_dashboard_components/PrintTrackingSection.tsx` is dead code (no page imports it).
- Some `operation_manager_full_dashboard` sidebar/home links are dangling (no page files yet).
- Default calendar pref inconsistent: client defaults `ethiopian`, server defaults `gregorian`.
- `finance/page.tsx` and `delivery_sample/page.tsx` are placeholders.

## Blockers / Reminders (unchanged)
- `payments.is_for_previous_debts` column may still be missing in DB.
- `npx prisma generate` must be run before locked_editions code works (schema defined, client may be stale).