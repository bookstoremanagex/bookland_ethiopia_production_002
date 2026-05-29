import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import RetailPurchaseDetailClient from "./RetailPurchaseDetailClient";

export default async function RetailPurchaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const purchaseId = parseInt(id);
    if (isNaN(purchaseId)) notFound();

    const purchase = await (prisma as any).retail_purchases.findUnique({
        where: { id: purchaseId },
        include: {
            items: {
                include: {
                    edition: {
                        include: { books: true }
                    }
                }
            }
        }
    });

    if (!purchase || purchase.is_deleted) notFound();

    return <RetailPurchaseDetailClient purchase={purchase} />;
}
