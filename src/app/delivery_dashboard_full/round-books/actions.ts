"use server";

import prisma from "@/lib/prisma";

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
      },
      orderBy: { title: "asc" as const },
    });
    return { success: true, data: books };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoundBook(data: {
  bookId: number;
  starting_amount?: number | null;
}) {
  try {
    const roundbook = await (prisma as any).roundbooks.create({
      data: {
        bookId: data.bookId,
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

    const totalRemaining = breakdown.reduce((sum: number, b: any) => sum + b.remaining, 0);
    const totalAmount = breakdown.reduce((sum: number, b: any) => sum + b.totalprice, 0);
    const totalPaid = breakdown.reduce((sum: number, b: any) => sum + b.paidAmount, 0);

    return {
      success: true,
      data: { breakdown, totalAmount, totalPaid, totalRemaining },
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
