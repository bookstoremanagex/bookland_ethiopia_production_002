"use client"

import React, { useState } from 'react'
import { 
    Plus, 
    X, 
    ClipboardList, 
    Printer, 
    Hash, 
    Layers, 
    Calendar,
    Settings,
    Activity,
    Check,
    ChevronsUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createPrintOrder } from '@/app/actions/print-order-actions'
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

interface CreatePrintOrderButtonProps {
    printers: any[]
    editions: any[]
    books: any[]
}

export default function CreatePrintOrderButton({ printers, editions, books }: CreatePrintOrderButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editionOpen, setEditionOpen] = useState(false)
    const [bookOpen, setBookOpen] = useState(false)
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null)
    
    const [formData, setFormData] = useState({
        quality: "STANDARD",
        count: "",
        printerId: "",
        edition: "",
        memo: "",
        status: "NOT_STARTED",
        tracking: "NOT_SET",
        startDate: "",
        endDate: ""
    })

    const selectedBook = books.find(b => b.id === selectedBookId)
    const filteredEditions = selectedBookId 
        ? editions.filter(ed => ed.bookId === selectedBookId)
        : editions

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.printerId || !formData.edition || !formData.count) {
            toast.error("Please fill in required fields")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await createPrintOrder(formData)
            if (response.success) {
                toast.success("Print order created successfully")
                setIsOpen(false)
                setFormData({
                    quality: "STANDARD",
                    count: "",
                    printerId: "",
                    edition: "",
                    memo: "",
                    status: "NOT_STARTED",
                    tracking: "NOT_SET",
                    startDate: "",
                    endDate: ""
                })
                setSelectedBookId(null)
            } else {
                toast.error(response.error || "Failed to create order")
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
                className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primarycolor/20 transition-all active:scale-95"
            >
                <Plus className="size-5" /> New Print Order
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg">
                                    <ClipboardList className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-primarycolor uppercase tracking-tight italic">Initiate <span className="text-secondarycolor not-italic">Print</span></h3>
                                    <p className="text-muted-foreground font-bold text-sm">Deploy a new production batch.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsOpen(false)}>
                                <X className="size-6" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Book Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Book</label>
                                <Popover open={bookOpen} onOpenChange={setBookOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold justify-between hover:bg-slate-100 transition-all text-primarycolor"
                                        >
                                            {selectedBook?.title || "Choose Book..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search books..." className="h-12 font-bold" />
                                            <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No book found.</CommandEmpty>
                                                <CommandGroup>
                                                    {books.map((book) => (
                                                        <CommandItem
                                                            key={book.id}
                                                            value={book.title}
                                                            onSelect={() => {
                                                                setSelectedBookId(book.id)
                                                                setBookOpen(false)
                                                                setFormData({ ...formData, edition: "" }) // Reset edition when book changes
                                                            }}
                                                            className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedBookId === book.id ? "opacity-100" : "opacity-0"
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

                            {/* Edition Selection (Combobox) */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Edition</label>
                                <Popover open={editionOpen} onOpenChange={setEditionOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            disabled={!selectedBookId}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold justify-between hover:bg-slate-100 transition-all text-primarycolor disabled:opacity-50"
                                        >
                                            {formData.edition || (selectedBookId ? "Choose Edition..." : "Select a book first")}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search editions..." className="h-12 font-bold" />
                                            <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No edition found.</CommandEmpty>
                                                <CommandGroup>
                                                    {filteredEditions.map((ed) => (
                                                        <CommandItem
                                                            key={ed.id}
                                                            value={ed.edition_name}
                                                            onSelect={() => {
                                                                setFormData({ ...formData, edition: `${selectedBook?.title} - ${ed.edition_name}` })
                                                                setEditionOpen(false)
                                                            }}
                                                            className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.edition === `${selectedBook?.title} - ${ed.edition_name}` ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
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

                            {/* Printer Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Assign Printer</label>
                                <select 
                                    required
                                    value={formData.printerId}
                                    onChange={(e) => setFormData({...formData, printerId: e.target.value})}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-primarycolor outline-none transition-all appearance-none"
                                >
                                    <option value="">Choose Printer...</option>
                                    {printers.map(printer => (
                                        <option key={printer.id} value={printer.id}>{printer.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Batch Quantity</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input 
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.count}
                                        onChange={(e) => setFormData({...formData, count: e.target.value})}
                                        className="h-14 pl-10 rounded-2xl border-2 font-bold"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Quality Tier */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Quality Standards</label>
                                <select 
                                    value={formData.quality}
                                    onChange={(e) => setFormData({...formData, quality: e.target.value})}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-primarycolor outline-none transition-all appearance-none"
                                >
                                    <option value="PREMIUM">Premium Hardcover</option>
                                    <option value="STANDARD">Standard Paperback</option>
                                    <option value="ECONOMY">Economy / Mass Market</option>
                                    <option value="SPECIAL">Special Edition / Collector</option>
                                </select>
                            </div>

                            {/* Dates */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Start Date</label>
                                <Input 
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="h-14 px-6 rounded-2xl border-2 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Expected Completion</label>
                                <Input 
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="h-14 px-6 rounded-2xl border-2 font-bold"
                                />
                            </div>

                            {/* Memo */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Production Memo</label>
                                <Textarea 
                                    rows={4}
                                    value={formData.memo}
                                    onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                    className="p-6 rounded-2xl border-2 border-slate-100 focus:border-primarycolor outline-none font-bold text-sm bg-transparent transition-all resize-none"
                                    placeholder="Add any specific printing instructions or requirements..."
                                />
                            </div>

                            <div className="md:col-span-2 pt-4 flex gap-4">
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] h-16 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20 transition-all"
                                >
                                    {isSubmitting ? "Deploying..." : "Launch Production"}
                                </Button>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest"
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
