import prisma from "@/lib/prisma";
import {
    BookOpen,
    TrendingUp,
    Package,
    Banknote,
    BarChart3,
    ArrowUpRight,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";

export default async function FinanceBooksPage() {
    const books = await prisma.books.findMany({
        where: { is_deleted: false },
        include: {
            bookedition: {
                where: { is_deleted: false },
                include: {
                    bookshopeditions: {
                        where: { is_deleted: false }
                    }
                }
            }
        }
    });

    const booksWithFinance = books.map(book => {
        let totalUnits = 0;
        let totalRevenue = 0;
        let totalPaid = 0;
        let totalRemaining = 0;

        book.bookedition.forEach(ed => {
            ed.bookshopeditions.forEach(bse => {
                totalUnits += bse.quantity || 0;
                totalRevenue += bse.total_price || 0;
                totalPaid += bse.already_paid || 0;
                totalRemaining += bse.remaining_amount || 0;
            });
        });

        return { ...book, totalUnits, totalRevenue, totalPaid, totalRemaining };
    });

    const totalAllRevenue = booksWithFinance.reduce((s, b) => s + b.totalRevenue, 0);
    const totalAllPaid = booksWithFinance.reduce((s, b) => s + b.totalPaid, 0);
    const totalAllRemaining = booksWithFinance.reduce((s, b) => s + b.totalRemaining, 0);

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Banknote className="size-16" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Revenue</p>
                        <h2 className="text-2xl font-black text-primarycolor italic mt-2">
                            ETB {totalAllRevenue.toLocaleString()}
                        </h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShoppingBag className="size-16" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Collected</p>
                        <h2 className="text-2xl font-black text-emerald-500 italic mt-2">
                            ETB {totalAllPaid.toLocaleString()}
                        </h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <BarChart3 className="size-16" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Outstanding</p>
                        <h2 className="text-2xl font-black text-rose-500 italic mt-2">
                            ETB {totalAllRemaining.toLocaleString()}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-primarycolor/5">
                    <div className="flex items-center gap-3">
                        <BookOpen className="size-6 text-primarycolor" />
                        <h2 className="text-lg font-black uppercase tracking-widest">Books Financial Overview</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-primarycolor/5 text-left">
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Book</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Author</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Units</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Revenue</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Paid</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booksWithFinance.map(book => (
                                <tr key={book.id} className="border-b border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-colors">
                                    <td className="p-4 font-bold">{book.title}</td>
                                    <td className="p-4 text-muted-foreground">{book.author}</td>
                                    <td className="p-4 text-right font-bold">{book.totalUnits.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-primarycolor">ETB {book.totalRevenue.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-emerald-600">ETB {book.totalPaid.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-rose-500">ETB {book.totalRemaining.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
