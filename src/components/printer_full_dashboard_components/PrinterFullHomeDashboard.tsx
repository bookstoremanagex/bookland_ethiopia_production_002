"use client"

import React, { useState } from 'react'
import {
  Printer,
  MapPin,
  Phone,
  Mail,
  Package,
  ClipboardList,
  Building2,
  Activity,
  BookOpen,
  Banknote,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import { useCalendar } from "@/lib/calendar-context"
import { useRouter } from 'next/navigation'
import { updatePrintOrderItemStatus, updatePrintOrderStatus } from '@/app/actions/print-order-actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PrinterFullHomeDashboardProps {
  printer: any
}

const itemStatusOptions = [
  { value: "NOT_STARTED", label: "Not Started", color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-400" },
  { value: "STARTED", label: "Started", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-400" },
  { value: "ONPROGRESS", label: "In Progress", color: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-400" },
  { value: "COMPLETED", label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400" },
]

const projectStatusOptions = [
  { value: "NOT_STARTED", label: "Not Started", color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-400" },
  { value: "STARTED", label: "Started", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-400" },
  { value: "ONPROGRESS", label: "In Progress", color: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-400" },
  { value: "FAILED", label: "Failed", color: "bg-rose-50 text-rose-600 border-rose-200", dot: "bg-rose-400" },
  { value: "REPRINT", label: "Reprinting", color: "bg-purple-50 text-purple-600 border-purple-200", dot: "bg-purple-400" },
  { value: "COMPLETED", label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400" },
]

const getStatusStyle = (status: string) => {
  const all = [...itemStatusOptions, ...projectStatusOptions]
  return all.find(s => s.value === status)?.color || "bg-amber-50 text-amber-600 border-amber-200"
}

const getStatusDot = (status: string) => {
  const all = [...itemStatusOptions, ...projectStatusOptions]
  return all.find(s => s.value === status)?.dot || "bg-amber-400"
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            pct === 100 ? "bg-emerald-400" : "bg-primarycolor",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={cn(
        "text-xs font-black tabular-nums",
        pct === 100 ? "text-emerald-600" : "text-slate-500",
      )}>
        {pct}%
      </span>
    </div>
  )
}

export default function PrinterFullHomeDashboard({ printer }: PrinterFullHomeDashboardProps) {
  const router = useRouter()
  const { formatDate } = useCalendar()
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [updatingProjectId, setUpdatingProjectId] = useState<number | null>(null)
  const [expandedProjects, setExpandedProjects] = useState<Record<number, boolean>>({})
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'item' | 'project'
    id: number
    label: string
  } | null>(null)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [detailItem, setDetailItem] = useState<any | null>(null)

  const activeOrders = printer.printorder.filter((o: any) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
  const totalStock = printer.bookeditionprinters.reduce((sum: number, bp: any) => sum + (bp.quantity || 0), 0)
  const stockItems = printer.bookeditionprinters.length
  const remainingBooks = printer.bookeditionprinters.filter((bp: any) => {
    const remaining = bp.bookedition?.count_remening_for_transfer
    return remaining != null && remaining > 0
  })

  const editionPaidMap = new Map<string, { total: number; payments: any[] }>()
  printer.printorder.forEach((order: any) => {
    ;(order.printorder_payments || []).forEach((payment: any) => {
      if (payment.reference) {
        const match = payment.reference.match(/^\[([^\]]+)\]/)
        if (match) {
          const label = match[1]
          const entry = editionPaidMap.get(label) || { total: 0, payments: [] }
          entry.total += payment.amount
          entry.payments.push(payment)
          editionPaidMap.set(label, entry)
        }
      }
    })
  })

  const booksCollective = (() => {
    const rows: any[] = []
    printer.printorder.forEach((order: any) => {
      ;(order.printorder_items || []).forEach((item: any) => {
        const book = item.bookedition?.books
        const edition = item.bookedition
        if (!book) return
        const editionLabel = `${book.title} — ${edition?.edition_name || "Unknown Edition"}`
        const paidData = editionPaidMap.get(editionLabel)
        rows.push({
          id: item.id,
          orderId: order.id,
          bookEditionId: item.bookEditionId,
          projectName: order.project_name || `Project #${order.id}`,
          bookTitle: book.title || "Unknown Book",
          bookAuthor: book.author || "—",
          editionName: edition?.edition_name || "—",
          quantity: item.quantity || 0,
          totalPrice: item.total_price || 0,
          remaining: edition?.count_remening_for_transfer ?? null,
          status: item.status || "NOT_STARTED",
          paidAmount: paidData?.total || 0,
          payments: paidData?.payments || [],
        })
      })
    })
    return rows.sort((a, b) => {
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1
      return 0
    })
  })()

  const statusColorMap: Record<string, string> = {
    available: "text-emerald-500",
    maintenance: "text-amber-500",
    closed: "text-rose-500",
  }

  const handleItemStatusChange = (itemId: number, newStatus: string, currentStatus: string) => {
    if (currentStatus === "COMPLETED") {
      toast.error("Cannot change a completed item")
      return
    }
    if (newStatus === "COMPLETED") {
      setPendingStatus(newStatus)
      setConfirmDialog({ type: 'item', id: itemId, label: 'this book item' })
      return
    }
    applyItemStatus(itemId, newStatus)
  }

  const applyItemStatus = async (itemId: number, status: string) => {
    setUpdatingId(itemId)
    try {
      const res = await updatePrintOrderItemStatus(itemId, status)
      if (res.success) {
        toast.success("Item status updated")
        router.refresh()
      } else {
        toast.error(res.error || "Failed to update")
      }
    } catch {
      toast.error("Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleProjectStatusChange = (orderId: number, newStatus: string, currentStatus: string) => {
    if (currentStatus === "COMPLETED") {
      toast.error("Cannot revert a completed project")
      return
    }
    if (newStatus === "COMPLETED") {
      setPendingStatus(newStatus)
      setConfirmDialog({ type: 'project', id: orderId, label: 'this entire project' })
      return
    }
    applyProjectStatus(orderId, newStatus)
  }

  const applyProjectStatus = async (orderId: number, status: string) => {
    setUpdatingProjectId(orderId)
    try {
      const res = await updatePrintOrderStatus(orderId, status)
      if (res.success) {
        toast.success("Project status updated")
        router.refresh()
      } else {
        toast.error(res.error || "Failed to update")
      }
    } catch {
      toast.error("Failed to update project status")
    } finally {
      setUpdatingProjectId(null)
    }
  }

  const confirmComplete = () => {
    if (!confirmDialog || !pendingStatus) return
    if (confirmDialog.type === 'item') {
      applyItemStatus(confirmDialog.id, pendingStatus)
    } else {
      applyProjectStatus(confirmDialog.id, pendingStatus)
    }
    setConfirmDialog(null)
    setPendingStatus(null)
  }

  const toggleProject = (orderId: number) => {
    setExpandedProjects(prev => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  const totalItems = printer.printorder.reduce((sum: number, o: any) => sum + (o.printorder_items?.length || 0), 0)
  const activeItems = printer.printorder.reduce((sum: number, o: any) =>
    sum + (o.printorder_items?.filter((i: any) =>
      i.status !== "COMPLETED" && i.status !== "FAILED"
    ).length || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primarycolor/[0.03]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primarycolor via-primarycolor/90 to-secondarycolor px-6 pt-12 pb-20 md:px-10 md:pt-16 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-80 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Printer className="size-5 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-white/60">Printer Portal</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                {printer.name}
              </h1>
              <p className="text-base md:text-lg font-semibold text-white/70 flex items-center gap-2">
                <MapPin className="size-4" /> {printer.location}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 md:p-3 border border-white/10">
              <div className="flex flex-col items-center px-5 py-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Status</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={cn("size-2 rounded-full", printer.status === "available" ? "bg-emerald-400" : printer.status === "maintenance" ? "bg-amber-400" : "bg-rose-400")} />
                  <span className={cn("text-lg font-black", statusColorMap[printer.status] || "text-emerald-400")}>
                    {printer.status}
                  </span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center px-5 py-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Active Jobs</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Activity className="size-4 text-white/60 animate-pulse" />
                  <span className="text-lg font-black text-white">{activeOrders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content (negative margin to overlap hero) */}
      <div className="relative z-20 -mt-12 mx-auto max-w-7xl px-4 md:px-8 space-y-8 pb-12">

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-5 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
              <Package className="size-20" />
            </div>
            <div className="relative z-10">
              <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <Package className="size-5 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Stock</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-black text-slate-800">{totalStock.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-400 mb-1">{stockItems} editions</span>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-5 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
              <ClipboardList className="size-20" />
            </div>
            <div className="relative z-10">
              <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                <ClipboardList className="size-5 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Orders</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-black text-slate-800">{printer.printorder.length}</span>
                <span className="text-xs font-bold text-emerald-500 mb-1">{activeOrders.length} active</span>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-5 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
              <Building2 className="size-20" />
            </div>
            <div className="relative z-10">
              <div className="size-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                <Building2 className="size-5 text-sky-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</p>
              <div className="mt-1 space-y-1">
                {printer.phone && (
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="size-3.5 text-slate-400" /> {printer.phone}
                  </p>
                )}
                {printer.email && (
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 truncate">
                    <Mail className="size-3.5 text-slate-400" /> {printer.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Books Collective */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                <BookOpen className="size-5 text-primarycolor" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Books in Collective</h2>
                <p className="text-xs font-bold text-slate-400">{booksCollective.length} items across {printer.printorder.length} projects</p>
              </div>
            </div>
          </div>

          {booksCollective.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
              <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="size-8 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">No books assigned yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-3 pl-6 pr-4">Book Title</th>
                      <th className="py-3 px-4">Edition</th>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Copies</th>
                      <th className="py-3 px-4">Remaining</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 pr-6 pl-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {booksCollective.map((book: any) => {
                      const isItemCompleted = book.status === "COMPLETED"
                      return (
                        <tr key={book.id} className="border-t border-slate-100 hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 pl-6 pr-4">
                            <span className="text-sm font-bold text-slate-700 leading-tight block max-w-[200px] truncate">
                              {book.bookTitle}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-bold text-slate-400">{book.editionName}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-bold text-primarycolor truncate block max-w-[140px]">
                              {book.projectName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-black text-slate-700">{book.quantity.toLocaleString()}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={cn(
                              "font-black",
                              book.remaining != null && book.remaining > 0
                                ? "text-amber-500"
                                : "text-emerald-500",
                            )}>
                              {book.remaining != null ? book.remaining.toLocaleString() : "—"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-black text-slate-700">{book.totalPrice.toLocaleString()} ETB</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={book.status}
                              onChange={(e) => handleItemStatusChange(book.id, e.target.value, book.status)}
                              disabled={updatingId === book.id || isItemCompleted}
                              className={cn(
                                "h-8 px-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[105px]",
                                updatingId === book.id && "opacity-50 pointer-events-none",
                                isItemCompleted && "opacity-60 cursor-not-allowed",
                                getStatusStyle(book.status),
                              )}
                            >
                              {itemStatusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 pr-6 pl-4">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailItem(book)}
                              className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primarycolor/5 text-primarycolor hover:bg-primarycolor hover:text-white transition-all"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-slate-100">
                {booksCollective.map((book: any) => {
                  const isItemCompleted = book.status === "COMPLETED"
                  return (
                    <div key={book.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 leading-tight">{book.bookTitle}</p>
                          <p className="text-[11px] font-bold text-slate-400">{book.editionName}</p>
                        </div>
                        <select
                          value={book.status}
                          onChange={(e) => handleItemStatusChange(book.id, e.target.value, book.status)}
                          disabled={updatingId === book.id || isItemCompleted}
                          className={cn(
                            "h-7 px-2 rounded-lg border text-[9px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[90px] shrink-0",
                            updatingId === book.id && "opacity-50 pointer-events-none",
                            isItemCompleted && "opacity-60 cursor-not-allowed",
                            getStatusStyle(book.status),
                          )}
                        >
                          {itemStatusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Project</span>
                          <span className="font-bold text-primarycolor">{book.projectName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Copies</span>
                          <span className="font-black text-slate-700">{book.quantity.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Remaining</span>
                          <span className={cn(
                            "font-black",
                            book.remaining != null && book.remaining > 0
                              ? "text-amber-500"
                              : "text-emerald-500",
                          )}>
                            {book.remaining != null ? book.remaining.toLocaleString() : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Price</span>
                          <span className="font-black text-slate-700">{book.totalPrice.toLocaleString()} ETB</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailItem(book)}
                        className="w-full h-8 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primarycolor/5 text-primarycolor hover:bg-primarycolor hover:text-white transition-all"
                      >
                        Details
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Print Tracking */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                <Activity className="size-5 text-primarycolor" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Print Tracking</h2>
                <p className="text-xs font-bold text-slate-400">{totalItems} items across {printer.printorder.length} projects</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Layers className="size-3.5" /> {printer.printorder.length} projects
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="size-3.5" /> {totalItems - activeItems} done
              </span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <Clock className="size-3.5" /> {activeItems} active
              </span>
            </div>
          </div>

          {printer.printorder.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
              <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="size-8 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">No printing projects assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {printer.printorder.map((order: any) => {
                const items = order.printorder_items || []
                const isExpanded = expandedProjects[order.id] !== false
                const completedItems = items.filter((i: any) => i.status === "COMPLETED").length
                const isProjectCompleted = order.status === "COMPLETED"

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="flex items-stretch">
                      <button
                        type="button"
                        onClick={() => toggleProject(order.id)}
                        className="flex-1 flex items-center justify-between p-5 md:p-6 hover:bg-slate-50/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "size-11 rounded-xl flex items-center justify-center shrink-0 border",
                            isProjectCompleted
                              ? "bg-emerald-50 border-emerald-200 text-emerald-500"
                              : "bg-primarycolor/5 border-primarycolor/10 text-primarycolor",
                          )}>
                            <BookOpen className="size-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="text-base font-bold text-slate-800">
                                {order.project_name || `Project #${order.id}`}
                              </h3>
                              <div className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                getStatusStyle(order.status),
                              )}>
                                <span className={cn("size-1.5 rounded-full", getStatusDot(order.status))} />
                                {projectStatusOptions.find(o => o.value === order.status)?.label || order.status}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-1.5">
                              <span className="text-xs font-bold text-slate-400">{items.length} book{items.length !== 1 ? 's' : ''}</span>
                              <span className={cn(
                                "text-xs font-bold",
                                completedItems === items.length ? "text-emerald-600" : "text-slate-400",
                              )}>
                                {completedItems}/{items.length} completed
                              </span>
                              <div className="hidden sm:block flex-1 max-w-[160px]">
                                <ProgressBar completed={completedItems} total={items.length} />
                              </div>
                            </div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="size-5 text-slate-300 shrink-0" /> : <ChevronDown className="size-5 text-slate-300 shrink-0" />}
                      </button>

                      {!isProjectCompleted && (
                        <div className="flex items-center px-4 md:px-5 border-l border-slate-100">
                          <div className="space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] block text-center">Project</label>
                            <select
                              value={order.status}
                              onChange={(e) => handleProjectStatusChange(order.id, e.target.value, order.status)}
                              disabled={updatingProjectId === order.id}
                              className={cn(
                                "h-7 px-2 rounded-lg border text-[9px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[90px]",
                                updatingProjectId === order.id && "opacity-50 pointer-events-none",
                                getStatusStyle(order.status),
                              )}
                            >
                              {projectStatusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {isExpanded && items.length > 0 && (
                      <div className="border-t border-slate-100">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-slate-50/80 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="py-3 pl-6 pr-4">Book Title</th>
                                <th className="py-3 px-4">Edition</th>
                                <th className="py-3 px-4">Qty</th>
                                <th className="py-3 px-4">Start</th>
                                <th className="py-3 px-4">End</th>
                                <th className="py-3 pr-6 pl-4">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item: any) => {
                                const book = item.bookedition?.books
                                const edition = item.bookedition
                                const isItemCompleted = item.status === "COMPLETED"
                                return (
                                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/30 transition-colors">
                                    <td className="py-3.5 pl-6 pr-4">
                                      <span className="text-sm font-bold text-slate-700 leading-tight block max-w-[220px] truncate">
                                        {book?.title || "Unknown Book"}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className="text-xs font-bold text-slate-400">{edition?.edition_name || "—"}</span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className="font-black text-slate-700">{item.quantity?.toLocaleString() || "—"}</span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                                        {order.startDate ? formatDate(new Date(order.startDate)) : "—"}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                                        {order.endDate ? formatDate(new Date(order.endDate)) : "—"}
                                      </span>
                                    </td>
                                    <td className="py-3.5 pr-6 pl-4">
                                      <select
                                        value={item.status}
                                        onChange={(e) => handleItemStatusChange(item.id, e.target.value, item.status)}
                                        disabled={updatingId === item.id || isItemCompleted}
                                        className={cn(
                                          "h-8 px-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[105px]",
                                          updatingId === item.id && "opacity-50 pointer-events-none",
                                          isItemCompleted && "opacity-60 cursor-not-allowed",
                                          getStatusStyle(item.status),
                                        )}
                                      >
                                        {itemStatusOptions.map(opt => (
                                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                      </select>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-slate-100">
                          {items.map((item: any) => {
                            const book = item.bookedition?.books
                            const edition = item.bookedition
                            const isItemCompleted = item.status === "COMPLETED"
                            return (
                              <div key={item.id} className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800 leading-tight">{book?.title || "Unknown Book"}</p>
                                    <p className="text-[11px] font-bold text-slate-400">{edition?.edition_name || "—"}</p>
                                  </div>
                                  <select
                                    value={item.status}
                                    onChange={(e) => handleItemStatusChange(item.id, e.target.value, item.status)}
                                    disabled={updatingId === item.id || isItemCompleted}
                                    className={cn(
                                      "h-7 px-2 rounded-lg border text-[9px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[90px] shrink-0",
                                      updatingId === item.id && "opacity-50 pointer-events-none",
                                      isItemCompleted && "opacity-60 cursor-not-allowed",
                                      getStatusStyle(item.status),
                                    )}
                                  >
                                    {itemStatusOptions.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                  <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Qty</span>
                                    <span className="font-black text-slate-700">{item.quantity?.toLocaleString() || "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Start</span>
                                    <span className="font-bold text-slate-500">{order.startDate ? formatDate(new Date(order.startDate)) : "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">End</span>
                                    <span className="font-bold text-slate-500">{order.endDate ? formatDate(new Date(order.endDate)) : "—"}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {isExpanded && items.length === 0 && (
                      <div className="p-8 text-center text-sm font-bold text-slate-400 border-t border-slate-100">
                        No books assigned
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Payment Tracking */}
        <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Banknote className="size-4.5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Payment Tracking</h3>
                <p className="text-[10px] font-bold text-slate-400">{printer.printorder.filter((o: any) => o.total_price).length} projects with pricing</p>
              </div>
            </div>
            <div className="space-y-3">
              {printer.printorder.filter((o: any) => o.total_price).length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                  <Banknote className="size-10 mx-auto text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-400">No payment data</p>
                </div>
              ) : (
                printer.printorder.filter((o: any) => o.total_price).map((order: any) => {
                  const totalPaid = (order.printorder_payments || []).reduce((sum: number, p: any) => sum + p.amount, 0)
                  const remaining = order.total_price - totalPaid
                  const payPct = order.total_price > 0 ? Math.round((totalPaid / order.total_price) * 100) : 0
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-700 truncate">
                            {order.project_name || `Project #${order.id}`}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400">
                            {order.printorder_items?.length || 0} items
                          </p>
                        </div>
                        <div className={cn(
                          "text-xs font-black px-2.5 py-1 rounded-lg border whitespace-nowrap",
                          remaining <= 0
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                            : "text-rose-600 border-rose-200 bg-rose-50",
                        )}>
                          {remaining <= 0 ? "PAID" : `${remaining.toLocaleString()} ETB`}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400">
                          <span>Progress</span>
                          <span>{payPct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", payPct >= 100 ? "bg-emerald-400" : "bg-primarycolor")}
                            style={{ width: `${payPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                          <p className="text-xs font-black text-slate-700">{order.total_price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Paid</p>
                          <p className="text-xs font-black text-emerald-600">{totalPaid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Due</p>
                          <p className={cn("text-xs font-black", remaining <= 0 ? "text-emerald-600" : "text-rose-500")}>
                            {remaining <= 0 ? "0" : remaining.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {order.printorder_payments?.length > 0 && (
                        <details className="group">
                          <summary className="text-[10px] font-bold text-primarycolor cursor-pointer hover:text-primarycolor/80 transition-colors list-none flex items-center gap-1">
                            <ArrowRight className="size-3 group-open:rotate-90 transition-transform" />
                            Payment History ({order.printorder_payments.length})
                          </summary>
                          <div className="mt-3 space-y-2">
                            {order.printorder_payments.map((payment: any) => (
                              <div key={payment.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                                <span className="text-[10px] font-bold text-slate-500">
                                  {formatDate(new Date(payment.payment_date))}
                                </span>
                                <span className="text-xs font-black text-emerald-600">
                                  {payment.amount.toLocaleString()} ETB
                                </span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailItem(null)}>
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                    <BookOpen className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{detailItem.bookTitle}</h3>
                    <p className="text-sm font-bold text-slate-400">{detailItem.bookAuthor}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDetailItem(null)} className="rounded-full hover:bg-slate-100 shrink-0">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Edition</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{detailItem.editionName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Project</p>
                  <p className="text-sm font-black text-primarycolor mt-1 truncate">{detailItem.projectName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Copies</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{detailItem.quantity.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remaining</p>
                  <p className={cn("text-sm font-black mt-1", detailItem.remaining != null && detailItem.remaining > 0 ? "text-amber-500" : "text-emerald-500")}>
                    {detailItem.remaining != null ? detailItem.remaining.toLocaleString() : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Total Cost</p>
                  <p className="text-lg font-black text-emerald-700 mt-1">{detailItem.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Paid Amount</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-black text-blue-700">{detailItem.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB</p>
                    {detailItem.totalPrice > 0 && (
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-md",
                        (detailItem.paidAmount / detailItem.totalPrice) >= 1
                          ? "bg-emerald-100 text-emerald-700"
                          : (detailItem.paidAmount / detailItem.totalPrice) > 0.5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700",
                      )}>
                        {((detailItem.paidAmount / detailItem.totalPrice) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {detailItem.payments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Payment History</h4>
                  <div className="space-y-2">
                    {detailItem.payments.map((payment: any) => (
                      <div key={payment.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-500">
                            {formatDate(new Date(payment.payment_date))}
                          </span>
                          <span className="text-sm font-black text-emerald-600">
                            {payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB
                          </span>
                        </div>
                        {payment.reference && (
                          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                            {payment.reference}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailItem.payments.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm font-bold text-slate-400">No payments recorded for this edition</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-200 shrink-0">
                <ShieldAlert className="size-7" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-slate-800">Mark as Completed</h3>
                <p className="text-sm font-bold text-slate-500 leading-snug">
                  You are about to mark {confirmDialog.label} as completed. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-amber-700 leading-relaxed">
                Once marked complete, you cannot revert the status back. Please confirm all work is finished.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setConfirmDialog(null); setPendingStatus(null) }}
                className="flex-1 h-11 rounded-xl border-2 font-black uppercase tracking-widest text-[11px]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmComplete}
                className="flex-[2] h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20"
              >
                Confirm Complete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
