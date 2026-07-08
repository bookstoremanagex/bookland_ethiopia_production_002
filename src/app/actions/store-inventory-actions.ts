"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";

export async function getAllStores() {
    try {
        const stores = await (prisma as any).stores.findMany({
            where: { is_deleted: false },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: stores };
    } catch (error) {
        return { success: false, error: "Failed to fetch stores" };
    }
}

/**
 * Find active printorder_items for an edition and record printer delivery records
 * by distributing the quantity across items starting from the most recent.
 * If no printorder_items exist, creates a minimal one on the fly.
 */
async function recordPrinterDeliveries(
    tx: any,
    editionId: number,
    storeId: number,
    quantity: number
) {
    let items = await tx.printorder_items.findMany({
        where: {
            bookEditionId: editionId,
            is_deleted: false,
        },
        orderBy: { createdAt: 'desc' },
        include: {
            printer_delivery_records: {
                where: { is_deleted: false },
                select: { quantity_deliverd: true },
            },
        },
    });

    // If no printorder_items exist, create a minimal one on the fly
    if (items.length === 0) {
        const edition = await tx.bookedition.findUnique({
            where: { id: editionId },
            include: { books: true },
        });

        // Find a printer to satisfy the FK constraint
        const anyPrinter = await tx.printer.findFirst({
            where: { is_deleted: false },
            select: { id: true },
        });

        if (!anyPrinter) {
            console.warn(`[recordPrinterDeliveries] No printer found to create fallback printorder for editionId=${editionId}`);
            return;
        }

            // Create a dummy printorder to satisfy the FK constraint
            const dummyOrder = await tx.printorder.create({
                data: {
                    project_name: `Auto-delivery for ${edition?.books?.title || `Edition #${editionId}`}`,
                    printerId: anyPrinter.id,
                    status: "NOT_STARTED",
                    quality: "STANDARD",
                    edition: "SINGLE",
                    count: quantity,
                    is_deleted: false,
                    updatedAt: new Date(),
                },
            });

        const dummyItem = await tx.printorder_items.create({
            data: {
                printorder_id: dummyOrder.id,
                bookEditionId: editionId,
                quantity: quantity,
                price_per_book: 0,
                total_price: 0,
                status: "NOT_STARTED",
                is_deleted: false,
            },
        });

        items = [{
            ...dummyItem,
            printer_delivery_records: [],
        }];
    }

    let remainingToDeliver = quantity;

    for (const item of items) {
        if (remainingToDeliver <= 0) break;

        const alreadyDelivered = (item.printer_delivery_records || []).reduce(
            (sum: number, r: any) => sum + (r.quantity_deliverd || 0),
            0
        );
        const maxDeliverable = (item.quantity || 0) - alreadyDelivered;

        if (maxDeliverable <= 0) continue;

        const deliverNow = Math.min(remainingToDeliver, maxDeliverable);

        await tx.printer_delivery_records.create({
            data: {
                printorder_item_id: item.id,
                storeId: storeId,
                quantity_deliverd: deliverNow,
                approvedByPrinter: false,
                approvedByPrinterAt: null,
                is_deleted: false,
            },
        });

        remainingToDeliver -= deliverNow;
    }

    // If existing items are exhausted, add a new printorder_item to the same printorder
    if (remainingToDeliver > 0 && items.length > 0) {
        const parentOrderId = items[0].printorder_id;

        const newItem = await tx.printorder_items.create({
            data: {
                printorder_id: parentOrderId,
                bookEditionId: editionId,
                quantity: remainingToDeliver,
                price_per_book: 0,
                total_price: 0,
                status: "NOT_STARTED",
                is_deleted: false,
            },
        });

        await tx.printer_delivery_records.create({
            data: {
                printorder_item_id: newItem.id,
                storeId: storeId,
                quantity_deliverd: remainingToDeliver,
                approvedByPrinter: false,
                approvedByPrinterAt: null,
                is_deleted: false,
            },
        });

        remainingToDeliver = 0;
    }
}

export async function assignEditionToStore(data: { editionId: number, storeId: number, quantity: number }) {
    try {
        // Check if already assigned
        const existing = await (prisma as any).bookeditionstores.findFirst({
            where: {
                editionId: data.editionId,
                storeId: data.storeId,
                is_deleted: false
            }
        });

        if (existing) {
            return { success: false, error: "This edition is already assigned to this store. Please update the quantity instead." };
        }

        // Validate against remaining for transfer
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: data.editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);
        if (data.quantity > remaining) {
            return { success: false, error: `Cannot assign ${data.quantity} units. Only ${remaining} remaining for transfer.` };
        }
        if (data.quantity < 0) {
            return { success: false, error: "Quantity cannot be negative." };
        }

        // Create assignment, deduct from remaining, and record delivery in a transaction
        const [assignment] = await (prisma as any).$transaction(async (tx: any) => {
            const created = await tx.bookeditionstores.create({
                data: {
                    editionId: data.editionId,
                    storeId: data.storeId,
                    quantity: data.quantity,
                    updatedAt: new Date()
                },
                include: { stores: true }
            });

            await tx.bookedition.update({
                where: { id: data.editionId },
                data: { count_remening_for_transfer: { decrement: data.quantity } }
            });

            await recordPrinterDeliveries(tx, data.editionId, data.storeId, data.quantity);

            return [created];
        }, { timeout: 15000 });

        const newRemaining = (remaining - data.quantity);
        revalidatePath(`/admin_dashboard/books/editions/${data.editionId}`);
        return { success: true, data: assignment, newRemaining };
    } catch (error) {
        console.error("Failed to assign edition to store:", error);
        return { success: false, error: "Failed to assign edition to store" };
    }
}

