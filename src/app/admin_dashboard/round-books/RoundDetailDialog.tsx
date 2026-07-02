"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  BookOpen,
  Store,
  Banknote,
  Landmark,
  Loader2,
  Calendar,
  Package,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAdminRoundDetail, approveRoundPayment } from "./actions";

type Props = {
  open: boolean;
  onClose: () => void;
  roundId: number | null;
};

export default function RoundDetailDialog({ open, onClose, roundId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(() => {
    if (!roundId) return;
    setLoading(true);
    setData(null);
    getAdminRoundDetail(roundId).then((res) => {
      if (res.success) setData(res.data);
    }).finally(() => setLoading(false));
  }, [roundId]);

  useEffect(() => {
    if (open) fetchDetail();
  }, [open, fetchDetail]);

  const handleApprove = async (paymentId: number) => {
    const res = await approveRoundPayment(paymentId);
    if (res.success) {
      toast.success("Payment approved");
      fetchDetail();
    } else {
      toast.error(res.error || "Failed to approve");
    }
  };

  const createdDate = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const booksSold = data
    ? data.startingAmount - data.returnedAmount
    : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-5 sm:p-7 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0 overflow-hidden">
                {data?.bookImage ? (
                  <img src={data.bookImage} alt="" className="size-full object-cover" />
                ) : (
                  <BookOpen className="size-7" />
                )}
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-black uppercase italic leading-tight text-primarycolor truncate">
                  {data?.bookTitle || "Round Detail"}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[9px] font-bold text-muted-foreground truncate">
                    {data?.bookAuthor || "—"}
                  </p>
                  <span className="text-[6px] text-muted-foreground/30">|</span>
                  <p className="text-[8px] font-bold text-muted-foreground font-mono">
                    {data?.bookSku || ""}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all shrink-0 ml-3">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primarycolor" />
          </div>
        ) : !data ? (
          <div className="py-20 text-center">
            <p className="text-[11px] font-bold text-muted-foreground">Could not load round details</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Status + Date */}
            <div className="flex items-center justify-between">
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2",
                data.status
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                  : "bg-slate-50 text-slate-500 border-slate-200/50",
              )}>
                <span className={cn("size-1.5 rounded-full", data.status ? "bg-emerald-500" : "bg-slate-400")} />
                {data.status ? "Active" : "Ended"}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground">
                <Calendar className="size-3" />
                {createdDate}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="size-3.5 text-primarycolor" />
                  <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Starting</p>
                </div>
                <p className="font-black text-2xl text-slate-800">{data.startingAmount}</p>
              </div>
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeftRight className="size-3.5 text-amber-600" />
                  <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Returned</p>
                </div>
                <p className="font-black text-2xl text-slate-800">{data.returnedAmount}</p>
              </div>
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Sold</p>
                </div>
                <p className="font-black text-2xl text-primarycolor">{booksSold}</p>
              </div>
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="size-3.5 text-secondarycolor" />
                  <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Shops</p>
                </div>
                <p className="font-black text-2xl text-secondarycolor">{data.storeCount}</p>
              </div>
            </div>

            {/* Sold Revenue */}
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
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  Shop Records
                </p>
                <span className="text-[8px] font-bold text-muted-foreground">
                  {data.storeCount} shop{data.storeCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {data.stores.map((store: any, i: number) => (
                  <div key={store.id} className="bg-white rounded-2xl border-2 border-primarycolor/5 overflow-hidden">
                    <div className="p-4 flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                        <Store className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-slate-700 truncate">{store.shopName}</p>
                        {store.location && (
                          <p className="text-[8px] font-bold text-muted-foreground truncate">{store.location}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-base text-primarycolor">{store.totalprice.toLocaleString()} ETB</p>
                      </div>
                    </div>
                    {store.payments.length > 0 && (
                      <div className="border-t border-primarycolor/5 bg-primarycolor/[0.01] px-4 py-3 space-y-2">
                        {store.payments.map((p: any) => (
                          <div key={p.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "size-6 rounded-lg flex items-center justify-center",
                                  p.type === "CHECK" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600",
                                )}>
                                  {p.type === "CHECK" ? <Landmark className="size-3" /> : <Banknote className="size-3" />}
                                </div>
                                <span className="font-bold text-slate-600">
                                  {p.type === "CHECK" ? "Check" : "Direct"}
                                </span>
                                {p.check && (
                                  <span className="text-[8px] text-muted-foreground font-medium">
                                    {p.check.bankname} · {p.check.username}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-700">{p.amount.toLocaleString()} ETB</span>
                                {p.status === "PENDING" ? (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleApprove(p.id); }}
                                    className="size-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-all"
                                    title="Approve payment"
                                  >
                                    <ShieldCheck className="size-3.5" />
                                  </button>
                                ) : (
                                  <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600">
                                    {p.status}
                                  </span>
                                )}
                              </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="shrink-0 border-t-2 border-slate-100 p-5 sm:p-7 flex items-center gap-3 justify-end">
          {data && !data.status && (
            data.allocated ? (
              <span className="h-12 px-6 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-[9px] uppercase tracking-widest border-2 border-emerald-200/50 flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Allocated
              </span>
            ) : (
              <Link
                href={`/admin_dashboard/round-books/deduct/${data.id}`}
                className="h-12 px-6 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-[9px] uppercase tracking-widest border-2 border-amber-200/50 flex items-center gap-2 transition-all active:scale-[0.97]"
              >
                <Package className="size-4" />
                Deduct {data.startingAmount - data.returnedAmount} Books
              </Link>
            )
          )}
          <button
            onClick={onClose}
            className="h-12 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primarycolor/20 active:scale-[0.97]"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}