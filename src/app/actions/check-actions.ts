"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentSession } from "./auth-actions"
import { createNotification } from "./notification-actions"
import { put } from "@vercel/blob"

export async function getChecksFollowUp() {
    try {
        const checks = await (prisma as any).checks.findMany({
            where: { is_deleted: false },
            orderBy: { recordeddate: 'asc' },
            include: {
                payments: {
                    include: {
                        shop: {
                            select: { id: true, name: true, location: true, phone: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })
        return { success: true, data: checks }
    } catch (error) {
        return { success: false, error: "Failed to fetch checks" }
    }
}

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
    expirydate?: string
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
                expirydate: formData.expirydate ? new Date(formData.expirydate) : null,
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

        if (status === "DELIVERED") {
            const detailsObj = JSON.stringify({ checkId, bankname: check.bankname, username: check.username, amount: check.amount });

            await createNotification({
                title: `Check #${checkId} Delivered to Bank`,
                message: `Check from ${check.bankname} (${check.username}) for ${check.amount} ETB has been marked as delivered.`,
                details: detailsObj,
                type: "CHECK",
                notification_to: "DELIVERY_AND_SALES",
                notification_from: session?.name || "System",
            });

            const deliveryAccounts = await (prisma as any).accounts.findMany({
                where: { account_type: "Delivery Account", is_deleted: false },
                select: { id: true, name: true },
            });
            for (const acc of deliveryAccounts) {
                await createNotification({
                    title: `Check #${checkId} Delivered to Bank`,
                    message: `Check from ${check.bankname} (${check.username}) for ${check.amount} ETB has been marked as delivered by ${session?.name || "System"}.`,
                    details: detailsObj,
                    type: "CHECK",
                    accountId: acc.id,
                    notification_from: session?.name || "System",
                });
            }

            await (prisma as any).activityLogs.create({
                data: {
                    accountId: session.id,
                    action: `Marked check #${checkId} from ${check.bankname} - ${check.username} as delivered`,
                    details: detailsObj,
                    updatedAt: new Date(),
                }
            });
        }

        if (status === "CLEARED") {
            // Approve linked regular payments
            const linkedPayments = await (prisma as any).payments.findMany({
                where: { checkId, status: "PENDING", is_deleted: false },
                include: { shop: true }
            });

            for (const payment of linkedPayments) {
                await (prisma as any).payments.update({
                    where: { id: payment.id },
                    data: { status: "APPROVED" }
                });

                let remaining = payment.amount;
                const shopOrders = await (prisma as any).orders.findMany({
                    where: { bookShopId: payment.shopId, is_deleted: false },
                    orderBy: { createdAt: 'asc' }
                });

                for (const order of shopOrders) {
                    if (remaining <= 0) break;
                    const orderRemaining = (order.total_amount || 0) - (order.amount_paid || 0);
                    if (orderRemaining <= 0) continue;
                    const toApply = Math.min(remaining, orderRemaining);
                    await (prisma as any).orders.update({
                        where: { id: order.id },
                        data: { amount_paid: (order.amount_paid || 0) + toApply }
                    });
                    remaining -= toApply;
                }
            }

            // Approve linked round payments
            const linkedRoundPayments = await (prisma as any).round_payments.findMany({
                where: { checkId, status: "PENDING", is_deleted: false },
            });

            for (const roundPayment of linkedRoundPayments) {
                await (prisma as any).round_payments.update({
                    where: { id: roundPayment.id },
                    data: { status: "APPROVED", updatedAt: new Date() }
                });
            }

            const totalApprovedPayments = linkedPayments.length + linkedRoundPayments.length;

            await createNotification({
                title: `Check #${checkId} Cleared`,
                message: `Check from ${check.bankname} (${check.username}) for ${check.amount} ETB has been cleared. ${linkedPayments.length} order payment(s) and ${linkedRoundPayments.length} round payment(s) approved.`,
                details: JSON.stringify({ checkId, bankname: check.bankname, username: check.username, amount: check.amount, approvedPayments: totalApprovedPayments }),
                type: "CHECK",
                notification_to: "ADMIN",
                notification_from: session?.name || "System",
            });

            await (prisma as any).activityLogs.create({
                data: {
                    accountId: session.id,
                    action: `Cleared check #${checkId} from ${check.bankname} - ${check.username} — approved ${totalApprovedPayments} payment(s)`,
                    details: JSON.stringify({ checkId, bankname: check.bankname, username: check.username, amount: check.amount, approvedPayments: totalApprovedPayments }),
                    updatedAt: new Date(),
                }
            });
        }

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating check status:", error);
        return { success: false, error: "Failed to update check status" };
    }
}

export async function updateCheckDetails(checkId: number, data: {
    bankname?: string;
    username?: string;
    type?: string;
    amount?: string;
    recordeddate?: string | null;
    expirydate?: string | null;
    imageUrl?: string | null;
    memo?: string | null;
}) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const existing = await (prisma as any).checks.findUnique({
            where: { id: checkId },
            select: { status: true }
        });

        const updateData: any = { updatedAt: new Date() };
        if (data.bankname !== undefined) updateData.bankname = data.bankname;
        if (data.username !== undefined) updateData.username = data.username;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.amount !== undefined && existing?.status !== "CLEARED") updateData.amount = data.amount;
        if (data.recordeddate !== undefined) updateData.recordeddate = data.recordeddate ? new Date(data.recordeddate) : null;
        if (data.expirydate !== undefined) updateData.expirydate = data.expirydate ? new Date(data.expirydate) : null;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.memo !== undefined) updateData.memo = data.memo;

        await (prisma as any).checks.update({
            where: { id: checkId },
            data: updateData
        });

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating check details:", error);
        return { success: false, error: "Failed to update check details" };
    }
}
