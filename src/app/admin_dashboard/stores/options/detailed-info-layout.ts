// Layout model for the Stores -> Store Options "Print Detailed Info" PDF.
//
// The same numbers drive the on-screen preview (images rendered from the same
// canvases) and the downloaded PDF, so preview and file match exactly.
//
// The report is ONE table. A book's title cell is merged (rowspan) across all
// of its edition rows and carries the book's total price in brackets. When a
// book does not fit on the current page its editions continue on the next page
// under the same title, marked "(cont.)".

import type { DetailedInfoBookRow } from "@/app/actions/store-inventory-actions";

export type DetailedInfoOrientation = "portrait" | "landscape";
export type DetailedInfoFontSize = "extrasmall" | "small" | "medium" | "big";
export type DetailedInfoAlign = "left" | "center" | "right";

export const DETAILED_INFO_FONT_OPTIONS: {
  key: DetailedInfoFontSize;
  label: string;
}[] = [
  { key: "extrasmall", label: "Extra Small" },
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "big", label: "Big" },
];

export const FONT_PX_BY_SIZE: Record<DetailedInfoFontSize, number> = {
  extrasmall: 9,
  small: 11,
  medium: 13,
  big: 16,
};

// Page boxes in CSS pixels (96dpi): A4 portrait and A4 landscape.
export const PAGE_SIZES: Record<
  DetailedInfoOrientation,
  { width: number; height: number }
> = {
  portrait: { width: 794, height: 1123 },
  landscape: { width: 1123, height: 794 },
};

export const PAGE_MARGIN = 34;
export const FOOTER_HEIGHT = 20;

export const CELL_PADDING_X = 6;
export const CELL_PADDING_Y = 4;
export const CELL_BORDER = 1;
export const TEXT_INSET = CELL_BORDER + CELL_PADDING_X;

export const FONT_STACK = "Arial, Helvetica, sans-serif";

export interface DetailedInfoColumn {
  label: string;
  width: number;
  align: DetailedInfoAlign;
}

export interface DetailedInfoCell {
  lines: string[];
  align: DetailedInfoAlign;
  strong?: boolean;
}

export interface DetailedInfoEditionRow {
  cells: DetailedInfoCell[];
  height: number;
}

export interface DetailedInfoTitleCell {
  /** Title text with the book's total price in brackets. */
  titleLines: string[];
  authorLines: string[];
  height: number;
}

export interface DetailedInfoGroup {
  title: DetailedInfoTitleCell;
  rows: DetailedInfoEditionRow[];
  /** Merged title cell height, including any padding added to the last row. */
  height: number;
}

export interface DetailedInfoPage {
  columns: DetailedInfoColumn[];
  headerRow: DetailedInfoEditionRow;
  groups: DetailedInfoGroup[];
  orientation: DetailedInfoOrientation;
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
  titleBlockHeight: number;
  pageNumber: number;
  pageCount: number;
  ethDate: string;
  gregDate: string;
}

const COLUMN_WEIGHTS = [30, 8, 11, 14, 10, 12, 15];
// Minimum widths keep the header labels readable in portrait, where the
// weighted split would squeeze the Edition column and break "EDITION" apart.
const COLUMN_MIN_WIDTHS = [150, 84, 74, 96, 58, 70, 96];
const COLUMN_LABELS = [
  "Book",
  "Edition",
  "In Store",
  "Ready to Transfer",
  "Total",
  "Price",
  "Total Price",
];
const COLUMN_ALIGNS: DetailedInfoAlign[] = [
  "left",
  "center",
  "right",
  "right",
  "right",
  "right",
  "right",
];
const STRONG_COLUMNS = new Set([4, 6]);

export function lineHeightFor(fontSizePx: number): number {
  return Math.round(fontSizePx * 1.35);
}

export function bookTitleFontSize(fontSizePx: number): number {
  return fontSizePx + 2;
}

export function authorFontSize(fontSizePx: number): number {
  return Math.max(7, fontSizePx - 3);
}

