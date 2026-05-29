"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";
import { createNotification } from "./notification-actions";

export async function checkIsAdminUser() {
    try {
        const session = await getCurrentSession();
        return { success: true, isAdmin: session?.role === "ADMIN" };
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

        // Approve the payment first
        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { status: "APPROVED" }
        });

        // Distribute the payment across the shop's unpaid orders (oldest first)
        try {
            let remaining = payment.amount;
            const shopOrders = await (prisma as any).orders.findMany({
                where: {
                    bookShopId: payment.shopId,
                    is_deleted: false,
                },
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
        } catch (deductError) {
            // Revert the approval if deduction fails
            await (prisma as any).payments.update({
                where: { id: paymentId },
                data: { status: "PENDING" }
            });
            console.error("Error deducting payment from orders:", deductError);
            return { success: false, error: "Payment approved but failed to deduct from debt. Approval reverted." };
        }

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

        // Notify DELIVERY_AND_SALES
        await createNotification({
            title: `Payment Approved - ${payment.shop?.name || "Unknown Shop"}`,
            message: `A payment of ${payment.amount.toLocaleString()} ETB for ${payment.shop?.name || "Unknown Shop"} has been approved.`,
            details: JSON.stringify({
                shopId: payment.shopId,
                shopName: payment.shop?.name,
                amount: payment.amount,
                paymentType: payment.payment_type,
                checkId: payment.checkId,
                paymentId: payment.id
            }),
            type: "PAYMENT",
            notification_to: "DELIVERY_AND_SALES",
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

        revalidatePath("/admin_dashboard", "layout");
        revalidatePath("/delivery_and_sales_dashboard", "layout");
        revalidatePath("/delivery_sample_dashboard", "layout");

        return { success: true, data: payment };
    } catch (error) {
        console.error("Error approving payment:", error);
        return { success: false, error: "Failed to approve payment" };
    }
}
