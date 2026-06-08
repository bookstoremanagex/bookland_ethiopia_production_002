"use client";

import { LayoutDashboard, Calendar, Sparkles, Truck, ShoppingBag, ClipboardList, BadgeDollarSign } from "lucide-react";
import { useCalendar } from "@/lib/calendar-context";

interface DeliverHomeDashboardProps {
  data: {
    totalShops: number;
    totalOrders: number;
    pendingDeliveries: number;
    totalRevenue: number;
    totalDebt: number;
  };
}

export default function DeliverHomeDashboard({ data }: DeliverHomeDashboardProps) {
  const { formatLong } = useCalendar();
  const today = formatLong(new Date());

  const stats = [
    {
      label: "Total Shops",
      value: data.totalShops,
      icon: ShoppingBag,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Orders",
      value: data.totalOrders,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Deliveries",
      value: data.pendingDeliveries,
      icon: Truck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Outstanding Balance",
      value: `ETB ${data.totalDebt.toLocaleString()}`,
      icon: BadgeDollarSign,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

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
              <LayoutDashboard className="size-3.5 shrink-0 text-primarycolor" />
              <span>Delivery Dashboard</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-600">
                Manage book shop orders, track deliveries, and oversee payments.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Calendar className="size-4 text-primarycolor/70" />
                {today}
              </span>
              <span className="hidden h-4 w-px bg-slate-200 sm:inline" />
              <span className="inline-flex items-center gap-2 text-emerald-700/90">
                <Sparkles className="size-4 text-emerald-600" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-primarycolor/10 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`size-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
