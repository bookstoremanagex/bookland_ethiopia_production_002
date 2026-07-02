import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  orders: {
    id: number;
    shopName: string;
    totalAmount: number;
    status: string;
    date: string;
  }[];
}

function statusColor(status: string): string {
  const s = status.toLowerCase();
  if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200/50";
  if (s === "approved" || s === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
  if (s === "cancelled") return "bg-red-50 text-red-700 border-red-200/50";
  return "bg-slate-50 text-slate-600 border-slate-200/50";
}

export function OrderSummary({ orders }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:rounded-3xl">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primarycolor/10 text-primarycolor">
            <ShoppingCart className="size-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Recent Orders
            </h2>
            <p className="text-sm text-slate-600">Latest orders from partner shops.</p>
          </div>
        </div>
        <Link href="/admin_dashboard/manage_orders" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-primarycolor/20 font-medium text-primarycolor hover:bg-primarycolor/5"
          >
            View all
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-slate-100 px-4 py-2 sm:px-6">
        {orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 py-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="size-2 rounded-full bg-primarycolor/40 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{order.shopName}</p>
                  <p className="text-xs text-slate-500">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold tabular-nums text-slate-800">
                  ${order.totalAmount.toLocaleString()}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
