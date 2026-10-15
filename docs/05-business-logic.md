# 05 — Business logic

> **Scope:** the core modules and how they interact.
> See [`02-data-layer.md`](./02-data-layer.md) for models and
> [`03-api-layer.md`](./03-api-layer.md) for signatures and auth.

---

## 1. The central invariant

Everything in this system is built on **one derived quantity** and three stored buckets:

```
                    total_print_count                    (lifetime units printed)
                    ├─────────────────────────────────────────────┐
                    │                                             │
   alreadyTransferred = total_print_count − count_remning_for_transfer
                    │                                             │
                    ▼                                             ▼
    count_remning_for_transfer  ──────►  bookeditionstores.quantity      (sellable)
       "central stock"                       bookeditionprinters.quantity  (at printer)
```

| Bucket | Column | Meaning |
|---|---|---|
| **Printed run** | `bookedition.total_print_count` | Lifetime units of this edition printed |
| **Central** | `bookedition.count_remning_for_transfer` | Printed units **not** in a store, **not** at a printer, **not** sold, **not** damaged |
| **At store** | `bookeditionstores.quantity` | Sellable warehouse stock, per (edition, store) |
| **At printer** | `bookeditionprinters.quantity` | Stock held at / attributed to a printer |

`alreadyTransferred` is **derived, never stored**:

```ts
// edition-actions.ts:194, 256, 308 — repeated verbatim
const alreadyTransferred = oldTotal - (edition.count_remning_for_transfer || 0);
```

Every write to the central balance is expressed as a **shift** (`{ decrement: n }` /
`{ increment: n }`), never an absolute, specifically to preserve this identity. There are
**no DB triggers, no CHECK constraints, and no negative clamps** except where explicitly coded —
see §9 for the two places the identity breaks.

---

## 2. Module interaction map

```
                         ┌──────────────┐
                         │    books     │  catalogue
                         └──────┬───────┘
                                │ 1:N
                         ┌──────▼───────────┐
        ┌────────────────│   bookedition    │◄──────── the hub table; 11 referencing tables
        │                │  (prices + costs)│
        │                └───┬────┬────┬────┘
        │                    │    │    │
        │  ┌─────────────────┘    │    └──────────────────┐
        │  │                      │                       │
┌───────▼──▼───┐  ┌───────────────▼──────┐  ┌─────────────▼──────────────┐
│bookedition  │  │ bookeditionstores     │  │ bookeditionprinters       │
│  .stores     │  │   STORE INVENTORY     │  │   PRINTER STOCK           │
└───────┬──────┘  └───────┬───────────────┘  └─────────────┬──────────────┘
        │                │                                  │
        │          ┌─────▼──────────┐            ┌──────────▼──────────┐
        │          │   stores       │            │      printer        │
        │          └────────────────┘            └──────────┬──────────┘
        │                                                    │
        │                    ┌───────────────────────────────┘
        │                    │
        │         ┌──────────▼──────────────┐        ┌──────────────────┐
        └────────►│  printorder (project)  │───────►│ printorder_items  │
                  │  quality/status/tracking│        └────────┬─────────┘
                  └──────────┬──────────────┘                 │
                                │                    ┌─────────▼──────────────┐
                                │                    │ printer_delivery_records│
                                │                    └────────────────────────┘
                                ▼
        ┌────────────────┐   approveOrder   ┌──────────────┐
        │ bookshopeditions│◄────────────────│    orders     │
        │  shop holdings  │                 │  + order_items│
        │  already_paid   │                 └──────┬───────┘
        │  remaining_amt  │                        │
        └────────┬────────┘                        │ locks
                 │                    ┌────────────▼────────────┐
                 │                    │    locked_editions      │
                 │                    └─────────────────────────┘
                 ▼
        ┌────────────────┐
        │   bookshopes   │◄── payments ── checks
        │ previousDebt   │◄── roundrecords ── round_payments ── round_checks
        └────────────────┘
```

**Module ownership:**

| Module | Owns |
|---|---|
| `order-actions.ts` | Order lifecycle, **FIFO allocation**, approval, debt, stock locks |
| `payment-actions.ts` | Money in, debt deduction, reversals |
| `check-actions.ts` | Cheque register + the CLEARED cascade that releases order money |
| `store-inventory-actions.ts` | Store stock CRUD, store→store transfers, batch allocation |
| `transfer-actions.ts` | Central→store transfer, **delivery recording**, book search |
| `printer-inventory-actions.ts` | Central→printer movement |
| `print-order-actions.ts` | Print projects, items, print-count sync |
| `edition-actions.ts` | Editions, cost/price fields, print-count invariant, printer assignment |
| `retail-purchase-actions.ts` | Walk-in sales |
| `damaged-book-actions.ts` | Loss write-offs against central + stores |
| `round-books/actions.ts` (×2) | Consignment rounds |
| `book-shop-edition-actions.ts` | Direct shop↔edition holdings |

---

## 3. The order lifecycle

### 3.1 FIFO allocation — `getBookStockData`

The primitive every order path depends on.

```ts
// order-actions.ts:225-281
const editions = await prisma.bookedition.findMany({
  where: { bookId: id, is_deleted: false },
  include: { bookeditionstores: { where: { is_deleted: false } } },
  orderBy: { createdAt: "asc" },     // Earliest first for FIFO
});
```

**Net available per edition:**

```ts
const totalStock = ed.bookeditionstores.reduce((a, s) => a + (s.quantity || 0), 0);
const locked     = lockedMap[ed.id] || 0;
stock = Math.max(0, totalStock - locked);           // clamped at 0
```

where `lockedMap` sums `locked_editions.amount_locked` for rows with
`status: "locked"` and `is_deleted: false`.

⚠️ **Only `bookeditionstores` is summed — `bookeditionprinters` is not.** Printer-held stock is
invisible to order creation even though `approveOrder` can decrement it via
`allocations[].type === "printer"`.

`excludeOrderId` adds `order_id: { not: excludeOrderId }` to the **lock** query only — so when
reopening an existing order, its own reservations are released. Used by `updateOrder`,
`getBookStockBreakdown`, and `OrderModal` in edit mode.

Returns `{ id, name, price, stock }[]`; **zero-stock editions are not filtered out** — the caller
skips them.

### 3.2 `createOrder` — step by step

Input: `{ bookShopId, order_type, memo?, amount_paid, total_amount?, payment_type?, check_id?,
lock_books?, items: { bookId, quantity }[] }`

**Step 1 — FIFO fill loop.**

