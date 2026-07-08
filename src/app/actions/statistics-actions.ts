"use server";

import prisma from "@/lib/prisma";

function getSinceDate(range: string): Date {
    const now = new Date();
    const map: Record<string, number> = {
        "24h": 24 * 60 * 60 * 1000,
        "48h": 48 * 60 * 60 * 1000,
        "72h": 72 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "60d": 60 * 24 * 60 * 60 * 1000,
        "3m": 90 * 24 * 60 * 60 * 1000,
        "6m": 180 * 24 * 60 * 60 * 1000,
        "1y": 365 * 24 * 60 * 60 * 1000,
    };
    const ms = map[range];
    return ms ? new Date(now.getTime() - ms) : new Date(0);
}

export async function getOrderedBooks(range: string) {
    const sinceDate = getSinceDate(range);

    const orderItems = await (prisma as any).order_items.findMany({
        where: {
            order: {
                updatedAt: { gte: sinceDate },
                is_deleted: false,
                is_approved: true,
            },
            bookedition: {
                books: { is_deleted: false },
            },
        },
        include: {
            bookedition: {
                include: { books: true },
            },
            order: {
                select: { createdAt: true, updatedAt: true },
            },
        },
    });

    // Group by book — track latest order time, sum qty & price
    const bookMap = new Map<
        number,
        {
            title: string;
            totalQty: number;
            totalPrice: number;
            latestOrderAt: Date;
        }
    >();

    for (const item of orderItems) {
        const book = item.bookedition?.books;
        if (!book) continue;
        const bookId = book.id;
        const qty = item.quantity || 0;
        const price = (item.price_at_order || 0) * qty;
        const orderTime = item.order?.createdAt
            ? new Date(item.order.createdAt)
            : new Date(0);

        const existing = bookMap.get(bookId);
        if (existing) {
            existing.totalQty += qty;
            existing.totalPrice += price;
            if (orderTime > existing.latestOrderAt) {
                existing.latestOrderAt = orderTime;
            }
        } else {
            bookMap.set(bookId, {
                title: book.title || "Unknown",
                totalQty: qty,
                totalPrice: price,
                latestOrderAt: orderTime,
            });
        }
    }

    return Array.from(bookMap.values())
        .map((entry) => ({
            ...entry,
            latestOrderAt: entry.latestOrderAt.toISOString(),
        }))
        .sort((a, b) => b.totalQty - a.totalQty);
}

export async function getStoreStats(range: string) {
    const sinceDate = getSinceDate(range);

    const orders = await (prisma as any).orders.findMany({
        where: {
            updatedAt: { gte: sinceDate },
            is_deleted: false,
            is_approved: true,
            bookshopes: { is_deleted: false },
        },
        include: {
            bookshopes: { select: { id: true, name: true, location: true } },
            order_items: {
                select: { quantity: true },
            },
        },
    });

    const storeMap = new Map<
        number,
        {
            name: string;
            location: string;
            totalQty: number;
            totalApproved: number;
            totalPaid: number;
        }
    >();

    for (const order of orders) {
        const shop = order.bookshopes;
        if (!shop) continue;
        const shopId = shop.id;
        const qty = (order.order_items || []).reduce(
            (s: number, i: any) => s + (i.quantity || 0),
            0
        );

        const existing = storeMap.get(shopId);
        if (existing) {
            existing.totalQty += qty;
            existing.totalApproved += order.total_amount || 0;
            existing.totalPaid += order.amount_paid || 0;
        } else {
            storeMap.set(shopId, {
                name: shop.name || "Unknown",
                location: shop.location || "",
                totalQty: qty,
                totalApproved: order.total_amount || 0,
                totalPaid: order.amount_paid || 0,
            });
        }
    }

    const entries = Array.from(storeMap.values()).sort(
        (a, b) => b.totalQty - a.totalQty
    );

    const grandTotal = entries.reduce(
        (s, e) => s + e.totalApproved,
        0
    );

    return { entries, grandTotal };
}

export type IncomeEntry = {
    type: "DIRECT" | "CHECK";
    count: number;
    total: number;
};

export async function getIncomeStats(range: string) {
    const sinceDate = getSinceDate(range);

    const payments = await (prisma as any).payments.findMany({
        where: {
            createdAt: { gte: sinceDate },
            status: "APPROVED",
            is_deleted: false,
        },
        select: {
            amount: true,
            payment_type: true,
        },
    });

    const roundPayments = await (prisma as any).round_payments.findMany({
        where: {
            createdAt: { gte: sinceDate },
            status: "APPROVED",
            is_deleted: false,
        },
        select: {
            amount: true,
            payment_type: true,
        },
    });

    const allPayments = [...payments, ...roundPayments];

    const direct = allPayments.filter(
        (p: any) => p.payment_type === "DIRECT"
    );
    const check = allPayments.filter(
        (p: any) => p.payment_type === "CHECK"
    );

    const entries: IncomeEntry[] = [
        {
            type: "DIRECT",
            count: direct.length,
            total: direct.reduce(
                (s: number, p: any) => s + (p.amount || 0),
                0
            ),
        },
        {
            type: "CHECK",
            count: check.length,
            total: check.reduce(
                (s: number, p: any) => s + (p.amount || 0),
                0
            ),
        },
    ];

    const grandTotal = entries.reduce((s, e) => s + e.total, 0);
    const totalPayments = entries.reduce((s, e) => s + e.count, 0);

    return { entries, grandTotal, totalPayments };
}
