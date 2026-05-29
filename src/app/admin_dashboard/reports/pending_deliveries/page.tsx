import prisma from "@/lib/prisma";
import PendingDeliveriesTable from "./PendingDeliveriesTable";

export default async function PendingDeliveriesPage() {
    const pendingDeliveries = await (prisma as any).bookshopeditions.findMany({
        where: {
            is_deleted: false,
            remaining_amount: { gt: 0 }
        },
        include: {
            bookshopes: true,
            bookedition: {
                include: {
                    books: true
                }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Pending <span className="text-rose-500 not-italic">Deliveries</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Track active distributions and outstanding debts across stores
                </p>
            </div>

            <PendingDeliveriesTable data={pendingDeliveries} />
        </div>
    );
}
