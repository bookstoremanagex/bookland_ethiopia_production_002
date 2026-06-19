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
    BookOpen,
    BookPlus,
    FilePlus,
    Library,
    ArrowRight,
    Sparkles,
    Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateInput } from '@/components/ui/date-input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createPrintOrder, quickCreateBook, quickCreateEdition } from '@/app/actions/print-order-actions'
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
import { useCalendar } from "@/lib/calendar-context"

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
    total_price: string;
    price_per_book: string;
    status: string;
}

type AdditionMode = 'existing' | 'new-edition' | 'new-book';

export default function CreatePrintOrderButton({ printers, editions, books }: CreatePrintOrderButtonProps) {
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Book addition mode
    const [additionMode, setAdditionMode] = useState<AdditionMode>('existing')

    // Existing book & edition selectors
    const [bookOpen, setBookOpen] = useState(false)
    const [editionOpen, setEditionOpen] = useState(false)
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null)
    const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null)

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isDrawerSubmitting, setIsDrawerSubmitting] = useState(false)

    // New edition drawer: book search + edition fields
    const [drawerBookOpen, setDrawerBookOpen] = useState(false)
    const [drawerSelectedBookId, setDrawerSelectedBookId] = useState<number | null>(null)
    const [drawerEditionName, setDrawerEditionName] = useState('')
    const [drawerEditionQty, setDrawerEditionQty] = useState('')
    const [drawerEditionPages, setDrawerEditionPages] = useState('')
    const [drawerEditionPrice, setDrawerEditionPrice] = useState('')
    const [drawerEditionTotalPrice, setDrawerEditionTotalPrice] = useState('')

    // New book drawer: book fields + edition fields
    const [drawerBookTitle, setDrawerBookTitle] = useState('')
    const [drawerBookAuthor, setDrawerBookAuthor] = useState('')
    const [drawerBookCategory, setDrawerBookCategory] = useState('')
    const [drawerBookYear, setDrawerBookYear] = useState('')
    const [drawerBookLang, setDrawerBookLang] = useState('')
    const [drawerBookEditionName, setDrawerBookEditionName] = useState('')
    const [drawerBookEditionQty, setDrawerBookEditionQty] = useState('')
    const [drawerBookEditionPages, setDrawerBookEditionPages] = useState('')
    const [drawerBookEditionPrice, setDrawerBookEditionPrice] = useState('')
    const [drawerBookEditionTotalPrice, setDrawerBookEditionTotalPrice] = useState('')

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

    // Latest edition for the drawer-selected book (new edition mode)
    const drawerSelectedBook = books.find(b => b.id === drawerSelectedBookId)
    const latestEdition = drawerSelectedBookId
        ? editions
            .filter(ed => ed.bookId === drawerSelectedBookId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : null

    // Auto calculate total price
    useEffect(() => {
        if (formData.auto_calculate) {
            const total = formData.items.reduce((sum, item) => {
                const itemTotal = parseFloat(item.total_price);
                if (itemTotal > 0) return sum + itemTotal;
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
        
        if (formData.items.some(item => item.bookEditionId === selectedEditionId)) {
            toast.error("This edition is already added to the project")
            return
        }

        const newItem: PrintOrderItem = {
            id: Date.now(),
            bookId: selectedBookId!,
            bookEditionId: selectedEditionId,
            quantity: "",
            total_price: "",
            price_per_book: "",
            status: "NOT_STARTED"
        }

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }))

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

    // Generate next edition name suggestion
    const generateNextEditionName = (bookId: number | null): string => {
        if (!bookId) return ''
        const bookEditions = editions.filter(ed => ed.bookId === bookId)
        if (bookEditions.length === 0) return 'First Edition'
        const latest = bookEditions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        const match = latest.edition_name.match(/^Edition\s+(\d+)$/i)
        if (match) {
            return `Edition ${parseInt(match[1]) + 1}`
        }
        return `Edition ${bookEditions.length + 1}`
    }

    // Open drawer with mode
    const openDrawer = (mode: AdditionMode) => {
        setAdditionMode(mode)
        if (mode === 'new-edition') {
            setDrawerSelectedBookId(null)
            setDrawerEditionName('')
            setDrawerEditionQty('')
            setDrawerEditionPages('')
            setDrawerEditionPrice('')
            setDrawerEditionTotalPrice('')
        } else {
            setDrawerBookTitle('')
            setDrawerBookAuthor('')
            setDrawerBookCategory('')
            setDrawerBookYear('')
            setDrawerBookLang('')
            setDrawerBookEditionName('')
            setDrawerBookEditionQty('')
            setDrawerBookEditionPages('')
            setDrawerBookEditionPrice('')
            setDrawerBookEditionTotalPrice('')
        }
        setIsDrawerOpen(true)
    }

    // Handle drawer book selection for new edition mode
    const handleDrawerBookSelect = (bookId: number) => {
        setDrawerSelectedBookId(bookId)
        setDrawerBookOpen(false)
        setDrawerEditionName(generateNextEditionName(bookId))
    }

    // Submit drawer form
    const handleDrawerSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsDrawerSubmitting(true)

        try {
            let targetBookId: number
            let editionName: string
            let qty: string
            let pages: string
            let price: string
            let totalPrice: string

            if (additionMode === 'new-edition') {
                if (!drawerSelectedBookId) {
                    toast.error("Please select a book")
                    setIsDrawerSubmitting(false)
                    return
                }
                if (!drawerEditionName.trim()) {
                    toast.error("Please enter an edition name")
                    setIsDrawerSubmitting(false)
                    return
                }
                targetBookId = drawerSelectedBookId
                editionName = drawerEditionName.trim()
                qty = drawerEditionQty
                pages = drawerEditionPages
                price = drawerEditionPrice
                totalPrice = drawerEditionTotalPrice
            } else {
                if (!drawerBookTitle.trim() || !drawerBookAuthor.trim() || !drawerBookCategory.trim() || !drawerBookYear.trim()) {
                    toast.error("Please fill in title, author, category, and publication year")
                    setIsDrawerSubmitting(false)
                    return
                }
                const bookRes = await quickCreateBook({
                    title: drawerBookTitle.trim(),
                    author: drawerBookAuthor.trim(),
                    category: drawerBookCategory.trim(),
                    publication_year: drawerBookYear.trim(),
                    language: drawerBookLang.trim() || undefined,
                })
                if (!bookRes.success || !bookRes.data) {
                    toast.error(bookRes.error || "Failed to create book")
                    setIsDrawerSubmitting(false)
                    return
                }
                targetBookId = bookRes.data.id
                editionName = drawerBookEditionName.trim() || 'First Edition'
                qty = drawerBookEditionQty
                pages = drawerBookEditionPages
                price = drawerBookEditionPrice
                totalPrice = drawerBookEditionTotalPrice
            }

            // Create the edition
            const editionRes = await quickCreateEdition({
                edition_name: editionName,
                bookId: targetBookId,
                total_print_count: qty ? parseInt(qty) : undefined,
                number_of_pages: pages ? parseInt(pages) : undefined,
                production_price: price ? parseFloat(price) : undefined,
            })

            if (!editionRes.success || !editionRes.data) {
                toast.error(editionRes.error || "Failed to create edition")
                setIsDrawerSubmitting(false)
                return
            }

            // Add the new edition to items
            const newItem: PrintOrderItem = {
                id: Date.now(),
                bookId: targetBookId,
                bookEditionId: editionRes.data.id,
                quantity: qty || "",
                total_price: totalPrice || "",
                price_per_book: price || "",
                status: "NOT_STARTED"
            }

            setFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }))

            toast.success(`${editionName} added to project`)
            setIsDrawerOpen(false)
        } catch (err) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsDrawerSubmitting(false)
        }
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
                setAdditionMode('existing')
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
                                    <DateInput 
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className="h-14 px-6 rounded-2xl border-2 font-bold bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Expected Completion</label>
                                    <DateInput 
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

                                {/* Mode Selector */}
                                <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setAdditionMode('existing')}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                            additionMode === 'existing'
                                                ? "bg-primarycolor text-white shadow-lg shadow-primarycolor/20"
                                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                        )}
                                    >
                                        <Library className="size-4" />
                                        Existing Book & Edition
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openDrawer('new-edition')}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                            additionMode === 'new-edition'
                                                ? "bg-primarycolor text-white shadow-lg shadow-primarycolor/20"
                                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                        )}
                                    >
                                        <FilePlus className="size-4" />
                                        New Edition
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openDrawer('new-book')}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                            additionMode === 'new-book'
                                                ? "bg-primarycolor text-white shadow-lg shadow-primarycolor/20"
                                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                        )}
                                    >
                                        <BookPlus className="size-4" />
                                        New Book
                                    </button>
                                </div>

                                {/* Existing Book & Edition Controls */}
                                {additionMode === 'existing' && (
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
                                )}

                                {/* New Edition / New Book mode - show open drawer button */}
                                {(additionMode === 'new-edition' || additionMode === 'new-book') && !isDrawerOpen && (
                                    <div className="py-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                                        <div className="size-16 rounded-full bg-primarycolor/5 flex items-center justify-center mb-4 text-primarycolor">
                                            {additionMode === 'new-edition' ? <FilePlus className="size-8" /> : <BookPlus className="size-8" />}
                                        </div>
                                        <p className="font-bold text-slate-600 mb-1">
                                            {additionMode === 'new-edition' ? 'Create a New Edition' : 'Create a New Book & Edition'}
                                        </p>
                                        <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">
                                            {additionMode === 'new-edition'
                                                ? 'Add a fresh edition to an existing book for this project.'
                                                : 'Register a brand new book with its first edition.'}
                                        </p>
                                        <Button
                                            type="button"
                                            onClick={() => openDrawer(additionMode)}
                                            className="h-12 px-8 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-2"
                                        >
                                            <Sparkles className="size-4" />
                                            Open {additionMode === 'new-edition' ? 'Edition' : 'Book'} Creator
                                        </Button>
                                    </div>
                                )}

                                {/* Items List */}
                                {formData.items.length > 0 ? (
                                    <div className="space-y-3">
                                        {formData.items.map((item, index) => {
                                            const bookName = books.find(b => b.id === item.bookId)?.title || `Book #${item.bookId}`;
                                            const editionName = editions.find(e => e.id === item.bookEditionId)?.edition_name || `Edition #${item.bookEditionId}`;
                                            
                                            return (
                                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border-2 border-slate-100 p-4 rounded-2xl relative group">
                                                    <div className="md:col-span-3 flex items-center gap-3">
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

                                                    <div className="md:col-span-1 space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Price</label>
                                                        <Input 
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="Total"
                                                            value={item.total_price}
                                                            onChange={(e) => updateItem(item.id, 'total_price', e.target.value)}
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

                                                    <div className="md:col-span-2 space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cost of Edition</label>
                                                        <div className="h-10 rounded-lg bg-emerald-50 border-2 border-emerald-100 flex items-center px-3 font-black text-emerald-700 text-sm">
                                                            {(() => {
                                                                const itemTotal = parseFloat(item.total_price);
                                                                if (itemTotal > 0) return itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                                const qty = parseFloat(item.quantity) || 0;
                                                                const price = parseFloat(item.price_per_book) || 0;
                                                                return (qty * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                            })()} ETB
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-1 space-y-1">
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
                                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                            {additionMode === 'existing'
                                                ? 'Select a book and edition above to begin.'
                                                : 'Use the creator above to add a new book or edition.'}
                                        </p>
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

            {/* Drawer for New Edition / New Book */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white border-b-2 border-slate-100 px-6 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor">
                                    {additionMode === 'new-edition' ? <FilePlus className="size-5" /> : <BookPlus className="size-5" />}
                                </div>
                                <div>
                                    <h3 className="font-black text-primarycolor text-sm uppercase tracking-widest">
                                        {additionMode === 'new-edition' ? 'New Edition' : 'New Book & Edition'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {additionMode === 'new-edition' ? 'Add to an existing book' : 'Register a new book'}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsDrawerOpen(false)}>
                                <X className="size-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleDrawerSubmit} className="p-6 space-y-6">
                            {/* New Edition mode: Book selector */}
                            {additionMode === 'new-edition' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Book *</label>
                                        <Popover open={drawerBookOpen} onOpenChange={setDrawerBookOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white font-bold justify-between hover:bg-slate-100 transition-all text-slate-700"
                                                >
                                                    <span className="truncate">{drawerSelectedBook?.title || "Choose Book..."}</span>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0 rounded-2xl border-2 shadow-2xl z-[70]" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search books..." className="h-12 font-bold" />
                                                    <CommandList className="max-h-[220px] overflow-y-auto custom-scrollbar">
                                                        <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No book found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {books.map((book) => (
                                                                <CommandItem
                                                                    key={book.id}
                                                                    value={book.title}
                                                                    onSelect={() => handleDrawerBookSelect(book.id)}
                                                                    className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", drawerSelectedBookId === book.id ? "opacity-100" : "opacity-0")} />
                                                                    <span className="truncate">{book.title}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Latest edition info */}
                                    {drawerSelectedBook && (
                                        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-1.5">
                                            <div className="flex items-center gap-2 text-amber-700">
                                                <Info className="size-4" />
                                                <span className="font-black text-[10px] uppercase tracking-widest">Latest Edition</span>
                                            </div>
                                            <p className="font-bold text-sm text-amber-900">
                                                {latestEdition ? latestEdition.edition_name : 'No prior editions'}
                                            </p>
                                            {latestEdition && (
                                                <p className="text-[10px] font-bold text-amber-600/70">
                                                    Created {formatDate(new Date(latestEdition.createdAt))}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Edition Name *</label>
                                        <Input
                                            value={drawerEditionName}
                                            onChange={(e) => setDrawerEditionName(e.target.value)}
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                            placeholder="e.g. Edition 3"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* New Book mode: Book fields */}
                            {additionMode === 'new-book' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Book Title *</label>
                                            <Input
                                                value={drawerBookTitle}
                                                onChange={(e) => setDrawerBookTitle(e.target.value)}
                                                className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                                placeholder="e.g. The Great Gatsby"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Author *</label>
                                            <Input
                                                value={drawerBookAuthor}
                                                onChange={(e) => setDrawerBookAuthor(e.target.value)}
                                                className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                                placeholder="Author name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Category *</label>
                                            <Input
                                                value={drawerBookCategory}
                                                onChange={(e) => setDrawerBookCategory(e.target.value)}
                                                className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                                placeholder="e.g. Fiction"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Publication Year *</label>
                                            <Input
                                                value={drawerBookYear}
                                                onChange={(e) => setDrawerBookYear(e.target.value)}
                                                className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                                placeholder="e.g. 2026"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Language</label>
                                            <Input
                                                value={drawerBookLang}
                                                onChange={(e) => setDrawerBookLang(e.target.value)}
                                                className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                                placeholder="e.g. English"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Common Edition Fields for both modes */}
                            <div className="border-t-2 border-slate-100 pt-6">
                                <h4 className="font-black text-xs uppercase tracking-widest text-primarycolor mb-4 flex items-center gap-2">
                                    <BookOpen className="size-4" />
                                    Edition Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                                            Edition Name {additionMode === 'new-book' ? '*' : ''}
                                        </label>
                                        <Input
                                            value={additionMode === 'new-edition' ? drawerEditionName : drawerBookEditionName}
                                            onChange={(e) => {
                                                if (additionMode === 'new-edition') setDrawerEditionName(e.target.value)
                                                else setDrawerBookEditionName(e.target.value)
                                            }}
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                            placeholder={additionMode === 'new-book' ? 'e.g. First Edition' : 'e.g. Edition 3'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Print Quantity</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={additionMode === 'new-edition' ? drawerEditionQty : drawerBookEditionQty}
                                            onChange={(e) => {
                                                if (additionMode === 'new-edition') setDrawerEditionQty(e.target.value)
                                                else setDrawerBookEditionQty(e.target.value)
                                            }}
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                            placeholder="e.g. 1000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Number of Pages</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={additionMode === 'new-edition' ? drawerEditionPages : drawerBookEditionPages}
                                            onChange={(e) => {
                                                if (additionMode === 'new-edition') setDrawerEditionPages(e.target.value)
                                                else setDrawerBookEditionPages(e.target.value)
                                            }}
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                            placeholder="e.g. 250"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Total Price (ETB)</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={additionMode === 'new-edition' ? drawerEditionTotalPrice : drawerBookEditionTotalPrice}
                                            onChange={(e) => {
                                                if (additionMode === 'new-edition') setDrawerEditionTotalPrice(e.target.value)
                                                else setDrawerBookEditionTotalPrice(e.target.value)
                                            }}
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                            placeholder="e.g. 150000.00"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Unit Production Price (ETB)</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={additionMode === 'new-edition' ? drawerEditionPrice : drawerBookEditionPrice}
                                            onChange={(e) => {
                                                if (additionMode === 'new-edition') setDrawerEditionPrice(e.target.value)
                                                else setDrawerBookEditionPrice(e.target.value)
                                            }}
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold"
                                            placeholder="e.g. 150.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="sticky bottom-0 bg-white pt-4 border-t-2 border-slate-100 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isDrawerSubmitting}
                                    className="flex-[2] h-12 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-2"
                                >
                                    {isDrawerSubmitting ? (
                                        "Creating..."
                                    ) : (
                                        <>
                                            <Sparkles className="size-4" />
                                            Create & Add to Project
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
