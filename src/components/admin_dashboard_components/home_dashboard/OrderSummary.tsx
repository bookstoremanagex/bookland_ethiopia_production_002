import { ShoppingCart, ArrowRight, Store, CircleCheck, CircleX, Clock3 } from "lucide-react";
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

function statusMeta(status: string) {
  const s = status.toLowerCase();
  if (s === "pending") {
    return { label: "Pending", icon: Clock3, pill: "bg-amber-50 text-amber-700 border-amber-200/60", dot: "bg-amber-400" };
  }
  if (s === "approved" || s === "completed") {
    return { label: status, icon: CircleCheck, pill: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dot: "bg-emerald-500" };
  }
  if (s === "cancelled") {
    return { label: "Cancelled", icon: CircleX, pill: "bg-red-50 text-red-700 border-red-200/60", dot: "bg-red-500" };
  }
  return { label: status, icon: Store, pill: "bg-slate-50 text-slate-600 border-slate-200/60", dot: "bg-slate-400" };
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function OrderSummary({ orders }: OrderSummaryProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white gradient-shadow lg:rounded-3xl">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor lg:rounded-t-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)" }} aria-hidden />

      <div className="relative flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30">
            <ShoppingCart className="size-5" strokeWidth={2} />
            <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white ring-2 ring-white">
              {orders.length}
            </span>
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
            className="group/btn rounded-xl border-primarycolor/20 font-medium text-primarycolor hover:bg-primarycolor hover:text-white transition-all duration-300"
          >
            View all
            <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </div>

      <div className="relative divide-y divide-slate-100 px-4 py-2 sm:px-6">
        {orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No orders yet.</p>
        ) : (
          orders.map((order) => {
            const meta = statusMeta(order.status);
            const StatusIcon = meta.icon;
            return (
              <div
                key={order.id}
                className="group/order flex flex-col gap-2 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-primarycolor/5 hover:to-transparent sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primarycolor/15 to-tertiarycolor/40 text-primarycolor font-black text-xs transition-transform duration-300 group-hover/order:scale-110">
                    {initials(order.shopName)}
                    <span className={`absolute bottom-0.5 right-0.5 size-2 rounded-full ring-1 ring-white ${meta.dot}`} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 transition-colors group-hover/order:text-primarycolor">{order.shopName}</p>
                    <p className="text-xs text-slate-500">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold tabular-nums text-slate-800">
                    {order.totalAmount.toLocaleString()} ETB
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${meta.pill}`}>
                    <StatusIcon className="size-3" />
                    {meta.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}