import prisma from "@/lib/prisma";
import DeliveryRecordsView from "./DeliveryRecordsView";
import AllDeliveryRecordsTable from "./AllDeliveryRecordsTable";

export default async function DeliveryRecordsPage() {
    const [books, editions, rawRecords] = await Promise.all([
        (prisma as any).books.findMany({
            where: { is_deleted: false },
            orderBy: { title: "asc" },
        }),
        (prisma as any).bookedition.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: "desc" },
        }),
        (prisma as any).printer_delivery_records.findMany({
            where: { is_deleted: false },
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
                                books: {
                                    select: { title: true },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    // Resolve store names
    const storeIds = [
        ...new Set(
            rawRecords
                .map((r: any) => r.storeId)
                .filter(Boolean)
        ),
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

    const allRecords = rawRecords.map((r: any) => ({
        id: r.id,
        bookTitle:
            r.printorderId?.bookedition?.books?.title ?? "Unknown",
        editionName:
            r.printorderId?.bookedition?.edition_name ?? "Unknown",
        quantity: r.quantity_deliverd,
        approvedByPrinter: r.approvedByPrinter,
        storeName: storeMap[r.storeId] ?? null,
        printerName:
            r.printorderId?.printorder?.printer?.name ?? "Unknown",
        createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
        approvedByPrinterAt:
            r.approvedByPrinterAt?.toISOString?.() ?? null,
    }));

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Printing{" "}
                    <span className="text-secondarycolor not-italic">
                        Delivery Records
                    </span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Track printer-to-store deliveries
                </p>
            </div>

            {/* Per-edition lookup */}
            <DeliveryRecordsView books={books} editions={editions} />

            {/* Full records table */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                        All Delivery Records
                    </h2>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Complete history across all books and editions
                    </p>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm">
                    <AllDeliveryRecordsTable records={allRecords} />
                </div>
            </div>
        </div>
    );
}
