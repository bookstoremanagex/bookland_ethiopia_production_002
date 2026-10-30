# Conversation — 2026-10-30 — Book Follow Up page

## Request
Add an admin menu **Book Follow Up** under **Book Shelf**, showing every book with
its title, latest edition and production status. Needs:
- filter by selected status (multi-select)
- search by book title
- 4 sort modes: alphabet (Amharic first), alphabet (English first),
  latest edition created (newest on top), book added recently (newest on top)
- a reverse option for every sort mode
- no pagination

## Decisions
- **Production status now lives on `bookedition.productionstatus`** (the user
  added it; `books.productionstatus` still exists but the page ignores it).
  The table row shows the **latest edition's** status.
- "Latest edition" = newest non-deleted `bookedition` row by `createdAt`.
- Sorting/filtering/search are client-side (small dataset, no pagination).
- Route is a real static segment (`books/follow-up`), which wins over the
  existing `books/[id]` dynamic route.
- Admin sidebar menus are hardcoded in `admin_sideboard.tsx` (not registry /
  permission driven), so only that file needed the menu change.
- `dashboard-menu-config.ts` (`ALL_DASHBOARD_MENUS`) was intentionally **not**
  changed: it feeds the non-admin `generic_sideboard`, and adding a
  "Book Follow Up" sub-item there would create dead links on other dashboards.

## Files
- `src/app/actions/book-follow-up-actions.ts` (new) — `getBooksForFollowUp()`:
  every non-deleted book with **all** non-deleted editions (newest first) and
  the newest non-deleted `translatorbook` project. Each edition carries
  `productionstatus`, `createdAt` and a stock breakdown:
  `central` = `count_remening_for_transfer`, `stores` = Σ
  `bookeditionstores.quantity`, `printers` = Σ `bookeditionprinters.quantity`,
  `total` = their sum.
- `src/app/admin_dashboard/books/follow-up/page.tsx` (new) — server component,
  guarded with `checkCurrentUserRole("Viewing Books")`.
- `src/app/admin_dashboard/books/follow-up/follow-up-sort.ts` (new) — pure logic:
  `classifyTitle`, `compareEthiopic`, `compareRows`, `rowStatus`
  (= latest edition status), `buildStatusCounts`, `filterAndSortRows`, status
  labels/order.
- `src/app/admin_dashboard/books/follow-up/StatusBadge.tsx` (new) — shared
  status chip + colour map (`statusBadgeClass`).
- `src/app/admin_dashboard/books/follow-up/StatusEditor.tsx` (new) — the status
  chip in the table row is itself a `DropdownMenu` trigger: clicking it lists
  every production status (current one disabled with a check), and picking one
  calls `updateEditionStatus` for the **latest edition**. Optimistic chip +
  spinner, revert + toast on failure, `router.refresh()` on success. Also used
  in the mobile card.
- `src/app/admin_dashboard/books/follow-up/BookEditionsDialog.tsx` (new) — the
  shadcn `Dialog` opened by **More options**: lists every edition (latest
  first, "Latest" badge) with its status, created date and remaining copies
  (total + central/stores/printers breakdown). Each edition has a **status
  dropdown** (`Select`, coloured like the chip, spinner while saving, optimistic
  override reverted on failure, toast + `router.refresh()` on success). Editions
  with a null status show a dashed "Set status" placeholder.
- `src/app/actions/book-follow-up-actions.ts` — also exports
  `updateEditionStatus(editionId, status)`, which validates against the enum,
  updates `bookedition.productionstatus` and revalidates the follow-up + books
  paths. The enum list stays module-private because `"use server"` files may
  only export async functions.
- `src/app/admin_dashboard/books/follow-up/BookFollowUpTable.tsx` (new) — search
  box, status chips with counts (latest-edition status), 4 sort buttons +
  reverse toggle, desktop table and mobile card list, a "Translation" column and
  a "More" column opening the editions dialog. Books whose latest edition is
  `TRANSLATION` get **Go to Translation**, linking to
  `/admin_dashboard/production/translation_work/<projectId>`; with no project
  the button is disabled with "No project started". The dialog is keyed by
  `detailsBookId` (not a snapshot object) so `router.refresh()` updates both the
  open dialog and the table row after a status change.
- `src/components/sidebar_components/admin_sideboard.tsx` — "Book Follow Up" is a
  **standalone** menu item placed directly below "Book Shelf" (it is not a
  sub-item of a collapsible group).
- `src/components/admin_dashboard_components/AdminMenuSearch.tsx` — added a
  "Book Follow Up" entry to the command palette.

