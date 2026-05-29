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
    BookOpen,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    DollarSign,
    Calculator
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

export interface EditionRevenueData {
    id: number
    edition_name: string
    book_title: string
    selling_price: number
    totalCost: number
    totalRevenue: number
    totalPending: number
    collected: number
    profit: number
    image: string | null
}

export const columns: ColumnDef<EditionRevenueData>[] = [
  {
    accessorKey: "edition_name",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Edition
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    filterFn: (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase();
        return (
            row.original.edition_name.toLowerCase().includes(search) ||
            row.original.book_title.toLowerCase().includes(search)
        );
    },
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor overflow-hidden border border-primarycolor/10 shadow-sm">
                {row.original.image ? (
                    <img src={row.original.image} alt="" className="w-full h-full object-cover" />
                ) : (
                    <BookOpen className="size-5 opacity-40" />
                )}
            </div>
            <div>
                <div className="font-black text-primarycolor uppercase text-xs tracking-tight">{row.getValue("edition_name")}</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[160px]">
                    {row.original.book_title}
                </div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "selling_price",
    header: "Unit Price",
    cell: ({ row }) => (
        <div className="font-black text-primarycolor">
            {row.getValue<number>("selling_price").toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Total Cost
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => (
        <div className="font-bold text-rose-500">
            {row.getValue<number>("totalCost").toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Revenue
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => (
        <div className="font-black text-emerald-600">
            {row.getValue<number>("totalRevenue").toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "collected",
    header: "Collected",
    cell: ({ row }) => (
        <div className="font-bold text-primarycolor">
            {row.original.collected.toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "totalPending",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Pending
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
        const pending = row.getValue<number>("totalPending");
        return (
            <div className={`flex items-center gap-1.5 font-bold ${pending > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                <AlertTriangle className={`size-3 ${pending > 0 ? 'opacity-70' : 'opacity-30'}`} />
                {pending.toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
            </div>
        )
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Profit
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
        const profit = row.getValue<number>("profit");
        return (
            <div className={`px-4 py-2 rounded-xl text-center inline-block min-w-[100px] border-2 ${
                profit >= 0
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
                <div className="flex items-center justify-center gap-1">
                    {profit >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    <span className="text-[11px] font-black tracking-tighter">{profit.toLocaleString()}</span>
                </div>
                <div className="text-[7px] uppercase font-bold opacity-60">ETB</div>
            </div>
        )
    },
  },
]

export default function EditionRevenueTable({ data }: { data: EditionRevenueData[] }) {
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
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 8 } }
  })

  const globalRevenue = data.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const globalCost = data.reduce((acc, curr) => acc + curr.totalCost, 0);
  const globalPending = data.reduce((acc, curr) => acc + curr.totalPending, 0);
  const globalProfit = data.reduce((acc, curr) => acc + curr.profit, 0);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black text-primarycolor uppercase tracking-tight italic">
          Edition <span className="text-secondarycolor not-italic">Breakdown</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primarycolor/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
            <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border-2 border-emerald-500/10 shrink-0">
                <DollarSign className="size-6" />
            </div>
            <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Revenue</p>
                <p className="text-xl font-black text-primarycolor tracking-tight">{globalRevenue.toLocaleString()} <span className="text-[9px] font-bold text-muted-foreground">ETB</span></p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
            <div className="size-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 border-2 border-rose-500/10 shrink-0">
                <TrendingDown className="size-6" />
            </div>
            <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Cost</p>
                <p className="text-xl font-black text-primarycolor tracking-tight">{globalCost.toLocaleString()} <span className="text-[9px] font-bold text-muted-foreground">ETB</span></p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
            <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 border-2 border-amber-500/10 shrink-0">
                <AlertTriangle className="size-6" />
            </div>
            <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Pending</p>
                <p className="text-xl font-black text-primarycolor tracking-tight">{globalPending.toLocaleString()} <span className="text-[9px] font-bold text-muted-foreground">ETB</span></p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
            <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border-2 border-emerald-500/10 shrink-0">
                <TrendingUp className="size-6" />
            </div>
            <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Net Profit</p>
                <p className={`text-xl font-black tracking-tight ${globalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {globalProfit.toLocaleString()} <span className="text-[9px] font-bold text-muted-foreground">ETB</span>
                </p>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
            <Input
                placeholder="Search editions or books..."
                value={(table.getColumn("edition_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("edition_name")?.setFilterValue(event.target.value)
                }
                className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
            />
        </div>
        <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-white border-2 border-primarycolor/5 shadow-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Calculator className="size-4 text-primarycolor" />
            {data.length} Editions
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-14 px-5 text-[10px] font-black uppercase tracking-widest text-primarycolor/40">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-20 border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5">
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
                  No editions found matching your search.
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
