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
    FileText
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
      cell: ({ row }) => <span className="font-black text-primarycolor">ORD-{row.original.id}</span>
    },
    {
      accessorKey: "order_type",
      header: "Type",
      cell: ({ row }) => (
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit",
          row.original.order_type === "requested" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
        )}>
          {row.original.order_type}
        </div>
      )
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
            <span className="font-bold text-primarycolor line-clamp-1">{firstBook}</span>
            {others > 0 && (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                + {others} more books
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-black text-primarycolor">
            {row.original.total_amount.toLocaleString()} <span className="text-[10px] opacity-40">ETB</span>
          </span>
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
            Paid: {row.original.amount_paid.toLocaleString()}
          </span>
        </div>
      )
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
      )
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
      )
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
      )
    }
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
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
          <Input
            placeholder="Filter orders by ID or details..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-12 pl-12 bg-white border-slate-200 focus:border-primarycolor rounded-2xl font-bold"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <Filter className="size-3" /> {data.length} Orders
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="h-20 border-b border-slate-50 hover:bg-primarycolor/[0.02] transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground italic">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
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