## Enum change (5 statuses)
The user trimmed `books_productionstatus` to `ON_PRODUCTION`, `TRANSLATION`,
`DESIGN`, `PRINTING`, `PREPRINTING` (removed `DISTRIBUTION`, `SALES`) and
regenerated the Prisma client. Every status choice list in the app now matches:
- `src/app/actions/book-follow-up-actions.ts` — `PRODUCTION_STATUSES` (used by
  `updateEditionStatus` validation).
- `src/app/admin_dashboard/books/follow-up/follow-up-sort.ts` — `STATUS_ORDER`,
  `STATUS_LABELS`.
- `src/app/admin_dashboard/books/follow-up/StatusBadge.tsx` — colour map.
- `src/lib/validation/book-schema.ts` — zod enum for the book form.
- `src/components/admin_dashboard_components/ProductionTable.tsx` — filter list.
- `src/components/admin_dashboard_components/book_details/BasicInfo.tsx` and
  `src/components/viewer_dashboard_components/book_details/BasicInfo.tsx` —
  inline status select.
- `src/components/form_components/AddBookForm.tsx` — status `<select>`.
The damaged-book dropdowns were **not** touched: they use `damagedbooks_type`,
which still has `DISTRIBUTION` / `SALES`.

## Notes
- Amharic ordering compares Unicode code points in the Ethiopic block, which
  matches traditional fidel order (same approach as `BooksPrintDialog`).
- Reversing "latest edition" also reverses the "no edition" rows (they sort as
  oldest); this is the literal reverse of the mode.
- Status chips are built from the statuses actually present in the data, in
  enum order, with "No Status" last.
- Translation projects are the `translatorbook` model (`bookId`, `Status`:
  `NOT_STARTED` / `STARTED` / `ONPROGRESS` / `COMPLETED`); their detail page is
  `/admin_dashboard/production/translation_work/[id]`. The follow-up query
  includes the newest non-deleted project per book so the button needs no
  extra round trip.
- "Remaining copies" = central warehouse (`count_remening_for_transfer`) +
  store stock (`bookeditionstores`) + printer stock (`bookeditionprinters`).
  The dialog always shows the three parts next to the total.
- Status edits only touch `bookedition.productionstatus`; `books.productionstatus`
  is left as-is (it is no longer read by this page).

## Translation projects — multiple translators + memo
The user changed `translatorbook` in the schema: `translator translator[]`
(implicit many-to-many with `translator`), plus new `edition String?` and
`info String @db.Text` (required). Implemented:
- `src/lib/validation/translation-project-schema.ts` — `translator_id` replaced
  by `translator_ids: number[]` (min 1); new optional `info` string (default
  `""`).
- `src/app/actions/translation-project-actions.ts` — create writes
  `translator_id = ids[0]` (legacy column / lead translator) and
  `translator: { connect: [...] }` for the whole set, plus `info`. Update does
  `translator: { set: [...] }` so removals persist, and both return the
  `books` + `translator` relations. Removed debug `console.log`s.
- `src/components/form_components/TranslatorMultiSelect.tsx` (new) — searchable
  multi-select (popover + Command) with removable chips, "Lead" marker on the
  first pick, and inline error.
- `src/components/form_components/NewTranslationProjectForm.tsx` — translator
  field is now the multi-select (`translator_ids`), plus a **Translation Memo**
  textarea (`info`).
- `src/app/admin_dashboard/production/translation_work/[id]/ProjectDetailsClient.tsx`
  and `src/app/operation_manager_full_dashboard/production/translation-work/[id]/ProjectDetailsClient.tsx`
  — show all translators as chips (falls back to `translator_id`), edit them
  with the multi-select, and display/edit the memo.
- `src/components/admin_dashboard_components/TranslationProjectsTable.tsx` and
  `src/components/viewer_dashboard_components/TranslationProjectsTable.tsx` —
  `translator` is now an array; added a `translatorNames()` helper and render
  all names ("N translators") in the table + mobile card.
- `edition` was added to the schema by the user; now used (see next section).

### Create/update gotcha fixed
- `bookId` + `translator` cannot be mixed in one Prisma write (unchecked vs
  checked input). Both paths now use `books: { connect: { id } }` /
  `updateData.books = { connect: { id } }`.
- Legacy rows (only `translator_id` set) are enriched read-only at fetch time by
  `withLegacyTranslators()` in `getTranslationProjects` and
  `getTranslationProjectById`, so old projects still show their translator name.

## Translation project creation — any book, book/edition quick-create
New requirement: the project form must accept **any** book in the system, be
able to create a book inline, and always pick (or create) an **edition**.
Decisions taken with the user:
- `translatorbook.edition` stores the **edition id as a string**.
- Inline new book shows the same fields as the print-order drawer
  (title/author/category/publication year/language); only title is required and
  the year is pre-filled with the current year. Code + SKU are generated.
