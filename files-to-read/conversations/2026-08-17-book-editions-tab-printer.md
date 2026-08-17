# Conversation — 2026-08-17-book-details-editions-tab-printer-column

## Summary
User: in the book details → editions tab, the printer column shows wrong info. If not connected → show no printer; else show the correct (connected) printer.

## Root cause
`EditionsInfo.tsx` (all 4 dashboards: admin, operation_manager, inventory, viewer) computed:
```
const printerName = bep ? bep.printer?.name : edition.printorder_items?.[0]?.printorder?.printer?.name;
```
When the edition had no `bookeditionprinters`, it fell back to the first `printorder_items[0]` — which is typically the dummy "Auto-delivery" order carrying the arbitrary `printer.findFirst()` printer. So it showed a wrong/never-assigned printer.

## Fix
Removed the fallback in all 4 files (`: null;`). Printer column now shows:
- Connected printer (`bookeditionprinters[0].printer.name`) if connected.
- "Not Assigned" otherwise.

Files changed:
- `src/components/admin_dashboard_components/book_details/EditionsInfo.tsx`
- `src/components/operation_manager_full_dashboard_components/book_details/EditionsInfo.tsx`
- `src/components/viewer_dashboard_components/book_details/EditionsInfo.tsx`
- `src/components/inventory_dashboard_components/book_details/EditionsInfo.tsx`

## Round 2
User: "it is showing wrong info still in the printer column." Diagnosis: the DB has NO `bookeditionprinters` records at all, so after round 1 every edition showed "Not Assigned" — but the user expects the REAL project printer (H&F / MYBT / Mamush) where one exists. So "correct printer" = authoritative printer (connected OR real print order), and "no printer" only when there's no real attribution.

Fix:
- All four `EditionsInfo.tsx` now use `resolveEditionPrinterName({ connected, printorderItems })` from `@/lib/printer-utils`.
- Book-detail queries (`books/[id]/page.tsx` x4) now include ALL printorder_items ordered by createdAt desc (removed `take: 1` which could surface the dummy order).

Verified: tsc clean, eslint pre-existing warnings only.