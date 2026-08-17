"use server";

import prisma from "@/lib/prisma";
import { getEditionAuthoritativePrinters } from "@/lib/printer-resolution";

const isAutoDeliveryOrder = (o: any): boolean => {
    const name = o?.project_name || "";
    return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
};

export async function getPrinterDeliveries(printerId: number) {
    const printer = await (prisma as any).printer.findUnique({
        where: { id: printerId },
        select: { id: true, name: true },
    });
    if (!printer) return [];

    const records = await (prisma as any).printer_delivery_records.findMany({
        where: {
            is_deleted: false,
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

    // For deliveries recorded under auto-created "Auto-delivery" dummy projects
    // (created by recordPrinterDeliveries / transfers when no real print order
    // existed), attribute them to the edition's authoritative printer instead of
    // the arbitrary printer stamped on the dummy order.
    const editionIds = [
        ...new Set(
            records
                .filter((r: any) => isAutoDeliveryOrder(r.printorderId?.printorder))
                .map((r: any) => r.printorderId?.bookEditionId)
                .filter((id: any): id is number => Number.isInteger(id)),
        ),
    ];
    const authoritativePrinters = await getEditionAuthoritativePrinters(
        editionIds as number[]
    );

    const visibleRecords = records.filter((r: any) => {
        const edition = r.printorderId?.bookedition;
        if (edition?.visiblitiy_to_printer === false) return false;

        const order = r.printorderId?.printorder;
        if (isAutoDeliveryOrder(order)) {
            return (
                authoritativePrinters.get(r.printorderId?.bookEditionId) ===
                printer.name
            );
        }
        return order?.printerId === printerId;
    });

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
                        printorder: true,
                        bookedition: { select: { id: true } },
                    },
                },
            },
        }
    );

    if (!delivery) {
        return { success: false, error: "Delivery record not found" };
    }

    const order = delivery.printorderId?.printorder;
    const ownsDelivery =
        order?.printerId === printerId ||
        (isAutoDeliveryOrder(order) &&
            (
                await getEditionAuthoritativePrinters([
                    delivery.printorderId?.bookEditionId,
                ])
            ).get(delivery.printorderId?.bookEditionId) ===
                (
                    await (prisma as any).printer.findUnique({
                        where: { id: printerId },
                        select: { name: true },
                    })
                )?.name);

    if (!ownsDelivery) {
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
