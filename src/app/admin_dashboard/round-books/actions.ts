"use server";

import prisma from "@/lib/prisma";

export async function getAdminRoundBooks() {
  try {
    const roundbooks = await (prisma as any).roundbooks.findMany({
      where: { is_deleted: false },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            unique_identification_code: true,
            book_sku: true,
          },
        },
        round_records: {
          where: { is_deleted: false },
          include: {
            bookshop: {
              select: { id: true, name: true, location: true, branch: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" as const },
    });

    const data = roundbooks.map((rb: any) => ({
      id: rb.id,
      status: rb.status,
      bookTitle: rb.book?.title || "Unknown",
      bookAuthor: rb.book?.author || "",
      bookSku: rb.book?.book_sku || "",
      allocated: rb.allocated ?? false,
      startingAmount: rb.starting_amount ?? 0,
      returnedAmount: rb.returned_amount ?? 0,
      storeCount: rb.round_records.length,
      totalSold: rb.round_records.reduce((sum: number, rr: any) => sum + (rr.totalprice ?? 0), 0),
      stores: rb.round_records.map((rr: any) => ({
        id: rr.id,
        shopId: rr.bookshop_id,
        storeName: rr.bookshop?.name || "Unknown",
        totalprice: rr.totalprice ?? 0,
      })),
      createdAt: rb.createdAt,
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminRoundDetail(id: number) {
  try {
    const rb = await (prisma as any).roundbooks.findFirst({
      where: { id, is_deleted: false },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            unique_identification_code: true,
            book_sku: true,
            book_image_url: true,
          },
        },
        editions: {
          select: {
            id: true,
            edition_name: true,
            selling_price: true,
            count_remening_for_transfer: true,
            bookeditionstores: {
              where: { is_deleted: false, quantity: { gt: 0 } },
              include: { stores: { select: { id: true, name: true } } },
            },
            bookeditionprinters: {
              where: { is_deleted: false, quantity: { gt: 0 } },
              include: { printer: { select: { id: true, name: true } } },
            },
          },
        },
        round_records: {
          where: { is_deleted: false },
          include: {
            bookshop: {
              select: { id: true, name: true, location: true, branch: true },
            },
            round_payments: {
              where: { is_deleted: false },
              include: {
                check: {
                  select: { id: true, bankname: true, username: true, amount: true, status: true },
                },
              },
            },
          },
        },
      },
    });
    if (!rb) return { success: false, error: "Round not found" };

    const data = {
      id: rb.id,
      status: rb.status,
      bookTitle: rb.book?.title || "Unknown",
      bookAuthor: rb.book?.author || "",
      bookSku: rb.book?.book_sku || "",
      bookImage: rb.book?.book_image_url || "",
      bookId: rb.book?.id || 0,
      editionId: rb.editions?.id || null,
      editionName: rb.editions?.edition_name || null,
      startingAmount: rb.starting_amount ?? 0,
      returnedAmount: rb.returned_amount ?? 0,
      totalSold: rb.round_records.reduce((sum: number, rr: any) => sum + (rr.totalprice ?? 0), 0),
      storeCount: rb.round_records.length,
      allocated: rb.allocated ?? false,
      createdAt: rb.createdAt,
      stores: rb.round_records.map((rr: any) => ({
        id: rr.id,
        shopName: rr.bookshop?.name || "Unknown",
        location: rr.bookshop?.location || "",
        branch: rr.bookshop?.branch || "",
        totalprice: rr.totalprice ?? 0,
        payments: (rr.round_payments || []).map((p: any) => ({
          id: p.id,
          amount: p.amount,
          type: p.payment_type,
          status: p.status,
          check: p.check ? {
            bankname: p.check.bankname,
            username: p.check.username,
            amount: p.check.amount,
            status: p.check.status,
          } : null,
        })),
      })),
    };
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function allocateRoundBook(
  roundId: number,
  allocations: { editionId: number; storeId: number; storeStockId: number; quantity: number; type: "store" | "printer" }[]
) {
  try {
    const rb = await (prisma as any).roundbooks.findFirst({
      where: { id: roundId, is_deleted: false },
    });
    if (!rb) return { success: false, error: "Round not found" };
    if (rb.status) return { success: false, error: "Cannot allocate while round is active" };
    if (rb.allocated) return { success: false, error: "Already allocated" };

    const quantityToAllocate = (rb.starting_amount ?? 0) - (rb.returned_amount ?? 0);
    if (quantityToAllocate <= 0) return { success: false, error: "No books to allocate" };

    // Deduct from selected stores/printers
    await (prisma as any).$transaction(async (tx: any) => {
      for (const alloc of allocations) {
        if (alloc.quantity <= 0) continue;

        if (alloc.type === "printer") {
          const result = await tx.bookeditionprinters.updateMany({
            where: { id: alloc.storeStockId, quantity: { gte: alloc.quantity } },
            data: { quantity: { decrement: alloc.quantity }, updatedAt: new Date() },
          });
          if (result.count === 0) throw new Error(`Insufficient stock at printer for edition ${alloc.editionId}`);
        } else {
          const result = await tx.bookeditionstores.updateMany({
            where: { id: alloc.storeStockId, quantity: { gte: alloc.quantity } },
            data: { quantity: { decrement: alloc.quantity }, updatedAt: new Date() },
          });
          if (result.count === 0) throw new Error(`Insufficient stock at store for edition ${alloc.editionId}`);
        }
      }

      // Mark as allocated
      await tx.roundbooks.update({
        where: { id: roundId },
        data: { allocated: true, updatedAt: new Date() },
      });
    }, { timeout: 30000 });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRoundDeductData(roundId: number) {
  try {
    const rb = await (prisma as any).roundbooks.findFirst({
      where: { id: roundId, is_deleted: false },
      include: {
        book: {
          select: { id: true, title: true, author: true, book_sku: true },
        },
        round_records: {
          where: { is_deleted: false },
          include: {
            bookshop: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!rb) return { success: false, error: "Round not found" };

    const totalToDeduct = (rb.starting_amount ?? 0) - (rb.returned_amount ?? 0);
    const totalSold = rb.round_records.reduce((sum: number, rr: any) => sum + (rr.totalprice ?? 0), 0);
    const avgPrice = totalSold > 0 ? totalSold / totalToDeduct : 0;

    const editions = await (prisma as any).bookedition.findMany({
      where: { bookId: rb.book.id, is_deleted: false },
      include: {
        bookeditionstores: {
          where: { is_deleted: false, quantity: { gt: 0 } },
          include: { stores: { select: { id: true, name: true } } },
        },
        bookeditionprinters: {
          where: { is_deleted: false, quantity: { gt: 0 } },
          include: { printer: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "asc" as const },
    });

    const shops = rb.round_records.map((rr: any) => ({
      id: rr.id,
      shopId: rr.bookshop_id,
      shopName: rr.bookshop?.name || "Unknown",
      totalprice: rr.totalprice ?? 0,
      qty: avgPrice > 0 ? Math.round((rr.totalprice ?? 0) / avgPrice) : 0,
    }));

    const storeMap = new Map<string, any>();
    const printerMap = new Map<string, any>();

    for (const ed of editions) {
      for (const bes of ed.bookeditionstores) {
        const key = `store-${bes.stores.id}`;
        if (!storeMap.has(key)) {
          storeMap.set(key, {
            key,
            name: bes.stores.name,
            type: "store" as const,
            totalAvailable: 0,
            editionStocks: [],
          });
        }
        const entry = storeMap.get(key)!;
        entry.totalAvailable += bes.quantity;
        entry.editionStocks.push({
          stockId: bes.id,
          editionId: ed.id,
          editionName: ed.edition_name,
          quantity: bes.quantity,
          sellingPrice: ed.selling_price || 0,
          createdAt: ed.createdAt,
        });
      }
      for (const bep of ed.bookeditionprinters) {
        const key = `printer-${bep.printer.id}`;
        if (!printerMap.has(key)) {
          printerMap.set(key, {
            key,
            name: bep.printer.name,
            type: "printer" as const,
            totalAvailable: 0,
            editionStocks: [],
          });
        }
        const entry = printerMap.get(key)!;
        entry.totalAvailable += bep.quantity;
        entry.editionStocks.push({
          stockId: bep.id,
          editionId: ed.id,
          editionName: ed.edition_name,
          quantity: bep.quantity,
          sellingPrice: ed.selling_price || 0,
          createdAt: ed.createdAt,
        });
      }
    }

    const sources = [...storeMap.values(), ...printerMap.values()];

    return {
      success: true,
      data: {
        roundId: rb.id,
        bookTitle: rb.book?.title || "Unknown",
        bookAuthor: rb.book?.author || "",
        bookSku: rb.book?.book_sku || "",
        startingAmount: rb.starting_amount ?? 0,
        returnedAmount: rb.returned_amount ?? 0,
        totalToDeduct,
        shops,
        sources,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveDeduction(
  roundId: number,
  allocations: { sourceKey: string; quantity: number }[],
) {
  try {
    const rb = await (prisma as any).roundbooks.findFirst({
      where: { id: roundId, is_deleted: false },
      include: {
        book: { select: { id: true } },
        round_records: {
          where: { is_deleted: false },
          include: { bookshop: { select: { id: true } } },
        },
      },
    });
    if (!rb) return { success: false, error: "Round not found" };

    const totalToDeduct = (rb.starting_amount ?? 0) - (rb.returned_amount ?? 0);
    const totalSold = rb.round_records.reduce((sum: number, rr: any) => sum + (rr.totalprice ?? 0), 0);
    const avgPrice = totalSold > 0 ? totalSold / totalToDeduct : 0;

    const editions = await (prisma as any).bookedition.findMany({
      where: { bookId: rb.book.id, is_deleted: false },
      include: {
        bookeditionstores: {
          where: { is_deleted: false, quantity: { gt: 0 } },
          include: { stores: { select: { id: true, name: true } } },
        },
        bookeditionprinters: {
          where: { is_deleted: false, quantity: { gt: 0 } },
          include: { printer: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "asc" as const },
    });

    const allStock: { stockId: number; editionId: number; sellingPrice: number; createdAt: Date; model: string; sourceId: number; sourceType: string }[] = [];
    for (const ed of editions) {
      for (const bes of ed.bookeditionstores) {
        allStock.push({ stockId: bes.id, sourceId: bes.stores.id, sourceType: "store", editionId: ed.id, sellingPrice: ed.selling_price || 0, createdAt: ed.createdAt, model: "bookeditionstores" });
      }
      for (const bep of ed.bookeditionprinters) {
        allStock.push({ stockId: bep.id, sourceId: bep.printer.id, sourceType: "printer", editionId: ed.id, sellingPrice: ed.selling_price || 0, createdAt: ed.createdAt, model: "bookeditionprinters" });
      }
    }

    await (prisma as any).$transaction(async (tx: any) => {
      for (const alloc of allocations) {
        let remaining = alloc.quantity;
        const keyParts = alloc.sourceKey.split("-");
        const type = keyParts[0] as "store" | "printer";
        const sourceId = parseInt(keyParts[1], 10);

        const stockEntries = allStock
          .filter((s) => s.sourceType === type && s.sourceId === sourceId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        for (const stock of stockEntries) {
          if (remaining <= 0) break;
          const stockRecord = await tx[stock.model].findUnique({ where: { id: stock.stockId } });
          if (!stockRecord) continue;
          const take = Math.min(remaining, stockRecord.quantity);
          if (take <= 0) continue;
          const result = await tx[stock.model].updateMany({
            where: { id: stock.stockId, quantity: { gte: take } },
            data: { quantity: { decrement: take }, updatedAt: new Date() },
          });
          if (result.count === 0) throw new Error(`Insufficient stock for ${alloc.sourceKey}`);
          remaining -= take;
        }
        if (remaining > 0) throw new Error(`Not enough stock to fulfill allocation for ${alloc.sourceKey}`);
      }

      for (const rr of rb.round_records) {
        const shopId = rr.bookshop_id;
        if (!shopId) continue;
        const qty = totalSold > 0 ? Math.round((rr.totalprice ?? 0) / totalSold * totalToDeduct) : 0;
        if (qty <= 0) continue;

        for (const ed of editions) {
          const edQty = Math.round(qty * (ed.selling_price || 0) / (avgPrice || 1));
          if (edQty <= 0) continue;
          const itemValue = edQty * (ed.selling_price || 0);
          const existing = await tx.bookshopeditions.findFirst({
            where: { bookShopId: shopId, bookEditionId: ed.id, is_deleted: false },
          });
          if (existing) {
            await tx.bookshopeditions.update({
              where: { id: existing.id },
              data: { quantity: { increment: edQty }, total_price: { increment: itemValue }, updatedAt: new Date() },
            });
          } else {
            await tx.bookshopeditions.create({
              data: {
                bookShopId: shopId,
                bookEditionId: ed.id,
                quantity: edQty,
                price_per_peice: ed.selling_price,
                total_price: itemValue,
                already_paid: 0,
                remaining_amount: itemValue,
                updatedAt: new Date(),
              },
            });
          }
        }
      }
    });

    await (prisma as any).roundbooks.update({
      where: { id: roundId },
      data: { allocated: true, updatedAt: new Date() },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveRoundPayment(paymentId: number) {
  try {
    await (prisma as any).round_payments.update({
      where: { id: paymentId },
      data: { status: "APPROVED" },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}