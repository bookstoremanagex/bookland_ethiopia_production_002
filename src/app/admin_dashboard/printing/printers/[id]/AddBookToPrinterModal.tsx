"use client"

import React, { useState, useEffect, useMemo } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Search, Loader2, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { searchBooks, getBookEditionsForTransfer } from '@/app/actions/transfer-actions'
import { transferToPrinter } from '@/app/actions/printer-inventory-actions'
import { toast } from 'sonner'

interface AddBookToPrinterModalProps {
    isOpen: boolean
    onClose: () => void
    printerId: number
    printerName: string
}

export default function AddBookToPrinterModal({ isOpen, onClose, printerId, printerName }: AddBookToPrinterModalProps) {
    const [step, setStep] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [books, setBooks] = useState<any[]>([])
    const [totalBooks, setTotalBooks] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const pageSize = 7

    const [selectedBook, setSelectedBook] = useState<any>(null)
    const [editions, setEditions] = useState<any[]>([])
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen && step === 1) {
            const delayDebounceFn = setTimeout(() => {
                fetchBooks()
            }, 300)
            return () => clearTimeout(delayDebounceFn)
        }
    }, [searchQuery, pageIndex, isOpen, step])

    const fetchBooks = async () => {
        setIsLoading(true)
        const res = await searchBooks(searchQuery, pageIndex, pageSize)
        if (res.success) {
            setBooks(res.data)
            setTotalBooks(res.totalCount || 0)
        }
        setIsLoading(false)
    }

    const handleSelectBook = async (book: any) => {
        setSelectedBook(book)
        setIsLoading(true)
        try {
            const res = await getBookEditionsForTransfer(book.id)
            if (res.success) {
                setEditions(res.data)
                setStep(2)
            } else {
                toast.error(String(res.error))
            }
        } catch (err) {
            toast.error("Runtime error: " + String(err))
        }
        setIsLoading(false)
    }

    const handleQuantityChange = (editionId: number, val: string, max: number) => {
        const num = parseInt(val) || 0
        if (num < 0) return
        if (num > max) {
            toast.warning(`Maximum available is ${max}`)
            setQuantities(prev => ({ ...prev, [editionId]: max }))
            return
        }
        setQuantities(prev => ({ ...prev, [editionId]: num }))
    }

    const handleTransfer = async () => {
        const transfers = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({ editionId: parseInt(id), quantity: qty }))

        if (transfers.length === 0) {
            toast.error("Please enter quantity for at least one edition")
            return
        }

        setIsSubmitting(true)
        const res = await transferToPrinter(printerId, transfers)
        if (res.success) {
            toast.success("Books transferred to printer successfully")
            onClose()
            setStep(1)
            setQuantities({})
            setSelectedBook(null)
        } else {
            toast.error(res.error)
        }
        setIsSubmitting(false)
    }

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div className="font-bold text-primarycolor line-clamp-1">{row.original.title}</div>
        },
        {
            accessorKey: "author",
            header: "Author",
            cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.original.author}</div>
        },
        {
            id: "action",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectBook(row.original)}
                    className="hover:bg-primarycolor hover:text-white rounded-xl font-bold uppercase text-[10px] tracking-widest"
                >
                    Select
                </Button>
            )
        }
    ], [])

    const table = useReactTable({
        data: books,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const pageCount = Math.ceil(totalBooks / pageSize)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <DialogHeader className="p-8 pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <div className="space-y-0.5 overflow-hidden">
                            <DialogTitle className="text-2xl md:text-3xl font-black text-primarycolor uppercase italic truncate">
                                Add Books <span className="text-secondarycolor not-italic">to {printerName}</span>
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                                {step === 1 ? "Search and select a book from central inventory" : `Configure editions for: ${selectedBook?.title}`}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all" />
                                <Input
                                    placeholder="Search by title, author, or ISBN..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setPageIndex(0)
                                    }}
                                    className="h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all"
                                />
                            </div>

                            <div className="rounded-2xl border-2 border-slate-50 overflow-hidden shadow-sm">
                                {isLoading ? (
                                    <div className="h-80 flex flex-col items-center justify-center gap-4 opacity-50">
                                        <Loader2 className="size-10 animate-spin text-primarycolor" />
                                        <p className="font-black uppercase tracking-widest text-xs">Scanning Inventory...</p>
                                    </div>
                                ) : books.length > 0 ? (
                                    <>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    {table.getHeaderGroups().map((headerGroup) => (
                                                        <TableRow key={headerGroup.id}>
                                                            {headerGroup.headers.map((header) => (
                                                                <TableHead key={header.id} className="h-12 font-black text-[10px] uppercase tracking-widest text-muted-foreground px-6">
                                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                                </TableHead>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableHeader>
                                                <TableBody>
                                                    {table.getRowModel().rows.map((row) => (
                                                        <TableRow key={row.id} className="group hover:bg-primarycolor/5 transition-all cursor-pointer" onClick={() => handleSelectBook(row.original)}>
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id} className="px-6 py-4">
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="p-4 bg-slate-50 border-t-2 border-white flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                Page {pageIndex + 1} of {pageCount || 1}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={pageIndex === 0}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setPageIndex(p => p - 1)
                                                    }}
                                                    className="rounded-xl h-9 w-9 p-0 bg-white"
                                                >
                                                    <ChevronLeft className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={pageIndex >= pageCount - 1}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setPageIndex(p => p + 1)
                                                    }}
                                                    className="rounded-xl h-9 w-9 p-0 bg-white"
                                                >
                                                    <ChevronRight className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-80 flex flex-col items-center justify-center gap-4 opacity-30 px-6 text-center">
                                        <Search className="size-16" />
                                        <p className="font-black uppercase tracking-widest text-xs">No books matched your criteria</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="grid grid-cols-1 gap-4">
                                {editions.length > 0 ? (
                                    editions.map((edition) => (
                                        <div key={edition.id} className="p-6 rounded-3xl border-2 border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primarycolor/20 transition-all">
                                            <div className="space-y-1">
                                                <h4 className="font-black text-primarycolor uppercase italic">{edition.edition_name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                        {edition.count_remening_for_transfer || 0} Units Available in Central
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-32">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 block mb-1 sm:hidden">Transfer Quantity</label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={quantities[edition.id] || ""}
                                                    onChange={(e) => handleQuantityChange(edition.id, e.target.value, edition.count_remening_for_transfer || 0)}
                                                    className="h-12 text-center rounded-xl border-2 border-white shadow-inner font-bold text-lg focus:border-primarycolor transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center space-y-4 opacity-50">
                                        <AlertCircle className="size-12 mx-auto text-amber-500" />
                                        <p className="font-black uppercase tracking-widest text-xs">No active editions found for this book</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="bg-slate-50 p-8 border-t border-slate-100 shrink-0 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full">
                        {step === 2 && (
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                disabled={isSubmitting}
                                className="rounded-2xl h-12 px-2 md:px-6 font-black uppercase tracking-widest text-[8px] md:text-[10px] gap-2 hover:bg-slate-200"
                            >
                                <ChevronLeft className="size-4" />
                                <span className="hidden sm:inline">Back</span>
                            </Button>
                        )}
                        <div className="flex-1" />
                        <div className="flex gap-2 md:gap-4 shrink-0">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="rounded-2xl h-12 px-4 md:px-6 font-black uppercase tracking-widest text-[8px] md:text-[10px]"
                            >
                                Cancel
                            </Button>
                            {step === 2 && editions.length > 0 && (
                                <Button
                                    onClick={handleTransfer}
                                    disabled={isSubmitting || Object.values(quantities).every(q => q === 0)}
                                    className="bg-primarycolor hover:bg-secondarycolor text-white rounded-2xl h-12 px-6 md:px-10 font-black uppercase tracking-widest text-[8px] md:text-[10px] shadow-xl shadow-primarycolor/20 active:scale-95 transition-all"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="size-5 animate-spin mr-2" />
                                    ) : "Confirm"}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
