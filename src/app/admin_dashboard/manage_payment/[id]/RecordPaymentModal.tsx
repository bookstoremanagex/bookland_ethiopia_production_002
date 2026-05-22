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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getChecks, createCheck } from "@/app/actions/check-actions";
import { createPayment } from "@/app/actions/payment-actions";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    shopId: number;
    shopName: string;
}

export default function RecordPaymentModal({ isOpen, onClose, shopId, shopName }: Props) {
    const router = useRouter();
    const [paymentType, setPaymentType] = useState<string>("DIRECT");
    const [amount, setAmount] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        recordeddate: "",
        memo: "",
    });
    const [isCreatingCheck, setIsCreatingCheck] = useState(false);

    useEffect(() => {
        if (isOpen && paymentType === "CHECK") {
            loadChecks();
        }
    }, [isOpen, paymentType]);

    const loadChecks = async () => {
        const res = await getChecks();
        if (res.success) {
            setChecks(res.data || []);
        }
    };

    const handleCreateCheck = async () => {
        if (!newCheck.username || !newCheck.bankname || !newCheck.amount) {
            toast.error("Username and Bank Name are required");
            return;
        }
        setIsCreatingCheck(true);
        try {
            const res = await createCheck({
                username: newCheck.username,
                bankname: newCheck.bankname,
                type: "PAYMENT",
                amount: newCheck.amount,
                recordeddate: newCheck.recordeddate || new Date().toISOString().split("T")[0],
                memo: newCheck.memo || "",
            });
            if (res.success) {
                toast.success("Check created successfully");
                setShowNewCheck(false);
                setNewCheck({ username: "", bankname: "", type: "PAYMENT", amount: "", recordeddate: "", memo: "" });
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

        setIsSubmitting(true);
        try {
            const res = await createPayment({
                shopId,
                amount: parsedAmount,
                payment_type: paymentType as "DIRECT" | "CHECK",
                checkId: paymentType === "CHECK" ? selectedCheck?.id || null : null,
            });

            if (res.success) {
                toast.success("Payment recorded successfully");
                onClose();
                setAmount("");
                setSelectedCheck(null);
                setPaymentType("DIRECT");
                setShowNewCheck(false);
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
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 md:space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Payment Type
                        </label>
                        <Select value={paymentType} onValueChange={setPaymentType}>
                            <SelectTrigger className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-sm md:text-base">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2 border-primarycolor/10">
                                <SelectItem value="DIRECT" className="font-bold">Direct Payment</SelectItem>
                                <SelectItem value="CHECK" className="font-bold">Check</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
                                className="h-12 md:h-14 pl-14 md:pl-16 rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-base md:text-lg focus:border-primarycolor"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

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
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Recorded Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                value={newCheck.recordeddate}
                                                onChange={(e) => setNewCheck({ ...newCheck, recordeddate: e.target.value })}
                                                className="h-11 md:h-12 pl-9 md:pl-10 rounded-xl border-2 border-purple-200 font-bold text-xs"
                                            />
                                        </div>
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
        </Dialog>
    );
}
