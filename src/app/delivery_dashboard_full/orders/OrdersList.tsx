"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Calendar,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markOrderDelivered } from "@/app/actions/order-actions";

type OrderRow = {
  id: number;
  order_type: string;
  total_amount: number;
  amount_paid: number;
  status: string;
  is_approved: boolean;
  delivery: boolean;
  createdAt: string | Date;
  bookshopes: {
    id: number;
    name: string;
    location: string;
    branch: string | null;
  };
  order_items?: {
    id: number;
    bookEditionId: number;
    quantity: number;
    price_at_order: number;
    bookedition?: {
      edition_name: string;
      books: { title: string } | null;
    };
  }[];
};

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Processing: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusStyles[status] || statusStyles.PENDING;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider", s.bg, s.text)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}

function DeliveryStatus({ delivered }: { delivered: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider",
      delivered ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
    )}>
      <Clock className="size-3" />
      {delivered ? "Delivered" : "Pending"}
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

type TabKey = "all" | "pending" | "approved";

type PaymentRow = {
  id: number;
  amount: number;
  orderid: string | null;
  payment_type: string;
  createdAt: string | Date;
  shopId: number;
  status: string;
};

export default function OrdersList({ orders, payments: allPayments }: { orders: OrderRow[]; payments: PaymentRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [delivering, setDelivering] = useState(false);
  const pageSize = 15;

  const filtered = useMemo(() => {
    let result = orders;
    if (tab === "pending") result = result.filter((o) => !o.is_approved);
    else if (tab === "approved") result = result.filter((o) => o.is_approved);
    if (!search) return result;
    const q = search.toLowerCase();
    return result.filter((o) =>
      String(o.id).includes(q) ||
      o.bookshopes?.name?.toLowerCase().includes(q) ||
      o.bookshopes?.branch?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    );
  }, [orders, search, tab]);

  const pageCount = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent -mt-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search orders..."
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

      <Tabs value={tab} onValueChange={(v) => { setTab(v as TabKey); setPage(0); }} className="w-full">
        <TabsList className="w-full h-8 rounded-xl bg-slate-100/80 p-0.5 gap-0">
          <TabsTrigger value="all" className="h-full flex-1 rounded-lg text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primarycolor px-2">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending" className="h-full flex-1 rounded-lg text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600 px-2">Pending ({orders.filter((o) => !o.is_approved).length})</TabsTrigger>
          <TabsTrigger value="approved" className="h-full flex-1 rounded-lg text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 px-2">Approved ({orders.filter((o) => o.is_approved).length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="popLayout">
        {paged.length > 0 ? (
          <div className="space-y-3 pb-4">
            {paged.map((order, i) => {
              const totalBooks = order.order_items?.reduce((s, item) => s + (item.quantity || 0), 0) || 0;
              const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              return (
                <motion.div
                  key={order.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                  layout
                >
                  <div onClick={() => setSelectedOrder(order)} className="bg-white rounded-3xl border-2 border-primarycolor/10 p-0 shadow-xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
                    <div className="p-5 border-b-2 border-primarycolor/10 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <ShoppingBag className="size-5" />
                          </div>
                          <div>
                            <p className={cn("font-black text-sm", order.is_approved ? "text-emerald-600" : "text-primarycolor")}>ORD-{order.id}</p>
                            <p className="font-bold text-gray-800 text-sm leading-none">{order.bookshopes?.name || "Unknown"}</p>
                            <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{order.bookshopes?.branch || order.bookshopes?.location || ""}</p>
                          </div>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="p-5 border-b-2 border-primarycolor/10 shadow-sm">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Books</p>
                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 mt-0.5">
                            <BookOpen className="size-3.5 text-primarycolor/70" />
                            {totalBooks}
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Date</p>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mt-0.5">
                            <Calendar className="size-3.5 text-primarycolor/70" />
                            {dateStr}
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                          <p className="font-bold text-sm text-slate-900 mt-0.5">{order.total_amount?.toLocaleString() || 0} <span className="text-[8px] text-muted-foreground">ETB</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <DeliveryStatus delivered={order.delivery} />
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
              {search ? "No orders match your search" : "No orders"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={!!selectedOrder} onOpenChange={(o) => !o && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          {selectedOrder && (() => {
            const o = selectedOrder;
            const totalBooks = o.order_items?.reduce((s, item) => s + (item.quantity || 0), 0) || 0;
            const dateStr = new Date(o.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            });
            const timeStr = new Date(o.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit", minute: "2-digit",
            });
            const linkedPayments = allPayments.filter(p =>
              p.orderid != null &&
              (p.orderid === String(o.id) ||
               p.orderid === `ORD-${o.id}` ||
               p.orderid.replace(/^ORD-/i, "") === String(o.id))
            );
            const paidFromLinked = linkedPayments.reduce((sum, p) => sum + p.amount, 0);
            return (
              <>
                <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                      <ShoppingBag className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className={cn("text-base font-black uppercase italic text-left leading-tight", o.is_approved ? "text-emerald-600" : "text-primarycolor")}>
                        ORD-{o.id}
                      </DialogTitle>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{o.bookshopes?.name}</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={o.status} />
                    <DeliveryStatus delivered={o.delivery} />
                  </div>

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Order Info</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Shop</span>
                        <span className="font-bold text-right">{o.bookshopes?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Branch</span>
                        <span className="font-bold text-right">{o.bookshopes?.branch || o.bookshopes?.location || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Date</span>
                        <span className="font-bold text-right">{dateStr} {timeStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Total Books</span>
                        <span className="font-bold text-right">{totalBooks}</span>
                      </div>
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
                        <span className="font-bold text-emerald-600 text-right">{paidFromLinked.toLocaleString() || 0} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Remaining</span>
                        <span className={cn("font-bold text-right", (o.total_amount - paidFromLinked) > 0 ? "text-amber-600" : "text-emerald-600")}>
                          {(o.total_amount - paidFromLinked).toLocaleString()} ETB
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Items ({o.order_items?.length || 0})</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {o.order_items?.map((item, idx) => {
                        const title = item.bookedition?.books?.title || `Book #${item.bookEditionId}`;
                        const edition = item.bookedition?.edition_name || `Edition #${item.bookEditionId}`;
                        return (
                          <div key={item.id || idx} className="flex items-center justify-between text-sm py-1.5 border-b border-primarycolor/5 last:border-0">
                            <div className="min-w-0 flex-1 mr-3">
                              <p className="font-bold text-gray-800 truncate">{title}</p>
                              <p className="text-[9px] font-bold text-muted-foreground truncate">{edition}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold">x{item.quantity}</span>
                              <span className="text-[10px] text-muted-foreground ml-1">@ {item.price_at_order?.toLocaleString()} ETB</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!o.delivery && (
                      <button
                        onClick={async () => {
                          setDelivering(true);
                          try {
                            const res = await markOrderDelivered(o.id);
                            if (res.success) {
                              toast.success(`Order ORD-${o.id} marked as delivered`);
                              setSelectedOrder(null);
                              router.refresh();
                            } else {
                              toast.error(res.error || "Failed to mark as delivered");
                            }
                          } catch {
                            toast.error("Something went wrong");
                          } finally {
                            setDelivering(false);
                          }
                        }}
                        disabled={delivering}
                        className="flex-1 h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-sm shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {delivering ? "..." : "Mark Delivered"}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
