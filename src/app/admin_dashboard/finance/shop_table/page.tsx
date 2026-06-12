import prisma from "@/lib/prisma";
import ShopFinanceTable from "./ShopFinanceTable";

export default async function FinanceShopTablePage() {
    const shops = await (prisma as any).bookshopes.findMany({
        where: { is_deleted: false },
        include: {
            bookshopeditions: {
                where: { is_deleted: false }
            },
            orders: {
                where: { is_deleted: false },
                select: { total_amount: true, amount_paid: true },
            },
        }
    });

    const data = (shops as any[]).map(shop => {
        const totalBooks = shop.bookshopeditions.reduce((acc: any, ed: any) => acc + (ed.quantity || 0), 0);
        const totalValue = shop.bookshopeditions.reduce((acc: any, ed: any) => acc + (ed.total_price || 0), 0);
        const totalPaidFromOrders = (shop.orders || []).reduce((acc: any, o: any) => acc + (o.amount_paid || 0), 0);
        const previousDebt = shop.previousDebt || 0;
        const totalDebtFromOrders = shop.orders.reduce((acc: any, o: any) => acc + ((o.total_amount || 0) - (o.amount_paid || 0)), 0) + previousDebt;

        return {
            id: shop.id,
            name: shop.name,
            branch: shop.branch || 'Main',
            totalBooks,
            totalPaid: totalPaidFromOrders,
            totalDebt: totalDebtFromOrders,
            previousDebt,
            totalValue,
            collectionRate: totalValue > 0 ? (totalPaidFromOrders / totalValue) * 100 : 0
        };
    });

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Financial <span className="text-secondarycolor not-italic">Ledger</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Detailed retail partner financial tracking with TanStack data management
                </p>
            </div>

            <ShopFinanceTable data={data} />
        </div>
    );
}
