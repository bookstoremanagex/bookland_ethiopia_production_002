import {
  ShoppingCart,
  BadgeDollarSign,
  Clock,
  Store,
  Printer,
  Repeat,
  ShoppingBag,
  Banknote,
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
    label: "Payments Due",
    href: "/admin_dashboard/finance/payments-due",
    icon: Banknote,
    color: "bg-orange-50 text-orange-700",
    badge: () => null,
  },
  {
    label: "Check Dates",
    href: "/admin_dashboard/checks/dates",
    icon: Clock,
    color: "bg-amber-50 text-amber-700",
    badge: () => null,
  },
  {
    label: "Store Options",
    href: "/admin_dashboard/stores/options",
    icon: Store,
    color: "bg-emerald-50 text-emerald-700",
    badge: () => null,
  },
  {
    label: "Manage Printing",
    href: "/admin_dashboard/printing/manage",
    icon: Printer,
    color: "bg-purple-50 text-purple-700",
    badge: () => null,
  },
  {
    label: "Manage Rounds",
    href: "/admin_dashboard/round-books",
    icon: Repeat,
    color: "bg-blue-50 text-blue-700",
    badge: () => null,
  },
  {
    label: "Book Shops",
    href: "/admin_dashboard/book_shops",
    icon: ShoppingBag,
    color: "bg-rose-50 text-rose-700",
    badge: () => null,
  },
];

export function QuickActions({ pendingOrders, pendingPayments }: QuickActionsProps) {
  const props = { pendingOrders, pendingPayments };

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-white p-4 gradient-shadow sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor" aria-hidden />
      <h2 className="mb-4 px-1 text-base font-semibold tracking-tight text-slate-900">
        Quick <span className="bg-gradient-to-r from-primarycolor to-secondarycolor bg-clip-text text-transparent">Actions</span>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const badgeValue = action.badge(props);
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group relative flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-4 text-center gradient-shadow-inset transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-br hover:from-primarycolor hover:to-secondarycolor hover:gradient-shadow-hover"
            >
              {badgeValue != null && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-primarycolor text-white text-[9px] font-black flex items-center justify-center shadow-sm transition-colors duration-300 group-hover:bg-white group-hover:text-primarycolor">
                  {badgeValue}
                </span>
              )}
              <div className={`size-10 rounded-xl flex items-center justify-center ${action.color} transition-all duration-300 group-hover:bg-white/20`}>
                <action.icon className="size-5 transition-colors duration-300 group-hover:text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-700 transition-colors duration-300 group-hover:text-white">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
