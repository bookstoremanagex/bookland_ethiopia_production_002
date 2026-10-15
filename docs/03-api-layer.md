# 03 — API layer

> **Scope:** every route handler and server action — inputs, outputs, auth requirements, errors.
> See also [`01-architecture.md`](./01-architecture.md) (rendering) and
> [`02-data-layer.md`](./02-data-layer.md) (models).

---

## 1. The three doors

| Door | Count | Registered as | Auth at the edge |
|---|---|---|---|
| **Server Actions** | 50 files, ~318 exported functions | `"use server"` at line 1 of the module | Per-function (inconsistent — see §4) |
| **Route handlers** | 3 | `export async function GET/POST` in `src/app/api/*/route.ts` | **None** — `/api` is excluded from the middleware matcher |
| **Direct Prisma in RSCs** | 57 server `page.tsx` files | — | Middleware only |

**There is no REST API and no GraphQL layer.** "The API" is the union of the server actions.

### 1.1 Inventory

| Module | Exported fns | `"use server"` | Auth coverage |
|---|---:|---|---|
| `actions/order-actions.ts` (1,593 L) | 22 | ✅ | 4 role-gated, 3 session-gated, **15 open** |
| `actions/print-order-actions.ts` (652 L) | 14 | ✅ | **0 — fully open** |
| `actions/store-inventory-actions.ts` (592 L) | 8 | ✅ | **0 — fully open** |
| `actions/payment-actions.ts` (480 L) | 12 | ✅ | Session only, **no role check** |
| `actions/edition-actions.ts` (397 L) | 10 | ✅ | **0 — fully open** |
| `actions/transfer-actions.ts` (412 L) | 3 | ✅ | **0 — fully open** |
| `actions/book-actions.ts` (348 L) | 6 | ✅ | 4 permission-gated, 2 open |
| `actions/retail-purchase-actions.ts` (270 L) | 6 | ✅ | Session only |
| `actions/damaged-book-actions.ts` (292 L) | 5 | ✅ | **0 — fully open** |
| `actions/backup-actions.ts` (278 L) | 3 | ✅ | 2 × ADMIN, 1 open |
| `actions/check-actions.ts` (261 L) | 7 | ✅ | Session only |
| `actions/statistics-actions.ts` (198 L) | 3 | ✅ | **0 — fully open** |
| `actions/printer-shop-payment-actions.ts` (154 L) | 7 | ✅ | Session only |
| `actions/menu-actions.ts` (172 L) | 6 | ✅ | **0 — fully open** |
| `actions/top-sellers-actions.ts` (138 L) | 1 | ✅ | **0 — fully open** |
| `actions/printer-delivery-actions.ts` (138 L) | 2 | ✅ | Ownership check |
| `actions/translation-project-actions.ts` (150 L) | 8 | ✅ | **0 — fully open** |
| `actions/notification-actions.ts` (133 L) | 5 | ✅ | **0 — fully open** |
| `actions/invoice-actions.ts` (140 L) | 6 | ✅ | **0 — fully open** |
| `actions/notes-actions.ts` (129 L) | 5 | ✅ | **0 — fully open** |
| `actions/printer-inventory-actions.ts` (118 L) | 3 | ✅ | **0 — fully open** |
| `actions/auth-actions.ts` (128 L) | 4 | ✅ | n/a |
| `actions/book-shop-actions.ts` (120 L) | 6 | ✅ | 4 permission-gated |
| `actions/contract-actions.ts` (116 L) | 5 | ✅ | **0 — fully open** |
| `actions/dashboard-stats.ts` (104 L) | 5 | ✅ | **0 — fully open** |
| `actions/approval-document-actions.ts` (110 L) | 5 | ✅ | **0 — fully open** |
| `actions/delivery-note-actions.ts` (110 L) | 5 | ✅ | **0 — fully open** |
| `actions/print-agreement-actions.ts` (110 L) | 5 | ✅ | **0 — fully open** |
| `actions/menu-seed-actions.ts` (103 L) | 1 | ✅ | **0 — fully open** |
| `actions/book-shop-edition-actions.ts` (93 L) | 3 | ✅ | **0 — fully open** |
| `actions/delivery-actions.ts` (82 L) | 1 | ✅ | **0 — fully open** |
| `actions/printer-actions.ts` (78 L) | 5 | ✅ | **0 — fully open** |
| `actions/translator-actions.ts` (85 L) | 3 | ✅ | **0 — fully open** |
| `actions/store-actions.ts` (70 L) | 3 | ✅ | 3 permission-gated |
| `actions/printer-full-actions.ts` (63 L) | 1 | ✅ | Session email match |
| `actions/get-daily-report.ts` (46 L) | 1 | ✅ | **0** |
| `actions/get-period-report.ts` (45 L) | 1 | ✅ | **0** |
| `actions/settings-actions.ts` (39 L) | 2 | ✅ | **0** |
| `actions/get-books.ts` (29 L) | 1 | ✅ | **0** |
| `actions/activity-log-actions.ts` (24 L) | 1 | ✅ | **0** |
| `actions/get-stores.ts` (18 L) | 1 | ✅ | **0** |
| `admin_dashboard/round-books/actions.ts` (560 L) | 8 | ✅ | **0** |
| `delivery_dashboard_full/round-books/actions.ts` (467 L) | 14 | ✅ | **0** |
| `admin_dashboard/settings/accounts/add_account/actions.ts` | 1 | ✅ | **0** |
| `admin_dashboard/settings/accounts/[id]/actions.ts` | 5 | ✅ | **0** |
| `admin_dashboard/profile/actions.ts` | 3 | ✅ | Session-derived id |
| `viewer_dashboard/profile/actions.ts` | 3 | ✅ | Session-derived id |
| `inventory_manager_dashboard/profile/actions.ts` | 3 | ✅ | Session-derived id |
| `printer_full/profile/actions.ts` | 3 | ✅ | Session-derived id |
| `delivery_dashboard_full/profile/actions.ts` | 2 | ✅ | Session-derived id |
| `delivery_dashboard_full/books/actions.ts` | 1 | ✅ | **0** |

---

## 2. Conventions every action follows

### 2.1 Return shape — there is no shared type

**No file declares `ActionResult<T>`, no `interface`, no generic.** Every function returns an
inline object literal whose TypeScript type is *inferred*, producing a loose union:

```ts
{ success: boolean; data: T;    error?: undefined }   // happy path
{ success: boolean; data?: undefined; error: string } // failure
```

⚠️ `success` is `boolean`, **not** a discriminated literal — consumers cannot narrow without
casting, which is why `as any` appears at ~130 call sites.

### 2.2 The five real return shapes

| Shape | Example | Notes |
|---|---|---|
| `{ success, data }` / `{ success, error }` | most actions | The default |
| `{ success, count }` | `getPendingOrdersCount`, `getPendingPaymentsCount`, `getUnreadCount` | **Never returns `success: false`.** The catch also returns `{ success: true, count: 0 }` |
| `{ success, enabled }` / `{ success, enabled, error }` | `checkCurrentUserRole` | `{ success: true, enabled: false }` when there's no session — i.e. *absent* is not an error |
| `{ success }` only (no `data`) | `approveOrder`, `deletePrintOrder`, `rejectPayment`, `deleteContract` | ~60 mutations. **Callers that expect `data` get `undefined`** |
| `{ success, data: null }` — **no `error` key** | `getLastBackupTime` | `catch { return { success: false, data: null } }` |

### 2.3 Silent-success read actions

Four read actions return `success: true` with an empty array when the DB throws, so callers
cannot distinguish "no rows" from "query failed":

