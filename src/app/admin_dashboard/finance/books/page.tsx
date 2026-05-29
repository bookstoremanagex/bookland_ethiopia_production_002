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
        const shopsCount = new Set<number>();

        book.bookedition.forEach(edition => {
            edition.bookshopeditions.forEach(assignment => {
                totalUnits += assignment.quantity || 0;
                totalRevenue += assignment.total_price || 0;
                totalPaid += assignment.already_paid || 0;
                shopsCount.add(assignment.bookShopId);
            });
        });

        const totalDebt = totalRevenue - totalPaid;

        return {
            ...book,
            totalUnits,
            totalRevenue,
            totalPaid,
            totalDebt,
            shopsCount: shopsCount.size,
            collectionRate: totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0
        };
    });

    // Sort by revenue descending
    booksWithFinance.sort((a, b) => b.totalRevenue - a.totalRevenue);

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Inventory <span className="text-secondarycolor not-italic">Revenue Analysis</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
                        Financial performance by book title
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-primarycolor px-8 py-4 rounded-[2rem] shadow-2xl shadow-primarycolor/20 text-white flex items-center gap-4">
                        <BarChart3 className="size-8 opacity-40" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">Global Revenue</p>
                            <p className="text-2xl font-black mt-1">
                                {booksWithFinance.reduce((acc, b) => acc + b.totalRevenue, 0).toLocaleString()} <span className="text-sm opacity-60 font-bold">ETB</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                {booksWithFinance.map((book) => (
                    <div key={book.id} className="group bg-white rounded-[3rem] p-8 border-2 border-primarycolor/5 shadow-xl hover:border-primarycolor/20 transition-all space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 size-32 bg-primarycolor/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        
                        <div className="flex items-start justify-between relative">
                            <div className="flex items-center gap-5">
                                <div className="size-16 rounded-[1.5rem] bg-slate-50 border-2 border-white shadow-inner flex items-center justify-center text-primarycolor">
                                    <BookOpen className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-primarycolor uppercase tracking-tight leading-tight">{book.title}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                        Distributed in {book.shopsCount} Shops
                                    </p>
                                </div>
                            </div>
                            <Link href={`/admin_dashboard/books/${book.id}`}>
                                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primarycolor group-hover:text-white transition-all shadow-sm">
                                    <ArrowUpRight className="size-5" />
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-[2rem] bg-slate-50 space-y-1">
                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <Package className="size-4" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Total Units</span>
                                </div>
                                <p className="text-xl font-black text-primarycolor">{book.totalUnits.toLocaleString()}</p>
                            </div>
                            <div className="p-5 rounded-[2rem] bg-primarycolor text-white space-y-1 shadow-lg shadow-primarycolor/10">
                                <div className="flex items-center gap-2 opacity-60 mb-1">
                                    <TrendingUp className="size-4" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Total Value</span>
                                </div>
                                <p className="text-xl font-black">{book.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                <span className="text-emerald-600">Collected: {book.totalPaid.toLocaleString()}</span>
                                <span className="text-rose-500">Debt: {book.totalDebt.toLocaleString()}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-1000"
                                    style={{ width: `${book.collectionRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
