"use client"

import * as React from "react"
import * as XLSX from "xlsx"
import { Download } from "lucide-react"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface EditionData {
  id: number;
  name: string;
  sellingPrice: number;
  cost: number;
  revenue: number;
  pending: number;
  collected: number;
  profit: number;
  detailCosts: Record<string, number>;
}

interface BookRow {
  id: number;
  title: string;
  author: string;
  totalCost: number;
  totalRevenue: number;
  totalPending: number;
  totalCollected: number;
  totalProfit: number;
  editionCount: number;
  editions: EditionData[];
}

const costFieldLabels: Record<string, string> = {
  printing_cost: "Printing",
  binding_cost: "Binding",
  design_cost: "Design",
  translation_cost: "Translation",
  editing_cost: "Editing",
  other_expenses: "Other Expenses",
  transportation_cost: "Transportation",
  translator_cost: "Translator",
  cover_design_cost: "Cover Design",
  text_design_cost: "Text Design",
  editor_cost: "Editor",
  typewriting_cost: "Typewriting",
  store_cost: "Store",
  distribution_cost: "Distribution",
  advertisement_cost: "Advertisement",
  purchasing_right_cost: "Purchasing Right",
};

interface Options {
  includeAuthor: boolean;
  includeEditions: boolean;
  includeDetailCosts: boolean;
  includeCollected: boolean;
  includeUncollected: boolean;
}

export default function DownloadButton({ data }: { data: BookRow[] }) {
  const [open, setOpen] = React.useState(false);
  const [opts, setOpts] = React.useState<Options>({
    includeAuthor: true,
    includeEditions: false,
    includeDetailCosts: false,
    includeCollected: true,
    includeUncollected: true,
  });

  function toggle(key: keyof Options) {
    setOpts(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleDownload() {
    const wb = XLSX.utils.book_new();
    const allRows: Record<string, any>[] = [];

    for (const book of data) {
      // --- Book row ---
      const bookRow: Record<string, any> = { "Book Title": book.title };
      if (opts.includeAuthor) bookRow["Author"] = book.author;

      if (opts.includeDetailCosts && opts.includeEditions) {
        for (const f of Object.keys(book.editions[0]?.detailCosts || {})) {
          const sum = book.editions.reduce((s, e) => s + (e.detailCosts[f] || 0), 0);
          bookRow[costFieldLabels[f] || f] = sum;
        }
      } else {
        bookRow["Total Cost"] = book.totalCost;
      }

      bookRow["Total Revenue"] = book.totalRevenue;
      if (opts.includeCollected) bookRow["Collected"] = book.totalCollected;
      if (opts.includeUncollected) bookRow["Uncollected"] = book.totalPending;
      bookRow["Total Profit"] = book.totalProfit;
      bookRow["Edition Count"] = book.editionCount;
      allRows.push(bookRow);

      // --- Edition rows (indented beneath the book) ---
      if (opts.includeEditions) {
        for (const ed of book.editions) {
          const edRow: Record<string, any> = { "Book Title": `  └ ${ed.name}` };
          if (opts.includeAuthor) edRow["Author"] = "";

          if (opts.includeDetailCosts) {
            for (const f of Object.keys(ed.detailCosts)) {
              edRow[costFieldLabels[f] || f] = ed.detailCosts[f];
            }
          } else {
            edRow["Total Cost"] = ed.cost;
          }

          edRow["Total Revenue"] = ed.revenue;
          if (opts.includeCollected) edRow["Collected"] = ed.collected;
          if (opts.includeUncollected) edRow["Uncollected"] = ed.pending;
          edRow["Total Profit"] = ed.profit;
          edRow["Edition Count"] = "";
          allRows.push(edRow);
        }
      }
    }

    const ws = XLSX.utils.json_to_sheet(allRows);
    ws["!cols"] = buildColWidths(allRows[0] || {});
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Analysis");

    XLSX.writeFile(wb, "revenue_analysis.xlsx");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primarycolor text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]">
          <Download className="size-4" />
          Download Excel
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-widest text-primarycolor">
            Export Options
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <OptionRow
            id="author"
            label="Include Author"
            checked={opts.includeAuthor}
            onToggle={() => toggle("includeAuthor")}
          />
          <OptionRow
            id="editions"
            label="Include Editions"
            description="Show editions grouped under each book"
            checked={opts.includeEditions}
            onToggle={() => toggle("includeEditions")}
          />
          <OptionRow
            id="detailCosts"
            label="Include Detail Costs"
            description="Show cost breakdown columns (printing, binding, design, etc.)"
            checked={opts.includeDetailCosts}
            onToggle={() => toggle("includeDetailCosts")}
          />
          <OptionRow
            id="collected"
            label="Include Collected"
            checked={opts.includeCollected}
            onToggle={() => toggle("includeCollected")}
          />
          <OptionRow
            id="uncollected"
            label="Include Uncollected"
            checked={opts.includeUncollected}
            onToggle={() => toggle("includeUncollected")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t">
          <DialogClose asChild>
            <button className="h-9 px-4 rounded-lg text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-primarycolor text-white font-black uppercase tracking-widest text-[11px] shadow-md shadow-primarycolor/20 hover:shadow-lg hover:shadow-primarycolor/30 transition-all active:scale-[0.98]"
          >
            <Download className="size-3.5" />
            Export
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OptionRow({
  id,
  label,
  description,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 cursor-pointer group"
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} className="mt-0.5" />
      <div>
        <span className="text-sm font-semibold text-slate-800 group-hover:text-primarycolor transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

function buildColWidths(row: Record<string, any>): XLSX.ColInfo[] {
  return Object.keys(row).map(key => {
    const labelLen = key.length;
    const valLen = String(row[key] ?? "").length;
    const wch = Math.max(labelLen, valLen) + 4;
    return { wch: Math.min(wch, 50) };
  });
}
