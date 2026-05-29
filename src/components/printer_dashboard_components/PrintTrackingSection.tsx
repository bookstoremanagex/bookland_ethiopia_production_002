"use client"

import React, { useState } from 'react'
import {
    ClipboardList,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    Activity,
    RotateCcw,
    XCircle,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    ShieldAlert
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updatePrintOrderItemStatus, updatePrintOrderStatus } from '@/app/actions/print-order-actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useCalendar } from "@/lib/calendar-context"

interface PrintTrackingSectionProps {
    orders: any[]
}

const itemStatusOptions = [
    { value: "NOT_STARTED", label: "Not Started", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { value: "STARTED", label: "Started", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { value: "ONPROGRESS", label: "In Progress", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    { value: "COMPLETED", label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
]

const projectStatusOptions = [
    { value: "NOT_STARTED", label: "Not Started", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { value: "STARTED", label: "Started", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { value: "ONPROGRESS", label: "In Progress", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    { value: "FAILED", label: "Failed", color: "bg-rose-50 text-rose-600 border-rose-200" },
    { value: "REPRINT", label: "Reprinting", color: "bg-purple-50 text-purple-600 border-purple-200" },
    { value: "COMPLETED", label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
]

const getStatusStyle = (status: string) => {
    const all = [...itemStatusOptions, ...projectStatusOptions]
    return all.find(s => s.value === status)?.color || "bg-amber-50 text-amber-600 border-amber-200"
}

export default function PrintTrackingSection({ orders }: PrintTrackingSectionProps) {
    const router = useRouter()
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const [updatingId, setUpdatingId] = useState<number | null>(null)
    const [updatingProjectId, setUpdatingProjectId] = useState<number | null>(null)
    const [expandedProjects, setExpandedProjects] = useState<Record<number, boolean>>({})
    const [confirmDialog, setConfirmDialog] = useState<{
        type: 'item' | 'project'
        id: number
        label: string
    } | null>(null)
    const [pendingStatus, setPendingStatus] = useState<string | null>(null)

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

    const totalItems = orders.reduce((sum, o) => sum + (o.printorder_items?.length || 0), 0)
    const activeItems = orders.reduce((sum, o) =>
        sum + (o.printorder_items?.filter((i: any) =>
            i.status !== "COMPLETED" && i.status !== "FAILED"
        ).length || 0), 0)

    return (
        <div className="space-y-6">
            {/* Tracking Summary */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ClipboardList className="size-6 text-secondarycolor" />
                    <h2 className="text-2xl font-black text-primarycolor uppercase tracking-tighter italic">
                        Print <span className="text-secondarycolor not-italic">Tracking</span>
                    </h2>
                </div>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">{totalItems} items</span>
                    <span className="text-emerald-600">{activeItems} active</span>
                    <span className="text-primarycolor">{orders.length} projects</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl p-12 text-center">
                    <ClipboardList className="size-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-sm font-bold text-muted-foreground">No printing projects assigned</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const items = order.printorder_items || []
                        const isExpanded = expandedProjects[order.id] !== false
                        const completedItems = items.filter((i: any) => i.status === "COMPLETED").length
                        const isProjectCompleted = order.status === "COMPLETED"

                        return (
                            <div key={order.id} className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl overflow-hidden">
                                {/* Project Header (collapsible) */}
                                <div className="flex items-stretch">
                                    <button
                                        type="button"
                                        onClick={() => toggleProject(order.id)}
                                        className="flex-1 flex items-center justify-between p-6 md:p-8 hover:bg-primarycolor/[0.02] transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className="size-12 rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border-2 border-primarycolor/10 shrink-0">
                                                <BookOpen className="size-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-primarycolor">
                                                    {order.project_name || `Project #${order.id}`}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground">
                                                        {items.length} book{items.length !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-600">
                                                        {completedItems}/{items.length} done
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                                                {order.startDate && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="size-3" />
                                                        {formatDate(new Date(order.startDate))}
                                                    </span>
                                                )}
                                                {order.endDate && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="size-3" />
                                                        {formatDate(new Date(order.endDate))}
                                                    </span>
                                                )}
                                            </div>
                                            {isExpanded ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
                                        </div>
                                    </button>

                                    {/* Project-level status dropdown */}
                                    <div className="flex items-center px-4 md:px-6 border-l border-primarycolor/5">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block text-center">Project</label>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleProjectStatusChange(order.id, e.target.value, order.status)}
                                                disabled={updatingProjectId === order.id || isProjectCompleted}
                                                className={cn(
                                                    "h-8 px-2.5 rounded-lg border-2 font-bold text-[10px] uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[110px]",
                                                    updatingProjectId === order.id && "opacity-50 pointer-events-none",
                                                    isProjectCompleted && "opacity-60 cursor-not-allowed",
                                                    getStatusStyle(order.status),
                                                )}
                                            >
                                                {projectStatusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Per-Book Items Table */}
                                {isExpanded && items.length > 0 && (
                                    <div className="border-t border-primarycolor/5 overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                    <th className="py-3 px-6">Book Title</th>
                                                    <th className="py-3 px-4">Edition</th>
                                                    <th className="py-3 px-4">Quantity</th>
                                                    <th className="py-3 px-4">Start Date</th>
                                                    <th className="py-3 px-4">End Date</th>
                                                    <th className="py-3 px-6">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item: any) => {
                                                    const book = item.bookedition?.books
                                                    const edition = item.bookedition
                                                    const isItemCompleted = item.status === "COMPLETED"
                                                    return (
                                                        <tr key={item.id} className="border-t border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-colors">
                                                            <td className="py-4 px-6">
                                                                <div className="font-bold text-sm text-primarycolor">
                                                                    {book?.title || "Unknown Book"}
                                                                </div>
                                                                {order.project_name && (
                                                                    <div className="text-[10px] text-muted-foreground font-bold mt-0.5">
                                                                        {order.project_name}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="text-xs font-bold text-muted-foreground">
                                                                    {edition?.edition_name || "—"}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="font-black text-primarycolor text-base">
                                                                    {item.quantity?.toLocaleString() || "—"}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                                                                    {order.startDate ? formatDate(new Date(order.startDate)) : "—"}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                                                                    {order.endDate ? formatDate(new Date(order.endDate)) : "—"}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <select
                                                                    value={item.status}
                                                                    onChange={(e) => handleItemStatusChange(item.id, e.target.value, item.status)}
                                                                    disabled={updatingId === item.id || isItemCompleted}
                                                                    className={cn(
                                                                        "h-9 px-3 rounded-xl border-2 font-bold text-[11px] uppercase tracking-widest outline-none appearance-none transition-all",
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
                                )}

                                {isExpanded && items.length === 0 && (
                                    <div className="p-8 text-center text-sm font-bold text-muted-foreground border-t border-primarycolor/5">
                                        No books assigned to this project
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Irreversible Completion Confirmation Dialog */}
            {confirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-5">
                            <div className="size-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border-2 border-emerald-500/20 shrink-0">
                                <ShieldAlert className="size-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-primarycolor uppercase tracking-tight italic">
                                    Mark as <span className="text-emerald-600 not-italic">Completed</span>
                                </h3>
                                <p className="text-sm font-bold text-muted-foreground leading-snug">
                                    You are about to mark {confirmDialog.label} as completed.
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-5 space-y-3">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-sm font-bold text-amber-800 leading-relaxed">
                                    This action is <span className="underline decoration-2 underline-offset-2">irreversible</span>. Once marked complete, you cannot change the status back.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setConfirmDialog(null)
                                    setPendingStatus(null)
                                }}
                                className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={confirmComplete}
                                className="flex-[2] h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20"
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
