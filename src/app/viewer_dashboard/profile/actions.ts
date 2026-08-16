"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
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

export async function updateAdminProfile(userId: number, data: { name?: string, email?: string }) {
  try {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.account_email = data.email;

    updateData.updatedAt = new Date();

    await (prisma as any).accounts.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath("/viewer_dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

export async function changePasswordAction(userId: number, currentPassword: string, newPassword: string) {
  try {
    const account = await (prisma as any).accounts.findUnique({ where: { id: userId } });
    if (!account) return { success: false, error: "Account not found" };

    const valid = await bcrypt.compare(currentPassword, account.password);
    if (!valid) return { success: false, error: "Current password is incorrect" };

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
    const hashed = await bcrypt.hash(newPassword, saltRounds);

    await (prisma as any).accounts.update({
      where: { id: userId },
      data: { password: hashed, updatedAt: new Date() },
    });

    revalidatePath("/viewer_dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Change Password Error:", error);
    return { success: false, error: error.message || "Failed to change password" };
  }
}
