import { BookOpen, Layers, ShoppingCart, DollarSign } from "lucide-react";
import Link from "next/link";
import { getRetailStats } from "../actions/retail-actions";

export default async function RetailShopHomePage() {
  const statsRes = await getRetailStats();
  const stats = statsRes.success ? statsRes.data : null;

  const cards = [
    {
      label: "Total Books",
      value: stats?.bookCount ?? 0,
      icon: BookOpen,
      href: "/retail_shop_dashboard/books",
      color: "bg-blue-500",
    },
    {
      label: "Editions",
      value: stats?.editionCount ?? 0,
      icon: Layers,
      href: "/retail_shop_dashboard/books",
      color: "bg-purple-500",
    },
    {
      label: "Orders",
      value: stats?.orderCount ?? 0,
      icon: ShoppingCart,
      href: "/retail_shop_dashboard/orders",
      color: "bg-emerald-500",
    },
    {
      label: "Revenue",
      value: `ETB ${(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      href: "/retail_shop_dashboard/history",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Retail Dashboard
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Overview of your retail shop
          </p>
        </div>

        {/* Action buttons — top on mobile, below stats on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 order-first sm:order-last">
          <Link
            href="/retail_shop_dashboard/orders"
            className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-primarycolor/5 to-transparent p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primarycolor flex items-center justify-center shadow-lg shadow-primarycolor/20">
                <ShoppingCart className="size-7 text-white" />
              </div>
              <div>
                <p className="font-black text-lg text-slate-800 uppercase tracking-tight">
                  New Order
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Create a retail sale
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/retail_shop_dashboard/books"
            className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-primarycolor/5 to-transparent p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primarycolor flex items-center justify-center shadow-lg shadow-primarycolor/20">
                <BookOpen className="size-7 text-white" />
              </div>
              <div>
                <p className="font-black text-lg text-slate-800 uppercase tracking-tight">
                  Browse Books
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  View available inventory
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats — below buttons on mobile, above buttons on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 order-last sm:order-first">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`size-10 rounded-xl ${card.color} flex items-center justify-center shadow-lg shadow-${card.color}/20`}>
                  <card.icon className="size-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {card.value}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                {card.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
