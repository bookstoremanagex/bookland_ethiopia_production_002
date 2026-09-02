"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth-actions";
import { createNotification } from "./notification-actions";

export async function getShopRemainingBalance(shopId: number) {
    try {
        const shop = await (prisma as any).bookshopes.findUnique({
            where: { id: shopId },
            include: {
                orders: {
                    where: { is_deleted: false }
                },
                payments: {
                    where: { is_deleted: false, status: "APPROVED" }
                }
            }
        });
        if (!shop) return { success: false, error: "Shop not found" };

        const totalDebt = shop.orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const remaining = totalDebt - shop.orders.reduce((sum: number, o: any) => sum + (o.amount_paid || 0), 0);

        return { success: true, remaining };
    } catch (error) {
        console.error("Error fetching shop balance:", error);
        return { success: false, error: "Failed to fetch balance" };
    }
}

export async function getShopTotalDebt(shopId: number) {
    try {
        const shop = await (prisma as any).bookshopes.findUnique({
            where: { id: shopId },
            select: { previousDebt: true },
        });
        const previousDebtAmount = shop?.previousDebt || 0;

        const orders = await (prisma as any).orders.findMany({
            where: { bookShopId: shopId, is_deleted: false },
            select: { id: true, total_amount: true, amount_paid: true, order_type: true, is_approved: true, createdAt: true },
        });

        const roundRecords = await (prisma as any).roundrecords.findMany({
            where: { bookshop_id: shopId, is_deleted: false },
            include: {
                round_payments: {
                    where: { is_deleted: false, status: "APPROVED" },
                    select: { amount: true },
                },
            },
        });

        const approvedPrevPayments: { amount: number }[] = [];

        let orderDebtTotal = 0;
        let roundDebt = 0;

        const requestedOrders = orders.filter((o: any) => o.order_type === "requested");
        const lastRequestedOrder = [...requestedOrders].sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        for (const order of orders) {
            const unpaid = (order.total_amount || 0) - (order.amount_paid || 0);
            if (unpaid <= 0) continue;
            if (order.order_type === "requested" && order.is_approved) {
                orderDebtTotal += unpaid;
            } else if (order.order_type === "on round") {
                roundDebt += unpaid;
            }
        }

        for (const record of roundRecords || []) {
            const paid = (record.round_payments || []).reduce((s: number, p: any) => s + (p.amount || 0), 0);
            const remaining = (record.totalprice || 0) - paid;
            if (remaining > 0) roundDebt += remaining;
        }

        const lastOrderDebt = lastRequestedOrder
            ? Math.max(0, (lastRequestedOrder.total_amount || 0) - (lastRequestedOrder.amount_paid || 0))
            : 0;
        const lastIncludedInOrderDebt = lastRequestedOrder?.is_approved && lastOrderDebt > 0;
        const orderDebt = Math.max(0, orderDebtTotal - (lastIncludedInOrderDebt ? lastOrderDebt : 0));

        const approvedPrevPaid = approvedPrevPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const previousDebtRemaining = Math.max(0, previousDebtAmount - approvedPrevPaid);

        const totalDebt = Math.max(0, orderDebt + roundDebt + previousDebtRemaining + lastOrderDebt);

        return { success: true, orderDebt, roundDebt, previousDebt: previousDebtRemaining, lastOrderDebt, totalDebt };
    } catch (error) {
        console.error("Error fetching shop total debt:", error);
        return { success: false, error: "Failed to fetch total debt" };
    }
}

export type ShopDebtData = {
    id: number;
    name: string;
    branch: string;
    location: string;
    orderDebt: number;
    roundDebt: number;
    previousDebt: number;
    lastOrderDebt: number;
    totalDebt: number;
};

