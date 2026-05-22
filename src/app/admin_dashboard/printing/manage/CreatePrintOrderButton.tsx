"use client"

import React, { useState, useEffect } from 'react'
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
    ChevronsUpDown,
    Trash2,
    Calculator,
    BookOpen
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

interface PrintOrderItem {
    id: number;
    bookId: number;
    bookEditionId: number;
    quantity: string;
    price_per_book: string;
    status: string;
}

export default function CreatePrintOrderButton({ printers, editions, books }: CreatePrintOrderButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Book addition state
    const [bookOpen, setBookOpen] = useState(false)
    const [editionOpen, setEditionOpen] = useState(false)
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null)
    const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        project_name: "",
        printerId: "",
        memo: "",
        status: "NOT_STARTED",
        startDate: "",
        endDate: "",
        total_price: "",
        auto_calculate: true,
        items: [] as PrintOrderItem[]
    })

    const selectedBook = books.find(b => b.id === selectedBookId)
    const filteredEditions = selectedBookId 
        ? editions.filter(ed => ed.bookId === selectedBookId)
        : editions

    // Auto calculate total price
    useEffect(() => {
        if (formData.auto_calculate) {
            const total = formData.items.reduce((sum, item) => {
                const qty = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price_per_book) || 0;
                return sum + (qty * price);
            }, 0);
            setFormData(prev => ({ ...prev, total_price: total > 0 ? total.toString() : "" }));
        }
    }, [formData.items, formData.auto_calculate]);

    const handleAddBook = () => {
        if (!selectedEditionId) {
            toast.error("Please select an edition first")
            return
        }
        
        // Prevent adding duplicate edition
        if (formData.items.some(item => item.bookEditionId === selectedEditionId)) {
            toast.error("This edition is already added to the project")
            return
        }

        const newItem: PrintOrderItem = {
            id: Date.now(),
            bookId: selectedBookId!,
            bookEditionId: selectedEditionId,
            quantity: "",
            price_per_book: "",
            status: "NOT_STARTED"
        }

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }))

        // Reset selections
        setSelectedBookId(null)
        setSelectedEditionId(null)
    }

    const handleRemoveItem = (id: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }))
    }

    const updateItem = (id: number, field: keyof PrintOrderItem, value: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.printerId) {
            toast.error("Please assign a printer")
            return
        }
        if (formData.items.length === 0) {
            toast.error("Please add at least one book to the project")
            return
        }

        // Validate items
        const invalidItem = formData.items.find(i => !i.quantity || parseFloat(i.quantity) <= 0);
        if (invalidItem) {
            toast.error("Please provide valid quantities for all books")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await createPrintOrder(formData)
            if (response.success) {
                toast.success("Printing project created successfully")
                setIsOpen(false)
                setFormData({
                    project_name: "",
                    printerId: "",
                    memo: "",
                    status: "NOT_STARTED",
                    startDate: "",
                    endDate: "",
                    total_price: "",
                    auto_calculate: true,
                    items: []
                })
                setSelectedBookId(null)
                setSelectedEditionId(null)
            } else {
                toast.error(response.error || "Failed to create project")
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
                <Plus className="size-5" /> New Print Project
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-4xl bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-6">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg">
                                    <ClipboardList className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-primarycolor uppercase tracking-tight italic">Initiate <span className="text-secondarycolor not-italic">Project</span></h3>
                                    <p className="text-muted-foreground font-bold text-sm">Deploy a new multiple-book production batch.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsOpen(false)}>
                                <X className="size-6" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* General Project Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Project Name (Optional)</label>
                                    <Input 
                                        value={formData.project_name}
                                        onChange={(e) => setFormData({...formData, project_name: e.target.value})}
                                        className="h-14 px-6 rounded-2xl border-2 font-bold"
                                        placeholder="e.g. Summer Batch 2026"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Assign Printer</label>
                                    <select 
                                        required
                                        value={formData.printerId}
                                        onChange={(e) => setFormData({...formData, printerId: e.target.value})}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white font-bold focus:border-primarycolor outline-none transition-all appearance-none"
                                    >
                                        <option value="">Choose Printer...</option>
                                        {printers.map(printer => (
                                            <option key={printer.id} value={printer.id}>{printer.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Overall Status</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white font-bold focus:border-primarycolor outline-none transition-all appearance-none"
                                    >
                                        <option value="NOT_STARTED">Not Started / Waiting</option>
                                        <option value="STARTED">Started</option>
                                        <option value="ONPROGRESS">On Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Start Date</label>
                                    <Input 
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className="h-14 px-6 rounded-2xl border-2 font-bold bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Expected Completion</label>
                                    <Input 
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className="h-14 px-6 rounded-2xl border-2 font-bold bg-white"
                                    />
                                </div>
                            </div>

                            {/* Books Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-lg text-primarycolor uppercase tracking-widest">Books to Print</h4>
                                </div>

                                {/* Add Book Controls */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">
                                    <div className="md:col-span-5 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Book</label>
                                        <Popover open={bookOpen} onOpenChange={setBookOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white font-bold justify-between hover:bg-slate-100 transition-all text-slate-700"
                                                >
                                                    <span className="truncate">{selectedBook?.title || "Choose Book..."}</span>
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
                                                                        setSelectedEditionId(null)
                                                                    }}
                                                                    className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", selectedBookId === book.id ? "opacity-100" : "opacity-0")} />
                                                                    <span className="truncate">{book.title}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="md:col-span-5 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Edition</label>
                                        <Popover open={editionOpen} onOpenChange={setEditionOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    role="combobox"
                                                    disabled={!selectedBookId}
                                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white font-bold justify-between hover:bg-slate-100 transition-all text-slate-700 disabled:opacity-50"
                                                >
                                                    <span className="truncate">{editions.find(e => e.id === selectedEditionId)?.edition_name || (selectedBookId ? "Choose Edition..." : "Select book first")}</span>
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
                                                                        setSelectedEditionId(ed.id)
                                                                        setEditionOpen(false)
                                                                    }}
                                                                    className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", selectedEditionId === ed.id ? "opacity-100" : "opacity-0")} />
                                                                    <span className="truncate">{ed.edition_name}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Button 
                                            type="button"
                                            onClick={handleAddBook}
                                            disabled={!selectedEditionId}
                                            className="w-full h-12 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px]"
                                        >
                                            Add Book
                                        </Button>
                                    </div>
                                </div>

                                {/* Items List */}
                                {formData.items.length > 0 ? (
                                    <div className="space-y-3">
                                        {formData.items.map((item, index) => {
                                            const bookName = books.find(b => b.id === item.bookId)?.title;
                                            const editionName = editions.find(e => e.id === item.bookEditionId)?.edition_name;
                                            
                                            return (
                                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border-2 border-slate-100 p-4 rounded-2xl relative group">
                                                    <div className="md:col-span-4 flex items-center gap-3">
                                                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border-2 border-blue-100">
                                                            <BookOpen className="size-5" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="font-bold text-sm text-slate-800 truncate">{bookName}</p>
                                                            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest truncate">{editionName}</p>
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2 space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quantity</label>
                                                        <Input 
                                                            type="number"
                                                            min="1"
                                                            placeholder="Qty"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                                            className="h-10 rounded-lg font-bold"
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2 space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Unit Price</label>
                                                        <Input 
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="Price"
                                                            value={item.price_per_book}
                                                            onChange={(e) => updateItem(item.id, 'price_per_book', e.target.value)}
                                                            className="h-10 rounded-lg font-bold"
                                                        />
                                                    </div>

                                                    <div className="md:col-span-3 space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</label>
                                                        <select 
                                                            value={item.status}
                                                            onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white font-bold text-xs outline-none"
                                                        >
                                                            <option value="NOT_STARTED">Waiting</option>
                                                            <option value="STARTED">Started</option>
                                                            <option value="ONPROGRESS">On Progress</option>
                                                            <option value="COMPLETED">Completed</option>
                                                        </select>
                                                    </div>

                                                    <div className="md:col-span-1 flex justify-end">
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="icon"
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="text-red-400 hover:text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="size-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                                        <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                                            <Layers className="size-8" />
                                        </div>
                                        <p className="font-bold text-slate-400">No books added yet.</p>
                                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Select a book and edition above to begin.</p>
                                    </div>
                                )}
                            </div>

                            {/* Totals & Memo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-slate-100 pt-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Total Project Amount</label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.auto_calculate}
                                                onChange={(e) => setFormData({...formData, auto_calculate: e.target.checked})}
                                                className="rounded border-slate-300 text-primarycolor focus:ring-primarycolor"
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto Calculate from Items</span>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                        <Input 
                                            type="number"
                                            step="0.01"
                                            disabled={formData.auto_calculate}
                                            value={formData.total_price}
                                            onChange={(e) => setFormData({...formData, total_price: e.target.value})}
                                            className="h-16 pl-12 rounded-2xl border-2 font-black text-xl text-primarycolor bg-slate-50 disabled:opacity-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {formData.auto_calculate && (
                                        <p className="text-xs font-bold text-slate-400 text-right">Calculated as sum of (Quantity × Price) for all books.</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Production Memo</label>
                                    <Textarea 
                                        rows={3}
                                        value={formData.memo}
                                        onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                        className="p-6 rounded-2xl border-2 border-slate-100 focus:border-primarycolor outline-none font-bold text-sm bg-transparent transition-all resize-none"
                                        placeholder="Add any specific printing instructions or requirements..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] h-16 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20 transition-all text-sm"
                                >
                                    {isSubmitting ? "Deploying Project..." : "Launch Printing Project"}
                                </Button>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-sm"
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
