"use client";

import React, { useState, useEffect, use } from "react";
import { 
    ArrowLeft, 
    Calendar,
    FileSpreadsheet,
    CheckCircle2,
    Clock,
    AlertCircle,
    ClipboardList,
    DollarSign,
    Save,
    Loader2,
    Image as ImageIcon,
    ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getInvoiceById, updateInvoice } from "@/app/actions/invoice-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DbInvoice {
    id: number;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    status: string;
    dueDate: Date | null;
    issueDate: Date | null;
    imageUrl: string | null;
    memo: string | null;
    createdAt: Date;
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const invoiceId = parseInt(resolvedParams.id);

    const [invoice, setInvoice] = useState<DbInvoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [memo, setMemo] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchInvoiceDetails = async () => {
        setLoading(true);
        const res = await getInvoiceById(invoiceId);
        if (res.success && res.data) {
            const i = res.data;
            const mapped: DbInvoice = {
                ...i,
                dueDate: i.dueDate ? new Date(i.dueDate) : null,
                issueDate: i.issueDate ? new Date(i.issueDate) : null,
                createdAt: new Date(i.createdAt)
            };
            setInvoice(mapped);
            setMemo(mapped.memo || "");
        } else {
            toast.error(res.error || "Invoice not found.");
            router.push("/admin_dashboard/document_management/invoices");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceDetails();
        }
    }, [invoiceId]);

    const handleSaveMemo = async () => {
        setSaving(true);
        const res = await updateInvoice(invoiceId, { memo: memo || null });
        if (res.success) {
            toast.success("Invoice memo updated successfully!");
            fetchInvoiceDetails();
        } else {
            toast.error(res.error || "Failed to update memo.");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 text-primarycolor animate-spin" />
                <span className="font-bold text-secondarycolor">Loading invoice details...</span>
            </div>
        );
    }

    if (!invoice) return null;

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-top-3 duration-500">
            {/* Navigation & Header */}
            <div className="space-y-4">
                <Link 
                    href="/admin_dashboard/document_management/invoices"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 hover:text-primarycolor transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Invoices
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 bg-primarycolor/5 border border-primarycolor/10 px-3 py-1 rounded-full w-fit">
                            <FileSpreadsheet className="size-3.5 text-primarycolor" /> {invoice.invoiceNumber} • Billings
                        </div>
                        <h1 className="text-3xl font-black text-secondarycolor uppercase tracking-tight mt-2">
                            {invoice.customerName}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Split Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Attached Receipt / Document (70%) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-primarycolor/10 pb-4">
                            <h3 className="text-lg font-black text-secondarycolor uppercase tracking-tight">
                                Digital Receipt / Billing Attachment
                            </h3>
                            {invoice.imageUrl && (
                                <a 
                                    href={invoice.imageUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primarycolor hover:underline"
                                >
                                    Open Image <ExternalLink className="size-3.5" />
                                </a>
                            )}
                        </div>

                        {invoice.imageUrl ? (
                            <div className="relative border border-primarycolor/10 rounded-2xl overflow-hidden bg-muted flex items-center justify-center p-4 min-h-[400px]">
                                <img 
                                    src={invoice.imageUrl} 
                                    alt="Invoice Receipt attachment"
                                    className="max-h-[600px] w-auto object-contain rounded-lg shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-primarycolor/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 min-h-[300px]">
                                <ImageIcon className="size-12 text-primarycolor/20" />
                                <span className="font-bold text-secondarycolor/70">No invoice attachment uploaded.</span>
                                <span className="text-xs text-muted-foreground font-semibold">You can provide an invoice receipt link or file during creation.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Metadata & Memo Note (30%) */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-5 shadow-sm">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-primarycolor/10 pb-3">
                            Invoice Details Ledger
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Total Billing Amount</p>
                                <span className="inline-flex items-center gap-1 text-lg font-black text-secondarycolor mt-1">
                                    <DollarSign className="size-5 text-primarycolor/70" />
                                    {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Status</p>
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mt-1",
                                    invoice.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" :
                                    invoice.status === "Unpaid" ? "bg-sky-50 text-sky-700 border-sky-200/50" : 
                                    "bg-rose-50 text-rose-700 border-rose-200/50"
                                )}>
                                    {invoice.status === "Paid" ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
                                    {invoice.status}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-primarycolor/5 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Issue Date</p>
                                    <span className="text-xs font-semibold text-secondarycolor mt-1 flex items-center gap-1">
                                        <Calendar className="size-3.5 text-primarycolor/60" />
                                        {invoice.issueDate ? invoice.issueDate.toLocaleDateString() : "—"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Due Date</p>
                                    <span className="text-xs font-semibold text-secondarycolor mt-1 flex items-center gap-1">
                                        <Calendar className="size-3.5 text-primarycolor/60" />
                                        {invoice.dueDate ? invoice.dueDate.toLocaleDateString() : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Memo Note Card (Only Editable field) */}
                    <div className="bg-card rounded-[2rem] border-2 border-amber-500/20 p-6 space-y-4 shadow-sm bg-amber-50/5">
                        <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3">
                            <ClipboardList className="size-4 text-amber-600" />
                            <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest">
                                Invoice Memo Note
                            </h3>
                        </div>

                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                            Draft payment status remarks, banking routing codes, or payment terms below:
                        </p>

                        <Textarea 
                            rows={5}
                            placeholder="Add payment terms, cash references, or checks numbers..." 
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
