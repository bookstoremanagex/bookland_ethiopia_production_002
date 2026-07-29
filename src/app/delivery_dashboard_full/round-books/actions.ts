"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRoundBooks() {
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
      book: rb.book,
      starting_amount: rb.starting_amount ?? 0,
      returned_amount: rb.returned_amount ?? 0,
      storeCount: rb.round_records.length,
      stores: rb.round_records.map((rr: any) => ({
        id: rr.id,
        shopId: rr.bookshop_id,
        storeName: rr.bookshop?.name || "Unknown",
        location: rr.bookshop?.location || "",
        branch: rr.bookshop?.branch || "",
        totalprice: rr.totalprice ?? 0,
      })),
      createdAt: rb.createdAt,
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBooksForRound() {
  try {
    const books = await (prisma as any).books.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        title: true,
        author: true,
        unique_identification_code: true,
        book_sku: true,
        bookedition: {
          where: { is_deleted: false },
          select: {
            id: true,
            edition_name: true,
            selling_price: true,
            bookeditionstores: {
              where: { is_deleted: false, quantity: { gt: 0 } },
              select: { id: true, quantity: true },
            },
          },
          orderBy: { createdAt: "asc" as const },
        },
      },
      orderBy: { title: "asc" as const },
    });

    // Only keep editions that have stock in at least one store
    const data = books.map((book: any) => ({
      ...book,
      bookedition: book.bookedition.filter(
        (ed: any) => (ed.bookeditionstores?.length || 0) > 0
      ),
    })).filter((book: any) => book.bookedition.length > 0);

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoundBook(data: {
  bookId: number;
  editionId?: number | null;
  starting_amount?: number | null;
}) {
  try {
    const roundbook = await (prisma as any).roundbooks.create({
      data: {
        bookId: data.bookId,
        editionId: data.editionId || null,
        starting_amount: data.starting_amount ?? 0,
        returned_amount: 0,
        status: true,
      },
    });
    return { success: true, data: roundbook };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRoundBook(
  id: number,
  data: {
    starting_amount?: number | null;
    returned_amount?: number | null;
    status?: boolean;
  },
) {
  try {
    const roundbook = await (prisma as any).roundbooks.update({
      where: { id },
      data: {
        ...(data.starting_amount !== undefined ? { starting_amount: data.starting_amount } : {}),
        ...(data.returned_amount !== undefined ? { returned_amount: data.returned_amount } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });
    return { success: true, data: roundbook };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAvailableShops(roundBookId: number) {
  try {
    const existingShopIds = (
      await (prisma as any).roundrecords.findMany({
        where: { roundbookId: roundBookId, is_deleted: false },
        select: { bookshop_id: true },
      })
    ).map((r: any) => r.bookshop_id);

    const shops = await (prisma as any).bookshopes.findMany({
      where: {
        is_deleted: false,
        ...(existingShopIds.length > 0 ? { id: { notIn: existingShopIds } } : {}),
      },
      select: { id: true, name: true, location: true, branch: true },
      orderBy: { name: "asc" as const },
    });
    return { success: true, data: shops };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getEditionPrice(bookId: number) {
  try {
    const edition = await (prisma as any).bookedition.findFirst({
      where: { bookId, is_deleted: false },
      select: { id: true, edition_name: true, selling_price: true },
      orderBy: { createdAt: "asc" as const },
    });
    return { success: true, data: edition };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoundCheck(data: {
  username: string;
  bankname: string;
  amount: string;
  recordeddate: string;
  memo: string;
}) {
  try {
    const check = await (prisma as any).round_checks.create({
      data: {
        username: data.username || null,
        bankname: data.bankname || null,
        type: "PAYMENT",
        amount: data.amount || null,
        recordeddate: data.recordeddate ? new Date(data.recordeddate) : null,
        memo: data.memo || null,
        updatedAt: new Date(),
      },
    });
    return { success: true, data: check };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoundRecord(data: {
  roundbookId: number;
  bookshopId: number;
  totalprice: number;
  payment?: {
    type: "DIRECT" | "CHECK";
    amount: number;
    checkId?: number | null;
  };
}) {
  try {
    const record = await (prisma as any).roundrecords.create({
      data: {
        roundbookId: data.roundbookId,
        bookshop_id: data.bookshopId,
        totalprice: data.totalprice,
      },
    });

    if (data.payment && data.payment.amount > 0) {
      await (prisma as any).round_payments.create({
        data: {
          shopId: data.bookshopId,
          amount: data.payment.amount,
          payment_type: data.payment.type,
          checkId: data.payment.checkId || null,
          roundrecordId: record.id,
          status: "PENDING",
        },
      });
    }

    return { success: true, data: record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoundPayment(data: {
  roundRecordId: number;
  shopId: number;
  amount: number;
  paymentType: "DIRECT" | "CHECK";
  checkId?: number | null;
  memo?: string | null;
}) {
  try {
    const payment = await (prisma as any).round_payments.create({
      data: {
        roundrecordId: data.roundRecordId,
        shopId: data.shopId,
        amount: data.amount,
        payment_type: data.paymentType,
        checkId: data.checkId || null,
        memo: data.memo || null,
        status: "PENDING",
      },
    });
    return { success: true, data: payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveRoundPayment(paymentId: number) {
  try {
    const payment = await (prisma as any).round_payments.findUnique({
      where: { id: paymentId },
      include: { check: true },
    });

    if (!payment) return { success: false, error: "Payment not found" };

    // If it's a check payment, verify the check is cleared first
    if (payment.payment_type === "CHECK" && payment.checkId) {
      if (payment.check?.status !== "CLEARED") {
        return { success: false, error: "The linked check must be cleared before this payment can be approved." };
      }
    }

    await (prisma as any).round_payments.update({
      where: { id: paymentId },
      data: { status: "APPROVED", updatedAt: new Date() },
    });
    revalidatePath("/admin_dashboard", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteRoundPayment(paymentId: number) {
  try {
    await (prisma as any).round_payments.update({
      where: { id: paymentId },
      data: { is_deleted: true },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRoundCheckStatus(checkId: number, status: string) {
  try {
    // First verify the check exists
    const existingCheck = await (prisma as any).round_checks.findUnique({
      where: { id: checkId },
      select: { id: true, status: true },
    });

    if (!existingCheck) {
      return { success: false, error: "Check not found" };
    }

    // Update the check status
    const updated = await (prisma as any).round_checks.update({
      where: { id: checkId },
      data: { status: status, updatedAt: new Date() },
    });

    // When check is cleared, approve all linked pending round payments
    if (status === "CLEARED") {
      const linkedPayments = await (prisma as any).round_payments.findMany({
        where: { checkId: checkId, status: "PENDING", is_deleted: false },
      });

      for (const payment of linkedPayments) {
        await (prisma as any).round_payments.update({
          where: { id: payment.id },
          data: { status: "APPROVED", updatedAt: new Date() },
        });
      }
    }

    revalidatePath("/admin_dashboard", "layout");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating round check status:", error);
    return { success: false, error: error.message };
  }
}

export async function getRoundRecordDetail(recordId: number) {
  try {
    const record = await (prisma as any).roundrecords.findFirst({
      where: { id: recordId, is_deleted: false },
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
        RoundBooks: {
          include: {
            book: {
              include: {
                bookedition: {
                  where: { is_deleted: false },
                  select: { id: true, selling_price: true },
                  orderBy: { createdAt: "asc" as const },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    if (!record) return { success: false, error: "Record not found" };

    const edition = record.RoundBooks?.book?.bookedition?.[0];
    const unitPrice = edition?.selling_price ?? 0;
    const quantity = unitPrice > 0 ? Math.round((record.totalprice ?? 0) / unitPrice) : 0;

    return {
      success: true,
      data: {
        id: record.id,
        shopName: record.bookshop?.name || "Unknown",
        location: record.bookshop?.location || "",
        branch: record.bookshop?.branch || "",
        totalprice: record.totalprice ?? 0,
        quantity,
        unitPrice,
        payments: (record.round_payments || []).map((p: any) => ({
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
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getShopRoundPaymentInfo(shopId: number) {
  try {
    // 1. Unpaid on-round orders
    const onRoundOrders = await (prisma as any).orders.findMany({
      where: { bookShopId: shopId, order_type: "on round", is_deleted: false },
      select: { total_amount: true, amount_paid: true },
    });
    const orderRemaining = onRoundOrders.reduce(
      (sum: number, o: any) => sum + ((o.total_amount || 0) - (o.amount_paid || 0)),
      0
    );

    // 2. Round records remaining
    const records = await (prisma as any).roundrecords.findMany({
      where: { bookshop_id: shopId, is_deleted: false },
      include: {
        round_payments: {
          where: { is_deleted: false },
        },
        RoundBooks: {
          include: {
            book: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });

    const breakdown = records.map((r: any) => {
      const totalprice = r.totalprice ?? 0;
      const paidAmount = (r.round_payments || [])
        .filter((p: any) => p.status === "APPROVED")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
      return {
        recordId: r.id,
        bookTitle: r.RoundBooks?.book?.title || "Unknown",
        totalprice,
        paidAmount,
        remaining: totalprice - paidAmount,
      };
    });

    const roundRecordsRemaining = breakdown.reduce((sum: number, b: any) => sum + b.remaining, 0);
    const totalAmount = breakdown.reduce((sum: number, b: any) => sum + b.totalprice, 0);
    const totalPaid = breakdown.reduce((sum: number, b: any) => sum + b.paidAmount, 0);

    return {
      success: true,
      data: {
        breakdown,
        totalAmount,
        totalPaid,
        totalRemaining: orderRemaining + roundRecordsRemaining,
        orderRemaining,
        roundRecordsRemaining,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteRoundBook(id: number) {
  try {
    await (prisma as any).roundbooks.update({
      where: { id },
      data: { is_deleted: true },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
