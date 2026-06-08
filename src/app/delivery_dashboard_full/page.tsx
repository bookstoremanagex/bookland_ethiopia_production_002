import { ShoppingCart, CreditCard, UserRound, PackageOpen, Bell, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUnreadCount, getNotifications } from "../actions/notification-actions";

const buttons = [
  {
    label: "Create Orders",
    href: "/delivery_dashboard_full/create-orders",
    icon: ShoppingCart,
  },
  {
    label: "Payments",
    href: "/delivery_dashboard_full/payments",
    icon: CreditCard,
  },
  {
    label: "Walk in Customer",
    href: "/delivery_dashboard_full/walk-in-customer",
    icon: UserRound,
  },
  {
    label: "Orders",
    href: "/delivery_dashboard_full/orders",
    icon: PackageOpen,
  },
];

function formatRelativeTime(date: Date): string {
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
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function DeliveryDashboardHomePage() {
  const unreadRes = await getUnreadCount(undefined, "DELIVERY_AND_SALES");
  const unreadCount = unreadRes.success ? unreadRes.count : 0;

  const recentRes = await getNotifications(undefined, "DELIVERY_AND_SALES", 3);
  const recentNotifications = recentRes.success ? recentRes.data : [];

  return (
    <div className="min-h-full bg-white p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {buttons.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className="flex items-center justify-between w-full h-20 px-6 rounded-2xl bg-primarycolor shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <span className="font-black text-base uppercase tracking-widest text-white">
                {btn.label}
              </span>
              <btn.icon className="size-7 text-white/40" />
            </Link>
          ))}

          <Link
            href="/delivery_dashboard_full/notifications"
            className="flex items-center justify-between w-full h-20 px-6 rounded-2xl bg-primarycolor shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
          >
            <span className="font-black text-base uppercase tracking-widest text-white">
              Notifications{unreadCount > 0 && <span className="text-amber-300 ml-1.5">({unreadCount})</span>}
            </span>
            <Bell className="size-7 text-white/40" />
          </Link>
        </div>

        {recentNotifications.length > 0 && (
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
              {recentNotifications.map((n: any, i: number) => (
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
                    <span className="text-[10px] font-semibold text-slate-400">{formatRelativeTime(n.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
