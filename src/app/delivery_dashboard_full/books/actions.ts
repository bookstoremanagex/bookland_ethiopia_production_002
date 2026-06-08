"use server";

import prisma from "@/lib/prisma";

export async function getBookStoreStock(bookId: number) {
  try {
    const editions = await (prisma as any).bookedition.findMany({
      where: { bookId, is_deleted: false },
      include: {
        bookeditionstores: {
          where: { is_deleted: false, quantity: { gt: 0 } },
          include: { stores: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const data = editions.map((ed: any) => ({
      id: ed.id,
      editionName: ed.edition_name,
      sellingPrice: ed.selling_price || 0,
      totalStock: ed.bookeditionstores.reduce((s: number, st: any) => s + (st.quantity || 0), 0),
      stores: ed.bookeditionstores.map((st: any) => ({
        storeId: st.storeId,
        storeName: st.stores.name,
        quantity: st.quantity || 0,
      })),
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
