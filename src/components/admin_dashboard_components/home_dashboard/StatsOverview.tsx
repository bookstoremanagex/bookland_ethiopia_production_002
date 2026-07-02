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
      accent: "from-primarycolor/15 to-tertiarycolor/30",
      iconBg: "bg-primarycolor/10 text-primarycolor",
      trend: { value: "Total", up: true as const },
    },
    {
      title: "Partner shops",
      value: stats.totalShops.toLocaleString(),
      hint: "Retail locations",
      icon: ShoppingBag,
      accent: "from-secondarycolor/10 to-primarycolor/10",
      iconBg: "bg-secondarycolor/10 text-secondarycolor",
      trend: { value: "Active", up: true as const },
    },
    {
      title: "Gross revenue",
      value: `${stats.totalRevenue.toLocaleString()} ETB`,
      hint: "Distributed value",
      icon: TrendingUp,
      accent: "from-emerald-500/10 to-primarycolor/10",
      iconBg: "bg-emerald-50 text-emerald-700",
      trend: { value: `${stats.revenueGrowth}%`, up: stats.revenueGrowth >= 0 },
    },
    {
      title: "Outstanding",
      value: `${stats.totalDebt.toLocaleString()} ETB`,
      hint: "Pending collection",
      icon: Banknote,
      accent: "from-amber-500/10 to-rose-500/5",
      iconBg: "bg-amber-50 text-amber-800",
      trend: { value: "Due", up: false },
    },
    {
      title: "Pending orders",
      value: stats.pendingOrders.toLocaleString(),
      hint: "Awaiting approval",
      icon: ShoppingCart,
      accent: "from-blue-500/10 to-sky-500/5",
      iconBg: "bg-blue-50 text-blue-700",
      trend: { value: "Open", up: true as const },
    },
    {
      title: "Low stock items",
      value: stats.lowStockCount.toLocaleString(),
      hint: "Below threshold",
      icon: AlertTriangle,
      accent: "from-orange-500/10 to-red-500/5",
      iconBg: "bg-orange-50 text-orange-700",
      trend: { value: "Needs attention", up: false },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:border-primarycolor/20 hover:shadow-md sm:p-6"
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100 ${item.accent}`}
          />
          <div className="relative flex flex-col gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl ${item.iconBg}`}
            >
              <item.icon className="size-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.title}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {item.value}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{item.hint}</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400">Status</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  item.trend.up ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {item.trend.up ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
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