export async function updateStoreInventory(id: number, quantity: number, editionId: number) {
    try {
        // Get the current store inventory record
        const current = await (prisma as any).bookeditionstores.findUnique({ where: { id } });
        if (!current) return { success: false, error: "Store inventory record not found" };

        const oldQuantity = Number(current.quantity || 0);
        const diff = quantity - oldQuantity; // positive = increase, negative = decrease

        // Get the edition to check remaining
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);

        if (diff > 0 && diff > remaining) {
            return { success: false, error: `Cannot increase by ${diff}. Only ${remaining} remaining for transfer.` };
        }
        if (quantity < 0) {
            return { success: false, error: "Quantity cannot be negative." };
        }

        // Update store quantity and edition remaining in a transaction
        const [updated] = await (prisma as any).$transaction(async (tx: any) => {
            const updatedRecord = await tx.bookeditionstores.update({
                where: { id },
                data: { quantity, updatedAt: new Date() },
                include: { stores: true }
            });

            await tx.bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: { decrement: diff } }
            });

            // Record delivery only when quantity increased (new books delivered to store)
            if (diff > 0) {
                await recordPrinterDeliveries(tx, editionId, current.storeId, diff);
            }

            return [updatedRecord];
        }, { timeout: 15000 });

        const newRemaining = (remaining - diff);
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true, data: updated, newRemaining };
    } catch (error) {
        return { success: false, error: "Failed to update inventory" };
    }
}

export async function deleteStoreInventory(id: number, editionId: number) {
    try {
        // Get the current record to know how much to return
        const current = await (prisma as any).bookeditionstores.findUnique({ where: { id } });
        if (!current) return { success: false, error: "Store inventory record not found" };

        const quantityToReturn = Number(current.quantity || 0);

        // Get the edition remaining
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);

        // Soft delete and return quantity to remaining in a transaction
        await (prisma as any).$transaction([
            (prisma as any).bookeditionstores.update({
                where: { id },
                data: { is_deleted: true, updatedAt: new Date() }
            }),
            (prisma as any).bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: { increment: quantityToReturn } }
            })
        ], { timeout: 15000 });

        const newRemaining = (remaining + quantityToReturn);
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true, newRemaining };
    } catch (error) {
        return { success: false, error: "Failed to remove from store" };
    }
}