```ts
let totalAmount = 0;
for (const item of data.items) {
  const stockRes = await getBookStockData(item.bookId);
  let remainingToFill = item.quantity;
  const totalSystemStock = editions.reduce((a, e) => a + e.stock, 0);

  if (remainingToFill > totalSystemStock) throw new Error(
    `Insufficient aggregate stock for book ID ${item.bookId}. Requested ${remainingToFill}, Available ${totalSystemStock}`);

  for (const edition of editions) {
    if (remainingToFill <= 0) break;
    if (edition.stock <= 0) continue;
    const take = Math.min(remainingToFill, edition.stock);
    finalOrderItems.push({ bookEditionId: edition.id, quantity: take, price_at_order: edition.price });
    totalAmount += take * edition.price;
    remainingToFill -= take;
  }
  if (remainingToFill > 0) throw new Error(`Internal error: Could not fill order …`);
}
```

| Rule | Detail |
|---|---|
| Aggregate guard | per-**book** (`Σ edition.stock`), not per-edition |
| Allocation | greedy, **oldest edition first** |
| Rows | **one `order_items` row per (edition, partial-fill)** — a book split across 2 editions produces 2 rows |
| Total | `Σ take × edition.selling_price` across all items and editions |

**Step 2 — manual total override.**

```ts
if (data.total_amount != null) { totalAmount = data.total_amount; }
```

The override wins **unconditionally when non-null**, applied *after* the loop — so FIFO
allocation and row creation are unaffected; only the money changes. `0` also overrides.

**Step 3 — the order row.**

```ts
amount_paid: isCheckOrder ? 0 : (data.amount_paid || 0),
is_approved: false,
status: "Pending",
order_made_by_id: session?.id ?? null,
order_items: { create: finalOrderItems },
```

**Step 4 — upfront payment** (only when `amount_paid > 0`):

| | `orders.amount_paid` | `payments.status` | `payments.payment_type` | `orderid` |
|---|---|---|---|---|
| **DIRECT** | `data.amount_paid` | `"APPROVED"` | `"DIRECT"` | `String(order.id)` → `"42"` |
| **CHECK** + `check_id` | **`0`** | `"PENDING"` | `"CHECK"` | `String(order.id)` |

`orderid` is a **bare numeric string**. The `ORD-42` form exists only in `deleteOrder`'s legacy
match and `parseInt(orderid.replace(/^ORD-/i, ""))`.

⚠️ **Edge case:** `payment_type === "CHECK"` with a falsy `check_id` falls into the `else`
branch → creates a **DIRECT/APPROVED** payment while `order.amount_paid` stays `0`. Money
recorded, never applied.

The whole payment block is in its own `try/catch` — **failure does not fail the order.**

**Step 5 — stock locks** (when `lock_books`):

```ts
await prisma.locked_editions.createMany({
  data: finalOrderItems.map(item => ({
    editionId: item.bookEditionId,
    amount_locked: item.quantity,      // the FIFO-allocated qty, possibly a partial fill
    order_id: order.id,
    status: "locked",
  })),
});
```

One lock row per `order_items` row. Also in a swallowing `try/catch`.

**Step 6 — notification.** One notification, `type: "ORDER"`, `notification_to: "ADMIN"`,
title `` `New Order from ${shopName}` ``, `details = { shopName, placedBy, items, totalAmount,
orderId, orderType }`.

⚠️ The `items` strings index `data.items` with the `finalOrderItems` loop counter, clamped to the
last element — so a book split across editions is labelled with the same `bookId` twice.

**No activity log is written by `createOrder`.** **No transaction** — the order, payment and
locks are three independent commits.

### 3.3 `updateOrder` — the edit twin

Same FIFO loop, but `getBookStockData(item.bookId, orderId)` excludes the order's own locks.
Then, inside `$transaction({ timeout: 30000 })`:

1. `order_items.deleteMany({ orderId })` → re-create each FIFO row individually
2. `locked_editions.deleteMany({ order_id })` → `createMany` if `lock_books`
3. **CHECK payment sync** (only if `existing.check_id`):
   `payments.updateMany({ where: { checkId, payment_type: "CHECK", status: "PENDING", is_deleted: false }, data: { amount: data.amount_paid } })`
4. `orders.update` → `order_type`, `memo ?? existing.memo`, `total_amount`, `status: "Pending"`

⚠️ **`amount_paid: data.amount_paid` is written raw** — unlike `createOrder`, a CHECK order is
**not** zeroed here. This is a divergence between create and update.

Guards: `!session?.id` → `"Not authenticated"`; `is_approved` → `"Approved orders cannot be edited"`.
Writes an activity log: `` `Edited pending order ORD-${id} for ${shopName}` ``.

### 3.4 `approveOrder` — the heaviest write

Guards (in order): `session.role !== "ADMIN"` → `"Only administrators can approve orders"` ·
order missing → `"Order not found"` · `is_approved` → `"Order is already approved"` ·
`payment_type === "CHECK" && check_id` with `check.status !== "CLEARED"` →
`"The associated check must be cleared before this order can be approved."`

**Sanitization + new total (computed *outside* the transaction):**

```ts
const sanitized = allocations.map(a => ({ …, quantity: Math.round(Number(a.quantity)), price: Number(a.price) }));
let newTotal = 0;
for (const alloc of sanitized) newTotal += alloc.quantity * alloc.price;
```

`newTotal` **overwrites** `order.total_amount` at the end — replacing both the FIFO-derived
total and any manual override.

**Inside `$transaction({ timeout: 180000 })`:**

**(a) The paid-ratio and the collateral rule.**

```ts
const isCollateral  = order.checks?.type === "COLLATERAL";
const effectivePaid = isCollateral ? 0 : order.amount_paid;
const paidRatio     = order.total_amount > 0 ? effectivePaid / order.total_amount : 0;
```

> **Collateral never reduces debt.** If the order's linked check is `type: "COLLATERAL"`,
> `effectivePaid` is forced to `0` → `paidRatio = 0` → the shop's holdings receive the full item
> value as `remaining_amount`.

**(b) Per allocation:**

```ts
const itemValue     = alloc.quantity * alloc.price;
const itemPaid      = itemValue * paidRatio;
const itemRemaining = itemValue - itemPaid;
```

**Invariant: `already_paid + remaining_amount = total_price` per row.**

⚠️ The denominator is the **old** `order.total_amount` while the numerators are applied to
`newTotal`-based item values. If a manual override or a different store/edition mix changed the
total, `Σ itemPaid` no longer equals `order.amount_paid` — the shop ledger absorbs a paid
amount that doesn't match the order.

