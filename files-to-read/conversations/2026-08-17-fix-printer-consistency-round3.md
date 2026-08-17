# Conversation — 2026-08-17-fix-printer-consistency (round 3)

## Summary
User reported printer values still inconsistent between `/printing/list` and `/printing/delivery-records` (and `/printing/info`).

## Diagnosis (via scripts/diagnose-printer-mismatch.mjs + diagnose-record-printers.mjs)
- There are **no `bookeditionprinters` records at all** in the DB — so the "connected printer" fallback was empty for every edition.
- All dummy `Auto-delivery for <book>` print orders were created with `printer.findFirst()` → always **"Mamush Printing"** (first printer in the table).
- Real projects are Mamush / H&F / MYBT. E.g. edition 143 (EMOTIONAL INTELLIGENCE) is printed at H&F (real project) but its delivery record sits under a dummy order → showed Mamush. This is the mismatch vs printing/list.

## Fix
New shared lib `src/lib/printer-resolution.ts`:
- `isAutoDeliveryOrder(projectName)` — dummy-order detection.
- `resolveEditionPrinterName(source)` — canonical priority: connected printer (`bookeditionprinters`) → most recent real (non-auto) print order's printer → any print order's printer.
- `getEditionAuthoritativePrinters(editionIds)` — DB helper returning editionId → authoritative printer name.

Applied to (both admin + operation_manager where applicable):
- `printing/info/page.tsx` — auto-delivery items resolve via authoritative map.
- `printing/delivery-records/page.tsx` — auto-delivery records resolve via authoritative map.
- `printing/list/page.tsx` — NOT_IN_PROJECT editions now show resolved printer instead of empty.
- `actions/delivery-actions.ts` `getDeliveryRecords` — same resolution for per-edition lookup.

Also updated `scripts/fix-auto-delivery-printers.mjs` to fall back to the edition's most recent real project printer (since no bookeditionprinters exist). Run `node scripts/fix-auto-delivery-printers.mjs` to correct the underlying data.

## Files changed
- `src/lib/printer-resolution.ts` (new)
- `src/app/admin_dashboard/printing/info/page.tsx`
- `src/app/admin_dashboard/printing/list/page.tsx`
- `src/app/admin_dashboard/printing/delivery-records/page.tsx`
- `src/app/operation_manager_full_dashboard/printing/info/page.tsx`
- `src/app/operation_manager_full_dashboard/printing/list/page.tsx`
- `src/app/operation_manager_full_dashboard/printing/delivery-records/page.tsx`
- `src/app/actions/delivery-actions.ts`
- `scripts/fix-auto-delivery-printers.mjs`
- `scripts/diagnose-printer-mismatch.mjs`, `scripts/diagnose-record-printers.mjs` (diagnostic; can be deleted)

## Fix (round 4 — edition detail page)
User asked to fix the edition detail page's "connected printer". `EditionDetailsClient.tsx` picked `bookeditionprinters[0].printer || printorder_items[0].printorder.printer` — `printorder_items[0]` could be a dummy Auto-delivery order (wrong printer).
- Split client-safe pure helpers into `src/lib/printer-utils.ts` (`isAutoDeliveryOrder`, `resolveEditionPrinterName`).
- `printer-resolution.ts` now imports/re-exports those and keeps prisma-based `getEditionAuthoritativePrinters`.
- `EditionDetailsClient.tsx`: connected printer now skips auto-delivery print orders — `bookeditionprinters[0].printer` → first real (non-auto) print order's printer → any print order's printer.

## Verification
- `npx tsc --noEmit` clean.
- eslint: 0 errors (only pre-existing unused-import warnings).

## Blockers
- Data mutation (repair script) not yet run — waiting for user confirmation.
