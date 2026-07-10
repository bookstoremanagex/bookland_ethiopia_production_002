"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, ShoppingCart, BookOpen, Clock, Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCustomer } from "@/app/actions/retail-customer-actions";
import { toast } from "sonner";

interface CustomerDetail {
  id: number;
  name: string | null;
  email: string | null;
  customerType: string | null;
  created_at: string;
  orders: {
    id: number;
    quantity: number | null;
    total_price: number | null;
    created_at: string;
    book: {
      edition_name: string;
      price: number | null;
      books: { title: string; author: string } | null;
    } | null;
  }[];
}

export function CustomerDetailClient({ customer }: { customer: CustomerDetail }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await deleteCustomer(customer.id);
      if (res.success) {
        toast.success("Customer deleted");
        router.push("/retail_shop_dashboard/customers");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete customer");
      }
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmText("");
    }
  };

  const badgeColor =
    customer.customerType === "DISTRIBUTOR"
      ? "bg-blue-100 text-blue-700"
      : customer.customerType === "BOOKSHOP"
        ? "bg-purple-100 text-purple-700"
        : "bg-amber-100 text-amber-700";

  const totalSpent = customer.orders.reduce(
    (sum, o) => sum + (o.total_price ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/retail_shop_dashboard/customers"
          className="inline-flex items-center text-sm font-bold text-primarycolor hover:text-primarycolor/80 transition-colors mb-2"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Customers
        </Link>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center shrink-0">
              <User className="size-6 text-primarycolor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {customer.name ?? "Unnamed"}
              </h1>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">
                {customer.email ?? "No email"}
              </p>
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeColor}`}
                >
                  {customer.customerType ?? "INDIVIDUAL"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                router.push(`/retail_shop_dashboard/customers/${customer.id}/edit`)
              }
              className="size-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center"
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="size-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all flex items-center justify-center"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-black text-primarycolor">
              {customer.orders.length}
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
              Orders
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-primarycolor">
              ETB {totalSpent.toFixed(2)}
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
              Total Spent
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-primarycolor">
              {new Date(customer.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
              Customer Since
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-black text-sm uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <ShoppingCart className="size-4 text-primarycolor" />
          Order History ({customer.orders.length})
        </h2>

        {customer.orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl">
            <Clock className="size-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-400">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="size-4 text-primarycolor/60 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {order.book?.books?.title ?? "Unknown"}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400">
                      {order.book?.edition_name ?? "—"} &middot; Qty: {order.quantity ?? 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primarycolor">
                    ETB {(order.total_price ?? 0).toFixed(2)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete customer confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(o) => { if (!o) { setShowDeleteDialog(false); setDeleteConfirmText(""); } }}>
        <AlertDialogContent className="rounded-2xl border-2 border-primarycolor/5">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-black text-primarycolor uppercase tracking-tight italic">
              Delete Customer?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
              <span className="block">This will permanently remove <strong>{customer.name ?? "this customer"}</strong> from the retail shop.</span>
              <span className="block mt-1">Type <strong className="text-rose-600">DELETE</strong> to confirm.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1">
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full h-10 px-4 rounded-xl border-2 border-slate-200 text-sm font-bold text-gray-700 outline-none focus:border-rose-400 transition-colors"
            />
          </div>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleDelete}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                className="rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? <Loader2 className="size-3 animate-spin" /> : "Delete Customer"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
