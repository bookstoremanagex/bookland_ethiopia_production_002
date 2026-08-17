import prisma from "@/lib/prisma";
import {
    isAutoDeliveryOrder,
    resolveEditionPrinterName,
    type EditionPrinterSource,
} from "@/lib/printer-utils";

export {
    isAutoDeliveryOrder,
    resolveEditionPrinterName,
    type EditionPrinterSource,
};

/**
 * Fetch editionId -> authoritative printer name for the given edition ids.
 * Used to resolve printers for auto-delivery dummy orders whose print order
 * carries an arbitrary printer.
 */
export async function getEditionAuthoritativePrinters(
    editionIds: number[]
): Promise<Map<number, string>> {
    const result = new Map<number, string>();
    const ids = editionIds.filter((id) => Number.isInteger(id));
    if (ids.length === 0) return result;

    const editions = await (prisma as any).bookedition.findMany({
        where: { id: { in: ids }, is_deleted: false },
        include: {
            bookeditionprinters: {
                where: { is_deleted: false },
                include: { printer: { select: { id: true, name: true } } },
                orderBy: { updatedAt: "desc" },
            },
            printorder_items: {
                where: { is_deleted: false },
                include: {
                    printorder: {
                        include: {
                            printer: { select: { id: true, name: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    for (const ed of editions) {
        const name = resolveEditionPrinterName({
            connected: ed.bookeditionprinters?.[0]?.printer ?? null,
            printorderItems: ed.printorder_items ?? [],
        });
        if (name) result.set(ed.id, name);
    }
    return result;
}