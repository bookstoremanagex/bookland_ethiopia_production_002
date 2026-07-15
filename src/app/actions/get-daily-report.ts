"use server";

import prisma from "@/lib/prisma";

export async function getDailyReportData(isoDate: string) {
    const date = new Date(isoDate + "T00:00:00");
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    const [orders, payments, roundRecords] = await Promise.all([
        prisma.orders.findMany({
            where: { createdAt: { gte: startOfDay, lte: endOfDay } },
            include: { order_items: true },
        }),
        prisma.payments.findMany({
            where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        }),
        prisma.roundrecords.findMany({
            where: { createdAt: { gte: startOfDay, lte: endOfDay } },
            include: {
                RoundBooks: true,
                round_payments: {
                    where: { status: "APPROVED" },
                },
            },
        }),
    ]);

    const totalRoundPaid = roundRecords.reduce((sum, r) =>
        sum + r.round_payments.reduce((s, p) => s + (p.amount || 0), 0), 0);

    return {
        ordersCount: orders.length,
        totalSoldAmount: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
        totalPaidAmount: orders.reduce((sum, o) => sum + (o.amount_paid || 0), 0),
        totalBooksOrdered: orders.reduce((sum, o) =>
            sum + o.order_items.reduce((s, i) => s + (i.quantity || 0), 0), 0),
        shopsInOrders: new Set(orders.map(o => o.bookShopId)).size,
        paymentsCount: payments.length,
        approvedPaymentsCount: payments.filter(p => p.status === "APPROVED").length,
        totalApprovedAmount: payments.filter(p => p.status === "APPROVED").reduce((sum, p) => sum + (p.amount || 0), 0),
        roundsCount: roundRecords.length,
        shopsInRounds: new Set(roundRecords.map(r => r.bookshop_id)).size,
        totalBooksInRounds: roundRecords.reduce((sum, r) =>
            sum + (r.RoundBooks?.starting_amount || 0), 0),
        totalRoundRevenue: roundRecords.reduce((sum, r) =>
            sum + (r.totalprice || 0), 0),
        totalRoundRemaining: roundRecords.reduce((sum, r) =>
            sum + ((r.totalprice || 0) - r.round_payments.reduce((s, p) => s + (p.amount || 0), 0)), 0),
    };
}
