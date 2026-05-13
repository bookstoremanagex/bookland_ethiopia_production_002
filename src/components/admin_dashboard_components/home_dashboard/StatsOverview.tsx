import { 
    BookOpen, 
    ShoppingBag, 
    TrendingUp, 
    Banknote,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

interface StatsOverviewProps {
    stats: {
        totalBooks: number;
        totalShops: number;
        totalRevenue: number;
        totalDebt: number;
        revenueGrowth: number;
        debtChange: number;
    }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    const items = [
        {
            title: "Total Inventory",
            value: stats.totalBooks.toLocaleString(),
            label: "Books Published",
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: { value: "+12%", up: true }
        },
        {
            title: "Retail Partners",
            value: stats.totalShops.toLocaleString(),
            label: "Active Book Shops",
            icon: ShoppingBag,
            color: "text-purple-600",
            bg: "bg-purple-50",
            trend: { value: "+3", up: true }
        },
        {
            title: "Gross Revenue",
            value: `${stats.totalRevenue.toLocaleString()} ETB`,
            label: "Total Distributed Value",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            trend: { value: `${stats.revenueGrowth}%`, up: stats.revenueGrowth >= 0 }
        },
        {
            title: "Outstanding Debt",
            value: `${stats.totalDebt.toLocaleString()} ETB`,
            label: "Pending Collections",
            icon: Banknote,
            color: "text-rose-600",
            bg: "bg-rose-50",
            trend: { value: `${Math.abs(stats.debtChange)}%`, up: stats.debtChange < 0 }
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border-2 border-primarycolor/5 shadow-xl hover:border-primarycolor/20 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 size-32 bg-primarycolor/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primarycolor/10 transition-colors" />
                    
                    <div className="relative space-y-4">
                        <div className={`size-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                            <item.icon className="size-6" />
                        </div>
                        
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.title}</p>
                            <h3 className="text-2xl font-black text-primarycolor mt-1">{item.value}</h3>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{item.label}</span>
                            <div className={`flex items-center gap-1 text-[10px] font-black ${item.trend.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {item.trend.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                                {item.trend.value}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
