"use client"

import React, { useState, useEffect } from 'react'
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
    ImageIcon,
    Pencil,
    X,
    Upload,
    Link as LinkIcon,
    ListOrdered,
    ExternalLink,
    Link2Off,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useCalendar } from "@/lib/calendar-context"
import { DateInput } from "@/components/ui/date-input"
import { toast } from 'sonner'
import { updateCheckStatus, updateCheckDetails } from '@/app/actions/check-actions'

const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    CLEARED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    BOUNCED: "bg-rose-100 text-rose-700 border-rose-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
}

interface LinkedOrder {
    id: number
    order_type: string
    total_amount: number
    amount_paid: number
    status: string
    is_approved: boolean
    delivery: boolean
    createdAt: string
    bookshopName: string
    bookshopId: number
    itemCount: number
    totalBooks: number
    firstBookTitle: string | null
}

interface CheckDetailClientProps {
    check: any
    isAdmin: boolean
    linkedOrders: LinkedOrder[]
}

export default function CheckDetailClient({ check, isAdmin, linkedOrders }: CheckDetailClientProps) {
    const { formatDate } = useCalendar()
    const router = useRouter()
    const [isClearing, setIsClearing] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [editForm, setEditForm] = useState({
        username: check.username || "",
        bankname: check.bankname || "",
        type: check.type || "PAYMENT",
        amount: check.amount || "",
        recordeddate: check.recordeddate ? new Date(check.recordeddate).toISOString().split("T")[0] : "",
        expirydate: check.expirydate ? new Date(check.expirydate).toISOString().split("T")[0] : "",
        memo: check.memo || "",
        imageUrl: check.imageUrl || "",
    })

    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

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

    const handleSave = async () => {
        if (!editForm.username.trim() || !editForm.bankname.trim()) {
            toast.error("Username and Bank Name are required")
            return
        }
        setIsSaving(true)
        try {
            const res = await updateCheckDetails(check.id, {
                username: editForm.username.trim(),
                bankname: editForm.bankname.trim(),
                type: editForm.type,
                amount: editForm.amount,
                recordeddate: editForm.recordeddate || null,
                expirydate: editForm.expirydate || null,
                memo: editForm.memo || null,
                imageUrl: editForm.imageUrl || null,
            })
            if (res.success) {
                toast.success("Check updated successfully")
                setEditOpen(false)
                router.refresh()
            } else {
                toast.error(res.error || "Failed to update")
            }
        } catch {
            toast.error("Failed to update check")
        } finally {
            setIsSaving(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        setUploadProgress(0)

        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append("file", file)

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                setUploadProgress(Math.round((event.loaded / event.total) * 100))
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText)
                if (res.success) {
                    setEditForm((prev) => ({ ...prev, imageUrl: res.url }))
                    setUploadProgress(100)
                }
            }
            setUploading(false)
        }

        xhr.onerror = () => {
            setUploading(false)
            toast.error("Failed to upload image")
        }

        xhr.open("POST", "/api/upload-check-image")
        xhr.send(formData)
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
                        {isAdmin && (
                            <Button
                                onClick={() => setEditOpen(true)}
                                className="h-10 px-5 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primarycolor/20 gap-2"
                            >
                                <Pencil className="size-4" />
                                Edit
                            </Button>
                        )}
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
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Expiry Date</p>
                                                <p className="font-black text-primarycolor">
                                                    {check.expirydate
                                                        ? formatDate(new Date(check.expirydate))
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
                                                    {formatDate(new Date(check.createdAt))}
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

                                {check.imageUrl && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="size-4 text-primarycolor/40" />
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Check Image</p>
                                        </div>
                                        <a href={check.imageUrl} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={check.imageUrl}
                                                alt="Check image"
                                                className="w-full max-h-80 object-contain rounded-3xl border-2 border-slate-100 bg-slate-50 cursor-pointer hover:opacity-90 transition-opacity"
                                            />
                                        </a>
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
                                        <p className="text-lg font-black">{formatDate(new Date(check.createdAt))}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                                        <Clock className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Last Updated</p>
                                        <p className="text-lg font-black">{formatDate(new Date(check.updatedAt), "hh:mm a")}</p>
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

            {/* Linked Orders Section */}
            <div className="max-w-4xl mx-auto mt-10">
                <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <ListOrdered className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-primarycolor uppercase tracking-widest italic">
                                Linked <span className="text-secondarycolor not-italic">Orders</span>
                            </h3>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                {linkedOrders.length > 0
                                    ? `${linkedOrders.length} order${linkedOrders.length !== 1 ? "s" : ""} linked to this check`
                                    : "No orders linked to this check"}
                            </p>
                        </div>
                    </div>

                    {linkedOrders.length === 0 ? (
                        <div className="py-10 text-center space-y-3">
                            <div className="size-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                                <Link2Off className="size-6 text-slate-300" />
                            </div>
                            <p className="text-xs font-bold text-muted-foreground">
                                This check is not linked to any orders
                            </p>
                            <p className="text-[10px] text-muted-foreground/60">
                                Checks become linked when used as payment for an order
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {linkedOrders.map((order) => {
                                const remaining = (order.total_amount || 0) - (order.amount_paid || 0);
                                return (
                                    <div
                                        key={order.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                <ListOrdered className="size-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-primarycolor text-sm">
                                                        #ORD-{order.id}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                        order.is_approved
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                                                        order.order_type === "on round"
                                                            ? "bg-indigo-100 text-indigo-600"
                                                            : "bg-teal-100 text-teal-600"
                                                    )}>
                                                        {order.order_type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                                                    <span>{order.bookshopName}</span>
                                                    <span>&middot;</span>
                                                    <span>{order.itemCount} item{order.itemCount !== 1 ? "s" : ""} ({order.totalBooks} book{order.totalBooks !== 1 ? "s" : ""})</span>
                                                    {order.firstBookTitle && (
                                                        <>
                                                            <span>&middot;</span>
                                                            <span className="truncate max-w-[150px]">"{order.firstBookTitle}"</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                                                    <Calendar className="size-3" />
                                                    <span>{formatDate(new Date(order.createdAt))}</span>
                                                    {remaining > 0 && (
                                                        <span className="text-rose-500">
                                                            {remaining.toLocaleString()} ETB remaining
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <p className="font-black text-primarycolor text-sm">
                                                    {order.total_amount.toLocaleString()} ETB
                                                </p>
                                                <p className="text-[9px] font-bold text-muted-foreground">
                                                    Paid: {order.amount_paid.toLocaleString()} ETB
                                                </p>
                                            </div>
                                            <Link
                                                href={`/admin_dashboard/manage_payment/${order.bookshopId}`}
                                                className="h-10 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-100 hover:border-indigo-300 font-black text-[9px] uppercase tracking-widest text-indigo-700 flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
                                            >
                                                <ExternalLink className="size-3.5" />
                                                Go to Order
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={(o) => { if (!o) setEditOpen(false) }}>
                <DialogContent className="sm:max-w-lg rounded-[2rem] border-2 border-primarycolor/5 p-0 overflow-hidden max-h-[90dvh] flex flex-col">
                    <DialogHeader className="bg-white p-5 pb-3 border-b border-slate-100 shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-base font-black text-primarycolor uppercase tracking-tight italic">
                                    Edit Check #{check.id}
                                </DialogTitle>
                                <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                                    Update check details below
                                </DialogDescription>
                            </div>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                <Input
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    className="h-12 pl-11 rounded-2xl border-2 border-slate-200 font-bold text-sm"
                                    placeholder="Enter username..."
                                />
                            </div>
                        </div>

                        {/* Bank Name */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bank Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                <Input
                                    value={editForm.bankname}
                                    onChange={(e) => setEditForm({ ...editForm, bankname: e.target.value })}
                                    className="h-12 pl-11 rounded-2xl border-2 border-slate-200 font-bold text-sm"
                                    placeholder="Enter bank name..."
                                />
                            </div>
                        </div>

                        {/* Type & Amount */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 z-10" />
                                    <Select value={editForm.type} onValueChange={(v) => setEditForm({ ...editForm, type: v })}>
                                        <SelectTrigger className="h-12 pl-11 rounded-2xl border-2 border-slate-200 font-bold text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl p-2 border-2">
                                            <SelectItem value="PAYMENT" className="rounded-xl h-10 font-bold">Payment</SelectItem>
                                            <SelectItem value="COLLATERAL" className="rounded-xl h-10 font-bold">Collateral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                    <Input
                                        value={editForm.amount}
                                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                        className="h-12 pl-11 rounded-2xl border-2 border-slate-200 font-bold text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expiry Date</label>
                            <DateInput
                                value={editForm.expirydate}
                                onChange={(e) => setEditForm({ ...editForm, expirydate: e.target.value })}
                                className="h-12 px-4 rounded-2xl border-2 border-slate-200 font-bold text-sm"
                            />
                        </div>

                        {/* Recorded Date */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Recorded Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                <Input
                                    type="date"
                                    value={editForm.recordeddate}
                                    onChange={(e) => setEditForm({ ...editForm, recordeddate: e.target.value })}
                                    className="h-12 pl-11 rounded-2xl border-2 border-slate-200 font-bold text-sm"
                                />
                            </div>
                        </div>

                        {/* Memo */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Memo</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3 size-4 text-muted-foreground/50" />
                                <textarea
                                    value={editForm.memo}
                                    onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
                                    className="h-20 w-full pl-11 pt-3 rounded-2xl border-2 border-slate-200 font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
                                    placeholder="Additional notes..."
                                />
                            </div>
                        </div>

                        {/* Check Image */}
                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Check Image</label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                    id="check-image-edit"
                                />
                                <label
                                    htmlFor="check-image-edit"
                                    className={cn(
                                        "flex items-center gap-3 h-12 px-4 rounded-2xl border-2 border-dashed bg-white font-bold text-sm cursor-pointer transition-all",
                                        editForm.imageUrl
                                            ? "border-emerald-300 bg-emerald-50/50"
                                            : uploading
                                                ? "border-primarycolor/30 bg-primarycolor/5"
                                                : "border-slate-200 hover:border-primarycolor/30"
                                    )}
                                >
                                    {editForm.imageUrl ? (
                                        <>
                                            <div className="size-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                <CheckCircle2 className="size-4" />
                                            </div>
                                            <span className="text-emerald-700 text-xs font-bold truncate">Image uploaded</span>
                                        </>
                                    ) : uploading ? (
                                        <>
                                            <div className="size-8 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                                                <Loader2 className="size-4 animate-spin" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-primarycolor text-xs font-bold">Uploading...</span>
                                                    <span className="text-primarycolor text-[10px] font-black">{uploadProgress}%</span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-primarycolor/20 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-primarycolor transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="size-8 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                                                <Upload className="size-4" />
                                            </div>
                                            <span className="text-slate-700 text-xs font-bold">Upload check image</span>
                                        </>
                                    )}
                                </label>

                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                    <Input
                                        value={editForm.imageUrl}
                                        onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                        className="h-12 pl-11 rounded-2xl border-2 border-slate-200 font-bold text-sm"
                                        placeholder="Or paste image URL..."
                                    />
                                </div>
                            </div>
                            {editForm.imageUrl && (
                                <div className="mt-2 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-emerald-50/50 relative">
                                    <img
                                        src={editForm.imageUrl}
                                        alt="Check preview"
                                        className="w-full h-36 object-contain bg-white"
                                    />
                                    <button
                                        onClick={() => setEditForm({ ...editForm, imageUrl: "" })}
                                        className="absolute top-2 right-2 size-7 rounded-full bg-white/90 flex items-center justify-center text-rose-500 hover:bg-white shadow-sm"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="shrink-0 border-t-2 border-slate-100 p-4 bg-white">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 h-12 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !editForm.username.trim() || !editForm.bankname.trim()}
                                className="flex-1 h-12 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-sm shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
                            >
                                {isSaving ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="size-5" />
                                )}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
