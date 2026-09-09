"use client";

import React, { useState } from "react";
import { Loader2, Printer } from "lucide-react";
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

interface PrintBook {
  title: string;
  short_name: string | null;
  price: number | null;
  cover_price: number | null;
}

type FontSize = "extra-big" | "big" | "medium" | "small" | "extra-small";
type SortFirst = "amharic" | "english" | "numbered";
type SortGroup = "amharic" | "english" | "numbered";

const fontMap: Record<FontSize, string> = {
  "extra-big": "22px",
  big: "18px",
  medium: "15px",
  small: "12px",
  "extra-small": "10px",
};

// Remaining groups follow after the first choice; numbered goes last
// unless it is chosen first.
const groupOrders: Record<SortFirst, SortGroup[]> = {
  amharic: ["amharic", "english", "numbered"],
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

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fmtPrice = (v: number | null) =>
  v == null || Number.isNaN(Number(v))
    ? "—"
    : Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });

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
      const headers: string[] = [];
      if (colNumber) headers.push(amharicTitles ? "ተ.ቁ" : "No.");
      headers.push(amharicTitles ? "የመጽሐፉ ሥም" : "Book Title");
      if (colShortName) headers.push(amharicTitles ? "የማዘዣ ሥሙ" : "Short Name");
      if (colPrice) headers.push(amharicTitles ? "ዋጋ" : "Price");
      if (colCoverPrice) headers.push(amharicTitles ? "የጀርባ ዋጋ" : "Cover Price");

      const rowsHtml = ordered
        .map((b, i) => {
          const cells: string[] = [];
          if (colNumber) cells.push(`<td class="c">${i + 1}</td>`);
          cells.push(`<td>${escHtml(b.title || "—")}</td>`);
          if (colShortName) cells.push(`<td>${escHtml(b.short_name || "—")}</td>`);
          if (colPrice) cells.push(`<td class="r">${fmtPrice(b.price)}</td>`);
          if (colCoverPrice) cells.push(`<td class="r">${fmtPrice(b.cover_price)}</td>`);
          return `<tr>${cells.join("")}</tr>`;
        })
        .join("");

      const now = new Date();
      const ethDate = formatDate(now, "ethiopian", "EEE, MMMM dd, yyyy");
      const gregDate = formatDate(now, "gregorian", "EEE, MMMM dd, yyyy");
      const size = fontMap[fontSize];
      const weight = bold ? "700" : "400";
      const colCount = headers.length;

      const printContent = `
<!DOCTYPE html>
<html>
<head>
<title>Books In Store</title>
<style>
    @page {
        size: A4 portrait;
        margin: 10mm;
        @bottom-center { content: "Page " counter(page); font-size: 9px; color: #111; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: ${size};
        font-weight: ${weight};
        color: #111;
    }
    table { width: 100%; border-collapse: collapse; }
    thead { display: table-header-group; }
    .date-row td {
        border: none;
        border-bottom: none;
        padding: 1px 2px;
        font-size: ${size};
        color: #111;
        text-align: left;
    }
    .HEAD-row th {
        background: #eee;
        border: 1px solid #999;
        padding: 5px 8px;
        font-size: ${parseInt(size) - 1}px;
        font-weight: ${weight};
        color: #111;
    }
    td { border: 1px solid #999; padding: 4px 8px; color: #111; }
    .r { text-align: right; white-space: nowrap; }
    .c { text-align: center; }
    tbody tr { page-break-inside: avoid; }
</style>
</head>
<body>
    <table>
        <thead>
            <tr class="date-row"><td colspan="${colCount}">Ethiopian: ${escHtml(ethDate)}</td></tr>
            <tr class="date-row"><td colspan="${colCount}">Gregorian: ${escHtml(gregDate)}</td></tr>
            <tr class="HEAD-row">${headers.map((h) => `<th>${escHtml(h)}</th>`).join("")}</tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
    </table>
</body>
</html>`;

      const printWin = window.open("", "_blank", "width=900,height=700");
      if (!printWin) {
        toast.error("Failed to open print window");
        return;
      }
      printWin.document.write(printContent);
      printWin.document.close();
      printWin.focus();
      printWin.print();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while printing");
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
                {isPrinting ? <Loader2 className="size-3.5 animate-spin" /> : <Printer className="size-3.5" />}
                Print
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
