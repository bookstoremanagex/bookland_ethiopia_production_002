// Renders a laid-out page onto a canvas so it can be embedded in the PDF.

import {
  CONTENT_WIDTH,
  FONT_STACK,
  PAGE_HEIGHT,
  PAGE_MARGIN,
  PAGE_WIDTH,
  TEXT_INSET,
  lineHeightFor,
  type ColumnSpec,
  type PageLayout,
  type RowLayout,
} from "./books-print-layout";

export interface CanvasRenderOptions {
  fontSizePx: number;
  bold: boolean;
  scale?: number;
}

function drawRow(
  ctx: CanvasRenderingContext2D,
  row: RowLayout,
  columns: ColumnSpec[],
  top: number,
  lineHeight: number,
  isHeader: boolean
): void {
  const height = row.height;

  if (isHeader) {
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(PAGE_MARGIN, top, CONTENT_WIDTH, height);
  }

  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 1;
  let x = PAGE_MARGIN;
  for (const column of columns) {
    ctx.strokeRect(x + 0.5, top + 0.5, column.width - 1, height - 1);
    x += column.width;
  }

  ctx.fillStyle = "#111111";
  x = PAGE_MARGIN;
  row.cells.forEach((cell, index) => {
    const column = columns[index];
    if (!column) return;

    ctx.textAlign =
      cell.align === "center"
        ? "center"
        : cell.align === "right"
          ? "right"
          : "left";
    const textX =
      cell.align === "center"
        ? x + column.width / 2
        : cell.align === "right"
          ? x + column.width - TEXT_INSET
          : x + TEXT_INSET;

    const firstLineY =
      top + height / 2 - ((cell.lines.length - 1) * lineHeight) / 2;
    cell.lines.forEach((line, lineIndex) => {
      ctx.fillText(line, textX, firstLineY + lineIndex * lineHeight);
    });

    x += column.width;
  });
}

export function renderPageToCanvas(
  page: PageLayout,
  options: CanvasRenderOptions
): HTMLCanvasElement {
  const scale = options.scale ?? 2;
  const canvas = document.createElement("canvas");
  canvas.width = PAGE_WIDTH * scale;
  canvas.height = PAGE_HEIGHT * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");

  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  ctx.textBaseline = "middle";

  const lineHeight = lineHeightFor(options.fontSizePx);
  const weight = options.bold ? "700" : "400";
  ctx.font = `${weight} ${options.fontSizePx}px ${FONT_STACK}`;

  let y = PAGE_MARGIN;
  if (page.showDateBlock) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#111111";
    ctx.fillText(`Ethiopian: ${page.ethDate}`, PAGE_MARGIN, y + lineHeight / 2);
    ctx.fillText(
      `Gregorian: ${page.gregDate}`,
      PAGE_MARGIN,
      y + lineHeight * 1.5
    );
    y += page.dateBlockHeight;
  }

  drawRow(ctx, page.headerRow, page.columns, y, lineHeight, true);
  y += page.headerRow.height;
  for (const row of page.dataRows) {
    drawRow(ctx, row, page.columns, y, lineHeight, false);
    y += row.height;
  }

  ctx.font = `${weight} 9px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#111111";
  ctx.fillText(
    `Page ${page.pageNumber}`,
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - PAGE_MARGIN + 8
  );

  return canvas;
}
