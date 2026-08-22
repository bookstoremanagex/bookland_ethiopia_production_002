"use client"

import { useMemo, useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import { SearchableSelect } from "./PrinterPaymentsTable"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { formatDateLong } from "@/lib/calendar-utils"
import {
    Printer as PrinterIcon,
    Loader2,
    FileText,
    X,
} from "lucide-react"

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
    count?: number
    entries?: Array<{
        id: number
        amount: number
        memo: string | null
        status: string
        createdAt: string
        updatedAt: string
    }>
}

type FontSizeKey = "XS" | "S" | "M" | "B" | "XL"
type DateFormatKey = "ethiopian" | "gregorian"
type MemoMode = "own-line" | "column" | "hidden"

const FONT_OPTIONS: { key: FontSizeKey; label: string }[] = [
    { key: "XS", label: "Extra Small" },
    { key: "S", label: "Small" },
    { key: "M", label: "Medium" },
    { key: "B", label: "Big" },
    { key: "XL", label: "Extra Big" },
]

const FONT_PREVIEW_CLASS: Record<FontSizeKey, string> = {
    XS: "text-[10px]",
    S: "text-xs",
    M: "text-sm",
    B: "text-base",
    XL: "text-lg",
}

const FONT_PRINT_PX: Record<FontSizeKey, number> = {
    XS: 8,
    S: 9,
    M: 10,
    B: 11,
    XL: 12,
}

const DATE_FORMAT_OPTIONS: { key: DateFormatKey; label: string }[] = [
    { key: "ethiopian", label: "Ethiopian (ግንቦት 5, 2018)" },
    { key: "gregorian", label: "Gregorian (Aug 19, 2026)" },
]

const MEMO_OPTIONS: { key: MemoMode; label: string }[] = [
    { key: "own-line", label: "Own Line" },
    { key: "column", label: "Column" },
    { key: "hidden", label: "Hidden" },
]

function escHtml(s: unknown): string {
    return String(s ?? "").replace(/[&<>"']/g, (c) => {
        const map: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        }
        return map[c]
    })
}

function statusLabel(status: string): string {
    if (status === "APPROVED") return "Approved"
    if (status === "REJECTED") return "Rejected"
    return "Pending"
}

function StatusPill({ status }: { status: string }) {
    const isApproved = status === "APPROVED"
    const isRejected = status === "REJECTED"
    return (
        <span
            className={cn(
                "inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap",
                isApproved
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : isRejected
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
            )}
        >
            {statusLabel(status)}
        </span>
    )
}

