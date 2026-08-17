"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function searchBooks(query: string, page: number = 0, pageSize: number = 7, excludeOrderId?: number) {
    try {
        let books;

        if (query) {
            // Use MySQL FULLTEXT search (MATCH...AGAINST) which is significantly
            // faster than LIKE '%query%' on large datasets. Falls back to LIKE
            // if the FULLTEXT index hasn't been created yet.
            try {
                const searchResults = (await (prisma as any).$queryRawUnsafe(
                    `SELECT id FROM Books WHERE MATCH(title, author, isbn) AGAINST(? IN BOOLEAN MODE) AND is_deleted = false ORDER BY title ASC LIMIT ? OFFSET ?`,
                    `${query}*`,
                    pageSize,
                    page * pageSize,
                )) as { id: number }[];
                const ids = searchResults.map((r: any) => r.id);

                if (ids.length === 0) {
                    return { success: true, data: [], totalCount: 0 };
                }

                books = await (prisma as any).books.findMany({
                    where: { id: { in: ids }, is_deleted: false },
                    include: {
                        bookedition: {
                            where: { is_deleted: false },
                            include: {
                                bookeditionstores: {
                                    where: { is_deleted: false, quantity: { gt: 0 } },
                                    select: { id: true, quantity: true },
                                },
                            },
                        },
                    },
                    orderBy: { title: "asc" },
                });
            } catch {
                // Fallback to LIKE search if FULLTEXT index doesn't exist
                const where: any = { is_deleted: false };
                where.OR = [
                    { title: { contains: query } },
                    { author: { contains: query } },
                    { isbn: { contains: query } },
                ];
                books = await (prisma as any).books.findMany({
                    where,
                    include: {
                        bookedition: {
                            where: { is_deleted: false },
                            include: {
                                bookeditionstores: {
                                    where: { is_deleted: false, quantity: { gt: 0 } },
                                    select: { id: true, quantity: true },
                                },
                            },
                        },
                    },
                    skip: page * pageSize,
                    take: pageSize,
                });
            }
        } else {
            // No query — load all available books
            books = await (prisma as any).books.findMany({
                where: { is_deleted: false },
                include: {
                    bookedition: {
                        where: { is_deleted: false },
                        include: {
                            bookeditionstores: {
                                where: { is_deleted: false, quantity: { gt: 0 } },
                                select: { id: true, quantity: true },
                            },
                        },
                    },
                },
                skip: page * pageSize,
                take: pageSize,
            });
        }

        // Sort: in-stock books first, then alphabetically by title
        const sorted = books.sort((a: any, b: any) => {
            const aHasStock = a.bookedition.some((ed: any) => ed.bookeditionstores.length > 0);
            const bHasStock = b.bookedition.some((ed: any) => ed.bookeditionstores.length > 0);
            if (aHasStock && !bHasStock) return -1;
            if (!aHasStock && bHasStock) return 1;
            return a.title.localeCompare(b.title);
        });

        // Fetch locked amounts for all editions across all returned books
        const allEditionIds = sorted.flatMap((book: any) =>
            book.bookedition.map((ed: any) => ed.id)
        );
        const lockedMap: Record<number, number> = {};
        if (allEditionIds.length > 0) {
            const lockWhere: any = {
                editionId: { in: allEditionIds },
                status: "locked",
                is_deleted: false,
            };
            if (excludeOrderId !== undefined) {
                lockWhere.order_id = { not: excludeOrderId };
            }
            const lockedRecords = await (prisma as any).locked_editions.findMany({
                where: lockWhere,
            });
            for (const lr of lockedRecords) {
                lockedMap[lr.editionId] = (lockedMap[lr.editionId] || 0) + lr.amount_locked;
            }
        }

        // Map to clean objects, including edition stock data so callers
        // don't need a separate getBookStockData() call
        const mapped = sorted.map((book: any) => {
            const hasStoreStock = book.bookedition.some((ed: any) => ed.bookeditionstores.length > 0);
            const editionStock = book.bookedition.map((ed: any) => {
                const totalStock = ed.bookeditionstores.reduce(
                    (acc: number, s: any) => acc + (s.quantity || 0),
                    0,
                );
                const locked = lockedMap[ed.id] || 0;
                return {
                    id: ed.id,
                    name: ed.edition_name,
                    price: ed.selling_price || 0,
                    stock: Math.max(0, totalStock - locked),
                };
            });
            const { bookedition, ...rest } = book;
            return { ...rest, hasStoreStock, editionStock };
        });

        return { success: true, data: mapped, totalCount: mapped.length };
    } catch (error) {
        console.error("Search books error:", error);
        return { success: false, error: "Failed to search books" };
    }
}

