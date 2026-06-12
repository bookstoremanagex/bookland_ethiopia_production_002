"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseISO } from "date-fns";
import { useCalendar } from "@/lib/calendar-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { approvePayment, checkIsAdminUser } from "@/app/actions/payment-actions";
import { updateCheckStatus, updateCheckDetails } from "@/app/actions/check-actions";
import { updateShopTotals, updateShopDebt } from "@/app/actions/order-actions";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
}

interface ShopInfo {
    id: number;
    name: string;
    location: string;
    phone: string;
    email: string;
    branch: string;
    createdAt: string | Date;
}

interface Totals {
    totalDebt: number;
    totalPaid: number;
    totalRemaining: number;
}

interface Props {
    shop: ShopInfo;
    payments: Payment[];
    totals: Totals;
}

export default function ManagePaymentDetailClient({ shop, payments, totals }: Props) {
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
    const [editingTotals, setEditingTotals] = useState(false);
    const [editingDebt, setEditingDebt] = useState(false);
    const [totalPaidInput, setTotalPaidInput] = useState(String(totals.totalPaid));
    const [totalDebtInput, setTotalDebtInput] = useState(String(totals.totalDebt));
    const [savingTotals, setSavingTotals] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: "debt" | "paid"; value: number; paidValue?: number } | null>(null);
    const [paymentPage, setPaymentPage] = useState(1);
    const perPage = 15;

    useEffect(() => {
        checkIsAdminUser().then(res => setIsAdmin(res.isAdmin));
    }, []);

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
                    {isAdmin && (
                        <div className="relative flex justify-end">
                            <button
                                onClick={() => {
                                    if (editingTotals) {
                                        setEditingTotals(false)
                                        setEditingDebt(false)
                                    } else {
                                        setTotalDebtInput(String(totals.totalDebt))
                                        setTotalPaidInput(String(totals.totalPaid))
                                        setEditingTotals(true)
                                        setEditingDebt(true)
                                    }
                                }}
                                className="text-[8px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                            >
                                {editingTotals ? "Cancel" : "Edit"}
                            </button>
                        </div>
                    )}

                    <div className="space-y-1 relative">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Debt</p>
                        {editingDebt ? (
                            <input
                                type="number"
                                value={totalDebtInput}
                                onChange={e => {
                                    setTotalDebtInput(e.target.value)
                                }}
                                className="w-full h-11 px-4 rounded-xl bg-white/15 text-white font-black text-xl outline-none focus:bg-white/20 border border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        ) : (
                            <p className="text-2xl font-black">{totals.totalDebt.toLocaleString()} ETB</p>
                        )}
                    </div>

                    <div className="space-y-1 relative">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Paid</p>
                        {editingDebt ? (
                            <input
                                type="number"
                                value={totalPaidInput}
                                onChange={e => {
                                    setTotalPaidInput(e.target.value)
                                }}
                                className="w-full h-11 px-4 rounded-xl bg-white/15 text-white font-black text-lg outline-none focus:bg-white/20 border border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        ) : (
                            <p className="text-xl font-bold text-emerald-200">{totals.totalPaid.toLocaleString()} ETB</p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/20 relative">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Remaining</p>
                        <p className={cn(
                            "text-3xl font-black mt-1",
                            (editingDebt
                                ? (parseFloat(totalDebtInput) || 0) - (parseFloat(totalPaidInput) || 0)
                                : totals.totalRemaining) > 0
                                ? "text-rose-200" : "text-emerald-200"
                        )}>
                            {(editingDebt
                                ? (parseFloat(totalDebtInput) || 0) - (parseFloat(totalPaidInput) || 0)
                                : totals.totalRemaining
                            ).toLocaleString()} ETB
                        </p>
                    </div>

                    {editingDebt && (
                        <button
                            onClick={() => {
                                const debt = parseFloat(totalDebtInput)
                                const paid = parseFloat(totalPaidInput)
                                if (isNaN(debt) || debt < 0 || isNaN(paid) || paid < 0) {
                                    toast.error("Enter valid amounts")
                                    return
                                }
                                setConfirmAction({ type: "debt", value: debt, paidValue: paid })
                            }}
                            className="relative w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                            Save Changes
                        </button>
                    )}
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
            </div>

            {/* Payments Section */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 p-6 md:p-8 shadow-xl space-y-6">
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
                                            <span>{formatDate(new Date(payment.createdAt))}</span>
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
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={cn(
                                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                        payment.status === "APPROVED"
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
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
            </div>

            <RecordPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                shopId={shop.id}
                shopName={shop.name}
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

            <AlertDialog open={!!confirmAction} onOpenChange={(o) => { if (!o) setConfirmAction(null) }}>
                <AlertDialogContent className="sm:max-w-md rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm font-black uppercase tracking-widest text-rose-600">
                            ⚠️ Confirm Change
                        </AlertDialogTitle>
                        <div className="text-xs space-y-3">
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                                <div className="font-bold text-rose-800">
                                    You are about to manually adjust the totals for <strong>{shop.name}</strong>.
                                </div>
                                <div className="text-muted-foreground">
                                    Total debt will be set to <strong>{(confirmAction?.value || 0).toLocaleString()} ETB</strong> and total paid to <strong>{(confirmAction?.paidValue || 0).toLocaleString()} ETB</strong>.
                                </div>
                                <div className="text-muted-foreground">
                                    A new adjustment order will be created or existing orders will be modified to match these values.
                                </div>
                                <div className="font-bold text-rose-700">This action cannot be easily undone. Are you sure?</div>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <button className="h-11 px-6 rounded-xl text-xs font-bold border border-border hover:bg-muted transition-colors cursor-pointer">
                                Cancel
                            </button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <button
                                disabled={savingTotals}
                                onClick={async () => {
                                    if (!confirmAction) return
                                    setSavingTotals(true)
                                    try {
                                        const debtRes = await updateShopDebt(shop.id, confirmAction.value)
                                        if (!debtRes.success) { toast.error(debtRes.error); return }
                                        const paidRes = await updateShopTotals(shop.id, confirmAction.paidValue || 0)
                                        if (!paidRes.success) { toast.error(paidRes.error); return }
                                        toast.success("Totals updated")
                                        setEditingDebt(false)
                                        setEditingTotals(false)
                                        setConfirmAction(null)
                                        router.refresh()
                                    } catch {
                                        toast.error("Failed to update")
                                    } finally {
                                        setSavingTotals(false)
                                    }
                                }}
                                className="h-11 px-6 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {savingTotals ? "Saving..." : "Yes, Apply Change"}
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
