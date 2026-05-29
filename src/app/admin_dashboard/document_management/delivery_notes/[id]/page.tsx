"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Calendar,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    ClipboardList,
    User,
    Save,
    Loader2
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getDeliveryNoteById, updateDeliveryNote } from "@/app/actions/delivery-note-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";

interface DbDeliveryNote {
    id: number;
    deliveryNumber: string;
    receiverName: string;
    driverName: string;
    vehiclePlate: string | null;
    status: string;
    deliveryDate: Date | null;
    items: string;
    memo: string | null;
    createdAt: Date;
}

export default function DeliveryNoteDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();

    // Safely unwrap and resolve params.id
    const rawId = params?.id;
    const noteId = typeof rawId === "string" ? parseInt(rawId, 10) : NaN;

    const [note, setNote] = useState<DbDeliveryNote | null>(null);
    const [loading, setLoading] = useState(true);
    const [memo, setMemo] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!noteId || isNaN(noteId)) {
            toast.error("Invalid delivery note reference ID.");
            router.push("/admin_dashboard/document_management/delivery_notes");
            return;
        }

        const fetchNoteDetails = async () => {
            setLoading(true);
            try {
                const res = await getDeliveryNoteById(noteId);
                if (res.success && res.data) {
                    const n = res.data;
                    const mapped: DbDeliveryNote = {
                        ...n,
                        deliveryDate: n.deliveryDate ? new Date(n.deliveryDate) : null,
                        createdAt: new Date(n.createdAt)
                    };
                    setNote(mapped);
                    setMemo(mapped.memo || "");
                } else {
                    toast.error(res.error || "Delivery note not found.");
                    router.push("/admin_dashboard/document_management/delivery_notes");
                }
            } catch (error) {
                toast.error("An unexpected error occurred while fetching details.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoteDetails();
    }, [noteId, router]);

    const handleSaveMemo = async () => {
        if (isNaN(noteId)) return;

        setSaving(true);
        const res = await updateDeliveryNote(noteId, { memo: memo || null });
        if (res.success) {
            toast.success("Delivery note memo updated successfully!");
            // Refresh data state locally instead of hitting loading loops
            setNote((prev) => prev ? { ...prev, memo: memo || null } : null);
        } else {
            toast.error(res.error || "Failed to update memo.");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 text-primarycolor animate-spin" />
                <span className="font-bold text-secondarycolor">Loading delivery note details...</span>
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-top-3 duration-500">
            {/* Navigation & Header */}
            <div className="space-y-4">
                <Link
                    href="/admin_dashboard/document_management/delivery_notes"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 hover:text-primarycolor transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Delivery Notes
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 bg-primarycolor/5 border border-primarycolor/10 px-3 py-1 rounded-full w-fit">
                            <Truck className="size-3.5 text-primarycolor" /> {note.deliveryNumber} â€¢ Dispatch Ledger
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                            {note.receiverName}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Split Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Delivered Items Manifest (70%) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <h3 className="text-lg font-black text-secondarycolor uppercase tracking-tight border-b border-primarycolor/10 pb-4">
                            Delivered Items
                        </h3>
                        <div className="prose max-w-none text-sm font-medium text-secondarycolor/80 leading-relaxed whitespace-pre-wrap bg-background p-6 rounded-2xl border border-primarycolor/10 min-h-[300px]">
                            {note.items}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Metadata & Memo (30%) */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-5 shadow-sm">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-primarycolor/10 pb-3">
                            Delivery & Transit Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Driver Name</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="size-6 rounded-full bg-primarycolor/10 flex items-center justify-center">
                                        <User className="size-3 text-primarycolor" />
                                    </div>
                                    <span className="text-sm font-semibold text-secondarycolor/80">{note.driverName}</span>
                                </div>
                            </div>

                            {note.vehiclePlate && (
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Vehicle Plate Number</p>
                                    <span className="text-xs font-black uppercase tracking-wider text-secondarycolor mt-1 block">
                                        {note.vehiclePlate}
                                    </span>
                                </div>
                            )}

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Status</p>
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mt-1",
                                    note.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" :
                                        note.status === "In Transit" ? "bg-sky-50 text-sky-700 border-sky-200/50" :
                                            "bg-amber-50 text-amber-700 border-amber-200/50"
                                )}>
                                    {note.status === "Delivered" ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
                                    {note.status}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-primarycolor/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Dispatch Date</p>
                                <span className="text-xs font-semibold text-secondarycolor mt-1 flex items-center gap-1">
                                    <Calendar className="size-3.5 text-primarycolor/60" />
                                    {note.deliveryDate ? formatDate(new Date(note.deliveryDate)) : "â€”"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Memo Note Card (Only Editable field) */}
                    <div className="bg-card rounded-[2rem] border-2 border-amber-500/20 p-6 space-y-4 shadow-sm bg-amber-50/5">
                        <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3">
                            <ClipboardList className="size-4 text-amber-600" />
                            <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest">
                                Dispatch Note Memo
                            </h3>
                        </div>

                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                            Draft delivery instructions, receipt remarks, or specific transport checkpoints below:
                        </p>

                        <Textarea
                            rows={5}
                            placeholder="Add tracking instructions or recipient notes..."
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full rounded-xl border-amber-500/20 bg-background text-sm font-medium text-amber-900 focus:border-amber-500 focus:ring-amber-500/10"
                        />

                        <Button
                            onClick={handleSaveMemo}
                            disabled={saving}
                            className="w-full h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/10"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" /> Saving Memo...
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" /> Save Memo Note
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
