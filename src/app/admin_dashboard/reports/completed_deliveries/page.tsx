import prisma from "@/lib/prisma";
import CompletedDeliveriesTable from "./CompletedDeliveriesTable";

export default async function CompletedDeliveriesPage() {
    const completedDeliveries = await (prisma as any).bookshopeditions.findMany({
        where: {
            is_deleted: false,
            remaining_amount: { lte: 0 }
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
                <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter italic">
                    Completed <span className="text-emerald-500 not-italic">Deliveries</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Settled transactions and fully paid book distributions
                </p>
            </div>

            <CompletedDeliveriesTable data={completedDeliveries} />
        </div>
    );
}