```ts
// getNotifications — notification-actions.ts:46
// getNotes        — notes-actions.ts:32
// getActivityLogs  — activity-log-actions.ts:22
```

`getEnabledMenuNamesForRole` and `getUnreadCount` have the same shape but omit `data`/`error`
entirely on failure.

### 2.4 Error handling

Universal pattern, in every file:

```ts
try { ... return { success: true, data }; }
catch (error) {
  console.error("…:", error);
  return { success: false, error: error?.message || "Failed to …" };
}
```

**Actions never throw to the client** — even `Error`s thrown inside `$transaction` callbacks
are caught by the outer `try` and surfaced as `error: error.message`.

Three leak styles, in descending order of frequency:

| Style | Example |
|---|---|
| Static literal | `error: "Failed to fetch orders"` |
| Template with runtime values | `` error: `Failed to create edition: ${error.message}` `` |
| **Raw `error.message` passed through** | `error: error.message \|\| "Failed to create print order"` — leaks Prisma messages and, in `searchBooks`, a full SQL fragment |

### 2.5 Revalidation and refresh

- `revalidatePath(path)` / `revalidatePath(path, "layout")` — **159 call sites**, all
  hard-coded. Effectively inert because every target route is `force-dynamic`
  (see [`01-architecture.md` §6.3](./01-architecture.md)).
- **Some paths don't exist**: `/sales_staff_dashboard`, `/delivery_and_sales_dashboard`,
  `/delivery_sample_dashboard`, `/printer_dashboard` (the real folder is `printer_full`).
- `revalidateTag` — **0 uses**.
- The mechanism that actually works is `router.refresh()` (52 calls) in the client component.

### 2.6 Notification side-effects

`createNotification` (`notification-actions.ts:50`) itself fires **8 `revalidatePath` calls**,
so any action that creates a notification transitively invalidates 8 routes:

```ts
export async function createNotification(data: {
  title: string; message: string; details?: string; type?: string;
  notification_to?: string; notification_from?: string; accountId?: number;
})
// defaults: type → "INFO", notification_to → "ADMIN"
```

Actions that create notifications: `createOrder`, `approveOrder` (3 waves), `markOrderDelivered`,
`createRetailPurchase`, `createPayment`, `approvePaymentInternal`, `rejectPayment`,
`updateCheckStatus`.

---

## 3. Route handlers

All three are **unauthenticated** — `src/middleware.ts`'s matcher excludes `api`. None performs
a file-size limit, MIME check, or extension whitelist.

### 3.1 `GET /api/editions`

```ts
// src/app/api/editions/route.ts
export async function GET()
```
| | |
|---|---|
| **Request** | none |
| **Success** | `200` `{ success: true, data: Bookedition[] }` — every non-deleted edition with `books: true`, `orderBy createdAt desc` |
| **Failure** | `200` `{ success: false, data: [] }` — note **200, not 5xx** |
| **Auth** | **none** |
| **Validation** | none |

### 3.2 `POST /api/upload-check-image`

```ts
export async function POST(request: NextRequest)
```
| | |
|---|---|
| **Request** | `multipart/form-data`, field name **`"file"`** (any other field name is ignored) |
| **Success** | `200` `{ success: true, url: string }` — `https://bookland-ethiopia-productio-blob.public.blob.vercel-storage.com/checks/<ts>-<rand>.<ext>` |
| **Missing file** | `400` `{ success: false, error: "No file provided" }` |
| **Failure** | `500` `{ success: false, error: "Failed to upload check image" }` |
| **Auth** | **none** |
| **Blob** | `put(cleanFileName, buffer, { access: "public" })` — **public**, no validation, extension taken from the client filename |
| **Side effects** | `console.error("Upload check image error:", error)` |

### 3.3 `POST /api/upload-payment-image`

Identical contract, different bucket prefix:

| | |
|---|---|
| **Request** | `multipart/form-data`, field **`"file"`** |
| **Success** | `200` `{ success: true, url: string }` — `…/payment_receipts/<ts>-<rand>.<ext>` |
| **Missing file** | `400` `{ success: false, error: "No file provided" }` |
| **Failure** | `500` `{ success: false, error: "Failed to upload payment image" }` |
| **Auth** | **none** |

⚠️ **There is a duplicate path for check uploads.** `check-actions.ts:73`
(`uploadCheckImageAction`) writes to the *same* `checks/` prefix via a server action. Check
images go through whichever the caller uses; payment images have **only** the route handler.

---

## 4. Auth in server actions — four patterns, no consistency

### Pattern A — role gate on `session.role`

```ts
// order-actions.ts:865-868  (approveOrder)
const session = await getCurrentSession();
if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Only administrators can approve orders" };
}
```
Used by: `approveOrder`, `removeBookFromOrder`, `removeBooksFromOrder`, `deleteOrder`
(all `"Only administrators can …"`), and `backup-actions.ts` (`getLocalBackups`,
`createLocalBackup` → `"ADMIN"`).

### Pattern B — session presence only

```ts
// payment-actions.ts:59  (createPayment)
if (!session) return { success: false, error: "Unauthorized" };
```
Used by: all 12 payment actions, `markOrderDelivered`, `updateOrder`, `updateShopDebt`,
`updateShopTotals`, `updateCheckStatus`, `updateCheckDetails`, the 6
`printer-shop-payment-actions`, and the 3 retail-purchase mutations.
**No role restriction** — a Viewer can call these.

⚠️ Inconsistent literal: `payment-actions.ts` uses `"Unauthorized"`, but
`updatePaymentMemo` / `updatePaymentPrinter` / `updatePrinterPaymentMemo` use
`"Not authenticated"` (lines 428, 446, 467).

### Pattern C — fine-grained permission via `checkCurrentUserRole`

```ts
// book-shop-actions.ts:7-23  — the ONLY permission helper in the codebase
export async function checkCurrentUserRole(roleName: string) {
  const session = await getCurrentSession();
  if (!session?.id) return { success: true, enabled: false };
  if (session.role === "ADMIN") return { success: true, enabled: true };
  try {
    const roletype = await (prisma as any).roletypes.findFirst({ where: { rolename: roleName, is_deleted: false } });
    if (!roletype) return { success: true, enabled: false };
    const role = await (prisma as any).roles.findFirst({ where: { accountId: session.id, roletypeId: roletype.id, is_deleted: false } });
    return { success: true, enabled: role?.role_status === true };
  } catch { return { success: false, enabled: false, error: "Failed to check role." }; }
}
```
Callers and their permission names:

| Permission name | Actions |
|---|---|
| `"Adding Books"` | `createBook` |
| `"Editing Books"` | `updateBook`, `reorderBooks` |
| `"Deleting Books"` | `deleteBook` |
| `"Adding BookShop"` | `createBookShop` |
| `"Editing BookShops"` | `updateBookShop`, `updateShopPreviousDebt` |
| `"Deleting BookShops"` | `deleteBookShop` |
| `"Adding Stores"` | `createStore` |
| `"Editing Stores"` | `updateStore` |
| `"Deleting Stores"` | `deleteStore` |

Plus the server-component-level gate `checkCurrentUserRole("Viewing Books")` in
`admin_dashboard/books/page.tsx:10` (renders an Access Denied card rather than redirecting).

⚠️ Three guards return *different messages* for the same condition:
`"You do not have the privilege to add book shops."` (L40) vs
`"You do not have the privilege to edit book shops."` (L64) vs
`"You do not have permission to edit book shops."` (L89) — note "permission" not "privilege".

### Pattern D — no auth at all

