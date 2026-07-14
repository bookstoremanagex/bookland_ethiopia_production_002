"use client";

import { useState, useMemo, useEffect } from "react";
import { useCalendar } from "@/lib/calendar-context";
import {
  Search,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Store,
  Calendar,
  PlusCircle,
  Loader2,
  CheckIcon,
  Eye,
  Trash2,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getBooksForRound, createRoundBook, deleteRoundBook } from "./actions";

type RoundBookRow = {
  id: number;
  status: boolean;
  book: {
    id: number;
    title: string;
    author: string | null;
    unique_identification_code: string;
    book_sku: string;
  };
  starting_amount: number;
  returned_amount: number;
  storeCount: number;
  stores: { id: number; shopId: number | null; storeName: string; location: string; branch: string; totalprice: number }[];
  createdAt: string | Date;
};

export default function RoundBooksList({ initialData }: { initialData: RoundBookRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { formatShort } = useCalendar();
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [availableBooks, setAvailableBooks] = useState<any[]>([]);
  const [bookSearch, setBookSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedEdition, setSelectedEdition] = useState<any>(null);
  const [startingAmount, setStartingAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roundBookToDelete, setRoundBookToDelete] = useState<RoundBookRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!roundBookToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteRoundBook(roundBookToDelete.id);
      if (res.success) {
        toast.success("Round book deleted");
        setShowDeleteConfirm(false);
        setRoundBookToDelete(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (showStartDialog) {
      setSelectedBook(null);
      setSelectedEdition(null);
      setBookSearch("");
      setStartingAmount("");
      getBooksForRound().then((res) => {
        if (res.success) setAvailableBooks(res.data || []);
      });
    }
  }, [showStartDialog]);

  const filteredBooks = useMemo(() => {
    if (!bookSearch) return availableBooks;
    const q = bookSearch.toLowerCase();
    return availableBooks.filter(
      (b: any) =>
        b.title.toLowerCase().includes(q) ||
        (b.author?.toLowerCase() || "").includes(q) ||
        b.unique_identification_code.toLowerCase().includes(q) ||
        b.book_sku.toLowerCase().includes(q),
    );
  }, [availableBooks, bookSearch]);

  const handleStartRound = async () => {
    if (!selectedBook) {
      toast.error("Please select a book");
      return;
    }
    if (!selectedEdition) {
      toast.error("Please select an edition");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createRoundBook({
        bookId: selectedBook.id,
        editionId: selectedEdition.id,
        starting_amount: startingAmount ? parseInt(startingAmount, 10) : null,
      });
      if (res.success) {
        toast.success("Round book started successfully");
        setShowStartDialog(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to start round");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return initialData;
    const q = search.toLowerCase();
    return initialData.filter(
      (rb) =>
        rb.book.title.toLowerCase().includes(q) ||
        (rb.book.author?.toLowerCase() || "").includes(q) ||
        rb.book.unique_identification_code.toLowerCase().includes(q) ||
        rb.book.book_sku.toLowerCase().includes(q),
    );
  }, [initialData, search]);

  const columns = useMemo<ColumnDef<RoundBookRow>[]>(
    () => [
      {
        accessorKey: "book.title",
        header: "Book",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
              <BookOpen className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-slate-800 truncate">{row.original.book.title}</p>
              <p className="text-[9px] font-bold text-muted-foreground truncate">{row.original.book.unique_identification_code}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "book.author",
        header: "Author",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600 font-medium">{row.original.book.author || "-"}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const active = row.original.status;
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider",
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-emerald-500" : "bg-slate-400",
                )}
              />
              {active ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        accessorKey: "starting_amount",
        header: "Started",
        cell: ({ row }) => (
          <span className="font-bold text-sm text-slate-800 tabular-nums">
            {row.original.starting_amount}
          </span>
        ),
      },
      {
        accessorKey: "returned_amount",
        header: "Returned",
        cell: ({ row }) => (
          <span className="font-bold text-sm text-slate-800 tabular-nums">
            {row.original.returned_amount}
          </span>
        ),
      },
      {
        accessorKey: "storeCount",
        header: "Stores",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Store className="size-3.5 text-primarycolor/60" />
            <span className="font-bold text-sm text-slate-800">{row.original.storeCount}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const rb = row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push(`/delivery_dashboard_full/round-books/${rb.id}`)}
                className="size-9 rounded-xl hover:bg-primarycolor/10 text-primarycolor flex items-center justify-center transition-all active:scale-90"
              >
                <Eye className="size-4" />
              </button>
              <button
                onClick={() => { setRoundBookToDelete(rb); setShowDeleteConfirm(true); }}
                className="size-9 rounded-xl hover:bg-rose-50 text-rose-500 flex items-center justify-center transition-all active:scale-90"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [],
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
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author or code..."
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
          onClick={() => setShowStartDialog(true)}
          className="h-12 px-5 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-primarycolor/20 active:scale-[0.97]"
        >
          <PlusCircle className="size-4" />
          <span className="hidden sm:inline">Start Rounding</span>
        </button>
        <button
          onClick={() => router.refresh()}
          className="size-12 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 transition-all shrink-0 shadow-sm"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="size-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-black text-gray-300 text-[10px] uppercase tracking-widest">
              {search ? "No round books match your search" : "No round books available"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="p-4 space-y-3 md:hidden">
              {table.getRowModel().rows.map((row) => {
                const rb = row.original;
                const dateStr = formatShort(new Date(rb.createdAt));
                return (
                  <div
                    key={rb.id}
                    className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-md space-y-3 active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                        <BookOpen className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-slate-800 truncate">{rb.book.title}</p>
                        <p className="text-[9px] font-bold text-muted-foreground truncate">{rb.book.unique_identification_code}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">{rb.book.author || "-"}</span>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-black text-[8px] uppercase tracking-wider",
                        rb.status
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500",
                      )}>
                        <span className={cn("size-1.5 rounded-full", rb.status ? "bg-emerald-500" : "bg-slate-400")} />
                        {rb.status ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-primarycolor/[0.02] rounded-xl p-2.5 text-center">
                        <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Started</p>
                        <p className="font-bold text-sm text-slate-800 mt-0.5">{rb.starting_amount}</p>
                      </div>
                      <div className="bg-primarycolor/[0.02] rounded-xl p-2.5 text-center">
                        <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Returned</p>
                        <p className="font-bold text-sm text-slate-800 mt-0.5">{rb.returned_amount}</p>
                      </div>
                      <div className="bg-primarycolor/[0.02] rounded-xl p-2.5 text-center">
                        <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Stores</p>
                        <p className="font-bold text-sm text-primarycolor mt-0.5">{rb.storeCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => router.push(`/delivery_dashboard_full/round-books/${rb.id}`)}
                        className="flex-1 h-9 rounded-xl bg-primarycolor/5 hover:bg-primarycolor/10 text-primarycolor font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
                      >
                        <Eye className="size-3.5" />
                        Details
                      </button>
                      <button
                        onClick={() => { setRoundBookToDelete(rb); setShowDeleteConfirm(true); }}
                        className="flex-1 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold">
                      <Calendar className="size-3" />
                      {dateStr}
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
                  {table.getRowModel().rows.map((row) => {
                    const rb = row.original;
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-all"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-4 px-6">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
              <div className="sticky bottom-0 z-10 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent">
                <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-primarycolor/5 p-2 shadow-lg">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 pl-3">
                    {filtered.length} round book{filtered.length !== 1 ? "s" : ""}
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

      <Dialog open={showStartDialog} onOpenChange={(o) => !o && setShowStartDialog(false)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <BookOpen className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                  Start New Round Book
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Select book, edition & starting amount</p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Book search */}
            <div className="space-y-2">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Select Book</p>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                <Input
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  placeholder="Search by title, author or code..."
                  className="h-12 pl-12 pr-4 rounded-2xl border-2 border-primarycolor/5 bg-primarycolor/[0.02] font-bold text-sm focus:border-primarycolor"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 rounded-2xl border-2 border-primarycolor/5 p-1.5">
                {filteredBooks.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground">No books found</p>
                  </div>
                ) : (
                  filteredBooks.map((book: any) => {
                    const isSelected = selectedBook?.id === book.id;
                    return (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => { setSelectedBook(isSelected ? null : book); setSelectedEdition(null); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                          isSelected
                            ? "bg-primarycolor/10 border-2 border-primarycolor/30"
                            : "bg-transparent border-2 border-transparent hover:bg-primarycolor/[0.03]",
                        )}
                      >
                        <div className={cn(
                          "size-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                          isSelected ? "bg-primarycolor text-white" : "bg-primarycolor/5 text-primarycolor",
                        )}>
                          {isSelected ? <CheckIcon className="size-4" /> : <BookOpen className="size-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "font-bold text-sm truncate",
                            isSelected ? "text-primarycolor" : "text-slate-800",
                          )}>{book.title}</p>
                          <p className="text-[9px] font-bold text-muted-foreground truncate">
                            {book.author ? `${book.author} · ` : ""}{book.unique_identification_code}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Edition selection */}
            {selectedBook && selectedBook.bookedition && selectedBook.bookedition.length > 0 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Select Edition</p>
                <div className="max-h-36 overflow-y-auto space-y-1 rounded-2xl border-2 border-primarycolor/5 p-1.5">
                  {selectedBook.bookedition.map((edition: any) => {
                    const isSelected = selectedEdition?.id === edition.id;
                    return (
                      <button
                        key={edition.id}
                        type="button"
                        onClick={() => setSelectedEdition(isSelected ? null : edition)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                          isSelected
                            ? "bg-emerald-50 border-2 border-emerald-200"
                            : "bg-transparent border-2 border-transparent hover:bg-emerald-50/50",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                            isSelected ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600",
                          )}>
                            {isSelected ? <CheckIcon className="size-3.5" /> : <Layers className="size-3.5" />}
                          </div>
                          <span className={cn(
                            "font-bold text-sm",
                            isSelected ? "text-emerald-700" : "text-slate-700",
                          )}>{edition.edition_name}</span>
                        </div>
                        {edition.selling_price != null && (
                          <span className="text-[9px] font-bold text-muted-foreground">
                            {edition.selling_price.toLocaleString()} ETB
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Starting amount */}
            {selectedEdition && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Starting Amount</p>
                <Input
                  type="number"
                  value={startingAmount}
                  onChange={(e) => setStartingAmount(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="h-12 px-4 rounded-2xl border-2 border-primarycolor/5 bg-primarycolor/[0.02] font-bold text-sm focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleStartRound}
                disabled={isSubmitting || !selectedBook || !selectedEdition}
                className="flex-1 h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-sm shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <BookOpen className="size-5" />
                )}
                {isSubmitting ? "Starting..." : "Start Round"}
              </button>
              <button
                onClick={() => setShowStartDialog(false)}
                className="flex-1 h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
              Delete Round Book
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="text-primarycolor">{roundBookToDelete?.book.title || "this round book"}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel asChild>
              <button className="flex-1 h-12 rounded-2xl border-2 border-slate-200 font-black text-[9px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                Cancel
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
