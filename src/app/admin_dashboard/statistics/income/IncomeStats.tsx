"use client";

import { useState, useCallback } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getIncomeStats, type IncomeEntry } from "@/app/actions/statistics-actions";
import { Loader2, Banknote, Receipt } from "lucide-react";

const RANGE_OPTIONS = [
    { label: "Last 24 Hours", value: "24h" },
    { label: "Last 48 Hours", value: "48h" },
    { label: "Last 72 Hours", value: "72h" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 60 Days", value: "60d" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last 1 Year", value: "1y" },
    { label: "All Time", value: "all" },
];

const TYPE_META = {
    DIRECT: { label: "Direct", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" },
    CHECK: { label: "Check", icon: Receipt, color: "text-blue-600", bg: "bg-blue-50" },
} as const;

export default function IncomeStats({
    initialEntries,
    initialGrandTotal,
    initialTotalPayments,
}: {
    initialEntries: IncomeEntry[];
    initialGrandTotal: number;
    initialTotalPayments: number;
}) {
    const [range, setRange] = useState("30d");
    const [entries, setEntries] = useState<IncomeEntry[]>(initialEntries);
    const [grandTotal, setGrandTotal] = useState(initialGrandTotal);
    const [totalPayments, setTotalPayments] = useState(initialTotalPayments);
    const [loading, setLoading] = useState(false);

    const handleRangeChange = useCallback(async (value: string) => {
        setRange(value);
        setLoading(true);
        try {
            const result = await getIncomeStats(value);
            setEntries(result.entries);
            setGrandTotal(result.grandTotal);
            setTotalPayments(result.totalPayments);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Total Income
                    </p>
                    <p className="text-3xl font-black text-slate-800">
                        {grandTotal.toLocaleString()}{" "}
                        <span className="text-sm font-bold opacity-40">ETB</span>
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Total Payments
                    </p>
                    <p className="text-3xl font-black text-slate-800">
                        {totalPayments.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Time Period
                    </p>
                    <Select value={range} onValueChange={handleRangeChange}>
                        <SelectTrigger className="w-full h-10 rounded-xl border-2 border-slate-200 font-bold text-sm">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 border-slate-200">
                            {RANGE_OPTIONS.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="font-bold text-sm"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Breakdown cards */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="size-6 animate-spin mr-2" />
                    <span className="font-bold text-xs uppercase tracking-widest">Loading...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {entries.map((entry) => {
                        const meta = TYPE_META[entry.type];
                        const Icon = meta.icon;
                        return (
                            <div
                                key={entry.type}
                                className={`${meta.bg} rounded-2xl border border-slate-200 shadow-sm p-5 transition-all hover:shadow-md`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2.5 rounded-xl bg-white shadow-sm`}>
                                        <Icon className={`size-5 ${meta.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Payment Type
                                        </p>
                                        <p className={`text-lg font-black ${meta.color}`}>
                                            {meta.label}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Payments
                                        </p>
                                        <p className="text-2xl font-black text-slate-800">
                                            {entry.count}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Total
                                        </p>
                                        <p className={`text-2xl font-black ${meta.color}`}>
                                            {entry.total.toLocaleString()}{" "}
                                            <span className="text-sm opacity-40">ETB</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
