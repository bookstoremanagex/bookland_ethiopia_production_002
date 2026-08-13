# 2026-08-13 — New Edition Form Simplification

## Summary
Redesigned the "Add New Edition" modal in the book details Editions tab to only require Edition Name, Print Count, and Selling Price, with a Toggle to reveal the rest of the form pre-filled from the main book info.

## Decisions
- **Required fields only**: Edition Name, Print Count, Selling Price — shown blank, marked `*`, mandatory.
- **Toggle component**: created `src/components/ui/toggle.tsx` via `npx shadcn@latest add toggle` (used `radix-ui` unified import to match project conventions). Also created `components.json` (did not exist) to let the shadcn CLI run non-interactively.
- **Toggle default OFF**: opening the form shows only the 3 required fields.
- **Prefill from main book info** (works whether toggle is shown or not): the 9 cost fields (`translator_cost` … `purchasing_right_cost`), `number_of_pages`, and `book_image_url` are copied from the book into the edition form data.
- **Edition-only fields** (Base Cost/production_price, Printing, Binding, Design, Other Expenses, Memo) submit as 0/blank when hidden.
- **Toggle ON**: reveals Base Cost, Cost Breakdown Details, Additional Production Costs, Page Count, and Production Memo — pre-filled and editable.
- **Last edition price note**: under Selling Price, shows "Last edition sold at X ETB" using the most recent existing edition (`book.bookedition[0]`, sorted by createdAt DESC).

## Files Changed
- `src/components/admin_dashboard_components/book_details/EditionsInfo.tsx`
  - Added `showMoreForm` state, `getPrefilledFormData()` (from book), `lastEdition`/`lastEditionPrice`.
  - Imports: added `Toggle`, `ChevronDown`, `Info`.
  - Restructured the form: required fields at top, toggle row, conditional extra sections.
- `src/components/ui/toggle.tsx` — new shadcn Toggle component.
- `components.json` — created for shadcn CLI.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` — only pre-existing warnings (unused imports `Trash2`, `FileText`, `BookOpen`, `Hash`, `ChevronRight`, `ExternalLink`, `Edit3`, unused `handleDelete`, img warnings). No new issues.

## Blockers
- None.

---

# 2026-08-13 — Print Order: Prefill Number of Pages from Book

## Summary
In the New Print Project dialog (printing/manage), when creating a new edition for an existing book, the "Number of Pages" field now auto-fills from the selected book's `number_of_pages`, and remains editable.

## Files Changed
- `src/app/admin_dashboard/printing/manage/CreatePrintOrderButton.tsx`
  - In `handleDrawerBookSelect`, after selecting a book in New-Edition mode, set `drawerEditionPages` to the book's `number_of_pages` (string, or empty if unset). Field is still editable via the existing Input.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` — only pre-existing warnings (unused icons/imports, `err`/`error`). No new issues.

## Blockers
- None.

---

# 2026-08-13 — Edition Details Collapsible Cost Sections

## Summary
Made the Cost Breakdown and Additional Production Costs sections on the edition details page collapsible (shadcn Collapsible), defaulting to collapsed (titles only).

## Files Changed
- `src/app/admin_dashboard/books/editions/[id]/EditionDetailsClient.tsx`
  - Added `ChevronDown` import and `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`.
  - Added state `costBreakdownOpen`, `additionalCostsOpen` (both default `false` → collapsed).
  - Wrapped Cost Breakdown cards and Additional Production Costs cards in separate `Collapsible`s. Trigger headers show the title + total badge; ChevronDown rotates 180° when open.

## Verification
- `npx tsc --noEmit` — no errors.
- `npx eslint` — only pre-existing warnings (unused `X`, `cn`, `error`/`err`, `<img>` warnings). No new issues.

## Blockers
- None.