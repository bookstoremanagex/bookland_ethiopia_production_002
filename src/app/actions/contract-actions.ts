"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const contractSchema = z.object({
    title: z.string().min(1, "Contract title is required"),
    party: z.string().min(1, "Signee party / vendor is required"),
    type: z.string().min(1, "Contract type is required"),
    status: z.string().min(1, "Status is required"),
    details: z.string().min(1, "Contract details/text are required"),
    value: z.number().nullable().optional(),
    memo: z.string().nullable().optional(),
    dateSigned: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
});

export type ContractInput = z.infer<typeof contractSchema>;

export async function getContracts() {
    try {
        const list = await prisma.contracts.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: list };
    } catch (error: any) {
        console.error("Failed to fetch contracts:", error);
        return { success: false, error: error.message || "Failed to fetch contracts" };
    }
}

export async function getContractById(id: number) {
    try {
        const contract = await prisma.contracts.findUnique({
            where: { id }
        });
        if (!contract || contract.is_deleted) {
            return { success: false, error: "Contract not found" };
        }
        return { success: true, data: contract };
    } catch (error: any) {
        console.error("Failed to fetch contract:", error);
        return { success: false, error: error.message || "Failed to fetch contract" };
    }
}

export async function createContract(input: ContractInput) {
    try {
        const validated = contractSchema.parse(input);
        
        const contract = await prisma.contracts.create({
            data: {
                title: validated.title,
                party: validated.party,
                type: validated.type,
                status: validated.status,
                details: validated.details,
                value: validated.value ?? null,
                memo: validated.memo ?? null,
                dateSigned: validated.dateSigned ? new Date(validated.dateSigned) : null,
                startDate: validated.startDate ? new Date(validated.startDate) : null,
                endDate: validated.endDate ? new Date(validated.endDate) : null,
                updatedAt: new Date(),
                createdAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/contracts");
        return { success: true, data: contract };
    } catch (error: any) {
        console.error("Failed to create contract:", error);
        return { success: false, error: error.message || "Failed to create contract" };
    }
}

export async function updateContract(id: number, input: Partial<ContractInput>) {
    try {
        const contract = await prisma.contracts.update({
            where: { id },
            data: {
                ...input,
                dateSigned: input.dateSigned ? new Date(input.dateSigned) : undefined,
                startDate: input.startDate ? new Date(input.startDate) : undefined,
                endDate: input.endDate ? new Date(input.endDate) : undefined,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/contracts");
        return { success: true, data: contract };
    } catch (error: any) {
        console.error("Failed to update contract:", error);
        return { success: false, error: error.message || "Failed to update contract" };
    }
}

export async function deleteContract(id: number) {
    try {
        await prisma.contracts.update({
            where: { id },
            data: { 
                is_deleted: true,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/contracts");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete contract:", error);
        return { success: false, error: error.message || "Failed to delete contract" };
    }
}
