# 2026-08-17 02:00 — Settings/Menus: Hide Unavailable Menus

## Summary
Menu Management page now only shows the menus that actually exist for the selected dashboard type (per `DASHBOARD_MENU_REGISTRY`), instead of the full DB `menus` tree.

## Key decisions / actions
- Imported `DASHBOARD_MENU_REGISTRY` into `MenuManagementClient.tsx`.
- Added `currentDashboard` (lookup by `accountType` === selectedRole), `allowedNames` set, and `filteredTree` memo.
- `filteredTree`: keeps a DB parent only if it or a child is in the registry; children filtered to registry names; orphaned children (whose DB parent is admin-only, e.g. "Translation Work" under "Translations", "Printers"/"Manage Printing" under "Printing", "Completed/Pending Deliveries" under "Reports") are promoted to top-level rows so they remain visible/toggleable.
- Added ICON_MAP entries for new registry menu names (Translators, Translation Books, Books List, Delivery Records, Printing Info, Shop Table, Edition Table, Costs, Round Info, Payments Due, Daily Report, Period Report, Low Stock, Manage Store, Store Options, Statistics, Book Shops).
- Replaced `menuTree.map` render with `filteredTree.map`.
- Verified: tsc clean; eslint only pre-existing warnings (0 new errors).

## Files changed
- `src/app/admin_dashboard/settings/menus/MenuManagementClient.tsx`

## Blockers
- None.

## Next steps (for future session)
- Optional: start dev server and manually verify the settings/menus page per dashboard shows only available menus.