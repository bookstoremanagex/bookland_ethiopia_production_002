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

## New enum value — `READY`
User added `READY` to `books_productionstatus` (schema + live DB; both columns
are now `enum(...,'PREPRINTING','READY')` and the generated client already
exports it). Every status list/label was updated so `READY` ("Ready") can be
chosen for books and editions:
- `src/lib/validation/book-schema.ts` — Zod enum (book create/update).
- `src/app/actions/book-follow-up-actions.ts` — `PRODUCTION_STATUSES`
  (server-side guard for edition status changes).
- `books/follow-up/follow-up-sort.ts` — `STATUS_ORDER` (last, enum order) +
  `STATUS_LABELS`; feeds the status filter chips, the chip editor and the
  editions dialog dropdown.
- `books/follow-up/StatusBadge.tsx` — emerald badge style for `READY`.
- `ProductionTable.tsx` — status filter option.
- `AddBookForm.tsx` — option in the create-book select.
- both `book_details/BasicInfo.tsx` — option in the editable field.
- both `TranslationProjectsTable.tsx` — `PRODUCTION_STATUS_LABELS`; `READY`
  already counts as "passed this stage" via the `!== "TRANSLATION"` check.
No DB change needed. Verified with a read-only count query against the live DB:
`prisma.books.count({ where: { productionstatus: "READY" } })` and the same for
`bookedition` both execute (0 rows so far), proving client + DB accept it.
`tsc --noEmit` clean, eslint 0 errors.

## In-production-only filtering (admin Books page + Print Options)
Rule chosen by the user: **only `ON_PRODUCTION` counts as "in production"**.
- `src/app/actions/get-books.ts`: `getBooks(options?)` gained
  `{ inProductionOnly?: boolean }`; when set, the `bookedition` include adds
  `productionstatus: "ON_PRODUCTION"`, so `editionCount` counts only editions
  still in production. Default (no option) is unchanged for the other callers
  (shelf, viewer, delivery, production books pages).
- `admin_dashboard/books/page.tsx` calls `getBooks({ inProductionOnly: true })`.
  Books with no in-production edition are dropped from the result (table rows),
  not just shown with 0 editions.
- `src/app/actions/book-actions.ts` → `getBooksStorePrintData()` (Print Options
  dialog): the edition `where` now also requires
  `productionstatus: "ON_PRODUCTION"`; everything else (earliest-edition price
  pick, store-stock >= 1 rule, sorting) is untouched.
- Verified against the live DB: 176 of 178 live editions are `ON_PRODUCTION`
  (so 2 are already excluded), and 130 books qualify for the print list.
- Follow-up: filtering moved into `getBooks()` itself — with
  `inProductionOnly` the mapped rows are `.filter(book => book.editionCount > 0)`,
  so a book whose editions all left `ON_PRODUCTION` disappears from the table.
  Live check: 142 rows shown, 3 hidden (`ትምህርተ ሺኖዳ`, `Test Translation Book`,
  `የፍልስፍና ሀሁ`), 177 in-production editions counted.
`tsc --noEmit` clean, eslint 0 errors.

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

## Print Detailed Info report (Stores → Store Options)
New button beside "Print Content" renders a printable report of every edition
that holds a quantity somewhere.
- `src/app/actions/store-inventory-actions.ts` → `getStoreDetailedInfoRows()`
  (+ `DetailedInfoBookRow` / `DetailedInfoEditionRow` types). Per book, per
  edition: `inStore` = sum of `bookeditionstores.quantity` over all stores,
  `readyToTransfer` = `count_remening_for_transfer`, `total` = sum of those two,
  `sellingPrice` = `selling_price`, `totalValue` = price × total. Editions with
  0 in both quantities are skipped; books left empty are dropped. Books ordered
  by `book_sort_index` then `createdAt desc`, editions by `createdAt asc`.
  Edition label is the running index (1, 2, 3 …) inside each book's table.
- `stores/options/detailed-info-html.ts`: builds the A4 HTML doc with GC +
  Ethiopian date badges on top and one table per book, plus a per-book Total
  row. Options: font size (Extra Small/Small/Medium/Big), orientation
  (Portrait/Landscape, default Landscape), All Bold.
- `stores/options/DetailedInfoPreview.tsx`: iframe preview, Print / Save PDF
  via `iframe.contentWindow.print()`.
- `stores/options/DetailedInfoDialog.tsx`: options dialog that fetches the rows
  and builds the HTML; wired into `stores/options/page.tsx`.
- Live DB check: 134 books / 138 edition rows, 91,328 copies,
  34,229,945.00 total value. `tsc --noEmit` clean, eslint 0 errors.

