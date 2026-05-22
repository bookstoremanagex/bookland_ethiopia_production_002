"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function searchBooks(query: string, page: number = 0, pageSize: number = 7) {
    try {
        const books = await (prisma as any).books.findMany({
            where: {
                is_deleted: false,
                OR: [
                    { title: { contains: query } },
                    { author: { contains: query } },
                    { isbn: { contains: query } },
                ],
            },
            skip: page * pageSize,
            take: pageSize,
            orderBy: {
                title: 'asc',
            },
        });

        const totalCount = await (prisma as any).books.count({
            where: {
                is_deleted: false,
                OR: [
                    { title: { contains: query } },
                    { author: { contains: query } },
                    { isbn: { contains: query } },
                ],
            },
        });

        return { success: true, data: books, totalCount };
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
        });

        revalidatePath(`/admin_dashboard/stores/${storeId}`);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Transfer error:", error);
        return { success: false, error: error.message || "Transfer failed" };
    }
}
