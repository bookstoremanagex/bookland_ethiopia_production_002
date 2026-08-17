# Conversation — 2026-08-17-no-fake-default-printer-in-delivery-records

## Summary
User: in admin dashboard delivery records, "why is it showing the default printer is set up to some printer before i add it?" — a printer name appeared even though the edition was never assigned one.

## Root cause
`resolveEditionPrinterName` (src/lib/printer-utils.ts) had a last-resort fallback to the FIRST item's print order printer (`items[0]`). For editions whose only print order items are dummy "Auto-delivery" orders, that printer is the arbitrary `printer.findFirst()` (first printer in DB = Mamush). So delivery records / printing info showed a "default" printer that was never actually assigned.

Additionally, call sites used `(isAutoDelivery ? authoritative ?? null : null) || order.printer.name || ...` — so when authoritative resolution returned null, they still fell back to the dummy order's stored printer.

## Fix
- `resolveEditionPrinterName`: removed the dummy-order fallback → returns null unless connected printer or a REAL (non-auto) print order's printer exists.
- Tightened all call sites so auto-delivery records never fall back to the dummy order's printer:
  - `src/app/actions/delivery-actions.ts` (getDeliveryRecords)
  - `src/app/admin_dashboard/printing/delivery-records/page.tsx`
  - `src/app/operation_manager_full_dashboard/printing/delivery-records/page.tsx`
  - `src/app/admin_dashboard/printing/info/page.tsx`
  - `src/app/operation_manager_full_dashboard/printing/info/page.tsx`
  - `src/app/admin_dashboard/books/editions/[id]/EditionDetailsClient.tsx` (removed `printorder_items[0]` fallback)

Now an edition with no assigned/real printer shows "Unknown"/"—" instead of the first printer in the DB.

## Verification
- `npx tsc --noEmit` clean; eslint 0 errors (pre-existing warnings only).

## Next
- Repair script for existing dummy orders still pending user go-ahead (sample + main DB via --db-url).