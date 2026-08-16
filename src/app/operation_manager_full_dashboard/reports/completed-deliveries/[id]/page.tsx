import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeliveryReceiptClient from "./DeliveryReceiptClient";

export default async function DeliveryReceiptPage({ params }: { params: Promise<{ id: string }> }) {
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
        <DeliveryReceiptClient delivery={delivery} />
    );
}
