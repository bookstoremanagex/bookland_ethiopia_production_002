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

export default async function StatisticsPage(props: {
    searchParams: Promise<{ range?: string }>
}) {
    const searchParams = await props.searchParams;
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

    const shopsCount = await (prisma as any).bookshopes.count({ where: { is_deleted: false } });
    const booksCount = await prisma.books.count({ where: { is_deleted: false } });

    // Performance Rankings Logic
    const [topBooksRaw, topShopsRaw] = await Promise.all([
        (prisma as any).bookshopeditions.groupBy({
            by: ['bookEditionId'],
            _sum: { quantity: true, already_paid: true },
            where: { is_deleted: false, createdAt: { gte: startDate } },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 10
        }),
        (prisma as any).bookshopeditions.groupBy({
            by: ['bookShopId'],
            _sum: { already_paid: true },
            where: { is_deleted: false, createdAt: { gte: startDate } },
            orderBy: { _sum: { already_paid: 'desc' } },
            take: 10
        })
    ]);

    const topBooks = await Promise.all(topBooksRaw.map(async (item: any) => {
        const edition = await (prisma as any).bookedition.findUnique({
            where: { id: item.bookEditionId },
            include: { books: true }
        });
        return {
            title: edition?.books?.title || "Unknown Title",
            quantity: item._sum.quantity || 0,
            revenue: item._sum.already_paid || 0
        };
    }));

    const topShops = await Promise.all(topShopsRaw.map(async (item: any) => {
        const shop = await (prisma as any).bookshopes.findUnique({
            where: { id: item.bookShopId }
        });
        return {
            name: shop?.name || "Unknown Shop",
            location: shop?.location || "Unknown Location",
            revenue: item._sum.already_paid || 0
        };
    }));

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
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Financial <span className="text-secondarycolor not-italic">Overview</span>
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
                            href={`/viewer_dashboard/statistics?range=${r.value}`}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Gross Distribution</p>
                            <h4 className="text-5xl font-black italic tracking-tighter">{totalValue.toLocaleString()} <span className="text-sm not-italic opacity-40">ETB</span></h4>
                        </div>
                        <div>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Collected Revenue</p>
                            <h4 className="text-5xl font-black italic tracking-tighter text-emerald-400">{totalCollected.toLocaleString()} <span className="text-sm not-italic opacity-40">ETB</span></h4>
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

                    <div className="w-full lg:w-[400px] bg-white/5 rounded-[2rem] border border-white/10 p-8">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                            Financial data is dynamically aggregated based on your selected performance window. Sync status: <span className="text-emerald-400">OPTIMAL</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Performance Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Top 10 Books */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="size-4" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primarycolor italic">Top 10 <span className="text-emerald-500 not-italic">High-Selling</span> Books</h3>
                    </div>
                    <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b-2 border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Book Title</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest text-center">Volume</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {topBooks.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-muted-foreground w-4">{idx + 1}.</span>
                                                <div className="font-bold text-primarycolor text-xs uppercase group-hover:text-emerald-600 transition-colors">
                                                    {item.title}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black">
                                                {item.quantity?.toLocaleString()} <span className="opacity-40 text-[8px]">PCS</span>
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-primarycolor text-xs">
                                            {item.revenue?.toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
                                        </td>
                                    </tr>
                                ))}
                                {topBooks.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-10 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">No data for this period</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top 10 Shops */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="size-8 rounded-xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor">
                            <Building2 className="size-4" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primarycolor italic">Top 10 <span className="text-secondarycolor not-italic">Performant</span> Shops</h3>
                    </div>
                    <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b-2 border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Store Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest text-center">Location</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {topShops.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-muted-foreground w-4">{idx + 1}.</span>
                                                <div className="font-bold text-primarycolor text-xs uppercase group-hover:text-secondarycolor transition-colors">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                {item.location}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-secondarycolor text-xs">
                                            {item.revenue?.toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
                                        </td>
                                    </tr>
                                ))}
                                {topShops.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-10 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">No data for this period</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    );
}
