import prisma from "@/lib/prisma";
import { 
    Building2, 
    Banknote, 
    Receipt, 
    AlertCircle, 
    ArrowRight,
    TrendingUp,
    Search
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FinanceBookShopPage() {
    const shops = await (prisma as any).bookshopes.findMany({
        where: { is_deleted: false },
        include: {
            bookshopeditions: {
                where: { is_deleted: false }
            }
        }
    });

    const shopsWithFinance = (shops as any[]).map(shop => {
        const totalValue = shop.bookshopeditions.reduce((acc: any, ed: any) => acc + (ed.total_price || 0), 0);
        const totalPaid = shop.bookshopeditions.reduce((acc: any, ed: any) => acc + (ed.already_paid || 0), 0);
        const totalDebt = shop.bookshopeditions.reduce((acc: any, ed: any) => acc + (ed.remaining_amount || 0), 0);
        
        return {
            ...shop,
            totalValue,
            totalPaid,
            totalDebt,
            collectionRate: totalValue > 0 ? (totalPaid / totalValue) * 100 : 0
        };
    });

    // Sort by debt descending
    shopsWithFinance.sort((a, b) => b.totalDebt - a.totalDebt);

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter italic">
                        Retail <span className="text-secondarycolor not-italic">Finance Hub</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
                        Financial oversight of book shop partnerships
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border-2 border-primarycolor/5 shadow-sm flex items-center gap-3">
                        <TrendingUp className="size-5 text-emerald-500" />
                        <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Receivable</p>
                            <p className="text-xl font-black text-primarycolor mt-1">
                                {shopsWithFinance.reduce((acc, s) => acc + s.totalDebt, 0).toLocaleString()} <span className="text-xs opacity-50">ETB</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {shopsWithFinance.map((shop) => (
                    <div key={shop.id} className="group bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl hover:border-primarycolor/20 transition-all overflow-hidden">
                        <div className="p-8 flex flex-col lg:flex-row items-center gap-8">
                            {/* Shop Identity */}
                            <div className="flex items-center gap-6 min-w-[300px]">
                                <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                                    <Building2 className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-primarycolor uppercase tracking-tight">{shop.name}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{shop.branch || 'Main Branch'}</p>
                                </div>
                            </div>

                            {/* Financial Stats */}
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Distributed</p>
                                    <p className="text-lg font-black text-primarycolor">{shop.totalValue.toLocaleString()} ETB</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Collected</p>
                                    <p className="text-lg font-black text-emerald-700">{shop.totalPaid.toLocaleString()} ETB</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                                    <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">Current Debt</p>
                                    <p className="text-lg font-black text-rose-700">{shop.totalDebt.toLocaleString()} ETB</p>
                                </div>
                            </div>

                            {/* Collection Progress */}
                            <div className="flex items-center gap-6 min-w-[150px]">
                                <div className="relative size-16">
                                    <svg className="size-full" viewBox="0 0 100 100">
                                        <circle className="text-slate-100 stroke-current" strokeWidth="12" cx="50" cy="50" r="40" fill="transparent"></circle>
                                        <circle 
                                            className="text-primarycolor stroke-current" 
                                            strokeWidth="12" 
                                            strokeDasharray={251.2} 
                                            strokeDashoffset={251.2 - (251.2 * shop.collectionRate) / 100} 
                                            strokeLinecap="round" 
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            transform="rotate(-90 50 50)"
                                        ></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primarycolor">
                                        {Math.round(shop.collectionRate)}%
                                    </div>
                                </div>
                                <Link href={`/admin_dashboard/book_shops`}>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all">
                                        <ArrowRight className="size-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
