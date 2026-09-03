import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DebtBreakdownClient from "./DebtBreakdownClient";

export const dynamic = "force-dynamic";

export default async function DebtBreakdownPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const shopId = parseInt(id);
    if (isNaN(shopId)) notFound();

    const shop = await (prisma as any).bookshopes.findFirst({
        where: { id: shopId, is_deleted: false },
        include: {
            orders: {
                where: { is_deleted: false },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    order_type: true,
                    total_amount: true,
                    amount_paid: true,
                    status: true,
                    is_approved: true,
                    createdAt: true,
                },
            },
            payments: {
                where: { is_deleted: false },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    amount: true,
                    payment_type: true,
                    status: true,
                    createdAt: true,
                    orderid: true,
                    memo: true,
                    check: {
                        select: { id: true, bankname: true, username: true, amount: true, status: true },
                    },
                },
            },
        },
    });
    if (!shop) notFound();

    const roundRecords = await (prisma as any).roundrecords.findMany({
        where: { bookshop_id: shopId, is_deleted: false },
        include: {
            RoundBooks: {
                include: {
                    book: { select: { id: true, title: true, author: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const allRoundPayments = await (prisma as any).round_payments.findMany({
        where: { shopId: shopId, is_deleted: false },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            amount: true,
            payment_type: true,
            status: true,
            createdAt: true,
            memo: true,
            check: {
                select: { id: true, bankname: true, username: true, amount: true, status: true },
            },
            roundrecord: {
                include: {
                    RoundBooks: {
                        include: { book: { select: { id: true, title: true } } },
                    },
                },
            },
        },
    });

    return (
        <DebtBreakdownClient
            shopId={shop.id}
            shopName={shop.name}
            orders={shop.orders}
            payments={shop.payments}
            roundRecords={roundRecords}
            roundPayments={allRoundPayments}
        />
    );
}
