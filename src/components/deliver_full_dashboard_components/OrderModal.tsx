"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  X,
  ShoppingBag,
  Plus,
  Loader2,
  Check,
  BookMarked,
  ListChecks,
  Info,
  BookOpen,
  Minus,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { searchBooks } from "@/app/actions/transfer-actions";
import { createOrder } from "@/app/actions/order-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ShopRow = {
  id: number;
  name: string;
  branch: string;
  remaining: number;
};

type EditionInfo = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type StockInfo = {
  editions: EditionInfo[];
  maxStock: number;
};

type SelectedBookInfo = {
  title: string;
  author: string;
  quantity: number;
};

const springItem = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 28, delay: i * 0.04 },
  }),
  exit: { opacity: 0, x: 50, transition: { duration: 0.15 } },
};

const TAB_ORDER = ["select", "selected", "info"] as const;
type TabKey = (typeof TAB_ORDER)[number];

const SWIPE_THRESHOLD = 60;

function calculateFifoTotal(editions: EditionInfo[], quantity: number) {
  let remaining = quantity;
  let total = 0;
  for (const ed of editions) {
    if (remaining <= 0) break;
    if (ed.stock <= 0) continue;
    const take = Math.min(remaining, ed.stock);
    total += take * ed.price;
    remaining -= take;
  }
  return total;
}

