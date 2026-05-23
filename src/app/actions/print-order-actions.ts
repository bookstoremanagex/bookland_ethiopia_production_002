"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPrintOrders() {
  try {
    const orders = await (prisma as any).printorder.findMany({
      where: { is_deleted: false },
      include: {
        printer: true,
        printorder_items: {
          include: {
            bookedition: {
              include: {
                books: true,
              },
            },
          },
        },
        printorder_payments: {
          orderBy: {
            payment_date: "asc",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: "Failed to fetch print orders" };
  }
}

export async function createPrintOrder(formData: any) {
  try {
    const order = await (prisma as any).printorder.create({
      data: {
        project_name: formData.project_name || null,
        printerId: parseInt(formData.printerId),
        memo: formData.memo,
        status: formData.status || "NOT_STARTED",
        total_price: formData.total_price
          ? parseFloat(formData.total_price)
          : null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        quality: "STANDARD",
        count:
          formData.items?.reduce(
            (acc: number, item: any) => acc + (parseInt(item.quantity) || 0),
            0,
          ) || 0,
        edition: "MULTIPLE_EDITIONS",
        updatedAt: new Date(),
        printorder_items: {
          create:
            formData.items?.map((item: any) => ({
              bookedition: { connect: { id: parseInt(item.bookEditionId) } },
              quantity: parseInt(item.quantity),
              price_per_book: parseFloat(item.price_per_book) || 0,
              status: item.status || "NOT_STARTED",
            })) || [],
        },
      },
    });
    revalidatePath("/admin_dashboard/printing/manage");
    revalidatePath("/admin_dashboard/printing/printers");
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Create Print Order Error:", error);
    return {
      success: false,
      error: error.message || "Failed to create print order",
    };
  }
}

export async function updatePrintOrder(id: number, formData: any) {
  try {
    const updatedOrder = await (prisma as any).printorder.update({
      where: { id },
      data: {
        project_name: formData.project_name || null,
        printerId: parseInt(formData.printerId),
        memo: formData.memo,
        status: formData.status,
        total_price: formData.total_price
          ? parseFloat(formData.total_price)
          : null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        quality: "STANDARD",
        count:
          formData.items?.reduce(
            (acc: number, item: any) => acc + (parseInt(item.quantity) || 0),
            0,
          ) || 0,
        edition: "MULTIPLE_EDITIONS",
        updatedAt: new Date(),
      },
    });

    // Only update items if they are provided in the payload
    if (formData.items) {
      await (prisma as any).printorder_items.deleteMany({
        where: { printorder_id: id },
      });
      if (formData.items.length > 0) {
        await (prisma as any).printorder_items.createMany({
          data: formData.items.map((item: any) => ({
            printorder_id: id,
            bookEditionId: parseInt(item.bookEditionId),
            quantity: parseInt(item.quantity),
            price_per_book: parseFloat(item.price_per_book),
            status: item.status || "NOT_STARTED",
          })),
        });
      }
    }

    revalidatePath("/admin_dashboard/printing/manage");
    return { success: true, data: updatedOrder };
  } catch (error: any) {
    console.error("Update Print Order Error:", error);
    return {
      success: false,
      error: error.message || "Failed to update print order",
    };
  }
}

export async function deletePrintOrder(id: number) {
  try {
    await (prisma as any).printorder.update({
      where: { id },
      data: { is_deleted: true, deletedAt: new Date(), updatedAt: new Date() },
    });
    revalidatePath("/admin_dashboard/printing/manage");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete print order" };
  }
}

export async function addPrintOrderPayment(orderId: number, data: { amount: number, payment_date: string, reference?: string }) {
    try {
        const payment = await (prisma as any).printorder_payments.create({
            data: {
                printorder_id: orderId,
                amount: data.amount,
                payment_date: new Date(data.payment_date),
                reference: data.reference || null
            }
        })
        revalidatePath(`/admin_dashboard/printing/manage/${orderId}`)
        return { success: true, data: payment }
    } catch (error: any) {
        console.error("Add Payment Error:", error)
        return { success: false, error: "Failed to add payment" }
    }
}

export async function deletePrintOrderPayment(paymentId: number, orderId: number) {
    try {
        await (prisma as any).printorder_payments.delete({
            where: { id: paymentId }
        })
        revalidatePath(`/admin_dashboard/printing/manage/${orderId}`)
        return { success: true }
    } catch (error: any) {
        console.error("Delete Payment Error:", error)
        return { success: false, error: "Failed to delete payment" }
    }
}
