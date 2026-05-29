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
    ChevronDown, 
    MoreHorizontal, 
    Search,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Building2,
    TrendingUp
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

export interface ShopFinanceData {
    id: number
    name: string
    branch: string
    totalBooks: number
    totalPaid: number
    totalDebt: number
    totalValue: number
    collectionRate: number
}

export const columns: ColumnDef<ShopFinanceData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Shop Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor">
                <Building2 className="size-4" />
            </div>
            <div>
                <div className="font-black text-primarycolor uppercase text-xs">{row.getValue("name")}</div>
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{row.original.branch}</div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "totalBooks",
    header: "Total Books",
    cell: ({ row }) => (
        <div className="font-bold text-slate-600">
            {row.getValue<number>("totalBooks").toLocaleString()} <span className="text-[8px] opacity-50 uppercase">Units</span>
        </div>
    ),
  },
  {
    accessorKey: "totalValue",
    header: "Gross Value",
    cell: ({ row }) => (
        <div className="font-bold text-slate-900">
            {row.getValue<number>("totalValue").toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "totalPaid",
    header: "Paid",
    cell: ({ row }) => (
        <div className="font-black text-emerald-600">
            {row.getValue<number>("totalPaid").toLocaleString()} <span className="text-[8px] opacity-50">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "totalDebt",
    header: "Debt",
    cell: ({ row }) => (
        <div className="font-black text-rose-600">
            {row.getValue<number>("totalDebt").toLocaleString()} <span className="text-[8px] opacity-50">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "collectionRate",
    header: "Health",
    cell: ({ row }) => {
        const rate = row.getValue<number>("collectionRate");
        return (
            <div className="flex items-center gap-3">
                <div className="flex-grow w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                        className={`h-full transition-all duration-1000 ${rate > 70 ? 'bg-emerald-500' : rate > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${rate}%` }}
                    />
                </div>
                <span className="text-[10px] font-black text-primarycolor">{Math.round(rate)}%</span>
            </div>
        )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const shop = row.original
 
      return (
        <Link href={`/admin_dashboard/book_shops/${shop.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all">
                <ExternalLink className="size-4" />
            </Button>
        </Link>
      )
    },
  },
]

export default function ShopFinanceTable({ data }: { data: ShopFinanceData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
        pagination: {
            pageSize: 8
        }
    }
  })

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
            <Input
                placeholder="Filter shops..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
            />
        </div>
        
        <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-white border-2 border-primarycolor/5 shadow-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <TrendingUp className="size-4 text-emerald-500" />
            Total: {data.length} Partners
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-20 border-b border-slate-50 hover:bg-slate-50/50 transition-colors px-6"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  No shops found matching your criteria.
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
            const rate = item.collectionRate
            return (
              <div key={item.id} className="bg-white rounded-2xl border-2 border-primarycolor/5 p-5 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center shrink-0">
                      <Building2 className="size-5 text-primarycolor" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-primarycolor uppercase text-sm truncate">{item.name}</div>
                      <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{item.branch}</div>
                    </div>
                  </div>
                  <Link href={`/admin_dashboard/book_shops/${item.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shrink-0">
                      <ExternalLink className="size-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Books</p>
                    <p className="font-bold text-slate-600">{item.totalBooks.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Gross Value</p>
                    <p className="font-bold text-slate-900">{item.totalValue.toLocaleString()} <span className="text-[7px] opacity-40">ETB</span></p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600/60">Paid</p>
                    <p className="font-black text-emerald-600">{item.totalPaid.toLocaleString()} <span className="text-[7px] opacity-50">ETB</span></p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-3 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-rose-600/60">Debt</p>
                    <p className="font-black text-rose-600">{item.totalDebt.toLocaleString()} <span className="text-[7px] opacity-50">ETB</span></p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Collection Health</span>
                    <span className={`text-[10px] font-black ${rate > 70 ? 'text-emerald-600' : rate > 30 ? 'text-amber-600' : 'text-rose-600'}`}>{Math.round(rate)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-1000 ${rate > 70 ? 'bg-emerald-500' : rate > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-16 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            No shops found matching your criteria.
          </div>
        )}
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
