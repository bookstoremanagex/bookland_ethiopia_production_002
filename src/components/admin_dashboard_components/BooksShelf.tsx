"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight, BookOpen, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import type { Book } from "./BooksTable";

interface BooksShelfProps {
  data: Book[];
}

export function BooksShelf({ data }: BooksShelfProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const filteredData = data.filter((book) => {
    const searchStr = globalFilter.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchStr) ||
      book.author.toLowerCase().includes(searchStr) ||
      (book.isbn && book.isbn.toLowerCase().includes(searchStr)) ||
      book.category.toLowerCase().includes(searchStr) ||
      book.unique_identification_code.toLowerCase().includes(searchStr)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full space-y-8">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md">
        <div className="relative w-full sm:max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-300" />
          <Input
            placeholder="Search titles, authors, categories..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-12 h-12 bg-background border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-xl transition-all text-lg font-medium"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-12 px-6 border-2 border-primarycolor/20 text-primarycolor font-bold hover:bg-primarycolor/5 rounded-xl transition-all" asChild>
            <Link href={`${dashboardRoot}/books`}>Back to Table</Link>
          </Button>
          <Button className="flex-1 sm:flex-none h-12 px-8 bg-primarycolor hover:bg-secondarycolor text-white font-bold rounded-xl shadow-lg transition-all" asChild>
            <Link href={`${dashboardRoot}/books/add_book`}>+ Add Book</Link>
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {paginatedData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8">
          {paginatedData.map((book) => (
            <Link
              key={book.id}
              href={`${dashboardRoot}/books/${book.unique_identification_code}`}
              className="group relative flex flex-col bg-card rounded-2xl border-2 border-primarycolor/10 overflow-hidden shadow-sm hover:shadow-2xl hover:border-primarycolor/30 transition-all duration-500 hover:-translate-y-2 active:scale-95"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {book.book_image_url ? (
                  <img
                    src={book.book_image_url}
                    alt={book.title}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="size-full flex flex-col items-center justify-center bg-primarycolor/5 space-y-4">
                    <BookOpen className="size-16 text-primarycolor/10" />
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-primarycolor/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Details at Bottom */}
              <div className="p-4 space-y-2">
                <h3 className="font-black text-primarycolor leading-tight line-clamp-2 min-h-[2.5rem]">
                  {book.title}
                </h3>
                <div className="flex items-center gap-2 text-sm font-bold text-secondarycolor/60">
                  <User className="size-3.5" />
                  <span className="truncate">{book.author}</span>
                </div>
              </div>
              
              {/* Floating ID Tag */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg border border-white/20">
                #{book.id}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center space-y-6 text-muted-foreground bg-card rounded-3xl border-2 border-dashed border-primarycolor/10">
          <BookOpen className="size-20 opacity-10 animate-pulse" />
          <p className="text-2xl font-black uppercase tracking-widest opacity-20">No books found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-10">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-12 px-6 border-2 border-primarycolor/20 text-primarycolor font-bold rounded-xl transition-all disabled:opacity-30"
          >
            <ChevronLeft className="size-5 mr-1" />
            Previous
          </Button>
          <div className="px-6 h-12 flex items-center bg-primarycolor/5 rounded-xl border border-primarycolor/10 text-secondarycolor font-black">
            {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-12 px-6 border-2 border-primarycolor/20 text-primarycolor font-bold rounded-xl transition-all disabled:opacity-30"
          >
            Next
            <ChevronRight className="size-5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
