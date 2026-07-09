import React from 'react'
import {
    ShieldCheck,
    Activity,
    Package,
    Printer,
    BarChart3,
    ClipboardList,
    Truck,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function OperationManagerFullHomePage() {
    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#F8FAFC] min-h-screen">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 w-full md:w-auto">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <ShieldCheck className="size-6 md:size-8" />
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] opacity-50">Command Center</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Operations <span className="text-secondarycolor not-italic">Manager</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl">
                        Oversee production, printing, orders, and deliveries from one place.
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-primarycolor/5 shadow-xl">
                    <div className="flex flex-col items-center px-6 border-r-2 border-primarycolor/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                        <span className="text-2xl font-black text-emerald-500">Active</span>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <Activity className="size-6 text-secondarycolor animate-pulse mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live</span>
                    </div>
                </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/operation_manager_full_dashboard/production/books" className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                    <div className="space-y-4">
                        <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                            <Package className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest">Production</h3>
                            <p className="text-sm text-muted-foreground font-bold mt-1">Books, translators & translation work</p>
                        </div>
                        <ArrowRight className="size-5 text-primarycolor/30 group-hover:text-primarycolor transition-all" />
                    </div>
                </Link>

                <Link href="/operation_manager_full_dashboard/printing/manage" className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                    <div className="space-y-4">
                        <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                            <Printer className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest">Printing</h3>
                            <p className="text-sm text-muted-foreground font-bold mt-1">Manage printers, orders & delivery records</p>
                        </div>
                        <ArrowRight className="size-5 text-primarycolor/30 group-hover:text-primarycolor transition-all" />
                    </div>
                </Link>

                <Link href="/operation_manager_full_dashboard/manage-orders" className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                    <div className="space-y-4">
                        <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                            <ClipboardList className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest">Manage Orders</h3>
                            <p className="text-sm text-muted-foreground font-bold mt-1">Approve, track and manage book orders</p>
                        </div>
                        <ArrowRight className="size-5 text-primarycolor/30 group-hover:text-primarycolor transition-all" />
                    </div>
                </Link>

                <Link href="/operation_manager_full_dashboard/reports/completed-deliveries" className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                    <div className="space-y-4">
                        <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                            <BarChart3 className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest">Reports</h3>
                            <p className="text-sm text-muted-foreground font-bold mt-1">Completed & pending delivery reports</p>
                        </div>
                        <ArrowRight className="size-5 text-primarycolor/30 group-hover:text-primarycolor transition-all" />
                    </div>
                </Link>

                <Link href="/operation_manager_full_dashboard/delivery-sample" className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                    <div className="space-y-4">
                        <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                            <Truck className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest">Delivery Sample</h3>
                            <p className="text-sm text-muted-foreground font-bold mt-1">Manage sample deliveries</p>
                        </div>
                        <ArrowRight className="size-5 text-primarycolor/30 group-hover:text-primarycolor transition-all" />
                    </div>
                </Link>
            </div>
        </div>
    )
}