export async function getStoreBooksAndEditions(storeId: number) {
    try {
        const store = await (prisma as any).stores.findUnique({
            where: { id: storeId, is_deleted: false },
            include: {
                bookeditionstores: {
                    where: { is_deleted: false, quantity: { gt: 0 } },
                    include: {
                        bookedition: {
                            include: { books: true }
                        }
                    },
                    orderBy: { updatedAt: 'desc' }
                }
            }
        });
        if (!store) return { success: false, error: "Store not found" };

        // Group editions by book for structured response
        const bookMap: Record<string, any> = {};
        for (const item of store.bookeditionstores) {
            const book = item.bookedition?.books;
            if (!book) continue;
            const key = String(book.id);
            if (!bookMap[key]) {
                bookMap[key] = { bookId: book.id, title: book.title, author: book.author, editions: [] };
            }
            bookMap[key].editions.push({
                id: item.bookedition.id,
                name: item.bookedition.edition_name,
                storeStockId: item.id,
                quantity: item.quantity,
            });
        }

        return { success: true, data: Object.values(bookMap) };
    } catch (error) {
        return { success: false, error: "Failed to fetch store books" };
    }
}

export async function transferBetweenStores(fromStoreId: number, toStoreId: number, transfers: { editionId: number, quantity: number }[]) {
    try {
        if (fromStoreId === toStoreId) {
            return { success: false, error: "Source and destination stores must be different" };
        }

        const result = await (prisma as any).$transaction(async (tx: any) => {
            const results = [];

            for (const t of transfers) {
                if (t.quantity < 1) {
                    throw new Error(`Invalid quantity for edition ID ${t.editionId}`);
                }

                // Check availability in source store
                const fromStock = await tx.bookeditionstores.findFirst({
                    where: {
                        storeId: fromStoreId,
                        editionId: t.editionId,
                        is_deleted: false,
                    }
                });

                const available = Number(fromStock?.quantity || 0);
                if (available < t.quantity) {
                    throw new Error(`Insufficient stock: only ${available} available in source store for edition ID ${t.editionId}`);
                }

                // Deduct from source store
                const newFromQty = available - t.quantity;
                if (newFromQty === 0) {
                    await tx.bookeditionstores.update({
                        where: { id: fromStock.id },
                        data: { quantity: 0, is_deleted: true, updatedAt: new Date() },
                    });
                } else {
                    await tx.bookeditionstores.update({
                        where: { id: fromStock.id },
                        data: { quantity: newFromQty, updatedAt: new Date() },
                    });
                }

                // Add to destination store
                const toStock = await tx.bookeditionstores.findFirst({
                    where: {
                        storeId: toStoreId,
                        editionId: t.editionId,
                        is_deleted: false,
                    }
                });

                if (toStock) {
                    await tx.bookeditionstores.update({
                        where: { id: toStock.id },
                        data: { quantity: { increment: t.quantity }, updatedAt: new Date() },
                    });
                } else {
                    await tx.bookeditionstores.create({
                        data: {
                            storeId: toStoreId,
                            editionId: t.editionId,
                            quantity: t.quantity,
                            updatedAt: new Date(),
                        }
                    });
                }

                results.push({ editionId: t.editionId, quantity: t.quantity });
            }

            return results;
        }, { timeout: 15000 });

        revalidatePath('/admin_dashboard/stores');
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Transfer failed" };
    }
}

export async function getStoreInventoryWithDetails(storeId: number) {
    try {
        const store = await (prisma as any).stores.findUnique({
            where: { id: storeId, is_deleted: false },
            include: {
                bookeditionstores: {
                    where: { is_deleted: false },
                    include: {
                        bookedition: {
                            include: {
                                books: true
                            }
                        }
                    },
                    orderBy: { updatedAt: 'desc' }
                }
            }
        });
        if (!store) return { success: false, error: "Store not found" };
        return { success: true, data: store };
    } catch (error) {
        return { success: false, error: "Failed to fetch store inventory" };
    }
}

