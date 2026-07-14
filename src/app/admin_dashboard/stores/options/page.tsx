"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Store, Package, BookOpen, Layers, Hash, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getStores } from '@/app/actions/get-stores';
import { getStoreInventoryWithDetails } from '@/app/actions/store-inventory-actions';
import TransferBooksDialog from './TransferBooksDialog';
import PrintContentDialog from './PrintContentDialog';

export default function StoreOptionsPage() {
    const [stores, setStores] = useState<any[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const [printDialogOpen, setPrintDialogOpen] = useState(false);

    useEffect(() => {
        const fetchStores = async () => {
            const res = await getStores();
            if (res.success) {
                setStores(res.data as any[]);
            }
            setLoading(false);
        };
        fetchStores();
    }, []);

    useEffect(() => {
        if (selectedStoreId === null) {
            setInventory([]);
            return;
        }
        const fetchInventory = async () => {
            setInventoryLoading(true);
            const res = await getStoreInventoryWithDetails(selectedStoreId);
            if (res.success) {
                setInventory(res.data.bookeditionstores || []);
            }
            setInventoryLoading(false);
        };
        fetchInventory();
    }, [selectedStoreId]);

    const selectedStore = stores.find(s => s.id === selectedStoreId);

    const bookGroups = React.useMemo(() => {
        const groups: Record<string, any[]> = {};
        for (const item of inventory) {
            const key = item.bookedition?.books?.title || "Unknown Book";
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        }
        return Object.entries(groups)
            .map(([bookTitle, items]) => ({
                bookTitle,
                items,
                totalQty: items.reduce((sum: number, i: any) => sum + (i.quantity ?? 0), 0),
            }))
            .filter((g) =>
                g.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => a.totalQty - b.totalQty);
    }, [inventory, searchQuery]);

    function totalBadgeColor(qty: number) {
        if (qty < 50) return "bg-rose-500 text-white shadow-lg shadow-rose-500/20";
        if (qty <= 100) return "bg-amber-500 text-white shadow-lg shadow-amber-500/20";
        return "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20";
    }

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto space-y-12">
            <div className="mb-4 space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Store <span className="text-secondarycolor not-italic">Options</span>
                </h1>
                <p className="text-muted-foreground font-bold tracking-tight">
                    Select a store to view its current inventory breakdown.
                </p>
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={() => setPrintDialogOpen(true)}
                        className="rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest bg-white text-primarycolor border-2 border-primarycolor/20 hover:bg-primarycolor/5 shadow-lg gap-2"
                    >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" /></svg>
                        Print Content
                    </Button>
                    <Button
                        onClick={() => setTransferDialogOpen(true)}
                        className="rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest bg-primarycolor shadow-lg shadow-primarycolor/20 gap-2"
                    >
                        <ArrowRight className="size-4" />
                        Transfer Books
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border-2 border-primarycolor/5 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Store className="size-5 text-primarycolor" />
                    <h2 className="text-sm font-black text-primarycolor uppercase tracking-widest italic">
                        Select <span className="text-secondarycolor not-italic">Store</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="size-6 rounded-full border-2 border-primarycolor/20 border-t-primarycolor animate-spin" />
                    </div>
                ) : stores.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-muted-foreground font-bold">No stores found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {stores.map((store) => {
                            const isSelected = selectedStoreId === store.id;
                            return (
                                <label
                                    key={store.id}
                                    className={cn(
                                        "relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                                        isSelected
                                            ? "border-primarycolor bg-primarycolor/5 shadow-md shadow-primarycolor/10"
                                            : "border-slate-100 hover:border-primarycolor/30 hover:bg-slate-50"
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="store"
                                        value={store.id}
                                        checked={isSelected}
                                        onChange={() => setSelectedStoreId(store.id)}
                                        className="size-4 accent-primarycolor shrink-0"
                                    />
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Store className={cn("size-4 shrink-0", isSelected ? "text-primarycolor" : "text-slate-300")} />
                                        <span className={cn("font-bold text-sm truncate", isSelected ? "text-primarycolor" : "text-foreground")}>
                                            {store.name}
                                        </span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedStoreId && (
                <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl overflow-hidden">
                    <div className="p-6 md:p-10 border-b border-slate-100 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Package className="size-5 text-primarycolor" />
                                <h2 className="text-sm font-black text-primarycolor uppercase tracking-widest italic">
                                    Inventory — <span className="text-secondarycolor not-italic">{selectedStore?.name}</span>
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-5 py-2 rounded-full bg-primarycolor/10 text-primarycolor text-[10px] font-black uppercase tracking-widest">
                                    {bookGroups.length} Book{bookGroups.length !== 1 ? 's' : ''}
                                </div>
                                <div className="px-5 py-2 rounded-full bg-slate-100 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                    {inventory.length} Edition{inventory.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Search by book title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 focus:border-primarycolor outline-none font-bold text-sm text-foreground placeholder:text-slate-300 transition-colors"
                            />
                        </div>
                    </div>

                    {inventoryLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="size-8 rounded-full border-2 border-primarycolor/20 border-t-primarycolor animate-spin" />
                        </div>
                    ) : inventory.length === 0 ? (
                        <div className="p-16 text-center space-y-3">
                            <Search className="size-10 text-slate-200 mx-auto" />
                            <p className="text-muted-foreground font-bold">No inventory found for this store.</p>
                            <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">Assign editions from the book management section</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="text-left p-4 md:p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[35%]">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="size-3.5" />
                                                Book
                                            </div>
                                        </th>
                                        <th className="text-right p-4 md:p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[15%]">
                                            <div className="flex items-center justify-end gap-2">
                                                <Hash className="size-3.5" />
                                                Total
                                            </div>
                                        </th>
                                        <th className="text-left p-4 md:p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[35%]">
                                            <div className="flex items-center gap-2">
                                                <Layers className="size-3.5" />
                                                Edition
                                            </div>
                                        </th>
                                        <th className="text-right p-4 md:p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[15%]">
                                            <div className="flex items-center justify-end gap-2">
                                                <Hash className="size-3.5" />
                                                Qty
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookGroups.map(({ bookTitle, items, totalQty }) => {
                                        const rowCount = items.length;
                                        const author = items[0]?.bookedition?.books?.author || "";
                                        return (
                                            <React.Fragment key={bookTitle}>
                                                {items.map((item: any, idx: number) => (
                                                    <tr
                                                        key={item.id}
                                                        className={cn(
                                                            "transition-colors hover:bg-primarycolor/[0.02]",
                                                            idx === rowCount - 1
                                                                ? "border-b-4 border-primarycolor/20"
                                                                : "border-b border-slate-50"
                                                        )}
                                                    >
                                                        {idx === 0 && (
                                                            <>
                                                                <td
                                                                    rowSpan={rowCount}
                                                                    className="p-4 md:p-6 align-top"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0 mt-0.5">
                                                                            <BookOpen className="size-4" />
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-black text-sm text-primarycolor uppercase tracking-tight leading-tight block">
                                                                                {bookTitle}
                                                                            </span>
                                                                            {author && (
                                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                                    by {author}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    rowSpan={rowCount}
                                                                    className="p-4 md:p-6 align-top text-right"
                                                                >
                                                                    <span className={cn("inline-flex items-center justify-center min-w-[3rem] px-5 py-2 rounded-full font-black text-sm", totalBadgeColor(totalQty))}>
                                                                        {totalQty}
                                                                    </span>
                                                                </td>
                                                            </>
                                                        )}
                                                        <td className="p-4 md:p-6">
                                                            <div className="flex items-center gap-3">
                                                                <Layers className="size-3.5 text-slate-300 shrink-0" />
                                                                <span className="font-bold text-sm text-muted-foreground">
                                                                    {item.bookedition?.edition_name || "N/A"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 md:p-6 text-right">
                                                            <span className="inline-flex items-center justify-center min-w-[3rem] px-4 py-1.5 rounded-full bg-primarycolor/10 text-primarycolor font-black text-sm">
                                                                {item.quantity ?? 0}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            <PrintContentDialog
                open={printDialogOpen}
                onOpenChange={setPrintDialogOpen}
            />
            <TransferBooksDialog
                open={transferDialogOpen}
                onOpenChange={setTransferDialogOpen}
                onSuccess={() => {
                    // Refetch inventory if a store is selected
                    if (selectedStoreId) {
                        setInventoryLoading(true);
                        getStoreInventoryWithDetails(selectedStoreId).then(res => {
                            if (res.success) setInventory(res.data.bookeditionstores || []);
                            setInventoryLoading(false);
                        });
                    }
                }}
            />
        </div>
    );
}
