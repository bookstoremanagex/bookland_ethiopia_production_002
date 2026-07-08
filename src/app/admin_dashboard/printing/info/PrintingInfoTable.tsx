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
    BookOpen,
    Printer,
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
import { cn } from "@/lib/utils"

interface ItemRow {
    id: number
    orderId: number
    projectName: string
    printerName: string
    bookTitle: string
    author: string
    editionName: string
    quantity: number
    status: string
}

const statusStyles: Record<string, string> = {
    NOT_STARTED: "bg-slate-100 text-slate-600 border-slate-200",
    STARTED: "bg-blue-50 text-blue-600 border-blue-100",
    ONPROGRESS: "bg-amber-50 text-amber-600 border-amber-100",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REPRINT: "bg-purple-50 text-purple-600 border-purple-100",
};

const statusLabels: Record<string, string> = {
    NOT_STARTED: "Not Started",
    STARTED: "Started",
    ONPROGRESS: "In Progress",
    FAILED: "Failed",
    COMPLETED: "Completed",
    REPRINT: "Reprinting",
};

const filterOptions = [
    { value: "", label: "All Statuses" },
    { value: "NOT_STARTED", label: "Not Started" },
    { value: "IN_PROGRESS", label: "Started / In Progress" },
    { value: "COMPLETED", label: "Completed" },
];

export default function PrintingInfoTable({ items }: { items: ItemRow[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("")

    const counts = React.useMemo(() => {
        const all = items.length
        const notStarted = items.filter((i) => i.status === "NOT_STARTED").length
        const inProgress = items.filter((i) => i.status === "STARTED" || i.status === "ONPROGRESS").length
        const completed = items.filter((i) => i.status === "COMPLETED").length
        return { all, notStarted, inProgress, completed }
    }, [items])

    const filteredData = React.useMemo(() => {
        if (!statusFilter) return items
        if (statusFilter === "IN_PROGRESS") {
            return items.filter((i) => i.status === "STARTED" || i.status === "ONPROGRESS")
        }
        return items.filter((i) => i.status === statusFilter)
    }, [items, statusFilter])

    const columns: ColumnDef<ItemRow>[] = [
        {
            accessorKey: "bookTitle",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
                >
                    Book
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                        <BookOpen className="size-4" />
                    </div>
                    <div>
                        <p className="font-black text-primarycolor uppercase text-xs leading-tight">{row.getValue("bookTitle")}</p>
                        <p className="text-[9px] font-bold text-muted-foreground">{row.original.editionName}</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "projectName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
                >
                    Project
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-xs font-bold text-slate-600">{row.getValue("projectName")}</span>
            ),
        },
        {
            accessorKey: "printerName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
                >
                    <Printer className="size-3 mr-1" />
                    Printer
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-xs font-bold text-primarycolor">{row.getValue("printerName")}</span>
            ),
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
                >
                    Qty
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-black text-slate-700">{row.getValue<number>("quantity").toLocaleString()}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue<string>("status")
                return (
                    <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                        statusStyles[status] || "bg-slate-100 text-slate-600"
                    )}>
                        {statusLabels[status] || status}
                    </span>
                )
            },
            filterFn: "equalsString",
        },
    ]

    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: { sorting, columnFilters, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
    })

    return (
        <div className="bg-white rounded-[3rem] p-8 md:p-10 border-2 border-primarycolor/5 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-full max-w-sm group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input
                        placeholder="Search by book, project or printer..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {filterOptions.map((opt) => {
                        const count =
                            opt.value === "" ? counts.all
                            : opt.value === "NOT_STARTED" ? counts.notStarted
                            : opt.value === "IN_PROGRESS" ? counts.inProgress
                            : counts.completed
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setStatusFilter(opt.value)}
                                className={cn(
                                    "px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2",
                                    statusFilter === opt.value
                                        ? "bg-primarycolor text-white border-primarycolor shadow-md shadow-primarycolor/20"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-primarycolor/30 hover:text-primarycolor",
                                )}
                            >
                                {opt.label}
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-md leading-none",
                                    statusFilter === opt.value
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-100 text-slate-500",
                                )}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="h-20 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-6">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-40 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    No books match your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-xl h-10 w-10 p-0 border-2 border-primarycolor/5 hover:border-primarycolor/20"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-xl h-10 w-10 p-0 border-2 border-primarycolor/5 hover:border-primarycolor/20"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
