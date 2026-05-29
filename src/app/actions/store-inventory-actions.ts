"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";

export async function getAllStores() {
    try {
        const stores = await (prisma as any).stores.findMany({
            where: { is_deleted: false },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: stores };
    } catch (error) {
        return { success: false, error: "Failed to fetch stores" };
    }
}

export async function assignEditionToStore(data: { editionId: number, storeId: number, quantity: number }) {
    try {
        // Check if already assigned
        const existing = await (prisma as any).bookeditionstores.findFirst({
            where: {
                editionId: data.editionId,
                storeId: data.storeId,
                is_deleted: false
            }
        });

        if (existing) {
            return { success: false, error: "This edition is already assigned to this store. Please update the quantity instead." };
        }

        // Validate against remaining for transfer
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: data.editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);
        if (data.quantity > remaining) {
            return { success: false, error: `Cannot assign ${data.quantity} units. Only ${remaining} remaining for transfer.` };
        }
        if (data.quantity < 0) {
            return { success: false, error: "Quantity cannot be negative." };
        }

        // Create assignment and deduct from remaining in a transaction
        const [assignment] = await (prisma as any).$transaction([
            (prisma as any).bookeditionstores.create({
                data: {
                    editionId: data.editionId,
                    storeId: data.storeId,
                    quantity: data.quantity,
                    updatedAt: new Date()
                },
                include: { stores: true }
            }),
            (prisma as any).bookedition.update({
                where: { id: data.editionId },
                data: { count_remening_for_transfer: { decrement: data.quantity } }
            })
        ], { timeout: 15000 });

        const newRemaining = (remaining - data.quantity);
        revalidatePath(`/admin_dashboard/books/editions/${data.editionId}`);
        return { success: true, data: assignment, newRemaining };
    } catch (error) {
        console.error("Failed to assign edition to store:", error);
        return { success: false, error: "Failed to assign edition to store" };
    }
}

export async function updateStoreInventory(id: number, quantity: number, editionId: number) {
    try {
        // Get the current store inventory record
        const current = await (prisma as any).bookeditionstores.findUnique({ where: { id } });
        if (!current) return { success: false, error: "Store inventory record not found" };

        const oldQuantity = Number(current.quantity || 0);
        const diff = quantity - oldQuantity; // positive = increase, negative = decrease

        // Get the edition to check remaining
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);

        if (diff > 0 && diff > remaining) {
            return { success: false, error: `Cannot increase by ${diff}. Only ${remaining} remaining for transfer.` };
        }
        if (quantity < 0) {
            return { success: false, error: "Quantity cannot be negative." };
        }

        // Update store quantity and edition remaining in a transaction
        // Uses atomic decrement so central inventory always stays in sync
        const [updated] = await (prisma as any).$transaction([
            (prisma as any).bookeditionstores.update({
                where: { id },
                data: { quantity, updatedAt: new Date() },
                include: { stores: true }
            }),
            (prisma as any).bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: { decrement: diff } }
            })
        ], { timeout: 15000 });

        const newRemaining = (remaining - diff);
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true, data: updated, newRemaining };
    } catch (error) {
        return { success: false, error: "Failed to update inventory" };
    }
}

export async function deleteStoreInventory(id: number, editionId: number) {
    try {
        // Get the current record to know how much to return
        const current = await (prisma as any).bookeditionstores.findUnique({ where: { id } });
        if (!current) return { success: false, error: "Store inventory record not found" };

        const quantityToReturn = Number(current.quantity || 0);

        // Get the edition remaining
        const edition = await (prisma as any).bookedition.findUnique({ where: { id: editionId } });
        if (!edition) return { success: false, error: "Edition not found" };

        const remaining = Number(edition.count_remening_for_transfer || 0);

        // Soft delete and return quantity to remaining in a transaction
        await (prisma as any).$transaction([
            (prisma as any).bookeditionstores.update({
                where: { id },
                data: { is_deleted: true, updatedAt: new Date() }
            }),
            (prisma as any).bookedition.update({
                where: { id: editionId },
                data: { count_remening_for_transfer: { increment: quantityToReturn } }
            })
        ], { timeout: 15000 });

        const newRemaining = (remaining + quantityToReturn);
        revalidatePath(`/admin_dashboard/books/editions/${editionId}`);
        return { success: true, newRemaining };
    } catch (error) {
        return { success: false, error: "Failed to remove from store" };
    }
}

