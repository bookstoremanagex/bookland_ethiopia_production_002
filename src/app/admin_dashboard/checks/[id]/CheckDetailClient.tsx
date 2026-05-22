"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ChevronLeft,
    Banknote,
    User,
    Building2,
    Tag,
    DollarSign,
    Calendar,
    FileText,
    Clock,
    AlertCircle,
    CheckCircle2,
    Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { updateCheckStatus } from '@/app/actions/check-actions'

const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    CLEARED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    BOUNCED: "bg-rose-100 text-rose-700 border-rose-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
}

interface CheckDetailClientProps {
    check: any
    isAdmin: boolean
}

export default function CheckDetailClient({ check, isAdmin }: CheckDetailClientProps) {
    const router = useRouter()
    const [isClearing, setIsClearing] = useState(false)

    const handleClearCheck = async () => {
        setIsClearing(true)
        try {
            const res = await updateCheckStatus(check.id, "CLEARED")
            if (res.success) {
                toast.success("Check approved and cleared")
                router.refresh()
            } else {
                toast.error(res.error)
            }
        } catch {
            toast.error("Failed to clear check")
        } finally {
            setIsClearing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 animate-in fade-in duration-700">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <Link href="/admin_dashboard/checks">
                        <Button variant="ghost" className="rounded-2xl gap-3 font-bold text-muted-foreground hover:text-primarycolor h-12 px-6 hover:bg-white shadow-sm border-2 border-transparent hover:border-primarycolor/5 transition-all">
                            <ChevronLeft className="size-5" />
                            Back to Checks
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            statusStyles[check.status] || "bg-slate-100 text-slate-600"
                        )}>
                            {check.status || "PENDING"}
                        </span>
                        {check.status === "PENDING" && isAdmin && (
                            <Button
                                onClick={handleClearCheck}
                                disabled={isClearing}
                                className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 gap-2"
                            >
                                {isClearing ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                {isClearing ? "Clearing..." : "Approve & Clear"}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 border-2 border-primarycolor/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-80 bg-primarycolor/5 rounded-full -mr-40 -mt-40 blur-3xl" />

                            <div className="relative space-y-12">
                                <div className="flex flex-col md:flex-row md:items-center gap-8">
                                    <div className="size-24 rounded-[2.5rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-xl border-4 border-white shrink-0">
                                        <Banknote className="size-12" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondarycolor/5 rounded-lg border border-secondarycolor/10">
                                            <Tag className="size-3.5 text-secondarycolor" />
                                            <span className="text-[10px] font-black text-secondarycolor uppercase tracking-[0.2em]">Check Details</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black text-primarycolor tracking-tighter italic uppercase leading-none">
                                            Check <span className="text-secondarycolor not-italic">#{check.id}</span>
                                        </h1>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border-2 border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                                <User className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Username</p>
                                                <p className="font-black text-primarycolor">{check.username || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border-2 border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                                <Building2 className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Bank Name</p>
                                                <p className="font-black text-primarycolor">{check.bankname || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border-2 border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                                <Tag className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Type</p>
                                                <p className="font-black text-primarycolor uppercase">{check.type || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border-2 border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                                <DollarSign className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Amount</p>
                                                <p className="font-black text-primarycolor">{check.amount || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border-2 border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                                <Calendar className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Recorded Date</p>
                                                <p className="font-black text-primarycolor">
                                                    {check.recordeddate
                                                        ? new Date(check.recordeddate).toLocaleDateString()
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border-2 border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                                <Clock className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Created At</p>
                                                <p className="font-black text-primarycolor">
                                                    {new Date(check.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {check.memo && (
                                    <div className="p-6 rounded-3xl bg-primarycolor/5 border-2 border-primarycolor/10 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <FileText className="size-4 text-primarycolor/40" />
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Memo</p>
                                        </div>
                                        <p className="font-bold text-primarycolor leading-relaxed">{check.memo}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-primarycolor rounded-[3rem] p-10 text-white shadow-2xl shadow-primarycolor/30 space-y-12 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mb-32 blur-3xl" />

                            <div className="space-y-8 relative">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                                        <Calendar className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Registry</p>
                                        <p className="text-lg font-black">{new Date(check.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                                        <Clock className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Last Updated</p>
                                        <p className="text-lg font-black">{new Date(check.updatedAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Account Integrity</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold opacity-80">Reference ID</span>
                                        <span className="font-black tracking-widest">CHK-{check.id.toString().padStart(4, '0')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 border-2 border-primarycolor/5 shadow-xl space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <AlertCircle className="size-6" />
                                </div>
                                <h4 className="text-sm font-black text-primarycolor uppercase tracking-widest italic">Record <span className="text-secondarycolor not-italic">Info</span></h4>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-white shadow-inner flex flex-col items-center text-center space-y-2">
                                    <Banknote className="size-8 text-primarycolor opacity-20" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</p>
                                    <p className="text-3xl font-black text-primarycolor">{check.amount || "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
