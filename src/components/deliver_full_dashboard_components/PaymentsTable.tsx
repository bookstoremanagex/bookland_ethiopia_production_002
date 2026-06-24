"use client";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Store,
  MapPin,
  BadgeDollarSign,
  ArrowUpDown,
  Search,
  X,
  Banknote,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RecordPaymentModal from "./RecordPaymentModal";

export type ShopRow = {
  id: number;
  name: string;
  branch: string;
  remaining: number;
};

const columns: ColumnDef<ShopRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-black"
      >
        SHOP NAME
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const shop = row.original;
      return (
        <Link
          href={`/delivery_dashboard_full/payments/${shop.id}`}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor font-black shadow-inner">
            <Store className="size-5" />
          </div>
          <span className="font-bold text-gray-800 group-hover:text-primarycolor transition-colors">{shop.name}</span>
          <ChevronRightIcon className="size-4 text-muted-foreground/30 group-hover:text-primarycolor/50 transition-colors -ml-1" />
        </Link>
      );
    },
  },
  {
    accessorKey: "branch",
    header: "BRANCH",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-gray-500 font-medium">
        <MapPin className="size-4 opacity-50" />
        {row.getValue("branch")}
      </div>
    ),
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-black text-right w-full justify-end"
      >
        REMAINING
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const remaining = row.getValue("remaining") as number;
      return (
        <div className="text-right">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs border",
              remaining > 0
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100"
            )}
          >
            <BadgeDollarSign className="size-3" />
            {remaining.toLocaleString()} <span className="text-[9px]">ETB</span>
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const shop = row.original;
      return shop.remaining > 0 ? (
        <RecordPaymentModal
          shopId={shop.id}
          shopName={shop.name}
          trigger={
            <Button
              variant="ghost"
              className="rounded-xl bg-primarycolor/10 hover:bg-primarycolor text-primarycolor hover:text-white font-black uppercase text-[10px] tracking-widest gap-1.5 transition-all"
            >
              <Banknote className="size-3.5" /> Record Payment
            </Button>
          }
        />
      ) : (
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
          Paid
        </span>
      );
    },
  },
];

interface PaymentsTableProps {
  data: ShopRow[];
}

export default function PaymentsTable({ data }: PaymentsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
    globalFilterFn: "includesString",
    initialState: { pagination: { pageSize: 5 } },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500">Manage book shop payments</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <Input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search shops..."
            className="h-12 pl-12 pr-10 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-sm focus:border-primarycolor"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="hidden md:block rounded-[2rem] border-2 border-primarycolor/5 bg-white shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-primarycolor/[0.02]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-primarycolor/5">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondarycolor/60">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="group hover:bg-primarycolor/[0.02] transition-all duration-300 border-b border-primarycolor/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-6 px-8">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center font-bold text-gray-400 uppercase tracking-widest text-xs">
                  {globalFilter ? "No shops match your search" : "No data available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const shop = row.original;
            return (
              <div
                key={row.id}
                className="bg-white rounded-3xl border-2 border-primarycolor/5 p-6 shadow-lg space-y-4"
              >
                <Link
                  href={`/delivery_dashboard_full/payments/${shop.id}`}
                  className="flex items-start justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-inner">
                      <Store className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-black text-gray-800 text-sm leading-none group-hover:text-primarycolor transition-colors">{shop.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <MapPin className="size-3" />
                        {shop.branch}
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon className="size-5 text-muted-foreground/30 group-hover:text-primarycolor/50 transition-colors mt-1" />
                </Link>

                <div className="flex items-center justify-between pt-4 border-t border-primarycolor/5">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Remaining
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs border",
                      shop.remaining > 0
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}
                  >
                    <BadgeDollarSign className="size-3" />
                    {shop.remaining.toLocaleString()} ETB
                  </span>
                </div>

                {shop.remaining > 0 ? (
                  <RecordPaymentModal
                    shopId={shop.id}
                    shopName={shop.name}
                    trigger={
                      <button className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] transition-all">
                        <Banknote className="size-3.5" /> Record Payment
                      </button>
                    }
                  />
                ) : (
                  <div className="w-full text-center text-[10px] font-black text-emerald-600 uppercase tracking-widest py-2">
                    All Paid
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center font-black text-gray-300 uppercase tracking-widest text-[10px]">
            {globalFilter ? "No shops match your search" : "No data available"}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-4">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <span className="opacity-30">|</span>
          <span>{filteredCount} shop{filteredCount !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex-1 sm:flex-none h-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
          >
            <ChevronLeft className="size-4 mr-1" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex-1 sm:flex-none h-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
          >
            Next <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
