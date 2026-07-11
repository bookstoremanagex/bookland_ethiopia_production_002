"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  FileText,
  X,
  Wallet,
  ScrollText,
  ShoppingBag,
  Upload,
  ImageIcon,
  Link,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getChecks, createCheck } from "@/app/actions/check-actions";
import { createPayment } from "@/app/actions/payment-actions";
import { DateInput } from "@/components/ui/date-input";

interface Props {
  shopId: number;
  shopName: string;
  trigger: React.ReactNode;
  orderId?: number | null;
}

const paymentOptions = [
  { value: "DIRECT", label: "Direct Payment", icon: Wallet, desc: "Pay immediately in cash or transfer" },
  { value: "CHECK", label: "Check", icon: ScrollText, desc: "Pay using a bank check" },
];

export default function RecordPaymentModal({ shopId, shopName, trigger, orderId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<string>("DIRECT");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
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
    expirydate: "",
    memo: "",
  });
  const [isCreatingCheck, setIsCreatingCheck] = useState(false);
  const [checkImageUrl, setCheckImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [receiptImageUrl, setReceiptImageUrl] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptUploadProgress, setReceiptUploadProgress] = useState(0);

  const syncAmount = useCallback((val: string) => {
    setAmount(val);
    setNewCheck((prev) => ({ ...prev, amount: val }));
  }, []);

  useEffect(() => {
    if (open && paymentType === "CHECK") {
      loadChecks();
    }
  }, [open, paymentType]);

  const loadChecks = async () => {
    const res = await getChecks();
    if (res.success) {
      setChecks(res.data || []);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingReceipt(true);
    setReceiptUploadProgress(0);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setReceiptUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          setReceiptImageUrl(res.url);
          setReceiptUploadProgress(100);
        }
      }
      setUploadingReceipt(false);
    };

    xhr.onerror = () => {
      setUploadingReceipt(false);
      toast.error("Failed to upload receipt image");
    };

    xhr.open("POST", "/api/upload-payment-image");
    xhr.send(formData);
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

    setIsSubmitting(true);
    try {
      const res = await createPayment({
        shopId,
        amount: parsedAmount,
        payment_type: paymentType as "DIRECT" | "CHECK",
        checkId: paymentType === "CHECK" ? selectedCheck?.id || null : null,
        orderid: orderId ? String(orderId) : null,
        memo: memo || null,
        image: receiptImageUrl || null,
      });

      if (res.success) {
        toast.success("Payment recorded successfully");
        setOpen(false);
        setAmount("");
        setMemo("");
        setSelectedCheck(null);
        setPaymentType("DIRECT");
        setShowNewCheck(false);
        setCheckImageUrl("");
        setUploadProgress(0);
        setReceiptImageUrl("");
        setReceiptUploadProgress(0);
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

  const selectedType = paymentOptions.find((o) => o.value === paymentType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-full w-full h-[100dvh] max-h-[100dvh] rounded-none border-0 bg-white p-0 flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0 px-4 pt-4 pb-0 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <Banknote className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black text-primarycolor uppercase italic text-left leading-tight">
                  Record Payment
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{shopName}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="size-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center text-muted-foreground hover:text-primarycolor transition-all"
            >
              <X className="size-6" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Type</p>
            <div className="grid grid-cols-2 gap-3">
              {paymentOptions.map((opt) => {
                const active = paymentType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentType(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-[0.97]",
                      active
                        ? "bg-primarycolor border-primarycolor text-white shadow-lg shadow-primarycolor/20"
                        : "bg-white border-slate-100 text-slate-600 hover:border-primarycolor/30"
                    )}
                  >
                    <div className={cn(
                      "size-10 rounded-xl flex items-center justify-center",
                      active ? "bg-white/15" : "bg-primarycolor/5"
                    )}>
                      <opt.icon className={cn("size-5", active ? "text-white" : "text-primarycolor")} />
                    </div>
                    <div className="text-center">
                      <p className={cn("font-black text-xs", active ? "text-white" : "text-slate-800")}>{opt.label}</p>
                      <p className={cn("text-[8px] font-bold mt-0.5", active ? "text-white/70" : "text-muted-foreground")}>{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {orderId ? (
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Order</p>
              <div className="flex items-center gap-3 h-16 px-4 rounded-2xl border-2 border-primarycolor/10 bg-primarycolor/5">
                <ShoppingBag className="size-5 text-primarycolor/40" />
                <span className="font-black text-primarycolor text-lg">#ORD-{orderId}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest text-center">
                ⚠ You are recording a payment out of orders
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount (ETB)</p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor">
                <DollarSign className="size-5" />
              </div>
              <Input
                type="number"
                value={amount}
                onChange={(e) => syncAmount(e.target.value)}
                className="h-16 pl-16 pr-4 rounded-2xl border-2 border-slate-100 bg-white font-black text-xl focus:border-primarycolor transition-all [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Memo (optional)</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full h-24 px-4 py-3 rounded-2xl border-2 border-slate-100 bg-white font-bold text-sm resize-none focus:border-primarycolor outline-none transition-all"
              placeholder="Add a note about this payment..."
            />
          </div>

          {/* Receipt Image Upload */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Receipt Image (optional)</p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                disabled={uploadingReceipt}
                className="hidden"
                id="receipt-image-upload"
              />
              <label
                htmlFor="receipt-image-upload"
                className={cn(
                  "flex items-center gap-3 h-14 px-4 rounded-2xl border-2 border-dashed bg-white font-bold text-sm cursor-pointer transition-all",
                  receiptImageUrl
                    ? "border-emerald-300 bg-emerald-50/50"
                    : uploadingReceipt
                      ? "border-primarycolor/30 bg-primarycolor/5"
                      : "border-slate-200 hover:border-primarycolor/30"
                )}
              >
                {receiptImageUrl ? (
                  <>
                    <div className="size-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <span className="text-emerald-700 text-xs font-bold truncate">Receipt uploaded</span>
                  </>
                ) : uploadingReceipt ? (
                  <>
                    <div className="size-9 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                      <Loader2 className="size-5 animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-primarycolor text-xs font-bold">Uploading receipt...</span>
                        <span className="text-primarycolor text-[10px] font-black">{receiptUploadProgress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-primarycolor/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primarycolor transition-all duration-300"
                          style={{ width: `${receiptUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="size-9 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                      <Upload className="size-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-slate-700 text-xs font-bold">Upload receipt image</span>
                      <p className="text-[8px] text-muted-foreground font-semibold">PNG, JPG up to 4MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
            {receiptImageUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-emerald-200 bg-emerald-50/50">
                <img
                  src={receiptImageUrl}
                  alt="Receipt"
                  className="w-full h-40 object-contain bg-white"
                />
              </div>
            )}
          </div>

          {paymentType === "CHECK" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-purple-100" />
                <div className="flex items-center gap-2 text-purple-700">
                  <Landmark className="size-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Check Details</span>
                </div>
                <div className="h-px flex-1 bg-purple-100" />
              </div>

              {!showNewCheck ? (
                <div className="space-y-3">
                  <Popover open={openCheckSearch} onOpenChange={setOpenCheckSearch}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full h-14 justify-between rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                            <Landmark className="size-4" />
                          </div>
                          <span className="truncate">
                            {selectedCheck
                              ? `${selectedCheck.bankname} - ${selectedCheck.username}`
                              : "Select existing check..."}
                          </span>
                        </div>
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl bg-white">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search checks..."
                          value={checkSearch}
                          onValueChange={setCheckSearch}
                          className="h-12"
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
                                className="h-14 px-4 flex items-center justify-between cursor-pointer rounded-xl"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="size-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                    <Landmark className="size-4" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm truncate">{check.bankname}</span>
                                    <span className="text-[9px] text-muted-foreground font-semibold truncate">{check.username}</span>
                                  </div>
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
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Check selected</span>
                      </div>
                      <button
                        onClick={() => setSelectedCheck(null)}
                        className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-purple-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-[9px] font-black text-purple-400 uppercase tracking-widest">or</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowNewCheck(true)}
                    className="w-full h-14 rounded-2xl border-2 border-dashed border-purple-300 bg-white text-purple-700 hover:bg-purple-50 font-black text-[10px] uppercase tracking-widest gap-2"
                  >
                    <Plus className="size-4" /> Create New Check
                  </Button>
                </div>
              ) : (
                <div className="bg-purple-50/30 rounded-3xl border-2 border-purple-100 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-purple-700 uppercase tracking-widest">New Check Details</span>
                    <button
                      onClick={() => { setShowNewCheck(false); setCheckImageUrl(""); setUploadProgress(0); }}
                      className="text-[9px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-600 transition-colors"
                    >
                      Back
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-purple-700 ml-1">Username</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-purple-400" />
                        <Input
                          value={newCheck.username}
                          onChange={(e) => setNewCheck({ ...newCheck, username: e.target.value })}
                          className="h-12 pl-11 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                          placeholder="Enter account username..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-purple-700 ml-1">Bank Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-purple-400" />
                        <Input
                          value={newCheck.bankname}
                          onChange={(e) => setNewCheck({ ...newCheck, bankname: e.target.value })}
                          className="h-12 pl-11 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                          placeholder="Enter bank name..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-purple-700 ml-1">Type</label>
                        <div className="relative">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-purple-400 z-10" />
                          <Select
                            value={newCheck.type}
                            onValueChange={(v) => setNewCheck({ ...newCheck, type: v })}
                          >
                            <SelectTrigger className="h-12 pl-11 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl p-2 border-2">
                              <SelectItem value="PAYMENT" className="rounded-xl h-10 font-bold">Payment</SelectItem>
                              <SelectItem value="COLLATERAL" className="rounded-xl h-10 font-bold">Collateral</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-purple-700 ml-1">Amount</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-purple-400" />
                          <Input
                            value={newCheck.amount}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewCheck((prev) => ({ ...prev, amount: val }));
                              setAmount(val);
                            }}
                            className="h-12 pl-11 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-purple-700 ml-1">Expiry Date <span className="text-purple-400 font-normal normal-case">(optional)</span></label>
                      <DateInput
                        value={newCheck.expirydate}
                        onChange={(e) => setNewCheck({ ...newCheck, expirydate: e.target.value })}
                        className="h-12 px-4 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-purple-700 ml-1">Memo</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-3 size-4 text-purple-400" />
                        <textarea
                          value={newCheck.memo}
                          onChange={(e) => setNewCheck({ ...newCheck, memo: e.target.value })}
                          className="h-20 w-full pl-11 pt-3 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
                          placeholder="Additional notes..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-purple-700 ml-1">Check Image</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                          id="check-image-upload"
                        />
                        <label
                          htmlFor="check-image-upload"
                          className={cn(
                            "flex items-center gap-3 h-12 px-4 rounded-2xl border-2 border-dashed bg-white font-bold text-sm cursor-pointer transition-all",
                            checkImageUrl
                              ? "border-emerald-300 bg-emerald-50/50"
                              : uploading
                                ? "border-purple-300 bg-purple-50/50"
                                : "border-purple-200 hover:border-purple-300"
                          )}
                        >
                          {checkImageUrl ? (
                            <>
                              <div className="size-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <CheckCircle2 className="size-4" />
                              </div>
                              <span className="text-emerald-700 text-xs font-bold truncate">Image uploaded</span>
                            </>
                          ) : uploading ? (
                            <>
                              <div className="size-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                <Loader2 className="size-4 animate-spin" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-purple-700 text-xs font-bold">Uploading...</span>
                                  <span className="text-purple-600 text-[10px] font-black">{uploadProgress}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-purple-200 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-purple-600 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="size-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                <ImageIcon className="size-4" />
                              </div>
                              <span className="text-purple-700 text-xs font-bold">Upload check image</span>
                            </>
                          )}
                        </label>

                        <div className="relative">
                          <Link className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-purple-400" />
                          <Input
                            value={checkImageUrl}
                            onChange={(e) => setCheckImageUrl(e.target.value)}
                            className="h-12 pl-11 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                            placeholder="Or paste image URL..."
                          />
                        </div>
                      </div>
                      {checkImageUrl && (
                        <div className="mt-2 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-emerald-50/50">
                          <img
                            src={checkImageUrl}
                            alt="Check"
                            className="w-full h-36 object-contain bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateCheck}
                    disabled={isCreatingCheck}
                    className="w-full h-12 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-[10px] uppercase tracking-widest shadow-lg gap-2"
                  >
                    {isCreatingCheck ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    {isCreatingCheck ? "Creating..." : "Save Check"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t-2 border-slate-100 p-3 pb-6 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || (paymentType === "CHECK" && !selectedCheck)}
              className="flex-1 h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-sm shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-5" />
              )}
              {isSubmitting ? "Recording..." : "Submit Payment"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
