"use client"

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
    ChevronLeft, 
    AlertCircle, 
    Edit2, 
    Trash2, 
    ShieldAlert, 
    AlertTriangle,
    BookOpen,
    Store,
    Hash,
    Calendar,
    Check,
    Layers,
    User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'
import { useCalendar } from '@/lib/calendar-context'
import { updateDamagedBookReport, deleteDamagedBookReport } from '@/app/actions/damaged-book-actions'

interface DamagedBookDetailClientProps {
    report: any
    books: any[]
    editions: any[]
    stores: any[]
}

export default function DamagedBookDetailClient({ report, books, editions, stores }: DamagedBookDetailClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const dashboardRoot = pathname.split('/').slice(0, 2).join('/')
    const { formatLong } = useCalendar()
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")

    const [formData, setFormData] = useState({
        book_id: report.book_id.toString(),
        edition_id: report.edition_id.toString(),
        store_id: report.store_id?.toString() || "",
        type: report.type,
        count: report.count.toString(),
        memo: report.memo || ""
    })

    const filteredEditions = editions.filter(ed => ed.bookId === parseInt(formData.book_id))

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await updateDamagedBookReport(report.id, formData)
            if (response.success) {
                toast.success("Report updated successfully")
                setIsEditing(false)
                router.refresh()
            } else {
                toast.error(response.error || "Failed to update report")
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
            const response = await deleteDamagedBookReport(report.id)
            if (response.success) {
                toast.success("Report deleted successfully")
                router.push(`${dashboardRoot}/books/damaged`)
            } else {
                toast.error(response.error || "Failed to delete report")
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="size-14 md:size-20 rounded-2xl md:rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20 shrink-0">
                            <AlertCircle className="size-7 md:size-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[8px] md:text-[10px]">
                                    <Link href={`${dashboardRoot}/books/damaged`} className="flex items-center gap-1">
                                        <ChevronLeft className="size-3" /> All Reports
                                    </Link>
                                </Button>
                                <div className="size-1 rounded-full bg-primarycolor/20" />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-rose-500/60">Damage Report #{report.id}</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-primarycolor uppercase tracking-tighter leading-none italic">
                                Damage <span className="text-rose-500 not-italic">Profile</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                        {!isEditing && (
                            <Button 
                                onClick={() => setIsEditing(true)}
                                className="h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px] md:text-xs gap-2 shadow-xl shadow-primarycolor/20 transition-all flex items-center justify-center"
                            >
                                <Edit2 className="size-4" /> Edit Report
                            </Button>
                        )}
                        <Button 
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="h-12 md:h-14 px-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs gap-2 shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center"
                        >
                            <Trash2 className="size-4" /> Discard Report
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Left Column: Form / Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-6 md:p-10 border-2 border-primarycolor/10 shadow-2xl">
                            <form onSubmit={handleUpdate} className="space-y-8 md:space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Book Selection */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Book Identity</label>
                                        <select 
                                            disabled={!isEditing}
                                            required
                                            value={formData.book_id}
                                            onChange={(e) => setFormData({...formData, book_id: e.target.value, edition_id: ""})}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-rose-500 outline-none transition-all appearance-none disabled:opacity-50"
                                        >
                                            {books.map(book => (
                                                <option key={book.id} value={book.id}>{book.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Edition Selection */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Edition Release</label>
                                        <select 
                                            disabled={!isEditing}
                                            required
                                            value={formData.edition_id}
                                            onChange={(e) => setFormData({...formData, edition_id: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-rose-500 outline-none transition-all appearance-none disabled:opacity-50"
                                        >
                                            {filteredEditions.map(ed => (
                                                <option key={ed.id} value={ed.id}>{ed.edition_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Reporting Location</label>
                                        <select 
                                            disabled={!isEditing}
                                            value={formData.store_id}
                                            onChange={(e) => setFormData({...formData, store_id: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-rose-500 outline-none transition-all appearance-none disabled:opacity-50"
                                        >
                                            <option value="">Direct / Production</option>
                                            {stores.map(store => (
                                                <option key={store.id} value={store.id}>{store.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Damage Type */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Damage Context</label>
                                        <select 
                                            disabled={!isEditing}
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-rose-500 outline-none transition-all appearance-none disabled:opacity-50"
                                        >
                                            <option value="STORE">In-Store Damage</option>
                                            <option value="PRINTING">Printing Error</option>
                                            <option value="DESIGN">Design Flaw</option>
                                            <option value="PREPRINTING">Pre-production Error</option>
                                            <option value="DISTRIBUTION">Logistics / Distribution</option>
                                            <option value="SALES">Sales Return / Damage</option>
                                        </select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Impact Quantity</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input 
                                                disabled={!isEditing}
                                                type="number"
                                                required
                                                min="1"
                                                value={formData.count}
                                                onChange={(e) => setFormData({...formData, count: e.target.value})}
                                                className="h-14 pl-10 rounded-2xl border-2 font-bold disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Observation Memo</label>
                                    <Textarea 
                                        disabled={!isEditing}
                                        rows={6}
                                        value={formData.memo}
                                        onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                        className="p-6 rounded-2xl border-2 border-slate-100 focus:border-rose-500 outline-none font-bold text-sm bg-slate-50 transition-all resize-none disabled:opacity-50"
                                    />
                                </div>

                                {isEditing && (
                                    <div className="pt-4 flex flex-col md:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl bg-rose-500 hover:bg-rose-600 font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20"
                                        >
                                            {isSubmitting ? "Updating..." : "Save Changes"}
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Metadata */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-primarycolor/10 shadow-xl space-y-6">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Reporting Metadata</h3>
                            
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                        <Calendar className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase">Created At</p>
                                        <p className="text-xs font-black text-primarycolor uppercase tracking-tight">
                                            {formatLong(new Date(report.createdAt))}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primarycolor shadow-sm">
                                        <User className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase">Registered By</p>
                                        <p className="text-xs font-black text-primarycolor uppercase tracking-tight">
                                            {report.accounts?.name || "System Admin"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-100 flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg">
                                        <ShieldAlert className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-rose-500 uppercase">Impact Level</p>
                                        <p className="text-xs font-black text-rose-700 uppercase tracking-tight">
                                            {report.count > 10 ? "Significant Loss" : "Minor Damage"}
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
                                    <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tight">Danger <span className="text-secondarycolor">Zone</span></h3>
                                    <p className="text-muted-foreground font-bold">Discarding damage report.</p>
                                </div>
                            </div>

                            <div className="p-6 bg-rose-500/5 rounded-2xl border-2 border-rose-500/10 space-y-4">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-1" />
                                    <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                                        You are about to delete this damage report. This will remove the record of loss for <span className="text-rose-600 font-black">"{report.books?.title}"</span>.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Type <span className="underline">DELETE</span> to confirm</p>
                                    <Input 
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="h-14 px-6 rounded-xl border-2 border-rose-500/20 font-black text-rose-600"
                                        placeholder="Type here..."
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
                                    {isDeleting ? "Processing..." : "Confirm Delete"}
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
