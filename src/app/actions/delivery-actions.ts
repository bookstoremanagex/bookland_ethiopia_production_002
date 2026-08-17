"use server";

import prisma from "@/lib/prisma";
import {
    isAutoDeliveryOrder,
    getEditionAuthoritativePrinters,
} from "@/lib/printer-resolution";

export async function getDeliveryRecords(editionId: number) {
    // First get all printorder_item IDs for this edition
    const itemIds = await (prisma as any).printorder_items
        .findMany({
            where: { bookEditionId: editionId, is_deleted: false },
            select: { id: true },
        })
        .then((items: any[]) => items.map((i: any) => i.id));

    if (itemIds.length === 0) return [];

    // Then fetch delivery records for those items
    const records = await (prisma as any).printer_delivery_records.findMany({
        where: {
            printorder_item_id: { in: itemIds },
            is_deleted: false,
        },
        include: {
            printorderId: {
                include: {
                    printorder: {
                        include: {
                            printer: {
                                select: { name: true },
                            },
                        },
                    },
                    bookedition: {
                        include: {
                            bookeditionprinters: {
                                where: { is_deleted: false },
                                include: {
                                    printer: {
                                        select: { name: true },
                                    },
                                },
                                orderBy: { updatedAt: "desc" },
                            },
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Resolve store names
    const storeIds = [
        ...new Set(records.map((r: any) => r.storeId).filter(Boolean)),
    ];

    const stores = storeIds.length
        ? await (prisma as any).stores.findMany({
              where: { id: { in: storeIds }, is_deleted: false },
              select: { id: true, name: true },
          })
        : [];

    const storeMap = Object.fromEntries(
        stores.map((s: any) => [s.id, s.name])
    );

    const authoritativePrinters = await getEditionAuthoritativePrinters([
        editionId,
    ]);

    return records.map((r: any) => {
        const projectName = r.printorderId?.printorder?.project_name || "";
        const isAutoDelivery = isAutoDeliveryOrder(projectName);
        return {
            id: r.id,
            printerName: isAutoDelivery
                ? authoritativePrinters.get(editionId) ?? "Unknown"
                : r.printorderId?.printorder?.printer?.name || "Unknown",
            storeName: storeMap[r.storeId] ?? null,
            quantity_deliverd: r.quantity_deliverd,
            approvedByPrinter: r.approvedByPrinter,
            createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
            approvedByPrinterAt:
                r.approvedByPrinterAt?.toISOString?.() ?? null,
        };
    });
}
