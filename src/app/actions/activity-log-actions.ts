"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function getActivityLogs() {
  try {
    const logs = await (prisma as any).activityLogs.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: logs || [] };
  } catch (error: any) {
    console.warn("Database empty or activity logs not found. Defaulting to empty list.", error);
    return { success: true, data: [] };
  }
}
