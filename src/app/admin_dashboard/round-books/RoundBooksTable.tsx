"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, Eye, BookOpen, Store } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import RoundDetailDialog from "./RoundDetailDialog";
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

export type RoundBook = {
  id: number;
  status: boolean;
  bookTitle: string;
  bookAuthor: string;
  bookSku: string;
  startingAmount: number;
  returnedAmount: number;
  storeCount: number;
  totalSold: number;
  createdAt: string;
};

interface RoundBooksTableProps {
  data: RoundBook[];
}

export function RoundBooksTable({ data }: RoundBooksTableProps) {
  const [detailRoundId, setDetailRoundId] = React.useState<number | null>(null);

  const columns = React.useMemo<ColumnDef<RoundBook>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-bold text-secondarycolor tabular-nums">#{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "bookTitle",
      header: "Book",
      cell: ({ row }) => (
        <div className="min-w-[160px] max-w-[260px]">
          <p className="font-black text-primarycolor leading-tight line-clamp-1" title={row.getValue("bookTitle")}>
            {row.getValue("bookTitle")}
          </p>
          {row.original.bookAuthor && (
            <p className="text-[10px] font-bold text-muted-foreground truncate">{row.original.bookAuthor}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("status") as boolean;
        return (
          <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2",
            active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
              : "bg-slate-50 text-slate-500 border-slate-200/50",
          )}>
            <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
            {active ? "Active" : "Ended"}
          </div>
        );
      },
    },
    {
      accessorKey: "startingAmount",
      header: "Starting",
      cell: ({ row }) => (
        <div className="font-bold tabular-nums text-slate-700">{row.getValue("startingAmount")}</div>
      ),
    },
    {
      accessorKey: "returnedAmount",
      header: "Returned",
      cell: ({ row }) => (
        <div className="font-bold tabular-nums text-slate-700">{row.getValue("returnedAmount")}</div>
      ),
    },
    {
      id: "sold",
      header: "Sold (ETB)",
      cell: ({ row }) => (
        <div className="font-black text-primarycolor tabular-nums">
          {row.original.totalSold.toLocaleString()} ETB
        </div>
      ),
    },
    {
      accessorKey: "storeCount",
      header: "Shops",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Store className="size-3.5 text-muted-foreground" />
          <span className="font-bold tabular-nums text-slate-700">{row.getValue("storeCount")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Details",
      cell: ({ row }) => {
        const round = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDetailRoundId(round.id)}
            className="size-10 hover:text-primarycolor hover:bg-primarycolor/10 rounded-full transition-all active:scale-90"
          >
            <Eye className="size-5" />
          </Button>
        );
      },
    },
  ], []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: false,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search by book title or author..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all duration-300 focus:shadow-inner"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-3xl border-2 border-primarycolor/10 bg-card shadow-2xl">
        <Table>
          <TableHeader className="bg-primarycolor/5 border-b-2 border-primarycolor/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 font-black text-secondarycolor py-4 text-xs uppercase tracking-[0.2em] px-6">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="group hover:bg-primarycolor/5 transition-all duration-300 border-primarycolor/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-80 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-40">
                    <BookOpen className="size-16 text-primarycolor" />
                    <p className="text-2xl font-black uppercase tracking-widest">No rounds found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const r = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-primarycolor text-lg leading-tight line-clamp-2">
                      {r.bookTitle}
                    </h3>
                    {r.bookAuthor && (
                      <p className="text-xs font-bold text-muted-foreground mt-1">{r.bookAuthor}</p>
                    )}
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 shrink-0",
                    r.status
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                      : "bg-slate-50 text-slate-500 border-slate-200/50",
                  )}>
                    {r.status ? "Active" : "Ended"}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-primarycolor/[0.02] rounded-xl border border-primarycolor/5 p-3">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Starting</p>
                    <p className="font-bold text-sm text-slate-700">{r.startingAmount}</p>
                  </div>
                  <div className="bg-primarycolor/[0.02] rounded-xl border border-primarycolor/5 p-3">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Returned</p>
                    <p className="font-bold text-sm text-slate-700">{r.returnedAmount}</p>
                  </div>
                  <div className="bg-primarycolor/[0.02] rounded-xl border border-primarycolor/5 p-3">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Sold</p>
                    <p className="font-bold text-sm text-primarycolor">{r.totalSold.toLocaleString()} ETB</p>
                  </div>
                  <div className="bg-primarycolor/[0.02] rounded-xl border border-primarycolor/5 p-3">
                    <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Shops</p>
                    <p className="font-bold text-sm text-slate-700">{r.storeCount}</p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t-2 border-primarycolor/5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDetailRoundId(r.id)}
                    className="text-primarycolor font-black hover:bg-primarycolor/10 rounded-2xl gap-2 w-full h-11"
                  >
                    <Eye className="size-4" />
                    View Details
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-6 opacity-30">
            <BookOpen className="size-20 mx-auto text-primarycolor" />
            <p className="text-2xl font-black uppercase tracking-widest">No rounds found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-4 py-8 border-t-2 border-primarycolor/5">
        <div className="text-sm font-black text-muted-foreground order-2 sm:order-1 uppercase tracking-widest">
          Showing <span className="text-primarycolor underline decoration-2 underline-offset-4">{table.getRowModel().rows.length}</span> /{" "}
          <span className="text-secondarycolor">{data.length}</span> Records
        </div>
        <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-12 px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90"
          >
            <ChevronLeft className="size-5 mr-1" />
            Prev
          </Button>
          <div className="flex items-center gap-3 px-6 h-12 bg-primarycolor/5 rounded-2xl text-xs font-black text-secondarycolor border-2 border-primarycolor/10 shadow-inner">
            PAGE {table.getState().pagination.pageIndex + 1} <span className="opacity-20 mx-1">OF</span> {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-12 px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90"
          >
            Next
            <ChevronRight className="size-5 ml-1" />
          </Button>
        </div>
      </div>

      <RoundDetailDialog
        open={detailRoundId !== null}
        onClose={() => setDetailRoundId(null)}
        roundId={detailRoundId}
      />
    </div>
  );
}