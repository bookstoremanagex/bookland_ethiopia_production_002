"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Store,
  Loader2,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getBookStoreStock } from "./actions";

type BookRow = {
  id: number;
  title: string;
  author: string | null;
  isbn: string | null;
  unique_identification_code: string;
  book_sku: string;
  status: string;
  editionCount: number;
};

type EditionStock = {
  id: number;
  editionName: string;
  sellingPrice: number;
  totalStock: number;
  stores: { storeId: number; storeName: string; quantity: number }[];
};

export default function BooksList({ initialBooks }: { initialBooks: BookRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<BookRow | null>(null);
  const [stockData, setStockData] = useState<EditionStock[] | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);

  const handleBookClick = async (book: BookRow) => {
    setSelectedBook(book);
    setStockData(null);
    setLoadingStock(true);
    try {
      const res = await getBookStoreStock(book.id);
      if (res.success) {
        setStockData(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingStock(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return initialBooks;
    const q = search.toLowerCase();
    return initialBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author?.toLowerCase() || "").includes(q) ||
        (b.isbn?.toLowerCase() || "").includes(q)
    );
  }, [initialBooks, search]);

  const columns = useMemo<ColumnDef<BookRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
              <BookOpen className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-slate-800 truncate">{row.original.title}</p>
              <p className="text-[9px] font-bold text-muted-foreground truncate">{row.original.unique_identification_code}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600 font-medium">{row.original.author || "-"}</span>
        ),
      },
      {
        accessorKey: "isbn",
        header: "ISBN",
        cell: ({ row }) => (
          <span className="text-xs font-bold text-muted-foreground">{row.original.isbn || "-"}</span>
        ),
      },
      {
        accessorKey: "editionCount",
        header: "Editions",
        cell: ({ row }) => (
          <span className="font-bold text-sm text-slate-800">{row.original.editionCount}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider",
                status === "available"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status === "available" ? "bg-emerald-500" : "bg-amber-500"
                )}
              />
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent -mt-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author or ISBN..."
              className="h-12 pl-12 pr-10 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md font-bold text-sm focus:border-primarycolor shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => router.refresh()}
            className="size-12 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 transition-all shrink-0 shadow-sm"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="size-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">
              {search ? "No books match your search" : "No books available"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="p-4 space-y-3 md:hidden">
              {table.getRowModel().rows.map((row) => {
                const b = row.original;
                return (
                  <div
                    key={b.id}
                    onClick={() => handleBookClick(b)}
                    className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-md space-y-3 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                        <BookOpen className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-slate-800 truncate">{b.title}</p>
                        <p className="text-[9px] font-bold text-muted-foreground truncate">{b.unique_identification_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">{b.author || "-"}</span>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-black text-[8px] uppercase tracking-wider",
                        b.status === "available"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}>
                        <span className={cn("size-1.5 rounded-full", b.status === "available" ? "bg-emerald-500" : "bg-amber-500")} />
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground font-bold">
                      <span>{b.editionCount} edition{b.editionCount !== 1 ? "s" : ""}</span>
                      <span>ISBN: {b.isbn || "-"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primarycolor/[0.02]">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b-2 border-primarycolor/5">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="h-12 px-6 text-left text-[9px] font-black uppercase tracking-[0.2em] text-secondarycolor/60"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleBookClick(row.original)}
                      className="border-b border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-all cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-4 px-6">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
              <div className="sticky bottom-0 z-10 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent">
                <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-primarycolor/5 p-2 shadow-lg">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 pl-3">
                    {filtered.length} book{filtered.length !== 1 ? "s" : ""}
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

      <Dialog open={!!selectedBook} onOpenChange={(o) => !o && setSelectedBook(null)}>
        <DialogContent className="sm:max-w-2xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          {selectedBook && (
            <>
              <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                    <BookOpen className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor truncate">
                      {selectedBook.title}
                    </DialogTitle>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{selectedBook.unique_identification_code}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loadingStock ? (
                  <div className="flex items-center justify-center gap-2 py-12">
                    <Loader2 className="size-5 animate-spin text-primarycolor" />
                    <span className="text-[10px] font-bold text-muted-foreground">Loading stock data...</span>
                  </div>
                ) : stockData && stockData.length > 0 ? (
                  stockData.map((ed) => (
                    <div key={ed.id} className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 overflow-hidden">
                      <div className="p-4 border-b border-primarycolor/5 flex items-center justify-between">
                        <p className="font-bold text-sm text-slate-800">{ed.editionName}</p>
                        <span className="text-[9px] font-black text-primarycolor bg-primarycolor/5 px-2.5 py-1 rounded-lg">
                          Total: {ed.totalStock}
                        </span>
                      </div>
                      {ed.stores.length > 0 ? (
                        <div className="divide-y divide-primarycolor/5">
                          {ed.stores.map((store) => (
                            <div key={store.storeId} className="flex items-center gap-3 px-4 py-3">
                              <div className="size-8 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                                <Store className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-sm text-slate-700 truncate">{store.storeName}</p>
                              </div>
                              <span className="font-black text-sm text-primarycolor tabular-nums">{store.quantity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-4 text-center">
                          <p className="text-[10px] font-bold text-muted-foreground">No stock available in any store</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Package className="size-10 mx-auto text-muted-foreground/20 mb-3" />
                    <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">No editions or stock found</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedBook(null)}
                  className="w-full h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
