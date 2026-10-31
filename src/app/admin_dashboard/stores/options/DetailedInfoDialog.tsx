"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileBarChart, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/calendar-utils";
import { buildPrintFileName } from "@/lib/print-file-name";
import {
  DEFAULT_TITLE_SORT,
  TITLE_SORT_OPTIONS,
  sortTitles,
  type TitleSortOrder,
} from "@/lib/print-sort";
import { getStoreDetailedInfoRows } from "@/app/actions/store-inventory-actions";
import {
  DETAILED_INFO_FONT_OPTIONS,
  FONT_PX_BY_SIZE,
  FONT_STACK,
  buildDetailedInfoPages,
  type DetailedInfoFontSize,
  type DetailedInfoOrientation,
  type DetailedInfoPage,
} from "./detailed-info-layout";
import DetailedInfoPreview from "./DetailedInfoPreview";

interface DetailedInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PreviewState {
  pages: DetailedInfoPage[];
  fontSizePx: number;
  bold: boolean;
  fileName: string;
}

export default function DetailedInfoDialog({
  open,
  onOpenChange,
}: DetailedInfoDialogProps) {
  const [fontSize, setFontSize] = useState<DetailedInfoFontSize>("small");
  const [orientation, setOrientation] =
    useState<DetailedInfoOrientation>("landscape");
  const [bold, setBold] = useState(true);
  const [titleSort, setTitleSort] = useState<TitleSortOrder>(DEFAULT_TITLE_SORT);
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const measureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (open) {
      setFontSize("small");
      setOrientation("landscape");
      setBold(true);
      setTitleSort(DEFAULT_TITLE_SORT);
      setPreview(null);
    }
  }, [open]);

  const fontSizePx = FONT_PX_BY_SIZE[fontSize];

  const measure = useCallback(
    (text: string, size?: number, weight?: number) => {
      if (typeof document === "undefined") {
        return text.length * (size ?? fontSizePx) * 0.55;
      }
      if (!measureCanvasRef.current) {
        measureCanvasRef.current = document.createElement("canvas");
      }
      const ctx = measureCanvasRef.current.getContext("2d");
      if (!ctx) return text.length * (size ?? fontSizePx) * 0.55;
      ctx.font = `${weight ?? 400} ${size ?? fontSizePx}px ${FONT_STACK}`;
      return ctx.measureText(text).width;
    },
    [fontSizePx]
  );

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await getStoreDetailedInfoRows();
      if (!res.success) {
        toast.error(res.error || "Failed to load store details");
        return;
      }
      const rows = sortTitles(res.data ?? [], titleSort, (row) => row.title);
      if (rows.length === 0) {
        toast.info("No editions are in stores or ready to transfer");
        return;
      }

      const now = new Date();
      const fileName = buildPrintFileName(now);
      const pages = buildDetailedInfoPages({
        rows,
        orientation,
        fontSizePx,
        bold,
        ethDate: formatDate(now, "ethiopian", "EEE, MMMM dd, yyyy"),
        gregDate: formatDate(now, "gregorian", "EEE, MMMM dd, yyyy"),
        measure,
      });

      setPreview({ pages, fontSizePx, bold, fileName });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to prepare the PDF");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <FileBarChart className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                  Print Detailed Info
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  Every edition in stores or ready to transfer
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div>
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-1.5">
                Font Size
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {DETAILED_INFO_FONT_OPTIONS.map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={fontSize === key ? "default" : "outline"}
                    onClick={() => setFontSize(key)}
                    className={cn(
                      "h-7 text-[9px] font-black uppercase tracking-widest rounded-lg",
                      fontSize === key
                        ? "bg-primarycolor text-white"
                        : "border border-slate-100 text-muted-foreground hover:border-primarycolor/30"
                    )}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-1.5">
                Page Orientation
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {([
                  { key: "portrait", label: "Portrait" },
                  { key: "landscape", label: "Landscape" },
                ] as const).map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={orientation === key ? "default" : "outline"}
                    onClick={() => setOrientation(key)}
                    className={cn(
                      "h-7 text-[9px] font-black uppercase tracking-widest rounded-lg",
                      orientation === key
                        ? "bg-primarycolor text-white"
                        : "border border-slate-100 text-muted-foreground hover:border-primarycolor/30"
                    )}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-1.5">
                Book Order
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {TITLE_SORT_OPTIONS.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={titleSort === value ? "default" : "outline"}
                    onClick={() => setTitleSort(value)}
                    className={cn(
                      "h-7 px-1 text-[8px] font-black uppercase tracking-tight rounded-lg",
                      titleSort === value
                        ? "bg-primarycolor text-white"
                        : "border border-slate-100 text-muted-foreground hover:border-primarycolor/30"
                    )}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 cursor-pointer hover:border-primarycolor/30 transition-colors">
              <div>
                <span className="font-black text-[10px] text-foreground">All Bold</span>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                  Heavier text for the printed sheet
                </p>
              </div>
              <div
                className={cn(
                  "relative w-9 h-5 rounded-full transition-colors",
                  bold ? "bg-primarycolor" : "bg-slate-200"
                )}
              >
                <input
                  type="checkbox"
                  checked={bold}
                  onChange={(event) => setBold(event.target.checked)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform",
                    bold && "translate-x-4"
                  )}
                />
              </div>
            </label>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full h-10 font-black text-[10px] uppercase tracking-widest bg-primarycolor shadow shadow-primarycolor/20 rounded-lg gap-1.5"
            >
              {generating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <FileText className="size-3.5" />
              )}
              {generating ? "Preparing..." : "Preview PDF"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {preview && (
        <DetailedInfoPreview
          open={preview !== null}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setPreview(null);
          }}
          pages={preview.pages}
          fontSizePx={preview.fontSizePx}
          bold={preview.bold}
          fileName={preview.fileName}
        />
      )}
    </>
  );
}