export async function getAllShopsDebt(): Promise<{ success: boolean; data?: ShopDebtData[]; error?: string }> {
    try {
        const shops = await (prisma as any).bookshopes.findMany({
            where: { is_deleted: false },
            include: {
                orders: {
                    where: { is_deleted: false },
                    select: { id: true, total_amount: true, amount_paid: true, order_type: true, is_approved: true, createdAt: true },
                },
                roundrecords: {
                    where: { is_deleted: false },
                    include: {
                        round_payments: {
                            where: { is_deleted: false, status: "APPROVED" },
                            select: { amount: true },
                        },
                    },
                },
                payments: {
                    where: { is_deleted: false, is_for_previous_debts: true, status: "APPROVED" },
                    select: { amount: true },
                },
            },
        });

        const data = (shops as any[]).map((shop) => {
            let orderDebtTotal = 0;
            let roundDebt = 0;

            const requestedOrders = (shop.orders || []).filter((o: any) => o.order_type === "requested");
            const lastRequestedOrder = [...requestedOrders].sort(
                (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];

            for (const order of shop.orders || []) {
                const unpaid = (order.total_amount || 0) - (order.amount_paid || 0);
                if (unpaid <= 0) continue;
                if (order.order_type === "requested" && order.is_approved) {
                    orderDebtTotal += unpaid;
                } else if (order.order_type === "on round") {
                    roundDebt += unpaid;
                }
            }

            const lastOrderDebt = lastRequestedOrder
                ? Math.max(0, (lastRequestedOrder.total_amount || 0) - (lastRequestedOrder.amount_paid || 0))
                : 0;
            const lastIncludedInOrderDebt = lastRequestedOrder?.is_approved && lastOrderDebt > 0;
            const orderDebt = Math.max(0, orderDebtTotal - (lastIncludedInOrderDebt ? lastOrderDebt : 0));

            for (const record of shop.roundrecords || []) {
                const totalPaid = (record.round_payments || []).reduce(
                    (sum: number, p: any) => sum + (p.amount || 0),
                    0
                );
                const remaining = (record.totalprice || 0) - totalPaid;
                if (remaining > 0) roundDebt += remaining;
            }

            const previousDebtAmount = shop.previousDebt || 0;
            const approvedPrevPaid = (shop.payments || []).reduce(
                (sum: number, p: any) => sum + (p.amount || 0), 0
            );
            const previousDebtRemaining = Math.max(0, previousDebtAmount - approvedPrevPaid);

            return {
                id: shop.id,
                name: shop.name,
                branch: shop.branch || "Main",
                location: shop.location,
                orderDebt,
                roundDebt: Math.max(0, roundDebt),
                previousDebt: previousDebtRemaining,
                lastOrderDebt,
                totalDebt: Math.max(0, orderDebt + roundDebt + previousDebtRemaining + lastOrderDebt),
            };
        });

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching shops debt:", error);
        return { success: false, error: "Failed to fetch shop debts" };
    }
}

export async function getOrdersByShopId(shopId: number) {
  try {
    const orders = await (prisma as any).orders.findMany({
      where: {
        bookShopId: Number(shopId),
        is_deleted: false,
      },
      include: {
        checks: true,
        order_items: {
          include: {
            bookedition: {
              include: {
                books: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error("Fetch orders error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function getBookStockData(bookId: number, excludeOrderId?: number) {
  try {
    const id = Number(bookId);
    // Find all editions for this book with their store stock
    const editions = await (prisma as any).bookedition.findMany({
      where: {
        bookId: id,
        is_deleted: false,
      },
      include: {
        bookeditionstores: {
          where: { is_deleted: false },
        },
      },
      orderBy: { createdAt: "asc" }, // Earliest first for FIFO
    });

    // Subtract locked amounts from edition stock
    const editionIds = editions.map((ed: any) => ed.id);
    const lockedMap: Record<number, number> = {};
    if (editionIds.length > 0) {
      const lockWhere: any = {
        editionId: { in: editionIds },
        status: "locked",
        is_deleted: false,
      };
      if (excludeOrderId !== undefined) {
        lockWhere.order_id = { not: excludeOrderId };
      }
      const lockedRecords = await (prisma as any).locked_editions.findMany({
        where: lockWhere,
      });
      for (const lr of lockedRecords) {
        lockedMap[lr.editionId] = (lockedMap[lr.editionId] || 0) + lr.amount_locked;
      }
    }

    const stockData = editions.map((ed: any) => {
      const totalStock = ed.bookeditionstores.reduce(
        (acc: number, s: any) => acc + (s.quantity || 0),
        0,
      );
      const locked = lockedMap[ed.id] || 0;
      return {
        id: ed.id,
        name: ed.edition_name,
        price: ed.selling_price || 0,
        stock: Math.max(0, totalStock - locked),
      };
    });

    return { success: true, data: stockData };
  } catch (error) {
    console.error("Get stock data error:", error);
    return { success: false, error: "Failed to get stock data" };
  }
}

export async function createOrder(data: {
  bookShopId: number;
  order_type: string;
  memo?: string;
  amount_paid: number;
  total_amount?: number | null;
  payment_type?: string;
  check_id?: number | null;
  lock_books?: boolean;
  items: { bookId: number; quantity: number }[];
}) {
  try {
    // 1. Calculate total amount and prepare items using FIFO
    let totalAmount = 0;
    const finalOrderItems: any[] = [];

    for (const item of data.items) {
      const stockRes = await getBookStockData(item.bookId);
      if (!stockRes.success || !stockRes.data) {
        throw new Error(`Failed to get stock for book ${item.bookId}`);
      }

      let remainingToFill = item.quantity;
      const editions = stockRes.data;
      const totalSystemStock = editions.reduce(
        (acc: number, e: any) => acc + e.stock,
        0,
      );

      if (remainingToFill > totalSystemStock) {
        throw new Error(
          `Insufficient aggregate stock for book ID ${item.bookId}. Requested ${remainingToFill}, Available ${totalSystemStock}`,
        );
      }

      for (const edition of editions) {
        if (remainingToFill <= 0) break;
        if (edition.stock <= 0) continue;

        const take = Math.min(remainingToFill, edition.stock);
        finalOrderItems.push({
          bookEditionId: edition.id,
          quantity: take,
          price_at_order: edition.price,
        });
        totalAmount += take * edition.price;
        remainingToFill -= take;
      }

      if (remainingToFill > 0) {
        throw new Error(
          `Internal error: Could not fill order for book ${item.bookId} despite available stock check.`,
        );
      }
    }

    if (data.total_amount != null) {
      totalAmount = data.total_amount;
    }

    // 2. Create the order
    const order = await (prisma as any).orders.create({
      data: {
        bookShopId: Number(data.bookShopId),
        order_type: data.order_type,
        memo: data.memo,
        amount_paid: data.amount_paid,
        payment_type: data.payment_type || "DIRECT",
        check_id: data.check_id || null,
        total_amount: totalAmount,
        is_approved: false,
        status: "Pending",
        updatedAt: new Date(),
        order_items: {
          create: finalOrderItems,
        },
      },
      include: {
        order_items: true,
      },
    });

    // 2b. If payment_type is CHECK, create a payment record
    if (data.payment_type === "CHECK" && data.check_id && data.amount_paid > 0) {
      try {
        await (prisma as any).payments.create({
          data: {
            shopId: Number(data.bookShopId),
            amount: data.amount_paid,
            payment_type: "CHECK",
            checkId: data.check_id,
            status: "PENDING",
            updatedAt: new Date(),
          },
        });
      } catch (paymentErr) {
        console.error("Failed to create payment record for check order:", paymentErr);
      }
    }

    // 2c. If lock_books is enabled, create locked_editions records
    if (data.lock_books) {
      try {
        await (prisma as any).locked_editions.createMany({
          data: finalOrderItems.map((item: any) => ({
            editionId: item.bookEditionId,
            amount_locked: item.quantity,
            order_id: order.id,
            status: "locked",
            updatedAt: new Date(),
          })),
        });
      } catch (lockErr) {
        console.error("Failed to lock editions:", lockErr);
      }
    }

    revalidatePath(`/admin_dashboard/book_shops/${data.bookShopId}`);

    // Create notification
    try {
      const session = await getCurrentSession();
      const shop = await (prisma as any).bookshopes.findUnique({
        where: { id: Number(data.bookShopId) }
      });

      const itemsDetail = finalOrderItems
        .map((item: any, i: number) => {
          const origItem = data.items[Math.min(i, data.items.length - 1)];
          return `${origItem?.bookId ? `Book #${origItem.bookId}` : `Edition #${item.bookEditionId}`} x${item.quantity} @ ${item.price_at_order} ETB`;
        })
        .join(", ");

      const detailsObj = {
        shopName: shop?.name || `Shop #${data.bookShopId}`,
        placedBy: session?.name || "Unknown",
        items: itemsDetail,
        totalAmount: totalAmount,
        orderId: order.id,
        orderType: data.order_type,
      };

      await createNotification({
        title: `New Order from ${shop?.name || `Shop #${data.bookShopId}`}`,
        message: `A new order has been placed by ${session?.name || "Unknown"} at ${shop?.name || `Shop #${data.bookShopId}`}. Total: ${totalAmount.toLocaleString()} ETB. Please check the Manage Orders menu for details.`,
        details: JSON.stringify(detailsObj),
        type: "ORDER",
        notification_to: "ADMIN",
        notification_from: session?.name || "System",
      });
    } catch (notifError) {
      console.error("Failed to create notification for new order:", notifError);
    }

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Create order error:", error);
    return { success: false, error: error.message || "Failed to create order" };
  }
}

/**
 * Edit a pending (unapproved) order in place, re-running the same FIFO
 * allocation used by createOrder but excluding this order's own locks so the
 * existing quantities remain valid. Replaces order items, recomputes the total
 * (or applies a manual override), syncs locked_editions, and updates the
 * amount paid / order type / lock flag.
 */
export async function updateOrder(
  orderId: number,
  data: {
    order_type: string;
    memo?: string;
    amount_paid: number;
    total_amount?: number | null;
    lock_books?: boolean;
    items: { bookId: number; quantity: number }[];
  },
) {
  try {
    const session = await getCurrentSession();
    if (!session?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const id = Number(orderId);
    const existing = await (prisma as any).orders.findUnique({
      where: { id },
      include: { bookshopes: true },
    });
    if (!existing) return { success: false, error: "Order not found" };
    if (existing.is_approved) {
      return { success: false, error: "Approved orders cannot be edited" };
    }

    // 1. Calculate total amount and prepare items using FIFO,
    //    excluding this order's own locks from available stock
    let totalAmount = 0;
    const finalOrderItems: any[] = [];

    for (const item of data.items) {
      const stockRes = await getBookStockData(item.bookId, id);
      if (!stockRes.success || !stockRes.data) {
        throw new Error(`Failed to get stock for book ${item.bookId}`);
      }

      let remainingToFill = item.quantity;
      const editions = stockRes.data;
      const totalSystemStock = editions.reduce(
        (acc: number, e: any) => acc + e.stock,
        0,
      );

      if (remainingToFill > totalSystemStock) {
        throw new Error(
          `Insufficient aggregate stock for book ID ${item.bookId}. Requested ${remainingToFill}, Available ${totalSystemStock}`,
        );
      }

      for (const edition of editions) {
        if (remainingToFill <= 0) break;
        if (edition.stock <= 0) continue;

        const take = Math.min(remainingToFill, edition.stock);
        finalOrderItems.push({
          bookEditionId: edition.id,
          quantity: take,
          price_at_order: edition.price,
        });
        totalAmount += take * edition.price;
        remainingToFill -= take;
      }

      if (remainingToFill > 0) {
        throw new Error(
          `Internal error: Could not fill order for book ${item.bookId} despite available stock check.`,
        );
      }
    }

    if (data.total_amount != null) {
      totalAmount = data.total_amount;
    }

    // 2. Replace items, sync locks/payment, and update the order in a transaction
    await (prisma as any).$transaction(
      async (tx: any) => {
        // Replace order items
        await tx.order_items.deleteMany({ where: { orderId: id } });
        for (const fi of finalOrderItems) {
          await tx.order_items.create({
            data: {
              orderId: id,
              bookEditionId: fi.bookEditionId,
              quantity: fi.quantity,
              price_at_order: fi.price_at_order,
            },
          });
        }

        // Sync locked_editions (release old, re-lock new if lock_books enabled)
        await tx.locked_editions.deleteMany({ where: { order_id: id } });
        if (data.lock_books) {
          await tx.locked_editions.createMany({
            data: finalOrderItems.map((fi: any) => ({
              editionId: fi.bookEditionId,
              amount_locked: fi.quantity,
              order_id: id,
              status: "locked",
              updatedAt: new Date(),
            })),
          });
        }

        // Keep the auto-created CHECK payment in sync with the new paid amount
        if (existing.check_id) {
          await tx.payments.updateMany({
            where: {
              checkId: existing.check_id,
              payment_type: "CHECK",
              status: "PENDING",
              is_deleted: false,
            },
            data: { amount: data.amount_paid, updatedAt: new Date() },
          });
        }

        // Update the order
        await tx.orders.update({
          where: { id },
          data: {
            order_type: data.order_type,
            memo: data.memo ?? existing.memo,
            amount_paid: data.amount_paid,
            total_amount: totalAmount,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      },
      { timeout: 30000 },
    );

    const updated = await (prisma as any).orders.findUnique({
      where: { id },
      include: {
        bookshopes: true,
        checks: true,
        order_items: {
          include: {
            bookedition: { include: { books: true } },
          },
        },
      },
    });

    // Record activity log
    try {
      if (session?.id) {
        const shopName = existing.bookshopes?.name || `Shop #${existing.bookShopId}`;
        await (prisma as any).activityLogs.create({
          data: {
            accountId: session.id,
            action: `Edited pending order ORD-${id} for ${shopName}`,
            details: JSON.stringify({
              orderId: id,
              shopId: existing.bookShopId,
              shopName,
              totalAmount,
              amountPaid: data.amount_paid,
              items: data.items,
            }),
            updatedAt: new Date(),
          },
        });
      }
    } catch (logError) {
      console.error("Failed to record activity log for order edit:", logError);
    }

    revalidatePath("/admin_dashboard/manage_orders");
    revalidatePath(`/admin_dashboard/book_shops/${existing.bookShopId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Update order error:", error);
    return {
      success: false,
      error: error?.meta?.cause || error?.message || "Failed to update order",
    };
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  isApproved?: boolean,
) {
  try {
    const updateData: any = { status, updatedAt: new Date() };
    if (isApproved !== undefined) updateData.is_approved = isApproved;

    const updated = await (prisma as any).orders.update({
      where: { id: Number(orderId) },
      data: updateData,
    });

    revalidatePath(`/admin_dashboard/book_shops/${updated.bookShopId}`);
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update order status" };
  }
}

// ─── Manage Orders Page Actions ───────────────────────────────────────────────

export async function getPendingOrdersCount() {
  try {
    const count = await (prisma as any).orders.count({
      where: { is_approved: false, is_deleted: false },
    });
    return { success: true, count };
  } catch (error) {
    return { success: true, count: 0 };
  }
}

export async function getAllOrders() {
  try {
    const orders = await (prisma as any).orders.findMany({
      where: { is_deleted: false },
      include: {
        bookshopes: true,
        checks: true,
        locked_editions: {
          where: { is_deleted: false },
        },
        order_items: {
          include: {
            bookedition: {
              include: { books: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error("Get all orders error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

/**
 * Fetch a single order (same include shape as getAllOrders) so the admin can
 * refresh the approval dialog in place after mutating the order.
 */
export async function getOrderById(orderId: number) {
  try {
    const order = await (prisma as any).orders.findUnique({
      where: { id: Number(orderId) },
      include: {
        bookshopes: true,
        checks: true,
        locked_editions: {
          where: { is_deleted: false },
        },
        order_items: {
          include: {
            bookedition: {
              include: { books: true },
            },
          },
        },
      },
    });
    if (!order) return { success: false, error: "Order not found" };
    return { success: true, data: order };
  } catch (error) {
    console.error("Get order by id error:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}

/**
 * For each edition of a given book, returns the list of stores that have stock,
 * with the store name, storeId, editionId, edition name, price, and available quantity.
 */
export async function getBookStockBreakdown(bookId: number, editionIds?: number[], excludeOrderId?: number) {
  try {
    const id = Number(bookId);
    const where: any = { bookId: id, is_deleted: false };
    if (editionIds && editionIds.length > 0) {
      where.id = { in: editionIds };
    }
    const editions = await (prisma as any).bookedition.findMany({
      where,
      include: {
        bookeditionstores: {
          where: { is_deleted: false, quantity: { gt: 0 } },
          include: { stores: true },
        },
        bookeditionprinters: {
          where: { is_deleted: false, quantity: { gt: 0 } },
          include: { printer: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Fetch aggregated locked amounts for all relevant editions, excluding current order's own locks
    const allEditionIds = editions.map((ed: any) => ed.id);
    const lockedMap: Record<number, number> = {};
    if (allEditionIds.length > 0) {
      const lockWhere: any = {
        editionId: { in: allEditionIds },
        status: "locked",
        is_deleted: false,
      };
      if (excludeOrderId !== undefined) {
        lockWhere.order_id = { not: excludeOrderId };
      }
      const lockedRecords = await (prisma as any).locked_editions.findMany({
        where: lockWhere,
      });
      for (const lr of lockedRecords) {
        lockedMap[lr.editionId] = (lockedMap[lr.editionId] || 0) + lr.amount_locked;
      }
    }

    const result = editions
      .map((ed: any) => {
        const lockedAmount = lockedMap[ed.id] || 0;
        let remainingToSubtract = lockedAmount;
        const stores = [
          ...ed.bookeditionstores.map((s: any) => ({
            storeStockId: s.id,
            storeId: s.storeId,
            storeName: s.stores?.name || "Unknown Store",
            availableQty: s.quantity || 0,
            type: "store" as const,
          })),
          ...ed.bookeditionprinters.map((p: any) => ({
            storeStockId: p.id,
            storeId: p.printerId,
            storeName: p.printer?.name || "Unknown Printer",
            availableQty: p.quantity || 0,
            type: "printer" as const,
          })),
        ].map(st => {
          if (remainingToSubtract <= 0) return st;
          const sub = Math.min(st.availableQty, remainingToSubtract);
          remainingToSubtract -= sub;
          return { ...st, availableQty: st.availableQty - sub };
        });

        return {
          editionId: ed.id,
          editionName: ed.edition_name,
          price: ed.selling_price || 0,
          lockedAmount,
          stores,
        };
      })
      .filter((edition: any) => edition.stores.length > 0);

    return { success: true, data: result };
  } catch (error) {
    console.error("Get book stock breakdown error:", error);
    return { success: false, error: "Failed to fetch stock breakdown" };
  }
}

/**
 * Approve an order:
 * - Deduct stock from the selected stores
 * - Add to the bookshop's assignments (bookshopeditions)
 * - Mark order as approved
 */
export async function approveOrder(
  orderId: number,
  allocations: {
    bookEditionId: number;
    storeId: number;
    storeStockId: number;
    quantity: number;
    price: number;
    type: "store" | "printer";
  }[],
  allocationSummary?: string,
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only administrators can approve orders" };
    }

    const id = Number(orderId);
    const order = await (prisma as any).orders.findUnique({
      where: { id },
      include: { order_items: true, bookshopes: true, checks: true },
    });

    if (!order) return { success: false, error: "Order not found" };
    if (order.is_approved)
      return { success: false, error: "Order is already approved" };
    if (order.payment_type === "CHECK" && order.check_id) {
      const check = await (prisma as any).checks.findUnique({ where: { id: order.check_id } });
      if (!check || check.status !== "CLEARED") {
        return { success: false, error: "The associated check must be cleared before this order can be approved." };
      }
    }

    // Sanitize allocations - ensure all values are proper numbers
    const sanitized = allocations.map((a) => ({
      bookEditionId: Number(a.bookEditionId),
      storeId: Number(a.storeId),
      storeStockId: Number(a.storeStockId),
      quantity: Math.round(Number(a.quantity)),
      price: Number(a.price),
      type: a.type,
    }));

    // Calculate total for the approved allocations
    let newTotal = 0;
    for (const alloc of sanitized) {
      newTotal += alloc.quantity * alloc.price;
    }

    await (prisma as any).$transaction(
      async (tx: any) => {

        // Proportional paid amount per item
        // Collateral checks don't reduce debt
        const isCollateral = order.checks?.type === "COLLATERAL";
        const effectivePaid = isCollateral ? 0 : order.amount_paid;
        const paidRatio =
          order.total_amount > 0 ? effectivePaid / order.total_amount : 0;

        for (const alloc of sanitized) {
          const itemValue = alloc.quantity * alloc.price;
          const itemPaid = itemValue * paidRatio;
          const itemRemaining = itemValue - itemPaid;

          // 1. Deduct from store or printer stock (updateMany with guard eliminates a separate findUnique)
          if (alloc.type === "printer") {
            const result = await tx.bookeditionprinters.updateMany({
              where: {
                id: alloc.storeStockId,
                quantity: { gte: alloc.quantity },
              },
              data: {
                quantity: { decrement: alloc.quantity },
                updatedAt: new Date(),
              },
            });
            if (result.count === 0) {
              throw new Error(
                `Insufficient stock at printer for edition ${alloc.bookEditionId}`,
              );
            }
          } else {
            const result = await tx.bookeditionstores.updateMany({
              where: {
                id: alloc.storeStockId,
                quantity: { gte: alloc.quantity },
              },
              data: {
                quantity: { decrement: alloc.quantity },
                updatedAt: new Date(),
              },
            });
            if (result.count === 0) {
              throw new Error(
                `Insufficient stock at store for edition ${alloc.bookEditionId}`,
              );
            }
          }

          // 2. Add to bookshop editions (create or update)
          const existing = await tx.bookshopeditions.findFirst({
            where: {
              bookShopId: Number(order.bookShopId),
              bookEditionId: alloc.bookEditionId,
              is_deleted: false,
            },
          });

          if (existing) {
            await tx.bookshopeditions.update({
              where: { id: existing.id },
              data: {
                quantity: { increment: alloc.quantity },
                total_price: { increment: itemValue },
                already_paid: { increment: itemPaid },
                remaining_amount: { increment: itemRemaining },
                updatedAt: new Date(),
              },
            });
          } else {
            await tx.bookshopeditions.create({
              data: {
                bookShopId: Number(order.bookShopId),
                bookEditionId: alloc.bookEditionId,
                quantity: alloc.quantity,
                price_per_peice: alloc.price,
                total_price: itemValue,
                already_paid: itemPaid,
                remaining_amount: itemRemaining,
                updatedAt: new Date(),
              },
            });
          }
        }

        // 3. Delete old order_items and recreate with approved allocations
        await tx.order_items.deleteMany({ where: { orderId: order.id } });

        // Create new order items one by one to avoid createMany issues
        for (const a of sanitized) {
          await tx.order_items.create({
            data: {
              orderId: order.id,
              bookEditionId: a.bookEditionId,
              quantity: a.quantity,
              price_at_order: a.price,
            },
          });
        }

        // 4. Delete locked_editions for this order (stock is now physically deducted)
        await tx.locked_editions.deleteMany({
          where: { order_id: order.id, status: "locked" },
        });

        // 5. Mark order as approved (orders uses @updatedAt, so omit manual updatedAt)
        await tx.orders.update({
          where: { id: order.id },
          data: {
            is_approved: true,
            status: "Approved",
            total_amount: newTotal,
            allocation_summary: allocationSummary || null,
          },
        });

        return true;
      },
      { timeout: 180000 },
    );

    revalidatePath("/admin_dashboard/manage_orders");
    revalidatePath(`/admin_dashboard/book_shops/${order.bookShopId}`);

    // Record activity log with allocation details
    try {
      if (session?.id) {
        const shopName = order.bookshopes?.name || `Shop #${order.bookShopId}`;
        await (prisma as any).activityLogs.create({
          data: {
            accountId: session.id,
            action: `Approved shop order ORD-${order.id} for ${shopName}`,
            details: JSON.stringify({
              orderId: order.id,
              shopId: order.bookShopId,
              shopName,
              totalAmount: newTotal,
              allocations: sanitized.length,
              allocationSummary: allocationSummary || null,
            }),
            updatedAt: new Date(),
          },
        });
      }
    } catch (logError) {
      console.error("Failed to record activity log for order approval:", logError);
    }

    // Create notifications for delivery and sales roles
    try {
      const shopName = order.bookshopes?.name || `Shop #${order.bookShopId}`;
      const summaryText = allocationSummary || `Order ORD-${order.id} approved with ${sanitized.length} allocations.`;

      // 1. Notify DELIVERY_AND_SALES role (shows in delivery_dashboard_full notifications)
      await createNotification({
        title: `Order ORD-${order.id} Approved for ${shopName}`,
        message: `Order ORD-${order.id} has been approved. Stock has been allocated.\n\n${summaryText}`,
        details: JSON.stringify({
          orderId: order.id,
          shopName,
          totalAmount: newTotal,
          allocationSummary: summaryText,
        }),
        type: "ORDER",
        notification_to: "DELIVERY_AND_SALES",
        notification_from: session?.name || "System",
      });

      // 2. Notify Delivery Account accounts individually
      const deliveryAccounts = await (prisma as any).accounts.findMany({
        where: {
          account_type: "Delivery Account",
          is_deleted: false,
        },
        select: { id: true, name: true },
      });
      for (const acc of deliveryAccounts) {
        await createNotification({
          title: `Order ORD-${order.id} Approved for ${shopName}`,
          message: `Order ORD-${order.id} has been approved. Stock has been allocated. Check the details for the full breakdown.\n\n${summaryText}`,
          details: JSON.stringify({
            orderId: order.id,
            shopName,
            totalAmount: newTotal,
            allocationSummary: summaryText,
          }),
          type: "ORDER",
          notification_from: session?.name || "System",
          accountId: acc.id,
        });
      }

      // 3. Notify Delivery Sample accounts individually
      const deliverySampleAccounts = await (prisma as any).accounts.findMany({
        where: {
          account_type: "Delivery Sample",
          is_deleted: false,
        },
        select: { id: true, name: true },
      });
      for (const acc of deliverySampleAccounts) {
        await createNotification({
          title: `Order ORD-${order.id} Approved for ${shopName}`,
          message: `Order ORD-${order.id} has been approved. Stock has been allocated. Check order details for the full breakdown.\n\n${summaryText}`,
          details: JSON.stringify({
            orderId: order.id,
            shopName,
            totalAmount: newTotal,
            allocationSummary: summaryText,
          }),
          type: "ORDER",
          notification_from: session?.name || "System",
          accountId: acc.id,
        });
      }


    } catch (notifError) {
      console.error("Failed to create approval notifications:", notifError);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Approve order error:", error);
    const message =
      error?.meta?.cause || error?.message || "Failed to approve order";
    return {
      success: false,
      error: String(message),
    };
  }
}

/**
 * Update the amount paid for a specific order.
 * This is used in the admin dashboard to allow quick edits of the paid amount.
 */
export async function updateOrderPayment(orderId: number, amountPaid: number) {
  try {
    const updated = await (prisma as any).orders.update({
      where: { id: Number(orderId) },
      data: {
        amount_paid: amountPaid,
        updatedAt: new Date(),
      },
    });

    // Re‑validate the shop page so the UI reflects the change
    if (updated?.bookShopId) {
      revalidatePath(`/admin_dashboard/book_shops/${updated.bookShopId}`);
    }
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update order payment error:", error);
    return { success: false, error: "Failed to update order payment" };
  }
}

export async function markOrderDelivered(orderId: number) {
  try {
    const session = await getCurrentSession();
    if (!session?.id) return { success: false, error: "Not authenticated" };

    const order = await (prisma as any).orders.findUnique({
      where: { id: Number(orderId) },
      select: { id: true, is_approved: true, delivery: true, bookShopId: true, bookshopes: { select: { name: true } } },
    });

    if (!order) return { success: false, error: "Order not found" };
    if (!order.is_approved) return { success: false, error: "Order must be approved first" };
    if (order.delivery) return { success: false, error: "Order already marked as delivered" };

    await (prisma as any).orders.update({
      where: { id: Number(orderId) },
      data: {
        delivery: true,
        delivered_by: session.id,
        updatedAt: new Date(),
      },
    });

    const shopName = order.bookshopes?.name || `Shop #${order.bookShopId}`;

    // Record activity log
    try {
      await (prisma as any).activityLogs.create({
        data: {
          accountId: session.id,
          action: `Marked order ORD-${orderId} as delivered for ${shopName}`,
          details: JSON.stringify({ orderId, deliveredBy: session.id, shopName }),
          updatedAt: new Date(),
        },
      });
    } catch (logErr) {
      console.error("Failed to record delivery activity log:", logErr);
    }

    // Notify ADMIN
    try {
      await createNotification({
        title: `Order ORD-${orderId} Delivered to ${shopName}`,
        message: `Order ORD-${orderId} has been marked as delivered by ${session.name || "System"}.`,
        details: JSON.stringify({ orderId, deliveredBy: session.id, shopName }),
        type: "ORDER",
        notification_to: "ADMIN",
        notification_from: session?.name || "System",
      });
    } catch (notifErr) {
      console.error("Failed to create delivery notification:", notifErr);
    }

    revalidatePath("/admin_dashboard/manage_orders");
    return { success: true };
  } catch (error: any) {
    console.error("Mark order delivered error:", error);
    return { success: false, error: error?.message || "Failed to mark order as delivered" };
  }
}

export async function removeBookFromOrder(orderId: number, bookId: number) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only administrators can modify orders" };
    }

    const id = Number(orderId);
    const bId = Number(bookId);

    const order = await (prisma as any).orders.findUnique({ where: { id } });
    if (!order) return { success: false, error: "Order not found" };
    if (order.is_approved) return { success: false, error: "Cannot modify an approved order" };

    // Fetch order_items with their edition info for this book
    const itemsWithBooks = await (prisma as any).order_items.findMany({
      where: { orderId: id },
      include: { bookedition: true },
    });

    const targetItems = itemsWithBooks.filter(
      (item: any) => item.bookedition?.bookId === bId,
    );

    if (targetItems.length === 0) {
      return { success: false, error: "No items found for this book in the order" };
    }

    const removedTotal = targetItems.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price_at_order,
      0,
    );
    const editionIds = targetItems.map((item: any) => item.bookEditionId);

    // Delete the order_items and update total in a transaction
    await (prisma as any).$transaction(async (tx: any) => {
      await tx.order_items.deleteMany({
        where: { id: { in: targetItems.map((i: any) => i.id) } },
      });

      await tx.orders.update({
        where: { id },
        data: {
          total_amount: { decrement: removedTotal },
          updatedAt: new Date(),
        },
      });

      // Remove locked_editions for these editions on this order
      if (editionIds.length > 0) {
        await tx.locked_editions.deleteMany({
          where: { order_id: id, editionId: { in: editionIds } },
        });
      }
    });

    revalidatePath("/admin_dashboard/manage_orders");
    return { success: true, data: { removedTotal } };
  } catch (error: any) {
    console.error("Remove book from order error:", error);
    return { success: false, error: error?.message || "Failed to remove book from order" };
  }
}

/**
 * Bulk-remove multiple books from a pending (unapproved) order in a single
 * transaction. For each selected book it:
 * - Deletes the matching order_items
 * - Decrements the order total by the sum of removed item amounts
 * - Frees the locked stock for those books' editions (locked_editions rows)
 * Returns a count of removed items and the total amount subtracted.
 */
export async function removeBooksFromOrder(orderId: number, bookIds: number[]) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only administrators can modify orders" };
    }

    const id = Number(orderId);
    const ids = (bookIds || []).map(Number).filter((n) => !isNaN(n) && n > 0);
    if (ids.length === 0) return { success: false, error: "No books selected" };

    const order = await (prisma as any).orders.findUnique({ where: { id } });
    if (!order) return { success: false, error: "Order not found" };
    if (order.is_approved) return { success: false, error: "Cannot modify an approved order" };

    // Fetch order_items with their edition info for the selected books
    const itemsWithBooks = await (prisma as any).order_items.findMany({
      where: { orderId: id },
      include: { bookedition: true },
    });

    const targetItems = itemsWithBooks.filter(
      (item: any) => item.bookedition && ids.includes(item.bookedition.bookId),
    );

    if (targetItems.length === 0) {
      return { success: false, error: "No items found for the selected books" };
    }

    const removedTotal = targetItems.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price_at_order,
      0,
    );
    const editionIds = targetItems.map((item: any) => item.bookEditionId);

    await (prisma as any).$transaction(async (tx: any) => {
      await tx.order_items.deleteMany({
        where: { id: { in: targetItems.map((i: any) => i.id) } },
      });

      await tx.orders.update({
        where: { id },
        data: {
          total_amount: { decrement: removedTotal },
          updatedAt: new Date(),
        },
      });

      // Free locked stock for the removed books' editions on this order
      if (editionIds.length > 0) {
        await tx.locked_editions.deleteMany({
          where: { order_id: id, editionId: { in: editionIds } },
        });
      }
    });

    revalidatePath("/admin_dashboard/manage_orders");
    return { success: true, data: { removedTotal, removedItems: targetItems.length } };
  } catch (error: any) {
    console.error("Bulk remove books from order error:", error);
    return { success: false, error: error?.message || "Failed to remove books from order" };
  }
}

/**
 * Permanently delete a pending (unapproved) order and revert every change it
 * made, restoring the system exactly to its pre-order state:
 * - Releases locked edition stock (locked_editions) so the quantities are
 *   available again exactly as before the order
 * - Removes any payment records created for this order (money)
 * - Deletes order items and the order itself
 * Only pending orders can be deleted; approved orders are locked.
 */
export async function deleteOrder(orderId: number) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Only administrators can delete orders" };
    }

    const id = Number(orderId);
    const order = await (prisma as any).orders.findUnique({
      where: { id },
      include: { bookshopes: true },
    });
    if (!order) return { success: false, error: "Order not found" };
    if (order.is_approved) {
      return { success: false, error: "Approved orders cannot be deleted" };
    }

    await (prisma as any).$transaction(
      async (tx: any) => {
        // 1. Release locked stock so it becomes available again
        await tx.locked_editions.deleteMany({ where: { order_id: id } });

        // 2. Remove payment records created for this order
        await tx.payments.deleteMany({
          where: {
            OR: [{ orderid: String(id) }, { orderid: `ORD-${id}` }],
          },
        });

        // 2b. Remove the auto-created CHECK payment (createOrder records it without orderid)
        if (order.check_id) {
          await tx.payments.deleteMany({
            where: {
              checkId: order.check_id,
              payment_type: "CHECK",
              status: "PENDING",
              is_deleted: false,
            },
          });
        }

        // 3. Delete order items
        await tx.order_items.deleteMany({ where: { orderId: id } });

        // 4. Delete the order (cascades any remaining locked_editions / order_items)
        await tx.orders.delete({ where: { id } });
      },
      { timeout: 30000 },
    );

    // Record activity log
    try {
      if (session?.id) {
        const shopName = order.bookshopes?.name || `Shop #${order.bookShopId}`;
        await (prisma as any).activityLogs.create({
          data: {
            accountId: session.id,
            action: `Deleted pending order ORD-${order.id} for ${shopName}`,
            details: JSON.stringify({
              orderId: order.id,
              shopId: order.bookShopId,
              shopName,
              totalAmount: order.total_amount,
              amountPaid: order.amount_paid,
            }),
            updatedAt: new Date(),
          },
        });
      }
    } catch (logError) {
      console.error("Failed to record activity log for order deletion:", logError);
    }

    revalidatePath("/admin_dashboard/manage_orders");
    revalidatePath(`/admin_dashboard/book_shops/${order.bookShopId}`);
    return { success: true, data: { deletedId: order.id } };
  } catch (error: any) {
    console.error("Delete order error:", error);
    return {
      success: false,
      error: error?.meta?.cause || error?.message || "Failed to delete order",
    };
  }
}

export async function updateShopDebt(shopId: number, newTotalDebt: number) {
  try {
    const session = await getCurrentSession();
    if (!session?.id) return { success: false, error: "Unauthorized" };

    const shopOrders = await (prisma as any).orders.findMany({
      where: { bookShopId: shopId, is_deleted: false },
      select: { total_amount: true, amount_paid: true },
    });
    const currentDebt = shopOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
    const diff = newTotalDebt - currentDebt;
    if (Math.abs(diff) < 0.01) return { success: true };

    if (diff > 0) {
      await (prisma as any).orders.create({
        data: {
          bookShopId: shopId,
          total_amount: diff,
          amount_paid: 0,
          status: "PENDING",
          payment_type: "DIRECT",
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      });
    } else {
      let remaining = -diff;
      const orders = await (prisma as any).orders.findMany({
        where: { bookShopId: shopId, is_deleted: false },
        orderBy: { createdAt: 'desc' },
      });
      for (const order of orders) {
        if (remaining <= 0) break;
        const orderTotal = order.total_amount || 0;
        if (orderTotal <= 0) continue;
        const toReduce = Math.min(remaining, orderTotal);
        await (prisma as any).orders.update({
          where: { id: order.id },
          data: { total_amount: orderTotal - toReduce },
        });
        remaining -= toReduce;
      }
    }

    revalidatePath("/admin_dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Update shop debt error:", error);
    return { success: false, error: "Failed to update shop debt" };
  }
}

export async function updateShopTotals(shopId: number, totalPaid: number) {
  try {
    const session = await getCurrentSession();
    if (!session?.id) return { success: false, error: "Unauthorized" };

    const orders = await (prisma as any).orders.findMany({
      where: { bookShopId: shopId, is_deleted: false },
      orderBy: { createdAt: 'asc' },
    });

    const currentPaid = orders.reduce((sum: number, o: any) => sum + (o.amount_paid || 0), 0);
    const diff = totalPaid - currentPaid;
    if (Math.abs(diff) < 0.01) return { success: true };

    if (diff > 0) {
      let remaining = diff;
      for (const order of orders) {
        if (remaining <= 0) break;
        const orderRemaining = (order.total_amount || 0) - (order.amount_paid || 0);
        if (orderRemaining <= 0) continue;
        const toApply = Math.min(remaining, orderRemaining);
        await (prisma as any).orders.update({
          where: { id: order.id },
          data: { amount_paid: (order.amount_paid || 0) + toApply },
        });
        remaining -= toApply;
      }
    } else {
      let remaining = -diff;
      const reversed = [...orders].reverse();
      for (const order of reversed) {
        if (remaining <= 0) break;
        const paid = order.amount_paid || 0;
        if (paid <= 0) continue;
        const toRemove = Math.min(remaining, paid);
        await (prisma as any).orders.update({
          where: { id: order.id },
          data: { amount_paid: paid - toRemove },
        });
        remaining -= toRemove;
      }
    }

    revalidatePath("/admin_dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Update shop totals error:", error);
    return { success: false, error: "Failed to update shop totals" };
  }
}

export async function setOrderHideRemaining(orderId: number, hide: boolean) {
  try {
    await (prisma as any).orders.update({
      where: { id: Number(orderId) },
      data: { hide_remaining: hide, updatedAt: new Date() },
    });

    // Fetch shopId for revalidation
    const order = await (prisma as any).orders.findUnique({
      where: { id: Number(orderId) },
      select: { bookShopId: true },
    });

    if (order?.bookShopId) {
      revalidatePath(`/admin_dashboard/manage_payment/${order.bookShopId}`);
    }
    return { success: true, hide_remaining: hide };
  } catch (error: any) {
    console.error("Set hide remaining error:", error);
    return { success: false, error: error?.message || "Failed to update" };
  }
}

export async function getApprovedOrderPayments() {
  try {
    const payments = await (prisma as any).payments.findMany({
      where: {
        is_deleted: false,
        status: "APPROVED",
        orderid: { not: null },
      },
      select: { id: true, amount: true, orderid: true, is_for_printer: true, is_for_previous_debts: true, createdAt: true, payment_type: true, status: true, memo: true },
    });
    return { success: true, data: payments };
  } catch (error) {
    console.error("Get approved order payments error:", error);
    return { success: false, error: "Failed to fetch order payments" };
  }
}
