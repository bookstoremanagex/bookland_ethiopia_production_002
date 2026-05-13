"use server";

import prisma from "@/lib/prisma";

export async function getSalesStaffStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [todayRevenue, totalSalesCount] = await Promise.all([
            (prisma as any).bookshopeditions.aggregate({
                where: {
                    is_deleted: false,
                    createdAt: {
                        gte: today
                    }
                },
                _sum: {
                    already_paid: true
                }
            }),
            (prisma as any).bookshopeditions.count({
                where: {
                    is_deleted: false,
                    createdAt: {
                        gte: today
                    }
                }
            })
        ]);

        return {
            success: true,
            data: {
                todayRevenue: todayRevenue._sum.already_paid || 0,
                todaySalesCount: totalSalesCount,
                // Placeholder for interactions and targets until schema supports them
                customerInteractions: Math.floor(totalSalesCount * 1.5), 
                targetProgress: Math.min(Math.round((totalSalesCount / 20) * 100), 100)
            }
        };
    } catch (error) {
        console.error("Error fetching sales staff stats:", error);
        return { success: false, error: "Failed to fetch sales stats" };
    }
}
