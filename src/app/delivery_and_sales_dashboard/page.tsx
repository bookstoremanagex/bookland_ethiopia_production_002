import React from 'react'
import {
    Truck,
    TrendingUp,
    PackageCheck,
    ArrowUpRight,
    Users,
    Activity,
    BadgeDollarSign,
    ArrowRight
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import ShopsFinanceTable from '@/components/delivery_sales_components/ShopsFinanceTable'
import { getShopsFinanceData, getDeliverySalesStats } from './actions'
import Link from 'next/link'

export default async function DeliverySalesHomePage() {
    const [shopsResult, statsResult] = await Promise.all([
        getShopsFinanceData(),
        getDeliverySalesStats()
    ]);

    const shopsData = shopsResult.success ? shopsResult.data : [];
    const statsData = statsResult.success ? statsResult.data : {
        completedShipments: 0,
        retailPartners: 0,
        monthlySalesVolume: 0
    };

    const totalRemainingAll = shopsData.reduce((sum: number, s: any) => sum + s.totalRemaining, 0);

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#F8FAFC] min-h-screen">
            {/* Financial Overview Section Ã¢â‚¬â€ TOP */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primarycolor">
                            <BadgeDollarSign className="size-5" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Financial <span className="text-secondarycolor not-italic">Overview</span></h2>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">Shop Debt & Collections Tracking</p>
                    </div>

                    <Link href="/delivery_and_sales_dashboard/book_shops" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primarycolor hover:text-secondarycolor transition-colors">
                        Manage All Shops
                        <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <ShopsFinanceTable data={shopsData} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <PackageCheck className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-2 md:space-y-4 relative z-10">
                        <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Completed Shipments</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">
                                {statsData?.completedShipments.toLocaleString()}
                            </h2>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-2 md:space-y-4 relative z-10">
                        <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Monthly Sales Volume</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-secondarycolor italic leading-none">
                                {statsData?.monthlySalesVolume > 1000000
                                    ? `${(statsData?.monthlySalesVolume / 1000000).toFixed(1)}M`
                                    : statsData?.monthlySalesVolume.toLocaleString()
                                }
                            </h2>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-2 md:space-y-4 relative z-10">
                        <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Retail Partners</p>
                        <div className="flex items-center gap-3">
                            <div className="size-2 md:size-3 rounded-full bg-emerald-500 animate-pulse" />
                            <h2 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight italic leading-none">{statsData?.retailPartners} Active</h2>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 w-full lg:w-auto">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <Truck className="size-5 md:size-6" />
                        <span className="text-[9px] md:text-xs font-normal uppercase tracking-[0.3em] opacity-50">Logistics & Sales</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Delivery & <span className="text-secondarycolor not-italic">Sales</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl">
                        Welcome to your Command Center. Manage distributions and monitor sales performance.
                    </p>
                </div>

                <div className="w-full lg:w-auto flex flex-row items-center gap-4 bg-white p-4 md:p-6 rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
                    <div className="flex-1 lg:flex-none flex flex-col items-center px-4 md:px-6 border-r-2 border-primarycolor/5">
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Total Receivable</span>
                        <span className="text-lg md:text-2xl font-black text-red-500">{totalRemainingAll.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex-1 lg:flex-none flex flex-col items-center px-4 md:px-6">
                        <Activity className="size-5 md:size-6 text-secondarycolor animate-pulse mb-1" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Live Tracking</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
