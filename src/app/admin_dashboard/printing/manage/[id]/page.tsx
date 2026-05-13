import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintOrderDetailClient from "./PrintOrderDetailClient";

export default async function PrintOrderDetailPage({ params }: { params: { id: string } }) {
    const orderId = parseInt(params.id);

    const [order, printers, editions] = await Promise.all([
        (prisma as any).printorder.findUnique({
            where: { id: orderId },
            include: {
                printer: true
            }
        }),
        (prisma as any).printer.findMany({ where: { is_deleted: false } }),
        (prisma as any).bookedition.findMany({
            where: { is_deleted: false },
            include: { books: true }
        })
    ]);

    if (!order || order.is_deleted) {
        notFound();
    }

    return (
        <PrintOrderDetailClient
            order={order}
            printers={printers}
            editions={editions}
        />
    );
}
