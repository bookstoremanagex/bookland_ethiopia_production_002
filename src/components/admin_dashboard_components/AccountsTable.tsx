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
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Eye, Shield, User, Mail, Activity } from "lucide-react";

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

export type Account = {
  id: number;
  name: string;
  account_email: string;
  account_type: string;
  account_status: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-3">
        <User className="size-4" />
        Name
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor font-black shadow-inner group-hover:scale-110 transition-transform duration-300">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-gray-800 text-base">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "account_email",
    header: () => (
      <div className="flex items-center gap-3">
        <Mail className="size-4" />
        Email
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-gray-600 font-medium">{row.getValue("account_email")}</div>
    ),
  },
  {
    accessorKey: "account_type",
    header: () => (
      <div className="flex items-center gap-3">
        <Shield className="size-4" />
        Type
      </div>
    ),
    cell: ({ row }) => (
      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase bg-primarycolor/10 text-primarycolor border border-primarycolor/20">
        {row.getValue("account_type")}
      </span>
    ),
  },
  {
    accessorKey: "account_status",
    header: () => (
      <div className="flex items-center gap-3">
        <Activity className="size-4" />
        Status
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("account_status") as boolean;
      return status ? (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase bg-green-100 text-green-700 border border-green-200">
          <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
          Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase bg-red-100 text-red-700 border border-red-200">
          <span className="size-2 rounded-full bg-red-500"></span>
          Inactive
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right w-full">Actions</div>,
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className="text-right">
          <Button variant="ghost" size="icon" asChild className="size-10 hover:text-primarycolor hover:bg-primarycolor/10 rounded-full transition-all active:scale-90">
            <Link href={`/admin_dashboard/settings/accounts/${account.id}`}>
              <Eye className="size-5" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

interface AccountsTableProps {
  accounts: Account[];
}

export default function AccountsTable({ accounts }: AccountsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: accounts,
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
    <div className="w-full min-w-0 space-y-8 animate-in fade-in duration-700">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card p-4 sm:p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primarycolor/10">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search accounts..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 w-full bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all duration-300 focus:shadow-inner text-base"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-3xl border-2 border-primarycolor/10 bg-card shadow-2xl transition-all duration-500 hover:border-primarycolor/20 w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
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
                      <Search className="size-16 text-primarycolor" />
                      <p className="text-2xl font-black uppercase tracking-widest">No accounts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const account = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-[1.5rem] sm:rounded-3xl border-2 border-primarycolor/10 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 active:scale-95 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="size-10 sm:size-12 shrink-0 rounded-xl sm:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor font-black shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {account.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-primarycolor text-lg sm:text-xl leading-tight line-clamp-1 block truncate">{account.name}</span>
                      <span className="text-secondarycolor/80 text-xs sm:text-sm font-medium block truncate max-w-[150px] sm:max-w-xs">{account.account_email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {account.account_status ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase bg-green-100 text-green-700 border border-green-200 shrink-0">
                        <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase bg-red-100 text-red-700 border border-red-200 shrink-0">
                        <span className="size-1.5 rounded-full bg-red-500"></span>
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-5 pt-4 sm:mt-6 sm:pt-5 border-t-2 border-primarycolor/5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase bg-primarycolor/10 text-primarycolor border border-primarycolor/20">
                    {account.account_type}
                  </span>
                  
                  <Button size="sm" variant="ghost" asChild className="text-primarycolor font-black hover:bg-primarycolor/10 rounded-2xl gap-2 px-4 sm:px-6 h-9 sm:h-10 transition-all group-hover:scale-105">
                    <Link href={`/admin_dashboard/settings/accounts/${account.id}`}>
                      <Eye className="size-4 sm:size-5" />
                      <span className="hidden sm:inline">Details</span>
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 sm:py-24 text-center space-y-6 opacity-30">
            <Search className="size-16 sm:size-20 mx-auto text-primarycolor animate-bounce" />
            <p className="text-lg sm:text-2xl font-black uppercase tracking-widest">No accounts found</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2 sm:px-4 py-6 sm:py-8 border-t-2 border-primarycolor/5">
        <div className="text-xs sm:text-sm font-black text-muted-foreground order-2 sm:order-1 uppercase tracking-widest text-center sm:text-left">
          Showing <span className="text-primarycolor underline decoration-2 underline-offset-4">{table.getRowModel().rows.length}</span> /{" "}
          <span className="text-secondarycolor">{accounts.length}</span> Records
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-10 sm:h-12 px-3 sm:px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-xl sm:rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90"
          >
            <ChevronLeft className="size-4 sm:size-5 sm:mr-1" />
            <span className="hidden sm:inline">Prev</span>
          </Button>
          <div className="flex items-center gap-1 sm:gap-3 px-3 sm:px-6 h-10 sm:h-12 bg-primarycolor/5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black text-secondarycolor border-2 border-primarycolor/10 shadow-inner">
            PAGE {table.getState().pagination.pageIndex + 1} <span className="opacity-20 mx-1">OF</span> {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-10 sm:h-12 px-3 sm:px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-xl sm:rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4 sm:size-5 sm:ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
