"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";
import { createNotification } from "./notification-actions";

export async function getPendingPaymentsCount() {
  try {
    const count = await (prisma as any).payments.count({
      where: { status: "PENDING", is_deleted: false },
    });
    return { success: true, count };
  } catch (error) {
    return { success: true, count: 0 };
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
    orderid?: string | null;
    memo?: string | null;
    image?: string | null;
    is_for_previous_debts?: boolean | null;
    is_for_printer?: boolean | null;
    printer_id?: number | null;
    printer_payment_memo?: string | null;
    approve?: boolean | null;
}) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const approveImmediately = data.approve && data.payment_type === "DIRECT";

        const payment = await (prisma as any).payments.create({
            data: {
                shopId: data.shopId,
                amount: data.amount,
                payment_type: data.payment_type,
                checkId: data.checkId || null,
                orderid: data.orderid || null,
                memo: data.memo || null,
                image: data.image || null,
                is_for_previous_debts: data.is_for_previous_debts || null,
                is_for_printer: data.is_for_printer || null,
                printer_id: data.printer_id || null,
                printer_payment_memo: data.printer_payment_memo || null,
                status: approveImmediately ? "APPROVED" : "PENDING",
            }
        });

        const shop = await (prisma as any).bookshopes.findUnique({ where: { id: data.shopId } });

        await createNotification({
            title: `New Payment from ${shop?.name || "Unknown Shop"}`,
            message: `A payment of ${data.amount.toLocaleString()} ETB has been recorded (${data.payment_type}). Status: ${approveImmediately ? "APPROVED" : "PENDING"}.`,
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

        // Auto-approve distribution when "Approve" was selected for a direct payment
        if (approveImmediately) {
            const approveResult = await approvePaymentInternal(payment.id);
            if (!approveResult.success) {
                return { success: false, error: approveResult.error || "Payment recorded but auto-approval failed" };
            }
        }

        return { success: true, data: payment };
    } catch (error) {
        console.error("Error creating payment:", error);
        return { success: false, error: "Failed to create payment" };
    }
}

export async function approvePaymentInternal(paymentId: number) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const payment = await (prisma as any).payments.findUnique({
            where: { id: paymentId },
            include: { shop: true }
        });

        if (!payment) return { success: false, error: "Payment not found" };
        if (payment.status !== "APPROVED") {
            await (prisma as any).payments.update({
                where: { id: paymentId },
                data: { status: "APPROVED" }
            });
        }

        // Distribute the payment: linked order first, then remaining across other orders (oldest first)
        try {
            let remaining = payment.amount;
            const orderIdNum = payment.orderid ? parseInt(payment.orderid.replace(/^ORD-/i, "")) : null;

            // 1. Apply to linked order first (if exists and has remaining balance)
            if (orderIdNum) {
                const linkedOrder = await (prisma as any).orders.findFirst({
                    where: { id: orderIdNum, bookShopId: payment.shopId, is_deleted: false }
                });
                if (linkedOrder) {
                    const orderRemaining = (linkedOrder.total_amount || 0) - (linkedOrder.amount_paid || 0);
                    if (orderRemaining > 0) {
                        const toApply = Math.min(remaining, orderRemaining);
                        await (prisma as any).orders.update({
                            where: { id: linkedOrder.id },
                            data: { amount_paid: (linkedOrder.amount_paid || 0) + toApply }
                        });
                        remaining -= toApply;
                    }
                }
            }

            // 2. Distribute remaining across other unpaid orders (oldest first)
            if (remaining > 0) {
                const shopOrders = await (prisma as any).orders.findMany({
                    where: {
                        bookShopId: payment.shopId,
                        is_deleted: false,
                        ...(orderIdNum ? { id: { not: orderIdNum } } : {}),
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

        return await approvePaymentInternal(paymentId);
    } catch (error) {
        console.error("Error approving payment:", error);
        return { success: false, error: "Failed to approve payment" };
    }
}

export async function rejectPayment(paymentId: number) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const payment = await (prisma as any).payments.findUnique({
            where: { id: paymentId },
            include: { shop: true }
        });

        if (!payment) return { success: false, error: "Payment not found" };
        if (payment.status === "APPROVED") return { success: false, error: "Cannot reject an approved payment" };

        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { status: "REJECTED" }
        });

        await createNotification({
            title: `Payment Rejected - ${payment.shop?.name || "Unknown Shop"}`,
            message: `Payment of ${payment.amount.toLocaleString()} ETB has been rejected.`,
            details: JSON.stringify({ paymentId, shopName: payment.shop?.name, amount: payment.amount }),
            type: "PAYMENT",
            notification_to: "ADMIN",
            notification_from: session?.name || "System",
        });

        await (prisma as any).activityLogs.create({
            data: {
                accountId: session.id,
                action: `Rejected payment of ${payment.amount.toLocaleString()} ETB for ${payment.shop?.name || "shop"}`,
                details: JSON.stringify({ paymentId, shopName: payment.shop?.name, amount: payment.amount }),
                updatedAt: new Date(),
            }
        });

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error rejecting payment:", error);
        return { success: false, error: "Failed to reject payment" };
    }
}

