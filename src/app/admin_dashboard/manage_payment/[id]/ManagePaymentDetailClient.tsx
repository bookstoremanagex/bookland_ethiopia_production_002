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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { approvePayment, checkIsAdminUser } from "@/app/actions/payment-actions";
import RecordPaymentModal from "./RecordPaymentModal";

interface CheckInfo {
    id: number;
    bankname: string;
    username: string;
    status: string;
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
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [approvingId, setApprovingId] = useState<number | null>(null);

    useEffect(() => {
        checkIsAdminUser().then(res => setIsAdmin(res.isAdmin));
    }, []);

    const handleApprove = async (paymentId: number) => {
        const payment = payments.find(p => p.id === paymentId);
        if (payment?.payment_type === "CHECK" && payment?.check?.status !== "CLEARED") {
            toast.error("Cannot approve this payment. Please approve the linked check first.");
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
                            <span className="font-semibold">Partner since {format(new Date(shop.createdAt), "MMM yyyy")}</span>
                        </div>
                    </div>
                </div>

                {/* Totals Card */}
                <div className="bg-primarycolor rounded-[2rem] p-6 md:p-8 text-white shadow-xl space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
                    <div className="space-y-1 relative">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Debt</p>
                        <p className="text-2xl font-black">{totals.totalDebt.toLocaleString()} ETB</p>
                    </div>
                    <div className="space-y-1 relative">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Paid</p>
                        <p className="text-xl font-bold text-emerald-200">{totals.totalPaid.toLocaleString()} ETB</p>
                    </div>
                    <div className="pt-4 border-t border-white/20 relative">
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
                        {payments.map((payment) => (
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
                                            <span>{format(new Date(payment.createdAt), "MMM dd, yyyy")}</span>
                                            {payment.check && (
                                                <span className="flex items-center gap-2">
                                                    <Store className="size-3" />
                                                    <span>{payment.check.bankname} - {payment.check.username}</span>
                                                    <span className={cn(
                                                        "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                                                        payment.check.status === "CLEARED"
                                                            ? "bg-emerald-100 text-emerald-600"
                                                            : "bg-amber-100 text-amber-600"
                                                    )}>
                                                        {payment.check.status === "CLEARED" ? "Cleared" : "Pending"}
                                                    </span>
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
        </div>
    );
}
