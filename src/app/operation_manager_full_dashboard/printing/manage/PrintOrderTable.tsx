"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
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
    Layers,
    Calendar,
    Activity,
    BookOpen
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

const statusStyles: any = {
    NOT_STARTED: "bg-slate-100 text-slate-600 border-slate-200",
    STARTED: "bg-blue-50 text-blue-600 border-blue-100",
    ONPROGRESS: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REPRINT: "bg-purple-50 text-purple-600 border-purple-100"
}

function createColumns(formatDate: (date: Date, pattern?: string) => string): ColumnDef<any>[] { return [
    {
        accessorKey: "project_name",
        header: "Printing Project",
        cell: ({ row }) => {
            const itemsCount = row.original.printorder_items?.length || 0;
            const projectName = row.getValue("project_name") || `Project #${row.original.id}`;
            const items = row.original.printorder_items || [];
            const editionPrinters = new Set<string>();
            items.forEach((item: any) => {
                (item.bookedition?.bookeditionprinters || []).forEach((bp: any) => {
                    if (bp.printer?.name) editionPrinters.add(bp.printer.name);
                });
            });
            const hasExtraPrinters = editionPrinters.size > 0 &&
                !(editionPrinters.size === 1 && editionPrinters.has(row.original.printer?.name));

            return (
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border border-primarycolor/10 shadow-sm">
                        <Layers className="size-6" />
                    </div>
                    <div>
                        <div className="font-black text-primarycolor text-sm tracking-tight">
                            {row.original.project_name}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                            <div className="flex items-center gap-1.5">
                                <Printer className="size-3 text-muted-foreground" />
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {row.original.printer?.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                                <BookOpen className="size-3 text-muted-foreground" />
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {itemsCount} Books
                                </span>
                            </div>
                            {hasExtraPrinters && (
                                <div className="flex items-center gap-1.5 border-l border-amber-200 pl-3">
                                    <Printer className="size-3 text-amber-500" />
                                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">
                                        {editionPrinters.size} edition printer{editionPrinters.size > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Project Status",
        cell: ({ row }) => {
            const status = row.getValue<string>("status") || "NOT_STARTED"
            return (
                <div className={cn("px-3 py-1 rounded-full border inline-block", statusStyles[status] || statusStyles.NOT_STARTED)}>
                    <span className="text-[9px] font-black uppercase tracking-widest">
                        {status.replace("_", " ")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "total_quantity",
        header: "Total Units",
        cell: ({ row }) => {
            const items = row.original.printorder_items || [];
            const totalUnits = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

            return (
                <div className="flex items-center gap-2">
                    <Hash className="size-3.5 text-primarycolor/40" />
                    <span className="font-black text-primarycolor text-sm">
                        {totalUnits.toLocaleString()}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "total_price",
        header: "Total Cost",
        cell: ({ row }) => {
            const price = row.getValue<number>("total_price") || 0;
            return (
                <div className="flex items-center gap-1.5">
                    <span className="font-black text-[10px] text-emerald-500 uppercase tracking-widest">ETB</span>
                    <span className="font-black text-emerald-600 text-sm">
                        {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Launch Date",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span className="font-bold text-[10px]">
                    {formatDate(new Date(row.getValue("createdAt")))}
                </span>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Link href={`/operation_manager_full_dashboard/printing/manage/${row.original.id}`}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm group">
                    <ExternalLink className="size-4 group-hover:scale-110 transition-transform" />
                </Button>
            </Link>
        ),
    },
] }

export default function PrintOrderTable({ data }: { data: any[] }) {
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const columns = React.useMemo(() => createColumns(formatDate), [formatDate])
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        }
    })

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 px-6 h-auto sm:h-20 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
                <div className="flex items-center gap-4 flex-1">
                    <Search className="size-5 text-slate-400 shrink-0" />
                    <Input
                        placeholder="Search projects..."
                        value={(table.getColumn("project_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("project_name")?.setFilterValue(event.target.value)
                        }
                        className="h-12 sm:h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10 text-[10px] font-black text-primarycolor uppercase tracking-widest shrink-0 justify-center">
                    <Activity className="size-3" /> {data.length} Projects
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    No print projects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                        const item = row.original
                        const items = item.printorder_items || []
                        const totalUnits = items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)
                        const status = item.status || "NOT_STARTED"
                        const price = item.total_price || 0
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border-2 border-primarycolor/5 p-5 space-y-4 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border border-primarycolor/10 shrink-0">
                                        <Layers className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-black text-primarycolor text-sm leading-tight truncate">
                                            {item.project_name || `Project #${item.id}`}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1.5">
                                                <Printer className="size-2.5 text-muted-foreground" />
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                                                    {item.printer?.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="size-2.5 text-muted-foreground" />
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {items.length} Books
                                                </span>
                                            </div>
                                            {(() => {
                                                const edPrinters = new Set<string>();
                                                (items || []).forEach((i: any) => {
                                                    (i.bookedition?.bookeditionprinters || []).forEach((bp: any) => {
                                                        if (bp.printer?.name) edPrinters.add(bp.printer.name);
                                                    });
                                                });
                                                const hasExtra = edPrinters.size > 0 &&
                                                    !(edPrinters.size === 1 && edPrinters.has(item.printer?.name));
                                                return hasExtra ? (
                                                    <div className="flex items-center gap-1 border-l border-amber-200 pl-2">
                                                        <Printer className="size-2.5 text-amber-500" />
                                                        <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest whitespace-nowrap">
                                                            +{edPrinters.size}
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    </div>
                                    <div className={cn("px-2.5 py-0.5 rounded-full border shrink-0 self-start", statusStyles[status] || statusStyles.NOT_STARTED)}>
                                        <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                                            {status.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Hash className="size-3 text-primarycolor/40" />
                                            <span className="font-black text-primarycolor text-xs">{totalUnits.toLocaleString()} units</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-black text-[9px] text-emerald-500 uppercase tracking-widest">ETB</span>
                                            <span className="font-black text-emerald-600 text-xs">
                                                {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                    <Link href={`/operation_manager_full_dashboard/printing/manage/${item.id}`}>
                                        <Button
                                            variant="outline"
                                            className="h-9 px-4 rounded-xl border-primarycolor/20 font-black uppercase tracking-widest text-[10px]"
                                        >
                                            Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="py-16 text-center space-y-4 opacity-30">
                        <Layers className="size-12 mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest">No print projects found</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between px-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Showing {table.getRowModel().rows.length} of {data.length} projects
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
    )
}
