"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPrintOrders() {
    try {
        const orders = await (prisma as any).printorder.findMany({
            where: { is_deleted: false },
            include: {
                printer: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: orders }
    } catch (error) {
        return { success: false, error: "Failed to fetch print orders" }
    }
}

export async function createPrintOrder(formData: any) {
    try {
        const order = await (prisma as any).printorder.create({
            data: {
                quality: formData.quality,
                count: parseInt(formData.count),
                printerId: parseInt(formData.printerId),
                edition: formData.edition,
                memo: formData.memo,
                status: formData.status || "NOT_STARTED",
                tracking: formData.tracking || "NOT_SET",
                startDate: formData.startDate ? new Date(formData.startDate) : null,
                endDate: formData.endDate ? new Date(formData.endDate) : null,
                updatedAt: new Date()
            }
        })
        revalidatePath("/admin_dashboard/printing/manage")
        revalidatePath("/admin_dashboard/printing/printers")
        return { success: true, data: order }
    } catch (error) {
        return { success: false, error: "Failed to create print order" }
    }
}

export async function updatePrintOrder(id: number, formData: any) {
    try {
        const order = await (prisma as any).printorder.update({
            where: { id },
            data: {
                quality: formData.quality,
                count: parseInt(formData.count),
                printerId: parseInt(formData.printerId),
                edition: formData.edition,
                memo: formData.memo,
                status: formData.status,
                tracking: formData.tracking,
                startDate: formData.startDate ? new Date(formData.startDate) : null,
                endDate: formData.endDate ? new Date(formData.endDate) : null,
                updatedAt: new Date()
            }
        })
        revalidatePath("/admin_dashboard/printing/manage")
        return { success: true, data: order }
    } catch (error) {
        return { success: false, error: "Failed to update print order" }
    }
}

export async function deletePrintOrder(id: number) {
    try {
        await (prisma as any).printorder.update({
            where: { id },
            data: { is_deleted: true, deletedAt: new Date(), updatedAt: new Date() }
        })
        revalidatePath("/admin_dashboard/printing/manage")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete print order" }
    }
}
