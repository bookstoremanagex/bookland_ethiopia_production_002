# Conversation Snapshot — Viewer Dashboard Build (New)

Date: 2026-08-17

## Summary
Completed the full build of the NEW `viewer_dashboard` (read-only "Data Viewer" portal). The old viewer dashboard was deleted and replaced with a purpose-built dashboard that has its own hardcoded sidebar and menu structure. All tables were ported as read-only copies (Add/Edit/Delete/action-detail buttons stripped).

## Key decisions
- User-approved menu set: Home, Profile, Books, Book Shelf, Statistics (General/Books/Stores/Income), Stores, Book Shops, Reports (Completed/Pending Deliveries), Translators, Translation Work, Printing Info. NOTIFICATIONS was NOT selected.
- Viewer is read-only: "Add/New/Manage/Details" buttons and action columns removed from all ported tables.
- Reports tables (Completed/PendingDeliveriesTable) had their action columns stripped entirely (detail clients were not ported).
- Book detail (`books/[id]`) retains editable affordances (EditableBookContent) — consistent with the ops port precedent.
- Kept shared `UserMenu` (basePath `/viewer_dashboard`), `CalendarClientWrapper`, shared action modules.

## Files changed/created
- DELETED: entire `src/app/viewer_dashboard/` (old) + stale `.next/types/app/viewer_dashboard`.
- New `src/components/viewer_dashboard_components/`:
  - `ViewerSidebar.tsx` (top: Home/Profile; collapsible Catalog/Analytics/Network/Reports/Production groups; mobile bottom nav)
  - `BooksTable.tsx` (read-only: removed "Add Book" button)
  - `BooksShelf.tsx` (rewritten read-only: removed sort/drag-and-drop, edit-sort-index dialog, "Add Book")
  - `StoresTable.tsx` (read-only: removed "Add Store" button + actions/detail column + mobile Details link)
  - `BookShopsTable.tsx` (rewritten read-only: removed CRUD props onEdit/onDelete/onAdd/onPrint, actions column, Add Shop/Print buttons, Details links)
  - `TranslatorsTable.tsx` (copied from ops local; removed Add Translator button, Manage actions column, mobile Manage button)
  - `TranslationProjectsTable.tsx` (read-only: removed "New Translation Project" button, Update action column, mobile Update Progress link)
  - `book_details/` — BasicInfo, DesignInfo, CostsInfo (copied from admin; no admin links), TranslationInfo, EditionsInfo, StoresList, ShopDistributionList, DeleteBook (from ops port).
- New `src/app/viewer_dashboard/` routes (all verified to exist):
  - `layout.tsx` (ViewerSidebar + SidebarTrigger + CalendarClientWrapper + UserMenu basePath=/viewer_dashboard, force-dynamic)
  - `page.tsx` (hero + 3 stat cards + 4 quick links; fixed `?? []` on stores/books)
  - `profile/` (page + ProfileClient + actions.ts with revalidatePath → `/viewer_dashboard/profile`)
  - `books/` page, `books/shelf/` page (imports viewer BooksShelf), `books/[id]/` (page + EditableBookContent repointed to viewer book_details; Back link + DeleteBook redirect → `${dashboardRoot}/books`)
  - `statistics/` (copy of admin general page; heading → "Financial Overview", range links → `/viewer_dashboard/statistics?range=`)
  - `statistics/books`, `statistics/stores`, `statistics/income` (copied pages)
  - `stores/` page (read-only StoresTable), `book_shops/` page (read-only BookShopsTable)
  - `reports/completed-deliveries/` + `reports/pending-deliveries/` (pages + tables with action columns stripped, unused Link/Receipt/ExternalLink imports removed)
  - `production/translators/` (imports viewer TranslatorsTable), `production/translation-work/` (imports viewer TranslationProjectsTable)
  - `printing/info/` (page + PrintingInfoTable copied)

## Verification
- `npx tsc --noEmit`: CLEAN (0 errors).
- `npx eslint src/app/viewer_dashboard src/components/viewer_dashboard_components`: only 2 errors — the inherited `useColumns` react-hooks rule-of-hooks issues in the two report tables, identical to the admin originals. 0 new errors.

## Notes / Follow-ups
- Viewer sidebar is hardcoded (NOT DB-driven). DB `menu_management` for `account_type='Viewer'` still only has "Notifications" (menuId 99) — notifications NOT in the new sidebar; consider cleaning up DB assignments if menu-management should reflect the new menu.
- `notification-actions.ts` revalidates `/viewer_dashboard/notifications` (path no longer exists — harmless).
- `UserMenu` still renders a "Theme" item linking to `${basePath}/settings/theme` which 404s for viewer (and ops) — pre-existing pattern, not addressed.
- `BooksShelf.tsx` rewrite dropped the `layoutConfig` icons import cleanliness — verified no unused-import errors remain.