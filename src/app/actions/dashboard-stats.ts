"use server";

import prisma from "@/lib/prisma";

export async function getInventoryStats() {
    try {
        const [totalSku, totalStock, lowStockCount] = await Promise.all([
            (prisma as any).books.count({ where: { is_deleted: false } }),
            (prisma as any).bookeditionstores.aggregate({
                where: { is_deleted: false },
                _sum: { quantity: true }
            }),
            (prisma as any).bookeditionstores.count({
                where: {
                    is_deleted: false,
                    quantity: { lt: 50 }
                }
            })
        ]);

        return {
            success: true,
            data: {
                totalSku,
                totalStock: totalStock._sum.quantity || 0,
                lowStockCount
            }
        };
    } catch (error) {
        console.error("Error fetching inventory stats:", error);
        return { success: false, error: "Failed to fetch inventory stats" };
    }
}

export async function getRetailStats() {
    try {
        const activeShops = await (prisma as any).bookshopes.count({
            where: { is_deleted: false }
        });

        return {
            success: true,
            data: {
                activeShops
            }
        };
    } catch (error) {
        console.error("Error fetching retail stats:", error);
        return { success: false, error: "Failed to fetch retail stats" };
    }
}

export async function getOperationStats() {
    try {
        const [activeStaffCount, ongoingProjectsCount] = await Promise.all([
            (prisma as any).roles.count({ where: { is_deleted: false, role_status: true } }),
            (prisma as any).translatorbook.count({
                where: {
                    is_deleted: false,
                    Status: { in: ['STARTED', 'ONPROGRESS'] }
                }
            })
        ]);

        return {
            success: true,
            data: {
                activeStaffCount,
                ongoingProjectsCount
            }
        };
    } catch (error) {
        console.error("Error fetching operation stats:", error);
        return { success: false, error: "Failed to fetch operation stats" };
    }
}

export async function getViewerStats() {
    try {
        const totalBooks = await (prisma as any).books.count({ where: { is_deleted: false } });

        return {
            success: true,
            data: {
                totalBooks
            }
        };
    } catch (error) {
        console.error("Error fetching viewer stats:", error);
        return { success: false, error: "Failed to fetch viewer stats" };
    }
}

export async function getFinanceStats() {
    try {
        const financeData = await (prisma as any).bookshopeditions.aggregate({
            where: { is_deleted: false },
            _sum: {
                already_paid: true,
                remaining_amount: true
            }
        });

        return {
            success: true,
            data: {
                totalRevenue: financeData._sum.already_paid || 0,
                totalOutstanding: financeData._sum.remaining_amount || 0
            }
        };
    } catch (error) {
        console.error("Error fetching finance stats:", error);
        return { success: false, error: "Failed to fetch finance stats" };
    }
}