~30 of the 41 modules have **zero** auth checks, including every one that writes:

| Module | Dangerous open writes |
|---|---|
| `print-order-actions.ts` | `createPrintOrder`, `updatePrintOrder`, `deletePrintOrder`, `quickCreateBook`, `quickCreateEdition`, `addPrintOrderPayment`, `changeEditionPrinter`, `moveEditionToProject` |
| `edition-actions.ts` | `createEdition`, `updateEdition`, `updateEditionField` (arbitrary numeric column write), `deleteEdition`, `assignPrinterToEdition` |
| `store-inventory-actions.ts` | `assignEditionToStore`, `updateStoreInventory`, `deleteStoreInventory`, `transferBetweenStores`, `batchAssignEditionToStores` |
| `transfer-actions.ts` | `transferToStore` |
| `damaged-book-actions.ts` | `createDamagedBookReport`, `updateDamagedBookReport`, `deleteDamagedBookReport` — **writes off stock** |
| `book-shop-edition-actions.ts` | `addEditionToBookShop`, `updateBookShopEdition`, `deleteBookShopEdition` |
| `order-actions.ts` | `createOrder`, `updateOrderStatus`, `updateOrderPayment`, `setOrderHideRemaining` |
| `menu-actions.ts`, `menu-seed-actions.ts` | `saveMenuAssignments`, `seedDashboardMenus` |
| `settings/accounts/*/actions.ts` | `addAccountAction`, `resetPasswordAction`, `updateAccountAction`, `deleteAccountAction`, `toggleRoleAction` |
| `check-actions.ts` | `createCheck`, `uploadCheckImageAction` |
| `book-actions.ts` | `uploadBookImageAction` |
| `admin_dashboard/round-books/actions.ts` | `allocateRoundBook`, `approveDeduction`, `payFullShop`, `payAndApproveAllShops` |
| `delivery_dashboard_full/round-books/actions.ts` | all 14 mutations |

### 4.1 Introspection helpers (not guards)

```ts
export async function checkIsAdminUser()   // payment-actions.ts:19 AND check-actions.ts:89
// → { success: true, isAdmin: session?.role === "ADMIN" }   — always success:true
export async function getPrinterForSessionFull()  // printer-full-actions.ts:6
// → printer row matched by session.email, or null
```

`approvePaymentInternal` is **exported despite the "Internal" name** — clients can call it
directly and skip `approvePayment`'s already-approved guard.

---

## 5. Server action reference

### 5.1 Orders — `actions/order-actions.ts`

Exported type: `ShopDebtData = { id, name, branch, location, orderDebt, roundDebt, previousDebt, lastOrderDebt, totalDebt }` (all numbers/strings).

| Function | Signature | Auth | Returns `data` | Errors |
|---|---|---|---|---|
| `getShopRemainingBalance` | `(shopId: number)` | — | `remaining: number` | `"Shop not found"`, `"Failed to fetch balance"` |
| `getShopTotalDebt` | `(shopId: number)` | — | `{ orderDebt, roundDebt, previousDebt, lastOrderDebt, totalDebt }` | `"Failed to fetch total debt"` |
| `getAllShopsDebt` | `()` | — | `ShopDebtData[]` | `"Failed to fetch shop debts"` |
| `getOrdersByShopId` | `(shopId: number)` | — | order rows + checks + items | `"Failed to fetch orders"` |
| `getBookStockData` | `(bookId: number, excludeOrderId?: number)` | — | `{ id, name, price, stock }[]` FIFO `createdAt asc` | `"Failed to get stock data"` |
| `createOrder` | `(data: { bookShopId, order_type, memo?, amount_paid, total_amount?, payment_type?, check_id?, lock_books?, items: {bookId, quantity}[] })` | session read only (`order_made_by_id`) | created order + items | `` `Failed to get stock for book ${id}` ``, `` `Insufficient aggregate stock for book ID ${id}. Requested ${n}, Available ${m}` ``, `` `Internal error: Could not fill order for book ${id} despite available stock check.` ``, `"Failed to create order"` |
| `updateOrder` | `(orderId, data: { order_type, memo?, amount_paid, total_amount?, lock_books?, items })` | session presence | re-fetched order | `"Not authenticated"`, `"Order not found"`, `"Approved orders cannot be edited"`, `"Failed to update order"` |
| `updateOrderStatus` | `(orderId: number, status: string, isApproved?: boolean)` | **none** | updated order | `"Failed to update order status"` |
| `getPendingOrdersCount` | `()` | — | `count` | *(never fails)* |
| `getAllOrders` | `()` | — | orders + shop + checks + maker + locks | `"Failed to fetch orders"` |
| `getOrderById` | `(orderId: number)` | — | one order | `"Order not found"`, `"Failed to fetch order"` |
| `getBookStockBreakdown` | `(bookId: number, editionIds?: number[], excludeOrderId?: number)` | — | `{ editionId, editionName, price, lockedAmount, stores: { storeStockId, storeId, storeName, availableQty, type: "store"\|"printer" }[] }[]` | `"Failed to fetch stock breakdown"` |
| **`approveOrder`** | `(orderId: number, allocations: { bookEditionId, storeId, storeStockId, quantity, price, type: "store"\|"printer" }[], allocationSummary?: string)` | **`role !== "ADMIN"`** | *(none — `{ success: true }`)* | `"Only administrators can approve orders"`, `"Order not found"`, `"Order is already approved"`, `"The associated check must be cleared before this order can be approved."`, `` `Insufficient stock at printer for edition ${id}` ``, `` `Insufficient stock at store for edition ${id}` ``, `"Failed to approve order"` |
| `updateOrderPayment` | `(orderId: number, amountPaid: number)` | **none** | updated order | `"Failed to update order payment"` |
| `markOrderDelivered` | `(orderId: number)` | session presence | *(none)* | `"Not authenticated"`, `"Order not found"`, `"Order must be approved first"`, `"Order already marked as delivered"`, `"Failed to mark order as delivered"` |
| `removeBookFromOrder` | `(orderId: number, bookId: number)` | **ADMIN** | `{ removedTotal }` | `"Only administrators can modify orders"`, `"Order not found"`, `"Cannot modify an approved order"`, `"No items found for this book in the order"`, `"Failed to remove book from order"` |
| `removeBooksFromOrder` | `(orderId: number, bookIds: number[])` | **ADMIN** | `{ removedTotal, removedItems }` | `"Only administrators can modify orders"`, `"No books selected"`, `"Order not found"`, `"Cannot modify an approved order"`, `"No items found for the selected books"`, `"Failed to remove books from order"` |
| `deleteOrder` | `(orderId: number)` | **ADMIN** | `{ deletedId }` | `"Only administrators can delete orders"`, `"Order not found"`, `"Approved orders cannot be deleted"`, `"Failed to delete order"` |
| `updateShopDebt` | `(shopId: number, newTotalDebt: number)` | session presence | *(none)* | `"Unauthorized"`, `"Failed to update shop debt"` |
| `updateShopTotals` | `(shopId: number, totalPaid: number)` | session presence | *(none)* | `"Unauthorized"`, `"Failed to update shop totals"` |
| `setOrderHideRemaining` | `(orderId: number, hide: boolean)` | **none** | `hide_remaining: boolean` | `"Failed to update"` |
| `getApprovedOrderPayments` | `()` | — | flat payment rows | `"Failed to fetch order payments"` |

**Transactions:** `updateOrder` (30 s), `approveOrder` (**180 s**), `deleteOrder` (30 s),
`removeBookFromOrder` / `removeBooksFromOrder` (no timeout). `createOrder` has **no**
transaction — a payment failure or lock failure is caught and the order still succeeds.
`updateShopDebt` / `updateShopTotals` have **no** transaction and loop individual writes.

