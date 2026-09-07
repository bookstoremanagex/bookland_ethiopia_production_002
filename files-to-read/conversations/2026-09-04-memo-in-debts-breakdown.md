# Conversation — 2026-09-04 memo-in-debts-breakdown

## Summary
Added memo support to the Debt Breakdown detail page tables: rows that have a memo now show a truncated memo in a new "Memo" column; clicking it opens a dialog with the full memo text.

## Request
- In admin dashboard → manage payment → details page → debts-breakdown page: for lists that have memo, include memo in the table — show part of it, click to view full detail.

## Changes
- `debts-breakdown/page.tsx`: added `memo: true` to the orders select (payments + round_payments already selected memo).
- `debts-breakdown/DebtBreakdownClient.tsx`:
  - `OrderRow` interface gained `memo: string | null`.
  - New `memoView` state + `MemoCell` component: truncated (max-w-[140px] truncate) clickable text → dialog; em-dash when no memo.
  - Section 1 (Requested Orders) + Section 2 (Round Orders): added Memo column (Order | Date | Memo | Total Amount), colSpans updated (4 / total row 3), min-w bumped to 560px.
  - Section 4 (Payments): added Memo column (Date | Source | Type | Reference | Memo | Status | Amount), colSpans updated (7 / total row 6), min-w bumped to 820px.
  - Memo detail Dialog (shadcn) at end of page: title = "Memo — {source label}", body = full memo (whitespace-pre-wrap).
  - Section 3 (Rounds) untouched — roundrecords have no memo field.

## Verification
- `npx tsc --noEmit` clean.
- `npx eslint` on both changed files: no output (clean).

---

## Round 2 — Removed memo from order tables

## Request
- User: remove memo section if orders don't have memo in the model itself.

## Findings
- `orders` model DOES have `memo String? @db.Text` (schema line 228; verified via `src/generated/prisma/schema.prisma`, NOT the protected `prisma/schema.prisma`).
- `createOrder` (order-actions.ts:348) saves memo from AddOrderModal's "Memo / Note" input.
- BUT real DB check: 0 of 462 orders have memo data — column always shows "—".
- Asked user → chose "Remove from orders (1 & 2)" (keep memo in Payments section 4).

## Changes
- `DebtBreakdownClient.tsx`: removed Memo column from Sections 1 & 2 (reverted to Order | Date | Total Amount, colSpans 3/2, min-w 480px); removed `memo` from OrderRow interface. Memo column + MemoCell + dialog remain in Section 4 (payments).
- `debts-breakdown/page.tsx`: removed `memo: true` from the orders select (kept for payments + round_payments).

## Verification
- `npx tsc --noEmit` clean; eslint clean on both files.

---

## Round 3 — Order ID opens ManageOrderDetailsModal

