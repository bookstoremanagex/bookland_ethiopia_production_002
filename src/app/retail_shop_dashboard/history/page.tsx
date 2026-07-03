import { Clock, ShoppingCart } from "lucide-react";
import { getRetailOrders } from "../../actions/retail-actions";
import { HistoryClient } from "./HistoryClient";

export const dynamic = "force-dynamic";

export default async function RetailHistoryPage() {
  const res = await getRetailOrders();
  const orders = res.success ? res.data : [];
  const error = !res.success ? res.error : null;

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Order History
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              View past retail transactions
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
            <ShoppingCart className="size-4" />
            {orders.length} orders
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <HistoryClient orders={orders} />
      </div>
    </div>
  );
}
