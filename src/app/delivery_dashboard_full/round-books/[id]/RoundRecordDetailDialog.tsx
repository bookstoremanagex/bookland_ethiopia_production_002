"use client";

import { useState, useEffect } from "react";
import {
  Store,
  Banknote,
  Check,
  Landmark,
  X,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getRoundRecordDetail } from "../actions";

type Props = {
  open: boolean;
  onClose: () => void;
  recordId: number;
};

export default function RoundRecordDetailDialog({ open, onClose, recordId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && recordId) {
      setLoading(true);
      getRoundRecordDetail(recordId).then((res) => {
        if (res.success) setData(res.data);
      }).finally(() => setLoading(false));
    }
  }, [open, recordId]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
              <Store className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                {data?.shopName || "Shop Detail"}
              </DialogTitle>
              {data?.location && (
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                  {data.location}{data.branch ? ` · ${data.branch}` : ""}
                </p>
              )}
            </div>
            <button onClick={onClose} className="size-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-primarycolor" />
          </div>
        ) : !data ? (
          <div className="py-16 text-center">
            <p className="text-[10px] font-bold text-muted-foreground">Failed to load details</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Sale</p>
                <p className="font-black text-xl text-primarycolor">{data.totalprice.toLocaleString()} ETB</p>
              </div>
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mb-1">Books Sold</p>
                <p className="font-black text-xl text-primarycolor">{data.quantity}</p>
                {data.unitPrice > 0 && (
                  <p className="text-[7px] font-bold text-muted-foreground mt-1">{data.unitPrice} ETB / book</p>
                )}
              </div>
            </div>

            {/* Payments */}
            <div>
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                Payments ({data.payments.length})
              </p>
              {data.payments.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 p-4">
                  <p className="text-[9px] font-bold text-muted-foreground text-center">No payments recorded</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.payments.map((p: any) => (
                    <div key={p.id} className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-8 rounded-xl flex items-center justify-center shrink-0",
                            p.type === "CHECK" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600",
                          )}>
                            {p.type === "CHECK" ? <Landmark className="size-4" /> : <Banknote className="size-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-700">
                              {p.type === "CHECK" ? "Check" : "Direct Payment"}
                            </p>
                            <p className={cn(
                              "text-[8px] font-black uppercase tracking-widest",
                              p.status === "APPROVED" ? "text-emerald-600" : "text-amber-600",
                            )}>
                              {p.status}
                            </p>
                          </div>
                        </div>
                        <p className="font-black text-base text-slate-800">{p.amount.toLocaleString()} ETB</p>
                      </div>
                      {p.type === "CHECK" && p.check && (
                        <div className="mt-3 pt-3 border-t border-primarycolor/5 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Bank</p>
                            <p className="font-bold text-xs text-slate-700">{p.check.bankname || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Holder</p>
                            <p className="font-bold text-xs text-slate-700">{p.check.username || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Check Amount</p>
                            <p className="font-bold text-xs text-slate-700">
                              {p.check.amount ? `${Number(p.check.amount).toLocaleString()} ETB` : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                            <p className="font-bold text-xs text-slate-700">{p.check.status}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="shrink-0 border-t-2 border-slate-100 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="h-12 px-6 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primarycolor/20"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}