**Divergences to know:**
- `getShopTotalDebt` hardcodes `const approvedPrevPayments = []` (L56), so `previousDebtRemaining`
  always equals `previousDebt`. `getAllShopsDebt` nets against real `payments` rows → **the two
  functions return different numbers for the same shop.**
- `approveOrder` accepts `allocations[].storeId` but **never uses it** — only `storeStockId`.
- `deleteOrder` is a **hard delete** of `orders` (cascades `order_items`, `locked_editions`) and
  hard-deletes the associated `payments` rows, matching both `orderid = "<id>"` and
  `orderid = "ORD-<id>"`.

### 5.2 Payments — `actions/payment-actions.ts`

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `getPendingPaymentsCount` | `()` | — | *(never fails)* |
| `checkIsAdminUser` | `()` | introspection | — |
| `getShopPayments` | `(shopId: number)` | — | `"Failed to fetch payments"` |
| `createPayment` | `(data: { shopId, amount, payment_type: "DIRECT"\|"CHECK", checkId?, orderid?, memo?, image?, is_for_previous_debts?, is_for_printer?, printer_id?, printer_payment_memo?, payment_for_printer?, approve? })` | session | `"Unauthorized"`, `"Payment recorded but auto-approval failed"`, `"Failed to create payment"` |
| `approvePaymentInternal` ⚠️ exported | `(paymentId: number)` | session | `"Unauthorized"`, `"Payment not found"`, `"Payment approved but failed to deduct from debt. Approval reverted."`, `"Failed to approve payment"` |
| `approvePayment` | `(paymentId: number)` | session | + `"Payment already approved"` |
| `rejectPayment` | `(paymentId: number)` | session | `"Unauthorized"`, `"Payment not found"`, `"Cannot reject an approved payment"`, `"Failed to reject payment"` |
| `setPaymentPending` | `(paymentId: number)` | session | `"Unauthorized"`, `"Payment not found"`, `"Failed to update payment"` |
| `deletePayment` | `(paymentId: number)` | session | `"Unauthorized"`, `"Payment not found"`, `"Failed to delete payment"` |
| `updatePaymentMemo` | `(paymentId: number, memo: string)` | session | `"Not authenticated"`, `"Failed to update memo"` |
| `updatePaymentPrinter` | `(paymentId: number, …)` | session | `"Failed to update printer"` |
| `updatePrinterPaymentMemo` | `(paymentId: number, …)` | session | `"Failed to update memo"` |

**No `$transaction` in this file.** `approvePaymentInternal` uses a compensating-write pattern:
set `APPROVED` → apply to `orders.amount_paid` → on throw, revert to `PENDING`.

**Documented business rules (in source comments):**
- Strict per-order: `payment.orderid` is parsed with `parseInt(orderid.replace(/^ORD-/i,""))`
  and applied **only** to that order — no waterfall across a shop's other orders.
  `toApply = Math.min(payment.amount, orderRemaining)` — overpayment is **silently truncated**.
- Payments with no `orderid` are deliberately not distributed (they are unlinked /
  previous-debt payments).
- `createPayment`: `approveImmediately = data.approve && data.payment_type === "DIRECT"` —
  **CHECK payments are never auto-approved.**

### 5.3 Print orders — `actions/print-order-actions.ts` — **no auth on any function**

| Function | Signature | Notes / errors |
|---|---|---|
| `getPrintOrders` | `()` | items deep-include `bookedition → books`; payments `payment_date asc` |
| `createPrintOrder` | `(formData: any)` — **plain object, not `FormData`** | hardcodes `quality: "STANDARD"`, `edition: "MULTIPLE_EDITIONS"`; `error.message \|\| "Failed to create print order"` |
| `updatePrintOrder` | `(id: number, formData: any)` | reconciles items by id: update / `createMany` / hard `deleteMany`; `"Failed to update print order"` |
| `deletePrintOrder` | `(id: number)` | **soft**; items not flagged; returns `{ success: true }` only |
| `quickCreateBook` | `(data: { title, author, category, publication_year: string, language? })` | generates `BOOK-<7 upper base36>` and `SKU-<title[0:3] upper>-<5 upper base36>` |
| `quickCreateEdition` | `(data: { edition_name, bookId, total_print_count?, number_of_pages?, production_price?, cover_price? })` | sets `count_remening_for_transfer = total_print_count` and `selling_price = production_price` |
| `updatePrintOrderItemStatus` | `(itemId: number, status: string)` | one-way `COMPLETED` lock; `"Item not found"`, `"Cannot revert a completed item"` |
| `updatePrintOrderStatus` | `(orderId: number, status: string)` | `"Project not found"`, `"Cannot revert a completed project"` |
| `addPrintOrderPayment` | `(orderId, data: { amount: number, payment_date: string, reference? })` | `"Failed to add payment"` |
| `updatePrintOrderPayment` | `(paymentId, orderId, data: { reference? })` | if `reference` omitted → **Prisma called with `{}`** |
| `deletePrintOrderPayment` | `(paymentId, orderId)` | **hard** `delete` |
| `changeEditionPrinter` | `(data: { orderId, editionId, newPrinterId })` | tx; soft-deletes all `bookeditionprinters` rows then revives/merges; in-tx throw `"Edition not found"` |
| `moveEditionToProject` | `(data: { orderItemId, editionId, sourceOrderId, targetOrderId })` | merges if the edition exists in the target (soft-deletes source); in-tx throws `"Target project not found"`, `"Target project has no printer assigned"`, `"Source order item not found"`; pre-check `"Book is already in this project"` |

`syncEditionPrintCount(tx, editionId)` (non-exported, L257) recomputes
`total_print_count` / `count_remning_for_transfer` from non-deleted print-order items,
**excluding** orders named `Auto-delivery*`. Clamps remaining at 0. Called from
`createPrintOrder`, `updatePrintOrder`, `deletePrintOrder` — **not** from `moveEditionToProject`.

### 5.4 Inventory & transfers

**`actions/store-inventory-actions.ts`** — no auth

| Function | Signature | Errors |
|---|---|---|
| `getAllStores` | `()` | `"Failed to fetch stores"` |
| `assignEditionToStore` | `(data: { editionId, storeId, quantity })` | `"This edition is already assigned to this store. Please update the quantity instead."`, `"Edition not found"`, `` `Cannot assign ${q} units. Only ${rem} remaining for transfer.` ``, `"Quantity cannot be negative."`, `"Failed to assign edition to store"` |
| `updateStoreInventory` | `(id: number, quantity: number, editionId: number)` | `"Store inventory record not found"`, `"Edition not found"`, `` `Cannot increase by ${diff}. Only ${rem} remaining for transfer.` ``, `"Quantity cannot be negative."`, `"Failed to update inventory"` |
| `deleteStoreInventory` | `(id: number, editionId: number)` | `"Store inventory record not found"`, `"Edition not found"`, `"Failed to remove from store"` |
| `getStoreBooksAndEditions` | `(storeId: number)` | `"Store not found"`, `"Failed to fetch store books"` |
| `transferBetweenStores` | `(fromStoreId, toStoreId, transfers: { editionId, quantity }[])` | tx; soft-deletes the source row at zero; **no central-balance change, no delivery record** |
| `getStoreInventoryWithDetails` | `(storeId: number)` | |
| `batchAssignEditionToStores` | `(…array form…)` | the only action here that calls `getCurrentSession()` — to stamp an activity log, **not to gate** |

