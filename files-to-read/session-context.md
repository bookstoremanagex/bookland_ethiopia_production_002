# Session Context — Bookland Ethiopia

## Project
Bookstore management system built with Next.js App Router, TypeScript, Prisma (PostgreSQL), Tailwind CSS, and shadcn/ui.

## Key Directories
- `/app/` — Routes, layouts, pages, server actions
- `/app/actions/` — Server actions (order-actions, retail-purchase-actions, transfer-actions, etc.)
- `/components/` — UI components including `/components/ui/` (shadcn)
- `/lib/` — Utilities, calendar context, etc.
- `/prisma/` — Schema (DO NOT MODIFY)
- `/public/` — Static assets

## Current Focus Area
**ManageOrderDetailsModal** (`/app/admin_dashboard/manage_orders/ManageOrderDetailsModal.tsx`):
The main approval modal for delivery orders. Features:
- Stock allocation per edition per store
- Advanced operations: edition quantity editing, remove book from order
- Print with Options dialog (custom print + store info mode)
- Lock/unlock books workflow

## Print System (ManageOrderDetailsModal)
Two print modes in the "Print with Options" dialog:
1. **Custom Print** — user toggles columns (Shop, Date, Qty, Price, Subtotal, Edition, Store, Status, Delivery) + Font Size + Page Width. Store column auto-enables Edition.
2. **Store Info** — fixed table: Book | Edition | Qty | Store (shows per-store allocation). Only Font Size + Page Width controls are active.

Both modes use `getStoreForEdition()` to resolve store allocation data per edition (from `bookAllocations` state for pending orders, from `allocation_summary` text for approved orders, falling back to `bookBreakdowns`).

## Server Actions
- `order-actions.ts` — createOrder, getBookStockBreakdown, approveOrder, removeBookFromOrder, markOrderDelivered, getAllOrders
- `retail-purchase-actions.ts` — createRetailPurchase, approveRetailPurchase
- `transfer-actions.ts` — searchBooks, getBookStockData

## Key Data Flow
- `bookAllocations` state mirrors admin's store allocation inputs (per-edition, per-store quantities)
- `bookBreakdowns` state holds stock availability data from `getBookStockBreakdown()`
- `ignoredBookIds` tracks books marked as ignored (skipped during approval)
- `editedEditionQtys` stores user-overridden edition quantities

## Styling
Bold, italic, uppercase, tracking-widest, heavy use of `font-black`. Color scheme: primarycolor, secondarycolor, emerald for success, amber for warnings, rose for errors.

