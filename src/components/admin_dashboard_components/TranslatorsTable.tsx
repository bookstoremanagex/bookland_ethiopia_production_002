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
import { Search, ChevronLeft, ChevronRight, User, Mail, Phone, BookOpen, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import Link from "next/link";
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

export type Translator = {
  id: number;
  name: string;
  pen_name: string | null;
  email: string | null;
  phoneNumber: string | null;
  _count?: {
    books: number;
  };
  createdAt: string | Date;
};

export const columns: ColumnDef<Translator>[] = [
  {
    accessorKey: "name",
    header: "Translator Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primarycolor/10 flex items-center justify-center text-primarycolor font-black border-2 border-primarycolor/20">
            {name?.[0]?.toUpperCase()}
          </div>
          <div className="font-black text-primarycolor tracking-tight">{name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "pen_name",
    header: "Pen Name",
    cell: ({ row }) => (
      <div className="text-secondarycolor font-bold italic">
        {row.getValue("pen_name") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-secondarycolor/80 font-medium">
        <Mail className="size-3 text-secondarycolor/40" />
        {row.getValue("email") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-secondarycolor/80 font-medium">
        <Phone className="size-3 text-secondarycolor/40" />
        {row.getValue("phoneNumber") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "books",
    header: "Assigned Books",
    cell: ({ row }) => {
      const count = row.original._count?.books || 0;
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-secondarycolor/5 text-secondarycolor border border-secondarycolor/10">
          <BookOpen className="size-3" />
          {count} Books
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button asChild variant="ghost" size="sm" className="hover:bg-primarycolor/10 text-primarycolor font-black rounded-xl">
        <Link href={`/admin_dashboard/production/translators/${row.original.id}`}>
          Manage
        </Link>
      </Button>
    ),
  },
];

interface TranslatorsTableProps {
  data: Translator[];
}

export function TranslatorsTable({ data }: TranslatorsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');

  const columns = React.useMemo<ColumnDef<Translator>[]>(() => [
    {
      accessorKey: "name",
      header: "Translator Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primarycolor/10 flex items-center justify-center text-primarycolor font-black border-2 border-primarycolor/20">
              {name?.[0]?.toUpperCase()}
            </div>
            <div className="font-black text-primarycolor tracking-tight">{name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "pen_name",
      header: "Pen Name",
      cell: ({ row }) => (
        <div className="text-secondarycolor font-bold italic">
          {row.getValue("pen_name") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-secondarycolor/80 font-medium">
          <Mail className="size-3 text-secondarycolor/40" />
          {row.getValue("email") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-secondarycolor/80 font-medium">
          <Phone className="size-3 text-secondarycolor/40" />
          {row.getValue("phoneNumber") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "books",
      header: "Assigned Books",
      cell: ({ row }) => {
        const count = row.original._count?.books || 0;
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-secondarycolor/5 text-secondarycolor border border-secondarycolor/10">
            <BookOpen className="size-3" />
            {count} Books
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button asChild variant="ghost" size="sm" className="hover:bg-primarycolor/10 text-primarycolor font-black rounded-xl">
          <Link href={`${dashboardRoot}/production/translators/${row.original.id}`}>
            Manage
          </Link>
        </Button>
      ),
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all" />
          <Input
            placeholder="Search by name, email, phone..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor rounded-2xl"
          />
        </div>
        <Button className="w-full md:w-auto h-12 px-8 bg-primarycolor hover:bg-secondarycolor text-white font-black rounded-2xl shadow-lg shadow-primarycolor/20 flex items-center gap-2 group transition-all active:scale-95" asChild>
          <Link href={`${dashboardRoot}/production/translators/add`}>
            <Plus className="size-5 transition-transform group-hover:rotate-90" />
            Add Translator
          </Link>
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-3xl border-2 border-primarycolor/10 bg-card overflow-hidden shadow-2xl">
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
                <TableRow key={row.id} className="group hover:bg-primarycolor/5 transition-all">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-6 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <User className="size-12 text-primarycolor" />
                    <p className="text-xl font-black uppercase tracking-widest text-primarycolor">No Translators Found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const translator = row.original;
            return (
              <div key={row.id} className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor font-black border-2 border-primarycolor/20 text-xl">
                    {translator.name ? (translator.name as string)[0]?.toUpperCase() : "?"}
                  </div>
                  <div>
                    <h3 className="font-black text-primarycolor text-lg">{translator.name}</h3>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-secondarycolor/40">ID: #{translator.id}</div>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-secondarycolor/70">
                    <Mail className="size-4 text-primarycolor/40" />
                    {translator.email || "No Email"}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-secondarycolor/70">
                    <Phone className="size-4 text-primarycolor/40" />
                    {translator.phoneNumber || "No Phone"}
                  </div>
                </div>
                <div className="pt-4 border-t-2 border-primarycolor/5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black bg-secondarycolor/5 text-secondarycolor border border-secondarycolor/10 uppercase">
                    <BookOpen className="size-3" />
                    {translator._count?.books || 0} Books
                  </div>
                  <Button asChild variant="ghost" size="sm" className="text-primarycolor font-black hover:bg-primarycolor/10 rounded-xl px-6 h-10">
                    <Link href={`${dashboardRoot}/production/translators/${translator.id}`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center opacity-30">
            <User className="size-16 mx-auto text-primarycolor mb-4" />
            <p className="font-black uppercase tracking-widest">Database Empty</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-4 py-8 border-t-2 border-primarycolor/5">
        <div className="text-sm font-black text-muted-foreground uppercase tracking-widest">
          Page <span className="text-primarycolor underline">{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-12 px-6 border-2 border-primarycolor/20 rounded-2xl font-black transition-all active:scale-95"
          >
            <ChevronLeft className="size-5 mr-1" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-12 px-6 border-2 border-primarycolor/20 rounded-2xl font-black transition-all active:scale-95"
          >
            Next
            <ChevronRight className="size-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
