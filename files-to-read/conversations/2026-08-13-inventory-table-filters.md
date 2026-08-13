# 2026-08-13 — Store Inventory Table Filters

## Summary
Enhanced the store inventory table in the admin dashboard with filtering controls.

## Decisions
- **View mode toggle**: "Edition Based" (default) / "Book Based" radio buttons.
  - Book Based groups all editions of the same book into one row, summing quantity.
  - In Book Based mode the Actions column is hidden (edits still work per edition in Edition mode).
- **"0 units" checkbox**: default unchecked → rows with 0 units are hidden. Checking it reveals them.
- **Stock filter dropdown** (shadcn Select):
  - All (default), Low stock (<15), <50, <100, <200, Above 200 (>=200), 0 units.
  - "0 units" option always shows only zero-quantity rows regardless of checkbox.
- Book Based filter logic uses the summed per-book quantity (a book with total 0 shows under "0 units" only when sum is 0).

## Files Changed
- `src/app/admin_dashboard/stores/[id]/StoreInventoryTable.tsx`
  - Added imports: Checkbox, Select components.
  - New state: `viewMode`, `showZeroUnits`, `stockFilter`.
  - New `processedData` memo that aggregates per-book when in Book mode and applies filters.
  - Actions column conditionally included only in Edition mode.
  - Controls UI added above the search bar.
  - Table now renders `processedData` instead of raw `data`.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` on the file — only 3 pre-existing warnings (unused `error`/`difference`), no new issues.

## Blockers
- None.