**(c) Guarded decrement** — no separate read; `updateMany` + `count === 0` as the guard:

```ts
const result = await tx.bookeditionstores.updateMany({
  where: { id: alloc.storeStockId, quantity: { gte: alloc.quantity } },
  data:  { quantity: { decrement: alloc.quantity }, updatedAt: new Date() },
});
if (result.count === 0) throw new Error(`Insufficient stock at store for edition ${alloc.bookEditionId}`);
```
(The `type === "printer"` branch does the same on `bookeditionprinters` and throws
`Insufficient stock at printer for edition …`.)

**(d) `bookshopeditions` upsert** — `findFirst({ bookShopId, bookEditionId, is_deleted: false })`
then `update` with four `{ increment }` atomics (`quantity`, `total_price`, `already_paid`,
`remaining_amount`), else `create`.

**(e) `order_items` rewrite** — `deleteMany({ orderId })` then one `create` per sanitized
allocation. The original FIFO rows are **destroyed and replaced**; multiple allocations for the
same edition produce multiple rows.

**(f) Lock release** — `locked_editions.deleteMany({ order_id, status: "locked" })`.

**(g) Finalize** — `is_approved: true`, `status: "Approved"`, `total_amount: newTotal`,
`allocation_summary: allocationSummary || null`. (`updatedAt` omitted — `orders` has `@updatedAt`.)

**Post-transaction:** `activityLogs` (`` `Approved shop order ORD-${id} for ${shopName}` ``) and
**three notification waves**:

| Wave | Target |
|---|---|
| 1 | role broadcast — `notification_to: "DELIVERY_AND_SALES"` |
| 2 | one per `accounts.account_type === "Delivery Account"` (`accountId` targeting) |
| 3 | one per `accounts.account_type === "Delivery Sample"` (`accountId` targeting) |

`allocationSummary` is free text persisted to `orders.allocation_summary` and re-parsed by the
print "Store Info" mode.

### 3.5 `deleteOrder` — the revert

ADMIN-only; `is_approved` → `"Approved orders cannot be deleted"`. Inside
`$transaction({ timeout: 30000 })`:

```ts
// 1. Release locked stock
tx.locked_editions.deleteMany({ where: { order_id: id } });

// 2. Remove payment records — TWO orderid formats
tx.payments.deleteMany({ where: { OR: [{ orderid: String(id) }, { orderid: `ORD-${id}` }] } });

// 2b. Remove the auto-created CHECK payment (recorded without orderid)
if (order.check_id) tx.payments.deleteMany({
  where: { checkId: order.check_id, payment_type: "CHECK", status: "PENDING", is_deleted: false } });

// 3-4. Delete items, then the order (cascades anything left)
tx.order_items.deleteMany({ where: { orderId: id } });
tx.orders.delete({ where: { id } });
```

⚠️ **Step 2b deletes by `checkId`, not by order.** If several pending orders share one check,
deleting any one of them wipes **all** pending CHECK payments for that check. Both `deleteMany`
calls are **hard** deletes, not soft.

### 3.6 Removing books from an order

Both `removeBookFromOrder` and `removeBooksFromOrder` are ADMIN-only and refuse approved orders.

```ts
const removedTotal = targetItems.reduce((sum, i) => sum + i.quantity * i.price_at_order, 0);

tx.order_items.deleteMany({ where: { id: { in: targetItems.map(i => i.id) } } });
tx.orders.update({ data: { total_amount: { decrement: removedTotal } } });
tx.locked_editions.deleteMany({ where: { order_id: id, editionId: { in: editionIds } } });
```

⚠️ Three consequences:
1. **Relative decrement** — it composes with (and can drift from) the original total; it does
   not recompute from the remaining items.
2. **`amount_paid` is untouched** — removing paid-for items can make an order "overpaid"
   (`amount_paid > total_amount`), which every debt query then skips via `unpaid <= 0`.
3. **Locks are released in full for those editions** — partial lock amounts are deleted, not
   decremented.

`removeBooksFromOrder` additionally coerces `bookIds` and returns
`{ removedTotal, removedItems }`.

### 3.7 `markOrderDelivered`

Guards in order: `!session?.id` → `"Not authenticated"` · missing → `"Order not found"` ·
`!is_approved` → `"Order must be approved first"` · already `delivery` →
`"Order already marked as delivered"`.

Writes `delivery: true, delivered_by: session.id` — **a pure flag flip, no stock or debt
mutation.** Then an activity log and one `ADMIN` notification.

---

## 4. Debt computation

### 4.1 The formula

`getShopTotalDebt(shopId)` and `getAllShopsDebt()` implement the same algorithm:

```
orderDebtTotal  = Σ { orders : order_type == "requested" ∧ is_approved ∧ unpaid > 0 }  unpaid
                  where unpaid = total_amount − amount_paid
roundDebt(orders)= Σ { orders : order_type == "on round" ∧ unpaid > 0 }                unpaid
roundDebt(records)= Σ { roundrecords : (totalprice − Σ APPROVED round_payments) > 0 }  remainder

lastRequestedOrder = newest order_type == "requested"  (createdAt DESC)
lastOrderDebt      = max(0, last.total_amount − last.amount_paid)
orderDebt          = max(0, orderDebtTotal − (last.is_approved ∧ lastOrderDebt > 0 ? lastOrderDebt : 0))
previousDebt       = max(0, shop.previousDebt − Σ APPROVED is_for_previous_debts payments)
totalDebt          = max(0, orderDebt + roundDebt + previousDebt + lastOrderDebt)
```

The subtract-then-add-back of `lastOrderDebt` is a **no-op for approved orders** — its only
purpose is to display the newest order's portion separately in the breakdown UI without
double-counting.

### 4.2 The two implementations disagree

| Component | `getShopTotalDebt` | `getAllShopsDebt` | Same? |
|---|---|---|---|
| `orderDebt` / `roundDebt` / `lastOrderDebt` / `orderDebtTotal` | as above | as above | ✅ |
| **`previousDebt`** | `max(0, shop.previousDebt)` — `const approvedPrevPayments: {amount:number}[] = []` is **hardcoded empty** (L56) and never populated | `max(0, shop.previousDebt − Σ APPROVED is_for_previous_debts payments)` | ❌ |
| Queries | 3 separate round-trips | 1 relational `findMany` | ❌ |
| Shape | flat object | `ShopDebtData[]`, `branch: shop.branch \|\| "Main"` | ❌ |

