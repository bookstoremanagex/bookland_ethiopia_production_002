"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const approvalDocumentSchema = z.object({
    documentNumber: z.string().min(1, "Document number is required"),
    title: z.string().min(1, "Document title is required"),
    requestedBy: z.string().min(1, "Requested by name is required"),
    approvedBy: z.string().nullable().optional(),
    status: z.string().min(1, "Status is required"),
    approvalDate: z.string().nullable().optional(),
    details: z.string().min(1, "Document details / terms are required"),
    memo: z.string().nullable().optional(),
});

export type ApprovalDocumentInput = z.infer<typeof approvalDocumentSchema>;

export async function getApprovalDocuments() {
    try {
        const list = await prisma.approval_documents.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: list };
    } catch (error: any) {
        console.error("Failed to fetch approval documents:", error);
        return { success: false, error: error.message || "Failed to fetch approval documents" };
    }
}

export async function getApprovalDocumentById(id: number) {
    try {
        const doc = await prisma.approval_documents.findUnique({
            where: { id }
        });
        if (!doc || doc.is_deleted) {
            return { success: false, error: "Approval document not found" };
        }
        return { success: true, data: doc };
    } catch (error: any) {
        console.error("Failed to fetch approval document:", error);
        return { success: false, error: error.message || "Failed to fetch approval document" };
    }
}

export async function createApprovalDocument(input: ApprovalDocumentInput) {
    try {
        const validated = approvalDocumentSchema.parse(input);
        
        const doc = await prisma.approval_documents.create({
            data: {
                documentNumber: validated.documentNumber,
                title: validated.title,
                requestedBy: validated.requestedBy,
                approvedBy: validated.approvedBy ?? null,
                status: validated.status,
                approvalDate: validated.approvalDate ? new Date(validated.approvalDate) : null,
                details: validated.details,
                memo: validated.memo ?? null,
                updatedAt: new Date(),
                createdAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/approval_documents");
        return { success: true, data: doc };
    } catch (error: any) {
        console.error("Failed to create approval document:", error);
        return { success: false, error: error.message || "Failed to create approval document" };
    }
}

export async function updateApprovalDocument(id: number, input: Partial<ApprovalDocumentInput>) {
    try {
        const doc = await prisma.approval_documents.update({
            where: { id },
            data: {
                ...input,
                approvalDate: input.approvalDate ? new Date(input.approvalDate) : undefined,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/approval_documents");
        return { success: true, data: doc };
    } catch (error: any) {
        console.error("Failed to update approval document:", error);
        return { success: false, error: error.message || "Failed to update approval document" };
    }
}

export async function deleteApprovalDocument(id: number) {
    try {
        await prisma.approval_documents.update({
            where: { id },
            data: { 
                is_deleted: true,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/approval_documents");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete approval document:", error);
        return { success: false, error: error.message || "Failed to delete approval document" };
    }
}
