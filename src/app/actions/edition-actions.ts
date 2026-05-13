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
                memo: data.memo,
                book_image_url: data.book_image_url,
                total_print_count: parseInt(data.total_print_count) || 0,
                number_of_pages: parseInt(data.number_of_pages) || 0,
                bookId: data.bookId,
                updatedAt: new Date()
            }
        });
        revalidatePath(`/admin_dashboard/books/${data.book_unique_code}`);
        return { success: true, data: edition };
    } catch (error) {
        console.error("Failed to create edition:", error);
        return { success: false, error: "Failed to create edition" };
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
                memo: data.memo,
                book_image_url: data.book_image_url,
                total_print_count: parseInt(data.total_print_count) || 0,
                number_of_pages: parseInt(data.number_of_pages) || 0,
                updatedAt: new Date()
            },
            include: { books: true }
        });
        revalidatePath(`/admin_dashboard/books/${updated.books.unique_identification_code}`);
        return { success: true, data: updated };
    } catch (error) {
        return { success: false, error: "Failed to update edition" };
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