## Recent Changes
- MAIN DB repaired (2026-08-17): ran `scripts/fix-auto-delivery-printers.mjs` against the main DB. Fixed 2 dummy "Auto-delivery" print orders (editions 143, 131) whose stored printer was the arbitrary first printer (Mamush) → re-pointed to the real project printer (H&F). 46 dummy orders skipped — those editions have no real print project and no connected printer, so nothing to attribute (they display as no/unknown printer). Main DB has NO `bookeditionprinters` records (same as sample). Code changes still need deploying to the app that serves the main DB.
- Book details editions tab printer column (round 2): all four `EditionsInfo.tsx` (admin, operation_manager, inventory, viewer) now use the shared `resolveEditionPrinterName` (src/lib/printer-utils.ts) — connected printer → most recent real (non-auto-delivery) print order's printer → "Not Assigned". The book-detail page queries (`books/[id]/page.tsx` x4) now include ALL `printorder_items` ordered by createdAt desc (was `take: 1`, which could be a dummy order).
- Book details editions tab printer column: all four `EditionsInfo.tsx` components (admin, operation_manager, inventory, viewer) now show ONLY the connected printer (`bookeditionprinters[0].printer.name`); removed the fallback to `printorder_items[0].printorder.printer.name` which displayed the arbitrary dummy auto-delivery printer. Not connected → "Not Assigned".
- No-fake-printer fix: `resolveEditionPrinterName` (src/lib/printer-utils.ts) no longer falls back to a dummy "Auto-delivery" order's printer — a printer is only shown if it's the connected printer (`bookeditionprinters`) or from a real (non-auto) print order; otherwise null/"Unknown". Tightened the `(isAutoDelivery ? authoritative ?? null : null) || order.printer.name` pattern in `delivery-actions.ts` getDeliveryRecords, admin + op_manager `printing/delivery-records/page.tsx` and `printing/info/page.tsx`, and removed the dummy-order fallback in `EditionDetailsClient.tsx`. Prevents delivery records / printing info from showing the arbitrary first printer when no printer was actually assigned.
- Creation-time fix: `recordPrinterDeliveries` in `store-inventory-actions.ts` + `transfer-actions.ts` now (a) attaches new deliveries to REAL (non-auto-delivery) print order items first — dummy "Auto-delivery" items are only used once real items are exhausted, and new items are added to a real order when available; (b) when creating a fresh dummy order, the printer falls back to the edition's most recent real print order's printer before `printer.findFirst()`. Prevents NEW data from landing on the wrong printer.
- Printer deliveries fix (`printer_full/deliveries`): `getPrinterDeliveries` in `src/app/actions/printer-delivery-actions.ts` no longer drops records under dummy "Auto-delivery" orders and no longer filters by `printorder.printerId` alone. It now attributes those records to the edition's authoritative printer (via `getEditionAuthoritativePrinters`) — so each printer sees their recent transfers even when the transfer was recorded under a dummy order stamped with an arbitrary printer. `approveDelivery` grants access the same way. `scripts/fix-auto-delivery-printers.mjs` gained a `--db-url=` override to run against the main DB without touching `.env`.
- Edition detail "connected printer" fix: `admin_dashboard/books/editions/[id]/EditionDetailsClient.tsx` now skips dummy "Auto-delivery" print orders when picking the connected printer (was picking `printorder_items[0]` which could be a dummy order). Pure helpers split into `src/lib/printer-utils.ts` (client-safe: `isAutoDeliveryOrder`, `resolveEditionPrinterName`); `printer-resolution.ts` re-exports them and keeps the prisma-based `getEditionAuthoritativePrinters`.
- Printer consistency fix: created `src/lib/printer-resolution.ts` (shared `isAutoDeliveryOrder`, `resolveEditionPrinterName`, `getEditionAuthoritativePrinters`). Canonical printer priority: connected printer (`bookeditionprinters`) → most recent real (non-auto-delivery) print order's printer → any print order's printer. Applied to `printing/info`, `printing/list`, `printing/delivery-records` (admin + operation_manager) and `delivery-actions.ts` `getDeliveryRecords`. This fixes the auto-delivery dummy orders (created with arbitrary `printer.findFirst()` = first printer in DB) that made delivery records / printing info disagree with printing list / manage printing. `scripts/fix-auto-delivery-printers.mjs` updated to also fall back to the edition's real project printer; run `node scripts/fix-auto-delivery-printers.mjs` to correct underlying data.
- Printing Info pages (`/printing/info`) and Delivery Records pages (`/printing/delivery-records`) now resolve the printer via the edition's `bookeditionprinters` (connected printer) when the order is an "Auto-delivery" dummy order — same printer shown in Manage Printing / edition details. Applied to admin + operation_manager dashboards and `getDeliveryRecords` in `delivery-actions.ts`. Combined with `scripts/fix-auto-delivery-printers.mjs` (run `node scripts/fix-auto-delivery-printers.mjs`) this corrects wrong printers everywhere.
- Fixed wrong printer showing in `printing/delivery-records`: dummy "Auto-delivery" print orders used `printer.findFirst()` (arbitrary printer). Now they use the edition's connected printer from `bookeditionprinters` (same source as Manage Printing / edition details). Fixed in `recordPrinterDeliveries` in `store-inventory-actions.ts` and `transfer-actions.ts`. Repair script for existing bad records: `scripts/fix-auto-delivery-printers.mjs` (run `node scripts/fix-auto-delivery-printers.mjs`).
- Added Store Info print mode toggle + custom print mode refactored
- Store column re-added to custom print with auto-enable Edition
- Fixed `getStoreForEdition` to collect all stores per edition (was returning only first match)
- Approved order path now scopes allocation_summary parsing by book section
- Stale closure bug fixed: `handlePrintWithOptions` removed from `useCallback`
- Print options dialog made wider and more compact
- `@page` headers (Order ID) and footers (Page number) added to both print modes
- "ORDER SUMMARY" and "STORE ALLOCATION" h1 replaced with bold Order ID

## Blockers / Reminders
- `npx prisma generate` must be run before any `locked_editions` code works (schema defined, client not regenerated)
- `locked_editions` FK references `orders.id` — retail purchases store their ID as `order_id`; may fail if FK enforced at DB level
