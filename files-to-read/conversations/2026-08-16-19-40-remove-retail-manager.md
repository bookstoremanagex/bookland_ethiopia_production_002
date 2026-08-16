# 2026-08-16 — Remove Retail Manager dashboard

## Summary
User requested removal of the Retail Manager dashboard entirely.

## What was done
Deleted:
- `src/app/retail_manager_dashboard/` (entire folder: page.tsx, layout.tsx, [...slug]/page.tsx)

Edited:
- `src/middleware.ts` — removed 'Retail Manager': '/retail_manager_dashboard' from both rolePathMap instances
- `src/app/actions/auth-actions.ts` — removed "Retail Manager" redirect case
- `src/app/actions/menu-actions.ts` — removed retail_manager_dashboard revalidatePath, retail_manager: "Retail Manager" from ROLE_TO_ACCOUNT_TYPE, "Retail Manager" from ACCOUNT_TYPES, and from ACCOUNT_TYPE_TO_DASHBOARD
- `src/app/actions/notification-actions.ts` — removed retail_manager_dashboard/notifications from both revalidate lists
- `src/components/sidebar_components/generic_sideboard.tsx` — removed "Retail Manager"/"retail_manager" from ROLE_TO_NOTIFICATION_TO map (2 spots)
- `src/app/delivery_sample_dashboard/page.tsx` + `src/app/admin_dashboard/notifications/page.tsx` — removed "Retail Manager" notification mapping
- `src/app/admin_dashboard/settings/accounts/[id]/AccountDetailClient.tsx` — removed Retail Manager <option> from role select

## Verification
- `npx tsc --noEmit` → clean (removed stale `.next/types/app/retail_manager_dashboard/` build artifacts)
- eslint on changed files → 0 errors, only pre-existing warnings

## Notes
- Only remaining "retail_manager" reference is the generated Prisma enum `RETAIL_MANAGER` (notification_to values) — schema untouched per rules.
- Existing Retail Manager accounts now fall through to `/admin_dashboard` default in middleware/auth redirects.

## Blockers
- None.