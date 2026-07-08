"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
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
    BookOpen,
    Printer,
    PrinterCheck,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface ItemRow {
    id: number
    orderId: number
    projectName: string
    printerName: string
    bookTitle: string
    author: string
    editionName: string
    quantity: number
    status: string
    remaining: number | null
}

const statusStyles: Record<string, string> = {
    NOT_STARTED: "bg-slate-100 text-slate-600 border-slate-200",
    STARTED: "bg-blue-50 text-blue-600 border-blue-100",
    ONPROGRESS: "bg-amber-50 text-amber-600 border-amber-100",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REPRINT: "bg-purple-50 text-purple-600 border-purple-100",
};

const statusLabels: Record<string, string> = {
    NOT_STARTED: "Not Started",
    STARTED: "Started",
    ONPROGRESS: "In Progress",
    FAILED: "Failed",
    COMPLETED: "Completed",
    REPRINT: "Reprinting",
};

const filterOptions = [
    { value: "", label: "All Statuses" },
    { value: "NOT_STARTED", label: "Not Started" },
    { value: "IN_PROGRESS", label: "Started / In Progress" },
    { value: "COMPLETED", label: "Completed" },
];

function getFilterLabel(value: string): string {
    return filterOptions.find((o) => o.value === value)?.label || "All Statuses"
}

function escHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

const printStatusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "NOT_STARTED", label: "Not Started" },
    { value: "IN_PROGRESS", label: "Started / In Progress" },
    { value: "COMPLETED", label: "Completed" },
] as const