- A book created this way gets `productionstatus = TRANSLATION`.
- Picking an **existing** edition forces its `productionstatus` to TRANSLATION
  (applied when the project is saved, so an abandoned form changes nothing).

Implemented:
- `src/components/form_components/BookEditionPicker.tsx` (new) — book combobox
  over every book, inline "Quick create book" panel, edition combobox plus
  inline "Quick create edition". New editions are created empty: name +
  TRANSLATION, every text field null and every money/count field 0. Suggests
  "First Edition" / "Edition N". Both values are emitted through one `onChange`.
- `src/app/actions/translation-project-actions.ts`
  - `getAvailableBooks()` no longer filters to `productionstatus = TRANSLATION`;
    it returns all non-deleted books with their live editions.
  - `createTranslationProject` now requires `edition_id`, verifies the edition
    belongs to the chosen book (`assertEditionBelongsToBook`), stores
    `edition: String(edition_id)` and calls `moveEditionToTranslation`.
  - `updateTranslationProject` accepts `edition_id`, re-validates book/edition
    pairing and forces TRANSLATION.
  - New `quickCreateTranslationBook()` and `quickCreateTranslationEdition()`.
  - `getTranslationProjects()` now includes `books.bookedition` (id + name).
  - Shared `revalidateProjectPaths()` replaces the repeated revalidate calls
    (also refreshes the viewer path).
- `src/lib/validation/translation-project-schema.ts` — `edition_id` required,
  with a preprocess that turns empty/missing into 0 so the friendly
  "Edition is required" message always shows (Zod 4 ignores `min` messages for
  NaN).
- `NewTranslationProjectForm.tsx` — book+edition block is now the picker
  (full width); `bookId`/`edition_id` are two nested `Controller`s.
- Admin + operation-manager `ProjectDetailsClient.tsx` — edit mode uses the
  same picker; read mode shows a new **Edition** card (resolves the stored id
  through the book's editions, falls back to `Edition #<value>`); save is
  blocked with a toast when no edition is selected.
- Admin + viewer `TranslationProjectsTable.tsx` — added an `editionName()`
  helper and show the edition next to the book code and in the mobile card
  (one book can now have several translation projects, one per edition).

Follow-up tweak (same session): the inline new-book panel now pre-fills
**Author = "Sample Name"**, **Category = "Undecided"**, **Language = "Amharic"**
(all editable, and cleared back to these after a successful create), and the new
edition name defaults to **"On Translation Edition N"** (N = existing editions
+ 1), editable before creating.

## Translation work list — "passed this stage"
A project can outlive the translation stage. In the Status column the table now
checks the production status of the project's edition (falling back to
`books.productionstatus` for legacy projects without an edition):
- `TRANSLATION` (or no status) → the normal project Status badge as before.
- Any other status (`ON_PRODUCTION`, `DESIGN`, `PRINTING`, `PREPRINTING`) → a
  green **"Passed This Stage"** badge; hovering shows
  "Current status: <label>" via the shadcn Tooltip.
Implemented in both `TranslationProjectsTable.tsx` files (desktop cell + mobile
card) with local `currentProductionStatus()` / `hasPassedTranslationStage()` /
`PassedStageBadge` helpers. `getTranslationProjects()` now also selects
`productionstatus` for each edition.
Fix: this project's `Tooltip` is built on the unified `radix-ui` package, whose
`Tooltip` root throws without a provider, so `PassedStageBadge` now wraps itself
in `<TooltipProvider delayDuration={0}>` (instant hover).

## Incident — `/admin_dashboard/books` enum decode error
`Invalid prisma.books.findMany() invocation: Value '' not found in enum
'books_productionstatus'`.
- Cause: after the enum was trimmed to 5 values, MySQL converted the rows that
  used to hold `DISTRIBUTION`/`SALES` into `''` (its invalid-value marker). Any
  full-row read then failed to decode. Not a code bug — 3 rows, ids 119, 121,
  123 (`አስበህ ሀብታም ሁን`, `የቢዝነስ ጥበብ`, `The Let Them Theory`).
- `bookedition` had no `''` rows. `information_schema` confirmed both columns
  are now `enum('ON_PRODUCTION','TRANSLATION','DESIGN','PRINTING','PREPRINTING')`.
- Fix (user-approved): one `UPDATE books SET productionstatus='ON_PRODUCTION'
  WHERE productionstatus=''` → 3 rows. All their editions were already
  `ON_PRODUCTION`, so book and edition stay consistent.
