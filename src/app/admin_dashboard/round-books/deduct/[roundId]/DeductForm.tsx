"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Store,
  Printer,
  Package,
  CheckCircle2,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { approveDeduction } from "../../actions";

type EditionStock = {
  stockId: number;
  editionId: number;
  editionName: string;
  quantity: number;
  sellingPrice: number;
};

type Source = {
  key: string;
  name: string;
  type: "store" | "printer";
  totalAvailable: number;
  editionStocks: EditionStock[];
};

type Shop = {
  id: number;
  shopId: number;
  shopName: string;
  totalprice: number;
  qty: number;
};

type Props = {
  data: {
    roundId: number;
    bookTitle: string;
    bookAuthor: string;
    bookSku: string;
    startingAmount: number;
    returnedAmount: number;
    totalToDeduct: number;
    shops: Shop[];
    sources: Source[];
  };
};

export default function DeductForm({ data }: Props) {
  const router = useRouter();
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const allocatedTotal = useMemo(
    () => Object.values(allocations).reduce((sum, q) => sum + (q || 0), 0),
    [allocations],
  );

  const noOveralloc = data.sources.every((s) => (allocations[s.key] || 0) <= s.totalAvailable);
  const canSubmit = allocatedTotal === data.totalToDeduct && noOveralloc && allocatedTotal > 0;

  const handleQtyChange = (key: string, value: string) => {
    const num = parseInt(value, 10) || 0;
    const source = data.sources.find((s) => s.key === key);
    const max = source?.totalAvailable ?? 0;
    setAllocations((prev) => ({ ...prev, [key]: Math.min(num, max) }));
  };

  const handleAutoFill = (key: string) => {
    const source = data.sources.find((s) => s.key === key);
    if (!source) return;
    const remaining = data.totalToDeduct - allocatedTotal;
    const take = Math.min(remaining, source.totalAvailable);
    setAllocations((prev) => ({ ...prev, [key]: take }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const payload = data.sources
      .filter((s) => (allocations[s.key] || 0) > 0)
      .map((s) => ({ sourceKey: s.key, quantity: allocations[s.key]! }));
    const res = await approveDeduction(data.roundId, payload);
    if (res.success) {
      toast.success("Books deducted from stock and allocated to shops");
      router.push("/admin_dashboard/round-books");
    } else {
      toast.error(res.error || "Deduction failed");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      {/* Round Summary */}
      <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center shrink-0">
            <BookOpen className="size-7 text-primarycolor" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-black text-xl text-primarycolor truncate">{data.bookTitle}</h2>
            <p className="text-[9px] font-bold text-muted-foreground">{data.bookAuthor} &middot; {data.bookSku}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="bg-primarycolor/[0.02] rounded-2xl border border-primarycolor/10 p-4 text-center">
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Starting</p>
            <p className="font-black text-2xl text-slate-800 mt-1">{data.startingAmount}</p>
          </div>
          <div className="bg-primarycolor/[0.02] rounded-2xl border border-primarycolor/10 p-4 text-center">
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Returned</p>
            <p className="font-black text-2xl text-slate-800 mt-1">{data.returnedAmount}</p>
          </div>
          <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/30 p-4 text-center">
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">To Deduct</p>
            <p className="font-black text-2xl text-primarycolor mt-1">{data.totalToDeduct}</p>
          </div>
        </div>
      </div>

      {/* Source Allocation */}
      <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl">
        <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4">
          Select Stock Sources
        </h3>
        <div className="space-y-3">
          {data.sources.length === 0 ? (
            <div className="py-10 text-center">
              <Package className="size-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-[10px] font-bold text-muted-foreground">No stock sources available</p>
            </div>
          ) : (
            data.sources.map((source) => (
              <div
                key={source.key}
                className={cn(
                  "rounded-2xl border-2 p-4 transition-all",
                  (allocations[source.key] || 0) > 0
                    ? "border-primarycolor/30 bg-primarycolor/[0.02]"
                    : "border-primarycolor/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center shrink-0",
                    source.type === "store" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600",
                  )}>
                    {source.type === "store" ? <Store className="size-5" /> : <Printer className="size-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-slate-700 truncate">{source.name}</p>
                    <p className="text-[8px] font-bold text-muted-foreground">
                      {source.type === "store" ? "Store" : "Printer"} &middot; {source.totalAvailable} available
                      {source.editionStocks.length > 1 && ` (${source.editionStocks.length} editions)`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Input
                      type="number"
                      min={0}
                      max={source.totalAvailable}
                      value={allocations[source.key] || ""}
                      onChange={(e) => handleQtyChange(source.key, e.target.value)}
                      placeholder="0"
                      className="w-20 h-10 px-3 rounded-xl border-2 border-primarycolor/5 bg-white font-bold text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => handleAutoFill(source.key)}
                      disabled={allocatedTotal >= data.totalToDeduct}
                      className="h-10 px-3 rounded-xl bg-primarycolor/5 hover:bg-primarycolor/10 text-primarycolor font-black text-[8px] uppercase tracking-widest transition-all disabled:opacity-30"
                    >
                      Fill
                    </button>
                  </div>
                </div>
                {source.editionStocks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-primarycolor/5 flex flex-wrap gap-2">
                    {source.editionStocks.map((es) => (
                      <span key={es.stockId} className="text-[7px] font-bold text-muted-foreground bg-primarycolor/[0.02] px-2 py-1 rounded-lg">
                        {es.editionName}: {es.quantity} @ {es.sellingPrice} ETB
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shop Allocation Preview */}
      {data.shops.length > 0 && (
        <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl">
          <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4">
            Will be allocated to shops
          </h3>
          <div className="space-y-2">
            {data.shops.map((shop) => (
              <div key={shop.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primarycolor/[0.02]">
                <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                  <Store className="size-4" />
                </div>
                <span className="font-bold text-sm text-slate-700 flex-1 truncate">{shop.shopName}</span>
                <span className="font-black text-sm text-primarycolor">{shop.qty} books</span>
                <span className="text-[9px] font-bold text-muted-foreground">
                  {shop.totalprice.toLocaleString()} ETB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress & Submit */}
      <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            Allocation Progress
          </p>
          <p className={cn(
            "font-black text-lg",
            allocatedTotal === data.totalToDeduct ? "text-emerald-600" : "text-amber-600",
          )}>
            {allocatedTotal} / {data.totalToDeduct}
          </p>
        </div>
        <div className="h-2.5 rounded-full bg-primarycolor/5 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              allocatedTotal === data.totalToDeduct
                ? "bg-emerald-500"
                : "bg-primarycolor",
            )}
            style={{ width: `${data.totalToDeduct > 0 ? (allocatedTotal / data.totalToDeduct) * 100 : 0}%` }}
          />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" asChild className="h-12 px-6 border-2 border-primarycolor/20 rounded-2xl font-bold">
            <Link href="/admin_dashboard/round-books">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Link>
          </Button>
          <div className="flex-1" />
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="h-12 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primarycolor/20 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {submitting ? "Processing..." : "Approve Deduction"}
          </Button>
        </div>
      </div>
    </div>
  );
}