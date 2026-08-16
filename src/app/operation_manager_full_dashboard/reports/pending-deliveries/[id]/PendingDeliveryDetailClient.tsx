"use client"

import React from 'react'
import {
    ChevronLeft,
    AlertCircle,
    Store,
    BookOpen,
    Banknote,
    Clock,
    TrendingUp,
    Calendar,
    MapPin,
    Phone,
    Mail,
    ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCalendar } from '@/lib/calendar-context'
import { cn } from '@/lib/utils'

interface PendingDeliveryDetailClientProps {
    delivery: any
}

export default function PendingDeliveryDetailClient({ delivery }: PendingDeliveryDetailClientProps) {
    const { formatDate, formatLong } = useCalendar()
    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                    <Link href="/operation_manager_full_dashboard/reports/pending-deliveries" className="flex items-center gap-1">
                        <ChevronLeft className="size-3" /> Back to Pending Deliveries
                    </Link>
                </Button>

                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-rose-50 border border-rose-100">
                    <AlertCircle className="size-4 text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Distribution Pending Settlement</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Status Hero Card */}
                <div className="bg-white rounded-[3rem] p-10 shadow-xl border-2 border-primarycolor/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <TrendingUp className="size-48" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                        <div className="size-32 rounded-[2.5rem] bg-rose-500 flex items-center justify-center text-white shadow-2xl shadow-rose-500/20 shrink-0">
                            <Banknote className="size-16" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-primarycolor uppercase tracking-tighter italic">
                                Pending <span className="text-rose-500 not-italic">Balance</span>
                            </h1>
                            <p className="text-muted-foreground font-bold text-lg max-w-md">
                                This distribution has an outstanding amount that needs to be settled by the partner store.
                            </p>
                        </div>
                        <div className="text-center md:text-right px-10 py-6 bg-rose-50 rounded-[2rem] border-2 border-rose-100">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Remaining Debt</p>
                            <p className="text-4xl font-black text-rose-600 italic leading-none">
                                {delivery.remaining_amount?.toLocaleString()} <span className="text-sm not-italic opacity-60">ETB</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Store Info */}
                    <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100 space-y-8">
                        <div className="flex items-center gap-3">
                            <Store className="size-5 text-primarycolor" />
                            <h3 className="text-sm font-black text-primarycolor uppercase tracking-widest">Recipient Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Store Name</p>
                                    <p className="text-xl font-black text-primarycolor uppercase">{delivery.bookshopes?.name}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <MapPin className="size-4 text-slate-400" />
                                    <span>{delivery.bookshopes?.location}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <Phone className="size-4 text-slate-400" />
                                    <span>{delivery.bookshopes?.phone || "No contact phone"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <Mail className="size-4 text-slate-400" />
                                    <span>{delivery.bookshopes?.email || "No contact email"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Stats */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 opacity-10">
                            <Calendar className="size-24" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Distribution Date</p>
                                <p className="text-lg font-black">{formatLong(new Date(delivery.createdAt))}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Last Activity</p>
                                <p className="text-lg font-black">{formatDate(new Date(delivery.updatedAt), "MMM dd, hh:mm a")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book Details */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <BookOpen className="size-5 text-primarycolor" />
                        <h3 className="text-sm font-black text-primarycolor uppercase tracking-widest">Distributed Edition</h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="size-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primarycolor shadow-sm">
                            <BookOpen className="size-10" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-2xl font-black text-primarycolor uppercase tracking-tight leading-none mb-2">
                                {delivery.bookedition?.books?.title}
                            </h4>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className="px-3 py-1 rounded-full bg-primarycolor/5 border border-primarycolor/10 text-[10px] font-black text-primarycolor uppercase tracking-widest">
                                    {delivery.bookedition?.edition_name}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Quantity: <span className="text-primarycolor font-black">{delivery.quantity} Units</span>
                                </span>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Unit Price</p>
                            <p className="text-xl font-black text-primarycolor italic">{delivery.price_per_peice?.toLocaleString()} <span className="text-xs not-italic opacity-40">ETB</span></p>
                        </div>
                    </div>
                </div>

                {/* Financial Ledger */}
                <div className="bg-white rounded-[3rem] shadow-xl border-2 border-primarycolor/5 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="size-5 text-primarycolor" />
                            <h3 className="text-sm font-black text-primarycolor uppercase tracking-widest">Payment Progress</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-1000" 
                                    style={{ width: `${(delivery.already_paid / delivery.total_price) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase">
                                {Math.round((delivery.already_paid / delivery.total_price) * 100)}% Settled
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-10 space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Valuation</p>
                            <p className="text-3xl font-black text-primarycolor">{delivery.total_price?.toLocaleString()} <span className="text-xs opacity-40">ETB</span></p>
                        </div>
                        <div className="p-10 space-y-2 bg-emerald-50/30">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Amount Received</p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-black text-emerald-700">-{delivery.already_paid?.toLocaleString()} <span className="text-xs opacity-40">ETB</span></p>
                                <ArrowUpRight className="size-5 text-emerald-500" />
                            </div>
                        </div>
                        <div className="p-10 space-y-2 bg-rose-50/30">
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Balance Outstanding</p>
                            <p className="text-3xl font-black text-rose-700 italic">{delivery.remaining_amount?.toLocaleString()} <span className="text-xs opacity-40">ETB</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center pt-8">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                        Audit Pending for Distribution #DIST-{delivery.id}
                    </p>
                </div>
            </div>
        </div>
    )
}
