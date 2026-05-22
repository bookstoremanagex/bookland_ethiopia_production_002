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
    Activity,
    Package,
    Plus,
    Building2,
    Settings,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import { updatePrinter, deletePrinter } from '@/app/actions/printer-actions'
import { PrinterInventoryTable } from './PrinterInventoryTable'
import AddBookToPrinterModal from './AddBookToPrinterModal'

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
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: printer.name,
        location: printer.location,
        phone: printer.phone || "",
        email: printer.email || "",
        status: printer.status || "available"
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

    const totalStock = (printer.bookeditionprinters || []).reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)

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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Form & Inventory */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 border-2 border-primarycolor/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 size-80 bg-primarycolor/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:scale-110 transition-transform duration-1000" />

                            <div className="relative space-y-12">
                                <div className="flex flex-col md:flex-row md:items-center gap-8">
                                    <div className="size-24 rounded-[2.5rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-xl border-4 border-white shrink-0 group-hover:rotate-3 transition-transform duration-500">
                                        <Printer className="size-12" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondarycolor/5 rounded-lg border border-secondarycolor/10">
                                            <Building2 className="size-3.5 text-secondarycolor" />
                                            <span className="text-[10px] font-black text-secondarycolor uppercase tracking-[0.2em]">Printer Identity</span>
                                        </div>
                                        <h1 className="text-4xl md:text-6xl font-black text-primarycolor tracking-tighter italic uppercase leading-none">
                                            {isEditing ? "Modify" : ""} <span className="text-secondarycolor not-italic">{isEditing ? "Partner" : printer.name}</span>
                                        </h1>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Facility Name</label>
                                            <Input
                                                value={formData.name}
                                                disabled={!isEditing}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="h-16 pl-8 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50 disabled:border-transparent"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Operating Status</label>
                                            <Select
                                                disabled={!isEditing}
                                                value={formData.status}
                                                onValueChange={(v) => setFormData({ ...formData, status: v })}
                                            >
                                                <SelectTrigger className="h-16 pl-8 rounded-2xl border-2 border-slate-100 focus:ring-0 font-bold text-lg disabled:bg-slate-50">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl p-2 border-2">
                                                    <SelectItem value="available" className="rounded-xl h-12 font-bold">Available</SelectItem>
                                                    <SelectItem value="closed" className="rounded-xl h-12 font-bold">Closed</SelectItem>
                                                    <SelectItem value="maintenance" className="rounded-xl h-12 font-bold">Maintenance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Physical Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                                <Input
                                                    value={formData.location}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Primary Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                                <Input
                                                    value={formData.phone}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Email Channel</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                                <Input
                                                    value={formData.email}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50"
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

                        {/* Inventory Section */}
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-primarycolor uppercase tracking-tight italic leading-none">
                                        Current <span className="text-secondarycolor not-italic">Inventory</span>
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Real-time stock held at this printer</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="px-6 py-2 rounded-full bg-primarycolor text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primarycolor/20">
                                        {totalStock.toLocaleString()} Global Units
                                    </div>
                                    <Button
                                        onClick={() => setIsAddBookModalOpen(true)}
                                        className="h-10 px-6 bg-secondarycolor hover:bg-secondarycolor/90 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondarycolor/10 active:scale-95 transition-all gap-2"
                                    >
                                        <Plus className="size-4" />
                                        Add Book
                                    </Button>
                                </div>
                            </div>

                            <PrinterInventoryTable data={printer.bookeditionprinters || []} />
                        </div>
                    </div>

                    {/* Right Column: Metadata & Stats */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-primarycolor rounded-[3rem] p-10 text-white shadow-2xl shadow-primarycolor/30 space-y-12 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mb-32 blur-3xl group-hover:scale-125 transition-transform duration-1000" />

                            <div className="space-y-8 relative">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                                        <Calendar className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Registry</p>
                                        <p className="text-lg font-black">{new Date(printer.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                                        <Clock className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Last Sync</p>
                                        <p className="text-lg font-black">{new Date(printer.updatedAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Account Integrity</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold opacity-80">Reference ID</span>
                                        <span className="font-black tracking-widest">PRT-{printer.id.toString().padStart(4, '0')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 border-2 border-primarycolor/5 shadow-xl space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <Settings className="size-6" />
                                </div>
                                <h4 className="text-sm font-black text-primarycolor uppercase tracking-widest italic">Operational <span className="text-secondarycolor not-italic">Logic</span></h4>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-white shadow-inner flex flex-col items-center text-center space-y-2">
                                    <ClipboardList className="size-8 text-primarycolor opacity-20" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Orders</p>
                                    <p className="text-3xl font-black text-primarycolor">{printer.printorder?.length || 0}</p>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-white shadow-inner flex flex-col items-center text-center space-y-2">
                                    <Package className="size-8 text-primarycolor opacity-20" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stock Items</p>
                                    <p className="text-3xl font-black text-primarycolor">{(printer.bookeditionprinters || []).length}</p>
                                </div>

                                <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-primarycolor/2 border-2 border-primarycolor/5 italic">
                                    <AlertCircle className="size-5 text-primarycolor/40 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                                        Printer metadata, inventory, and order status are synchronized in real-time across the production and sales grid.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AddBookToPrinterModal
                    isOpen={isAddBookModalOpen}
                    onClose={() => setIsAddBookModalOpen(false)}
                    printerId={printer.id}
                    printerName={printer.name}
                />

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
