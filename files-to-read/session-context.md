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