## Request
- Clicking an order ID (#ORD-x) in debts-breakdown Sections 1 & 2 should open the same order detail dialog as manage orders.

## Changes
- `DebtBreakdownClient.tsx`:
  - Imports: ManageOrderDetailsModal, getOrderById (order-actions), AdminOrder type, toast, Loader2.
  - Local `orderList` state (seeded from orders prop) drives Sections 1 & 2 + debt memos, so approve/update/delete in the modal reflect in the tables/totals.
  - `openOrderDetails(id)`: fetches full order via `getOrderById` → opens ManageOrderDetailsModal; spinner on the clicked ID while loading.
  - `OrderIdButton` replaces the plain order cell in both tables (hover: secondarycolor + underline, cursor-pointer, title tooltip).
  - Modal wired with `payments` (order payments) and onApproved/onDeleted/onUpdated handlers mirroring ManageOrdersPageContent's local-state updates.

## Verification
- `npx tsc --noEmit` clean; eslint clean.

---

## Round 4 — Print button + print options dialog

## Request
- Print button at top of debts-breakdown page → print options dialog with:
  - Font: extra big, big, medium, small, extra small
  - Ethiopian + Gregorian printing date at top of print
  - Normal (non-bold) font + very dark (#111) color for title etc.
  - "All Bold" toggle
  - Table include checkboxes (all checked initially): Order Debt (Requested), Round Orders Debt, Rounds, Payments History, Debt Calculation

## Changes
- `DebtBreakdownClient.tsx`:
  - Imports: Printer icon, Button, DialogFooter, `formatDate as formatCalendarDate` from calendar-utils (forces both calendars regardless of user preference).
  - Print state: printFontSize (5 sizes, default medium), printBold (default off → font-weight 400), 5 include checkboxes (default all true).
  - `printFontMap`: extra-big 22px, big 18px, medium 15px, small 12px, extra-small 10px.
  - `handleDebtPrint()`: builds full HTML doc (same window.open/print pattern as ManageOrderDetailsModal): h1 + shop name + Ethiopian & Gregorian dates + always-present summary box (Total Debt / Total Paid / Remaining), then the 5 selected sections (tables mirror on-screen columns incl. truncated 30-char memo in payments; calc section = step 1 + step 2 receipt rows). @page A4 portrait, page counter footer.
  - Header: right-aligned "Print" button below the title row opens the dialog.

## Verification
- `npx tsc --noEmit` clean; eslint clean.

---

## Round 5 — Manage payment details page: Totals Card restructure (same day)

## Request
- Restructure the Totals Card (primarycolor card beside shop info at top of admin manage_payment detail page):
  - Section 1: Previous Debt (+ keep Edit button) → Paid for Previous Debt (sum of payments with is_for_previous_debts) → Order Debt (approved requested orders) → Order Paid (sum of ALL order-source payments from history)
  - Section 2: Total Round Debt (round-type orders + roundrecords totalprice) → Total Round Paid (sum of round-source payments)
  - Section 3: Total Debt = previous + order + round debt; Total Paid = ALL payments; Total Remaining = Total Debt − Total Paid

## Changes
- `ManagePaymentDetailClient.tsx`:
  - New derived values after debtBreakdown: prevDebtPaid (useMemo), cardRoundDebt, cardTotalDebt (reactive to previousDebtValue edit), cardTotalPaid, cardTotalRemaining.
  - Desktop Totals Card + mobile accordion rebuilt with the 3 sections; trigger now shows Total Remaining + Total Debt.
  - Edit Previous Debt dialog previews use new formula (cardTotalDebt − previousDebtValue + newValue); warning copy updated to "previous debt, order debt and round debt".
  - Removed `totals` from destructuring (prop kept in Props interface so page.tsx untouched) — fixes new unused-var warning.

## Verification
- `npx tsc --noEmit` clean; eslint = baseline (2 pre-existing rules-of-hooks errors + 10 warnings), no new issues.

---

## Round 6 — Totals Card widened by 1/3 (desktop)

## Request
- Make the Totals Card 1/3 wider on PC, taking the space from the Shop Info Card.

## Changes
- `ManagePaymentDetailClient.tsx`: top grid `lg:grid-cols-3` → `lg:grid-cols-9`; Shop Info Card `lg:col-span-2` → `lg:col-span-5` (6/9 → 5/9); Totals Card gets `lg:col-span-4` (3/9 → 4/9 = +1/3). Mobile layouts untouched.

## Verification
- `npx tsc --noEmit` clean.

---

## Round 7 — Totals Card stacked layout

## Request
- In the Totals Card, each figure's title and number should be on separate (stacked) lines instead of side-by-side.

## Changes
- `ManagePaymentDetailClient.tsx`: Section 3 (Total Debt / Total Paid / Total Remaining) switched from `flex items-center justify-between` rows to stacked `space-y-1` blocks — desktop + mobile accordion. Sections 1 & 2 were already stacked.

## Verification
- `npx tsc --noEmit` clean.

---

## Round 9 — Check Summary / Total Info / Round Books share one row

## Changes
- `ManagePaymentDetailClient.tsx`: those three cards set to `lg:col-span-3` each → one row of three with the grid's `gap-6 md:gap-8` gutters. Payment Info + Debt Breakdown remain full row (`lg:col-span-9`).

## Verification
- `npx tsc --noEmit` clean.

---

## Round 10 — Printing/payments: delete payment in details dialog (same day)

## Request
- In admin printing/payments payment details dialog: add a deletion option with warning + typed sentence to confirm.

## Changes
- `printer-shop-payment-actions.ts`: new `deletePrinterShopPayment(id)` — auth check, soft delete (`is_deleted: true`) on `payment_records_from_shop_to_printer`, revalidate printing/payments.
- `PrinterPaymentsTable.tsx` (DetailDialog):
  - State: deleteConfirmOpen / deleteText / isDeleting (reset on payment change).
  - `handleDelete`: soft-deletes the record, toasts, closes dialog, router.refresh.
  - Danger Zone block (rose) with Delete Payment button placed after the status/approved banners.
  - AlertDialog requires typing "I am sure I want to delete payment #{id}" (delete must match exactly); rose theme, Delete Permanently disabled until match.
  - Imports: Trash2, deletePrinterShopPayment.

## Verification
- `npx tsc --noEmit` clean; eslint 0 errors, 7 pre-existing warnings (unused vars/deps, not from new code).

---

## Round 11 — Remove "exceeds total paid" error in PrinterShopPaymentDialog (same day)

## Request
- In manage_orders → order details → payment → printer payments: remove the error/red styling shown when the amount exceeds the order's total paid, and any restriction.

## Findings
- The only such error lives in `PrinterShopPaymentDialog.tsx` (`exceeds` = total printer paid + entered > orderPaid): rose input styling + warning message. It never blocked submission ("still can be recorded" text). RecordPaymentModal (order payment) has no such check — verified by grep.

## Changes
- `PrinterShopPaymentDialog.tsx`: removed `exceeds` computation, rose input/ETB styling, and the exceeds warning paragraph. Neutral info line ("Total paid for order: X · After this: Y") now always shows when orderPaid != null. Removed now-unused `AlertTriangle` import + `cn` import.

## Verification
- `npx tsc --noEmit` clean; eslint = exact 6 pre-existing warnings (confirmed via git stash baseline), 0 errors.

---

## Round 12 — Totals Card: approved-only paid + approved order debt (same day)

## Request
- Totals Card should count only APPROVED payments toward "paid"; Order Debt should sum only approved orders.

## Findings
- Order Debt already filtered `is_approved` requested orders (debtBreakdown.orderDebt) — no change needed there.

## Changes
- `ManagePaymentDetailClient.tsx`:
  - `prevDebtPaid` now filters `status === "APPROVED"` too.
  - New `approvedPaidStats` useMemo: orderSum / roundSum / total from allPayments with `status === "APPROVED"`.
  - `cardTotalPaid = approvedPaidStats.total` (was paymentInfoStats.totalAmount = all statuses).
  - Desktop + mobile labels updated: "Paid for Previous Debt (Approved)", "Order Debt (Approved Requested Orders)", "Order Paid (Approved Payments)", "Total Round Paid (Approved Payments)", "Total Paid (Approved Payments)".
  - Card figures use approvedPaidStats.orderSum / roundSum instead of paymentInfoStats.

## Verification
- `npx tsc --noEmit` clean.

---

## Round 15 — Main card: new debt/paid bucketing (same day)

## Request
- Order Debt = ALL approved orders (requested + on-round); Order Paid = all approved order-source payments (linked or general); Round Debt = rounds table only; Round Paid = approved round payments; add a Remaining line under both order and round sections.

## Changes
- `ManagePaymentDetailClient.tsx`:
  - New: `cardOrderDebt` (Σ total_amount of all is_approved orders), `cardOrderRemaining`, `cardRoundDebt = debtBreakdown.roundsDebt` (roundrecords only), `cardRoundRemaining`; total = previous + order + round; Total Paid/Remaining unchanged (approved-only).
  - Desktop + mobile sections relabeled: "Order Debt (All Approved Orders)", "Total Round Debt (Rounds Table)", plus rose/emerald "Remaining" line under each.
- NOTE (accepted semantics): previous-debt + unlinked approved payments still count inside Order Paid (per user: "generally recorded as order payment"); on-round order approval not distinguished from requested (per user: "both approved").

## Verification
- `npx tsc --noEmit` clean; eslint baseline unchanged.

## Request
- Total Info card's Unpaid Order Debt should also subtract approved order-source payments that are NOT linked to an exact order (no/unparseable orderid, or orderid pointing to a non-existent order of this shop).

## Changes
- `ManagePaymentDetailClient.tsx` (desktop + mobile Total Info):
  - New `unlinkedApprovedPaid`: approved `payments` whose parsed orderid is NaN or not in this shop's order id set.
  - `unpaidOrderDebt = max(0, Σ(total_amount − amount_paid) of approved requested orders − unlinkedApprovedPaid)`.

## Verification
- `npx tsc --noEmit` clean.

---

## Round 15 — Main card: new debt/paid bucketing (same day)

## Request
- Order Debt = ALL approved orders (requested + on-round); Order Paid = all approved order-source payments (linked or general); Round Debt = rounds table only; Round Paid = approved round payments; add a Remaining line under both order and round sections.

## Changes
- `ManagePaymentDetailClient.tsx`:
  - New: `cardOrderDebt` (Σ total_amount of all is_approved orders), `cardOrderRemaining`, `cardRoundDebt = debtBreakdown.roundsDebt` (roundrecords only), `cardRoundRemaining`; total = previous + order + round; Total Paid/Remaining unchanged (approved-only).
  - Desktop + mobile sections relabeled: "Order Debt (All Approved Orders)", "Total Round Debt (Rounds Table)", plus rose/emerald "Remaining" line under each.
- NOTE (accepted semantics): previous-debt + unlinked approved payments still count inside Order Paid (per user: "generally recorded as order payment"); on-round order approval not distinguished from requested (per user: "both approved").

## Verification
- `npx tsc --noEmit` clean; eslint baseline unchanged.

---

## Round 14 — Upfront payments recorded in payment history (same day)

## Request
- Record upfront payments in the payment history with an "Upfront" tag and linked order.

## Decision (user chose)
- CHECK upfront: order starts with amount_paid = 0; linked PENDING history record tagged "Upfront payment"; applies to the order only when the check payment is approved (prevents double-counting since approvePayment re-applies to amount_paid).
- DIRECT upfront: history record APPROVED (cash already received), linked to the order, tagged; amount_paid set at creation as before.

## Changes
- `order-actions.ts` `createOrder`:
  - Order created with `amount_paid = 0` when payment_type is CHECK.
  - Upfront > 0 → always creates a `payments` row with `orderid: String(order.id)`, `memo: "Upfront payment"`:
    - CHECK → status PENDING (with checkId).
    - DIRECT → status APPROVED (payment_type DIRECT).

## Verification
- `npx tsc --noEmit` clean.

---

## Round 16 - Debts-breakdown page: approved-only calculations + orange rows (same day)

## Request
- Order debt + round order debt: only approved orders in sums; total paid: only approved payments. Non-approved orders/payments stay listed with orange bg but excluded from sums.

## Changes
- DebtBreakdownClient.tsx:
  - roundOrders now filters is_approved; new requestedDisplay/roundDisplay list ALL orders for display.
  - totalPaid filters status === APPROVED.
  - Sections 1 & 2: render display lists; non-approved rows get bg-orange-50/80 + Not Approved badge + orange amount; totals relabeled (Approved Only).
  - Section 4 payments: non-APPROVED rows orange bg + orange amount; total relabeled Total Paid (Approved Only).
  - Headers updated (Requested - Approved Only, approved orders with round type). Section 3 (rounds) unchanged.

## Verification
- npx tsc --noEmit clean; eslint clean.

---

## Round 17 - Debt Breakdown card (detail page): approved-only figures (same day)

## Request
- In manage_payment detail page Debt Breakdown card: Order Debt + Round Order Debt from approved orders only; Total Paid from approved payments only.

## Changes
- ManagePaymentDetailClient.tsx:
  - debtBreakdown: roundOrders now filters is_approved (requestedOrders already did); totalPaid = approvedPaidStats.total (approved-only).
  - Reordered approvedPaidStats above debtBreakdown (fixed use-before-declaration tsc error).
  - Desktop card + mobile accordion relabeled: Total Order Debt (Requested - Approved Only), Round Orders Debt (Approved Only), Total Paid (Approved Only). Rounds row unchanged.

## Verification
- npx tsc --noEmit clean.

---

## Round 18 - Order details modal: payment memo in Payment Summary (same day)

## Request
- In manage_orders order details dialog Payment Summary, show the memo of each payment if it has one.

## Changes
- ManageOrderDetailsModal.tsx: each payment row in Payment Summary now shows 'Memo: "..." ' (italic, muted) under the date/amount line when payment.memo exists. filteredPayments already includes memo (payments prop).

## Verification
- npx tsc --noEmit clean.
