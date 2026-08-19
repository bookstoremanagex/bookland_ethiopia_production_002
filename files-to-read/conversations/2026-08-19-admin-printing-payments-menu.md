# Conversation — 2026-08-19 admin printing payments menu

## Summary
Added a new "Payments" menu under the Admin Printing section showing printer-linked payments (`is_for_printer = true`).

## Changes
- `src/app/admin_dashboard/printing/payments/page.tsx` — server page. Queries `payments` where `is_for_printer = true` and `is_deleted = false`, includes `printer`, `shop`, `check`; batch-fetches related `orders` (parsed from `orderid`) for order total/status; serializes records for the client table.
- `src/app/admin_dashboard/printing/payments/PrinterPaymentsTable.tsx` — TanStack/shadcn table (page size 15, pagination footer, mobile cards). Columns: Printer, Order, Shop, Amount, Status (Approved/Pending/Rejected badge), When, Printer Memo, Detail button. Detail opens a `Dialog` showing all fields (printer contact info, order info, shop, amount, type, status, check, created/updated, memo, printer memo, receipt image if present).
- `src/components/sidebar_components/admin_sideboard.tsx` — added "Payments" link (Banknote icon) to the Printing collapsible group, after "Delivery Records".

## Notes / dependencies
- Page will only return data after the `payments` table columns (`is_for_printer`, `printer_id`, `printer_payment_memo`) exist in the DB — the user is applying the ALTER TABLE themselves (columns were missing, causing the earlier "Failed to record payment" bug).
- Admin sidebar is static (not menu-management controlled), so no `dashboard-menu-registry` change needed.

## Verification
- `npx eslint` on the three files: only pre-existing `SidebarProvider` unused warning.
- `npx tsc --noEmit` clean.