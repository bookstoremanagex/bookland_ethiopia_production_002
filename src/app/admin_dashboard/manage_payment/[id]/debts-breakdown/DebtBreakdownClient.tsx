"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    BarChart3,
    ListOrdered,
    Repeat,
    Banknote,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import { formatDate as formatCalendarDate } from "@/lib/calendar-utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ManageOrderDetailsModal from "@/app/admin_dashboard/manage_orders/ManageOrderDetailsModal";
import { getOrderById } from "@/app/actions/order-actions";
import type { AdminOrder } from "@/app/admin_dashboard/manage_orders/ManageOrdersPageContent";

const formatAmount = (n: number) =>
    Number.isInteger(n)
        ? n.toLocaleString()
        : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface OrderRow {
    id: number;
    order_type: string;
    total_amount: number;
    amount_paid: number;
    status: string;
    is_approved: boolean;
    createdAt: string | Date;
}

interface PaymentRow {
    id: number;
    amount: number;
    payment_type: string;
    status: string;
    createdAt: string | Date;
    orderid: string | null;
    memo: string | null;
    check: { id: number; bankname: string | null; username: string | null; amount: string | null; status: string } | null;
}

interface RoundRecordRow {
    id: number;
    totalprice: number;
    status: string;
    createdAt: string | Date;
    RoundBooks?: { book?: { title?: string | null } | null } | null;
}

interface RoundPaymentRow {
    id: number;
    amount: number;
    payment_type: string;
    status: string;
    createdAt: string | Date;
    memo: string | null;
    check: { id: number; bankname: string | null; username: string | null; amount: string | null; status: string } | null;
    roundrecord?: { RoundBooks?: { book?: { title?: string | null } | null } | null } | null;
}

interface Props {
    shopId: number;
    shopName: string;
    orders: OrderRow[];
    payments: PaymentRow[];
    roundRecords: RoundRecordRow[];
    roundPayments: RoundPaymentRow[];
}

