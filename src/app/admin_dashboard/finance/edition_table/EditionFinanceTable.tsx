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
    BookOpen,
    TrendingUp,
    Coins,
    Calculator,
    Package
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

export interface EditionFinanceData {
    id: number
    edition_name: string
    book_title: string
    selling_price: number
    total_cost: number
    profit_per_book: number
    total_print_count: number
    total_profit: number
    image: string | null
}

export const columns: ColumnDef<EditionFinanceData>[] = [
  {
    accessorKey: "edition_name",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Edition Profile
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
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[150px]">
                    {row.original.book_title}
                </div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "selling_price",
    header: "Market Price",
    cell: ({ row }) => (
        <div className="font-black text-primarycolor">
            {row.getValue<number>("selling_price").toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "total_cost",
    header: "Prod. Cost",
    cell: ({ row }) => (
        <div className="font-bold text-rose-500">
            {row.getValue<number>("total_cost").toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "profit_per_book",
    header: "Unit Profit",
    cell: ({ row }) => {
        const profit = row.getValue<number>("profit_per_book");
        return (
            <div className={`font-black ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600 italic'}`}>
                {profit.toLocaleString()} <span className="text-[8px] opacity-40 uppercase">ETB</span>
            </div>
        )
    },
  },
  {
    accessorKey: "total_print_count",
    header: "Inventory",
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <Package className="size-3 text-slate-400" />
            <span className="font-bold text-slate-600 text-xs">{row.getValue<number>("total_print_count").toLocaleString()}</span>
        </div>
    ),
  },
  {
    accessorKey: "total_profit",
    header: "Total Profit",
    cell: ({ row }) => {
        const profit = row.getValue<number>("total_profit");
        return (
            <div className={`px-4 py-2 rounded-xl text-center inline-block min-w-[100px] border-2 ${profit >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                <div className="text-[12px] font-black tracking-tighter">
                    {profit.toLocaleString()} <span className="text-[8px] uppercase">ETB</span>
                </div>
            </div>
        )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
        <Link href={`/admin_dashboard/books/editions/${row.original.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all">
                <ExternalLink className="size-4" />
            </Button>
        </Link>
    ),
  },
]

export default function EditionFinanceTable({ data }: { data: EditionFinanceData[] }) {
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
            pageSize: 8
        }
    }
  })

  const globalProfit = data.reduce((acc, curr) => acc + curr.total_profit, 0);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex items-center gap-4 p-6 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
            <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border-2 border-emerald-500/10">
                <TrendingUp className="size-7" />
            </div>
            <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Net Profit</p>
                <p className="text-2xl font-black text-primarycolor tracking-tight italic">{globalProfit.toLocaleString()} <span className="text-xs not-italic font-bold text-muted-foreground">ETB</span></p>
            </div>
        </div>
        
        <div className="md:col-span-2 flex items-center gap-6 px-10 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
            <Search className="size-5 text-slate-400 shrink-0" />
            <Input
                placeholder="Search editions or books..."
                value={(table.getColumn("edition_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("edition_name")?.setFilterValue(event.target.value)
                }
                className="h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
            />
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                <Calculator className="size-3" /> {data.length} Editions
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
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
