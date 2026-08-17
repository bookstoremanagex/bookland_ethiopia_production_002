# Conversation — 2026-08-17-main-db-repair

## Summary
User connected the main DB and asked what to run.

## What was run (main DB)
1. `node scripts/diagnose-printer-mismatch.mjs` (read-only) — schema OK; main DB has NO `bookeditionprinters` records; many dummy "Auto-delivery" orders stamped with arbitrary first printer (Mamush).
2. `node scripts/fix-auto-delivery-printers.mjs` (mutates) —
   - Fixed 2 dummy orders: PO34 (edition 143), PO54 (edition 131) → printerId 1 -> 3 (H&F).
   - Skipped 46 dummy orders: those editions have no real print project and no connected printer → nothing to attribute; they display as no/unknown printer.

## Notes
- Editions with real MAMUSH project already matched (dummy printerId == Mamush) → no change.
- Remaining dummy orders for editions with NO real project keep Mamush in the raw data (unknown attribution), but the app code resolves them as no/unknown printer.
- Code changes still need deploying to the app/server that serves the main DB.

## Next
- Deploy code changes; no further DB work required.