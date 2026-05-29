"use client";

import React, { useState, useEffect, use } from "react";
import { 
    FileSignature, 
    ArrowLeft, 
    Calendar,
    User,
    CheckCircle2,
    Clock,
    AlertCircle,
    ClipboardList,
    DollarSign,
    Save,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getContractById, updateContract } from "@/app/actions/contract-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";

interface DbContract {
    id: number;
    title: string;
    party: string;
    type: string;
    status: string;
    details: string;
    value: number | null;
    memo: string | null;
    dateSigned: Date | null;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const contractId = parseInt(resolvedParams.id);

    const [contract, setContract] = useState<DbContract | null>(null);
    const [loading, setLoading] = useState(true);
    const [memo, setMemo] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchContractDetails = async () => {
        setLoading(true);
        const res = await getContractById(contractId);
        if (res.success && res.data) {
            const c = res.data;
            const mapped: DbContract = {
                ...c,
                dateSigned: c.dateSigned ? new Date(c.dateSigned) : null,
                startDate: c.startDate ? new Date(c.startDate) : null,
                endDate: c.endDate ? new Date(c.endDate) : null,
                createdAt: new Date(c.createdAt)
            };
            setContract(mapped);
            setMemo(mapped.memo || "");
        } else {
            toast.error(res.error || "Contract not found.");
            router.push("/admin_dashboard/document_management/contracts");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (contractId) {
            fetchContractDetails();
        }
    }, [contractId]);

    const handleSaveMemo = async () => {
        setSaving(true);
        const res = await updateContract(contractId, { memo: memo || null });
        if (res.success) {
            toast.success("Contract memo updated successfully!");
            fetchContractDetails();
        } else {
            toast.error(res.error || "Failed to update memo.");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 text-primarycolor animate-spin" />
                <span className="font-bold text-secondarycolor">Loading contract details...</span>
            </div>
        );
    }

    if (!contract) return null;

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-top-3 duration-500">
            {/* Navigation & Header */}
            <div className="space-y-4">
                <Link 
                    href="/admin_dashboard/document_management/contracts"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 hover:text-primarycolor transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Contracts
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 bg-primarycolor/5 border border-primarycolor/10 px-3 py-1 rounded-full w-fit">
                            <FileSignature className="size-3.5 text-primarycolor" /> CON-{String(contract.id).padStart(4, "0")} â€¢ {contract.type}
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                            {contract.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Split Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Contract Terms (70%) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Read-Only Details card */}
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <h3 className="text-lg font-black text-secondarycolor uppercase tracking-tight border-b border-primarycolor/10 pb-4">
                            Contract Terms & Conditions
                        </h3>
                        <div className="prose max-w-none text-sm font-medium text-secondarycolor/80 leading-relaxed whitespace-pre-wrap bg-background p-6 rounded-2xl border border-primarycolor/10 min-h-[300px]">
                            {contract.details}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Metadata & Editable Memo (30%) */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-5 shadow-sm">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-primarycolor/10 pb-3">
                            Agreement Info Ledger
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Party / Vendor</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="size-6 rounded-full bg-primarycolor/10 flex items-center justify-center">
                                        <User className="size-3 text-primarycolor" />
                                    </div>
                                    <span className="text-sm font-semibold text-secondarycolor/80">{contract.party}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Contract Value</p>
                                <span className="inline-flex items-center gap-1 text-sm font-black text-secondarycolor mt-1">
                                    <DollarSign className="size-4 text-primarycolor/70" />
                                    {contract.value ? `$${contract.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "â€”"}
                                </span>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Status</p>
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mt-1",
                                    contract.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" :
                                    contract.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200/50" : 
                                    "bg-slate-50 text-slate-600 border-slate-200/50"
                                )}>
                                    {contract.status === "Active" ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
                                    {contract.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-primarycolor/5">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Date Signed</p>
                                    <span className="text-xs font-semibold text-secondarycolor mt-1 flex items-center gap-1">
                                        <Calendar className="size-3 text-primarycolor/60" />
                                        {contract.dateSigned ? formatDate(new Date(contract.dateSigned)) : "â€”"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">Start Date</p>
                                    <span className="text-xs font-semibold text-secondarycolor mt-1 flex items-center gap-1">
                                        <Calendar className="size-3 text-primarycolor/60" />
                                        {contract.startDate ? formatDate(new Date(contract.startDate)) : "â€”"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/50">End Date</p>
                                <span className="text-xs font-semibold text-secondarycolor mt-1 flex items-center gap-1">
                                    <Calendar className="size-3 text-primarycolor/60" />
                                    {contract.endDate ? formatDate(new Date(contract.endDate)) : "â€”"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Memo Note Card (Only Editable field) */}
                    <div className="bg-card rounded-[2rem] border-2 border-amber-500/20 p-6 space-y-4 shadow-sm bg-amber-50/5">
                        <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3">
                            <ClipboardList className="size-4 text-amber-600" />
                            <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest">
                                Interactive Memo Note
                            </h3>
                        </div>

                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                            This is the dedicated workspace memo note. You can revise, update, or append status changes below:
                        </p>

                        <Textarea 
                            rows={5}
                            placeholder="Add memo instructions, review remarks or specific tracking guidelines..." 
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
                                    <Loader2 className="size-4 animate-spin" /> Updating Memo...
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