function PrintPaymentsDialog({
    payments,
    printers,
    shops,
    defaultStatus,
    defaultPrinter,
    defaultShop,
    defaultViewMode = "grouped",
    open,
    onClose,
}: {
    payments: PrinterPaymentEntry[]
    printers: [string, string][]
    shops: string[]
    defaultStatus: string
    defaultPrinter: string
    defaultShop: string
    defaultViewMode?: "grouped" | "all"
    open: boolean
    onClose: () => void
}) {
    const [status, setStatus] = useState(defaultStatus)
    const [printer, setPrinter] = useState(defaultPrinter)
    const [shop, setShop] = useState(defaultShop)
    const [printViewMode, setPrintViewMode] = useState<"grouped" | "all">(defaultViewMode)
    const [fontSize, setFontSize] = useState<FontSizeKey>("M")
    const [memoMode, setMemoMode] = useState<MemoMode>("own-line")
    const [allBold, setAllBold] = useState(false)
    const [dateFormat, setDateFormat] = useState<DateFormatKey>("ethiopian")
    const [showPrinter, setShowPrinter] = useState(true)
    const [showOrder, setShowOrder] = useState(true)
    const [showShop, setShowShop] = useState(true)
    const [showStatus, setShowStatus] = useState(true)
    const [printTitle, setPrintTitle] = useState("Printer Payments Report")
    const [printSubtitle, setPrintSubtitle] = useState("")
    const [isPrinting, setIsPrinting] = useState(false)

    useEffect(() => {
        if (open) setPrintViewMode(defaultViewMode)
    }, [open, defaultViewMode])

    const individualFiltered = useMemo(() => {
        return payments.filter((p) => {
            if (status !== "ALL" && p.status !== status) return false
            if (printer !== "ALL" && p.printerName !== printer) return false
            if (shop !== "ALL" && p.shopName !== shop) return false
            return true
        })
    }, [payments, status, printer, shop])

    const groupedForPrint = useMemo(() => {
        const map = new Map<string, PrinterPaymentEntry>()
        for (const p of individualFiltered) {
            const key = `${p.orderId ?? "no-order"}__${p.printerName}`
            const existing = map.get(key)
            if (existing) {
                existing.amount += p.amount
                const entry = p.entries?.[0] ?? { id: p.id, amount: p.amount, memo: p.memo, status: p.status, createdAt: p.createdAt, updatedAt: p.updatedAt }
                existing.entries = [...(existing.entries || []), entry]
                if (new Date(p.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
                    existing.createdAt = p.createdAt
                    existing.updatedAt = p.updatedAt
                    existing.status = p.status
                    existing.memo = p.memo || existing.memo
                    existing.printerPaymentMemo = p.printerPaymentMemo || existing.printerPaymentMemo
                }
                existing.count = (existing.count || 1) + 1
            } else {
                map.set(key, {
                    ...p,
                    entries: p.entries ? [...p.entries] : [{ id: p.id, amount: p.amount, memo: p.memo, status: p.status, createdAt: p.createdAt, updatedAt: p.updatedAt }],
                    count: p.count ?? 1,
                } as PrinterPaymentEntry)
            }
        }
        for (const g of map.values()) {
            if (g.entries) g.entries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
        return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [individualFiltered])

    const data = printViewMode === "grouped" ? groupedForPrint : individualFiltered

    const totalAmount = useMemo(
        () => data.reduce((sum, p) => sum + p.amount, 0),
        [data]
    )

    const colCount =
        (showPrinter ? 1 : 0) +
        (showOrder ? 1 : 0) +
        (showShop ? 1 : 0) +
        1 +
        (showStatus ? 1 : 0) +
        1

    const now = new Date()
    const ethDate = formatDateLong(now, "ethiopian")
    const greDate = formatDateLong(now, "gregorian")

    const fontClass = FONT_PREVIEW_CLASS[fontSize]

    const handlePrint = () => {
        const filterLabel = [
            status === "ALL" ? null : `Status: ${statusLabel(status)}`,
            printer === "ALL" ? null : `Printer: ${printer}`,
            shop === "ALL" ? null : `Shop: ${shop}`,
        ]
            .filter(Boolean)
            .join("   |   ")

        const colDefs = [
            { label: "Printer", show: showPrinter },
            { label: "Order", show: showOrder },
            { label: "Shop", show: showShop },
            { label: "Amount", show: true },
            { label: "Status", show: showStatus },
            { label: "Recorded", show: true },
        ].filter((c) => c.show)
        if (memoMode === "column") {
            colDefs.push({ label: "Memo", show: true })
        }

        const headerHtml = colDefs
            .map((c) => `<th>${c.label}</th>`)
            .join("")

        const rowsHtml = data
            .map((p) => {
                const cells: string[] = []
                if (showPrinter) {
                    cells.push(`<td>${escHtml(p.printerName)}</td>`)
                }
                if (showOrder) {
                    cells.push(
                        `<td>${p.orderId ? `#ORD-${p.orderId}` : "—"}</td>`
                    )
                }
                if (showShop) {
                    cells.push(`<td>${escHtml(p.shopName)}</td>`)
                }
                cells.push(`<td>${p.amount.toLocaleString()} ETB</td>`)
                if (showStatus) {
                    cells.push(`<td>${statusLabel(p.status)}</td>`)
                }
                cells.push(
                    `<td>${escHtml(
                        formatDateLong(new Date(p.createdAt), dateFormat)
                    )}</td>`
                )
                if (memoMode === "column") {
                    cells.push(
                        `<td>${escHtml(p.printerPaymentMemo || "—")}</td>`
                    )
                }

                const memoRow =
                    memoMode === "own-line" && p.printerPaymentMemo
                        ? `<tr class="memo-row"><td colspan="${colDefs.length}"><span class="memo-label">Memo:</span> ${escHtml(
                              p.printerPaymentMemo
                          )}</td></tr>`
                        : ""
                return `<tr>${cells.join("")}</tr>${memoRow}`
            })
            .join("")

        const px = FONT_PRINT_PX[fontSize]
        const subtitleHtml = printSubtitle.trim()
            ? `<div class="subtitle">${escHtml(printSubtitle)}</div>`
            : ""

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${escHtml(printTitle || "Printer Payments Report")}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #0a0a0a; }
        .report-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0; }
        h1 { font-size: 20px; font-weight: 800; color: #0a0a0a; }
        .subtitle { font-size: 12px; font-weight: 600; color: #0a0a0a; margin-top: 3px; }
        .dates { text-align: right; font-size: 10px; font-weight: 700; color: #0a0a0a; line-height: 1.7; }
        .filters { margin-bottom: 12px; font-size: 10px; font-weight: 700; color: #0a0a0a; letter-spacing: 0.06em; }
        .summary { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; justify-content: center; }
        .summary-item { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 18px; text-align: center; min-width: 110px; }
        .summary-item label { display: block; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #0a0a0a; margin-bottom: 3px; }
        .summary-item span { font-size: 16px; font-weight: 800; color: #0a0a0a; }
        table { width: 100%; border-collapse: collapse; font-size: ${px}px; }
        th { background: #f1f5f9; padding: 9px 10px; border: 1px solid #cbd5e1; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #0a0a0a; text-align: center; }
        td { padding: 7px 10px; border: 1px solid #cbd5e1; vertical-align: middle; text-align: center; }
        tr:nth-child(even) td { background: #fbfdff; }
        tr.memo-row td { background: #f5f5f5 !important; color: #0a0a0a; font-weight: 700; font-style: italic; border-top: none; }
        .memo-label { font-weight: 800; text-transform: uppercase; font-size: 0.85em; }
        .footer { margin-top: 16px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 10px; font-weight: 700; color: #0a0a0a; text-align: center; }
        ${allBold ? "* { font-weight: 800 !important; }" : ""}
        @page { size: A4 portrait; margin: 15mm; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="report-header">
        <div>
            <h1>${escHtml(printTitle || "Printer Payments Report")}</h1>
            ${subtitleHtml}
        </div>
        <div class="dates">
            <div><strong>Ethiopian:</strong> ${escHtml(ethDate)}</div>
            <div><strong>Gregorian:</strong> ${escHtml(greDate)}</div>
        </div>
    </div>

    <div class="filters">${filterLabel ? escHtml(filterLabel) : "All payments"}</div>

    <div class="summary">
        <div class="summary-item"><label>Records</label><span>${data.length}</span></div>
        <div class="summary-item"><label>Total</label><span>${totalAmount.toLocaleString()} ETB</span></div>
    </div>

    <table>
        <thead>
            <tr>${headerHtml}</tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
    </table>

    <div class="footer">${escHtml(greDate)}</div>
</body>
</html>`

        const printWindow = window.open("", "_blank", "width=1100,height=800")
        if (!printWindow) {
            toast.error("Pop-up blocked. Allow pop-ups to print.")
            return
        }
        setIsPrinting(true)
        printWindow.document.write(html)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
            printWindow.print()
            setIsPrinting(false)
        }, 300)
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-5xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
                <DialogHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <PrinterIcon className="size-5 md:size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-lg md:text-xl font-black text-primarycolor uppercase italic truncate">
                                Print Payments
                            </DialogTitle>
                            <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                                {data.length} records ·{" "}
                                {totalAmount.toLocaleString()} ETB
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/60 p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                                Printing Settings
                            </p>
                            <div className="space-y-2.5">
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                            Status
                                        </p>
                                        <Select
                                            value={status}
                                            onValueChange={setStatus}
                                        >
                                            <SelectTrigger className="h-10 rounded-xl border-2 border-slate-200 bg-white font-bold text-xs shadow-sm">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl p-1.5 border-2 bg-white">
                                                <SelectItem
                                                    value="ALL"
                                                    className="rounded-xl h-9 font-bold text-xs"
                                                >
                                                    All Status
                                                </SelectItem>
                                                <SelectItem
                                                    value="APPROVED"
                                                    className="rounded-xl h-9 font-bold text-xs"
                                                >
                                                    Approved
                                                </SelectItem>
                                                <SelectItem
                                                    value="PENDING"
                                                    className="rounded-xl h-9 font-bold text-xs"
                                                >
                                                    Pending
                                                </SelectItem>
                                                <SelectItem
                                                    value="REJECTED"
                                                    className="rounded-xl h-9 font-bold text-xs"
                                                >
                                                    Rejected
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                            Shop
                                        </p>
                                        <SearchableSelect
                                            value={shop}
                                            onValueChange={setShop}
                                            options={[
                                                {
                                                    value: "ALL",
                                                    label: "All Shops",
                                                },
                                                ...shops.map((s) => ({
                                                    value: s,
                                                    label: s,
                                                })),
                                            ]}
                                            placeholder="Shop"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                        Printer
                                    </p>
                                    <SearchableSelect
                                        value={printer}
                                        onValueChange={setPrinter}
                                        options={[
                                            {
                                                value: "ALL",
                                                label: "All Printers",
                                            },
                                            ...printers.map(([name]) => ({
                                                value: name,
                                                label: name,
                                            })),
                                        ]}
                                        placeholder="Printer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/60 p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                                Print Details
                            </p>
                            <div className="space-y-2.5">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                        Title
                                    </p>
                                    <Input
                                        value={printTitle}
                                        onChange={(e) =>
                                            setPrintTitle(e.target.value)
                                        }
                                        placeholder="Print title"
                                        className="h-10 rounded-xl border-2 border-slate-200 bg-white font-bold text-xs shadow-sm"
                                    />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                        Subtitle
                                    </p>
                                    <Input
                                        value={printSubtitle}
                                        onChange={(e) =>
                                            setPrintSubtitle(e.target.value)
                                        }
                                        placeholder="Print subtitle (optional)"
                                        className="h-10 rounded-xl border-2 border-slate-200 bg-white font-bold text-xs shadow-sm"
                                    />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                        Recorded Date
                                    </p>
                                    <Select
                                        value={dateFormat}
                                        onValueChange={(v) =>
                                            setDateFormat(
                                                v as DateFormatKey
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-2 border-slate-200 bg-white font-bold text-xs shadow-sm">
                                            <SelectValue placeholder="Date format" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl p-1.5 border-2 bg-white">
                                            {DATE_FORMAT_OPTIONS.map((o) => (
                                                <SelectItem
                                                    key={o.key}
                                                    value={o.key}
                                                    className="rounded-xl h-9 font-bold text-xs"
                                                >
                                                    {o.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/60 p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                                Print Mode
                            </p>
                            <div className="flex items-center gap-2 p-1 rounded-xl bg-white border-2 border-slate-200 w-fit">
                                <Button
                                    variant={printViewMode === "grouped" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setPrintViewMode("grouped")}
                                    className={cn("h-7 rounded-lg font-black text-[9px] uppercase tracking-widest px-3", printViewMode === "grouped" ? "bg-primarycolor text-white shadow-sm" : "text-muted-foreground hover:text-primarycolor")}
                                >
                                    Grouped by Order
                                </Button>
                                <Button
                                    variant={printViewMode === "all" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setPrintViewMode("all")}
                                    className={cn("h-7 rounded-lg font-black text-[9px] uppercase tracking-widest px-3", printViewMode === "all" ? "bg-primarycolor text-white shadow-sm" : "text-muted-foreground hover:text-primarycolor")}
                                >
                                    List All
                                </Button>
                            </div>
                            <p className="text-[9px] font-bold text-muted-foreground">Grouped merges same order + printer (sum amount). List All shows each payment individually.</p>
                        </div>

                        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/60 p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                                Columns
                            </p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {[
                                    {
                                        id: "print-col-printer",
                                        label: "Printer",
                                        checked: showPrinter,
                                        set: setShowPrinter,
                                    },
                                    {
                                        id: "print-col-order",
                                        label: "Order ID",
                                        checked: showOrder,
                                        set: setShowOrder,
                                    },
                                    {
                                        id: "print-col-shop",
                                        label: "Shop",
                                        checked: showShop,
                                        set: setShowShop,
                                    },
                                    {
                                        id: "print-col-status",
                                        label: "Status",
                                        checked: showStatus,
                                        set: setShowStatus,
                                    },
                                ].map((col) => (
                                    <div
                                        key={col.id}
                                        className="flex items-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white p-3"
                                    >
                                        <Checkbox
                                            id={col.id}
                                            checked={col.checked}
                                            onCheckedChange={(v) =>
                                                col.set(v === true)
                                            }
                                            className="border-slate-300 data-[state=checked]:bg-primarycolor data-[state=checked]:border-primarycolor"
                                        />
                                        <label
                                            htmlFor={col.id}
                                            className="text-xs font-bold text-slate-700 cursor-pointer"
                                        >
                                            {col.label}
                                        </label>
                                    </div>
                                ))}
                                <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 col-span-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                                        Memo Display
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {MEMO_OPTIONS.map((opt) => (
                                            <Button
                                                key={opt.key}
                                                variant="outline"
                                                onClick={() =>
                                                    setMemoMode(opt.key)
                                                }
                                                className={cn(
                                                    "h-9 rounded-lg border-2 font-black text-[9px] uppercase tracking-widest px-3",
                                                    memoMode === opt.key
                                                        ? "bg-primarycolor text-white border-primarycolor hover:bg-secondarycolor"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                {opt.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/60 p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                                Font Size
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {FONT_OPTIONS.map((opt) => (
                                    <Button
                                        key={opt.key}
                                        variant="outline"
                                        onClick={() => setFontSize(opt.key)}
                                        className={cn(
                                            "h-10 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest px-3",
                                            fontSize === opt.key
                                                ? "bg-primarycolor text-white border-primarycolor hover:bg-secondarycolor"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white p-3">
                                <Checkbox
                                    id="print-all-bold"
                                    checked={allBold}
                                    onCheckedChange={(v) =>
                                        setAllBold(v === true)
                                    }
                                    className="border-slate-300 data-[state=checked]:bg-primarycolor data-[state=checked]:border-primarycolor"
                                />
                                <label
                                    htmlFor="print-all-bold"
                                    className="text-xs font-bold text-slate-700 cursor-pointer"
                                >
                                    Make all text bold
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border-2 border-slate-100 bg-white overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-primarycolor">
                                    <FileText className="size-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        Print Preview
                                    </p>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {data.length} records ·{" "}
                                    {totalAmount.toLocaleString()} ETB
                                </p>
                            </div>
                            <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-3">
                                <div>
                                    <p className="font-black text-base text-slate-800 leading-tight">
                                        {printTitle ||
                                            "Printer Payments Report"}
                                    </p>
                                    {printSubtitle.trim() && (
                                        <p className="text-xs font-bold text-muted-foreground mt-0.5">
                                            {printSubtitle}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right text-[9px] font-bold text-muted-foreground leading-relaxed">
                                    <p>Ethiopian: {ethDate}</p>
                                    <p>Gregorian: {greDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto max-h-[34vh] overflow-y-auto">
                            <Table className={cn(fontClass)}>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        {showPrinter && (
                                            <TableHead className="whitespace-nowrap">
                                                Printer
                                            </TableHead>
                                        )}
                                        {showOrder && (
                                            <TableHead className="whitespace-nowrap">
                                                Order
                                            </TableHead>
                                        )}
                                        {showShop && (
                                            <TableHead className="whitespace-nowrap">
                                                Shop
                                            </TableHead>
                                        )}
                                        <TableHead className="whitespace-nowrap text-right">
                                            Amount
                                        </TableHead>
                                        {showStatus && (
                                            <TableHead className="whitespace-nowrap">
                                                Status
                                            </TableHead>
                                        )}
                                        <TableHead className="whitespace-nowrap">
                                            Recorded
                                        </TableHead>
                                        {memoMode === "column" && (
                                            <TableHead className="whitespace-nowrap">
                                                Memo
                                            </TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((p) => (
                                        <FragmentRow
                                            key={p.id}
                                            entry={p}
                                            memoMode={memoMode}
                                            colCount={colCount}
                                            showPrinter={showPrinter}
                                            showOrder={showOrder}
                                            showShop={showShop}
                                            showStatus={showStatus}
                                            dateFormat={dateFormat}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                            {data.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <FileText className="size-8 mb-2 opacity-40" />
                                    <p className="font-bold text-xs uppercase tracking-widest">
                                        No payments match these settings
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="shrink-0 p-4 md:p-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-12 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest gap-1.5 px-6"
                    >
                        <X className="size-4" /> Close
                    </Button>
                    <Button
                        onClick={handlePrint}
                        disabled={isPrinting || data.length === 0}
                        className="h-12 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest gap-1.5 px-6"
                    >
                        {isPrinting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <PrinterIcon className="size-4" />
                        )}
                        Print
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function FragmentRow({
    entry,
    memoMode,
    colCount,
    showPrinter,
    showOrder,
    showShop,
    showStatus,
    dateFormat,
}: {
    entry: PrinterPaymentEntry
    memoMode: MemoMode
    colCount: number
    showPrinter: boolean
    showOrder: boolean
    showShop: boolean
    showStatus: boolean
    dateFormat: DateFormatKey
}) {
    return (
        <>
            <TableRow className="hover:bg-slate-50">
                {showPrinter && (
                    <TableCell className="font-bold whitespace-nowrap">
                        {entry.printerName}
                    </TableCell>
                )}
                {showOrder && (
                    <TableCell className="font-bold whitespace-nowrap">
                        {entry.orderId ? `#ORD-${entry.orderId}` : "—"}
                    </TableCell>
                )}
                {showShop && (
                    <TableCell className="whitespace-nowrap">
                        {entry.shopName}
                    </TableCell>
                )}
                <TableCell className="text-right font-black whitespace-nowrap">
                    {entry.amount.toLocaleString()} ETB
                </TableCell>
                {showStatus && (
                    <TableCell className="whitespace-nowrap">
                        <StatusPill status={entry.status} />
                    </TableCell>
                )}
                <TableCell className="whitespace-nowrap">
                    {formatDateLong(new Date(entry.createdAt), dateFormat)}
                </TableCell>
                {memoMode === "column" && (
                    <TableCell className="break-words min-w-[140px]">
                        {entry.printerPaymentMemo || "—"}
                    </TableCell>
                )}
            </TableRow>
            {memoMode === "own-line" && entry.printerPaymentMemo && (
                <TableRow className="hover:bg-transparent">
                    <TableCell
                        colSpan={colCount}
                        className="bg-indigo-50/60 text-indigo-700 italic font-bold text-xs break-words border-t-0"
                    >
                        <span className="font-black uppercase tracking-widest not-italic text-[9px]">
                            Memo:{" "}
                        </span>
                        {entry.printerPaymentMemo}
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

export default PrintPaymentsDialog