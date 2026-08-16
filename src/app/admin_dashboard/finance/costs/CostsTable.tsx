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
    User,
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

export interface BookCostData {
    id: number
    title: string
    author: string
    totalCost: number
    editionCount: number
}

export const columns: ColumnDef<BookCostData>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
      >
        Book Title
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor">
                <BookOpen className="size-4" />
            </div>
            <span className="font-black text-primarycolor uppercase text-xs">{row.getValue("title")}</span>
        </div>
    ),
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
      >
        Author
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <User className="size-3 text-muted-foreground/50" />
            <span className="font-bold text-slate-600 text-xs">{row.getValue("author")}</span>
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
        <div className="font-black text-primarycolor">
            {row.getValue<number>("totalCost").toLocaleString()} <span className="text-[8px] opacity-40">ETB</span>
        </div>
    ),
  },
  {
    accessorKey: "editionCount",
    header: "Editions",
    cell: ({ row }) => (
        <div className="font-bold text-slate-500">
            {row.getValue<number>("editionCount")} <span className="text-[8px] opacity-50 uppercase">eds</span>
        </div>
    ),
  },
]

export default function CostsTable({ data }: { data: BookCostData[] }) {
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
            pageSize: 15
        }
    }
  })

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
            <Input
                placeholder="Search by title or author..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
            />
        </div>

        <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-white border-2 border-primarycolor/5 shadow-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <TrendingUp className="size-4 text-emerald-500" />
            Total: {data.length} Books
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
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
