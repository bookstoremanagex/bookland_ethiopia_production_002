import prisma from "@/lib/prisma";
import CreateOrdersClient from "@/components/deliver_full_dashboard_components/CreateOrdersClient";

export default async function CreateOrdersPage() {
  const shops = await (prisma as any).bookshopes.findMany({
    where: { is_deleted: false },
    include: {
      bookshopeditions: {
        where: { is_deleted: false },
        select: { remaining_amount: true },
      },
    },
  });

  const shopData = (shops as any[]).map((shop: any) => {
    const remaining = (shop.bookshopeditions || []).reduce(
      (sum: number, a: any) => sum + (a.remaining_amount || 0),
      0
    );
    return {
      id: shop.id,
      name: shop.name,
      branch: shop.branch || shop.location || "",
      remaining,
    };
  });

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <CreateOrdersClient shops={shopData} />
      </div>
    </div>
  );
}
