"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  ArrowUpDown,
  BookOpen
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

interface InventoryItem {
  id: number;
  quantity: number;
  bookedition: {
    edition_name: string;
    books: {
      title: string;
    };
  };
}

export function StoreInventoryTable({ data }: { data: InventoryItem[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "bookedition.books.title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-black"
        >
          Book Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="font-black text-primarycolor leading-tight">{row.original.bookedition.books.title}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{row.original.bookedition.edition_name}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Current Stock",
      cell: ({ row }) => {
        const quantity = row.original.quantity;
        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
              quantity > 10 ? "bg-emerald-100 text-emerald-700" : quantity > 0 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
            )}>
              <Package className="size-3" />
              {quantity.toLocaleString()} Units
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
        <Input
          placeholder="Search by book title..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-12 pl-12 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold"
        />
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl overflow-hidden transition-all hover:border-primarycolor/10">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-16 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor/40">
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
                      <TableCell key={cell.id} className="px-8">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Package className="size-12" />
                      <p className="text-sm font-black uppercase tracking-widest">No inventory records</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 flex items-center justify-between border-t border-slate-50">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Showing {table.getRowModel().rows.length} records
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-10 px-4 rounded-xl border-2 border-slate-100 font-black text-[10px] uppercase"
            >
              <ChevronLeft className="size-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-10 px-4 rounded-xl border-2 border-slate-100 font-black text-[10px] uppercase"
            >
              Next <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