**`actions/transfer-actions.ts`** — no auth

| Function | Signature | Notes |
|---|---|---|
| `searchBooks` | `(query: string, page = 0, pageSize = 7, excludeOrderId?: number)` | FULLTEXT attempt → `catch` → `LIKE` fallback; returns `{ data, totalCount }` where **`totalCount` is the page size, not the grand total**; `"Failed to search books"` |
| `getBookEditionsForTransfer` | `(bookId: number)` | only editions with `count_remening_for_transfer > 0`; `"Failed to fetch editions: " + error.message` |
| `transferToStore` | `(storeId: number, transfers: { editionId, quantity }[])` | tx 15 s; `` `Insufficient stock for edition ID ${id}` ``; fallback `"Transfer failed"` |

#### `recordPrinterDeliveries` — the shared delivery-recording helper

Duplicated **verbatim** in `store-inventory-actions.ts:24` and `transfer-actions.ts:172`. Any fix
must be applied twice.

```ts
async function recordPrinterDeliveries(tx: any, editionId: number, storeId: number, quantity: number)
```

**Resolution chain when the edition has no print-order items:**

| # | Source | Query |
|---|---|---|
| 1 | Connected printer | `bookeditionprinters.findFirst({ where: { editionId, is_deleted: false }, orderBy: { updatedAt: "desc" } })` |
| 2 | Most recent non-auto print order's printer | `printorder_items.findFirst({ … orderBy: { createdAt: "desc" } })` — **unreachable**: only entered when there are no items, so it returns `null` |
| 3 | **Arbitrary** | `printer.findFirst({ where: { is_deleted: false }, select: { id: true } })` — **no `orderBy`**, non-deterministic |
| 4 | Bail | `console.warn("[recordPrinterDeliveries] No printer found…")` + `return` — **the caller still reports `success: true`** and no delivery is recorded |

**The dummy order** it creates:

```ts
project_name: `Auto-delivery for ${edition?.books?.title || `Edition #${editionId}`}`
status: "NOT_STARTED", quality: "STANDARD", edition: "SINGLE", count: quantity
```
plus a matching `printorder_items` row at `price_per_book: 0, total_price: 0`.

**Distribution:** splits `quantity` across existing items **newest first, real projects before
dummies**, writing one `printer_delivery_records` row each with
`approvedByPrinter: false, approvedByPrinterAt: null`.

**Overflow:** if quantity exceeds all items, it creates a **new** `printorder_items` row on
`realItems[0]?.printorder_id` — i.e. attached to a **real** order, so it *does* get counted by
`syncEditionPrintCount`, inflating the edition's recorded print run.

`isAutoDeliveryOrder` is defined in **five** places: `src/lib/printer-utils.ts:1` (canonical)
plus four local copies.

### 5.5 Editions — `actions/edition-actions.ts` — **no auth on any function**

| Function | Signature | Errors |
|---|---|---|
| `getEditionsByBookId` | `(bookId: number)` | `"Failed to fetch editions"` |
| `getEditionById` | `(id: number)` | `"Edition not found"`, `"Failed to fetch edition"` |
| `createEdition` | `(data: any)` | `` `Failed to create edition: ${msg}` `` |
| `updateEdition` | `(id: number, data: any)` | `` `Failed to update edition: ${msg}` `` |
| `updateEditionField` | `(id: number, field: string, value: any)` | whitelist: `edition_name`, `total_print_count`, `count_remning_for_transfer`, `number_of_pages`, `selling_price`, `cover_price`; else `"Field cannot be edited here"`. Also `"Value is required"`, `"Enter a valid number (0 or more)"`, `"Edition not found"`, `` `Total cannot be less than ${n} (already transferred)` ``, `"Enter a valid price (0 or more)"`, `"Failed to update edition"` |
| `assignPrinterToEdition` | `(data: { editionId, totalPrintCount, printerId: number\|null, bookUniqueCode: string })` | tx 15 s; `"Edition not found"`, `` `Total print count cannot be less than ${n} (already transferred)` `` |
| `updateEditionPrintCount` | `(id: number, totalPrintCount: number)` | same invariant; **no tx, no revalidatePath** |
| `toggleEditionVisibilityToPrinter` | `(id: number)` | flips `visiblitiy_to_printer` |
| `toggleProjectEditionsVisibilityToPrinter` | `(orderId: number, visible: boolean)` | returns `{ success: true, updatedCount }` |
| `deleteEdition` | `(id: number, bookUniqueCode: string)` | soft; `bookUniqueCode` is only for revalidation |

### 5.6 Books — `actions/book-actions.ts` · `actions/get-books.ts` · `actions/get-stores.ts`

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `uploadBookImageAction` | `(formData: FormData)` — key `"file"` | **none** | `"No file provided"`, `msg \|\| "Failed to upload image to Vercel Blob"` |
| `createBook` | `(data: BookFormValues)` | `"Adding Books"` | `"You do not have the privilege to add books."`, `"Invalid form data"`, `"Failed to save book to database"` |
| `updateBook` | `(id: string, data: Partial<BookFormValues>)` — **`id` is `unique_identification_code`, not the PK** | `"Editing Books"` | `"You do not have the privilege to edit books."`, `"Failed to update book"` |
| `reorderBooks` | `(items: { id: string; book_sort_index: number }[])` — ids are **codes** | `"Editing Books"` | `"You do not have the privilege to edit books."`, `"Failed to reorder books"` — uses `$executeRawUnsafe` with a generated `CASE` |
| `deleteBook` | `(id: string)` — code | `"Deleting Books"` | `"You do not have the privilege to delete books."`, `"Failed to delete book"` |
| `getBooksStorePrintData` | `()` | none | `"Failed to fetch books for print"` |
| `getBooksSettingsData` | `()` | none | `"Failed to fetch books settings data"` |
| `getBooks` | `()` | none | `"Failed to fetch books"` |
| `getStores` | `()` | none | — |

Zod source `lib/validation/book-schema.ts`: required `title`, `author`, `category`,
`publication_year`, `status`; 9 cost fields use `.catch(0)`; `productionstatus` is an enum.

### 5.7 Damage reports — `actions/damaged-book-actions.ts` — **no auth**

| Function | Signature | Errors |
|---|---|---|
| `getDamagedBooks` | `()` | `"Failed to fetch damaged books"` |
| `getDamagedBookById` | `(id: number)` | `"Report not found"`, `"Failed to fetch report"` |
| `getEditionDamageSources` | `(editionId: number)` | `"Edition not found"`, `"Failed to fetch damage sources"` |
| `createDamagedBookReport` | `(data: any, allocations: any[] = [])` | `"Book, edition and a positive count are required"`, `"Edition not found"`, `` `Allocation total (${a}) must equal damaged count (${c})` ``, `` `Insufficient untransferred stock: only ${n} available at central` ``, `` `Insufficient stock at store for ${n} units` ``, `"Failed to create damage report"` |
| `updateDamagedBookReport` | `(id: number, data: any)` | `"Report not found"`, `"Edition and a positive count are required"`, `"Failed to update report"` |
| `deleteDamagedBookReport` | `(id: number)` | `"Report not found"`, `"Failed to delete report"` — refunds stock, **does not set `deletedAt`** |