export async function batchAssignEditionToStores(
  data: { editionId: number; stores: { storeId: number; quantity: number }[] }
) {
  try {
    const edition = await (prisma as any).bookedition.findUnique({
      where: { id: data.editionId },
      include: { books: true },
    });
    if (!edition) return { success: false, error: "Edition not found" };

    const remaining = Number(edition.count_remening_for_transfer || 0);
    if (data.stores.some((s) => s.quantity < 0)) {
      return { success: false, error: "Quantity cannot be negative." };
    }

    // Fetch existing assignments for these stores
    const existingAssignments = await (prisma as any).bookeditionstores.findMany({
      where: {
        editionId: data.editionId,
        storeId: { in: data.stores.map((s) => s.storeId) },
        is_deleted: false,
      },
    });
    const existingMap = Object.fromEntries(
      existingAssignments.map((e: any) => [e.storeId, e])
    );

    // Compute net delta: positive = taking from remaining, negative = giving back
    let netDelta = 0;
    for (const s of data.stores) {
      const existing = existingMap[s.storeId];
      const oldQty = existing ? Number(existing.quantity || 0) : 0;
      netDelta += s.quantity - oldQty;
    }

    // Validate: can't take more than what's available
    if (netDelta > remaining) {
      return {
        success: false,
        error: `Net increase (${netDelta}) exceeds remaining for transfer (${remaining}).`,
      };
    }

    const now = new Date();
    await (prisma as any).$transaction(
      [
        ...data.stores.map((s: { storeId: number; quantity: number }) => {
          const existing = existingMap[s.storeId];
          if (existing) {
            return (prisma as any).bookeditionstores.update({
              where: { id: existing.id },
              data: { quantity: s.quantity, updatedAt: now },
            });
          }
          return (prisma as any).bookeditionstores.create({
            data: {
              editionId: data.editionId,
              storeId: s.storeId,
              quantity: s.quantity,
              updatedAt: now,
            },
          });
        }),
        (prisma as any).bookedition.update({
          where: { id: data.editionId },
          data: { count_remening_for_transfer: { decrement: netDelta } },
        }),
      ],
      { timeout: 15000 }
    );

    // Log activity
    const session = await getCurrentSession();
    if (session?.id) {
      const storeNames = await (prisma as any).stores.findMany({
        where: { id: { in: data.stores.map((s) => s.storeId) } },
        select: { id: true, name: true },
      });
      const nameMap = Object.fromEntries(storeNames.map((s: any) => [s.id, s.name]));
      await (prisma as any).activityLogs.create({
        data: {
          accountId: session.id,
          action: `Assigned edition "${edition.edition_name}" to ${data.stores.length} store(s)`,
          details: JSON.stringify({
            editionId: data.editionId,
            editionName: edition.edition_name,
            bookTitle: edition.books?.title,
            stores: data.stores.map((s) => ({
              storeId: s.storeId,
              storeName: nameMap[s.storeId] || `Store #${s.storeId}`,
              quantity: s.quantity,
            })),
          }),
          updatedAt: now,
        },
      });
    }

    const newRemaining = remaining - netDelta;
    revalidatePath(`/admin_dashboard/books/editions/${data.editionId}`);
    return { success: true, newRemaining };
  } catch (error) {
    console.error("Failed to batch assign editions to stores:", error);
    return { success: false, error: "Failed to assign editions to stores" };
  }
}
