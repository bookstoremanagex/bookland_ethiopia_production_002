"use client"

import React, { useState } from 'react'
import { 
    Plus, 
    X, 
    AlertCircle, 
    Store, 
    Hash, 
    Activity,
    Printer,
    ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createDamagedBookReport, getEditionDamageSources } from '@/app/actions/damaged-book-actions'
import { checkCurrentUserRole } from '@/app/actions/book-shop-actions'
import { cn } from '@/lib/utils'
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
import { Check, ChevronsUpDown } from "lucide-react"

interface ReportDamageButtonProps {
    books: any[]
    editions: any[]
    stores: any[]
}

interface Allocation {
    sourceType: "store" | "central"
    storeStockId?: number
    storeId?: number
    name: string
    available: number
    quantity: string
}

export default function ReportDamageButton({ books, editions, stores }: ReportDamageButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [bookOpen, setBookOpen] = useState(false)
    const [editionOpen, setEditionOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [allocations, setAllocations] = useState<Allocation[]>([])
    const [sourcesLoaded, setSourcesLoaded] = useState(false)
    const [formData, setFormData] = useState({
        book_id: "",
        edition_id: "",
        type: "STORE",
        count: "",
        memo: ""
    })

    const filteredEditions = editions.filter(ed => ed.bookId === parseInt(formData.book_id))

    const enteredTotal = allocations.reduce((sum, a) => sum + (parseInt(a.quantity) || 0), 0)
    const enteredCount = parseInt(formData.count) || 0

    const handleOpen = async () => {
        const roleCheck = await checkCurrentUserRole("adding_damaged_books");
        if (!roleCheck.enabled) {
            toast.error("You do not have permission to report damaged books.");
            return;
        }
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false)
        setShowConfirm(false)
        setAllocations([])
        setSourcesLoaded(false)
        setFormData({ book_id: "", edition_id: "", type: "STORE", count: "", memo: "" })
    }

    const loadSources = async (editionId: number) => {
        const res = await getEditionDamageSources(editionId)
        if (!res.success) {
            toast.error(res.error || "Failed to load stock sources")
            setAllocations([])
            setSourcesLoaded(false)
            return
        }
        const d = res.data as any
        const list: Allocation[] = [
            ...d.stores.map((s: any) => ({
                sourceType: "store" as const,
                storeStockId: s.storeStockId,
                storeId: s.storeId,
                name: s.storeName,
                available: s.available,
                quantity: "",
            })),
            ...(d.centralAvailable > 0 ? [{
                sourceType: "central" as const,
                name: "Central / Not Yet Transferred",
                available: d.centralAvailable,
                quantity: "",
            }] : []),
        ]
        setAllocations(list)
        setSourcesLoaded(true)
    }

    const handleBookSelect = (bookId: string) => {
        setFormData({ ...formData, book_id: bookId, edition_id: "" })
        setAllocations([])
        setSourcesLoaded(false)
    }

    const handleEditionSelect = (editionId: string) => {
        setFormData({ ...formData, edition_id: editionId })
        setAllocations([])
        setSourcesLoaded(false)
        loadSources(parseInt(editionId))
    }

    const updateAllocation = (index: number, quantity: string) => {
        setAllocations(prev => prev.map((a, i) => i === index ? { ...a, quantity } : a))
    }

    const allocationsValid = allocations.length > 0
        && allocations.every(a => (parseInt(a.quantity) || 0) >= 0)
        && allocations.every(a => (parseInt(a.quantity) || 0) <= a.available)
        && enteredTotal > 0

    const confirmSummary = allocations
        .filter(a => (parseInt(a.quantity) || 0) > 0)
        .map(a => ({
            name: a.name,
            quantity: parseInt(a.quantity),
            sourceType: a.sourceType,
        }))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.book_id || !formData.edition_id || !formData.count) {
            toast.error("Please fill in all required fields")
            return
        }
        if (!sourcesLoaded || allocations.length === 0) {
            toast.error("No stock sources found for this edition")
            return
        }
        if (enteredTotal !== enteredCount) {
            toast.error(`Allocation total (${enteredTotal}) must equal damaged count (${enteredCount})`)
            return
        }
        if (!allocationsValid) {
            toast.error("Some allocations exceed the available stock in that source")
            return
        }
        setShowConfirm(true)
    }

    const handleConfirm = async () => {
        setIsSubmitting(true)
        try {
            const payload = allocations
                .filter(a => (parseInt(a.quantity) || 0) > 0)
                .map(a => ({
                    sourceType: a.sourceType,
                    storeStockId: a.storeStockId ?? null,
                    storeId: a.storeId ?? null,
                    quantity: parseInt(a.quantity),
                }))
            const response = await createDamagedBookReport(formData, payload)
            if (response.success) {
                toast.success("Damage reported and stock deducted successfully")
                handleClose()
            } else {
                toast.error(response.error || "Failed to report damage")
                setShowConfirm(false)
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            setShowConfirm(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button 
                onClick={handleOpen}
                className="h-14 px-8 rounded-2xl bg-rose-500 hover:bg-rose-600 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-rose-500/20 transition-all active:scale-95"
            >
                <Plus className="size-5" /> Report Damaged Book
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20 shadow-lg shrink-0">
                                    <AlertCircle className="size-6 md:size-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight italic">Report <span className="text-rose-500 not-italic">Damage</span></h3>
                                    <p className="text-muted-foreground font-bold text-[10px] md:text-sm">Stock will be deducted from each selected source.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleClose}>
                                <X className="size-5 md:size-6" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {/* Book Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Book</label>
                                <Popover open={bookOpen} onOpenChange={setBookOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={bookOpen}
                                            className="w-full h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold justify-between hover:bg-slate-100 transition-all text-primarycolor"
                                        >
                                            <span className="truncate">
                                                {formData.book_id
                                                    ? books.find((book) => book.id.toString() === formData.book_id)?.title
                                                    : "Choose Book..."}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[calc(100vw-4rem)] md:w-[400px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search book title..." className="h-12 font-bold" />
                                            <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No book found.</CommandEmpty>
                                                <CommandGroup>
                                                    {books.map((book) => (
                                                        <CommandItem
                                                            key={book.id}
                                                            value={book.title}
                                                            onSelect={() => {
                                                                handleBookSelect(book.id.toString())
                                                                setBookOpen(false)
                                                            }}
                                                            className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.book_id === book.id.toString() ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {book.title}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Edition Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Edition</label>
                                <Popover open={editionOpen} onOpenChange={setEditionOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            disabled={!formData.book_id}
                                            aria-expanded={editionOpen}
                                            className="w-full h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold justify-between hover:bg-slate-100 transition-all text-primarycolor disabled:opacity-50"
                                        >
                                            <span className="truncate">
                                                {formData.edition_id
                                                    ? filteredEditions.find((ed) => ed.id.toString() === formData.edition_id)?.edition_name
                                                    : "Choose Edition..."}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[calc(100vw-4rem)] md:w-[400px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search edition..." className="h-12 font-bold" />
                                            <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No edition found.</CommandEmpty>
                                                <CommandGroup>
                                                    {filteredEditions.map((ed) => (
                                                        <CommandItem
                                                            key={ed.id}
                                                            value={ed.edition_name}
                                                            onSelect={() => {
                                                                handleEditionSelect(ed.id.toString())
                                                                setEditionOpen(false)
                                                            }}
                                                            className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.edition_id === ed.id.toString() ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {ed.edition_name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Damage Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Damage Type</label>
                                <select 
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-rose-500 outline-none transition-all appearance-none"
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Units Damaged (Total)</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input 
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.count}
                                        onChange={(e) => setFormData({...formData, count: e.target.value})}
                                        className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-2 font-bold"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Allocation breakdown */}
                            <div className="md:col-span-2 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Activity className="size-4 text-rose-500" />
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                                        Where did the damage come from?
                                    </label>
                                </div>

                                {!formData.edition_id && (
                                    <p className="text-xs font-bold text-muted-foreground">Select an edition to see available stock per location.</p>
                                )}
                                {formData.edition_id && !sourcesLoaded && allocations.length === 0 && (
                                    <p className="text-xs font-bold text-muted-foreground animate-pulse">Loading stock sources...</p>
                                )}
                                {sourcesLoaded && allocations.length === 0 && (
                                    <p className="text-xs font-bold text-muted-foreground">No available stock found for this edition.</p>
                                )}

                                {allocations.map((alloc, index) => (
                                    <div key={index} className="flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 md:px-5 py-3">
                                        <div className="size-9 md:size-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 bg-white border-2 border-slate-100">
                                            {alloc.sourceType === "central"
                                                ? <Printer className="size-4 md:size-5 text-sky-500" />
                                                : <Store className="size-4 md:size-5 text-emerald-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs md:text-sm font-black text-primarycolor truncate">{alloc.name}</p>
                                            <p className="text-[10px] md:text-xs font-bold text-muted-foreground">
                                                Available: <span className="text-emerald-600">{alloc.available}</span>
                                            </p>
                                        </div>
                                        <div className="w-24 md:w-28">
                                            <Input 
                                                type="number"
                                                min="0"
                                                max={alloc.available}
                                                value={alloc.quantity}
                                                onChange={(e) => updateAllocation(index, e.target.value)}
                                                className={cn(
                                                    "h-10 md:h-12 rounded-lg md:rounded-xl border-2 font-black text-center",
                                                    parseInt(alloc.quantity) > alloc.available && "border-rose-500 text-rose-600",
                                                    parseInt(alloc.quantity) > 0 && parseInt(alloc.quantity) <= alloc.available && "border-emerald-500"
                                                )}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {sourcesLoaded && allocations.length > 0 && (
                                    <div className={cn(
                                        "flex items-center justify-between rounded-xl md:rounded-2xl border-2 px-4 md:px-5 py-3 font-black",
                                        enteredTotal === enteredCount && enteredTotal > 0
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-amber-200 bg-amber-50 text-amber-700"
                                    )}>
                                        <span className="text-xs md:text-sm uppercase tracking-widest">Total Allocated</span>
                                        <span className="text-sm md:text-base">
                                            {enteredTotal} / {enteredCount || 0}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Memo */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Detailed Description</label>
                                <Textarea 
                                    rows={4}
                                    value={formData.memo}
                                    onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                    className="p-4 md:p-6 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-rose-500 outline-none font-bold text-sm bg-transparent transition-all resize-none"
                                    placeholder="Explain the nature of the damage..."
                                />
                            </div>

                            <div className="md:col-span-2 pt-4 flex flex-col md:flex-row gap-4">
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] h-14 md:h-16 rounded-xl md:rounded-2xl bg-rose-500 hover:bg-rose-600 font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20 transition-all text-[10px] md:text-xs"
                                >
                                    {isSubmitting ? "Processing..." : "Review Deduction"}
                                </Button>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] md:text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border-2 border-emerald-500/20 shrink-0">
                                <ShieldCheck className="size-6 md:size-7" />
                            </div>
                            <div>
                                <h4 className="text-lg md:text-xl font-black text-primarycolor uppercase tracking-tight">Confirm Deduction</h4>
                                <p className="text-xs font-bold text-muted-foreground">
                                    {enteredTotal} unit{enteredTotal !== 1 ? "s" : ""} will be deducted from stock.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 p-4">
                            {confirmSummary.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-1.5">
                                    <span className="text-xs md:text-sm font-bold text-primarycolor flex items-center gap-2">
                                        {item.sourceType === "central"
                                            ? <Printer className="size-4 text-sky-500" />
                                            : <Store className="size-4 text-emerald-500" />}
                                        {item.name}
                                    </span>
                                    <span className="text-xs md:text-sm font-black text-rose-600">-{item.quantity}</span>
                                </div>
                            ))}
                            <div className="border-t-2 border-slate-200 my-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-primarycolor">Total Deducted</span>
                                <span className="text-sm md:text-base font-black text-rose-600">-{enteredTotal}</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 pt-2">
                            <Button
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="flex-[2] h-14 rounded-xl md:rounded-2xl bg-rose-500 hover:bg-rose-600 font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 text-[10px] md:text-xs"
                            >
                                {isSubmitting ? "Deducting..." : "Yes, Deduct Stock"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowConfirm(false)}
                                disabled={isSubmitting}
                                className="flex-1 h-14 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] md:text-xs"
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
