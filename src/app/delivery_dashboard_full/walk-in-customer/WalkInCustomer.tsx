"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  X,
  ShoppingBag,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Minus,
  BookOpen,
  Loader2,
  Check,
  Trash2,
  Calendar,
  BookMarked,
  ListChecks,
  Info,
  ChevronDown,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { searchBooks } from "@/app/actions/transfer-actions";
import { createRetailPurchase } from "@/app/actions/retail-purchase-actions";

type PurchaseItem = {
  id: number;
  purchase_id: number;
  edition_id: number;
  quantity: number | null;
  unit_price: number | null;
  edition: {
    id: number;
    edition_name: string;
    selling_price: number | null;
    books: { id: number; title: string } | null;
  } | null;
};

type Purchase = {
  id: number;
  name: string | null;
  date: string | null;
  total_amount: number | null;
  amount_paid: number | null;
  status: string;
  memo: string | null;
  created_by: number | null;
  createdAt: string;
  items: PurchaseItem[];
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

type TabKey2 = "select" | "selected" | "info";
const TAB_ORDER2: TabKey2[] = ["select", "selected", "info"];
const SWIPE_THRESHOLD2 = 60;

const springItem2 = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 28, delay: i * 0.04 },
  }),
  exit: { opacity: 0, x: 50, transition: { duration: 0.15 } },
};

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  APPROVED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  PARTIALLY_PAID: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  PAID: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusStyles[status] || { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider", s.bg, s.text)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {status === "PARTIALLY_PAID" ? "Partial Paid" : status}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 24, delay: i * 0.04 },
  }),
  exit: { opacity: 0, scale: 0.95, x: 100, transition: { duration: 0.2 } },
};

