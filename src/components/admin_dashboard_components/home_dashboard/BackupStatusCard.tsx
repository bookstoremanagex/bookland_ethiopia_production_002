"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DatabaseBackup, Loader2, AlertTriangle, AlertCircle, ShieldCheck } from "lucide-react";
import { createLocalBackup } from "@/app/actions/backup-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackupStatusCardProps {
    lastBackupAt: string | null;
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

export default function BackupStatusCard({ lastBackupAt }: BackupStatusCardProps) {
    const router = useRouter();
    const [now, setNow] = useState(() => Date.now());
    const [creating, setCreating] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(t);
    }, []);

    const diffMs = lastBackupAt ? now - new Date(lastBackupAt).getTime() : null;
    const totalMins = diffMs !== null ? Math.max(0, Math.floor(diffMs / 60000)) : null;

    const hours = totalMins !== null ? Math.floor(totalMins / 60) : null;
    const minutes = totalMins !== null ? totalMins % 60 : null;

    let level: "ok" | "warning" | "danger" | "none" = "none";
    if (totalMins !== null) {
        if (totalMins < 12 * 60) level = "ok";
        else if (totalMins <= 24 * 60) level = "warning";
        else level = "danger";
    }

    const levelStyles = {
        ok: {
            card: "border-emerald-200/70 bg-emerald-50/60",
            icon: "from-emerald-500 to-emerald-300 text-emerald-700",
            text: "text-emerald-800",
            sub: "text-emerald-700/70",
            dot: "bg-emerald-500",
            label: "text-emerald-700",
            badge: "border-emerald-200 bg-emerald-100 text-emerald-800",
        },
        warning: {
            card: "border-amber-200/70 bg-amber-50/60",
            icon: "from-amber-500 to-amber-300 text-amber-700",
            text: "text-amber-800",
            sub: "text-amber-700/70",
            dot: "bg-amber-500",
            label: "text-amber-700",
            badge: "border-amber-200 bg-amber-100 text-amber-800",
        },
        danger: {
            card: "border-red-200/70 bg-red-50/60",
            icon: "from-red-500 to-red-300 text-red-700",
            text: "text-red-800",
            sub: "text-red-700/70",
            dot: "bg-red-500",
            label: "text-red-700",
            badge: "border-red-200 bg-red-100 text-red-800",
        },
        none: {
            card: "border-slate-200/70 bg-slate-50/60",
            icon: "from-slate-500 to-slate-300 text-slate-700",
            text: "text-slate-800",
            sub: "text-slate-600/70",
            dot: "bg-slate-400",
            label: "text-slate-600",
            badge: "border-slate-200 bg-slate-100 text-slate-700",
        },
    }[level];

    const streamDownload = async (id: number, fileName: string) => {
        setProgress(0);
        try {
            const res = await fetch(`/api/backup/download/${id}`);
            if (!res.ok) throw new Error(`Download failed (${res.status})`);
            const contentLength = Number(res.headers.get("Content-Length")) || 0;
            if (!res.body) throw new Error("Response body unavailable");
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
                        setProgress(Math.min(100, Math.round((received / contentLength) * 100)));
                    }
                }
            }
            setProgress(100);
            triggerBlobDownload(new Blob(chunks, { type: "application/sql" }), fileName);
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download backup file");
        } finally {
            setProgress(null);
        }
    };

    const handleRecordBackup = async () => {
        setCreating(true);
        try {
            const res = await createLocalBackup();
            if (!res.success) {
                toast.error((res as any).error || "Backup failed");
                return;
            }
            const data = (res as any).data;
            await streamDownload(data.id, data.fileName);
            toast.success("Backup recorded successfully");
            router.refresh();
        } catch (error) {
            console.error("Backup error:", error);
            toast.error("Failed to record backup");
        } finally {
            setCreating(false);
        }
    };

    const statusLabel =
        totalMins === null
            ? "No backup recorded yet"
            : level === "ok"
              ? "Backup up to date"
              : level === "warning"
                ? "Backup getting old"
                : "Backup is overdue";

    return (
        <section className={cn("relative overflow-hidden rounded-2xl border p-5 transition-colors duration-500 sm:p-6 lg:rounded-3xl", levelStyles.card)}>
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn("relative flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg shadow-primarycolor/20", levelStyles.icon)}>
                        {totalMins === null ? (
                            <DatabaseBackup className="size-5" />
                        ) : level === "ok" ? (
                            <ShieldCheck className="size-5" />
                        ) : level === "warning" ? (
                            <AlertTriangle className="size-5" />
                        ) : (
                            <AlertCircle className="size-5" />
                        )}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className={cn("text-base font-bold tracking-tight", levelStyles.text)}>Database Backup</h2>
                            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider", levelStyles.badge)}>
                                <span className={cn("relative flex size-1.5")}>
                                    <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", levelStyles.dot)} />
                                    <span className={cn("relative inline-flex size-1.5 rounded-full", levelStyles.dot)} />
                                </span>
                                {statusLabel}
                            </span>
                        </div>
                        <p className={cn("mt-1 text-sm font-semibold", levelStyles.sub)}>
                            {totalMins === null
                                ? "Create your first backup to protect your data."
                                : `Last backup was ${hours}h ${minutes}m ago.`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 md:items-end">
                    <Button
                        onClick={handleRecordBackup}
                        disabled={creating || progress !== null}
                        className="h-11 w-full gap-2 rounded-xl bg-primarycolor px-5 text-white font-black uppercase tracking-wider shadow-lg shadow-primarycolor/20 hover:brightness-110 active:scale-[0.98] transition-all duration-300 md:w-auto"
                    >
                        {creating ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <DatabaseBackup className="size-4" />
                        )}
                        {creating ? "Recording..." : "Record Backup"}
                    </Button>

                    {progress !== null && (
                        <div className="w-full md:w-56">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Downloading</span>
                                <span className="text-[10px] font-black tabular-nums text-muted-foreground">{progress}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-primarycolor/10 overflow-hidden">
                                <div className="h-full rounded-full bg-primarycolor transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}