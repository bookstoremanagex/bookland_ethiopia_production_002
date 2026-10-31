// Renders one laid-out "Print Detailed Info" page onto a canvas, so it can be
// previewed and embedded in the downloaded PDF (the same bytes are used for
// both, which keeps the preview identical to the file).

import {
  CELL_BORDER,
  CELL_PADDING_Y,
  FONT_STACK,
  PAGE_MARGIN,
  TEXT_INSET,
  authorFontSize,
  bookTitleFontSize,
  lineHeightFor,
  type DetailedInfoCell,
  type DetailedInfoColumn,
  type DetailedInfoGroup,
  type DetailedInfoPage,
} from "./detailed-info-layout";

export interface DetailedInfoCanvasOptions {
  fontSizePx: number;
  bold: boolean;
  scale?: number;
}

const COLORS = {
  text: "#1e293b",
  strong: "#16324f",
  title: "#0f172a",
  author: "#7c8b85",
  brand: "#285A48",
  rule: "#408A71",
  grid: "#cbd5cf",
  groupBorder: "#94a3b8",
  headerBg: "#eef6f2",
  tint: "#f7faf8",
  white: "#ffffff",
};

function font(size: number, weight: number) {
  return `${weight} ${size}px ${FONT_STACK}`;
}

/** Runs `draw` clipped to a cell, so long text can never bleed into a neighbour. */
function withClip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  draw: () => void
): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 1, y + 1, Math.max(1, width - 2), Math.max(1, height - 2));
  ctx.clip();
  draw();
  ctx.restore();
}

function drawCellText(
  ctx: CanvasRenderingContext2D,
  cell: DetailedInfoCell,
  x: number,
  width: number,
  top: number,
  height: number,
  fontSizePx: number,
  lineHeight: number,
  bold: boolean
): void {
  ctx.textAlign =
    cell.align === "center" ? "center" : cell.align === "right" ? "right" : "left";
  const textX =
    cell.align === "center"
      ? x + width / 2
      : cell.align === "right"
        ? x + width - TEXT_INSET
        : x + TEXT_INSET;

  const weight = bold ? (cell.strong ? 800 : 700) : cell.strong ? 600 : 400;
  ctx.font = font(fontSizePx, weight);
  ctx.fillStyle = cell.strong ? COLORS.strong : COLORS.text;

  const firstLineY =
    top + height / 2 - ((cell.lines.length - 1) * lineHeight) / 2;
  withClip(ctx, x, top, width, height, () => {
    cell.lines.forEach((line, lineIndex) => {
      ctx.fillText(line, textX, firstLineY + lineIndex * lineHeight);
    });
  });
}

