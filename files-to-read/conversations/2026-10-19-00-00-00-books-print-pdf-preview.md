# Conversation — 2026-10-19 — Books print: custom PDF preview + download

## Request
Admin dashboard → Books → Print Options:
1. (previous turn) "Amharic Titles First" must order groups Amharic → Numbered → English.
2. The saved file name must be `የ <eth month> <day> <year> <h>:<m> ጠዋት print`.
3. **This turn:** stop opening the browser print page. Show a custom-made PDF-style
   view inside the app with a Download button; the download must use that file name.

## Approach
No new npm packages (AGENTS.md forbids installing without permission, and
jsPDF/html2canvas cannot render Ethiopic text or Tailwind v4 `oklch` colours).
Instead: render each A4 page onto a `<canvas>` and embed the canvas as a
full-page JPEG inside a hand-written PDF (DCTDecode). Amharic renders through
the browser's own font fallback, and no font subsetting is needed.

## New files
- `src/lib/print-pdf.ts` — dependency-free PDF writer: `buildPdfFromImages`,
  `dataUrlToBytes`, `downloadPdf` (Blob + anchor download).
- `src/app/admin_dashboard/books/books-print-layout.ts` — shared layout model:
  A4 constants (794×1123 px @96dpi), column widths, `wrapText` (word wrap +
  hard split for over-long words), `buildRow`, `paginateRows`, `buildPages`.
- `src/app/admin_dashboard/books/books-print-canvas.ts` — `renderPageToCanvas`
  draws one laid-out page (date block, table, page number) on a 2× canvas.
- `src/app/admin_dashboard/books/BooksPrintPreview.tsx` — the PDF-style modal:
  A4 page previews scaled to the viewport (ResizeObserver), plus a
  "Download PDF" button that renders the pages to canvas and downloads
  `<name>.pdf`.

## Changed
- `src/app/admin_dashboard/books/BooksPrintDialog.tsx`
  - Removed the `window.open` + `document.write` + `print()` browser flow and
    the HTML string it built.
  - The action button is now **"Preview PDF"** and opens the new preview modal
    with the ordered books, chosen columns/headers, font size, bold flag and
    the Ethiopian-calendar file name.
  - `fontMap` now holds numeric px (needed by the layout engine).
  - `PrintBook` type moved to `books-print-layout.ts`.

## Notes / decisions
- Preview and PDF share one layout module, so the download matches the preview.
  Text is pre-wrapped in JS (canvas `measureText`) and rendered line-by-line in
  the HTML preview, so both renderings wrap identically.
- Rows/pages: A4 content box is 718×1047 px; footer reserves 26 px. 220 sample
  books paginate to 7 pages.
- The PDF is image-based (JPEG per page) so Amharic works without embedding a
  font. Text is therefore not selectable inside the PDF.
- **File name (final):** `የ <eth month> <day> <year>` only — e.g.
  `የ ጥቅምት 9 2019.pdf`. The clock time and the `ጠዋት print` suffix were
  removed on request; the Ethiopian month/day/year come from
  `formatDate(date, "ethiopian", "MMMM d yyyy")` in `buildPrintFileName`
  (`BooksPrintDialog.tsx`). The `የ` prefix is kept.

## Verification
- Throwaway script (temp dir, not in repo): column widths fill the content box;
  wrapping never exceeds the column width and loses no words; pagination keeps
  every row and no page overflows; PDF header/catalog/pages/page objects/
  DCTDecode filter/A4 MediaBox/Count present; every xref offset points at its
  `N 0 obj`; image `/Length` matches the embedded bytes; `startxref` points at
  the xref; a reader-style object-graph walk (Root→Catalog→Pages→Kids→Page→
  Resources→Im0→stream) resolves for every page.
- **Bug caught by that script:** the xref object count was `3 + pages*3` but
  should be `2 + pages*3` (catalog + page tree) → the last xref entry pointed
  at `undefined`. Fixed in `src/lib/print-pdf.ts`.
- `npx tsc --noEmit` clean; eslint clean on all touched files.

## Files changed
- src/lib/print-pdf.ts (new)
- src/app/admin_dashboard/books/books-print-layout.ts (new)
- src/app/admin_dashboard/books/books-print-canvas.ts (new)
- src/app/admin_dashboard/books/BooksPrintPreview.tsx (new)
- src/app/admin_dashboard/books/BooksPrintDialog.tsx
- files-to-read/conversations/2026-10-19-00-00-00-books-print-sort-and-filename.md

## Blockers
None.
