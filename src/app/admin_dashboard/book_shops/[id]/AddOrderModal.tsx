"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Search, Loader2, Plus, Trash2, ShoppingCart, ShoppingBag, Info, AlertCircle, CheckCircle2, ChevronsUpDown, ChevronLeft } from 'lucide-react';
import { searchBooks } from '@/app/actions/transfer-actions';
import { getBookStockData, createOrder } from '@/app/actions/order-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopId: number;
    shopName: string;
}

export default function AddOrderModal({ isOpen, onClose, shopId, shopName }: AddOrderModalProps) {
    const [step, setStep] = useState(1); // 1: Select Books & Quantities, 2: Final Details
    const [searchQuery, setSearchQuery] = useState("");
    const [openBookSearch, setOpenBookSearch] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    
    // Cart state: items the user is adding
    const [cart, setCart] = useState<any[]>([]);
    
    const [orderType, setOrderType] = useState("requested");
    const [memo, setMemo] = useState("");
    const [amountPaid, setAmountPaid] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search effect
    useEffect(() => {
        if (isOpen) {
            const delayDebounceFn = setTimeout(() => {
                fetchBooks();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchQuery, isOpen]);

    const fetchBooks = async () => {
        setIsLoadingBooks(true);
        const res = await searchBooks(searchQuery, 0, 50);
        if (res.success) {
            setBooks(res.data || []);
        }
        setIsLoadingBooks(false);
    };

    const addToCart = async (book: any) => {
        if (cart.find(item => item.id === book.id)) {
            toast.warning("Book already in cart");
            return;
        }

        // Get stock data for price and limit
        const stockRes = await getBookStockData(book.id);
        if (stockRes.success) {
            const editions = stockRes.data;
            const totalStock = editions.reduce((acc: number, e: any) => acc + e.stock, 0);
            
            if (totalStock <= 0) {
                toast.error("No stock available for this book in any store");
                return;
            }

            setCart([...cart, {
                ...book,
                quantity: 0,
                editions: editions,
                maxStock: totalStock
            }]);
            setSearchQuery("");
            setBooks([]);
        } else {
            toast.error("Failed to fetch stock info");
        }
    };

    const updateQuantity = (bookId: number, qty: number) => {
        setCart(cart.map(item => {
            if (item.id === bookId) {
                const newQty = Math.min(qty, item.maxStock);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const hasInvalidQuantity = cart.some(item => item.quantity <= 0);

    const removeFromCart = (bookId: number) => {
        setCart(cart.filter(item => item.id !== bookId));
    };

    const calculateAllocation = (item: any) => {
        let remaining = item.quantity;
        let totalVal = 0;
        const allocation = [];

        for (const edition of item.editions) {
            if (remaining <= 0) break;
            if (edition.stock <= 0) continue;

            const take = Math.min(remaining, edition.stock);
            allocation.push({ ...edition, taken: take });
            totalVal += take * edition.price;
            remaining -= take;
        }

        return { allocation, totalVal };
    };

    const grandTotal = useMemo(() => {
        return cart.reduce((acc, item) => acc + calculateAllocation(item).totalVal, 0);
    }, [cart]);

    const handleSubmit = async () => {
        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createOrder({
                bookShopId: shopId,
                order_type: orderType,
                memo,
                amount_paid: amountPaid,
                items: cart.map(item => ({ bookId: item.id, quantity: item.quantity }))
            });

            if (res.success) {
                toast.success("Order created successfully!");
                onClose();
                // Reset state
                setCart([]);
                setMemo("");
                setAmountPaid(0);
                setStep(1);
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <DialogHeader className="p-8 pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <ShoppingBag className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl md:text-3xl font-black text-primarycolor uppercase italic truncate">
                                New Order <span className="text-secondarycolor not-italic">for {shopName}</span>
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                                {step === 1 ? "Add books and specify quantities" : "Finalize order details"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 custom-scrollbar">
                    {step === 1 ? (
                        <div className="space-y-8">
                            {/* Book Search */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Book</label>
                                <Popover open={openBookSearch} onOpenChange={setOpenBookSearch}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openBookSearch}
                                            className="w-full h-16 justify-between rounded-2xl border-2 border-slate-100 font-bold text-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="truncate">Select book title...</span>
                                            <ChevronsUpDown className="ml-2 size-5 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl bg-white overflow-hidden">
                                        <Command shouldFilter={false}>
                                            <CommandInput
                                                placeholder="Search book title, author, or ISBN..."
                                                value={searchQuery}
                                                onValueChange={setSearchQuery}
                                                className="h-12 border-0 focus:ring-0 focus:border-0"
                                            />
                                            <CommandList className="h-[350px] overflow-y-auto scrollbar-thin">
                                                {isLoadingBooks && (
                                                    <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                                        <Loader2 className="size-4 animate-spin text-primarycolor" />
                                                        <span>Searching...</span>
                                                    </div>
                                                )}
                                                {!isLoadingBooks && books.length === 0 && (
                                                    <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
                                                        No books found.
                                                    </CommandEmpty>
                                                )}
                                                <CommandGroup>
                                                    {books.map((book) => (
                                                        <CommandItem
                                                            key={book.id}
                                                            value={book.title}
                                                            onSelect={() => {
                                                                addToCart(book);
                                                                setOpenBookSearch(false);
                                                            }}
                                                            className="h-[50px] px-4 border-b border-slate-50 last:border-0 flex items-center justify-between cursor-pointer hover:bg-primarycolor/5 aria-selected:bg-primarycolor/5 transition-colors"
                                                        >
                                                            <div className="flex flex-col items-start min-w-0 flex-1 pr-4">
                                                                <span className="font-bold text-primarycolor truncate w-full">{book.title}</span>
                                                                <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest truncate w-full">{book.author || "Unknown Author"}</span>
                                                            </div>
                                                            <Plus className="size-4 text-primarycolor shrink-0 opacity-40 hover:opacity-100" />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Cart List */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="size-5 text-primarycolor/40" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-primarycolor italic">Order Basket</h4>
                                </div>

                                {cart.length > 0 ? (
                                    <div className="space-y-4">
                                        {cart.map(item => {
                                            const { allocation, totalVal } = calculateAllocation(item);
                                            return (
                                                <div key={item.id} className="p-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primarycolor/20 transition-all shadow-sm">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="space-y-1">
                                                            <h5 className="font-black text-primarycolor uppercase italic text-lg">{item.title}</h5>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                    Max Available: {item.maxStock.toLocaleString()} Units
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="w-32">
                                                                <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor/60 block mb-1">Quantity</label>
                                                                <Input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                                    className="h-12 text-center rounded-xl border-2 border-white shadow-inner font-bold text-lg focus:border-primarycolor"
                                                                />
                                                            </div>
                                                            <div className="text-right min-w-[120px]">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-primarycolor/60 block mb-1">Subtotal</p>
                                                                <p className="text-xl font-black text-primarycolor">{totalVal.toLocaleString()} <span className="text-[10px] opacity-40">ETB</span></p>
                                                            </div>
                                                            <Button 
                                                                variant="ghost" 
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="size-12 rounded-xl text-rose-500 hover:bg-rose-50 p-0"
                                                            >
                                                                <Trash2 className="size-5" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* FIFO Breakdown Info */}
                                                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-wrap gap-3">
                                                        {allocation.map((alloc, idx) => (
                                                            <div key={idx} className="bg-white/80 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                                                <Info className="size-3 text-primarycolor/30" />
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                                                    {alloc.taken} units from {alloc.name} (@ {alloc.price} ETB)
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                                        <ShoppingBag className="size-12 mx-auto text-slate-200 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Search and add books to begin order</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Order Type</label>
                                    <Select value={orderType} onValueChange={setOrderType}>
                                        <SelectTrigger className="h-16 rounded-2xl border-2 border-slate-100 font-bold text-lg">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-2 border-primarycolor/10">
                                            <SelectItem value="requested" className="font-bold">Requested Order</SelectItem>
                                            <SelectItem value="on round" className="font-bold">On Round Order</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Amount Paid Instantly</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={amountPaid}
                                            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                                            className="h-16 pl-10 rounded-2xl border-2 border-slate-100 font-bold text-lg focus:border-emerald-500 transition-colors"
                                            placeholder="0.00"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">ETB</span>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Order Memo / Short Note</label>
                                    <Input
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                        className="h-16 rounded-2xl border-2 border-slate-100 font-bold text-lg"
                                        placeholder="Add any specific requests or notes here..."
                                    />
                                </div>
                             </div>

                             <div className="p-8 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 space-y-6">
                                <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                                    <h5 className="font-black text-emerald-900 uppercase tracking-widest text-xs italic">Order Summary</h5>
                                    <span className="px-3 py-1 bg-white rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest">{cart.length} Unique Books</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800/60">Total Value</span>
                                        <span className="text-2xl font-black text-emerald-900">{grandTotal.toLocaleString()} <span className="text-xs">ETB</span></span>
                                    </div>
                                    <div className="flex justify-between items-center text-rose-600">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Remaining Balance</span>
                                        <span className="text-lg font-black">{(grandTotal - amountPaid).toLocaleString()} ETB</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="bg-slate-50 p-8 border-t border-slate-100 shrink-0 flex flex-row items-center justify-between gap-4">
                    {step === 1 ? (
                         <div className="flex items-center gap-4 w-full">
                            <div className="flex-1" />
                            <Button variant="outline" onClick={onClose} className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                            <Button 
                                onClick={() => setStep(2)} 
                                disabled={cart.length === 0 || hasInvalidQuantity}
                                className="bg-primarycolor hover:bg-secondarycolor text-white rounded-2xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primarycolor/20 gap-2"
                            >
                                Continue <ChevronRight className="size-4" />
                            </Button>
                         </div>
                    ) : (
                        <div className="flex items-center gap-4 w-full">
                            <Button variant="ghost" onClick={() => setStep(1)} className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] gap-2">
                                <ChevronLeft className="size-4" /> Back
                            </Button>
                            <div className="flex-1" />
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2"
                            >
                                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                {isSubmitting ? "Processing..." : "Complete Order"}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