export function buildColumns(contentWidth: number): DetailedInfoColumn[] {
  const totalWeight = COLUMN_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  const widths = COLUMN_WEIGHTS.map(
    (weight) => (contentWidth * weight) / totalWeight
  );

  // Raise any column that fell below its minimum, taking the extra width from
  // the columns that still have slack.
  for (let pass = 0; pass < 3; pass++) {
    const deficit = widths.reduce(
      (sum, width, index) =>
        sum + Math.max(0, COLUMN_MIN_WIDTHS[index] - width),
      0
    );
    if (deficit <= 0) break;

    widths.forEach((width, index) => {
      widths[index] = Math.max(width, COLUMN_MIN_WIDTHS[index]);
    });

    const slack = widths.map((width, index) =>
      Math.max(0, width - COLUMN_MIN_WIDTHS[index])
    );
    const totalSlack = slack.reduce((sum, value) => sum + value, 0);
    if (totalSlack <= 0) break;
    widths.forEach((width, index) => {
      widths[index] = Math.max(
        COLUMN_MIN_WIDTHS[index],
        width - (deficit * slack[index]) / totalSlack
      );
    });
  }

  const floored = widths.map((width) => Math.floor(width));
  // Absorb rounding leftovers in the Book column so the table closes exactly.
  const leftover =
    contentWidth - floored.reduce((sum, width) => sum + width, 0);
  floored[0] += leftover;

  return COLUMN_LABELS.map((label, index) => ({
    label,
    width: floored[index],
    align: COLUMN_ALIGNS[index],
  }));
}

