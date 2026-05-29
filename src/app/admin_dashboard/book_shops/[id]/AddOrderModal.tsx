"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, ShoppingBag, AlertCircle, CheckCircle2, Info, ListChecks, BookMarked, Banknote, Building2, Tag, DollarSign, Calendar, FileText, Upload, Image, X, User } from 'lucide-react';
import { searchBooks } from '@/app/actions/transfer-actions';
import { getBookStockData, createOrder, getShopRemainingBalance } from '@/app/actions/order-actions';
import { getChecks, createCheck, uploadCheckImageAction } from '@/app/actions/check-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopId: number;
    shopName: string;
}

export default function AddOrderModal({ isOpen, onClose, shopId, shopName }: AddOrderModalProps) {
    const [activeTab, setActiveTab] = useState<"select" | "selected" | "info">("select");
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState<any[] | undefined>(undefined);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [stockMap, setStockMap] = useState<Record<number, any>>({});
    const [loadingStock, setLoadingStock] = useState<Set<number>>(new Set());
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    const selectableBooks = useMemo(() =>
        (books || []).filter((b: any) => b.hasStoreStock),
        [books]
    );

    const [shopBalance, setShopBalance] = useState<number | null>(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    const [orderType, setOrderType] = useState("requested");
    const [memo, setMemo] = useState("");
    const [amountPaid, setAmountPaid] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Payment method state
    const [paymentType, setPaymentType] = useState<"DIRECT" | "CHECK">("DIRECT");
    const [checkOption, setCheckOption] = useState<"new" | "existing">("new");
    const [selectedCheckId, setSelectedCheckId] = useState<number | null>(null);
    const [selectedCheckLabel, setSelectedCheckLabel] = useState("");
    const [checkFormData, setCheckFormData] = useState({
        username: "",
        bankname: "",
        type: "PAYMENT",
        amount: "",
        recordeddate: "",
        memo: "",
    });
    const [checkImageFile, setCheckImageFile] = useState<File | null>(null);
    const [checkImagePreview, setCheckImagePreview] = useState<string>("");

    // Existing checks state
    const [existingChecks, setExistingChecks] = useState<any[]>([]);
    const [existingChecksLoading, setExistingChecksLoading] = useState(false);
    const [showCheckSelector, setShowCheckSelector] = useState(false);

    useEffect(() => {
        if (isOpen && shopId) {
            setIsLoadingBalance(true);
            getShopRemainingBalance(shopId).then(res => {
                if (res.success) setShopBalance(res.remaining ?? null);
                setIsLoadingBalance(false);
            });
            resetForm();
        }
    }, [isOpen, shopId]);

    const resetForm = () => {
        setActiveTab("select");
        setSearchQuery("");
        setSelectedIds(new Set());
        setStockMap({});
        setQuantities({});
        setSelectedCheckId(null);
        setSelectedCheckLabel("");
        setCheckFormData({ username: "", bankname: "", type: "PAYMENT", amount: "", recordeddate: "", memo: "" });
        setCheckImageFile(null);
        setCheckImagePreview("");
        setPaymentType("DIRECT");
        setCheckOption("new");
    };

    // Fetch immediately on open, debounce when user types
    useEffect(() => {
        if (isOpen) {
            setIsLoadingBooks(true);
            fetchBooks();
        } else {
            setBooks(undefined);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && searchQuery) {
            setIsLoadingBooks(true);
            const timer = setTimeout(() => fetchBooks(), 300);
            return () => clearTimeout(timer);
        }
    }, [searchQuery]);

    const fetchBooks = async () => {
        const res = await searchBooks(searchQuery, 0, 500);
        if (res.success) setBooks(res.data || []);
        setIsLoadingBooks(false);
    };

    const selectedBooks = useMemo(() =>
        (books || []).filter(b => selectedIds.has(b.id)),
        [books, selectedIds]
    );

    const toggleBook = useCallback(async (book: any) => {
        if (selectedIds.has(book.id)) {
            setSelectedIds(prev => { const next = new Set(prev); next.delete(book.id); return next; });
            setQuantities(prev => { const next = { ...prev }; delete next[book.id]; return next; });
            return;
        }
        if (!stockMap[book.id]) {
            setLoadingStock(prev => new Set(prev).add(book.id));
            const res = await getBookStockData(book.id);
            setLoadingStock(prev => { const next = new Set(prev); next.delete(book.id); return next; });
            if (!res.success) { toast.error("Failed to fetch stock"); return; }
            const editions = res.data;
            const totalStock = editions.reduce((acc: number, e: any) => acc + e.stock, 0);
            if (totalStock <= 0) { toast.error("No stock available"); return; }
            setStockMap(prev => ({ ...prev, [book.id]: { editions, maxStock: totalStock } }));
        }
        setSelectedIds(prev => new Set(prev).add(book.id));
        setQuantities(prev => ({ ...prev, [book.id]: 0 }));
    }, [selectedIds, stockMap]);

    const selectedWithStock = useMemo(() =>
        (books || []).filter(b => selectedIds.has(b.id) && stockMap[b.id]),
        [books, selectedIds, stockMap]
    );

    const updateQty = (bookId: number, qty: number) => {
        const max = stockMap[bookId]?.maxStock ?? Infinity;
        setQuantities(prev => ({ ...prev, [bookId]: Math.min(qty, max) }));
    };

    const hasExceeded = useMemo(() => {
        for (const id of selectedIds) {
            const q = quantities[id] ?? 0;
            const max = stockMap[id]?.maxStock ?? 0;
            if (q > max) return { bookId: id, max };
        }
        return null;
    }, [selectedIds, quantities, stockMap]);

    const calculateAllocation = useCallback((item: any) => {
        const stock = stockMap[item.id];
        if (!stock) return { allocation: [], totalVal: 0 };
        let remaining = quantities[item.id] ?? 0;
        let totalVal = 0;
        const allocation: any[] = [];
        for (const ed of stock.editions) {
            if (remaining <= 0) break;
            if (ed.stock <= 0) continue;
            const take = Math.min(remaining, ed.stock);
            allocation.push({ ...ed, taken: take });
            totalVal += take * ed.price;
            remaining -= take;
        }
        return { allocation, totalVal };
    }, [stockMap, quantities]);

    const grandTotal = useMemo(() =>
        (books || []).filter(b => selectedIds.has(b.id)).reduce((acc, item) => {
            const s = stockMap[item.id];
            if (!s) return acc;
            let rem = quantities[item.id] ?? 0;
            let val = 0;
            for (const ed of s.editions) {
                if (rem <= 0) break;
                if (ed.stock <= 0) continue;
                const take = Math.min(rem, ed.stock);
                val += take * ed.price;
                rem -= take;
            }
            return acc + val;
        }, 0),
        [books, selectedIds, stockMap, quantities]
    );

    const loadExistingChecks = async () => {
        setExistingChecksLoading(true);
        const res = await getChecks();
        if (res.success) setExistingChecks(res.data || []);
        setExistingChecksLoading(false);
    };

    const openCheckSelector = () => {
        loadExistingChecks();
        setShowCheckSelector(true);
    };

    const handleCheckImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCheckImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setCheckImagePreview(ev.target?.result as string || "");
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (selectedWithStock.length === 0) { toast.error("No books selected"); return; }
        if (hasExceeded) { toast.error(`Quantity exceeds max for this book`); return; }
        const hasZero = Object.values(quantities).some(q => q <= 0);
        if (hasZero) { toast.error("Enter quantities for all books"); return; }
        if (paymentType === "CHECK" && checkOption === "new") {
            if (!checkFormData.username || !checkFormData.bankname) {
                toast.error("Username and Bank Name are required for check payment");
                return;
            }
        }
        if (paymentType === "CHECK" && checkOption === "existing" && !selectedCheckId) {
            toast.error("Please select an existing check");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalCheckId: number | null = selectedCheckId;

            // If new check, create it first (and upload image if any)
            if (paymentType === "CHECK" && checkOption === "new") {
                let imageUrl = "";
                if (checkImageFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append("file", checkImageFile);
                    const uploadRes = await uploadCheckImageAction(uploadFormData);
                    if (uploadRes.success && uploadRes.url) {
                        imageUrl = uploadRes.url;
                    }
                }
                const checkRes = await createCheck({
                    ...checkFormData,
                    imageUrl,
                });
                if (!checkRes.success) {
                    toast.error(checkRes.error || "Failed to create check");
                    setIsSubmitting(false);
                    return;
                }
                finalCheckId = checkRes.data.id;
            }

            const res = await createOrder({
                bookShopId: shopId,
                order_type: orderType,
                memo,
                amount_paid: amountPaid,
                payment_type: paymentType,
                check_id: finalCheckId,
                items: selectedWithStock.map(item => ({ bookId: item.id, quantity: quantities[item.id] ?? 0 }))
            });
            if (res.success) {
                toast.success("Order created successfully!");
                onClose();
                resetForm();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepTwoBooks = (books || []).filter(b => selectedIds.has(b.id) && stockMap[b.id]);

    const tabMeta = [
        { key: "select" as const, label: "Select", icon: BookMarked },
        { key: "selected" as const, label: `Selected${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`, icon: ListChecks },
        { key: "info" as const, label: "Info", icon: Info },
    ];

    return (
        <>
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-4xl w-[95vw] rounded-xl md:rounded-[2.5rem] border-2 md:border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[90vh]">
                <DialogHeader className="p-4 md:p-8 pb-3 md:pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="size-9 md:size-12 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <ShoppingBag className="size-4 md:size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-sm md:text-2xl font-black text-primarycolor uppercase italic truncate">
                                New Order <span className="text-secondarycolor not-italic">for {shopName}</span>
                            </DialogTitle>
                            <DialogDescription className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                                {activeTab === "select" ? "Browse and mark books in stock" :
                                 activeTab === "selected" ? "Set quantities and finalize order" :
                                 "Shop account details"}
                            </DialogDescription>
                        </div>
                        {activeTab === "selected" && selectedIds.size > 0 && (
                            <div className="text-right shrink-0">
                                <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Payment</p>
                                <p className="text-base md:text-3xl font-black text-primarycolor tabular-nums">{grandTotal.toLocaleString()} <span className="text-[10px] md:text-sm font-bold text-muted-foreground">ETB</span></p>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                {/* Tab Bar */}
                <div className="flex shrink-0 border-b border-slate-100 px-4 md:px-8">
                    {tabMeta.map((tab) => {
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2.5 md:py-4 font-black uppercase tracking-widest text-[8px] md:text-[10px] border-b-2 transition-all cursor-pointer shrink-0",
                                    active
                                        ? "text-primarycolor border-primarycolor"
                                        : "text-muted-foreground/50 border-transparent hover:text-muted-foreground hover:border-muted-foreground/20"
                                )}
                            >
                                <tab.icon className="size-3 md:size-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                    <div className="flex-1" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-4 space-y-4 md:space-y-6 custom-scrollbar">
                    {activeTab === "select" && (
                        <div className="space-y-3 md:space-y-4">
                            {/* Search */}
                            <div className="relative group">
                                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                                <Input
                                    placeholder="Search by title, author, or ISBN..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 md:pl-12 h-10 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-sm md:text-base"
                                />
                            </div>

                            {/* Book List with Checkboxes (in-stock only) */}
                            <div className="space-y-1.5 md:space-y-2 max-h-[360px] md:max-h-[400px] overflow-y-auto pr-1">
                                {!books && (
                                    <div className="flex items-center justify-center gap-2 py-10 md:py-16 text-muted-foreground font-bold">
                                        <Loader2 className="size-4 animate-spin" /> Loading books...
                                    </div>
                                )}
                                {books && selectableBooks.length === 0 && (
                                    <div className="text-center py-10 md:py-16 text-muted-foreground font-bold text-sm">
                                        {searchQuery ? "No books match your search" : "No books with stock in stores"}
                                    </div>
                                )}
                                {books && selectableBooks.map((book) => {
                                    const checked = selectedIds.has(book.id);
                                    const loading = loadingStock.has(book.id);
                                    const stockInfo = stockMap[book.id];
                                    return (
                                        <label
                                            key={book.id}
                                            className={cn(
                                                "flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer",
                                                checked ? "border-primarycolor bg-primarycolor/5" : "border-slate-100 hover:border-primarycolor/30 bg-white"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleBook(book)}
                                                disabled={loading}
                                                className="size-4 md:size-5 accent-primarycolor rounded shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-black text-primarycolor text-xs md:text-sm truncate">{book.title}</div>
                                                <div className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{book.author || "Unknown Author"}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                {loading ? (
                                                    <Loader2 className="size-3 md:size-4 animate-spin text-primarycolor" />
                                                ) : stockInfo ? (
                                                    <span className={cn(
                                                        "text-[8px] md:text-[10px] font-black uppercase tracking-widest",
                                                        stockInfo.maxStock > 0 ? "text-emerald-600" : "text-rose-500"
                                                    )}>
                                                        {stockInfo.maxStock.toLocaleString()} avail.
                                                    </span>
                                                ) : (
                                                    <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground">Check stock</span>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>

                            {selectedIds.size > 0 && (
                                <div className="text-center text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primarycolor bg-primarycolor/5 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                                    {selectedIds.size} book{selectedIds.size > 1 ? "s" : ""} selected
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "selected" && (
                        <div className="space-y-4 md:space-y-6">
                            {selectedIds.size === 0 ? (
                                <div className="text-center py-10 md:py-16 text-muted-foreground font-bold text-sm">
                                    No books selected. Go to the Select tab to mark books.
                                </div>
                            ) : (
                                <>
                                    {/* Selected Books with quantity */}
                                    <div className="space-y-3 md:space-y-4">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assign Quantities</p>
                                        {stepTwoBooks.map((book) => {
                                            const stock = stockMap[book.id];
                                            const qty = quantities[book.id] ?? 0;
                                            const max = stock?.maxStock ?? 0;
                                            const exceed = qty > max;
                                            const { allocation, totalVal } = calculateAllocation(book);
                                            return (
                                                <div key={book.id} className="p-3 md:p-5 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-white hover:border-primarycolor/20 transition-all shadow-sm">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4">
                                                        <div className="min-w-0">
                                                            <p className="font-black text-primarycolor text-xs md:text-sm truncate">{book.title}</p>
                                                            <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground">
                                                                Max: <span className="text-emerald-600">{max.toLocaleString()}</span> units
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                                            <div className="w-20 md:w-28">
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={max}
                                                                    value={qty}
                                                                    onChange={(e) => updateQty(book.id, parseInt(e.target.value) || 0)}
                                                                    className={cn(
                                                                        "h-9 md:h-12 text-center rounded-lg md:rounded-xl border-2 font-bold text-sm md:text-base",
                                                                        exceed ? "border-rose-300 bg-rose-50" : "border-slate-100 focus:border-primarycolor"
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="text-right w-16 md:w-24">
                                                                <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground">Subtotal</p>
                                                                <p className="text-xs md:text-base font-black text-primarycolor tabular-nums">{totalVal.toLocaleString()}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleBook(book)}
                                                                className="size-7 md:size-10 rounded-lg md:rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                                                                title="Remove from order"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {exceed && (
                                                        <p className="text-[10px] md:text-xs font-bold text-rose-500 mt-1 md:mt-2">Exceeds max ({max.toLocaleString()})</p>
                                                    )}
                                                    {allocation.length > 0 && (
                                                        <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 md:gap-2">
                                                            {allocation.map((a: any, idx: number) => (
                                                                <span key={idx} className="text-[7px] md:text-[9px] font-bold text-muted-foreground bg-slate-50 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded md:rounded-lg border border-slate-100">
                                                                    {a.taken} × {a.name} @ {a.price} ETB
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order Details Form */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-3 md:pt-4 border-t border-slate-100">
                                        <div className="space-y-1 md:space-y-2">
                                            <label className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2 md:ml-3">Order Type</label>
                                            <Select value={orderType} onValueChange={setOrderType}>
                                                <SelectTrigger className="h-10 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-sm md:text-base">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl md:rounded-2xl border-2 border-primarycolor/10">
                                                    <SelectItem value="requested" className="font-bold text-sm md:text-base">Requested Order</SelectItem>
                                                    <SelectItem value="on round" className="font-bold text-sm md:text-base">On Round Order</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1 md:space-y-2">
                                            <label className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2 md:ml-3">Amount Paid Instantly</label>
                                            <div className="relative">
                                                <Input type="number" value={amountPaid} onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                                                    className="h-10 md:h-14 pl-10 md:pl-12 rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-sm md:text-base focus:border-emerald-500" placeholder="0.00" disabled={paymentType === "CHECK"} />
                                                <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xs md:text-base">ETB</span>
                                            </div>
                                            {paymentType === "CHECK" && (
                                                <p className="text-[7px] md:text-[9px] text-muted-foreground font-bold mt-1">Amount is taken from the check value above</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2 space-y-1 md:space-y-2">
                                            <label className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2 md:ml-3">Memo / Note</label>
                                            <Input value={memo} onChange={(e) => setMemo(e.target.value)}
                                                className="h-10 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-sm md:text-base" placeholder="Optional notes..." />
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="space-y-3 md:space-y-4 pt-2">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</p>
                                        <div className="flex gap-2 md:gap-3">
                                            <button
                                                type="button"
                                                onClick={() => { setPaymentType("DIRECT"); setAmountPaid(0); }}
                                                className={cn(
                                                    "flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[8px] md:text-[10px] transition-all cursor-pointer",
                                                    paymentType === "DIRECT"
                                                        ? "border-primarycolor bg-primarycolor/5 text-primarycolor"
                                                        : "border-slate-100 bg-white text-muted-foreground hover:border-primarycolor/30"
                                                )}
                                            >
                                                <Banknote className="size-4 md:size-5 mx-auto mb-1 md:mb-2" />
                                                Direct Payment
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentType("CHECK")}
                                                className={cn(
                                                    "flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[8px] md:text-[10px] transition-all cursor-pointer",
                                                    paymentType === "CHECK"
                                                        ? "border-primarycolor bg-primarycolor/5 text-primarycolor"
                                                        : "border-slate-100 bg-white text-muted-foreground hover:border-primarycolor/30"
                                                )}
                                            >
                                                <FileText className="size-4 md:size-5 mx-auto mb-1 md:mb-2" />
                                                Check Payment
                                            </button>
                                        </div>

                                        {paymentType === "CHECK" && (
                                            <div className="space-y-3 md:space-y-4 p-3 md:p-5 rounded-xl md:rounded-2xl border-2 border-primarycolor/10 bg-primarycolor/[0.02]">
                                                {/* Check Option: New or Existing */}
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCheckOption("new")}
                                                        className={cn(
                                                            "flex-1 py-2 rounded-lg md:rounded-xl border-2 font-black uppercase tracking-widest text-[7px] md:text-[9px] transition-all cursor-pointer",
                                                            checkOption === "new"
                                                                ? "border-primarycolor bg-primarycolor/10 text-primarycolor"
                                                                : "border-slate-100 bg-white text-muted-foreground"
                                                        )}
                                                    >
                                                        New Check
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={openCheckSelector}
                                                        className={cn(
                                                            "flex-1 py-2 rounded-lg md:rounded-xl border-2 font-black uppercase tracking-widest text-[7px] md:text-[9px] transition-all cursor-pointer",
                                                            checkOption === "existing"
                                                                ? "border-primarycolor bg-primarycolor/10 text-primarycolor"
                                                                : "border-slate-100 bg-white text-muted-foreground"
                                                        )}
                                                    >
                                                        {selectedCheckLabel ? `Selected: ${selectedCheckLabel}` : "Existing Check"}
                                                    </button>
                                                </div>

                                                {/* New Check Form */}
                                                {checkOption === "new" && (
                                                    <div className="space-y-3 md:space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                                                                <div className="relative">
                                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                                                    <Input required value={checkFormData.username}
                                                                        onChange={(e) => setCheckFormData({...checkFormData, username: e.target.value})}
                                                                        className="h-9 md:h-12 pl-8 md:pl-10 rounded-lg md:rounded-xl border-2 font-bold text-xs md:text-sm" placeholder="Account username..." />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bank Name</label>
                                                                <div className="relative">
                                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                                                    <Input required value={checkFormData.bankname}
                                                                        onChange={(e) => setCheckFormData({...checkFormData, bankname: e.target.value})}
                                                                        className="h-9 md:h-12 pl-8 md:pl-10 rounded-lg md:rounded-xl border-2 font-bold text-xs md:text-sm" placeholder="Bank name..." />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Check Type</label>
                                                                <Select value={checkFormData.type} onValueChange={(v) => setCheckFormData({...checkFormData, type: v})}>
                                                                    <SelectTrigger className="h-9 md:h-12 rounded-lg md:rounded-xl border-2 font-bold text-xs md:text-sm">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-xl border-2">
                                                                        <SelectItem value="PAYMENT" className="font-bold text-xs md:text-sm">Payment Check</SelectItem>
                                                                        <SelectItem value="COLLATERAL" className="font-bold text-xs md:text-sm">Collateral</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</label>
                                                                <div className="relative">
                                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                                                    <Input value={checkFormData.amount}
                                                                        onChange={(e) => {
                                                                            setCheckFormData({...checkFormData, amount: e.target.value});
                                                                            setAmountPaid(parseFloat(e.target.value) || 0);
                                                                        }}
                                                                        className="h-9 md:h-12 pl-8 md:pl-10 rounded-lg md:rounded-xl border-2 font-bold text-xs md:text-sm" placeholder="0.00" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Recorded Date</label>
                                                                <div className="relative">
                                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-muted-foreground" />
                                                                    <DateInput value={checkFormData.recordeddate}
                                                                        onChange={(e) => setCheckFormData({...checkFormData, recordeddate: e.target.value})}
                                                                        className="h-9 md:h-12 pl-8 md:pl-10 rounded-lg md:rounded-xl border-2 font-bold text-xs md:text-sm" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Check Image (optional)</label>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => document.getElementById("check-image-upload")?.click()}
                                                                        className="h-9 md:h-12 flex-1 rounded-lg md:rounded-xl border-2 font-bold text-[7px] md:text-[9px] gap-1.5"
                                                                    >
                                                                        <Upload className="size-3 md:size-4" />
                                                                        {checkImageFile ? "Change Image" : "Upload Image"}
                                                                    </Button>
                                                                    {checkImagePreview && (
                                                                        <div className="relative size-9 md:size-12 shrink-0">
                                                                            <img src={checkImagePreview} alt="Preview" className="size-full rounded-lg md:rounded-xl object-cover border-2" />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => { setCheckImageFile(null); setCheckImagePreview(""); }}
                                                                                className="absolute -top-1.5 -right-1.5 size-4 md:size-5 bg-rose-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                                                                            >
                                                                                <X className="size-2.5 md:size-3" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    <input id="check-image-upload" type="file" accept="image/*" className="hidden" onChange={handleCheckImageChange} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Check Memo</label>
                                                            <Input value={checkFormData.memo}
                                                                onChange={(e) => setCheckFormData({...checkFormData, memo: e.target.value})}
                                                                className="h-9 md:h-12 rounded-lg md:rounded-xl border-2 font-bold text-xs md:text-sm" placeholder="Optional notes..." />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Existing Check: Show selected info */}
                                                {checkOption === "existing" && selectedCheckId && (
                                                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                                                        <CheckCircle2 className="size-4 md:size-5 mx-auto mb-1 text-emerald-600" />
                                                        <p className="font-bold text-emerald-800 text-xs md:text-sm">{selectedCheckLabel}</p>
                                                        <p className="text-[7px] md:text-[9px] text-emerald-600 font-bold">Check ID: {selectedCheckId}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Summary */}
                                    <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-emerald-50 border-2 border-emerald-100 space-y-2 md:space-y-3">
                                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2 md:pb-3">
                                            <span className="font-black text-emerald-900 uppercase tracking-widest text-[8px] md:text-[10px]">Order Summary</span>
                                            <span className="px-2 md:px-3 py-0.5 bg-white rounded-full text-emerald-600 text-[7px] md:text-[9px] font-black uppercase">{stepTwoBooks.length} book{stepTwoBooks.length > 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-800/60">Total Value</span>
                                            <span className="text-base md:text-xl font-black text-emerald-900">{grandTotal.toLocaleString()} <span className="text-[10px] md:text-xs">ETB</span></span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-800/60">Payment</span>
                                            <span className="text-sm md:text-base font-black text-emerald-800">{amountPaid.toLocaleString()} ETB ({paymentType === "CHECK" ? "via Check" : "Direct"})</span>
                                        </div>
                                        <div className="flex justify-between items-center text-rose-600">
                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60">Remaining Balance</span>
                                            <span className="text-sm md:text-base font-black">{(grandTotal - amountPaid).toLocaleString()} ETB</span>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !!hasExceeded || selectedWithStock.length === 0}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl h-12 md:h-14 font-black uppercase tracking-widest text-[9px] md:text-xs shadow-xl shadow-emerald-600/20 gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                        {isSubmitting ? "Processing..." : "Complete Order"}
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === "info" && (
                        <div className="space-y-4 md:space-y-6">
                            {/* Outstanding Balance */}
                            <div className={cn(
                                "p-5 md:p-8 rounded-xl md:rounded-2xl border-2",
                                shopBalance && shopBalance > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
                            )}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={cn(
                                        "size-10 md:size-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0",
                                        shopBalance && shopBalance > 0 ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                    )}>
                                        {isLoadingBalance ? <Loader2 className="size-5 animate-spin" /> :
                                         shopBalance && shopBalance > 0 ? <AlertCircle className="size-6" /> : <CheckCircle2 className="size-6" />}
                                    </div>
                                    <div>
                                        <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/60">Outstanding Balance</p>
                                        <p className={cn("font-black text-xl md:text-3xl", shopBalance && shopBalance > 0 ? "text-amber-700" : "text-emerald-700")}>
                                            {isLoadingBalance ? "Loading..." : shopBalance !== null ? `${shopBalance.toLocaleString()} ETB` : "—"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-[10px] md:text-xs font-bold text-muted-foreground leading-relaxed">
                                    {shopBalance !== null && shopBalance > 0
                                        ? `This shop has an outstanding balance of ${shopBalance.toLocaleString()} ETB. New orders will increase this balance. Consider collecting payment before creating new orders.`
                                        : shopBalance !== null && shopBalance === 0
                                            ? "This shop has no outstanding balance. You can proceed with new orders."
                                            : "Unable to load shop balance information."}
                                </div>
                            </div>

                            {/* Shop Info Summary */}
                            <div className="p-5 md:p-8 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-white">
                                <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Shop Summary</p>
                                <div className="space-y-3 text-[10px] md:text-sm font-bold">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shop Name</span>
                                        <span className="text-primarycolor">{shopName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={cn(
                                            shopBalance !== null && shopBalance > 0 ? "text-amber-600" : "text-emerald-600"
                                        )}>
                                            {shopBalance !== null && shopBalance > 0 ? "Has Debt" : "Clear"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="bg-slate-50 p-3 md:p-8 border-t border-slate-100 shrink-0 flex flex-row items-center justify-between gap-2 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3 w-full">
                        <div className="flex-1" />
                        <Button variant="outline" onClick={onClose} className="rounded-xl md:rounded-2xl h-9 md:h-12 px-4 md:px-8 font-black uppercase tracking-widest text-[8px] md:text-[10px]">
                            {activeTab === "selected" && selectedIds.size > 0 ? "Close" : "Cancel"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Existing Check Selector Dialog */}
        <Dialog open={showCheckSelector} onOpenChange={(o) => !o && setShowCheckSelector(false)}>
            <DialogContent className="sm:max-w-lg rounded-[1.8rem] md:rounded-[2.5rem] p-5 md:p-8">
                <DialogHeader className="p-0 pb-4">
                    <DialogTitle className="text-lg md:text-xl font-black text-primarycolor uppercase tracking-tight italic">
                        Select <span className="text-secondarycolor not-italic">Check</span>
                    </DialogTitle>
                </DialogHeader>

                {existingChecksLoading ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground font-bold">
                        <Loader2 className="size-4 animate-spin" /> Loading checks...
                    </div>
                ) : existingChecks.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground font-bold text-sm">No checks found</div>
                ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {existingChecks.filter((c: any) => c.status === "PENDING").map((check: any) => (
                            <button
                                key={check.id}
                                type="button"
                                onClick={() => {
                                    setSelectedCheckId(check.id);
                                    setSelectedCheckLabel(`${check.bankname || "Unknown Bank"} – ${check.username || "Unknown"} (${check.amount ? `${check.amount} ETB` : "—"})`);
                                    setAmountPaid(parseFloat(check.amount) || 0);
                                    setCheckOption("existing");
                                    setShowCheckSelector(false);
                                }}
                                className="w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-slate-100 hover:border-primarycolor/30 bg-white transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-primarycolor text-xs md:text-sm">{check.bankname || "Unknown Bank"}</p>
                                        <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground">{check.username || "Unknown"} — {check.type || "—"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-emerald-700 text-xs md:text-sm">{check.amount ? `${check.amount} ETB` : "—"}</p>
                                        <p className="text-[7px] md:text-[9px] font-bold text-muted-foreground uppercase">{check.status}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {existingChecks.filter((c: any) => c.status === "PENDING").length === 0 && (
                            <div className="text-center py-6 text-muted-foreground font-bold text-sm">No pending checks available</div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
        </>
    );
}
