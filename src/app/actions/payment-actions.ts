"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";
import { createNotification } from "./notification-actions";

export async function checkIsAdminUser() {
    try {
        const session = await getCurrentSession();
        return { success: true, isAdmin: session?.role === "Admin" };
    } catch {
        return { success: true, isAdmin: false };
    }
}

export async function getShopPayments(shopId: number) {
    try {
        const payments = await (prisma as any).payments.findMany({
            where: { shopId, is_deleted: false },
            include: { check: true },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: payments };
    } catch (error) {
        console.error("Error fetching payments:", error);
        return { success: false, error: "Failed to fetch payments" };
    }
}

export async function createPayment(data: {
    shopId: number;
    amount: number;
    payment_type: "DIRECT" | "CHECK";
    checkId?: number | null;
}) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const payment = await (prisma as any).payments.create({
            data: {
                shopId: data.shopId,
                amount: data.amount,
                payment_type: data.payment_type,
                checkId: data.checkId || null,
                status: "PENDING",
            }
        });

        const shop = await (prisma as any).bookshopes.findUnique({ where: { id: data.shopId } });

        await createNotification({
            title: `New Payment from ${shop?.name || "Unknown Shop"}`,
            message: `A payment of ${data.amount.toLocaleString()} ETB has been recorded (${data.payment_type}). Status: PENDING.`,
            details: JSON.stringify({
                shopId: data.shopId,
                shopName: shop?.name,
                amount: data.amount,
                paymentType: data.payment_type,
                checkId: data.checkId,
                paymentId: payment.id
            }),
            type: "PAYMENT",
            notification_to: "ADMIN",
            notification_from: session?.name || "System",
        });

        await (prisma as any).activityLogs.create({
            data: {
                accountId: session.id,
                action: `Recorded payment of ${data.amount.toLocaleString()} ETB for ${shop?.name || "shop"}`,
                details: JSON.stringify({
                    shopId: data.shopId,
                    shopName: shop?.name,
                    amount: data.amount,
                    paymentType: data.payment_type,
                    checkId: data.checkId,
                    paymentId: payment.id
                }),
                updatedAt: new Date(),
            }
        });

        return { success: true, data: payment };
    } catch (error) {
        console.error("Error creating payment:", error);
        return { success: false, error: "Failed to create payment" };
    }
}

export async function approvePayment(paymentId: number) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const payment = await (prisma as any).payments.findUnique({
            where: { id: paymentId },
            include: { shop: true }
        });

        if (!payment) return { success: false, error: "Payment not found" };
        if (payment.status === "APPROVED") return { success: false, error: "Payment already approved" };

        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { status: "APPROVED" }
        });

        await createNotification({
            title: `Payment Approved - ${payment.shop?.name || "Unknown Shop"}`,
            message: `Payment of ${payment.amount.toLocaleString()} ETB has been approved and deducted from the debt.`,
            details: JSON.stringify({
                shopId: payment.shopId,
                shopName: payment.shop?.name,
                amount: payment.amount,
                paymentType: payment.payment_type,
                checkId: payment.checkId,
                paymentId: payment.id
            }),
            type: "PAYMENT",
            notification_to: "ADMIN",
            notification_from: session?.name || "System",
        });

        await (prisma as any).activityLogs.create({
            data: {
                accountId: session.id,
                action: `Approved payment of ${payment.amount.toLocaleString()} ETB for ${payment.shop?.name || "shop"}`,
                details: JSON.stringify({
                    shopId: payment.shopId,
                    shopName: payment.shop?.name,
                    amount: payment.amount,
                    paymentType: payment.payment_type,
                    checkId: payment.checkId,
                    paymentId: payment.id
                }),
                updatedAt: new Date(),
            }
        });

        revalidatePath("/admin_dashboard/manage_payment", "layout");

        return { success: true, data: payment };
    } catch (error) {
        console.error("Error approving payment:", error);
        return { success: false, error: "Failed to approve payment" };
    }
}
