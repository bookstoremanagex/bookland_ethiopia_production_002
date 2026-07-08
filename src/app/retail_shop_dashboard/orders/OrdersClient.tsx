"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ShoppingCart,
  BookOpen,
  Plus,
  Minus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { createRetailOrder } from "../../actions/retail-actions";
import { toast } from "sonner";

interface RetailBook {
  id: number;
  title: string;
  author: string;
  bookEditions: {
    id: number;
    edition_name: string;
    price: number | null;
  }[];
}

interface RetailCustomer {
  id: number;
  name: string | null;
  email: string | null;
  customerType: string | null;
}

interface CartItem {
  editionId: number;
  editionName: string;
  bookTitle: string;
  quantity: number;
  price: number;
}

export function OrdersClient({
  books,
  customers,
}: {
  books: RetailBook[];
  customers: RetailCustomer[];
}) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerType, setCustomerType] = useState<"individual" | "known">("individual");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<RetailCustomer | null>(null);

  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      ),
    [books, search]
  );

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          (c.name ?? "").toLowerCase().includes(customerSearch.toLowerCase()) ||
          (c.email ?? "").toLowerCase().includes(customerSearch.toLowerCase())
      ),
    [customers, customerSearch]
  );

  const addToCart = (editionId: number, editionName: string, bookTitle: string, price: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.editionId === editionId);
      if (existing) {
        return prev.map((item) =>
          item.editionId === editionId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { editionId, editionName, bookTitle, quantity: 1, price },
      ];
    });
  };

  const setQty = (editionId: number, value: number) => {
    const qty = Math.max(1, Math.floor(value) || 0);
    if (qty <= 0) {
      removeFromCart(editionId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.editionId === editionId ? { ...item, quantity: qty } : item
      )
    );
  };

  const setPrice = (editionId: number, value: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.editionId === editionId
          ? { ...item, price: Math.max(0, value) }
          : item
      )
    );
  };

  const removeFromCart = (editionId: number) => {
    setCart((prev) => prev.filter((item) => item.editionId !== editionId));
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      for (const item of cart) {
        const res = await createRetailOrder({
          book_edition_id: item.editionId,
          quantity: item.quantity,
          total_price: item.quantity * item.price,
          customerId: customerType === "known" ? selectedCustomer?.id : null,
        });
        if (!res.success) {
          toast.error(`Failed to create order for ${item.bookTitle}`);
          continue;
        }
      }
      const label = customerType === "known" ? ` for ${selectedCustomer?.name ?? "customer"}` : "";
      toast.success(`${cart.length} order(s) created${label}`);
      setCart([]);
      setSelectedCustomer(null);
      setCustomerType("individual");
    } catch {
      toast.error("Failed to create orders");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="size-4 text-primarycolor shrink-0" />
                <div>
                  <p className="font-bold text-sm text-slate-800">{book.title}</p>
                  <p className="text-xs font-semibold text-slate-400">{book.author}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {book.bookEditions.map((ed) => (
                  <div
                    key={ed.id}
                    className="flex items-center justify-between pl-7 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        {ed.edition_name}
                      </span>
                      <span className="text-xs font-black text-primarycolor">
                        {ed.price != null ? `ETB ${ed.price.toFixed(2)}` : "—"}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        addToCart(ed.id, ed.edition_name, book.title, ed.price ?? 0)
                      }
                      className="size-7 rounded-lg bg-primarycolor/10 text-primarycolor hover:bg-primarycolor hover:text-white transition-all flex items-center justify-center"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm font-bold text-slate-400 py-8">
              No books found
            </p>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {/* Customer Selection */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User className="size-4 text-primarycolor" />
            <h2 className="font-black text-xs uppercase tracking-wider text-slate-700">
              Customer
            </h2>
          </div>

          <div className="flex rounded-lg bg-slate-100 p-0.5 mb-3">
            <button
              onClick={() => {
                setCustomerType("individual");
                setSelectedCustomer(null);
                setCustomerSearch("");
              }}
              className={`flex-1 px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                customerType === "individual"
                  ? "bg-white text-primarycolor shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <User className="size-3 inline mr-1" />
              Individual
            </button>
            <button
              onClick={() => setCustomerType("known")}
              className={`flex-1 px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                customerType === "known"
                  ? "bg-white text-primarycolor shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Users className="size-3 inline mr-1" />
              Known Customer
            </button>
          </div>

          {customerType === "known" && (
            <div className="space-y-2">
              {selectedCustomer ? (
                <div className="flex items-center justify-between rounded-lg bg-primarycolor/5 border border-primarycolor/20 px-3 py-2">
                  <div>
                    <p className="text-xs font-bold text-slate-700">{selectedCustomer.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400">{selectedCustomer.customerType}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearch("");
                    }}
                    className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                    <input
                      className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-100 divide-y divide-slate-50">
                    {filteredCustomers.length === 0 ? (
                      <p className="text-center text-[11px] font-bold text-slate-300 py-4">
                        No customers found
                      </p>
                    ) : (
                      filteredCustomers.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCustomer(c)}
                          className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-primarycolor/5 transition-all"
                        >
                          <User className="size-3 text-primarycolor/60 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">{c.name}</p>
                            <p className="text-[10px] font-semibold text-slate-400">{c.customerType}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="size-4 text-primarycolor" />
            <h2 className="font-black text-xs uppercase tracking-wider text-slate-700">
              Cart ({cart.length})
            </h2>
          </div>

          {cart.length === 0 ? (
            <p className="text-xs font-bold text-slate-300 text-center py-8">
              Select editions to add
            </p>
          ) : (
            <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.editionId}
                  className="py-2 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-600 truncate">
                        {item.editionName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{item.bookTitle}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.editionId)}
                      className="size-6 rounded-md bg-red-50 text-red-400 hover:bg-red-100 transition-all flex items-center justify-center shrink-0 ml-2"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pl-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setQty(item.editionId, item.quantity - 1)}
                        className="size-6 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center"
                      >
                        <Minus className="size-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v)) setQty(item.editionId, v);
                        }}
                        className="w-10 h-6 rounded-md border border-slate-200 bg-white text-xs font-black text-slate-700 text-center outline-none focus:border-primarycolor/50 focus:ring-1 focus:ring-primarycolor/10 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => setQty(item.editionId, item.quantity + 1)}
                        className="size-6 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-[10px] font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price.toFixed(2)}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v)) setPrice(item.editionId, v);
                        }}
                        className="w-16 h-6 rounded-md border border-slate-200 bg-white text-xs font-black text-primarycolor text-right outline-none focus:border-primarycolor/50 focus:ring-1 focus:ring-primarycolor/10 px-1 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between py-3 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total
            </span>
            <span className="text-lg font-black text-primarycolor">
              ETB {total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full h-11 mt-2 rounded-xl bg-primarycolor text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="size-4" />
                Complete Sale
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
