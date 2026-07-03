"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin_dashboard/retail-shop", label: "Overview" },
  { href: "/admin_dashboard/retail-shop/books", label: "Books" },
];

export function RetailShopTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-slate-200">
      {tabs.map((tab) => {
        const active = pathname === tab.href || (tab.href !== "/admin_dashboard/retail-shop" && pathname.startsWith(tab.href + "/"));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all",
              active
                ? "text-primarycolor border-primarycolor"
                : "text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-300"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
