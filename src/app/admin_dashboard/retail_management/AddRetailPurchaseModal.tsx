"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    ShoppingBag,
    BookOpen,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Loader2,
    DollarSign,
    User,
    Calendar,
    FileText,
    Clock,
    Search,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createRetailPurchase } from "@/app/actions/retail-purchase-actions";
import { searchBooks } from "@/app/actions/transfer-actions";
import { getBookStockData } from "@/app/actions/order-actions";
import { cn } from "@/lib/utils";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface StockInfo {
    editions: { id: number; name: string; price: number; stock: number }[];
    maxStock: number;
}

export default function AddRetailPurchaseModal({ isOpen, onClose }: Props) {
    const [step, setStep] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState<any[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const [selectedBookIds, setSelectedBookIds] = useState<Set<number>>(new Set());
    const [stockMap, setStockMap] = useState<Record<number, StockInfo>>({});
    const [loadingStock, setLoadingStock] = useState<Set<number>>(new Set());
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [customerName, setCustomerName] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [memo, setMemo] = useState("");
    const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PARTIALLY_PAID" | "PAID">("PENDING");
    const [partialAmount, setPartialAmount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const selectableBooks = useMemo(() =>
        books.filter((b: any) => b.hasStoreStock),
        [books]
    );

    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            setSearchQuery("");
            setSelectedBookIds(new Set());
            setStockMap({});
            setLoadingStock(new Set());
            setQuantities({});
            setCustomerName("");
            setDate(new Date().toISOString().split("T")[0]);
            setMemo("");
            setPaymentStatus("PENDING");
            setPartialAmount(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setIsLoadingBooks(true);
            fetchBooks();
        } else {
            setBooks([]);
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
        books.filter((b: any) => selectedBookIds.has(b.id)),
        [books, selectedBookIds]
    );

    const toggleBook = useCallback(async (book: any) => {
        if (selectedBookIds.has(book.id)) {
            const next = new Set(selectedBookIds);
            next.delete(book.id);
            setSelectedBookIds(next);
            const qNext = { ...quantities };
            delete qNext[book.id];
            setQuantities(qNext);
            return;
        }
        if (!stockMap[book.id]) {
            setLoadingStock(prev => new Set(prev).add(book.id));
            const res = await getBookStockData(book.id);
            setLoadingStock(prev => { const n = new Set(prev); n.delete(book.id); return n; });
            if (!res.success) { toast.error("Failed to fetch stock"); return; }
            const editions = res.data;
            const totalStock = editions.reduce((acc: number, e: any) => acc + e.stock, 0);
            if (totalStock <= 0) { toast.error("No stock available"); return; }
            setStockMap(prev => ({ ...prev, [book.id]: { editions, maxStock: totalStock } }));
        }
        setSelectedBookIds(prev => new Set(prev).add(book.id));
        setQuantities(prev => ({ ...prev, [book.id]: 0 }));
    }, [selectedBookIds, stockMap, quantities]);

    const updateQty = (bookId: number, qty: number) => {
        const max = stockMap[bookId]?.maxStock ?? 0;
        setQuantities(prev => ({ ...prev, [bookId]: Math.min(Math.max(0, qty), max) }));
    };

    const calculateAllocation = useCallback((bookId: number) => {
        const stock = stockMap[bookId];
        if (!stock) return { allocation: [], totalValue: 0 };
        let remaining = quantities[bookId] ?? 0;
        let totalValue = 0;
        const allocation: { editionId: number; editionName: string; quantity: number; unitPrice: number }[] = [];
        for (const ed of stock.editions) {
            if (remaining <= 0) break;
            if (ed.stock <= 0) continue;
            const take = Math.min(remaining, ed.stock);
            allocation.push({ editionId: ed.id, editionName: ed.name, quantity: take, unitPrice: ed.price });
            totalValue += take * ed.price;
            remaining -= take;
        }
        return { allocation, totalValue };
    }, [stockMap, quantities]);

    const grandTotal = useMemo(() =>
        selectedBooks.reduce((acc, book) => acc + calculateAllocation(book.id).totalValue, 0),
        [selectedBooks, calculateAllocation]
    );

    const allAllocations = useMemo(() => {
        const result: { editionId: number; quantity: number; unitPrice: number }[] = [];
        for (const book of selectedBooks) {
            const { allocation } = calculateAllocation(book.id);
            result.push(...allocation.map(a => ({ editionId: a.editionId, quantity: a.quantity, unitPrice: a.unitPrice })));
        }
        return result;
    }, [selectedBooks, calculateAllocation]);

    const canNext = () => {
        if (step === 0) return selectedBookIds.size > 0;
        if (step === 1) return selectedBooks.every(b => (quantities[b.id] ?? 0) > 0);
        return true;
    };

    const handleSubmit = async () => {
        if (allAllocations.length === 0) {
            toast.error("No items to purchase");
            return;
        }

        const total = grandTotal;
        const amountPaid = paymentStatus === "PAID" ? total : (paymentStatus === "PARTIALLY_PAID" ? partialAmount : 0);

        setIsSubmitting(true);
        try {
            const res = await createRetailPurchase({
                name: customerName || undefined,
                date,
                memo: memo || undefined,
                amountPaid,
                items: allAllocations.map(a => ({
                    editionId: a.editionId,
                    quantity: a.quantity,
                    unitPrice: a.unitPrice,
                })),
            });

            if (res.success) {
                toast.success("Retail purchase recorded successfully!");
                router.refresh();
                onClose();
            } else {
                toast.error(res.error || "Failed to create purchase");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalSteps = 3;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] rounded-[2rem] border-4 border-primarycolor/5 bg-white p-0 flex flex-col">
                <DialogHeader className="shrink-0 p-6 md:p-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <ShoppingBag className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-primarycolor uppercase italic">
                                New Retail <span className="text-secondarycolor not-italic">Purchase</span>
                            </DialogTitle>
                            <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                Step {step + 1} of {totalSteps}
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div key={i} className={cn(
                                "flex-1 h-1.5 rounded-full transition-all",
                                i <= step ? "bg-primarycolor" : "bg-slate-100"
                            )} />
                        ))}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {/* Step 0: Customer Name & Book Selection */}
                    {step === 0 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Customer Name (optional)</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                                        className="h-13 pl-12 rounded-2xl border-2 border-slate-100 font-bold" placeholder="Walk-in customer..." />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Select Books</p>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
                                        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-9 pl-9 rounded-xl border-2 border-slate-100 font-bold text-xs" placeholder="Search books..." />
                                    </div>
                                </div>
                                <div className="space-y-1.5 max-h-[280px] overflow-y-auto border-2 border-slate-100 rounded-2xl p-2">
                                    {isLoadingBooks ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : selectableBooks.length === 0 ? (
                                        <p className="text-center py-8 text-[10px] font-black text-muted-foreground">No books with stock found</p>
                                    ) : selectableBooks.map((book: any) => {
                                        const isSelected = selectedBookIds.has(book.id);
                                        const isLoading = loadingStock.has(book.id);
                                        return (
                                            <label key={book.id} className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                                                isSelected ? "border-primarycolor/30 bg-primarycolor/5" : "border-transparent hover:border-slate-100"
                                            )}>
                                                <Checkbox disabled={isLoading} checked={isSelected} onCheckedChange={() => toggleBook(book)}
                                                    className="size-5 rounded-lg data-[state=checked]:bg-primarycolor data-[state=checked]:border-primarycolor" />
                                                <BookOpen className="size-4 text-muted-foreground/40 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-primarycolor text-sm truncate">{book.title}</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground truncate">
                                                        {book.author || "Unknown author"} {isLoading && <Loader2 className="inline size-3 animate-spin ml-1" />}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Quantities per Book */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Set Quantities</p>
                            {selectedBooks.length === 0 ? (
                                <p className="text-center py-10 text-[10px] font-black text-muted-foreground">No books selected. Go back and select books.</p>
                            ) : (
                                <div className="space-y-3">
                                    {selectedBooks.map((book: any) => {
                                        const stock = stockMap[book.id];
                                        const qty = quantities[book.id] ?? 0;
                                        const { allocation, totalValue } = calculateAllocation(book.id);
                                        return (
                                            <div key={book.id} className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <BookOpen className="size-4 text-primarycolor/40 shrink-0" />
                                                        <p className="font-black text-primarycolor text-sm truncate">{book.title}</p>
                                                    </div>
                                                    <span className="text-[8px] font-black text-muted-foreground shrink-0">
                                                        Stock: {stock?.maxStock ?? 0}
                                                    </span>
                                                </div>
                                                <div>
                                                    <Input type="number" min={0} max={stock?.maxStock ?? 0}
                                                        value={qty === 0 ? "" : qty}
                                                        onChange={(e) => updateQty(book.id, parseInt(e.target.value) || 0)}
                                                        className="h-11 rounded-xl border-2 font-bold text-sm"
                                                        placeholder="Enter quantity..." />
                                                    {qty > 0 && allocation.length > 0 && (
                                                        <div className="mt-2 space-y-1">
                                                            {allocation.map((a) => (
                                                                <div key={a.editionId} className="flex items-center justify-between text-[9px] font-bold text-muted-foreground bg-white rounded-lg px-3 py-1.5 border border-slate-100">
                                                                    <span className="truncate">{a.editionName}</span>
                                                                    <span>{a.quantity} x {a.unitPrice?.toLocaleString()} ETB</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {qty > 0 && (
                                                        <div className="text-right mt-1">
                                                            <span className="font-black text-primarycolor text-sm">Subtotal: {totalValue.toLocaleString()} ETB</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Payment & Date */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                        <DateInput value={date} onChange={(e) => setDate(e.target.value)}
                                            className="h-13 pl-12 rounded-2xl border-2 border-slate-100 font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Total Amount</label>
                                    <div className="h-13 rounded-2xl border-2 border-slate-100 bg-slate-50 flex items-center px-5 font-black text-lg text-primarycolor">
                                        {grandTotal.toLocaleString()} ETB
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment (optional)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["PENDING", "PARTIALLY_PAID", "PAID"] as const).map((s) => (
                                        <button key={s} type="button" onClick={() => setPaymentStatus(s)}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[8px] transition-all cursor-pointer text-center",
                                                paymentStatus === s
                                                    ? "border-primarycolor bg-primarycolor/5 text-primarycolor"
                                                    : "border-slate-100 bg-white text-muted-foreground hover:border-primarycolor/30"
                                            )}>
                                            <DollarSign className="size-5 mx-auto mb-1" />
                                            {s === "PENDING" ? "Unpaid" : s === "PARTIALLY_PAID" ? "Partial" : "Paid"}
                                        </button>
                                    ))}
                                </div>

                                {paymentStatus === "PARTIALLY_PAID" && (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Amount Paid</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                            <Input type="number" value={partialAmount} onChange={(e) => setPartialAmount(parseFloat(e.target.value) || 0)}
                                                className="h-13 pl-12 rounded-2xl border-2 border-slate-100 font-bold" placeholder="0.00" />
                                        </div>
                                    </div>
                                )}
                                <p className="text-[8px] font-bold text-muted-foreground">
                                    Payment can be updated later from the purchase detail page.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Memo (optional)</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                    <Input value={memo} onChange={(e) => setMemo(e.target.value)}
                                        className="h-13 pl-12 rounded-2xl border-2 border-slate-100 font-bold" placeholder="Notes..." />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="shrink-0 bg-slate-50 p-4 md:p-6 border-t border-slate-100 flex gap-3">
                    {step > 0 ? (
                        <Button variant="outline" onClick={() => setStep(s => s - 1)}
                            className="flex-1 h-12 md:h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2 py-2">
                            <ChevronLeft className="size-4" /> Back
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={onClose}
                            className="flex-1 h-12 md:h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] py-2">
                            Cancel
                        </Button>
                    )}
                    {step < totalSteps - 1 ? (
                        <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                            className="flex-[2] h-12 md:h-12 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primarycolor/20 gap-2 py-2">
                            Next <ChevronRight className="size-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}
                            className="flex-[2] h-12 md:h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2 py-2">
                            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                            {isSubmitting ? "Saving..." : "Complete Purchase"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
