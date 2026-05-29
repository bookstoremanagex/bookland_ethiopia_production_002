import React from 'react'
import { Truck, BadgeDollarSign, ArrowRight, Bell } from 'lucide-react'
import ShopsFinanceTable from '@/components/delivery_sales_components/ShopsFinanceTable'
import { getShopsFinanceData } from '@/app/delivery_and_sales_dashboard/actions'
import { getCurrentSession } from '@/app/actions/auth-actions'
import { getNotifications } from '@/app/actions/notification-actions'
import Link from 'next/link'
import RecordPaymentButton from './RecordPaymentButton'
import { cn } from '@/lib/utils'
import { getServerCalendarPref } from "@/lib/server-calendar"
import { formatDate } from "@/lib/calendar-utils"

const ROLE_TO_NOTIFICATION_TO: Record<string, string> = {
    "ADMIN": "ADMIN",
    "Operations Manager": "OPERATION_MANAGER",
    "Inventory Manager": "INVENTORY_MANAGER",
    "Finance Officer": "FINANCE",
    "Sales Staff": "DELIVERY_AND_SALES",
    "Retail Manager": "RETAIL_MANAGER",
    "Delivery and Sales Management": "DELIVERY_AND_SALES",
    "Delivery Sample": "DELIVERY_AND_SALES",
    "Printer": "PRINTER",
    "Viewer": "DATA_VIEWER",
};

export default async function DeliverySampleHomePage() {
    const shopsResult = await getShopsFinanceData();
    const shopsData = shopsResult.success ? shopsResult.data : [];

    const session = await getCurrentSession();
    const notificationTo = session?.role ? ROLE_TO_NOTIFICATION_TO[session.role] : undefined;
    const calendarPref = await getServerCalendarPref()
    const notifResult = await getNotifications(undefined, notificationTo);
    const recentNotifications = (notifResult.success ? notifResult.data : []).slice(0, 3);

    const totalRemainingAll = shopsData.reduce((sum: number, s: any) => sum + s.totalRemaining, 0);

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#F8FAFC] min-h-screen">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 w-full lg:w-auto">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <Truck className="size-5 md:size-6" />
                        <span className="text-[9px] md:text-xs font-normal uppercase tracking-[0.3em] opacity-50">Delivery Sample</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Delivery <span className="text-secondarycolor not-italic">Sample</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl">
                        Welcome to the Delivery Sample Dashboard.
                    </p>
                </div>

                {/* Total Receivable + Record Payment */}
                <div className="w-full lg:w-auto flex items-center gap-4 bg-white p-4 md:p-6 rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
                    <div className="flex-1 lg:flex-none flex flex-col items-center px-4 md:px-6">
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Total Receivable</span>
                        <span className="text-lg md:text-2xl font-black text-red-500">{totalRemainingAll.toLocaleString()} ETB</span>
                    </div>
                    <RecordPaymentButton />
                </div>
            </div>

            {/* Latest Notifications */}
            {recentNotifications.length > 0 && (
                <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-5">
                    <div className="flex items-center gap-3">
                        <Bell className="size-5 text-primarycolor" />
                        <h2 className="text-lg font-black uppercase tracking-tight italic text-primarycolor">
                            Latest <span className="text-secondarycolor not-italic">Updates</span>
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {recentNotifications.map((n: any) => (
                            <div key={n.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-primarycolor/10 transition-all">
                                <div className={cn(
                                    "size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                    n.type === "PAYMENT" ? "bg-emerald-100 text-emerald-600" :
                                    n.type === "CHECK" ? "bg-purple-100 text-purple-600" :
                                    n.type === "ORDER" ? "bg-blue-100 text-blue-600" :
                                    "bg-slate-100 text-slate-600"
                                )}>
                                    <Bell className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-primarycolor text-sm leading-tight">{n.title}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold mt-1 line-clamp-2">{n.message}</p>
                                    <p className="text-[8px] text-muted-foreground/50 font-black uppercase tracking-widest mt-1.5">
                                        {formatDate(new Date(n.createdAt), calendarPref, "MMM dd, yyyy Ã‚Â· h:mm a")}
                                    </p>
                                </div>
                                {n.type && (
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest shrink-0 self-start",
                                        n.type === "PAYMENT" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                                        n.type === "CHECK" ? "bg-purple-50 text-purple-600 border border-purple-200" :
                                        n.type === "ORDER" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                                        "bg-slate-50 text-slate-600 border border-slate-200"
                                    )}>
                                        {n.type}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/delivery_sample_dashboard/notifications"
                        className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl border-2 border-primarycolor/10 bg-primarycolor/5 hover:bg-primarycolor/10 text-primarycolor font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                        View All Notifications <ArrowRight className="size-3.5" />
                    </Link>
                </div>
            )}

            {/* Financial Overview Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primarycolor">
                            <BadgeDollarSign className="size-5" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Shop <span className="text-secondarycolor not-italic">Finances</span></h2>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">Debt & Payment Tracking</p>
                    </div>
                </div>

                <ShopsFinanceTable data={shopsData} />
            </div>
        </div>
    )
}
