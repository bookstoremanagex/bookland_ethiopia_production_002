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
import { Search, ChevronLeft, ChevronRight, Store, MapPin, Phone, Mail, Building2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../../lib/utils";

export type StoreType = {
  id: number;
  name: string;
  location: string;
  phone: string | null;
  email: string | null;
  status: string;
};



interface StoresTableProps {
  data: StoreType[];
}

export function StoresTable({ data }: StoresTableProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo<ColumnDef<StoreType>[]>(() => [
    {
      accessorKey: "icon",
      header: "Store",
      cell: ({ row }) => (
        <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-inner group-hover:scale-110 transition-transform duration-500">
          <Store className="size-7" />
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-bold text-secondarycolor tabular-nums">#{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Store Name",
      cell: ({ row }) => (
        <div className="min-w-[150px] font-black text-primarycolor leading-tight">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-secondarycolor/80 font-medium italic">
          <MapPin className="size-4 text-primarycolor/50" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => {
        const store = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-secondarycolor/60">
              <Phone className="size-3" />
              {store.phone || "N/A"}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-secondarycolor/60">
              <Mail className="size-3" />
              {store.email || "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
            status === "available" 
              ? "bg-primarycolor/10 text-primarycolor border-primarycolor/20" 
              : status === "closed"
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-amber-100 text-amber-600 border-amber-200"
          )}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: () => null,
      cell: () => null,
    },
  ], [dashboardRoot]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primarycolor/10">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search stores, locations..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all duration-300 focus:shadow-inner"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-3xl border-2 border-primarycolor/10 bg-card shadow-2xl transition-all duration-500 hover:border-primarycolor/20 w-full overflow-hidden">
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
                  className="group hover:bg-primarycolor/5 transition-all duration-300 border-primarycolor/5 hover:shadow-inner"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-6 px-6 transition-transform duration-300 group-hover:translate-x-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-80 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-40 animate-pulse">
                    <Building2 className="size-16 text-primarycolor" />
                    <p className="text-2xl font-black uppercase tracking-widest">No stores found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const store = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 active:scale-95 group"
              >
                <div className="flex gap-5">
                  <div className="size-20 shrink-0 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-md transition-transform duration-500 group-hover:rotate-6">
                    <Store className="size-10" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-primarycolor text-xl leading-tight line-clamp-1">
                        {store.name}
                      </h3>
                      <span className="text-[10px] font-black text-secondarycolor/30 tabular-nums">#{store.id}</span>
                    </div>
                    <p className="text-sm font-black text-secondarycolor/80 flex items-center gap-2 italic">
                      <MapPin className="size-4 text-primarycolor" />
                      {store.location}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                       <div className="flex items-center gap-2 text-[10px] font-black text-secondarycolor/50 uppercase tracking-tighter">
                        <Phone className="size-3" />
                        {store.phone || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t-2 border-primarycolor/5 flex items-center justify-between">
                   <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
                        store.status === "available" 
                            ? "bg-primarycolor/10 text-primarycolor border-primarycolor/20" 
                            : "bg-destructive/10 text-destructive border-destructive/20"
                    )}>
                      {store.status}
                    </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-6 opacity-30">
            <Building2 className="size-20 mx-auto text-primarycolor animate-bounce" />
            <p className="text-2xl font-black uppercase tracking-widest">No physical locations</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-4 py-8 border-t-2 border-primarycolor/5">
        <div className="text-sm font-black text-muted-foreground order-2 sm:order-1 uppercase tracking-widest">
          Showing <span className="text-primarycolor underline decoration-2 underline-offset-4">{table.getRowModel().rows.length}</span> /{" "}
          <span className="text-secondarycolor">{data.length}</span> Stores
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
    </div>
  );
}