### Layout revision (user request)
One single table instead of one table per book:
- Book column first, and the title cell is merged (`rowspan`) across all of that
  book's edition rows, with the book's **total price in brackets** next to the
  title and the author on a small second line.
- The per-book subtotal row was removed (the total price now lives in the title
  cell), so the only "Total" column is the per-edition copy total.
- Edition numbers print only when a book has more than one listed edition;
  single-edition books leave that cell blank.
- Alternating tint is applied per book (`tr.alt`) and each book after the first
  gets a heavier top border, so merged groups still read as separate blocks.
- Verified by transpiling the real builder and checking the markup: 1 `<table>`,
  a 3-edition book emits `rowspan="3"` with 7/6/6 cells, a 1-edition book emits
  `rowspan="1"` with an empty edition cell.

### Dates repeated on every printed page
The title + both date badges moved out of the document body and into the report
table's `<thead>` (`tr.doc-head > th[colspan=7]`), so the browser repeats them at
the top of every page, right above the column headers. The empty-state rendering
still uses the standalone `.page-header` block.
- `.doc-head th` resets the generic `th` styling (white background, no borders
  except the 3px #408A71 bottom rule, centered, no uppercase).
- Verified by printing an 80-book sample to PDF with headless Chrome: 9 pages,
  MediaBox 841.92 x 594.96 (A4 landscape, so the print CSS is applied) and every
  page's content stream contains the header rule colour and 3 badge/column-head
  fills — i.e. the date badges render on all 9 pages.

### Real PDF viewer + downloader (replaces browser print)
The report now produces an actual PDF, using the same pipeline as the Books
print options (`@/lib/print-pdf` + canvas page images), instead of the browser
print dialog.
- `src/lib/print-file-name.ts` (new): `buildPrintFileName(date)` —
  `"የ <Ethiopian MMMM d yyyy> h:mm <dayPart>"` — extracted from
  `books/BooksPrintDialog.tsx`, which now imports it (no local copy left).
- `stores/options/detailed-info-layout.ts` (new): page model for A4 portrait
  (794x1123) and landscape (1123x794) at 96dpi, 7 weighted columns with minimum
  widths (so "EDITION" never breaks mid-word in portrait), wrapped cells,
  row heights, and pagination. A book split across pages repeats its merged
  title with "(cont.)"; edition numbering continues.
- `stores/options/detailed-info-canvas.ts` (new): renders a page to canvas
  (title + both dates + rule at the top of EVERY page, merged book cell with the
  total price in brackets, alternating group tint, heavier border between books,
  `Page x of y` footer). All text is clipped to its cell.
- `stores/options/DetailedInfoPreview.tsx` (rewritten): renders each page to a
  canvas at 2x, shows the JPEG pages in a scrollable preview, and
  **Download PDF** writes `${fileName}.pdf` via `downloadPdf()`. Preview and PDF
  use the same bytes.
- `stores/options/DetailedInfoDialog.tsx`: builds the pages with a canvas
  text-measure callback and opens the preview; button is now "Preview PDF".
  Uses `formatDate()` instead of the duplicated Amharic month/weekday arrays.
- `stores/options/detailed-info-html.ts` deleted (the iframe/print path).
- Verified visually by rendering the real modules in headless Chrome
  (landscape + portrait screenshots): headers wrap correctly, merged titles,
  edition numbers only when >1, dates on page 1 and 2.
- Layout check with synthetic data: 152 rows kept, 0 overflowing pages, at
  9/13/16px in both orientations, incl. a 20-edition book that splits with
  "(cont.)". Live data: 134 books -> 11 pages landscape / 9 portrait at 11px.
`tsc --noEmit` clean, eslint 0 errors (only pre-existing warnings).

### Title sorting options (Print Content + Print Detailed Info)
New shared module `src/lib/print-sort.ts`:
- groups titles into `amharic` | `english` | `numbered` (first character: digit,
  Ethiopic U+1200–U+137F, otherwise English) and supports all 6 group orders:
  `am-en-num`, `am-num-en`, `en-am-num`, `en-num-am`, `num-en-am`, `num-am-en`
  (`TITLE_SORT_OPTIONS` supplies the "Amharic → English → Numbers" labels).
- inside a group: Amharic by code point (traditional fidel order), English and
  numbers by `localeCompare("en", { sensitivity: "base", numeric: true })`.
- `sortTitles(items, order, getTitle)` / `compareTitlesByOrder(a, b, order)`.
- Books print options (`BooksPrintDialog`) now imports these helpers instead of
  keeping its own copies (its 3 options map to the same orders as before).
- `PrintContentDialog`: new "Book Order" selector (6 buttons); single-store list
  and the two-store title lists are sorted with the chosen order (`#` follows it).
- `DetailedInfoDialog`: same "Book Order" selector; rows are sorted before the
  PDF pages are built.
- Verified all 6 permutations on a mixed sample: `ሀገር | ቤት | ዘመን | Alpha | Beta |
  zebra | 2nd Edition | 3 Little Pigs | 10 Commandments` for the default, with
  every other order being a rotation of those three blocks.
`tsc --noEmit` clean, eslint 0 errors (2 pre-existing warnings).

### Info-tab status from latest edition + optional edition on Add Book
- `BasicInfo.tsx` (admin component, shared by admin/operation/inventory):
  production status now renders the latest edition's status
  (`book.bookedition[0]`, editions are loaded newest-first) instead of the
  book-level value. The field key is `edition_productionstatus`; the label is
  "Production Status (Latest Edition)". With no editions it shows N/A and is
  not editable. `renderEditableField` gained an optional value/disabled override,
  and a "Select..." option appears when the current value is null.
- `edition-actions.ts`: `updateEditionField` accepts `productionstatus` (enum
  validated) and revalidates the book detail path; `createEdition` accepts and
  validates `productionstatus` (omitted when callers don't pass it, so existing
  add-edition flows keep their DB default).
- `admin/operation_manager/inventory_manager` `EditableBookContent.tsx`:
  `handleSaveEdit` routes `edition_productionstatus` to
  `updateEditionField(latestEdition.id, "productionstatus", value)` and updates
  `book.bookedition[0]` locally (also keeps the Editions tab in sync).
- `AddBookForm.tsx`: removed the visible book "Production Status" select (hidden
  ON_PRODUCTION fallback). New optional "Add an edition to this book" checkbox
  reveals Edition Name (default "Edition 1"), Print Count, Selling Price and
  Production Status (default READY). Fields are required only while checked and
  are validated before the book is created. On success the book is created
  first, then `createEdition` runs with the created book id; failure of the
  edition shows "Book saved, but the edition could not be created" and still
  navigates back. Reset clears the edition draft.
- Live check: 147 books, 144 with editions, exactly 1 book whose book-level
  status differs from its latest edition (Test translation book 1:
  book=TRANSLATION, latest edition=ON_PRODUCTION) — confirms the Info tab now
  reads the edition. Latest-first ordering confirmed on multi-edition books.
`tsc --noEmit` clean, eslint 0 errors (pre-existing warnings only).

Note: the admin Books page lists only books with an ON_PRODUCTION edition, so a
book created with the default READY edition will not appear there until its
edition moves to ON_PRODUCTION.

### Books table now lists every book (print unchanged)
- `src/app/admin_dashboard/books/page.tsx`: `getBooks({ inProductionOnly: true })`
  -> `getBooks()`. The table now shows all non-deleted books, including books
  whose editions are past production and books with no editions at all.
- Print Options is untouched: `BooksPrintDialog` loads
  `getBooksStorePrintData()`, which still filters editions to
  `productionstatus = "ON_PRODUCTION"` and requires store stock. So only
  currently-in-production books are printed.
- The `editionCount` column now counts all non-deleted editions of a book
  (0 for books without editions).
- Updated the `inProductionOnly` doc comment in `get-books.ts` (the flag still
  exists for other callers, the admin table just no longer uses it).
- Live read-only check: 137 books total; 27 have at least one ON_PRODUCTION
  edition (the old filter); 109 books have no editions and are now visible.
`tsc --noEmit` clean, eslint 0 errors.

### Grand total above the table (Print Detailed Info)
Request: show the sum of every "Total Price" in the table as a text line above
the table, changing nothing else.
- `stores/options/detailed-info-layout.ts`:
  - `DetailedInfoPage` gained `grandTotalText`.
  - `buildDetailedInfoPages` sums `book.totals.totalValue` over all rows (the same
    value already printed in brackets next to each book title) and formats it as
    `Grand Total: <amount>`.
  - `titleBlockHeight` grew by `lineHeight + 12` so the line sits between the
    dates and the table and pagination accounts for the extra height. The rule
    stays 6px above the table, so the text is 6px above the rule.
- `stores/options/detailed-info-canvas.ts`: draws the text right-aligned at the
  content edge (aligns with the Total Price column) in the strong colour, bold
  weight matched to the "All Bold" option, on every page. Table, grid, tints,
  footer and book groups are untouched.
- Geometry check: the new text's top edge lands exactly on the old table top for
  every font size (9/11/13/16px), leaving 5.9–8.4px below the Ethiopian date line
  and 6px above the rule in both orientations; single-page and multi-page
  pagination re-run with the larger `titleBlockHeight`.
`tsc --noEmit` clean, eslint 0 errors.

