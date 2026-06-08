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

export async function getBookStockData(bookId: number) {
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

    const stockData = editions.map((ed: any) => {
      const totalStock = ed.bookeditionstores.reduce(
        (acc: number, s: any) => acc + (s.quantity || 0),
        0,
      );
      return {
        id: ed.id,
        name: ed.edition_name,
        price: ed.selling_price || 0,
        stock: totalStock,
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
  payment_type?: string;
  check_id?: number | null;
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
 * For each edition of a given book, returns the list of stores that have stock,
 * with the store name, storeId, editionId, edition name, price, and available quantity.
 */
export async function getBookStockBreakdown(bookId: number, editionIds?: number[]) {
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

    const result = editions
      .map((ed: any) => ({
        editionId: ed.id,
        editionName: ed.edition_name,
        price: ed.selling_price || 0,
        stores: [
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
        ],
      }))
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
          // 1. Deduct from store or printer stock
          if (alloc.type === "printer") {
            const printerStock = await tx.bookeditionprinters.findUnique({
              where: { id: alloc.storeStockId },
            });
            if (!printerStock || (printerStock.quantity || 0) < alloc.quantity) {
              throw new Error(
                `Insufficient stock at printer for edition ${alloc.bookEditionId}`,
              );
            }
            await tx.bookeditionprinters.update({
              where: { id: alloc.storeStockId },
              data: {
                quantity: { decrement: alloc.quantity },
                updatedAt: new Date(),
              },
            });
          } else {
            const storeStock = await tx.bookeditionstores.findUnique({
              where: { id: alloc.storeStockId },
            });
            if (!storeStock || (storeStock.quantity || 0) < alloc.quantity) {
              throw new Error(
                `Insufficient stock at store for edition ${alloc.bookEditionId}`,
              );
            }
            await tx.bookeditionstores.update({
              where: { id: alloc.storeStockId },
              data: {
                quantity: { decrement: alloc.quantity },
                updatedAt: new Date(),
              },
            });
          }

          // 2. Add to bookshop editions (create or update)
          const existing = await tx.bookshopeditions.findFirst({
            where: {
              bookShopId: Number(order.bookShopId),
              bookEditionId: alloc.bookEditionId,
              is_deleted: false,
            },
          });

          const itemValue = alloc.quantity * alloc.price;
          const itemPaid = itemValue * paidRatio;
          const itemRemaining = itemValue - itemPaid;

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

        // 4. Mark order as approved (orders uses @updatedAt, so omit manual updatedAt)
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
      { timeout: 15000 },
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