export function wrapText(
  text: string,
  maxWidth: number,
  measure: (value: string) => number
): string[] {
  const value = (text ?? "").trim();
  if (!value) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of value.split(/\s+/)) {
    if (measure(word) > maxWidth) {
      if (current) {
        lines.push(current);
        current = "";
      }
      let chunk = "";
      for (const char of word) {
        if (chunk && measure(chunk + char) > maxWidth) {
          lines.push(chunk);
          chunk = char;
        } else {
          chunk += char;
        }
      }
      current = chunk;
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (current && measure(candidate) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

const quantityFormat = new Intl.NumberFormat("en-US");
const moneyFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatQuantity(value: number): string {
  return quantityFormat.format(Math.round(value || 0));
}

export function formatMoney(value: number): string {
  return moneyFormat.format(value || 0);
}

function rowHeightForLines(lineCount: number, lineHeight: number): number {
  return lineCount * lineHeight + CELL_BORDER * 2 + CELL_PADDING_Y * 2;
}

export interface DetailedInfoBuildOptions {
  rows: DetailedInfoBookRow[];
  orientation: DetailedInfoOrientation;
  fontSizePx: number;
  bold: boolean;
  ethDate: string;
  gregDate: string;
  measure: (value: string, fontSizePx?: number, weight?: number) => number;
}

export function buildDetailedInfoPages(
  options: DetailedInfoBuildOptions
): DetailedInfoPage[] {
  const { width, height } = PAGE_SIZES[options.orientation];
  const contentWidth = width - PAGE_MARGIN * 2;
  const usableHeight = height - PAGE_MARGIN * 2 - FOOTER_HEIGHT;
  const lineHeight = lineHeightFor(options.fontSizePx);
  const titleFont = bookTitleFontSize(options.fontSizePx);
  const subFont = authorFontSize(options.fontSizePx);
  const weight = options.bold;
  const measure = options.measure;

  const columns = buildColumns(contentWidth);

  const headerRow: DetailedInfoEditionRow = {
    cells: columns.map((column) => ({
      lines: wrapText(
        column.label.toUpperCase(),
        column.width - TEXT_INSET * 2,
        (value) => measure(value, options.fontSizePx, 800)
      ),
      align: column.align,
    })),
    height: 0,
  };
  headerRow.height =
    headerRow.cells.reduce((max, cell) => Math.max(max, cell.lines.length), 1) *
      lineHeight +
    CELL_BORDER * 2 +
    CELL_PADDING_Y * 2 +
    2;

  // Title + dates block, redrawn at the top of every page.
  const titleBlockHeight = Math.round(titleFont * 1.4) + lineHeight * 2 + 12;

  const buildTitleCell = (
    book: DetailedInfoBookRow,
    continued: boolean
  ): DetailedInfoTitleCell => {
    const titleWidth = columns[0].width - TEXT_INSET * 2;
    const titleText = `${book.title || "Untitled"} (${formatMoney(
      book.totals.totalValue
    )})${continued ? " (cont.)" : ""}`;
    const titleLines = wrapText(titleText, titleWidth, (value) =>
      measure(value, titleFont, 800)
    );
    const authorLines = book.author
      ? wrapText(book.author.toUpperCase(), titleWidth, (value) =>
          measure(value, subFont, weight ? 700 : 600)
        )
      : [];
    const height =
      titleLines.length * lineHeightFor(titleFont) +
      authorLines.length * lineHeightFor(subFont) +
      CELL_BORDER * 2 +
      CELL_PADDING_Y * 2 +
      (authorLines.length > 0 ? 7 : 3);
    return { titleLines, authorLines, height };
  };

  // One row per qualifying edition; the edition number is only printed when the
  // book has more than one edition to distinguish.
  const bookRows = options.rows.map((book) => {
    const showNumbers = book.editions.length > 1;
    const rows: DetailedInfoEditionRow[] = book.editions.map((edition) => {
      const values = [
        "",
        showNumbers ? String(edition.editionIndex) : "",
        formatQuantity(edition.inStore),
        formatQuantity(edition.readyToTransfer),
        formatQuantity(edition.total),
        formatMoney(edition.sellingPrice),
        formatMoney(edition.totalValue),
      ];
      const cells: DetailedInfoCell[] = values.map((value, index) => ({
        lines: [value],
        align: columns[index].align,
        strong: STRONG_COLUMNS.has(index),
      }));
      return { cells, height: rowHeightForLines(1, lineHeight) };
    });
    return { book, rows };
  });

  const pages: DetailedInfoGroup[][] = [];
  let currentGroups: DetailedInfoGroup[] = [];
  let usedHeight = titleBlockHeight + headerRow.height;

  const flush = () => {
    if (currentGroups.length > 0) {
      pages.push(currentGroups);
      currentGroups = [];
    }
    usedHeight = titleBlockHeight + headerRow.height;
  };

  for (const { book, rows } of bookRows) {
    let offset = 0;
    let continued = false;

    while (offset < rows.length) {
      const title = buildTitleCell(book, continued);
      const available = usableHeight - usedHeight;

      // Fill this page with as many of the book's remaining editions as fit.
      let sliceHeight = 0;
      let count = 0;
      while (offset + count < rows.length) {
        const rowHeight = rows[offset + count].height;
        const candidateHeight = Math.max(title.height, sliceHeight + rowHeight);
        if (candidateHeight > available) break;
        sliceHeight += rowHeight;
        count++;
      }

      if (count === 0) {
        if (currentGroups.length > 0) {
          flush();
          continue;
        }
        // A book taller than an empty page: force at least one edition.
        count = 1;
        sliceHeight = rows[offset].height;
      }

      const slice = rows.slice(offset, offset + count).map((row) => ({ ...row }));
      const groupHeight = Math.max(title.height, sliceHeight);
      if (groupHeight > sliceHeight) {
        // Grow the last row so the merged title cell fits inside the group.
        const last = slice[slice.length - 1];
        last.height += groupHeight - sliceHeight;
      }

      currentGroups.push({ title, rows: slice, height: groupHeight });
      usedHeight += groupHeight;
      offset += count;
      continued = true;

      if (offset < rows.length) flush();
    }
  }

  if (currentGroups.length > 0) pages.push(currentGroups);
  const pageChunks = pages.length > 0 ? pages : [[]];

  return pageChunks.map((groups, index) => ({
    columns,
    headerRow,
    groups,
    orientation: options.orientation,
    pageWidth: width,
    pageHeight: height,
    contentWidth,
    titleBlockHeight,
    pageNumber: index + 1,
    pageCount: pageChunks.length,
    ethDate: options.ethDate,
    gregDate: options.gregDate,
  }));
}
