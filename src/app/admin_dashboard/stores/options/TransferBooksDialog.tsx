"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Store,
    ArrowRight,
    BookOpen,
    Layers,
    Hash,
    Check,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2,
    Ban,
} from 'lucide-react';
import { getStores } from '@/app/actions/get-stores';
import { getStoreBooksAndEditions, transferBetweenStores } from '@/app/actions/store-inventory-actions';

interface TransferBooksDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

type Step = "stores" | "book" | "quantity" | "review";

export default function TransferBooksDialog({ open, onOpenChange, onSuccess }: TransferBooksDialogProps) {
    const [step, setStep] = useState<Step>("stores");
    const [stores, setStores] = useState<any[]>([]);
    const [storeLoading, setStoreLoading] = useState(false);

    const [fromStoreId, setFromStoreId] = useState<string>("");
    const [toStoreId, setToStoreId] = useState<string>("");

    const [bookData, setBookData] = useState<any[]>([]);
    const [bookDataLoading, setBookDataLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [bookPopoverOpen, setBookPopoverOpen] = useState(false);
    const [selectedEditionId, setSelectedEditionId] = useState<string>("");

    const [transferQty, setTransferQty] = useState<string>("1");

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setStep("stores");
            setFromStoreId("");
            setToStoreId("");
            setSelectedBook(null);
            setSelectedEditionId("");
            setTransferQty("1");
            setBookData([]);
            setStoreLoading(true);
            getStores().then(res => {
                if (res.success) setStores(res.data as any[]);
                setStoreLoading(false);
            });
        }
    }, [open]);

    useEffect(() => {
        if (fromStoreId && step === "book") {
            setBookDataLoading(true);
            setSelectedBook(null);
            setSelectedEditionId("");
            getStoreBooksAndEditions(Number(fromStoreId)).then(res => {
                if (res.success) setBookData(res.data as any[]);
                setBookDataLoading(false);
            });
        }
    }, [fromStoreId, step]);

    const selectedEdition = selectedBook?.editions?.find((e: any) => String(e.id) === selectedEditionId);
    const fromStore = stores.find(s => String(s.id) === fromStoreId);
    const toStore = stores.find(s => String(s.id) === toStoreId);
    const maxQty = selectedEdition?.quantity || 0;
    const qtyNum = parseInt(transferQty) || 0;
    const qtyValid = qtyNum >= 1 && qtyNum <= maxQty;

    const handleNext = () => {
        if (step === "stores" && fromStoreId && toStoreId && fromStoreId !== toStoreId) {
            setStep("book");
        } else if (step === "book" && selectedBook && selectedEditionId) {
            setTransferQty("1");
            setStep("quantity");
        } else if (step === "quantity" && qtyValid) {
            setStep("review");
        }
    };

    const handleBack = () => {
        if (step === "book") setStep("stores");
        else if (step === "quantity") setStep("book");
        else if (step === "review") setStep("quantity");
    };

    const handleConfirm = async () => {
        if (!fromStoreId || !toStoreId || !selectedEditionId || !qtyValid) return;
        setSubmitting(true);
        const res = await transferBetweenStores(
            Number(fromStoreId),
            Number(toStoreId),
            [{ editionId: Number(selectedEditionId), quantity: qtyNum }]
        );
        setSubmitting(false);
        if (res.success) {
            toast.success(`Transferred ${qtyNum} units successfully`);
            onSuccess();
            onOpenChange(false);
        } else {
            toast.error(res.error || "Transfer failed");
        }
    };

    const totalSteps = 4;
    const stepNames = ["Stores", "Book", "Quantity", "Review"];
    const stepIndex = ["stores", "book", "quantity", "review"].indexOf(step);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-2xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                                <ArrowRight className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                                    Transfer Books
                                </DialogTitle>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Step {stepIndex + 1} of {totalSteps} — {stepNames[stepIndex]}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => onOpenChange(false)} className="size-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">
                            <X className="size-4 text-muted-foreground" />
                        </button>
                    </div>
                    {/* Progress bar */}
                    <div className="flex gap-1.5 mt-4">
                        {stepNames.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                                    i <= stepIndex ? "bg-primarycolor" : "bg-slate-100"
                                )}
                            />
                        ))}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* STEP 1: Select Stores */}
                    {step === "stores" && (
                        <div className="space-y-6">
                            {storeLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="size-6 animate-spin text-primarycolor/30" />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">From Store</label>
                                        <Select value={fromStoreId} onValueChange={setFromStoreId}>
                                            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 font-bold text-sm">
                                                <Store className="size-4 text-primarycolor/50" />
                                                <SelectValue placeholder="Select source store..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-2 border-primarycolor/10">
                                                {stores.map(s => (
                                                    <SelectItem key={s.id} value={String(s.id)} className="font-bold text-sm h-12 rounded-xl" disabled={String(s.id) === toStoreId}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <div className="size-10 rounded-full bg-primarycolor/10 flex items-center justify-center text-primarycolor">
                                            <ArrowRight className="size-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">To Store</label>
                                        <Select value={toStoreId} onValueChange={setToStoreId}>
                                            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 font-bold text-sm">
                                                <Store className="size-4 text-secondarycolor/50" />
                                                <SelectValue placeholder="Select destination store..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-2 border-primarycolor/10">
                                                {stores.map(s => (
                                                    <SelectItem key={s.id} value={String(s.id)} className="font-bold text-sm h-12 rounded-xl" disabled={String(s.id) === fromStoreId}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {fromStoreId && toStoreId && fromStoreId === toStoreId && (
                                        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                                            <Ban className="size-4 shrink-0" />
                                            Source and destination stores must be different
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* STEP 2: Select Book + Edition */}
                    {step === "book" && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-primarycolor/5 border-2 border-primarycolor/10 flex items-center gap-3">
                                <Store className="size-4 text-primarycolor" />
                                <span className="text-xs font-bold text-muted-foreground">
                                    {fromStore?.name} <ArrowRight className="size-3 inline mx-1" /> {toStore?.name}
                                </span>
                            </div>

                            {bookDataLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="size-6 animate-spin text-primarycolor/30" />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Book</label>
                                        <Popover open={bookPopoverOpen} onOpenChange={setBookPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full h-14 rounded-2xl border-2 border-slate-100 justify-between font-bold text-sm"
                                                >
                                                    {selectedBook ? (
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <BookOpen className="size-4 text-primarycolor shrink-0" />
                                                            <span className="truncate">{selectedBook.title}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">Choose a book...</span>
                                                    )}
                                                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl">
                                                <Command className="rounded-2xl">
                                                    <CommandInput placeholder="Search books..." className="h-12" />
                                                    <CommandList className="max-h-[240px]">
                                                        <CommandEmpty>No books found in this store.</CommandEmpty>
                                                        <CommandGroup>
                                                            {bookData.map((book: any) => (
                                                                <CommandItem
                                                                    key={book.bookId}
                                                                    value={book.title}
                                                                    onSelect={() => {
                                                                        setSelectedBook(book);
                                                                        setSelectedEditionId("");
                                                                        setBookPopoverOpen(false);
                                                                    }}
                                                                    className="h-14 px-4 font-bold cursor-pointer rounded-xl"
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4 text-primarycolor shrink-0", selectedBook?.bookId === book.bookId ? "opacity-100" : "opacity-0")} />
                                                                    <div className="flex flex-col min-w-0">
                                                                        <span className="line-clamp-1">{book.title}</span>
                                                                        {book.author && <span className="text-[9px] text-muted-foreground font-semibold">{book.author}</span>}
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {selectedBook && (
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Edition</label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full h-14 rounded-2xl border-2 border-slate-100 justify-between font-bold text-sm"
                                                    >
                                                        {selectedEditionId ? (
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <Layers className="size-4 text-primarycolor shrink-0" />
                                                                <span className="truncate">{selectedEdition?.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">Choose an edition...</span>
                                                        )}
                                                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl">
                                                    <Command className="rounded-2xl">
                                                        <CommandInput placeholder="Search editions..." className="h-12" />
                                                        <CommandList className="max-h-[240px]">
                                                            <CommandEmpty>No editions available.</CommandEmpty>
                                                            <CommandGroup>
                                                                {(selectedBook.editions || [])
                                                                    .filter((ed: any) => (ed.quantity || 0) > 0)
                                                                    .map((ed: any) => (
                                                                        <CommandItem
                                                                            key={ed.id}
                                                                            value={ed.name}
                                                                            onSelect={() => {
                                                                                setSelectedEditionId(String(ed.id));
                                                                            }}
                                                                            className="h-14 px-4 font-bold cursor-pointer rounded-xl"
                                                                        >
                                                                            <Check className={cn("mr-2 h-4 w-4 text-primarycolor shrink-0", selectedEditionId === String(ed.id) ? "opacity-100" : "opacity-0")} />
                                                                            <div className="flex items-center justify-between w-full min-w-0">
                                                                                <span className="truncate">{ed.name}</span>
                                                                                <span className="ml-3 shrink-0 text-[10px] font-black text-primarycolor bg-primarycolor/10 px-3 py-1 rounded-full">
                                                                                    {ed.quantity}
                                                                                </span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                {(selectedBook.editions || []).filter((ed: any) => (ed.quantity || 0) > 0).length === 0 && (
                                                                    <div className="p-6 text-center">
                                                                        <p className="text-sm font-bold text-muted-foreground">No editions with stock</p>
                                                                    </div>
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}

                                    {bookData.length === 0 && !bookDataLoading && (
                                        <div className="p-8 text-center space-y-2">
                                            <BookOpen className="size-8 text-slate-200 mx-auto" />
                                            <p className="text-sm font-bold text-muted-foreground">No books available in this store</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* STEP 3: Enter Quantity */}
                    {step === "quantity" && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-primarycolor/5 border-2 border-primarycolor/10 flex items-center gap-3">
                                <Store className="size-4 text-primarycolor" />
                                <span className="text-xs font-bold text-muted-foreground">
                                    {fromStore?.name} <ArrowRight className="size-3 inline mx-1" /> {toStore?.name}
                                </span>
                                <span className="text-xs text-slate-300 mx-1">|</span>
                                <BookOpen className="size-3.5 text-primarycolor/50" />
                                <span className="text-xs font-bold text-muted-foreground truncate">{selectedBook?.title}</span>
                                <Layers className="size-3 text-slate-300" />
                                <span className="text-xs font-bold text-muted-foreground">{selectedEdition?.name}</span>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available in {fromStore?.name}</span>
                                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primarycolor/10 text-primarycolor font-black text-sm">
                                        {maxQty}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Quantity to Transfer</label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={maxQty}
                                        value={transferQty}
                                        onChange={(e) => setTransferQty(e.target.value)}
                                        className="h-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg text-center"
                                    />
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-muted-foreground">Min: 1</span>
                                        <span className="text-muted-foreground">Max: {maxQty}</span>
                                    </div>
                                </div>

                                {!qtyValid && transferQty && (
                                    <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-[10px] font-bold flex items-center gap-2">
                                        <Ban className="size-3.5 shrink-0" />
                                        {qtyNum < 1 ? "Minimum transfer quantity is 1" : `Maximum transfer quantity is ${maxQty}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Review & Confirm */}
                    {step === "review" && (
                        <div className="space-y-6">
                            <div className="bg-emerald-50 rounded-2xl p-1">
                                <div className="bg-white rounded-xl p-6 space-y-5 border-2 border-emerald-100">
                                    <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
                                        <div className="size-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <ArrowRight className="size-4" />
                                        </div>
                                        <span className="font-black text-sm text-emerald-700 uppercase tracking-tight">Transfer Summary</span>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 text-sm">
                                        <Store className="size-4 text-primarycolor self-center" />
                                        <div>
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">From Store</span>
                                            <p className="font-bold">{fromStore?.name}</p>
                                        </div>

                                        <ArrowRight className="size-4 text-secondarycolor self-center" />
                                        <div>
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">To Store</span>
                                            <p className="font-bold">{toStore?.name}</p>
                                        </div>

                                        <BookOpen className="size-4 text-primarycolor self-center" />
                                        <div>
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Book</span>
                                            <p className="font-bold">{selectedBook?.title}</p>
                                        </div>

                                        <Layers className="size-4 text-primarycolor self-center" />
                                        <div>
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Edition</span>
                                            <p className="font-bold">{selectedEdition?.name}</p>
                                        </div>

                                        <Hash className="size-4 text-primarycolor self-center" />
                                        <div>
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Quantity</span>
                                            <p className="font-black text-lg text-primarycolor">{qtyNum}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-slate-100 shrink-0">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={step === "stores" ? () => onOpenChange(false) : handleBack}
                            className="rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-2"
                        >
                            <ChevronLeft className="size-4 mr-2" />
                            {step === "stores" ? "Cancel" : "Back"}
                        </Button>

                        {step === "review" ? (
                            <Button
                                onClick={handleConfirm}
                                disabled={submitting}
                                className="rounded-xl h-12 px-8 font-black text-[10px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                            >
                                {submitting ? (
                                    <Loader2 className="size-4 animate-spin mr-2" />
                                ) : (
                                    <Check className="size-4 mr-2" />
                                )}
                                {submitting ? "Transferring..." : "Confirm Transfer"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={
                                    (step === "stores" && (!fromStoreId || !toStoreId || fromStoreId === toStoreId)) ||
                                    (step === "book" && (!selectedBook || !selectedEditionId)) ||
                                    (step === "quantity" && !qtyValid)
                                }
                                className="rounded-xl h-12 px-8 font-black text-[10px] uppercase tracking-widest bg-primarycolor shadow-lg shadow-primarycolor/20"
                            >
                                Next
                                <ChevronRight className="size-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
