"use client";

import { useState, useEffect, useCallback } from "react";
import { useCalendar } from "@/lib/calendar-context";
import { DateInput } from "@/components/ui/date-input";
import { getDailyReportData } from "@/app/actions/get-daily-report";
import {
    CalendarDays, ShoppingCart, Repeat, Banknote, CheckCircle,
    Package, BookOpen, Store, ArrowUpRight, Wallet, Loader2,
    Printer, LayoutGrid, Table2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

function toISODateString(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function isValidISODate(str: string): boolean {
    if (!str) return false;
    const d = new Date(str + "T12:00:00");
    return !isNaN(d.getTime());
}

function formatBirr(amount: number): string {
    return `${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ETB`;
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type ReportData = {
    ordersCount: number;
    totalSoldAmount: number;
    totalPaidAmount: number;
    totalBooksOrdered: number;
    shopsInOrders: number;
    paymentsCount: number;
    approvedPaymentsCount: number;
    totalApprovedAmount: number;
    roundsCount: number;
    shopsInRounds: number;
    totalBooksInRounds: number;
    totalRoundRevenue: number;
    totalRoundRemaining: number;
};

export default function DailyReportPage() {
    const { formatLong } = useCalendar();
    const todayISO = toISODateString(new Date());
    const yesterdayISO = toISODateString(new Date(Date.now() - 86400000));

    const [selectedDate, setSelectedDate] = useState(todayISO);
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");

    const fetchData = useCallback(async (isoDate: string) => {
        if (!isValidISODate(isoDate)) {
            setDateError(true);
            setData(null);
            setLoading(false);
            return;
        }
        setDateError(false);
        setLoading(true);
        try {
            const result = await getDailyReportData(isoDate);
            setData(result);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedDate) fetchData(selectedDate);
    }, [selectedDate, fetchData]);

    const handleToday = () => setSelectedDate(todayISO);
    const handleYesterday = () => setSelectedDate(yesterdayISO);

    const displayDate = selectedDate ? new Date(selectedDate + "T12:00:00") : new Date();
    const dateLabel = formatLong(displayDate);

    const activeClass = (iso: string) =>
        selectedDate === iso
            ? "bg-primarycolor text-white border-primarycolor shadow-md shadow-primarycolor/20"
            : "bg-white text-slate-600 border-slate-200 hover:border-primarycolor/40 hover:text-primarycolor";

    const handlePrint = () => {
        if (!data) return;

        const totalRemaining = data.totalSoldAmount - data.totalPaidAmount;

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            font-size: 10px;
            color: #1e293b;
            padding: 20px;
        }
        h1 {
            font-size: 18px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6366f1;
            text-align: center;
            padding-bottom: 12px;
            border-bottom: 3px solid #6366f1;
            margin-bottom: 16px;
        }
        .date-row {
            text-align: center;
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            margin-bottom: 20px;
        }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th {
            text-align: left; padding: 6px 10px; font-size: 8px; font-weight: 700;
            color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;
            border-bottom: 2px solid #e2e8f0;
        }
        td { padding: 6px 10px; font-size: 10px; border-bottom: 1px solid #f1f5f9; }
        .section-title {
            font-size: 12px; font-weight: 800; text-transform: uppercase;
            letter-spacing: 0.05em; padding: 8px 10px; margin-top: 8px;
        }
        .section-title.orders { color: #6366f1; border-bottom: 2px solid #6366f1; }
        .section-title.rounds { color: #9333ea; border-bottom: 2px solid #9333ea; }
        .section-title.payments { color: #10b981; border-bottom: 2px solid #10b981; }
        .label { color: #64748b; font-weight: 600; }
        .value { font-weight: 700; text-align: right; }
        .value.positive { color: #10b981; }
        .value.negative { color: #e11d48; }
        @media print {
            @page { margin: 15mm; size: A4 portrait; }
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <h1>Daily Report</h1>
    <div class="date-row">${escapeHtml(dateLabel)}</div>
    <div class="section-title orders">Orders</div>
    <table>
        <thead><tr><th>Metric</th><th style="text-align:right;">Value</th></tr></thead>
        <tbody>
            <tr><td class="label">Orders Made</td><td class="value">${data.ordersCount}</td></tr>
            <tr><td class="label">Books Ordered</td><td class="value">${data.totalBooksOrdered.toLocaleString()}</td></tr>
            <tr><td class="label">${totalRemaining >= 0 ? "Remaining" : "Overpaid"}</td><td class="value ${totalRemaining > 0 ? "negative" : totalRemaining < 0 ? "negative" : "positive"}">${formatBirr(Math.abs(totalRemaining))}</td></tr>
            <tr><td class="label">Shops Involved</td><td class="value">${data.shopsInOrders}</td></tr>
        </tbody>
    </table>
    <div class="section-title rounds">Rounds</div>
    <table>
        <thead><tr><th>Metric</th><th style="text-align:right;">Value</th></tr></thead>
        <tbody>
            <tr><td class="label">Rounds Made (Books)</td><td class="value">${data.totalBooksInRounds.toLocaleString()}</td></tr>
            <tr><td class="label">Unpaid (Round)</td><td class="value ${data.totalRoundRemaining > 0 ? "negative" : "positive"}">${formatBirr(data.totalRoundRemaining)}</td></tr>
            <tr><td class="label">Shops in Round</td><td class="value">${data.shopsInRounds}</td></tr>
        </tbody>
    </table>
    <div class="section-title payments">Payments</div>
    <table>
        <thead><tr><th>Metric</th><th style="text-align:right;">Value</th></tr></thead>
        <tbody>
            <tr><td class="label">Payments Recorded</td><td class="value">${data.paymentsCount}</td></tr>
            <tr><td class="label">Approved</td><td class="value">${data.approvedPaymentsCount}</td></tr>
            <tr><td class="label">Approved Amount</td><td class="value positive">${formatBirr(data.totalApprovedAmount)}</td></tr>
        </tbody>
    </table>
    <div class="section-title" style="color:#6366f1;border-bottom:2px solid #6366f1;">Summary</div>
    <table>
        <thead><tr><th>Metric</th><th style="text-align:right;">Value</th></tr></thead>
        <tbody>
            <tr><td class="label">Total Revenue (Orders + Rounds)</td><td class="value positive">${formatBirr(data.totalSoldAmount + data.totalRoundRevenue)}</td></tr>
        </tbody>
    </table>
    <script>window.onload=function(){setTimeout(function(){window.print()},500)};<\/script>
</body>
</html>`;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
            <div className="mx-auto max-w-[1600px] px-3 md:px-6 py-4 md:py-8 space-y-4 md:space-y-8">
                <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-900">
                    Daily <span className="text-secondarycolor not-italic">Report</span>
                </h1>

                <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 p-4 md:p-5 space-y-4 md:space-y-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-end gap-3">
                        <div className="flex-1 min-w-0">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
                                Select Date
                            </label>
                            <DateInput
                                value={selectedDate}
                                onChange={(e) => {
                                    if (e.target.value) setSelectedDate(e.target.value);
                                }}
                                containerClassName="w-full"
                                className="h-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleToday}
                                className={cn(
                                    "h-10 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all shrink-0",
                                    activeClass(todayISO),
                                )}
                            >
                                Today
                            </button>
                            <button
                                onClick={handleYesterday}
                                className={cn(
                                    "h-10 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all shrink-0",
                                    activeClass(yesterdayISO),
                                )}
                            >
                                Yesterday
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <CalendarDays className={cn("size-4 shrink-0", dateError ? "text-red-500" : "text-muted-foreground")} />
                            {dateError ? (
                                <span className="text-sm font-bold text-red-500 truncate">Invalid date</span>
                            ) : (
                                <span className="text-sm font-bold text-muted-foreground truncate">{dateLabel}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex bg-slate-100 rounded-lg p-0.5">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "px-2.5 md:px-3 py-1.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
                                        viewMode === "grid" ? "bg-white text-primarycolor shadow-sm" : "text-slate-400 hover:text-slate-600",
                                    )}
                                >
                                    <LayoutGrid className="size-3 md:size-3.5" />
                                    <span className="hidden xs:inline">Grid</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={cn(
                                        "px-2.5 md:px-3 py-1.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
                                        viewMode === "table" ? "bg-white text-primarycolor shadow-sm" : "text-slate-400 hover:text-slate-600",
                                    )}
                                >
                                    <Table2 className="size-3 md:size-3.5" />
                                    <span className="hidden xs:inline">Table</span>
                                </button>
                            </div>
                            <button
                                onClick={handlePrint}
                                disabled={!data}
                                className="h-7 md:h-8 px-2.5 md:px-3 rounded-lg bg-primarycolor text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-sm hover:bg-primarycolor/90 transition-colors flex items-center gap-1 md:gap-1.5 disabled:opacity-40"
                            >
                                <Printer className="size-3 md:size-3.5" />
                                <span className="hidden xs:inline">Print</span>
                            </button>
                        </div>
                    </div>
                </div>

                {dateError ? (
                    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-muted-foreground">
                        <CalendarDays className="size-12 md:size-16 mb-4 opacity-20 text-red-300" />
                        <p className="text-base md:text-lg font-bold uppercase tracking-widest text-red-400">Invalid date</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Please select a valid date</p>
                    </div>
                ) : loading ? (
                    <div className="flex items-center justify-center py-12 md:py-20">
                        <Loader2 className="size-6 md:size-8 animate-spin text-primarycolor/40" />
                    </div>
                ) : data ? (
                    viewMode === "grid" ? (
                        <div className="space-y-6 md:space-y-8">
                            <div>
                                <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mb-3 md:mb-4 flex items-center gap-2">
                                    <ShoppingCart className="size-3.5 md:size-4" /> Orders
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                                    <StatCard icon={<ShoppingCart className="size-5" />} label="Orders Made" value={data.ordersCount.toString()} color="blue" />
                                    <StatCard icon={<BookOpen className="size-5" />} label="Books Ordered" value={data.totalBooksOrdered.toLocaleString()} color="blue" />
                                    <StatCard icon={<ArrowUpRight className="size-5" />} label={data.totalSoldAmount - data.totalPaidAmount >= 0 ? "Remaining" : "Overpaid"} value={formatBirr(Math.abs(data.totalSoldAmount - data.totalPaidAmount))} color={(data.totalSoldAmount - data.totalPaidAmount) > 0 ? "rose" : "emerald"} />
                                    <StatCard icon={<Store className="size-5" />} label="Shops Involved" value={data.shopsInOrders.toString()} color="blue" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mb-3 md:mb-4 flex items-center gap-2">
                                    <Repeat className="size-3.5 md:size-4" /> Rounds
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                                    <StatCard icon={<Repeat className="size-5" />} label="Rounds Made (Books)" value={data.totalBooksInRounds.toLocaleString()} color="purple" />
                                    <StatCard icon={<ArrowUpRight className="size-5" />} label="Unpaid (Round)" value={formatBirr(data.totalRoundRemaining)} color={data.totalRoundRemaining > 0 ? "rose" : "emerald"} />
                                    <StatCard icon={<Store className="size-5" />} label="Shops in Round" value={data.shopsInRounds.toString()} color="purple" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mb-3 md:mb-4 flex items-center gap-2">
                                    <Banknote className="size-3.5 md:size-4" /> Payments
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                                    <StatCard icon={<Banknote className="size-5" />} label="Payments Recorded" value={data.paymentsCount.toString()} color="emerald" />
                                    <StatCard icon={<CheckCircle className="size-5" />} label="Approved" value={data.approvedPaymentsCount.toString()} color="emerald" />
                                    <StatCard icon={<Wallet className="size-5" />} label="Approved Amount" value={formatBirr(data.totalApprovedAmount)} color="emerald" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mb-3 md:mb-4 flex items-center gap-2">
                                    <Wallet className="size-3.5 md:size-4" /> Summary
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                                    <StatCard icon={<Wallet className="size-5" />} label="Total Revenue (Orders + Rounds)" value={formatBirr(data.totalSoldAmount + data.totalRoundRevenue)} color="indigo" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="text-left px-3 md:px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Metric</th>
                                            <th className="text-right px-3 md:px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <TableSection category="Orders" color="indigo" rows={[
                                            { label: "Orders Made", value: data.ordersCount.toString() },
                                            { label: "Books Ordered", value: data.totalBooksOrdered.toLocaleString() },
                                            { label: data.totalSoldAmount - data.totalPaidAmount >= 0 ? "Remaining" : "Overpaid", value: formatBirr(Math.abs(data.totalSoldAmount - data.totalPaidAmount)), negative: (data.totalSoldAmount - data.totalPaidAmount) > 0 },
                                            { label: "Shops Involved", value: data.shopsInOrders.toString() },
                                        ]} />
                                        <TableSection category="Rounds" color="purple" rows={[
                                            { label: "Rounds Made (Books)", value: data.totalBooksInRounds.toLocaleString() },
                                            { label: "Unpaid (Round)", value: formatBirr(data.totalRoundRemaining), negative: data.totalRoundRemaining > 0 },
                                            { label: "Shops in Round", value: data.shopsInRounds.toString() },
                                        ]} />
                                        <TableSection category="Payments" color="emerald" rows={[
                                            { label: "Payments Recorded", value: data.paymentsCount.toString() },
                                            { label: "Approved", value: data.approvedPaymentsCount.toString() },
                                            { label: "Approved Amount", value: formatBirr(data.totalApprovedAmount), positive: true },
                                        ]} />
                                        <TableSection category="Summary" color="slate" rows={[
                                            { label: "Total Revenue (Orders + Rounds)", value: formatBirr(data.totalSoldAmount + data.totalRoundRevenue), positive: true },
                                        ]} />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : null}

                {data && data.ordersCount === 0 && data.roundsCount === 0 && data.paymentsCount === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-muted-foreground">
                        <CalendarDays className="size-12 md:size-16 mb-4 opacity-20" />
                        <p className="text-base md:text-lg font-bold uppercase tracking-widest">No activity for this date</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">No orders, rounds, or payments recorded</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    const colorMap: Record<string, { bg: string; text: string; iconBg: string; accent: string }> = {
        blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-blue-100 text-blue-600", accent: "border-blue-200" },
        indigo: { bg: "bg-indigo-50", text: "text-indigo-700", iconBg: "bg-indigo-100 text-indigo-600", accent: "border-indigo-200" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100 text-emerald-600", accent: "border-emerald-200" },
        rose: { bg: "bg-rose-50", text: "text-rose-700", iconBg: "bg-rose-100 text-rose-600", accent: "border-rose-200" },
        amber: { bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-amber-100 text-amber-600", accent: "border-amber-200" },
        purple: { bg: "bg-purple-50", text: "text-purple-700", iconBg: "bg-purple-100 text-purple-600", accent: "border-purple-200" },
    };

    const c = colorMap[color] || colorMap.blue;

    return (
        <div className={`${c.bg} border ${c.accent} rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col gap-2 md:gap-3 shadow-sm`}>
            <div className={`size-9 md:size-10 rounded-lg md:rounded-xl ${c.iconBg} flex items-center justify-center`}>
                {icon}
            </div>
            <div>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 md:mb-1">{label}</p>
                <p className={`text-base md:text-xl font-black ${c.text} leading-tight`}>{value}</p>
            </div>
        </div>
    );
}

function TableSection({ category, color, rows }: { category: string; color: string; rows: { label: string; value: string; positive?: boolean; negative?: boolean }[] }) {
    const dotColor = color === "indigo" ? "bg-indigo-500" : color === "purple" ? "bg-purple-500" : color === "emerald" ? "bg-emerald-500" : "bg-slate-500";
    return (
        <>
            <tr className="border-b border-slate-100">
                <td colSpan={2} className="px-3 md:px-5 py-2 md:py-3">
                    <div className="flex items-center gap-2">
                        <div className={`size-1.5 md:size-2 rounded-full ${dotColor}`} />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{category}</span>
                    </div>
                </td>
            </tr>
            {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm text-slate-600 font-medium">{row.label}</td>
                    <td className={cn(
                        "px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-bold text-right",
                        row.positive ? "text-emerald-600" : row.negative ? "text-rose-600" : "text-slate-900",
                    )}>{row.value}</td>
                </tr>
            ))}
        </>
    );
}
