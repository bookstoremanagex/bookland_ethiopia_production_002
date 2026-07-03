"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingCart, Clock, BookOpen, User } from "lucide-react";

interface RetailOrder {
  id: number;
  quantity: number | null;
  total_price: number | null;
  created_at: string;
  customer: {
    id: number;
    name: string | null;
    customerType: string | null;
  } | null;
  book: {
    id: number;
    edition_name: string;
    price: number | null;
    books: {
      id: number;
      title: string;
      author: string;
    } | null;
  } | null;
}

export function HistoryClient({ orders }: { orders: RetailOrder[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const title = o.book?.books?.title ?? "";
        const edition = o.book?.edition_name ?? "";
        const q = search.toLowerCase();
        return title.toLowerCase().includes(q) || edition.toLowerCase().includes(q);
      }),
    [orders, search]
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
          placeholder="Search by book title or edition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="size-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">
            {search ? "No orders match your search" : "No orders yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const bookTitle = order.book?.books?.title ?? "Unknown Book";
            const editionName = order.book?.edition_name ?? "—";
            const customerName = order.customer?.name;
            const date = new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-primarycolor/10 flex items-center justify-center shrink-0">
                      <BookOpen className="size-5 text-primarycolor" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight">
                        {bookTitle}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {editionName}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-slate-400">
                        <span>Qty: {order.quantity ?? 0}</span>
                        <span className="text-primarycolor">
                          ${(order.total_price ?? 0).toFixed(2)}
                        </span>
                        {customerName && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <User className="size-3" />
                            {customerName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 shrink-0">
                    <Clock className="size-3" />
                    {date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
