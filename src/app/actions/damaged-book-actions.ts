"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDamagedBooks() {
    try {
        const damagedBooks = await (prisma as any).damagedbooks.findMany({
            where: { is_deleted: false },
            include: {
                books: true,
                bookedition: true,
                stores: true,
                accounts: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: damagedBooks };
    } catch (error) {
        console.error("Failed to fetch damaged books:", error);
        return { success: false, error: "Failed to fetch damaged books" };
    }
}

export async function getDamagedBookById(id: number) {
    try {
        const damagedBook = await (prisma as any).damagedbooks.findUnique({
            where: { id },
            include: {
                books: true,
                bookedition: true,
                stores: true,
                accounts: true
            }
        });
        if (!damagedBook || damagedBook.is_deleted) return { success: false, error: "Report not found" };
        return { success: true, data: damagedBook };
    } catch (error) {
        return { success: false, error: "Failed to fetch report" };
    }
}

export async function createDamagedBookReport(data: any) {
    try {
        const report = await (prisma as any).damagedbooks.create({
            data: {
                type: data.type,
                book_id: parseInt(data.book_id),
                edition_id: parseInt(data.edition_id),
                store_id: data.store_id ? parseInt(data.store_id) : null,
                count: parseInt(data.count),
                memo: data.memo,
                updatedAt: new Date()
                // In a real app, you'd get the account ID from the session
                // account_id: data.account_id 
            }
        });
        revalidatePath("/admin_dashboard/books/damaged");
        return { success: true, data: report };
    } catch (error) {
        console.error("Failed to create damage report:", error);
        return { success: false, error: "Failed to create damage report" };
    }
}

export async function updateDamagedBookReport(id: number, data: any) {
    try {
        const updated = await (prisma as any).damagedbooks.update({
            where: { id },
            data: {
                type: data.type,
                book_id: parseInt(data.book_id),
                edition_id: parseInt(data.edition_id),
                store_id: data.store_id ? parseInt(data.store_id) : null,
                count: parseInt(data.count),
                memo: data.memo,
                updatedAt: new Date()
            }
        });
        revalidatePath("/admin_dashboard/books/damaged");
        revalidatePath(`/admin_dashboard/books/damaged/${id}`);
        return { success: true, data: updated };
    } catch (error) {
        return { success: false, error: "Failed to update report" };
    }
}

export async function deleteDamagedBookReport(id: number) {
    try {
        await (prisma as any).damagedbooks.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() }
        });
        revalidatePath("/admin_dashboard/books/damaged");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete report" };
    }
}
