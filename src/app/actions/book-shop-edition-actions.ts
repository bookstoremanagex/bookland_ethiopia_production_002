"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function addEditionToBookShop(data: { 
    bookShopId: number, 
    bookEditionId: number, 
    quantity: number, 
    price_per_peice?: number,
    memo?: string,
    already_paid?: number
}) {
    try {
        const pricePerPiece = data.price_per_peice || 0;
        const totalPrice = pricePerPiece * data.quantity;
        const alreadyPaid = data.already_paid || 0;
        const remainingAmount = totalPrice - alreadyPaid;

        const record = await (prisma as any).bookshopeditions.create({
            data: {
                bookShopId: data.bookShopId,
                bookEditionId: data.bookEditionId,
                quantity: data.quantity,
                price_per_peice: pricePerPiece,
                total_price: totalPrice,
                memo: data.memo,
                already_paid: alreadyPaid,
                remaining_amount: remainingAmount,
                updatedAt: new Date()
            }
        });

        revalidatePath(`/admin_dashboard/books`);
        return { success: true, data: record };
    } catch (error) {
        console.error("Failed to add edition to book shop:", error);
        return { success: false, error: "Failed to add to shop" };
    }
}

export async function updateBookShopEdition(id: number, data: any) {
    try {
        // Fetch existing record to handle partial updates and derived fields
        const current = await (prisma as any).bookshopeditions.findUnique({
            where: { id }
        });

        if (!current) {
            return { success: false, error: "Record not found" };
        }

        const quantity = data.quantity !== undefined ? Number(data.quantity) : current.quantity;
        const pricePerPiece = data.price_per_peice !== undefined ? Number(data.price_per_peice) : current.price_per_peice || 0;
        const alreadyPaid = data.already_paid !== undefined ? Number(data.already_paid) : current.already_paid || 0;
        
        const totalPrice = pricePerPiece * quantity;
        const remainingAmount = totalPrice - alreadyPaid;

        const updated = await (prisma as any).bookshopeditions.update({
            where: { id },
            data: {
                quantity: quantity,
                price_per_peice: pricePerPiece,
                total_price: totalPrice,
                memo: data.memo !== undefined ? data.memo : current.memo,
                already_paid: alreadyPaid,
                remaining_amount: remainingAmount,
                updatedAt: new Date()
            }
        });
        
        revalidatePath(`/admin_dashboard/books`);
        // Also revalidate the specific shop assignment page if possible, or just the book page
        return { success: true, data: updated };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, error: "Failed to update record" };
    }
}

export async function deleteBookShopEdition(id: number) {
    try {
        await (prisma as any).bookshopeditions.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() }
        });
        revalidatePath(`/admin_dashboard/books`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete record" };
    }
}