export function renderDetailedPageToCanvas(
  page: DetailedInfoPage,
  options: DetailedInfoCanvasOptions
): HTMLCanvasElement {
  const scale = options.scale ?? 2;
  const fontSizePx = options.fontSizePx;
  const bold = options.bold;
  const lineHeight = lineHeightFor(fontSizePx);
  const titleFont = bookTitleFontSize(fontSizePx);
  const titleLineHeight = lineHeightFor(titleFont);
  const subFont = authorFontSize(fontSizePx);
  const subLineHeight = lineHeightFor(subFont);
  const bodyFont = Math.max(7, fontSizePx - 2);

  const canvas = document.createElement("canvas");
  canvas.width = page.pageWidth * scale;
  canvas.height = page.pageHeight * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");

  ctx.scale(scale, scale);
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(0, 0, page.pageWidth, page.pageHeight);
  ctx.textBaseline = "middle";

  const left = PAGE_MARGIN;
  const right = page.pageWidth - PAGE_MARGIN;
  const contentWidth = page.contentWidth;
  const tableTop = PAGE_MARGIN + page.titleBlockHeight;

  // ── Title + dates (repeats on every page) ────────────────────────────────
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.brand;
  ctx.font = font(fontSizePx + 6, 800);
  const titleY = PAGE_MARGIN + titleLineHeight * 0.62;
  ctx.fillText("STORE DETAILED INFO", page.pageWidth / 2, titleY);

  ctx.font = font(bodyFont, bold ? 700 : 600);
  const gregY = titleY + titleLineHeight * 0.55 + bodyFont;
  ctx.fillText(`GC: ${page.gregDate}`, page.pageWidth / 2, gregY);
  ctx.fillText(`ወ/ር: ${page.ethDate}`, page.pageWidth / 2, gregY + lineHeight);

  ctx.strokeStyle = COLORS.rule;
  ctx.lineWidth = 2;
  const ruleY = tableTop - 6;
  ctx.beginPath();
  ctx.moveTo(left, ruleY);
  ctx.lineTo(right, ruleY);
  ctx.stroke();

  // ── Header row + alternating group tints ─────────────────────────────────
  const headerTop = tableTop;
  const headerHeight = page.headerRow.height;
  ctx.fillStyle = COLORS.headerBg;
  ctx.fillRect(left, headerTop, contentWidth, headerHeight);

  let groupTop = headerTop + headerHeight;
  page.groups.forEach((group, index) => {
    if (index % 2 === 1) {
      ctx.fillStyle = COLORS.tint;
      ctx.fillRect(left, groupTop, contentWidth, group.height);
    }
    groupTop += group.height;
  });
  const tableBottom = groupTop;

  // ── Header text ──────────────────────────────────────────────────────────
  let x = left;
  page.columns.forEach((column, index) => {
    const cell = page.headerRow.cells[index];
    ctx.textAlign =
      cell.align === "center" ? "center" : cell.align === "right" ? "right" : "left";
    const textX =
      cell.align === "center"
        ? x + column.width / 2
        : cell.align === "right"
          ? x + column.width - TEXT_INSET
          : x + TEXT_INSET;
    ctx.fillStyle = COLORS.brand;
    ctx.font = font(fontSizePx, 800);
    const firstY =
      headerTop +
      headerHeight / 2 -
      ((cell.lines.length - 1) * lineHeight) / 2;
    withClip(ctx, x, headerTop, column.width, headerHeight, () => {
      cell.lines.forEach((line, lineIndex) => {
        ctx.fillText(line.toUpperCase(), textX, firstY + lineIndex * lineHeight);
      });
    });
    x += column.width;
  });

  // ── Edition rows and the merged book cell of each group ──────────────────
  let y = headerTop + headerHeight;
  page.groups.forEach((group) => {
    drawGroup(
      ctx,
      group,
      page.columns,
      left,
      y,
      fontSizePx,
      lineHeight,
      titleFont,
      titleLineHeight,
      subFont,
      subLineHeight,
      bold
    );
    y += group.height;
  });

  // ── Grid lines ───────────────────────────────────────────────────────────
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;

  // Vertical column separators, full table height.
  let columnX = left + page.columns[0].width;
  for (let index = 1; index < page.columns.length; index++) {
    ctx.beginPath();
    ctx.moveTo(columnX + 0.5, tableTop);
    ctx.lineTo(columnX + 0.5, tableBottom);
    ctx.stroke();
    columnX += page.columns[index].width;
  }

  // Horizontal separators: full width between books, from the edition column
  // onwards between editions of the same book.
  const editionColumnX = left + page.columns[0].width;
  y = headerTop + headerHeight;
  page.groups.forEach((group, groupIndex) => {
    ctx.strokeStyle = groupIndex === 0 ? COLORS.grid : COLORS.groupBorder;
    ctx.lineWidth = groupIndex === 0 ? 1 : 1.25;
    ctx.beginPath();
    ctx.moveTo(left, y + 0.5);
    ctx.lineTo(right, y + 0.5);
    ctx.stroke();

    let rowTop = y;
    group.rows.forEach((row, rowIndex) => {
      rowTop += row.height;
      if (rowIndex < group.rows.length - 1) {
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(editionColumnX, rowTop + 0.5);
        ctx.lineTo(right, rowTop + 0.5);
        ctx.stroke();
      }
    });
    y += group.height;
  });

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.strokeRect(
    left + 0.5,
    tableTop + 0.5,
    contentWidth - 1,
    tableBottom - tableTop - 1
  );

  // ── Footer ───────────────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.author;
  ctx.font = font(bodyFont, 400);
  const footerY = Math.min(
    page.pageHeight - PAGE_MARGIN / 2,
    tableBottom + Math.max(14, bodyFont * 1.8)
  );
  ctx.fillText(
    `Page ${page.pageNumber} of ${page.pageCount}`,
    page.pageWidth / 2,
    footerY
  );

  return canvas;
}

function drawGroup(
  ctx: CanvasRenderingContext2D,
  group: DetailedInfoGroup,
  columns: DetailedInfoColumn[],
  left: number,
  top: number,
  fontSizePx: number,
  lineHeight: number,
  titleFont: number,
  titleLineHeight: number,
  subFont: number,
  subLineHeight: number,
  bold: boolean
): void {
  // Merged book cell: title + total price in brackets, then the author.
  withClip(ctx, left, top, columns[0].width, group.height, () => {
    ctx.textAlign = "left";
    ctx.fillStyle = COLORS.title;
    ctx.font = font(titleFont, bold ? 800 : 700);

    let textY = top + CELL_BORDER + CELL_PADDING_Y + titleLineHeight / 2;
    group.title.titleLines.forEach((line) => {
      ctx.fillText(line, left + TEXT_INSET, textY);
      textY += titleLineHeight;
    });

    if (group.title.authorLines.length > 0) {
      ctx.fillStyle = COLORS.author;
      ctx.font = font(subFont, bold ? 700 : 600);
      group.title.authorLines.forEach((line) => {
        ctx.fillText(line, left + TEXT_INSET, textY + subLineHeight / 2 - 1);
        textY += subLineHeight;
      });
    }
  });

  // Edition cells: columns 1..n (column 0 is the merged book cell).
  let rowTop = top;
  group.rows.forEach((row) => {
    let cellX = left;
    row.cells.forEach((cell, index) => {
      const column = columns[index];
      if (index > 0) {
        drawCellText(
          ctx,
          cell,
          cellX,
          column.width,
          rowTop,
          row.height,
          fontSizePx,
          lineHeight,
          bold
        );
      }
      cellX += column.width;
    });
    rowTop += row.height;
  });
}
