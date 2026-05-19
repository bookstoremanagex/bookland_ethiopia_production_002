"use client";

import React, { useState, useEffect, use } from "react";
import { 
    ArrowLeft, 
    Calendar,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    ClipboardList,
    User,
    Save,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getApprovalDocumentById, updateApprovalDocument } from "@/app/actions/approval-document-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DbApprovalDocument {
    id: number;
    documentNumber: string;
    title: string;
    requestedBy: string;
    approvedBy: string | null;
    status: string;
    approvalDate: Date | null;
    details: string;
    memo: string | null;
    createdAt: Date;
}

export default function ApprovalDocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const docId = parseInt(resolvedParams.id);

    const [document, setDocument] = useState<DbApprovalDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [memo, setMemo] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchDocumentDetails = async () => {
        setLoading(true);
        const res = await getApprovalDocumentById(docId);
        if (res.success && res.data) {
            const d = res.data;
            const mapped: DbApprovalDocument = {
                ...d,
                approvalDate: d.approvalDate ? new Date(d.approvalDate) : null,
                createdAt: new Date(d.createdAt)
            };
            setDocument(mapped);
            setMemo(mapped.memo || "");
        } else {
            toast.error(res.error || "Approval document not found.");
            router.push("/admin_dashboard/document_management/approval_documents");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (docId) {
            fetchDocumentDetails();
        }
    }, [docId]);

    const handleSaveMemo = async () => {
        setSaving(true);
        const res = await updateApprovalDocument(docId, { memo: memo || null });
        if (res.success) {
            toast.success("Approval document memo updated successfully!");
            fetchDocumentDetails();
        } else {
            toast.error(res.error || "Failed to update memo.");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 text-primarycolor animate-spin" />
                <span className="font-bold text-secondarycolor">Loading clearance details...</span>
            </div>
        );
    }

    if (!document) return null;

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-top-3 duration-500">
            {/* Navigation & Header */}
            <div className="space-y-4">
                <Link 
                    href="/admin_dashboard/document_management/approval_documents"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 hover:text-primarycolor transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Approvals
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 bg-primarycolor/5 border border-primarycolor/10 px-3 py-1 rounded-full w-fit">
                            <FileText className="size-3.5 text-primarycolor" /> {document.documentNumber} • Requisition Clearance
                        </div>
                        <h1 className="text-3xl font-black text-secondarycolor uppercase tracking-tight mt-2">
                            {document.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Split Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Requisition details (70%) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <h3 className="text-lg font-black text-secondarycolor uppercase tracking-tight border-b border-primarycolor/10 pb-4">
                            Operational Purpose / Clearance Details
                        </h3>
                        <div className="prose max-w-none text-sm font-medium text-secondarycolor/80 leading-relaxed whitespace-pre-wrap bg-background p-6 rounded-2xl border border-primarycolor/10 min-h-[300px]">
                            {document.details}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Metadata & Memo Note (30%) */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-5 shadow-sm">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-primarycolor/10 pb-3">
                            Authorization Parameters
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Requested By</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="size-6 rounded-full bg-primarycolor/10 flex items-center justify-center">
                                        <User className="size-3 text-primarycolor" />
                                    </div>
                                    <span className="text-sm font-semibold text-secondarycolor/80">{document.requestedBy}</span>
                                </div>
                            </div>

                            {document.approvedBy && (
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Authorizer / Approved By</p>
                                    <span className="text-sm font-bold text-secondarycolor mt-1 block">
                                        {document.approvedBy}
                                    </span>
                                </div>
                            )}

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Status</p>
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mt-1",
                                    document.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" :
                                    document.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-200/50" : 
                                    "bg-amber-50 text-amber-700 border-amber-200/50"
                                )}>
                                    {document.status === "Approved" ? <CheckCircle2 className="size-3.5" /> : 
                                     document.status === "Rejected" ? <XCircle className="size-3.5" /> : 
                                     <Clock className="size-3.5" />}
                                    {document.status}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-primarycolor/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Clearance Date</p>
                                <span className="text-xs font-semibold text-secondarycolor mt-1 flex items-center gap-1">
                                    <Calendar className="size-3.5 text-primarycolor/60" />
                                    {document.approvalDate ? document.approvalDate.toLocaleDateString() : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Memo Note Card (Only Editable field) */}
                    <div className="bg-card rounded-[2rem] border-2 border-amber-500/20 p-6 space-y-4 shadow-sm bg-amber-50/5">
                        <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3">
                            <ClipboardList className="size-4 text-amber-600" />
                            <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest">
                                Approval Memo Note
                            </h3>
                        </div>

                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                            Draft requisition conditions, system comments, or board review instructions below:
                        </p>

                        <Textarea 
                            rows={5}
                            placeholder="Add clearance remarks or reviews..." 
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
