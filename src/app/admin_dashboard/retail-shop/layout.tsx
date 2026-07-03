import { Store } from "lucide-react";
import { RetailShopTabs } from "./RetailShopTabs";

export const dynamic = "force-dynamic";

export default function RetailShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Store className="size-6 text-primarycolor" />
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Retail Shop
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              Retail shop management and monitoring
            </p>
          </div>
        </div>

        <RetailShopTabs />

        {children}
      </div>
    </div>
  );
}
