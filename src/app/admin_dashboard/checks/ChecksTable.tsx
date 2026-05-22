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
  ArrowUpDown,
  Banknote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CLEARED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  BOUNCED: "bg-rose-100 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
}

export default function ChecksTable({ data }: { data: any[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor/40 text-xs">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-black"
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-bold text-primarycolor">{row.original.username || "—"}</span>
      ),
    },
    {
      accessorKey: "bankname",
      header: "Bank",
      cell: ({ row }) => (
        <span className="font-bold text-primarycolor">{row.original.bankname || "—"}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            type === "COLLATERAL"
              ? "bg-blue-100 text-blue-700 border-blue-200"
              : "bg-purple-100 text-purple-700 border-purple-200"
          )}>
            {type || "—"}
          </span>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor">{row.original.amount || "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "PENDING"
        return (
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            statusStyles[status] || "bg-slate-100 text-slate-600"
          )}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: "recordeddate",
      header: "Recorded Date",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-muted-foreground">
          {row.original.recordeddate
            ? new Date(row.original.recordeddate).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link href={`/admin_dashboard/checks/${row.original.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm">
            <ExternalLink className="size-4" />
          </Button>
        </Link>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  return (
    <div className="w-full space-y-6">
      {/* Top bar: search + status filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 px-6 h-auto sm:h-20 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
        <div className="flex items-center gap-4 flex-1">
          <Search className="size-5 text-slate-400 shrink-0" />
          <Input
            placeholder="Search by username, bank, or memo..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-12 sm:h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-10 w-36 rounded-xl border-2 border-slate-100 font-bold text-[10px] uppercase tracking-widest">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl p-2 border-2">
              <SelectItem value="all" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">All Status</SelectItem>
              <SelectItem value="PENDING" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">Pending</SelectItem>
              <SelectItem value="CLEARED" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">Cleared</SelectItem>
              <SelectItem value="BOUNCED" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">Bounced</SelectItem>
              <SelectItem value="CANCELLED" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="px-4 py-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10 text-[10px] font-black text-primarycolor uppercase tracking-widest shrink-0">
            {data.length} Total
          </div>
        </div>
      </div>

      {/* Table */}
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
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <Banknote className="size-12" />
                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                      No checks found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
