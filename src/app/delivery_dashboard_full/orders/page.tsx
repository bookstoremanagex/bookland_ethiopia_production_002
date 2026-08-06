import prisma from "@/lib/prisma";
import OrdersList from "./OrdersList";

export default async function OrdersPage() {
  const orders = await (prisma as any).orders.findMany({
    where: { is_deleted: false },
    include: {
      bookshopes: { select: { id: true, name: true, location: true, branch: true } },
      locked_editions: { where: { is_deleted: false } },
      order_items: {
        select: {
          id: true, bookEditionId: true, quantity: true, price_at_order: true,
          bookedition: {
            select: {
              edition_name: true,
              bookId: true,
              books: { select: { title: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" as const },
  });

  const mappedOrders = orders.map((o: any) => ({
    ...o,
    hide_remaining: o.hide_remaining ?? false,
  }));

  const payments = await (prisma as any).payments.findMany({
    where: { is_deleted: false, status: "APPROVED" },
    select: {
      id: true, amount: true, orderid: true, payment_type: true, createdAt: true,
      shopId: true, status: true,
    },
    orderBy: { createdAt: "desc" as const },
  });

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <OrdersList orders={mappedOrders as any} payments={payments as any} />
      </div>
    </div>
  );
}
