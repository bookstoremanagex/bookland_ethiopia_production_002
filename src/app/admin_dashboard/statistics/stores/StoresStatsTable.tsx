"use client";

import { useState, useMemo, useCallback } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Store,
    Loader2,
} from "lucide-react";
import { getStoreStats } from "@/app/actions/statistics-actions";
import { Input } from "@/components/ui/input";

interface StoreEntry {
    name: string;
    location: string;
    totalQty: number;
    totalApproved: number;
    totalPaid: number;
}

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

export default function StoresStatsTable({
    initialData,
    initialGrandTotal,
}: {
    initialData: StoreEntry[];
    initialGrandTotal: number;
}) {
    const [range, setRange] = useState("30d");
    const [data, setData] = useState<StoreEntry[]>(initialData);
    const [grandTotal, setGrandTotal] = useState(initialGrandTotal);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([
        { id: "qty", desc: true },
    ]);

    const handleRangeChange = useCallback(async (value: string) => {
        setRange(value);
        setLoading(true);
        try {
            const result = await getStoreStats(value);
            setData(result.entries);
            setGrandTotal(result.grandTotal);
        } finally {
            setLoading(false);
        }
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.location.toLowerCase().includes(q)
        );
    }, [data, search]);

    const columns = useMemo<ColumnDef<StoreEntry>[]>(
        () => [
            {
                id: "name",
                header: "Store",
                accessorKey: "name",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-slate-800">
                            {row.original.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {row.original.location}
                        </span>
                    </div>
                ),
            },
            {
                id: "qty",
                header: "Books Ordered",
                accessorKey: "totalQty",
                cell: ({ row }) => (
                    <span className="font-bold text-sm text-slate-800 text-right block">
                        {row.original.totalQty.toLocaleString()}
                    </span>
                ),
            },
            {
                id: "approved",
                header: "Approved Total",
                accessorKey: "totalApproved",
                cell: ({ row }) => (
                    <span className="font-black text-sm text-emerald-600 text-right block">
                        {row.original.totalApproved.toLocaleString()}{" "}
                        <span className="text-[10px] opacity-40">ETB</span>
                    </span>
                ),
            },
            {
                id: "paid",
                header: "Amount Paid",
                accessorKey: "totalPaid",
                cell: ({ row }) => (
                    <span className="font-black text-sm text-slate-800 text-right block">
                        {row.original.totalPaid.toLocaleString()}{" "}
                        <span className="text-[10px] opacity-40">ETB</span>
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: filtered,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    return (
        <div className="space-y-4">
            {/* Summary card */}
            <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Total Approved
                    </p>
                    <p className="text-3xl font-black text-emerald-600">
                        {grandTotal.toLocaleString()}{" "}
                        <span className="text-sm font-bold opacity-40">ETB</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative max-w-sm flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Search stores..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 rounded-xl border-2 border-slate-200 text-sm font-bold placeholder:font-bold placeholder:text-slate-300"
                        />
                    </div>
                    <Select value={range} onValueChange={handleRangeChange}>
                        <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-xl border-2 border-slate-200 font-bold text-sm">
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

                {loading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="size-6 animate-spin mr-2" />
                        <span className="font-bold text-xs uppercase tracking-widest">
                            Loading...
                        </span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Store className="size-10 mb-3 opacity-40" />
                        <p className="font-bold text-xs uppercase tracking-widest">
                            {data.length === 0
                                ? "No approved orders in this period"
                                : "No stores match your search"}
                        </p>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow
                                        key={hg.id}
                                        className="border-b-2 border-slate-200 bg-slate-50"
                                    >
                                        {hg.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    "font-black text-[10px] uppercase tracking-widest text-slate-500 h-10",
                                                    (header.id === "qty" ||
                                                        header.id ===
                                                            "approved" ||
                                                        header.id ===
                                                            "paid") &&
                                                        "text-right"
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
                                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        {row.getVisibleCells().map(
                                            (cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {table.getRowModel().rows.length} of{" "}
                                {filtered.length} stores
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
                                    {table.getState().pagination.pageIndex +
                                        1}
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
            </div>
        </div>
    );
}
