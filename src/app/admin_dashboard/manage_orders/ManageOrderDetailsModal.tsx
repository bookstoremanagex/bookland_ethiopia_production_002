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
    BookOpen,
    Settings2,
    CalendarDays,
    Trash2,
    Pencil,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import { toast } from "sonner";
import { getBookStockBreakdown, approveOrder, markOrderDelivered, removeBookFromOrder, removeBooksFromOrder, getShopTotalDebt, deleteOrder, getOrderById } from "@/app/actions/order-actions";
import { OrderModal } from "@/components/deliver_full_dashboard_components/OrderModal";
import RecordPaymentModal from "@/app/admin_dashboard/manage_payment/[id]/RecordPaymentModal";
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
    lockedAmount: number;
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
    onDeleted?: (orderId: number) => void;
    onUpdated?: (order: AdminOrder) => void;
    payments?: Array<{
        id: number;
        amount: number;
        payment_type: string;
        status: string;
        createdAt: string | Date;
        memo: string | null;
        orderid: string | null;
    }>;
}

export default function ManageOrderDetailsModal({ isOpen, onClose, order, onApproved, onDeleted, onUpdated, payments }: Props) {
    const { formatDate, formatDateTime } = useCalendar();
    const [bookBreakdowns, setBookBreakdowns] = useState<BookBreakdown[]>([]);
    const [isLoadingStock, setIsLoadingStock] = useState(false);
    const [bookAllocations, setBookAllocations] = useState<BookAllocEntry[]>([]);
    const [isApproving, setIsApproving] = useState(false);
    const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
    const [isDelivering, setIsDelivering] = useState(false);
    const [selectedGlobalStoreId, setSelectedGlobalStoreId] = useState<number | null>(null);
    const [printOptionsOpen, setPrintOptionsOpen] = useState(false);
    const [printIncludeShop, setPrintIncludeShop] = useState(true);
    const [printIncludeDate, setPrintIncludeDate] = useState(true);
    const [printIncludePrice, setPrintIncludePrice] = useState(true);
    const [printIncludeSubtotal, setPrintIncludeSubtotal] = useState(true);
    const [printIncludeQty, setPrintIncludeQty] = useState(true);
    const [printIncludeEdition, setPrintIncludeEdition] = useState(true);
    const [printIncludeStore, setPrintIncludeStore] = useState(false);
    const [printIncludeStatus, setPrintIncludeStatus] = useState(true);
    const [printIncludeDelivery, setPrintIncludeDelivery] = useState(true);
    const [printFontSize, setPrintFontSize] = useState<"big" | "small" | "very-small" | "extra-small">("small");
    const [printPageWidth, setPrintPageWidth] = useState<"full" | "half">("full");
    const [printStoreMode, setPrintStoreMode] = useState(false);
    const [ignoredBookIds, setIgnoredBookIds] = useState<number[]>([]);
    const [editedEditionQtys, setEditedEditionQtys] = useState<Record<number, Record<number, number>>>({});
    const [advancedBookId, setAdvancedBookId] = useState<number | null>(null);
    const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedBookIds, setSelectedBookIds] = useState<Set<number>>(new Set());
    const [bulkRemoveConfirmOpen, setBulkRemoveConfirmOpen] = useState(false);
    const [isBulkRemoving, setIsBulkRemoving] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editOrderOpen, setEditOrderOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [shopDebt, setShopDebt] = useState<{ orderDebt: number; roundDebt: number; previousDebt: number; lastOrderDebt: number; totalDebt: number } | null>(null);

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
        if (!order || uniqueBooks.length === 0) return;
        setIsLoadingStock(true);
        try {
            const results: BookBreakdown[] = [];
            for (const ub of uniqueBooks) {
                const editionsInOrder = (editionBreakdownPerBook.get(ub.bookId) || []).map(e => e.editionId);
                const res = await getBookStockBreakdown(ub.bookId, editionsInOrder, order.id);
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

    // All unique stores across all breakdowns (for the global radio, deduplicated by storeId)
    const allStores = useMemo(() => {
        const map = new Map<number, { storeStockId: number; storeId: number; storeName: string; type: string }>();
        for (const bd of bookBreakdowns) {
            for (const ed of bd.editions) {
                for (const st of ed.stores) {
                    if (!map.has(st.storeId)) {
                        map.set(st.storeId, { storeStockId: st.storeStockId, storeId: st.storeId, storeName: st.storeName, type: st.type });
                    }
                }
            }
        }
        return Array.from(map.values());
    }, [bookBreakdowns]);

    // When global store changes, just select the store — no auto-fill
    const handleGlobalStoreChange = (storeId: number | null) => {
        setSelectedGlobalStoreId(storeId);
        if (storeId === null) {
            setBookAllocations(prev => prev.map(ba => ({
                ...ba,
                editions: ba.editions.map(ed => ({
                    ...ed,
                    storeAllocations: ed.storeAllocations.map(sa => ({ ...sa, quantity: 0 })),
                })),
            })));
        }
    };

    // Auto-fill all books from the selected store
    const handleAutoFillAll = () => {
        const storeId = selectedGlobalStoreId ?? (allStores.length === 1 ? allStores[0].storeId : null);
        if (storeId === null) return;

        const newAllocations = bookBreakdowns.map((bd, bookIdx) => {
            const edBreakdown = editionBreakdownPerBook.get(bd.bookId);
            if (!edBreakdown) return bookAllocations[bookIdx];
            const prev = bookAllocations[bookIdx] || { bookId: bd.bookId, editions: bd.editions.map(e => ({ editionId: e.editionId, storeAllocations: e.stores.map(s => ({ storeStockId: s.storeStockId, quantity: 0 })) })) };
            return {
                ...prev,
                editions: prev.editions.map((edAlloc, edIdx) => {
                    const editionData = bd.editions[edIdx];
                    if (!editionData) return edAlloc;
                    const fifo = edBreakdown.find((e: any) => e.editionId === editionData.editionId);
                    const need = fifo?.quantity || 0;
                    const storeIdx = editionData.stores.findIndex(s => s.storeId === storeId);
                    const newStoreAllocs = edAlloc.storeAllocations.map((sa, si) => {
                        if (si === storeIdx && storeIdx !== -1) {
                            const take = Math.min(need, editionData.stores[storeIdx].availableQty);
                            return { ...sa, quantity: take };
                        }
                        return { ...sa, quantity: 0 };
                    });
                    return { ...edAlloc, storeAllocations: newStoreAllocs };
                }),
            };
        });

        // Reorder: books fully satisfied by the selected store move to the top;
        // partially satisfied or books not available in the store sink to the bottom.
        // Both arrays are kept parallel so index-based lookups (bookTotals, etc.) stay aligned.
        const pairs = bookBreakdowns.map((bd, i) => {
            const alloc = newAllocations[i];
            const allocatedTotal = (alloc?.editions || []).reduce(
                (s, ed) => s + ed.storeAllocations.reduce((ss, st) => ss + st.quantity, 0),
                0,
            );
            return { bd, alloc, satisfied: allocatedTotal === bd.requestedQty };
        });
        const sorted = [...pairs.filter(p => p.satisfied), ...pairs.filter(p => !p.satisfied)];

        setBookBreakdowns(sorted.map(p => p.bd));
        setBookAllocations(sorted.map(p => p.alloc));
    };

    // Toggle selection mode on/off. Leaving selection mode clears the current selection.
    const toggleSelectionMode = () => {
        setSelectionMode(prev => {
            const next = !prev;
            if (!next) setSelectedBookIds(new Set());
            return next;
        });
    };

    const toggleBookSelection = (bookId: number) => {
        setSelectedBookIds(prev => {
            const next = new Set(prev);
            if (next.has(bookId)) {
                next.delete(bookId);
            } else {
                next.add(bookId);
            }
            return next;
        });
    };

    const selectedBookCount = selectedBookIds.size;

    // Refetch the order after a mutation so the dialog content refreshes in place.
    const refreshOrder = async () => {
        if (!order) return;
        try {
            const res = await getOrderById(order.id);
            if (res.success && res.data && onUpdated) {
                onUpdated(res.data as AdminOrder);
            }
        } catch (error) {
            console.error("Refresh order error:", error);
        }
    };

    const handleBulkRemove = async () => {
        if (!order || selectedBookIds.size === 0) return;
        setIsBulkRemoving(true);
        try {
            const res = await removeBooksFromOrder(order.id, Array.from(selectedBookIds));
            if (res.success) {
                toast.success(`Removed ${res.data?.removedItems ?? selectedBookIds.size} book item(s) from order`);
                setBulkRemoveConfirmOpen(false);
                setSelectionMode(false);
                setSelectedBookIds(new Set());
                await refreshOrder();
            } else {
                toast.error(res.error || "Failed to remove books from order");
            }
        } catch (error) {
            console.error("Bulk remove error:", error);
            toast.error("An unexpected error occurred while removing books");
        } finally {
            setIsBulkRemoving(false);
        }
    };

    useEffect(() => {
        if (isOpen && order) {
            loadStockBreakdowns();
            // Fetch shop total debt (orders + rounds)
            getShopTotalDebt(order.bookshopes?.id).then((res) => {
                if (res.success) {
                    setShopDebt({ orderDebt: res.orderDebt ?? 0, roundDebt: res.roundDebt ?? 0, previousDebt: res.previousDebt ?? 0, lastOrderDebt: res.lastOrderDebt ?? 0, totalDebt: res.totalDebt ?? 0 });
                }
            });
        }
        if (!isOpen) {
            setBookBreakdowns([]);
            setBookAllocations([]);
            setShopDebt(null);
            setIsPaymentModalOpen(false);
        }
    }, [isOpen, order]);

    // When Store is selected, Edition must be on
    useEffect(() => {
        if (printIncludeStore) setPrintIncludeEdition(true);
    }, [printIncludeStore]);

    const fontMap = { "big": "24px", "small": "21px", "very-small": "18px", "extra-small": "15px" } as const;

    const handlePrintWithOptions = () => {
        if (!order) return;
        const fontSize = fontMap[printFontSize];
        const isHalf = printPageWidth === "half";

        const getStoreForEdition = (editionId: number): string => {
            const storeMap = new Map<number, { name: string; qty: number }[]>();
            for (const ba of bookAllocations) {
                for (const ed of ba.editions) {
                    if (ed.editionId !== editionId) continue;
                    for (const sa of ed.storeAllocations) {
                        if (sa.quantity <= 0) continue;
                        for (const bd of bookBreakdowns) {
                            for (const e of bd.editions) {
                                if (e.editionId !== editionId) continue;
                                const s = e.stores.find(st => st.storeStockId === sa.storeStockId);
                                if (s) {
                                    const arr = storeMap.get(editionId) || [];
                                    arr.push({ name: s.storeName, qty: sa.quantity });
                                    storeMap.set(editionId, arr);
                                }
                            }
                        }
                    }
                }
            }
            if (storeMap.has(editionId)) {
                return storeMap.get(editionId)!.map(s => `${s.name} (${s.qty})`).join(", ");
            }
            if (order.is_approved && order.allocation_summary) {
                const item = order.order_items.find(i => i.bookEditionId === editionId);
                const bookTitle = item?.bookedition?.books?.title;
                const edName = item?.bookedition?.edition_name;
                if (bookTitle && edName) {
                    const lines = order.allocation_summary.split('\n');
                    const escapedEd = edName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const edRe = new RegExp(`${escapedEd}:\\s*(\\d+)\\s*units?\\s*→\\s*(.+)`, 'i');
                    let inSection = false;
                    const matches: string[] = [];
                    for (const rawLine of lines) {
                        const line = rawLine.trim();
                        if (line.includes(`"${bookTitle}"`)) {
                            inSection = true;
                            continue;
                        }
                        if (inSection && line === '') {
                            inSection = false;
                            continue;
                        }
                        if (inSection) {
                            const m = line.match(edRe);
                            if (m) {
                                matches.push(`${m[2].trim()} (${m[1]})`);
                            }
                        }
                    }
                    if (matches.length > 0) return matches.join(", ");
                }
            }
            for (const bd of bookBreakdowns) {
                for (const e of bd.editions) {
                    if (e.editionId === editionId && e.stores.length > 0) {
                        return e.stores.map(s => `${s.storeName}`).join(", ");
                    }
                }
            }
            return "-";
        };

        let printContent: string;
        if (printStoreMode) {
            // ── Store Info mode: group by book+edition, show store allocations ──
            const storeRows: string[] = [];
            const editionMap = new Map<number, Map<number, { editionName: string; bookTitle: string; qty: number }>>();
            for (const item of order.order_items) {
                const bid = item.bookedition?.bookId!;
                const eid = item.bookEditionId;
                if (!editionMap.has(bid)) editionMap.set(bid, new Map());
                const sub = editionMap.get(bid)!;
                if (sub.has(eid)) {
                    sub.get(eid)!.qty += item.quantity;
                } else {
                    sub.set(eid, {
                        editionName: item.bookedition?.edition_name || "Unknown",
                        bookTitle: item.bookedition?.books?.title || "Unknown",
                        qty: item.quantity,
                    });
                }
            }
            for (const [, editions] of editionMap) {
                for (const [eid, ed] of editions) {
                    storeRows.push(`<tr><td style="padding:4px 10px;border:1px solid #ddd;font-size:${fontSize}">${ed.bookTitle}</td><td style="padding:4px 10px;border:1px solid #ddd;font-size:${fontSize}">${ed.editionName}</td><td style="padding:4px 10px;border:1px solid #ddd;font-size:${fontSize};text-align:center">${ed.qty}</td><td style="padding:4px 10px;border:1px solid #ddd;font-size:${fontSize}">${getStoreForEdition(eid)}</td></tr>`);
                }
            }

            printContent = `
<!DOCTYPE html>
<html>
<head>
<title>Store Allocation - Order ORD-${order.id}</title>
<style>
  @page {
    size: ${isHalf ? 'A4 portrait' : 'A4 portrait'};
    margin: 8mm;
    @top-center { content: "Order ORD-${order.id}"; font-size: 10px; color: #888; font-weight: bold; }
    @bottom-center { content: "Page " counter(page); font-size: 9px; color: #aaa; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: ${fontSize};
    color: #000;
    ${isHalf ? 'width: 50%; position: fixed; top: 0; left: 0; padding: 16px 24px;' : 'padding: 24px 36px;'}
  }
  .meta { font-size: ${parseInt(fontSize) - 2}px; color: #555; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: ${fontSize}; }
  th { background: #eee; padding: 6px 10px; text-align: left; font-weight: 700; border: 1px solid #bbb; font-size: ${parseInt(fontSize) - 1}px; }
  td { padding: 4px 10px; border: 1px solid #ddd; }
  .sep { border-top: 1.5px solid #888; margin: 6px 0; }
</style>
</head>
<body>
  <div class="meta" style="font-weight:900;font-size:${fontSize}">Order ORD-${order.id}</div>
  <div class="sep"></div>
  <table>
    <thead><tr><th>Book</th><th>Edition</th><th style="text-align:center">Qty</th><th>Store</th></tr></thead>
    <tbody>${storeRows.join('')}</tbody>
  </table>
</body>
</html>`;
        } else {
            // ── Custom print mode ──
            const headers: string[] = ["Book"];
            if (printIncludeEdition) headers.push("Edition");
            if (printIncludeQty) headers.push("Qty");
            if (printIncludePrice) headers.push("Price");
            if (printIncludeSubtotal) headers.push("Subtotal");
            if (printIncludeStore) headers.push("Store");

            const rows = (() => {
                if (printIncludeEdition) {
                    return order.order_items.map((item: any) => {
                        const cells: string[] = [`${item.bookedition?.books?.title || "Unknown"}`];
                        cells.push(item.bookedition?.edition_name || "");
                        if (printIncludeQty) cells.push(String(item.quantity));
                        if (printIncludePrice) cells.push(item.price_at_order.toLocaleString());
                        if (printIncludeSubtotal) cells.push((item.quantity * item.price_at_order).toLocaleString());
                        if (printIncludeStore) cells.push(getStoreForEdition(item.bookEditionId));
                        return `<tr>${cells.map(c => `<td style="padding:4px 10px;border:1px solid #ddd;font-size:${fontSize}">${c}</td>`).join('')}</tr>`;
                    }).join('');
                }
                // Edition OFF: group by book title, merge quantities
                const bookMap = new Map<string, { qty: number; price: number }>();
                for (const item of order.order_items) {
                    const title = item.bookedition?.books?.title || "Unknown";
                    const existing = bookMap.get(title) || { qty: 0, price: item.price_at_order };
                    existing.qty += item.quantity;
                    bookMap.set(title, existing);
                }
                return Array.from(bookMap.entries()).map(([title, data]) => {
                    const cells: string[] = [title];
                    if (printIncludeQty) cells.push(String(data.qty));
                    if (printIncludePrice) cells.push(data.price.toLocaleString());
                    if (printIncludeSubtotal) cells.push((data.qty * data.price).toLocaleString());
                    return `<tr>${cells.map(c => `<td style="padding:4px 10px;border:1px solid #ddd;font-size:${fontSize}">${c}</td>`).join('')}</tr>`;
                }).join('');
            })();

            const metaLines: string[] = [];
            metaLines.push(`<strong>Order ORD-${order.id}</strong>`);
            if (printIncludeShop) metaLines.push(`Shop: <span style="font-weight:900;font-size:${parseInt(fontSize) + 2}px">${order.bookshopes?.name || ''}${order.bookshopes?.branch ? ` (${order.bookshopes.branch})` : ''}</span>`);
            if (printIncludeDate) metaLines.push(`Date: ${formatDate(new Date(order.createdAt))}`);
            if (printIncludeStatus) metaLines.push(`Status: ${order.is_approved ? "Approved" : "Pending"}`);
            if (printIncludeDelivery) metaLines.push(`Delivery: ${order.delivery ? "Delivered" : "Not Delivered"}`);

            printContent = `
<!DOCTYPE html>
<html>
<head>
<title>Order ORD-${order.id}</title>
<style>
  @page {
    size: ${isHalf ? 'A4 portrait' : 'A4 portrait'};
    margin: 8mm;
    @top-center { content: "Order ORD-${order.id}"; font-size: 10px; color: #888; font-weight: bold; }
    @bottom-center { content: "Page " counter(page); font-size: 9px; color: #aaa; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: ${fontSize};
    color: #000;
    ${isHalf ? 'width: 50%; position: fixed; top: 0; left: 0; padding: 16px 24px;' : 'padding: 24px 36px;'}
  }
  .meta { font-size: ${parseInt(fontSize) - 2}px; color: #555; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: ${fontSize}; }
  th { background: #eee; padding: 6px 10px; text-align: left; font-weight: 700; border: 1px solid #bbb; font-size: ${parseInt(fontSize) - 1}px; }
  td { padding: 4px 10px; border: 1px solid #ddd; }
  .sep { border-top: 1.5px solid #888; margin: 6px 0; }
</style>
</head>
<body>
  <div class="meta" style="font-weight:900;font-size:${fontSize}">Order ORD-${order.id}</div>
  ${metaLines.slice(1).map(l => `<div class="meta">${l}</div>`).join('')}
  <div class="sep"></div>
  <table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="sep"></div>
  <div class="meta" style="text-align:right"><strong>Total: ${order.total_amount.toLocaleString()} ETB</strong></div>
  <div class="meta" style="text-align:right">Paid: ${order.amount_paid.toLocaleString()} ETB | Remaining: ${(order.total_amount - order.amount_paid).toLocaleString()} ETB</div>
</body>
</html>`;
        }

        const printWin = window.open('', '_blank', 'width=800,height=600');
        if (!printWin) return;
        printWin.document.write(printContent);
        printWin.document.close();
        printWin.focus();
        printWin.print();
    };

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
    const filteredPayments = (payments || []).filter(
        (p) => p.status === "APPROVED" && (
            p.orderid?.replace(/^ORD-/i, "") === String(order.id) ||
            p.orderid === String(order.id)
        )
    );
    const calculatedPaid = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

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
            if (ignoredBookIds.includes(bd.bookId)) return true;
            const edBreakdown = editionBreakdownPerBook.get(bd.bookId);
            const customQtys = editedEditionQtys[bd.bookId];
            if (!edBreakdown && !customQtys) return false;
            const allocated = bookTotals[i] || 0;
            if (allocated !== bd.requestedQty) return false;
            // Check each edition matches (use edited qtys if available, else FIFO)
            return bd.editions.every((ed, edIdx) => {
                if (customQtys && customQtys[ed.editionId] !== undefined) {
                    const need = customQtys[ed.editionId] || 0;
                    const have = editionTotals[i]?.[edIdx] || 0;
                    return have === need;
                }
                const fifo = edBreakdown?.find((e: any) => e.editionId === ed.editionId);
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



    const handleDeleteOrder = async () => {
        if (!order) return;
        setIsDeleting(true);
        try {
            const res = await deleteOrder(order.id);
            if (res.success) {
                toast.success(`Order ORD-${order.id} deleted`);
                setDeleteConfirmOpen(false);
                onDeleted?.(order.id);
                onClose();
            } else {
                toast.error(res.error || "Failed to delete order");
                setDeleteConfirmOpen(false);
            }
        } catch {
            toast.error("Something went wrong");
            setDeleteConfirmOpen(false);
        } finally {
            setIsDeleting(false);
        }
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
                if (ignoredBookIds.includes(bd.bookId)) continue;
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
            <DialogContent className="sm:max-w-5xl w-full sm:w-[95vw] h-[100dvh] sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-[2.5rem] border-0 sm:border-4 border-primarycolor/5 bg-[#F8FAFC] p-0 overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <DialogHeader className="bg-white p-3 sm:p-8 sm:pb-6 border-b border-slate-100 shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="size-8 sm:size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                                <ShoppingBag className="size-4 sm:size-6" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-base sm:text-2xl md:text-3xl font-black text-primarycolor uppercase italic">
                                    Order <span className="text-secondarycolor not-italic">#ORD-{order.id}</span>
                                </DialogTitle>
                                <DialogDescription className="text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {order.is_approved ? "View complete order information" : "Review & allocate stock to approve this order"}
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap shrink-0">
                            {order.is_approved ? (
                                <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-emerald-100 text-emerald-700 text-[7px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle2 className="size-3" /> Approved
                                </div>
                            ) : (
                                <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-amber-100 text-amber-700 text-[7px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                                    <Clock className="size-3" /> Pending
                                </div>
                            )}
                            <div className={cn(
                                "px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[7px] sm:text-[10px] font-black uppercase tracking-widest",
                                order.order_type === "requested" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                            )}>
                                {order.order_type}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 sm:pb-6 bg-[#F8FAFC] space-y-3 sm:space-y-6">
                    {/* Shop info — always visible */}
                    <div className="bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 border-2 border-primarycolor/5 shadow-sm">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Building2 className="size-5 sm:size-6 text-primarycolor/60 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-black text-primarycolor uppercase text-xs sm:text-base truncate">{order.bookshopes?.name}</p>
                                <p className="text-[8px] sm:text-[9px] font-bold text-muted-foreground truncate">{order.bookshopes?.location}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Placed on</p>
                                <p className="font-bold text-slate-700 text-[10px] sm:text-sm">{formatDate(new Date(order.createdAt))}</p>
                            </div>
                        </div>
                        {shopDebt && shopDebt.totalDebt > 0 && (
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Debt</span>
                                <span className="font-black text-rose-600 text-[10px] sm:text-sm">{shopDebt.totalDebt.toLocaleString()} ETB</span>
                                <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground">
                                    Order: {shopDebt.orderDebt.toLocaleString()} | Last: {shopDebt.lastOrderDebt.toLocaleString()} | Round: {shopDebt.roundDebt.toLocaleString()} | Prev: {shopDebt.previousDebt.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {order.is_approved ? (
                        /* ── APPROVED: Read-only order summary ── */
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border-2 border-primarycolor/5 shadow-sm">
                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                    <div className="text-center p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                                        <p className="font-black text-primarycolor text-sm sm:text-lg mt-0.5">{order.total_amount.toLocaleString()} <span className="text-[7px] sm:text-[8px]">ETB</span></p>
                                    </div>
                                    <div className="text-center p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                        <p className="text-[7px] sm:text-[8px] font-black text-emerald-700 uppercase tracking-widest">Paid</p>
                                        <p className="font-black text-emerald-800 text-sm sm:text-lg mt-0.5">{calculatedPaid.toLocaleString()} <span className="text-[7px] sm:text-[8px]">ETB</span></p>
                                    </div>
                                    <div className="text-center p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-100">
                                        <p className="text-[7px] sm:text-[8px] font-black text-rose-700 uppercase tracking-widest">Remaining</p>
                                        <p className="font-black text-rose-800 text-sm sm:text-lg mt-0.5">{(order.total_amount - calculatedPaid).toLocaleString()} <span className="text-[7px] sm:text-[8px]">ETB</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Ordered items — table on desktop, cards on mobile */}
                            <div className="bg-white rounded-2xl sm:rounded-[2rem] border-2 border-primarycolor/5 shadow-sm overflow-hidden">
                                <div className="p-3 sm:p-5 border-b border-slate-100">
                                    <h4 className="font-black text-primarycolor uppercase italic text-xs sm:text-sm">Ordered Items</h4>
                                </div>
                                {/* Desktop table */}
                                <div className="hidden sm:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-primarycolor/60">Book & Edition</th>
                                                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-primarycolor/60 text-center">Qty</th>
                                                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-primarycolor/60 text-right">Price</th>
                                                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-primarycolor/60 text-right">Subtotal</th>
                                                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-primarycolor/60 text-center">Status</th>
                                                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-primarycolor/60 text-center">Delivery</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.order_items.map((item, i) => (
                                                <tr key={item.id || i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                    <td className="p-3">
                                                        <p className="font-black text-primarycolor text-xs uppercase italic leading-tight">{item.bookedition?.books?.title || "Unknown"}</p>
                                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{item.bookedition?.edition_name}</p>
                                                    </td>
                                                    <td className="p-3 text-center font-bold text-slate-700 text-sm">{item.quantity.toLocaleString()}</td>
                                                    <td className="p-3 text-right font-bold text-slate-600 text-sm">{item.price_at_order.toLocaleString()} ETB</td>
                                                    <td className="p-3 text-right font-black text-primarycolor text-sm">{(item.quantity * item.price_at_order).toLocaleString()} ETB</td>
                                                    <td className="p-3 text-center">
                                                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest">Approved</span>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {order.delivery ? (
                                                            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest">Delivered</span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest">Pending</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile cards */}
                                <div className="sm:hidden divide-y divide-slate-50">
                                    {order.order_items.map((item, i) => (
                                        <div key={item.id || i} className="p-3 space-y-1.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-black text-primarycolor text-[11px] uppercase italic leading-tight truncate">{item.bookedition?.books?.title || "Unknown"}</p>
                                                    <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">{item.bookedition?.edition_name}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-1">
                                                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[6px] font-black uppercase">Approved</span>
                                                    {order.delivery ? (
                                                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[6px] font-black uppercase">Delivered</span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[6px] font-black uppercase">Pending</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-[9px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-600">x{item.quantity}</span>
                                                    <span className="text-muted-foreground">@</span>
                                                    <span className="font-bold text-slate-600">{item.price_at_order.toLocaleString()} ETB</span>
                                                </div>
                                                <span className="font-black text-primarycolor">{(item.quantity * item.price_at_order).toLocaleString()} ETB</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Allocation summary */}
                            {order.allocation_summary && (
                                <div className="bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 border-2 border-emerald-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 sm:mb-4 text-emerald-700">
                                        <Truck className="size-3.5 sm:size-4" />
                                        <h4 className="font-black uppercase tracking-widest text-[10px] sm:text-xs italic">Store Allocation Breakdown</h4>
                                    </div>
                                    <div className="bg-emerald-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-emerald-100">
                                        {order.allocation_summary.split('\n').map((line: string, i: number) => {
                                            if (line.startsWith('📖')) {
                                                return <p key={i} className="font-black text-primarycolor text-[11px] sm:text-sm uppercase italic mt-2 sm:mt-3 first:mt-0 mb-0.5 sm:mb-1">{line.replace('📖 ', '')}</p>;
                                            }
                                            if (line.trim() === '') return null;
                                            return <p key={i} className="text-[9px] sm:text-[11px] font-bold text-slate-700 ml-2 sm:ml-4 py-0.5">{line}</p>;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : isLoadingStock ? (
                        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                            <Loader2 className="size-6 animate-spin text-primarycolor" />
                            <span className="font-bold text-sm">Loading stock availability...</span>
                        </div>
                    ) : bookBreakdowns.length === 0 ? (
                        <div className="flex items-center justify-center py-20 text-muted-foreground">
                            <p className="font-bold text-sm">No stock breakdown data available</p>
                        </div>
                    ) : (
                        <>
                        {/* Global Store Selector */}
                        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 border-2 border-primarycolor/5 shadow-sm space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 text-primarycolor">
                                <Store className="size-4" />
                                <h4 className="font-black uppercase tracking-widest text-[10px] sm:text-xs italic">Select Store for Allocation</h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <label className={cn(
                                    "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-colors",
                                    selectedGlobalStoreId === null
                                        ? "border-primarycolor bg-primarycolor/5"
                                        : "border-slate-100 bg-white hover:border-slate-200"
                                )}>
                                    <input
                                        type="radio"
                                        name="global-store"
                                        checked={selectedGlobalStoreId === null}
                                        onChange={() => handleGlobalStoreChange(null)}
                                        className="size-3.5 sm:size-4 accent-primarycolor"
                                    />
                                    <span className="font-black text-slate-700 text-[10px] sm:text-xs uppercase">None</span>
                                </label>
                                                                {allStores.map(st => (
                                                                    <label
                                                                        key={st.storeId}
                                                                        className={cn(
                                                                            "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-colors",
                                                                            selectedGlobalStoreId === st.storeId
                                                                                ? "border-emerald-300 bg-emerald-50"
                                                                                : "border-slate-100 bg-white hover:border-slate-200"
                                                                        )}
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            name="global-store"
                                                                            checked={selectedGlobalStoreId === st.storeId}
                                                                            onChange={() => handleGlobalStoreChange(st.storeId)}
                                                                            className="size-3.5 sm:size-4 accent-emerald-600"
                                                                        />
                                        {st.type === "printer" ? (
                                            <Printer className="size-3 sm:size-4 text-purple-500 shrink-0" />
                                        ) : (
                                            <Building2 className="size-3 sm:size-4 text-primarycolor/60 shrink-0" />
                                        )}
                                        <span className="font-black text-slate-700 text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-none">{st.storeName}</span>
                                        {st.type === "printer" && (
                                            <span className="px-1 sm:px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[6px] sm:text-[7px] font-black uppercase tracking-widest hidden sm:inline">Printer</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            {bookBreakdowns.length > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAutoFillAll}
                                    disabled={selectedGlobalStoreId === null}
                                    className={cn(
                                        "rounded-xl h-8 sm:h-9 px-3 sm:px-4 gap-1.5 sm:gap-2 border-2 font-black uppercase tracking-widest text-[8px] sm:text-[9px]",
                                        selectedGlobalStoreId === null
                                            ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                            : "border-primarycolor/20 text-primarycolor hover:bg-primarycolor/5"
                                    )}
                                >
                                    <Sparkles className="size-3 sm:size-3.5" /> Auto-Fill All
                                </Button>
                            )}
                        </div>
                        {bookBreakdowns.map((bd, bookIdx) => {
                            const ba = bookAllocations[bookIdx];
                            const allocatedTotal = bookTotals[bookIdx] || 0;
                            const isBookValid = allocatedTotal === bd.requestedQty;
                            const edBreakdown = editionBreakdownPerBook.get(bd.bookId);
                            const imageUrl = (() => {
                                const item = order.order_items.find(i => i.bookedition?.bookId === bd.bookId);
                                return item?.bookedition?.books?.book_image_url || item?.bookedition?.book_image_url || null;
                            })();
                            return (
                                <div key={bd.bookId} className={cn(
                                    "relative bg-white rounded-2xl sm:rounded-[2rem] border-2 shadow-sm overflow-hidden transition-colors",
                                    isBookValid ? "border-emerald-100" : "border-amber-100",
                                    selectionMode && selectedBookIds.has(bd.bookId) && "border-primarycolor ring-2 ring-primarycolor/20"
                                )}>
                                    {selectionMode && (
                                        <button
                                            type="button"
                                            onClick={() => toggleBookSelection(bd.bookId)}
                                            className={cn(
                                                "absolute top-3 right-3 z-20 flex size-7 items-center justify-center rounded-full border-2 bg-white shadow-md transition-all active:scale-90",
                                                selectedBookIds.has(bd.bookId)
                                                    ? "border-primarycolor bg-primarycolor text-white"
                                                    : "border-slate-300 text-transparent hover:border-primarycolor"
                                            )}
                                            aria-label={selectedBookIds.has(bd.bookId) ? `Deselect ${bd.bookTitle}` : `Select ${bd.bookTitle}`}
                                        >
                                            <CheckCircle2 className="size-4" />
                                        </button>
                                    )}
                                    {selectionMode && (
                                        <button
                                            type="button"
                                            onClick={() => toggleBookSelection(bd.bookId)}
                                            className="absolute inset-0 z-10 cursor-pointer"
                                            aria-label={`Toggle selection for ${bd.bookTitle}`}
                                        />
                                    )}
                                    {/* Book Image — horizontal on desktop, compact top bar on mobile */}
                                    <div className="hidden sm:flex w-1/4 shrink-0 bg-white p-5 items-center justify-center border-r-2 border-slate-100">
                                        <div className="w-full max-w-[200px]">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={bd.bookTitle} className="w-full h-auto rounded-xl" />
                                            ) : (
                                                <div className="w-full aspect-[3/4] flex flex-col items-center justify-center bg-primarycolor/5 rounded-xl">
                                                    <BookOpen className="size-16 text-primarycolor/20" />
                                                    <p className="text-[9px] font-bold text-primarycolor/30 uppercase tracking-widest mt-2">
                                                        No Cover
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Mobile: compact image strip */}
                                    {imageUrl && (
                                        <div className="flex sm:hidden items-center gap-3 p-3 bg-slate-50 border-b border-slate-100">
                                            <img src={imageUrl} alt={bd.bookTitle} className="size-12 rounded-lg object-cover shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-black text-primarycolor text-xs uppercase italic truncate">{bd.bookTitle}</p>
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    Requested: {bd.requestedQty} | Allocated: <span className={cn(isBookValid ? "text-emerald-600" : "text-amber-600")}>{allocatedTotal}</span>
                                                </p>
                                            </div>
                                            <div className="shrink-0">
                                                {ignoredBookIds.includes(bd.bookId) ? (
                                                    <div className="px-2 py-1 bg-slate-200 text-slate-600 rounded-full text-[7px] font-black uppercase">Ignored</div>
                                                ) : isBookValid ? (
                                                    <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[7px] font-black uppercase flex items-center gap-0.5">
                                                        <CheckCircle2 className="size-2.5" /> OK
                                                    </div>
                                                ) : (
                                                    <div className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-[7px] font-black uppercase flex items-center gap-0.5">
                                                        <AlertTriangle className="size-2.5" /> {bd.requestedQty - allocatedTotal}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Book Details */}
                                    <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-5">
                                        {/* Book header — compact on mobile when image exists, full otherwise */}
                                        <div className={cn(
                                            "items-start justify-between gap-3 sm:gap-4",
                                            imageUrl ? "hidden sm:flex" : "flex"
                                        )}>
                                            <div className="min-w-0">
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
                                                    const ebd = editionBreakdownPerBook.get(bd.bookId);
                                                    if (!ebd || ebd.length === 0) return null;
                                                    const customQtysForBook = editedEditionQtys[bd.bookId] || {};
                                                    const hasEdits = Object.keys(customQtysForBook).length > 0;
                                                    return (
                                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                            <span className={cn("text-[8px] font-black uppercase tracking-widest", hasEdits ? "text-amber-600" : "text-blue-600")}>
                                                                {hasEdits ? "Edited:" : "FIFO:"}
                                                            </span>
                                                            {ebd.map((ed, idx) => {
                                                                const displayQty = customQtysForBook[ed.editionId] ?? ed.quantity;
                                                                const isChanged = customQtysForBook[ed.editionId] !== undefined && customQtysForBook[ed.editionId] !== ed.quantity;
                                                                return (
                                                                    <span key={ed.editionId} className={cn(
                                                                        "text-[9px] font-bold px-2 py-0.5 rounded-md border",
                                                                        isChanged
                                                                            ? "text-amber-700 bg-amber-50 border-amber-200"
                                                                            : "text-blue-700 bg-blue-50 border-blue-100"
                                                                    )}>
                                                                        {displayQty}× {ed.editionName}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {ignoredBookIds.includes(bd.bookId) ? (
                                                    <div className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                        <Info className="size-3" /> Ignored
                                                    </div>
                                                ) : isBookValid ? (
                                                    <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                        <CheckCircle2 className="size-3" /> Complete
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                        <AlertTriangle className="size-3" /> {bd.requestedQty - allocatedTotal} remaining
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setAdvancedBookId(bd.bookId)}
                                                    className="size-8 rounded-xl border-2 border-slate-200 flex items-center justify-center text-muted-foreground hover:bg-slate-50 hover:border-primarycolor/30 hover:text-primarycolor transition-all active:scale-90"
                                                    title="Advanced operation"
                                                >
                                                    <Settings2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Mobile: advanced button row */}
                                        <div className="flex sm:hidden items-center justify-end -mt-1 mb-1">
                                            <button
                                                onClick={() => setAdvancedBookId(bd.bookId)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-200 text-muted-foreground text-[8px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-primarycolor/30 hover:text-primarycolor transition-all active:scale-95"
                                            >
                                                <Settings2 className="size-3" /> Advanced
                                            </button>
                                        </div>

                                        {/* Editions */}
                                        <div className={cn("space-y-4", ignoredBookIds.includes(bd.bookId) && "opacity-40 pointer-events-none")}>
                                            {bd.editions.length === 0 ? (
                                                <p className="text-[9px] sm:text-[10px] text-muted-foreground italic p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl text-center">No stock available for this book</p>
                                            ) : (
                                                ba && ba.editions.map((edAlloc, edIdx) => {
                                                    const editionData = bd.editions[edIdx];
                                                    if (!editionData) return null;
                                                    const editionTotal = edAlloc.storeAllocations.reduce((s, st) => s + st.quantity, 0);
                                                    const fifo = edBreakdown?.find((e: any) => e.editionId === editionData.editionId);
                                                    const customQty = editedEditionQtys[bd.bookId]?.[editionData.editionId];
                                                    const requiredQty = customQty !== undefined ? customQty : (fifo?.quantity || 0);
                                                    const isEditionValid = editionTotal === requiredQty;

                                                    return (
                                                        <div key={editionData.editionId} className={cn(
                                                            "bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border space-y-2 sm:space-y-3",
                                                            isEditionValid ? "border-emerald-100" : "border-amber-100"
                                                        )}>
                                                            {/* Edition header */}
                                                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                                                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                                    <div className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">
                                                                        {edIdx + 1}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="font-black text-slate-700 text-xs sm:text-sm truncate">{editionData.editionName}</p>
                                                                        <p className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                            {editionData.price.toLocaleString()} ETB / unit
                                                                        </p>
                                                                        {editionData.lockedAmount > 0 && (
                                                                            <p className="text-[7px] sm:text-[8px] font-bold text-rose-600 uppercase tracking-widest mt-0.5">
                                                                                Locked: {editionData.lockedAmount} units
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className={cn(
                                                                    "text-right px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-0.5 shrink-0",
                                                                    isEditionValid ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                                )}>
                                                                    <span>{editionTotal}</span>
                                                                    <span className="text-muted-foreground mx-0.5">/</span>
                                                                    <span>{requiredQty}</span>
                                                                    <span className="ml-0.5 sm:ml-1 hidden xs:inline">required</span>
                                                                </div>
                                                            </div>

                                                            {/* Store allocation inputs */}
                                                            <div className="space-y-1.5 sm:space-y-2">
                                                                <p className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Allocate from stores</p>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                                                                    {editionData.stores.map((store, stIdx) => {
                                                                        const storeAlloc = edAlloc.storeAllocations[stIdx];
                                                                        const currentQty = storeAlloc?.quantity ?? 0;
                                                                        const isValid = currentQty <= store.availableQty;
                                                                        return (
                                                                            <div
                                                                                key={store.storeStockId}
                                                                                className={cn(
                                                                                    "border-2 rounded-xl p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 transition-colors",
                                                                                    currentQty > 0
                                                                                        ? isValid ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
                                                                                        : "border-slate-100 bg-white"
                                                                                )}
                                                                            >
                                                                                <div className="flex items-center justify-between gap-2">
                                                                                    <div className="min-w-0">
                                                                                        <div className="flex items-center gap-1.5">
                                                                                            {store.type === "printer" ? (
                                                                                                <Printer className="size-3 sm:size-3.5 text-purple-500 shrink-0" />
                                                                                            ) : (
                                                                                                <Building2 className="size-3 sm:size-3.5 text-primarycolor/60 shrink-0" />
                                                                                            )}
                                                                                            <p className="font-black text-slate-700 text-[10px] sm:text-xs truncate">{store.storeName}</p>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                                                                                            {store.type === "printer" && (
                                                                                                <span className="px-1 sm:px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[6px] sm:text-[7px] font-black uppercase tracking-widest">Printer</span>
                                                                                            )}
                                                                                            <p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase tracking-widest">
                                                                                                Available: <span className="font-black text-slate-600">{store.availableQty}</span>
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <Input
                                                                                    type="number"
                                                                                    min={0}
                                                                                    max={store.availableQty}
                                                                                    value={currentQty || ""}
                                                                                    onChange={e => handleStoreQtyChange(
                                                                                        bookIdx,
                                                                                        edIdx,
                                                                                        stIdx,
                                                                                        parseInt(e.target.value) || 0
                                                                                    )}
                                                                                    onWheel={e => e.currentTarget.blur()}
                                                                                    inputMode="numeric"
                                                                                    className={cn(
                                                                                        "h-9 sm:h-10 text-center rounded-lg font-bold border-2 text-sm",
                                                                                        currentQty > 0
                                                                                            ? isValid ? "border-emerald-300 focus:border-emerald-500" : "border-rose-300 focus:border-rose-500"
                                                                                            : "border-slate-100 focus:border-primarycolor"
                                                                                    )}
                                                                                />
                                                                                {currentQty > 0 && (
                                                                                    <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 text-center">
                                                                                        Subtotal: {(currentQty * editionData.price).toLocaleString()} ETB
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {editionData.stores.length === 0 && (
                                                                        <p className="text-[10px] text-muted-foreground italic col-span-full text-center py-4">
                                                                            No stock available for this edition
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {!canApprove && bookBreakdowns.length > 0 && (
                            <div className="flex items-start gap-2 sm:gap-3 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                <AlertTriangle className="size-4 sm:size-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                                        Allocation amounts must match requested quantities
                                    </p>
                                    <div className="text-[9px] text-amber-700 mt-1 space-y-0.5">
                                        {bookBreakdowns.map((bd, i) => {
                                            if (ignoredBookIds.includes(bd.bookId)) return null;
                                            if (bookTotals[i] !== bd.requestedQty) {
                                                return <p key={bd.bookId}>• {bd.bookTitle}: {bd.requestedQty - (bookTotals[i] || 0)} more needed</p>;
                                            }
                                            return null;
                                        })}
                                        {ignoredBookIds.length > 0 && (
                                            <p className="text-slate-500 mt-2">{ignoredBookIds.length} book{ignoredBookIds.length > 1 ? "s" : ""} ignored — will not be allocated</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        </>
                    )}

                    {/* Payment Summary */}
                    {calculatedPaid > 0 && (
                        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 border-2 border-emerald-100 shadow-sm">
                            <div className="flex items-center gap-2 text-emerald-700 mb-2 sm:mb-3">
                                <Banknote className="size-3.5 sm:size-4" />
                                <h4 className="font-black uppercase tracking-widest text-[10px] sm:text-xs italic">Payment Summary</h4>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Paid</span>
                                <span className="font-black text-emerald-700 text-sm sm:text-base">{calculatedPaid.toLocaleString()} ETB</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Remaining</span>
                                <span className="font-black text-rose-600 text-sm sm:text-base">{(order.total_amount - calculatedPaid).toLocaleString()} ETB</span>
                            </div>
                            {filteredPayments.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-emerald-100 space-y-1.5">
                                    {filteredPayments.map((payment) => (
                                        <div key={payment.id} className="flex items-center justify-between text-[9px]">
                                            <span className="font-bold text-muted-foreground">{formatDate(new Date(payment.createdAt), "MMM dd, yyyy")}</span>
                                            <span className="font-black text-emerald-700">{payment.amount.toLocaleString()} ETB</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="bg-white px-5 py-3 sm:p-6 border-t border-slate-100 shrink-0 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-center gap-2 sm:gap-4">
                    <div className={cn(
                        "grid gap-2 w-full sm:w-auto sm:flex sm:items-center sm:justify-center sm:gap-2",
                        selectionMode ? "grid-cols-2 sm:flex-wrap" : "grid-cols-2"
                    )}>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2.5 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 shrink-0 w-full sm:w-auto"
                        >
                            {order.is_approved ? "Close" : "Cancel"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 gap-1 shrink-0 w-full sm:w-auto"
                        >
                            <Printer className="size-3 sm:size-3.5" /> Print
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPrintOptionsOpen(true)}
                            className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 gap-1 shrink-0 w-full sm:w-auto"
                        >
                            <Settings2 className="size-3 sm:size-3.5" /> Options
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 border-primarycolor/30 text-primarycolor hover:bg-primarycolor/5 gap-1 shrink-0 w-full sm:w-auto"
                        >
                            <Banknote className="size-3 sm:size-3.5" /> Payment
                        </Button>
                        {!order.is_approved && (
                            <Button
                                variant="outline"
                                onClick={() => setEditOrderOpen(true)}
                                className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 border-primarycolor/30 text-primarycolor hover:bg-primarycolor/5 gap-1 shrink-0 w-full sm:w-auto"
                            >
                                <Pencil className="size-3 sm:size-3.5" /> Edit Order
                            </Button>
                        )}
                        {!order.is_approved && !selectionMode && (
                            <Button
                                variant="outline"
                                onClick={() => setDeleteConfirmOpen(true)}
                                className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 gap-1 shrink-0 w-full sm:w-auto"
                            >
                                <Trash2 className="size-3 sm:size-3.5" /> Delete Order
                            </Button>
                        )}
                        {!order.is_approved && (
                            selectionMode ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={toggleSelectionMode}
                                        className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 border-slate-300 text-slate-600 hover:bg-slate-50 gap-1 shrink-0 w-full sm:w-auto"
                                    >
                                        <X className="size-3 sm:size-3.5" /> Cancel Selection
                                    </Button>
                                    {selectedBookCount > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setBulkRemoveConfirmOpen(true)}
                                            className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] gap-1 shrink-0 w-full sm:w-auto border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                                        >
                                            <Trash2 className="size-3 sm:size-3.5" /> Delete Selected ({selectedBookCount})
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={toggleSelectionMode}
                                    className="rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 sm:px-3 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 gap-1 shrink-0 w-full sm:w-auto"
                                >
                                    <Trash2 className="size-3 sm:size-3.5" /> Delete Selected
                                </Button>
                            )
                        )}
                    </div>
                    {!order.is_approved && (
                        <Button
                            onClick={handleApprove}
                            disabled={!canApprove || isApproving}
                            className={cn(
                                "rounded-xl sm:rounded-2xl h-8 sm:h-9 px-4 sm:px-6 font-black uppercase tracking-widest text-[7px] sm:text-[8px] shadow-xl gap-1 w-full sm:w-auto",
                                canApprove
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            {isApproving ? (
                                <><Loader2 className="size-3 sm:size-3.5 animate-spin" /> Approving...</>
                            ) : (
                                <><CheckCircle2 className="size-3 sm:size-3.5" /> Approve Order</>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <RecordPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            shopId={order?.bookshopes?.id ?? 0}
            shopName={order?.bookshopes?.name || ""}
            orderId={order?.id ?? null}
            orderTotal={order?.total_amount ?? null}
            orderPaid={order?.amount_paid ?? null}
            showPrinterPayment
        />

        {/* Delete Order Confirmation */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogContent className="sm:max-w-md w-full rounded-[2rem] border-0 sm:border-4 border-rose-100 bg-white p-0 overflow-hidden shadow-2xl">
                <AlertDialogHeader className="p-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <Trash2 className="size-5" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-base font-black uppercase italic text-rose-700">
                                Delete this order?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                {order ? `Order ORD-${order.id} · ${order.bookshopes?.name || ""}` : ""}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3 bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
                        <AlertTriangle className="size-6 sm:size-7 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-black text-rose-800 text-sm uppercase tracking-widest">Warning</p>
                            <p className="text-[10px] sm:text-[11px] font-bold text-rose-700 mt-1 leading-relaxed">
                                This will permanently delete this order and revert everything exactly as if it was never placed:
                            </p>
                            <ul className="mt-2 space-y-1 text-[10px] font-bold text-rose-700">
                                <li>• Locked book stock will be released</li>
                                <li>• Associated payment will be removed</li>
                                <li>• All quantities and amounts will be undone</li>
                            </ul>
                            <p className="mt-2 text-[10px] font-black text-rose-600 uppercase tracking-widest">This cannot be undone.</p>
                        </div>
                    </div>
                </div>
                <AlertDialogFooter className="p-5 pt-0 border-t border-slate-100">
                    <div className="flex gap-3 w-full">
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                disabled={isDeleting}
                                onClick={() => setDeleteConfirmOpen(false)}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] border-2"
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={e => {
                                    e.preventDefault();
                                    if (!isDeleting) handleDeleteOrder();
                                }}
                                disabled={isDeleting}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] bg-rose-600 hover:bg-rose-700 text-white shadow-lg gap-1.5"
                            >
                                {isDeleting ? (
                                    <><Loader2 className="size-4 animate-spin" /> Deleting...</>
                                ) : (
                                    <><Trash2 className="size-4" /> Yes, Delete</>
                                )}
                            </Button>
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Remove Selected Books Confirmation */}
        <AlertDialog open={bulkRemoveConfirmOpen} onOpenChange={setBulkRemoveConfirmOpen}>
            <AlertDialogContent className="sm:max-w-lg w-full rounded-[2rem] border-0 sm:border-4 border-rose-100 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                <AlertDialogHeader className="p-6 pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <Trash2 className="size-5" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-base font-black uppercase italic text-rose-700">
                                Remove {selectedBookCount} selected book{selectedBookCount === 1 ? "" : "s"}?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                {order ? `Order ORD-${order.id} · ${order.bookshopes?.name || ""}` : ""}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <div className="p-6 space-y-3 overflow-y-auto flex-1">
                    <div className="flex items-start gap-3 bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
                        <AlertTriangle className="size-6 sm:size-7 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-black text-rose-800 text-sm uppercase tracking-widest">Warning</p>
                            <p className="text-[10px] sm:text-[11px] font-bold text-rose-700 mt-1 leading-relaxed">
                                This will remove the selected books from the order and release any locked stock for them.
                            </p>
                        </div>
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground px-1">Selected books</p>
                    <div className="space-y-1.5">
                        {bookBreakdowns
                            .filter(bd => selectedBookIds.has(bd.bookId))
                            .map((bd, idx) => (
                                <div key={bd.bookId} className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[10px] font-black shrink-0">
                                        {idx + 1}
                                    </span>
                                    <p className="flex-1 min-w-0 font-black text-slate-700 text-xs truncate">{bd.bookTitle}</p>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
                                        {bd.requestedQty} unit{bd.requestedQty === 1 ? "" : "s"}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
                <AlertDialogFooter className="p-5 pt-0 border-t border-slate-100 shrink-0">
                    <div className="flex gap-3 w-full">
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                disabled={isBulkRemoving}
                                onClick={() => setBulkRemoveConfirmOpen(false)}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] border-2"
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={e => {
                                    e.preventDefault();
                                    if (!isBulkRemoving) handleBulkRemove();
                                }}
                                disabled={isBulkRemoving}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] bg-rose-600 hover:bg-rose-700 text-white shadow-lg gap-1.5"
                            >
                                {isBulkRemoving ? (
                                    <><Loader2 className="size-4 animate-spin" /> Removing...</>
                                ) : (
                                    <><Trash2 className="size-4" /> Yes, Remove</>
                                )}
                            </Button>
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        {order && (
            <OrderModal
                shop={{
                    id: order.bookShopId,
                    name: order.bookshopes?.name || "",
                    branch: order.bookshopes?.branch || "",
                    remaining: 0,
                }}
                open={editOrderOpen}
                onClose={() => setEditOrderOpen(false)}
                editMode
                orderId={order.id}
                initialItems={order.order_items.map((item) => ({
                    bookId: item.bookedition?.bookId,
                    title: item.bookedition?.books?.title || "Unknown",
                    author: "",
                    quantity: item.quantity,
                }))}
                initialOrderType={order.order_type}
                initialAmountPaid={order.amount_paid}
                initialLockBooks={(order.locked_editions?.length ?? 0) > 0}
                onUpdated={(updated) => {
                    setEditOrderOpen(false);
                    if (onUpdated) onUpdated(updated as AdminOrder);
                    else onClose();
                }}
            />
        )}

        {/* Print Options Dialog */}
        <Dialog open={printOptionsOpen} onOpenChange={setPrintOptionsOpen}>
            <DialogContent className="sm:max-w-5xl w-full sm:w-[95vw] max-h-[90dvh] sm:max-h-[85vh] rounded-none sm:rounded-[2.5rem] border-0 sm:border-4 border-primarycolor/5 bg-[#F8FAFC] p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="bg-white p-3 sm:p-4 pb-2 sm:pb-3 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="size-7 sm:size-8 rounded-xl sm:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                            <Settings2 className="size-3.5 sm:size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm sm:text-base font-black text-primarycolor uppercase italic">
                                Print <span className="text-secondarycolor not-italic">Options</span>
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
                    {/* Top row: mode toggle + font size + page width */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        {/* Mode toggle */}
                        <div className="bg-white rounded-2xl p-2.5 border-2 border-primarycolor/5">
                            <p className="text-[7px] font-black text-primarycolor uppercase tracking-widest italic mb-1.5">Print Mode</p>
                            <div className="flex gap-1.5">
                                {[
                                    { id: false, label: "Custom" },
                                    { id: true, label: "Store Info" },
                                ].map(mode => (
                                    <label
                                        key={String(mode.id)}
                                        className={cn(
                                            "flex-1 flex items-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer transition-colors",
                                            printStoreMode === mode.id
                                                ? "border-primarycolor bg-primarycolor/5"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="print-mode"
                                            checked={printStoreMode === mode.id}
                                            onChange={() => {
                                                setPrintStoreMode(mode.id);
                                                if (mode.id) {
                                                    setPrintIncludeEdition(true);
                                                    setPrintIncludeQty(true);
                                                }
                                            }}
                                            className="size-3 accent-primarycolor shrink-0"
                                        />
                                        <span className="font-bold text-slate-700 text-[9px] uppercase tracking-widest leading-tight">{mode.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Font size */}
                        <div className="bg-white rounded-2xl p-2.5 border-2 border-primarycolor/5">
                            <p className="text-[7px] font-black text-primarycolor uppercase tracking-widest italic mb-1.5">Font Size</p>
                            <div className="flex flex-wrap gap-1">
                                {(["big", "small", "very-small", "extra-small"] as const).map(size => (
                                    <label
                                        key={size}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-1.5 rounded-xl border-2 cursor-pointer transition-colors",
                                            printFontSize === size
                                                ? "border-primarycolor bg-primarycolor/5"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="font-size"
                                            checked={printFontSize === size}
                                            onChange={() => setPrintFontSize(size)}
                                            className="size-3 accent-primarycolor shrink-0"
                                        />
                                        <span className="font-bold text-slate-700 text-[8px] uppercase tracking-widest">
                                            {size === "big" ? "Big" : size === "small" ? "Small" : size === "very-small" ? "V.Small" : "X.Small"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Page width */}
                        <div className="bg-white rounded-2xl p-2.5 border-2 border-primarycolor/5">
                            <p className="text-[7px] font-black text-primarycolor uppercase tracking-widest italic mb-1.5">Page Width</p>
                            <div className="flex gap-1.5">
                                {(["full", "half"] as const).map(w => (
                                    <label
                                        key={w}
                                        className={cn(
                                            "flex-1 flex items-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer transition-colors",
                                            printPageWidth === w
                                                ? "border-primarycolor bg-primarycolor/5"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="page-width"
                                            checked={printPageWidth === w}
                                            onChange={() => setPrintPageWidth(w)}
                                            className="size-3 accent-primarycolor shrink-0"
                                        />
                                        <span className="font-bold text-slate-700 text-[8px] uppercase tracking-widest">{w === "full" ? "Full" : "Half"}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className={cn("bg-white rounded-2xl p-3 border-2 border-primarycolor/5", printStoreMode && "opacity-40 pointer-events-none")}>
                        <p className="text-[7px] font-black text-primarycolor uppercase tracking-widest italic mb-2">Include in print</p>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: "shop", label: "Book Shop", state: printIncludeShop, set: setPrintIncludeShop },
                                { id: "date", label: "Date", state: printIncludeDate, set: setPrintIncludeDate },
                                { id: "qty", label: "Qty", state: printIncludeQty, set: setPrintIncludeQty },
                                { id: "price", label: "Price", state: printIncludePrice, set: setPrintIncludePrice },
                                { id: "subtotal", label: "Subtotal", state: printIncludeSubtotal, set: setPrintIncludeSubtotal },
                                { id: "edition", label: "Edition", state: printIncludeEdition, set: setPrintIncludeEdition },
                                { id: "store", label: "Store", state: printIncludeStore, set: setPrintIncludeStore },
                                { id: "status", label: "Status", state: printIncludeStatus, set: setPrintIncludeStatus },
                                { id: "delivery", label: "Delivery", state: printIncludeDelivery, set: setPrintIncludeDelivery },
                            ].map(opt => (
                                <label
                                    key={opt.id}
                                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-primarycolor/30 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={opt.state}
                                        disabled={printStoreMode}
                                        onChange={e => opt.set(e.target.checked)}
                                        className="size-3 accent-primarycolor rounded shrink-0"
                                    />
                                    <span className="font-bold text-slate-700 text-[8px] leading-tight whitespace-nowrap">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="bg-white p-2.5 sm:p-3 border-t border-slate-100 shrink-0">
                    <div className="flex gap-2 w-full">
                        <Button
                            variant="outline"
                            onClick={() => setPrintOptionsOpen(false)}
                            className="flex-1 rounded-xl sm:rounded-2xl h-9 sm:h-10 font-black uppercase tracking-widest text-[7px] sm:text-[8px] border-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setPrintOptionsOpen(false);
                                handlePrintWithOptions();
                            }}
                            className="flex-1 rounded-xl sm:rounded-2xl h-9 sm:h-10 font-black uppercase tracking-widest text-[7px] sm:text-[8px] bg-primarycolor hover:bg-secondarycolor text-white shadow-lg gap-1.5"
                        >
                            <Printer className="size-3" /> Print
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Advanced Operation Dialog */}
        <Dialog open={advancedBookId !== null} onOpenChange={o => { if (!o) setAdvancedBookId(null); }}>
            <DialogContent className="sm:max-w-lg w-full sm:w-[95vw] max-h-[90dvh] rounded-none sm:rounded-[2.5rem] border-0 sm:border-4 border-primarycolor/5 p-0 overflow-hidden shadow-2xl flex flex-col">
                <DialogHeader className="bg-white p-5 sm:p-6 pb-4 sm:pb-4 border-b border-slate-100 shrink-0">
                    <DialogTitle className="text-sm sm:text-base font-black text-primarycolor uppercase italic flex items-center gap-2">
                        <Settings2 className="size-4 sm:size-5" /> Advanced Operation
                    </DialogTitle>
                    <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                        {(() => {
                            const bd = bookBreakdowns.find(b => b.bookId === advancedBookId);
                            return bd ? bd.bookTitle : "Unknown book";
                        })()}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-5 sm:p-6 space-y-4 sm:space-y-4 max-h-[60vh] overflow-y-auto flex-1">
                    {(() => {
                        const bd = bookBreakdowns.find(b => b.bookId === advancedBookId);
                        if (!bd) return <p className="text-sm text-muted-foreground">Book not found</p>;
                        const ebd = editionBreakdownPerBook.get(bd.bookId) || [];
                        if (ebd.length === 0) return <p className="text-sm text-muted-foreground">No edition breakdown available</p>;
                        const customQtys = editedEditionQtys[bd.bookId] || {};
                        const fifoTotal = ebd.reduce((s, e) => s + e.quantity * e.price, 0);
                        const editedTotal = ebd.reduce((s, e) => s + (customQtys[e.editionId] ?? e.quantity) * e.price, 0);
                        return (
                            <div className="space-y-2 sm:space-y-3">
                                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground">Edition Quantities</p>
                                {ebd.map((ed) => {
                                    const currentVal = customQtys[ed.editionId] ?? ed.quantity;
                                    return (
                                        <div key={ed.editionId} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-slate-50 rounded-2xl p-4 border-2 border-slate-100">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-slate-700 text-sm">{ed.editionName}</p>
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{ed.price.toLocaleString()} ETB / unit</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={bd.requestedQty}
                                                    value={currentVal}
                                                    inputMode="numeric"
                                                    onChange={e => {
                                                        const v = Math.max(0, Math.min(bd.requestedQty, parseInt(e.target.value) || 0));
                                                        setEditedEditionQtys(prev => ({
                                                            ...prev,
                                                            [bd.bookId]: { ...(prev[bd.bookId] || {}), [ed.editionId]: v },
                                                        }));
                                                    }}
                                                    className="w-20 h-11 text-center font-black text-base rounded-xl border-2 border-primarycolor/20 tabular-nums [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                                <span className="text-[9px] font-bold text-muted-foreground tabular-nums w-20 text-right">
                                                    = {(currentVal * ed.price).toLocaleString()} ETB
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="h-px bg-slate-100" />
                                <div className="flex items-center justify-between text-sm px-1">
                                    <p className="font-bold text-muted-foreground">FIFO Total</p>
                                    <p className="font-black text-slate-700 tabular-nums">{fifoTotal.toLocaleString()} ETB</p>
                                </div>
                                <div className="flex items-center justify-between text-sm px-1">
                                    <p className="font-bold text-muted-foreground">Edited Total</p>
                                    <p className={cn("font-black tabular-nums", editedTotal !== fifoTotal ? "text-amber-600" : "text-slate-700")}>
                                        {editedTotal.toLocaleString()} ETB
                                    </p>
                                </div>
                            </div>
                        );
                    })()}
                </div>
                <DialogFooter className="bg-white p-5 sm:p-4 border-t border-slate-100 shrink-0">
                    {removeConfirmOpen ? (
                        <div className="flex gap-3 w-full">
                            <Button
                                variant="outline"
                                onClick={() => setRemoveConfirmOpen(false)}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] sm:text-[9px] border-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    if (advancedBookId !== null && order) {
                                        const res = await removeBookFromOrder(order.id, advancedBookId);
                                        if (res.success) {
                                            toast.success("Book removed from order");
                                            const removedBookId = advancedBookId;
                                            setAdvancedBookId(null);
                                            setRemoveConfirmOpen(false);
                                            setBookBreakdowns(prev => prev.filter(b => b.bookId !== removedBookId));
                                            await refreshOrder();
                                        } else {
                                            toast.error(res.error || "Failed to remove book");
                                            setRemoveConfirmOpen(false);
                                        }
                                    }
                                }}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] sm:text-[9px] bg-rose-600 hover:bg-rose-700 text-white shadow-lg"
                            >
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-3 w-full">
                            <Button
                                variant="outline"
                                onClick={() => setRemoveConfirmOpen(true)}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] border-2 border-rose-200 text-rose-600 hover:bg-rose-50"
                            >
                                Remove Book
                            </Button>
                            <Button
                                onClick={() => setAdvancedBookId(null)}
                                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] bg-primarycolor hover:bg-secondarycolor text-white shadow-lg"
                            >
                                Confirm
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