export function OrderModal({
  shop,
  open,
  onClose,
  sample,
}: {
  shop: ShopRow;
  open: boolean;
  onClose: () => void;
  sample?: boolean;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);
  const [activeTab, setActiveTab] = useState<TabKey>("select");
  const [bookQuery, setBookQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Record<number, SelectedBookInfo>>({});
  const [stockMap, setStockMap] = useState<Record<number, StockInfo>>({});
  const [loadingStock, setLoadingStock] = useState<Set<number>>(new Set());
  const [orderType, setOrderType] = useState("requested");
  const [amountPaid, setAmountPaid] = useState("");
  const [lockBooks, setLockBooks] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalMode, setTotalMode] = useState<"auto" | "manual">("auto");
  const [manualTotal, setManualTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setInitialLoading(true);
      searchBooks("", 0, 200).then((res) => {
        if (res.success) setBooks(res.data || []);
        setInitialLoading(false);
        setTimeout(() => searchRef.current?.focus(), 350);
      });
    }
  }, [open]);

  const handleSearch = (q: string) => {
    setBookQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const query = q;
      setSearching(true);
      const res = await searchBooks(query, 0, 200);
      if (res.success) setBooks(res.data || []);
      setSearching(false);
    }, 300);
  };

  const toggleBook = (book: any) => {
    if (selectedBooks[book.id]) {
      setSelectedBooks((prev) => {
        const { [book.id]: _, ...rest } = prev;
        return rest;
      });
      setStockMap((prev) => {
        const { [book.id]: _, ...rest } = prev;
        return rest;
      });
      return;
    }

    if (!stockMap[book.id]) {
      // Use editionStock from search results (avoids a separate DB call)
      if (book.editionStock && book.editionStock.length > 0) {
        const editions: EditionInfo[] = book.editionStock;
        const maxStock = editions.reduce((acc, e) => acc + e.stock, 0);
        if (maxStock <= 0) {
          toast.error("No stock available for this book");
          return;
        }
        setStockMap((prev) => ({ ...prev, [book.id]: { editions, maxStock } }));
        setSelectedBooks((prev) => ({
          ...prev,
          [book.id]: { title: book.title, author: book.author || "", quantity: 1 },
        }));
      } else {
        toast.error("No stock available for this book");
      }
    } else {
      setSelectedBooks((prev) => ({
        ...prev,
        [book.id]: { title: book.title, author: book.author || "", quantity: 1 },
      }));
    }
  };

  const setQuantity = (id: number, qty: number) => {
    const max = stockMap[id]?.maxStock ?? Infinity;
    const clamped = Math.max(1, Math.min(qty, max));
    setSelectedBooks((prev) => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], quantity: clamped } };
    });
  };

  const removeBook = (id: number) => {
    setSelectedBooks((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setStockMap((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const totalItems = Object.values(selectedBooks).reduce((sum, b) => sum + b.quantity, 0);
  const selectedCount = Object.keys(selectedBooks).length;

  const grandTotal = useMemo(() => {
    let total = 0;
    for (const [id, info] of Object.entries(selectedBooks)) {
      const stock = stockMap[Number(id)];
      if (stock) {
        total += calculateFifoTotal(stock.editions, info.quantity);
      }
    }
    return total;
  }, [selectedBooks, stockMap]);

  const handleSubmit = async () => {
    const items = Object.entries(selectedBooks).map(([id, info]) => ({
      bookId: Number(id),
      quantity: info.quantity,
    }));
    if (items.length === 0) { toast.error("Add at least one book"); return; }
    setIsSubmitting(true);
    try {
      const res = await createOrder({
        bookShopId: shop.id,
        order_type: orderType,
        amount_paid: parseFloat(amountPaid) || 0,
        total_amount: totalMode === "manual" ? manualTotal : null,
        lock_books: lockBooks,
        items,
      });
      if (res.success) {
        toast.success(`Order created for ${shop.name}`);
        onClose();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goTab = (dir: 1 | -1) => {
    const idx = TAB_ORDER.indexOf(activeTab);
    const next = idx + dir;
    if (next >= 0 && next < TAB_ORDER.length) {
      setActiveTab(TAB_ORDER[next]);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goTab(1);
    else if (info.offset.x > SWIPE_THRESHOLD) goTab(-1);
  };

  const tabs = [
    { key: "select" as const, label: "Select", icon: BookMarked, badge: "" },
    { key: "selected" as const, label: "Selected", icon: ListChecks, badge: selectedCount > 0 ? String(selectedCount) : "" },
    { key: "info" as const, label: "Info", icon: Info, badge: "" },
  ];

  const availableBooks = books.filter((b: any) => b.hasStoreStock);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-full w-full h-[100dvh] max-h-[100dvh] rounded-none border-0 bg-white p-0 flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0 px-4 pt-4 pb-0 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black text-primarycolor uppercase italic text-left leading-tight">
                  {sample ? "Sample Order" : "New Order"}
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{shop.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-muted-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="py-3">
            <div className="bg-slate-100/80 rounded-2xl p-1 flex">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 flex-1 py-2.5 px-2 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all",
                      active
                        ? "bg-white text-primarycolor shadow-sm"
                        : "text-muted-foreground/60 hover:text-muted-foreground"
                    )}
                  >
                    <tab.icon className="size-3.5 shrink-0" />
                    {tab.label}
                    {tab.badge && (
                      <span className="size-5 rounded-full bg-primarycolor text-white text-[8px] font-black flex items-center justify-center shrink-0">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden" ref={contentRef}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeTab}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: activeTab === "select" ? -60 : activeTab === "info" ? 60 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "select" ? 60 : activeTab === "info" ? -60 : 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="h-full overflow-y-auto"
            >
              {activeTab === "select" && (
                <div className="p-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <Input
                      ref={searchRef}
                      value={bookQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search books by title or author..."
                      className="h-12 pl-10 pr-10 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-bold text-sm focus:border-primarycolor focus:bg-white transition-all"
                    />
                    {bookQuery && (
                      <button
                        onClick={() => { setBookQuery(""); handleSearch(""); }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {initialLoading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 py-12"
                      >
                        <Loader2 className="size-5 animate-spin text-primarycolor" />
                        <span className="text-[10px] font-bold text-muted-foreground">Loading books from stores...</span>
                      </motion.div>
                    )}

                    {searching && (
                      <motion.div
                        key="searching"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 py-6"
                      >
                        <Loader2 className="size-4 animate-spin text-primarycolor" />
                        <span className="text-[10px] font-bold text-muted-foreground">Searching...</span>
                      </motion.div>
                    )}

                    {!initialLoading && !searching && availableBooks.length === 0 && (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-16 text-center"
                      >
                        <BookOpen className="size-12 mx-auto text-muted-foreground/20 mb-4" />
                        <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">No books available in stores</p>
                      </motion.div>
                    )}

                    {!initialLoading && availableBooks.length > 0 && (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-2"
                      >
                        {availableBooks.map((book, i) => {
                          const isSelected = !!selectedBooks[book.id];
                          const stock = stockMap[book.id];
                          const maxQty = stock?.maxStock ?? 0;
                          const currentQty = selectedBooks[book.id]?.quantity ?? 0;
                          const isLoading = loadingStock.has(book.id);
                          return (
                            <motion.div
                              key={book.id}
                              variants={springItem}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              custom={i}
                              className={cn(
                                "rounded-2xl border-2 transition-all overflow-hidden",
                                isSelected
                                  ? "bg-primarycolor/5 border-primarycolor/30"
                                  : "bg-white border-slate-100"
                              )}
                            >
                              <button
                                onClick={() => toggleBook(book)}
                                disabled={isLoading}
                                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                              >
                                <div className={cn(
                                  "size-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
                                  isSelected
                                    ? "bg-primarycolor border-primarycolor text-white"
                                    : "border-slate-300 bg-white"
                                )}>
                                  {isSelected ? (
                                    <Check className="size-3.5" />
                                  ) : isLoading ? (
                                    <Loader2 className="size-3 animate-spin" />
                                  ) : null}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-sm text-gray-800 truncate leading-tight">{book.title}</p>
                                  <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{book.author || "Unknown author"}</p>
                                </div>
                                {isSelected && maxQty > 0 && (
                                  <span className="text-[8px] font-bold text-muted-foreground/50 uppercase shrink-0">
                                    Max {maxQty}
                                  </span>
                                )}
                              </button>

                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-3.5 pt-0 flex items-center gap-3">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
                                        Qty
                                      </span>
                                      <div className="flex-1 flex items-center gap-2">
                                        <button
                                          onClick={() => setQuantity(book.id, currentQty - 1)}
                                          disabled={currentQty <= 1}
                                          className="size-10 rounded-xl border-2 border-primarycolor/10 flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 active:scale-90 transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          <Minus className="size-4" />
                                        </button>
                                        <input
                                          type="number"
                                          min={1}
                                          max={maxQty}
                                          value={currentQty}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) => setQuantity(book.id, parseInt(e.target.value) || 1)}
                                          className="flex-1 h-12 text-center font-black text-base text-primarycolor bg-white rounded-xl border-2 border-primarycolor/20 focus:border-primarycolor outline-none tabular-nums [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                        <button
                                          onClick={() => setQuantity(book.id, currentQty + 1)}
                                          disabled={currentQty >= maxQty}
                                          className="size-10 rounded-xl border-2 border-primarycolor/10 flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 active:scale-90 transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          <Plus className="size-4" />
                                        </button>
                                      </div>
                                      {maxQty > 0 && (
                                        <span className="text-[8px] font-bold text-muted-foreground/40 uppercase shrink-0 w-10 text-right">
                                          /{maxQty}
                                        </span>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === "selected" && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      {totalItems > 0 ? `${totalItems} book${totalItems > 1 ? "s" : ""}` : "No books selected"}
                    </p>
                    {selectedCount > 0 && (
                      <button
                        onClick={() => { setSelectedBooks({}); setStockMap({}); }}
                        className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 active:scale-95 transition-all"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="popLayout">
                    {Object.entries(selectedBooks).length > 0 ? (
                      Object.entries(selectedBooks).map(([id, info]) => {
                        const stock = stockMap[Number(id)];
                        const maxQty = stock?.maxStock ?? 0;
                        return (
                          <motion.div
                            key={id}
                            layout
                            initial={{ opacity: 0, x: -30, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          >
                            <div className="bg-white rounded-2xl border-2 border-primarycolor/5 p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1 mr-3">
                                  <p className="font-bold text-sm text-gray-800 truncate leading-tight">{info.title}</p>
                                  <p className="text-[8px] font-bold text-muted-foreground mt-0.5">{info.author || "Unknown"}</p>
                                </div>
                                <button
                                  onClick={() => removeBook(Number(id))}
                                  className="size-9 rounded-xl border-2 border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 active:scale-90 transition-all shrink-0"
                                >
                                  <X className="size-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
                                  Qty
                                </span>
                                <div className="flex-1 flex items-center gap-2">
                                  <button
                                    onClick={() => setQuantity(Number(id), info.quantity - 1)}
                                    disabled={info.quantity <= 1}
                                    className="size-9 rounded-xl border-2 border-primarycolor/10 flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 active:scale-90 transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="size-3.5" />
                                  </button>
                                  <input
                                    type="number"
                                    min={1}
                                    max={maxQty}
                                    value={info.quantity}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => setQuantity(Number(id), parseInt(e.target.value) || 1)}
                                    className="flex-1 h-10 text-center font-black text-sm text-primarycolor bg-primarycolor/[0.02] rounded-xl border-2 border-primarycolor/20 focus:border-primarycolor outline-none tabular-nums [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                  />
                                  <button
                                    onClick={() => setQuantity(Number(id), info.quantity + 1)}
                                    disabled={info.quantity >= maxQty}
                                    className="size-9 rounded-xl border-2 border-primarycolor/10 flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 active:scale-90 transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="size-3.5" />
                                  </button>
                                </div>
                                {maxQty > 0 && (
                                  <span className="text-[8px] font-bold text-muted-foreground/40 uppercase shrink-0 w-10 text-right">
                                    /{maxQty}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.div
                        key="empty-selected"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-16 text-center"
                      >
                        <ListChecks className="size-12 mx-auto text-muted-foreground/15 mb-4" />
                        <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">No books selected yet</p>
                        <p className="text-[9px] font-bold text-muted-foreground mt-2">Swipe right or tap Select to add books</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === "info" && (
                <div className="p-4 space-y-4">
                  {sample && (
                    <div className="text-center py-2">
                      <span className="inline-block px-6 py-1.5 rounded-full border-2 border-dashed border-amber-400 text-amber-600 font-black text-[10px] uppercase tracking-[0.3em] bg-amber-50/50">
                        Sample Order — Not Submitted
                      </span>
                    </div>
                  )}
                  <div className="bg-primarycolor/[0.02] rounded-3xl border-2 border-primarycolor/5 p-5 space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Order Summary</p>
                      <span className="text-[9px] font-black text-primarycolor bg-primarycolor/5 px-2.5 py-1 rounded-lg">
                        {totalItems} book{totalItems > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {Object.entries(selectedBooks).map(([id, info]) => {
                        const stock = stockMap[Number(id)];
                        const bookTotal = stock ? calculateFifoTotal(stock.editions, info.quantity) : 0;
                        return (
                          <div key={id} className="flex items-center justify-between text-sm py-1">
                            <p className="font-bold text-gray-700 truncate min-w-0 flex-1 mr-2">{info.title}</p>
                            <div className="text-right shrink-0">
                              <span className="font-black text-primarycolor tabular-nums">x{info.quantity}</span>
                              <span className="text-[8px] font-bold text-muted-foreground/50 ml-2 tabular-nums">
                                {bookTotal.toLocaleString()} ETB
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Auto / Manual total toggle */}
                    <div className="flex gap-1 p-0.5 rounded-lg bg-slate-100">
                      <button
                        type="button"
                        onClick={() => setTotalMode("auto")}
                        className={cn(
                          "flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer",
                          totalMode === "auto" ? "bg-white text-primarycolor shadow-sm" : "text-slate-400 hover:text-slate-700"
                        )}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => setTotalMode("manual")}
                        className={cn(
                          "flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer",
                          totalMode === "manual" ? "bg-white text-primarycolor shadow-sm" : "text-slate-400 hover:text-slate-700"
                        )}
                      >
                        Manual
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Grand Total</p>
                      {totalMode === "manual" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={manualTotal}
                            onChange={e => setManualTotal(parseFloat(e.target.value) || 0)}
                            className="w-28 h-8 px-2 rounded-lg border-2 border-slate-200 bg-white font-black text-sm text-right outline-none focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-[10px] font-bold text-muted-foreground">ETB</span>
                        </div>
                      ) : (
                        <p className="text-xl font-black text-primarycolor tabular-nums">
                          {grandTotal.toLocaleString()} <span className="text-[10px] font-bold text-muted-foreground">ETB</span>
                        </p>
                      )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Order Type</label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-100 bg-white font-bold text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2 border-primarycolor/10">
                          <SelectItem value="requested" className="font-bold">Requested</SelectItem>
                          <SelectItem value="on round" className="font-bold">On Round</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {!sample && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount Paid (ETB)</label>
                          <Input
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            placeholder="0.00"
                            className="h-12 rounded-2xl border-2 border-slate-100 bg-white font-bold text-sm focus:border-primarycolor transition-all"
                          />
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Lock Books</span>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={lockBooks}
                            onClick={() => setLockBooks(!lockBooks)}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                              lockBooks ? "bg-primarycolor" : "bg-slate-200"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block size-5 rounded-full bg-white shadow ring-0 transition-transform",
                                lockBooks ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {sample ? (
                    <div className="text-center py-3">
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                        This is a sample preview — no order has been created
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || selectedCount === 0}
                      className="w-full h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/30 gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Check className="size-5" />
                      )}
                      {isSubmitting ? "Creating Order..." : `Create Order — ${grandTotal.toLocaleString()} ETB`}
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {activeTab !== "info" && (
          <div className="shrink-0 border-t-2 border-slate-100 p-3 pb-6 bg-white">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-gray-800">
                  {selectedCount > 0 ? `${totalItems} book${totalItems > 1 ? "s" : ""} selected` : "No books selected"}
                </p>
              </div>
              <Button
                onClick={() => {
                  if (selectedCount === 0) { toast.error("Select at least one book first"); return; }
                  setActiveTab(activeTab === "select" ? "selected" : "info");
                }}
                className="h-12 px-6 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/30 gap-2 shrink-0"
              >
                {activeTab === "select" ? "Review" : "Continue"}
                <ChevronDown className="-rotate-90 size-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div className="shrink-0 border-t-2 border-slate-100 p-3 pb-6 bg-white">
            <p className="text-center text-[9px] font-bold text-muted-foreground">
              Swipe left/right to switch between tabs
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
