"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Printer,
    Hash,
    BookOpen,
    Layers,
    Activity,
    Pencil,
    Loader2,
    RefreshCw,
    ChevronsUpDown,
    Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { useCalendar } from "@/lib/calendar-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { changeEditionPrinter } from "@/app/actions/print-order-actions"

const statusStyles: Record<string, string> = {
    NOT_STARTED: "bg-slate-100 text-slate-600 border-slate-200",
    STARTED: "bg-blue-50 text-blue-600 border-blue-100",
    ONPROGRESS: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REPRINT: "bg-purple-50 text-purple-600 border-purple-100",
    NOT_IN_PROJECT: "bg-slate-100 text-slate-400 border-slate-200"
};

interface ListItem {
    id: number;
    editionId: number;
    orderId: number;
    projectName: string;
    printerName: string;
    printerLocation: string;
    bookTitle: string;
    editionName: string;
    quantity: number;
    pricePerBook: number;
    totalPrice: number;
    status: string;
    remaining: number | null;
    createdAt: string;
    paidAmount: number;
    totalPrinterStock: number;
    totalPrintCount: number;
    inStore: number;
    printerStocks: any[];
}

interface PrinterOption {
    id: number;
    name: string;
    location: string;
}

function createColumns(
    formatDate: (date: Date, pattern?: string) => string,
    onEditPrinter: (item: ListItem) => void
): ColumnDef<ListItem>[] {
    return [
        {
            id: "book",
            header: "Book & Edition",
            filterFn: (row, columnId, filterValue) => {
                const item = row.original;
                const q = String(filterValue || "").toLowerCase();
                if (!q) return true;
                return (
                    item.bookTitle.toLowerCase().includes(q) ||
                    item.editionName.toLowerCase().includes(q)
                );
            },
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                            <BookOpen className="size-4" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-sm text-slate-800 truncate max-w-[200px]" title={item.bookTitle}>
                                {item.bookTitle}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {item.editionName}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "project",
            header: "Project",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Layers className="size-3.5 text-primarycolor/40 shrink-0" />
                        <div className="min-w-0">
                            <div className="font-bold text-xs text-primarycolor truncate max-w-[160px]">
                                {item.status === "NOT_IN_PROJECT" ? "Not in a project" : item.projectName}
                            </div>
                            {item.printerName && (
                                <div className="flex items-center gap-1">
                                    <Printer className="size-2.5 text-muted-foreground" />
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {item.printerName}
                                    </span>
                                </div>
                            )}
                        </div>
                        {item.status !== "NOT_IN_PROJECT" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-sm group shrink-0"
                                title={`Change Printer (${item.printerName || "—"})`}
                                onClick={() => onEditPrinter(item)}
                            >
                                <Pencil className="size-3.5 group-hover:scale-110 transition-transform" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "quantity",
            header: "Copies",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <Hash className="size-3.5 text-primarycolor/40" />
                    <span className="font-bold text-sm text-primarycolor">
                        {row.original.quantity.toLocaleString()}
                    </span>
                </div>
            ),
        },
        {
            id: "remaining",
            header: "Remaining",
            cell: ({ row }) => {
                const remaining = row.original.remaining;
                return (
                    <span className={cn(
                        "font-bold",
                        remaining != null && remaining > 0
                            ? "text-amber-600"
                            : "text-slate-300",
                    )}>
                        {remaining != null ? remaining.toLocaleString() : "—"}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <div className={cn(
                        "px-3 py-1 rounded-full border inline-block",
                        statusStyles[status] || statusStyles.NOT_STARTED
                    )}>
                        <span className="text-[9px] font-black uppercase tracking-widest">
                            {status.replace("_", " ")}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "View",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center justify-end">
                        {item.status !== "NOT_IN_PROJECT" && (
                            <Link href={`/admin_dashboard/printing/manage/${item.orderId}`}>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm group" title="View Project">
                                    <ExternalLink className="size-4 group-hover:scale-110 transition-transform" />
                                </Button>
                            </Link>
                        )}
                    </div>
                );
            },
        },
    ];
}

