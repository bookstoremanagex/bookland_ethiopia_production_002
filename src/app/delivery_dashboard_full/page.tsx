import { ShoppingCart, CreditCard, UserRound, PackageOpen } from "lucide-react";
import Link from "next/link";

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

export default function DeliveryDashboardHomePage() {
  return (
    <div className="min-h-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto grid grid-cols-1 gap-4">
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
      </div>
    </div>
  );
}
