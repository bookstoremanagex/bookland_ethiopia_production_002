"use client";

import { useState, useMemo } from "react";
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
import { toast } from "sonner";
import { deletePayment } from "@/app/actions/payment-actions";
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
};

type ShopData = {
  id: number;
  name: string;
  branch: string;
  remaining: number;
  payments: Payment[];
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
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionPayment, setActionPayment] = useState<Payment | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        const dateStr = new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        });
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
  ], []);

  const table = useReactTable({
    data: shop.payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

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
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Payment History</h2>
            <span className="text-[9px] font-black text-muted-foreground">{shop.payments.length} payment{shop.payments.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {shop.payments.length === 0 ? (
          <div className="py-12 text-center">
            <Banknote className="size-10 mx-auto text-muted-foreground/20 mb-3" />
            <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">No payments recorded yet</p>
          </div>
        ) : (
          <>
            <div className="p-6 pt-0 space-y-3">
              {table.getRowModel().rows.map((row) => {
                const p = row.original;
                const dateStr = new Date(p.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                });
                const timeStr = new Date(p.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit", minute: "2-digit",
                });
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPayment(p)}
                    className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-md active:scale-[0.99] transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">{p.amount.toLocaleString()} ETB</span>
                      <div className="flex items-center gap-1.5">
                        <PaymentStatus status={p.status} />
                        {p.status === "PENDING" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setActionPayment(p); setShowActionDialog(true); }}
                            className="size-8 rounded-xl hover:bg-slate-100 text-muted-foreground hover:text-primarycolor transition-all flex items-center justify-center"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
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

            {table.getPageCount() > 1 && (
              <div className="sticky bottom-0 z-10 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent">
                <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-primarycolor/5 p-2 shadow-lg">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 pl-3">
                    {shop.payments.length} payment{shop.payments.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="size-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] transition-all active:scale-90 disabled:opacity-20 flex items-center justify-center"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="text-[9px] font-black text-muted-foreground/50 px-2">
                      {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                    </span>
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="size-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] transition-all active:scale-90 disabled:opacity-20 flex items-center justify-center"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
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

      <Dialog open={!!selectedPayment} onOpenChange={(o) => !o && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          {selectedPayment && (() => {
            const p = selectedPayment;
            const dateStr = new Date(p.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            });
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
                    </div>
                  </div>

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
    </div>
  );
}
