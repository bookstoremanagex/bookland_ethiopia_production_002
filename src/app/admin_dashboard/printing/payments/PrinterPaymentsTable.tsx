"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    approvePayment,
    updatePrinterPaymentMemo,
} from "@/app/actions/payment-actions"
import { cn } from "@/lib/utils"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Eye,
    Banknote,
    Wallet,
    Check,
    X,
    Search,
    SlidersHorizontal,
    RotateCcw,
    Loader2,
    Pencil,
    ShieldAlert,
    CheckCircle2,
    Printer,
} from "lucide-react"
import { useCalendar } from "@/lib/calendar-context"
import PrintPaymentsDialog from "./PrintPaymentsDialog"

interface PrinterPaymentEntry {
    id: number
    printerName: string
    printerLocation: string | null
    printerPhone: string | null
    printerEmail: string | null
    orderId: number | null
    orderTotal: number | null
    orderStatus: string | null
    shopName: string
    amount: number
    paymentType: string
    status: string
    checkInfo: string | null
    createdAt: string
    updatedAt: string
    memo: string | null
    printerPaymentMemo: string | null
    image: string | null
}

function StatusBadge({ status }: { status: string }) {
    const isApproved = status === "APPROVED"
    const isRejected = status === "REJECTED"
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                isApproved
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : isRejected
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
            )}
        >
            {status === "APPROVED"
                ? "Approved"
                : status === "REJECTED"
                    ? "Rejected"
                    : "Pending"}
        </span>
    )
}

function StatusLetter({ status }: { status: string }) {
    if (status === "APPROVED") {
        return (
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-sm shadow-sm shadow-emerald-600/30">
                A
            </span>
        )
    }
    if (status === "REJECTED") {
        return (
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-rose-600 text-white font-black text-sm shadow-sm shadow-rose-600/30">
                R
            </span>
        )
    }
    return (
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-orange-500 text-white font-black text-sm shadow-sm shadow-orange-500/30">
            P
        </span>
    )
}

function MemoMark({ memo }: { memo: string | null }) {
    return memo ? (
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Check className="size-4" />
        </span>
    ) : (
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200">
            <X className="size-4" />
        </span>
    )
}

