"use client";

import React, { useState, useTransition } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  setBookRetailAvailability,
  setAllBooksRetailAvailability,
} from "@/app/actions/book-actions";

interface Book {
  id: number;
  title: string;
  author: string | null;
  available_for_retail: boolean;
  productionstatus: string | null;
}

interface Props {
  data: Book[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  search: string;
}

export function OurBooksTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  search,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(search);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [togglingAll, setTogglingAll] = useState(false);
  const [localData, setLocalData] = useState<Book[]>(data);
  const [confirmAllDialog, setConfirmAllDialog] = useState(false);

  const allEnabled = localData.length > 0 && localData.every((b) => b.available_for_retail);
  const someEnabled = localData.some((b) => b.available_for_retail);

  const handleToggle = async (bookId: number, currentValue: boolean) => {
    setTogglingId(bookId);
    const newValue = !currentValue;
    setLocalData((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, available_for_retail: newValue } : b
      )
    );
    try {
      const res = await setBookRetailAvailability(bookId, newValue);
      if (!res.success) {
        toast.error(res.error || "Failed to update");
        setLocalData((prev) =>
          prev.map((b) =>
            b.id === bookId ? { ...b, available_for_retail: currentValue } : b
          )
        );
      } else {
        toast.success(newValue ? "Enabled for retail" : "Disabled for retail");
      }
    } catch {
      toast.error("Failed to update");
      setLocalData((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, available_for_retail: currentValue } : b
        )
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleAll = async () => {
    const newValue = !allEnabled;
    setTogglingAll(true);
    setLocalData((prev) =>
      prev.map((b) => ({ ...b, available_for_retail: newValue }))
    );
    try {
      const res = await setAllBooksRetailAvailability(newValue);
      if (!res.success) {
        toast.error(res.error || "Failed to update");
        setLocalData((prev) =>
          prev.map((b) => ({ ...b, available_for_retail: !newValue }))
        );
      } else {
        toast.success(newValue ? "All books enabled for retail" : "All books disabled for retail");
      }
    } catch {
      toast.error("Failed to update");
      setLocalData((prev) =>
        prev.map((b) => ({ ...b, available_for_retail: !newValue }))
      );
    } finally {
      setTogglingAll(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    params.set("page", "1");
    router.push(`/admin_dashboard/retail-shop/our-books?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    router.push(`/admin_dashboard/retail-shop/our-books?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const columns: ColumnDef<Book>[] = [
    {
      accessorKey: "title",
      header: "Book Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-lg bg-primarycolor/10 flex items-center justify-center shrink-0">
            <BookOpen className="size-4 text-primarycolor" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-primarycolor text-xs uppercase truncate">
              {row.original.title}
            </p>
            <p className="text-[9px] font-bold text-muted-foreground truncate">
              {row.original.author || "Unknown Author"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-slate-600">
          {row.original.author || "—"}
        </span>
      ),
    },
    {
      id: "retail",
      header: () => (
        <div className="flex items-center justify-between">
          <span>Retail</span>
          <button
            onClick={() => setConfirmAllDialog(true)}
            disabled={togglingAll}
            className={cn(
              "flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-all",
              allEnabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : someEnabled
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
            title={allEnabled ? "Disable all" : "Enable all"}
          >
            {togglingAll ? (
              <Loader2 className="size-3 animate-spin" />
            ) : allEnabled ? (
              <ToggleRight className="size-3" />
            ) : (
              <ToggleLeft className="size-3" />
            )}
            {allEnabled ? "All On" : someEnabled ? "Mixed" : "All Off"}
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const book = row.original;
        const isOn = book.available_for_retail;
        const isToggling = togglingId === book.id;
        return (
          <button
            onClick={() => handleToggle(book.id, isOn)}
            disabled={isToggling}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
              isOn ? "bg-primarycolor" : "bg-slate-200"
            )}
          >
            <span
              className={cn(
                "inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm",
                isOn ? "translate-x-6" : "translate-x-1"
              )}
            >
              {isToggling && (
                <Loader2 className="size-4 animate-spin text-primarycolor" />
              )}
            </span>
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: localData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: { pagination: { pageIndex: currentPage - 1, pageSize } },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or author..."
            className="h-10 pl-10 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-primarycolor"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="h-10 px-4 rounded-xl border-2 border-slate-200 font-black text-[9px] uppercase tracking-widest"
        >
          Search
        </Button>
        {search && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearchInput("");
              router.push("/admin_dashboard/retail-shop/our-books");
            }}
            className="h-10 px-3 rounded-xl font-black text-[9px] uppercase tracking-widest text-muted-foreground"
          >
            Clear
          </Button>
        )}
      </form>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {totalCount} book{totalCount !== 1 ? "s" : ""} in sales
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-b-2 border-slate-100">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[9px] font-black uppercase tracking-widest text-muted-foreground h-12 px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <BookOpen className="size-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    No books found
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
            >
              <ChevronLeft className="size-3 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
            >
              Next <ChevronRight className="size-3 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle all confirmation */}
      <AlertDialog open={confirmAllDialog} onOpenChange={setConfirmAllDialog}>
        <AlertDialogContent className="rounded-2xl border-2 border-primarycolor/5">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-black text-primarycolor uppercase tracking-tight italic">
              {allEnabled ? "Disable" : "Enable"} All for Retail?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
              {allEnabled
                ? "Remove all books from the retail shop? Customers won't be able to see or order any books."
                : "Make all SALES books available in the retail shop? Customers will be able to see and order them."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleToggleAll}
                className={cn(
                  "rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest",
                  allEnabled
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-primarycolor hover:bg-secondarycolor text-white"
                )}
              >
                {allEnabled ? "Disable All" : "Enable All"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
