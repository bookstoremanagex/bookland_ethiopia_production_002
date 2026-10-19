"use client";

import React, { useState } from "react";
import { FileText, Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/calendar-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBooksStorePrintData } from "../../actions/book-actions";
import BooksPrintPreview from "./BooksPrintPreview";
import type { PrintBook, PrintColumnKind } from "./books-print-layout";

type FontSize = "extra-big" | "big" | "medium" | "small" | "extra-small";
type SortFirst = "amharic" | "english" | "numbered";
type SortGroup = "amharic" | "english" | "numbered";

interface PreviewPayload {
  books: PrintBook[];
  columns: PrintColumnKind[];
  headers: string[];
  fontSizePx: number;
  bold: boolean;
  ethDate: string;
  gregDate: string;
  fileName: string;
}

const fontMap: Record<FontSize, number> = {
  "extra-big": 22,
  big: 18,
  medium: 15,
  small: 12,
  "extra-small": 10,
};

// Remaining groups follow after the first choice. When Amharic is first,
// the numbered titles come second and the English titles last.
const groupOrders: Record<SortFirst, SortGroup[]> = {
  amharic: ["amharic", "numbered", "english"],
  english: ["english", "amharic", "numbered"],
  numbered: ["numbered", "amharic", "english"],
};

const isEthiopicChar = (ch: string) => {
  const cp = ch.codePointAt(0) ?? 0;
  return cp >= 0x1200 && cp <= 0x137f;
};

const classifyTitle = (title: string): SortGroup => {
  const t = (title || "").trim();
  if (!t) return "english";
  if (/[0-9]/.test(t[0])) return "numbered";
  if (isEthiopicChar(t[0])) return "amharic";
  return "english";
};

// Code-point comparison: the Unicode Ethiopic block follows the traditional
// fidel order (ሀ ሁ ሂ ... ለ ሉ ሊ ...), so per-code-point comparison sorts
// Amharic in its own alphabet order.
function compareEthiopic(a: string, b: string) {
  const A = Array.from(a);
  const B = Array.from(b);
  const len = Math.min(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const ca = A[i].codePointAt(0) ?? 0;
    const cb = B[i].codePointAt(0) ?? 0;
    if (ca !== cb) return ca - cb;
  }
  return A.length - B.length;
}

