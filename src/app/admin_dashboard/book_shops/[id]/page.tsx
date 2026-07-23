import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentSession } from "@/app/actions/auth-actions";
import ShopProfileContent from "./ShopProfileContent";

export default async function ShopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  const shopId = Number(id);
  const shop = await (prisma as any).bookshopes.findUnique({
    where: { id: shopId },
    include: {
      bookshopeditions: {
        where: { is_deleted: false },
        include: {
          bookedition: {
            include: {
              books: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      orders: {
        where: { is_deleted: false },
        include: {
          order_items: {
            include: {
              bookedition: {
                include: {
                  books: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!shop || shop.is_deleted) {
    return notFound();
  }

  const roundRecords = await (prisma as any).roundrecords.findMany({
    where: { bookshop_id: shopId, is_deleted: false },
    include: {
      round_payments: {
        where: { is_deleted: false, status: "APPROVED" },
        select: { amount: true },
      },
    },
  });

  const prevDebtPayments = await (prisma as any).payments.findMany({
    where: { shopId: shopId, is_deleted: false, is_for_previous_debts: true, status: "APPROVED" },
    select: { amount: true },
  });

  let orderDebtTotal = 0;
  let roundDebt = 0;
  const requestedOrders = (shop.orders || []).filter((o: any) => o.order_type === "requested");
  const lastRequestedOrder = [...requestedOrders].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  for (const order of shop.orders || []) {
    const unpaid = (order.total_amount || 0) - (order.amount_paid || 0);
    if (unpaid <= 0) continue;
    if (order.order_type === "requested" && order.is_approved) {
      orderDebtTotal += unpaid;
    } else if (order.order_type === "on round") {
      roundDebt += unpaid;
    }
  }

  for (const record of roundRecords || []) {
    const paid = (record.round_payments || []).reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const remaining = (record.totalprice || 0) - paid;
    if (remaining > 0) roundDebt += remaining;
  }

  const lastOrderDebt = lastRequestedOrder
    ? Math.max(0, (lastRequestedOrder.total_amount || 0) - (lastRequestedOrder.amount_paid || 0))
    : 0;
  const lastIncludedInOrderDebt = lastRequestedOrder?.is_approved && lastOrderDebt > 0;
  const orderDebt = Math.max(0, orderDebtTotal - (lastIncludedInOrderDebt ? lastOrderDebt : 0));

  const previousDebtAmount = shop.previousDebt || 0;
  const approvedPrevPaid = prevDebtPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const previousDebtRemaining = Math.max(0, previousDebtAmount - approvedPrevPaid);

  const totalDebt = Math.max(0, orderDebt + roundDebt + previousDebtRemaining + lastOrderDebt);

  return <ShopProfileContent shop={shop} userRole={session?.role ?? null} totalDebt={totalDebt} />;
}
