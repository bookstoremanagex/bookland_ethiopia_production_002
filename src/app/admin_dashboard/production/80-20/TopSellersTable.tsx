"use client";

import { useCallback, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    BookOpen,
    Loader2,
    TrendingUp,
    PieChart,
    Sparkles,
    LayoutGrid,
    Table2,
    Crown,
} from "lucide-react";
import {
    getTopSellers,
    type TopSellersPeriod,
    type TopSellersResult,
    type TopSellerRow,
} from "@/app/actions/top-sellers-actions";

const PERIOD_OPTIONS: { label: string; value: TopSellersPeriod }[] = [
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
    { label: "All Time", value: "all_time" },
];

export default function TopSellersTable({
    initialData,
}: {
    initialData: TopSellersResult;
}) {
    const [period, setPeriod] = useState<TopSellersPeriod>("this_month");
    const [data, setData] = useState<TopSellersResult>(initialData);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [sorting, setSorting] = useState<SortingState>([
        { id: "totalQty", desc: true },
    ]);

    const handlePeriodChange = useCallback(async (value: TopSellersPeriod) => {
        setPeriod(value);
        setLoading(true);
        try {
            const result = await getTopSellers(value);
            setData(result);
        } finally {
            setLoading(false);
        }
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return data.books;
        const q = search.toLowerCase();
        return data.books.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                (b.author && b.author.toLowerCase().includes(q))
        );
    }, [data, search]);

    const columns = useMemo<ColumnDef<TopSellerRow>[]>(
        () => [
            {
                id: "rank",
                header: "#",
                cell: ({ row }) => (
                    <span className="inline-flex items-center justify-center size-8 rounded-full bg-primarycolor/10 text-primarycolor font-black text-xs">
                        {row.index + 1}
                    </span>
                ),
            },
            {
                id: "title",
                header: "Book",
                accessorKey: "title",
                cell: ({ row }) => (
                    <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="size-11 shrink-0 rounded-xl overflow-hidden border-2 border-primarycolor/10 bg-muted">
                            {row.original.book_image_url ? (
                                <img
                                    src={row.original.book_image_url}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="size-full flex items-center justify-center">
                                    <BookOpen className="size-4 text-primarycolor/50" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <span className="block font-black text-sm text-slate-800 leading-tight line-clamp-1">
                                {row.original.title}
                            </span>
                            {row.original.author && (
                                <span className="block text-[11px] font-bold text-slate-400 truncate">
                                    {row.original.author}
                                </span>
                            )}
                        </div>
                    </div>
                ),
            },
            {
                id: "totalQty",
                header: "Sold Qty",
                accessorKey: "totalQty",
                cell: ({ row }) => (
                    <span className="inline-flex items-center justify-center min-w-[3.5rem] px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-sm text-right">
                        {row.original.totalQty.toLocaleString()}
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
        initialState: { pagination: { pageSize: 10 } },
    });

    const topShare = data.totalQty > 0 ? Math.round((data.topQty / data.totalQty) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border-2 border-primarycolor/10 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-primarycolor mb-2">
                        <TrendingUp className="size-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Books Sold
                        </p>
                    </div>
                    <p className="text-3xl font-black text-slate-800">
                        {data.totalBooksSold.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/10 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-secondarycolor mb-2">
                        <PieChart className="size-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Top 20% Books
                        </p>
                    </div>
                    <p className="text-3xl font-black text-slate-800">
                        {data.topCount.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/10 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <Sparkles className="size-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Top 20% Units
                        </p>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">
                        {data.topQty.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/10 shadow-sm p-5">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <PieChart className="size-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Share of Sales
                        </p>
                    </div>
                    <p className="text-3xl font-black text-slate-800">{topShare}%</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b-2 border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative max-w-sm flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Search books or authors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 rounded-xl border-2 border-slate-200 text-sm font-bold placeholder:font-bold placeholder:text-slate-300"
                        />
                    </div>
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-xl border-2 border-slate-200 font-bold text-sm">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 border-slate-200">
                            {PERIOD_OPTIONS.map((opt) => (
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
                    <div className="flex bg-slate-100 rounded-xl p-0.5">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
                                viewMode === "grid"
                                    ? "bg-white text-primarycolor shadow-sm"
                                    : "text-slate-400 hover:text-slate-600",
                            )}
                        >
                            <LayoutGrid className="size-3.5" />
                            <span className="hidden xs:inline">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
                                viewMode === "table"
                                    ? "bg-white text-primarycolor shadow-sm"
                                    : "text-slate-400 hover:text-slate-600",
                            )}
                        >
                            <Table2 className="size-3.5" />
                            <span className="hidden xs:inline">Table</span>
                        </button>
                    </div>
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
                        <BookOpen className="size-10 mb-3 opacity-40" />
                        <p className="font-bold text-xs uppercase tracking-widest">
                            {data.books.length === 0
                                ? "No books sold in this period"
                                : "No books match your search"}
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                        {filtered.map((book, index) => (
                            <div
                                key={book.bookId}
                                className="group bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-primarycolor/30 transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                                    {book.book_image_url ? (
                                        <img
                                            src={book.book_image_url}
                                            alt=""
                                            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="size-full flex items-center justify-center">
                                            <BookOpen className="size-10 text-slate-200" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur text-white font-black text-[10px] uppercase tracking-widest">
                                            {index === 0 ? (
                                                <Crown className="size-3 text-amber-400" />
                                            ) : null}
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2 right-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-black text-xs shadow-lg">
                                            <Sparkles className="size-3" />
                                            {book.totalQty.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-black text-sm text-slate-800 leading-tight line-clamp-2">
                                        {book.title}
                                    </h3>
                                    {book.author && (
                                        <p className="text-[11px] font-bold text-slate-400 truncate mt-1">
                                            {book.author}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
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
                                                    header.id === "totalQty" &&
                                                        "text-right"
                                                )}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
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
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
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

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t-2 border-slate-200">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {table.getRowModel().rows.length} of{" "}
                                {filtered.length} books
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
            </div>
        </div>
    );
}