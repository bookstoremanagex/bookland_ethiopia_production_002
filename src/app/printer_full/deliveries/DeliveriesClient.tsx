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
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    CheckCircle,
    XCircle,
    Loader2,
    Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCalendar } from "@/lib/calendar-context";
import { approveDelivery } from "@/app/actions/printer-delivery-actions";
import { toast } from "sonner";

interface DeliveryEntry {
    id: number;
    bookTitle: string;
    editionName: string;
    storeName: string | null;
    quantity: number | null;
    approvedByPrinter: boolean;
    approvedByPrinterAt: string | null;
    createdAt: string;
}

export default function DeliveriesClient({
    printerId,
    records,
}: {
    printerId: number;
    records: DeliveryEntry[];
}) {
    const { formatDateTime } = useCalendar();
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([
        { id: "created", desc: true },
    ]);
    const [search, setSearch] = useState("");
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const filtered = useMemo(() => {
        if (!search.trim()) return records;
        const q = search.toLowerCase();
        return records.filter(
            (r) =>
                r.bookTitle.toLowerCase().includes(q) ||
                r.editionName.toLowerCase().includes(q) ||
                (r.storeName ?? "").toLowerCase().includes(q)
        );
    }, [records, search]);

    const columns = useMemo<ColumnDef<DeliveryEntry>[]>(
        () => [
            {
                id: "book",
                header: "Book",
                accessorKey: "bookTitle",
                cell: ({ row }) => (
                    <span className="font-semibold text-sm text-slate-800">
                        {row.original.bookTitle}
                    </span>
                ),
            },
            {
                id: "edition",
                header: "Edition",
                accessorKey: "editionName",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.editionName}
                    </span>
                ),
            },
            {
                id: "store",
                header: "Store",
                accessorKey: "storeName",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.storeName ?? (
                            <span className="text-slate-300 italic">—</span>
                        )}
                    </span>
                ),
            },
            {
                id: "qty",
                header: "Qty",
                accessorKey: "quantity",
                cell: ({ row }) => (
                    <span className="text-right font-bold text-sm text-slate-800 block">
                        {row.original.quantity ?? (
                            <span className="text-slate-300">—</span>
                        )}
                    </span>
                ),
            },
            {
                id: "status",
                header: "Status",
                accessorKey: "approvedByPrinter",
                cell: ({ row }) => (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            row.original.approvedByPrinter
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                        )}
                    >
                        {row.original.approvedByPrinter ? (
                            <>
                                <CheckCircle className="size-3" />
                                Approved
                            </>
                        ) : (
                            <>
                                <XCircle className="size-3" />
                                Pending
                            </>
                        )}
                    </span>
                ),
            },
            {
                id: "created",
                header: "Created",
                accessorKey: "createdAt",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {formatDateTime(new Date(row.original.createdAt))}
                    </span>
                ),
            },
            {
                id: "approvedAt",
                header: "Approved At",
                accessorKey: "approvedByPrinterAt",
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.approvedByPrinterAt ? (
                            formatDateTime(
                                new Date(row.original.approvedByPrinterAt)
                            )
                        ) : (
                            <span className="text-slate-300 italic">—</span>
                        )}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => {
                    if (row.original.approvedByPrinter) return null;

                    const isApproving = approvingId === row.original.id;

                    return (
                        <Button
                            size="sm"
                            disabled={isApproving}
                            onClick={() => setConfirmId(row.original.id)}
                            className={cn(
                                "h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                "bg-emerald-500 hover:bg-emerald-600 text-white",
                                "disabled:opacity-50"
                            )}
                        >
                            {isApproving ? (
                                <Loader2 className="size-3 animate-spin mr-1" />
                            ) : (
                                <CheckCircle className="size-3 mr-1" />
                            )}
                            Approve
                        </Button>
                    );
                },
            },
        ],
        [formatDateTime, approvingId]
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

    const handleConfirmApprove = useCallback(async () => {
        if (confirmId === null) return;
        setApprovingId(confirmId);
        setConfirmId(null);
        try {
            const res = await approveDelivery(confirmId, printerId);
            if (res.success) {
                toast.success("Delivery approved");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to approve");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setApprovingId(null);
        }
    }, [confirmId, printerId, router]);

    const confirmRecord = confirmId
        ? records.find((r) => r.id === confirmId)
        : null;

    return (
        <>
        {/* ── DESKTOP TABLE ── */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Search bar */}
            <div className="p-4 border-b border-slate-100">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        placeholder="Search by book, edition or store..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 rounded-xl border-2 border-slate-200 text-sm font-bold placeholder:font-bold placeholder:text-slate-300"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Truck className="size-10 mb-3 opacity-40" />
                    <p className="font-bold text-xs uppercase tracking-widest">
                        {records.length === 0
                            ? "No deliveries yet"
                            : "No deliveries match your search"}
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
                                                header.id === "qty" &&
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
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
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
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="md:hidden space-y-4">
            {/* Mobile Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-10 rounded-xl border-2 border-slate-200 text-sm font-bold placeholder:font-bold placeholder:text-slate-300"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Truck className="size-8 mb-2 opacity-40" />
                    <p className="font-bold text-[10px] uppercase tracking-widest">
                        {records.length === 0
                            ? "No deliveries yet"
                            : "No deliveries match your search"}
                    </p>
                </div>
            ) : (
                <>
                    {table.getRowModel().rows.map((row) => {
                        const d = row.original;
                        return (
                            <div
                                key={d.id}
                                className="bg-white rounded-2xl border-2 border-slate-100 p-4 space-y-3 shadow-sm"
                            >
                                {/* Top row: Book + Status */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="font-black text-primarycolor text-sm leading-tight truncate">
                                            {d.bookTitle}
                                        </div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            {d.editionName}
                                        </div>
                                    </div>
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border shrink-0 self-start",
                                            d.approvedByPrinter
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                : "bg-amber-50 text-amber-600 border-amber-200"
                                        )}
                                    >
                                        {d.approvedByPrinter ? (
                                            <>
                                                <CheckCircle className="size-2.5" />
                                                Approved
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="size-2.5" />
                                                Pending
                                            </>
                                        )}
                                    </span>
                                </div>

                                {/* Data grid */}
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-50">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Store</p>
                                        <p className="font-bold text-sm text-primarycolor truncate">
                                            {d.storeName ?? <span className="text-slate-300">—</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Qty</p>
                                        <p className="font-black text-sm text-slate-800">
                                            {d.quantity ?? <span className="text-slate-300">—</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Created</p>
                                        <p className="font-bold text-xs text-primarycolor">
                                            {formatDateTime(new Date(d.createdAt))}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Approved</p>
                                        <p className="font-bold text-xs text-primarycolor">
                                            {d.approvedByPrinterAt
                                                ? formatDateTime(new Date(d.approvedByPrinterAt))
                                                : <span className="text-slate-300">—</span>
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Approve action */}
                                {!d.approvedByPrinter && (
                                    <Button
                                        size="sm"
                                        disabled={approvingId === d.id}
                                        onClick={() => setConfirmId(d.id)}
                                        className={cn(
                                            "w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                            "bg-emerald-500 hover:bg-emerald-600 text-white",
                                            "disabled:opacity-50"
                                        )}
                                    >
                                        {approvingId === d.id ? (
                                            <Loader2 className="size-3 animate-spin mr-1" />
                                        ) : (
                                            <CheckCircle className="size-3 mr-1" />
                                        )}
                                        Approve
                                    </Button>
                                )}
                            </div>
                        );
                    })}

                    {/* Mobile pagination */}
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                            {table.getRowModel().rows.length} of {filtered.length}
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
                            <span className="text-xs font-bold text-slate-600 min-w-[28px] text-center">
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

            {/* Confirm Dialog */}
            <Dialog
                open={confirmId !== null}
                onOpenChange={(open) => {
                    if (!open) setConfirmId(null);
                }}
            >
                <DialogContent className="rounded-2xl border-2 border-slate-200 shadow-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-black text-lg text-slate-800">
                            Approve Delivery
                        </DialogTitle>
                        <DialogDescription className="text-sm font-bold text-slate-500">
                            Are you sure you want to approve this delivery?
                            This action <span className="text-rose-500">cannot be undone</span>.
                        </DialogDescription>
                    </DialogHeader>

                    {confirmRecord && (
                        <div className="space-y-1.5 text-sm bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="font-semibold text-slate-800">
                                {confirmRecord.bookTitle} —{" "}
                                {confirmRecord.editionName}
                            </p>
                            <p className="font-bold text-slate-500">
                                Store: {confirmRecord.storeName ?? "—"} &middot;{" "}
                                Qty: {confirmRecord.quantity ?? "—"}
                            </p>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmId(null)}
                            className="rounded-xl border-2 border-slate-200 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmApprove}
                            className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black"
                        >
                            Yes, Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
