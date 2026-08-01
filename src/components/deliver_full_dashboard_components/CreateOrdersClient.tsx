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
import { motion, AnimatePresence } from "framer-motion";
import { OrderModal, ShopRow } from "./OrderModal";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
      delay: i * 0.04,
    },
  }),
  exit: { opacity: 0, scale: 0.95, x: 100, transition: { duration: 0.2 } },
};

interface CreateOrdersClientProps {
  shops: ShopRow[];
  sample?: boolean;
}

export default function CreateOrdersClient({ shops, sample }: CreateOrdersClientProps) {
  const [search, setSearch] = useState("");
  const [orderShop, setOrderShop] = useState<ShopRow | null>(null);

  const filtered = shops.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent -mt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Orders</h1>
            <p className="text-sm text-slate-500">Select a shop to create a new order</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shops..."
              className="h-12 pl-12 pr-10 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md font-bold text-sm focus:border-primarycolor shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          filtered.map((shop, i) => (
            <motion.div
              key={shop.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={i}
              layout
            >
              <div className="bg-white rounded-3xl border-2 border-primarycolor/5 p-5 shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                      <Store className="size-5" />
                    </div>
                    <div>
                      <p className="font-black text-gray-800">{shop.name}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground mt-0.5">
                        <MapPin className="size-3" />
                        {shop.branch}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[10px] border shrink-0",
                      shop.remaining > 0
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}
                  >
                    <BadgeDollarSign className="size-3" />
                    {shop.remaining.toLocaleString()} ETB
                  </span>
                </div>

                <button
                  onClick={() => setOrderShop(shop)}
                  className="w-full h-12 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primarycolor/20"
                >
                  <Plus className="size-4" /> Create Order
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            key="empty-shops"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center"
          >
            <ShoppingBag className="size-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-black text-gray-300 uppercase tracking-widest text-[10px]">
              {search ? "No shops match your search" : "No shops available"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {orderShop && (
        <OrderModal
          shop={orderShop}
          open={!!orderShop}
          onClose={() => setOrderShop(null)}
          sample={sample}
        />
      )}
    </div>
  );
}
