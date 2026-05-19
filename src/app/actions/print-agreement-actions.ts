"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const printAgreementSchema = z.object({
    bookTitle: z.string().min(1, "Book title is required"),
    printerName: z.string().min(1, "Printer name is required"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    status: z.string().min(1, "Status is required"),
    commencementDate: z.string().nullable().optional(),
    cost: z.number().nullable().optional(),
    terms: z.string().nullable().optional(),
    memo: z.string().nullable().optional(),
});

export type PrintAgreementInput = z.infer<typeof printAgreementSchema>;

export async function getPrintAgreements() {
    try {
        const list = await prisma.print_agreements.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: list };
    } catch (error: any) {
        console.error("Failed to fetch print agreements:", error);
        return { success: false, error: error.message || "Failed to fetch print agreements" };
    }
}

export async function getPrintAgreementById(id: number) {
    try {
        const agreement = await prisma.print_agreements.findUnique({
            where: { id }
        });
        if (!agreement || agreement.is_deleted) {
            return { success: false, error: "Print agreement not found" };
        }
        return { success: true, data: agreement };
    } catch (error: any) {
        console.error("Failed to fetch print agreement:", error);
        return { success: false, error: error.message || "Failed to fetch print agreement" };
    }
}

export async function createPrintAgreement(input: PrintAgreementInput) {
    try {
        const validated = printAgreementSchema.parse(input);
        
        const agreement = await prisma.print_agreements.create({
            data: {
                bookTitle: validated.bookTitle,
                printerName: validated.printerName,
                quantity: validated.quantity,
                status: validated.status,
                commencementDate: validated.commencementDate ? new Date(validated.commencementDate) : null,
                cost: validated.cost ?? null,
                terms: validated.terms ?? null,
                memo: validated.memo ?? null,
                updatedAt: new Date(),
                createdAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/print_agreements");
        return { success: true, data: agreement };
    } catch (error: any) {
        console.error("Failed to create print agreement:", error);
        return { success: false, error: error.message || "Failed to create print agreement" };
    }
}

export async function updatePrintAgreement(id: number, input: Partial<PrintAgreementInput>) {
    try {
        const agreement = await prisma.print_agreements.update({
            where: { id },
            data: {
                ...input,
                commencementDate: input.commencementDate ? new Date(input.commencementDate) : undefined,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/print_agreements");
        return { success: true, data: agreement };
    } catch (error: any) {
        console.error("Failed to update print agreement:", error);
        return { success: false, error: error.message || "Failed to update print agreement" };
    }
}

export async function deletePrintAgreement(id: number) {
    try {
        await prisma.print_agreements.update({
            where: { id },
            data: { 
                is_deleted: true,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/print_agreements");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete print agreement:", error);
        return { success: false, error: error.message || "Failed to delete print agreement" };
    }
}
