# 2026-08-13 — New Edition Form Simplification

## Summary
Redesigned the "Add New Edition" modal in the book details Editions tab to only require Edition Name, Print Count, and Selling Price, with a Toggle to reveal the rest of the form pre-filled from the main book info.

## Decisions
- **Required fields only**: Edition Name, Print Count, Selling Price — shown blank, marked `*`, mandatory.
- **Toggle component**: created `src/components/ui/toggle.tsx` via `npx shadcn@latest add toggle` (used `radix-ui` unified import to match project conventions). Also created `components.json` (did not exist) to let the shadcn CLI run non-interactively.
- **Toggle default OFF**: opening the form shows only the 3 required fields.
- **Prefill from main book info** (works whether toggle is shown or not): the 9 cost fields (`translator_cost` … `purchasing_right_cost`), `number_of_pages`, and `book_image_url` are copied from the book into the edition form data.
- **Edition-only fields** (Base Cost/production_price, Printing, Binding, Design, Other Expenses, Memo) submit as 0/blank when hidden.
- **Toggle ON**: reveals Base Cost, Cost Breakdown Details, Additional Production Costs, Page Count, and Production Memo — pre-filled and editable.
- **Last edition price note**: under Selling Price, shows "Last edition sold at X ETB" using the most recent existing edition (`book.bookedition[0]`, sorted by createdAt DESC).

## Files Changed
- `src/components/admin_dashboard_components/book_details/EditionsInfo.tsx`
  - Added `showMoreForm` state, `getPrefilledFormData()` (from book), `lastEdition`/`lastEditionPrice`.
  - Imports: added `Toggle`, `ChevronDown`, `Info`.
  - Restructured the form: required fields at top, toggle row, conditional extra sections.
- `src/components/ui/toggle.tsx` — new shadcn Toggle component.
- `components.json` — created for shadcn CLI.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` — only pre-existing warnings (unused imports `Trash2`, `FileText`, `BookOpen`, `Hash`, `ChevronRight`, `ExternalLink`, `Edit3`, unused `handleDelete`, img warnings). No new issues.

## Blockers
- None.

---

# 2026-08-13 — Print Order: Prefill Number of Pages from Book

## Summary
In the New Print Project dialog (printing/manage), when creating a new edition for an existing book, the "Number of Pages" field now auto-fills from the selected book's `number_of_pages`, and remains editable.

## Files Changed
- `src/app/admin_dashboard/printing/manage/CreatePrintOrderButton.tsx`
  - In `handleDrawerBookSelect`, after selecting a book in New-Edition mode, set `drawerEditionPages` to the book's `number_of_pages` (string, or empty if unset). Field is still editable via the existing Input.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` — only pre-existing warnings (unused icons/imports, `err`/`error`). No new issues.

## Blockers
- None.

---

# 2026-08-13 — Edition Details Collapsible Cost Sections

## Summary
Made the Cost Breakdown and Additional Production Costs sections on the edition details page collapsible (shadcn Collapsible), defaulting to collapsed (titles only).

