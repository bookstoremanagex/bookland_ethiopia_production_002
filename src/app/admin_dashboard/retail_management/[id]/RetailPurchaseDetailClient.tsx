"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
    ShoppingBag,
    ArrowLeft,
    BookOpen,
    DollarSign,
    Calendar,
    User,
    FileText,
    CheckCircle2,
    Clock,
    Loader2,
    Store,
    MapPin,
    Sparkles,
    AlertTriangle,
    Pen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    getRetailEditionStockBreakdown,
    approveRetailPurchase,
    updateRetailPurchasePayment,
} from "@/app/actions/retail-purchase-actions";
import { checkIsAdminUser } from "@/app/actions/payment-actions";

const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    APPROVED: "bg-blue-50 text-blue-600 border-blue-200",
    PARTIALLY_PAID: "bg-purple-50 text-purple-600 border-purple-200",
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

interface StoreRow {
    storeStockId: number;
    storeId: number;
    storeName: string;
    availableQty: number;
    allocated: number;
}

interface EditionAlloc {
    editionId: number;
    editionName: string;
    price: number;
    totalRequired: number;
    stores: StoreRow[];
}

export default function RetailPurchaseDetailClient({ purchase }: { purchase: any }) {
    const router = useRouter();
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [allocations, setAllocations] = useState<EditionAlloc[]>([]);
    const [isLoadingStock, setIsLoadingStock] = useState(false);
    const [editPayment, setEditPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(purchase.amount_paid || 0);
    const [paymentStatus, setPaymentStatus] = useState(purchase.status);
    const [isSavingPayment, setIsSavingPayment] = useState(false);

    useEffect(() => {
        checkIsAdminUser().then(res => setIsAdmin(res.isAdmin));
    }, []);

    useEffect(() => {
        setPaymentAmount(purchase.amount_paid || 0);
        setPaymentStatus(purchase.status);
    }, [purchase.amount_paid, purchase.status]);

    const editionIds = useMemo(() =>
        (purchase.items || []).map((i: any) => i.edition_id),
        [purchase.items]
    );

    const loadStockBreakdown = useCallback(async () => {
        if (!isAdmin || purchase.status !== "PENDING" || editionIds.length === 0) return;
        setIsLoadingStock(true);
        const res = await getRetailEditionStockBreakdown(editionIds);
        if (res.success && res.data) {
            const mapped: EditionAlloc[] = (purchase.items || []).map((item: any) => {
                const breakdown = (res.data || []).find((b: any) => b.editionId === item.edition_id);
                return {
                    editionId: item.edition_id,
                    editionName: item.edition?.edition_name || "Unknown",
                    price: item.unit_price || 0,
                    totalRequired: item.quantity || 0,
                    stores: (breakdown?.stores || []).map((s: any) => ({
                        storeStockId: s.storeStockId,
                        storeId: s.storeId,
                        storeName: s.storeName,
                        availableQty: s.availableQty,
                        allocated: 0,
                    })),
                };
            });
            setAllocations(mapped);
        } else {
            toast.error("Failed to load stock breakdown");
        }
        setIsLoadingStock(false);
    }, [isAdmin, purchase.status, editionIds, purchase.items]);

    useEffect(() => {
        loadStockBreakdown();
    }, [loadStockBreakdown]);

    const handleStoreQtyChange = (editionIdx: number, storeIdx: number, value: number) => {
        setAllocations(prev => {
            const next = [...prev];
            const editions = { ...next[editionIdx] };
            const stores = [...editions.stores];
            stores[storeIdx] = { ...stores[storeIdx], allocated: Math.min(Math.max(0, value), stores[storeIdx].availableQty) };
            editions.stores = stores;
            next[editionIdx] = editions;
            return next;
        });
    };

    const editionAllocTotals = useMemo(() => {
        return allocations.map(a => ({
            editionId: a.editionId,
            allocated: a.stores.reduce((sum, s) => sum + s.allocated, 0),
            required: a.totalRequired,
        }));
    }, [allocations]);

    const canApprove = useMemo(() => {
        if (allocations.length === 0) return false;
        return editionAllocTotals.every(t => t.allocated === t.required);
    }, [allocations, editionAllocTotals]);

    const handleAutoFill = () => {
        setAllocations(prev => prev.map(edition => {
            let remaining = edition.totalRequired;
            const stores = edition.stores.map(s => {
                const take = Math.min(remaining, s.availableQty);
                remaining -= take;
                return { ...s, allocated: take };
            });
            return { ...edition, stores };
        }));
    };

    const handleApprove = async () => {
        if (!canApprove) {
            toast.error("All quantities must be fully allocated before approving");
            return;
        }

        setIsApproving(true);
        try {
            const flatAllocs = allocations.flatMap(a =>
                a.stores.filter(s => s.allocated > 0).map(s => ({
                    editionId: a.editionId,
                    storeStockId: s.storeStockId,
                    storeId: s.storeId,
                    quantity: s.allocated,
                    unitPrice: a.price,
                }))
            );

            const res = await approveRetailPurchase(purchase.id, flatAllocs);
            if (res.success) {
                toast.success("Purchase approved and inventory deducted from stores");
                router.refresh();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Failed to approve purchase");
        } finally {
            setIsApproving(false);
        }
    };

    const handleSavePayment = async () => {
        setIsSavingPayment(true);
        try {
            const res = await updateRetailPurchasePayment(purchase.id, {
                amount_paid: paymentAmount,
                ...(purchase.status !== "PENDING" ? { status: paymentStatus } : {}),
            });
            if (res.success) {
                toast.success("Payment updated");
                setEditPayment(false);
                router.refresh();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Failed to update payment");
        } finally {
            setIsSavingPayment(false);
        }
    };

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <Link href="/admin_dashboard/retail_management">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primarycolor transition-colors w-fit">
                    <ArrowLeft className="size-3.5" /> Back to Retail Management
                </div>
            </Link>

            {/* Hero */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-14 md:size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-inner shrink-0">
                            <ShoppingBag className="size-7 md:size-8" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight italic">
                                Purchase <span className="text-secondarycolor not-italic">#{purchase.id}</span>
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                {purchase.name || "Anonymous Customer"}
                            </p>
                        </div>
                    </div>
                    <span className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                        STATUS_STYLES[purchase.status] || "bg-slate-50 text-slate-600 border-slate-200"
                    )}>
                        {purchase.status?.replace("_", " ")}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center gap-2"><DollarSign className="size-3.5 text-primarycolor/40" /><p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total</p></div>
                        <p className="font-black text-primarycolor">{purchase.total_amount?.toLocaleString()} ETB</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-emerald-500/40" /><p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Paid</p></div>
                        <p className="font-black text-emerald-600">{purchase.amount_paid?.toLocaleString()} ETB</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center gap-2"><Calendar className="size-3.5 text-primarycolor/40" /><p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Date</p></div>
                        <p className="font-black text-primarycolor">{formatDate(new Date(purchase.date || purchase.createdAt))}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center gap-2"><User className="size-3.5 text-primarycolor/40" /><p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Customer</p></div>
                        <p className="font-black text-primarycolor">{purchase.name || "Anonymous"}</p>
                    </div>
                </div>

                {purchase.memo && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <FileText className="size-4 text-muted-foreground/40 shrink-0" />
                        <p className="font-bold text-primarycolor text-sm">{purchase.memo}</p>
                    </div>
                )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                    <BookOpen className="size-5 text-primarycolor" />
                    <h2 className="text-lg font-black uppercase tracking-tight italic text-primarycolor">
                        Purchased <span className="text-secondarycolor not-italic">Items</span>
                    </h2>
                </div>

                <div className="space-y-3">
                    {purchase.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                            <div className="flex items-center gap-3 min-w-0">
                                <BookOpen className="size-5 text-primarycolor/30 shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-black text-primarycolor text-sm truncate">{item.edition?.edition_name || "Unknown"}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground truncate">{item.edition?.books?.title}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                                <p className="font-black text-primarycolor">{item.quantity} × {item.unit_price?.toLocaleString()} ETB</p>
                                <p className="text-[10px] font-bold text-muted-foreground">= {(item.quantity * item.unit_price).toLocaleString()} ETB</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-2xl bg-primarycolor/5 border border-primarycolor/10 flex items-center justify-between">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                    <p className="text-xl font-black text-primarycolor">{purchase.total_amount?.toLocaleString()} ETB</p>
                </div>
            </div>

            {/* Payment Section */}
            {isAdmin && (
                <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DollarSign className="size-5 text-primarycolor" />
                            <h2 className="text-lg font-black uppercase tracking-tight italic text-primarycolor">
                                Payment <span className="text-secondarycolor not-italic">Details</span>
                            </h2>
                        </div>
                        {!editPayment && (
                            <Button variant="outline" size="sm" onClick={() => setEditPayment(true)}
                                className="rounded-xl border-2 border-slate-200 h-10 font-black text-[9px] uppercase tracking-widest gap-1.5">
                                <Pen className="size-3.5" /> Edit
                            </Button>
                        )}
                    </div>

                    {editPayment ? (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Paid Amount (ETB)</label>
                                <Input type="number" min={0} max={purchase.total_amount || 0}
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                                    className="h-12 rounded-xl border-2 font-bold" />
                            </div>
                            {purchase.status !== "PENDING" && (
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Status</label>
                                    <div className="flex gap-2">
                                        {(["PARTIALLY_PAID", "PAID"] as const).map((s) => (
                                            <button key={s} type="button" onClick={() => setPaymentStatus(s)}
                                                className={cn(
                                                    "flex-1 p-3 rounded-xl border-2 font-black uppercase tracking-widest text-[8px] transition-all cursor-pointer text-center",
                                                    paymentStatus === s
                                                        ? "border-primarycolor bg-primarycolor/5 text-primarycolor"
                                                        : "border-slate-100 bg-white text-muted-foreground hover:border-primarycolor/30"
                                                )}>
                                                {s === "PARTIALLY_PAID" ? "Partial" : "Paid"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => { setEditPayment(false); setPaymentAmount(purchase.amount_paid || 0); setPaymentStatus(purchase.status); }}
                                    className="flex-1 h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
                                    Cancel
                                </Button>
                                <Button onClick={handleSavePayment} disabled={isSavingPayment}
                                    className="flex-[2] h-12 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primarycolor/20 gap-2">
                                    {isSavingPayment ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                    {isSavingPayment ? "Saving..." : "Save Payment"}
                                </Button>
                            </div>
                            {purchase.status === "PENDING" && (
                                <p className="text-[8px] font-bold text-muted-foreground">Status is locked while purchase is pending. Approve first to change payment status.</p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Paid</p>
                                <p className="font-black text-emerald-600">{purchase.amount_paid?.toLocaleString()} ETB</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Remaining</p>
                                <p className="font-black text-primarycolor">{((purchase.total_amount || 0) - (purchase.amount_paid || 0)).toLocaleString()} ETB</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                                <span className={cn("inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", STATUS_STYLES[purchase.status] || "bg-slate-50 text-slate-600 border-slate-200")}>
                                    {purchase.status?.replace("_", " ")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Allocation & Approval Section */}
            {purchase.status === "PENDING" && isAdmin && (
                <div className="bg-white rounded-[2rem] border-2 border-amber-200 p-6 md:p-8 shadow-xl space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Store className="size-5 text-amber-600" />
                            <h2 className="text-lg font-black uppercase tracking-tight italic text-amber-700">
                                Store <span className="text-amber-500 not-italic">Allocation</span>
                            </h2>
                        </div>
                        <Button onClick={handleAutoFill} variant="outline" size="sm"
                            className="rounded-xl border-2 border-amber-200 h-10 font-black text-[9px] uppercase tracking-widest gap-1.5">
                            <Sparkles className="size-3.5" /> Auto-Fill All
                        </Button>
                    </div>

                    {isLoadingStock ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : allocations.length === 0 ? (
                        <p className="text-center py-8 text-[10px] font-black text-muted-foreground">
                            No store stock available for the editions in this purchase.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {allocations.map((edition, eIdx) => {
                                const allocatedTotal = editionAllocTotals[eIdx]?.allocated ?? 0;
                                const isFullyAllocated = allocatedTotal === edition.totalRequired;
                                return (
                                    <div key={edition.editionId} className="border-2 border-slate-100 rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <BookOpen className="size-4 text-primarycolor/40 shrink-0" />
                                                <p className="font-black text-primarycolor text-sm truncate">{edition.editionName}</p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-[9px] font-bold text-muted-foreground">
                                                    Required: <span className="text-primarycolor font-black">{edition.totalRequired}</span>
                                                </span>
                                                <span className={cn(
                                                    "text-[9px] font-bold px-2 py-0.5 rounded-lg",
                                                    isFullyAllocated ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                )}>
                                                    Allocated: {allocatedTotal}/{edition.totalRequired}
                                                </span>
                                            </div>
                                        </div>

                                        {edition.stores.length === 0 ? (
                                            <p className="text-[9px] font-bold text-red-500 flex items-center gap-1">
                                                <AlertTriangle className="size-3" /> No stock available in any store for this edition
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {edition.stores.map((store, sIdx) => (
                                                    <div key={store.storeStockId}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                        <MapPin className="size-4 text-muted-foreground/40 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-black text-primarycolor text-xs truncate">{store.storeName}</p>
                                                            <p className="text-[8px] font-bold text-muted-foreground">
                                                                Available: {store.availableQty}
                                                            </p>
                                                        </div>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={store.availableQty}
                                                            value={store.allocated === 0 ? "" : store.allocated}
                                                            onChange={(e) => handleStoreQtyChange(eIdx, sIdx, parseInt(e.target.value) || 0)}
                                                            className="w-20 h-10 rounded-xl border-2 font-bold text-sm text-center"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Summary */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                {editionAllocTotals.every(t => t.allocated === t.required) ? (
                                    <p className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> All editions are fully allocated and ready for approval.
                                    </p>
                                ) : (
                                    <p className="text-[10px] font-black text-amber-600 flex items-center gap-1">
                                        <AlertTriangle className="size-3.5" /> Make sure every edition's allocated total matches its required quantity.
                                    </p>
                                )}
                            </div>

                            <Button onClick={handleApprove} disabled={!canApprove || isApproving}
                                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2">
                                {isApproving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                {isApproving ? "Approving & Deducting..." : "Approve & Deduct from Stores"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
