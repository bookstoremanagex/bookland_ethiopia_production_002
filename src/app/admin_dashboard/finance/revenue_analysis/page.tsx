import prisma from "@/lib/prisma";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BookOpen, Package } from "lucide-react";
import DownloadButton from "./DownloadButton";

const editionCostFields = [
  "printing_cost", "binding_cost", "design_cost", "translation_cost",
  "editing_cost", "other_expenses", "transportation_cost",
  "translator_cost", "cover_design_cost", "text_design_cost",
  "editor_cost", "typewriting_cost", "store_cost",
  "distribution_cost", "advertisement_cost", "purchasing_right_cost"
];

function sumCosts(obj: any): number {
  return editionCostFields.reduce((sum, f) => sum + (Number(obj[f]) || 0), 0);
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function RevenueAnalysisPage() {
  const books = await (prisma as any).books.findMany({
    where: { is_deleted: false },
    include: {
      bookedition: {
        where: { is_deleted: false },
        include: {
          bookshopeditions: { where: { is_deleted: false } },
          retail_purchase_items: { where: { is_deleted: false } },
        },
      },
    },
  });

  const bookData = (books as any[]).map(book => {
    let totalCost = 0;
    let totalRevenue = 0;
    let totalPending = 0;

    const editions = (book.bookedition as any[]).map((edition: any) => {
      const cost = sumCosts(edition);
      let revenue = 0;
      let pending = 0;

      for (const bse of edition.bookshopeditions || []) {
        revenue += Number(bse.total_price) || 0;
        pending += Number(bse.remaining_amount) || 0;
      }
      for (const rpi of edition.retail_purchase_items || []) {
        revenue += (Number(rpi.quantity) || 0) * (Number(rpi.unit_price) || 0);
      }

      totalCost += cost;
      totalRevenue += revenue;
      totalPending += pending;

      const detailCosts: Record<string, number> = {};
      for (const f of editionCostFields) {
        detailCosts[f] = Number(edition[f]) || 0;
      }

      return {
        id: edition.id as number,
        name: edition.edition_name || "Unnamed",
        sellingPrice: Number(edition.selling_price) || 0,
        cost,
        revenue,
        pending,
        collected: revenue - pending,
        profit: revenue - cost,
        detailCosts,
      };
    });

    return {
      id: book.id as number,
      title: book.title as string,
      author: (book.author as string) || "Unknown",
      totalCost,
      totalRevenue,
      totalPending,
      totalCollected: totalRevenue - totalPending,
      totalProfit: totalRevenue - totalCost,
      editionCount: editions.length,
      editions,
    };
  });

  return (
    <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Revenue <span className="text-secondarycolor not-italic">Analysis</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
            Cost, revenue, and profit breakdown by book and edition
          </p>
        </div>
        <DownloadButton data={bookData} />
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {bookData.map(book => (
          <AccordionItem
            key={book.id}
            value={String(book.id)}
            className="border rounded-xl overflow-hidden bg-white shadow-sm data-[state=open]:shadow-md transition-shadow"
          >
            <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-slate-50/80 transition-colors data-[state=open]:border-b data-[state=open]:border-slate-100">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center shrink-0">
                    <BookOpen className="size-5 text-primarycolor" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="text-base font-bold text-slate-900 block truncate">
                      {book.title}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {book.author} &middot; {book.editionCount} edition{book.editionCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-8 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cost</div>
                    <div className="text-sm font-semibold text-red-600">${fmt(book.totalCost)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revenue</div>
                    <div className="text-sm font-semibold text-green-600">${fmt(book.totalRevenue)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profit</div>
                    <div className={`text-sm font-bold ${book.totalProfit >= 0 ? "text-primarycolor" : "text-red-600"}`}>
                      ${fmt(book.totalProfit)}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 py-5">
              {/* Mobile summary cards */}
              <div className="grid grid-cols-3 gap-3 mb-6 md:hidden">
                <StatCard label="Cost" value={fmt(book.totalCost)} color="red" />
                <StatCard label="Revenue" value={fmt(book.totalRevenue)} color="green" />
                <StatCard label="Profit" value={fmt(book.totalProfit)} color={book.totalProfit >= 0 ? "primary" : "red"} />
              </div>

              {/* Edition list */}
              <div className="space-y-3">
                {book.editions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No editions found for this book.</p>
                )}
                {book.editions.map((edition, idx) => (
                  <div
                    key={edition.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50/80 border border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center shrink-0">
                        <Package className="size-4 text-primarycolor/60" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-slate-800 block truncate">
                          {edition.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Edition {idx + 1}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 shrink-0">
                      <EditionStat label="Cost" value={fmt(edition.cost)} color="red" />
                      <EditionStat label="Revenue" value={fmt(edition.revenue)} color="green" />
                      <EditionStat label="Collected" value={fmt(edition.collected)} color="blue" />
                      <EditionStat label="Profit" value={fmt(edition.profit)} color={edition.profit >= 0 ? "primary" : "red"} />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {bookData.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="size-12 text-primarycolor/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No books found</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    red: "bg-red-50 text-red-700",
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    primary: "bg-primarycolor/10 text-primarycolor",
  };
  return (
    <div className={`rounded-xl p-3 text-center ${colorClasses[color] || colorClasses.primary}`}>
      <div className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</div>
      <div className="text-sm font-bold">${value}</div>
    </div>
  );
}

function EditionStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-600",
    primary: "text-primarycolor",
  };
  return (
    <div className="text-right">
      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-xs font-bold ${colorClasses[color] || colorClasses.primary}`}>${value}</div>
    </div>
  );
}
