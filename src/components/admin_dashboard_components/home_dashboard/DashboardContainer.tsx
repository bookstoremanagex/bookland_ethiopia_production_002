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
  LayoutDashboard,
  Calendar,
  Sparkles,
  Bell,
  BellRing,
  MessageSquare,
  ArrowRight,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
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

export default function DashboardContainer({ data }: DashboardContainerProps) {
  const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
  const today = formatLong(new Date());
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { setNow(Date.now()); }, []);

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
                Here is a snapshot of your catalog, finances, orders, and operations.
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

      {/* Quick Actions */}
      <QuickActions pendingOrders={data.stats.pendingOrders} pendingPayments={data.stats.pendingPayments} />

      {/* Unread Notifications */}
      {data.notifications.length > 0 && (
        <section className="rounded-2xl border border-primarycolor/10 bg-white p-5 shadow-sm sm:p-6 lg:rounded-3xl lg:p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primarycolor/5 flex items-center justify-center">
                <Bell className="size-4 text-primarycolor" />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">Unread Notifications</h2>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{data.notifications.length} new</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {data.notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNotification(n)}
                className="w-full text-left rounded-xl border border-primarycolor/5 bg-primarycolor/[0.02] p-4 transition-all hover:bg-primarycolor/5 hover:border-primarycolor/15 active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 size-8 rounded-lg flex items-center justify-center shrink-0 border ${getTypeBg(n.type)}`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 leading-snug truncate">{n.title}</p>
                      <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">{timeAgo(n.createdAt, now)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Link
            href="/admin_dashboard/notifications"
            className="mt-4 flex items-center justify-center gap-2 w-full h-11 rounded-xl border-2 border-primarycolor/10 text-primarycolor font-black uppercase tracking-widest text-[10px] hover:bg-primarycolor/5 transition-all"
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
