"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { put, del } from "@vercel/blob";

const prisma = new PrismaClient();

const invoiceSchema = z.object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    customerName: z.string().min(1, "Customer / Entity name is required"),
    amount: z.number().positive("Amount must be a positive number"),
    status: z.string().min(1, "Status is required"),
    dueDate: z.string().nullable().optional(),
    issueDate: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    memo: z.string().nullable().optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// Upload invoice attachment to Vercel Blob
export async function uploadInvoiceImageAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileExtension = file.name.split(".").pop();
        const cleanFileName = `invoices/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const blob = await put(cleanFileName, buffer, {
            access: "public",
        });

        return { success: true, url: blob.url };
    } catch (error: any) {
        console.error("Failed to upload invoice attachment to Vercel Blob:", error);
        return {
            success: false,
            error: error?.message || "Failed to upload invoice attachment to Vercel Blob"
        };
    }
}

export async function getInvoices() {
    try {
        const list = await prisma.invoices.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: list };
    } catch (error: any) {
        console.error("Failed to fetch invoices:", error);
        return { success: false, error: error.message || "Failed to fetch invoices" };
    }
}

export async function getInvoiceById(id: number) {
    try {
        const invoice = await prisma.invoices.findUnique({
            where: { id }
        });
        if (!invoice || invoice.is_deleted) {
            return { success: false, error: "Invoice not found" };
        }
        return { success: true, data: invoice };
    } catch (error: any) {
        console.error("Failed to fetch invoice:", error);
        return { success: false, error: error.message || "Failed to fetch invoice" };
    }
}

export async function createInvoice(input: InvoiceInput) {
    try {
        const validated = invoiceSchema.parse(input);
        
        const invoice = await prisma.invoices.create({
            data: {
                invoiceNumber: validated.invoiceNumber,
                customerName: validated.customerName,
                amount: validated.amount,
                status: validated.status,
                dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
                issueDate: validated.issueDate ? new Date(validated.issueDate) : null,
                imageUrl: validated.imageUrl ?? null,
                memo: validated.memo ?? null,
                updatedAt: new Date(),
                createdAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/invoices");
        return { success: true, data: invoice };
    } catch (error: any) {
        console.error("Failed to create invoice:", error);
        return { success: false, error: error.message || "Failed to create invoice" };
    }
}

export async function updateInvoice(id: number, input: Partial<InvoiceInput>) {
    try {
        const invoice = await prisma.invoices.update({
            where: { id },
            data: {
                ...input,
                dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
                issueDate: input.issueDate ? new Date(input.issueDate) : undefined,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/invoices");
        return { success: true, data: invoice };
    } catch (error: any) {
        console.error("Failed to update invoice:", error);
        return { success: false, error: error.message || "Failed to update invoice" };
    }
}

export async function deleteInvoice(id: number) {
    try {
        await prisma.invoices.update({
            where: { id },
            data: { 
                is_deleted: true,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/invoices");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete invoice:", error);
        return { success: false, error: error.message || "Failed to delete invoice" };
    }
}
