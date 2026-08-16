# Conversation Log — 2026-08-16 (remove Retail Shop)

## Summary
User wants the Retail Shop (separate project, 2nd database) fully removed from this system. Confirmed scope: remove only the Retail Shop project; KEEP "Selling to individual" (retail_management / retail purchases / walk-in customer, which uses the main DB).

## What was done
Deleted:
- `src/app/retail_shop_dashboard/` (entire dashboard: books, customers, orders, history, profile)
- `src/app/admin_dashboard/retail-shop/` (admin monitoring tabs: Overview/Books/Our-Books/Orders)
- `src/app/admin_dashboard/settings/retail-shop-accounts/`
- `src/app/actions/retail-actions.ts`, `retail-customer-actions.ts`, `retail-user-actions.ts`
- `src/lib/retail-prisma.ts` + `src/generated/retail-prisma/` + `prisma/retail/` schema
- `src/components/retail_shop_dashboard/RetailShopSidebar.tsx`
- `.env` `RETAIL_SHOP_DATABASE_URL`

Edited:
- `src/middleware.ts` — removed 'Retail Shop' role from both rolePathMap instances (was 12 roles, now 11)
- `src/app/actions/auth-actions.ts` — removed retailPrisma import, "Retail Shop" redirect case, and retail DB users login fallback
- `src/lib/dashboard-menu-config.ts` — removed Retail Shop menu (Main/Our Books/Orders) + Retail Shop Accounts subitem
- `src/lib/module-mapping.ts` — removed retail-shop dynamic-import entries (kept retail_management)
- `src/components/sidebar_components/admin_sideboard.tsx` — removed Retail Shop collapsible section + Retail Shop Accounts settings link
- `src/components/admin_dashboard_components/AdminMenuSearch.tsx` — removed retail-shop search entries + Retail Shop Accounts entry
- `src/app/actions/book-actions.ts` — removed getRetailEligibleBooks, setBookRetailAvailability, setAllBooksRetailAvailability (retail-shop only)

Also removed stale `.next/types` build artifacts for deleted routes (they failed tsc).

## Verification
- `npx tsc --noEmit` → exit 0 (clean)
- eslint on changed files → 0 errors, only pre-existing warnings
- No remaining code references to retail-prisma / retail_shop_dashboard / retail-shop / retail-actions / retailPrisma / RETAIL_SHOP_DATABASE_URL (only historical conversation-log docs mention them)

## Notes
- Dev server was stopped to delete the locked query_engine DLL; user needs to restart `npm run dev`.
- `available_for_retail` column on `books` stays (schema untouched; no code reads it now).
- "Selling to individual" (retail_management / retail purchases / walk-in customer) intentionally KEPT.

## Blockers
- None.