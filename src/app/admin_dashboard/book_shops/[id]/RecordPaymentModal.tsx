"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Banknote,
    FileText,
    Loader2,
    CheckCircle2,
    Building2,
    User,
    DollarSign,
    Calendar,
    X,
    Upload,
    CheckSquare,
} from 'lucide-react';
import { createPayment } from '@/app/actions/payment-actions';
import { getChecks, createCheck, uploadCheckImageAction } from '@/app/actions/check-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RecordPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopId: number;
    shopName: string;
}

export default function RecordPaymentModal({ isOpen, onClose, shopId, shopName }: RecordPaymentModalProps) {
    const [amount, setAmount] = useState(0);
    const [paymentType, setPaymentType] = useState<"DIRECT" | "CHECK">("DIRECT");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [approveDirect, setApproveDirect] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);

    // Check-related state
    const [checkOption, setCheckOption] = useState<"new" | "existing">("new");
    const [selectedCheckId, setSelectedCheckId] = useState<number | null>(null);
    const [selectedCheckLabel, setSelectedCheckLabel] = useState("");
    const [checkFormData, setCheckFormData] = useState({
        username: "",
        bankname: "",
        type: "PAYMENT",
        amount: "",
        recordeddate: "",
        memo: "",
    });
    const [checkImageFile, setCheckImageFile] = useState<File | null>(null);
    const [checkImagePreview, setCheckImagePreview] = useState("");

    // Existing checks
    const [existingChecks, setExistingChecks] = useState<any[]>([]);
    const [existingChecksLoading, setExistingChecksLoading] = useState(false);
    const [showCheckSelector, setShowCheckSelector] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setAmount(0);
            setPaymentType("DIRECT");
            setCheckOption("new");
            setSelectedCheckId(null);
            setSelectedCheckLabel("");
            setCheckFormData({ username: "", bankname: "", type: "PAYMENT", amount: "", recordeddate: "", memo: "" });
            setCheckImageFile(null);
            setCheckImagePreview("");
            setApproveDirect(false);
            setShowApproveConfirm(false);
        }
    }, [isOpen]);

    const loadExistingChecks = async () => {
        setExistingChecksLoading(true);
        const res = await getChecks();
        if (res.success) setExistingChecks(res.data || []);
        setExistingChecksLoading(false);
    };

    const handleCheckImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCheckImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setCheckImagePreview(ev.target?.result as string || "");
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (amount <= 0) { toast.error("Enter a valid amount"); return; }
        if (paymentType === "CHECK") {
            if (checkOption === "new" && (!checkFormData.username || !checkFormData.bankname)) {
                toast.error("Username and Bank Name are required for check payment");
                return;
            }
            if (checkOption === "existing" && !selectedCheckId) {
                toast.error("Please select an existing check");
                return;
            }
        }

        if (paymentType === "DIRECT" && approveDirect) {
            setShowApproveConfirm(true);
            return;
        }

        await doSubmit();
    };

    const doSubmit = async () => {
        setIsSubmitting(true);
        try {
            let finalCheckId: number | null = selectedCheckId;

            if (paymentType === "CHECK" && checkOption === "new") {
                let imageUrl = "";
                if (checkImageFile) {
                    const fd = new FormData();
                    fd.append("file", checkImageFile);
                    const uploadRes = await uploadCheckImageAction(fd);
                    if (uploadRes.success && uploadRes.url) imageUrl = uploadRes.url;
                }
                const checkRes = await createCheck({ ...checkFormData, imageUrl });
                if (!checkRes.success) {
                    toast.error(checkRes.error || "Failed to create check");
                    setIsSubmitting(false);
                    return;
                }
                finalCheckId = checkRes.data.id;
            }

            const res = await createPayment({
                shopId,
                amount,
                payment_type: paymentType,
                checkId: finalCheckId,
                approve: paymentType === "DIRECT" && approveDirect || null,
            });

            if (res.success) {
                toast.success(approveDirect && paymentType === "DIRECT"
                    ? "Payment recorded and approved automatically!"
                    : "Payment recorded successfully! Pending admin approval.");
                onClose();
            } else {
                toast.error(res.error || "Failed to record payment");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] rounded-[2rem] border-4 border-primarycolor/5 bg-white p-0 flex flex-col">
                <DialogHeader className="shrink-0 p-6 md:p-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <Banknote className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-primarycolor uppercase italic">
                                Record Payment <span className="text-secondarycolor not-italic">for {shopName}</span>
                            </DialogTitle>
                            <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                Enter payment details below
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Amount</label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                className="h-14 pl-12 rounded-2xl border-2 border-slate-100 font-bold text-lg focus:border-emerald-500"
                                placeholder="0.00"
                                disabled={paymentType === "CHECK" && checkOption === "existing"}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">ETB</span>
                        </div>
                        {paymentType === "CHECK" && checkOption === "existing" && (
                            <p className="text-[8px] text-muted-foreground font-bold">Amount is taken from the selected check</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setPaymentType("DIRECT"); setSelectedCheckId(null); }}
                                className={cn(
                                    "flex-1 p-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all cursor-pointer",
                                    paymentType === "DIRECT"
                                        ? "border-primarycolor bg-primarycolor/5 text-primarycolor"
                                        : "border-slate-100 bg-white text-muted-foreground hover:border-primarycolor/30"
                                )}
                            >
                                <Banknote className="size-5 mx-auto mb-1" />
                                Direct Payment
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentType("CHECK")}
                                className={cn(
                                    "flex-1 p-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all cursor-pointer",
                                    paymentType === "CHECK"
                                        ? "border-primarycolor bg-primarycolor/5 text-primarycolor"
                                        : "border-slate-100 bg-white text-muted-foreground hover:border-primarycolor/30"
                                )}
                            >
                                <FileText className="size-5 mx-auto mb-1" />
                                Check Payment
                            </button>
                        </div>

                        {paymentType === "CHECK" && (
                            <div className="space-y-4 p-5 rounded-2xl border-2 border-primarycolor/10 bg-primarycolor/[0.02]">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCheckOption("new")}
                                        className={cn(
                                            "flex-1 py-2.5 rounded-xl border-2 font-black uppercase tracking-widest text-[8px] transition-all cursor-pointer",
                                            checkOption === "new"
                                                ? "border-primarycolor bg-primarycolor/10 text-primarycolor"
                                                : "border-slate-100 bg-white text-muted-foreground"
                                        )}
                                    >
                                        New Check
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { loadExistingChecks(); setShowCheckSelector(true); }}
                                        className={cn(
                                            "flex-1 py-2.5 rounded-xl border-2 font-black uppercase tracking-widest text-[8px] transition-all cursor-pointer",
                                            checkOption === "existing"
                                                ? "border-primarycolor bg-primarycolor/10 text-primarycolor"
                                                : "border-slate-100 bg-white text-muted-foreground"
                                        )}
                                    >
                                        {selectedCheckLabel ? "Change" : "Existing Check"}
                                    </button>
                                </div>

                                {checkOption === "new" && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                                    <Input required value={checkFormData.username}
                                                        onChange={(e) => setCheckFormData({...checkFormData, username: e.target.value})}
                                                        className="h-11 pl-9 rounded-xl border-2 font-bold text-xs" placeholder="Account username..." />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bank Name</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                                    <Input required value={checkFormData.bankname}
                                                        onChange={(e) => setCheckFormData({...checkFormData, bankname: e.target.value})}
                                                        className="h-11 pl-9 rounded-xl border-2 font-bold text-xs" placeholder="Bank name..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                                                <Select value={checkFormData.type} onValueChange={(v) => setCheckFormData({...checkFormData, type: v})}>
                                                    <SelectTrigger className="h-11 rounded-xl border-2 font-bold text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-2">
                                                        <SelectItem value="PAYMENT" className="font-bold text-xs">Payment Check</SelectItem>
                                                        <SelectItem value="COLLATERAL" className="font-bold text-xs">Collateral</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                                    <Input value={checkFormData.amount}
                                                        onChange={(e) => {
                                                            setCheckFormData({...checkFormData, amount: e.target.value});
                                                            setAmount(parseFloat(e.target.value) || 0);
                                                        }}
                                                        className="h-11 pl-9 rounded-xl border-2 font-bold text-xs" placeholder="0.00" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                                    <DateInput value={checkFormData.recordeddate}
                                                        onChange={(e) => setCheckFormData({...checkFormData, recordeddate: e.target.value})}
                                                        className="h-11 pl-9 rounded-xl border-2 font-bold text-xs" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground ml-1">Image (optional)</label>
                                                <div className="flex items-center gap-2">
                                                    <Button type="button" variant="outline"
                                                        onClick={() => document.getElementById("pmt-check-img")?.click()}
                                                        className="h-11 flex-1 rounded-xl border-2 font-bold text-[7px] gap-1.5">
                                                        <Upload className="size-3.5" />
                                                        {checkImageFile ? "Change" : "Upload"}
                                                    </Button>
                                                    {checkImagePreview && (
                                                        <div className="relative size-11 shrink-0">
                                                            <img src={checkImagePreview} alt="" className="size-full rounded-xl object-cover border-2" />
                                                            <button type="button" onClick={() => { setCheckImageFile(null); setCheckImagePreview(""); }}
                                                                className="absolute -top-1.5 -right-1.5 size-4 bg-rose-500 text-white rounded-full flex items-center justify-center cursor-pointer">
                                                                <X className="size-2.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <input id="pmt-check-img" type="file" accept="image/*" className="hidden" onChange={handleCheckImageChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground ml-1">Memo</label>
                                            <Input value={checkFormData.memo}
                                                onChange={(e) => setCheckFormData({...checkFormData, memo: e.target.value})}
                                                className="h-11 rounded-xl border-2 font-bold text-xs" placeholder="Optional..." />
                                        </div>
                                    </div>
                                )}

                                {checkOption === "existing" && selectedCheckId && (
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                                        <CheckCircle2 className="size-5 mx-auto mb-1 text-emerald-600" />
                                        <p className="font-bold text-emerald-800 text-sm">{selectedCheckLabel}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {paymentType === "DIRECT" && (
                            <button
                                type="button"
                                onClick={() => setApproveDirect(!approveDirect)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left",
                                    approveDirect
                                        ? "border-emerald-400 bg-emerald-50"
                                        : "border-slate-100 bg-white hover:border-emerald-300"
                                )}
                            >
                                <div
                                    className={cn(
                                        "size-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                                        approveDirect ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white text-transparent"
                                    )}
                                >
                                    <CheckSquare className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800">Approve</p>
                                    <p className="text-[8px] font-bold text-emerald-600/70">
                                        Record this direct payment as already approved
                                    </p>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <DialogFooter className="shrink-0 bg-slate-50 p-6 border-t border-slate-100 flex gap-3">
                    <Button variant="outline" onClick={onClose}
                        className="flex-1 h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}
                        className="flex-[2] h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2">
                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                        {isSubmitting ? "Recording..." : "Record Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Auto-approve confirmation */}
        <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
            <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                        Approve <span className="text-secondarycolor not-italic">Payment</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
                        This direct payment of {amount.toLocaleString()} ETB will be recorded as APPROVED automatically and
                        deducted from the shop&apos;s debt. Do you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 pt-2">
                    <AlertDialogCancel asChild>
                        <Button variant="outline" className="h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex-1">
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            onClick={async () => {
                                setShowApproveConfirm(false);
                                await doSubmit();
                            }}
                            className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] flex-1"
                        >
                            Confirm & Approve
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Existing Check Selector */}
        <Dialog open={showCheckSelector} onOpenChange={(o) => !o && setShowCheckSelector(false)}>
            <DialogContent className="sm:max-w-lg rounded-[2rem] p-6 md:p-8">
                <DialogHeader className="p-0 pb-4">
                    <DialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                        Select <span className="text-secondarycolor not-italic">Check</span>
                    </DialogTitle>
                </DialogHeader>
                {existingChecksLoading ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground font-bold">
                        <Loader2 className="size-4 animate-spin" /> Loading checks...
                    </div>
                ) : existingChecks.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground font-bold text-sm">No checks found</div>
                ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {existingChecks.filter((c: any) => c.status === "PENDING").map((check: any) => (
                            <button key={check.id} type="button"
                                onClick={() => {
                                    setSelectedCheckId(check.id);
                                    setSelectedCheckLabel(`${check.bankname || "Unknown Bank"} – ${check.username || "Unknown"} (${check.amount ? `${check.amount} ETB` : "—"})`);
                                    setAmount(parseFloat(check.amount) || 0);
                                    setCheckOption("existing");
                                    setShowCheckSelector(false);
                                }}
                                className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-primarycolor/30 bg-white transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-primarycolor text-sm">{check.bankname || "Unknown Bank"}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground">{check.username || "Unknown"} — {check.type || "—"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-emerald-700 text-sm">{check.amount ? `${check.amount} ETB` : "—"}</p>
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase">{check.status}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {existingChecks.filter((c: any) => c.status === "PENDING").length === 0 && (
                            <div className="text-center py-6 text-muted-foreground font-bold text-sm">No pending checks available</div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
        </>
    );
}
