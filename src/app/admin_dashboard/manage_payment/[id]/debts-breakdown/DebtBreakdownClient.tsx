"use client";

import { useMemo } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

    const requestedOrders = useMemo(
        () => orders.filter((o) => o.order_type === "requested" && o.is_approved),
        [orders]
    );
    const roundOrders = useMemo(
        () => orders.filter((o) => o.order_type === "on round"),
        [orders]
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
                                    <TableCell className="font-black text-primarycolor text-sm">#ORD-{o.id}</TableCell>
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
                                    <TableCell className="font-black text-primarycolor text-sm">#ORD-{o.id}</TableCell>
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
                    <Table className="min-w-[720px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allPaymentItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-8">
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
                            <TableCell colSpan={5} className="font-black text-[10px] uppercase tracking-widest text-emerald-700">Total Paid</TableCell>
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
        </div>
    );
}
