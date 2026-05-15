"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getFirstPrinterName as getFirstPrinterNameFromDb } from "@/lib/get-first-printer-name"

export async function getFirstPrinterName() {
    const result = await getFirstPrinterNameFromDb()
    if (result.ok) {
        return { success: true as const, name: result.name }
    }
    return { success: false as const, error: "Could not fetch printer information" }
}

export async function getPrinters() {
    try {
        const printers = await (prisma as any).printer.findMany({
            where: { is_deleted: false },
            include: {
                printorder: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: printers }
    } catch (error) {
        return { success: false, error: "Failed to fetch printers" }
    }
}

export async function createPrinter(formData: any) {
    try {
        const printer = await (prisma as any).printer.create({
            data: {
                name: formData.name,
                location: formData.location,
                phone: formData.phone,
                email: formData.email,
                updatedAt: new Date()
            }
        })
        revalidatePath("/admin_dashboard/printing/printers")
        return { success: true, data: printer }
    } catch (error) {
        return { success: false, error: "Failed to create printer" }
    }
}

export async function updatePrinter(id: number, formData: any) {
    try {
        const printer = await (prisma as any).printer.update({
            where: { id },
            data: {
                name: formData.name,
                location: formData.location,
                phone: formData.phone,
                email: formData.email,
                updatedAt: new Date()
            }
        })
        revalidatePath("/admin_dashboard/printing/printers")
        revalidatePath(`/admin_dashboard/printing/printers/${id}`)
        return { success: true, data: printer }
    } catch (error) {
        return { success: false, error: "Failed to update printer" }
    }
}

export async function deletePrinter(id: number) {
    try {
        await (prisma as any).printer.update({
            where: { id },
            data: { 
                is_deleted: true, 
                deletedAt: new Date(),
                updatedAt: new Date()
            }
        })
        revalidatePath("/admin_dashboard/printing/printers")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete printer" }
    }
}
