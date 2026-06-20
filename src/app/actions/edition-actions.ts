"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEditionsByBookId(bookId: number) {
    try {
        const editions = await (prisma as any).bookedition.findMany({
            where: { 
                bookId,
                is_deleted: false 
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: editions };
    } catch (error) {
        console.error("Failed to fetch editions:", error);
        return { success: false, error: "Failed to fetch editions" };
    }
}

export async function createEdition(data: any) {
    try {
        const edition = await (prisma as any).bookedition.create({
            data: {
                edition_name: data.edition_name,
                selling_price: parseFloat(data.selling_price) || 0,
                production_price: parseFloat(data.production_price) || 0,
                printing_cost: parseFloat(data.printing_cost) || 0,
                binding_cost: parseFloat(data.binding_cost) || 0,
                design_cost: parseFloat(data.design_cost) || 0,
                editing_cost: parseFloat(data.editing_cost) || 0,
                other_expenses: parseFloat(data.other_expenses) || 0,
                transportation_cost: parseFloat(data.transportation_cost) || 0,
                translation_cost: parseFloat(data.translation_cost) || 0,
                translator_cost: data.translator_cost ? parseFloat(data.translator_cost) : undefined,
                cover_design_cost: data.cover_design_cost ? parseFloat(data.cover_design_cost) : undefined,
                text_design_cost: data.text_design_cost ? parseFloat(data.text_design_cost) : undefined,
                editor_cost: data.editor_cost ? parseFloat(data.editor_cost) : undefined,
                typewriting_cost: data.typewriting_cost ? parseFloat(data.typewriting_cost) : undefined,
                store_cost: data.store_cost ? parseFloat(data.store_cost) : undefined,
                distribution_cost: data.distribution_cost ? parseFloat(data.distribution_cost) : undefined,
                advertisement_cost: data.advertisement_cost ? parseFloat(data.advertisement_cost) : undefined,
                purchasing_right_cost: data.purchasing_right_cost ? parseFloat(data.purchasing_right_cost) : undefined,
                memo: data.memo,
                book_image_url: data.book_image_url,
                total_print_count: parseInt(data.total_print_count) || 0,
                count_remening_for_transfer: parseInt(data.total_print_count) || 0,
                number_of_pages: parseInt(data.number_of_pages) || 0,
                bookId: data.bookId,
                updatedAt: new Date()
            }
        });
        revalidatePath(`/admin_dashboard/books/${data.book_unique_code}`);
        return { success: true, data: edition };
    } catch (error: any) {
        console.error("Failed to create edition. Full error:", error);
        return { success: false, error: `Failed to create edition: ${error.message || "Unknown error"}` };
    }
}

export async function getEditionById(id: number) {
    try {
        const edition = await (prisma as any).bookedition.findUnique({
            where: { id },
            include: { 
                books: true,
                bookeditionstores: {
                    where: { is_deleted: false },
                    include: { stores: true }
                }
            }
        });
        if (!edition || edition.is_deleted) return { success: false, error: "Edition not found" };
        return { success: true, data: edition };
    } catch (error) {
        return { success: false, error: "Failed to fetch edition" };
    }
}

export async function updateEdition(id: number, data: any) {
    try {
        const updated = await (prisma as any).bookedition.update({
            where: { id },
            data: {
                edition_name: data.edition_name,
                selling_price: parseFloat(data.selling_price) || 0,
                production_price: parseFloat(data.production_price) || 0,
                printing_cost: parseFloat(data.printing_cost) || 0,
                binding_cost: parseFloat(data.binding_cost) || 0,
                design_cost: parseFloat(data.design_cost) || 0,
                editing_cost: parseFloat(data.editing_cost) || 0,
                other_expenses: parseFloat(data.other_expenses) || 0,
                transportation_cost: parseFloat(data.transportation_cost) || 0,
                translation_cost: parseFloat(data.translation_cost) || 0,
                translator_cost: data.translator_cost ? parseFloat(data.translator_cost) : undefined,
                cover_design_cost: data.cover_design_cost ? parseFloat(data.cover_design_cost) : undefined,
                text_design_cost: data.text_design_cost ? parseFloat(data.text_design_cost) : undefined,
                editor_cost: data.editor_cost ? parseFloat(data.editor_cost) : undefined,
                typewriting_cost: data.typewriting_cost ? parseFloat(data.typewriting_cost) : undefined,
                store_cost: data.store_cost ? parseFloat(data.store_cost) : undefined,
                distribution_cost: data.distribution_cost ? parseFloat(data.distribution_cost) : undefined,
                advertisement_cost: data.advertisement_cost ? parseFloat(data.advertisement_cost) : undefined,
                purchasing_right_cost: data.purchasing_right_cost ? parseFloat(data.purchasing_right_cost) : undefined,
                memo: data.memo,
                book_image_url: data.book_image_url,
                total_print_count: parseInt(data.total_print_count) || 0,
                count_remening_for_transfer: parseInt(data.count_remening_for_transfer) || 0,
                number_of_pages: parseInt(data.number_of_pages) || 0,
                updatedAt: new Date()
            },
            include: { books: true }
        });
        revalidatePath(`/admin_dashboard/books/${updated.books.unique_identification_code}`);
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Failed to update edition. Full error:", error);
        return { success: false, error: `Failed to update edition: ${error.message || "Unknown error"}` };
    }
}

export async function assignPrinterToEdition(data: {
    editionId: number;
    totalPrintCount: number;
    printerId: number | null;
    bookUniqueCode: string;
}) {
    try {
        const edition = await (prisma as any).bookedition.findUnique({
            where: { id: data.editionId },
            select: { total_print_count: true, count_remening_for_transfer: true }
        });
        if (!edition) return { success: false, error: "Edition not found" };

        const oldTotal = edition.total_print_count || 0;
        const alreadyTransferred = oldTotal - (edition.count_remening_for_transfer || 0);
        if (data.totalPrintCount < alreadyTransferred) {
            return { success: false, error: `Total print count cannot be less than ${alreadyTransferred} (already transferred)` };
        }

        const diff = data.totalPrintCount - oldTotal;
        const newRemaining = (edition.count_remening_for_transfer || 0) + diff;

        await (prisma as any).$transaction(async (tx: any) => {
            await tx.bookedition.update({
                where: { id: data.editionId },
                data: {
                    total_print_count: data.totalPrintCount,
                    count_remening_for_transfer: newRemaining,
                    updatedAt: new Date()
                }
            });

            await tx.bookeditionprinters.updateMany({
                where: { editionId: data.editionId, is_deleted: false },
                data: { is_deleted: true, updatedAt: new Date() }
            });

            if (data.printerId != null) {
                await tx.bookeditionprinters.create({
                    data: {
                        editionId: data.editionId,
                        printerId: data.printerId,
                        quantity: data.totalPrintCount,
                        updatedAt: new Date()
                    }
                });
            }
        }, { timeout: 15000 });

        revalidatePath(`/admin_dashboard/books/${data.bookUniqueCode}`);
        return { success: true };
    } catch (error: any) {
        console.error("Assign printer error:", error);
        return { success: false, error: error.message || "Failed to assign printer" };
    }
}

export async function updateEditionPrintCount(id: number, totalPrintCount: number) {
    try {
        const edition = await (prisma as any).bookedition.findUnique({
            where: { id },
            select: { total_print_count: true, count_remening_for_transfer: true }
        });
        if (!edition) return { success: false, error: "Edition not found" };

        const oldTotal = edition.total_print_count || 0;
        const alreadyTransferred = oldTotal - (edition.count_remening_for_transfer || 0);
        if (totalPrintCount < alreadyTransferred) {
            return { success: false, error: `Total print count cannot be less than ${alreadyTransferred} (already transferred)` };
        }

        const diff = totalPrintCount - oldTotal;
        const newRemaining = (edition.count_remening_for_transfer || 0) + diff;

        await (prisma as any).bookedition.update({
            where: { id },
            data: {
                total_print_count: totalPrintCount,
                count_remening_for_transfer: newRemaining,
                updatedAt: new Date()
            }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to update edition print count:", error);
        return { success: false, error: error.message || "Failed to update edition print count" };
    }
}

export async function deleteEdition(id: number, bookUniqueCode: string) {
    try {
        await (prisma as any).bookedition.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() }
        });
        revalidatePath(`/admin_dashboard/books/${bookUniqueCode}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to delete edition:", error);
        return { success: false, error: "Failed to delete edition" };
    }
}
