import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintOrderDetailClient from "./PrintOrderDetailClient";

export default async function PrintOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const orderId = parseInt(id);

    const [order, printers, editions, books] = await Promise.all([
        (prisma as any).printorder.findUnique({
            where: { id: orderId },
            include: {
                printer: true,
                printorder_items: {
                    include: {
                        bookedition: {
                            include: {
                                books: true
                            }
                        }
                    }
                },
                printorder_payments: {
                    orderBy: {
                        payment_date: 'asc'
                    }
                }
            }
        }),
        (prisma as any).printer.findMany({ where: { is_deleted: false } }),
        (prisma as any).bookedition.findMany({
            where: { is_deleted: false },
            include: {
                books: true,
                bookeditionprinters: {
                    where: { is_deleted: false },
                    take: 1
                }
            }
        }),
        (prisma as any).books.findMany({
            where: { is_deleted: false }
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
            books={books}
        />
    );
}
