"use client"

import React, { useRef } from 'react'
import {
    ChevronLeft,
    Printer,
    Download,
    Share2,
    BadgeCheck,
    Calendar,
    Store,
    BookOpen,
    Hash,
    Banknote,
    Layers,
    Mail,
    Phone,
    MapPin,
    Building2,
    QrCode
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCalendar } from '@/lib/calendar-context'
import { cn } from '@/lib/utils'

interface DeliveryReceiptClientProps {
    delivery: any
}

export default function DeliveryReceiptClient({ delivery }: DeliveryReceiptClientProps) {
    const { formatLong } = useCalendar()
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8">
            {/* Header Controls (Hidden on Print) */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                    <Link href="/operation_manager_full_dashboard/reports/completed-deliveries" className="flex items-center gap-1">
                        <ChevronLeft className="size-3" /> Back to List
                    </Link>
                </Button>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={handlePrint}
                        className="h-12 px-6 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primarycolor/20"
                    >
                        <Printer className="size-4" /> Print Receipt
                    </Button>
                </div>
            </div>

            {/* Receipt Container */}
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden print:rounded-none print:shadow-none border border-slate-200 print:border-none">

                {/* Receipt Header */}
                <div className="bg-slate-900 p-12 text-white relative">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <BadgeCheck className="size-48" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 w-fit border border-white/10">
                                <BadgeCheck className="size-4 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Official Settlement Receipt</span>
                            </div>
                            <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
                                Transac<span className="text-secondarycolor not-italic">tion</span> Complete
                            </h1>
                            <p className="text-sm font-medium text-white/40 uppercase tracking-widest">Invoice Ref: #INV-{delivery.id.toString().padStart(6, '0')}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Settled On</p>
                            <p className="text-xl font-black">{formatLong(new Date(delivery.updatedAt))}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-12 space-y-12">

                    {/* Entity Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-b border-slate-100 pb-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="size-4 text-primarycolor/40" />
                                <h3 className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Issuer Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="size-16 rounded-2xl bg-primarycolor flex items-center justify-center text-white shadow-xl">
                                    <Layers className="size-8" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-primarycolor uppercase tracking-tight">Main Bookstore HQ</p>
                                    <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                                        Central Distribution Center<br />
                                        Addis Ababa, Ethiopia
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Contact Information</p>
                                    <p className="text-xs font-bold text-primarycolor">support@bookstore.com</p>
                                    <p className="text-xs font-bold text-primarycolor">+251 900 000 000</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Store className="size-4 text-secondarycolor/40" />
                                <h3 className="text-[10px] font-black text-secondarycolor/40 uppercase tracking-widest">Recipient Store</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="size-16 rounded-2xl bg-secondarycolor/10 border-2 border-secondarycolor/20 flex items-center justify-center text-secondarycolor shadow-lg">
                                    <Store className="size-8" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-primarycolor uppercase tracking-tight">{delivery.bookshopes?.name}</p>
                                    <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                                        {delivery.bookshopes?.location}<br />
                                        {delivery.bookshopes?.branch || "Main Branch"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Partner Contact</p>
                                    <p className="text-xs font-bold text-primarycolor">{delivery.bookshopes?.email || "N/A"}</p>
                                    <p className="text-xs font-bold text-primarycolor">{delivery.bookshopes?.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Line Items */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Layers className="size-4 text-primarycolor/40" />
                            <h3 className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Settlement Summary</h3>
                        </div>
                        <div className="overflow-hidden rounded-3xl border-2 border-slate-100 shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Description</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest text-center">Unit Price</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest text-center">Quantity</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-primarycolor/40 uppercase tracking-widest text-right">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="bg-white">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                                    <BookOpen className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-primarycolor uppercase">{delivery.bookedition?.books?.title}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{delivery.bookedition?.edition_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center text-sm font-black text-primarycolor/60">
                                            {delivery.price_per_peice?.toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
                                        </td>
                                        <td className="px-8 py-6 text-center text-sm font-black text-primarycolor">
                                            {delivery.quantity?.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-right text-sm font-black text-primarycolor">
                                            {delivery.total_price?.toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-slate-50/50">
                                    <tr>
                                        <td colSpan={3} className="px-8 py-6 text-right">
                                            <p className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest">Total Settled Value</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-2xl font-black text-emerald-600 italic leading-none">{delivery.total_price?.toLocaleString()} <span className="text-xs not-italic opacity-40">ETB</span></p>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Footer / Verification */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100">
                        <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <QrCode className="size-20 text-primarycolor/20" />
                            <div>
                                <p className="text-[10px] font-black text-primarycolor uppercase tracking-[0.2em] mb-1">Verification Code</p>
                                <p className="text-xs font-mono font-black text-primarycolor/60">BATCH-{delivery.id}-{delivery.updatedAt.getTime().toString().slice(-6)}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2">Verified by System Security Protocol</p>
                            </div>
                        </div>

                        <div className="text-right space-y-4">
                            <div className="flex items-center justify-end gap-3 text-emerald-600">
                                <BadgeCheck className="size-6" />
                                <span className="text-xl font-black uppercase tracking-tighter">Paid in Full</span>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed max-w-[300px]">
                                This receipt serves as official proof of payment and delivery settlement for the books listed above.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Minimalist Print Styles */}
                <style jsx global>{`
                    @media print {
                        @page {
                            size: A4 portrait;
                            margin: 15mm;
                        }
                        body { 
                            background: white !important;
                            color: black !important;
                            font-family: sans-serif !important;
                        }
                        .print-hidden { display: none !important; }
                        
                        /* Strip all dashboard and container styling */
                        .max-w-4xl { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
                        .rounded-[3rem], .rounded-3xl, .rounded-2xl, .rounded-xl { border-radius: 0 !important; border: none !important; }
                        .shadow-2xl, .shadow-xl, .shadow-lg, .shadow-sm { box-shadow: none !important; }
                        .bg-slate-900, .bg-slate-50, .bg-emerald-50, .bg-primarycolor, .bg-secondarycolor { 
                            background: transparent !important; 
                            color: black !important;
                            padding: 0 !important;
                        }

                        /* Minimal gaps and spacing */
                        .p-12, .p-10, .p-8, .p-6 { padding: 0 !important; margin-bottom: 5mm !important; }
                        .space-y-12 > * + *, .space-y-10 > * + *, .space-y-8 > * + * { margin-top: 5mm !important; }
                        .gap-16, .gap-12, .gap-8 { gap: 5mm !important; }
                        
                        /* Force simple text display */
                        h1 { font-size: 12pt !important; font-weight: bold !important; margin-bottom: 1mm !important; text-transform: uppercase !important; }
                        h3 { font-size: 9pt !important; font-weight: bold !important; margin-bottom: 0.5mm !important; text-transform: uppercase !important; }
                        p, td, th, span { font-size: 8pt !important; color: black !important; line-height: 1.3 !important; }
                        
                        /* Hide all non-text/number elements */
                        svg, .size-48, .size-24, .size-16, .size-12, .size-10, .QrCode { display: none !important; }
                        .badge, [class*="Badge"], .rounded-full { border: none !important; background: transparent !important; padding: 0 !important; }

                        /* Simple Table for Items */
                        table { width: 100% !important; border-collapse: collapse !important; margin-top: 5mm !important; }
                        th, td { 
                            border-bottom: 1px solid #ddd !important; 
                            padding: 2mm 0 !important;
                            text-align: left !important;
                        }
                        .text-right { text-align: right !important; }
                        .text-center { text-align: center !important; }
                        
                        /* Flatten entity info */
                        .grid-cols-1.md\\:grid-cols-2 { 
                            display: block !important; 
                        }
                        .grid-cols-1.md\\:grid-cols-2 > div {
                            margin-bottom: 5mm !important;
                            border-bottom: 1px solid #eee !important;
                            padding-bottom: 2mm !important;
                        }
                        
                        /* Audit / Footer info */
                        .bg-slate-900.p-12 { border-bottom: 2px solid black !important; margin-bottom: 10mm !important; }
                        .flex-col.md\\:flex-row { display: block !important; }
                        .pt-12 { border-top: 1px solid black !important; padding-top: 5mm !important; margin-top: 10mm !important; }
                    }
                `}</style>
            </div>


        </div>
    )
}
