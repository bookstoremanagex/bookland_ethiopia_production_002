"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DatabaseBackup, Download, Loader2, CheckCircle2, XCircle, HardDrive, CalendarDays, Trash2 } from "lucide-react";
import { createLocalBackup, deleteLocalBackup, getLocalBackups } from "@/app/actions/backup-actions";
import { Button } from "@/components/ui/button";
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
    const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const streamDownload = async (id: number, fileName: string) => {
        setDownloadingId(id);
        setDownloadProgress(0);
        try {
            const res = await fetch(`/api/backup/download/${id}`);
            if (!res.ok) {
                throw new Error(`Download failed (${res.status})`);
            }
            const contentLength = Number(res.headers.get("Content-Length")) || 0;
            if (!res.body) {
                throw new Error("Response body unavailable");
            }

            const reader = res.body.getReader();
            const chunks: BlobPart[] = [];
            let received = 0;

            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    chunks.push(value.buffer as ArrayBuffer);
                    received += value.length;
                    if (contentLength > 0) {
                        setDownloadProgress(Math.min(100, Math.round((received / contentLength) * 100)));
                    }
                }
            }

            setDownloadProgress(100);
            const blob = new Blob(chunks, { type: "application/sql" });
            triggerBlobDownload(blob, fileName);
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download backup file");
        } finally {
            setDownloadingId(null);
            setDownloadProgress(null);
        }
    };

    const handleCreateBackup = async () => {
        setIsCreating(true);
        try {
            const res = await createLocalBackup();
            if (!res.success) {
                toast.error((res as any).error || "Backup failed");
                return;
            }
            const data = (res as any).data;
            await streamDownload(data.id, data.fileName);
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

    const handleDeleteBackup = async (id: number) => {
        if (!confirm("Are you sure you want to delete this backup record?")) return;
        const res = await deleteLocalBackup(id);
        if (res.success) {
            toast.success("Backup record deleted");
            setBackups((prev) => prev.filter((b) => b.id !== id));
        } else {
            toast.error((res as any).error || "Failed to delete backup record");
        }
    };

    const showProgress = downloadProgress !== null;

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

            {showProgress && (
                <div className="mb-8 rounded-2xl border border-primarycolor/20 bg-primarycolor/5 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-primarycolor uppercase tracking-wide">
                            Downloading backup...
                        </span>
                        <span className="text-sm font-black text-primarycolor tabular-nums">
                            {downloadProgress}%
                        </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-primarycolor/10 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primarycolor transition-all duration-200 ease-out"
                            style={{ width: `${downloadProgress ?? 0}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                        File Name
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                        Size
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {backups.map((backup) => {
                                    const createdDate = backup.createdAt instanceof Date ? backup.createdAt : new Date(backup.createdAt);
                                    const isSuccess = backup.status === "success";
                                    const isDownloading = downloadingId === backup.id;
                                    return (
                                        <tr key={backup.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <DatabaseBackup className="h-4 w-4 text-primarycolor/70 shrink-0" />
                                                    <span className="font-bold text-slate-800 font-mono text-xs break-all">
                                                        {backup.databaseName || "Untitled backup"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-muted-foreground tabular-nums">
                                                    {formatFileSize(backup.fileSizeBytes)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
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
                                                    {backup.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                    <CalendarDays className="h-3.5 w-3.5 text-primarycolor/60" />
                                                    <span>{formatDateTime(createdDate)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-secondarycolor hover:bg-secondarycolor/10"
                                                        title="Download backup file"
                                                        disabled={downloadingId !== null}
                                                        onClick={() =>
                                                            streamDownload(backup.id, backup.databaseName || `backup_${backup.id}.sql`)
                                                        }
                                                    >
                                                        {isDownloading ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Download className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                        title="Delete backup record"
                                                        disabled={downloadingId !== null}
                                                        onClick={() => handleDeleteBackup(backup.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}