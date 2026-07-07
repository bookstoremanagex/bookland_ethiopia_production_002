"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Store,
    ArrowLeft,
    Plus,
    CheckCircle2,
    Clock,
    Banknote,
    Calendar,
    ChevronLeft,
    ChevronRight,
    FileText,
    Eye,
    Loader2,
    X,
    Upload,
    User,
    DollarSign,
    ImageIcon,
    Truck,
    MoreHorizontal,
    Trash2,
    ListOrdered,
    ShoppingBag,
    Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { parseISO } from "date-fns";
import { useCalendar } from "@/lib/calendar-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { approvePayment, checkIsAdminUser, rejectPayment, deletePayment, setPaymentPending, updatePaymentMemo } from "@/app/actions/payment-actions";
import { setOrderHideRemaining } from "@/app/actions/order-actions";
import { updateCheckStatus, updateCheckDetails } from "@/app/actions/check-actions";
import { updateShopPreviousDebt } from "@/app/actions/book-shop-actions";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ManageOrderDetailsModal from "@/app/admin_dashboard/manage_orders/ManageOrderDetailsModal";
import type { AdminOrder } from "@/app/admin_dashboard/manage_orders/ManageOrdersPageContent";
import RecordPaymentModal from "./RecordPaymentModal";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";


interface CheckInfo {
    id: number;
    bankname: string;
    username: string;
    status: string;
    type?: string;
    amount?: string;
    recordeddate?: string | Date;
    memo?: string;
    imageUrl?: string;
}

interface Payment {
    id: number;
    amount: number;
    payment_type: string;
    status: string;
    checkId: number | null;
    check: CheckInfo | null;
    createdAt: string | Date;
    orderid: string | null;
    memo: string | null;
}

interface ShopInfo {
    id: number;
    name: string;
    location: string;
    phone: string;
    email: string;
    branch: string;
    createdAt: string | Date;
    previousDebt: number;
}

interface Totals {
    totalDebt: number;
    totalPaid: number;
    totalRemaining: number;
}

interface RoundBooksTotals {
    orderCount: number;
    totalAmount: number;
    totalPaid: number;
    remaining: number;
}

interface Props {
    shop: ShopInfo;
    payments: Payment[];
    orders: AdminOrder[];
    totals: Totals;
    previousDebt: number;
    roundBooksTotals: RoundBooksTotals;
}

function timeAgo(date: string | Date): string {
    const now = Date.now();
    const then = new Date(date).getTime();
    const diffMs = now - then;
    if (diffMs < 0) return "just now";
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
}

