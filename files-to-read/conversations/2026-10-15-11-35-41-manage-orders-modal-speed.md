# Conversation — 2026-10-15 11:35 — Speed up Manage Orders order-details modal

## Request
Admin dashboard → manage orders: opening an order's details takes a long time to load
the books. Find a way to keep the functionality but make it faster.

## Root cause
`loadStockBreakdowns` in `src/app/admin_dashboard/manage_orders/ManageOrderDetailsModal.tsx`
ran a **sequential** loop:

```ts
for (const ub of uniqueBooks) {
  const res = await getBookStockBreakdown(ub.bookId, editionsInOrder, order.id); // one action call each
}
```

So opening a dialog for an order with N books cost **N sequential server-action round trips**
plus **2N sequential queries** (`bookedition.findMany` with nested stores+printers, then
`locked_editions.findMany`). Latency scaled linearly with books per order.

Compounding: `locked_editions` has **no index at all** (documented in docs/02-data-layer.md
§6.3), so the lock lookup was a full table scan — once per book.

## Changes
- `src/app/actions/order-actions.ts`
  - Extracted `shapeEditionBreakdowns()` + `EditionBreakdownRow` + `STOCK_BREAKDOWN_INCLUDE`
    so the single-book and batched paths share one shaper and cannot drift.
  - `STOCK_BREAKDOWN_INCLUDE` now `select`s only `id/storeId/quantity/stores.name` (and the
    printer equivalent) instead of `include: { stores: true }` / `{ printer: true }`.
  - Added `getBookStockBreakdownsBatch(requests, excludeOrderId?)` — **≤3 queries total**
    regardless of book count. Returns `Record<String(bookId), EditionBreakdownRow[]>`, and
    every requested book gets a key even when it matched nothing.
  - `getBookStockBreakdown` kept and behaviour-identical (still used by the op-manager modal).
  - Books that restrict to specific `editionIds` are queried in a **separate bucket** from
    books wanting all editions — merging them into one `id IN (...)` would leak one book's
    unlisted editions into another's result.
- `src/app/admin_dashboard/manage_orders/ManageOrderDetailsModal.tsx`
  - `loadStockBreakdowns` now makes **one** batched call instead of the loop.
  - Import swapped to `getBookStockBreakdownsBatch`.
- `scripts/add-stock-breakdown-indexes.sql` (new, NOT run)
  - `locked_editions (editionId, status)` and `order_items (orderId)`.

## Gotcha found and fixed during verification
A bookId requested **both** scoped and unscoped landed in both query buckets, and the regroup
by `bookId` then **duplicated** its editions in the response. Caught by the randomized
equivalence test, not by inspection. Fixed by collapsing duplicate bookIds (first occurrence
wins) *before* bucketing. The admin modal can't produce this (`uniqueBooks` is a Map keyed by
bookId) but the action is exported and must be correct for any caller.

## Verified
- Randomized equivalence test (500 trials, throwaway script, since deleted): batch output is
  `deepStrictEqual` to the old per-book loop, including skipped books, empty `editionIds`,
  partial subsets, and duplicate bookIds.
- tsc clean; eslint shows only pre-existing findings (the 2 unused-`error` warnings at
  order-actions.ts:746/759 and the modal's 24 pre-existing warnings are all untouched code).

## Performance
| | before (N books) | after |
|---|---|---|
| server-action round trips | N (sequential) | 1 |
| queries | 2N sequential | ≤3 |
| `locked_editions` scans | N full scans | 1 (indexed after running the SQL) |

## Not done (needs a decision)
- `src/app/operation_manager_full_dashboard/manage-orders/ManageOrderDetailsModal.tsx` has the
  **identical** sequential loop at line 205 and still uses `getBookStockBreakdown`. Left alone
  because the request was admin-dashboard-specific. Same one-line swap applies.
- The SQL script is NOT run — AGENTS.md forbids prisma CLI and this touches the DB.

## Files changed
- src/app/actions/order-actions.ts
- src/app/admin_dashboard/manage_orders/ManageOrderDetailsModal.tsx
- scripts/add-stock-breakdown-indexes.sql (new)
- files-to-read/conversations/2026-10-15-11-35-41-manage-orders-modal-speed.md (new)

## Blockers
None.