"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function addAccountAction(data: {
  name: string;
  email: string;
  password: string;
  type: string;
}) {
  try {
    // Check if email already exists
    const existingAccount = await (prisma as any).accounts.findFirst({
      where: {
        account_email: data.email,
        is_deleted: false,
      },
    });

    if (existingAccount) {
      return { success: false, error: "An account with this email already exists." };
    }

    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create the account
    const newAccount = await (prisma as any).accounts.create({
      data: {
        name: data.name,
        account_email: data.email,
        password: hashedPassword,
        account_type: data.type,
        updatedAt: new Date(),
      },
    });

    // Auto-create role entries for all permissions
    const viewingPermissions = new Set([
      "Viewing Books",
      "Viewing Stores",
      "View DamagedBooks",
      "Viewing BookShops",
      "Viewing Contract Documents",
      "Viewing Print Agreements",
      "Viewing Delivery Notes",
      "Viewing Invoice Document",
      "Viewing Approval Document",
      "Viewing Notes",
    ]);

    const allRoleTypes = await (prisma as any).roletypes.findMany({
      where: { is_deleted: false },
    });

    const now = new Date();
    const roleData = allRoleTypes.map((rt: any) => ({
      accountId: newAccount.id,
      roletypeId: rt.id,
      role_status: viewingPermissions.has(rt.rolename),
      updatedAt: now,
    }));

    await (prisma as any).roles.createMany({ data: roleData });

    return { success: true, accountId: newAccount.id };
  } catch (error) {
    console.error("Error creating account:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
