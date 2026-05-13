import prisma from "@/lib/prisma";
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    Banknote, 
    Activity,
    CreditCard,
    DollarSign,
    ArrowUp,
    ArrowDown,
    Building2,
    BookOpen,
    Calendar,
    ChevronRight,
    Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function FinanceStatsPage({
    searchParams
}: {
    searchParams: { range?: string }
}) {
    const range = searchParams.range || "all";

    const getStartDate = () => {
        const now = new Date();
        switch (range) {
            case "3days": return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            case "1week": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case "1month": return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            case "6months": return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            default: return new Date(0);
        }
    };

    const startDate = getStartDate();

    // Fetch filtered data
    const assignments = await (prisma as any).bookshopeditions.findMany({
        where: { 
            is_deleted: false,
            createdAt: { gte: startDate }
        }
    });

    const totalValue = assignments.reduce((acc: any, a: any) => acc + (a.total_price || 0), 0);
    const totalCollected = assignments.reduce((acc: any, a: any) => acc + (a.already_paid || 0), 0);
    const totalDebt = totalValue - totalCollected;
    const collectionRate = totalValue > 0 ? (totalCollected / totalValue) * 100 : 0;

    const shopsCount = await (prisma as any).bookshopes.count({ where: { is_deleted: false } });
    const booksCount = await prisma.books.count({ where: { is_deleted: false } });

    const ranges = [
        { label: "Last 3 Days", value: "3days" },
        { label: "One Week", value: "1week" },
        { label: "One Month", value: "1month" },
        { label: "Six Months", value: "6months" },
        { label: "All Time", value: "all" },
    ];

    return (
        <div className="p-4 md:p-10 space-y-12 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter italic">
                        Financial <span className="text-secondarycolor not-italic">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
                        Time-series revenue and collection analysis
                    </p>
                </div>
                
                {/* Range Selector */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
                    {ranges.map((r) => (
                        <Link
                            key={r.value}
                            href={`/admin_dashboard/finance/stats?range=${r.value}`}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                range === r.value 
                                    ? "bg-primarycolor text-white shadow-lg shadow-primarycolor/20" 
                                    : "text-muted-foreground hover:bg-slate-50 hover:text-primarycolor"
                            )}
                        >
                            {r.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Insight Banner */}
            <div className="bg-primarycolor p-12 rounded-[3rem] shadow-2xl shadow-primarycolor/20 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <BarChart3 className="size-48" />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 w-fit border border-white/10">
                        <Clock className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Performance Window: {ranges.find(r => r.value === range)?.label}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Gross Distribution</p>
                            <h4 className="text-5xl font-black italic tracking-tighter">{totalValue.toLocaleString()} <span className="text-sm not-italic opacity-40">ETB</span></h4>
                        </div>
                        <div>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Collected Revenue</p>
                            <h4 className="text-5xl font-black italic tracking-tighter text-emerald-400">{totalCollected.toLocaleString()} <span className="text-sm not-italic opacity-40">ETB</span></h4>
                        </div>
                        <div>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Collection Rate</p>
                            <div className="flex items-end gap-4">
                                <h4 className="text-5xl font-black italic tracking-tighter">{Math.round(collectionRate)}%</h4>
                                <div className="flex-grow h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
                                    <div className="h-full bg-white rounded-full" style={{ width: `${collectionRate}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* High Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl space-y-6 group hover:-translate-y-1 transition-all">
                    <div className="size-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border-2 border-rose-100">
                        <TrendingDown className="size-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Outstanding Debt</p>
                        <h4 className="text-3xl font-black text-rose-700 mt-1">{totalDebt.toLocaleString()} <span className="text-xs font-bold opacity-40">ETB</span></h4>
                        <p className="text-[10px] font-bold text-rose-500/60 uppercase mt-2">Amount pending for this period</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl space-y-6 group hover:-translate-y-1 transition-all">
                    <div className="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border-2 border-emerald-100">
                        <TrendingUp className="size-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recovery Success</p>
                        <h4 className="text-3xl font-black text-emerald-700 mt-1">{totalCollected.toLocaleString()} <span className="text-xs font-bold opacity-40">ETB</span></h4>
                        <p className="text-[10px] font-bold text-emerald-500/60 uppercase mt-2">Verified cash collections</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl space-y-6 group hover:-translate-y-1 transition-all">
                    <div className="size-14 rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border-2 border-primarycolor/10">
                        <Activity className="size-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transaction Volume</p>
                        <h4 className="text-3xl font-black text-primarycolor mt-1">{assignments.length} <span className="text-xs font-bold opacity-40">RECORDS</span></h4>
                        <p className="text-[10px] font-bold text-primarycolor/40 uppercase mt-2">Assignments made in this window</p>
                    </div>
                </div>
            </div>

            {/* Network Overview */}
            <div className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl text-white">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">Network <span className="text-secondarycolor not-italic">Footprint</span></h3>
                        <p className="text-sm font-medium text-white/40 leading-relaxed max-w-[500px]">
                            Your bookstore's distribution network across active retail nodes. These metrics reflect total system scale regardless of the selected time range.
                        </p>
                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Building2 className="size-6 text-secondarycolor" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black">{shopsCount}</p>
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Active Shops</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <BookOpen className="size-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black">{booksCount}</p>
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Live Titles</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] bg-white/5 rounded-[2rem] border border-white/10 p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                <span>Collection Rate Efficiency</span>
                                <span>{Math.round(collectionRate)}%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000" 
                                    style={{ width: `${collectionRate}%` }} 
                                />
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                            Financial data is dynamically aggregated based on your selected performance window. Sync status: <span className="text-emerald-400">OPTIMAL</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
