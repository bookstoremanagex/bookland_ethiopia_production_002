"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Layers,
  Store,
  Lock,
  ShoppingCart,
  Repeat,
  Printer,
  Banknote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface FinanceBook {
  id: number;
  title: string;
  author: string | null;
  isbn: string | null;
  book_image_url: string | null;
  unique_identification_code: string;
  editionCount: number;
  inStore: number;
  locked: number;
  soldAsOrder: number;
  soldAsRound: number;
  totalProduced: number;
  totalSell: number;
  orderRevenue: number;
  roundRevenue: number;
}

interface Props {
  books: FinanceBook[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  search: string;
}

function fmt(n: number): string {
  return n.toLocaleString();
}

export function FinanceBooksGrid({
  books,
  totalCount,
  totalPages,
  currentPage,
  search,
}: Props) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySearch = (query: string) => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    params.set("page", "1");
    router.push(`/admin_dashboard/finance/books?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => applySearch(value), 350);
  };

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch(searchInput);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    router.push(`/admin_dashboard/finance/books?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-primarycolor/60" />
          <input
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="h-14 w-full pl-14 pr-4 rounded-2xl border-2 border-slate-100 bg-white font-bold text-sm shadow-[0_8px_28px_-8px_rgba(15,23,42,0.10)] focus:border-primarycolor focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primarycolor to-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/30 hover:shadow-xl hover:shadow-primarycolor/40 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                router.push("/admin_dashboard/finance/books");
              }}
              className="h-14 px-5 rounded-2xl border-2 border-slate-200 bg-white font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-slate-50 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {totalCount} book{totalCount !== 1 ? "s" : ""} found
          {search && (
            <span className="text-primarycolor"> · searching “{search}”</span>
          )}
        </p>
        <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Book grid */}
      {books.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
          <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center">
            <Search className="size-9 text-slate-300" />
          </div>
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            No books found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-primarycolor/5 shadow-[0_8px_28px_-8px_rgba(15,23,42,0.10)] hover:shadow-[0_18px_44px_-12px_rgba(64,138,113,0.28)] hover:-translate-y-1 hover:border-primarycolor/20 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 size-32 bg-primarycolor/5 rounded-full -mr-16 -mt-16 blur-2xl" aria-hidden />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor" aria-hidden />

              {/* Header */}
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-14 shrink-0 rounded-2xl bg-gradient-to-br from-primarycolor/15 to-tertiarycolor/40 border border-white shadow-inner flex items-center justify-center text-primarycolor overflow-hidden">
                    {book.book_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={book.book_image_url} alt="" className="size-full object-cover" />
                    ) : (
                      <BookOpen className="size-7" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-primarycolor uppercase tracking-tight leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 truncate">
                      {book.author || "Unknown Author"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total sell highlight */}
              <div className="relative mt-5 rounded-2xl bg-gradient-to-r from-primarycolor to-secondarycolor p-4 text-white flex items-center justify-between shadow-lg shadow-primarycolor/20">
                <div className="flex items-center gap-2 opacity-80">
                  <Banknote className="size-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Total Sell</span>
                </div>
                <p className="text-xl font-black tabular-nums">
                  {fmt(book.totalSell)} <span className="text-xs font-bold opacity-80">ETB</span>
                </p>
              </div>

              {/* Metrics */}
              <div className="relative mt-4 grid grid-cols-2 gap-2.5">
                <MetricTile icon={Layers} label="Editions" value={fmt(book.editionCount)} tint="text-primarycolor bg-primarycolor/10" />
                <MetricTile icon={Store} label="In store" value={fmt(book.inStore)} tint="text-sky-700 bg-sky-50" />
                <MetricTile icon={Lock} label="Locked" value={fmt(book.locked)} tint="text-amber-700 bg-amber-50" />
                <MetricTile icon={ShoppingCart} label="Sold (order)" value={fmt(book.soldAsOrder)} tint="text-emerald-700 bg-emerald-50" />
                <MetricTile icon={Repeat} label="Sold (round)" value={fmt(book.soldAsRound)} tint="text-purple-700 bg-purple-50" />
                <MetricTile icon={Printer} label="Produced" value={fmt(book.totalProduced)} tint="text-rose-700 bg-rose-50" />
              </div>

              {/* ISBN footer */}
              <div className="relative mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                <span>{book.unique_identification_code || "—"}</span>
                <span>{book.isbn ? `ISBN ${book.isbn}` : "No ISBN"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 h-11 px-5 rounded-xl border-2 border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest text-slate-600 hover:border-primarycolor/30 hover:text-primarycolor disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all"
          >
            <ChevronLeft className="size-4" /> Prev
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<Array<number | "ellipsis">>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "ellipsis" ? (
                  <span key={`e-${idx}`} className="px-1 text-sm font-black text-muted-foreground">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`size-11 rounded-xl font-black text-xs transition-all ${
                      p === currentPage
                        ? "bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30"
                        : "border-2 border-slate-200 bg-white text-slate-600 hover:border-primarycolor/30 hover:text-primarycolor"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 h-11 px-5 rounded-xl border-2 border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest text-slate-600 hover:border-primarycolor/30 hover:text-primarycolor disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all"
          >
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 space-y-1 transition-all group-hover:border-primarycolor/10">
      <div className="flex items-center gap-1.5">
        <span className={`flex size-6 items-center justify-center rounded-lg ${tint}`}>
          <Icon className="size-3.5" />
        </span>
        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-black text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}
