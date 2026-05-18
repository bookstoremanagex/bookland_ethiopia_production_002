import {
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalBooks: number;
    totalShops: number;
    totalRevenue: number;
    totalDebt: number;
    revenueGrowth: number;
    debtChange: number;
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
      trend: { value: "+12%", up: true },
    },
    {
      title: "Partner shops",
      value: stats.totalShops.toLocaleString(),
      hint: "Retail locations",
      icon: ShoppingBag,
      accent: "from-secondarycolor/10 to-primarycolor/10",
      iconBg: "bg-secondarycolor/10 text-secondarycolor",
      trend: { value: "+3", up: true },
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
      trend: { value: `${Math.abs(stats.debtChange)}%`, up: stats.debtChange < 0 },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:border-primarycolor/20 hover:shadow-md sm:p-6"
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100 ${item.accent}`}
          />
          <div className="relative flex flex-col gap-4">
            <div
              className={`flex size-11 items-center justify-center rounded-xl ${item.iconBg}`}
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
              <span className="text-xs text-slate-400">Trend</span>
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
