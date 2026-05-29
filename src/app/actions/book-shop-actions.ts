"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";

export async function checkCurrentUserRole(roleName: string) {
  try {
    const session = await getCurrentSession();
    if (!session?.id) return { success: true, enabled: false };
    if (session.role === "ADMIN") return { success: true, enabled: true };
    const roleType = await (prisma as any).roletypes.findFirst({
      where: { rolename: roleName, is_deleted: false },
    });
    if (!roleType) return { success: true, enabled: false };
    const role = await (prisma as any).roles.findFirst({
      where: { accountId: session.id, roletypeId: roleType.id, is_deleted: false },
    });
    return { success: true, enabled: role?.role_status === true };
  } catch (error) {
    return { success: false, enabled: false, error: "Failed to check role." };
  }
}

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
    const permission = await checkCurrentUserRole("Adding BookShop");
    if (!permission.enabled) {
        return { success: false, error: "You do not have the privilege to add book shops." };
    }

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
    const permission = await checkCurrentUserRole("Editing BookShops");
    if (!permission.enabled) {
        return { success: false, error: "You do not have the privilege to edit book shops." };
    }

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
    const permission = await checkCurrentUserRole("Deleting BookShops");
    if (!permission.enabled) {
        return { success: false, error: "You do not have the privilege to delete book shops." };
    }

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
