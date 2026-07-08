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
import type { BookPrintRow } from "./page"

export const columns: ColumnDef<BookPrintRow>[] = [
  {
    id: "bookEdition",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
      >
        Book & Edition
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    accessorFn: (row) => `${row.bookTitle} ${row.editionName}`,
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                <BookOpen className="size-4" />
            </div>
            <div>
                <p className="font-black text-primarycolor uppercase text-xs leading-tight">{row.original.bookTitle}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{row.original.editionName}</p>
            </div>
        </div>
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
        Printer
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
        <span className="font-bold text-primarycolor text-xs">{row.getValue("printerName")}</span>
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
        Copies
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
        <div className="font-bold text-slate-700">{row.getValue<number>("quantity").toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "itemCost",
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
        <div className="font-black text-primarycolor">
            {row.getValue<number>("itemCost").toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
      >
        Paid
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
        <div className="font-bold text-emerald-600">
            {row.getValue<number>("paid").toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
      >
        Remaining
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
        const val = row.getValue<number>("remaining");
        return (
            <span className={`font-black ${val > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                {val.toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
            </span>
        );
    },
  },
]

export default function BooksInPrintersTable({ data }: { data: BookPrintRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
        pagination: {
            pageSize: 10
        }
    }
  })

  const grandTotalCost = data.reduce((s, r) => s + r.itemCost, 0);
  const grandTotalPaid = data.reduce((s, r) => s + r.paid, 0);
  const grandTotalRemaining = data.reduce((s, r) => s + r.remaining, 0);

  return (
    <div className="w-full space-y-6 bg-white rounded-[3rem] p-8 md:p-10 border-2 border-primarycolor/5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <BookOpen className="size-5 text-secondarycolor" />
          <h2 className="text-sm font-black uppercase tracking-widest text-primarycolor">Books in Printers</h2>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 px-6 py-2 rounded-2xl bg-white border-2 border-primarycolor/5 shadow-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <TrendingUp className="size-4 text-emerald-500" />
          {data.length} Entries
        </div>
      </div>

      <div className="relative w-full max-w-sm group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
        <Input
          placeholder="Search by book, edition or printer..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
        />
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
                  No books found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
            <span>Total Cost: <span className="text-primarycolor">{grandTotalCost.toLocaleString()}</span></span>
            <span>Paid: <span className="text-emerald-600">{grandTotalPaid.toLocaleString()}</span></span>
            <span>Remaining: <span className="text-rose-500">{grandTotalRemaining.toLocaleString()}</span></span>
          </div>
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
