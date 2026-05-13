"use server";

import prisma from "@/lib/prisma";

export async function getShopsFinanceData() {
    try {
        const shops = await (prisma as any).bookshopes.findMany({
            where: { is_deleted: false },
            include: {
                bookshopeditions: {
                    where: { is_deleted: false }
                }
            }
        });

        const formattedShops = shops.map((shop: any) => {
            const totalRemaining = shop.bookshopeditions.reduce((sum: number, edition: any) => {
                return sum + (edition.remaining_amount || 0);
            }, 0);

            const totalDebt = shop.bookshopeditions.reduce((sum: number, edition: any) => {
                return sum + (edition.total_price || 0);
            }, 0);

            const totalPaid = shop.bookshopeditions.reduce((sum: number, edition: any) => {
                return sum + (edition.already_paid || 0);
            }, 0);

            return {
                id: shop.id,
                name: shop.name,
                location: shop.location,
                phone: shop.phone,
                totalRemaining,
                totalDebt,
                totalPaid
            };
        });

        return { success: true, data: formattedShops };
    } catch (error) {
        console.error("Error fetching shops finance data:", error);
        return { success: false, error: "Failed to fetch shop data" };
    }
}

export async function getDeliverySalesStats() {
    try {
        const [shipmentsCount, partnersCount, monthlySales] = await Promise.all([
            (prisma as any).bookshopeditions.count({
                where: { is_deleted: false }
            }),
            (prisma as any).bookshopes.count({
                where: { is_deleted: false }
            }),
            (prisma as any).bookshopeditions.aggregate({
                where: {
                    is_deleted: false,
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                },
                _sum: {
                    already_paid: true
                }
            })
        ]);

        return {
            success: true,
            data: {
                completedShipments: shipmentsCount,
                retailPartners: partnersCount,
                monthlySalesVolume: monthlySales._sum.already_paid || 0
            }
        };
    } catch (error) {
        console.error("Error fetching delivery sales stats:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}
