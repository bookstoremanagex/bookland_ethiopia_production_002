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
              total_price: item.total_price
                ? parseFloat(item.total_price)
                : (parseInt(item.quantity) * (parseFloat(item.price_per_book) || 0)),
              content: item.content || null,
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
        printer: { connect: { id: parseInt(formData.printerId) } },
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

    // Reconcile items by ID instead of delete-all + re-create, so existing rows
    // keep their IDs and are only touched when their values actually change.
    // Only rows the user removed from the list are deleted.
    if (formData.items) {
      const currentItems = await (prisma as any).printorder_items.findMany({
        where: { printorder_id: id },
        select: { id: true },
      });
      const currentIds = currentItems.map((i: any) => i.id);

      const keptIds = new Set<number>();
      const itemsToCreate: any[] = [];
      const itemsToUpdate: any[] = [];

      for (const item of formData.items) {
        const bookEditionId = parseInt(item.bookEditionId);
        const quantity = parseInt(item.quantity) || 0;
        // Never send NaN to Prisma — coerce any non-finite price to 0
        const pricePerBook = parseFloat(item.price_per_book);
        const safePricePerBook = Number.isFinite(pricePerBook) && pricePerBook >= 0 ? pricePerBook : 0;
        const statedTotal = parseFloat(item.total_price);
        const totalPrice =
          item.total_price && Number.isFinite(statedTotal)
            ? statedTotal
            : quantity * safePricePerBook;

        const payload = {
          bookEditionId,
          quantity,
          price_per_book: safePricePerBook,
          total_price: totalPrice,
          content: item.content || null,
          status: item.status || "NOT_STARTED",
        };

        const rawId = Number(item.id);
        if (Number.isInteger(rawId) && currentIds.includes(rawId)) {
          keptIds.add(rawId);
          itemsToUpdate.push({ id: rawId, data: payload });
        } else {
          itemsToCreate.push({ printorder_id: id, ...payload });
        }
      }

      // Delete only the rows the user removed from the project
      const removed = currentItems.filter((i: any) => !keptIds.has(i.id));
      if (removed.length > 0) {
        await (prisma as any).printorder_items.deleteMany({
          where: { id: { in: removed.map((i: any) => i.id) } },
        });
      }

      for (const u of itemsToUpdate) {
        await (prisma as any).printorder_items.update({
          where: { id: u.id },
          data: u.data,
        });
      }

      if (itemsToCreate.length > 0) {
        await (prisma as any).printorder_items.createMany({
          data: itemsToCreate,
        });
      }
    }

    revalidatePath("/admin_dashboard/printing/manage");
    revalidatePath(`/admin_dashboard/printing/manage/${id}`);
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