export default function PrintingInfoTable({ items }: { items: ItemRow[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("")
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false)
    const [printSelections, setPrintSelections] = React.useState<Set<string>>(new Set(["ALL"]))

    const togglePrintSelection = (value: string) => {
        setPrintSelections((prev) => {
            const next = new Set(prev)
            if (value === "ALL") {
                if (next.has("ALL")) {
                    next.delete("ALL")
                } else {
                    return new Set(["ALL"])
                }
            } else {
                next.delete("ALL")
                if (next.has(value)) {
                    next.delete(value)
                } else {
                    next.add(value)
                }
                if (next.size === 0) {
                    next.add("ALL")
                }
            }
            return next
        })
    }

    const getPrintRows = React.useCallback((selections: Set<string>) => {
        if (selections.has("ALL")) return items
        const statuses: string[] = []
        if (selections.has("NOT_STARTED")) statuses.push("NOT_STARTED")
        if (selections.has("IN_PROGRESS")) { statuses.push("STARTED"); statuses.push("ONPROGRESS") }
        if (selections.has("COMPLETED")) statuses.push("COMPLETED")
        if (statuses.length === 0) return items
        return items.filter((i) => statuses.includes(i.status))
    }, [items])

    const counts = React.useMemo(() => {
        const all = items.length
        const notStarted = items.filter((i) => i.status === "NOT_STARTED").length
        const inProgress = items.filter((i) => i.status === "STARTED" || i.status === "ONPROGRESS").length
        const completed = items.filter((i) => i.status === "COMPLETED").length
        return { all, notStarted, inProgress, completed }
    }, [items])

    const filteredData = React.useMemo(() => {
        if (!statusFilter) return items
        if (statusFilter === "IN_PROGRESS") {
            return items.filter((i) => i.status === "STARTED" || i.status === "ONPROGRESS")
        }
        return items.filter((i) => i.status === statusFilter)
    }, [items, statusFilter])

    const handlePrint = (selections: Set<string>) => {
        const printWindow = window.open("", "_blank")
        if (!printWindow) return

        const rows = getPrintRows(selections)
        const label = selections.has("ALL") ? "All Statuses"
            : [selections.has("NOT_STARTED") && "Not Started", selections.has("IN_PROGRESS") && "Started/In Progress", selections.has("COMPLETED") && "Completed"].filter(Boolean).join(" + ")
        const filterLabel = label || "All Statuses"

        const totalQty = rows.reduce((s, r) => s + r.quantity, 0)

        const rowsHtml = rows.map((row, i) => `
            <tr>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">${i + 1}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;font-weight:600;color:#1e293b;">${escHtml(row.bookTitle)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:12px;color:#64748b;">${escHtml(row.editionName)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#1e293b;">${escHtml(row.projectName)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#475569;">${escHtml(row.printerName)}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;font-weight:700;color:#1e293b;text-align:center;">${row.quantity.toLocaleString()}</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:11px;font-weight:700;text-align:center;">${escHtml(statusLabels[row.status] || row.status)}</td>
            </tr>
        `).join("")

        const notStartedCount = rows.filter((r) => r.status === "NOT_STARTED").length
        const inProgressCount = rows.filter((r) => r.status === "STARTED" || r.status === "ONPROGRESS").length
        const completedCount = rows.filter((r) => r.status === "COMPLETED").length

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Printing Info - ${escHtml(filterLabel)}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1e293b; }
                    h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
                    .sub { font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 24px; }
                    .summary { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
                    .summary-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 20px; text-align: center; min-width: 120px; }
                    .summary-item label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; display: block; margin-bottom: 4px; }
                    .summary-item span { font-size: 20px; font-weight: 800; color: #1e293b; }
                    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                    th { background: #f1f5f9; padding: 10px 12px; border: 1px solid #e2e8f0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; text-align: left; }
                    td { padding: 8px 12px; border: 1px solid #e2e8f0; }
                    .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
                    .not-started { background: #f1f5f9; color: #475569; font-weight: 700; font-size: 11px; }
                    .in-progress { background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 11px; }
                    .completed { background: #f0fdf4; color: #16a34a; font-weight: 700; font-size: 11px; }
                    @media print { body { padding: 20px; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <div>
                        <h1>Printing Info — ${escHtml(filterLabel)}</h1>
                        <div class="sub">${rows.length} book${rows.length !== 1 ? 's' : ''} across all projects</div>
                    </div>
                    <div style="font-size:10px;color:#94a3b8;font-weight:600;text-align:right;">
                        Generated: ${new Date().toLocaleDateString()}<br>
                        Bookland Ethiopia
                    </div>
                </div>

                <div class="summary">
                    <div class="summary-item">
                        <label>Total Books</label>
                        <span>${rows.length}</span>
                    </div>
                    <div class="summary-item">
                        <label>Total Copies</label>
                        <span>${totalQty.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <label>Not Started</label>
                        <span>${notStartedCount}</span>
                    </div>
                    <div class="summary-item">
                        <label>In Progress</label>
                        <span>${inProgressCount}</span>
                    </div>
                    <div class="summary-item">
                        <label>Completed</label>
                        <span>${completedCount}</span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="text-align:center;">#</th>
                            <th>Book</th>
                            <th>Edition</th>
                            <th>Project</th>
                            <th>Printer</th>
                            <th style="text-align:center;">Qty</th>
                            <th style="text-align:center;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div class="footer">Bookland Ethiopia — Printing Info Report</div>

                <div class="no-print" style="text-align:center;margin-top:32px;">
                    <button onclick="window.print()" style="padding:12px 32px;font-size:14px;font-weight:700;background:#1e293b;color:white;border:none;border-radius:8px;cursor:pointer;">Print This Page</button>
                </div>
                <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }<\/script>
            </body>
            </html>
        `)
        printWindow.document.close()
    }

    const columns: ColumnDef<ItemRow>[] = [
        {
            accessorKey: "bookTitle",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
                >
                    Book
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                        <BookOpen className="size-4" />
                    </div>
                    <div>
                        <p className="font-black text-primarycolor uppercase text-xs leading-tight">{row.getValue("bookTitle")}</p>
                        <p className="text-[9px] font-bold text-muted-foreground">{row.original.editionName}</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "projectName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
                >
                    Project
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-xs font-bold text-slate-600">{row.getValue("projectName")}</span>
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
                    <Printer className="size-3 mr-1" />
                    Printer
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-xs font-bold text-primarycolor">{row.getValue("printerName")}</span>
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
                    Qty
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-black text-slate-700">{row.getValue<number>("quantity").toLocaleString()}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue<string>("status")
                return (
                    <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                        statusStyles[status] || "bg-slate-100 text-slate-600"
                    )}>
                        {statusLabels[status] || status}
                    </span>
                )
            },
            filterFn: "equalsString",
        },
    ]

    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: { sorting, columnFilters, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
    })

    return (
        <div className="bg-white rounded-[3rem] p-8 md:p-10 border-2 border-primarycolor/5 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-full max-w-sm group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input
                        placeholder="Search by book, project or printer..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter || "ALL"}
                        onValueChange={(value) => setStatusFilter(value === "ALL" ? "" : value)}
                    >
                        <SelectTrigger className="h-10 min-w-[200px] rounded-xl border-2 border-slate-200 font-bold text-[10px] uppercase tracking-widest text-slate-700">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl p-2 border-2">
                            <SelectItem value="ALL" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">
                                All Statuses ({counts.all})
                            </SelectItem>
                            <SelectItem value="NOT_STARTED" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">
                                Not Started ({counts.notStarted})
                            </SelectItem>
                            <SelectItem value="IN_PROGRESS" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">
                                Started / In Progress ({counts.inProgress})
                            </SelectItem>
                            <SelectItem value="COMPLETED" className="rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest">
                                Completed ({counts.completed})
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPrintDialogOpen(true)}
                        className="h-10 px-4 rounded-xl border-2 border-primarycolor/20 text-[10px] font-black uppercase tracking-widest text-primarycolor hover:bg-primarycolor hover:text-white hover:border-primarycolor transition-all"
                    >
                        <PrinterCheck className="size-4 mr-1.5" />
                        Print
                    </Button>
                </div>
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
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    No books match your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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

            <CompletedRemainingTable items={items} />

            {/* Print Options Dialog */}
            <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[2rem] p-6 sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-800">Print Options</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            Select which statuses to include in the printed report.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        {printStatusOptions.map((opt) => {
                            const count = opt.value === "ALL" ? items.length
                                : opt.value === "NOT_STARTED" ? counts.notStarted
                                : opt.value === "IN_PROGRESS" ? counts.inProgress
                                : counts.completed
                            return (
                                <label
                                    key={opt.value}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                        printSelections.has(opt.value)
                                            ? "border-primarycolor bg-primarycolor/5"
                                            : "border-slate-100 hover:border-slate-200 bg-white",
                                    )}
                                >
                                    <Checkbox
                                        checked={printSelections.has(opt.value)}
                                        onCheckedChange={() => togglePrintSelection(opt.value)}
                                        className="size-5 rounded-lg data-[state=checked]:bg-primarycolor data-[state=checked]:border-primarycolor"
                                    />
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">{opt.label}</span>
                                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{count}</span>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                    <DialogFooter className="flex-row gap-3 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPrintDialogOpen(false)}
                            className="flex-1 h-11 rounded-xl border-2 font-black uppercase tracking-widest text-[11px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setPrintDialogOpen(false)
                                handlePrint(printSelections)
                            }}
                            className="flex-[2] h-11 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primarycolor/20"
                        >
                            <PrinterCheck className="size-4 mr-2" />
                            Print
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CompletedRemainingTable({ items }: { items: ItemRow[] }) {
    const completedItems = React.useMemo(
        () => items.filter((i) => i.status === "COMPLETED" && i.remaining != null && i.remaining > 0),
        [items],
    )

    const completedColumns: ColumnDef<ItemRow>[] = [
        {
            accessorKey: "bookTitle",
            header: "Book",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                        <BookOpen className="size-4" />
                    </div>
                    <div>
                        <p className="font-black text-primarycolor uppercase text-xs leading-tight">{row.getValue("bookTitle")}</p>
                        <p className="text-[9px] font-bold text-muted-foreground">{row.original.editionName}</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "projectName",
            header: "Project",
            cell: ({ row }) => (
                <span className="text-xs font-bold text-slate-600">{row.getValue("projectName")}</span>
            ),
        },
        {
            accessorKey: "printerName",
            header: "Printer",
            cell: ({ row }) => (
                <span className="text-xs font-bold text-primarycolor">{row.getValue("printerName")}</span>
            ),
        },
        {
            accessorKey: "quantity",
            header: "Total Qty",
            cell: ({ row }) => (
                <div className="font-black text-slate-700">{row.getValue<number>("quantity").toLocaleString()}</div>
            ),
        },
        {
            accessorKey: "remaining",
            header: "Remaining",
            cell: ({ row }) => {
                const val = row.getValue<number | null>("remaining")
                return (
                    <div className={cn("font-black", val != null && val > 0 ? "text-amber-600" : "text-emerald-600")}>
                        {val != null ? val.toLocaleString() : "—"}
                    </div>
                )
            },
        },
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])

    const completedTable = useReactTable({
        data: completedItems,
        columns: completedColumns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        initialState: { pagination: { pageSize: 5 } },
    })

    if (completedItems.length === 0) return null

    return (
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-[3rem] p-8 md:p-10 border-2 border-orange-200/60 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-orange-200/40">
                <div className="size-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                    <BookOpen className="size-4.5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-orange-800 uppercase tracking-tight">Completed — Not Yet Transferred</h3>
                    <p className="text-[10px] font-bold text-orange-500">{completedItems.length} book{completedItems.length !== 1 ? 's' : ''} still have remaining copies in print</p>
                </div>
            </div>

            <div className="bg-white/80 rounded-[2.5rem] border border-orange-200/40 shadow-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-orange-50/50">
                        {completedTable.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-orange-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-14 px-6 text-[10px] font-black uppercase tracking-widest text-orange-500/60">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {completedTable.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="h-16 border-b border-orange-50 hover:bg-orange-50/30 transition-colors">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-6">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                    Page {completedTable.getState().pagination.pageIndex + 1} of {completedTable.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => completedTable.previousPage()}
                        disabled={!completedTable.getCanPreviousPage()}
                        className="rounded-xl h-9 w-9 p-0 border-2 border-orange-200/60 hover:border-orange-300 text-orange-500"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => completedTable.nextPage()}
                        disabled={!completedTable.getCanNextPage()}
                        className="rounded-xl h-9 w-9 p-0 border-2 border-orange-200/60 hover:border-orange-300 text-orange-500"
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
