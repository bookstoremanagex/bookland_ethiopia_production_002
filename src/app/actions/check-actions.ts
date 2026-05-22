"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getChecks() {
    try {
        const checks = await (prisma as any).checks.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: checks }
    } catch (error) {
        return { success: false, error: "Failed to fetch checks" }
    }
}

export async function createCheck(formData: {
    username: string
    bankname: string
    type: string
    amount: string
    recordeddate: string
    memo: string
}) {
    try {
        const check = await (prisma as any).checks.create({
            data: {
                username: formData.username || null,
                bankname: formData.bankname || null,
                type: formData.type || null,
                amount: formData.amount || null,
                recordeddate: formData.recordeddate ? new Date(formData.recordeddate) : null,
                memo: formData.memo || null,
                updatedAt: new Date(),
            }
        })
        revalidatePath("/admin_dashboard/checks")
        return { success: true, data: check }
    } catch (error: any) {
        console.error("Create check error:", error?.message || error, "CODE:", error?.code)
        return { success: false, error: error?.message || error?.meta?.message || "Failed to create check. Check server logs." }
    }
}
