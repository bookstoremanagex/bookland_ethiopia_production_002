"use server";


import prisma from "../../lib/prisma";

export async function getStores() {
  try {
    const stores = await prisma.stores.findMany({
      where: {
        is_deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: stores };
  } catch (error) {
    console.error("Error fetching stores:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch stores" };
  }
}
