import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentDetail from "./PaymentDetail";

export default async function ShopPaymentDetailPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const parsedShopId = parseInt(shopId);
  if (isNaN(parsedShopId)) notFound();

  const shop = await (prisma as any).bookshopes.findFirst({
    where: { id: parsedShopId, is_deleted: false },
    include: {
      bookshopeditions: {
        where: { is_deleted: false },
        select: { remaining_amount: true },
      },
      payments: {
        where: { is_deleted: false },
        include: { check: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shop) notFound();

  const remaining = (shop.bookshopeditions || []).reduce(
    (sum: number, a: any) => sum + (a.remaining_amount || 0),
    0
  );

  const serialized = JSON.parse(
    JSON.stringify({
      id: shop.id,
      name: shop.name,
      branch: shop.branch || shop.location || "",
      remaining,
      payments: shop.payments,
    })
  );

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PaymentDetail shop={serialized} />
      </div>
    </div>
  );
}
