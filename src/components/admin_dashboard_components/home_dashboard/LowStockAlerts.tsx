import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LowStockAlertsProps {
  items: {
    id: number;
    bookTitle: string;
    editionName: string;
    quantity: number;
  }[];
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:rounded-3xl">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangle className="size-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Low Stock Alerts
            </h2>
            <p className="text-sm text-slate-600">Editions with fewer than 50 units in store.</p>
          </div>
        </div>
        <Link href="/admin_dashboard/stores" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-primarycolor/20 font-medium text-primarycolor hover:bg-primarycolor/5"
          >
            View stores
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-slate-100 px-4 py-2 sm:px-6">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">All editions are well-stocked.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 py-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="size-2 rounded-full bg-amber-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.bookTitle}</p>
                  <p className="text-xs text-slate-500">{item.editionName}</p>
                </div>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <span className={`text-sm font-bold tabular-nums ${item.quantity <= 10 ? "text-red-600" : "text-amber-600"}`}>
                  {item.quantity}
                </span>
                <span className="text-xs text-slate-500 ml-1">units</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
