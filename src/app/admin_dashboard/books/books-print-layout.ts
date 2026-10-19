// Shared layout model for the "Books In Store" PDF.
//
// The same numbers drive the on-screen preview (HTML) and the generated PDF
// (canvas), so what the user sees is exactly what gets downloaded.

export interface PrintBook {
  title: string;
  short_name: string | null;
  price: number | null;
  cover_price: number | null;
}

export type PrintColumnKind = "number" | "title" | "short" | "price" | "cover";
export type PrintAlign = "left" | "center" | "right";

// A4 at 96dpi — the preview is laid out in CSS pixels and rendered 1:1.
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;
export const PAGE_MARGIN = 38;
export const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
export const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_MARGIN * 2;
export const FOOTER_HEIGHT = 26;

export const CELL_PADDING_X = 8;
export const CELL_PADDING_Y = 4;
export const CELL_BORDER = 1;
// Distance from the cell edge to the text: border + padding.
export const TEXT_INSET = CELL_BORDER + CELL_PADDING_X;

export const FONT_STACK = "Arial, Helvetica, sans-serif";

export interface ColumnSpec {
  kind: PrintColumnKind;
  label: string;
  width: number;
  align: PrintAlign;
}

export interface CellLayout {
  lines: string[];
  align: PrintAlign;
}

export interface RowLayout {
  cells: CellLayout[];
  height: number;
}

export interface PageLayout {
  columns: ColumnSpec[];
  headerRow: RowLayout;
  dataRows: RowLayout[];
  showDateBlock: boolean;
  dateBlockHeight: number;
  pageNumber: number;
  pageCount: number;
  ethDate: string;
  gregDate: string;
}

const FIXED_COLUMN_WIDTHS: Record<Exclude<PrintColumnKind, "title">, number> = {
  number: 46,
  short: 160,
  price: 95,
  cover: 95,
};

export function formatPrice(value: number | null): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function lineHeightFor(fontSizePx: number): number {
  return Math.round(fontSizePx * 1.3);
}

export function buildColumns(
  kinds: PrintColumnKind[],
  labels: string[]
): ColumnSpec[] {
  const fixedTotal = kinds
    .filter((kind): kind is Exclude<PrintColumnKind, "title"> => kind !== "title")
    .reduce((sum, kind) => sum + FIXED_COLUMN_WIDTHS[kind], 0);
  const titleWidth = Math.max(180, CONTENT_WIDTH - fixedTotal);

  return kinds.map((kind, index) => ({
    kind,
    label: labels[index] ?? "",
    width: kind === "title" ? titleWidth : FIXED_COLUMN_WIDTHS[kind],
    align:
      kind === "number"
        ? "center"
        : kind === "price" || kind === "cover"
          ? "right"
          : "left",
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
      // A single word longer than the column: break it by characters.
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

export function buildRow(
  columns: ColumnSpec[],
  values: string[],
  lineHeight: number,
  measure: (value: string) => number
): RowLayout {
  const cells: CellLayout[] = columns.map((column, index) => ({
    lines: wrapText(
      values[index] ?? "",
      column.width - TEXT_INSET * 2,
      measure
    ),
    align: column.align,
  }));

  const lineCount = cells.reduce(
    (max, cell) => Math.max(max, cell.lines.length),
    1
  );

  return {
    cells,
    height: lineCount * lineHeight + (CELL_BORDER * 2 + CELL_PADDING_Y * 2),
  };
}

export function paginateRows(
  dataRows: RowLayout[],
  headerRow: RowLayout,
  dateBlockHeight: number
): RowLayout[][] {
  const usableHeight = CONTENT_HEIGHT - FOOTER_HEIGHT;
  const pages: RowLayout[][] = [];
  let current: RowLayout[] = [];
  let used = dateBlockHeight + headerRow.height;

  for (const row of dataRows) {
    if (current.length > 0 && used + row.height > usableHeight) {
      pages.push(current);
      current = [];
      used = headerRow.height;
    }
    current.push(row);
    used += row.height;
  }

  if (current.length > 0) pages.push(current);
  return pages;
}

export function buildPages(options: {
  columns: ColumnSpec[];
  books: PrintBook[];
  fontSizePx: number;
  bold: boolean;
  ethDate: string;
  gregDate: string;
  measure: (value: string) => number;
}): PageLayout[] {
  const lineHeight = lineHeightFor(options.fontSizePx);
  const headerRow = buildRow(
    options.columns,
    options.columns.map((column) => column.label),
    lineHeight,
    options.measure
  );

  const dataRows = options.books.map((book, index) => {
    const values = options.columns.map((column) => {
      switch (column.kind) {
        case "number":
          return String(index + 1);
        case "title":
          return book.title || "—";
        case "short":
          return book.short_name || "—";
        case "price":
          return formatPrice(book.price);
        case "cover":
          return formatPrice(book.cover_price);
        default:
          return "";
      }
    });
    return buildRow(options.columns, values, lineHeight, options.measure);
  });

  const dateBlockHeight = lineHeight * 2;
  const chunks = paginateRows(dataRows, headerRow, dateBlockHeight);
  const pageChunks = chunks.length > 0 ? chunks : [[]];

  return pageChunks.map((rows, index) => ({
    columns: options.columns,
    headerRow,
    dataRows: rows,
    showDateBlock: index === 0,
    dateBlockHeight,
    pageNumber: index + 1,
    pageCount: pageChunks.length,
    ethDate: options.ethDate,
    gregDate: options.gregDate,
  }));
}
