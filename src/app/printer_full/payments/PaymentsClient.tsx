"use client"

import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Banknote, Search, ChevronLeft, ChevronRight, Eye, ExternalLink } from 'lucide-react'
import { useCalendar } from '@/lib/calendar-context'
import { cn } from '@/lib/utils'
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
import Link from 'next/link'

interface PaymentRow {
  id: number
  projectName: string
  projectId: number
  amount: number
  paymentDate: Date
  reference: string | null
}

interface PaymentsClientProps {
  printer: any
}

export default function PaymentsClient({ printer }: PaymentsClientProps) {
  const { formatDate } = useCalendar()
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "paymentDate", desc: true }])
  const [detailPayment, setDetailPayment] = React.useState<PaymentRow | null>(null)

  const data = React.useMemo(() => {
    const rows: PaymentRow[] = []
    printer.printorder.forEach((order: any) => {
      ;(order.printorder_payments || []).forEach((payment: any) => {
        rows.push({
          id: payment.id,
          projectName: order.project_name || `Project #${order.id}`,
          projectId: order.id,
          amount: payment.amount,
          paymentDate: new Date(payment.payment_date),
          reference: payment.reference || null,
        })
      })
    })
    return rows
  }, [printer.printorder])

  const totalAmount = data.reduce((s, p) => s + p.amount, 0)

  const columns: ColumnDef<PaymentRow>[] = [
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-slate-700">{row.getValue("projectName")}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Amount
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-black text-emerald-600">
          {row.getValue<number>("amount").toLocaleString()} ETB
        </span>
      ),
    },
    {
      accessorKey: "paymentDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Date
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
          {formatDate(row.getValue<Date>("paymentDate"))}
        </span>
      ),
      sortingFn: "datetime",
    },
    {
      accessorKey: "reference",
      header: "Memo",
      cell: ({ row }) => {
        const ref = row.getValue<string | null>("reference")
        return ref ? (
          <span className="text-xs font-bold text-slate-400 max-w-[200px] block truncate">{ref}</span>
        ) : (
          <span className="text-xs font-bold text-slate-300 italic">—</span>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDetailPayment(row.original)}
          className="rounded-xl h-9 px-3 border-2 border-primarycolor/10 text-[10px] font-black uppercase tracking-widest text-primarycolor hover:bg-primarycolor hover:text-white hover:border-primarycolor transition-all"
        >
          <Eye className="size-3.5 mr-1.5" />
          Details
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: { sorting, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Banknote className="size-5.5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payments</h1>
            <p className="text-sm font-bold text-slate-400">
              {data.length} payment{data.length !== 1 ? 's' : ''} across {printer.printorder.length} project{printer.printorder.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 rounded-xl px-4 py-2.5 text-center">
            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Total Paid</p>
            <p className="text-lg font-black text-emerald-700">{totalAmount.toLocaleString()} ETB</p>
          </div>
        </div>
      </div>

      {/* Unpaid Summary */}
      {(() => {
        const pricedOrders = printer.printorder.filter((o: any) => o.total_price)
        const totalRemaining = pricedOrders.reduce((sum: number, o: any) => {
          const totalPaid = (o.printorder_payments || []).reduce((s: number, p: any) => s + p.amount, 0)
          return sum + Math.max(0, o.total_price - totalPaid)
        }, 0)
        const unpaidCount = pricedOrders.filter((o: any) => {
          const totalPaid = (o.printorder_payments || []).reduce((sum: number, p: any) => sum + p.amount, 0)
          return totalPaid < o.total_price
        }).length
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-rose-50 rounded-2xl border border-rose-200 p-5 flex items-center gap-4">
              <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Banknote className="size-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-rose-400">Total Unpaid</p>
                <p className="text-xl font-black text-rose-600">{totalRemaining.toLocaleString()} <span className="text-xs font-bold opacity-60">ETB</span></p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 flex items-center gap-4">
              <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Banknote className="size-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-400">Outstanding Projects</p>
                <p className="text-xl font-black text-amber-700">{unpaidCount} / {pricedOrders.length}</p>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 flex items-center gap-4">
              <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Banknote className="size-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Fully Paid</p>
                <p className="text-xl font-black text-emerald-600">{pricedOrders.length - unpaidCount}</p>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Search */}
      <div className="relative w-full max-w-sm group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
        <Input
          placeholder="Search by project or memo..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
        />
      </div>

      {/* Payments Table */}
      {data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Banknote className="size-8 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400">No payments recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
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
                    <TableRow
                      key={row.id}
                      className="h-20 border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
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
                      No payments match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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
      )}

      {/* Detail Dialog */}
      {detailPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailPayment(null)}>
          <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                    <Banknote className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">Payment Details</h3>
                    <p className="text-sm font-bold text-slate-400">#{detailPayment.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailPayment(null)}
                  className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
                >
                  <svg className="size-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Project</p>
                  <p className="text-sm font-black text-primarycolor mt-1 truncate">{detailPayment.projectName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{formatDate(detailPayment.paymentDate)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 col-span-2">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Amount</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">{detailPayment.amount.toLocaleString()} <span className="text-sm font-bold opacity-60">ETB</span></p>
                </div>
              </div>

              {detailPayment.reference && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Memo / Reference</p>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">{detailPayment.reference}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDetailPayment(null)}
                  className="flex-1 h-11 rounded-xl border-2 font-black uppercase tracking-widest text-[11px]"
                >
                  Close
                </Button>
                <Link href={`/printer_full`} className="flex-[2]">
                  <Button
                    type="button"
                    className="w-full h-11 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primarycolor/20"
                  >
                    <ExternalLink className="size-3.5 mr-2" />
                    View Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
