import prisma from "@/lib/prisma";
import { BookCopy, Banknote, TrendingUp } from "lucide-react";

interface EditionRow {
    id: number;
    edition_name: string;
    book_title: string;
    sellingPrice: number;
    totalCost: number;
    profitPerBook: number;
    totalProfit: number;
    totalPrinted: number;
}

export default async function FinanceEditionTablePage() {
    const editions = await (prisma as any).bookedition.findMany({
        where: { is_deleted: false },
        include: {
            books: true
        }
    });

    const data: EditionRow[] = (editions as any[]).map(edition => {
        const totalCost = (
            (edition.production_price || 0) +
            (edition.printing_cost || 0) +
            (edition.binding_cost || 0) +
            (edition.design_cost || 0) +
            (edition.editing_cost || 0) +
            (edition.transportation_cost || 0) +
            (edition.translation_cost || 0) +
            (edition.other_expenses || 0)
        );

        const profitPerBook = (edition.selling_price || 0) - totalCost;
        const totalProfit = profitPerBook * (edition.total_print_count || 0);

        return {
            id: edition.id,
            edition_name: edition.edition_name,
            book_title: edition.books.title,
            sellingPrice: edition.selling_price || 0,
            totalCost,
            profitPerBook,
            totalProfit,
            totalPrinted: edition.total_print_count || 0,
        };
    });

    const totals = data.reduce((acc, row) => ({
        printed: acc.printed + row.totalPrinted,
        cost: acc.cost + (row.totalCost * row.totalPrinted),
        profit: acc.profit + row.totalProfit,
    }), { printed: 0, cost: 0, profit: 0 });

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Banknote className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Printed</p>
                        <h2 className="text-2xl font-black text-primarycolor italic mt-2">{totals.printed.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Cost</p>
                        <h2 className="text-2xl font-black text-rose-500 italic mt-2">ETB {totals.cost.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Profit</p>
                        <h2 className="text-2xl font-black text-emerald-500 italic mt-2">ETB {totals.profit.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Edition Table */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-primarycolor/5">
                    <div className="flex items-center gap-3">
                        <BookCopy className="size-6 text-primarycolor" />
                        <h2 className="text-lg font-black uppercase tracking-widest">Edition Financial Table</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-primarycolor/5 text-left">
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Edition</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Book</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Printed</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Selling Price</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Cost/Unit</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Profit/Unit</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Total Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={row.id} className="border-b border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-colors">
                                    <td className="p-4 font-bold">{row.edition_name}</td>
                                    <td className="p-4 text-muted-foreground">{row.book_title}</td>
                                    <td className="p-4 text-right font-bold">{row.totalPrinted.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-primarycolor">ETB {row.sellingPrice.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-rose-500">ETB {row.totalCost.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-amber-500">ETB {row.profitPerBook.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-emerald-600">ETB {row.totalProfit.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