export default function ManagePaymentDetailClient({ shop, payments, orders, totals, previousDebt, roundBooksTotals }: Props) {
    const { formatDate } = useCalendar();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [selectedCheck, setSelectedCheck] = useState<CheckInfo | null>(null);
    const [isCheckDrawerOpen, setIsCheckDrawerOpen] = useState(false);
    const [clearingCheckId, setClearingCheckId] = useState<number | null>(null);
    const [editingCheck, setEditingCheck] = useState(false);
    const [editForm, setEditForm] = useState({ bankname: "", username: "", type: "", amount: "", recordeddate: "" });
    const [savingCheck, setSavingCheck] = useState(false);

    const [previousDebtValue, setPreviousDebtValue] = useState(previousDebt);
    const [isDebtDialogOpen, setIsDebtDialogOpen] = useState(false);
    const [debtInputValue, setDebtInputValue] = useState(previousDebt.toString());
    const [savingDebt, setSavingDebt] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [paymentOrderId, setPaymentOrderId] = useState<number | null>(null);
    const [isOrderPaymentModalOpen, setIsOrderPaymentModalOpen] = useState(false);

    const [paymentPage, setPaymentPage] = useState(1);
    const perPage = 15;
    const [orderSorting, setOrderSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
    const [orderGlobalFilter, setOrderGlobalFilter] = useState("");
    const [selectedActionPayment, setSelectedActionPayment] = useState<Payment | null>(null);
    const [hideRemToggleOrder, setHideRemToggleOrder] = useState<AdminOrder | null>(null);
    const [hideRemDialogValue, setHideRemDialogValue] = useState(false);
    const [togglingHideRem, setTogglingHideRem] = useState(false);

    useEffect(() => {
        if (hideRemToggleOrder) {
            setHideRemDialogValue(hideRemToggleOrder.hide_remaining);
        }
    }, [hideRemToggleOrder]);
    const [showActionDialog, setShowActionDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"reject" | "delete" | "pending" | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionProcessing, setActionProcessing] = useState(false);
    const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
    const [editingMemoValue, setEditingMemoValue] = useState("");
    const [savingMemoId, setSavingMemoId] = useState<number | null>(null);

    useEffect(() => {
        checkIsAdminUser().then(res => setIsAdmin(res.isAdmin));
    }, []);

    const handleOrderApproved = (updatedOrder: AdminOrder) => {
        setSelectedOrder(null);
        setIsOrderModalOpen(false);
        router.refresh();
    };

    const handleDeliverCheck = async (checkId: number) => {
        setClearingCheckId(checkId);
        try {
            const res = await updateCheckStatus(checkId, "DELIVERED");
            if (res.success) {
                toast.success("Check marked as delivered");
                setIsCheckDrawerOpen(false);
                setSelectedCheck(null);
                router.refresh();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Failed to mark check as delivered");
        } finally {
            setClearingCheckId(null);
        }
    };

    const handleClearCheck = async (checkId: number) => {
        setClearingCheckId(checkId);
        try {
            const res = await updateCheckStatus(checkId, "CLEARED");
            if (res.success) {
                toast.success("Check cleared successfully");
                setIsCheckDrawerOpen(false);
                setSelectedCheck(null);
                router.refresh();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Failed to clear check");
        } finally {
            setClearingCheckId(null);
        }
    };

    const handleApprove = async (paymentId: number) => {
        const payment = payments.find(p => p.id === paymentId);
        if (payment?.payment_type === "CHECK" && payment?.check?.status !== "CLEARED") {
            toast.error("Cannot approve this payment. The linked check must be delivered and cleared first.");
            return;
        }
        setApprovingId(paymentId);
        try {
            const res = await approvePayment(paymentId);
            if (res.success) {
                toast.success("Payment approved successfully");
                router.refresh();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Failed to approve payment");
        } finally {
            setApprovingId(null);
        }
    };

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <Link href="/admin_dashboard/manage_payment">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primarycolor transition-colors w-fit">
                    <ArrowLeft className="size-3.5" /> Back to Payments
                </div>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Shop Info Card */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="size-14 md:size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-inner shrink-0">
                            <Building2 className="size-7 md:size-8" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight italic">
                                {shop.name}
                            </h1>
                            {shop.branch && (
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    {shop.branch}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="size-4 text-primarycolor/40" />
                            <span className="font-semibold">{shop.location}</span>
                        </div>
                        {shop.phone && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="size-4 text-primarycolor/40" />
                                <span className="font-semibold">{shop.phone}</span>
                            </div>
                        )}
                        {shop.email && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="size-4 text-primarycolor/40" />
                                <span className="font-semibold">{shop.email}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Calendar className="size-4 text-primarycolor/40" />
                            <span className="font-semibold">Partner since {formatDate(new Date(shop.createdAt), "MMM yyyy")}</span>
                        </div>
                    </div>
                </div>

                {/* Totals Card */}
                <div className="bg-primarycolor rounded-[2rem] p-6 md:p-8 text-white shadow-xl space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
                    <div className="space-y-1 relative">
                        <div className="flex items-center justify-between">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Previous Debt</p>
                            {isAdmin && (
                                <button
                                    onClick={() => { setDebtInputValue(previousDebtValue.toString()); setIsDebtDialogOpen(true); }}
                                    className="text-[8px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        <p className="text-lg font-black">{previousDebtValue.toLocaleString()} ETB</p>
                    </div>
                    <div className="space-y-1 relative">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Order Debt</p>
                        <p className="text-xl font-black">{(totals.totalDebt - previousDebtValue).toLocaleString()} ETB</p>
                    </div>
                    <div className="pt-4 border-t border-white/20 relative space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Debt</p>
                            <p className="text-2xl font-black">{totals.totalDebt.toLocaleString()} ETB</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Paid</p>
                            <p className="text-xl font-bold text-emerald-200">{totals.totalPaid.toLocaleString()} ETB</p>
                        </div>
                        <div className="pt-3 border-t border-white/20">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Remaining</p>
                            <p className={cn(
                                "text-3xl font-black mt-1",
                                totals.totalRemaining > 0 ? "text-rose-200" : "text-emerald-200"
                            )}>
                                {totals.totalRemaining.toLocaleString()} ETB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Check Summary Card */}
                <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-primarycolor mb-1">
                        <Banknote className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Check Summary</h3>
                    </div>
                    {(() => {
                        const checkPayments = payments.filter(p => p.check)
                        const totalCheckAmount = checkPayments.reduce((sum, p) => sum + (parseFloat(p.check!.amount || "0") || 0), 0)
                        const deliveredAmount = checkPayments
                            .filter(p => p.check!.status === "DELIVERED")
                            .reduce((sum, p) => sum + (parseFloat(p.check!.amount || "0") || 0), 0)
                        const pendingAmount = checkPayments
                            .filter(p => p.check!.status === "PENDING")
                            .reduce((sum, p) => sum + (parseFloat(p.check!.amount || "0") || 0), 0)
                        const clearedAmount = checkPayments
                            .filter(p => p.check!.status === "CLEARED")
                            .reduce((sum, p) => sum + (parseFloat(p.check!.amount || "0") || 0), 0)
                        return (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-primarycolor/5">
                                    <span className="text-[10px] font-bold text-muted-foreground">Total on Checks</span>
                                    <span className="text-sm font-black text-primarycolor">{totalCheckAmount.toLocaleString()} ETB</span>
                                </div>
                                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-blue-50 border border-blue-100">
                                    <span className="text-[10px] font-bold text-blue-600">Delivered</span>
                                    <span className="text-sm font-black text-blue-700">{deliveredAmount.toLocaleString()} ETB</span>
                                </div>
                                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-amber-50 border border-amber-100">
                                    <span className="text-[10px] font-bold text-amber-600">Pending</span>
                                    <span className="text-sm font-black text-amber-700">{pendingAmount.toLocaleString()} ETB</span>
                                </div>
                                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <span className="text-[10px] font-bold text-emerald-600">Cleared</span>
                                    <span className="text-sm font-black text-emerald-700">{clearedAmount.toLocaleString()} ETB</span>
                                </div>
                            </div>
                        )
                    })()}
                </div>

                {/* Round Books Summary Card */}
                <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <ShoppingBag className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Round Books Summary</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-indigo-50 border border-indigo-100">
                            <span className="text-[10px] font-bold text-indigo-600">Total Round Orders</span>
                            <span className="text-sm font-black text-indigo-700">{roundBooksTotals.orderCount}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-primarycolor/5">
                            <span className="text-[10px] font-bold text-muted-foreground">Total Amount</span>
                            <span className="text-sm font-black text-primarycolor">{roundBooksTotals.totalAmount.toLocaleString()} ETB</span>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-100">
                            <span className="text-[10px] font-bold text-emerald-600">Total Paid</span>
                            <span className="text-sm font-black text-emerald-700">{roundBooksTotals.totalPaid.toLocaleString()} ETB</span>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-rose-50 border border-rose-100">
                            <span className="text-[10px] font-bold text-rose-600">Remaining</span>
                            <span className="text-sm font-black text-rose-700">{roundBooksTotals.remaining.toLocaleString()} ETB</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs: Payment History / Orders */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl">
                <Tabs defaultValue="payments">
                    <TabsList className="w-full justify-start gap-0 border-b border-slate-100 rounded-none bg-transparent h-auto pb-0">
                        <TabsTrigger
                            value="payments"
                            className="pb-3 px-1 mr-6 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primarycolor font-black uppercase tracking-widest text-[10px] text-muted-foreground after:opacity-0 data-[state=active]:after:opacity-100 after:bg-primarycolor after:h-0.5 after:absolute after:inset-x-0 after:bottom-0"
                        >
                            <Banknote className="size-3.5 mr-2" />
                            Payment History
                            {payments.length > 0 && (
                                <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded-full bg-primarycolor/10 text-primarycolor font-black">
                                    {payments.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="pb-3 px-1 mr-6 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primarycolor font-black uppercase tracking-widest text-[10px] text-muted-foreground after:opacity-0 data-[state=active]:after:opacity-100 after:bg-primarycolor after:h-0.5 after:absolute after:inset-x-0 after:bottom-0"
                        >
                            <ListOrdered className="size-3.5 mr-2" />
                            Orders
                            {orders.length > 0 && (
                                <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded-full bg-primarycolor/10 text-primarycolor font-black">
                                    {orders.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="payments" className="mt-6 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-primarycolor">
                                <Banknote className="size-5 md:size-6" />
                                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight italic">
                                    Payment <span className="text-secondarycolor not-italic">History</span>
                                </h2>
                            </div>
                            <Button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="bg-primarycolor hover:bg-secondarycolor text-white rounded-xl h-10 px-5 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/20 gap-2"
                            >
                                <Plus className="size-4" /> Record Payment
                            </Button>
                        </div>

                        {payments.length > 0 ? (
                            <div className="space-y-3">
                                {payments
                                    .slice((paymentPage - 1) * perPage, paymentPage * perPage)
                                    .map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primarycolor/20 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "size-11 rounded-xl flex items-center justify-center shrink-0",
                                            payment.status === "APPROVED"
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-amber-100 text-amber-600"
                                        )}>
                                            {payment.status === "APPROVED" ? <CheckCircle2 className="size-5" /> : <Clock className="size-5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-primarycolor">
                                                    {payment.amount.toLocaleString()} ETB
                                                </span>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                    payment.payment_type === "DIRECT"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-purple-100 text-purple-600"
                                                )}>
                                                    {payment.payment_type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold mt-0.5">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="size-3" />
                                                    {formatDate(new Date(payment.createdAt), "MMM dd, yyyy HH:mm")}
                                                </span>
                                                <span className="text-xs text-muted-foreground/70 font-bold italic">
                                                    {timeAgo(payment.createdAt)}
                                                </span>
                                                {payment.orderid ? (() => {
                                                    const rawId = payment.orderid.replace(/^ORD-/i, "");
                                                    const matchedOrder = orders.find((o) => String(o.id) === rawId || String(o.id) === payment.orderid);
                                                    return matchedOrder ? (
                                                        <button
                                                            onClick={() => { setSelectedOrder(matchedOrder); setIsOrderModalOpen(true); }}
                                                            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-all font-black cursor-pointer"
                                                        >
                                                            <ListOrdered className="size-3" />
                                                            #ORD-{rawId}
                                                        </button>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-muted-foreground/50">
                                                            <ListOrdered className="size-3" />
                                                            #ORD-{rawId}
                                                        </span>
                                                    );
                                                })() : (
                                                    <span className="flex items-center gap-1.5 text-muted-foreground/30">
                                                        <ListOrdered className="size-3" />
                                                        No Order
                                                    </span>
                                                )}
                                                {payment.check && (
                                                    <span className="flex items-center gap-2">
                                                        <Store className="size-3" />
                                                        <span>{payment.check.bankname} - {payment.check.username}</span>
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                                                            payment.check.status === "CLEARED"
                                                                ? "bg-emerald-100 text-emerald-600"
                                                                : payment.check.status === "DELIVERED"
                                                                ? "bg-blue-100 text-blue-600"
                                                                : "bg-amber-100 text-amber-600"
                                                        )}>
                                                            {payment.check.status === "CLEARED" ? "Cleared" : payment.check.status === "DELIVERED" ? "Delivered" : "Pending"}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCheck(payment.check!);
                                                                setIsCheckDrawerOpen(true);
                                                            }}
                                                            className="p-1 rounded-lg hover:bg-slate-100 text-muted-foreground hover:text-primarycolor transition-all cursor-pointer"
                                                        >
                                                            <Eye className="size-3.5" />
                                                        </button>
                                                    </span>
                                                )}
                                            </div>
                                            {payment.memo && editingMemoId !== payment.id && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-medium text-muted-foreground/80 leading-relaxed">"{payment.memo}"</span>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => { setEditingMemoId(payment.id); setEditingMemoValue(payment.memo || ""); }}
                                                            className="text-[8px] font-black uppercase tracking-widest text-primarycolor/50 hover:text-primarycolor transition-colors cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            {!payment.memo && editingMemoId !== payment.id && isAdmin && (
                                                <button
                                                    onClick={() => { setEditingMemoId(payment.id); setEditingMemoValue(""); }}
                                                    className="mt-1.5 text-[8px] font-black uppercase tracking-widest text-primarycolor/30 hover:text-primarycolor transition-colors cursor-pointer"
                                                >
                                                    + Add Memo
                                                </button>
                                            )}
                                            {editingMemoId === payment.id && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input
                                                        type="text"
                                                        value={editingMemoValue}
                                                        onChange={(e) => setEditingMemoValue(e.target.value)}
                                                        className="flex-1 h-9 px-3 rounded-xl border-2 border-primarycolor/20 text-sm font-medium outline-none focus:border-primarycolor transition-colors bg-white"
                                                        placeholder="Add a memo..."
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={async () => {
                                                            setSavingMemoId(payment.id);
                                                            try {
                                                                const res = await updatePaymentMemo(payment.id, editingMemoValue);
                                                                if (res.success) {
                                                                    toast.success("Memo updated");
                                                                    setEditingMemoId(null);
                                                                    router.refresh();
                                                                } else {
                                                                    toast.error(res.error);
                                                                }
                                                            } catch {
                                                                toast.error("Failed to update memo");
                                                            } finally {
                                                                setSavingMemoId(null);
                                                            }
                                                        }}
                                                        disabled={savingMemoId === payment.id}
                                                        className="h-9 px-3 rounded-xl bg-primarycolor text-white font-black text-[9px] uppercase tracking-widest hover:bg-secondarycolor transition-all disabled:opacity-40"
                                                    >
                                                        {savingMemoId === payment.id ? "..." : "Save"}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingMemoId(null)}
                                                        className="h-9 px-3 rounded-xl border-2 border-slate-200 text-muted-foreground font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                            payment.status === "APPROVED"
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                                : payment.status === "REJECTED"
                                                ? "bg-rose-50 text-rose-600 border border-rose-200"
                                                : "bg-amber-50 text-amber-600 border border-amber-200"
                                        )}>
                                            {payment.status}
                                        </span>
                                        {payment.status === "PENDING" && isAdmin && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleApprove(payment.id)}
                                                disabled={approvingId === payment.id}
                                                className="h-9 px-4 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-black text-[10px] uppercase tracking-widest gap-1.5"
                                            >
                                                <CheckCircle2 className="size-3.5" />
                                                {approvingId === payment.id ? "..." : "Approve"}
                                            </Button>
                                        )}
                                        {(payment.status === "PENDING" || payment.status === "REJECTED") && isAdmin && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => { setSelectedActionPayment(payment); setShowActionDialog(true); }}
                                                className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 text-muted-foreground hover:text-primarycolor"
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {payments.length > perPage && (
                                <div className="flex items-center justify-between pt-4">
                                    <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                        {payments.length} total
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPaymentPage(p => Math.max(1, p - 1))}
                                            disabled={paymentPage === 1}
                                            className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
                                        >
                                            <ChevronLeft className="size-3 mr-1" /> Prev
                                        </Button>
                                        <span className="text-[10px] font-black text-muted-foreground/50 px-2">
                                            {paymentPage} / {Math.ceil(payments.length / perPage)}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPaymentPage(p => Math.min(Math.ceil(payments.length / perPage), p + 1))}
                                            disabled={paymentPage >= Math.ceil(payments.length / perPage)}
                                            className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
                                        >
                                            Next <ChevronRight className="size-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                            </div>
                        ) : (
                            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                                <Banknote className="size-10 mx-auto text-slate-200 mb-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No payments recorded yet</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="orders" className="mt-6 space-y-6">
                        <div className="flex items-center gap-3 text-primarycolor">
                            <ListOrdered className="size-5 md:size-6" />
                            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight italic">
                                Shop <span className="text-secondarycolor not-italic">Orders</span>
                            </h2>
                        </div>

                        {orders.length > 0 ? (() => {
                            const Label = ({ children }: { children: React.ReactNode }) => (
                                <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/50">{children}</span>
                            );

                            function relativeTime(date: Date): string {
                                const diff = Date.now() - date.getTime();
                                const sec = Math.floor(diff / 1000);
                                if (sec < 60) return "Just now";
                                const min = Math.floor(sec / 60);
                                if (min < 60) return `${min}m ago`;
                                const hrs = Math.floor(min / 60);
                                if (hrs < 24) return `${hrs}h ago`;
                                const days = Math.floor(hrs / 24);
                                if (days < 7) return `${days}d ago`;
                                const weeks = Math.floor(days / 7);
                                if (weeks < 5) return `${weeks}w ago`;
                                const months = Math.floor(days / 30);
                                return `${months}mo ago`;
                            }

                            const orderColumns: ColumnDef<AdminOrder>[] = [
                                {
                                    accessorKey: "id",
                                    header: "Order",
                                    cell: ({ row }) => (
                                        <div className="flex flex-col gap-0.5">
                                            <Label>Order ID</Label>
                                            <span className="font-black text-primarycolor text-sm">#ORD-{row.original.id}</span>
                                        </div>
                                    ),
                                },
                                {
                                    accessorKey: "order_type",
                                    header: "Type",
                                    cell: ({ row }) => (
                                        <div className="flex flex-col gap-1">
                                            <Label>Type</Label>
                                            <span className={cn(
                                                "self-start px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                row.original.order_type === "on round"
                                                    ? "bg-indigo-100 text-indigo-600"
                                                    : "bg-teal-100 text-teal-600"
                                            )}>
                                                {row.original.order_type === "on round" ? "On Round" : "Requested"}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    accessorKey: "createdAt",
                                    header: "Date",
                                    cell: ({ row }) => {
                                        const dt = new Date(row.original.createdAt);
                                        return (
                                            <div className="flex flex-col gap-0.5">
                                                <Label>Date</Label>
                                                <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap" title={formatDate(dt, "MMM dd, yyyy HH:mm")}>
                                                    {formatDate(dt, "MMM dd, yyyy HH:mm")}
                                                </span>
                                                <span className="text-[8px] font-bold text-muted-foreground/40 whitespace-nowrap">
                                                    ({relativeTime(dt)})
                                                </span>
                                            </div>
                                        );
                                    },
                                },
                                {
                                    id: "items",
                                    header: "Items",
                                    cell: ({ row }) => {
                                        const count = row.original.order_items?.length || 0;
                                        const total = row.original.order_items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0;
                                        return (
                                            <div className="flex flex-col gap-0.5">
                                                <Label>Items</Label>
                                                <span className="font-bold text-xs">{count} ({total} books)</span>
                                            </div>
                                        );
                                    },
                                },
                                {
                                    accessorKey: "total_amount",
                                    header: "Total",
                                    cell: ({ row }) => (
                                        <div className="flex flex-col gap-0.5">
                                            <Label>Total</Label>
                                            <span className="font-black text-sm">{(row.original.total_amount || 0).toLocaleString()} ETB</span>
                                        </div>
                                    ),
                                },
                                {
                                    id: "paid",
                                    header: "Paid",
                                    cell: ({ row }) => {
                                        const linkedP = payments.filter(p =>
                                            p.status === "APPROVED" && p.orderid != null &&
                                            (p.orderid === String(row.original.id) || p.orderid === `ORD-${row.original.id}` || p.orderid.replace(/^ORD-/i, "") === String(row.original.id))
                                        );
                                        const paid = linkedP.reduce((s, p) => s + p.amount, 0);
                                        return (
                                            <div className="flex flex-col gap-0.5">
                                                <Label>Paid</Label>
                                                <span className="font-bold text-emerald-600 text-sm">{paid.toLocaleString()} ETB</span>
                                            </div>
                                        );
                                    },
                                },
                                {
                                    id: "remaining",
                                    header: "Rem.",
                                    cell: ({ row }) => {
                                        const linkedP = payments.filter(p =>
                                            p.status === "APPROVED" && p.orderid != null &&
                                            (p.orderid === String(row.original.id) || p.orderid === `ORD-${row.original.id}` || p.orderid.replace(/^ORD-/i, "") === String(row.original.id))
                                        );
                                        const paid = linkedP.reduce((s, p) => s + p.amount, 0);
                                        const remaining = (row.original.total_amount || 0) - paid;
                                        return (
                                            <div className="flex flex-col gap-0.5">
                                                <Label>Remaining</Label>
                                                {row.original.hide_remaining ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setHideRemToggleOrder(row.original); }}
                                                        className={cn("font-bold text-sm px-2 py-0.5 rounded-lg cursor-pointer transition-all self-start", remaining > 0 ? "text-rose-500 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50")}
                                                        title="Hidden — click to reveal"
                                                    >
                                                        X
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setHideRemToggleOrder(row.original); }}
                                                        className={cn("font-bold text-sm cursor-pointer hover:underline transition-all self-start", remaining > 0 ? "text-rose-500" : "text-emerald-600")}
                                                    >
                                                        {remaining.toLocaleString()} ETB
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    },
                                },
                                {
                                    accessorKey: "status",
                                    header: "Status",
                                    cell: ({ row }) => (
                                        <div className="flex flex-col gap-1">
                                            <Label>Status</Label>
                                            <span className={cn(
                                                "self-start px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                                row.original.status === "Approved"
                                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                                    : row.original.status === "Delivered"
                                                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                                                    : row.original.status === "Pending"
                                                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                                                    : "bg-slate-50 text-slate-600 border border-slate-200"
                                            )}>
                                                {row.original.status}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    id: "actions",
                                    header: "",
                                    cell: ({ row }) => (
                                        <div className="flex flex-col gap-1.5">
                                            <Label>Actions</Label>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => { setSelectedOrder(row.original); setIsOrderModalOpen(true); }}
                                                    className="h-7 px-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-primarycolor hover:bg-primarycolor/5"
                                                >
                                                    <Eye className="size-3 mr-1" /> View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); setPaymentOrderId(row.original.id); setIsOrderPaymentModalOpen(true); }}
                                                    className="h-7 px-2.5 rounded-lg bg-primarycolor hover:bg-secondarycolor text-white font-black text-[7px] uppercase tracking-widest gap-1"
                                                >
                                                    <Plus className="size-2.5" /> Pay
                                                </Button>
                                            </div>
                                        </div>
                                    ),
                                },
                            ];

                            const sortedOrders = useMemo(() =>
                                [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
                                [orders]
                            );

                            const orderTable = useReactTable({
                                data: sortedOrders,
                                columns: orderColumns,
                                state: { sorting: orderSorting, globalFilter: orderGlobalFilter },
                                onSortingChange: setOrderSorting,
                                onGlobalFilterChange: setOrderGlobalFilter,
                                getCoreRowModel: getCoreRowModel(),
                                getSortedRowModel: getSortedRowModel(),
                                getFilteredRowModel: getFilteredRowModel(),
                                getPaginationRowModel: getPaginationRowModel(),
                                initialState: { pagination: { pageSize: 15 } },
                            });

                            return (
                                <div className="space-y-4">
                                    <div className="relative max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                        <Input
                                            value={orderGlobalFilter}
                                            onChange={(e) => setOrderGlobalFilter(e.target.value)}
                                            placeholder="Search orders..."
                                            className="h-10 pl-10 rounded-xl border-2 border-slate-100 font-bold text-xs focus:border-primarycolor"
                                        />
                                    </div>
                                    <div className="rounded-2xl border-2 border-slate-100 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                {orderTable.getHeaderGroups().map((hg) => (
                                                    <TableRow key={hg.id}>
                                                        {hg.headers.map((header) => (
                                                            <TableHead key={header.id} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground h-10 px-4">
                                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableHeader>
                                            <TableBody>
                                                {orderTable.getRowModel().rows.map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        className="cursor-pointer hover:bg-primarycolor/[0.02]"
                                                        onClick={() => { setSelectedOrder(row.original); setIsOrderModalOpen(true); }}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id} className="px-4 py-3.5">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                                {orderTable.getRowModel().rows.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={orderColumns.length} className="h-32 text-center">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No orders match your search</p>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                            Page {orderTable.getState().pagination.pageIndex + 1} of {orderTable.getPageCount()} ({orderTable.getFilteredRowModel().rows.length} orders)
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => orderTable.previousPage()}
                                                disabled={!orderTable.getCanPreviousPage()}
                                                className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
                                            >
                                                <ChevronLeft className="size-3 mr-1" /> Prev
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => orderTable.nextPage()}
                                                disabled={!orderTable.getCanNextPage()}
                                                className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
                                            >
                                                Next <ChevronRight className="size-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })() : (
                            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                                <ListOrdered className="size-10 mx-auto text-slate-200 mb-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No orders found for this shop</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Previous Debt Edit Warning Dialog */}
            <AlertDialog open={isDebtDialogOpen} onOpenChange={setIsDebtDialogOpen}>
                <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                            Edit Previous Debt
                        </AlertDialogTitle>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                                ⚠ Warning: This will change the total debt calculation
                            </p>
                            <p className="text-[9px] font-black text-muted-foreground">
                                Enter the new previous debt amount for <span className="text-primarycolor">{shop.name}</span>.
                                Total debt is the sum of order debt and previous debt.
                            </p>
                        </div>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Previous Debt (ETB)</label>
                        <input
                            type="number"
                            value={debtInputValue}
                            onChange={e => setDebtInputValue(e.target.value)}
                            className="w-full h-12 px-4 rounded-2xl border-2 border-primarycolor/10 bg-white font-bold text-sm outline-none focus:border-primarycolor transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            autoFocus
                        />
                        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                            <p className="text-[9px] font-bold text-amber-700">
                                New Total Debt: {(totals.totalDebt - previousDebtValue + (parseFloat(debtInputValue) || 0)).toLocaleString()} ETB
                            </p>
                            <p className="text-[9px] font-bold text-amber-700">
                                New Remaining: {(totals.totalDebt - previousDebtValue + (parseFloat(debtInputValue) || 0) - totals.totalPaid).toLocaleString()} ETB
                            </p>
                        </div>
                    </div>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel asChild>
                            <Button variant="outline" className="h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex-1">
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={async () => {
                                    setSavingDebt(true)
                                    try {
                                        const res = await updateShopPreviousDebt(shop.id, parseFloat(debtInputValue) || 0)
                                        if (res.success) {
                                            setPreviousDebtValue(parseFloat(debtInputValue) || 0)
                                            toast.success("Previous debt updated")
                                            setIsDebtDialogOpen(false)
                                            router.refresh()
                                        } else {
                                            toast.error(res.error)
                                        }
                                    } catch {
                                        toast.error("Failed to update previous debt")
                                    } finally {
                                        setSavingDebt(false)
                                    }
                                }}
                                disabled={savingDebt}
                                className="h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[10px] flex-1"
                            >
                                {savingDebt ? "Saving..." : "Save"}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <RecordPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                shopId={shop.id}
                shopName={shop.name}
            />

            <RecordPaymentModal
                isOpen={isOrderPaymentModalOpen}
                onClose={() => { setIsOrderPaymentModalOpen(false); setPaymentOrderId(null); }}
                shopId={shop.id}
                shopName={shop.name}
                orderId={paymentOrderId}
            />

            {/* Payment Action Dialog */}
            <AlertDialog open={showActionDialog} onOpenChange={(o) => { if (!o) { setShowActionDialog(false); setSelectedActionPayment(null); } }}>
                <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-0 max-w-sm overflow-hidden">
                    <AlertDialogHeader className="p-6 pb-4 border-b border-slate-100">
                        <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                            Payment Options
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            {selectedActionPayment?.amount.toLocaleString()} ETB — {selectedActionPayment?.payment_type}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="p-4 space-y-2">
                        {selectedActionPayment?.status === "PENDING" && (
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] gap-3 justify-start px-5"
                                onClick={() => {
                                    setShowActionDialog(false);
                                    setTimeout(() => {
                                        setConfirmAction("reject");
                                        setShowConfirmDialog(true);
                                    }, 200);
                                }}
                            >
                                <X className="size-4" /> Reject Payment
                            </Button>
                        )}
                        {selectedActionPayment?.status === "REJECTED" && (
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-2 border-amber-200 text-amber-600 hover:bg-amber-50 font-black uppercase tracking-widest text-[10px] gap-3 justify-start px-5"
                                onClick={() => {
                                    setShowActionDialog(false);
                                    setTimeout(() => {
                                        setConfirmAction("pending");
                                        setShowConfirmDialog(true);
                                    }, 200);
                                }}
                            >
                                <Clock className="size-4" /> Set as Pending
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="w-full h-14 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 font-black uppercase tracking-widest text-[10px] gap-3 justify-start px-5"
                            onClick={() => {
                                setShowActionDialog(false);
                                setTimeout(() => {
                                    setConfirmAction("delete");
                                    setShowConfirmDialog(true);
                                }, 200);
                            }}
                        >
                            <Trash2 className="size-4" /> Remove Payment
                        </Button>
                    </div>
                    <AlertDialogFooter className="p-4 pt-0">
                        <AlertDialogCancel asChild>
                            <Button variant="ghost" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm Action Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                            {confirmAction === "reject" ? "Reject Payment" : confirmAction === "pending" ? "Set as Pending" : "Remove Payment"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
                            {confirmAction === "reject"
                                ? `Are you sure you want to reject this payment of ${selectedActionPayment?.amount.toLocaleString()} ETB? This will change the status to REJECTED.`
                                : confirmAction === "pending"
                                ? `Are you sure you want to set this payment of ${selectedActionPayment?.amount.toLocaleString()} ETB back to PENDING?`
                                : `Are you sure you want to permanently remove this payment of ${selectedActionPayment?.amount.toLocaleString()} ETB? This action cannot be undone.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 pt-2">
                        <AlertDialogCancel asChild>
                            <Button variant="outline" className="h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex-1">
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={async () => {
                                    if (!selectedActionPayment) return;
                                    setActionProcessing(true);
                                    try {
                                        let res;
                                        if (confirmAction === "reject") res = await rejectPayment(selectedActionPayment.id);
                                        else if (confirmAction === "pending") res = await setPaymentPending(selectedActionPayment.id);
                                        else res = await deletePayment(selectedActionPayment.id);
                                        if (res.success) {
                                            toast.success(confirmAction === "reject" ? "Payment rejected" : confirmAction === "pending" ? "Payment set to pending" : "Payment removed");
                                            setShowConfirmDialog(false);
                                            setSelectedActionPayment(null);
                                            router.refresh();
                                        } else {
                                            toast.error(res.error);
                                        }
                                    } catch {
                                        toast.error("Failed to process");
                                    } finally {
                                        setActionProcessing(false);
                                    }
                                }}
                                disabled={actionProcessing}
                                className={cn(
                                    "h-12 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] flex-1",
                                    confirmAction === "reject" ? "bg-rose-600 hover:bg-rose-700" : confirmAction === "pending" ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-700 hover:bg-slate-800"
                                )}
                            >
                                {actionProcessing ? "Processing..." : confirmAction === "reject" ? "Reject" : confirmAction === "pending" ? "Set Pending" : "Remove"}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Order Detail Modal */}
            <ManageOrderDetailsModal
                isOpen={isOrderModalOpen}
                onClose={() => { setIsOrderModalOpen(false); setSelectedOrder(null); }}
                order={selectedOrder}
                onApproved={handleOrderApproved}
                payments={payments}
            />

            {/* Check Detail Drawer */}
            <Drawer open={isCheckDrawerOpen} onOpenChange={(o) => { if (!o) { setIsCheckDrawerOpen(false); setSelectedCheck(null); setEditingCheck(false); } }}>
                <DrawerContent className="rounded-t-[2rem] border-t-4 border-primarycolor/5">
                    <DrawerHeader className="text-left px-6 pt-6 pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <DrawerTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                                    Check <span className="text-secondarycolor not-italic">Details</span>
                                </DrawerTitle>
                                <DrawerDescription className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    {selectedCheck?.bankname} — {selectedCheck?.username}
                                </DrawerDescription>
                            </div>
                            {isAdmin && selectedCheck && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (editingCheck) {
                                            setEditingCheck(false)
                                        } else {
                                            const d = selectedCheck.recordeddate
                                                ? new Date(typeof selectedCheck.recordeddate === "string" ? parseISO(selectedCheck.recordeddate) : selectedCheck.recordeddate)
                                                : null
                                            setEditForm({
                                                bankname: selectedCheck.bankname || "",
                                                username: selectedCheck.username || "",
                                                type: selectedCheck.type || "",
                                                amount: selectedCheck.amount || "",
                                                recordeddate: d ? d.toISOString().split("T")[0] : "",
                                            })
                                            setEditingCheck(true)
                                        }
                                    }}
                                    className="rounded-xl text-[10px] font-black uppercase tracking-widest h-9"
                                >
                                    {editingCheck ? "Cancel" : "Edit"}
                                </Button>
                            )}
                        </div>
                    </DrawerHeader>

                    <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[60vh]">
                        {selectedCheck?.imageUrl && !editingCheck && (
                            <div className="rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                                <img
                                    src={selectedCheck.imageUrl}
                                    alt="Check image"
                                    className="w-full h-48 object-contain bg-white"
                                />
                            </div>
                        )}

                        {editingCheck ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Bank</label>
                                    <input
                                        value={editForm.bankname}
                                        onChange={e => setEditForm(f => ({ ...f, bankname: e.target.value }))}
                                        className="w-full h-12 px-4 rounded-2xl border-2 border-primarycolor/10 bg-white font-bold text-sm outline-none focus:border-primarycolor transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Username</label>
                                    <input
                                        value={editForm.username}
                                        onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                                        className="w-full h-12 px-4 rounded-2xl border-2 border-primarycolor/10 bg-white font-bold text-sm outline-none focus:border-primarycolor transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Type</label>
                                    <select
                                        value={editForm.type}
                                        onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                                        className="w-full h-12 px-4 rounded-2xl border-2 border-primarycolor/10 bg-white font-bold text-sm outline-none focus:border-primarycolor transition-colors"
                                    >
                                        <option value="">—</option>
                                        <option value="COLLATERAL">COLLATERAL</option>
                                        <option value="PAYMENT">PAYMENT</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Amount</label>
                                    <input
                                        value={editForm.amount}
                                        onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))}
                                        readOnly={selectedCheck?.status === "CLEARED"}
                                        className={cn(
                                            "w-full h-12 px-4 rounded-2xl border-2 border-primarycolor/10 bg-white font-bold text-sm outline-none transition-colors",
                                            selectedCheck?.status === "CLEARED"
                                                ? "opacity-50 cursor-not-allowed"
                                                : "focus:border-primarycolor"
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Date</label>
                                    <input
                                        type="date"
                                        value={editForm.recordeddate}
                                        onChange={e => setEditForm(f => ({ ...f, recordeddate: e.target.value }))}
                                        className="w-full h-12 px-4 rounded-2xl border-2 border-primarycolor/10 bg-white font-bold text-sm outline-none focus:border-primarycolor transition-colors"
                                    />
                                </div>
                                <Button
                                    onClick={async () => {
                                        if (!selectedCheck) return
                                        setSavingCheck(true)
                                        try {
                                            const res = await updateCheckDetails(selectedCheck.id, editForm)
                                            if (res.success) {
                                                toast.success("Check updated")
                                                setEditingCheck(false)
                                                router.refresh()
                                            } else {
                                                toast.error(res.error)
                                            }
                                        } catch {
                                            toast.error("Failed to save")
                                        } finally {
                                            setSavingCheck(false)
                                        }
                                    }}
                                    disabled={savingCheck}
                                    className="w-full h-12 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg gap-2"
                                >
                                    {savingCheck ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        ) : (
                            <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Building2 className="size-3.5 text-primarycolor/40" />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Bank</p>
                                </div>
                                <p className="font-black text-primarycolor text-sm">{selectedCheck?.bankname || "—"}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2">
                                    <User className="size-3.5 text-primarycolor/40" />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Username</p>
                                </div>
                                <p className="font-black text-primarycolor text-sm">{selectedCheck?.username || "—"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="size-3.5 text-primarycolor/40" />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Type</p>
                                </div>
                                <p className="font-black text-primarycolor text-sm">{selectedCheck?.type || "—"}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="size-3.5 text-primarycolor/40" />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Amount</p>
                                </div>
                                <p className="font-black text-primarycolor text-sm">{selectedCheck?.amount ? `${selectedCheck.amount} ETB` : "—"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-3.5 text-primarycolor/40" />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Date</p>
                                </div>
                                <p className="font-black text-primarycolor text-sm">
                                    {selectedCheck?.recordeddate
                                        ? formatDate(typeof selectedCheck.recordeddate === "string" ? parseISO(selectedCheck.recordeddate) : selectedCheck.recordeddate)
                                        : "—"}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-3.5 text-primarycolor/40" />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                                </div>
                                <span className={cn(
                                    "inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                    selectedCheck?.status === "CLEARED"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : selectedCheck?.status === "DELIVERED"
                                        ? "bg-blue-100 text-blue-700"
                                        : selectedCheck?.status === "BOUNCED"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                                )}>
                                    {selectedCheck?.status || "—"}
                                </span>
                            </div>
                        </div>

                        {selectedCheck?.memo && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="size-3.5 text-primarycolor/40" />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Memo</p>
                                </div>
                                <p className="font-bold text-primarycolor text-sm">{selectedCheck.memo}</p>
                            </div>
                        )}
                            </>
                        )}
                    </div>

                    <DrawerFooter className="px-6 pb-8 pt-2 flex-row gap-3">
                        <DrawerClose asChild>
                            <Button variant="outline"
                                className="flex-1 h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
                                Close
                            </Button>
                        </DrawerClose>
                        {!editingCheck && selectedCheck && selectedCheck.status === "PENDING" && isAdmin && (
                            <Button
                                onClick={() => handleDeliverCheck(selectedCheck.id)}
                                disabled={clearingCheckId === selectedCheck.id}
                                className="flex-[2] h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-600/20 gap-2"
                            >
                                {clearingCheckId === selectedCheck.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Truck className="size-4" />
                                )}
                                {clearingCheckId === selectedCheck.id ? "Delivering..." : "Mark as Delivered"}
                            </Button>
                        )}
                        {!editingCheck && selectedCheck && selectedCheck.status === "DELIVERED" && isAdmin && (
                            <Button
                                onClick={() => handleClearCheck(selectedCheck.id)}
                                disabled={clearingCheckId === selectedCheck.id}
                                className="flex-[2] h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2"
                            >
                                {clearingCheckId === selectedCheck.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="size-4" />
                                )}
                                {clearingCheckId === selectedCheck.id ? "Clearing..." : "Clear Check"}
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Dialog open={!!hideRemToggleOrder} onOpenChange={(o) => { if (!o) setHideRemToggleOrder(null); }}>
                <DialogContent className="sm:max-w-sm rounded-[2rem] border-4 border-primarycolor/5 p-0 overflow-hidden shadow-2xl bg-white" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader className="p-5 pb-3 border-b border-slate-100">
                        <DialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                            Hide Remaining Amount
                        </DialogTitle>
                        <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                            Order #ORD-{hideRemToggleOrder?.id}
                        </DialogDescription>
                    </DialogHeader>
                    {hideRemToggleOrder && (
                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-black text-slate-800">Hide remaining amount</p>
                                    <p className="text-[9px] font-bold text-muted-foreground">Show "X" instead of the amount in the table</p>
                                </div>
                                <Checkbox
                                    checked={hideRemDialogValue}
                                    onCheckedChange={(checked) => setHideRemDialogValue(checked === true)}
                                    className="size-6 rounded-lg border-2 border-primarycolor/30 data-[state=checked]:bg-primarycolor data-[state=checked]:border-primarycolor"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="bg-slate-50 p-4 border-t border-slate-100 flex flex-row items-center justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setHideRemToggleOrder(null)}
                            className="rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={togglingHideRem}
                            onClick={async () => {
                                if (!hideRemToggleOrder) return;
                                setTogglingHideRem(true);
                                try {
                                    const res = await setOrderHideRemaining(hideRemToggleOrder.id, hideRemDialogValue);
                                    if (res.success) {
                                        toast.success(hideRemDialogValue ? "Remaining amount hidden" : "Remaining amount revealed");
                                        setHideRemToggleOrder(null);
                                        router.refresh();
                                    } else {
                                        toast.error(res.error);
                                    }
                                } catch {
                                    toast.error("Failed to update");
                                } finally {
                                    setTogglingHideRem(false);
                                }
                            }}
                            className="rounded-xl h-10 px-5 bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primarycolor/20"
                        >
                            {togglingHideRem ? <Loader2 className="size-4 animate-spin" /> : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
