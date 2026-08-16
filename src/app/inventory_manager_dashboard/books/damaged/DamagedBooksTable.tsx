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
    ArrowUpDown,
    Search,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    AlertCircle,
    Store,
    BookOpen,
    Layers,
    Calendar,
    Hash
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
import { usePathname } from "next/navigation"

export default function DamagedBooksTable({ data }: { data: any[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const { formatDate } = useCalendar()
    const pathname = usePathname()
    const dashboardRoot = pathname.split('/').slice(0, 2).join('/')

    const columns = React.useMemo<ColumnDef<any>[]>(() => [
        {
            id: "book_title",
            accessorKey: "books.title",
            header: "Book & Edition",
            filterFn: (row, columnId, filterValue) => {
                const search = filterValue.toLowerCase();
                return (
                    (row.original.books?.title || "").toLowerCase().includes(search) ||
                    (row.original.bookedition?.edition_name || "").toLowerCase().includes(search)
                );
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm">
                        <BookOpen className="size-6" />
                    </div>
                    <div>
                        <div className="font-black text-primarycolor uppercase text-xs tracking-tight">
                            {row.original.books?.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Layers className="size-3 text-muted-foreground" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                {row.original.bookedition?.edition_name}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: "Damage Context",
            cell: ({ row }) => (
                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 inline-block">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {row.getValue("type")}
                    </span>
                </div>
            ),
        },
        {
            id: "store_name",
            accessorKey: "stores.name",
            header: "Location",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Store className="size-3.5 text-primarycolor/40" />
                    <span className="font-bold text-primarycolor text-xs">
                        {row.original.stores?.name || "Direct / Production"}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "count",
            header: "Quantity",
            cell: ({ row }) => (
                <div className="font-black text-rose-600 text-sm">
                    {row.getValue<number>("count")} Units
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Reported On",
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
                <Link href={`${dashboardRoot}/books/damaged/${row.original.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <ExternalLink className="size-4" />
                    </Button>
                </Link>
            ),
        },
    ], [dashboardRoot]);

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
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 px-6 md:px-10 py-4 md:h-20 bg-white rounded-[1.5rem] md:rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
                <div className="flex items-center gap-4 flex-1">
                    <Search className="size-5 text-slate-400 shrink-0" />
                    <Input
                        placeholder="Search by book or edition..."
                        value={(table.getColumn("book_title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("book_title")?.setFilterValue(event.target.value)
                        }
                        className="h-10 md:h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0 flex-1"
                    />
                </div>
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-100 text-[10px] font-black text-rose-500 uppercase tracking-widest shrink-0">
                    <AlertCircle className="size-3" /> {data.length} Reports
                </div>
            </div>

            {/* Desktop Table View */}
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
                                    No damage reports found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <div key={row.id} className="bg-white p-6 rounded-[1.5rem] border-2 border-primarycolor/5 shadow-lg space-y-4 relative group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shrink-0">
                                        <BookOpen className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-primarycolor uppercase text-[10px] leading-tight">
                                            {row.original.books?.title}
                                        </h4>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                            {row.original.bookedition?.edition_name}
                                        </p>
                                    </div>
                                </div>
                                <Link href={`${dashboardRoot}/books/damaged/${row.original.id}`}>
                                    <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 text-slate-400">
                                        <ExternalLink className="size-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Location</p>
                                    <div className="flex items-center gap-1.5 font-bold text-primarycolor text-[9px]">
                                        <Store className="size-3 text-primarycolor/40" />
                                        {row.original.stores?.name || "Direct"}
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Quantity</p>
                                    <p className="font-black text-rose-600 text-xs">
                                        {row.original.count} Units
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    {row.original.type}
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="size-3" />
                                    <span className="font-bold text-[8px]">
                                        {formatDate(new Date(row.original.createdAt), "MMM dd")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-10 rounded-[1.5rem] border-2 border-primarycolor/5 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No records found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest order-2 sm:order-1">
                    Showing {table.getRowModel().rows.length} records
                </div>
                <div className="flex items-center space-x-2 order-1 sm:order-2">
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