- Verified with the generated client: typed read of all 137 books decodes fine,
  and a `getBooks()`-equivalent query (`include: bookedition`, `orderBy`
  `book_sort_index` nulls last) returns 135 non-deleted rows.
- Gotcha for later: trimming a MySQL enum that holds data always leaves `''`
  rows; they must be repaired with SQL or Prisma reads will throw.

## Follow-up table action — edition link when not translating
The Action column (previously "Translation") now branches on the **latest
edition's** status:
- `TRANSLATION` → "Go to Translation" as before (disabled + "No project started"
  hint when there is no `translatorbook` row).
- Any other status (`ON_PRODUCTION`, `DESIGN`, `PRINTING`, `PREPRINTING`) →
  "Edition Details" link to `/admin_dashboard/books/editions/{edition.id}`,
  with the edition name as a caption.
- No edition → em dash.
Implemented as `StageAction` in `BookFollowUpTable.tsx` (replaces
`TranslationAction`), shared `ACTION_LINK_CLASS`, used by both the desktop cell
and the mobile card (mobile renders it only when an edition exists, so it now
also appears for non-translation rows).

## Editions dialog — guaranteed scrolling
The "More options" dialog (`BookEditionsDialog.tsx`) could clip long edition
lists instead of scrolling. `DialogContent` is now `flex flex-col` (display
override wins over the shadcn default `grid` via tailwind-merge) with
`max-h-[90dvh] overflow-hidden`; header and footer are `shrink-0`, and the list
is `min-h-0 flex-1 max-h-[60dvh] overflow-y-auto overscroll-contain` so it
always scrolls on its own. Added a thin themed scrollbar (webkit + Firefox
`scrollbar-width/color`) and, when there are more than 3 editions, a caption
"Scroll the list to see all N editions". The list is also focusable
(`tabIndex={0}`, `aria-label`, focus ring) so it can be scrolled by keyboard.

## Incident — live production DB switched, same error on `bookedition.findMany`
`.env` now points at the live DB (`91.204.209.21:3306`, `bookland_main_db`).
`Invalid prisma.bookedition.findMany() invocation: Value '' not found in enum
'books_productionstatus'`.
- Reproduced precisely: `bookedition.findMany({ take: 1 })` OK,
  `bookedition.findMany({ take: 1, include: { books: true } })` throws,
  `books.findMany({ take: 1 })` throws. So `bookedition.productionstatus` is
  clean (179 rows, all `ON_PRODUCTION`); the **included `books` row** is the
  offender — 144 of 149 books held `''`.
- Both enum columns already have the 5 values; a drift check of every model in
  `src/generated/prisma/schema.prisma` against `information_schema` found no
  missing tables or columns (implicit m2m table is
  `_translatorTotranslatorbook`; `translatorbook` has 0 rows in prod).
- Fix (user-approved, chose `ON_PRODUCTION`): snapshot of the 144 affected rows
  written to `%TEMP%/opencode/books-enum-empty-backup.json` first, then
  `UPDATE books SET productionstatus='ON_PRODUCTION' WHERE productionstatus=''`
  in a transaction → 144 rows.
- Verified: 149 books all `ON_PRODUCTION`, 0 `''`; typed `books.findMany` (149),
  `bookedition.findMany include books` (178), follow-up query (143),
  translation query (0) and edition+stock joins (179) all decode.
- Side effect to remember: books now report `ON_PRODUCTION`, so any legacy
  translation project that must fall back to the book-level status would show
  "Passed This Stage". Harmless today (0 projects), relevant if such rows are
  ever created without an `edition`.
- Prod baseline: 149 books (143 live), 179 editions (178 live), 0 translation
  projects.

## Verification
- `npx tsc --noEmit` clean; eslint clean on all touched files.
- Final sweep after the `response.data ?? []` fix in the three
  `production/translation-work/page.tsx` files: `npx tsc --noEmit` passes with
  no output; eslint reports **0 errors** (only pre-existing warnings: unused
  `error`/icons/`cn`, `<img>`, `formatDate` hook dep).
- Book/edition quick-create change: `npx tsc --noEmit` clean again, eslint
  **0 errors** on every touched file (same pre-existing warnings only).
  `getAvailableBooks()` was verified to be used only by the four translation
  pages, so widening it cannot affect other screens.
- `git status` shows only intended files; `prisma/schema.prisma` and
  `src/generated/prisma/*` are the user's own changes (not touched by me).
- Throwaway script (temp dir) covered: title classification, Ethiopic fidel
  order, all 4 sort modes forward + reversed, title search (case-insensitive,
  Amharic substring), multi-status filtering incl. "no status", status counts
  order/labels, and that the source array is never mutated.

## Blockers
None.
