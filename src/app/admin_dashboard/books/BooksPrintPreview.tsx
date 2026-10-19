"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dataUrlToBytes, downloadPdf } from "@/lib/print-pdf";
import {
  CELL_BORDER,
  CELL_PADDING_X,
  CELL_PADDING_Y,
  CONTENT_WIDTH,
  FONT_STACK,
  PAGE_HEIGHT,
  PAGE_MARGIN,
  PAGE_WIDTH,
  buildColumns,
  buildPages,
  lineHeightFor,
  type CellLayout,
  type PageLayout,
  type PrintBook,
  type PrintColumnKind,
} from "./books-print-layout";
import { renderPageToCanvas } from "./books-print-canvas";

interface BooksPrintPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: PrintBook[];
  columns: PrintColumnKind[];
  headers: string[];
  fontSizePx: number;
  bold: boolean;
  ethDate: string;
  gregDate: string;
  fileName: string;
}

export default function BooksPrintPreview({
  open,
  onOpenChange,
  books,
  columns,
  headers,
  fontSizePx,
  bold,
  ethDate,
  gregDate,
  fileName,
}: BooksPrintPreviewProps) {
  const [pages, setPages] = useState<PageLayout[] | null>(null);
  const [scale, setScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const measure = useCallback(
    (text: string) => {
      if (typeof document === "undefined") return text.length * 6;
      if (!measureCanvasRef.current) {
        measureCanvasRef.current = document.createElement("canvas");
      }
      const ctx = measureCanvasRef.current.getContext("2d");
      if (!ctx) return text.length * 6;
      ctx.font = `${bold ? 700 : 400} ${fontSizePx}px ${FONT_STACK}`;
      return ctx.measureText(text).width;
    },
    [bold, fontSizePx]
  );

  useEffect(() => {
    if (!open) return;
    const specs = buildColumns(columns, headers);
    setPages(
      buildPages({
        columns: specs,
        books,
        fontSizePx,
        bold,
        ethDate,
        gregDate,
        measure,
      })
    );
  }, [open, books, columns, headers, fontSizePx, bold, ethDate, gregDate, measure]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const update = () => {
      const available = element.clientWidth - 32;
      setScale(Math.min(1, Math.max(0.3, available / PAGE_WIDTH)));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [open, pages]);

  const handleDownload = async () => {
    if (!pages || pages.length === 0) return;
    setIsDownloading(true);
    try {
      const images: {
        data: Uint8Array;
        width: number;
        height: number;
      }[] = [];

      for (const page of pages) {
        const canvas = renderPageToCanvas(page, { fontSizePx, bold });
        images.push({
          data: dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.92)),
          width: canvas.width,
          height: canvas.height,
        });
        // Release the canvas backing store before the next page.
        canvas.width = 0;
        canvas.height = 0;
        // Yield so the spinner keeps painting between pages.
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      downloadPdf(images, `${fileName}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate the PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl w-[95vw] h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-sm font-black uppercase italic text-primarycolor flex items-center gap-2">
            <FileText className="size-4" /> PDF Preview — Books In Store
          </DialogTitle>
          <p className="text-[10px] font-bold text-muted-foreground break-all">
            {fileName}.pdf
          </p>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="min-h-0 overflow-auto rounded-2xl bg-slate-100 p-4"
        >
          {pages ? (
            <div className="flex flex-col items-center gap-5">
              {pages.map((page, index) => (
                <div
                  key={index}
                  className="bg-white shadow-xl overflow-hidden"
                  style={{
                    width: PAGE_WIDTH * scale,
                    height: PAGE_HEIGHT * scale,
                  }}
                >
                  <PageSheet
                    page={page}
                    scale={scale}
                    fontSizePx={fontSizePx}
                    bold={bold}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Preparing preview
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] border-2"
            >
              Close
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!pages || isDownloading}
              className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] bg-primarycolor hover:bg-secondarycolor text-white shadow-lg gap-1.5"
            >
              {isDownloading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Download PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PageSheet({
  page,
  scale,
  fontSizePx,
  bold,
}: {
  page: PageLayout;
  scale: number;
  fontSizePx: number;
  bold: boolean;
}) {
  const lineHeight = lineHeightFor(fontSizePx);
  const tableTop =
    PAGE_MARGIN + (page.showDateBlock ? page.dateBlockHeight : 0);

  return (
    <div
      style={{
        position: "relative",
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        background: "#ffffff",
        color: "#111111",
        fontFamily: FONT_STACK,
        fontSize: `${fontSizePx}px`,
        fontWeight: bold ? 700 : 400,
      }}
    >
      {page.showDateBlock && (
        <div
          style={{
            position: "absolute",
            left: PAGE_MARGIN,
            top: PAGE_MARGIN,
            width: CONTENT_WIDTH,
          }}
        >
          <div style={lineStyle(lineHeight)}>Ethiopian: {page.ethDate}</div>
          <div style={lineStyle(lineHeight)}>Gregorian: {page.gregDate}</div>
        </div>
      )}

      <table
        style={{
          position: "absolute",
          left: PAGE_MARGIN,
          top: tableTop,
          width: CONTENT_WIDTH,
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          {page.columns.map((column, index) => (
            <col key={index} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ height: page.headerRow.height }}>
            {page.headerRow.cells.map((cell, index) => (
              <th key={index} style={cellStyle(cell, true)}>
                {renderLines(cell, lineHeight)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {page.dataRows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ height: row.height }}>
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex} style={cellStyle(cell, false)}>
                  {renderLines(cell, lineHeight)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: PAGE_HEIGHT - PAGE_MARGIN + 8,
          transform: "translateY(-50%)",
          textAlign: "center",
          fontSize: 9,
          lineHeight: "9px",
        }}
      >
        Page {page.pageNumber}
      </div>
    </div>
  );
}

function lineStyle(lineHeight: number) {
  return { height: lineHeight, lineHeight: `${lineHeight}px` };
}

function cellStyle(cell: CellLayout, isHeader: boolean) {
  return {
    border: `${CELL_BORDER}px solid #999999`,
    background: isHeader ? "#eeeeee" : "#ffffff",
    padding: `${CELL_PADDING_Y}px ${CELL_PADDING_X}px`,
    textAlign: cell.align,
    verticalAlign: "middle" as const,
    fontSize: "inherit",
    fontWeight: "inherit",
    overflow: "hidden",
  };
}

function renderLines(cell: CellLayout, lineHeight: number) {
  return cell.lines.map((line, index) => (
    <div
      key={index}
      style={{
        whiteSpace: "pre",
        height: lineHeight,
        lineHeight: `${lineHeight}px`,
      }}
    >
      {line}
    </div>
  ));
}
