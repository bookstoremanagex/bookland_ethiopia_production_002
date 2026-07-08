"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updatePrintOrderItemStatus } from "@/app/actions/print-order-actions";
import { useRouter } from "next/navigation";

const itemStatusOptions = [
  { value: "NOT_STARTED", label: "Not Started", color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-400" },
  { value: "STARTED", label: "Started", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-400" },
  { value: "ONPROGRESS", label: "In Progress", color: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-400" },
  { value: "COMPLETED", label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400" },
];

const getStatusStyle = (status: string) => {
  return itemStatusOptions.find(s => s.value === status)?.color || "bg-amber-50 text-amber-600 border-amber-200";
};

interface CollectiveBook {
  id: number;
  orderId: number;
  bookEditionId: number;
  projectName: string;
  bookTitle: string;
  bookAuthor: string;
  editionName: string;
  quantity: number;
  totalPrice: number;
  remaining: number | null;
  status: string;
  content: string;
  paidAmount: number;
  payments: any[];
}

interface Props {
  books: CollectiveBook[];
  projectCount: number;
}

export default function BooksCollectiveTable({ books, projectCount }: Props) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<CollectiveBook | null>(null);

  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
      return 0;
    });
  }, [books]);

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    setUpdatingId(itemId);
    try {
      const res = await updatePrintOrderItemStatus(itemId, newStatus);
      if (res.success) {
        toast.success("Item status updated");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: ColumnDef<CollectiveBook>[] = [
    {
      accessorKey: "bookTitle",
      header: "Book Title",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-slate-700 leading-tight block max-w-[200px] truncate">
          {row.getValue("bookTitle")}
        </span>
      ),
    },
    {
      accessorKey: "editionName",
      header: "Edition",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-slate-400">{row.getValue("editionName")}</span>
      ),
    },
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-primarycolor truncate block max-w-[140px]">
          {row.getValue("projectName")}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Copies",
      cell: ({ row }) => (
        <span className="font-black text-slate-700">{(row.getValue("quantity") as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "remaining",
      header: "Remaining",
      cell: ({ row }) => {
        const rem = row.getValue("remaining") as number | null;
        return (
          <span className={cn("font-black", rem != null && rem > 0 ? "text-amber-500" : "text-emerald-500")}>
            {rem != null ? rem.toLocaleString() : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-black text-slate-700">{(row.getValue("totalPrice") as number).toLocaleString()} ETB</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const book = row.original;
        const isCompleted = status === "COMPLETED";
        return (
          <select
            value={status}
            onChange={(e) => {
              if (isCompleted) {
                toast.error("Cannot change a completed item");
                return;
              }
              handleStatusChange(book.id, e.target.value);
            }}
            disabled={updatingId === book.id || isCompleted}
            className={cn(
              "h-8 px-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[105px]",
              updatingId === book.id && "opacity-50 pointer-events-none",
              isCompleted && "opacity-60 cursor-not-allowed",
              getStatusStyle(status),
            )}
          >
            {itemStatusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setDetailItem(row.original)}
          className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primarycolor/5 text-primarycolor hover:bg-primarycolor hover:text-white transition-all"
        >
          Details
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: sortedBooks,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            placeholder="Search by title, project, or edition..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block rounded-xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-slate-50/80 hover:bg-slate-50/80">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-t border-slate-100 hover:bg-slate-50/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="size-8 text-slate-200" />
                      <p className="text-sm font-bold text-slate-400">No books found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const book = row.original;
              const isCompleted = book.status === "COMPLETED";
              return (
                <div key={book.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 leading-tight">{book.bookTitle}</p>
                      <p className="text-[11px] font-bold text-slate-400">{book.editionName}</p>
                    </div>
                    <select
                      value={book.status}
                      onChange={(e) => {
                        if (isCompleted) {
                          toast.error("Cannot change a completed item");
                          return;
                        }
                        handleStatusChange(book.id, e.target.value);
                      }}
                      disabled={updatingId === book.id || isCompleted}
                      className={cn(
                        "h-7 px-2 rounded-lg border text-[9px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all min-w-[90px] shrink-0",
                        updatingId === book.id && "opacity-50 pointer-events-none",
                        isCompleted && "opacity-60 cursor-not-allowed",
                        getStatusStyle(book.status),
                      )}
                    >
                      {itemStatusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4 text-xs flex-wrap">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Project</span>
                      <span className="font-bold text-primarycolor">{book.projectName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Copies</span>
                      <span className="font-black text-slate-700">{book.quantity.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Remaining</span>
                      <span className={cn("font-black", book.remaining != null && book.remaining > 0 ? "text-amber-500" : "text-emerald-500")}>
                        {book.remaining != null ? book.remaining.toLocaleString() : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Price</span>
                      <span className="font-black text-slate-700">{book.totalPrice.toLocaleString()} ETB</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailItem(book)}
                    className="w-full h-8 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primarycolor/5 text-primarycolor hover:bg-primarycolor hover:text-white transition-all"
                  >
                    Details
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <BookOpen className="size-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-400">No books found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">
            {table.getFilteredRowModel().rows.length} of {sortedBooks.length} item(s)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 rounded-lg text-xs font-bold"
            >
              <ChevronLeft className="size-3.5 mr-1" />
              Prev
            </Button>
            <span className="text-xs font-bold text-slate-500 min-w-[60px] text-center">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 rounded-lg text-xs font-bold"
            >
              Next
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailItem(null)}>
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                    <BookOpen className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{detailItem.bookTitle}</h3>
                    <p className="text-sm font-bold text-slate-400">{detailItem.bookAuthor}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailItem(null)}
                  className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center shrink-0 transition-colors"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Edition</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{detailItem.editionName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Project</p>
                  <p className="text-sm font-black text-primarycolor mt-1 truncate">{detailItem.projectName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Copies</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{detailItem.quantity.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remaining</p>
                  <p className={cn("text-sm font-black mt-1", detailItem.remaining != null && detailItem.remaining > 0 ? "text-amber-500" : "text-emerald-500")}>
                    {detailItem.remaining != null ? detailItem.remaining.toLocaleString() : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Total Cost</p>
                  <p className="text-lg font-black text-emerald-700 mt-1">{detailItem.totalPrice.toLocaleString()} ETB</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Paid Amount</p>
                  <p className="text-lg font-black text-blue-700 mt-1">{detailItem.paidAmount.toLocaleString()} ETB</p>
                </div>
              </div>

              {detailItem.content && (
                <div className="bg-slate-50 rounded-xl p-5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Content Notes</p>
                  <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">{detailItem.content}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
