import prisma from "@/lib/prisma";
import WalkInCustomer from "./WalkInCustomer";

export default async function WalkInCustomerPage() {
  const purchases = await (prisma as any).retail_purchases.findMany({
    where: { is_deleted: false },
    include: {
      items: {
        include: {
          edition: {
            select: {
              id: true,
              edition_name: true,
              selling_price: true,
              books: { select: { id: true, title: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = JSON.parse(JSON.stringify(purchases));

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <WalkInCustomer initialPurchases={serialized} />
      </div>
    </div>
  );
}
