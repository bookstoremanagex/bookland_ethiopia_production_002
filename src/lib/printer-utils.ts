export function isAutoDeliveryOrder(projectName: string | null | undefined): boolean {
    const name = projectName || "";
    return (
        name.startsWith("Auto-delivery for") ||
        name.startsWith("[Auto Delivery]")
    );
}

export interface EditionPrinterSource {
    connected?: { name?: string | null } | null;
    printorderItems?: Array<{
        printorder?: {
            project_name?: string | null;
            printer?: { name?: string | null } | null;
        } | null;
    }> | null;
}

/**
 * Resolve the authoritative printer name for an edition. Priority:
 * 1. connected printer (bookeditionprinters)
 * 2. most recent real (non-auto-delivery) print order's printer
 * 3. any print order's printer (incl. auto-delivery dummy orders)
 */
export function resolveEditionPrinterName(source: EditionPrinterSource): string | null {
    const connected = source.connected?.name;
    if (connected) return connected;

    const items = source.printorderItems || [];
    const real = items.find(
        (i) => i.printorder && !isAutoDeliveryOrder(i.printorder.project_name)
    );
    if (real?.printorder?.printer?.name) return real.printorder.printer.name;

    // Deliberately do NOT fall back to a dummy "Auto-delivery" order's printer —
    // those carry an arbitrary printer and are not a real attribution.
    return null;
}