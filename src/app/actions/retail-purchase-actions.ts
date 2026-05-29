"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";
import { createNotification } from "./notification-actions";

export async function getRetailPurchases() {
    try {
        const purchases = await (prisma as any).retail_purchases.findMany({
            where: { is_deleted: false },
            include: {
                items: {
                    include: {
                        edition: {
                            include: { books: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: purchases };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getRetailPurchaseById(id: number) {
    try {
        const purchase = await (prisma as any).retail_purchases.findUnique({
            where: { id },
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
        if (!purchase || purchase.is_deleted) return { success: false, error: "Not found" };
        return { success: true, data: purchase };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createRetailPurchase(data: {
    name?: string;
    date?: string;
    memo?: string;
    amountPaid?: number;
    items: { editionId: number; quantity: number; unitPrice: number }[];
}) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

        const purchase = await (prisma as any).retail_purchases.create({
            data: {
                name: data.name || null,
                date: data.date ? new Date(data.date) : new Date(),
                total_amount: totalAmount,
                amount_paid: data.amountPaid || 0,
                status: "PENDING",
                memo: data.memo || null,
                created_by: session.id,
                items: {
                    create: data.items.map(item => ({
                        edition_id: item.editionId,
                        quantity: item.quantity,
                        unit_price: item.unitPrice,
                    }))
                }
            },
            include: { items: { include: { edition: { include: { books: true } } } } }
        });

        await createNotification({
            title: `New Retail Purchase from ${data.name || "Anonymous"}`,
            message: `Retail purchase of ${totalAmount.toLocaleString()} ETB for ${data.items.length} item(s) has been created and is pending approval.`,
            details: JSON.stringify({
                purchaseId: purchase.id,
                customerName: data.name,
                totalAmount,
                status: "PENDING",
                itemCount: data.items.length,
            }),
            type: "RETAIL",
            notification_to: "ADMIN",
            notification_from: session?.name || "System",
        });

        revalidatePath("/admin_dashboard/retail_management", "layout");
        return { success: true, data: purchase };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getRetailEditionStockBreakdown(editionIds: number[]) {
    try {
        const editions = await (prisma as any).bookedition.findMany({
            where: {
                id: { in: editionIds },
                is_deleted: false,
            },
            include: {
                bookeditionstores: {
                    where: { is_deleted: false, quantity: { gt: 0 } },
                    include: { stores: true },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        const breakdown = editions.map((ed: any) => ({
            editionId: ed.id,
            editionName: ed.edition_name,
            price: ed.selling_price || 0,
            stores: ed.bookeditionstores.map((s: any) => ({
                storeStockId: s.id,
                storeId: s.storeId,
                storeName: s.stores.name,
                availableQty: s.quantity,
            })),
        }));

        return { success: true, data: breakdown };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function approveRetailPurchase(
    purchaseId: number,
    allocations: {
        editionId: number;
        storeStockId: number;
        storeId: number;
        quantity: number;
        unitPrice: number;
    }[]
) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const purchase = await (prisma as any).retail_purchases.findUnique({
            where: { id: purchaseId },
            include: { items: true }
        });

        if (!purchase) return { success: false, error: "Purchase not found" };
        if (purchase.status !== "PENDING") return { success: false, error: "Only pending purchases can be approved" };

        await (prisma as any).$transaction(async (tx: any) => {
            // Deduct inventory from bookeditionstores
            for (const alloc of allocations) {
                if (alloc.quantity <= 0) continue;
                const storeStock = await tx.bookeditionstores.findUnique({
                    where: { id: alloc.storeStockId },
                });
                if (!storeStock || (storeStock.quantity || 0) < alloc.quantity) {
                    throw new Error(`Insufficient stock at store for edition ${alloc.editionId}`);
                }
                await tx.bookeditionstores.update({
                    where: { id: alloc.storeStockId },
                    data: {
                        quantity: { decrement: alloc.quantity },
                        updatedAt: new Date(),
                    },
                });
            }

            // Mark purchase as approved
            await tx.retail_purchases.update({
                where: { id: purchaseId },
                data: { status: "APPROVED" },
            });
        });

        await createNotification({
            title: `Retail Purchase Approved #${purchaseId}`,
            message: `Retail purchase from ${purchase.name || "Anonymous"} for ${purchase.total_amount?.toLocaleString()} ETB has been approved.`,
            details: JSON.stringify({
                purchaseId: purchase.id,
                customerName: purchase.name,
                totalAmount: purchase.total_amount,
                status: "APPROVED",
            }),
            type: "RETAIL",
            notification_to: "ADMIN",
            notification_from: session?.name || "System",
        });

        await (prisma as any).activityLogs.create({
            data: {
                accountId: session.id,
                action: `Approved retail purchase #${purchaseId} for ${purchase.name || "Anonymous"} (${purchase.total_amount?.toLocaleString()} ETB)`,
                details: JSON.stringify({ purchaseId, customerName: purchase.name, totalAmount: purchase.total_amount }),
                updatedAt: new Date(),
            }
        });

        revalidatePath("/admin_dashboard/retail_management", "layout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateRetailPurchasePayment(
    purchaseId: number,
    data: { amount_paid: number; status?: "APPROVED" | "PARTIALLY_PAID" | "PAID" }
) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const purchase = await (prisma as any).retail_purchases.findUnique({
            where: { id: purchaseId },
        });
        if (!purchase || purchase.is_deleted) return { success: false, error: "Not found" };

        const updateData: any = { amount_paid: data.amount_paid };

        // Only allow status change for non-PENDING purchases
        if (data.status && purchase.status !== "PENDING") {
            updateData.status = data.status;
        }

        await (prisma as any).retail_purchases.update({
            where: { id: purchaseId },
            data: updateData,
        });

        revalidatePath("/admin_dashboard/retail_management", "layout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
