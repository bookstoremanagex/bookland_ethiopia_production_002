"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBookShops() {
    try {
        const shops = await (prisma as any).bookshopes.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: shops };
    } catch (error) {
        return { success: false, error: "Failed to fetch book shops" };
    }
}

export async function createBookShop(data: { name: string, location: string, branch?: string, phone?: string, email?: string }) {
    try {
        const shop = await (prisma as any).bookshopes.create({
            data: {
                name: data.name,
                location: data.location,
                branch: data.branch,
                phone: data.phone,
                email: data.email,
                updatedAt: new Date()
            }
        });
        revalidatePath("/admin_dashboard/book_shops");
        return { success: true, data: shop };
    } catch (error) {
        return { success: false, error: "Failed to create book shop" };
    }
}

export async function updateBookShop(id: number, data: any) {
    try {
        const updated = await (prisma as any).bookshopes.update({
            where: { id },
            data: {
                name: data.name,
                location: data.location,
                branch: data.branch,
                phone: data.phone,
                email: data.email,
                updatedAt: new Date()
            }
        });
        revalidatePath("/admin_dashboard/book_shops");
        return { success: true, data: updated };
    } catch (error) {
        return { success: false, error: "Failed to update book shop" };
    }
}

export async function deleteBookShop(id: number) {
    try {
        await (prisma as any).bookshopes.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() }
        });
        revalidatePath("/admin_dashboard/book_shops");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete book shop" };
    }
}