export async function setPaymentPending(paymentId: number) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const payment = await (prisma as any).payments.findUnique({
            where: { id: paymentId },
            include: { shop: true }
        });

        if (!payment) return { success: false, error: "Payment not found" };

        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { status: "PENDING" }
        });

        // Reverse the payment from orders' amount_paid if it was approved (linked order first)
        if (payment.status === "APPROVED") {
            try {
                let remaining = payment.amount;
                const orderIdNum = payment.orderid ? parseInt(payment.orderid.replace(/^ORD-/i, "")) : null;

                // 1. Reverse from linked order first
                if (orderIdNum) {
                    const linkedOrder = await (prisma as any).orders.findFirst({
                        where: { id: orderIdNum, bookShopId: payment.shopId, is_deleted: false }
                    });
                    if (linkedOrder) {
                        const paid = linkedOrder.amount_paid || 0;
                        if (paid > 0) {
                            const toReverse = Math.min(remaining, paid);
                            await (prisma as any).orders.update({
                                where: { id: linkedOrder.id },
                                data: { amount_paid: paid - toReverse }
                            });
                            remaining -= toReverse;
                        }
                    }
                }

                // 2. Reverse remaining from other orders (newest first)
                if (remaining > 0) {
                    const shopOrders = await (prisma as any).orders.findMany({
                        where: {
                            bookShopId: payment.shopId,
                            is_deleted: false,
                            ...(orderIdNum ? { id: { not: orderIdNum } } : {}),
                        },
                        orderBy: { createdAt: 'desc' }
                    });
                    for (const order of shopOrders) {
                        if (remaining <= 0) break;
                        const paid = order.amount_paid || 0;
                        if (paid <= 0) continue;
                        const toReverse = Math.min(remaining, paid);
                        await (prisma as any).orders.update({
                            where: { id: order.id },
                            data: { amount_paid: paid - toReverse }
                        });
                        remaining -= toReverse;
                    }
                }
            } catch (reverseError) {
                console.error("Error reversing payment from orders:", reverseError);
            }
        }

        await (prisma as any).activityLogs.create({
            data: {
                accountId: session.id,
                action: `Reset payment of ${payment.amount.toLocaleString()} ETB for ${payment.shop?.name || "shop"} back to PENDING`,
                details: JSON.stringify({ paymentId, shopName: payment.shop?.name, amount: payment.amount }),
                updatedAt: new Date(),
            }
        });

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error setting payment pending:", error);
        return { success: false, error: "Failed to update payment" };
    }
}

export async function deletePayment(paymentId: number) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const payment = await (prisma as any).payments.findUnique({
            where: { id: paymentId },
            include: { shop: true }
        });

        if (!payment) return { success: false, error: "Payment not found" };

        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { is_deleted: true }
        });

        // Reverse the payment from orders' amount_paid if it was approved (linked order first)
        if (payment.status === "APPROVED") {
            try {
                let remaining = payment.amount;
                const orderIdNum = payment.orderid ? parseInt(payment.orderid.replace(/^ORD-/i, "")) : null;

                // 1. Reverse from linked order first
                if (orderIdNum) {
                    const linkedOrder = await (prisma as any).orders.findFirst({
                        where: { id: orderIdNum, bookShopId: payment.shopId, is_deleted: false }
                    });
                    if (linkedOrder) {
                        const paid = linkedOrder.amount_paid || 0;
                        if (paid > 0) {
                            const toReverse = Math.min(remaining, paid);
                            await (prisma as any).orders.update({
                                where: { id: linkedOrder.id },
                                data: { amount_paid: paid - toReverse }
                            });
                            remaining -= toReverse;
                        }
                    }
                }

                // 2. Reverse remaining from other orders (newest first)
                if (remaining > 0) {
                    const shopOrders = await (prisma as any).orders.findMany({
                        where: {
                            bookShopId: payment.shopId,
                            is_deleted: false,
                            ...(orderIdNum ? { id: { not: orderIdNum } } : {}),
                        },
                        orderBy: { createdAt: 'desc' }
                    });
                    for (const order of shopOrders) {
                        if (remaining <= 0) break;
                        const paid = order.amount_paid || 0;
                        if (paid <= 0) continue;
                        const toReverse = Math.min(remaining, paid);
                        await (prisma as any).orders.update({
                            where: { id: order.id },
                            data: { amount_paid: paid - toReverse }
                        });
                        remaining -= toReverse;
                    }
                }
            } catch (reverseError) {
                console.error("Error reversing payment from orders:", reverseError);
            }
        }

        await (prisma as any).activityLogs.create({
            data: {
                accountId: session.id,
                action: `Deleted payment of ${payment.amount.toLocaleString()} ETB for ${payment.shop?.name || "shop"}`,
                details: JSON.stringify({ paymentId, shopName: payment.shop?.name, amount: payment.amount }),
                updatedAt: new Date(),
            }
        });

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error deleting payment:", error);
        return { success: false, error: "Failed to delete payment" };
    }
}

export async function updatePaymentMemo(paymentId: number, memo: string) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Not authenticated" };

        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { memo: memo || null },
        });

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating payment memo:", error);
        return { success: false, error: "Failed to update memo" };
    }
}

export async function updatePaymentPrinter(
    paymentId: number,
    printerId: number | null
) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Not authenticated" };

        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { printer_id: printerId },
        });

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating payment printer:", error);
        return { success: false, error: "Failed to update printer" };
    }
}

export async function updatePrinterPaymentMemo(paymentId: number, memo: string) {
    try {
        const session = await getCurrentSession();
        if (!session) return { success: false, error: "Not authenticated" };

        await (prisma as any).payments.update({
            where: { id: paymentId },
            data: { printer_payment_memo: memo || null },
        });

        revalidatePath("/admin_dashboard", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating printer payment memo:", error);
        return { success: false, error: "Failed to update memo" };
    }
}
