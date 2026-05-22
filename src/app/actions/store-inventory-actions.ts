"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllStores() {
    try {
        const stores = await (prisma as any).stores.findMany({
            where: { is_deleted: false },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: stores };
    } catch (error) {
        return { success: false, error: "Failed to fetch stores" };
    }
}

export async function assignEditionToStore(data: { editionId: number, storeId: number, quantity: number }) {
    try {
        // Check if already assigned
        const existing = await (prisma as any).bookeditionstores.findFirst({
            where: {
                editionId: data.editionId,
                storeId: data.storeId,
                is_deleted: false
            }
        });

        if (existing) {
            return { success: false, error: "This edition is already assigned to this store. Please update the quantity instead." };
        }

        // Validate against remaining for transfer
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: data.editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);
        if (data.quantity > remaining) {
            return { success: false, error: `Cannot assign ${data.quantity} units. Only ${remaining} remaining for transfer.` };
        }
        if (data.quantity < 0) {
            return { success: false, error: "Quantity cannot be negative." };
        }

        // Create assignment and deduct from remaining in a transaction
        const [assignment] = await (prisma as any).$transaction([
            (prisma as any).bookeditionstores.create({
                data: {
                    editionId: data.editionId,
                    storeId: data.storeId,
                    quantity: data.quantity,
                    updatedAt: new Date()
                },
                include: { stores: true }
            }),
            (prisma as any).bookedition.update({
                where: { id: data.editionId },
                data: { count_remening_for_transfer: remaining - data.quantity }
            })
        ]);

        const newRemaining = remaining - data.quantity;
        revalidatePath(`/admin_dashboard/books/editions/${data.editionId}`);
        return { success: true, data: assignment, newRemaining };
    } catch (error) {
        console.error("Failed to assign edition to store:", error);
        return { success: false, error: "Failed to assign edition to store" };
    }
}

export async function updateStoreInventory(id: number, quantity: number, editionId: number) {
    try {
        // Get the current store inventory record
        const current = await (prisma as any).bookeditionstores.findUnique({ where: { id } });
        if (!current) return { success: false, error: "Store inventory record not found" };

        const oldQuantity = Number(current.quantity || 0);
        const diff = quantity - oldQuantity; // positive = increase, negative = decrease

        // Get the edition to check remaining
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);

        if (diff > 0 && diff > remaining) {
            return { success: false, error: `Cannot increase by ${diff}. Only ${remaining} remaining for transfer.` };
        }
        if (quantity < 0) {
            return { success: false, error: "Quantity cannot be negative." };
        }

        // Update store quantity and edition remaining in a transaction
        const [updated] = await (prisma as any).$transaction([
            (prisma as any).bookeditionstores.update({
                where: { id },
                data: { quantity, updatedAt: new Date() },
                include: { stores: true }
            }),
            (prisma as any).bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: remaining - diff }
            })
        ]);

        const newRemaining = remaining - diff;
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true, data: updated, newRemaining };
    } catch (error) {
        return { success: false, error: "Failed to update inventory" };
    }
}

export async function deleteStoreInventory(id: number, editionId: number) {
    try {
        // Get the current record to know how much to return
        const current = await (prisma as any).bookeditionstores.findUnique({ where: { id } });
        if (!current) return { success: false, error: "Store inventory record not found" };

        const quantityToReturn = Number(current.quantity || 0);

        // Get the edition remaining
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);

        // Soft delete and return quantity to remaining in a transaction
        await (prisma as any).$transaction([
            (prisma as any).bookeditionstores.update({
                where: { id },
                data: { is_deleted: true, updatedAt: new Date() }
            }),
            (prisma as any).bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: remaining + quantityToReturn }
            })
        ]);

        const newRemaining = remaining + quantityToReturn;
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true, newRemaining };
    } catch (error) {
        return { success: false, error: "Failed to remove from store" };
    }
}
