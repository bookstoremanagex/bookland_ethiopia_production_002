import prisma from "@/lib/prisma";
import { TableProperties, Banknote, ShoppingBag, BarChart3 } from "lucide-react";

interface ShopRow {
    id: number;
    name: string;
    branch: string;
    totalBooks: number;
    totalPaid: number;
    totalValue: number;
    remaining: number;
}

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

    const data: ShopRow[] = (shops as any[]).map(shop => {
        const totalBooks = shop.bookshopeditions.reduce((acc: number, ed: any) => acc + (ed.quantity || 0), 0);
        const totalValue = shop.bookshopeditions.reduce((acc: number, ed: any) => acc + (ed.total_price || 0), 0);
        const totalPaidFromOrders = (shop.orders || []).reduce((acc: number, o: any) => acc + (o.amount_paid || 0), 0);
        const previousDebt = shop.previousDebt || 0;
        const totalRemaining = shop.orders.reduce((acc: number, o: any) => acc + ((o.total_amount || 0) - (o.amount_paid || 0)), 0) + previousDebt;

        return {
            id: shop.id,
            name: shop.name,
            branch: shop.branch || 'Main',
            totalBooks,
            totalPaid: totalPaidFromOrders,
            totalValue,
            remaining: totalRemaining,
        };
    });

    const totals = data.reduce((acc, row) => ({
        books: acc.books + row.totalBooks,
        paid: acc.paid + row.totalPaid,
        value: acc.value + row.totalValue,
        remaining: acc.remaining + row.remaining,
    }), { books: 0, paid: 0, value: 0, remaining: 0 });

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShoppingBag className="size-12" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Shops</p>
                        <h2 className="text-2xl font-black text-primarycolor italic mt-1">{data.length}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Banknote className="size-12" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Value</p>
                        <h2 className="text-2xl font-black text-primarycolor italic mt-1">ETB {totals.value.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 className="size-12" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Collected</p>
                        <h2 className="text-2xl font-black text-emerald-500 italic mt-1">ETB {totals.paid.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 className="size-12" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Outstanding</p>
                        <h2 className="text-2xl font-black text-rose-500 italic mt-1">ETB {totals.remaining.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Shop Table */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-primarycolor/5">
                    <div className="flex items-center gap-3">
                        <TableProperties className="size-6 text-primarycolor" />
                        <h2 className="text-lg font-black uppercase tracking-widest">Shop Financial Table</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-primarycolor/5 text-left">
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Shop Name</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Branch</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Books</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Total Value</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Paid</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(shop => (
                                <tr key={shop.id} className="border-b border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-colors">
                                    <td className="p-4 font-bold">{shop.name}</td>
                                    <td className="p-4 text-muted-foreground">{shop.branch}</td>
                                    <td className="p-4 text-right font-bold">{shop.totalBooks.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-primarycolor">ETB {shop.totalValue.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-emerald-600">ETB {shop.totalPaid.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-rose-500">ETB {shop.remaining.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