### 5.8 Checks — `actions/check-actions.ts`

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `getChecksFollowUp` | `()` | none | `"Failed to fetch checks"` |
| `getChecks` | `()` | none | `"Failed to fetch checks"` |
| `createCheck` | `(formData: { username, bankname, type, amount: string, expirydate?, memo, imageUrl? })` | **none** | `msg \|\| "Failed to create check. Check server logs."` |
| `uploadCheckImageAction` | `(formData: FormData)` | **none** | `"No file provided"`, `"Failed to upload check image"` (never leaks `error.message`) |
| `checkIsAdminUser` | `()` | introspection | — |
| `updateCheckStatus` | `(checkId: number, status: string)` | session | `"Unauthorized"`, `"Check not found"`, `"Failed to update check status"` |
| `updateCheckDetails` | `(checkId: number, data: { bankname?, username?, type?, amount?, recordeddate?, expirydate?, imageUrl?, memo? })` | session | `"Unauthorized"`, `"Failed to update check details"` |

`updateCheckStatus` side effects, **no transaction**:
- `"CLEARED"` → approves every linked `PENDING` payment, then FIFO-allocates the amount across
  that shop's `orders` (`createdAt asc`), **silently dropping the remainder** if the orders
  can't absorb it; also approves linked `round_payments`.
- `"DELIVERED"` → notification to `DELIVERY_AND_SALES` **plus one per `Delivery Account`**,
  plus an activity log.
- `updateCheckDetails` **ignores `amount`** when the check is already `CLEARED`.

### 5.9 Printers — `actions/printer-*.ts`

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `getFirstPrinterName` | `()` | none | `{ success: false, error: "Could not fetch printer information" }` (note `as const`) |
| `getPrinters` | `()` | none | `"Failed to fetch printers"` |
| `createPrinter` | `(formData: any)` | **none** | `"Failed to create printer"` |
| `updatePrinter` | `(id: number, formData: any)` | **none** | `"Failed to update printer"` |
| `deletePrinter` | `(id: number)` | **none** | `"Failed to delete printer"` |
| `getPrinterForSessionFull` | `()` | session email | returns `null` when no printer matches the session email |
| `getPrinterDeliveries` | `(printerId: number)` | caller-supplied id | re-attributes "Auto-delivery" records to the edition's authoritative printer; hides `visiblitiy_to_printer = false` editions |
| `approveDelivery` | `(deliveryId: number, printerId: number)` | **ownership check** | `"Delivery record not found"`, `"Access denied — this delivery does not belong to your printer"`, `"Already approved — cannot change back"` |
| `transferToPrinter` | `(printerId: number, transfers: { editionId, quantity }[])` | **none** | tx; `error.message \|\| "Transfer failed"` |
| `updatePrinterInventory` | `(id, quantity, editionId)` | **none** | `"Printer inventory record not found"`, `"Edition not found"`, `` `Cannot increase by ${d}. Only ${r} remaining for transfer.` ``, `"Quantity cannot be negative."`, `"Failed to update printer inventory"` |
| `deletePrinterInventory` | `(id, editionId)` | **none** | `"Printer inventory record not found"`, `"Edition not found"`, `"Failed to remove from printer"` |
| `getDeliveryRecords` | `(editionId: number)` | **none** | delivery records for one edition |

⚠️ `getPrinterDeliveries(printerId)` and `approveDelivery(deliveryId, printerId)` take the
printer id **from the caller**. There is no check that it matches `getPrinterForSessionFull()`.

### 5.10 Shop ⇄ printer payments — `actions/printer-shop-payment-actions.ts` — session only

| Function | Signature | Errors |
|---|---|---|
| `getPrinterPaymentsForOrder` | `(orderId: number)` | `"Invalid orderId"`, `"Failed to fetch printer payments"` |
| `createPrinterShopPayment` | `(data: { orderId, printerId, amount, … })` | `"Unauthorized"`, `"Order, printer and valid amount are required"`, `"Order not found"`, `"Failed to create printer payment"` |
| `updatePrinterShopPaymentMemo` | `(id: number, memo: string\|null)` | `"Failed to update memo"` |
| `updatePrinterShopPaymentStatus` | `(id: number, status: string)` | `"Invalid status"` (whitelist `allowed`), `"Failed to update status"` |
| `updatePrinterShopPaymentAmount` | `(id: number, amount: number)` | `"Amount must be greater than 0"`, `"Failed to update amount"` |
| `updatePrinterShopPaymentPrinter` | `(id, printerId)` | `"Invalid printer"`, `"Printer not found"`, `"Failed to update printer"` |
| `deletePrinterShopPayment` | `(id: number)` | `"Invalid payment id"`, `"Payment not found"`, `"Failed to delete payment"` |

### 5.11 Book shops — `actions/book-shop-actions.ts` · `book-shop-edition-actions.ts`

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `checkCurrentUserRole` | `(roleName: string)` | — | `{ success: false, enabled: false, error: "Failed to check role." }` |
| `getBookShops` | `()` | none | `"Failed to fetch book shops"` |
| `createBookShop` | `(data: { name, location, branch?, phone?, email? })` | `"Adding BookShop"` | `"You do not have the privilege to add book shops."`, `"Failed to create book shop"` |
| `updateBookShop` | `(id: number, data: any)` | `"Editing BookShops"` | `"You do not have the privilege to edit book shops."`, `"Failed to update book shop"` |
| `updateShopPreviousDebt` | `(id: number, previousDebt: number)` | `"Editing BookShops"` | `"You do not have permission to edit book shops."`, `"Failed to update previous debt"` |
| `deleteBookShop` | `(id: number)` | `"Deleting BookShops"` | `"You do not have the privilege to delete book shops."`, `"Failed to delete book shop"` |
| `addEditionToBookShop` | `(data: { … })` | **none** | `"Failed to add to shop"` |
| `updateBookShopEdition` | `(id: number, data: any)` | **none** | `"Record not found"`, `"Failed to update record"` |
| `deleteBookShopEdition` | `(id: number)` | **none** | `"Failed to delete record"` |

⚠️ `book-shop-edition-actions.ts` **imports no auth helper at all** — a shop's holdings and debt
ledger are fully writable by any caller.

### 5.12 Retail purchases — `actions/retail-purchase-actions.ts` — session only

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `getRetailPurchases` | `()` | none | — |
| `getRetailPurchaseById` | `(id: number)` | none | `"Not found"` |
| `createRetailPurchase` | `(data: { name?, date?, memo?, amountPaid?, lock_books?, items: { editionId, quantity, unitPrice }[] })` | session | `"Unauthorized"` |
| `getRetailEditionStockBreakdown` | `(editionIds: number[])` | none | — |
| `approveRetailPurchase` | `(purchaseId: number, allocations: { editionId, storeStockId, storeId, quantity, … }[])` | session | `"Unauthorized"`, `"Purchase not found"`, `"Only pending purchases can be approved"` |
| `updateRetailPurchasePayment` | `(id, …)` | session | `"Unauthorized"`, `"Not found"` |

⚠️ `createRetailPurchase` writes the **retail purchase id** into `locked_editions.order_id`,
which is an FK to `orders.id`. Works only because the FK isn't enforced. Known blocker, also
noted in `files-to-read/session-context.md`.

### 5.13 Rounds

**`admin_dashboard/round-books/actions.ts`** — no auth

| Function | Signature | Errors |
|---|---|---|
| `getAdminRoundBooks` | `()` | — |
| `getAdminRoundDetail` | `(id: number)` | — |
| `allocateRoundBook` | `(roundId: number, allocations: { editionId, storeId, storeStockId, quantity, type: "store"\|"printer" }[])` | `"Round not found"`, `"Cannot allocate while round is active"`, `"Already allocated"`, `"No books to allocate"` |
| `getRoundDeductData` | `(roundId: number)` | `"Round not found"` |
| `approveDeduction` | `(roundId: number, allocations: { sourceKey: string; quantity: number }[])` | `"Round not found"` |
| `approveRoundPayment` | `(paymentId: number)` | — |
| `payFullShop` | `(roundRecordId: number)` | `"Round record not found"`, `"No amount to pay"`, `"Shop is already fully paid"` |
| `payAndApproveAllShops` | `(roundId: number, recordIds?: number[])` | `"Round not found"` |

