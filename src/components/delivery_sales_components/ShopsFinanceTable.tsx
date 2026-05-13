"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
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
import { 
    ChevronLeft, 
    ChevronRight, 
    Store, 
    Phone, 
    MapPin, 
    BadgeDollarSign,
    ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ShopFinance = {
  id: number;
  name: string;
  location: string;
  phone: string;
  totalRemaining: number;
  totalDebt: number;
  totalPaid: number;
};

const columns: ColumnDef<ShopFinance>[] = [
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
];

interface ShopsFinanceTableProps {
  data: ShopFinance[];
}

export default function ShopsFinanceTable({ data }: ShopsFinanceTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
        pagination: {
            pageSize: 5,
        }
    }
  });

  return (
    <div className="space-y-6">
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
                  No data available
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
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center font-black text-gray-300 uppercase tracking-widest text-[10px]">
            No data available
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
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
