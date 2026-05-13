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
    AlertCircle,
    CheckCircle2,
    Clock,
    RotateCcw
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

const trackingStyles: any = {
    NOT_SET: "text-slate-400",
    SHORTAGE_DETECTED: "text-rose-500",
    NOT_READY: "text-amber-500",
    PRINTING: "text-blue-500",
    DISTRIBUTION: "text-emerald-500",
    SALES: "text-primarycolor"
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "edition",
    header: "Project / Edition",
    cell: ({ row }) => (
        <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border border-primarycolor/10 shadow-sm">
                <Layers className="size-6" />
            </div>
            <div>
                <div className="font-black text-primarycolor uppercase text-xs tracking-tight">
                    {row.getValue("edition") || "Unknown Edition"}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Printer className="size-3 text-muted-foreground" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        {row.original.printer?.name}
                    </span>
                </div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Batch Status",
    cell: ({ row }) => {
        const status = row.getValue<string>("status")
        return (
            <div className={cn("px-3 py-1 rounded-full border inline-block", statusStyles[status])}>
                <span className="text-[9px] font-black uppercase tracking-widest">
                    {status.replace("_", " ")}
                </span>
            </div>
        )
    },
  },
  {
    accessorKey: "count",
    header: "Quantity",
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <Hash className="size-3.5 text-primarycolor/40" />
            <span className="font-black text-primarycolor text-sm">
                {row.getValue<number>("count").toLocaleString()} Units
            </span>
        </div>
    ),
  },
  {
    accessorKey: "quality",
    header: "Quality Tier",
    cell: ({ row }) => (
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
            {row.getValue("quality")}
        </div>
    ),
  },
  {
    accessorKey: "tracking",
    header: "Tracking",
    cell: ({ row }) => {
        const tracking = row.getValue<string>("tracking")
        return (
            <div className={cn("flex items-center gap-2 font-black text-[10px] uppercase tracking-widest", trackingStyles[tracking])}>
                <div className="size-2 rounded-full bg-current shadow-[0_0_8px_rgba(0,0,0,0.1)]" />
                {tracking.replace("_", " ")}
            </div>
        )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
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
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <ExternalLink className="size-4" />
            </Button>
        </Link>
    ),
  },
]

export default function PrintOrderTable({ data }: { data: any[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

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
                placeholder="Search orders by edition or printer..."
                value={(table.getColumn("edition")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("edition")?.setFilterValue(event.target.value)
                }
                className="h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
            />
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10 text-[10px] font-black text-primarycolor uppercase tracking-widest shrink-0">
                <Activity className="size-3" /> {data.length} Active Orders
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
                                No print orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        <div className="flex items-center justify-between px-4">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Showing {table.getRowModel().rows.length} of {data.length} orders
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
