import prisma from "@/lib/prisma";
import PrintOrderTable from "./PrintOrderTable";
import CreatePrintOrderButton from "./CreatePrintOrderButton";

export default async function ManagePrintingPage() {
    const [orders, printers, editions, books] = await Promise.all([
        (prisma as any).printorder.findMany({
            where: { is_deleted: false },
            include: {
                printer: true,
                printorder_items: true
            },
            orderBy: { createdAt: 'desc' }
        }),
        (prisma as any).printer.findMany({ where: { is_deleted: false } }),
        (prisma as any).bookedition.findMany({ 
            where: { is_deleted: false },
            include: { books: true }
        }),
        (prisma as any).books.findMany({ where: { is_deleted: false } })
    ]);

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Print <span className="text-secondarycolor not-italic">Logistics</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Track batches, quality, and printer performance across the network
                    </p>
                </div>
                <CreatePrintOrderButton printers={printers} editions={editions} books={books} />
            </div>
            
            <PrintOrderTable data={orders} />
        </div>
    );
}