> The single-shop action **over-reports** `previousDebt` (and therefore `totalDebt`) by exactly
> the sum of that shop's APPROVED previous-debt payments.

**Two more divergent copies** exist:
- `admin_dashboard/book_shops/[id]/page.tsx:61-94` — inlined, matches `getAllShopsDebt` (does
  query `prevDebtPayments`).
- `admin_dashboard/manage_payment/[id]/page.tsx:117-137` — a **different, simpler** variant:
  no `lastOrderDebt` split, no `Math.max(0, …)` clamps, no `is_for_previous_debts` deduction,
  and `previousDebt` added **unconditionally**.

`getShopRemainingBalance(shopId)` is a fourth, much simpler one:
```
remaining = Σ total_amount − Σ amount_paid     over ALL non-deleted orders
```
No `order_type` split, no `is_approved` filter, no round records, no `previousDebt`.

### 4.3 Shared quirks in both main implementations

1. **Unapproved `requested` orders are invisible to `orderDebt`** — but the newest one still
   reaches `totalDebt` through `lastOrderDebt`, which is computed with no `is_approved` test.
2. **`on round` orders count whether or not approved.**
3. **`unpaid <= 0 → continue`** — overpaid orders are skipped entirely; there is no credit.
4. Only **`APPROVED`** `round_payments` reduce round debt.
5. `totalDebt` is clamped at 0, but `roundDebt` is not clamped in `getShopTotalDebt`.

---

## 5. Payments

### 5.1 `approvePaymentInternal` — strict per-order

⚠️ **Exported despite the `Internal` name** — clients can call it and bypass
`approvePayment`'s idempotency guard.

**Step 1 — status first, unconditionally:**

```ts
if (payment.status !== "APPROVED") await payments.update({ data: { status: "APPROVED" } });
```

**Step 2 — orderid parsing** (accepts both formats):

```ts
const orderIdNum = payment.orderid ? parseInt(payment.orderid.replace(/^ORD-/i, "")) : null;
```

**Step 3 — apply, with a three-fold lookup gate.** The order must satisfy **all** of:
`id === orderIdNum` ∧ `bookShopId === payment.shopId` (cross-shop guard) ∧ `is_deleted: false`.

```ts
const orderRemaining = (linkedOrder.total_amount || 0) - (linkedOrder.amount_paid || 0);
if (orderRemaining > 0) {
  const toApply = Math.min(payment.amount, orderRemaining);
  await orders.update({ data: { amount_paid: (linkedOrder.amount_paid || 0) + toApply } });
}
```

> **`toApply = Math.min(payment.amount, orderRemaining)`.** No waterfall across the shop's other
> orders — by design, per the source comment *"Strict per-order: only apply to the linked order"*.
> **Overpayment is silently truncated.**

**Step 4 — revert.** Any throw in step 3 → `payments.status = "PENDING"` and
`"Payment approved but failed to deduct from debt. Approval reverted."` No compensating
decrement on the order — the failure is assumed to occur before any successful write.

**Step 5 — side effects:** two notifications (`ADMIN` and `DELIVERY_AND_SALES`) + one activity
log + 3 `revalidatePath` calls (two target non-existent routes).

⚠️ The notification text *"has been approved and deducted from the debt"* is emitted **even when
nothing was deducted** — unlinked payment, or an order already fully paid.

### 5.2 `createPayment`

```ts
const approveImmediately = data.approve && data.payment_type === "DIRECT";
```

> **CHECK payments can never auto-approve**, even with `approve: true`. They stay `PENDING`
> until the check is `CLEARED`.

`is_for_previous_debts: data.is_for_previous_debts || null` → **`false` becomes `null`**, not
`false`. Printer fields are spread only when `is_for_printer` is truthy.

When auto-approving, `approvePaymentInternal` is called, producing a **second** pair of "Payment
Approved" notifications and a **second** activity log on top of the "New Payment" ones.

### 5.3 The three reversals

| Action | Status guard | Reversal | Transaction |
|---|---|---|---|
| `rejectPayment` | `"Cannot reject an approved payment"` | **none needed** — an APPROVED payment can't be rejected, so the order was never touched | no |
| `setPaymentPending` | — | `if (was APPROVED)`: parse orderid, find linked order, `toReverse = Math.min(payment.amount, paid)`, `amount_paid := paid − toReverse` | no |
| `deletePayment` | — | identical reversal, then `is_deleted: true` (no `deletedAt`) | no |

**Neither `setPaymentPending` nor `deletePayment` wraps its reversal in a transaction**, and the
reversal block is inside a **swallowing `catch (reverseError)`** — a failure there does not fail
the action, so the payment ends up reverted while the order keeps the applied amount.

⚠️ Both set the status **before** attempting the reversal.

---

## 6. The check cascade

`updateCheckStatus(checkId, status)` — session required, **no transaction**, `status` is an
unvalidated string.

### `"CLEARED"`

1. Approves every `payments` row with this `checkId` and `status: "PENDING"`.
2. For each such payment, loads the shop's **non-deleted orders ordered `createdAt ASC`** and
   FIFO-allocates:

   ```ts
   let remaining = payment.amount;
   for (const order of orders) {
     const orderRemaining = (order.total_amount || 0) - (order.amount_paid || 0);
     if (orderRemaining <= 0) continue;
     const toApply = Math.min(remaining, orderRemaining);
     await orders.update({ data: { amount_paid: (order.amount_paid || 0) + toApply } });
     remaining -= toApply;
     if (remaining <= 0) break;
   }
   ```

   ⚠️ **This IS a waterfall across orders** — unlike `approvePaymentInternal`, which is strict
   per-order. **Any remainder when the orders run out is silently dropped.**
3. Approves every linked `round_payments` with `status: "PENDING"`.
4. One `ADMIN` notification + an activity log naming the number of payments approved.

### `"DELIVERED"`

One `DELIVERY_AND_SALES` notification **plus one per `Delivery Account` account**, then an
activity log.

### `updateCheckDetails` — the amount lock

```ts
if (data.amount !== undefined && existing?.status !== "CLEARED") updateData.amount = data.amount;
```

**The amount is silently ignored for already-`CLEARED` checks.**

---

## 7. Printing

### 7.1 `syncEditionPrintCount` — the print-count recomputation

Non-exported (`print-order-actions.ts:257`), called from `createPrintOrder`, `updatePrintOrder`,
`deletePrintOrder` — **not** from `moveEditionToProject`.

