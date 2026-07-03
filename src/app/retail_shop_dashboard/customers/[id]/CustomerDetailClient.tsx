"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, ShoppingCart, BookOpen, Clock, Pencil } from "lucide-react";
import Link from "next/link";

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
          <button
            onClick={() =>
              router.push(`/retail_shop_dashboard/customers/${customer.id}/edit`)
            }
            className="size-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center shrink-0"
            title="Edit"
          >
            <Pencil className="size-4" />
          </button>
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
              ${totalSpent.toFixed(2)}
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
                    ${(order.total_price ?? 0).toFixed(2)}
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
    </div>
  );
}
