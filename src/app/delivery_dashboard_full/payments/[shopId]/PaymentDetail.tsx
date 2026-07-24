"use client";

import { useState, useMemo } from "react";
import { useCalendar } from "@/lib/calendar-context";
import {
  ArrowLeft,
  Store,
  MapPin,
  Banknote,
  CheckCircle2,
  Clock,
  XCircle,
  Landmark,
  Calendar,
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  ListOrdered,
  ShoppingBag,
  Repeat,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { deletePayment } from "@/app/actions/payment-actions";
import { createRoundPayment, createRoundCheck } from "@/app/delivery_dashboard_full/round-books/actions";
import { DateInput } from "@/components/ui/date-input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { AdminOrder } from "@/app/admin_dashboard/manage_orders/ManageOrdersPageContent";
import DeliverOrderDetailModal from "@/components/deliver_full_dashboard_components/DeliverOrderDetailModal";
import RecordPaymentModal from "@/components/deliver_full_dashboard_components/RecordPaymentModal";

type CheckInfo = {
  id: number;
  bankname: string | null;
  username: string | null;
  status: string;
  amount: string | null;
} | null;

type Payment = {
  id: number;
  amount: number;
  payment_type: string;
  status: string;
  checkId: number | null;
  check: CheckInfo;
  createdAt: string;
  orderid: string | null;
  memo: string | null;
};

type RoundRecord = {
  id: number;
  totalprice: number;
  status: string;
  createdAt: string;
  bookTitle: string;
  bookAuthor: string;
  startingAmount: number;
  returnedAmount: number;
  payments: {
    id: number;
    amount: number;
    payment_type: string;
    status: string;
    check: {
      bankname: string | null;
      username: string | null;
      amount: string | null;
      status: string;
    } | null;
  }[];
};

type RoundPayment = {
  id: number;
  amount: number;
  payment_type: string;
  status: string;
  createdAt: string;
  memo: string | null;
  check: {
    bankname: string | null;
    username: string | null;
    amount: string | null;
    status: string;
  } | null;
  bookTitle: string;
};

type ShopData = {
  id: number;
  name: string;
  branch: string;
  remaining: number;
  payments: Payment[];
  orders: AdminOrder[];
  roundRecords: RoundRecord[];
  roundPayments: RoundPayment[];
};

const statusConfig: Record<string, { icon: any; label: string; bg: string; text: string }> = {
  APPROVED: { icon: CheckCircle2, label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700" },
  PENDING: { icon: Clock, label: "Pending", bg: "bg-amber-50", text: "text-amber-700" },
  REJECTED: { icon: XCircle, label: "Rejected", bg: "bg-rose-50", text: "text-rose-700" },
};

function PaymentStatus({ status }: { status: string }) {
  const s = statusConfig[status] || { icon: XCircle, label: status, bg: "bg-slate-50", text: "text-slate-700" };
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider", s.bg, s.text)}>
      <Icon className="size-3" />
      {s.label}
    </span>
  );
}

export default function PaymentDetail({ shop }: { shop: ShopData }) {
  const router = useRouter();
  const { formatShort, formatDateTime } = useCalendar();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionPayment, setActionPayment] = useState<Payment | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedRoundRecord, setSelectedRoundRecord] = useState<RoundRecord | null>(null);
  const [showRoundDetail, setShowRoundDetail] = useState(false);
  const [showRoundPayment, setShowRoundPayment] = useState(false);
  const [roundPaymentType, setRoundPaymentType] = useState("DIRECT");
  const [roundPaymentAmount, setRoundPaymentAmount] = useState("");
  const [roundPaymentMemo, setRoundPaymentMemo] = useState("");
  const [isSubmittingRoundPayment, setIsSubmittingRoundPayment] = useState(false);
  const [roundCheckBankName, setRoundCheckBankName] = useState("");
  const [roundCheckHolder, setRoundCheckHolder] = useState("");
  const [roundCheckAmount, setRoundCheckAmount] = useState("");
  const [roundCheckDate, setRoundCheckDate] = useState("");
  const [roundCheckMemo, setRoundCheckMemo] = useState("");

  const handleOrderDetailClose = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(false);
    router.refresh();
  };

  const handleSubmitRoundPayment = async () => {
    if (!selectedRoundRecord) return;
    const amount = parseFloat(roundPaymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsSubmittingRoundPayment(true);
    try {
      let checkId: number | null = null;

      if (roundPaymentType === "CHECK") {
        if (!roundCheckBankName.trim() || !roundCheckHolder.trim()) {
          toast.error("Bank name and holder name are required");
          setIsSubmittingRoundPayment(false);
          return;
        }
        const checkRes = await createRoundCheck({
          username: roundCheckHolder.trim(),
          bankname: roundCheckBankName.trim(),
          amount: roundCheckAmount || String(amount),
          recordeddate: roundCheckDate || new Date().toISOString().split("T")[0],
          memo: roundCheckMemo.trim(),
        });
        if (!checkRes.success) {
          toast.error(checkRes.error || "Failed to create check");
          setIsSubmittingRoundPayment(false);
          return;
        }
        checkId = checkRes.data.id;
      }

      const res = await createRoundPayment({
        roundRecordId: selectedRoundRecord.id,
        shopId: shop.id,
        amount,
        paymentType: roundPaymentType as "DIRECT" | "CHECK",
        checkId,
        memo: roundPaymentMemo || null,
      });

      if (res.success) {
        toast.success("Payment recorded successfully");
        setShowRoundPayment(false);
        setShowRoundDetail(false);
        setSelectedRoundRecord(null);
        resetRoundPaymentForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to record payment");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmittingRoundPayment(false);
    }
  };

  const resetRoundPaymentForm = () => {
    setRoundPaymentType("DIRECT");
    setRoundPaymentAmount("");
    setRoundPaymentMemo("");
    setRoundCheckBankName("");
    setRoundCheckHolder("");
    setRoundCheckAmount("");
    setRoundCheckDate("");
    setRoundCheckMemo("");
  };

  const columns = useMemo<ColumnDef<Payment>[]>(() => [
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-bold text-sm text-slate-800">{row.original.amount.toLocaleString()} ETB</span>
      ),
    },
    {
      id: "type",
      header: "Type",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              {p.payment_type === "CHECK" ? "Check" : "Direct"}
            </span>
            {p.payment_type === "CHECK" && p.check && (
              <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <Landmark className="size-2.5" />
                {p.check.bankname}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => {
        const p = row.original;
        const dateStr = formatShort(new Date(p.createdAt));
        const timeStr = new Date(p.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit",
        });
        return (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
            <Calendar className="size-3" />
            {dateStr} {timeStr}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <PaymentStatus status={row.original.status} />,
    },
  ],
  []);

  const table = useReactTable({
    data: shop.payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  // Combined payments (order payments + round payments) sorted by date
  const allPayments = useMemo(() => {
    const orderPayments = shop.payments.map((p) => ({
      ...p,
      source: "order" as const,
      bookTitle: null,
    }));
    const roundPayments = (shop.roundPayments || []).map((p) => ({
      id: p.id,
      amount: p.amount,
      payment_type: p.payment_type,
      status: p.status,
      checkId: null,
      check: p.check,
      createdAt: p.createdAt,
      orderid: null,
      memo: p.memo,
      source: "round" as const,
      bookTitle: p.bookTitle,
    }));
    return [...orderPayments, ...roundPayments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [shop.payments, shop.roundPayments]);

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/delivery_dashboard_full/payments")}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primarycolor transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Payments
      </button>

      <div className="bg-white rounded-3xl border-2 border-primarycolor/5 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
              <Store className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{shop.name}</h1>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <MapPin className="size-4" />
                {shop.branch}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs border",
                shop.remaining > 0
                  ? "bg-red-50 text-red-600 border-red-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              )}
            >
              <BadgeDollarSign className="size-3.5" />
              {shop.remaining.toLocaleString()} ETB
            </span>
            <RecordPaymentModal
              shopId={shop.id}
              shopName={shop.name}
              trigger={
                <button className="h-11 px-5 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primarycolor/20 transition-all active:scale-[0.98] whitespace-nowrap">
                  <Banknote className="size-4" />
                  Record Payment
                </button>
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl overflow-hidden">
        <Tabs defaultValue="payments">
          <div className="px-6 pt-6 pb-0 border-b border-slate-100">
            <TabsList className="w-full justify-start gap-0 rounded-none bg-transparent h-auto pb-0">
              <TabsTrigger
                value="payments"
                className="pb-3 px-1 mr-6 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primarycolor font-black uppercase tracking-widest text-[10px] text-muted-foreground after:opacity-0 data-[state=active]:after:opacity-100 after:bg-primarycolor after:h-0.5 after:absolute after:inset-x-0 after:bottom-0"
              >
                <Banknote className="size-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Payment History</span>
                {allPayments.length > 0 && (
                  <span className="ml-1 sm:ml-2 text-[8px] px-1.5 py-0.5 rounded-full bg-primarycolor/10 text-primarycolor font-black">
                    {allPayments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="pb-3 px-1 mr-6 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primarycolor font-black uppercase tracking-widest text-[10px] text-muted-foreground after:opacity-0 data-[state=active]:after:opacity-100 after:bg-primarycolor after:h-0.5 after:absolute after:inset-x-0 after:bottom-0"
              >
                <ListOrdered className="size-3.5 mr-2" />
                Orders
                {shop.orders.length > 0 && (
                  <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded-full bg-primarycolor/10 text-primarycolor font-black">
                    {shop.orders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="rounds"
                className="pb-3 px-1 mr-6 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primarycolor font-black uppercase tracking-widest text-[10px] text-muted-foreground after:opacity-0 data-[state=active]:after:opacity-100 after:bg-primarycolor after:h-0.5 after:absolute after:inset-x-0 after:bottom-0"
              >
                <Repeat className="size-3.5 mr-2" />
                Rounds
                {(shop.roundRecords || []).length > 0 && (
                  <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded-full bg-primarycolor/10 text-primarycolor font-black">
                    {shop.roundRecords.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="payments" className="m-0">
            {allPayments.length === 0 ? (
              <div className="py-12 text-center">
                <Banknote className="size-10 mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">No payments recorded yet</p>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-3">
                  {allPayments.map((p) => {
                    const dateStr = formatShort(new Date(p.createdAt));
                    const timeStr = new Date(p.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit", minute: "2-digit",
                    });
                    return (
                      <div
                        key={`${p.source}-${p.id}`}
                        className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-md active:scale-[0.99] transition-all cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-800">{p.amount.toLocaleString()} ETB</span>
                          <div className="flex items-center gap-1.5">
                            <PaymentStatus status={p.status} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            p.source === "order"
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-purple-100 text-purple-600"
                          )}>
                            {p.source === "order" ? "Order" : "Round"}
                          </span>
                          {p.source === "order" && p.orderid ? (
                            <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                              #ORD-{p.orderid.replace(/^ORD-/i, "")}
                            </span>
                          ) : null}
                          {p.source === "round" && p.bookTitle && (
                            <span className="text-[8px] font-bold text-muted-foreground truncate max-w-[120px]">
                              {p.bookTitle}
                            </span>
                          )}
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                            {p.payment_type === "CHECK" ? "Check" : "Direct"}
                          </span>
                          {p.payment_type === "CHECK" && p.check && (
                            <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Landmark className="size-2.5" />
                              {p.check.bankname}
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold ml-auto">
                            <Calendar className="size-3" />
                            {dateStr} {timeStr}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="orders" className="m-0">
            {shop.orders.length === 0 ? (
              <div className="py-12 text-center">
                <ListOrdered className="size-10 mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">No orders found for this shop</p>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {shop.orders.map((order) => {
                  const itemCount = order.order_items?.length || 0;
                  const totalBooks = order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                  const linkedPayments = shop.payments.filter((p) => {
                    if (!p.orderid) return false;
                    const rawId = p.orderid.replace(/^ORD-/i, "");
                    return rawId === String(order.id);
                  });
                  const totalPaidForOrder = linkedPayments
                    .filter((p) => p.status === "APPROVED")
                    .reduce((sum, p) => sum + (p.amount || 0), 0);
                  const remaining = order.hide_remaining ? 0 : (order.total_amount || 0) - totalPaidForOrder;
                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOrderModalOpen(true);
                      }}
                      className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-md active:scale-[0.99] transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-800">#ORD-{order.id}</span>
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          order.is_approved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        )}>
                          {order.is_approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ShoppingBag className="size-3.5 shrink-0" />
                          <span className="font-bold">{itemCount} item{itemCount !== 1 ? "s" : ""} ({totalBooks} book{totalBooks !== 1 ? "s" : ""})</span>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                            order.order_type === "on round"
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-teal-100 text-teal-600"
                          )}>
                            {order.order_type === "on round" ? "On Round" : "Requested"}
                          </span>
                        </div>
                        {order.order_items?.[0]?.bookedition?.books && (
                          <p className="text-[10px] text-muted-foreground/60 truncate max-w-md">
                            "{order.order_items[0].bookedition.books.title}"
                            {itemCount > 1 && " + more"}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-black text-primarycolor text-sm">
                            {(order.total_amount || 0).toLocaleString()} ETB
                          </span>
                          {remaining > 0 ? (
                            <span className="text-[9px] font-bold text-rose-500">
                              {remaining.toLocaleString()} ETB remaining
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-emerald-600">
                              Fully Paid
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                          <Calendar className="size-3" />
                          {formatShort(new Date(order.createdAt))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rounds" className="m-0">
            {(!shop.roundRecords || shop.roundRecords.length === 0) ? (
              <div className="py-12 text-center">
                <Repeat className="size-10 mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">No round records found for this shop</p>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {shop.roundRecords.map((record) => {
                  const paidAmount = record.payments
                    .filter((p) => p.status === "APPROVED")
                    .reduce((sum, p) => sum + (p.amount || 0), 0);
                  const remaining = record.totalprice - paidAmount;
                  return (
                    <div
                      key={record.id}
                      className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-md space-y-3 cursor-pointer active:scale-[0.99] transition-all"
                      onClick={() => { setSelectedRoundRecord(record); setShowRoundDetail(true); }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="size-4 text-primarycolor/60" />
                          <span className="font-bold text-sm text-slate-800">{record.bookTitle}</span>
                        </div>
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          {record.payments.length} payment{record.payments.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {record.bookAuthor && (
                          <p className="text-[10px] text-muted-foreground/60 truncate">
                            by {record.bookAuthor}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-black text-primarycolor text-sm">
                            {record.totalprice.toLocaleString()} ETB
                          </span>
                          {remaining > 0 && (
                            <span className="text-[9px] font-bold text-rose-500">
                              {remaining.toLocaleString()} ETB remaining
                            </span>
                          )}
                          {remaining <= 0 && paidAmount > 0 && (
                            <span className="text-[9px] font-bold text-emerald-500">
                              Fully Paid
                            </span>
                          )}
                        </div>

                        {record.payments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
                            {record.payments.map((payment) => (
                              <div key={payment.id} className="flex items-center justify-between text-[9px]">
                                <div className="flex items-center gap-1.5">
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[7px] font-black uppercase",
                                    payment.payment_type === "CHECK"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-blue-100 text-blue-600"
                                  )}>
                                    {payment.payment_type === "CHECK" ? "Check" : "Direct"}
                                  </span>
                                  {payment.check && (
                                    <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                                      {payment.check.bankname}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-emerald-600">{payment.amount.toLocaleString()} ETB</span>
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[7px] font-black uppercase",
                                    payment.status === "APPROVED"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-amber-50 text-amber-600"
                                  )}>
                                    {payment.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                          <Calendar className="size-3" />
                          {formatShort(new Date(record.createdAt))}
                        </div>
                        {remaining > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRoundRecord(record); setShowRoundPayment(true); }}
                            className="h-8 px-3 rounded-lg bg-primarycolor/10 hover:bg-primarycolor/20 text-primarycolor font-black text-[8px] uppercase tracking-widest flex items-center gap-1 transition-all active:scale-[0.97]"
                          >
                            <Banknote className="size-3" />
                            Pay
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <AlertDialog open={showActionDialog} onOpenChange={(o) => { if (!o) { setShowActionDialog(false); setActionPayment(null); } }}>
        <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-0 max-w-sm overflow-hidden">
          <AlertDialogHeader className="p-6 pb-4 border-b border-slate-100">
            <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
              Payment Options
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              {actionPayment?.amount.toLocaleString()} ETB — {actionPayment?.payment_type}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 font-black uppercase tracking-widest text-[10px] gap-3 justify-start px-5"
              onClick={() => { setShowActionDialog(false); setTimeout(() => setShowDeleteConfirm(true), 200); }}
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

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
              Remove Payment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
              Are you sure you want to permanently remove this payment of {actionPayment?.amount.toLocaleString()} ETB? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex-1 py-3">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={async () => {
                  if (!actionPayment) return;
                  setDeleting(true);
                  try {
                    const res = await deletePayment(actionPayment.id);
                    if (res.success) {
                      toast.success("Payment removed");
                      setShowDeleteConfirm(false);
                      setActionPayment(null);
                      router.refresh();
                    } else {
                      toast.error(res.error);
                    }
                  } catch {
                    toast.error("Failed to delete payment");
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="h-12 rounded-2xl bg-slate-700 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] flex-1 py-3"
              >
                {deleting ? "Removing..." : "Remove"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeliverOrderDetailModal
        isOpen={isOrderModalOpen}
        onClose={() => { setIsOrderModalOpen(false); setSelectedOrder(null); }}
        order={selectedOrder}
        payments={shop.payments}
      />

      <Dialog open={!!selectedPayment} onOpenChange={(o) => !o && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          {selectedPayment && (() => {
            const p = selectedPayment;
            const dateStr = formatShort(new Date(p.createdAt));
            const timeStr = new Date(p.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit", minute: "2-digit",
            });
            return (
              <>
                <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                      <Banknote className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                        Payment #{p.id}
                      </DialogTitle>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{shop.name}</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <PaymentStatus status={p.status} />

                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Payment Info</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Amount</span>
                        <span className="font-black text-primarycolor">{p.amount.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Type</span>
                        <span className="font-bold">{p.payment_type === "CHECK" ? "Check" : "Direct Payment"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Date</span>
                        <span className="font-bold">{dateStr} {timeStr}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Order</span>
                        {p.orderid ? (
                          <span className="font-bold text-sm text-indigo-600">#ORD-{p.orderid.replace(/^ORD-/i, "")}</span>
                        ) : (
                          <span className="font-bold text-sm text-slate-400">No Order</span>
                        )}
                      </div>
                      {p.orderid && (() => {
                        const rawId = p.orderid.replace(/^ORD-/i, "");
                        const matchedOrder = shop.orders.find((o) => String(o.id) === rawId || String(o.id) === p.orderid);
                        return (
                          <button
                            onClick={() => {
                              if (matchedOrder) {
                                setSelectedOrder(matchedOrder);
                                setIsOrderModalOpen(true);
                              }
                            }}
                            disabled={!matchedOrder}
                            className="w-full mt-2 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-100 hover:border-indigo-300 font-black text-[9px] uppercase tracking-widest text-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ListOrdered className="size-3.5" />
                            Show Order Detail
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {p.memo && (
                    <div className="bg-amber-50/30 rounded-2xl border-2 border-amber-100 p-4 space-y-2">
                      <p className="text-[8px] font-black text-amber-700 uppercase tracking-widest">Memo</p>
                      <p className="text-sm font-medium text-amber-900 leading-relaxed">{p.memo}</p>
                    </div>
                  )}

                  {p.payment_type === "CHECK" && p.check && (
                    <div className="bg-purple-50/30 rounded-2xl border-2 border-purple-100 p-4 space-y-3">
                      <p className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Check Details</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Bank</span>
                          <span className="font-bold">{p.check.bankname || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Username</span>
                          <span className="font-bold">{p.check.username || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Check Amount</span>
                          <span className="font-bold">{Number(p.check.amount || 0).toLocaleString()} ETB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Check Status</span>
                          <span className="font-bold">{p.check.status}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="w-full h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Round Record Detail Dialog */}
      <Dialog open={showRoundDetail} onOpenChange={(o) => { if (!o) { setShowRoundDetail(false); setSelectedRoundRecord(null); } }}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          {selectedRoundRecord && (() => {
            const r = selectedRoundRecord;
            const paidAmount = r.payments.filter((p) => p.status === "APPROVED").reduce((sum, p) => sum + (p.amount || 0), 0);
            const remaining = r.totalprice - paidAmount;
            return (
              <>
                <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                      <Repeat className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                        Round Record #{r.id}
                      </DialogTitle>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{shop.name}</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Book info */}
                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-2">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Book</p>
                    <div className="flex items-center gap-3">
                      <BookOpen className="size-5 text-primarycolor/60 shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-slate-800">{r.bookTitle}</p>
                        {r.bookAuthor && (
                          <p className="text-[9px] text-muted-foreground">by {r.bookAuthor}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial summary */}
                  <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Financial Summary</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Total Amount</span>
                        <span className="font-black text-primarycolor">{r.totalprice.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-medium">Paid</span>
                        <span className="font-bold text-emerald-600">{paidAmount.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-primarycolor/5">
                        <span className="text-muted-foreground font-medium">Remaining</span>
                        <span className={cn("font-black", remaining > 0 ? "text-rose-600" : "text-emerald-600")}>
                          {remaining.toLocaleString()} ETB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payments */}
                  {r.payments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Payments</p>
                      {r.payments.map((payment) => (
                        <div key={payment.id} className="bg-white rounded-xl border border-slate-100 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                payment.payment_type === "CHECK"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-blue-100 text-blue-600"
                              )}>
                                {payment.payment_type === "CHECK" ? "Check" : "Direct"}
                              </span>
                              <PaymentStatus status={payment.status} />
                            </div>
                            <span className="font-black text-sm text-emerald-600">{payment.amount.toLocaleString()} ETB</span>
                          </div>
                          {payment.check && (
                            <div className="bg-purple-50/50 rounded-lg p-2 space-y-1">
                              <div className="flex justify-between text-[9px]">
                                <span className="text-muted-foreground">Bank</span>
                                <span className="font-bold">{payment.check.bankname || "-"}</span>
                              </div>
                              <div className="flex justify-between text-[9px]">
                                <span className="text-muted-foreground">Holder</span>
                                <span className="font-bold">{payment.check.username || "-"}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => { setShowRoundDetail(false); setShowRoundPayment(true); }}
                    className="w-full h-12 rounded-2xl bg-primarycolor/10 hover:bg-primarycolor/20 text-primarycolor font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Banknote className="size-4" />
                    Record Payment
                  </button>

                  <button
                    onClick={() => { setShowRoundDetail(false); setSelectedRoundRecord(null); }}
                    className="w-full h-12 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    Close
                  </button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Round Payment Dialog */}
      <Dialog open={showRoundPayment} onOpenChange={(o) => { if (!o) { setShowRoundPayment(false); resetRoundPaymentForm(); } }}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <Banknote className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                  Record Round Payment
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  {selectedRoundRecord?.bookTitle} — {shop.name}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Payment Type */}
            <div className="space-y-2">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Payment Type</p>
              <Select value={roundPaymentType} onValueChange={setRoundPaymentType}>
                <SelectTrigger className="h-12 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-primarycolor/10">
                  <SelectItem value="DIRECT" className="font-bold">Direct Payment</SelectItem>
                  <SelectItem value="CHECK" className="font-bold">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Amount (ETB)</p>
              <Input
                type="number"
                value={roundPaymentAmount}
                onChange={(e) => setRoundPaymentAmount(e.target.value)}
                placeholder="0"
                min={0}
                className="h-12 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-base focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Memo (optional)</p>
              <Input
                value={roundPaymentMemo}
                onChange={(e) => setRoundPaymentMemo(e.target.value)}
                placeholder="Add a note..."
                className="h-12 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
              />
            </div>

            {/* Check Details */}
            {roundPaymentType === "CHECK" && (
              <div className="space-y-3 p-4 rounded-2xl bg-purple-50/50 border-2 border-purple-100">
                <p className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Check Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Bank Name</p>
                    <Input
                      value={roundCheckBankName}
                      onChange={(e) => setRoundCheckBankName(e.target.value)}
                      placeholder="e.g. Dashen Bank"
                      className="h-11 px-4 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Holder Name</p>
                    <Input
                      value={roundCheckHolder}
                      onChange={(e) => setRoundCheckHolder(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="h-11 px-4 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Amount</p>
                    <Input
                      type="number"
                      value={roundCheckAmount}
                      onChange={(e) => setRoundCheckAmount(e.target.value)}
                      placeholder="0"
                      min={0}
                      className="h-11 px-4 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Expiry Date</p>
                    <DateInput
                      value={roundCheckDate}
                      onChange={(e) => setRoundCheckDate(e.target.value)}
                      className="h-11 px-4 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                      showECLabel={false}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Memo (optional)</p>
                  <Input
                    value={roundCheckMemo}
                    onChange={(e) => setRoundCheckMemo(e.target.value)}
                    placeholder="Check memo..."
                    className="h-11 px-4 rounded-2xl border-2 border-purple-200 bg-white font-bold text-sm"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSubmitRoundPayment}
                disabled={isSubmittingRoundPayment || !roundPaymentAmount || parseFloat(roundPaymentAmount) <= 0}
                className="flex-1 h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-sm shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingRoundPayment ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Banknote className="size-5" />
                )}
                {isSubmittingRoundPayment ? "Recording..." : "Record Payment"}
              </button>
              <button
                onClick={() => { setShowRoundPayment(false); resetRoundPaymentForm(); }}
                className="flex-1 h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
