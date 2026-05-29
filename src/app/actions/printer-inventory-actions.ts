"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function transferToPrinter(printerId: number, transfers: { editionId: number, quantity: number }[]) {
    try {
        const result = await (prisma as any).$transaction(async (tx: any) => {
            const transferResults = []

            for (const transfer of transfers) {
                const edition = await tx.bookedition.findUnique({
                    where: { id: transfer.editionId },
                    select: { count_remening_for_transfer: true }
                })

                if (!edition || (edition.count_remening_for_transfer || 0) < transfer.quantity) {
                    throw new Error(`Insufficient stock for edition ID ${transfer.editionId}`)
                }

                await tx.bookedition.update({
                    where: { id: transfer.editionId },
                    data: {
                        count_remening_for_transfer: {
                            decrement: transfer.quantity
                        }
                    }
                })

                const existingPrinterStock = await tx.bookeditionprinters.findFirst({
                    where: {
                        printerId: printerId,
                        editionId: transfer.editionId,
                        is_deleted: false,
                    }
                })

                if (existingPrinterStock) {
                    await tx.bookeditionprinters.update({
                        where: { id: existingPrinterStock.id },
                        data: {
                            quantity: {
                                increment: transfer.quantity
                            },
                            updatedAt: new Date(),
                        }
                    })
                } else {
                    await tx.bookeditionprinters.create({
                        data: {
                            printerId: printerId,
                            editionId: transfer.editionId,
                            quantity: transfer.quantity,
                            updatedAt: new Date(),
                        }
                    })
                }

                transferResults.push({ editionId: transfer.editionId, quantity: transfer.quantity })
            }

            return transferResults
        }, { timeout: 15000 })

        revalidatePath(`/admin_dashboard/printing/printers/${printerId}`)
        return { success: true, data: result }
    } catch (error: any) {
        console.error("Transfer to printer error:", error)
        return { success: false, error: error.message || "Transfer failed" }
    }
}

export async function updatePrinterInventory(id: number, quantity: number, editionId: number) {
    try {
        const current = await (prisma as any).bookeditionprinters.findUnique({ where: { id } })
        if (!current) return { success: false, error: "Printer inventory record not found" }

        const oldQuantity = Number(current.quantity || 0)
        const diff = quantity - oldQuantity

        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } })
        if (!edition) return { success: false, error: "Edition not found" }

        const remaining = Number(edition.count_remening_for_transfer || 0)

        if (diff > 0 && diff > remaining) {
            return { success: false, error: `Cannot increase by ${diff}. Only ${remaining} remaining for transfer.` }
        }
        if (quantity < 0) {
            return { success: false, error: "Quantity cannot be negative." }
        }

        const [updated] = await (prisma as any).$transaction([
            (prisma as any).bookeditionprinters.update({
                where: { id },
                data: { quantity, updatedAt: new Date() },
            }),
            (prisma as any).bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: remaining - diff }
            })
        ], { timeout: 15000 })

        const newRemaining = remaining - diff
        revalidatePath(`/admin_dashboard/printing/printers`)
        return { success: true, data: updated, newRemaining }
    } catch (error) {
        return { success: false, error: "Failed to update printer inventory" }
    }
}

export async function deletePrinterInventory(id: number, editionId: number) {
    try {
        const current = await (prisma as any).bookeditionprinters.findUnique({ where: { id } })
        if (!current) return { success: false, error: "Printer inventory record not found" }

        const quantityToReturn = Number(current.quantity || 0)

        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } })
        if (!edition) return { success: false, error: "Edition not found" }

        const remaining = Number(edition.count_remening_for_transfer || 0)

        await (prisma as any).$transaction([
            (prisma as any).bookeditionprinters.update({
                where: { id },
                data: { is_deleted: true, updatedAt: new Date() }
            }),
            (prisma as any).bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: remaining + quantityToReturn }
            })
        ], { timeout: 15000 })

        const newRemaining = remaining + quantityToReturn
        revalidatePath(`/admin_dashboard/printing/printers`)
        return { success: true, newRemaining }
    } catch (error) {
        return { success: false, error: "Failed to remove from printer" }
    }
}