export default function DebtBreakdownClient({ shopId, shopName, orders, payments, roundRecords, roundPayments }: Props) {
    const { formatDate } = useCalendar();

    // Local editable copy so approve/update/delete from the details modal reflects here
    const [orderList, setOrderList] = useState<OrderRow[]>(orders);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    const requestedOrders = useMemo(
        () => orderList.filter((o) => o.order_type === "requested" && o.is_approved),
        [orderList]
    );
    const roundOrders = useMemo(
        () => orderList.filter((o) => o.order_type === "on round"),
        [orderList]
    );

    const orderDebt = useMemo(() => requestedOrders.reduce((s, o) => s + (o.total_amount || 0), 0), [requestedOrders]);
    const roundOrderDebt = useMemo(() => roundOrders.reduce((s, o) => s + (o.total_amount || 0), 0), [roundOrders]);
    const roundsDebt = useMemo(() => roundRecords.reduce((s, r) => s + (r.totalprice || 0), 0), [roundRecords]);
    const totalDebt = orderDebt + roundOrderDebt + roundsDebt;

    // Total Paid = sum of ALL payments in the payment history (order + round), same as the detail card
    const allPaymentItems = useMemo(() => {
        const orderItems = payments.map((p) => ({ ...p, source: "order" as const, bookTitle: null as string | null }));
        const roundItems = roundPayments.map((p) => ({
            ...p,
            source: "round" as const,
            bookTitle: (p.roundrecord?.RoundBooks?.book?.title || "Unknown") as string | null,
        }));
        return [...orderItems, ...roundItems].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [payments, roundPayments]);

    const totalPaid = useMemo(() => allPaymentItems.reduce((s, p) => s + (p.amount || 0), 0), [allPaymentItems]);
    const remaining = totalDebt - totalPaid;

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={cn(
            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
            status === "APPROVED" ? "bg-emerald-100 text-emerald-700"
            : status === "REJECTED" ? "bg-rose-100 text-rose-700"
            : "bg-amber-100 text-amber-700"
        )}>
            {status}
        </span>
    );

    const [memoView, setMemoView] = useState<{ title: string; text: string } | null>(null);

    const openOrderDetails = async (orderId: number) => {
        setLoadingOrderId(orderId);
        try {
            const res = await getOrderById(orderId);
            if (res.success && res.data) {
                setSelectedOrder(res.data as AdminOrder);
                setIsOrderModalOpen(true);
            } else {
                toast.error(res.error || "Failed to fetch order");
            }
        } catch {
            toast.error("An unexpected error occurred while fetching the order");
        } finally {
            setLoadingOrderId(null);
        }
    };

    const OrderIdButton = ({ id }: { id: number }) => (
        <button
            type="button"
            onClick={() => openOrderDetails(id)}
            className="flex items-center gap-1.5 font-black text-primarycolor text-sm hover:text-secondarycolor hover:underline underline-offset-2 transition-colors cursor-pointer"
            title="View order details"
        >
            {loadingOrderId === id && <Loader2 className="size-3 animate-spin" />}
            #ORD-{id}
        </button>
    );

    // ── Print options state ──
    const [printOptionsOpen, setPrintOptionsOpen] = useState(false);
    const [printFontSize, setPrintFontSize] = useState<"extra-big" | "big" | "medium" | "small" | "extra-small">("medium");
    const [printBold, setPrintBold] = useState(false);
    const [printIncludeRequested, setPrintIncludeRequested] = useState(true);
    const [printIncludeRoundOrders, setPrintIncludeRoundOrders] = useState(true);
    const [printIncludeRounds, setPrintIncludeRounds] = useState(true);
    const [printIncludePayments, setPrintIncludePayments] = useState(true);
    const [printIncludeCalc, setPrintIncludeCalc] = useState(true);

    const printFontMap: Record<typeof printFontSize, string> = {
        "extra-big": "22px",
        "big": "18px",
        "medium": "15px",
        "small": "12px",
        "extra-small": "10px",
    };

    const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const handleDebtPrint = () => {
        const fontSize = parseInt(printFontMap[printFontSize]);
        const weight = printBold ? "700" : "400";
        const now = new Date();
        const ethDate = formatCalendarDate(now, "ethiopian", "EEE, MMMM dd, yyyy");
        const gregDate = formatCalendarDate(now, "gregorian", "EEE, MMMM dd, yyyy");

        const sectionHead = (title: string, total: string) => `
            <div class="sec-head"><span>${escHtml(title)}</span><span>${escHtml(total)}</span></div>`;

        const tableShell = (headers: string[], rowsHtml: string, totalLabel: string, totalValue: string) => `
            <table>
                <thead><tr>${headers.map(h => `<th${h === "Total Amount" || h === "Total Price" || h === "Amount" ? ' class="r"' : ""}>${escHtml(h)}</th>`).join("")}</tr></thead>
                <tbody>${rowsHtml}</tbody>
                <tfoot><tr class="total-row"><td colspan="${headers.length - 1}">${escHtml(totalLabel)}</td><td class="r">${escHtml(totalValue)}</td></tr></tfoot>
            </table>`;

        const dateCell = (d: string | Date) => formatDate(new Date(d), "MMM dd, yyyy HH:mm");

        // Section 1: Requested Orders
        const s1 = printIncludeRequested ? `
            ${sectionHead("1. Total Order Debt (Requested)", `${formatAmount(orderDebt)} ETB`)}
            ${tableShell(
                ["Order", "Date", "Total Amount"],
                requestedOrders.length === 0
                    ? `<tr><td colspan="3" class="empty">No approved requested orders</td></tr>`
                    : requestedOrders.map(o => `<tr><td>#ORD-${o.id}</td><td>${dateCell(o.createdAt)}</td><td class="r">${formatAmount(o.total_amount || 0)} ETB</td></tr>`).join(""),
                "Total Order Debt (Requested)",
                `${formatAmount(orderDebt)} ETB`
            )}` : "";

        // Section 2: Round Orders
        const s2 = printIncludeRoundOrders ? `
            ${sectionHead("2. Round Orders Debt", `${formatAmount(roundOrderDebt)} ETB`)}
            ${tableShell(
                ["Order", "Date", "Total Amount"],
                roundOrders.length === 0
                    ? `<tr><td colspan="3" class="empty">No round orders</td></tr>`
                    : roundOrders.map(o => `<tr><td>#ORD-${o.id}</td><td>${dateCell(o.createdAt)}</td><td class="r">${formatAmount(o.total_amount || 0)} ETB</td></tr>`).join(""),
                "Total Round Orders Debt",
                `${formatAmount(roundOrderDebt)} ETB`
            )}` : "";

        // Section 3: Rounds
        const s3 = printIncludeRounds ? `
            ${sectionHead("3. Rounds", `${formatAmount(roundsDebt)} ETB`)}
            ${tableShell(
                ["Round", "Book", "Date", "Total Price"],
                roundRecords.length === 0
                    ? `<tr><td colspan="4" class="empty">No round records</td></tr>`
                    : roundRecords.map(r => `<tr><td>#${r.id}</td><td>${escHtml(r.RoundBooks?.book?.title || "Unknown")}</td><td>${dateCell(r.createdAt)}</td><td class="r">${formatAmount(r.totalprice || 0)} ETB</td></tr>`).join(""),
                "Total Rounds Debt",
                `${formatAmount(roundsDebt)} ETB`
            )}` : "";

        // Section 4: Payments History
        const s4 = printIncludePayments ? `
            ${sectionHead("4. Payments (Payment History)", `${formatAmount(totalPaid)} ETB`)}
            ${tableShell(
                ["Date", "Source", "Type", "Reference", "Memo", "Status", "Amount"],
                allPaymentItems.length === 0
                    ? `<tr><td colspan="7" class="empty">No payments recorded</td></tr>`
                    : allPaymentItems.map(p => {
                        const ref = p.source === "order" && p.orderid
                            ? `#ORD-${p.orderid.replace(/^ORD-/i, "")}`
                            : (p.bookTitle || "—");
                        const memoShort = p.memo ? (p.memo.length > 30 ? `${p.memo.slice(0, 30)}…` : p.memo) : "—";
                        return `<tr><td class="nw">${dateCell(p.createdAt)}</td><td>${p.source === "order" ? "Order" : "Round"}</td><td>${escHtml(p.payment_type)}</td><td>${escHtml(ref)}</td><td>${escHtml(memoShort)}</td><td>${escHtml(p.status)}</td><td class="r">${formatAmount(p.amount || 0)} ETB</td></tr>`;
                    }).join(""),
                "Total Paid",
                `${formatAmount(totalPaid)} ETB`
            )}` : "";

        // Section 5: Debt Calculation
        const s5 = printIncludeCalc ? `
            <div class="sec-head"><span>5. How The Remaining Debt Is Calculated</span><span></span></div>
            <div class="calc">
                <p class="calc-sub">Step 1 — Total Debt (adding the three debts)</p>
                <div class="calc-row"><span>Total Order Debt (Requested)</span><span>${formatAmount(orderDebt)} ETB</span></div>
                <div class="calc-row"><span>+ Round Orders Debt</span><span>${formatAmount(roundOrderDebt)} ETB</span></div>
                <div class="calc-row"><span>+ Rounds</span><span>${formatAmount(roundsDebt)} ETB</span></div>
                <div class="calc-row calc-total"><span>= Total Debt</span><span>${formatAmount(totalDebt)} ETB</span></div>
                <p class="calc-sub">Step 2 — Subtract Total Paid</p>
                <div class="calc-row"><span>Total Debt</span><span>${formatAmount(totalDebt)} ETB</span></div>
                <div class="calc-row"><span>- Total Paid</span><span>${formatAmount(totalPaid)} ETB</span></div>
                <div class="calc-row calc-total"><span>= ${remaining > 0 ? "Remaining Debt" : "Fully Paid"}</span><span>${formatAmount(remaining)} ETB</span></div>
            </div>` : "";

        const printContent = `
