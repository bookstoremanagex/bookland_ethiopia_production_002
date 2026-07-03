"use server";

import retailPrisma from "@/lib/retail-prisma";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

export async function getRetailUsers() {
  try {
    const users = await retailPrisma.users.findMany({
      orderBy: { created_at: "desc" },
    });
    return { success: true, data: JSON.parse(JSON.stringify(users)) };
  } catch (error) {
    console.error("getRetailUsers error:", error);
    return { success: false, error: "Failed to fetch retail users" };
  }
}

export async function createRetailUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  try {
    const existing = await retailPrisma.users.findFirst({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: "A user with this email already exists in the retail system" };
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await retailPrisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role ?? "Retail Shop",
      },
    });

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error("createRetailUser error:", error);
    return { success: false, error: "Failed to create retail user" };
  }
}

export async function deleteRetailUser(userId: number) {
  try {
    await retailPrisma.users.update({
      where: { id: userId },
      data: { deleted_at: new Date() },
    });
    return { success: true };
  } catch (error) {
    console.error("deleteRetailUser error:", error);
    return { success: false, error: "Failed to delete retail user" };
  }
}
