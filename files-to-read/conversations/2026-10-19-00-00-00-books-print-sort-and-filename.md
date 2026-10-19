# Conversation — 2026-10-19 — Admin books print: sort order + saved file name

## Request
Admin dashboard → Books page → "Print Options" dialog:
1. When "Amharic Titles First" is selected, the group order must be
   **Amharic → Numbered → English** (was Amharic → English → Numbered).
2. When the print is saved (Save as PDF), the suggested file name must be
   `የ <Ethiopian month> <day> <year> <h>:<m> ጠዋት print`
   (e.g. `የ ነሃሴ 18 2019 3:20 ጠዋት print`).

## Changes
`src/app/admin_dashboard/books/BooksPrintDialog.tsx`
- `groupOrders.amharic` → `["amharic", "numbered", "english"]`.
  The other two orders (`english`, `numbered`) were left untouched — the request
  was specific to the Amharic-first case.
- Added `buildPrintFileName(date)`:
  `የ ${formatDate(date,"ethiopian","MMMM d yyyy")} ${h}:${mm} ጠዋት print`
  (Ethiopian month name + Ethiopian day + Ethiopian year, 24h clock, minutes
  zero-padded).
- The print window's `<title>` is now that file name instead of `Books In Store`
  — browsers use the document title as the default name when saving the print
  to PDF.

## Notes / decisions
- Month name comes from the shared `ETHIOPIAN_MONTHS` list in
  `src/lib/calendar-utils.ts` (`ነሐሴ`), so the file name matches the Ethiopian
  date printed in the document header. The user's sample used the variant
  spelling `ነሃሴ`; app-wide consistency was preferred.
- Verified the produced name for today: `የ ጥቅምት 9 2019 15:20 ጠዋት print`.

## Verification
- `npx tsc --noEmit` clean.
- `npx eslint src/app/admin_dashboard/books/BooksPrintDialog.tsx` clean.

## Files changed
- src/app/admin_dashboard/books/BooksPrintDialog.tsx
- files-to-read/conversations/2026-10-19-00-00-00-books-print-sort-and-filename.md (new)

## Blockers
None.
