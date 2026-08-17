"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DatabaseBackup,
    Loader2,
    CheckCircle2,
    XCircle,
    HardDrive,
    CalendarDays,
    Search,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { createLocalBackup, getLocalBackups } from "@/app/actions/backup-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCalendar } from "@/lib/calendar-context";
import { cn } from "@/lib/utils";

interface BackupRecord {
    id: number;
    databaseName: string;
    fileSizeBytes: number | null;
    status: string;
    createdAt: Date | string;
}

interface BackupClientProps {
    initialBackups: BackupRecord[];
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function triggerBlobDownload(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export default function BackupClient({ initialBackups }: BackupClientProps) {
    const router = useRouter();
    const { formatDateTime } = useCalendar();
    const [backups, setBackups] = useState<BackupRecord[]>(initialBackups);
    const [isCreating, setIsCreating] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const handleCreateBackup = async () => {
        setIsCreating(true);
        try {
            const res = await createLocalBackup();
            if (!res.success) {
                toast.error((res as any).error || "Backup failed");
                return;
            }
            const data = (res as any).data;
            triggerBlobDownload(new Blob([data.content], { type: "application/sql" }), data.fileName);
            toast.success("Backup created and downloaded successfully");
            startTransition(() => {
                router.refresh();
            });
            const refreshRes = await getLocalBackups();
            if (refreshRes.success) setBackups(refreshRes.data);
        } catch (error) {
            console.error("Backup error:", error);
            toast.error("Failed to create backup");
        } finally {
            setIsCreating(false);
        }
    };

    const columns: ColumnDef<BackupRecord>[] = [
        {
            accessorKey: "databaseName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0 font-black uppercase tracking-wider text-muted-foreground"
                >
                    File Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <DatabaseBackup className="h-4 w-4 text-primarycolor/70 shrink-0" />
                    <span className="font-bold text-slate-800 font-mono text-xs break-all">
                        {row.original.databaseName || "Untitled backup"}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "fileSizeBytes",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0 font-black uppercase tracking-wider text-muted-foreground"
                >
                    Size
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-xs font-bold text-muted-foreground tabular-nums">
                    {formatFileSize(row.original.fileSizeBytes)}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0 font-black uppercase tracking-wider text-muted-foreground"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const isSuccess = row.original.status === "success";
                return (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase",
                            isSuccess
                                ? "bg-green-50/50 border border-green-100 text-green-700"
                                : "bg-red-50/50 border border-red-100 text-red-700",
                        )}
                    >
                        {isSuccess ? (
                            <CheckCircle2 className="h-3 w-3" />
                        ) : (
                            <XCircle className="h-3 w-3" />
                        )}
                        {row.original.status}
                    </span>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0 font-black uppercase tracking-wider text-muted-foreground"
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const createdDate = row.original.createdAt instanceof Date ? row.original.createdAt : new Date(row.original.createdAt);
                return (
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-primarycolor/60" />
                        <span>{formatDateTime(createdDate)}</span>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: backups,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, _columnId, filterValue) => {
            const item = row.original;
            const q = String(filterValue).toLowerCase().trim();
            if (!q) return true;
            return (
                String(item.databaseName || "").toLowerCase().includes(q) ||
                String(item.status || "").toLowerCase().includes(q)
            );
        },
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Database <span className="text-secondarycolor not-italic">Backup</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight">
                        Create and manage local database backup files.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleCreateBackup}
                        disabled={isCreating || isPending}
                        className="bg-primarycolor hover:bg-primarycolor/90 text-white gap-2"
                    >
                        {isCreating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <DatabaseBackup className="h-4 w-4" />
                        )}
                        {isCreating ? "Creating Backup..." : "New Backup"}
                    </Button>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-primarycolor" />
                        <span className="text-sm font-black text-slate-800 uppercase tracking-wide">
                            Local Backup Records
                        </span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground tabular-nums">
                        {backups.length} total
                    </span>
                </div>

                {backups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-3">
                        <DatabaseBackup className="h-12 w-12 text-slate-300" />
                        <p className="text-slate-500 font-bold">No backups have been created yet.</p>
                        <p className="text-slate-400 text-sm font-semibold">
                            Click &quot;New Backup&quot; to create your first database backup.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4">
                                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                                <Input
                                    placeholder="Search by file name or status..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="h-10 border-none focus-visible:ring-0 bg-transparent font-bold text-slate-700 placeholder:text-slate-300 px-0"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-100">
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id} className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="px-6 py-4">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-40 text-center">
                                                <div className="flex flex-col items-center gap-2 opacity-40">
                                                    <Search className="h-8 w-8 text-slate-300" />
                                                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                                        No backups match your search
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                Showing {table.getRowModel().rows.length} of {backups.length} records
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="rounded-xl h-9 w-9 p-0 border-2 border-primarycolor/5"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="px-4 py-1.5 rounded-xl bg-white border-2 border-primarycolor/5 text-[10px] font-black text-primarycolor tabular-nums">
                                    {table.getState().pagination.pageIndex + 1}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="rounded-xl h-9 w-9 p-0 border-2 border-primarycolor/5"
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