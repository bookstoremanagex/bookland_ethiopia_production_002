"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, PackageSearch, Loader2 } from "lucide-react"
import { useCalendar } from "@/lib/calendar-context"
import { getDeliveryRecords } from "@/app/actions/delivery-actions"

interface Book {
    id: number
    title: string
}

interface Edition {
    id: number
    bookId: number
    edition_name: string
}

interface DeliveryEntry {
    id: number
    printerName: string
    storeName: string | null
    quantity_deliverd: number | null
    approvedByPrinter: boolean
    createdAt: string
    approvedByPrinterAt: string | null
}

export default function DeliveryRecordsView({
    books,
    editions,
}: {
    books: Book[]
    editions: Edition[]
}) {
    const { formatDateTime } = useCalendar()

    const [bookOpen, setBookOpen] = useState(false)
    const [editionOpen, setEditionOpen] = useState(false)
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null)
    const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null)
    const [records, setRecords] = useState<DeliveryEntry[]>([])
    const [loading, setLoading] = useState(false)

    const filteredEditions = editions.filter(
        (e) => e.bookId === selectedBookId
    )

    const selectedBook = books.find((b) => b.id === selectedBookId)
    const selectedEdition = editions.find((e) => e.id === selectedEditionId)

    useEffect(() => {
        if (!selectedEditionId) {
            setRecords([])
            return
        }
        setLoading(true)
        getDeliveryRecords(selectedEditionId)
            .then(setRecords)
            .finally(() => setLoading(false))
    }, [selectedEditionId])

    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    Delivery Records
                </h2>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    View printer delivery history by book and edition
                </p>
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Book combobox */}
                <Popover open={bookOpen} onOpenChange={setBookOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            className="w-full sm:w-[280px] h-12 px-4 rounded-xl border-2 border-slate-200 bg-white font-bold justify-between hover:bg-slate-100 transition-all text-slate-700"
                        >
                            <span className="truncate">
                                {selectedBook?.title || "Choose Book..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-[300px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden"
                        align="start"
                    >
                        <Command>
                            <CommandInput
                                placeholder="Search books..."
                                className="h-12 font-bold"
                            />
                            <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
                                    No book found.
                                </CommandEmpty>
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
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedBookId === book.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            <span className="truncate">
                                                {book.title}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Edition combobox */}
                <Popover
                    open={editionOpen}
                    onOpenChange={setEditionOpen}
                >
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            disabled={!selectedBookId}
                            className="w-full sm:w-[280px] h-12 px-4 rounded-xl border-2 border-slate-200 bg-white font-bold justify-between hover:bg-slate-100 transition-all text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">
                                {selectedEdition?.edition_name ||
                                    (selectedBookId
                                        ? "Choose Edition..."
                                        : "Select book first")}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-[300px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden"
                        align="start"
                    >
                        <Command>
                            <CommandInput
                                placeholder="Search editions..."
                                className="h-12 font-bold"
                            />
                            <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
                                    No edition found.
                                </CommandEmpty>
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
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedEditionId === ed.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            <span className="truncate">
                                                {ed.edition_name}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Table */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span className="font-bold text-xs uppercase tracking-widest">
                            Loading...
                        </span>
                    </div>
                ) : records.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <PackageSearch className="h-10 w-10 mb-3 opacity-40" />
                        <p className="font-bold text-xs uppercase tracking-widest">
                            {selectedEditionId
                                ? "No delivery records for this edition"
                                : "Select a book and edition to view records"}
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-2 border-slate-200 bg-slate-50">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 h-10">
                                    Printer
                                </TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 h-10">
                                    Store
                                </TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 h-10 text-right">
                                    Qty
                                </TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 h-10">
                                    Status
                                </TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 h-10">
                                    Created
                                </TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 h-10">
                                    Approved At
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map((rec) => (
                                <TableRow
                                    key={rec.id}
                                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                >
                                    <TableCell className="font-semibold text-sm text-slate-800">
                                        {rec.printerName}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        {rec.storeName || (
                                            <span className="text-slate-300 italic">
                                                —
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-sm text-slate-800">
                                        {rec.quantity_deliverd ?? (
                                            <span className="text-slate-300">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                rec.approvedByPrinter
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                    : "bg-amber-50 text-amber-600 border-amber-200"
                                            )}
                                        >
                                            {rec.approvedByPrinter
                                                ? "Approved"
                                                : "Pending"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        {formatDateTime(new Date(rec.createdAt))}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        {rec.approvedByPrinterAt ? (
                                            formatDateTime(
                                                new Date(rec.approvedByPrinterAt)
                                            )
                                        ) : (
                                            <span className="text-slate-300 italic">
                                                —
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
