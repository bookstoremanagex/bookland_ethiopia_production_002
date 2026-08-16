import prisma from "@/lib/prisma";
import DamagedBooksTable from "./DamagedBooksTable";
import ReportDamageButton from "./ReportDamageButton";

export const dynamic = "force-dynamic";

export default async function InventoryDamagedBooksPage() {
    const [damagedBooks, books, editions, stores] = await Promise.all([
        (prisma as any).damagedbooks.findMany({
            where: { is_deleted: false },
            include: {
                books: true,
                bookedition: true,
                stores: true,
                accounts: true
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.books.findMany({ where: { is_deleted: false } }),
        (prisma as any).bookedition.findMany({ where: { is_deleted: false } }),
        prisma.stores.findMany({ where: { is_deleted: false } })
    ]);

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Damaged <span className="text-rose-500 not-italic">Inventory</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Track and manage books reported with physical or quality defects
                    </p>
                </div>
                <ReportDamageButton books={books} editions={editions} stores={stores} />
            </div>

            <DamagedBooksTable data={damagedBooks} />
        </div>
    );
}