"use client";

import { useMemo } from "react";
import {
    Store, Banknote, Repeat, CheckCircle2, Clock, Landmark, AlertTriangle, Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";

interface Props {
    shopName: string;
    orders: any[];
    payments: any[];
    roundRecords: any[];
    roundPayments: any[];
    previousDebt: number;
}

export default function DebtsPaymentsClient({ shopName, orders, payments, roundRecords, roundPayments, previousDebt }: Props) {
    const { formatDate } = useCalendar();

    const requestedOrders = useMemo(() =>
        orders.filter((o: any) => o.order_type === "requested"),
    [orders]);

    const roundOrders = useMemo(() =>
        orders.filter((o: any) => o.order_type === "on round"),
    [orders]);

    const requestedOrderIds = useMemo(() =>
        new Set(requestedOrders.map((o: any) => String(o.id))),
    [requestedOrders]);

    const orderPayments = useMemo(() =>
        payments.filter((p: any) => {
            const rawId = p.orderid ? p.orderid.replace(/^ORD-/i, "") : null;
            return rawId && requestedOrderIds.has(rawId);
        }),
    [payments, requestedOrderIds]);

    // ─── Orders Stats ─────────────────────────────────────────
    const approvedOrders = requestedOrders.filter((o: any) => o.is_approved);
    const unapprovedOrders = requestedOrders.filter((o: any) => !o.is_approved);
    const sortedOrders = [...requestedOrders].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastOrder = sortedOrders[0];

    const approvedPayments = orderPayments.filter((p: any) => {
        if (p.status !== "APPROVED") return false;
        if (p.payment_type === "CHECK" && p.check?.status !== "CLEARED") return false;
        return true;
    });

    const directPaymentsApproved = orderPayments.filter((p: any) =>
        p.payment_type === "DIRECT" && p.status === "APPROVED"
    );
    const checkPaymentsAll = orderPayments.filter((p: any) => p.payment_type === "CHECK");
    const rejectedPayments = orderPayments.filter((p: any) => p.status === "REJECTED");

    // ─── Round Stats ───────────────────────────────────────────
    const roundRecordTotalAmount = roundRecords.reduce((s: number, r: any) => s + (r.totalprice || 0), 0);
    const roundOrderTotalAmount = roundOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
    const roundRecordApprovedPaid = roundRecords.reduce((s: number, r: any) => {
        const approved = (r.round_payments || []).filter((p: any) => p.status === "APPROVED");
        return s + approved.reduce((a: number, p: any) => a + (p.amount || 0), 0);
    }, 0);
    const roundOrderPaid = roundOrders.reduce((s: number, o: any) => s + (o.amount_paid || 0), 0);

    // ─── Payment Stats ─────────────────────────────────────────
    const totalAllPayments = payments.length;
    const totalApprovedPayments = payments.filter((p: any) => p.status === "APPROVED");
    const totalApprovedAmount = totalApprovedPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const totalPendingPayments = payments.filter((p: any) => p.status === "PENDING");
    const totalRejectedPayments = payments.filter((p: any) => p.status === "REJECTED");
    const totalCheckPayments = payments.filter((p: any) => p.payment_type === "CHECK");
    const totalDirectPayments = payments.filter((p: any) => p.payment_type === "DIRECT" && p.status === "APPROVED");

    const StatRow = ({ label, count, amount, labelColor, countColor, amountColor }: any) => (
        <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white border border-slate-100 hover:border-primarycolor/20 transition-colors">
            <span className={cn("text-[10px] font-bold", labelColor || "text-slate-600")}>{label}</span>
            <div className="flex items-center gap-4 text-right">
                {count !== undefined && (
                    <span className={cn("font-black text-sm tabular-nums w-16", countColor || "text-slate-800")}>{count}</span>
                )}
                {amount !== undefined && (
                    <span className={cn("font-black text-sm tabular-nums w-28", amountColor || "text-slate-800")}>{amount.toLocaleString()} ETB</span>
                )}
            </div>
        </div>
    );

    const SectionHeader = ({ icon: Icon, label, color }: any) => (
        <div className="flex items-center gap-2.5 mb-5">
            <div className={cn("size-9 rounded-xl flex items-center justify-center", color)}>
                <Icon className="size-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{label}</h3>
        </div>
    );

    const handlePrint = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

        const approvedOrdersTotal = approvedOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
        const unapprovedOrdersTotal = unapprovedOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
        const orderPaymentsTotal = orderPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const orderApprovedPaymentsTotal = approvedPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const directPaymentsTotal = directPaymentsApproved.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const checkPaymentsTotal = checkPaymentsAll.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const rejectedPaymentsTotal = rejectedPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);

        const orderUnpaid = requestedOrders.reduce((s: number, o: any) => s + ((o.total_amount || 0) - (o.amount_paid || 0)), 0);
        const lastOrd = sortedOrders[0];
        const lastOrdUnpaid = lastOrd ? Math.max(0, (lastOrd.total_amount || 0) - (lastOrd.amount_paid || 0)) : 0;
        const orderDebtExclLast = orderUnpaid - lastOrdUnpaid;

        const roundTotalAmount = roundOrderTotalAmount + roundRecordTotalAmount;
        const roundTotalPaid = roundOrderPaid + roundRecordApprovedPaid;

        const roundItems = [
            ...roundOrders.map((o: any) => ({ unpaid: (o.total_amount || 0) - (o.amount_paid || 0) })),
            ...roundRecords.map((r: any) => {
                const approved = (r.round_payments || []).filter((p: any) => p.status === "APPROVED");
                return { unpaid: (r.totalprice || 0) - approved.reduce((a: number, p: any) => a + (p.amount || 0), 0) };
            }),
        ];
        const roundTotalUnpaid = roundItems.reduce((s: number, i: any) => s + Math.max(0, i.unpaid), 0);
        const lastRoundItem = roundItems[0];
        const lastRoundUnpaid = lastRoundItem ? Math.max(0, lastRoundItem.unpaid) : 0;
        const roundDebtExclLast = roundTotalUnpaid - lastRoundUnpaid;

        const prevDebtPayments = payments.filter((p: any) => p.is_for_previous_debts);
        const approvedPrevDebtPayments = prevDebtPayments.filter((p: any) => p.status === "APPROVED");
        const approvedPrevPaid = approvedPrevDebtPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const prevDebtRemaining = Math.max(0, previousDebt - approvedPrevPaid);

        const totalAllApproved = payments.filter((p: any) => p.status === "APPROVED");
        const totalAllApprovedAmount = totalAllApproved.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const totalPending = payments.filter((p: any) => p.status === "PENDING");
        const totalRejected = payments.filter((p: any) => p.status === "REJECTED");
        const totalChecks = payments.filter((p: any) => p.payment_type === "CHECK");
        const totalDirect = payments.filter((p: any) => p.payment_type === "DIRECT" && p.status === "APPROVED");

        function checkStatusBreakdown(paymentsList: any[]) {
            return ["CLEARED", "DELIVERED", "PENDING", "BOUNCED", "CANCELLED"].map(s => {
                const f = paymentsList.filter((p: any) => p.check?.status === s);
                return f.length ? `<tr><td style="padding:2px 6px;border:1px solid #ccc;font-size:8px;">${s.charAt(0)+s.slice(1).toLowerCase()} Checks</td><td style="padding:2px 6px;border:1px solid #ccc;font-size:8px;text-align:right;">${f.length}</td><td style="padding:2px 6px;border:1px solid #ccc;font-size:8px;text-align:right;">${f.reduce((a: number, p: any) => a + (p.amount || 0), 0).toLocaleString()}</td></tr>` : '';
            }).filter(Boolean).join('');
        }

        const html = `<!DOCTYPE html>
<html>
<head><title>Debts & Payments - ${shopName}</title>
<style>
  @page { size: A4 portrait; margin: 5mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; padding:5px; color:#000; }
  .h { font-weight:700; font-size:9px; margin-bottom:1px; }
  .sub { font-size:7px; color:#666; margin-bottom:3px; }
  table { width:100%; border-collapse:collapse; margin-bottom:3px; }
  th { background:#1e293b; color:#fff; padding:3px 5px; text-align:left; font-size:7px; font-weight:700; text-transform:uppercase; }
  td { padding:2px 5px; border:1px solid #ccc; font-size:8px; }
  .r { text-align:right; }
  .c { text-align:center; }
  .gt { font-weight:700; background:#f1f5f9; }
</style>
</head>
<body>
  <div class="h">Debts & Payments Detail — ${shopName}</div>
  <div class="sub">${dateStr}</div>

  <table>
    <tr><th colspan="5">Orders (Requested) — Summary</th></tr>
    <tr><th>Metric</th><th class="r">Count</th><th class="r">Total (ETB)</th><th class="r">Paid (ETB)</th><th class="r">Unpaid (ETB)</th></tr>
    <tr><td>All Requested Orders</td><td class="r">${requestedOrders.length}</td><td class="r">${requestedOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0).toLocaleString()}</td><td class="r">${requestedOrders.reduce((s: number, o: any) => s + (o.amount_paid || 0), 0).toLocaleString()}</td><td class="r">${orderUnpaid.toLocaleString()}</td></tr>
    <tr><td>Approved Orders</td><td class="r">${approvedOrders.length}</td><td class="r">${approvedOrdersTotal.toLocaleString()}</td><td class="r">—</td><td class="r">—</td></tr>
    <tr><td>Unapproved Orders</td><td class="r">${unapprovedOrders.length}</td><td class="r">${unapprovedOrdersTotal.toLocaleString()}</td><td class="r">—</td><td class="r">—</td></tr>
    <tr><td>Last Order ${lastOrd ? '(ORD-'+lastOrd.id+')' : ''}</td><td class="r">${lastOrd ? 1 : 0}</td><td class="r">${lastOrd ? (lastOrd.total_amount || 0).toLocaleString() : 0}</td><td class="r">${lastOrd ? (lastOrd.amount_paid || 0).toLocaleString() : 0}</td><td class="r">${lastOrdUnpaid.toLocaleString()}</td></tr>
    <tr class="gt"><td>Debt Excluding Last Order</td><td class="r">${requestedOrders.filter((o: any) => { const u = (o.total_amount||0)-(o.amount_paid||0); return u>0 && (!lastOrdUnpaid || o.id !== lastOrd?.id); }).length}</td><td colspan="2"></td><td class="r">${orderDebtExclLast.toLocaleString()}</td></tr>
  </table>

  <table>
    <tr><th colspan="4">Orders — Payments</th></tr>
    <tr><th>Type</th><th class="r">Count</th><th class="r">Amount (ETB)</th><th></th></tr>
    <tr><td>Total Payments</td><td class="r">${orderPayments.length}</td><td class="r">${orderPaymentsTotal.toLocaleString()}</td><td></td></tr>
    <tr><td>Approved Payments</td><td class="r">${approvedPayments.length}</td><td class="r">${orderApprovedPaymentsTotal.toLocaleString()}</td><td></td></tr>
    <tr><td>Direct Payments</td><td class="r">${directPaymentsApproved.length}</td><td class="r">${directPaymentsTotal.toLocaleString()}</td><td></td></tr>
    <tr><td>Check Payments</td><td class="r">${checkPaymentsAll.length}</td><td class="r">${checkPaymentsTotal.toLocaleString()}</td><td></td></tr>
    <tr><td>Rejected Payments</td><td class="r">${rejectedPayments.length}</td><td class="r">${rejectedPaymentsTotal.toLocaleString()}</td><td></td></tr>
    ${checkStatusBreakdown(checkPaymentsAll)}
  </table>

  <table>
    <tr><th colspan="3">Rounds</th></tr>
    <tr><td>Total Round Orders</td><td class="r">${roundOrders.length}</td><td class="r">${roundOrderTotalAmount.toLocaleString()} ETB</td></tr>
    <tr><td>Total Round Records</td><td class="r">${roundRecords.length}</td><td class="r">${roundRecordTotalAmount.toLocaleString()} ETB</td></tr>
    <tr><td>Total Amount</td><td class="r"></td><td class="r">${roundTotalAmount.toLocaleString()} ETB</td></tr>
    <tr><td>Total Paid</td><td class="r"></td><td class="r">${roundTotalPaid.toLocaleString()} ETB</td></tr>
    <tr><td>Total Unpaid</td><td class="r">${roundItems.filter((i: any) => i.unpaid > 0).length}</td><td class="r">${roundTotalUnpaid.toLocaleString()} ETB</td></tr>
    <tr><td>Last Round Item Unpaid</td><td class="r">${lastRoundUnpaid > 0 ? 1 : 0}</td><td class="r">${lastRoundUnpaid.toLocaleString()} ETB</td></tr>
    <tr class="gt"><td>Round Debt Excluding Last</td><td class="r"></td><td class="r">${roundDebtExclLast.toLocaleString()} ETB</td></tr>
  </table>

  <table>
    <tr><th colspan="3">Previous Debts</th></tr>
    <tr><td>Total Previous Debt</td><td class="r"></td><td class="r">${previousDebt.toLocaleString()} ETB</td></tr>
    <tr><td>Approved Payments Toward Prev. Debt</td><td class="r">${approvedPrevDebtPayments.length}</td><td class="r">${approvedPrevPaid.toLocaleString()} ETB</td></tr>
    <tr class="gt"><td>Remaining Previous Debt</td><td class="r"></td><td class="r">${prevDebtRemaining.toLocaleString()} ETB</td></tr>
  </table>

  <table>
    <tr><th colspan="3">All Payments</th></tr>
    <tr><th>Type</th><th class="r">Count</th><th class="r">Amount (ETB)</th></tr>
    <tr><td>Total Payments</td><td class="r">${payments.length}</td><td class="r">${payments.reduce((s: number, p: any) => s + (p.amount || 0), 0).toLocaleString()}</td></tr>
    <tr><td>Approved</td><td class="r">${totalAllApproved.length}</td><td class="r">${totalAllApprovedAmount.toLocaleString()}</td></tr>
    <tr><td>Pending</td><td class="r">${totalPending.length}</td><td class="r">${totalPending.reduce((s: number, p: any) => s + (p.amount || 0), 0).toLocaleString()}</td></tr>
    <tr><td>Rejected</td><td class="r">${totalRejected.length}</td><td class="r">${totalRejected.reduce((s: number, p: any) => s + (p.amount || 0), 0).toLocaleString()}</td></tr>
    <tr><td>Direct Payments (Approved)</td><td class="r">${totalDirect.length}</td><td class="r">${totalDirect.reduce((s: number, p: any) => s + (p.amount || 0), 0).toLocaleString()}</td></tr>
    <tr><td>Check Payments</td><td class="r">${totalChecks.length}</td><td class="r">${totalChecks.reduce((s: number, p: any) => s + (p.amount || 0), 0).toLocaleString()}</td></tr>
    <tr><td>For Previous Debt</td><td class="r">${prevDebtPayments.length}</td><td class="r">${prevDebtPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0).toLocaleString()}</td></tr>
    ${checkStatusBreakdown(totalChecks)}
  </table>

  <div style="font-size:7px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:3px;margin-top:4px;">Generated on ${dateStr} — Bookland Ethiopia Bookstore Management System</div>
</body>
</html>`;
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
            win.focus();
            setTimeout(() => { win.print(); }, 500);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <Button onClick={handlePrint} className="h-10 px-5 rounded-2xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primarycolor/20">
                    <Printer className="size-3.5 mr-1.5" />
                    Print
                </Button>
            </div>
            {/* ── ORDERS SECTION ── */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl">
                <SectionHeader icon={Store} label="Orders (Requested)" color="bg-emerald-100 text-emerald-600" />

                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-transparent rounded-2xl border border-emerald-100 p-5">
                            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Total Orders</p>
                            <p className="font-black text-2xl text-slate-800 mt-1">{requestedOrders.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-transparent rounded-2xl border border-amber-100 p-5">
                            <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Approved Cost</p>
                            <p className="font-black text-2xl text-slate-800 mt-1">
                                {approvedOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0).toLocaleString()} ETB
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-rose-50 to-transparent rounded-2xl border border-rose-100 p-5">
                            <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest">Unapproved Orders</p>
                            <p className="font-black text-2xl text-slate-800 mt-1">{unapprovedOrders.length}</p>
                        </div>
                    </div>

                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Orders Breakdown</p>
                    <StatRow label="Total Orders Made" count={requestedOrders.length} amount={requestedOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0)} />
                    <StatRow label="Approved Orders (Total Cost)" count={approvedOrders.length} amount={approvedOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0)} />
                    <StatRow label="Unapproved Orders" count={unapprovedOrders.length} amount={unapprovedOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0)} labelColor="text-rose-600" countColor="text-rose-700" amountColor="text-rose-700" />

                    <div className="h-px bg-slate-100 my-4" />

                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Last Order</p>
                    {lastOrder ? (
                        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "size-8 rounded-lg flex items-center justify-center",
                                    lastOrder.is_approved ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                )}>
                                    {lastOrder.is_approved ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
                                </div>
                                <div>
                                    <p className="font-black text-sm text-slate-800">
                                        {(lastOrder.total_amount || 0).toLocaleString()} ETB
                                    </p>
                                    <p className="text-[8px] font-bold text-muted-foreground">
                                        ORD-{lastOrder.id} &middot; {formatDate(new Date(lastOrder.createdAt), "MMM dd, yyyy")}
                                    </p>
                                </div>
                            </div>
                            <span className={cn(
                                "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                lastOrder.is_approved
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                            )}>
                                {lastOrder.is_approved ? "Approved" : "Pending"}
                            </span>
                        </div>
                    ) : (
                        <p className="text-[10px] font-bold text-muted-foreground">No orders found</p>
                    )}

                    <div className="h-px bg-slate-100 my-4" />

                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Debts</p>
                    {(() => {
                        const totalUnpaid = requestedOrders.reduce(
                            (s: number, o: any) => s + ((o.total_amount || 0) - (o.amount_paid || 0)), 0
                        );
                        const lastOrderUnpaid = lastOrder
                            ? (lastOrder.total_amount || 0) - (lastOrder.amount_paid || 0)
                            : 0;
                        const isLastOrderUnpaid = lastOrderUnpaid > 0;
                        const debtExcludingLast = totalUnpaid - (isLastOrderUnpaid ? lastOrderUnpaid : 0);
                        return (
                            <>
                                <StatRow label="Total Unpaid" count={requestedOrders.filter((o: any) => (o.total_amount || 0) - (o.amount_paid || 0) > 0).length} amount={totalUnpaid} countColor="text-rose-700" amountColor="text-rose-700" />
                                {isLastOrderUnpaid && (
                                    <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200">
                                        <span className="text-[10px] font-bold text-amber-700">Last Order Unpaid Amount</span>
                                        <div className="flex items-center gap-4 text-right">
                                            <span className="font-black text-sm tabular-nums w-16 text-amber-700">{lastOrder ? 1 : 0}</span>
                                            <span className="font-black text-sm tabular-nums w-28 text-amber-700">{lastOrderUnpaid.toLocaleString()} ETB</span>
                                        </div>
                                    </div>
                                )}
                                <StatRow
                                    label="Debt Excluding Last Order"
                                    count={requestedOrders.filter((o: any) => {
                                        if (isLastOrderUnpaid && o.id === lastOrder?.id) return false;
                                        return ((o.total_amount || 0) - (o.amount_paid || 0)) > 0;
                                    }).length}
                                    amount={debtExcludingLast}
                                    labelColor="text-emerald-600"
                                    countColor="text-emerald-700"
                                    amountColor="text-emerald-700"
                                />
                            </>
                        );
                    })()}

                    <div className="h-px bg-slate-100 my-4" />

                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Payment Details for Orders</p>
                    <StatRow label="Total Payments Made" count={orderPayments.length} amount={orderPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0)} />
                    <StatRow
                        label="Approved Payments"
                        count={approvedPayments.length}
                        amount={approvedPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0)}
                        countColor="text-emerald-700"
                        amountColor="text-emerald-700"
                    />
                    <StatRow label="Direct Payments" count={directPaymentsApproved.length} amount={directPaymentsApproved.reduce((s: number, p: any) => s + (p.amount || 0), 0)} labelColor="text-blue-600" countColor="text-blue-700" amountColor="text-blue-700" />
                    <StatRow label="Check Payments" count={checkPaymentsAll.length} amount={checkPaymentsAll.reduce((s: number, p: any) => s + (p.amount || 0), 0)} labelColor="text-purple-600" countColor="text-purple-700" amountColor="text-purple-700" />
                    <StatRow label="Rejected Payments" count={rejectedPayments.length} amount={rejectedPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0)} labelColor="text-rose-600" countColor="text-rose-700" amountColor="text-rose-700" />

                    <div className="h-px bg-slate-100 my-4" />

                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Check Status Breakdown</p>
                    {["CLEARED", "DELIVERED", "PENDING", "BOUNCED", "CANCELLED"].map((status) => {
                        const filtered = checkPaymentsAll.filter((p: any) => p.check?.status === status);
                        if (filtered.length === 0) return null;
                        const colors: Record<string, string> = {
                            CLEARED: "text-emerald-600 bg-emerald-50 border-emerald-200",
                            DELIVERED: "text-blue-600 bg-blue-50 border-blue-200",
                            PENDING: "text-amber-600 bg-amber-50 border-amber-200",
                            BOUNCED: "text-rose-600 bg-rose-50 border-rose-200",
                            CANCELLED: "text-slate-600 bg-slate-50 border-slate-200",
                        };
                        return (
                            <StatRow
                                key={status}
                                label={`${status.charAt(0) + status.slice(1).toLowerCase()} Checks`}
                                count={filtered.length}
                                amount={filtered.reduce((s: number, p: any) => s + (p.amount || 0), 0)}
                                labelColor={colors[status]?.split(" ")[0] || "text-slate-600"}
                                countColor={colors[status]?.split(" ")[0]?.replace("text-", "text-") || "text-slate-700"}
                                amountColor={colors[status]?.split(" ")[0]?.replace("text-", "text-") || "text-slate-700"}
                            />
                        );
                    })}
                    {checkPaymentsAll.length === 0 && (
                        <p className="text-[10px] font-bold text-muted-foreground italic">No check payments</p>
                    )}
                </div>
            </div>

            {/* ── ROUNDS SECTION ── */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl">
                <SectionHeader icon={Repeat} label="Rounds" color="bg-indigo-100 text-indigo-600" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-transparent rounded-2xl border border-indigo-100 p-5">
                        <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Total Round Orders</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">{roundOrders.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-transparent rounded-2xl border border-indigo-100 p-5">
                        <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Total Round Records</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">{roundRecords.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-transparent rounded-2xl border border-amber-100 p-5">
                        <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Total Amount</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">{(roundOrderTotalAmount + roundRecordTotalAmount).toLocaleString()} ETB</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-transparent rounded-2xl border border-emerald-100 p-5">
                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Total Paid</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">{(roundOrderPaid + roundRecordApprovedPaid).toLocaleString()} ETB</p>
                    </div>
                </div>

                <div className="h-px bg-slate-100 my-4" />

                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Debts</p>
                {(() => {
                    const roundItems = [
                        ...roundOrders.map((o: any) => ({
                            type: "order" as const,
                            id: o.id,
                            createdAt: new Date(o.createdAt).getTime(),
                            unpaid: (o.total_amount || 0) - (o.amount_paid || 0),
                        })),
                        ...roundRecords.map((r: any) => {
                            const approved = (r.round_payments || []).filter((p: any) => p.status === "APPROVED");
                            return {
                                type: "record" as const,
                                id: r.id,
                                createdAt: new Date(r.createdAt).getTime(),
                                unpaid: (r.totalprice || 0) - approved.reduce((a: number, p: any) => a + (p.amount || 0), 0),
                            };
                        }),
                    ].sort((a, b) => b.createdAt - a.createdAt);

                    const totalUnpaid = roundItems.reduce((s: number, i: any) => s + Math.max(0, i.unpaid), 0);
                    const lastItem = roundItems[0];
                    const lastItemUnpaid = lastItem ? Math.max(0, lastItem.unpaid) : 0;
                    const isLastItemUnpaid = lastItemUnpaid > 0;
                    const debtExcludingLast = totalUnpaid - (isLastItemUnpaid ? lastItemUnpaid : 0);

                    const unpaidItems = roundItems.filter((i: any) => i.unpaid > 0);
                    return (
                        <>
                            <StatRow label="Total Unpaid" count={unpaidItems.length} amount={totalUnpaid} countColor="text-rose-700" amountColor="text-rose-700" />
                            {isLastItemUnpaid && (
                                <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200">
                                    <span className="text-[10px] font-bold text-amber-700">
                                        Last {lastItem.type === "order" ? "Round Order" : "Round Record"} Unpaid
                                    </span>
                                    <div className="flex items-center gap-4 text-right">
                                        <span className="font-black text-sm tabular-nums w-16 text-amber-700">1</span>
                                        <span className="font-black text-sm tabular-nums w-28 text-amber-700">{lastItemUnpaid.toLocaleString()} ETB</span>
                                    </div>
                                </div>
                            )}
                            <StatRow
                                label="Debt Excluding Last Round"
                                count={unpaidItems.filter((i: any) => {
                                    if (!isLastItemUnpaid) return true;
                                    return !(i.id === lastItem?.id && i.type === lastItem?.type);
                                }).length}
                                amount={debtExcludingLast}
                                labelColor="text-indigo-600"
                                countColor="text-indigo-700"
                                amountColor="text-indigo-700"
                            />
                        </>
                    );
                })()}
            </div>

            {/* ── PREVIOUS DEBTS SECTION ── */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl">
                <SectionHeader icon={AlertTriangle} label="Previous Debts" color="bg-amber-100 text-amber-600" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-amber-50 to-transparent rounded-2xl border border-amber-100 p-5">
                        <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Previous Debt Amount</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">{previousDebt.toLocaleString()} ETB</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-2xl border border-blue-100 p-5">
                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Payments for Previous Debt</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">
                            {payments.filter((p: any) => p.is_for_previous_debts).length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-transparent rounded-2xl border border-emerald-100 p-5">
                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Approved Amount</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">
                            {payments
                                .filter((p: any) => p.is_for_previous_debts && p.status === "APPROVED")
                                .reduce((s: number, p: any) => s + (p.amount || 0), 0)
                                .toLocaleString()} ETB
                        </p>
                    </div>
                </div>

                <div className="h-px bg-slate-100 my-4" />

                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Debts</p>
                {(() => {
                    const prevDebtPayments = payments.filter((p: any) => p.is_for_previous_debts);
                    const approvedPrevDebtPayments = prevDebtPayments.filter((p: any) => p.status === "APPROVED");
                    const approvedPrevPaid = approvedPrevDebtPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
                    const totalUnpaid = Math.max(0, previousDebt - approvedPrevPaid);
                    const isLastUnpaid = totalUnpaid > 0;
                    return (
                        <>
                            <StatRow label="Total Unpaid" count={isLastUnpaid ? 1 : 0} amount={totalUnpaid} countColor="text-rose-700" amountColor="text-rose-700" />
                            {isLastUnpaid && (
                                <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200">
                                    <span className="text-[10px] font-bold text-amber-700">Remaining Previous Debt</span>
                                    <div className="flex items-center gap-4 text-right">
                                        <span className="font-black text-sm tabular-nums w-16 text-amber-700">{approvedPrevDebtPayments.length}</span>
                                        <span className="font-black text-sm tabular-nums w-28 text-amber-700">{totalUnpaid.toLocaleString()} ETB</span>
                                    </div>
                                </div>
                            )}
                            <StatRow
                                label="Total Paid Toward Previous Debt"
                                count={approvedPrevDebtPayments.length}
                                amount={approvedPrevPaid}
                                labelColor="text-emerald-600"
                                countColor="text-emerald-700"
                                amountColor="text-emerald-700"
                            />
                        </>
                    );
                })()}
            </div>

            {/* ── PAYMENTS SECTION ── */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl">
                <SectionHeader icon={Banknote} label="Payments (All)" color="bg-primarycolor/10 text-primarycolor" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-slate-50 to-transparent rounded-2xl border border-slate-200 p-5">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Total Payments</p>
                        <p className="font-black text-2xl text-slate-800 mt-1">{totalAllPayments}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-transparent rounded-2xl border border-emerald-100 p-5">
                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Approved</p>
                        <p className="font-black text-2xl text-emerald-700 mt-1">{totalApprovedPayments.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-transparent rounded-2xl border border-amber-100 p-5">
                        <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Pending</p>
                        <p className="font-black text-2xl text-amber-700 mt-1">{totalPendingPayments.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 to-transparent rounded-2xl border border-rose-100 p-5">
                        <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest">Rejected</p>
                        <p className="font-black text-2xl text-rose-700 mt-1">{totalRejectedPayments.length}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Payment Type Breakdown</p>
                    <StatRow label="Direct Payments (Approved)" count={totalDirectPayments.length} amount={totalDirectPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0)} labelColor="text-blue-600" countColor="text-blue-700" amountColor="text-blue-700" />
                    <StatRow label="Check Payments" count={totalCheckPayments.length} amount={totalCheckPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0)} labelColor="text-purple-600" countColor="text-purple-700" amountColor="text-purple-700" />
                    <StatRow label="For Previous Debt" count={payments.filter((p: any) => p.is_for_previous_debts).length} amount={payments.filter((p: any) => p.is_for_previous_debts).reduce((s: number, p: any) => s + (p.amount || 0), 0)} labelColor="text-amber-600" countColor="text-amber-700" amountColor="text-amber-700" />

                    <div className="h-px bg-slate-100 my-4" />

                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Check Statuses (All)</p>
                    {["CLEARED", "DELIVERED", "PENDING", "BOUNCED", "CANCELLED"].map((status) => {
                        const filtered = totalCheckPayments.filter((p: any) => p.check?.status === status);
                        if (filtered.length === 0) return null;
                        return (
                            <StatRow
                                key={status}
                                label={`${status.charAt(0) + status.slice(1).toLowerCase()} Checks`}
                                count={filtered.length}
                                amount={filtered.reduce((s: number, p: any) => s + (p.amount || 0), 0)}
                            />
                        );
                    })}
                    {totalCheckPayments.length === 0 && (
                        <p className="text-[10px] font-bold text-muted-foreground italic">No check payments</p>
                    )}

                    <div className="h-px bg-slate-100 my-4" />

                    <StatRow label="Total Approved Amount" count={totalApprovedPayments.length} amount={totalApprovedAmount} countColor="text-emerald-700" amountColor="text-emerald-700" />
                </div>
            </div>
        </div>
    );
}