export function SearchableSelect({
    value,
    onValueChange,
    options,
    placeholder,
    emptyText = "No options found",
}: {
    value: string
    onValueChange: (v: string) => void
    options: { value: string; label: string }[]
    placeholder: string
    emptyText?: string
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return options
        return options.filter((o) =>
            o.label.toLowerCase().includes(q)
        )
    }, [options, search])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-11 justify-between rounded-xl border-2 border-slate-200 bg-white font-bold text-xs shadow-sm text-left"
                >
                    <span className="truncate">
                        {value === "ALL"
                            ? placeholder
                            : options.find((o) => o.value === value)
                                  ?.label ?? placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl bg-white">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={`Search ${placeholder.toLowerCase()}...`}
                        value={search}
                        onValueChange={setSearch}
                        className="h-11"
                    />
                    <CommandList className="max-h-[260px]">
                        <CommandEmpty className="p-4 text-center text-sm font-bold text-muted-foreground">
                            {emptyText}
                        </CommandEmpty>
                        <CommandGroup>
                            {filtered.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={() => {
                                        onValueChange(opt.value)
                                        setSearch("")
                                        setOpen(false)
                                    }}
                                    className="h-11 px-4 flex items-center justify-between cursor-pointer rounded-xl my-0.5"
                                >
                                    <span className="font-bold text-xs truncate">
                                        {opt.label}
                                    </span>
                                    {value === opt.value && (
                                        <Check className="size-4 text-primarycolor shrink-0 ml-2" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function EditableMemo({
    label,
    value,
    onSave,
    accent,
}: {
    label: string
    value: string | null
    onSave: (v: string) => Promise<boolean>
    accent?: string
}) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value ?? "")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setDraft(value ?? "")
    }, [value])

    if (!editing) {
        return (
            <div className="flex items-start justify-between gap-2 group">
                <p className="text-sm font-bold text-slate-800 break-words flex-1">
                    {value ? (
                        <span className={accent}>{value}</span>
                    ) : (
                        <span className="text-slate-300 italic font-bold text-xs">
                            No note added
                        </span>
                    )}
                </p>
                <button
                    onClick={() => {
                        setDraft(value ?? "")
                        setEditing(true)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity size-7 rounded-lg bg-slate-100 hover:bg-primarycolor/10 text-slate-500 hover:text-primarycolor flex items-center justify-center shrink-0"
                    title={`Edit ${label}`}
                >
                    <Pencil className="size-3.5" />
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full h-16 rounded-xl border-2 border-slate-200 bg-white font-bold text-xs p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
                placeholder="Add a note..."
                autoFocus
            />
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    disabled={saving}
                    onClick={async () => {
                        setSaving(true)
                        const ok = await onSave(draft)
                        setSaving(false)
                        if (ok) setEditing(false)
                    }}
                    className="h-8 rounded-lg bg-primarycolor hover:bg-secondarycolor text-white font-black text-[9px] uppercase tracking-widest gap-1"
                >
                    {saving ? (
                        <Loader2 className="size-3 animate-spin" />
                    ) : (
                        <Check className="size-3" />
                    )}
                    Save
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={saving}
                    onClick={() => setEditing(false)}
                    className="h-8 text-slate-500 font-black text-[9px] uppercase tracking-widest gap-1"
                >
                    <X className="size-3" />
                    Cancel
                </Button>
            </div>
        </div>
    )
}

function DetailDialog({
    payment,
    open,
    onClose,
    formatDateTime,
}: {
    payment: PrinterPaymentEntry | null
    open: boolean
    onClose: () => void
    formatDateTime: (d: Date) => string
}) {
    const router = useRouter()
    const [status, setStatus] = useState(payment?.status ?? "PENDING")
    const [printerMemo, setPrinterMemo] = useState<string | null>(
        payment?.printerPaymentMemo ?? null
    )
    const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
    const [isApproving, setIsApproving] = useState(false)

    useEffect(() => {
        if (payment) {
            setStatus(payment.status)
            setPrinterMemo(payment.printerPaymentMemo)
        }
    }, [payment])

    if (!payment) return null

    const isDirect = payment.paymentType === "DIRECT"
    const isPending = status === "PENDING"

    const handleApprove = async () => {
        setIsApproving(true)
        try {
            const res = await approvePayment(payment.id)
            if (res.success) {
                toast.success("Payment approved successfully")
                setStatus("APPROVED")
                setConfirmApproveOpen(false)
                router.refresh()
            } else {
                toast.error(res.error || "Failed to approve payment")
            }
        } catch {
            toast.error("Failed to approve payment")
        } finally {
            setIsApproving(false)
        }
    }

    const rows: { label: string; value: React.ReactNode }[] = [
        {
            label: "Printer",
            value: (
                <span className="font-black text-primarycolor">
                    {payment.printerName}
                </span>
            ),
        },
        ...(payment.printerLocation
            ? [{ label: "Printer Location", value: payment.printerLocation }]
            : []),
        ...(payment.printerPhone
            ? [{ label: "Printer Phone", value: payment.printerPhone }]
            : []),
        ...(payment.printerEmail
            ? [{ label: "Printer Email", value: payment.printerEmail }]
            : []),
        {
            label: "Order",
            value: payment.orderId ? `#ORD-${payment.orderId}` : "—",
        },
        ...(payment.orderTotal != null
            ? [
                  {
                      label: "Order Total",
                      value: `${payment.orderTotal.toLocaleString()} ETB`,
                  },
              ]
            : []),
        ...(payment.orderStatus
            ? [{ label: "Order Status", value: payment.orderStatus }]
            : []),
        { label: "Shop", value: payment.shopName },
        {
            label: "Amount",
            value: (
                <span className="font-black text-primarycolor">
                    {payment.amount.toLocaleString()} ETB
                </span>
            ),
        },
        { label: "Payment Type", value: payment.paymentType },
        {
            label: "Status",
            value: <StatusBadge status={status} />,
        },
        ...(payment.checkInfo
            ? [{ label: "Check", value: payment.checkInfo }]
            : []),
        {
            label: "Recorded",
            value: formatDateTime(new Date(payment.createdAt)),
        },
        {
            label: "Updated",
            value: formatDateTime(new Date(payment.updatedAt)),
        },
    ]

    return (
        <>
            <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
                <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b border-slate-100 shrink-0">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                                <Banknote className="size-5 md:size-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <DialogTitle className="text-lg md:text-xl font-black text-primarycolor uppercase italic truncate">
                                    Payment Details
                                </DialogTitle>
                                <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                                    #{payment.id} · {payment.printerName}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                        <div className="rounded-2xl bg-primarycolor/5 border-2 border-primarycolor/10 p-4 md:p-5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    Amount
                                </p>
                                <p className="font-black text-primarycolor text-xl md:text-2xl mt-0.5">
                                    {payment.amount.toLocaleString()}{" "}
                                    <span className="text-[10px]">ETB</span>
                                </p>
                            </div>
                            <StatusBadge status={status} />
                        </div>

                        {isDirect && isPending && (
                            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/70 p-4 md:p-5 space-y-3">
                                <div className="flex items-center gap-2 text-amber-800">
                                    <ShieldAlert className="size-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        Approve Payment
                                    </p>
                                </div>
                                <p className="text-[10px] font-bold text-amber-700/80 leading-relaxed">
                                    This is a direct payment. Approving it
                                    will mark it as APPROVED.
                                    <span className="text-rose-600 font-black">
                                        {" "}
                                        This action cannot be reversed.
                                    </span>
                                </p>
                                <Button
                                    onClick={() =>
                                        setConfirmApproveOpen(true)
                                    }
                                    disabled={isApproving}
                                    className="w-full sm:w-auto h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest gap-2"
                                >
                                    {isApproving ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="size-4" />
                                    )}
                                    Approve Payment
                                </Button>
                            </div>
                        )}

                        {!isDirect && isPending && (
                            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
                                <p className="text-[10px] font-bold text-muted-foreground">
                                    Only direct payments can be approved from
                                    here.
                                </p>
                            </div>
                        )}

                        {status === "APPROVED" && (
                            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3">
                                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                    This payment is approved.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {rows.map((r, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "p-3 rounded-xl border-2 border-slate-100 bg-slate-50/50",
                                        r.label === "Printer" &&
                                            "sm:col-span-2",
                                        (r.label === "Amount" ||
                                            r.label === "Status") &&
                                            "sm:col-span-2"
                                    )}
                                >
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        {r.label}
                                    </p>
                                    <div className="text-sm font-bold text-slate-800 mt-0.5 break-words">
                                        {r.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-3 space-y-3">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                                    Printer Memo
                                </p>
                                <EditableMemo
                                    label="Printer Memo"
                                    value={printerMemo}
                                    accent="font-bold text-indigo-700"
                                    onSave={async (v) => {
                                        const res =
                                            await updatePrinterPaymentMemo(
                                                payment.id,
                                                v
                                            )
                                        if (res.success) {
                                            setPrinterMemo(v || null)
                                            toast.success(
                                                "Printer memo updated successfully"
                                            )
                                            router.refresh()
                                            return true
                                        }
                                        toast.error(
                                            res.error ||
                                                "Failed to update printer memo"
                                        )
                                        return false
                                    }}
                                />
                            </div>
                        </div>

                        {payment.image && (
                            <div className="rounded-2xl overflow-hidden border-2 border-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={payment.image}
                                    alt="Payment receipt"
                                    className="w-full max-h-64 object-contain bg-white"
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={confirmApproveOpen}
                onOpenChange={setConfirmApproveOpen}
            >
                <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/10 p-6 max-w-sm shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase italic">
                            Approve{" "}
                            <span className="text-secondarycolor not-italic">
                                Payment
                            </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                            This payment of{" "}
                            <span className="text-primarycolor font-black">
                                {payment.amount.toLocaleString()} ETB
                            </span>{" "}
                            will be marked as APPROVED.
                            <span className="text-rose-600 font-black">
                                {" "}
                                You cannot reverse this action.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 pt-2">
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                className="h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex-1"
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={handleApprove}
                                disabled={isApproving}
                                className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] flex-1"
                            >
                                {isApproving ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="size-4" />
                                )}
                                Confirm & Approve
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default function PrinterPaymentsTable({
    payments,
}: {
    payments: PrinterPaymentEntry[]
}) {
    const { formatDateTime } = useCalendar()
    const [sorting, setSorting] = useState<SortingState>([])
    const [selected, setSelected] = useState<PrinterPaymentEntry | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)

    const [statusFilter, setStatusFilter] = useState("ALL")
    const [printerFilter, setPrinterFilter] = useState("ALL")
    const [shopFilter, setShopFilter] = useState("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [printOpen, setPrintOpen] = useState(false)

    const printers = useMemo(() => {
        const map = new Map<string, string>()
        payments.forEach((p) => map.set(p.printerName, p.printerLocation ?? ""))
        return Array.from(map.entries()).sort((a, b) =>
            a[0].localeCompare(b[0])
        )
    }, [payments])

    const shops = useMemo(() => {
        return Array.from(
            new Set(payments.map((p) => p.shopName))
        ).sort((a, b) => a.localeCompare(b))
    }, [payments])

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        return payments.filter((p) => {
            if (statusFilter !== "ALL" && p.status !== statusFilter) {
                return false
            }
            if (printerFilter !== "ALL" && p.printerName !== printerFilter) {
                return false
            }
            if (shopFilter !== "ALL" && p.shopName !== shopFilter) {
                return false
            }
            if (q) {
                const orderRef = p.orderId ? `#ord-${p.orderId}` : ""
                const haystack =
                    `${p.printerName} ${p.shopName} ${p.orderId ?? ""} ${orderRef}`.toLowerCase()
                if (!haystack.includes(q)) return false
            }
            return true
        })
    }, [payments, statusFilter, printerFilter, shopFilter, searchQuery])

    const columns = useMemo<ColumnDef<PrinterPaymentEntry>[]>(
        () => [
            {
                id: "printer",
                header: "Printer",
                accessorKey: "printerName",
                cell: ({ row }) => (
                    <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">
                            {row.original.printerName}
                        </p>
                        {row.original.printerLocation && (
                            <p className="text-[10px] font-bold text-muted-foreground truncate">
                                {row.original.printerLocation}
                            </p>
                        )}
                    </div>
                ),
            },
            {
                id: "order",
                header: "Order",
                accessorKey: "orderId",
                cell: ({ row }) => (
                    <span className="text-sm font-bold text-slate-700">
                        {row.original.orderId ? (
                            <>#ORD-{row.original.orderId}</>
                        ) : (
                            <span className="text-slate-300 italic">—</span>
                        )}
                    </span>
                ),
            },
            {
                id: "shop",
                header: "Shop",
                accessorKey: "shopName",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.shopName}
                    </span>
                ),
            },
            {
                id: "amount",
                header: "Amount",
                accessorKey: "amount",
                cell: ({ row }) => (
                    <span className="text-right font-black text-sm text-primarycolor block whitespace-nowrap">
                        {row.original.amount.toLocaleString()}{" "}
                        <span className="text-[9px]">ETB</span>
                    </span>
                ),
            },
            {
                id: "status",
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => (
                    <StatusLetter status={row.original.status} />
                ),
            },
            {
                id: "created",
                header: "When",
                accessorKey: "createdAt",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600 whitespace-nowrap">
                        {formatDateTime(new Date(row.original.createdAt))}
                    </span>
                ),
            },
            {
                id: "printerMemo",
                header: "Memo",
                accessorKey: "printerPaymentMemo",
                cell: ({ row }) => (
                    <MemoMark memo={row.original.printerPaymentMemo} />
                ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelected(row.original)
                                setDetailOpen(true)
                            }}
                            className="h-8 rounded-lg border-2 border-primarycolor/20 text-primarycolor hover:bg-primarycolor hover:text-white font-black text-[9px] uppercase tracking-widest gap-1"
                        >
                            <Eye className="size-3.5" /> Detail
                        </Button>
                    </div>
                ),
            },
        ],
        [formatDateTime]
    )

    const table = useReactTable({
        data: filtered,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    })

    useEffect(() => {
        table.setPageIndex(0)
    }, [statusFilter, printerFilter, shopFilter, searchQuery, table])

    const hasActiveFilters =
        statusFilter !== "ALL" ||
        printerFilter !== "ALL" ||
        shopFilter !== "ALL" ||
        searchQuery.trim() !== ""

    const clearFilters = () => {
        setStatusFilter("ALL")
        setPrinterFilter("ALL")
        setShopFilter("ALL")
        setSearchQuery("")
    }

    const totalAmount = useMemo(
        () => filtered.reduce((sum, p) => sum + p.amount, 0),
        [filtered]
    )

    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Wallet className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-bold text-xs uppercase tracking-widest">
                    No printer payments yet
                </p>
            </div>
        )
    }

    return (
        <div>
            {/* Filters */}
            <div className="p-4 md:p-5 border-b border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center gap-2 text-primarycolor flex-1">
                    <SlidersHorizontal className="size-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                        Filter Payments
                    </h3>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setPrintOpen(true)}
                    className="h-9 rounded-xl border-2 border-primarycolor/20 bg-white text-primarycolor hover:bg-primarycolor hover:text-white font-black text-[9px] uppercase tracking-widest gap-1.5 shadow-sm"
                >
                    <Printer className="size-3.5" /> Print
                </Button>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search printer, shop, or order..."
                            className="h-11 pl-10 rounded-xl border-2 border-slate-200 bg-white font-bold text-sm focus:border-primarycolor focus:ring-primarycolor/10 shadow-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:w-[540px]">
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="h-11 rounded-xl border-2 border-slate-200 bg-white font-bold text-xs shadow-sm">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl p-1.5 border-2 bg-white">
                                <SelectItem value="ALL" className="rounded-xl h-10 font-bold text-xs">
                                    All Status
                                </SelectItem>
                                <SelectItem value="APPROVED" className="rounded-xl h-10 font-bold text-xs">
                                    <span className="flex items-center gap-2">
                                        <StatusLetter status="APPROVED" /> Approved
                                    </span>
                                </SelectItem>
                                <SelectItem value="PENDING" className="rounded-xl h-10 font-bold text-xs">
                                    <span className="flex items-center gap-2">
                                        <StatusLetter status="PENDING" /> Pending
                                    </span>
                                </SelectItem>
                                <SelectItem value="REJECTED" className="rounded-xl h-10 font-bold text-xs">
                                    <span className="flex items-center gap-2">
                                        <StatusLetter status="REJECTED" /> Rejected
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <SearchableSelect
                            value={printerFilter}
                            onValueChange={setPrinterFilter}
                            options={[
                                { value: "ALL", label: "All Printers" },
                                ...printers.map(([name]) => ({
                                    value: name,
                                    label: name,
                                })),
                            ]}
                            placeholder="Printer"
                        />

                        <SearchableSelect
                            value={shopFilter}
                            onValueChange={setShopFilter}
                            options={[
                                { value: "ALL", label: "All Shops" },
                                ...shops.map((s) => ({
                                    value: s,
                                    label: s,
                                })),
                            ]}
                            placeholder="Shop"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span className="text-primarycolor">
                            {filtered.length}
                        </span>{" "}
                        of {payments.length} payments ·{" "}
                        <span className="text-primarycolor">
                            {totalAmount.toLocaleString()} ETB
                        </span>
                    </p>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black text-[9px] uppercase tracking-widest gap-1"
                        >
                            <RotateCcw className="size-3" /> Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Wallet className="h-10 w-10 mb-3 opacity-40" />
                    <p className="font-bold text-xs uppercase tracking-widest">
                        No payments match your filters
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="mt-4 h-9 rounded-xl border-2 border-primarycolor/20 text-primarycolor hover:bg-primarycolor hover:text-white font-black text-[9px] uppercase tracking-widest"
                    >
                        <RotateCcw className="size-3 mr-1" /> Clear Filters
                    </Button>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow
                                        key={hg.id}
                                        className="border-b-2 border-primarycolor/15 bg-primarycolor/5"
                                    >
                                        {hg.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    "font-black text-[10px] uppercase tracking-widest text-primarycolor h-11 whitespace-nowrap",
                                                    header.id === "amount" &&
                                                        "text-right",
                                                    header.id === "actions" &&
                                                        "w-24"
                                                )}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
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
                                        className="border-b border-slate-100 hover:bg-primarycolor/[0.03] transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-3.5"
                                            >
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
                    </div>

                    {/* Mobile Cards */}
                    <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                        {table.getRowModel().rows.map((row) => {
                            const item = row.original
                            return (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border-2 border-slate-100 p-4 space-y-3 bg-white shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-black text-primarycolor text-sm leading-tight truncate">
                                                {item.printerName}
                                            </p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate mt-0.5">
                                                {item.shopName}
                                            </p>
                                        </div>
                                        <StatusLetter status={item.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                Amount
                                            </p>
                                            <p className="font-black text-primarycolor">
                                                {item.amount.toLocaleString()} ETB
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                Order
                                            </p>
                                            <p className="font-bold text-slate-700">
                                                {item.orderId ? `#ORD-${item.orderId}` : "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                When
                                            </p>
                                            <p className="font-bold text-slate-700 text-xs leading-relaxed">
                                                {formatDateTime(new Date(item.createdAt))}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                Memo
                                            </p>
                                            <MemoMark memo={item.printerPaymentMemo} />
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelected(item)
                                            setDetailOpen(true)
                                        }}
                                        className="w-full h-9 rounded-xl border-2 border-primarycolor/20 text-primarycolor hover:bg-primarycolor hover:text-white font-black text-[9px] uppercase tracking-widest gap-1"
                                    >
                                        <Eye className="size-3.5" /> View Details
                                    </Button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {table.getRowModel().rows.length} of{" "}
                            {filtered.length} records
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
                </>
            )}

            <DetailDialog
                payment={selected}
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                formatDateTime={formatDateTime}
            />

            {printOpen && (
                <PrintPaymentsDialog
                    payments={filtered}
                    printers={printers}
                    shops={shops}
                    defaultStatus={statusFilter}
                    defaultPrinter={printerFilter}
                    defaultShop={shopFilter}
                    open={printOpen}
                    onClose={() => setPrintOpen(false)}
                />
            )}
        </div>
    )
}