export default function WalkInCustomer({ initialPurchases }: { initialPurchases: Purchase[] }) {
  const router = useRouter();
  const [purchases] = useState(initialPurchases);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 15;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);

  const filtered = useMemo(() => {
    if (!search) return purchases;
    const q = search.toLowerCase();
    return purchases.filter((p) =>
      String(p.id).includes(q) ||
      p.name?.toLowerCase().includes(q)
    );
  }, [purchases, search]);

  const pageCount = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent -mt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Walk in Customer</h1>
          <button
            onClick={() => setShowAddDialog(true)}
            className="h-12 px-5 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primarycolor/20 transition-all active:scale-[0.98]"
          >
            <Plus className="size-4" />
            Add Order
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search by order ID or customer name..."
              className="h-12 pl-12 pr-10 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md font-bold text-sm focus:border-primarycolor shadow-sm"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(0); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>
          <button onClick={() => router.refresh()} className="size-12 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 transition-all shrink-0 shadow-sm">
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {paged.length > 0 ? (
          <div className="space-y-3 pb-4">
            {paged.map((purchase, i) => {
              const itemCount = purchase.items?.length || 0;
              const dateStr = new Date(purchase.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              return (
                <motion.div
                  key={purchase.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                  layout
                >
                  <div onClick={() => setSelectedOrder(purchase)} className="bg-white rounded-3xl border-2 border-primarycolor/10 p-0 shadow-xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
                    <div className="p-5 border-b-2 border-primarycolor/10 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <User className="size-5" />
                          </div>
                          <div>
                            <p className="font-black text-sm text-primarycolor">WIC-{purchase.id}</p>
                            <p className="font-bold text-gray-800 text-sm leading-none">{purchase.name || "Anonymous"}</p>
                            <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <StatusBadge status={purchase.status} />
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                          <p className="font-bold text-sm text-slate-900 mt-0.5">{purchase.total_amount?.toLocaleString() || 0} <span className="text-[8px] text-muted-foreground">ETB</span></p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Paid</p>
                          <p className="font-bold text-sm text-emerald-600 mt-0.5">{purchase.amount_paid?.toLocaleString() || 0} <span className="text-[8px] text-muted-foreground">ETB</span></p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Date</p>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mt-0.5">
                            <Calendar className="size-3.5 text-primarycolor/70" />
                            {dateStr}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <ShoppingBag className="size-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-black text-gray-300 uppercase tracking-widest text-[10px]">
              {search ? "No orders match your search" : "No walk-in orders yet"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {pageCount > 1 && (
        <div className="sticky bottom-0 z-20 -mx-4 px-4 pb-4 pt-2 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <div className="flex items-center justify-between gap-3 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-primarycolor/5 p-2 shadow-lg">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 pl-3">
              {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="size-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] transition-all active:scale-90 disabled:opacity-20 flex items-center justify-center"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[9px] font-black text-muted-foreground/50 px-2">
                {page + 1}/{pageCount}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pageCount - 1}
                className="size-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] transition-all active:scale-90 disabled:opacity-20 flex items-center justify-center"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={(o) => !o && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          {selectedOrder && (() => {
            const o = selectedOrder;
            const dateStr = new Date(o.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            });
            const timeStr = new Date(o.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit", minute: "2-digit",
            });
            return (
              <>
                <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                      <User className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                        WIC-{o.id}
                      </DialogTitle>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{o.name || "Anonymous"}</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <StatusBadge status={o.status} />

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Order Info</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Customer</span>
                        <span className="font-bold text-right">{o.name || "Anonymous"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Date</span>
                        <span className="font-bold text-right">{dateStr} {timeStr}</span>
                      </div>
                      {o.memo && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Memo</span>
                          <span className="font-bold text-right">{o.memo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Payment</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Total Amount</span>
                        <span className="font-bold text-right">{o.total_amount?.toLocaleString() || 0} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Amount Paid</span>
                        <span className="font-bold text-emerald-600 text-right">{o.amount_paid?.toLocaleString() || 0} ETB</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Items ({o.items?.length || 0})</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {o.items?.map((item, idx) => {
                        const title = item.edition?.books?.title || `Book #${item.edition_id}`;
                        const edition = item.edition?.edition_name || `Edition #${item.edition_id}`;
                        return (
                          <div key={item.id || idx} className="flex items-center justify-between text-sm py-1.5 border-b border-primarycolor/5 last:border-0">
                            <div className="min-w-0 flex-1 mr-3">
                              <p className="font-bold text-gray-800 truncate">{title}</p>
                              <p className="text-[9px] font-bold text-muted-foreground truncate">{edition}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold">x{item.quantity}</span>
                              <span className="text-[10px] text-muted-foreground ml-1">@ {item.unit_price?.toLocaleString()} ETB</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    Close
                  </button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {showAddDialog && (
        <AddOrderDialog onClose={() => setShowAddDialog(false)} />
      )}
    </div>
  );
}

function AddOrderDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);
  const [customerName, setCustomerName] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey2>("select");
  const [bookQuery, setBookQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Record<number, SelectedBookInfo>>({});
  const [stockMap, setStockMap] = useState<Record<number, StockInfo>>({});
  const [loadingStock, setLoadingStock] = useState<Set<number>>(new Set());
  const [amountPaid, setAmountPaid] = useState("0");
  const [lockBooks, setLockBooks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInitialLoading(true);
    searchBooks("", 0, 200).then((res) => {
      if (res.success) setBooks(res.data || []);
      setInitialLoading(false);
      setTimeout(() => searchRef.current?.focus(), 350);
    });
  }, []);

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

  function calculateFifoAllocations(editions: EditionInfo[], quantity: number) {
    let remaining = quantity;
    const allocs: { editionId: number; quantity: number; unitPrice: number }[] = [];
    for (const ed of editions) {
      if (remaining <= 0) break;
      if (ed.stock <= 0) continue;
      const take = Math.min(remaining, ed.stock);
      allocs.push({ editionId: ed.id, quantity: take, unitPrice: ed.price });
      remaining -= take;
    }
    return allocs;
  }

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

  useEffect(() => {
    setAmountPaid(String(grandTotal));
  }, [grandTotal]);

  const handleSubmit = async () => {
    if (!customerName.trim()) { toast.error("Enter customer name"); return; }
    const items: { editionId: number; quantity: number; unitPrice: number }[] = [];
    for (const [id, info] of Object.entries(selectedBooks)) {
      const stock = stockMap[Number(id)];
      if (stock) {
        const allocs = calculateFifoAllocations(stock.editions, info.quantity);
        items.push(...allocs);
      }
    }
    if (items.length === 0) { toast.error("No stock available for selected books"); return; }
    setIsSubmitting(true);
    try {
      const res = await createRetailPurchase({
        name: customerName.trim(),
        amountPaid: parseFloat(amountPaid) || 0,
        lock_books: lockBooks,
        items,
      });
      if (res.success) {
        toast.success(`Order created for ${customerName.trim()}`);
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
    const idx = TAB_ORDER2.indexOf(activeTab);
    const next = idx + dir;
    if (next >= 0 && next < TAB_ORDER2.length) {
      setActiveTab(TAB_ORDER2[next]);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -SWIPE_THRESHOLD2) goTab(1);
    else if (info.offset.x > SWIPE_THRESHOLD2) goTab(-1);
  };

  const tabs = [
    { key: "select" as const, label: "Select", icon: BookMarked, badge: "" },
    { key: "selected" as const, label: "Selected", icon: ListChecks, badge: selectedCount > 0 ? String(selectedCount) : "" },
    { key: "info" as const, label: "Info", icon: Info, badge: "" },
  ];

  const availableBooks = books.filter((b: any) => b.hasStoreStock);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-full w-full h-[100dvh] max-h-[100dvh] rounded-none border-0 bg-white p-0 flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0 px-4 pt-4 pb-0 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black text-primarycolor uppercase italic text-left leading-tight">
                  New Walk-in Order
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Counter Sale</p>
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
                              variants={springItem2}
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
                <div className="p-4 space-y-5">
                  <div className="bg-primarycolor/[0.02] rounded-3xl border-2 border-primarycolor/5 p-5 space-y-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer Name</label>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name..."
                        className="h-12 rounded-2xl border-2 border-slate-100 bg-white font-bold text-sm focus:border-primarycolor transition-all"
                      />
                    </div>

                    <div className="h-px bg-slate-100" />

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

                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Grand Total</p>
                      <p className="text-xl font-black text-primarycolor tabular-nums">
                        {grandTotal.toLocaleString()} <span className="text-[10px] font-bold text-muted-foreground">ETB</span>
                      </p>
                    </div>

                    <div className="h-px bg-slate-100" />

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
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !customerName.trim() || selectedCount === 0}
                    className="w-full h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/30 gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Check className="size-5" />
                    )}
                    {isSubmitting ? "Creating Order..." : `Complete Order — ${grandTotal.toLocaleString()} ETB`}
                  </Button>
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