## Files Changed
- `src/app/admin_dashboard/books/editions/[id]/EditionDetailsClient.tsx`
  - Added `ChevronDown` import and `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`.
  - Added state `costBreakdownOpen`, `additionalCostsOpen` (both default `false` → collapsed).
  - Wrapped Cost Breakdown cards and Additional Production Costs cards in separate `Collapsible`s. Trigger headers show the title + total badge; ChevronDown rotates 180° when open.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` — only pre-existing warnings (unused `X`, `cn`, `error`/`err`, `<img>` warnings). No new issues.

## Blockers
- None.

---

# 2026-08-13 — Order Details: Add Payment Button

## Summary
Added an "Add Payment" button to the order details dialog footer (admin dashboard → manage orders). It opens the same RecordPaymentModal used in manage_payment, pre-linked to the current order (`orderId`). Footer button order is now Cancel, Print, Options, Payment, Edit Order, Delete (for pending orders); approved orders keep Cancel, Print, Options, Payment.

## Decisions
- Footer button order follows user instruction: `Cancel, Print, Options, Payment, Edit Order, Delete`. Payment placed after Options, before Edit Order. For approved orders (no edit/delete), order still holds.
- Reused existing `RecordPaymentModal` (imported from `manage_payment/[id]/RecordPaymentModal`. Props: `isOpen, onClose, shopId, shopName, orderId`).
- `shopId`/`shopName` derived from the order's customer: `order.bookshopes.id` / `order.bookshopes.name`.
- `orderId` passed as `order.id`; RecordPaymentModal stores `orderid` as `String(orderId)`, which matches the payment/order matching logic used in manage_payment (`p.orderid === String(o.id)`).

## Files Changed
- `src/app/admin_dashboard/manage_orders/ManageOrderDetailsModal.tsx`
  - Imported `RecordPaymentModal`.
  - Added state `isPaymentModalOpen` (reset when dialog closes).
  - Added "Payment" button in the `DialogFooter` (between Options and Edit Order), with `Banknote` icon.
  - Reordered footer: Edit Order now before Delete Order (previously reversed).
  - Rendered `<RecordPaymentModal>` after the main `<Dialog>`, passing `shopId`, `shopName`, `orderId`.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` on changed file — only pre-existing warnings (unused imports `AlertDialogTrigger`, `Package`, etc.; `markOrderDelivered` unused; `no-non-null-asserted-optional-chain` at line 381 pre-existing). No new issues.

## Blockers
- None.

---

# 2026-08-13 — Order Details Footer: Mobile Grid + Payment Amount Formatting

## Summary
- Made the order details footer buttons responsive: on mobile they render in a 2-column grid (two buttons per line); desktop keeps the original single-row flex layout. Also added wider left/right padding (`px-5` mobile) so buttons no longer overflow on mobile.
- Payment history amounts in the admin dashboard now show two decimal places when the number has a fractional part (e.g. `1000.7` → `1,000.70`, `1000.55` → `1,000.55`); whole numbers stay as-is (`1000` → `1,000`).
- Record Payment amount input: mouse-wheel scrolling no longer changes the typed value (`onWheel` blur).

## Files Changed
- `src/app/admin_dashboard/manage_orders/ManageOrderDetailsModal.tsx`
  - Footer button group: `grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:justify-center sm:gap-2`; each button got `w-full sm:w-auto`.
  - `DialogFooter` mobile padding changed from `p-3` to `px-5 py-3` (desktop `sm:p-6` unchanged).
- `src/app/admin_dashboard/manage_payment/[id]/ManagePaymentDetailClient.tsx`
  - Added `formatAmount` helper: `Number.isInteger(n) ? n.toLocaleString() : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })`.
  - Used `formatAmount` in the payment history list amount and the round record payments amount.
- `src/app/admin_dashboard/manage_payment/[id]/RecordPaymentModal.tsx`
  - Added `onWheel={(e) => e.currentTarget.blur()}` to the amount `Input`.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` on changed files — only pre-existing warnings/errors (unused imports, `useMemo`/`useReactTable` called in callback at lines 1578/1583, missing deps). No new issues.

## Blockers
- None.

---

# 2026-08-13 — Manage Orders: Keep Pagination Page After Operations

## Summary
Fixed a bug where performing any operation (approve/delete/payment/etc.) on an order from the manage_orders table reset pagination back to page 1 after the server revalidated/refreshed.

## Root Cause
The old code saved the current page to `localStorage` **only inside** the `onApproved`/`onDeleted` callbacks (i.e. *after* the server action resolved). The server actions call `revalidatePath`, which triggers an RSC re-render/remount of `ManageOrdersPageContent`. The restore effect read and **removed** `mo_page`, and because of the save/restore race it often read an empty value (or the component remounted before the callback ran), so pagination reset to 0.

## Fix
- `src/app/admin_dashboard/manage_orders/ManageOrdersPageContent.tsx`
  - Added a continuous sync effect: `useEffect(() => localStorage.setItem("mo_page", String(pagination.pageIndex)), [pagination.pageIndex])` — the current page is always persisted, so a post-operation refresh restores it regardless of callback timing.
  - Changed the restore effect to run **before** the sync effect and to **not** `removeItem` on read; it only restores when the stored index differs from the current one.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` — only pre-existing warning (`Eye` unused; missing dep `pagination.pageIndex` in restore effect — intentional, effect should only react to `orders`).

## Blockers
- None.