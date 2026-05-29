"use client";

import React, { useState, useMemo } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
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
import { Input } from "@/components/ui/input";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    X,
    Store,
    ArrowUpDown,
    ShoppingBag,
    ArrowRight,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddRetailPurchaseModal from "./AddRetailPurchaseModal";

const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    APPROVED: "bg-blue-50 text-blue-600 border-blue-200",
    PARTIALLY_PAID: "bg-purple-50 text-purple-600 border-purple-200",
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

export default function RetailManagementTable({ purchases }: { purchases: any[] }) {
    const router = useRouter();
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const data = useMemo(() => purchases, [purchases]);

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="hover:bg-transparent p-0 font-black">
                    ID <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => <span className="font-black text-primarycolor">#{row.getValue("id")}</span>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="hover:bg-transparent p-0 font-black">
                    CUSTOMER <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Store className="size-4 text-muted-foreground/50" />
                    <span className="font-bold">{row.getValue("name") || "Anonymous"}</span>
                </div>
            ),
        },
        {
            accessorKey: "total_amount",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="hover:bg-transparent p-0 font-black">
                    TOTAL <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const amount = row.getValue("total_amount") as number;
                return <span className="font-black">{amount?.toLocaleString() || 0} ETB</span>;
            },
        },
        {
            accessorKey: "amount_paid",
            header: "PAID",
            cell: ({ row }) => {
                const paid = row.getValue("amount_paid") as number;
                return <span className="font-bold text-emerald-600">{paid?.toLocaleString() || 0} ETB</span>;
            },
        },
        {
            accessorKey: "status",
            header: "STATUS",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <span className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", STATUS_STYLES[status] || "bg-slate-50 text-slate-600 border-slate-200")}>
                        {status?.replace("_", " ") || "PENDING"}
                    </span>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "DATE",
            cell: ({ row }) => {
                const date = row.getValue("createdAt") as string;
                return <span className="text-muted-foreground font-bold text-sm">{formatDate(new Date(date))}</span>;
            },
        },
        {
            accessorKey: "items",
            header: "ITEMS",
            cell: ({ row }) => {
                const items = row.getValue("items") as any[];
                return <span className="font-bold text-muted-foreground">{items?.length || 0}</span>;
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <Link href={`/admin_dashboard/retail_management/${row.original.id}`}>
                    <Button variant="ghost" className="rounded-xl gap-1.5 font-black text-[9px] uppercase tracking-widest">
                        <Eye className="size-3.5" /> View
                    </Button>
                </Link>
            ),
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: { sorting, globalFilter },
        globalFilterFn: "includesString",
        initialState: { pagination: { pageSize: 10 } },
    });

    const filteredCount = table.getFilteredRowModel().rows.length;

    return (
        <div className="space-y-6">
            {/* Search + Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <Input
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search purchases..."
                        className="h-12 pl-12 pr-10 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
                    />
                    {globalFilter && (
                        <button onClick={() => setGlobalFilter("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                            <X className="size-4" />
                        </button>
                    )}
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}
                    className="bg-primarycolor hover:bg-secondarycolor text-white rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primarycolor/20 gap-2">
                    <Plus className="size-4" /> Add Purchase
                </Button>
            </div>

            {/* Desktop Table: hidden on mobile */}
            <div className="hidden md:block">
                <div className="rounded-[2rem] border-2 border-primarycolor/5 bg-white shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-primarycolor/[0.02]">
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id} className="hover:bg-transparent border-b-2 border-primarycolor/5">
                                        {hg.headers.map((h) => (
                                            <TableHead key={h.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondarycolor/60">
                                                {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="group hover:bg-primarycolor/[0.02] transition-all border-b border-primarycolor/5">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-5 px-6">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-40 text-center">
                                            <ShoppingBag className="size-8 mx-auto text-slate-200 mb-3" />
                                            <p className="font-black text-slate-300 uppercase tracking-widest text-[10px]">No retail purchases yet</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Mobile Cards: visible only on small screens */}
            <div className="block md:hidden space-y-3">
                {data.length === 0 ? (
                    <div className="rounded-[2rem] border-2 border-primarycolor/5 bg-white shadow-2xl p-10 text-center">
                        <ShoppingBag className="size-8 mx-auto text-slate-200 mb-3" />
                        <p className="font-black text-slate-300 uppercase tracking-widest text-[10px]">No retail purchases yet</p>
                    </div>
                ) : (
                    (() => {
                        const start = table.getState().pagination.pageIndex * table.getState().pagination.pageSize;
                        const pageRows = data.slice(start, start + table.getState().pagination.pageSize);
                        return pageRows.map((p: any) => (
                            <Link key={p.id} href={`/admin_dashboard/retail_management/${p.id}`} className="block">
                                <div className="rounded-2xl border-2 border-primarycolor/5 bg-white shadow-sm p-4 space-y-3 active:scale-[0.98] transition-transform">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <ShoppingBag className="size-4 text-primarycolor/40 shrink-0" />
                                            <span className="font-black text-primarycolor text-sm truncate">#{p.id}</span>
                                            <span className="font-bold text-muted-foreground text-sm truncate">{p.name || "Anonymous"}</span>
                                        </div>
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border shrink-0",
                                            STATUS_STYLES[p.status] || "bg-slate-50 text-slate-600 border-slate-200"
                                        )}>
                                            {p.status?.replace("_", " ")}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-bold text-muted-foreground">Total</p>
                                            <p className="font-black text-primarycolor">{p.total_amount?.toLocaleString()} ETB</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-muted-foreground">Paid</p>
                                            <p className="font-black text-emerald-600">{p.amount_paid?.toLocaleString()} ETB</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-muted-foreground">Items</p>
                                            <p className="font-black text-muted-foreground">{p.items?.length || 0}</p>
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-bold text-muted-foreground">
                                        {formatDate(new Date(p.createdAt))}
                                    </div>
                                </div>
                            </Link>
                        ));
                    })()
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} &middot; {filteredCount} total
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                        className="h-10 rounded-xl border-2 border-primarycolor/5 font-black text-[10px] uppercase tracking-widest">
                        <ChevronLeft className="size-4 mr-1" /> Prev
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                        className="h-10 rounded-xl border-2 border-primarycolor/5 font-black text-[10px] uppercase tracking-widest">
                        Next <ChevronRight className="size-4 ml-1" />
                    </Button>
                </div>
            </div>

            <AddRetailPurchaseModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); router.refresh(); }} />
        </div>
    );
}
