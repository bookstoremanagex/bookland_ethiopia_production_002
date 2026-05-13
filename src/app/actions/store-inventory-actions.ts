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

        const assignment = await (prisma as any).bookeditionstores.create({
            data: {
                editionId: data.editionId,
                storeId: data.storeId,
                quantity: data.quantity,
                updatedAt: new Date()
            },
            include: { stores: true }
        });

        revalidatePath(`/admin_dashboard/books/editions/${data.editionId}`);
        return { success: true, data: assignment };
    } catch (error) {
        console.error("Failed to assign edition to store:", error);
        return { success: false, error: "Failed to assign edition to store" };
    }
}

export async function updateStoreInventory(id: number, quantity: number, editionId: number) {
    try {
        const updated = await (prisma as any).bookeditionstores.update({
            where: { id },
            data: { quantity, updatedAt: new Date() },
            include: { stores: true }
        });
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true, data: updated };
    } catch (error) {
        return { success: false, error: "Failed to update inventory" };
    }
}

export async function deleteStoreInventory(id: number, editionId: number) {
    try {
        await (prisma as any).bookeditionstores.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() }
        });
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to remove from store" };
    }
}