export async function getBookEditionsForTransfer(bookId: number) {
    try {
        const id = Number(bookId);
        console.log("Fetching editions for bookId:", id);
        const editions = await (prisma as any).bookedition.findMany({
            where: {
                bookId: id,
                is_deleted: false,
                count_remening_for_transfer: { gt: 0 },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log("Found editions:", editions?.length || 0);
        return { success: true, data: editions };
    } catch (error) {
        console.error("Fetch editions error:", error);
        return { success: false, error: "Failed to fetch editions: " + (error instanceof Error ? error.message : String(error)) };
    }
}

/**
 * Find active printorder_items for an edition and record printer delivery records
 * by distributing the quantity across items starting from the most recent.
 */
async function recordPrinterDeliveries(
    tx: any,
    editionId: number,
    storeId: number,
    quantity: number
) {
    // Find all non-deleted printorder_items for this edition, ordered most recent first
    const items = await tx.printorder_items.findMany({
        where: {
            bookEditionId: editionId,
            is_deleted: false,
        },
        orderBy: { createdAt: 'desc' },
        include: {
            printorder: true,
            printer_delivery_records: {
                where: { is_deleted: false },
                select: { quantity_deliverd: true },
            },
        },
    });

    const isAutoDeliveryOrder = (o: any): boolean => {
        const name = o?.project_name || "";
        return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
    };

    // Prefer real (non-auto-delivery) print orders so new deliveries are attributed
    // to the edition's actual printing project instead of dummy auto-delivery orders.
    const realItems = items.filter((i: any) => !isAutoDeliveryOrder(i.printorder));
    const dummyItems = items.filter((i: any) => isAutoDeliveryOrder(i.printorder));
    let orderedItems = [...realItems, ...dummyItems];

    // If no printorder_items exist, create a minimal one on the fly
    if (orderedItems.length === 0) {
        const edition = await tx.bookedition.findUnique({
            where: { id: editionId },
            include: { books: true },
        });

        // Prefer the edition's connected printer (same source as Manage Printing
        // and edition details) so delivery records show the correct printer.
        const connected = await tx.bookeditionprinters.findFirst({
            where: { editionId, is_deleted: false },
            include: { printer: true },
            orderBy: { updatedAt: "desc" },
        });

        let printerId = connected?.printerId ?? null;

        // No connected printer -> fall back to the edition's most recent real
        // (non-auto-delivery) print order's printer before using an arbitrary one.
        if (!printerId) {
            const realOrderItem = await tx.printorder_items.findFirst({
                where: { bookEditionId: editionId, is_deleted: false },
                include: { printorder: true },
                orderBy: { createdAt: "desc" },
            });
            if (realOrderItem?.printorder && !isAutoDeliveryOrder(realOrderItem.printorder)) {
                printerId = realOrderItem.printorder.printerId ?? null;
            }
        }

        if (!printerId) {
            const anyPrinter = await tx.printer.findFirst({
                where: { is_deleted: false },
                select: { id: true },
            });
            printerId = anyPrinter?.id ?? null;
        }

        if (!printerId) {
            console.warn(`[recordPrinterDeliveries] No printer found to create fallback printorder for editionId=${editionId}`);
            return;
        }

        const dummyOrder = await tx.printorder.create({
            data: {
                project_name: `Auto-delivery for ${edition?.books?.title || `Edition #${editionId}`}`,
                printerId: printerId,
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

        orderedItems = [{
            ...dummyItem,
            printer_delivery_records: [],
        }];
    }

    let remainingToDeliver = quantity;

    for (const item of orderedItems) {
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

    // If existing items are exhausted, add a new printorder_item to a real
    // print order (fall back to any available order for the edition).
    if (remainingToDeliver > 0 && orderedItems.length > 0) {
        const parentOrderId = realItems[0]?.printorder_id || orderedItems[0].printorder_id;

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

export async function transferToStore(storeId: number, transfers: { editionId: number, quantity: number }[]) {
    try {
        // Run as a transaction to ensure data integrity
        const result = await (prisma as any).$transaction(async (tx: any) => {
            const transferResults = [];

            for (const transfer of transfers) {
                // 1. Check availability
                const edition = await tx.bookedition.findUnique({
                    where: { id: transfer.editionId },
                    select: { count_remening_for_transfer: true }
                });

                if (!edition || (edition.count_remening_for_transfer || 0) < transfer.quantity) {
                    throw new Error(`Insufficient stock for edition ID ${transfer.editionId}`);
                }

                // 2. Decrease central inventory
                await tx.bookedition.update({
                    where: { id: transfer.editionId },
                    data: {
                        count_remening_for_transfer: {
                            decrement: transfer.quantity
                        }
                    }
                });

                // 3. Update or create store inventory record
                const existingStoreStock = await tx.bookeditionstores.findFirst({
                    where: {
                        storeId: storeId,
                        editionId: transfer.editionId,
                        is_deleted: false,
                    }
                });

                if (existingStoreStock) {
                    await tx.bookeditionstores.update({
                        where: { id: existingStoreStock.id },
                        data: {
                            quantity: {
                                increment: transfer.quantity
                            },
                            updatedAt: new Date(),
                        }
                    });
                } else {
                    await tx.bookeditionstores.create({
                        data: {
                            storeId: storeId,
                            editionId: transfer.editionId,
                            quantity: transfer.quantity,
                            updatedAt: new Date(),
                        }
                    });
                }

                // 4. Record printer delivery records
                await recordPrinterDeliveries(tx, transfer.editionId, storeId, transfer.quantity);

                transferResults.push({ editionId: transfer.editionId, quantity: transfer.quantity });
            }

            return transferResults;
        }, { timeout: 15000 });

        revalidatePath(`/admin_dashboard/stores/${storeId}`);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Transfer error:", error);
        return { success: false, error: error.message || "Transfer failed" };
    }
}
