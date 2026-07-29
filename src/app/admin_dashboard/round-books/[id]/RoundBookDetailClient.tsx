"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Store,
  Banknote,
  Landmark,
  Calendar,
  Package,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Loader2,
  Printer,
  Building2,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { allocateRoundBook, payAndApproveAllShops, payFullShop } from "../actions";

type Payment = {
  id: number;
  amount: number;
  type: string;
  status: string;
  check: {
    bankname: string | null;
    username: string | null;
    amount: string | null;
    status: string;
  } | null;
};

type StoreRecord = {
  id: number;
  shopName: string;
  location: string;
  branch: string;
  totalprice: number;
  payments: Payment[];
};

type RoundData = {
  id: number;
  status: boolean;
  bookTitle: string;
  bookAuthor: string;
  bookSku: string;
  bookImage: string;
  bookId: number;
  editionId: number | null;
  editionName: string | null;
  startingAmount: number;
  returnedAmount: number;
  totalSold: number;
  storeCount: number;
  allocated: boolean;
  createdAt: string;
  stores: StoreRecord[];
};

export default function RoundBookDetailClient({ data }: { data: RoundData }) {
  const router = useRouter();
  const [showAllocateDialog, setShowAllocateDialog] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [selectedStoreType, setSelectedStoreType] = useState<"store" | "printer" | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);
  const [showPayAllDialog, setShowPayAllDialog] = useState(false);
  const [isPayingAll, setIsPayingAll] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<number>>(new Set());
  const [payFullShopId, setPayFullShopId] = useState<number | null>(null);
  const [isPayingFull, setIsPayingFull] = useState(false);

  const quantityToAllocate = data.startingAmount - data.returnedAmount;

  const createdDate = new Date(data.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const booksSold = data.startingAmount - data.returnedAmount;

  const allPaymentsCleared = data.stores.length > 0 && data.stores.every((s) => {
    const approved = s.payments.filter(p => p.status === "APPROVED").reduce((a, p) => a + (p.amount || 0), 0);
    return approved >= s.totalprice;
  });

  const handlePayFullShop = async () => {
    if (!payFullShopId) return;
    setIsPayingFull(true);
    try {
      const res = await payFullShop(payFullShopId);
      if (res.success) {
        toast.success(`Paid ${res.amount?.toLocaleString()} ETB successfully`);
        setPayFullShopId(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to process payment");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPayingFull(false);
    }
  };

  const handlePayAllShops = async () => {
    setIsPayingAll(true);
    try {
      const res = await payAndApproveAllShops(data.id, Array.from(selectedRecordIds));
      if (res.success) {
        toast.success("All shops paid and approved successfully");
        setShowPayAllDialog(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to process payments");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPayingAll(false);
    }
  };

  const handleOpenAllocate = () => {
    setSelectedStoreId(null);
    setSelectedStoreType(null);
    setSelectedStockId(null);
    setShowAllocateDialog(true);
  };

  const handleAllocate = async () => {
    if (!selectedStoreId || !selectedStoreType || !selectedStockId) {
      toast.error("Please select a store");
      return;
    }
    setIsAllocating(true);
    try {
      const res = await allocateRoundBook(data.id, [{
        editionId: data.editionId!,
        storeId: selectedStoreId,
        storeStockId: selectedStockId,
        quantity: quantityToAllocate,
        type: selectedStoreType,
      }]);
      if (res.success) {
        toast.success("Books allocated successfully");
        setShowAllocateDialog(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to allocate");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => router.push("/admin_dashboard/round-books")}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl hover:bg-primarycolor/5 text-primarycolor font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="size-4" />
          Back to Round Books
        </button>
        <button
          onClick={() => {
            const unpaidIds = new Set(data.stores.filter((s) => {
              const approved = s.payments.filter(p => p.status === "APPROVED").reduce((a, p) => a + (p.amount || 0), 0);
              return approved < s.totalprice;
            }).map(s => s.id));
            setSelectedRecordIds(unpaidIds);
            setShowPayAllDialog(true);
          }}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-[9px] uppercase tracking-widest border-2 border-emerald-200/50 transition-all active:scale-[0.97]"
        >
          <Banknote className="size-4" />
          Record Full Payment for All Shops
        </button>
      </div>

      {/* Payment cleared status */}
      {data.stores.length > 0 && (
        <div className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-black text-[9px] uppercase tracking-widest",
          allPaymentsCleared
            ? "bg-emerald-50 border-emerald-200/50 text-emerald-700"
            : "bg-amber-50 border-amber-200/50 text-amber-700"
        )}>
          {allPaymentsCleared ? (
            <><CheckCircle2 className="size-5 shrink-0" /> All Payments Cleared</>
          ) : (
            <><Clock className="size-5 shrink-0" /> Payments Pending — Some shops have outstanding balances</>
          )}
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
            <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0 overflow-hidden">
              {data.bookImage ? (
                <img src={data.bookImage} alt="" className="size-full object-cover" />
              ) : (
                <BookOpen className="size-7" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-800">
                {data.bookTitle}
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                {data.bookAuthor || "—"}
                {data.bookSku && ` · ${data.bookSku}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider",
              data.status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
            )}>
              <span className={cn("size-1.5 rounded-full", data.status ? "bg-emerald-500" : "bg-slate-400")} />
              {data.status ? "Active" : "Ended"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 font-black text-[10px] text-muted-foreground">
              <Calendar className="size-3" />
              {createdDate}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border-2 border-primarycolor/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Package className="size-3.5 text-primarycolor" />
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Starting</p>
          </div>
          <p className="font-black text-2xl text-slate-800">{data.startingAmount}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-primarycolor/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight className="size-3.5 text-amber-600" />
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Returned</p>
          </div>
          <p className="font-black text-2xl text-slate-800">{data.returnedAmount}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-primarycolor/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Sold</p>
          </div>
          <p className="font-black text-2xl text-primarycolor">{booksSold}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-primarycolor/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Store className="size-3.5 text-secondarycolor" />
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Shops</p>
          </div>
          <p className="font-black text-2xl text-secondarycolor">{data.storeCount}</p>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-gradient-to-br from-primarycolor/5 to-transparent rounded-2xl border-2 border-primarycolor/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Revenue</p>
            <p className="font-black text-3xl mt-1 text-primarycolor">
              {data.totalSold.toLocaleString()} <span className="text-base font-bold text-muted-foreground">ETB</span>
            </p>
          </div>
          <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center">
            <Banknote className="size-7 text-primarycolor" />
          </div>
        </div>
      </div>

      {/* Shops / Records */}
      <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl overflow-hidden">
        <div className="p-5 sm:p-7 border-b border-primarycolor/5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Shops in Round
            </p>
            <span className="text-[9px] font-bold text-muted-foreground">
              {data.storeCount} shop{data.storeCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {data.stores.length > 0 ? (
          <div className="divide-y divide-primarycolor/5">
            {data.stores.map((store) => {
              const totalPaid = store.payments
                .filter((p) => p.status === "APPROVED")
                .reduce((sum, p) => sum + (p.amount || 0), 0);
              const remaining = store.totalprice - totalPaid;
              const estQty = data.totalSold > 0 ? Math.round((store.totalprice / data.totalSold) * booksSold) : 0;

              return (
                <div key={store.id} className="p-5 sm:p-7 space-y-4">
                  {/* Shop header */}
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                      <Store className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-700 truncate">{store.shopName}</p>
                      {store.location && (
                        <p className="text-[8px] font-bold text-muted-foreground truncate">{store.location}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-4">
                      <div>
                        <p className="font-black text-base text-slate-800">{estQty}</p>
                        <p className="text-[8px] font-bold text-muted-foreground">Books</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div>
                        <p className="font-black text-base text-primarycolor">{store.totalprice.toLocaleString()} ETB</p>
                        <p className="text-[8px] font-bold text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment summary */}
                  <div className="flex items-center gap-4 text-[9px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-600">Paid: {totalPaid.toLocaleString()} ETB</span>
                    </div>
                    {remaining > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-500">Remaining: {remaining.toLocaleString()} ETB</span>
                        <button
                          onClick={() => setPayFullShopId(store.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[8px] uppercase tracking-widest transition-all active:scale-[0.97]"
                        >
                          Fully Paid
                        </button>
                      </div>
                    )}
                    {remaining <= 0 && totalPaid > 0 && (
                      <span className="font-bold text-emerald-500">Fully Paid</span>
                    )}
                  </div>

                  {/* Payments list */}
                  {store.payments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                        Payments ({store.payments.length})
                      </p>
                      <div className="space-y-1.5">
                        {store.payments.map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-primarycolor/[0.02] border border-primarycolor/5">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "size-7 rounded-lg flex items-center justify-center",
                                p.type === "CHECK" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600",
                              )}>
                                {p.type === "CHECK" ? <Landmark className="size-3" /> : <Banknote className="size-3" />}
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-600">
                                  {p.type === "CHECK" ? "Check" : "Direct"}
                                </span>
                                {p.check && (
                                  <span className="text-[8px] text-muted-foreground font-medium ml-2">
                                    {p.check.bankname} · {p.check.username}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-slate-700">{p.amount.toLocaleString()} ETB</span>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                                p.status === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-amber-100 text-amber-600",
                              )}>
                                {p.status === "APPROVED" ? (
                                  <span className="flex items-center gap-1"><CheckCircle2 className="size-2.5" /> Approved</span>
                                ) : (
                                  <span className="flex items-center gap-1"><Clock className="size-2.5" /> Pending</span>
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 sm:px-7 py-12 text-center">
            <Store className="size-8 mx-auto text-muted-foreground/20 mb-2" />
            <p className="text-[10px] font-bold text-muted-foreground">No shops in this round yet</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {!data.status && !data.allocated && data.editionId && (
          <button
            onClick={handleOpenAllocate}
            className="h-12 px-6 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-primarycolor/20"
          >
            <Package className="size-4" />
            Allocate {quantityToAllocate} Books
          </button>
        )}
        {!data.status && data.allocated && (
          <span className="h-12 px-6 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-[9px] uppercase tracking-widest border-2 border-emerald-200/50 flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Allocated
          </span>
        )}
        {data.status && (
          <span className="h-12 px-6 rounded-2xl bg-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest border-2 border-slate-200/50 flex items-center gap-2">
            <Clock className="size-4" />
            Cannot allocate while active
          </span>
        )}
        {!data.status && !data.allocated && (
          <Link
            href={`/admin_dashboard/round-books/deduct/${data.id}`}
            className="h-12 px-6 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-[9px] uppercase tracking-widest border-2 border-amber-200/50 flex items-center gap-2 transition-all active:scale-[0.97]"
          >
            <Package className="size-4" />
            Deduct {quantityToAllocate} Books
          </Link>
        )}
      </div>

      {/* Pay All Confirmation Dialog */}
      <Dialog open={showPayAllDialog} onOpenChange={(o) => !o && setShowPayAllDialog(false)}>
        <DialogContent className="sm:max-w-2xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Banknote className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                  Record Full Payment
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  {data.bookTitle} — {selectedRecordIds.size} of {data.stores.filter((s) => {
                    const approved = s.payments.filter(p => p.status === "APPROVED").reduce((a, p) => a + (p.amount || 0), 0);
                    return approved < s.totalprice;
                  }).length} shop(s) selected
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-5 max-h-[340px]">
            <div className="space-y-2">
              {data.stores
                .map((store) => {
                  const approvedSum = store.payments
                    .filter((p) => p.status === "APPROVED")
                    .reduce((s, p) => s + (p.amount || 0), 0);
                  const pendingSum = store.payments
                    .filter((p) => p.status === "PENDING")
                    .reduce((s, p) => s + (p.amount || 0), 0);
                  const remaining = store.totalprice - approvedSum - pendingSum;
                  return { ...store, approvedSum, pendingSum, remaining };
                })
                .sort((a, b) => a.remaining - b.remaining)
                .map((store, idx) => {
                  const isFullyPaid = store.approvedSum >= store.totalprice;
                  const checked = selectedRecordIds.has(store.id);
                  return (
                    <div
                      key={store.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                        isFullyPaid
                          ? "border-emerald-100 bg-emerald-50/30 opacity-60"
                          : checked
                            ? "border-primarycolor bg-primarycolor/[0.03]"
                            : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      <span className="size-7 rounded-lg bg-primarycolor/10 text-primarycolor font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Checkbox
                        checked={checked}
                        disabled={isFullyPaid}
                        onCheckedChange={(val) => {
                          if (isFullyPaid) return;
                          setSelectedRecordIds((prev) => {
                            const next = new Set(prev);
                            if (val) next.add(store.id);
                            else next.delete(store.id);
                            return next;
                          });
                        }}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-700 truncate">{store.shopName}</p>
                        <p className="text-[8px] font-bold text-muted-foreground">
                          Total: {store.totalprice.toLocaleString()} ETB
                          {store.approvedSum > 0 && ` · Paid: ${store.approvedSum.toLocaleString()} ETB`}
                          {store.pendingSum > 0 && ` · Pending: ${store.pendingSum.toLocaleString()} ETB`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        {isFullyPaid ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[9px] uppercase tracking-widest">
                            <CheckCircle2 className="size-3" />
                            Paid
                          </span>
                        ) : (
                          <div>
                            <p className="font-black text-base text-primarycolor">{store.remaining.toLocaleString()} ETB</p>
                            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">To Record</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="shrink-0 border-t border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total to Record</p>
              <p className="font-black text-xl text-primarycolor">
                {data.stores
                  .filter((s) => selectedRecordIds.has(s.id))
                  .reduce((sum, s) => {
                    const approved = s.payments.filter(p => p.status === "APPROVED").reduce((a, p) => a + (p.amount || 0), 0);
                    const pending = s.payments.filter(p => p.status === "PENDING").reduce((a, p) => a + (p.amount || 0), 0);
                    return sum + Math.max(0, s.totalprice - approved - pending);
                  }, 0).toLocaleString()} ETB
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePayAllShops}
                disabled={isPayingAll || selectedRecordIds.size === 0}
                className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPayingAll ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Banknote className="size-5" />
                )}
                {isPayingAll ? "Processing..." : "Proceed Payment"}
              </button>
              <button
                onClick={() => setShowPayAllDialog(false)}
                className="flex-1 h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fully Paid Shop Confirmation Dialog */}
      <Dialog open={payFullShopId !== null} onOpenChange={(o) => !o && setPayFullShopId(null)}>
        <DialogContent className="sm:max-w-md w-[90vw] rounded-[2rem] border-4 border-emerald-500/20 bg-white p-6 shadow-2xl">
          <DialogHeader className="p-0">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Banknote className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-black uppercase italic leading-tight text-emerald-700">
                  Confirm Full Payment
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  {
                  payFullShopId
                    ? (() => {
                        const s = data.stores.find(st => st.id === payFullShopId);
                        if (!s) return "";
                        const paid = s.payments.filter(p => p.status === "APPROVED").reduce((a, p) => a + (p.amount || 0), 0);
                        return `${s.shopName} — ${(s.totalprice - paid).toLocaleString()} ETB remaining`;
                      })()
                    : ""
                  }
                </p>
              </div>
            </div>
          </DialogHeader>
          <p className="text-sm text-slate-600 text-center py-4">
            This will record and approve a payment for the full remaining amount.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePayFullShop}
              disabled={isPayingFull}
              className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPayingFull ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-5" />
              )}
              {isPayingFull ? "Processing..." : "Confirm & Pay"}
            </button>
            <button
              onClick={() => setPayFullShopId(null)}
              disabled={isPayingFull}
              className="flex-1 h-12 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Allocate Dialog */}
      <Dialog open={showAllocateDialog} onOpenChange={(o) => !o && setShowAllocateDialog(false)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <Package className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                  Allocate Books
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  {data.bookTitle} — {quantityToAllocate} books to {data.editionName || "edition"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
              Select Store to Allocate From
            </p>

            {/* Store/Printer selection from edition stock */}
            {data.editionId ? (
              <AllocateStoreSelector
                editionId={data.editionId}
                selectedStoreId={selectedStoreId}
                selectedStoreType={selectedStoreType}
                selectedStockId={selectedStockId}
                onSelect={(storeId, type, stockId) => {
                  setSelectedStoreId(storeId);
                  setSelectedStoreType(type);
                  setSelectedStockId(stockId);
                }}
              />
            ) : (
              <div className="py-8 text-center">
                <p className="text-[10px] font-bold text-muted-foreground">No edition linked to this round book</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAllocate}
                disabled={isAllocating || !selectedStoreId}
                className="flex-1 h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-sm shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAllocating ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Package className="size-5" />
                )}
                {isAllocating ? "Allocating..." : `Allocate ${quantityToAllocate} Books`}
              </button>
              <button
                onClick={() => setShowAllocateDialog(false)}
                className="flex-1 h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AllocateStoreSelector({
  editionId,
  selectedStoreId,
  selectedStoreType,
  selectedStockId,
  onSelect,
}: {
  editionId: number;
  selectedStoreId: number | null;
  selectedStoreType: "store" | "printer" | null;
  selectedStockId: number | null;
  onSelect: (storeId: number, type: "store" | "printer", stockId: number) => void;
}) {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/app/actions/edition-actions").then(({ getEditionById }) => {
      getEditionById(editionId).then((res) => {
        if (res.success && res.data) {
          const stockItems: any[] = [];
          for (const bes of res.data.bookeditionstores || []) {
            if (bes.quantity > 0) {
              stockItems.push({
                id: bes.stores.id,
                name: bes.stores.name,
                type: "store" as const,
                stockId: bes.id,
                quantity: bes.quantity,
              });
            }
          }
          for (const bep of res.data.bookeditionprinters || []) {
            if (bep.quantity > 0) {
              stockItems.push({
                id: bep.printer.id,
                name: bep.printer.name,
                type: "printer" as const,
                stockId: bep.id,
                quantity: bep.quantity,
              });
            }
          }
          setStores(stockItems);
        }
        setLoading(false);
      });
    });
  }, [editionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-primarycolor" />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-[10px] font-bold text-muted-foreground">No stock available for this edition</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {stores.map((store) => (
        <label
          key={`${store.type}-${store.id}`}
          className={cn(
            "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
            selectedStoreId === store.id && selectedStoreType === store.type
              ? "border-primarycolor bg-primarycolor/5"
              : "border-slate-100 bg-white hover:border-slate-200"
          )}
        >
          <input
            type="radio"
            name="allocate-store"
            checked={selectedStoreId === store.id && selectedStoreType === store.type}
            onChange={() => onSelect(store.id, store.type, store.stockId)}
            className="size-4 accent-primarycolor"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {store.type === "printer" ? (
                <Printer className="size-4 text-purple-500 shrink-0" />
              ) : (
                <Building2 className="size-4 text-primarycolor/60 shrink-0" />
              )}
              <span className="font-bold text-sm text-slate-700 truncate">{store.name}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-black text-sm text-primarycolor">{store.quantity}</span>
            <span className="text-[8px] font-bold text-muted-foreground ml-1">in stock</span>
          </div>
          {store.type === "printer" && (
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[7px] font-black uppercase tracking-widest">Printer</span>
          )}
        </label>
      ))}
    </div>
  );
}
