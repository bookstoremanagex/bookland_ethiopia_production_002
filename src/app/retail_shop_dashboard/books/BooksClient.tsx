"use client";

import { useState, useMemo } from "react";
import { Search, Layers, BookOpen, Plus, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RetailBook {
  id: number;
  title: string;
  author: string;
  language: string;
  category: string;
  publication_year: string | null;
  book_image_url: string | null;
  status: string;
  bookEditions: {
    id: number;
    edition_name: string;
    price: number | null;
  }[];
  _count: { bookEditions: number };
}

export function BooksClient({ books }: { books: RetailBook[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase()) ||
          b.category.toLowerCase().includes(search.toLowerCase())
      ),
    [books, search]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header row: search + add button (mobile only) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
            placeholder="Search by title, author, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">
            {filtered.length} book{filtered.length !== 1 ? "s" : ""}
          </span>
          <Link href="/retail_shop_dashboard/books/add" className="sm:hidden w-full">
            <Button className="w-full h-11 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/20 gap-2">
              <Plus className="size-4" />
              Add Book
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile book count */}
      <div className="sm:hidden">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {filtered.length} book{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
          <BookOpen className="size-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">
            {search ? "No books match your search" : "No books available"}
          </p>
          {!search && (
            <Link href="/retail_shop_dashboard/books/add" className="inline-block mt-4">
              <Button variant="outline" className="rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest gap-2">
                <Plus className="size-3.5" />
                Add Your First Book
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((book) => (
            <Link
              key={book.id}
              href={`/retail_shop_dashboard/books/${book.id}`}
              className="group rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden block"
            >
              {/* Book image or icon header */}
              {book.book_image_url ? (
                <div className="relative h-32 sm:h-40 bg-slate-50 overflow-hidden">
                  <img
                    src={book.book_image_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[8px] font-black uppercase tracking-widest text-primarycolor shadow-sm">
                      {book._count.bookEditions} ed.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-20 sm:h-24 bg-gradient-to-br from-primarycolor/5 to-primarycolor/10 flex items-center justify-center">
                  <BookOpen className="size-10 sm:size-12 text-primarycolor/20" />
                </div>
              )}

              {/* Card body */}
              <div className="p-3.5 sm:p-5 space-y-2.5">
                {/* Title + author */}
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-slate-800 uppercase tracking-tight truncate">
                    {book.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">
                    {book.author}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {book.category && (
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {book.category}
                    </span>
                  )}
                  {book.language && (
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {book.language}
                    </span>
                  )}
                  {book.publication_year && (
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-50 text-slate-400">
                      {book.publication_year}
                    </span>
                  )}
                </div>

                {/* Editions */}
                {book.bookEditions.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                    {book.bookEditions.map((ed) => (
                      <div
                        key={ed.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Layers className="size-3 text-slate-300 shrink-0" />
                          <span className="font-bold text-slate-600 text-[10px] sm:text-xs truncate">
                            {ed.edition_name}
                          </span>
                        </div>
                        <span className="font-black text-primarycolor text-[10px] sm:text-xs shrink-0 ml-2">
                          {ed.price != null ? `${ed.price.toLocaleString()} ETB` : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
