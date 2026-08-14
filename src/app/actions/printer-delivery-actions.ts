"use server";

import prisma from "@/lib/prisma";

export async function getPrinterDeliveries(printerId: number) {
    const records = await (prisma as any).printer_delivery_records.findMany({
        where: {
            is_deleted: false,
            printorderId: {
                printorder: {
                    printerId: printerId,
                },
            },
        },
        include: {
            printorderId: {
                include: {
                    printorder: true,
                    bookedition: {
                        include: { books: true },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Hide deliveries for editions not visible to printers and deliveries that
    // belong to auto-created "Auto-delivery" dummy projects (no real print order).
    const isAutoDeliveryOrder = (o: any): boolean => {
        const name = o?.project_name || "";
        return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
    };

    const visibleRecords = records.filter(
        (r: any) =>
            r.printorderId?.bookedition?.visiblitiy_to_printer !== false &&
            !isAutoDeliveryOrder(r.printorderId?.printorder),
    );

    const storeIds = [
        ...new Set(visibleRecords.map((r: any) => r.storeId).filter(Boolean)),
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

    return visibleRecords.map((r: any) => ({
        id: r.id,
        bookTitle:
            r.printorderId?.bookedition?.books?.title ?? "Unknown",
        editionName:
            r.printorderId?.bookedition?.edition_name ?? "Unknown",
        storeName: storeMap[r.storeId] ?? null,
        quantity: r.quantity_deliverd,
        approvedByPrinter: r.approvedByPrinter,
        approvedByPrinterAt:
            r.approvedByPrinterAt?.toISOString?.() ?? null,
        createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
    }));
}

export async function approveDelivery(
    deliveryId: number,
    printerId: number
) {
    const delivery = await (prisma as any).printer_delivery_records.findUnique(
        {
            where: { id: deliveryId },
            include: {
                printorderId: {
                    include: {
                        printorder: {
                            select: { printerId: true },
                        },
                    },
                },
            },
        }
    );

    if (!delivery) {
        return { success: false, error: "Delivery record not found" };
    }

    if (delivery.printorderId?.printorder?.printerId !== printerId) {
        return {
            success: false,
            error: "Access denied — this delivery does not belong to your printer",
        };
    }

    if (delivery.approvedByPrinter) {
        return {
            success: false,
            error: "Already approved — cannot change back",
        };
    }

    await (prisma as any).printer_delivery_records.update({
        where: { id: deliveryId },
        data: {
            approvedByPrinter: true,
            approvedByPrinterAt: new Date(),
        },
    });

    return { success: true };
}
