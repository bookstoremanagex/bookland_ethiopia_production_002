"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPasswordAction(id: number, newPassword: string) {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await (prisma as any).accounts.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password." };
  }
}

export async function updateAccountAction(id: number, data: {
  name: string;
  email: string;
  type: string;
  status: boolean;
}) {
  try {
    const existing = await (prisma as any).accounts.findFirst({
      where: {
        account_email: data.email,
        id: { not: id },
        is_deleted: false,
      },
    });

    if (existing) {
      return { success: false, error: "Email is already in use by another account." };
    }

    const updatedAccount = await (prisma as any).accounts.update({
      where: { id },
      data: {
        name: data.name,
        account_email: data.email,
        account_type: data.type,
        account_status: data.status,
        updatedAt: new Date(),
      },
    });

    return { success: true, account: updatedAccount };
  } catch (error) {
    console.error("Error updating account:", error);
    return { success: false, error: "Failed to update account." };
  }
}

export async function deleteAccountAction(id: number) {
  try {
    await (prisma as any).accounts.update({
      where: { id },
      data: { 
        is_deleted: true,
        updatedAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Failed to delete account." };
  }
}
