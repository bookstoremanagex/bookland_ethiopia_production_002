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
    DollarSign,
    Layers,
    Activity,
} from "lucide-react"

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
import Link from "next/link"
import { useCalendar } from "@/lib/calendar-context"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
    NOT_STARTED: "bg-slate-100 text-slate-600 border-slate-200",
    STARTED: "bg-blue-50 text-blue-600 border-blue-100",
    ONPROGRESS: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REPRINT: "bg-purple-50 text-purple-600 border-purple-100"
};

interface ListItem {
    id: number;
    editionId: number;
    orderId: number;
    projectName: string;
    printerName: string;
    bookTitle: string;
    editionName: string;
    quantity: number;
    pricePerBook: number;
    totalPrice: number;
    status: string;
    remaining: number | null;
    createdAt: string;
    paidAmount: number;
}

function createColumns(formatDate: (date: Date, pattern?: string) => string): ColumnDef<ListItem>[] {
    return [
        {
            id: "book",
            header: "Book & Edition",
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
                                {item.projectName}
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
            accessorKey: "totalPrice",
            header: "Total Price",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-emerald-500" />
                    <span className="font-black text-emerald-600 text-sm">
                        {row.original.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            ),
        },
        {
            id: "paid",
            header: "Paid",
            cell: ({ row }) => {
                const paid = row.original.paidAmount;
                const total = row.original.totalPrice;
                const pct = total > 0 ? (paid / total) * 100 : 0;
                return paid > 0 ? (
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="font-bold text-slate-800 text-sm">
                            {paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                            pct >= 100
                                ? "bg-emerald-50 text-emerald-600"
                                : pct > 50
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-rose-50 text-rose-600",
                        )}>
                            {pct.toFixed(0)}%
                        </span>
                    </div>
                ) : (
                    <span className="font-bold text-slate-300">—</span>
                );
            },
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
            cell: ({ row }) => (
                <Link href={`/admin_dashboard/printing/manage/${row.original.orderId}`}>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm group">
                        <ExternalLink className="size-4 group-hover:scale-110 transition-transform" />
                    </Button>
                </Link>
            ),
        },
    ];
}

export default function PrintingBooksListTable({ items }: { items: ListItem[] }) {
    const { formatDate } = useCalendar();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const columns = React.useMemo(() => createColumns(formatDate), [formatDate])
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
                        const paid = item.paidAmount;
                        const total = item.totalPrice;
                        const pct = total > 0 ? (paid / total) * 100 : 0;
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

                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Copies</div>
                                        <div className="font-bold text-primarycolor text-sm">{item.quantity.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Price</div>
                                        <div className="font-bold text-emerald-600 text-sm">
                                            {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Remaining</div>
                                        <div className={cn("font-bold text-sm", item.remaining != null && item.remaining > 0 ? "text-amber-600" : "text-slate-300")}>
                                            {item.remaining != null ? item.remaining.toLocaleString() : "—"}
                                        </div>
                                    </div>
                                </div>

                                {paid > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800 text-sm">
                                            Paid: {paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                            pct >= 100 ? "bg-emerald-50 text-emerald-600" : pct > 50 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600",
                                        )}>
                                            {pct.toFixed(0)}%
                                        </span>
                                    </div>
                                )}

                                <Link href={`/admin_dashboard/printing/manage/${item.orderId}`}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-10 rounded-xl border-primarycolor/20 font-black uppercase tracking-widest text-[10px]"
                                    >
                                        View Project <ExternalLink className="size-3 ml-1" />
                                    </Button>
                                </Link>
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
    );
}
