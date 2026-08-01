"use client";

import { Bell, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCalendar } from "@/lib/calendar-context";

function formatRelativeTime(date: Date, formatShort: (date: Date) => string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatShort(new Date(date));
}

export default function RecentNotifications({ notifications }: { notifications: any[] }) {
  const { formatShort } = useCalendar();

  if (notifications.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-amber-500" />
          <span className="text-sm font-bold text-slate-700">Recent Notifications</span>
        </div>
        <Link
          href="/delivery_dashboard_full/notifications"
          className="text-xs font-semibold text-amber-600 flex items-center gap-1"
        >
          View All <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {notifications.map((n: any) => (
          <Link
            key={n.id}
            href="/delivery_dashboard_full/notifications"
            className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-all"
          >
            <div className={`size-2.5 rounded-full mt-1.5 shrink-0 ${n.is_read ? "bg-slate-300" : "bg-amber-500"}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-tight truncate ${n.is_read ? "font-semibold text-slate-500" : "font-bold text-slate-800"}`}>
                {n.title || "Notification"}
              </p>
              {n.message && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{n.message}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock className="size-3 text-slate-300" />
              <span className="text-[10px] font-semibold text-slate-400">{formatRelativeTime(n.createdAt, formatShort)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
