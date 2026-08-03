import { getAllShopsDebt } from "@/app/actions/order-actions";
import CreateOrdersClient from "@/components/deliver_full_dashboard_components/CreateOrdersClient";

export default async function CreateOrdersPage() {
  const res = await getAllShopsDebt();

  const shopData = (res.success ? res.data || [] : []).map((shop) => ({
    id: shop.id,
    name: shop.name,
    branch: shop.branch,
    remaining: shop.totalDebt,
  }));

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <CreateOrdersClient shops={shopData} />
      </div>
    </div>
  );
}
