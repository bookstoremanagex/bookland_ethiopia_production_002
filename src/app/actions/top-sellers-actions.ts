"use server";

import prisma from "@/lib/prisma";

export type TopSellerRow = {
    bookId: number;
    title: string;
    author: string;
    book_image_url: string | null;
    unique_identification_code: string | null;
    orderQty: number;
    roundQty: number;
    totalQty: number;
};

export type TopSellersResult = {
    books: TopSellerRow[];
    totalBooksSold: number;
    topCount: number;
    totalQty: number;
    topQty: number;
    period: string;
    since: string | null;
};

export type TopSellersPeriod = "this_week" | "this_month" | "this_year" | "all_time";

function getSinceDate(period: TopSellersPeriod): Date | null {
    const now = new Date();
    const map: Record<TopSellersPeriod, number | null> = {
        this_week: 7 * 24 * 60 * 60 * 1000,
        this_month: 30 * 24 * 60 * 60 * 1000,
        this_year: 365 * 24 * 60 * 60 * 1000,
        all_time: null,
    };
    const ms = map[period];
    return ms === null ? null : new Date(now.getTime() - ms);
}

export async function getTopSellers(period: TopSellersPeriod): Promise<TopSellersResult> {
    const since = getSinceDate(period);
    const sinceFilter = since ? { gte: since } : undefined;

    // 1) Orders: approved order items grouped per book
    const orderItems = await (prisma as any).order_items.findMany({
        where: {
            order: {
                updatedAt: sinceFilter,
                is_deleted: false,
                is_approved: true,
            },
            bookedition: {
                books: { is_deleted: false },
            },
        },
        include: {
            bookedition: {
                include: {
                    books: {
                        select: {
                            id: true,
                            title: true,
                            author: true,
                            book_image_url: true,
                            unique_identification_code: true,
                        },
                    },
                },
            },
        },
    });

    // 2) Round selling: roundbooks allocated & active (status = active, allocated = approved)
    const roundbooks = await (prisma as any).roundbooks.findMany({
        where: {
            is_deleted: false,
            allocated: true,
            status: true,
            createdAt: sinceFilter,
            book: { is_deleted: false },
        },
        include: {
            book: {
                select: {
                    id: true,
                    title: true,
                    author: true,
                    book_image_url: true,
                    unique_identification_code: true,
                },
            },
        },
    });

    const bookMap = new Map<
        number,
        { bookId: number; title: string; author: string; book_image_url: string | null; unique_identification_code: string | null; orderQty: number; roundQty: number }
    >();

    const upsert = (book: any) => {
        const id = book.id;
        if (!bookMap.has(id)) {
            bookMap.set(id, {
                bookId: id,
                title: book.title || "Unknown",
                author: book.author || "",
                book_image_url: book.book_image_url || null,
                unique_identification_code: book.unique_identification_code || null,
                orderQty: 0,
                roundQty: 0,
            });
        }
        return bookMap.get(id)!;
    };

    for (const item of orderItems) {
        const book = item.bookedition?.books;
        if (!book) continue;
        const entry = upsert(book);
        entry.orderQty += item.quantity || 0;
    }

    for (const rb of roundbooks) {
        const book = rb.book;
        if (!book) continue;
        const entry = upsert(book);
        const sold = (rb.starting_amount ?? 0) - (rb.returned_amount ?? 0);
        if (sold > 0) {
            entry.roundQty += sold;
        }
    }

    const soldBooks = Array.from(bookMap.values())
        .map((b) => ({ ...b, totalQty: b.orderQty + b.roundQty }))
        .filter((b) => b.totalQty > 0)
        .sort((a, b) => b.totalQty - a.totalQty);

    const totalBooksSold = soldBooks.length;
    const topCount = Math.max(1, Math.ceil(totalBooksSold * 0.2));
    const topBooks = soldBooks.slice(0, topCount);

    const totalQty = soldBooks.reduce((s, b) => s + b.totalQty, 0);
    const topQty = topBooks.reduce((s, b) => s + b.totalQty, 0);

    return {
        books: topBooks,
        totalBooksSold,
        topCount,
        totalQty,
        topQty,
        period,
        since: since ? since.toISOString() : null,
    };
}