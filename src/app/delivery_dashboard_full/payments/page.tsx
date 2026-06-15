import prisma from "@/lib/prisma";
import PaymentsTable from "@/components/deliver_full_dashboard_components/PaymentsTable";

export default async function PaymentsPage() {
  const shops = await (prisma as any).bookshopes.findMany({
    where: { is_deleted: false },
    include: {
      orders: {
        where: { is_deleted: false },
        select: { total_amount: true, amount_paid: true },
      },
      payments: {
        where: { is_deleted: false },
        include: { check: true },
      },
    },
  });

  const shopData = (shops as any[]).map((shop: any) => {
    const previousDebt = shop.previousDebt || 0;
    const totalDebt = (shop.orders || []).reduce(
      (sum: number, o: any) => sum + (o.total_amount || 0),
      0
    ) + previousDebt;
    const totalPaid = (shop.payments || [])
      .filter((p: any) => p.status === "APPROVED")
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const deliveredCheckAmount = (shop.payments || [])
      .filter((p: any) => p.payment_type === "CHECK" && p.check?.status === "DELIVERED")
      .reduce((sum: number, p: any) => sum + (parseFloat(p.check?.amount || "0") || 0), 0);
    return {
      id: shop.id,
      name: shop.name,
      branch: shop.branch || shop.location || "",
      remaining: totalDebt - totalPaid,
      deliveredCheckAmount,
    };
  });

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <PaymentsTable data={shopData} />
      </div>
    </div>
  );
}
