import {
  ShoppingCart,
  BadgeDollarSign,
  Store,
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  pendingOrders?: number;
  pendingPayments?: number;
}

const actions = [
  {
    label: "Manage Orders",
    href: "/admin_dashboard/manage_orders",
    icon: ShoppingCart,
    color: "bg-primarycolor/10 text-primarycolor",
    badge: (props: QuickActionsProps) => props.pendingOrders,
  },
  {
    label: "Manage Payments",
    href: "/admin_dashboard/manage_payment",
    icon: BadgeDollarSign,
    color: "bg-secondarycolor/10 text-secondarycolor",
    badge: (props: QuickActionsProps) => props.pendingPayments,
  },
  {
    label: "Stores",
    href: "/admin_dashboard/stores",
    icon: Store,
    color: "bg-blue-50 text-blue-700",
    badge: () => null,
  },
];

export function QuickActions({ pendingOrders, pendingPayments }: QuickActionsProps) {
  const props = { pendingOrders, pendingPayments };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6">
      <h2 className="text-base font-semibold tracking-tight text-slate-900 mb-4 px-1">
        Quick Actions
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => {
          const badgeValue = action.badge(props);
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group relative flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center transition-all hover:border-primarycolor/20 hover:shadow-sm hover:-translate-y-0.5"
            >
              {badgeValue != null && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-primarycolor text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                  {badgeValue}
                </span>
              )}
              <div className={`size-10 rounded-xl flex items-center justify-center ${action.color} transition-colors`}>
                <action.icon className="size-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-primarycolor transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
