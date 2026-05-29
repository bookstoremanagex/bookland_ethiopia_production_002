"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ShoppingBag,
    Building2,
    CheckCircle2,
    Clock,
    Loader2,
    Info,
    Store,
    Package,
    Banknote,
    AlertTriangle,
    ChevronDown,
    MapPin,
    FileText,
    Plus,
    Sparkles,
    Layers,
    ArrowRight,
    Truck,
    Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import { toast } from "sonner";
import { getBookStockBreakdown, approveOrder, markOrderDelivered } from "@/app/actions/order-actions";
import type { AdminOrder } from "./ManageOrdersPageContent";

interface StoreOption {
    storeStockId: number;
    storeId: number;
    storeName: string;
    availableQty: number;
    type: "store" | "printer";
}

interface EditionBreakdown {
    editionId: number;
    editionName: string;
    price: number;
    stores: StoreOption[];
}

interface BookBreakdown {
    bookId: number;
    bookTitle: string;
    requestedQty: number;
    editions: EditionBreakdown[];
}

// New allocation structure: per edition, per store
interface StoreAllocQty {
    storeStockId: number;
    quantity: number;
}

interface EditionAllocEntry {
    editionId: number;
    storeAllocations: StoreAllocQty[]; // which stores get how many
}

interface BookAllocEntry {
    bookId: number;
    editions: EditionAllocEntry[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    order: AdminOrder | null;
    onApproved: (order: AdminOrder) => void;
}

export default function ManageOrderDetailsModal({ isOpen, onClose, order, onApproved }: Props) {
    const { formatDate, formatDateTime } = useCalendar();
    const [bookBreakdowns, setBookBreakdowns] = useState<BookBreakdown[]>([]);
    const [isLoadingStock, setIsLoadingStock] = useState(false);
    const [bookAllocations, setBookAllocations] = useState<BookAllocEntry[]>([]);
    const [isApproving, setIsApproving] = useState(false);
    const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
    const [isDelivering, setIsDelivering] = useState(false);

    // Group order_items by bookId → collect unique books
    const uniqueBooks = React.useMemo(() => {
        if (!order) return [];
        const map = new Map<number, { bookId: number; bookTitle: string; requestedQty: number }>();
        for (const item of order.order_items) {
            const bid = item.bookedition?.bookId;
            const title = item.bookedition?.books?.title || "Unknown";
            if (bid != null) {
                const existing = map.get(bid);
                if (existing) {
                    existing.requestedQty += item.quantity;
                } else {
                    map.set(bid, { bookId: bid, bookTitle: title, requestedQty: item.quantity });
                }
            }
        }
        return Array.from(map.values());
    }, [order]);

    // Compute the FIFO edition breakdown from the order items
    // This shows how many units the order takes from each edition per book
    const editionBreakdownPerBook = useMemo(() => {
        if (!order) return new Map<number, { editionName: string; editionId: number; quantity: number; price: number }[]>();
        const map = new Map<number, { editionName: string; editionId: number; quantity: number; price: number }[]>();
        for (const item of order.order_items) {
            const bid = item.bookedition?.bookId;
            if (bid == null) continue;
            const existing = map.get(bid) || [];
            // Check if we already have this edition
            const edEntry = existing.find(e => e.editionId === item.bookEditionId);
            if (edEntry) {
                edEntry.quantity += item.quantity;
            } else {
                existing.push({
                    editionName: item.bookedition?.edition_name || "Unknown Edition",
                    editionId: item.bookEditionId,
                    quantity: item.quantity,
                    price: item.price_at_order,
                });
            }
            map.set(bid, existing);
        }
        return map;
    }, [order]);

    const loadStockBreakdowns = useCallback(async () => {
        if (!order || order.is_approved || uniqueBooks.length === 0) return;
        setIsLoadingStock(true);
        try {
            const results: BookBreakdown[] = [];
            for (const ub of uniqueBooks) {
                const editionsInOrder = (editionBreakdownPerBook.get(ub.bookId) || []).map(e => e.editionId);
                const res = await getBookStockBreakdown(ub.bookId, editionsInOrder);
                if (res.success && res.data) {
                    results.push({ ...ub, editions: res.data as EditionBreakdown[] });
                }
            }
            setBookBreakdowns(results);
            // Initialize empty book allocations
            setBookAllocations(results.map(b => ({
                bookId: b.bookId,
                editions: b.editions.map(e => ({
                    editionId: e.editionId,
                    storeAllocations: e.stores.map(s => ({
                        storeStockId: s.storeStockId,
                        quantity: 0,
                    })),
                })),
            })));
        } finally {
            setIsLoadingStock(false);
        }
    }, [order, uniqueBooks]);

    // Auto-fill: use exact per-edition quantities from the order's FIFO breakdown
    const handleAutoFill = (bookIdx: number) => {
        const bd = bookBreakdowns[bookIdx];
        if (!bd) return;
        const edBreakdown = editionBreakdownPerBook.get(bd.bookId);
        if (!edBreakdown) return;

        const newEditions: EditionAllocEntry[] = bd.editions.map((ed) => {
            const fifo = edBreakdown.find((e: any) => e.editionId === ed.editionId);
            const need = fifo?.quantity || 0;
            let remaining = need;
            const storeAllocations: StoreAllocQty[] = ed.stores.map((store) => {
                if (remaining <= 0) return { storeStockId: store.storeStockId, quantity: 0 };
                const take = Math.min(remaining, store.availableQty);
                remaining -= take;
                return { storeStockId: store.storeStockId, quantity: take };
            });
            return { editionId: ed.editionId, storeAllocations };
        });

        setBookAllocations(prev => {
            const next = [...prev];
            next[bookIdx] = { ...next[bookIdx], editions: newEditions };
            return next;
        });
    };

    // Auto-fill all books at once
    const handleAutoFillAll = () => {
        bookBreakdowns.forEach((_, bookIdx) => handleAutoFill(bookIdx));
    };

    useEffect(() => {
        if (isOpen && order && !order.is_approved) {
            loadStockBreakdowns();
        }
        if (!isOpen) {
            setBookBreakdowns([]);
            setBookAllocations([]);
        }
    }, [isOpen, order]);

    const handlePrint = useCallback(() => {
        if (!order) return;
        const itemsHtml = order.order_items.map((item: any) => `
            <tr>
                <td>${item.bookedition?.books?.title || "Unknown"}</td>
                <td>${item.bookedition?.edition_name}</td>
                <td style="text-align:center">${item.quantity.toLocaleString()}</td>
                <td style="text-align:right">${item.price_at_order.toLocaleString()}</td>
                <td style="text-align:right">${(item.quantity * item.price_at_order).toLocaleString()}</td>
            </tr>
        `).join('');

        const printWin = window.open('', '_blank', 'width=800,height=600');
        if (!printWin) return;
        printWin.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Order ORD-${order.id} Summary</title>
<style>
  @page { size: A4 portrait; margin: 10mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 21px; color: #000; padding: 24px 36px; }
  h1 { font-size: 27px; margin-bottom: 9px; }
  .row { display: flex; justify-content: space-between; align-items: center; }
  .label { color: #666; font-size: 16.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 19.5px; margin: 9px 0; }
  th { background: #eee; padding: 6px 9px; text-align: left; font-size: 18px; font-weight: 700; border: 1px solid #bbb; }
  td { padding: 3px 9px; border: 1px solid #ddd; }
  .sep { border-top: 1.5px solid #888; margin: 6px 0; }
</style>
</head>
<body>
  <h1>ORDER SUMMARY</h1>
  <div class="row">
    <div><div class="label">Shop</div><strong>${order.bookshopes?.name || ''}</strong></div>
    <div><div class="label">Branch</div>${order.bookshopes?.branch || "Main"}</div>
    <div><div class="label">Date</div>${formatDate(new Date(order.createdAt))}</div>
  </div>
  <div class="label">Address: ${order.bookshopes?.location || ''}</div>
  <div class="sep"></div>
  <div class="row"><strong>Order ORD-${order.id}</strong><span>${order.order_type === "requested" ? "Requested" : "On Round"}</span></div>
  <table>
    <thead><tr><th>Book</th><th>Edition</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Subtotal</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <div class="sep"></div>
  <div class="row"><strong>Total</strong><strong>${order.total_amount.toLocaleString()} ETB</strong></div>
  <div class="row"><span>Paid</span><span>${order.amount_paid.toLocaleString()} ETB</span></div>
  <div class="row"><span>Remaining</span><span>${(order.total_amount - order.amount_paid).toLocaleString()} ETB</span></div>
  <div class="sep"></div>
  <div class="row"><span>Status: ${order.is_approved ? "Approved" : "Pending"}</span><span>Delivery: ${order.delivery ? "Delivered" : "Not Delivered"}</span></div>
</body>
</html>
`);
        printWin.document.close();
        printWin.focus();
        printWin.print();
    }, [order]);

    if (!order) return null;

    const remainingBalance = order.total_amount - order.amount_paid;
    const paymentPct = order.total_amount > 0 ? Math.round((order.amount_paid / order.total_amount) * 100) : 0;

    // Calculate totals per book and per edition
    const bookTotals = bookAllocations.map(ba => {
        const totalAlloc = ba.editions.reduce((edSum, ed) => {
            const edTotal = ed.storeAllocations.reduce((stSum, st) => stSum + st.quantity, 0);
            return edSum + edTotal;
        }, 0);
        return totalAlloc;
    });

    // Edition-level totals
    const editionTotals = bookAllocations.map(ba =>
        ba.editions.map(ed =>
            ed.storeAllocations.reduce((stSum, st) => stSum + st.quantity, 0)
        )
    );

    // Validation: each edition's allocated total must match its FIFO quantity exactly
    const canApprove = !order.is_approved
        && bookBreakdowns.length > 0
        && bookAllocations.length > 0
        && bookBreakdowns.every((bd, i) => {
            const edBreakdown = editionBreakdownPerBook.get(bd.bookId);
            if (!edBreakdown) return false;
            const allocated = bookTotals[i] || 0;
            if (allocated !== bd.requestedQty) return false;
            // Check each edition matches
            return bd.editions.every((ed, edIdx) => {
                const fifo = edBreakdown.find((e: any) => e.editionId === ed.editionId);
                const need = fifo?.quantity || 0;
                const have = editionTotals[i]?.[edIdx] || 0;
                return have === need;
            });
        });

    // Handle store quantity change
    const handleStoreQtyChange = (bookIdx: number, editionIdx: number, storeIdx: number, qty: number) => {
        setBookAllocations(prev => {
            const next = [...prev];
            const newBookAlloc = { ...next[bookIdx] };
            const newEditions = [...newBookAlloc.editions];
            const newEdition = { ...newEditions[editionIdx] };
            const newStoreAllocs = [...newEdition.storeAllocations];
            newStoreAllocs[storeIdx] = { ...newStoreAllocs[storeIdx], quantity: Math.max(0, qty) };
            newEdition.storeAllocations = newStoreAllocs;
            newEditions[editionIdx] = newEdition;
            newBookAlloc.editions = newEditions;
            next[bookIdx] = newBookAlloc;
            return next;
        });
    };

    const handleApprove = async () => {
        if (!canApprove) return;
        setIsApproving(true);
        try {
            // Build allocation summary text
            const summaryLines: string[] = [];
            // Build flat allocations and summary simultaneously
            const flatAllocations: any[] = [];
            for (let i = 0; i < bookAllocations.length; i++) {
                const ba = bookAllocations[i];
                const bd = bookBreakdowns[i];
                const bookLines: string[] = [];
                for (const ed of ba.editions) {
                    const editionData = bd.editions.find(e => e.editionId === ed.editionId);
                    if (!editionData) continue;
                    const storeLines: string[] = [];
                    for (const st of ed.storeAllocations) {
                        if (st.quantity > 0) {
                            const storeData = editionData.stores.find(s => s.storeStockId === st.storeStockId);
                            if (storeData) {
                                flatAllocations.push({
                                    bookEditionId: ed.editionId,
                                    storeId: storeData.storeId,
                                    storeStockId: st.storeStockId,
                                    quantity: st.quantity,
                                    price: editionData.price,
                                    type: storeData.type,
                                });
                                storeLines.push(`  • ${editionData.editionName}: ${st.quantity} units → ${storeData.storeName}`);
                            }
                        }
                    }
                    if (storeLines.length > 0) {
                        bookLines.push(...storeLines);
                    }
                }
                if (bookLines.length > 0) {
                    summaryLines.push(`📖 "${bd.bookTitle}"`);
                    summaryLines.push(...bookLines);
                    summaryLines.push('');
                }
            }
            const allocationSummary = summaryLines.join('\n').trim();

            const res = await approveOrder(order.id, flatAllocations, allocationSummary);
            if (res.success) {
                toast.success("Order approved and stock allocated successfully!");
                onApproved(order);
            } else {
                toast.error(res.error || "Failed to approve order");
            }
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className="sm:max-w-5xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-[#F8FAFC] p-0 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
                {/* Header */}
                <DialogHeader className="bg-white p-8 pb-6 border-b border-slate-100 shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                                <ShoppingBag className="size-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl md:text-3xl font-black text-primarycolor uppercase italic">
                                    Order <span className="text-secondarycolor not-italic">#ORD-{order.id}</span>
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {order.is_approved ? "View complete order information" : "Review & allocate stock to approve this order"}
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {order.is_approved ? (
                                <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5" /> Approved
                                </div>
                            ) : (
                                <div className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                                    <Clock className="size-3.5" /> Pending Approval
                                </div>
                            )}
                            <div className={cn(
                                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                                order.order_type === "requested" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                            )}>
                                {order.order_type}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {order.memo && (
                    <div className="bg-white px-8 py-4 border-b border-slate-100 shrink-0 flex items-start gap-3">
                        <FileText className="size-5 text-primarycolor mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[9px] font-black text-primarycolor uppercase tracking-widest mb-0.5">Memo</p>
                            <p className="text-sm font-medium text-slate-600 italic">&ldquo;{order.memo}&rdquo;</p>
                        </div>
                    </div>
                )}

                {order.payment_type === "CHECK" && order.checks && (
                    <div className="bg-white px-8 py-4 border-b border-slate-100 shrink-0 flex items-start gap-3">
                        <FileText className="size-5 text-primarycolor mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-primarycolor uppercase tracking-widest mb-0.5">Check Payment</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                                <span className="font-bold text-slate-700">{order.checks.bankname || "Unknown Bank"}</span>
                                <span className="text-muted-foreground">— {order.checks.username || "Unknown"}</span>
                                <span className="text-muted-foreground">| {order.checks.amount ? `${order.checks.amount} ETB` : "—"}</span>
                                <span className={cn(
                                    "font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full",
                                    order.checks.status === "CLEARED" ? "bg-emerald-100 text-emerald-700" :
                                    order.checks.status === "BOUNCED" ? "bg-rose-100 text-rose-700" :
                                    "bg-amber-100 text-amber-700"
                                )}>
                                    {order.checks.status || "PENDING"}
                                </span>
                                <a href={`/admin_dashboard/checks/${order.check_id}`} target="_blank" rel="noopener noreferrer"
                                    className="text-primarycolor underline underline-offset-2 font-bold text-xs hover:text-secondarycolor">
                                    View Check Details
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                    {/* Financials */}
                    <div className="bg-white rounded-xl md:rounded-[1.5rem] p-3 md:p-4 border-2 border-primarycolor/5 shadow-sm space-y-2 md:space-y-3">
                        <div className="flex items-center gap-1.5 text-primarycolor">
                            <Banknote className="size-3 md:size-3.5" />
                            <h4 className="font-black uppercase tracking-widest text-[9px] md:text-[10px] italic">Financial Summary</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                            <div className="p-2 md:p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Order Total</p>
                                <p className="text-sm md:text-base font-black text-primarycolor mt-0.5">
                                    {order.total_amount.toLocaleString()} <span className="text-[8px] md:text-[9px]">ETB</span>
                                </p>
                            </div>
                            <div className="p-2 md:p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                                <p className="text-[7px] md:text-[8px] font-black text-emerald-700 uppercase tracking-widest">Paid Upfront</p>
                                <p className="text-sm md:text-base font-black text-emerald-800 mt-0.5">
                                    {order.amount_paid.toLocaleString()} <span className="text-[8px] md:text-[9px]">ETB</span>
                                </p>
                            </div>
                            <div className="p-2 md:p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
                                <p className="text-[7px] md:text-[8px] font-black text-rose-700 uppercase tracking-widest">Outstanding</p>
                                <p className="text-sm md:text-base font-black text-rose-800 mt-0.5">
                                    {remainingBalance.toLocaleString()} <span className="text-[8px] md:text-[9px]">ETB</span>
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                <span>Payment coverage</span>
                                <span>{paymentPct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-700", paymentPct >= 100 ? "bg-emerald-500" : "bg-primarycolor")}
                                    style={{ width: `${paymentPct}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── APPROVED: Items list + allocation breakdown ── */}
                    {order.is_approved && (
                        <>
                            <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 text-primarycolor">
                                    <Package className="size-4" />
                                    <h4 className="font-black uppercase tracking-widest text-xs italic">Ordered Items</h4>
                                </div>
                                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60">Book & Edition</th>
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60 text-center">Qty</th>
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60 text-right">Unit Price</th>
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.order_items.map((item, i) => (
                                                <tr key={item.id || i} className="border-b border-slate-50 hover:bg-slate-50/50 h-14">
                                                    <td className="p-4">
                                                        <p className="font-black text-primarycolor uppercase italic text-sm leading-tight">
                                                            {item.bookedition?.books?.title || "Unknown"}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {item.bookedition?.edition_name}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 text-center font-bold text-slate-700">{item.quantity.toLocaleString()}</td>
                                                    <td className="p-4 text-right font-bold text-slate-600">{item.price_at_order.toLocaleString()} ETB</td>
                                                    <td className="p-4 text-right font-black text-primarycolor">{(item.quantity * item.price_at_order).toLocaleString()} ETB</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Allocation breakdown */}
                            {order.allocation_summary && (
                                <div className="bg-white rounded-[2rem] p-6 border-2 border-emerald-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-700">
                                        <Truck className="size-4" />
                                        <h4 className="font-black uppercase tracking-widest text-xs italic">Store Allocation Breakdown</h4>
                                    </div>
                                    <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                                        {order.allocation_summary.split('\n').map((line: string, i: number) => {
                                            if (line.startsWith('📖')) {
                                                return (
                                                    <p key={i} className="font-black text-primarycolor text-sm uppercase italic mt-3 first:mt-0 mb-1">
                                                        {line.replace('📖 ', '')}
                                                    </p>
                                                );
                                            }
                                            if (line.trim() === '') return null;
                                            return (
                                                <p key={i} className="text-[11px] font-bold text-slate-700 ml-4 py-0.5">
                                                    {line}
                                                </p>
                                            );
                                        })}
                                    </div>

                                    {/* Delivery action */}
                                    <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
                                        <div className="flex items-center gap-2">
                                            {order.delivery ? (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700">
                                                    <CheckCircle2 className="size-4" />
                                                    <span className="font-black uppercase tracking-widest text-[10px]">Delivered</span>
                                                </div>
                                            ) : (
                                                <AlertDialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-xl h-10 px-5 gap-2 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-black uppercase tracking-widest text-[9px]"
                                                            disabled={isDelivering}
                                                        >
                                                            <Truck className="size-3.5" />
                                                            {isDelivering ? "Processing..." : "Mark as Delivered"}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[2rem] border-4 border-emerald-100">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="font-black uppercase tracking-widest text-primarycolor">
                                                                Confirm Delivery
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="font-bold text-muted-foreground">
                                                                Mark order <span className="font-black text-primarycolor">ORD-{order.id}</span> as delivered?
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel asChild>
                                                                <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px]">
                                                                    Cancel
                                                                </Button>
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction asChild>
                                                                <Button
                                                                    onClick={async () => {
                                                                        setIsDelivering(true);
                                                                        try {
                                                                            const res = await markOrderDelivered(order.id);
                                                                            if (res.success) {
                                                                                toast.success("Order marked as delivered!");
                                                                                setDeliveryDialogOpen(false);
                                                                                onApproved(order);
                                                                            } else {
                                                                                toast.error(res.error || "Failed to mark as delivered");
                                                                            }
                                                                        } catch {
                                                                            toast.error("Failed to mark as delivered");
                                                                        } finally {
                                                                            setIsDelivering(false);
                                                                        }
                                                                    }}
                                                                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-[10px]"
                                                                    disabled={isDelivering}
                                                                >
                                                                    {isDelivering ? "Processing..." : "Confirm Delivery"}
                                                                </Button>
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── PENDING: Edition Breakdown (FIFO Info) ── */}
                    {!order.is_approved && editionBreakdownPerBook.size > 0 && (
                        <div className="bg-white rounded-[2rem] p-6 border-2 border-blue-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <Layers className="size-4" />
                                <h4 className="font-black uppercase tracking-widest text-xs italic">Edition Breakdown (FIFO)</h4>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold">
                                Shows how many units the order takes from each edition, starting from the earliest.
                            </p>
                            <div className="space-y-4">
                                {uniqueBooks.map(ub => {
                                    const editions = editionBreakdownPerBook.get(ub.bookId) || [];
                                    return (
                                        <div key={ub.bookId} className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 space-y-3">
                                            <p className="font-black text-primarycolor uppercase italic text-sm">{ub.bookTitle}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {editions.map((ed, idx) => (
                                                    <div key={ed.editionId} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm">
                                                        <div className="size-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-700">{ed.editionName}</p>
                                                            <p className="text-[9px] font-bold text-muted-foreground">
                                                                {ed.quantity} units × {ed.price.toLocaleString()} ETB = <span className="text-blue-700 font-black">{(ed.quantity * ed.price).toLocaleString()} ETB</span>
                                                            </p>
                                                        </div>
                                                        {idx < editions.length - 1 && (
                                                            <ArrowRight className="size-3.5 text-blue-300 ml-1" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── PENDING: Stock Allocation UI ── */}
                    {!order.is_approved && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primarycolor">
                                    <Store className="size-4" />
                                    <h4 className="font-black uppercase tracking-widest text-xs italic">Stock Allocation by Edition & Store</h4>
                                </div>
                                {bookBreakdowns.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAutoFillAll}
                                        className="rounded-xl h-9 px-4 gap-2 border-2 border-primarycolor/20 text-primarycolor hover:bg-primarycolor/5 font-black uppercase tracking-widest text-[9px]"
                                    >
                                        <Sparkles className="size-3.5" /> Auto-Fill All
                                    </Button>
                                )}
                            </div>

                            {isLoadingStock ? (
                                <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                                    <Loader2 className="size-6 animate-spin text-primarycolor" />
                                    <span className="font-bold text-sm">Loading stock availability...</span>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {bookBreakdowns.map((bd, bookIdx) => {
                                        const ba = bookAllocations[bookIdx];
                                        const allocatedTotal = bookTotals[bookIdx] || 0;
                                        const isBookValid = allocatedTotal === bd.requestedQty;

                                        return (
                                            <div
                                                key={bd.bookId}
                                                className={cn(
                                                    "bg-white rounded-[2rem] p-6 border-2 shadow-sm space-y-5 transition-colors",
                                                    isBookValid ? "border-emerald-100" : "border-amber-100"
                                                )}
                                            >
                                                {/* Book header */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h5 className="font-black text-primarycolor uppercase italic text-base">{bd.bookTitle}</h5>
                                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                Requested: <span className="text-primarycolor font-black text-sm">{bd.requestedQty}</span> units
                                                            </p>
                                                            <span className="text-[9px] text-muted-foreground">•</span>
                                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                Allocated: <span className={cn("font-black text-sm", isBookValid ? "text-emerald-600" : "text-amber-600")}>{allocatedTotal}</span> units
                                                            </p>
                                                        </div>
                                                        {/* Per-edition FIFO hint */}
                                                        {(() => {
                                                            const edBreakdown = editionBreakdownPerBook.get(bd.bookId);
                                                            if (!edBreakdown || edBreakdown.length === 0) return null;
                                                            return (
                                                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">FIFO:</span>
                                                                    {edBreakdown.map((ed, idx) => (
                                                                        <span key={ed.editionId} className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                                                            {ed.quantity}× {ed.editionName}{idx < edBreakdown.length - 1 ? '' : ''}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleAutoFill(bookIdx)}
                                                            className="rounded-lg h-8 px-3 gap-1.5 text-primarycolor hover:bg-primarycolor/5 font-black uppercase tracking-widest text-[8px]"
                                                        >
                                                            <Sparkles className="size-3" /> Auto-Fill
                                                        </Button>
                                                        {isBookValid ? (
                                                            <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                                <CheckCircle2 className="size-3" /> Complete
                                                            </div>
                                                        ) : (
                                                            <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                                <AlertTriangle className="size-3" /> {bd.requestedQty - allocatedTotal} remaining
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Editions grid */}
                                                {bd.editions.length === 0 ? (
                                                    <p className="text-[10px] text-muted-foreground italic p-4 bg-slate-50 rounded-xl text-center">No stock available for this book</p>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {ba && ba.editions.map((edAlloc, edIdx) => {
                                                            const editionData = bd.editions[edIdx];
                                                            if (!editionData) return null;
                                                            const editionTotal = edAlloc.storeAllocations.reduce((s, st) => s + st.quantity, 0);

                                                            const edBreakdown = editionBreakdownPerBook.get(bd.bookId);
                                                            const fifo = edBreakdown?.find((e: any) => e.editionId === editionData.editionId);
                                                            const requiredQty = fifo?.quantity || 0;
                                                            const isEditionValid = editionTotal === requiredQty;

                                                            return (
                                                                <div key={editionData.editionId} className={cn(
                                                                    "bg-slate-50 rounded-2xl p-5 border space-y-3",
                                                                    isEditionValid ? "border-emerald-100" : "border-amber-100"
                                                                )}>
                                                                    {/* Edition header */}
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <div>
                                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Edition</p>
                                                                            <p className="font-black text-slate-700 text-sm mt-0.5">{editionData.editionName}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Price per Unit</p>
                                                                            <p className="font-black text-primarycolor text-sm mt-0.5">{editionData.price.toLocaleString()} ETB</p>
                                                                        </div>
                                                                        <div className={cn(
                                                                            "text-right px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-0.5",
                                                                            isEditionValid ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                                        )}>
                                                                            <span>{editionTotal}</span>
                                                                            <span className="text-muted-foreground mx-0.5">/</span>
                                                                            <span>{requiredQty}</span>
                                                                            <span className="ml-1">required</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Store allocation inputs */}
                                                                    <div className="space-y-2">
                                                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Select stores and quantities</p>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                            {editionData.stores.map((store, stIdx) => {
                                                                                const storeAlloc = edAlloc.storeAllocations[stIdx];
                                                                                const currentQty = storeAlloc?.quantity || 0;
                                                                                const isValid = currentQty <= store.availableQty;

                                                                                return (
                                                                                    <div
                                                                                        key={store.storeStockId}
                                                                                        className={cn(
                                                                                            "border-2 rounded-xl p-3 space-y-2 transition-colors",
                                                                                            currentQty > 0
                                                                                                ? isValid ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
                                                                                                : "border-slate-100 bg-white"
                                                                                        )}
                                                                                    >
                                                                                        <div className="flex items-center justify-between gap-2">
                                                                                    <div>
                                                                                        <p className="font-black text-slate-700 text-xs uppercase">{store.storeName}</p>
                                                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                                                            {store.type === "printer" && (
                                                                                                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[7px] font-black uppercase tracking-widest">Printer</span>
                                                                                            )}
                                                                                            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">
                                                                                                Available: {store.availableQty}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                        </div>
                                                                                        <Input
                                                                                            type="number"
                                                                                            min={0}
                                                                                            max={store.availableQty}
                                                                                            value={currentQty}
                                                                                            onChange={e => handleStoreQtyChange(
                                                                                                bookIdx,
                                                                                                edIdx,
                                                                                                stIdx,
                                                                                                parseInt(e.target.value) || 0
                                                                                            )}
                                                                                            placeholder="0"
                                                                                            className={cn(
                                                                                                "h-10 text-center rounded-lg font-bold border-2 text-sm",
                                                                                                currentQty > 0
                                                                                                    ? isValid ? "border-emerald-300 focus:border-emerald-500" : "border-rose-300 focus:border-rose-500"
                                                                                                    : "border-slate-100 focus:border-primarycolor"
                                                                                            )}
                                                                                        />
                                                                                        {currentQty > 0 && (
                                                                                            <div className="text-[9px] font-bold text-slate-600 text-center">
                                                                                                Subtotal: {(currentQty * editionData.price).toLocaleString()} ETB
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Validation hint */}
                            {!isLoadingStock && !canApprove && bookBreakdowns.length > 0 && (
                                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                                    <AlertTriangle className="size-5 text-amber-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                                            Allocation amounts must match requested quantities
                                        </p>
                                        <div className="text-[9px] text-amber-700 mt-1 space-y-0.5">
                                            {bookBreakdowns.map((bd, i) => (
                                                bookTotals[i] !== bd.requestedQty && (
                                                    <p key={bd.bookId}>• {bd.bookTitle}: {bd.requestedQty - (bookTotals[i] || 0)} more needed</p>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Shop + Meta Info Row (at bottom) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Shop Info */}
                        <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-sm space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-32 bg-primarycolor/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <div className="flex items-center gap-2 text-primarycolor relative">
                                <Building2 className="size-4" />
                                <h4 className="font-black uppercase tracking-widest text-xs italic">Shop Information</h4>
                            </div>
                            <div className="space-y-3 relative">
                                <p className="font-black text-primarycolor text-lg uppercase">{order.bookshopes?.name}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Branch</p>
                                        <p className="font-bold text-slate-700 text-sm">{order.bookshopes?.branch || "Main"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Phone</p>
                                        <p className="font-bold text-slate-700 text-sm">{order.bookshopes?.phone || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="size-3.5 shrink-0" />
                                    <p className="font-bold text-slate-600 text-sm truncate">{order.bookshopes?.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Meta */}
                        <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-primarycolor">
                                <Info className="size-4" />
                                <h4 className="font-black uppercase tracking-widest text-xs italic">Order Metadata</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Order ID</p>
                                    <p className="font-black text-primarycolor">ORD-{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Date Placed</p>
                                    <p className="font-bold text-slate-700 text-sm">{formatDateTime(new Date(order.createdAt))}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="bg-white p-6 border-t border-slate-100 shrink-0 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] border-2"
                        >
                            {order.is_approved ? "Close" : "Cancel"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="rounded-2xl h-12 px-5 font-black uppercase tracking-widest text-[10px] border-2 gap-2"
                        >
                            <Printer className="size-4" /> Print
                        </Button>
                    </div>
                    {!order.is_approved && (
                        <Button
                            onClick={handleApprove}
                            disabled={!canApprove || isApproving}
                            className={cn(
                                "rounded-2xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-xl gap-2",
                                canApprove
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            {isApproving ? (
                                <><Loader2 className="size-4 animate-spin" /> Approving...</>
                            ) : (
                                <><CheckCircle2 className="size-4" /> Approve Order</>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
