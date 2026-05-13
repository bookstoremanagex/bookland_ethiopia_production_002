"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ChevronLeft, 
    ClipboardList, 
    Edit2, 
    Trash2, 
    ShieldAlert, 
    AlertTriangle,
    Layers,
    Printer,
    Hash,
    Calendar,
    Settings,
    Activity,
    Clock,
    Check,
    ChevronsUpDown,
    CheckCircle2,
    RotateCcw,
    XCircle,
    Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import { updatePrintOrder, deletePrintOrder } from '@/app/actions/print-order-actions'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'

interface PrintOrderDetailClientProps {
    order: any
    printers: any[]
    editions: any[]
}

const statusOptions = [
    { value: "NOT_STARTED", label: "Not Started", icon: Clock },
    { value: "STARTED", label: "Started", icon: Activity },
    { value: "ONPROGRESS", label: "In Progress", icon: RotateCcw },
    { value: "FAILED", label: "Failed", icon: XCircle },
    { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
    { value: "REPRINT", label: "Reprinting", icon: RotateCcw }
]

const trackingOptions = [
    { value: "NOT_SET", label: "Not Set" },
    { value: "SHORTAGE_DETECTED", label: "Shortage Detected" },
    { value: "NOT_READY", label: "Not Ready" },
    { value: "PRINTING", label: "Printing" },
    { value: "DISTRIBUTION", label: "Distribution" },
    { value: "SALES", label: "Sales" }
]

export default function PrintOrderDetailClient({ order, printers, editions }: PrintOrderDetailClientProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")
    const [editionOpen, setEditionOpen] = useState(false)

    const [formData, setFormData] = useState({
        quality: order.quality,
        count: order.count.toString(),
        printerId: order.printerId.toString(),
        edition: order.edition || "",
        memo: order.memo || "",
        status: order.status,
        tracking: order.tracking,
        startDate: order.startDate ? format(new Date(order.startDate), "yyyy-MM-dd") : "",
        endDate: order.endDate ? format(new Date(order.endDate), "yyyy-MM-dd") : ""
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await updatePrintOrder(order.id, formData)
            if (response.success) {
                toast.success("Print order updated successfully")
                setIsEditing(false)
                router.refresh()
            } else {
                toast.error(response.error || "Failed to update order")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (deleteConfirmText !== "DELETE") return
        setIsDeleting(true)
        try {
            const response = await deletePrintOrder(order.id)
            if (response.success) {
                toast.success("Order removed successfully")
                router.push("/admin_dashboard/printing/manage")
            } else {
                toast.error(response.error || "Failed to remove order")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* Header Card */}
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <ClipboardList className="size-48" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="size-24 rounded-[2rem] bg-primarycolor/5 flex items-center justify-center text-primarycolor border-2 border-primarycolor/10 shadow-inner">
                                <Layers className="size-12" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                                        <Link href="/admin_dashboard/printing/manage" className="flex items-center gap-1">
                                            <ChevronLeft className="size-3" /> Back to Logs
                                        </Link>
                                    </Button>
                                    <div className="size-1 rounded-full bg-primarycolor/20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondarycolor">Order #PR-{order.id.toString().padStart(4, '0')}</span>
                                </div>
                                <h1 className="text-5xl font-black text-primarycolor uppercase tracking-tighter italic leading-none">
                                    {order.edition}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <Printer className="size-4 text-primarycolor/40" />
                                    <span className="text-xs font-bold text-primarycolor/60 uppercase tracking-widest">{order.printer?.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {!isEditing && (
                                <Button 
                                    onClick={() => setIsEditing(true)}
                                    className="h-16 px-10 rounded-[1.5rem] bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primarycolor/20 transition-all active:scale-95"
                                >
                                    <Edit2 className="size-5" /> Edit Order
                                </Button>
                            )}
                            <Button 
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="h-16 px-8 rounded-[1.5rem] font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-rose-500/20 transition-all active:scale-95"
                            >
                                <Trash2 className="size-5" /> Cancel Batch
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Configuration Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 md:p-12 border-2 border-primarycolor/10 shadow-2xl relative">
                            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
                                <Settings className="size-5 text-secondarycolor" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primarycolor">Production Parameters</h3>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    {/* Edition Selection (Combobox) */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Project Edition</label>
                                        <Popover open={editionOpen && isEditing} onOpenChange={setEditionOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    disabled={!isEditing}
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold justify-between hover:bg-slate-100 transition-all text-primarycolor disabled:opacity-100 disabled:bg-white"
                                                >
                                                    {formData.edition || "Choose Edition..."}
                                                    {isEditing && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search editions..." className="h-12 font-bold" />
                                                    <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                        <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No edition found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {editions.map((ed) => (
                                                                <CommandItem
                                                                    key={ed.id}
                                                                    value={`${ed.books?.title} - ${ed.edition_name}`}
                                                                    onSelect={() => {
                                                                        setFormData({ ...formData, edition: `${ed.books?.title} - ${ed.edition_name}` })
                                                                        setEditionOpen(false)
                                                                    }}
                                                                    className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer"
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", formData.edition === `${ed.books?.title} - ${ed.edition_name}` ? "opacity-100" : "opacity-0")} />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-black opacity-60 uppercase">{ed.books?.title}</span>
                                                                        <span>{ed.edition_name}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Assigned Printer</label>
                                        <select 
                                            disabled={!isEditing}
                                            value={formData.printerId}
                                            onChange={(e) => setFormData({...formData, printerId: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-primarycolor outline-none transition-all appearance-none disabled:opacity-100 disabled:bg-white"
                                        >
                                            {printers.map(printer => (
                                                <option key={printer.id} value={printer.id}>{printer.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Batch Quantity</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input 
                                                disabled={!isEditing}
                                                type="number"
                                                value={formData.count}
                                                onChange={(e) => setFormData({...formData, count: e.target.value})}
                                                className="h-14 pl-10 rounded-2xl border-2 font-black text-primarycolor disabled:opacity-100 disabled:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Quality Tier</label>
                                        <select 
                                            disabled={!isEditing}
                                            value={formData.quality}
                                            onChange={(e) => setFormData({...formData, quality: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-primarycolor outline-none transition-all appearance-none disabled:opacity-100 disabled:bg-white"
                                        >
                                            <option value="PREMIUM">Premium Hardcover</option>
                                            <option value="STANDARD">Standard Paperback</option>
                                            <option value="ECONOMY">Economy / Mass Market</option>
                                            <option value="SPECIAL">Special Edition / Collector</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Start Date</label>
                                        <Input 
                                            disabled={!isEditing}
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            className="h-14 px-6 rounded-2xl border-2 font-bold disabled:opacity-100 disabled:bg-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Target Completion</label>
                                        <Input 
                                            disabled={!isEditing}
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                            className="h-14 px-6 rounded-2xl border-2 font-bold disabled:opacity-100 disabled:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Production Memo</label>
                                    <Textarea 
                                        disabled={!isEditing}
                                        rows={4}
                                        value={formData.memo}
                                        onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                        className="p-6 rounded-[2rem] border-2 border-slate-100 font-bold text-sm bg-slate-50/50 disabled:opacity-100 disabled:bg-white transition-all resize-none"
                                        placeholder="No instructions provided..."
                                    />
                                </div>

                                {isEditing && (
                                    <div className="pt-6 flex gap-4 animate-in slide-in-from-bottom-6 duration-500">
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] h-16 rounded-[1.5rem] bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20"
                                        >
                                            {isSubmitting ? "Saving..." : "Commit Changes"}
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-16 rounded-[1.5rem] border-2 font-black uppercase tracking-widest"
                                        >
                                            Discard
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Operational Tracking Sidebar */}
                    <div className="space-y-8">
                        {/* Status Management */}
                        <div className="bg-white rounded-[3rem] p-8 border-2 border-primarycolor/10 shadow-xl space-y-8">
                            <div className="flex items-center gap-3">
                                <Activity className="size-5 text-secondarycolor" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primarycolor">Operational Status</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Phase</label>
                                    <select 
                                        disabled={!isEditing}
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-primarycolor/5 text-primarycolor font-black text-xs outline-none focus:border-primarycolor transition-all appearance-none disabled:opacity-100"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Logistics Tracking</label>
                                    <select 
                                        disabled={!isEditing}
                                        value={formData.tracking}
                                        onChange={(e) => setFormData({...formData, tracking: e.target.value})}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-secondarycolor/5 text-secondarycolor font-black text-xs outline-none focus:border-secondarycolor transition-all appearance-none disabled:opacity-100"
                                    >
                                        {trackingOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {!isEditing && (
                                <div className="pt-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black text-muted-foreground uppercase">Last Sync</span>
                                        <span className="text-[10px] font-bold text-primarycolor">{format(new Date(order.updatedAt), "HH:mm, MMM dd")}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black text-muted-foreground uppercase">Efficiency</span>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimal</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Metadata */}
                        <div className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl text-white space-y-6">
                            <div className="flex items-center gap-3 opacity-60">
                                <Info className="size-4" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Info</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Created At</p>
                                    <p className="text-xs font-bold">{format(new Date(order.createdAt), "MMMM dd, yyyy")}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Created By</p>
                                    <p className="text-xs font-bold">System Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl space-y-10 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-8">
                                <div className="size-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20">
                                    <ShieldAlert className="size-10" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-rose-500 uppercase tracking-tighter italic">Batch <span className="text-secondarycolor not-italic">Cancellation</span></h3>
                                    <p className="text-muted-foreground font-bold leading-none">You are about to terminate this order.</p>
                                </div>
                            </div>

                            <div className="p-8 bg-rose-500/5 rounded-[2rem] border-2 border-rose-500/10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="size-6 text-rose-500 shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                                            Warning: Cancelling this batch will remove it from active logs. Historic data for <span className="text-rose-600 font-black">"{order.edition}"</span> will be moved to archives.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">Type <span className="underline decoration-2 underline-offset-4">DELETE</span> to confirm permanent removal</p>
                                    <Input 
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="h-16 px-8 rounded-2xl border-2 border-rose-500/20 font-black text-rose-600 text-center text-xl tracking-[0.2em] focus-visible:ring-rose-500 uppercase"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button 
                                    variant="destructive"
                                    className="flex-1 h-16 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20 transition-all active:scale-95"
                                    onClick={handleDelete}
                                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                                >
                                    {isDeleting ? "Processing..." : "Confirm Termination"}
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="flex-1 h-16 rounded-[1.5rem] border-2 font-black uppercase tracking-widest transition-all active:scale-95"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Abort
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
