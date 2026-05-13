"use client"

import React, { useState } from 'react'
import { 
    Plus, 
    X, 
    AlertCircle, 
    BookOpen, 
    Store, 
    Hash, 
    FileText,
    Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createDamagedBookReport } from '@/app/actions/damaged-book-actions'
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

export default function ReportDamageButton({ books, editions, stores }: ReportDamageButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [bookOpen, setBookOpen] = useState(false)
    const [editionOpen, setEditionOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        book_id: "",
        edition_id: "",
        store_id: "",
        type: "STORE",
        count: "",
        memo: ""
    })

    const filteredEditions = editions.filter(ed => ed.bookId === parseInt(formData.book_id))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.book_id || !formData.edition_id || !formData.count) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await createDamagedBookReport(formData)
            if (response.success) {
                toast.success("Damage reported successfully")
                setIsOpen(false)
                setFormData({
                    book_id: "",
                    edition_id: "",
                    store_id: "",
                    type: "STORE",
                    count: "",
                    memo: ""
                })
            } else {
                toast.error(response.error || "Failed to report damage")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button 
                onClick={() => setIsOpen(true)}
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
                                    <p className="text-muted-foreground font-bold text-[10px] md:text-sm">Document physical defects or inventory loss.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsOpen(false)}>
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
                                                                setFormData({ ...formData, book_id: book.id.toString(), edition_id: "" })
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
                                                                setFormData({ ...formData, edition_id: ed.id.toString() })
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

                            {/* Location / Store */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Report Location</label>
                                <select 
                                    value={formData.store_id}
                                    onChange={(e) => setFormData({...formData, store_id: e.target.value})}
                                    className="w-full h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-rose-500 outline-none transition-all appearance-none"
                                >
                                    <option value="">Direct / Production</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Damage Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Damage Source</label>
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Units Damaged</label>
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
                                    {isSubmitting ? "Reporting..." : "Submit Report"}
                                </Button>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] md:text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
