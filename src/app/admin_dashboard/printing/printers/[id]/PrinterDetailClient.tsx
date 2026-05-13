"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ChevronLeft, 
    Printer, 
    Edit2, 
    Trash2, 
    ShieldAlert, 
    AlertTriangle,
    MapPin,
    Phone,
    Mail,
    Calendar,
    ClipboardList,
    Clock,
    Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import { updatePrinter, deletePrinter } from '@/app/actions/printer-actions'

interface PrinterDetailClientProps {
    printer: any
}

export default function PrinterDetailClient({ printer }: PrinterDetailClientProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")

    const [formData, setFormData] = useState({
        name: printer.name,
        location: printer.location,
        phone: printer.phone || "",
        email: printer.email || ""
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await updatePrinter(printer.id, formData)
            if (response.success) {
                toast.success("Printer details updated")
                setIsEditing(false)
                router.refresh()
            } else {
                toast.error(response.error || "Failed to update printer")
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
            const response = await deletePrinter(printer.id)
            if (response.success) {
                toast.success("Printer removed successfully")
                router.push("/admin_dashboard/printing/printers")
            } else {
                toast.error(response.error || "Failed to remove printer")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5">
                    <div className="flex items-center gap-6">
                        <div className="size-20 rounded-3xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border-2 border-primarycolor/10">
                            <Printer className="size-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                                    <Link href="/admin_dashboard/printing/printers" className="flex items-center gap-1">
                                        <ChevronLeft className="size-3" /> All Printers
                                    </Link>
                                </Button>
                                <div className="size-1 rounded-full bg-primarycolor/20" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40">Partner Profile</span>
                            </div>
                            <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter leading-none italic">
                                {printer.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isEditing && (
                            <Button 
                                onClick={() => setIsEditing(true)}
                                className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-2 shadow-xl shadow-primarycolor/20 transition-all"
                            >
                                <Edit2 className="size-4" /> Edit Details
                            </Button>
                        )}
                        <Button 
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-xl shadow-rose-500/20 transition-all"
                        >
                            <Trash2 className="size-4" /> Remove Partner
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form / Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-10 border-2 border-primarycolor/10 shadow-2xl">
                            <form onSubmit={handleUpdate} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Facility Name</label>
                                        <Input 
                                            disabled={!isEditing}
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="h-14 px-6 rounded-2xl border-2 font-black text-primarycolor disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input 
                                                disabled={!isEditing}
                                                required
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                className="h-14 pl-10 rounded-2xl border-2 font-bold disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input 
                                                disabled={!isEditing}
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="h-14 pl-10 rounded-2xl border-2 font-bold disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input 
                                                disabled={!isEditing}
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="h-14 pl-10 rounded-2xl border-2 font-bold disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-4 flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 h-16 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20"
                                        >
                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Metrics */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-primarycolor/10 shadow-xl space-y-6">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Activity Snapshot</h3>
                            
                            <div className="space-y-4">
                                <div className="p-6 rounded-[2rem] bg-primarycolor/5 border border-primarycolor/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                            <ClipboardList className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-muted-foreground uppercase">Lifetime Orders</p>
                                            <p className="text-xl font-black text-primarycolor tracking-tight">{printer.printorder?.length || 0}</p>
                                        </div>
                                    </div>
                                    <Activity className="size-5 text-primarycolor/20" />
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                        <Calendar className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase">Partner Since</p>
                                        <p className="text-xs font-black text-primarycolor uppercase tracking-tight">
                                            {format(new Date(printer.createdAt), "MMMM dd, yyyy")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20">
                                    <ShieldAlert className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tight italic">Termination <span className="text-secondarycolor not-italic">Notice</span></h3>
                                    <p className="text-muted-foreground font-bold">Removing printing partner.</p>
                                </div>
                            </div>

                            <div className="p-6 bg-rose-500/5 rounded-2xl border-2 border-rose-500/10 space-y-4">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-1" />
                                    <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                                        Warning: Deleting <span className="text-rose-600 font-black">"{printer.name}"</span> will remove their profile from the active registry. Historical orders will be archived.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Type <span className="underline">DELETE</span> to confirm</p>
                                    <Input 
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="h-14 px-6 rounded-xl border-2 border-rose-500/20 font-black text-rose-600 focus-visible:ring-rose-500"
                                        placeholder="Confirm deletion..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    variant="destructive"
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20"
                                    onClick={handleDelete}
                                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                                >
                                    {isDeleting ? "Processing..." : "Confirm Removal"}
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Keep Partner
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
