import React from 'react'
import {
    Tag,
    CreditCard,
    Users,
    ArrowUpRight,
    Target,
    Activity
} from 'lucide-react'
import { Card } from "@/components/ui/card"

import { getSalesStaffStats } from './actions'

export default async function SalesHomePage() {
    const statsResult = await getSalesStaffStats();
    const stats = statsResult.success ? statsResult.data : {
        todayRevenue: 0,
        todaySalesCount: 0,
        customerInteractions: 0,
        targetProgress: 0
    };

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#F8FAFC] min-h-screen">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 w-full md:w-auto">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <Tag className="size-6 md:size-8" />
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] opacity-50">Sales Terminal</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Sales <span className="text-secondarycolor not-italic">Staff</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl">
                        Track your daily targets, manage customer inquiries, and close sales faster.
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-primarycolor/5 shadow-xl">
                    <div className="flex flex-col items-center px-6 border-r-2 border-primarycolor/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">My Sales</span>
                        <span className="text-2xl font-black text-emerald-500">{stats?.todaySalesCount}</span>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <Activity className="size-6 text-secondarycolor animate-pulse mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Terminal Ready</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CreditCard className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Today's Revenue</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">
                                {stats?.todayRevenue > 1000
                                    ? `${(stats?.todayRevenue / 1000).toFixed(1)}K`
                                    : stats?.todayRevenue.toLocaleString()
                                }
                            </h2>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Customer Interactions</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">{stats?.customerInteractions}</h2>
                            <span className="text-xs font-black text-secondarycolor flex items-center mb-1 uppercase tracking-tighter">
                                Resolution
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Progress</p>
                        <div className="flex items-center gap-3">
                            <div className="size-3 rounded-full bg-secondarycolor animate-pulse" />
                            <h2 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight italic leading-none">{stats?.targetProgress}% Complete</h2>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Notification Bar */}
            <div className="bg-primarycolor text-white p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                <div className="space-y-1 relative z-10">
                    <h3 className="text-xl font-black uppercase italic tracking-tight">New Product Training</h3>
                    <p className="text-white/60 font-bold text-sm uppercase tracking-widest">A new collection of rare editions has arrived. Review the specs.</p>
                </div>
                <Button className="bg-secondarycolor hover:bg-white hover:text-primarycolor text-primarycolor font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl transition-all relative z-10">
                    Learn More
                </Button>
            </div>
        </div>
    )
}

function Button({ children, className, ...props }: any) {
    return (
        <button className={cn("inline-flex items-center justify-center whitespace-nowrap", className)} {...props}>
            {children}
        </button>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
