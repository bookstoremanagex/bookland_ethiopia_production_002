"use client";

import { StatsOverview } from "./StatsOverview";
import { FinancialChart } from "./FinancialChart";
import { RecentActivity } from "./RecentActivity";
import { ProductionOverview } from "./ProductionOverview";
import { LayoutDashboard, Calendar, Sparkles } from "lucide-react";

interface DashboardContainerProps {
  data: {
    stats: any;
    financialData: any[];
    recentActivities: any[];
    productionData: any[];
  };
}

export default function DashboardContainer({ data }: DashboardContainerProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-primarycolor/10 bg-white p-6 shadow-sm sm:p-8 lg:rounded-3xl lg:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-[0.12]"
          style={{
            background:
              "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle at center, var(--color-secondarycolor), transparent 70%)",
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primarycolor/15 bg-primarycolor/5 px-3 py-1 text-xs font-medium text-secondarycolor">
              <LayoutDashboard className="size-3.5 shrink-0 text-primarycolor" aria-hidden />
              <span>Overview</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-600">
                Here is a snapshot of inventory, shops, and revenue. Use the sidebar
                to jump into books, finance, or operations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Calendar className="size-4 text-primarycolor/70" aria-hidden />
                {today}
              </span>
              <span className="hidden h-4 w-px bg-slate-200 sm:inline" aria-hidden />
              <span className="inline-flex items-center gap-2 text-emerald-700/90">
                <Sparkles className="size-4 text-emerald-600" aria-hidden />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </header>

      <StatsOverview stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <FinancialChart data={data.financialData} />
        </div>
        <div className="lg:col-span-1">
          <ProductionOverview data={data.productionData} />
        </div>
      </div>

      <section className="pb-4">
        <RecentActivity activities={data.recentActivities} />
      </section>
    </div>
  );
}