```ts
const items = await tx.printorder_items.findMany({
  where: {
    bookEditionId: editionId,
    is_deleted: false,
    printorder: {
      is_deleted: false,
      OR: [
        { project_name: null },
        { project_name: { not: { startsWith: "Auto-delivery" } } },
      ],
    },
  },
  select: { quantity: true },
});

const printedSum = items.reduce((s, i) => s + (i.quantity || 0), 0);
if (printedSum === oldTotal) return;                        // early exit, no write

const diff       = printedSum - oldTotal;
const newCentral = Math.max(0, Number(edition.count_remning_for_transfer || 0) + diff);
await tx.bookedition.update({ data: { total_print_count: printedSum, count_remning_for_transfer: newCentral, updatedAt } });
```

| Step | Rule |
|---|---|
| Inclusion | item not deleted ∧ parent order not deleted ∧ (`project_name IS NULL` **or** doesn't start with `"Auto-delivery"`) |
| `total_print_count` | **absolute** = `printedSum` — **can increase or decrease** |
| `count_remning_for_transfer` | `Math.max(0, current + diff)` — **relative, clamped** |

⚠️ **The exclusion uses one prefix (`"Auto-delivery"`) while every JS-side detector uses two**
(`"Auto-delivery for"` and `"[Auto Delivery]"`). An order named `"[Auto Delivery] …"` would be
hidden from the printer UI but **counted** toward `total_print_count`. Nothing produces that name
today, so it's a latent trap.

⚠️ **The clamp is where the ledger identity can break.** If `diff` is more negative than the
current central balance, the excess is discarded. After that
`alreadyTransferred = total_print_count − count_remning_for_transfer` becomes **larger than the
true transferred amount**, and the `alreadyTransferred` guards in §8 start rejecting legitimate
edits.

### 7.2 `createPrintOrder`

`formData` is a **plain object, not `FormData`** (dotted-array access, `formData.items?.map(…)`).
Hardcodes `quality: "STANDARD"`, `edition: "MULTIPLE_EDITIONS"`; `status` defaults
`"NOT_STARTED"`; `total_price` falls back to `quantity × price_per_book`; `count` = `Σ item.quantity`.

⚠️ `parseInt(formData.printerId)` is **not** null-guarded — `NaN` reaches Prisma if absent.
⚠️ The order create is **outside** the transaction; only the `syncEditionPrintCount` pass is
inside, so a sync failure leaves the order created but returns `success: false`.

### 7.3 `updatePrintOrder` — item reconciliation

1. Read existing items → `{ id, bookEditionId }`.
2. Coerce price: `Number.isFinite(p) && p >= 0 ? p : 0` (*"Never send NaN to Prisma"*).
3. `totalPrice` = stated `total_price` if truthy and finite, else `quantity × safePrice`.
4. Split submitted items into `itemsToUpdate` (integer `item.id` that exists in `currentIds`) and
   `itemsToCreate`.
5. **`deleteMany` the rows not kept — a hard delete**, the only one in this file.
6. Individual `update` per kept row; `createMany` for new ones.
7. Collect affected edition ids from submitted, updated **and deleted** rows, then sync each.

### 7.4 `changeEditionPrinter` / `moveEditionToProject`

`changeEditionPrinter(data)` — in a 15 s transaction: re-point the order, sum the edition's
`bookeditionprinters.quantity`, soft-delete all those rows, then `findFirst` the new printer's
row and either `update` with `{ increment: totalQuantity }` + revive, or `create`. (A dead
`bookedition.findUnique` at the top selects `count_remening_for_transfer` and never uses it.)

`moveEditionToProject(data)` — merge vs move:

| Branch | Condition | Action |
|---|---|---|
| **Merge** | the edition already exists in the target (non-deleted) | `update` target with `{ increment: quantity }` + `{ increment: total_price }`, then **soft-delete the source row** |
| **Move** | otherwise | `update` the source row's `printorder_id` (keeps its PK) |

Then: recompute `printorder.count = Σ item.quantity` for target, migrate `bookeditionprinters`
stock to the target's printer (same soft-delete/revive dance), recompute `printorder.count` for
source.

⚠️ `moveEditionToProject` does **not** call `syncEditionPrintCount`, so `total_print_count` is
not recomputed even though quantities effectively move between orders.

### 7.5 The COMPLETED one-way lock

Both `updatePrintOrderItemStatus` and `updatePrintOrderStatus`:

```ts
if (current.status === "COMPLETED" && status !== "COMPLETED") {
  return { success: false, error: "Cannot revert a completed item" };  // or "...project"
}
```

`COMPLETED` is terminal. ⚠️ Neither function verifies the caller is a printer — any caller can
set any item's status by numeric id.

---

## 8. Editions

### 8.1 `updateEditionField` — the whitelist and the invariant

Whitelist: text `edition_name` · int `total_print_count`, `count_remning_for_transfer`,
`number_of_pages` · float `selling_price`, `cover_price`. Anything else →
`"Field cannot be edited here"`.

The `total_print_count` branch preserves the central balance:

```ts
const alreadyTransferred = oldTotal - (edition.count_remning_for_transfer || 0);
if (n < alreadyTransferred) return { success: false, error: `Total cannot be less than ${alreadyTransferred} (already transferred)` };
const newRemaining = (edition.count_remning_for_transfer || 0) + (n - oldTotal);
bookedition.update({ data: { total_print_count: n, count_remning_for_transfer: newRemaining } });
```

**Both columns in one `update`**, so it's atomic — the balance *shifts* rather than being reset.

⚠️ `count_remning_for_transfer` is **also** in the whitelist, so it can be written directly,
which is the second way the `alreadyTransferred` identity breaks.

`cover_price` with an empty value sets **`null`** (explicit clear).

### 8.2 `assignPrinterToEdition` — 3-step transaction

1. `bookedition.update` — `total_print_count` + `count_remning_for_transfer` shift, guarded by
   the same `alreadyTransferred` rule
2. `bookeditionprinters.updateMany({ is_deleted: true })` — soft-delete all existing links
3. if `printerId != null` → `bookeditionprinters.create({ quantity: data.totalPrintCount })`

### 8.3 Visibility to printers

- `toggleEditionVisibilityToPrinter(id)` — flips `visiblitiy_to_printer`
- `toggleProjectEditionsVisibilityToPrinter(orderId, visible)` — `printorder_items.findMany` →
  distinct `bookEditionId`s → one `bookedition.updateMany`

`getPrinterForSessionFull` and `getPrinterDeliveries` **both filter out** editions with
`visiblitiy_to_printer = false`, so an admin can hide an edition from the printer without
deleting it.

---

## 9. Inventory movement

### 9.1 Central → store — `transferToStore`

15 s interactive transaction, per transfer:

1. guard: `!edition || (count_remning || 0) < quantity` → throw `Insufficient stock for edition ID <id>`
2. `bookedition.update({ count_remning_for_transfer: { decrement: quantity } })`
3. store upsert — `findFirst({ storeId, editionId, is_deleted: false })` → `increment` or `create`
4. `recordPrinterDeliveries(tx, editionId, storeId, quantity)`

⚠️ **No `quantity > 0` guard.** A negative quantity passes the `<` check, then
`{ decrement: -5 }` **adds** 5 to central while **subtracting** 5 from the store. The UI filters
(`.filter(([_, qty]) => qty > 0)`) but the action does not.

⚠️ `findFirst` filters `is_deleted: false`, so a previously soft-deleted row for the same
(store, edition) is ignored and a **second physical row** is created.

### 9.2 `recordPrinterDeliveries` — the 7-step algorithm

Duplicated verbatim in `transfer-actions.ts:172` and `store-inventory-actions.ts:24`.

**1. Load candidate items** — `bookEditionId`, `is_deleted: false`, `createdAt DESC`, including
`printorder` and non-deleted `printer_delivery_records.quantity_deliverd`.

⚠️ `printorder` is included **raw** — a delivery under a soft-deleted order still counts as
"already delivered".

**2. Partition and order** — real items first (each group still `createdAt DESC`):

```ts
const realItems  = items.filter(i => !isAutoDeliveryOrder(i.printorder));
const dummyItems = items.filter(i =>  isAutoDeliveryOrder(i.printorder));
let orderedItems = [...realItems, ...dummyItems];
```

**3. Empty-set fallback — the printer resolution chain.**

| Tier | Source | Query |
|---|---|---|
| 1 | connected printer | `bookeditionprinters.findFirst({ editionId, is_deleted: false }, orderBy: { updatedAt: "desc" })` |
| 2 | most recent real order's printer | `printorder_items.findFirst(… orderBy createdAt desc)` — **unreachable**: only entered when there are no items, so it returns `null` |
| 3 | **arbitrary** | `printer.findFirst({ is_deleted: false })` — **no `orderBy`**, non-deterministic |
| 4 | bail | `console.warn("[recordPrinterDeliveries] No printer found…")` + `return` |

> ⚠️ **Tier 4 is a silent no-op.** The caller has already committed the central→store move, so
> **the stock transfer succeeds and the delivery record is simply lost.** The user sees a success
> toast. Only a server-side `console.warn` records it.
>
> Tier 2 is dead code; in practice the chain collapses to *connected printer → arbitrary printer*.

**4. The dummy order.**

```ts
printorder.create({ data: {
  project_name: `Auto-delivery for ${edition?.books?.title || `Edition #${editionId}`}`,
  printerId, status: "NOT_STARTED", quality: "STANDARD",
  edition: "SINGLE", count: quantity,
}});
printorder_items.create({ data: { printorder_id, bookEditionId, quantity, price_per_book: 0, total_price: 0, status: "NOT_STARTED" }});
```

(`edition: "SINGLE"` here vs `"MULTIPLE_EDITIONS"` in `createPrintOrder`.)

**5. Distribution loop.**

```ts
const alreadyDelivered = Σ record.quantity_deliverd;                    // per item, NOT per store
const maxDeliverable   = (item.quantity || 0) - alreadyDelivered;
if (maxDeliverable <= 0) continue;                                     // continue, not break
const deliverNow = Math.min(remainingToDeliver, maxDeliverable);
tx.printer_delivery_records.create({ data: { printorder_item_id: item.id, storeId,
  quantity_deliverd: deliverNow, approvedByPrinter: false, approvedByPrinterAt: null }});
remainingToDeliver -= deliverNow;
```

⚠️ `alreadyDelivered` is **per print-order item**, not per store. A second transfer of the same
edition to a *different* store sees the same figure — **capacity is consumed globally per item**.

**6. Overflow branch** — if quantity exceeds all items, create a **new** `printorder_items` row
on `realItems[0]?.printorder_id` (a **real** order) with the residue, plus one delivery row.

⚠️ Because it hangs off a real order and is immediately fully delivered,
**`syncEditionPrintCount` counts it** — the overflow branch re-inflates central stock. It is the
one place where a pure stock movement manufactures a new print run.

**7. Return** — `void`; called as the last statement of the caller's transaction.

⚠️ `quantity === 0` with no items still creates an `Auto-delivery for …` order with `count: 0`.
`assignEditionToStore` allows `quantity = 0` and calls unconditionally.

### 9.3 Store stock actions

| Action | Central delta | `recordPrinterDeliveries` |
|---|---|---|
| `assignEditionToStore` | `{ decrement: data.quantity }` | **always** (even 0) |
| `updateStoreInventory` | `{ decrement: diff }` | only `diff > 0`, with `current.storeId` |
| `deleteStoreInventory` | `{ increment: quantityToReturn }` | **never** |
| `transferToStore` | `{ decrement: quantity }` | **always** |
| `batchAssignEditionToStores` | `{ decrement: netDelta }` | per store, only `delta > 0` |
| `transferBetweenStores` | **none** | **never** |
| `transferToPrinter` | `{ decrement: quantity }` | **never** |

⚠️ **Reducing a store's quantity writes no reversal delivery record**, so the printer's delivery
ledger permanently over-reports what was sent to that store.

**Transaction form matters:** interactive/callback (`prisma.$transaction(async tx => …)`) when
`tx` must be threaded into `recordPrinterDeliveries` or the body branches; array form
(`prisma.$transaction([p1, p2])`) for fixed 2-statement writes.

### 9.4 `batchAssignEditionToStores` — the net-delta formula

```
netDelta = Σ_overStores ( newQuantity_s − oldQuantity_s )      oldQuantity from a pre-tx snapshot
```

- Guard is on the **net**, not per store: `netDelta > remaining` → `` `Net increase (${netDelta}) exceeds remaining for transfer (${remaining}).` ``
- Per store: **absolute** `quantity: s.quantity`
- Central written **once, last**: `{ decrement: netDelta }` (negative ⇒ units returned)
- `newRemaining` returned but **no `data`** key — unlike every sibling
- Client mirrors the same formula in `EditionsInfo.tsx:1007-1050` for live feedback

### 9.5 `transferBetweenStores`

- Source guard `quantity < 1` → throw `Invalid quantity for edition ID <id>`
- Availability `available < quantity` → throw `Insufficient stock: only ${available} available in source store for edition ID <id>`
- `newFromQty = available − quantity`; **exactly zero ⇒ zeroed *and* soft-deleted in one update**
- Destination upsert
- ❌ **Never touches `count_remning_for_transfer`** (never read, never written)
- ❌ **Never calls `recordPrinterDeliveries`**, writes no `printer_delivery_records`

> A store→store move is **invisible to the printer** and creates no approval obligation.

### 9.6 Printer inventory — the absolute-write hazard

`transferToPrinter` uses a **relative** `{ decrement: quantity }` (safe). But
`updatePrinterInventory` and `deletePrinterInventory` use **absolute** values:

```ts
bookedition.update({ data: { count_remning_for_transfer: remaining - diff } })      // stale JS value
bookedition.update({ data: { count_remning_for_transfer: remaining + quantityToReturn } })
```

> `remaining` was read **before** the transaction. Two concurrent calls on the same edition
> **lose one delta**. The store equivalents do not have this bug — the hazard is inconsistent
> *within* `printer-inventory-actions.ts`.

---

## 10. Printer attribution

Two pure helpers in `src/lib/printer-utils.ts`:

```ts
export function isAutoDeliveryOrder(projectName: string | null | undefined): boolean {
  const name = projectName || "";
  return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
}
```

```ts
/** 1. connected printer (bookeditionprinters)
 *  2. most recent real (non-auto-delivery) print order's printer
 *  3. — deliberately NULL, never a dummy order's printer — */
export function resolveEditionPrinterName(source: EditionPrinterSource): string | null
```

`getEditionAuthoritativePrinters(editionIds)` (`printer-resolution.ts`) wraps step 2 in a Prisma
query and returns `Map<editionId, printerName>`; editions with no resolution are **omitted from
the map** rather than mapped to `null`.

⚠️ `isAutoDeliveryOrder` is reimplemented as a local closure in **four** action files on top of
this canonical copy.

---

## 11. Other flows

### 11.1 `reorderBooks`

```sql
UPDATE books SET book_sort_index = CASE unique_identification_code WHEN ? THEN ? … END
WHERE unique_identification_code IN (?,?,…)
```

Single `$executeRawUnsafe` with bound parameters (only the `CASE`/`IN` placeholders are
interpolated). `id` is the `unique_identification_code`, **not** the numeric PK. One implicit
transaction — no explicit `$transaction` needed.

### 11.2 Damaged books

**`getEditionDamageSources(editionId)`** — the book title, every store with `quantity > 0`
(`{ storeStockId, storeId, storeName, available }`), and
`centralAvailable = Math.max(0, count_remning_for_transfer)`.

**`createDamagedBookReport(data, allocations = [])`** — tx 30 s:

- Validation: `allocations` must sum to `count`, else
  `` `Allocation total (${allocatedSum}) must equal damaged count (${totalCount})` ``
- Per allocation: `"central"` → `bookedition.count_remning_for_transfer: { decrement }`,
  else `bookeditionstores.update({ quantity: { decrement } })`
- `damagedbooks.create({ store_id: <first non-central allocation's storeId> })` —
  `printer_id` and `account_id` are **never written**
- Empty `allocations` falls back to `{ sourceType: data.store_id ? "store" : "central" }`

**`refundDamageStock` / `deductDamageStock`** — `count <= 0` returns; `storeId == null` targets
central, else the store row (`findFirst` → `update`, or `create` if the row is gone).
`deductDamageStock` **throws**:
`` `Insufficient untransferred stock: only ${available} available at central` `` /
`` `Insufficient stock at store for ${count} units` ``.

**`updateDamagedBookReport`** — refund old → deduct new → update, all in one tx. Order matters.
**`deleteDamagedBookReport`** — refund + soft delete; **does not set `deletedAt`**.

⚠️ The entire module has **no auth** — anyone can write off stock.

### 11.3 Retail purchases (walk-in)

`createRetailPurchase(data: { name?, date?, memo?, amountPaid?, lock_books?, items: {editionId,
quantity, unitPrice}[] })` — session required. Creates the header + nested items at
`status: "PENDING"`, optionally creates `locked_editions`.

⚠️ **It writes the retail-purchase id into `locked_editions.order_id`**, an FK to `orders.id`.
Works only because the FK isn't enforced. Known blocker, also recorded in
`files-to-read/session-context.md`.

`approveRetailPurchase(purchaseId, allocations)` — session required; guards `"Purchase not
found"` and `"Only pending purchases can be approved"`, then decrements store stock per
allocation and advances the status.

`updateRetailPurchasePayment(id, …)` — advances `PENDING → PARTIALLY_PAID → PAID` against
`total_amount` vs `amount_paid`.

### 11.4 Rounds (consignment / on-credit)

Two action modules: `delivery_dashboard_full/round-books/actions.ts` (14 functions, creation
side) and `admin_dashboard/round-books/actions.ts` (8 functions, approval side).

**Lifecycle:**

```
createRoundBook({ bookId, editionId?, starting_amount? })     → roundbooks.status = true (active)
  └─ getBooksForRound()   only books with store stock
  └─ getAvailableShops(roundBookId)   shops without a roundrecord yet

allocateRoundBook(roundId, allocations: {editionId, storeId, storeStockId, quantity, type}[])
  guards: "Round not found" · "Cannot allocate while round is active" (status) · "Already allocated"
          · "No books to allocate"   → sets roundbooks.allocated = true

createRoundRecord(data)       → roundrecords (per shop slice), status "PENDING"
createRoundCheck(data)        → round_checks
createRoundPayment(data)      → round_payments, status "PENDING"
approveRoundPayment(paymentId) → status "APPROVED"
payFullShop(roundRecordId)    guards: "Round record not found" · "No amount to pay" ·
                                         "Shop is already fully paid"
payAndApproveAllShops(roundId, recordIds?)   guards: "Round not found"
getRoundDeductData(roundId)   → the deduction sources
approveDeduction(roundId, allocations: {sourceKey, quantity}[])   guards: "Round not found"
updateRoundBook(id, { starting_amount?, returned_amount?, status? })
updateRoundCheckStatus(checkId, status)
deleteRoundBook(id) · deleteRoundPayment(paymentId)
```

**Round debt folds into shop debt** via the `roundrecords` term of the debt formula (§4.1): only
**APPROVED** `round_payments` reduce it.

**⚠️ Both modules have zero auth checks**, including `allocateRoundBook`, `approveDeduction`,
`payFullShop` and `payAndApproveAllShops` — i.e. money can be marked paid by any caller.

### 11.5 Translation

`createTranslationProject` is one of only 4 actions with zod validation on create
(`translationProjectSchema`). `updateTranslationProject` **has no zod** and applies fields only
`if (data.x)` — so **`0` is silently ignored**, and it logs the full payload twice via
`console.log`.

`updateTranslationProjectStatus(projectId, status)` casts `status as any`, so arbitrary strings
reach the `translatorbook_Status` enum column.

---

## 12. Cross-cutting invariants and where they break

| Invariant | Maintained by | Breaks when |
|---|---|---|
| `alreadyTransferred = total_print_count − count_remning_for_transfer` | shift-style writes in `edition-actions.ts`, `store-inventory-actions.ts`, `transfer-actions.ts` | `syncEditionPrintCount`'s `Math.max(0, …)` clamp discards a negative delta |
| | | `updateEditionField` writes `count_remming_for_transfer` directly (it is whitelisted) |
| | | `printer-inventory-actions.ts` update/delete write **absolute** stale values |
| `already_paid + remaining_amount = total_price` per `bookshopeditions` row | `approveOrder` | a manual `total_amount` override or a changed allocation mix changes `Σ itemPaid` away from `order.amount_paid` |
| `Σ(store qty) + central = total_print_count` | relative decrements | `recordPrinterDeliveries` overflow attaches to a **real** order and is counted by `syncEditionPrintCount` |
| No negative stock | explicit `quantity >= 0` / `>= 1` guards in most actions | `transferToStore` has **no** `quantity > 0` guard — a negative quantity moves stock the wrong way |
| `Sync` between `total_print_count` and print items | `syncEditionPrintCount` | `moveEditionToProject` and `changeEditionPrinter` never call it |
| Printer attribution is the connected printer | `resolveEditionPrinterName` | `recordPrinterDeliveries` tier 3 stamps an **arbitrary** printer on the dummy order |

---

## 13. Risk table

| Risk | Location | Impact |
|---|---|---|
| `getShopTotalDebt` never reduces `previousDebt` | `order-actions.ts:56` | The single-shop debt screen over-reports debt by the sum of APPROVED previous-debt payments |
| `approveOrder` `paidRatio` uses the **old** total | `order-actions.ts:907-914` | `Σ itemPaid` ≠ `order.amount_paid` whenever the total changed |
| `approvePaymentInternal` truncates overpayment silently | `payment-actions.ts:166-169` | Money received ≠ money applied; the notification claims it *was* deducted |
| `updateCheckStatus("CLEARED")` drops the remainder | `check-actions.ts` | Unapplied money vanishes with no record |
| `setPaymentPending` / `deletePayment` reversals aren't transactional | `payment-actions.ts` | Swallowed `catch` leaves the payment reverted but the order still holding the amount |
| `deleteOrder` step 2b deletes by `checkId` | `order-actions.ts:1390` | Deleting one order wipes pending CHECK payments for **all** orders sharing that check |
| `deleteOrder` hard-deletes `payments` | `order-actions.ts:1390` | Irreversible money-record deletion |
| `removeBook(s)FromOrder` doesn't touch `amount_paid` | `order-actions.ts:1273` | Order can become "overpaid" and vanish from every debt query |
| `createOrder` has no transaction | `order-actions.ts:350-420` | Order succeeds with payment and/or locks silently missing |
| `CHECK` + falsy `check_id` creates a DIRECT/APPROVED payment at `amount_paid = 0` | `order-actions.ts:377-391` | Money recorded, never applied to the order |
| `recordPrinterDeliveries` tier 3 uses unordered `printer.findFirst()` | `transfer-actions.ts:225` | Arbitrary printer stamped on dummy orders (the root of the long-running printer-mismatch bug) |
| `recordPrinterDeliveries` tier 4 silently skips recording | `transfer-actions.ts:243` | Stock moves but the printer ledger loses the record; user sees success |
| `recordPrinterDeliveries` `alreadyDelivered` is per item, not per store | `transfer-actions.ts:281` | A second delivery to a different store sees the first store's consumption |
| The overflow branch re-inflates `total_print_count` | `transfer-actions.ts:310-337` | A pure stock movement manufactures a print run |
| `recordPrinterDeliveries` duplicated verbatim ×2 | two files | Fixes must be applied twice |
| `syncEditionPrintCount` exclusion prefix differs from the JS detector | `print-order-actions.ts:264` vs `printer-utils.ts` | `"[Auto Delivery] …"` orders would be hidden from printers but counted |
| `syncEditionPrintCount` clamp breaks `alreadyTransferred` | `print-order-actions.ts:290` | Legitimate later edits start being rejected |
| `printer-inventory-actions.ts` absolute writes | `:95, :129` | Lost-update race on concurrent edits |
| `transferToStore` has no positive-quantity guard | `transfer-actions.ts:310` | A negative quantity **adds** to central and subtracts from the store |
| Store reductions write no reversal delivery record | §9.3 | The printer's ledger permanently over-reports |
| `updateOrder` doesn't zero `amount_paid` for CHECK | `order-actions.ts:608` | Diverges from `createOrder`; CHECK orders get double-counted paid |
| `moveEditionToProject` never syncs print counts | §7.4 | `total_print_count` drifts from the item sum |
| `updateEditionField` exposes `count_remning_for_transfer` in the whitelist | §8.1 | Anyone can desynchronise the central balance |
| Round money actions have no auth | §11.4 | `payFullShop` / `payAndApproveAllShops` callable by anyone |
| Damaged-book write-offs have no auth | §11.2 | Arbitrary stock destruction |
| `retail_purchase` writes a purchase id into an `orders` FK | §11.3 | Breaks if the FK is ever enforced |
| `searchBooks` FULLTEXT falls back silently to `LIKE` on any error | `transfer-actions.ts:42` | No telemetry; the index may be missing on a fresh DB |
| `searchBooks` `totalCount` is the page length | `transfer-actions.ts:139` | Pagination renders exactly one page |
| `updateTranslationProject` ignores falsy values and double-logs payloads | `translation-project-actions.ts:99,111` | Can't set a field to `0`; PII in server logs |
| `reorderBooks` fires one `revalidatePath` per item | `book-actions.ts:307` | O(n) cache invalidation on a large reorder |

---

_Last reviewed: 2026-10-14._