export async function batchAssignEditionToStores(
  data: { editionId: number; stores: { storeId: number; quantity: number }[] }
) {
  try {
    const edition = await (prisma as any).bookedition.findUnique({
      where: { id: data.editionId },
      include: { books: true },
    });
    if (!edition) return { success: false, error: "Edition not found" };

    const remaining = Number(edition.count_remening_for_transfer || 0);
    if (data.stores.some((s) => s.quantity < 0)) {
      return { success: false, error: "Quantity cannot be negative." };
    }

    // Fetch existing assignments for these stores
    const existingAssignments = await (prisma as any).bookeditionstores.findMany({
      where: {
        editionId: data.editionId,
        storeId: { in: data.stores.map((s) => s.storeId) },
        is_deleted: false,
      },
    });
    const existingMap = Object.fromEntries(
      existingAssignments.map((e: any) => [e.storeId, e])
    );

    // Compute net delta: positive = taking from remaining, negative = giving back
    let netDelta = 0;
    for (const s of data.stores) {
      const existing = existingMap[s.storeId];
      const oldQty = existing ? Number(existing.quantity || 0) : 0;
      netDelta += s.quantity - oldQty;
    }

    // Validate: can't take more than what's available
    if (netDelta > remaining) {
      return {
        success: false,
        error: `Net increase (${netDelta}) exceeds remaining for transfer (${remaining}).`,
      };
    }

    const now = new Date();
    await (prisma as any).$transaction(async (tx: any) => {
      for (const s of data.stores) {
        const existing = existingMap[s.storeId];
        if (existing) {
          await tx.bookeditionstores.update({
            where: { id: existing.id },
            data: { quantity: s.quantity, updatedAt: now },
          });
        } else {
          await tx.bookeditionstores.create({
            data: {
              editionId: data.editionId,
              storeId: s.storeId,
              quantity: s.quantity,
              updatedAt: now,
            },
          });
        }

        // Record delivery only if this store's quantity increased
        const oldQty = existing ? Number(existing.quantity || 0) : 0;
        const delta = s.quantity - oldQty;
        if (delta > 0) {
          await recordPrinterDeliveries(tx, data.editionId, s.storeId, delta);
        }
      }

      await tx.bookedition.update({
        where: { id: data.editionId },
        data: { count_remening_for_transfer: { decrement: netDelta } },
      });
    }, { timeout: 15000 });

    // Log activity
    const session = await getCurrentSession();
    if (session?.id) {
      const storeNames = await (prisma as any).stores.findMany({
        where: { id: { in: data.stores.map((s) => s.storeId) } },
        select: { id: true, name: true },
      });
      const nameMap = Object.fromEntries(storeNames.map((s: any) => [s.id, s.name]));
      await (prisma as any).activityLogs.create({
        data: {
          accountId: session.id,
          action: `Assigned edition "${edition.edition_name}" to ${data.stores.length} store(s)`,
          details: JSON.stringify({
            editionId: data.editionId,
            editionName: edition.edition_name,
            bookTitle: edition.books?.title,
            stores: data.stores.map((s) => ({
              storeId: s.storeId,
              storeName: nameMap[s.storeId] || `Store #${s.storeId}`,
              quantity: s.quantity,
            })),
          }),
          updatedAt: now,
        },
      });
    }

    const newRemaining = remaining - netDelta;
    revalidatePath(`/admin_dashboard/books/editions/${data.editionId}`);
    return { success: true, newRemaining };
  } catch (error) {
    console.error("Failed to batch assign editions to stores:", error);
    return { success: false, error: "Failed to assign editions to stores" };
  }
}
