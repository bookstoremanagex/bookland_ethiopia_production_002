"use server";

import prisma from "../../lib/prisma";
import { storeSchema, type StoreFormValues } from "@/lib/validation/store-schema";
import { revalidatePath } from "next/cache";

export async function createStore(data: StoreFormValues) {
  try {
    const validatedData = storeSchema.parse(data);

    const store = await (prisma as any).stores.create({
      data: {
        name: validatedData.name,
        location: validatedData.location,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        status: validatedData.status,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin_dashboard/stores");
    return { success: true, data: store };
  } catch (error) {
    console.error("Error creating store:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create store" };
  }
}

export async function updateStore(id: number, data: Partial<StoreFormValues>) {
  try {
    const store = await (prisma as any).stores.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin_dashboard/stores");
    revalidatePath(`/admin_dashboard/stores/${id}`);
    return { success: true, data: store };
  } catch (error) {
    console.error("Error updating store:", error);
    return { success: false, error: "Failed to update store" };
  }
}

export async function deleteStore(id: number) {
  try {
    const store = await (prisma as any).stores.update({
      where: { id },
      data: {
        is_deleted: true,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin_dashboard/stores");
    return { success: true, data: store };
  } catch (error) {
    console.error("Error deleting store:", error);
    return { success: false, error: "Failed to delete store" };
  }
}
