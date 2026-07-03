"use client";

import { useState, useMemo } from "react";
import { Search, Layers, BookOpen } from "lucide-react";

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
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
          placeholder="Search by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="size-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">
            {search ? "No books match your search" : "No books available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-xl bg-primarycolor/10 flex items-center justify-center shrink-0">
                  <BookOpen className="size-6 text-primarycolor" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {book.author}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {book.category}
                    </span>
                    {book.language && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {book.language}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="size-3.5" />
                      {book._count.bookEditions} editions
                    </span>
                  </div>
                </div>
              </div>

              {book.bookEditions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  {book.bookEditions.map((ed) => (
                    <div
                      key={ed.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-bold text-slate-600 text-xs">
                        {ed.edition_name}
                      </span>
                      <span className="font-black text-primarycolor">
                        {ed.price != null ? `$${ed.price.toFixed(2)}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
