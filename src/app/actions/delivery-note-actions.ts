"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const deliveryNoteSchema = z.object({
    deliveryNumber: z.string().min(1, "Delivery number is required"),
    receiverName: z.string().min(1, "Receiver name / entity is required"),
    driverName: z.string().min(1, "Driver name is required"),
    vehiclePlate: z.string().nullable().optional(),
    status: z.string().min(1, "Status is required"),
    deliveryDate: z.string().nullable().optional(),
    items: z.string().min(1, "Delivered items detail is required"),
    memo: z.string().nullable().optional(),
});

export type DeliveryNoteInput = z.infer<typeof deliveryNoteSchema>;

export async function getDeliveryNotes() {
    try {
        const list = await prisma.delivery_notes.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: list };
    } catch (error: any) {
        console.error("Failed to fetch delivery notes:", error);
        return { success: false, error: error.message || "Failed to fetch delivery notes" };
    }
}

export async function getDeliveryNoteById(id: number) {
    try {
        const note = await prisma.delivery_notes.findUnique({
            where: { id }
        });
        if (!note || note.is_deleted) {
            return { success: false, error: "Delivery note not found" };
        }
        return { success: true, data: note };
    } catch (error: any) {
        console.error("Failed to fetch delivery note:", error);
        return { success: false, error: error.message || "Failed to fetch delivery note" };
    }
}

export async function createDeliveryNote(input: DeliveryNoteInput) {
    try {
        const validated = deliveryNoteSchema.parse(input);
        
        const note = await prisma.delivery_notes.create({
            data: {
                deliveryNumber: validated.deliveryNumber,
                receiverName: validated.receiverName,
                driverName: validated.driverName,
                vehiclePlate: validated.vehiclePlate ?? null,
                status: validated.status,
                deliveryDate: validated.deliveryDate ? new Date(validated.deliveryDate) : null,
                items: validated.items,
                memo: validated.memo ?? null,
                updatedAt: new Date(),
                createdAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/delivery_notes");
        return { success: true, data: note };
    } catch (error: any) {
        console.error("Failed to create delivery note:", error);
        return { success: false, error: error.message || "Failed to create delivery note" };
    }
}

export async function updateDeliveryNote(id: number, input: Partial<DeliveryNoteInput>) {
    try {
        const note = await prisma.delivery_notes.update({
            where: { id },
            data: {
                ...input,
                deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : undefined,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/delivery_notes");
        return { success: true, data: note };
    } catch (error: any) {
        console.error("Failed to update delivery note:", error);
        return { success: false, error: error.message || "Failed to update delivery note" };
    }
}

export async function deleteDeliveryNote(id: number) {
    try {
        await prisma.delivery_notes.update({
            where: { id },
            data: { 
                is_deleted: true,
                updatedAt: new Date()
            }
        });

        revalidatePath("/admin_dashboard/document_management/delivery_notes");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete delivery note:", error);
        return { success: false, error: error.message || "Failed to delete delivery note" };
    }
}
