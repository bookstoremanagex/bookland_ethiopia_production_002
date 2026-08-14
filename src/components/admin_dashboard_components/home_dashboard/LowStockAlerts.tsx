import { AlertTriangle, ArrowRight, PackageX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LowStockAlertsProps {
  items: {
    id: number;
    bookTitle: string;
    author: string;
    bookImage: string | null;
    totalQuantity: number;
    editionCount: number;
    uniqueCode: string;
  }[];
}

const THRESHOLD = 50;

function urgency(qty: number) {
  if (qty <= 10) {
    return {
      label: "bg-rose-50 text-rose-700 border-rose-200/60",
      text: "text-red-600",
      chip: "bg-red-500",
      tag: "Critical",
    };
  }
  if (qty <= 25) {
    return {
      label: "bg-orange-50 text-orange-700 border-orange-200/60",
      text: "text-orange-600",
      chip: "bg-orange-400",
      tag: "Low",
    };
  }
  return {
    label: "bg-amber-50 text-amber-700 border-amber-200/60",
    text: "text-amber-600",
    chip: "bg-amber-400",
    tag: "Running low",
  };
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white gradient-shadow lg:rounded-3xl">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 lg:rounded-t-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle at center, #f59e0b, transparent 70%)" }} aria-hidden />

      <div className="relative flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
            <AlertTriangle className="size-5" strokeWidth={2} />
            <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white ring-2 ring-white animate-pulse">
              {items.length}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Low Stock Alerts
            </h2>
            <p className="text-sm text-slate-600">Books with fewer than {THRESHOLD} copies across all stores.</p>
          </div>
        </div>
        <Link href="/admin_dashboard/production/low-stock" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="group/btn rounded-xl border-amber-300/60 font-medium text-amber-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 hover:text-white hover:border-transparent transition-all duration-300"
          >
            Show More
            <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </div>

      <div className="relative divide-y divide-slate-100 px-4 py-2 sm:px-6">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">All books are well-stocked.</p>
        ) : (
          items.map((item) => {
            const u = urgency(item.totalQuantity);
            return (
              <div
                key={item.id}
                className="group/item flex flex-col gap-3 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-50/60 hover:to-transparent sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-transform duration-300 group-hover/item:scale-105 group-hover/item:rotate-1">
                    {item.bookImage ? (
                      <img src={item.bookImage} alt="" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                        <PackageX className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900 transition-colors group-hover/item:text-primarycolor">{item.bookTitle}</p>
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider border ${u.label}`}>
                        {u.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.author} · {item.editionCount} {item.editionCount === 1 ? "edition" : "editions"}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span className={`inline-flex items-center gap-1 text-sm font-bold tabular-nums ${u.text}`}>
                    <span className={`size-1.5 rounded-full ${u.chip} animate-pulse`} />
                    {item.totalQuantity}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">copies total</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}