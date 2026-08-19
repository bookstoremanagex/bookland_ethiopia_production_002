"use client";

import { useState, useEffect } from "react";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Banknote,
    CheckCircle2,
    Loader2,
    ChevronsUpDown,
    Plus,
    Landmark,
    User,
    Building2,
    Tag,
    DollarSign,
    Calendar,
    FileText,
    X,
    ListOrdered,
    Upload,
    ShieldCheck,
    Printer,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getChecks, createCheck } from "@/app/actions/check-actions";
import { createPayment } from "@/app/actions/payment-actions";
import { getPrinters } from "@/app/actions/printer-actions";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    shopId: number;
    shopName: string;
    orderId?: number | null;
    orderTotal?: number | null;
    orderPaid?: number | null;
    showPrinterPayment?: boolean;
}

export default function RecordPaymentModal({ isOpen, onClose, shopId, shopName, orderId, orderTotal, orderPaid, showPrinterPayment = false }: Props) {
    const router = useRouter();
    const [paymentType, setPaymentType] = useState<string>("DIRECT");
    const [amount, setAmount] = useState<string>("");
    const [memo, setMemo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isForPreviousDebts, setIsForPreviousDebts] = useState(false);
    const [approveDirect, setApproveDirect] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);

    const [printers, setPrinters] = useState<any[]>([]);
    const [isForPrinter, setIsForPrinter] = useState(false);
    const [selectedPrinter, setSelectedPrinter] = useState("");
    const [printerPaymentMemo, setPrinterPaymentMemo] = useState("");

    const [checks, setChecks] = useState<any[]>([]);
    const [openCheckSearch, setOpenCheckSearch] = useState(false);
    const [selectedCheck, setSelectedCheck] = useState<any>(null);
    const [checkSearch, setCheckSearch] = useState("");

    const [showNewCheck, setShowNewCheck] = useState(false);
    const [newCheck, setNewCheck] = useState({
        username: "",
        bankname: "",
        type: "PAYMENT",
        amount: "",
        expirydate: "",
        memo: "",
    });
    const [isCreatingCheck, setIsCreatingCheck] = useState(false);
    const [checkImageUrl, setCheckImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (isOpen && paymentType === "CHECK") {
            loadChecks();
        }
    }, [isOpen, paymentType]);

    useEffect(() => {
        if (isOpen && showPrinterPayment) {
            loadPrinters();
        }
    }, [isOpen, showPrinterPayment]);

    const loadPrinters = async () => {
        const res = await getPrinters();
        if (res.success) {
            setPrinters(res.data || []);
        }
    };

    // Auto-sync check amount with payment amount when opening new check form
    useEffect(() => {
        if (showNewCheck && amount) {
            setNewCheck((prev) => ({ ...prev, amount }));
        }
    }, [showNewCheck]);

    const loadChecks = async () => {
        const res = await getChecks();
        if (res.success) {
            setChecks(res.data || []);
        }
    };

    const handleCheckImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadProgress(0);

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("file", file);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                setUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText);
                if (res.success) {
                    setCheckImageUrl(res.url);
                    setUploadProgress(100);
                }
            }
            setUploading(false);
        };

        xhr.onerror = () => {
            setUploading(false);
            toast.error("Failed to upload image");
        };

        xhr.open("POST", "/api/upload-check-image");
        xhr.send(formData);
    };

    const handleCreateCheck = async () => {
        if (!newCheck.username || !newCheck.bankname || !newCheck.amount) {
            toast.error("Username, Bank Name, and Amount are required");
            return;
        }
        setIsCreatingCheck(true);
        try {
            const res = await createCheck({
                username: newCheck.username,
                bankname: newCheck.bankname,
                type: newCheck.type,
                amount: newCheck.amount,
                expirydate: newCheck.expirydate || undefined,
                memo: newCheck.memo || "",
                imageUrl: checkImageUrl || undefined,
            });
            if (res.success) {
                toast.success("Check created successfully");
                setShowNewCheck(false);
                setNewCheck({ username: "", bankname: "", type: "PAYMENT", amount: "", expirydate: "", memo: "" });
                setCheckImageUrl("");
                setUploadProgress(0);
                await loadChecks();
                setSelectedCheck(res.data);
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Failed to create check");
        } finally {
            setIsCreatingCheck(false);
        }
    };

    const handleSubmit = async () => {
        const parsedAmount = parseFloat(amount);
        if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        if (paymentType === "CHECK" && !selectedCheck) {
            toast.error("Select a check for the payment");
            return;
        }

        if (isForPrinter && !selectedPrinter) {
            toast.error("Select a printer for this payment");
            return;
        }

        if (paymentType === "DIRECT" && approveDirect) {
            setShowApproveConfirm(true);
            return;
        }

        await doSubmit();
    };

    const doSubmit = async () => {
        const parsedAmount = parseFloat(amount);
        setIsSubmitting(true);
        try {
            const res = await createPayment({
                shopId,
                amount: parsedAmount,
                payment_type: paymentType as "DIRECT" | "CHECK",
                checkId: paymentType === "CHECK" ? selectedCheck?.id || null : null,
                orderid: orderId ? String(orderId) : null,
                memo: memo || null,
                is_for_previous_debts: orderId ? null : (isForPreviousDebts || null),
                is_for_printer: isForPrinter || null,
                printer_id: isForPrinter && selectedPrinter ? Number(selectedPrinter) : null,
                printer_payment_memo: isForPrinter && printerPaymentMemo ? printerPaymentMemo : null,
                approve: paymentType === "DIRECT" && approveDirect || null,
            });

            if (res.success) {
                toast.success(approveDirect && paymentType === "DIRECT"
                    ? "Payment recorded and approved automatically!"
                    : "Payment recorded successfully");
                onClose();
                setAmount("");
                setMemo("");
                setSelectedCheck(null);
                setPaymentType("DIRECT");
                setShowNewCheck(false);
                setIsForPreviousDebts(false);
                setApproveDirect(false);
                setIsForPrinter(false);
                setSelectedPrinter("");
                setPrinterPaymentMemo("");
                router.refresh();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Failed to record payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredChecks = checks.filter((c: any) =>
        c.status === "PENDING" &&
        (c.bankname?.toLowerCase().includes(checkSearch.toLowerCase()) ||
         c.username?.toLowerCase().includes(checkSearch.toLowerCase()))
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                <DialogHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <Banknote className="size-5 md:size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-lg md:text-xl font-black text-primarycolor uppercase italic truncate">
                                Record Payment
                            </DialogTitle>
                            <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                                {shopName}
                            </DialogDescription>
                            {orderId && (
                                <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">
                                    <ListOrdered className="size-2.5 inline mr-1" />
                                    #ORD-{orderId}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 md:space-y-6">
                    {orderId && orderTotal != null && (
                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                            <div className="text-center p-3 md:p-4 rounded-2xl bg-slate-50 border-2 border-slate-100">
                                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground">Order Total</p>
                                <p className="font-black text-primarycolor text-sm md:text-lg mt-0.5">{orderTotal.toLocaleString()} <span className="text-[7px] md:text-[8px]">ETB</span></p>
                            </div>
                            <div className="text-center p-3 md:p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100">
                                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-emerald-700">Paid</p>
                                <p className="font-black text-emerald-800 text-sm md:text-lg mt-0.5">{(orderPaid ?? 0).toLocaleString()} <span className="text-[7px] md:text-[8px]">ETB</span></p>
                            </div>
                            <div className="text-center p-3 md:p-4 rounded-2xl bg-rose-50 border-2 border-rose-100">
                                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-rose-700">Remaining</p>
                                <p className="font-black text-rose-800 text-sm md:text-lg mt-0.5">{(orderTotal - (orderPaid ?? 0)).toLocaleString()} <span className="text-[7px] md:text-[8px]">ETB</span></p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Payment Type
                        </label>
                        <Select value={paymentType} onValueChange={setPaymentType}>
                            <SelectTrigger className="h-14 md:h-16 rounded-2xl border-2 border-slate-200 bg-white font-bold text-sm md:text-base shadow-sm hover:border-slate-300 data-[state=open]:border-primarycolor data-[state=open]:ring-2 data-[state=open]:ring-primarycolor/10 transition-all px-5">
                                <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2 border-slate-200 shadow-2xl bg-white p-1.5">
                                <SelectItem value="DIRECT" className="rounded-xl h-12 font-bold text-sm data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700 data-[highlighted]:bg-slate-50 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <Banknote className="size-3.5" />
                                        </div>
                                        <span>Direct Payment</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="CHECK" className="rounded-xl h-12 font-bold text-sm data-[state=checked]:bg-purple-50 data-[state=checked]:text-purple-700 data-[highlighted]:bg-slate-50 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                            <Landmark className="size-3.5" />
                                        </div>
                                        <span>Check</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {!orderId && (
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200">
                            <div
                                onClick={() => setIsForPreviousDebts(!isForPreviousDebts)}
                                className={cn(
                                    "relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0",
                                    isForPreviousDebts ? "bg-amber-500" : "bg-slate-300"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                                    isForPreviousDebts && "translate-x-5"
                                )} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">For Previous Debt</p>
                                <p className="text-[8px] font-bold text-amber-600/70">Mark this payment as settling previous debt</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Amount (ETB)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-base md:text-lg">ETB</span>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onWheel={(e) => e.currentTarget.blur()}
                                className="h-12 md:h-14 pl-14 md:pl-16 rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-base md:text-lg focus:border-primarycolor"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Memo <span className="text-muted-foreground/40">(optional)</span>
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 md:left-4 top-3 md:top-3.5 size-3.5 md:size-4 text-muted-foreground" />
                            <textarea
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                className="h-16 md:h-20 w-full pl-9 md:pl-10 pt-2.5 rounded-xl border-2 border-slate-100 font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
                                placeholder="Add a note or reference..."
                            />
                        </div>
                    </div>

                    {showPrinterPayment && (
                        <>
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
                                <div
                                    onClick={() => setIsForPrinter(!isForPrinter)}
                                    className={cn(
                                        "relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0",
                                        isForPrinter ? "bg-indigo-500" : "bg-slate-300"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                                        isForPrinter && "translate-x-5"
                                    )} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-800">Payment for Printer</p>
                                    <p className="text-[8px] font-bold text-indigo-600/70">Mark this payment as a payment to a printer</p>
                                </div>
                            </div>

                            {isForPrinter && (
                                <div className="space-y-4 p-4 md:p-5 rounded-2xl bg-indigo-50/50 border-2 border-indigo-100">
                                    <div className="flex items-center gap-2 text-indigo-700">
                                        <Printer className="size-4" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Printer Details</h4>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Printer</label>
                                        <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                                            <SelectTrigger className="h-11 md:h-12 rounded-xl border-2 border-indigo-200 font-bold text-xs">
                                                <SelectValue placeholder="Select a printer..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl p-2 border-2 bg-white max-h-[220px]">
                                                {printers.length === 0 && (
                                                    <div className="p-4 text-center text-xs font-bold text-muted-foreground">
                                                        No printers found
                                                    </div>
                                                )}
                                                {printers.map((p: any) => (
                                                    <SelectItem key={p.id} value={String(p.id)} className="rounded-xl h-10 font-bold text-xs">
                                                        {p.name}{p.location ? ` - ${p.location}` : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">
                                            Printer Memo <span className="text-muted-foreground/40">(optional)</span>
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 md:left-4 top-3 md:top-3.5 size-3.5 md:size-4 text-muted-foreground" />
                                            <textarea
                                                value={printerPaymentMemo}
                                                onChange={(e) => setPrinterPaymentMemo(e.target.value)}
                                                className="h-16 md:h-20 w-full pl-9 md:pl-10 pt-2.5 rounded-xl border-2 border-indigo-200 font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
                                                placeholder="Add a note for the printer payment..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
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
                                <ShieldCheck className="size-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Approve</p>
                                <p className="text-[8px] font-bold text-emerald-600/70">
                                    Record this direct payment as already approved and deducted from debt
                                </p>
                            </div>
                        </button>
                    )}

                    {paymentType === "CHECK" && (
                        <div className="space-y-4 p-4 md:p-5 rounded-2xl bg-purple-50/50 border-2 border-purple-100">
                            <div className="flex items-center gap-2 text-purple-700">
                                <Landmark className="size-4" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Check Details</h4>
                            </div>

                            {!showNewCheck ? (
                                <div className="space-y-3">
                                    <Popover open={openCheckSearch} onOpenChange={setOpenCheckSearch}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full h-11 md:h-12 justify-between rounded-xl border-2 border-purple-200 font-bold text-xs md:text-sm"
                                            >
                                                {selectedCheck
                                                    ? `${selectedCheck.bankname} - ${selectedCheck.username}`
                                                    : "Select existing check..."}
                                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl bg-white">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Search checks..."
                                                    value={checkSearch}
                                                    onValueChange={setCheckSearch}
                                                    className="h-11 md:h-12"
                                                />
                                                <CommandList className="h-[200px]">
                                                    {filteredChecks.length === 0 && (
                                                        <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
                                                            No pending checks found
                                                        </CommandEmpty>
                                                    )}
                                                    <CommandGroup>
                                                        {filteredChecks.map((check: any) => (
                                                            <CommandItem
                                                                key={check.id}
                                                                value={`${check.bankname}-${check.username}`}
                                                                onSelect={() => {
                                                                    setSelectedCheck(check);
                                                                    setOpenCheckSearch(false);
                                                                }}
                                                                className="h-12 px-4 flex items-center justify-between cursor-pointer"
                                                            >
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="font-bold text-sm truncate">{check.bankname}</span>
                                                                    <span className="text-[9px] text-muted-foreground font-semibold truncate">{check.username}</span>
                                                                </div>
                                                                <span className="text-[10px] font-black shrink-0 ml-2">{Number(check.amount || 0).toLocaleString()} ETB</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {selectedCheck && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                                Check selected
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedCheck(null)}
                                                className="h-8 text-rose-500 text-[9px] font-black uppercase tracking-widest"
                                            >
                                                <X className="size-3 mr-1" /> Clear
                                            </Button>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-purple-200" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-purple-50/50 px-3 text-[9px] font-black text-purple-400 uppercase tracking-widest">or</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => setShowNewCheck(true)}
                                        className="w-full h-11 md:h-12 rounded-xl border-2 border-dashed border-purple-300 text-purple-700 hover:bg-purple-100 font-black text-[10px] uppercase tracking-widest gap-2"
                                    >
                                        <Plus className="size-4" /> Create New Check
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">New Check Details</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowNewCheck(false)}
                                            className="h-8 text-purple-500 text-[9px] font-black uppercase tracking-widest"
                                        >
                                            <X className="size-3 mr-1" /> Back
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                            <Input
                                                value={newCheck.username}
                                                onChange={(e) => setNewCheck({ ...newCheck, username: e.target.value })}
                                                className="h-11 md:h-12 pl-9 md:pl-10 rounded-xl border-2 border-purple-200 font-bold text-xs md:text-sm"
                                                placeholder="Enter account username..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Bank Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                            <Input
                                                value={newCheck.bankname}
                                                onChange={(e) => setNewCheck({ ...newCheck, bankname: e.target.value })}
                                                className="h-11 md:h-12 pl-9 md:pl-10 rounded-xl border-2 border-purple-200 font-bold text-xs md:text-sm"
                                                placeholder="Enter bank name..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Type</label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground z-10" />
                                                <Select
                                                    value={newCheck.type}
                                                    onValueChange={(v) => setNewCheck({ ...newCheck, type: v })}
                                                >
                                                    <SelectTrigger className="h-11 md:h-12 pl-9 md:pl-10 rounded-xl border-2 border-purple-200 font-bold text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl p-2 border-2">
                                                        <SelectItem value="PAYMENT" className="rounded-xl h-10 font-bold">Payment</SelectItem>
                                                        <SelectItem value="COLLATERAL" className="rounded-xl h-10 font-bold">Collateral</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Amount</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                                <Input
                                                    value={newCheck.amount}
                                                    onChange={(e) => setNewCheck({ ...newCheck, amount: e.target.value })}
                                                    className="h-11 md:h-12 pl-9 md:pl-10 rounded-xl border-2 border-purple-200 font-bold text-xs"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Expiry Date</label>
                                        <DateInput
                                            value={newCheck.expirydate}
                                            onChange={(e) => setNewCheck({ ...newCheck, expirydate: e.target.value })}
                                            className="h-11 md:h-12 px-4 rounded-xl border-2 border-purple-200 font-bold text-xs"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Check Image</label>
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCheckImageUpload}
                                                disabled={uploading}
                                                className="hidden"
                                                id="check-image-upload-manage"
                                            />
                                            <label
                                                htmlFor="check-image-upload-manage"
                                                className={cn(
                                                    "flex items-center gap-3 h-11 md:h-12 px-4 rounded-xl border-2 border-dashed bg-white font-bold text-xs cursor-pointer transition-all",
                                                    checkImageUrl
                                                        ? "border-emerald-300 bg-emerald-50/50"
                                                        : uploading
                                                            ? "border-purple-300 bg-purple-50/50"
                                                            : "border-purple-200 hover:border-purple-300"
                                                )}
                                            >
                                                {checkImageUrl ? (
                                                    <>
                                                        <div className="size-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                            <CheckCircle2 className="size-4" />
                                                        </div>
                                                        <span className="text-emerald-700 text-[10px] font-bold truncate">Image uploaded</span>
                                                    </>
                                                ) : uploading ? (
                                                    <>
                                                        <div className="size-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                                            <Loader2 className="size-4 animate-spin" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-purple-700 text-[10px] font-bold">Uploading...</span>
                                                                <span className="text-purple-600 text-[9px] font-black">{uploadProgress}%</span>
                                                            </div>
                                                            <div className="h-1.5 rounded-full bg-purple-200 overflow-hidden">
                                                                <div className="h-full rounded-full bg-purple-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="size-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                                            <Upload className="size-4" />
                                                        </div>
                                                        <span className="text-purple-700 text-[10px] font-bold">Upload check image</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        {checkImageUrl && (
                                            <div className="rounded-xl overflow-hidden border-2 border-emerald-200 bg-emerald-50/50 relative">
                                                <img src={checkImageUrl} alt="Check" className="w-full h-28 object-contain bg-white" />
                                                <button
                                                    onClick={() => setCheckImageUrl("")}
                                                    className="absolute top-1.5 right-1.5 size-6 rounded-full bg-white/90 flex items-center justify-center text-rose-500 hover:bg-white shadow-sm"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Memo</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 md:left-4 top-3 md:top-3.5 size-3.5 md:size-4 text-muted-foreground" />
                                            <textarea
                                                value={newCheck.memo}
                                                onChange={(e) => setNewCheck({ ...newCheck, memo: e.target.value })}
                                                className="h-20 md:h-24 w-full pl-9 md:pl-10 pt-2.5 rounded-xl border-2 border-purple-200 font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
                                                placeholder="Additional notes..."
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={handleCreateCheck}
                                        disabled={isCreatingCheck}
                                        className="w-full h-11 md:h-12 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-[10px] uppercase tracking-widest shadow-lg gap-2"
                                    >
                                        {isCreatingCheck ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                                        {isCreatingCheck ? "Creating..." : "Save Check"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="bg-slate-50 p-4 md:p-6 border-t border-slate-100 shrink-0 flex flex-row items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl h-10 md:h-11 px-5 md:px-6 font-black text-[10px] uppercase tracking-widest"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || (paymentType === "CHECK" && !selectedCheck)}
                        className="bg-primarycolor hover:bg-secondarycolor text-white rounded-xl h-10 md:h-11 px-5 md:px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/20 gap-2"
                    >
                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                        {isSubmitting ? "Recording..." : "Submit Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>

            {/* Auto-approve confirmation */}
            <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
                <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                            Approve <span className="text-secondarycolor not-italic">Payment</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
                            This direct payment of {amount ? parseFloat(amount).toLocaleString() : "0"} ETB will be recorded as APPROVED
                            automatically and deducted from the shop&apos;s debt. Do you want to continue?
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
        </Dialog>
    );
}
