"use client";

import { StatsOverview } from "./StatsOverview";
import { FinancialChart } from "./FinancialChart";
import { RecentActivity } from "./RecentActivity";
import { ProductionOverview } from "./ProductionOverview";
import { 
    LayoutDashboard, 
    Calendar,
    RefreshCcw,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardContainerProps {
    data: {
        stats: any;
        financialData: any[];
        recentActivities: any[];
        productionData: any[];
    }
}

export default function DashboardContainer({ data }: DashboardContainerProps) {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primarycolor">
                        <div className="size-10 rounded-2xl bg-primarycolor/10 flex items-center justify-center">
                            <LayoutDashboard className="size-6" />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                            Admin <span className="text-secondarycolor not-italic">Command Center</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <Calendar className="size-3" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <Sparkles className="size-3" /> System Operational
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="rounded-xl h-11 px-6 border-2 font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-primarycolor hover:text-white transition-all shadow-lg shadow-primarycolor/5">
                        <RefreshCcw className="size-4" /> Refresh Data
                    </Button>
                </div>
            </div>

            {/* Core Stats Overview */}
            <StatsOverview stats={data.stats} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <FinancialChart data={data.financialData} />
                </div>
                <div className="lg:col-span-1">
                    <ProductionOverview data={data.productionData} />
                </div>
            </div>

            {/* Lists Section */}
            <div className="pb-10">
                <RecentActivity activities={data.recentActivities} />
            </div>
        </div>
    );
}