export async function quickCreateBook(data: {
  title: string;
  author: string;
  category: string;
  publication_year: string;
  language?: string;
}) {
  try {
    const unique_code = `BOOK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const sku = `SKU-${data.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const book = await (prisma as any).books.create({
      data: {
        title: data.title,
        author: data.author,
        category: data.category,
        publication_year: data.publication_year,
        language: data.language || null,
        unique_identification_code: unique_code,
        book_sku: sku,
        status: "available",
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin_dashboard/printing/manage");
    revalidatePath("/admin_dashboard/books");
    return { success: true, data: book };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create book" };
  }
}

export async function quickCreateEdition(data: {
  edition_name: string;
  bookId: number;
  total_print_count?: number;
  number_of_pages?: number;
  production_price?: number;
}) {
  try {
    const edition = await (prisma as any).bookedition.create({
      data: {
        edition_name: data.edition_name,
        bookId: data.bookId,
        total_print_count: data.total_print_count || 0,
        count_remening_for_transfer: data.total_print_count || 0,
        number_of_pages: data.number_of_pages || 0,
        production_price: data.production_price || 0,
        selling_price: data.production_price || 0,
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin_dashboard/printing/manage");
    revalidatePath("/admin_dashboard/books");
    return { success: true, data: edition };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create edition" };
  }
}

export async function updatePrintOrderItemStatus(itemId: number, status: string) {
  try {
    const current = await (prisma as any).printorder_items.findUnique({ where: { id: itemId } });
    if (!current) return { success: false, error: "Item not found" };
    if (current.status === "COMPLETED" && status !== "COMPLETED") {
      return { success: false, error: "Cannot revert a completed item" };
    }
    await (prisma as any).printorder_items.update({
      where: { id: itemId },
      data: { status, updatedAt: new Date() },
    });
    revalidatePath("/printer_dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update status" };
  }
}

export async function updatePrintOrderStatus(orderId: number, status: string) {
  try {
    const current = await (prisma as any).printorder.findUnique({ where: { id: orderId } });
    if (!current) return { success: false, error: "Project not found" };
    if (current.status === "COMPLETED" && status !== "COMPLETED") {
      return { success: false, error: "Cannot revert a completed project" };
    }
    await (prisma as any).printorder.update({
      where: { id: orderId },
      data: { status, updatedAt: new Date() },
    });
    revalidatePath("/printer_dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update project status" };
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

export async function updatePrintOrderPayment(paymentId: number, orderId: number, data: { reference?: string | null }) {
    try {
        const updateData: any = {}
        if (data.reference !== undefined) updateData.reference = data.reference || null
        await (prisma as any).printorder_payments.update({
            where: { id: paymentId },
            data: updateData
        })
        revalidatePath(`/admin_dashboard/printing/manage/${orderId}`)
        return { success: true }
    } catch (error: any) {
        console.error("Update Payment Error:", error)
        return { success: false, error: "Failed to update payment" }
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

export async function changeEditionPrinter(data: {
    orderId: number;
    editionId: number;
    newPrinterId: number;
}) {
    const { orderId, editionId, newPrinterId } = data;
    try {
        await (prisma as any).$transaction(async (tx: any) => {
            const edition = await tx.bookedition.findUnique({
                where: { id: editionId },
                select: { count_remening_for_transfer: true }
            });
            if (!edition) throw new Error("Edition not found");

            // 1. Re-point the print order to the new printer
            await tx.printorder.update({
                where: { id: orderId },
                data: { printerId: newPrinterId, updatedAt: new Date() }
            });

            // 2. Move ALL physical stock for this edition to the new printer
            const printerStocks = await tx.bookeditionprinters.findMany({
                where: { editionId, is_deleted: false }
            });

            if (printerStocks.length > 0) {
                const totalQuantity = printerStocks.reduce(
                    (sum: number, s: any) => sum + (s.quantity || 0),
                    0
                );

                // Soft-delete all current printer links for this edition
                await tx.bookeditionprinters.updateMany({
                    where: { editionId, is_deleted: false },
                    data: { is_deleted: true, updatedAt: new Date() }
                });

                // Merge into the new printer if stock already exists there, else create
                const existing = await tx.bookeditionprinters.findFirst({
                    where: { editionId, printerId: newPrinterId, is_deleted: false }
                });

                if (existing) {
                    await tx.bookeditionprinters.update({
                        where: { id: existing.id },
                        data: {
                            quantity: { increment: totalQuantity },
                            is_deleted: false,
                            updatedAt: new Date()
                        }
                    });
                } else {
                    await tx.bookeditionprinters.create({
                        data: {
                            editionId,
                            printerId: newPrinterId,
                            quantity: totalQuantity,
                            updatedAt: new Date()
                        }
                    });
                }
            }
        }, { timeout: 15000 });

        revalidatePath("/admin_dashboard/printing/list");
        revalidatePath(`/admin_dashboard/printing/printers/${newPrinterId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Change Edition Printer Error:", error);
        return {
            success: false,
            error: error.message || "Failed to change printer"
        };
    }
}

export async function moveEditionToProject(data: {
    orderItemId: number;
    editionId: number;
    sourceOrderId: number;
    targetOrderId: number;
}) {
    const { orderItemId, editionId, sourceOrderId, targetOrderId } = data;
    try {
        if (sourceOrderId === targetOrderId) {
            return { success: false, error: "Book is already in this project" };
        }

        await (prisma as any).$transaction(async (tx: any) => {
            const targetOrder = await tx.printorder.findUnique({
                where: { id: targetOrderId },
                select: { printerId: true }
            });
            if (!targetOrder) throw new Error("Target project not found");
            if (!targetOrder.printerId) throw new Error("Target project has no printer assigned");

            const sourceItem = await tx.printorder_items.findUnique({
                where: { id: orderItemId },
                select: { quantity: true, total_price: true }
            });
            if (!sourceItem) throw new Error("Source order item not found");

            // 1. Move the print order item to the target project
            const targetPrinterId = targetOrder.printerId;

            // Check if the edition already exists in the target project (merge case)
            const existingInTarget = await tx.printorder_items.findFirst({
                where: {
                    printorder_id: targetOrderId,
                    bookEditionId: editionId,
                    is_deleted: false
                }
            });

            if (existingInTarget) {
                // Merge quantities into the existing target row, then soft-delete source
                await tx.printorder_items.update({
                    where: { id: existingInTarget.id },
                    data: {
                        quantity: { increment: sourceItem.quantity },
                        total_price: { increment: sourceItem.total_price || 0 },
                        updatedAt: new Date()
                    }
                });
                await tx.printorder_items.update({
                    where: { id: orderItemId },
                    data: { is_deleted: true, updatedAt: new Date() }
                });
            } else {
                // Re-point the source item to the target project
                await tx.printorder_items.update({
                    where: { id: orderItemId },
                    data: { printorder_id: targetOrderId, updatedAt: new Date() }
                });
            }

            // 2. Recompute target order count
            const targetItems = await tx.printorder_items.findMany({
                where: { printorder_id: targetOrderId, is_deleted: false }
            });
            await tx.printorder.update({
                where: { id: targetOrderId },
                data: {
                    count: targetItems.reduce((s: number, i: any) => s + (i.quantity || 0), 0),
                    updatedAt: new Date()
                }
            });

            // 3. Move ALL physical stock for this edition to the target project's printer
            const printerStocks = await tx.bookeditionprinters.findMany({
                where: { editionId, is_deleted: false }
            });

            if (printerStocks.length > 0) {
                const totalQuantity = printerStocks.reduce(
                    (sum: number, s: any) => sum + (s.quantity || 0),
                    0
                );

                await tx.bookeditionprinters.updateMany({
                    where: { editionId, is_deleted: false },
                    data: { is_deleted: true, updatedAt: new Date() }
                });

                const existing = await tx.bookeditionprinters.findFirst({
                    where: { editionId, printerId: targetPrinterId, is_deleted: false }
                });

                if (existing) {
                    await tx.bookeditionprinters.update({
                        where: { id: existing.id },
                        data: {
                            quantity: { increment: totalQuantity },
                            is_deleted: false,
                            updatedAt: new Date()
                        }
                    });
                } else {
                    await tx.bookeditionprinters.create({
                        data: {
                            editionId,
                            printerId: targetPrinterId,
                            quantity: totalQuantity,
                            updatedAt: new Date()
                        }
                    });
                }
            }

            // 4. Recompute source order count (and clear printer assignment on source if empty)
            const sourceItems = await tx.printorder_items.findMany({
                where: { printorder_id: sourceOrderId, is_deleted: false }
            });
            await tx.printorder.update({
                where: { id: sourceOrderId },
                data: {
                    count: sourceItems.reduce((s: number, i: any) => s + (i.quantity || 0), 0),
                    updatedAt: new Date()
                }
            });
        }, { timeout: 15000 });

        revalidatePath("/admin_dashboard/printing/list");
        revalidatePath(`/admin_dashboard/printing/manage/${sourceOrderId}`);
        revalidatePath(`/admin_dashboard/printing/manage/${targetOrderId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Move Edition To Project Error:", error);
        return {
            success: false,
            error: error.message || "Failed to move book to project"
        };
    }
}
