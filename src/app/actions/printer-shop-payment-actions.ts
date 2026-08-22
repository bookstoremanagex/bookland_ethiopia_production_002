"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";

export async function getPrinterPaymentsForOrder(orderId: number) {
  try {
    const id = Number(orderId);
    if (!id) return { success: false, error: "Invalid orderId" };
    const records = await (prisma as any).payment_records_from_shop_to_printer.findMany({
      where: { orderId: id, is_deleted: false },
      include: {
        printer: { select: { id: true, name: true, location: true } },
        shop: { select: { id: true, name: true } },
        orders: { select: { id: true, total_amount: true, amount_paid: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: records };
  } catch (error) {
    console.error("getPrinterPaymentsForOrder error:", error);
    return { success: false, error: "Failed to fetch printer payments" };
  }
}

export async function createPrinterShopPayment(data: {
  shopId?: number | null;
  orderId: number;
  printerId: number;
  amount: number;
  memo?: string | null;
}) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const orderId = Number(data.orderId);
    const printerId = Number(data.printerId);
    const amount = Number(data.amount);
    if (!orderId || !printerId || isNaN(amount) || amount <= 0) {
      return { success: false, error: "Order, printer and valid amount are required" };
    }

    const order = await (prisma as any).orders.findUnique({
      where: { id: orderId },
      select: { id: true, bookShopId: true, total_amount: true, amount_paid: true },
    });
    if (!order) return { success: false, error: "Order not found" };

    const shopId = data.shopId ? Number(data.shopId) : Number(order.bookShopId);

    // Default status is APPROVED per requirement
    const record = await (prisma as any).payment_records_from_shop_to_printer.create({
      data: {
        shopId,
        orderId,
        printerId,
        amount,
        memo: data.memo || null,
        status: "APPROVED",
      },
    });

    revalidatePath(`/admin_dashboard/manage_payment/${shopId}`);
    revalidatePath(`/admin_dashboard/printing/payments`);

    return { success: true, data: record };
  } catch (error) {
    console.error("createPrinterShopPayment error:", error);
    return { success: false, error: "Failed to create printer payment" };
  }
}

export async function updatePrinterShopPaymentMemo(id: number, memo: string | null) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Unauthorized" };
    await (prisma as any).payment_records_from_shop_to_printer.update({
      where: { id: Number(id) },
      data: { memo: memo || null, updatedAt: new Date() },
    });
    revalidatePath(`/admin_dashboard/printing/payments`);
    return { success: true };
  } catch (error) {
    console.error("updatePrinterShopPaymentMemo error:", error);
    return { success: false, error: "Failed to update memo" };
  }
}

export async function updatePrinterShopPaymentStatus(id: number, status: string) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Unauthorized" };
    const allowed = ["PENDING", "APPROVED", "REJECTED"];
    if (!allowed.includes(status)) return { success: false, error: "Invalid status" };
    await (prisma as any).payment_records_from_shop_to_printer.update({
      where: { id: Number(id) },
      data: { status, updatedAt: new Date() },
    });
    revalidatePath(`/admin_dashboard/printing/payments`);
    return { success: true };
  } catch (error) {
    console.error("updatePrinterShopPaymentStatus error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updatePrinterShopPaymentAmount(id: number, amount: number) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Unauthorized" };
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return { success: false, error: "Amount must be greater than 0" };
    await (prisma as any).payment_records_from_shop_to_printer.update({
      where: { id: Number(id) },
      data: { amount: amt, updatedAt: new Date() },
    });
    revalidatePath(`/admin_dashboard/printing/payments`);
    return { success: true };
  } catch (error) {
    console.error("updatePrinterShopPaymentAmount error:", error);
    return { success: false, error: "Failed to update amount" };
  }
}

export async function updatePrinterShopPaymentPrinter(id: number, printerId: number) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Unauthorized" };
    const pid = Number(printerId);
    if (!pid) return { success: false, error: "Invalid printer" };
    const printer = await (prisma as any).printer.findUnique({ where: { id: pid }, select: { id: true } });
    if (!printer) return { success: false, error: "Printer not found" };
    await (prisma as any).payment_records_from_shop_to_printer.update({
      where: { id: Number(id) },
      data: { printerId: pid, updatedAt: new Date() },
    });
    revalidatePath(`/admin_dashboard/printing/payments`);
    return { success: true };
  } catch (error) {
    console.error("updatePrinterShopPaymentPrinter error:", error);
    return { success: false, error: "Failed to update printer" };
  }
}
