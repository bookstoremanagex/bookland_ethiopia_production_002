"use client";

import * as React from "react";
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
    TableRow 
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
    ArrowRight,
    Search,
    X,
    Banknote,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import RecordPaymentModal from "@/app/admin_dashboard/book_shops/[id]/RecordPaymentModal";

export type ShopFinance = {
  id: number;
  name: string;
  location: string;
  phone: string;
  totalRemaining: number;
  totalDebt: number;
  totalPaid: number;
};

interface ShopsFinanceTableProps {
  data: ShopFinance[];
}

export default function ShopsFinanceTable({ data }: ShopsFinanceTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedShop, setSelectedShop] = React.useState<ShopFinance | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

  const columns = React.useMemo<ColumnDef<ShopFinance>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-black"
          >
            SHOP NAME
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor font-black shadow-inner">
            <Store className="size-5" />
          </div>
          <span className="font-bold text-gray-800">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "LOCATION",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <MapPin className="size-4 opacity-50" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "totalRemaining",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-black text-right w-full justify-end"
          >
            REMAINING MONEY
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalRemaining"));
        return (
          <div className="text-right">
            <span className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-black text-sm border-2",
              amount > 0 
                  ? "bg-red-50 text-red-600 border-red-100" 
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
            )}>
              <BadgeDollarSign className="size-4" />
              {amount.toLocaleString()} ETB
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setSelectedShop(row.original);
              setIsPaymentModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-4 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-emerald-600/20 gap-1.5"
          >
            <Banknote className="size-3.5" />
            Record Payment
          </Button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: "includesString",
    initialState: {
        pagination: {
            pageSize: 5,
        }
    }
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-6">
      {/* Search / Filter */}
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

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-[2rem] border-2 border-primarycolor/5 bg-white shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-primarycolor/[0.02]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-primarycolor/5">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondarycolor/60">
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

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const shop = row.original;
            return (
              <div
                key={row.id}
                className="bg-white rounded-3xl border-2 border-primarycolor/5 p-6 shadow-lg space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-inner">
                      <Store className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-black text-gray-800 text-sm leading-none">{shop.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <MapPin className="size-3" />
                        {shop.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primarycolor/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Remaining</span>
                    <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs border",
                        shop.totalRemaining > 0 
                            ? "bg-red-50 text-red-600 border-red-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}>
                        <BadgeDollarSign className="size-3" />
                        {shop.totalRemaining.toLocaleString()} ETB
                    </span>
                </div>

                <Button
                  onClick={() => {
                    setSelectedShop(shop);
                    setIsPaymentModalOpen(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-emerald-600/20 gap-2"
                >
                  <Banknote className="size-4" />
                  Record Payment
                </Button>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center font-black text-gray-300 uppercase tracking-widest text-[10px]">
            {globalFilter ? "No shops match your search" : "No data available"}
          </div>
        )}
      </div>

      <Link
        href="/delivery_and_sales_dashboard/book_shops"
        className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl border-2 border-primarycolor/10 bg-primarycolor/5 hover:bg-primarycolor/10 text-primarycolor font-black uppercase tracking-widest text-xs transition-all hover:shadow-lg"
      >
        <Store className="size-4" />
        Book Stores
        <ArrowRight className="size-4" />
      </Link>

      {/* Pagination */}
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

      {/* Record Payment Modal */}
      {selectedShop && (
        <RecordPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          shopId={selectedShop.id}
          shopName={selectedShop.name}
        />
      )}
    </div>
  );
}
