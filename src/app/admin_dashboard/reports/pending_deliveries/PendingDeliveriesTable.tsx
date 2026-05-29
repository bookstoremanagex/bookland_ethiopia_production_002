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
    Store,
    BookOpen,
    AlertCircle,
    Calendar,
    Banknote,
    Receipt,
    Clock,
    TrendingDown
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

const useColumns = (formatDate: (date: Date) => string): ColumnDef<any>[] => [
  {
    accessorKey: "bookshopes.name",
    header: "Destination Store",
    cell: ({ row }) => (
        <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                <Store className="size-6" />
            </div>
            <div>
                <div className="font-black text-primarycolor uppercase text-xs tracking-tight">
                    {row.original.bookshopes?.name}
                </div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    {row.original.bookshopes?.location}
                </div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "bookedition.books.title",
    header: "Edition Details",
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <BookOpen className="size-4 text-rose-500" />
            <div>
                <div className="font-bold text-primarycolor text-xs uppercase">
                    {row.original.bookedition?.books?.title}
                </div>
                <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    {row.original.bookedition?.edition_name}
                </div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "remaining_amount",
    header: "Outstanding Debt",
    cell: ({ row }) => (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <Banknote className="size-3.5 text-rose-600" />
                <span className="font-black text-rose-700 text-sm">
                    {row.original.remaining_amount?.toLocaleString()} ETB
                </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
                <Clock className="size-3 text-rose-400" />
                <span className="text-[9px] font-black text-rose-600/60 uppercase tracking-widest">Payment Pending</span>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "already_paid",
    header: "Paid Amount",
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <TrendingDown className="size-3.5 text-emerald-600" />
            <span className="font-bold text-emerald-700 text-xs">
                {row.original.already_paid?.toLocaleString()} ETB
            </span>
        </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-3.5" />
            <span className="font-bold text-[10px]">
                {formatDate(new Date(row.getValue("updatedAt")))}
            </span>
        </div>
    ),
  },
    {
    id: "actions",
    cell: ({ row }) => (
        <Link href={`/admin_dashboard/reports/pending_deliveries/${row.original.id}`}>
            <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-primarycolor/5 hover:bg-primarycolor hover:text-white transition-all">
                Details
            </Button>
        </Link>
    ),
  },
]

export default function PendingDeliveriesTable({ data }: { data: any[] }) {
  const { formatDate } = useCalendar()
  const columns = React.useMemo(() => useColumns(formatDate), [formatDate])
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
      globalFilter: "",
    },
    onGlobalFilterChange: (value) => table.setGlobalFilter(value),
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
                placeholder="Search by store or book title..."
                value={table.getState().globalFilter ?? ""}
                onChange={(event) =>
                    table.setGlobalFilter(event.target.value)
                }
                className="h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
            />
            <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-100 text-[10px] font-black text-rose-600 uppercase tracking-widest shrink-0">
                {data.length} Pending
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
                                No pending deliveries found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        <div className="flex items-center justify-between px-4">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Showing {table.getRowModel().rows.length} of {data.length} records
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
