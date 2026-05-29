"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentSession } from "./auth-actions"
import { createNotification } from "./notification-actions"
import { put } from "@vercel/blob"

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
    imageUrl?: string
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
                imageUrl: formData.imageUrl || null,
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

export async function uploadCheckImageAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) return { success: false, error: "No file provided" };
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileExtension = file.name.split(".").pop();
        const cleanFileName = `checks/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
        const blob = await put(cleanFileName, buffer, { access: "public" });
        return { success: true, url: blob.url };
    } catch (error) {
        console.error("Upload check image error:", error);
        return { success: false, error: "Failed to upload check image" };
    }
}

export async function checkIsAdminUser() {
    try {
        const session = await getCurrentSession();
        return { success: true, isAdmin: session?.role === "ADMIN" };
    } catch {
        return { success: true, isAdmin: false };
    }
}

export async function updateCheckStatus(checkId: number, status: string) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const check = await (prisma as any).checks.findUnique({ where: { id: checkId } });
        if (!check) return { success: false, error: "Check not found" };

        await (prisma as any).checks.update({
            where: { id: checkId },
            data: { status, updatedAt: new Date() }
        });

        if (status === "CLEARED") {
            await createNotification({
                title: `Check #${checkId} Cleared`,
                message: `Check from ${check.bankname} (${check.username}) for ${check.amount} ETB has been cleared.`,
                details: JSON.stringify({ checkId, bankname: check.bankname, username: check.username, amount: check.amount }),
                type: "CHECK",
                notification_to: "ADMIN",
                notification_from: session?.name || "System",
            });

            await (prisma as any).activityLogs.create({
                data: {
                    accountId: session.id,
                    action: `Approved check #${checkId} from ${check.bankname} - ${check.username}`,
                    details: JSON.stringify({ checkId, bankname: check.bankname, username: check.username, amount: check.amount }),
                    updatedAt: new Date(),
                }
            });
        }

        revalidatePath("/admin_dashboard/checks", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating check status:", error);
        return { success: false, error: "Failed to update check status" };
    }
}
