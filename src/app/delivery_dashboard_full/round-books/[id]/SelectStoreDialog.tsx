"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Store as StoreIcon,
  BookOpen,
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  ChevronsUpDown,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAvailableShops, getEditionPrice, createRoundRecord, createRoundCheck } from "../actions";

type ShopOption = { id: number; name: string; location: string; branch: string | null };

type Props = {
  open: boolean;
  onClose: () => void;
  roundBookId: number;
  bookId: number;
  startingAmount: number;
  existingShopIds: (number | null)[];
};

const steps = ["Select Store", "Set Amount", "Payment"];

export default function SelectStoreDialog({
  open, onClose, roundBookId, bookId, startingAmount, existingShopIds,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [shops, setShops] = useState<ShopOption[]>([]);
  const [unitPrice, setUnitPrice] = useState(0);
  const [editionName, setEditionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedShop, setSelectedShop] = useState<ShopOption | null>(null);
  const [shopSearchOpen, setShopSearchOpen] = useState(false);
  const [shopSearch, setShopSearch] = useState("");

  const [quantity, setQuantity] = useState("1");
  const [paymentType, setPaymentType] = useState("none");
  const [payAmount, setPayAmount] = useState("");

  const [unitPriceEditing, setUnitPriceEditing] = useState(false);
  const [draftUnitPrice, setDraftUnitPrice] = useState(unitPrice);

  const [checkBankName, setCheckBankName] = useState("");
  const [checkHolder, setCheckHolder] = useState("");
  const [checkAmount, setCheckAmount] = useState("");
  const [checkMemo, setCheckMemo] = useState("");
  const [checkRecordedDate, setCheckRecordedDate] = useState("");

  const filteredShops = useMemo(() => {
    if (!shopSearch) return shops;
    const q = shopSearch.toLowerCase();
    return shops.filter((s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q));
  }, [shops, shopSearch]);

  const totalPrice = unitPrice * (parseInt(quantity, 10) || 0);

  const maxQuantity = useMemo(() => {
    if (!startingAmount) return 0;
    return Math.max(0, startingAmount);
  }, [startingAmount]);

  const quantityNum = parseInt(quantity, 10) || 0;

  useEffect(() => {
    if (paymentType === "CHECK" && payAmount) {
      setCheckAmount(payAmount);
    }
  }, [paymentType, payAmount]);

  useEffect(() => {
    setDraftUnitPrice(unitPrice);
  }, [unitPrice]);

  useEffect(() => {
    if (open) {
      setStep(0);
      setSelectedShop(null);
      setQuantity("1");
      setPaymentType("none");
      setPayAmount("");
      setUnitPriceEditing(false);
      setCheckBankName("");
      setCheckHolder("");
      setCheckAmount("");
      setCheckMemo("");
      setCheckRecordedDate("");
      setLoading(true);
      Promise.all([
        getAvailableShops(roundBookId),
        getEditionPrice(bookId),
      ]).then(([shopsRes, priceRes]) => {
        if (shopsRes.success) setShops(shopsRes.data || []);
        if (priceRes.success && priceRes.data) {
          setUnitPrice(priceRes.data.selling_price || 0);
          setEditionName(priceRes.data.edition_name || "");
        }
      }).finally(() => setLoading(false));
    }
  }, [open, roundBookId, bookId]);

  const handleRecord = async () => {
    if (!selectedShop) { toast.error("Select a shop"); return; }
    if (quantityNum < 1) { toast.error("Enter a valid quantity"); return; }
    if (quantityNum > maxQuantity) { toast.error(`Maximum available is ${maxQuantity}`); return; }

    setSubmitting(true);
    try {
      let checkId: number | null = null;

      if (paymentType === "CHECK") {
        if (!checkBankName.trim() || !checkHolder.trim()) {
          toast.error("Bank name and holder name are required for checks");
          setSubmitting(false);
          return;
        }
        const checkRes = await createRoundCheck({
          username: checkHolder.trim(),
          bankname: checkBankName.trim(),
          amount: checkAmount || payAmount || "0",
          recordeddate: checkRecordedDate || new Date().toISOString().split("T")[0],
          memo: checkMemo.trim(),
        });
        if (!checkRes.success) {
          toast.error(checkRes.error || "Failed to create check");
          setSubmitting(false);
          return;
        }
        checkId = checkRes.data.id;
      }

      const res = await createRoundRecord({
        roundbookId: roundBookId,
        bookshopId: selectedShop.id,
        totalprice: totalPrice,
        payment: paymentType !== "none" ? {
          type: paymentType as "DIRECT" | "CHECK",
          amount: parseFloat(payAmount) || 0,
          checkId,
        } : undefined,
      });
      if (res.success) {
        toast.success("Record saved");
        onClose();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
              <StoreIcon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                Record Sold
              </DialogTitle>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                {editionName ? `${editionName} · ` : ""}{unitPrice} ETB / book
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Steps */}
        <div className="flex items-center gap-1 px-5 pt-4 pb-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-1 flex-1">
              <div className={cn(
                "flex items-center justify-center size-7 rounded-lg font-black text-[9px] transition-all shrink-0",
                i === step ? "bg-primarycolor text-white" : i < step ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400",
              )}>
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span className={cn(
                "text-[7px] font-black uppercase tracking-widest truncate hidden sm:block",
                i === step ? "text-primarycolor" : "text-muted-foreground/50",
              )}>
                {label}
              </span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-primarycolor" />
            </div>
          ) : (
            <>
              {/* Step 0: Select Shop */}
              {step === 0 && (
                <div className="space-y-3">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Select Shop
                  </p>
                  <Popover open={shopSearchOpen} onOpenChange={setShopSearchOpen}>
                    <PopoverTrigger asChild>
                      <button className={cn(
                        "w-full h-12 px-4 rounded-2xl border-2 bg-white font-bold text-sm flex items-center justify-between transition-all text-left",
                        selectedShop ? "border-primarycolor/30 text-slate-800" : "border-primarycolor/5 text-muted-foreground",
                      )}>
                        {selectedShop ? (
                          <span>{selectedShop.name}{selectedShop.location ? ` (${selectedShop.location})` : ""}</span>
                        ) : (
                          <span>Search shops...</span>
                        )}
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/5">
                      <Command>
                        <CommandInput
                          placeholder="Search shops..."
                          value={shopSearch}
                          onValueChange={setShopSearch}
                          className="h-12"
                        />
                        <CommandList className="max-h-52">
                          {filteredShops.length === 0 && (
                            <CommandEmpty className="py-6 text-center text-[10px] font-bold text-muted-foreground">
                              No shops found
                            </CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredShops.map((shop) => (
                              <CommandItem
                                key={shop.id}
                                value={shop.name}
                                onSelect={() => {
                                  setSelectedShop(shop);
                                  setShopSearchOpen(false);
                                }}
                                className="h-12 px-4 flex items-center gap-3 cursor-pointer rounded-xl"
                              >
                                <div className="size-8 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                                  <StoreIcon className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-sm truncate">{shop.name}</p>
                                  {shop.location && (
                                    <p className="text-[9px] font-bold text-muted-foreground truncate">{shop.location}</p>
                                  )}
                                </div>
                                {selectedShop?.id === shop.id && (
                                  <Check className="size-4 text-primarycolor shrink-0" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedShop && (
                    <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <Check className="size-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-emerald-800">{selectedShop.name}</p>
                          <p className="text-[9px] font-bold text-emerald-600">{selectedShop.location}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Set Amount */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                      Quantity
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground">
                      Available: {maxQuantity}
                    </p>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || parseInt(v, 10) >= 0) setQuantity(v);
                      }}
                      min={1}
                      max={maxQuantity}
                      className="h-12 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-base focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Unit Price</p>
                      {!unitPriceEditing ? (
                        <button
                          onClick={() => { setDraftUnitPrice(unitPrice); setUnitPriceEditing(true); }}
                          className="size-7 rounded-lg bg-primarycolor/5 hover:bg-primarycolor/10 flex items-center justify-center text-primarycolor transition-all"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setUnitPrice(draftUnitPrice); setUnitPriceEditing(false); }}
                            className="size-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-all"
                          >
                            <Check className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setUnitPriceEditing(false)}
                            className="size-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      {unitPriceEditing ? (
                        <Input
                          type="number"
                          value={draftUnitPrice}
                          onChange={(e) => setDraftUnitPrice(parseFloat(e.target.value) || 0)}
                          min={0}
                          className="h-11 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      ) : (
                        <p className="font-bold text-lg text-slate-800">{unitPrice} ETB</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-primarycolor/5">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                      <p className="font-black text-xl text-primarycolor">{totalPrice.toLocaleString()} ETB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Payment (optional)
                  </p>

                  <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger className="h-12 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2 border-primarycolor/10">
                      <SelectItem value="none" className="font-bold">None</SelectItem>
                      <SelectItem value="DIRECT" className="font-bold">Direct Payment</SelectItem>
                      <SelectItem value="CHECK" className="font-bold">Check</SelectItem>
                    </SelectContent>
                  </Select>

                  {paymentType !== "none" && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                          Amount Paid
                        </p>
                        <Input
                          type="number"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          placeholder="0"
                          min={0}
                          className="h-12 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-base focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {paymentType === "CHECK" && (
                        <div className="space-y-3">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                            Check Details
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                              <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">
                                Bank Name
                              </p>
                              <Input
                                value={checkBankName}
                                onChange={(e) => setCheckBankName(e.target.value)}
                                placeholder="e.g. Dashen Bank"
                                className="h-11 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
                              />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                              <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">
                                Holder Name
                              </p>
                              <Input
                                value={checkHolder}
                                onChange={(e) => setCheckHolder(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="h-11 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
                              />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                              <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">
                                Amount
                              </p>
                              <Input
                                type="number"
                                value={checkAmount}
                                onChange={(e) => setCheckAmount(e.target.value)}
                                placeholder="0"
                                min={0}
                                className="h-11 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                              <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">
                                Date
                              </p>
                              <div className="relative">
                                <Input
                                  type="date"
                                  value={checkRecordedDate}
                                  onChange={(e) => setCheckRecordedDate(e.target.value)}
                                  className="h-11 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">
                              Memo (optional)
                            </p>
                            <Input
                              value={checkMemo}
                              onChange={(e) => setCheckMemo(e.target.value)}
                              placeholder="Check memo / notes"
                              className="h-11 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Sale</span>
                      <span className="font-black text-lg text-primarycolor">{totalPrice.toLocaleString()} ETB</span>
                    </div>
                    {paymentType !== "none" && parseFloat(payAmount) > 0 && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-primarycolor/5">
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Paid</span>
                        <span className="font-bold text-sm text-emerald-600">{parseFloat(payAmount).toLocaleString()} ETB</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with navigation */}
        <div className="shrink-0 border-t-2 border-slate-100 p-4 flex items-center gap-3">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="h-12 px-5 rounded-2xl border-2 border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="h-12 px-5 rounded-2xl border-2 border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}

          <div className="flex-1" />

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !selectedShop}
              className="h-12 px-6 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primarycolor/20"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={handleRecord}
              disabled={submitting || quantityNum < 1 || quantityNum > maxQuantity}
              className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <BookOpen className="size-4" />
              )}
              {submitting ? "Saving..." : "Record Sold"}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
