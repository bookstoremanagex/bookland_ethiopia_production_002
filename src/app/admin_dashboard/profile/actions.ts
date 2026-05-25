"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/app/actions/auth-actions";

export async function getProfileData() {
  try {
    const session = await getCurrentSession();
    if (!session || !session.id) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await (prisma as any).accounts.findUnique({
      where: { id: session.id, is_deleted: false }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.account_email,
        role: user.account_type,
        status: user.account_status,
        createdAt: user.createdAt,
      }
    };
  } catch (error: any) {
    console.error("getProfileData error:", error);
    return { success: false, error: error.message || "Failed to load profile" };
  }
}

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
