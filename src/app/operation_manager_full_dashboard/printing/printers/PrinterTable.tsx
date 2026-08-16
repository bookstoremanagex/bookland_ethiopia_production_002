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
    MapPin,
    Phone,
    Mail,
    Printer,
    ClipboardList,
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

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Printer Name",
    cell: ({ row }) => (
        <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border border-primarycolor/10 shadow-sm">
                <Printer className="size-6" />
            </div>
            <div>
                <div className="font-black text-primarycolor uppercase text-xs tracking-tight">
                    {row.getValue("name")}
                </div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    Partner ID: #{row.original.id}
                </div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <MapPin className="size-3.5 text-primarycolor/40" />
            <span className="font-bold text-primarycolor text-xs">
                {row.getValue("location")}
            </span>
        </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact Info",
    cell: ({ row }) => (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <Phone className="size-3 text-muted-foreground" />
                <span className="text-[10px] font-bold text-primarycolor">{row.original.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
                <Mail className="size-3 text-muted-foreground" />
                <span className="text-[10px] font-bold text-primarycolor">{row.original.email || "N/A"}</span>
            </div>
        </div>
    ),
  },
  {
    id: "orders",
    header: "Orders",
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <ClipboardList className="size-3.5 text-rose-500" />
            <span className="font-black text-rose-600 text-sm">
                {row.original.printorder?.length || 0}
            </span>
        </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
        <Link href={`/operation_manager_full_dashboard/printing/printers/${row.original.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm">
                <ExternalLink className="size-4" />
            </Button>
        </Link>
    ),
  },
]

export default function PrinterTable({ data }: { data: any[] }) {
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 px-6 h-auto sm:h-20 bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-xl">
            <div className="flex items-center gap-4 flex-1">
                <Search className="size-5 text-slate-400 shrink-0" />
                <Input
                    placeholder="Search printers by name or location..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-12 sm:h-full border-none focus-visible:ring-0 bg-transparent font-bold text-primarycolor placeholder:text-slate-300 px-0"
                />
            </div>
            <div className="px-4 py-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10 text-[10px] font-black text-primarycolor uppercase tracking-widest shrink-0 text-center">
                {data.length} Partners
            </div>
        </div>

        {/* Desktop Table */}
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
                                No printers registered.
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
                    return (
                        <Link
                            key={item.id}
                            href={`/operation_manager_full_dashboard/printing/printers/${item.id}`}
                            className="block bg-white rounded-2xl border-2 border-primarycolor/5 p-5 hover:shadow-xl hover:border-primarycolor/10 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border border-primarycolor/10 shrink-0">
                                        <Printer className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-black text-primarycolor text-sm leading-tight truncate">{item.name}</div>
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Partner ID: #{item.id}</div>
                                    </div>
                                </div>
                                <ChevronRight className="size-5 text-primarycolor/30 shrink-0 mt-1" />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                                {item.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-3.5 text-primarycolor/40 shrink-0" />
                                        <span className="font-bold text-primarycolor text-xs truncate">{item.location}</span>
                                    </div>
                                )}
                                {item.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-3.5 text-primarycolor/40 shrink-0" />
                                        <span className="font-bold text-primarycolor text-xs truncate">{item.phone}</span>
                                    </div>
                                )}
                                {item.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-3.5 text-primarycolor/40 shrink-0" />
                                        <span className="font-bold text-primarycolor text-xs truncate">{item.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="size-3.5 text-rose-500 shrink-0" />
                                    <span className="font-black text-rose-600 text-xs">{item.printorder?.length || 0} orders</span>
                                </div>
                            </div>
                        </Link>
                    )
                })
            ) : (
                <div className="py-16 text-center space-y-4 opacity-30">
                    <Printer className="size-12 mx-auto" />
                    <p className="text-sm font-black uppercase tracking-widest">No printers registered</p>
                </div>
            )}
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
