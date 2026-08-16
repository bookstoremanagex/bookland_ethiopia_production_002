import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PendingDeliveryDetailClient from "./PendingDeliveryDetailClient";

export default async function PendingDeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const deliveryId = parseInt(id);

    const delivery = await (prisma as any).bookshopeditions.findUnique({
        where: { id: deliveryId },
        include: {
            bookshopes: true,
            bookedition: {
                include: {
                    books: true
                }
            }
        }
    });

    if (!delivery || delivery.is_deleted) {
        notFound();
    }

    return (
        <PendingDeliveryDetailClient delivery={delivery} />
    );
}
