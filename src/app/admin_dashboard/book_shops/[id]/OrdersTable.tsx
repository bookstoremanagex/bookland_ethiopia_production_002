"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Calendar,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Receipt,
  Banknote,
  FileText,
  Store,
  Eye,
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type Order = {
  id: number;
  order_type: string;
  total_amount: number;
  amount_paid: number;
  status: string;
  is_approved: boolean;
  memo: string | null;
  createdAt: string | Date;
  order_items: {
    id: number;
    quantity: number;
    price_at_order: number;
    bookedition: {
      edition_name: string;
      books: {
        title: string;
      };
    };
  }[];
};

interface OrdersTableProps {
  data: Order[];
  onViewDetails: (order: Order) => void;
}

export function OrdersTable({ data, onViewDetails }: OrdersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor">
          ORD-{row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "order_type",
      header: "Type",
      cell: ({ row }) => (
        <div
          className={cn(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit",
            row.original.order_type === "requested"
              ? "bg-blue-100 text-blue-600"
              : "bg-purple-100 text-purple-600",
          )}
        >
          {row.original.order_type}
        </div>
      ),
    },
    {
      id: "books",
      header: "Books",
      cell: ({ row }) => {
        const items = row.original.order_items || [];
        const firstBook = items[0]?.bookedition?.books?.title || "Unknown";
        const others = items.length - 1;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-primarycolor line-clamp-1">
              {firstBook}
            </span>
            {others > 0 && (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                + {others} more books
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-black text-primarycolor">
            {row.original.total_amount.toLocaleString()}{" "}
            <span className="text-[10px] opacity-40">ETB</span>
          </span>
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-tight">
            Paid: {row.original.amount_paid.toLocaleString()} ETB
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.is_approved ? (
            <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 className="size-3.5" /> Approved
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest">
              <Clock className="size-3.5" /> Pending
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-3.5" />
          <span className="font-bold text-[10px]">
            {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row.original)}
          className="rounded-xl hover:bg-primarycolor hover:text-white font-black uppercase text-[10px] tracking-widest"
        >
          Details
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2 md:gap-4 bg-slate-50 p-3 md:p-4 rounded-3xl border-2 border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3.5 md:size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
          <Input
            placeholder="Filter orders..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-10 md:h-12 pl-9 md:pl-12 bg-white border-slate-200 focus:border-primarycolor rounded-xl md:rounded-2xl font-bold text-xs md:text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-white border border-slate-200 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
          <Filter className="size-3 hidden md:block" /> {data.length}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b-2 border-slate-100"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="h-20 border-b border-slate-50 hover:bg-primarycolor/[0.02] transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-muted-foreground italic"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const o = row.original;
            const items = o.order_items || [];
            const firstBook = items[0]?.bookedition?.books?.title || "Unknown";
            const others = items.length - 1;
            return (
              <div
                key={o.id}
                className="bg-white rounded-[2rem] border-2 border-slate-100 p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-primarycolor">ORD-{o.id}</span>
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      o.order_type === "requested"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600",
                    )}
                  >
                    {o.order_type}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-700 line-clamp-1">{firstBook}</p>
                  {others > 0 && (
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      + {others} more book{others > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                    <p className="font-black text-primarycolor text-sm">{o.total_amount.toLocaleString()} ETB</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Paid</p>
                    <p className="font-bold text-emerald-600 text-sm">{o.amount_paid.toLocaleString()} ETB</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    {o.is_approved ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="size-3" /> Approved
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600 text-[9px] font-black uppercase tracking-widest">
                        <Clock className="size-3" /> Pending
                      </div>
                    )}
                    <span className="text-[8px] text-muted-foreground font-bold ml-2">
                      {format(new Date(o.createdAt), "MMM dd")}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(o)}
                    className="h-8 px-3 rounded-xl bg-primarycolor/10 hover:bg-primarycolor hover:text-white text-primarycolor font-black uppercase text-[9px] tracking-widest gap-1"
                  >
                    <Eye className="size-3" /> View
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-muted-foreground italic bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <ShoppingBag className="size-8 mx-auto mb-3 text-slate-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No orders found</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-10 px-4 border-2 border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-10 px-4 border-2 border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
