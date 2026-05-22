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
    BookOpen,
    DollarSign
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
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const statusStyles: any = {
    NOT_STARTED: "bg-slate-100 text-slate-600 border-slate-200",
    STARTED: "bg-blue-50 text-blue-600 border-blue-100",
    ONPROGRESS: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REPRINT: "bg-purple-50 text-purple-600 border-purple-100"
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "project_name",
        header: "Printing Project",
        cell: ({ row }) => {
            const itemsCount = row.original.printorder_items?.length || 0;
            const projectName = row.getValue("project_name") || `Project #${row.original.id}`;

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
                    <DollarSign className="size-3.5 text-emerald-500" />
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
                    {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}
                </span>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Link href={`/admin_dashboard/printing/manage/${row.original.id}`}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm group">
                    <ExternalLink className="size-4 group-hover:scale-110 transition-transform" />
                </Button>
            </Link>
        ),
    },
]

export default function PrintOrderTable({ data }: { data: any[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

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
            <div className="flex items-center gap-6 px-10 h-20 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
                <Search className="size-5 text-slate-400 shrink-0" />
                <Input
                    placeholder="Search projects..."
                    value={(table.getColumn("project_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("project_name")?.setFilterValue(event.target.value)
                    }
                    className="h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
                />
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10 text-[10px] font-black text-primarycolor uppercase tracking-widest shrink-0">
                    <Activity className="size-3" /> {data.length} Projects
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
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
