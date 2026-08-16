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
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Store,
} from "lucide-react";

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

export type BookShop = {
  id: number;
  name: string;
  location: string;
  branch: string | null;
  phone: string | null;
  email: string | null;
};

interface BookShopsTableProps {
  data: BookShop[];
}

export function BookShopsTable({ data }: BookShopsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<BookShop>[] = [
    {
      accessorKey: "name",
      header: "Shop Identity",
      cell: ({ row }) => {
        const shop = row.original;
        return (
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-sm transition-transform group-hover:scale-110">
              <Building2 className="size-7" />
            </div>
            <div>
              <div className="text-lg font-black text-primarycolor uppercase tracking-tight leading-tight">{shop.name}</div>
              {shop.branch && (
                <div className="text-[10px] font-black text-secondarycolor uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-secondarycolor animate-pulse" />
                  {shop.branch} Branch
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location Details",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 text-muted-foreground font-bold text-sm">
          <MapPin className="size-4 text-primarycolor/40" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact Info",
      cell: ({ row }) => {
        const shop = row.original;
        return (
          <div className="space-y-1.5">
            {shop.phone && (
              <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                <Phone className="size-3.5 text-primarycolor/40" />
                {shop.phone}
              </div>
            )}
            {shop.email && (
              <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                <Mail className="size-3.5 text-primarycolor/40" />
                {shop.email}
              </div>
            )}
            {!shop.phone && !shop.email && (
              <span className="text-[9px] font-black uppercase tracking-widest text-primarycolor/20 italic">No contact</span>
            )}
          </div>
        );
      },
    },
  ];

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
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 md:gap-6 bg-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 border-primarycolor/5 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primarycolor/10">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search partners..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10 md:pl-12 h-12 md:h-14 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-xl md:rounded-2xl transition-all duration-300 focus:shadow-inner font-bold text-sm"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-[2.5rem] border-2 border-primarycolor/10 bg-card shadow-2xl transition-all duration-500 hover:border-primarycolor/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-primarycolor/5 border-b-2 border-primarycolor/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 md:h-20 font-black text-secondarycolor py-4 text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-4 md:px-8">
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
                  className="group hover:bg-primarycolor/[0.03] transition-all duration-300 border-primarycolor/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-6 md:py-8 px-4 md:px-8">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-80 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-30">
                    <Store className="size-20 text-primarycolor animate-pulse" />
                    <p className="text-2xl font-black uppercase tracking-widest text-primarycolor">No partners found</p>
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
            const shop = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-[1.5rem] md:rounded-[2rem] border-2 border-primarycolor/10 p-5 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-sm shrink-0">
                    <Building2 className="size-6 md:size-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-primarycolor text-base md:text-xl leading-tight uppercase tracking-tight">
                      {shop.name}
                    </h3>
                    {shop.branch && (
                      <p className="text-[10px] font-black text-secondarycolor uppercase tracking-[0.2em] mt-1">
                        {shop.branch} Branch
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t-2 border-primarycolor/5">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:sm font-bold text-muted-foreground">
                    <MapPin className="size-3.5 md:size-4 text-primarycolor/40" />
                    {shop.location}
                  </div>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {shop.phone && (
                      <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-muted-foreground">
                        <Phone className="size-3 md:size-3.5 text-primarycolor/40" />
                        {shop.phone}
                      </div>
                    )}
                    {shop.email && (
                      <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-muted-foreground">
                        <Mail className="size-3 md:size-3.5 text-primarycolor/40" />
                        {shop.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-6 opacity-30">
            <Store className="size-20 mx-auto text-primarycolor animate-bounce" />
            <p className="text-2xl font-black uppercase tracking-widest text-primarycolor">No Partners found</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 px-2 md:px-4 py-6 md:py-8 border-t-2 border-primarycolor/5">
        <div className="text-[9px] md:text-[10px] font-black text-muted-foreground order-2 lg:order-1 uppercase tracking-[0.2em] text-center lg:text-left">
          Displaying <span className="text-primarycolor underline decoration-2 underline-offset-4">{table.getRowModel().rows.length}</span> /{" "}
          <span className="text-secondarycolor">{data.length}</span> Active Partners
        </div>
        <div className="flex items-center gap-3 md:gap-4 order-1 lg:order-2 w-full lg:w-auto justify-between lg:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-10 md:h-12 px-4 md:px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-xl md:rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90 text-[9px] md:text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft className="size-3 md:size-4 mr-1" />
            Prev
          </Button>
          <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 h-10 md:h-12 bg-primarycolor/5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-secondarycolor border-2 border-primarycolor/10 shadow-inner uppercase tracking-widest">
            {table.getState().pagination.pageIndex + 1} <span className="opacity-20 mx-1">/</span> {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-10 md:h-12 px-4 md:px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-xl md:rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90 text-[9px] md:text-[10px] uppercase tracking-widest"
          >
            Next
            <ChevronRight className="size-3 md:size-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}