import prisma from "@/lib/prisma";
import PaymentsTable from "@/components/deliver_full_dashboard_components/PaymentsTable";

export default async function PaymentsPage() {
  const shops = await (prisma as any).bookshopes.findMany({
    where: { is_deleted: false },
    include: {
      orders: {
        where: { is_deleted: false },
        select: { id: true, total_amount: true, amount_paid: true, order_type: true, is_approved: true, createdAt: true },
      },
      payments: {
        where: { is_deleted: false },
        select: { amount: true, status: true, is_for_previous_debts: true },
      },
    },
  });

  const roundRecordsAll = await (prisma as any).roundrecords.findMany({
    where: { is_deleted: false },
    include: {
      round_payments: {
        where: { is_deleted: false, status: "APPROVED" },
        select: { amount: true },
      },
    },
  });

  const shopData = (shops as any[]).map((shop: any) => {
    const shopRoundRecords = roundRecordsAll.filter((r: any) => r.bookshop_id === shop.id);

    const requestedOrders = (shop.orders || []).filter((o: any) => o.order_type === "requested");
    const lastRequestedOrder = [...requestedOrders].sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    let orderDebtUnpaid = 0;
    let roundDebt = 0;

    for (const order of shop.orders || []) {
      const unpaid = (order.total_amount || 0) - (order.amount_paid || 0);
      if (unpaid <= 0) continue;
      if (order.order_type === "requested" && order.is_approved) {
        orderDebtUnpaid += unpaid;
      } else if (order.order_type === "on round") {
        roundDebt += unpaid;
      }
    }

    for (const record of shopRoundRecords) {
      const paid = (record.round_payments || []).reduce((s: number, p: any) => s + (p.amount || 0), 0);
      const remaining = (record.totalprice || 0) - paid;
      if (remaining > 0) roundDebt += remaining;
    }

    const lastOrderDebt = lastRequestedOrder
      ? Math.max(0, (lastRequestedOrder.total_amount || 0) - (lastRequestedOrder.amount_paid || 0))
      : 0;
    const lastIncludedInOrderDebt = lastRequestedOrder?.is_approved && lastOrderDebt > 0;
    const orderDebt = Math.max(0, orderDebtUnpaid - (lastIncludedInOrderDebt ? lastOrderDebt : 0));

    const previousDebtAmount = shop.previousDebt || 0;
    const approvedPrevPayments = (shop.payments || []).filter(
      (p: any) => p.is_for_previous_debts && p.status === "APPROVED"
    );
    const approvedPrevPaid = approvedPrevPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const previousDebtRemaining = Math.max(0, previousDebtAmount - approvedPrevPaid);

    const totalDebt = Math.max(0, orderDebt + roundDebt + previousDebtRemaining + lastOrderDebt);

    return {
      id: shop.id,
      name: shop.name,
      branch: shop.branch || shop.location || "",
      remaining: totalDebt,
    };
  }).sort((a: any, b: any) => b.remaining - a.remaining);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <PaymentsTable data={shopData} />
      </div>
    </div>
  );
}
