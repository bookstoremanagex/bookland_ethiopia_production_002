"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDamagedBooks() {
    try {
        const damagedBooks = await (prisma as any).damagedbooks.findMany({
            where: { is_deleted: false },
            include: {
                books: true,
                bookedition: true,
                stores: true,
                accounts: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: damagedBooks };
    } catch (error) {
        console.error("Failed to fetch damaged books:", error);
        return { success: false, error: "Failed to fetch damaged books" };
    }
}

export async function getDamagedBookById(id: number) {
    try {
        const damagedBook = await (prisma as any).damagedbooks.findUnique({
            where: { id },
            include: {
                books: true,
                bookedition: true,
                stores: true,
                accounts: true
            }
        });
        if (!damagedBook || damagedBook.is_deleted) return { success: false, error: "Report not found" };
        return { success: true, data: damagedBook };
    } catch (error) {
        return { success: false, error: "Failed to fetch report" };
    }
}

export async function getEditionDamageSources(editionId: number) {
    try {
        const edition = await (prisma as any).bookedition.findUnique({
            where: { id: editionId },
            include: {
                books: { select: { id: true, title: true } },
                bookeditionstores: {
                    where: { is_deleted: false },
                    include: { stores: { select: { id: true, name: true } } },
                },
            },
        });
        if (!edition || edition.is_deleted) return { success: false, error: "Edition not found" };

        const stores = edition.bookeditionstores
            .filter((s: any) => (s.quantity || 0) > 0)
            .map((s: any) => ({
                storeStockId: s.id,
                storeId: s.storeId,
                storeName: s.stores?.name || `Store #${s.storeId}`,
                available: s.quantity || 0,
            }));

        return {
            success: true,
            data: {
                bookTitle: edition.books?.title,
                editionName: edition.edition_name,
                totalPrintCount: Number(edition.total_print_count || 0),
                stores,
                centralAvailable: Math.max(0, Number(edition.count_remening_for_transfer || 0)),
            },
        };
    } catch (error) {
        console.error("Failed to fetch damage sources:", error);
        return { success: false, error: "Failed to fetch damage sources" };
    }
}

export async function createDamagedBookReport(data: any, allocations: any[] = []) {
    try {
        const bookId = parseInt(data.book_id);
        const editionId = parseInt(data.edition_id);
        const totalCount = parseInt(data.count);
        if (!bookId || !editionId || !totalCount || totalCount < 1) {
            return { success: false, error: "Book, edition and a positive count are required" };
        }

        const edition = await (prisma as any).bookedition.findUnique({
            where: { id: editionId },
            include: { bookeditionstores: { where: { is_deleted: false } } },
        });
        if (!edition || edition.is_deleted) return { success: false, error: "Edition not found" };

        // If no allocations provided, fall back to a single store allocation
        const resolvedAllocations = allocations.length > 0 ? allocations : [{
            sourceType: data.store_id ? "store" : "central",
            storeStockId: data.store_id ? (edition.bookeditionstores.find((s: any) => s.storeId === parseInt(data.store_id))?.id || null) : null,
            quantity: totalCount,
        }];

        // Validate allocations sum to total count
        const allocatedSum = resolvedAllocations.reduce((s: number, a: any) => s + (a.quantity || 0), 0);
        if (allocatedSum !== totalCount) {
            return { success: false, error: `Allocation total (${allocatedSum}) must equal damaged count (${totalCount})` };
        }

        // Validate each source has enough stock
        for (const alloc of resolvedAllocations) {
            if ((alloc.quantity || 0) <= 0) continue;
            if (alloc.sourceType === "central") {
                const centralAvailable = Number(edition.count_remening_for_transfer || 0);
                if (alloc.quantity > centralAvailable) {
                    return { success: false, error: `Insufficient untransferred stock: only ${centralAvailable} available at central` };
                }
            } else {
                const stock = edition.bookeditionstores.find((s: any) => s.id === alloc.storeStockId);
                if (!stock || (stock.quantity || 0) < alloc.quantity) {
                    return { success: false, error: `Insufficient stock at store for ${alloc.quantity} units` };
                }
            }
        }

        const result = await (prisma as any).$transaction(async (tx: any) => {
            for (const alloc of resolvedAllocations) {
                if ((alloc.quantity || 0) <= 0) continue;
                if (alloc.sourceType === "central") {
                    await tx.bookedition.update({
                        where: { id: editionId },
                        data: { count_remening_for_transfer: { decrement: alloc.quantity }, updatedAt: new Date() },
                    });
                } else {
                    await tx.bookeditionstores.update({
                        where: { id: alloc.storeStockId },
                        data: { quantity: { decrement: alloc.quantity }, updatedAt: new Date() },
                    });
                }
            }

            const primaryStoreId = resolvedAllocations.find((a: any) => a.sourceType !== "central")?.storeId || null;

            const report = await tx.damagedbooks.create({
                data: {
                    type: data.type,
                    book_id: bookId,
                    edition_id: editionId,
                    store_id: primaryStoreId ? parseInt(primaryStoreId) : null,
                    count: totalCount,
                    memo: data.memo,
                    updatedAt: new Date()
                }
            });
            return report;
        }, { timeout: 30000 });

        revalidatePath("/admin_dashboard/books/damaged");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to create damage report:", error);
        return { success: false, error: "Failed to create damage report" };
    }
}

export async function updateDamagedBookReport(id: number, data: any) {
    try {
        const existing = await (prisma as any).damagedbooks.findUnique({
            where: { id },
        });
        if (!existing || existing.is_deleted) return { success: false, error: "Report not found" };

        const oldEditionId = existing.edition_id;
        const oldStoreId = existing.store_id;
        const oldCount = existing.count || 0;

        const newEditionId = parseInt(data.edition_id);
        const newStoreId = data.store_id ? parseInt(data.store_id) : null;
        const newCount = parseInt(data.count);
        if (!newEditionId || !newCount || newCount < 1) {
            return { success: false, error: "Edition and a positive count are required" };
        }

        const result = await (prisma as any).$transaction(async (tx: any) => {
            // Refund the previously deducted stock
            await refundDamageStock(tx, oldEditionId, oldStoreId, oldCount);
            // Deduct the new allocation
            await deductDamageStock(tx, newEditionId, newStoreId, newCount);

            const updated = await tx.damagedbooks.update({
                where: { id },
                data: {
                    type: data.type,
                    book_id: parseInt(data.book_id),
                    edition_id: newEditionId,
                    store_id: newStoreId,
                    count: newCount,
                    memo: data.memo,
                    updatedAt: new Date()
                }
            });
            return updated;
        }, { timeout: 30000 });

        revalidatePath("/admin_dashboard/books/damaged");
        revalidatePath(`/admin_dashboard/books/damaged/${id}`);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to update damage report:", error);
        return { success: false, error: error.message || "Failed to update report" };
    }
}

export async function deleteDamagedBookReport(id: number) {
    try {
        const existing = await (prisma as any).damagedbooks.findUnique({
            where: { id },
        });
        if (!existing || existing.is_deleted) return { success: false, error: "Report not found" };

        await (prisma as any).$transaction(async (tx: any) => {
            // Return the deducted stock back to its source
            await refundDamageStock(tx, existing.edition_id, existing.store_id, existing.count || 0);
            await tx.damagedbooks.update({
                where: { id },
                data: { is_deleted: true, updatedAt: new Date() }
            });
        }, { timeout: 30000 });

        revalidatePath("/admin_dashboard/books/damaged");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete damage report:", error);
        return { success: false, error: error.message || "Failed to delete report" };
    }
}

async function refundDamageStock(tx: any, editionId: number, storeId: number | null, count: number) {
    if (count <= 0) return;
    if (!storeId) {
        await tx.bookedition.update({
            where: { id: editionId },
            data: { count_remening_for_transfer: { increment: count }, updatedAt: new Date() },
        });
        return;
    }
    const storeStock = await tx.bookeditionstores.findFirst({
        where: { editionId, storeId, is_deleted: false },
    });
    if (storeStock) {
        await tx.bookeditionstores.update({
            where: { id: storeStock.id },
            data: { quantity: { increment: count }, updatedAt: new Date() },
        });
    } else {
        await tx.bookeditionstores.create({
            data: {
                editionId,
                storeId,
                quantity: count,
                is_deleted: false,
                updatedAt: new Date(),
            },
        });
    }
}

async function deductDamageStock(tx: any, editionId: number, storeId: number | null, count: number) {
    if (count <= 0) return;
    if (!storeId) {
        const edition = await tx.bookedition.findUnique({ where: { id: editionId } });
        const available = Number(edition?.count_remening_for_transfer || 0);
        if (available < count) {
            throw new Error(`Insufficient untransferred stock: only ${available} available at central`);
        }
        await tx.bookedition.update({
            where: { id: editionId },
            data: { count_remening_for_transfer: { decrement: count }, updatedAt: new Date() },
        });
        return;
    }
    const storeStock = await tx.bookeditionstores.findFirst({
        where: { editionId, storeId, is_deleted: false },
    });
    if (!storeStock || (storeStock.quantity || 0) < count) {
        throw new Error(`Insufficient stock at store for ${count} units`);
    }
    await tx.bookeditionstores.update({
        where: { id: storeStock.id },
        data: { quantity: { decrement: count }, updatedAt: new Date() },
    });
}
