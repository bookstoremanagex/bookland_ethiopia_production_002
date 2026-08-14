"use client";

import { useState, useEffect } from "react";
import { StatsOverview } from "./StatsOverview";
import { FinancialChart } from "./FinancialChart";
import { RecentActivity } from "./RecentActivity";
import { ProductionOverview } from "./ProductionOverview";
import { QuickActions } from "./QuickActions";
import { OrderSummary } from "./OrderSummary";
import { LowStockAlerts } from "./LowStockAlerts";
import {
  Calendar,
  Bell,
  BellRing,
  MessageSquare,
  ArrowRight,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DashboardData } from "@/app/admin_dashboard/page";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  details: string | null;
  type: string;
  createdAt: string;
}

interface DashboardContainerProps {
  data: DashboardData;
}

function timeAgo(dateStr: string, now: number): string {
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getTypeIcon(type: string) {
  switch (type) {
    case "PROMOTION": return <BellRing className="size-3.5 text-purple-600" />;
    case "WARNING": return <AlertCircle className="size-3.5 text-amber-600" />;
    case "SUCCESS": return <CheckCircle2 className="size-3.5 text-emerald-600" />;
    default: return <Info className="size-3.5 text-sky-600" />;
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case "PROMOTION": return "bg-purple-50 border-purple-200/50";
    case "WARNING": return "bg-amber-50 border-amber-200/50";
    case "SUCCESS": return "bg-emerald-50 border-emerald-200/50";
    default: return "bg-sky-50 border-sky-200/50";
  }
}

function getTypeAccent(type: string) {
  switch (type) {
    case "PROMOTION": return "from-purple-400 to-purple-200";
    case "WARNING": return "from-amber-500 to-amber-300";
    case "SUCCESS": return "from-emerald-500 to-emerald-300";
    default: return "from-sky-500 to-sky-300";
  }
}
export default function DashboardContainer({ data }: DashboardContainerProps) {
  const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
  const today = formatLong(new Date());
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { setNow(Date.now()); }, []);

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-primarycolor/20 bg-gradient-to-br from-primarycolor via-secondarycolor to-quaternarycolor p-6 gradient-shadow-lg sm:p-8 lg:rounded-3xl lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-25" style={{ background: "radial-gradient(circle at center, #B0E4CC, transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle at center, #059669, transparent 70%)" }} />
        <div className="pointer-events-none absolute right-[12%] bottom-[-40%] size-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle at center, #FFFFFF, transparent 70%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
              <ShieldCheck className="size-3.5 shrink-0 text-tertiarycolor" aria-hidden />
              <span>Admin Overview</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-white/70">
                Here is a snapshot of your catalog, finances, orders, and operations — all in one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <Calendar className="size-4 text-tertiarycolor" aria-hidden />
                {today}
              </span>
              <span className="hidden h-4 w-px bg-white/20 sm:inline" aria-hidden />
              <span className="inline-flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
                </span>
                All systems operational
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:shrink-0">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-tertiarycolor">Books in catalog</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">{data.stats.totalBooks.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-tertiarycolor">Gross revenue</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">{data.stats.totalRevenue.toLocaleString()} <span className="text-sm font-bold text-tertiarycolor">ETB</span></p>
            </div>
            <div className="hidden rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-tertiarycolor">Pending orders</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">{data.stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <QuickActions pendingOrders={data.stats.pendingOrders} pendingPayments={data.stats.pendingPayments} />

      {/* Unread Notifications */}
      {data.notifications.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl border border-primarycolor/10 bg-white p-5 gradient-shadow sm:p-6 lg:rounded-3xl lg:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)" }} aria-hidden />

          <div className="relative flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30">
                <Bell className="size-5" />
                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white">
                  {data.notifications.length}
                </span>
                <span className="absolute inset-0 -z-10 rounded-2xl bg-primarycolor/40 animate-ping" style={{ animationDuration: "2.2s" }} aria-hidden />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">
                  Unread <span className="bg-gradient-to-r from-primarycolor to-secondarycolor bg-clip-text text-transparent">Notifications</span>
                </h2>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {data.notifications.length} new
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-2.5">
            {data.notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNotification(n)}
                className="group relative w-full overflow-hidden text-left rounded-xl border border-primarycolor/5 bg-primarycolor/[0.02] p-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-primarycolor/10 hover:to-transparent hover:border-primarycolor/15 hover:translate-x-1 active:scale-[0.99]"
              >
                <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${getTypeAccent(n.type)} opacity-70 transition-opacity group-hover:opacity-100`} aria-hidden />
                <div className="flex items-start gap-3 pl-2">
                  <div className={`mt-0.5 size-8 rounded-lg flex items-center justify-center shrink-0 border ${getTypeBg(n.type)} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 leading-snug truncate">{n.title}</p>
                      <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap shrink-0 mt-0.5 transition-colors group-hover:text-primarycolor">{timeAgo(n.createdAt, now)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-primarycolor/0 -translate-x-1 transition-all duration-300 group-hover:text-primarycolor group-hover:translate-x-0" aria-hidden />
                </div>
              </button>
            ))}
          </div>

          <Link
            href="/admin_dashboard/notifications"
            className="relative mt-5 flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-primarycolor to-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/30 hover:shadow-xl hover:shadow-primarycolor/40 hover:brightness-110 active:scale-[0.98] transition-all duration-300"
          >
            Go to Notifications <ArrowRight className="size-3.5" />
          </Link>
        </section>
      )}

      {/* Stats Cards */}
      <StatsOverview stats={data.stats} />

      {/* Chart Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <FinancialChart data={data.orderMonthsData} />
        </div>
        <div className="lg:col-span-1">
          <ProductionOverview data={data.productionData} />
        </div>
      </div>

      {/* Orders + Low Stock Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
        <OrderSummary orders={data.recentOrders} />
        <LowStockAlerts items={data.lowStockItems} />
      </div>

      {/* Activity */}
      <RecentActivity activities={data.recentActivities} />

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={(open) => { if (!open) setSelectedNotification(null) }}>
        <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 bg-card shadow-2xl">
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-secondarycolor uppercase tracking-tight flex items-center gap-2">
                  <MessageSquare className="size-5 text-primarycolor" /> Notification Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                <div className="flex items-center gap-2">
                  <div className={`size-8 rounded-lg flex items-center justify-center border ${getTypeBg(selectedNotification.type)}`}>
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <p className="font-bold text-secondarycolor text-sm">{selectedNotification.title}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="size-3" /> {formatDateTime(new Date(selectedNotification.createdAt))}
                    </p>
                  </div>
                </div>

                <div className="bg-primarycolor/[0.02] rounded-xl border border-primarycolor/5 p-4">
                  <p className="text-sm text-secondarycolor/80 leading-relaxed">{selectedNotification.message}</p>
                </div>

                {selectedNotification.details && (
                  <div className="bg-slate-50 rounded-xl border border-slate-200/50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Additional Details</p>
                    <div className="overflow-x-auto break-all">
                      <pre className="text-xs text-secondarycolor/70 font-medium whitespace-pre-wrap">{selectedNotification.details}</pre>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  <div className={cn("px-2 py-0.5 rounded-full border", getTypeBg(selectedNotification.type))}>
                    {selectedNotification.type}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setSelectedNotification(null)}
                    className="w-full h-11 rounded-xl bg-primarycolor text-white font-black uppercase tracking-wider"
                  >
                    <X className="size-3.5 mr-2" /> Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
