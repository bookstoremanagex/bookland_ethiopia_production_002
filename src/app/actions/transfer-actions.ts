"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function searchBooks(query: string, page: number = 0, pageSize: number = 7) {
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

        // Map to clean objects, including edition stock data so callers
        // don't need a separate getBookStockData() call
        const mapped = sorted.map((book: any) => {
            const hasStoreStock = book.bookedition.some((ed: any) => ed.bookeditionstores.length > 0);
            const editionStock = book.bookedition.map((ed: any) => {
                const totalStock = ed.bookeditionstores.reduce(
                    (acc: number, s: any) => acc + (s.quantity || 0),
                    0,
                );
                return {
                    id: ed.id,
                    name: ed.edition_name,
                    price: ed.selling_price || 0,
                    stock: totalStock,
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
