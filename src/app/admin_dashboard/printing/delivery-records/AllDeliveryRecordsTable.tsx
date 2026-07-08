"use client"

import { useState, useMemo } from "react"
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react"
import { useCalendar } from "@/lib/calendar-context"

interface RecordEntry {
    id: number
    bookTitle: string
    editionName: string
    quantity: number | null
    approvedByPrinter: boolean
    storeName: string | null
    printerName: string
    createdAt: string
    approvedByPrinterAt: string | null
}

export default function AllDeliveryRecordsTable({
    records,
}: {
    records: RecordEntry[]
}) {
    const { formatDateTime } = useCalendar()
    const [sorting, setSorting] = useState<SortingState>([])

    const columns = useMemo<ColumnDef<RecordEntry>[]>(
        () => [
            {
                id: "book",
                header: "Book",
                accessorKey: "bookTitle",
                cell: ({ row }) => (
                    <span className="font-semibold text-sm text-slate-800">
                        {row.original.bookTitle}
                    </span>
                ),
            },
            {
                id: "edition",
                header: "Edition",
                accessorKey: "editionName",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.editionName}
                    </span>
                ),
            },
            {
                id: "qty",
                header: "Qty",
                accessorKey: "quantity",
                cell: ({ row }) => (
                    <span className="text-right font-bold text-sm text-slate-800 block">
                        {row.original.quantity ?? (
                            <span className="text-slate-300">—</span>
                        )}
                    </span>
                ),
            },
            {
                id: "status",
                header: "Status",
                accessorKey: "approvedByPrinter",
                cell: ({ row }) => (
                    <span
                        className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            row.original.approvedByPrinter
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                        )}
                    >
                        {row.original.approvedByPrinter
                            ? "Approved"
                            : "Pending"}
                    </span>
                ),
            },
            {
                id: "store",
                header: "Store",
                accessorKey: "storeName",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.storeName ?? (
                            <span className="text-slate-300 italic">—</span>
                        )}
                    </span>
                ),
            },
            {
                id: "printer",
                header: "Printer",
                accessorKey: "printerName",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.printerName}
                    </span>
                ),
            },
            {
                id: "created",
                header: "Created",
                accessorKey: "createdAt",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {formatDateTime(new Date(row.original.createdAt))}
                    </span>
                ),
            },
            {
                id: "approvedAt",
                header: "Approved At",
                accessorKey: "approvedByPrinterAt",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.approvedByPrinterAt ? (
                            formatDateTime(
                                new Date(row.original.approvedByPrinterAt)
                            )
                        ) : (
                            <span className="text-slate-300 italic">—</span>
                        )}
                    </span>
                ),
            },
        ],
        [formatDateTime]
    )

    const table = useReactTable({
        data: records,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    })

    if (records.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <PackageSearch className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-bold text-xs uppercase tracking-widest">
                    No delivery records yet
                </p>
            </div>
        )
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow
                            key={hg.id}
                            className="border-b-2 border-slate-200 bg-slate-50"
                        >
                            {hg.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={cn(
                                        "font-black text-[10px] uppercase tracking-widest text-slate-500 h-10",
                                        header.id === "qty" && "text-right"
                                    )}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {table.getRowModel().rows.length} of {records.length}{" "}
                    records
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 w-8 p-0 rounded-lg border-2 border-slate-200"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-bold text-slate-600 min-w-[40px] text-center">
                        {table.getState().pagination.pageIndex + 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 w-8 p-0 rounded-lg border-2 border-slate-200"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