**`delivery_dashboard_full/round-books/actions.ts`** — no auth, 14 functions:
`getRoundBooks`, `getBooksForRound`, `createRoundBook(data: { bookId, editionId?, starting_amount? })`,
`updateRoundBook(id, data: { starting_amount?, returned_amount?, status? })`,
`getAvailableShops(roundBookId)`, `getEditionPrice(bookId)`,
`createRoundCheck(data: {…})`, `createRoundRecord(data: {…})`, `createRoundPayment(data: {…})`,
`approveRoundPayment(paymentId)`, `deleteRoundPayment(paymentId)`,
`updateRoundCheckStatus(checkId, status)`, `getRoundRecordDetail(recordId)`,
`getShopRoundPaymentInfo(shopId)`, `deleteRoundBook(id)`.

### 5.14 Translation

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `getTranslationProjects` | `()` | none | `"Failed to fetch projects"` |
| `createTranslationProject` | `(data: TranslationProjectFormValues)` — zod validated | none | `"Invalid form data"` (no field messages surfaced), `"Failed to create project"` |
| `getAvailableBooks` | `()` | none | `"Failed to fetch books"` — filters `productionstatus: "TRANSLATION"` |
| `getActiveTranslators` | `()` | none | `"Failed to fetch translators"` |
| `getTranslationProjectById` | `(id: number)` | none | `"Project not found"`, `"Failed to fetch project"` — **does not filter `is_deleted`** |
| `updateTranslationProject` | `(id, data: Partial<…>)` | none | `"Failed to update project"` — **no zod on update**; applies fields only `if (data.x)` so `0` is ignored; logs full payloads via `console.log` |
| `deleteTranslationProject` | `(id: number)` | none | `"Failed to delete project"` |
| `updateTranslationProjectStatus` | `(projectId: number, status: string)` | none | `"Failed to update status"` — `status as any`, arbitrary strings reach the enum column |
| `getTranslators` | `()` | none | `"Failed to fetch translators"` — maps `_count.translatorbook` → **`_count.books`** |
| `createTranslator` | `(data: TranslatorFormValues)` | none | `"Invalid form data"`, `"Failed to create translator"` — spreads `{ ...result.data }` verbatim |
| `getTranslatorById` | `(id: number)` | none | `"Translator not found"`, `"Failed to fetch translator"` — aliases `translatorbook` → `books` |

⚠️ `createTranslationProject` revalidates `/admin_dashboard/production/translation_work`
(**underscore**) — the Operation Manager route is `translation-work` (**hyphen**) and is not
revalidated.

### 5.15 Documents — 5 near-identical CRUD modules, **no auth**

`contract-actions.ts`, `print-agreement-actions.ts`, `delivery-note-actions.ts`,
`invoice-actions.ts`, `approval-document-actions.ts` each export the same 5 functions:

```ts
get<X>s()                      // list, where is_deleted: false
get<X>ById(id: number)         // → `"<X> not found" | msg || "Failed to fetch <x>"`
create<X>(input: <X>Input)     // zod .parse() INSIDE the try → zod messages leak verbatim
                                // → msg || "Failed to create <x>"
update<X>(id: number, input: Partial<X>Input)   // ← NO zod on update; object spread verbatim
delete<X>(id: number)          // soft delete; → msg || "Failed to delete <x>"
```

`invoice-actions.ts` adds `uploadInvoiceImageAction(formData: FormData)` → key `"file"`,
prefix `invoices/`, errors `"No file provided"` / `"Failed to upload invoice attachment to
Vercel Blob"`. Its `del` import is **unused** — deleting an invoice orphans its blob.

These five modules have **no FK to orders, print orders, or deliveries**. They are standalone
paperwork registers.

### 5.16 Notifications, notes, activity log — no auth

| Function | Signature | Notes |
|---|---|---|
| `getUnreadCount` | `(accountId?: number, notificationTo?: string)` | `notificationTo` wins over `accountId`; `{ success, count }` |
| `getNotifications` | `(accountId?, notificationTo?, take?)` | **returns `success: true` with `[]` on DB error** |
| `createNotification` | `(data: { title, message, details?, type?, notification_to?, notification_from?, accountId? })` | 8 `revalidatePath` calls |
| `markAsRead` | `(id: number)` | |
| `deleteNotification` | `(id: number)` | soft; `deletedAt` not set |
| `getNotes` | `(accountId?: number)` | silent success on error |
| `getNoteById` | `(id: number)` | returns `{ success: true, data: null }` when missing — **no "not found" branch** |
| `createNote` | `(title: string, note_content: string, accountId: number)` | **`accountId` trusted from the caller** |
| `updateNote` | `(id, title, note_content)` | |
| `deleteNote` | `(id: number)` | soft; `updatedAt` not touched |
| `getActivityLogs` | `()` | full unscoped log incl. `account: true`; **never paginated**; silent success on error; writes nothing |

### 5.17 Menus

**Live API** (`menu_management` + `menus`):

| Function | Signature | Auth | Errors |
|---|---|---|---|
| `getEnabledMenuNamesForRole` | `(role: "finance_officer"\|"inventory_manager"\|"operation_manager"\|"viewer")` | none | `{ success: true, data: [] }` for unknown role; failure shape has **no `error` key** |
| `getAllMenusWithAssignments` | `()` | none | `{ data: { menus, assignments: Record<account_type, string[]> } }`, `"Failed to fetch menus"` |
| `saveMenuAssignments` | `(accountType: string, menuIds: number[])` | **none** | `"Failed to save menu assignments"` — 3-phase write (disable → restore → create), **no transaction** |
| `seedDashboardMenus` | `()` | **none** | `{ data: Record<account_type, { menus, assignments }> }`, `"Failed to seed dashboard menus"`; **no transaction** |

⚠️ `getEnabledMenuNamesForRole` takes a **role key** (`finance_officer`);
`saveMenuAssignments` takes an **account type** (`Finance Officer`). Different vocabularies —
`ROLE_TO_ACCOUNT_TYPE` at `menu-actions.ts:54-59` is the only bridge.

**Dead API** (`dashboardmenu` raw SQL) — `getDashboardMenus()`,
`updateDashboardMenu(role, enabledMenus)`, `getMenuConfigForRole(role)`. **Zero call sites.**
The `dashboardmenu` table should be dropped.

### 5.18 Backup — `actions/backup-actions.ts`

| Function | Signature | Auth | Notes |
|---|---|---|---|
| `getLastBackupTime` | `()` | **none** | `{ success: true, data: string\|null }`; failure is `{ success: false, data: null }` — **no `error` key**. **Performs DDL** (`ensureBackupTable()`) on every call. Called unauthenticated from `admin_dashboard/page.tsx:141` |
| `getLocalBackups` | `()` | **`session.role !== "ADMIN"`** | ledger rows |
| `createLocalBackup` | `()` | **`session.role !== "ADMIN"`** | **returns the entire SQL dump of every table to the browser** |

Non-exported helpers: `ensureBackupTable` (L7), `generateSqlDump` (L105),
`escapeSqlValue` (L70), `ethiopianNaturalName` (L58), `sanitizeFileName` (L66),
`uniqueBackupFileName` (L87).

