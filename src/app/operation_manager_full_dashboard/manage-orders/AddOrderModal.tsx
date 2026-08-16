"use client";

import React, { useState } from "react";
import {
  Search,
  X,
  ShoppingBag,
  BadgeDollarSign,
  Plus,
  MapPin,
  Store,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderModal, ShopRow } from "@/components/deliver_full_dashboard_components/OrderModal";

interface AddOrderModalProps {
  shops: ShopRow[];
  open: boolean;
  onClose: () => void;
}

export default function AddOrderModal({ shops, open, onClose }: AddOrderModalProps) {
  const [search, setSearch] = useState("");
  const [orderShop, setOrderShop] = useState<ShopRow | null>(null);

  const filtered = shops.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q);
  });

  const handleDialogClose = () => {
    setOrderShop(null);
    setSearch("");
    onClose();
  };

  return (
    <>
      <Dialog open={open && !orderShop} onOpenChange={(o) => !o && handleDialogClose()}>
        <DialogContent className="w-full max-w-2xl md:max-w-7xl max-h-[85dvh] flex flex-col p-0 overflow-hidden bg-white rounded-3xl border-0">
          <DialogHeader className="shrink-0 px-5 pt-5 pb-0 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                  <ShoppingBag className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-black text-primarycolor uppercase italic text-left leading-tight">
                    Add a New Order
                  </DialogTitle>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                    Select a shop to record an order
                  </p>
                </div>
              </div>
              <button
                onClick={handleDialogClose}
                className="size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-muted-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="py-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shops..."
                  className="h-11 pl-10 pr-10 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-bold text-sm focus:border-primarycolor focus:bg-white transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filtered.length > 0 ? (
              filtered.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl border-2 border-primarycolor/5 p-4 shadow-sm space-y-3 hover:border-primarycolor/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                        <Store className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-800 truncate">{shop.name}</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground mt-0.5">
                          <MapPin className="size-3" />
                          <span className="truncate">{shop.branch || "No branch"}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-black text-[10px] border shrink-0",
                        (shop.totalDebt ?? shop.remaining) > 0
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}
                    >
                      <BadgeDollarSign className="size-3" />
                      {(shop.totalDebt ?? shop.remaining).toLocaleString()} ETB
                    </span>
                  </div>

                  <div className="hidden md:grid grid-cols-5 gap-2">
                    <div className="bg-amber-50 rounded-xl p-2.5 space-y-0.5">
                      <p className="text-[7px] font-black uppercase tracking-widest text-amber-600/60">Order</p>
                      <p className={`font-black text-xs ${(shop.orderDebt || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {(shop.orderDebt || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-2.5 space-y-0.5">
                      <p className="text-[7px] font-black uppercase tracking-widest text-rose-600/60">Round</p>
                      <p className={`font-black text-xs ${(shop.roundDebt || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {(shop.roundDebt || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-2.5 space-y-0.5">
                      <p className="text-[7px] font-black uppercase tracking-widest text-purple-600/60">Prev.</p>
                      <p className={`font-black text-xs ${(shop.previousDebt || 0) > 0 ? 'text-purple-600' : 'text-emerald-600'}`}>
                        {(shop.previousDebt || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-cyan-50 rounded-xl p-2.5 space-y-0.5">
                      <p className="text-[7px] font-black uppercase tracking-widest text-cyan-600/60">Last</p>
                      <p className={`font-black text-xs ${(shop.lastOrderDebt || 0) > 0 ? 'text-cyan-600' : 'text-emerald-600'}`}>
                        {(shop.lastOrderDebt || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 space-y-0.5">
                      <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Total</p>
                      <p className={`font-black text-xs ${(shop.totalDebt || 0) > 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {(shop.totalDebt || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setOrderShop(shop)}
                    className="w-full h-11 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primarycolor/20"
                  >
                    <Plus className="size-4" /> Create Order
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <ShoppingBag className="size-12 mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-black text-gray-300 uppercase tracking-widest text-[10px]">
                  {search ? "No shops match your search" : "No shops available"}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {orderShop && (
        <OrderModal
          shop={orderShop}
          open={!!orderShop}
          onClose={() => {
            setOrderShop(null);
            setSearch("");
            onClose();
          }}
        />
      )}
    </>
  );
}
