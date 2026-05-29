import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ManagePaymentDetailClient from "./ManagePaymentDetailClient";

export default async function ManagePaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const shopId = parseInt(id);
    if (isNaN(shopId)) notFound();

    const shop = await (prisma as any).bookshopes.findFirst({
        where: { id: shopId, is_deleted: false },
        include: {
            orders: {
                where: { is_deleted: false }
            },
            payments: {
                where: { is_deleted: false },
                include: { check: true },
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!shop) notFound();

    const totalDebt = shop.orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const orderPaid = shop.orders.reduce((sum: number, o: any) => sum + (o.amount_paid || 0), 0);
    const paymentPaid = shop.payments.filter((p: any) => p.status === "APPROVED").reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const totalPaid = orderPaid + paymentPaid;
    const totalRemaining = totalDebt - totalPaid;

    return (
        <ManagePaymentDetailClient
            shop={{
                id: shop.id,
                name: shop.name,
                location: shop.location,
                phone: shop.phone || "",
                email: shop.email || "",
                branch: shop.branch || "",
                createdAt: shop.createdAt,
            }}
            payments={shop.payments.map((p: any) => ({
                id: p.id,
                amount: p.amount,
                payment_type: p.payment_type,
                status: p.status,
                checkId: p.checkId,
                check: p.check ? {
                    id: p.check.id,
                    bankname: p.check.bankname,
                    username: p.check.username,
                    status: p.check.status,
                    type: p.check.type,
                    amount: p.check.amount,
                    recordeddate: p.check.recordeddate,
                    memo: p.check.memo,
                    imageUrl: p.check.imageUrl,
                } : null,
                createdAt: p.createdAt,
            }))}
            totals={{ totalDebt, totalPaid, totalRemaining }}
        />
    );
}
