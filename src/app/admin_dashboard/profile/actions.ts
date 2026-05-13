"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAdminProfile(userId: number, data: { name?: string, email?: string, password?: string }) {
  try {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.account_email = data.email;
    if (data.password) updateData.password = data.password;
    
    updateData.updatedAt = new Date();

    await (prisma as any).accounts.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath("/admin_dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}
