# 2026-08-17 01:30 — Menu On/Off System: Completion

## Summary
Finished the menu on/off management system for the 4 managed dashboards (Operations Manager, Finance Officer, Inventory Manager, Viewer). All remaining items from the previous session were completed and verified against the DB.

## Key decisions / actions
- Removed forced "Settings"/"Theme Customization" enablement from `getEnabledMenuNamesForRole` (menu-actions.ts) — toggles are now authoritative.
- Cleaned stale deleted-dashboard roles from `ROLE_TO_ACCOUNT_TYPE` and `ACCOUNT_TYPE_TO_DASHBOARD`; `ACCOUNT_TYPES` narrowed to the 4 managed dashboards.
- `MenuManagementClient.tsx`: `ACCOUNT_TYPES` = 4 dashboards; added "Seed Menus" button (calls `seedDashboardMenus`, reloads page); Home toggle now locked (guard in `toggleMenu` + disabled toggle UI).
- `menu-seed-actions.ts`: fixed restore to set `deletedAt: now` (field is NON-NULLABLE — `deletedAt: null` throws PrismaClientValidationError). Same convention as existing `saveMenuAssignments`.
- Verified seed end-to-end against DB with temp script: Ops=17, Finance=12, Inventory=10, Viewer=12 menus; cleanup of stale assignments worked. Temp scripts deleted.
- `getMenuNameForPath` (registry) — removed unused `relative` var.
- tsc clean; eslint 0 errors (warnings pre-existing).

## Files changed
- `src/app/actions/menu-actions.ts` (removed forced Settings, cleaned role maps)
- `src/app/actions/menu-seed-actions.ts` (deletedAt: now fix)
- `src/app/admin_dashboard/settings/menus/MenuManagementClient.tsx` (ACCOUNT_TYPES, Seed button, Home lock)
- `src/lib/dashboard-menu-registry.ts` (minor cleanup)

## DB state (menu_management is_deleted=0)
- Operations Manager: 17 · Finance Officer: 12 · Inventory Manager: 10 · Viewer: 12 · Delivery Sample: 14 (unmanaged)

## Blockers
- None.

## Next steps (for future session)
- None required; feature complete. Optional: start dev server and manually verify sidebar toggling + 404 in browser.