const groupComparators: Record<SortGroup, (a: PrintBook, b: PrintBook) => number> = {
  amharic: (a, b) => compareEthiopic(a.title, b.title),
  english: (a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base", numeric: true }),
  numbered: (a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base", numeric: true }),
};

// Traditional Ethiopian day parts, used instead of AM/PM in the file name:
// 12:00 AM – 5:59 AM  → ሌሊት
//  6:00 AM – 11:59 AM → ጠዋት
// 12:00 PM – 6:00 PM  → ከሰዓት
//  6:01 PM – 11:59 PM → ማታ
const getDayPart = (hours: number, minutes: number) => {
  if (hours < 6) return "ሌሊት";
  if (hours < 12) return "ጠዋት";
  if (hours < 18) return "ከሰዓት";
  if (hours === 18 && minutes === 0) return "ከሰዓት";
  return "ማታ";
};

// Name of the generated file, built from the Ethiopian calendar and a 12-hour
// clock: "የ ነሐሴ 18 2019 3:20 ከሰዓት"
const buildPrintFileName = (date: Date) => {
  const ethDate = formatDate(date, "ethiopian", "MMMM d yyyy");
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours % 12 || 12;
  const minutesText = minutes.toString().padStart(2, "0");
  return `የ ${ethDate} ${hours12}:${minutesText} ${getDayPart(hours, minutes)}`;
};

export default function BooksPrintDialog() {
  const [open, setOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [colNumber, setColNumber] = useState(true);
  const [colShortName, setColShortName] = useState(true);
  const [colPrice, setColPrice] = useState(true);
  const [colCoverPrice, setColCoverPrice] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [bold, setBold] = useState(true);
  const [amharicTitles, setAmharicTitles] = useState(false);
  const [sortFirst, setSortFirst] = useState<SortFirst>("amharic");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<PreviewPayload | null>(null);

  const toggleColumns = [
    { key: "number", label: "Number", state: colNumber, set: setColNumber },
    { key: "short", label: "Short Name", state: colShortName, set: setColShortName },
    { key: "price", label: "Price", state: colPrice, set: setColPrice },
    { key: "cover", label: "Cover Price", state: colCoverPrice, set: setColCoverPrice },
  ];

  const sortOptions: { value: SortFirst; label: string }[] = [
    { value: "amharic", label: "Amharic Titles First" },
    { value: "english", label: "English Titles First" },
    { value: "numbered", label: "Numbered Titles First" },
  ];

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const res = await getBooksStorePrintData();
      if (!res.success) {
        toast.error(res.error || "Failed to load books for print");
        return;
      }
      const books = (res.data || []) as PrintBook[];
      if (books.length === 0) {
        toast.info("No books with store stock to print");
        return;
      }

      // Group books, then sort each group with its own alphabet.
      const groups: Record<SortGroup, PrintBook[]> = {
        amharic: [],
        english: [],
        numbered: [],
      };
      for (const b of books) groups[classifyTitle(b.title)].push(b);
      for (const g of Object.keys(groups) as SortGroup[]) {
        groups[g].sort(groupComparators[g]);
      }
      const ordered = groupOrders[sortFirst].flatMap((g) => groups[g]);

      // Amharic headers take priority when toggled
      const columns: PrintColumnKind[] = [];
      const headers: string[] = [];
      if (colNumber) {
        columns.push("number");
        headers.push(amharicTitles ? "ተ.ቁ" : "No.");
      }
      columns.push("title");
      headers.push(amharicTitles ? "የመጽሐፉ ሥም" : "Book Title");
      if (colShortName) {
        columns.push("short");
        headers.push(amharicTitles ? "የማዘዣ ሥሙ" : "Short Name");
      }
      if (colPrice) {
        columns.push("price");
        headers.push(amharicTitles ? "ዋጋ" : "Price");
      }
      if (colCoverPrice) {
        columns.push("cover");
        headers.push(amharicTitles ? "የጀርባ ዋጋ" : "Cover Price");
      }

      const now = new Date();

      setPreview({
        books: ordered,
        columns,
        headers,
        fontSizePx: fontMap[fontSize],
        bold,
        ethDate: formatDate(now, "ethiopian", "EEE, MMMM dd, yyyy"),
        gregDate: formatDate(now, "gregorian", "EEE, MMMM dd, yyyy"),
        fileName: buildPrintFileName(now),
      });
      setOpen(false);
      setPreviewOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while preparing the PDF");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-12 px-6 border-2 border-primarycolor/20 text-primarycolor font-bold hover:bg-primarycolor/5 rounded-2xl transition-all active:scale-95 flex items-center gap-2"
      >
        <Printer className="size-5" />
        Print Options
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-[2rem] border-2 border-primarycolor/10 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-black uppercase italic text-primarycolor flex items-center gap-2">
              <Printer className="size-4" /> Print Options — Books In Store
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Columns to print (Book Title is always included) */}
            <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
              <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">
                Columns To Include <span className="normal-case font-bold text-muted-foreground">(Book Title always shown)</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {toggleColumns.map((opt) => (
                  <label
                    key={opt.key}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1.5 rounded-xl border-2 cursor-pointer transition-colors",
                      opt.state
                        ? "border-primarycolor bg-primarycolor/5"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={opt.state}
                      onChange={(e) => opt.set(e.target.checked)}
                      className="size-3 accent-primarycolor rounded shrink-0"
                    />
                    <span className="font-bold text-slate-700 text-[9px] leading-tight">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
              <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Font Size</p>
              <div className="flex flex-wrap gap-1.5">
                {(["extra-big", "big", "medium", "small", "extra-small"] as const).map((size) => (
                  <label
                    key={size}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 cursor-pointer transition-colors",
                      fontSize === size
                        ? "border-primarycolor bg-primarycolor/5"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <input
                      type="radio"
                      name="books-print-font-size"
                      checked={fontSize === size}
                      onChange={() => setFontSize(size)}
                      className="size-3 accent-primarycolor shrink-0"
                    />
                    <span className="font-bold text-slate-700 text-[9px] uppercase tracking-widest">
                      {size === "extra-big" ? "X.Big" : size === "big" ? "Big" : size === "medium" ? "Medium" : size === "small" ? "Small" : "X.Small"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bold */}
            <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
              <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Font Style</p>
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-slate-200 w-fit">
                <input
                  type="checkbox"
                  checked={bold}
                  onChange={(e) => setBold(e.target.checked)}
                  className="size-3.5 accent-primarycolor"
                />
                <span className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">All Bold</span>
              </label>
            </div>

            {/* Sorting */}
            <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
              <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Sorting</p>
              <div className="flex flex-col gap-1.5">
                {sortOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 cursor-pointer transition-colors",
                      sortFirst === opt.value
                        ? "border-primarycolor bg-primarycolor/5"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <input
                      type="radio"
                      name="books-print-sort"
                      checked={sortFirst === opt.value}
                      onChange={() => setSortFirst(opt.value)}
                      className="size-3 accent-primarycolor shrink-0"
                    />
                    <span className="font-bold text-slate-700 text-[9px] uppercase tracking-widest">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Table titles language */}
            <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
              <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Table Titles</p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAmharicTitles(false)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
                    !amharicTitles
                      ? "bg-primarycolor text-white border-primarycolor"
                      : "bg-white text-primarycolor/70 border-slate-100 hover:border-slate-200"
                  )}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setAmharicTitles(true)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-[10px] font-black tracking-widest border-2 transition-all cursor-pointer",
                    amharicTitles
                      ? "bg-primarycolor text-white border-primarycolor"
                      : "bg-white text-primarycolor/70 border-slate-100 hover:border-slate-200"
                  )}
                >
                  አማርኛ
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-1">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePrint}
                disabled={isPrinting}
                className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] bg-primarycolor hover:bg-secondarycolor text-white shadow-lg gap-1.5"
              >
                {isPrinting ? <Loader2 className="size-3.5 animate-spin" /> : <FileText className="size-3.5" />}
                Preview PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {preview && (
        <BooksPrintPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          books={preview.books}
          columns={preview.columns}
          headers={preview.headers}
          fontSizePx={preview.fontSizePx}
          bold={preview.bold}
          ethDate={preview.ethDate}
          gregDate={preview.gregDate}
          fileName={preview.fileName}
        />
      )}
    </>
  );
}
