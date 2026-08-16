"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight, BookOpen, User, LayoutGrid, Columns3, Columns2, List, LayoutList, Eye } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import type { Book } from "./BooksTable";

const LAYOUT_KEY = "bookshelf_layout";

type LayoutOption = "list" | "dense" | "compact" | "default" | "comfortable";

const layoutConfig: Record<LayoutOption, { cols: string; label: string; icon: React.ElementType }> = {
  list: { cols: "grid-cols-1", label: "List", icon: List },
  dense: { cols: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8", label: "Dense", icon: LayoutGrid },
  compact: { cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6", label: "Compact", icon: LayoutList },
  default: { cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6", label: "Default", icon: Columns3 },
  comfortable: { cols: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3", label: "Comfortable", icon: Columns2 },
};

interface BooksShelfProps {
  data: Book[];
}

export function BooksShelf({ data }: BooksShelfProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [layout, setLayout] = React.useState<LayoutOption>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(LAYOUT_KEY) as LayoutOption) || "default";
    }
    return "default";
  });
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

  const changeLayout = (newLayout: LayoutOption) => {
    setLayout(newLayout);
    localStorage.setItem(LAYOUT_KEY, newLayout);
  };

  return (
    <div className="w-full space-y-8">
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
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-primarycolor/10">
            {(Object.entries(layoutConfig) as [LayoutOption, typeof layoutConfig[LayoutOption]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => changeLayout(key)}
                className={cn(
                  "size-10 flex items-center justify-center rounded-lg transition-all",
                  layout === key
                    ? "bg-white text-primarycolor shadow-sm border border-primarycolor/20"
                    : "text-muted-foreground hover:text-primarycolor"
                )}
                title={cfg.label}
              >
                <cfg.icon className="size-4" />
              </button>
            ))}
          </div>
          <Button variant="outline" className="flex-1 sm:flex-none h-12 px-6 border-2 border-primarycolor/20 text-primarycolor font-bold hover:bg-primarycolor/5 rounded-xl transition-all" asChild>
            <Link href={`${dashboardRoot}/books`}>Back to Table</Link>
          </Button>
        </div>
      </div>

      {paginatedData.length > 0 ? (
        <div className={cn("gap-4", layout === "list" ? "space-y-4" : `grid ${layoutConfig[layout].cols}`)}>
          {paginatedData.map((book) => (
            layout === "list" ? (
              <Link
                key={book.id}
                href={`${dashboardRoot}/books/${book.unique_identification_code}`}
                className="group flex items-start gap-5 bg-card rounded-2xl border-2 border-primarycolor/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-primarycolor/30 transition-all duration-300 p-4"
              >
                <div className="size-24 sm:size-28 shrink-0 rounded-xl overflow-hidden bg-muted border-2 border-primarycolor/5 shadow-md">
                  {book.book_image_url ? (
                    <img src={book.book_image_url} alt={book.title} className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <BookOpen className="size-8 text-primarycolor/20" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5 py-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black text-primarycolor text-lg leading-tight line-clamp-1">
                      {book.title}
                    </h3>
                    <span className="text-[10px] font-black text-muted-foreground/40 tabular-nums shrink-0">#{book.id}</span>
                  </div>
                  <p className="font-bold text-secondarycolor/80 flex items-center gap-2">
                    <User className="size-3.5" />
                    {book.author}
                    {book.pen_name && (
                      <span className="text-xs font-medium text-secondarycolor/40 italic">({book.pen_name})</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[9px] font-black bg-primarycolor/10 text-primarycolor px-2.5 py-1 rounded-lg uppercase tracking-tighter border border-primarycolor/20">
                      {book.category}
                    </span>
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border",
                      book.status === "available"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-rose-50 text-rose-600 border-rose-200"
                    )}>
                      {book.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="self-center">
                  <Button variant="ghost" size="icon" className="size-11 rounded-xl text-primarycolor hover:bg-primarycolor/10" asChild>
                    <Link href={`${dashboardRoot}/books/${book.unique_identification_code}`}>
                      <Eye className="size-5" />
                    </Link>
                  </Button>
                </div>
              </Link>
            ) : (
              <Link
                key={book.id}
                href={`${dashboardRoot}/books/${book.unique_identification_code}`}
                className="group relative flex flex-col bg-card rounded-2xl border-2 border-primarycolor/10 overflow-hidden shadow-sm hover:shadow-2xl hover:border-primarycolor/30 transition-all duration-500 hover:-translate-y-2 active:scale-95 block"
              >
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
                  <div className="absolute inset-0 bg-linear-to-t from-primarycolor/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                      {book.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-black text-primarycolor leading-tight line-clamp-2 min-h-[2.5rem]">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-bold text-secondarycolor/60">
                    <User className="size-3.5" />
                    <span className="truncate">{book.author}</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg border border-white/20">
                  #{book.id}
                </div>
              </Link>
            )
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