export default function PrintingBooksListTable({ items, printers }: { items: ListItem[]; printers: PrinterOption[] }) {
    const { formatDate } = useCalendar();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [editItem, setEditItem] = React.useState<ListItem | null>(null)
    const [selectedPrinter, setSelectedPrinter] = React.useState<string>("")
    const [saving, setSaving] = React.useState(false)
    const [printerSearch, setPrinterSearch] = React.useState("")
    const [printerOpen, setPrinterOpen] = React.useState(false)

    const selectedPrinterOption = printers.find((p) => String(p.id) === selectedPrinter)

    const filteredPrinters = printers.filter((p) => {
        const q = printerSearch.trim().toLowerCase();
        if (!q) return true;
        return (
            p.name.toLowerCase().includes(q) ||
            (p.location || "").toLowerCase().includes(q)
        );
    });

    const columns = React.useMemo(
        () => createColumns(formatDate, (item) => {
            setSelectedPrinter(item.printerName ? String(findPrinterId(item.printerName) ?? "") : "")
            setPrinterSearch("")
            setEditItem(item)
        }),
        [formatDate]
    )

    const findPrinterId = (name: string): number | undefined =>
        printers.find((p) => p.name === name)?.id

    const handleChangePrinter = async () => {
        if (!editItem) return;
        const newId = parseInt(selectedPrinter);
        if (!newId) return;

        const oldId = findPrinterId(editItem.printerName);
        if (oldId === newId) {
            toast.info("Book already assigned to this printer");
            return;
        }

        setSaving(true);
        const res = await changeEditionPrinter({
            orderId: editItem.orderId,
            editionId: editItem.editionId,
            newPrinterId: newId,
        });
        setSaving(false);

        if (res.success) {
            toast.success("Printer changed successfully");
            setEditItem(null);
            window.location.reload();
        } else {
            toast.error(res.error || "Failed to change printer");
        }
    }
    const table = useReactTable({
        data: items,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, columnFilters },
        initialState: { pagination: { pageSize: 15 } }
    })

    return (
        <>
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 px-6 h-auto sm:h-20 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
                <div className="flex items-center gap-4 flex-1">
                    <Search className="size-5 text-slate-400 shrink-0" />
                    <Input
                        placeholder="Search books or projects..."
                        value={(table.getColumn("book")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("book")?.setFilterValue(event.target.value)
                        }
                        className="h-12 sm:h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10 text-[10px] font-black text-primarycolor uppercase tracking-widest shrink-0 justify-center">
                    <Activity className="size-3" /> {items.length} Books
                </div>
            </div>

            <div className="hidden md:block bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-16 px-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/40">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.original.id} className="h-16 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-40 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    No books found across print projects.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                        const item = row.original;
                        return (
                            <div key={item.id} className="bg-white rounded-2xl border-2 border-primarycolor/5 p-5 space-y-4 hover:shadow-md transition-all">
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                                        <BookOpen className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-sm text-slate-800 leading-tight truncate">
                                            {item.bookTitle}
                                        </div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {item.editionName}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Layers className="size-2.5 text-primarycolor/40" />
                                            <span className="text-[9px] font-bold text-primarycolor truncate">
                                                {item.projectName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cn("px-2.5 py-0.5 rounded-full border shrink-0 self-start", statusStyles[item.status] || statusStyles.NOT_STARTED)}>
                                        <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                                            {item.status.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Copies</div>
                                        <div className="font-bold text-primarycolor text-sm">{item.quantity.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Remaining</div>
                                        <div className={cn("font-bold text-sm", item.remaining != null && item.remaining > 0 ? "text-amber-600" : "text-slate-300")}>
                                            {item.remaining != null ? item.remaining.toLocaleString() : "—"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {item.status !== "NOT_IN_PROJECT" ? (
                                        <>
                                            <Link href={`/admin_dashboard/printing/manage/${item.orderId}`} className="flex-1">
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-10 rounded-xl border-primarycolor/20 font-black uppercase tracking-widest text-[10px]"
                                                >
                                                    View Project <ExternalLink className="size-3 ml-1" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedPrinter(item.printerName ? String(findPrinterId(item.printerName) ?? "") : "")
                                                    setEditItem(item)
                                                }}
                                                className="h-10 w-10 rounded-xl border-amber-500/40 bg-amber-50 hover:bg-amber-100 text-amber-700 shrink-0"
                                                title="Change Printer"
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <span className="w-full h-10 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            Not in a project
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-16 text-center space-y-4 opacity-30">
                        <BookOpen className="size-12 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest">No books found</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between px-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Showing {table.getRowModel().rows.length} of {items.length} books
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-xl h-10 w-10 p-0 border-2 border-primarycolor/5"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="px-4 py-2 rounded-xl bg-white border-2 border-primarycolor/5 text-[10px] font-black text-primarycolor">
                        {table.getState().pagination.pageIndex + 1}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-xl h-10 w-10 p-0 border-2 border-primarycolor/5"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

        <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-primarycolor uppercase italic flex items-center gap-2">
                        <Pencil className="size-5" /> Change Printer
                    </DialogTitle>
                    <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {editItem ? `${editItem.bookTitle} — ${editItem.editionName}` : ""}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Current printer + location */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                            Current Printer
                        </label>
                        <div className="rounded-xl border-2 border-slate-100 bg-slate-50 px-3 py-2.5 flex items-center gap-2">
                            <Printer className="size-4 text-primarycolor/40 shrink-0" />
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-700 truncate">
                                    {editItem?.printerName || "—"}
                                </div>
                                {editItem?.printerLocation && (
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                                        {editItem.printerLocation}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edition stats */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl border border-slate-100 bg-blue-50/50 p-3 text-center">
                            <div className="text-[8px] font-black uppercase tracking-widest text-blue-500 mb-1">Total Print</div>
                            <div className="text-base font-black text-blue-700">
                                {editItem ? editItem.totalPrintCount.toLocaleString() : "—"}
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-emerald-50/50 p-3 text-center">
                            <div className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mb-1">In Store</div>
                            <div className="text-base font-black text-emerald-700">
                                {editItem ? editItem.inStore.toLocaleString() : "—"}
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-amber-50/50 p-3 text-center">
                            <div className="text-[8px] font-black uppercase tracking-widest text-amber-500 mb-1">Remaining at Printer</div>
                            <div className="text-base font-black text-amber-700">
                                {editItem ? editItem.totalPrinterStock.toLocaleString() : "—"}
                            </div>
                        </div>
                    </div>

                    {/* New printer */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                            New Printer
                        </label>
                        <Popover open={printerOpen} onOpenChange={setPrinterOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={printerOpen}
                                    className="w-full h-10 rounded-xl border-2 border-primarycolor/20 font-bold justify-between text-sm"
                                >
                                    {selectedPrinterOption ? (
                                        <span className="flex items-center gap-2 truncate">
                                            <Printer className="size-4 text-primarycolor/50 shrink-0" />
                                            {selectedPrinterOption.name}
                                            {selectedPrinterOption.location ? ` — ${selectedPrinterOption.location}` : ""}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">Select a printer...</span>
                                    )}
                                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-full p-0">
                                <div className="flex items-center border-b px-3">
                                    <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
                                    <Input
                                        autoFocus
                                        placeholder="Search printers..."
                                        value={printerSearch}
                                        onChange={(e) => setPrinterSearch(e.target.value)}
                                        className="h-10 border-none focus-visible:ring-0 bg-transparent font-bold text-sm px-0"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto p-1">
                                    {filteredPrinters.length > 0 ? (
                                        filteredPrinters.map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPrinter(String(p.id))
                                                    setPrinterOpen(false)
                                                    setPrinterSearch("")
                                                }}
                                                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-left hover:bg-primarycolor/10 transition-colors"
                                            >
                                                <Printer className="size-4 text-primarycolor/50 shrink-0" />
                                                <span className="truncate">
                                                    {p.name}
                                                    {p.location ? <span className="text-muted-foreground font-medium"> — {p.location}</span> : ""}
                                                </span>
                                                {String(p.id) === selectedPrinter && (
                                                    <Check className="ml-auto size-4 shrink-0 text-primarycolor" />
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-3 py-6 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            No printers found
                                        </p>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setEditItem(null)}
                        className="rounded-xl h-10 font-black uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleChangePrinter}
                        disabled={!selectedPrinter || saving}
                        className="rounded-xl h-10 font-black uppercase tracking-widest text-[10px] bg-primarycolor hover:bg-secondarycolor"
                    >
                        {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <RefreshCw className="size-4 mr-2" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
