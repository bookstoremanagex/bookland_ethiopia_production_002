import { ShoppingCart, CreditCard, UserRound, PackageOpen, BadgeDollarSign } from "lucide-react";
import Link from "next/link";
import { getNotifications } from "../actions/notification-actions";
import RecentNotifications from "./RecentNotifications";

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

export default async function DeliveryDashboardHomePage() {
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
            href="/delivery_dashboard_full/payments-due"
            className="flex items-center justify-between w-full h-20 px-6 rounded-2xl bg-primarycolor shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
          >
            <span className="font-black text-base uppercase tracking-widest text-white">
              Payments Due
            </span>
            <BadgeDollarSign className="size-7 text-white/40" />
          </Link>
        </div>

        <RecentNotifications notifications={recentNotifications} />
      </div>
    </div>
  );
}
