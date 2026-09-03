# Conversation — 2026-09-03 payment-info-accurate-stats

## Summary
Fixed the "Payment Info" card on the admin manage_payment detail page to show accurate counts and sums by counting ALL payments from the Payment History and categorizing them by how they are recorded.

## Request
- Payment Info should count all payments shown in Payment History and categorize them into Order Payments and Round Payments (per the source badge already shown in the history list), with accurate numbers and sums.

## Changes
- `src/app/admin_dashboard/manage_payment/[id]/ManagePaymentDetailClient.tsx`:
  - Added `paymentInfoStats` useMemo computed from `allPayments` (the exact data behind the Payment History list): orderCount/orderAmount (source === "order"), roundCount/roundAmount (source === "round"), totalCount/totalAmount.
  - Desktop + mobile Payment Info cards now render: All Payments (count + sum), Order Payments (count + sum), Round Payments (count + sum). Removed the old logic that only counted APPROVED payments matched by orderid (which missed pending/rejected/unmatched payments and mislabeled categories).
  - Amounts use `formatAmount` for consistent decimal formatting.

## Verification
- `npx tsc --noEmit` clean (exit 0).
- `npx eslint` on the file: same 2 pre-existing errors + 10 warnings as unmodified file (verified via git stash) — no new issues introduced.

## Notes
- Categorization follows the same source tag displayed in Payment History rows ("Order" / "Round" badges).

---

## Round 2 — Debt Breakdown section (same session)

## Request
- Add a section below Payment Info showing: 1) Total Order Debt (requested orders total), 2) Round Orders Debt (orders with type "on round"), 3) Rounds debt (roundrecords totalprice), 4) Total Paid, 5) Total Debt = sum of 1-3 (with the rows adding up shown), 6) Remaining = Total Debt - Total Paid.

## Changes
- `ManagePaymentDetailClient.tsx`:
  - New `debtBreakdown` useMemo: orderDebt (approved requested orders' total_amount), roundOrderDebt (on-round orders' total_amount), roundsDebt (sum of roundrecords.totalprice), totalDebt (sum of the three), totalPaid (orders' amount_paid + approved round-record payments), remaining.
  - New "Debt Breakdown" card (`lg:col-span-3`, desktop + mobile accordion) placed directly below Payment Info: 3 colored summary tiles, a breakdown box listing all 3 rows with their sum (Total Debt), then Total Paid and Remaining tiles.

## Incident + recovery
- While relocating the new section (first insert landed above Check Summary), used a PowerShell Get-Content/Set-Content rewrite which mangled non-ASCII chars (em-dashes) in the file; `git checkout --` was then run to discard, which also reverted Round 1's uncommitted Payment Info work.
- Recovered by redoing BOTH rounds' edits with the Edit tool only. Lesson: never rewrite source files via PowerShell cmdlets; use Edit tool.

## Verification (final state)
- `npx tsc --noEmit` clean (exit 0).
- eslint: same 2 pre-existing rules-of-hooks errors + 10 warnings as baseline; no new issues.
- Encoding verified clean (0 U+FFFD replacement chars).
- Card order in grid: Check Summary → Total Info → Round Books Summary → Payment Info → Debt Breakdown → (mobile Total Info accordion).

## Round 3 — Total Paid source change
- User: Debt Breakdown's "Total Paid" should equal the sum of ALL payments in Payment History (not amount_paid/approved-only logic).
- Change: `debtBreakdown.totalPaid = paymentInfoStats.totalAmount` (sum of allPayments, both sources, all statuses); remaining = totalDebt - totalPaid unchanged. tsc clean.

## Round 4 — Debt Breakdown detail page
- User: add a Details button at the end of Debt Breakdown card that opens a new detail page showing: total order debt (requested) + per-order list; round order debt + list; rounds + list; payments table with dates/amounts; remaining (total debt - total paid) at top.
- New files:
  - `src/app/admin_dashboard/manage_payment/[id]/debts-breakdown/page.tsx` (server fetch: orders, payments w/ check, roundrecords, round_payments)
  - `src/app/admin_dashboard/manage_payment/[id]/debts-breakdown/DebtBreakdownClient.tsx` (mirrors debtBreakdown math exactly: approved requested orders, on-round orders, roundrecords, totalPaid = ALL payments; remaining summary cards at top; 4 table sections each with total row)
- `ManagePaymentDetailClient.tsx`: full-width "Details" Link button added at end of Debt Breakdown desktop card + mobile accordion → `/admin_dashboard/manage_payment/{id}/debts-breakdown`.
- Verification: tsc clean; eslint shows only the 2 pre-existing errors in ManagePaymentDetailClient.

## Round 5 — Calculation walkthrough on detail page
- User: at the end of the debts-breakdown detail page, show the calculation in detail (which numbers are added → total debt, then total debt − total paid → remaining).
- Change: `DebtBreakdownClient.tsx` gained a "How The Remaining Debt Is Calculated" section: Step 1 receipt-style addition (Order Debt + Round Orders Debt + Rounds = Total Debt), Step 2 subtraction (Total Debt − Total Paid = Remaining Debt), and a final remaining result banner. tsc clean.

## Round 6 — Top summary + section header clarifications (detail page)
- Top three summary numbers on debts-breakdown page: made smaller (text-base) and removed card backgrounds/borders — now plain label + value text.
- Section 2 header now: "Round Orders Debt (orders registered in the orders table with round type)".
- Section 3 header now: "Rounds (round records in the rounds table)".
- tsc clean after both tweaks.

## Round 7 — Mobile responsive tables (debts-breakdown page)
- All 4 tables (requested orders, round orders, rounds, payments) wrapped in `overflow-x-auto -mx-2 px-2` containers with `min-w-[480px]`/`min-w-[560px]`/`min-w-[720px]` on the Table so they scroll horizontally on mobile instead of squishing.
- Date/amount cells get `whitespace-nowrap`; section headers use `flex-wrap` so totals wrap under the title on narrow screens.
- tsc + eslint clean.