<!DOCTYPE html>
<html>
<head>
<title>Debt Breakdown - ${escHtml(shopName)}</title>
<style>
    @page {
        size: A4 portrait;
        margin: 10mm;
        @bottom-center { content: "Page " counter(page); font-size: 9px; color: #555; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: ${fontSize}px;
        font-weight: ${weight};
        color: #111;
        padding: 16px 20px;
    }
    h1 { font-size: ${fontSize + 10}px; font-weight: ${weight}; color: #111; margin-bottom: 2px; }
    .shop { font-size: ${fontSize + 1}px; color: #111; margin-bottom: 6px; }
    .dates { font-size: ${fontSize - 1}px; color: #111; margin-bottom: 10px; }
    .summary { display: flex; justify-content: space-between; border: 2px solid #333; padding: 8px 10px; margin-bottom: 6px; font-size: ${fontSize}px; }
    .sec-head { display: flex; justify-content: space-between; align-items: baseline; margin: 16px 0 6px; border-bottom: 2px solid #333; padding-bottom: 3px; font-size: ${fontSize + 1}px; color: #111; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #eee; border: 1px solid #999; padding: 5px 8px; text-align: left; font-size: ${fontSize - 1}px; font-weight: ${weight}; }
    td { border: 1px solid #bbb; padding: 4px 8px; font-size: ${fontSize}px; }
    .r { text-align: right; white-space: nowrap; }
    .nw { white-space: nowrap; }
    .empty { text-align: center; font-style: italic; padding: 10px; }
    tfoot td { background: #f5f5f5; border-top: 2px solid #999; }
    .calc { border: 1.5px solid #bbb; padding: 10px 12px; margin-bottom: 14px; }
    .calc-sub { font-size: ${fontSize - 1}px; margin: 6px 0 4px; }
    .calc-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: ${fontSize}px; }
    .calc-total { border-top: 1.5px dashed #999; margin-top: 3px; padding-top: 4px; }
</style>
</head>
<body>
    <h1>Debt Breakdown</h1>
    <div class="shop">${escHtml(shopName)}</div>
    <div class="dates">
        <div>Ethiopian: ${ethDate}</div>
        <div>Gregorian: ${gregDate}</div>
    </div>
    <div class="summary">
        <span>Total Debt: ${formatAmount(totalDebt)} ETB</span>
        <span>Total Paid: ${formatAmount(totalPaid)} ETB</span>
        <span>Remaining: ${formatAmount(remaining)} ETB</span>
    </div>
    ${s1}
    ${s2}
    ${s3}
    ${s4}
    ${s5}
</body>
</html>`;

        const printWin = window.open("", "_blank", "width=900,height=700");
        if (!printWin) {
            toast.error("Failed to open print window");
            return;
        }
        printWin.document.write(printContent);
        printWin.document.close();
        printWin.focus();
        printWin.print();
    };

    const MemoCell = ({ memo, title }: { memo: string | null; title: string }) => {
        if (!memo) return <span className="text-[10px] font-bold text-slate-300">—</span>;
        return (
            <button
                type="button"
                onClick={() => setMemoView({ title, text: memo })}
                className="block max-w-[140px] truncate text-left text-[10px] font-bold text-primarycolor hover:text-secondarycolor hover:underline underline-offset-2 transition-colors cursor-pointer"
                title="Click to view full memo"
            >
                {memo}
            </button>
        );
    };

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <Link href={`/admin_dashboard/manage_payment/${shopId}`}>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primarycolor transition-colors w-fit">
                    <ArrowLeft className="size-3.5" /> Back to {shopName}
                </div>
            </Link>

            <div className="flex items-center gap-3 text-primarycolor">
                <BarChart3 className="size-6" />
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic">
                    Debt <span className="text-secondarycolor not-italic">Breakdown</span>
                    <span className="text-sm font-bold text-muted-foreground ml-3 normal-case italic tracking-normal">{shopName}</span>
                </h1>
            </div>

            {/* Print button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => setPrintOptionsOpen(true)}
                    className="h-11 px-6 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/30 gap-2"
                >
                    <Printer className="size-4" /> Print
                </Button>
            </div>

            {/* Remaining summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Debt (Sum of 1-3)</p>
                    <p className="text-base font-black text-primarycolor">{formatAmount(totalDebt)} ETB</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Paid (Payment History)</p>
                    <p className="text-base font-black text-emerald-700">{formatAmount(totalPaid)} ETB</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Remaining (Total Debt - Total Paid)</p>
                    <p className={cn("text-base font-black", remaining > 0 ? "text-rose-700" : "text-emerald-700")}>
                        {formatAmount(remaining)} ETB
                    </p>
                </div>
            </div>

            {/* Section 1: Requested Orders */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-700">
                        <ListOrdered className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">1. Total Order Debt (Requested)</h3>
                    </div>
                    <span className="text-lg font-black text-amber-700">{formatAmount(orderDebt)} ETB</span>
                </div>
                <div className="overflow-x-auto -mx-2 px-2">
                    <Table className="min-w-[480px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requestedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-8">
                                    No approved requested orders
                                </TableCell>
                            </TableRow>
                        ) : (
                            requestedOrders.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell><OrderIdButton id={o.id} /></TableCell>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                                        {formatDate(new Date(o.createdAt), "MMM dd, yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell className="text-right font-black text-sm whitespace-nowrap">{formatAmount(o.total_amount || 0)} ETB</TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow className="bg-amber-50/50">
                            <TableCell colSpan={2} className="font-black text-[10px] uppercase tracking-widest text-amber-700">Total Order Debt (Requested)</TableCell>
                            <TableCell className="text-right font-black text-amber-700 whitespace-nowrap">{formatAmount(orderDebt)} ETB</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
            </div>

            {/* Section 2: Round Orders */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-indigo-700">
                        <ListOrdered className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">2. Round Orders Debt <span className="normal-case font-bold text-muted-foreground tracking-normal">(orders registered in the orders table with round type)</span></h3>
                    </div>
                    <span className="text-lg font-black text-indigo-700">{formatAmount(roundOrderDebt)} ETB</span>
                </div>
                <div className="overflow-x-auto -mx-2 px-2">
                    <Table className="min-w-[480px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roundOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-8">
                                    No round orders
                                </TableCell>
                            </TableRow>
                        ) : (
                            roundOrders.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell><OrderIdButton id={o.id} /></TableCell>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                                        {formatDate(new Date(o.createdAt), "MMM dd, yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell className="text-right font-black text-sm whitespace-nowrap">{formatAmount(o.total_amount || 0)} ETB</TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow className="bg-indigo-50/50">
                            <TableCell colSpan={2} className="font-black text-[10px] uppercase tracking-widest text-indigo-700">Total Round Orders Debt</TableCell>
                            <TableCell className="text-right font-black text-indigo-700 whitespace-nowrap">{formatAmount(roundOrderDebt)} ETB</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
            </div>

            {/* Section 3: Rounds */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-purple-700">
                        <Repeat className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">3. Rounds <span className="normal-case font-bold text-muted-foreground tracking-normal">(round records in the rounds table)</span></h3>
                    </div>
                    <span className="text-lg font-black text-purple-700">{formatAmount(roundsDebt)} ETB</span>
                </div>
                <div className="overflow-x-auto -mx-2 px-2">
                    <Table className="min-w-[560px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Round</TableHead>
                            <TableHead>Book</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Total Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roundRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-8">
                                    No round records
                                </TableCell>
                            </TableRow>
                        ) : (
                            roundRecords.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-black text-primarycolor text-sm">#{r.id}</TableCell>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground">{r.RoundBooks?.book?.title || "Unknown"}</TableCell>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                                        {formatDate(new Date(r.createdAt), "MMM dd, yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell className="text-right font-black text-sm whitespace-nowrap">{formatAmount(r.totalprice || 0)} ETB</TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow className="bg-purple-50/50">
                            <TableCell colSpan={3} className="font-black text-[10px] uppercase tracking-widest text-purple-700">Total Rounds Debt</TableCell>
                            <TableCell className="text-right font-black text-purple-700 whitespace-nowrap">{formatAmount(roundsDebt)} ETB</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
            </div>

            {/* Section 4: Payments table */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-700">
                        <Banknote className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">4. Payments (Payment History)</h3>
                    </div>
                    <span className="text-lg font-black text-emerald-700">{formatAmount(totalPaid)} ETB</span>
                </div>
                <div className="overflow-x-auto -mx-2 px-2">
                    <Table className="min-w-[820px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Memo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allPaymentItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-8">
                                    No payments recorded
                                </TableCell>
                            </TableRow>
                        ) : (
                            allPaymentItems.map((p) => (
                                <TableRow key={`${p.source}-${p.id}`}>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                                        {formatDate(new Date(p.createdAt), "MMM dd, yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                            p.source === "order" ? "bg-indigo-100 text-indigo-600" : "bg-purple-100 text-purple-600"
                                        )}>
                                            {p.source === "order" ? "Order" : "Round"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-bold">{p.payment_type}</TableCell>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground">
                                        {p.source === "order" && p.orderid
                                            ? `#ORD-${p.orderid.replace(/^ORD-/i, "")}`
                                            : p.bookTitle || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <MemoCell memo={p.memo} title={`${p.source === "order" ? "Order" : "Round"} Payment #${p.id}`} />
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-1.5">
                                            {p.status === "APPROVED" ? <CheckCircle2 className="size-3 text-emerald-600" />
                                            : p.status === "REJECTED" ? <XCircle className="size-3 text-rose-600" />
                                            : <Clock className="size-3 text-amber-600" />}
                                            <StatusBadge status={p.status} />
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-sm">{formatAmount(p.amount || 0)} ETB</TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow className="bg-emerald-50/50">
                            <TableCell colSpan={6} className="font-black text-[10px] uppercase tracking-widest text-emerald-700">Total Paid</TableCell>
                            <TableCell className="text-right font-black text-emerald-700 whitespace-nowrap">{formatAmount(totalPaid)} ETB</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
            </div>

            {/* Calculation walkthrough */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-5">
                <div className="flex items-center gap-2 text-primarycolor">
                    <BarChart3 className="size-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">How The Remaining Debt Is Calculated</h3>
                </div>

                {/* Step 1: addition */}
                <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-4 md:p-6 space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Step 1 — Total Debt (adding the three debts)</p>
                    <div className="font-mono text-sm md:text-base font-black text-primarycolor space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span>Total Order Debt (Requested)</span>
                            <span className="tabular-nums">{formatAmount(orderDebt)} ETB</span>
                        </div>
                        <div className="flex items-center justify-between text-indigo-700">
                            <span>+ Round Orders Debt</span>
                            <span className="tabular-nums">{formatAmount(roundOrderDebt)} ETB</span>
                        </div>
                        <div className="flex items-center justify-between text-purple-700">
                            <span>+ Rounds</span>
                            <span className="tabular-nums">{formatAmount(roundsDebt)} ETB</span>
                        </div>
                        <div className="border-t-2 border-dashed border-slate-300 pt-2 flex items-center justify-between text-base md:text-lg text-rose-700">
                            <span>= Total Debt</span>
                            <span className="tabular-nums">{formatAmount(totalDebt)} ETB</span>
                        </div>
                    </div>
                </div>

                {/* Step 2: subtraction */}
                <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-4 md:p-6 space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Step 2 — Subtract Total Paid (all payments in the payment history)</p>
                    <div className="font-mono text-sm md:text-base font-black space-y-1.5">
                        <div className="flex items-center justify-between text-rose-700">
                            <span>Total Debt</span>
                            <span className="tabular-nums">{formatAmount(totalDebt)} ETB</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-700">
                            <span>- Total Paid</span>
                            <span className="tabular-nums">{formatAmount(totalPaid)} ETB</span>
                        </div>
                        <div className="border-t-2 border-dashed border-slate-300 pt-2 flex items-center justify-between text-base md:text-lg">
                            <span className={remaining > 0 ? "text-rose-700" : "text-emerald-700"}>= Remaining Debt</span>
                            <span className={cn("tabular-nums", remaining > 0 ? "text-rose-700" : "text-emerald-700")}>
                                {formatAmount(remaining)} ETB
                            </span>
                        </div>
                    </div>
                </div>

                {/* Final result */}
                <div className={cn(
                    "rounded-2xl border-2 p-5 flex items-center justify-between",
                    remaining > 0 ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"
                )}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {remaining > 0 ? "Remaining Debt" : "Fully Paid"}
                    </span>
                    <span className={cn("text-2xl font-black", remaining > 0 ? "text-rose-700" : "text-emerald-700")}>
                        {formatAmount(remaining)} ETB
                    </span>
                </div>
            </div>

            {/* Print options dialog */}
            <Dialog open={printOptionsOpen} onOpenChange={setPrintOptionsOpen}>
                <DialogContent className="sm:max-w-md w-[95vw] rounded-[2rem] border-2 border-primarycolor/10 max-h-[90dvh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-black uppercase italic text-primarycolor flex items-center gap-2">
                            <Printer className="size-4" /> Print Options
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        {/* Font size */}
                        <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
                            <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Font Size</p>
                            <div className="flex flex-wrap gap-1.5">
                                {(["extra-big", "big", "medium", "small", "extra-small"] as const).map(size => (
                                    <label
                                        key={size}
                                        className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 cursor-pointer transition-colors",
                                            printFontSize === size
                                                ? "border-primarycolor bg-primarycolor/5"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="debt-font-size"
                                            checked={printFontSize === size}
                                            onChange={() => setPrintFontSize(size)}
                                            className="size-3 accent-primarycolor shrink-0"
                                        />
                                        <span className="font-bold text-slate-700 text-[9px] uppercase tracking-widest">
                                            {size === "extra-big" ? "X.Big" : size === "big" ? "Big" : size === "medium" ? "Medium" : size === "small" ? "Small" : "X.Small"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Bold */}
                        <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
                            <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Font Style</p>
                            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-slate-200 w-fit">
                                <input
                                    type="checkbox"
                                    checked={printBold}
                                    onChange={e => setPrintBold(e.target.checked)}
                                    className="size-3.5 accent-primarycolor"
                                />
                                <span className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">All Bold</span>
                            </label>
                        </div>

                        {/* Tables to include */}
                        <div className="bg-white rounded-2xl p-3 border-2 border-primarycolor/5">
                            <p className="text-[8px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Tables To Include</p>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    { id: "requested", label: "Order Debt (Requested)", state: printIncludeRequested, set: setPrintIncludeRequested },
                                    { id: "roundOrders", label: "Round Orders Debt", state: printIncludeRoundOrders, set: setPrintIncludeRoundOrders },
                                    { id: "rounds", label: "Rounds", state: printIncludeRounds, set: setPrintIncludeRounds },
                                    { id: "payments", label: "Payments History", state: printIncludePayments, set: setPrintIncludePayments },
                                    { id: "calc", label: "Debt Calculation", state: printIncludeCalc, set: setPrintIncludeCalc },
                                ].map(opt => (
                                    <label
                                        key={opt.id}
                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-primarycolor/30 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={opt.state}
                                            onChange={e => opt.set(e.target.checked)}
                                            className="size-3 accent-primarycolor rounded shrink-0"
                                        />
                                        <span className="font-bold text-slate-700 text-[9px] leading-tight">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-1">
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="outline"
                                onClick={() => setPrintOptionsOpen(false)}
                                className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] border-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setPrintOptionsOpen(false);
                                    handleDebtPrint();
                                }}
                                className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] bg-primarycolor hover:bg-secondarycolor text-white shadow-lg gap-1.5"
                            >
                                <Printer className="size-3.5" /> Print
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Memo detail dialog */}
            <Dialog open={!!memoView} onOpenChange={(open) => !open && setMemoView(null)}>
                <DialogContent className="max-w-md rounded-[2rem] border-2 border-primarycolor/10">
                    <DialogHeader>
                        <DialogTitle className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                            Memo — {memoView?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm font-bold text-foreground whitespace-pre-wrap break-words leading-relaxed">
                        {memoView?.text}
                    </p>
                </DialogContent>
            </Dialog>

            {/* Order details modal (same as manage orders) */}
            <ManageOrderDetailsModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={selectedOrder}
                payments={payments as any}
                onApproved={(updated) => {
                    setOrderList((prev) =>
                        prev.map((o) => (o.id === updated.id ? { ...o, is_approved: true, status: "Approved" } : o))
                    );
                    setIsOrderModalOpen(false);
                }}
                onDeleted={(deletedId) => {
                    setOrderList((prev) => prev.filter((o) => o.id !== deletedId));
                    setSelectedOrder(null);
                    setIsOrderModalOpen(false);
                }}
                onUpdated={(updated) => {
                    setOrderList((prev) =>
                        prev.map((o) =>
                            o.id === (updated as any).id
                                ? { ...o, total_amount: updated.total_amount, amount_paid: updated.amount_paid, status: updated.status, is_approved: (updated as any).is_approved }
                                : o
                        )
                    );
                    setSelectedOrder(updated);
                }}
            />
        </div>
    );
}