`generateSqlDump` walks `information_schema.tables`, emits `SHOW CREATE TABLE` + keyset-paginated
`SELECT *` batches of 100, wraps in `SET FOREIGN_KEY_CHECKS=0/1`, and **excludes
`local_backup_records` from its own dump**. ⚠️ **Tables with no primary key fall back to
`LIMIT 100`** — only the first 100 rows are backed up.

Filenames are Ethiopian natural language: `ጥር 15 2018 ፣ ጠዋት 9:05.sql`, then `-2.sql` on collision.

### 5.19 Statistics, reports, settings

| Function | Signature | Auth | Returns |
|---|---|---|---|
| `getOrderedBooks` | `(range: string)` | none | `{ entries, grandTotal }` |
| `getStoreStats` | `(range: string)` | none | `{ entries, grandTotal }` |
| `getIncomeStats` | `(range: string)` | none | `{ entries, grandTotal, totalPayments }` |
| `getTopSellers` | `(period: TopSellersPeriod): Promise<TopSellersResult>` | none | `{ books: TopSellerRow[], totalBooksSold, topCount, totalQty, topQty, period, since }` |
| `getDailyReportData` | `(isoDate: string)` | none | **bare object, no `success`/`error` wrapper — throws on DB failure** |
| `getPeriodReportData` | `(startISO: string, endISO: string)` | none | same |
| `getInventoryStats` / `getRetailStats` / `getOperationStats` / `getViewerStats` / `getFinanceStats` | `()` | none | KPI bundles; errors `"Failed to fetch … stats"` |
| `getSettings` | `()` | none | auto-creates the singleton row |
| `updateSettings` | `(primaryColor: string, badgeColor?, toastBgColor?, toastTextColor?)` | **none** | writes theme CSS vars for every user |

`range` accepts exactly: `"24h" | "48h" | "72h" | "7d" | "30d" | "60d" | "3m" | "6m" | "1y"`.
Anything else falls through to `getSinceDate` → `new Date(0)` (**all time**).
`3m` = 90 days, `6m` = 180 days.

### 5.20 Accounts & profile

**`admin_dashboard/settings/accounts/add_account/actions.ts`**

```ts
export async function addAccountAction(data: { name: string; email: string; password: string; type: string; … })
```
- **No auth guard.** Any caller can create an account.
- Hashes with `bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"))`.
- Auto-grants view permissions: after create, it reads every `roletypes` row where
  `is_deleted: false` and creates `roles` grants for the new account.

**`admin_dashboard/settings/accounts/[id]/actions.ts`** — **no auth guard on any of the 5**

| Function | Signature |
|---|---|
| `resetPasswordAction` | `(id: number, newPassword: string)` — bcrypt, `BCRYPT_SALT_ROUNDS` |
| `updateAccountAction` | `(id: number, data: { name, email, type, status: boolean, phonenumber? })` — rejects duplicate emails via `where: { id: { not: id } }` |
| `deleteAccountAction` | `(id: number)` — **soft** (`is_deleted`); **does not invalidate the session cookie** |
| `toggleRoleAction` | `(accountId: number, roleName: string, enabled: boolean)` |
| `checkRoleAction` | `(accountId: number, roleName: string)` |

**Profile actions — 5 copies, 3 of them byte-identical:**

| File | Exports |
|---|---|
| `admin_dashboard/profile/actions.ts` ≡ `viewer_dashboard/profile/actions.ts` | `getProfileData()`, `updateAdminProfile(userId, data: { name?, email? })`, `changePasswordAction(userId, currentPassword, newPassword)` |
| `inventory_manager_dashboard/profile/actions.ts` ≡ `printer_full/profile/actions.ts` | `getProfileData()`, `updateProfileAction(userId, data)` (adds duplicate-email check), `changePasswordAction(...)` |
| `delivery_dashboard_full/profile/actions.ts` | `getProfileData()`, `updateProfile(userId, data: { name?, email?, password? })` |

⚠️ **`userId` is taken from the caller, not the session.** `getProfileData()` derives the id
from the session, but `changePasswordAction(userId, currentPassword, newPassword)` trusts the
argument — an authenticated user can pass another user's id.

**`delivery_dashboard_full/books/actions.ts`** — `getBookStoreStock(bookId: number)`, no auth.

---

## 6. Adding a server action — the pattern

```ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";
import { checkCurrentUserRole } from "./book-shop-actions";

export async function doThing(data: { foo: string; bar?: number }) {
  // 1. AUTH — pick a pattern deliberately; most modules have none, which is not a licence
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    // 2. VALIDATE (zod) — only 4 of 41 modules do this
    // 3. WRITE — one updateMany/createMany where possible; use $transaction for multi-table
    // 4. updatedAt: new Date() — mandatory, the schema has no @updatedAt
    // 5. Filter is_deleted: false on every read
    return { success: true, data };
  } catch (error) {
    console.error("DoThing:", error);
    return { success: false, error: error?.message || "Failed to do thing" };
  } finally {
    revalidatePath("/admin_dashboard/the-section");
  }
}
```

---

## 7. API-layer risks

| Risk | Where | Impact |
|---|---|---|
| ~30 modules have zero auth | §4 Pattern D | Any authenticated (or unauthenticated) caller can create/edit/delete print orders, editions, inventory, damage reports, stock transfers, accounts, passwords, menus, theme, and shop debt ledgers |
| `book-shop-edition-actions.ts` has no auth import | §5.11 | Shop holdings + debt writable by anyone |
| `createOrder` / `updateOrderPayment` / `updateOrderStatus` unauthenticated | `order-actions.ts` | Orders can be created and financial fields overwritten without a session |
| `settings/accounts/[id]/actions.ts` has no auth | §5.20 | Password reset for any account id |
| `changePasswordAction(userId, …)` trusts the argument | §5.20 | Cross-account password change |
| `getPrinterDeliveries(printerId)` trusts the argument | §5.9 | A caller can read another printer's deliveries |
| All 3 route handlers unauthenticated | §3 | Full edition catalogue readable; **unauthenticated upload of arbitrary files to a public bucket** with no size/MIME check |
| `approvePaymentInternal` exported | §4 | Bypasses `approvePayment`'s idempotency guard |
| Raw `error.message` leaks | ~15 actions | Prisma internals and SQL fragments reach the browser |
| `deleteOrder` hard-deletes payments | §5.1 | Irreversible money-record deletion |
| `updateShopDebt` / `updateShopTotals` have no transaction | §5.1 | Partial application leaves books out of balance |
| `approvePaymentInternal` truncates overpayment silently | §5.2 | Money applied ≠ money received, with no record |
| `updateCheckStatus("CLEARED")` drops remainder silently | §5.8 | Unapplied money vanishes |
| `generateSqlDump` caps PK-less tables at 100 rows | §5.18 | Incomplete backups |
| `searchBooks` `totalCount` is the page size | §5.4 | Pagination UI is wrong |
| `getShopTotalDebt` vs `getAllShopsDebt` disagree | §5.1 | Two screens show different debt for the same shop |
| `recordPrinterDeliveries` duplicated verbatim in 2 files | §5.4 | Fixes must be applied twice |
| `isAutoDeliveryOrder` defined 5× | §5.4 | Divergence already exists |
| `createRetailPurchase` writes a purchase id into an `orders` FK | §5.12 | Breaks if the FK is ever enforced |
| `revalidatePath` is a no-op | §2.5 | False confidence; only `router.refresh()` works |
| `deleteOrder` also hard-deletes `payments` | §5.1 | Money records removed with the order |

---

_Last reviewed: 2026-10-14._