import {
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Banknote,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalBooks: number;
    totalShops: number;
    totalRevenue: number;
    totalDebt: number;
    pendingOrders: number;
    lowStockCount: number;
    revenueGrowth: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const items = [
    {
      title: "Books in catalog",
      value: stats.totalBooks.toLocaleString(),
      hint: "Active titles",
      icon: BookOpen,
      tile: "from-primarycolor to-emerald-600",
      glow: "bg-primarycolor/20",
      trend: { value: "Total", up: true as const },
    },
    {
      title: "Partner shops",
      value: stats.totalShops.toLocaleString(),
      hint: "Retail locations",
      icon: ShoppingBag,
      tile: "from-secondarycolor to-primarycolor",
      glow: "bg-secondarycolor/20",
      trend: { value: "Active", up: true as const },
    },
    {
      title: "Gross revenue",
      value: `${stats.totalRevenue.toLocaleString()} ETB`,
      hint: "Distributed value",
      icon: TrendingUp,
      tile: "from-emerald-500 to-teal-600",
      glow: "bg-emerald-500/20",
      trend: { value: `${stats.revenueGrowth}%`, up: stats.revenueGrowth >= 0 },
    },
    {
      title: "Outstanding",
      value: `${stats.totalDebt.toLocaleString()} ETB`,
      hint: "Pending collection",
      icon: Banknote,
      tile: "from-amber-500 to-orange-600",
      glow: "bg-amber-500/20",
      trend: { value: "Due", up: false },
    },
    {
      title: "Pending orders",
      value: stats.pendingOrders.toLocaleString(),
      hint: "Awaiting approval",
      icon: ShoppingCart,
      tile: "from-sky-500 to-blue-600",
      glow: "bg-sky-500/20",
      trend: { value: "Open", up: true as const },
    },
    {
      title: "Low stock items",
      value: stats.lowStockCount.toLocaleString(),
      hint: "Below threshold",
      icon: AlertTriangle,
      tile: "from-rose-500 to-red-600",
      glow: "bg-rose-500/20",
      trend: { value: "Needs attention", up: false },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 gradient-shadow transition-all duration-300 hover:-translate-y-1 hover:border-primarycolor/25 hover:gradient-shadow-hover sm:p-6"
        >
          {/* corner glow blob */}
          <div className={`pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60 ${item.glow}`} aria-hidden />
          {/* decorative ring */}
          <div className="pointer-events-none absolute -right-4 -top-4 size-16 rounded-full border-2 border-primarycolor/10 transition-transform duration-500 group-hover:scale-125 group-hover:border-primarycolor/20" aria-hidden />

          <div className="relative flex flex-col gap-3">
            <div className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tile} text-white shadow-lg shadow-primarycolor/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
              <item.icon className="size-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {item.title}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums transition-colors group-hover:text-primarycolor">
                {item.value}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{item.hint}</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400">Status</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  item.trend.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}
              >
                {item.trend.up ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {item.trend.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
