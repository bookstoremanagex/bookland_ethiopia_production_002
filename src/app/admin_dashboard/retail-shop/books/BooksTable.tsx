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
import { Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

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

type RetailBook = {
  id: number;
  title: string;
  author: string;
  language: string;
  category: string;
  publication_year: string | null;
  status: string;
  _count: { bookEditions: number };
  bookEditions: {
    id: number;
    edition_name: string;
    price: number | null;
  }[];
};

export function BooksTable({ data }: { data: RetailBook[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo<ColumnDef<RetailBook>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-bold text-primarycolor tabular-nums">
            #{row.getValue("id")}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="font-bold text-slate-800 max-w-[220px] truncate">
            {row.getValue("title")}
          </div>
        ),
      },
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => (
          <div className="text-sm font-semibold text-slate-500">
            {row.getValue("author")}
          </div>
        ),
      },
      {
        accessorKey: "language",
        header: "Language",
        cell: ({ row }) => (
          <div className="text-xs font-bold text-slate-400 uppercase">
            {row.getValue("language") || "—"}
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const cat = row.getValue("category") as string;
          return (
            <span className="inline-block px-2 py-0.5 rounded-full bg-primarycolor/5 text-primarycolor text-[10px] font-black uppercase tracking-wider">
              {cat || "—"}
            </span>
          );
        },
      },
      {
        id: "editions",
        header: "Editions",
        cell: ({ row }) => {
          const editions = row.original.bookEditions;
          const count = row.original._count.bookEditions;
          return (
            <div className="text-sm font-bold text-slate-600">
              {count}
              <div className="text-[10px] font-semibold text-slate-400">
                {editions
                  .map((e) => `${e.edition_name} (ETB ${(e.price ?? 0).toFixed(2)})`)
                  .join(", ")}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "publication_year",
        header: "Year",
        cell: ({ row }) => (
          <div className="text-sm font-bold text-slate-500">
            {row.getValue("publication_year") || "—"}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const active = status === "available";
          return (
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          placeholder="Search books..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
        />
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50 hover:bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-11 px-4"
                  >
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-primarycolor/5 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="size-8 text-slate-200" />
                    <p className="text-sm font-bold text-slate-400">
                      No books found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">
          {table.getFilteredRowModel().rows.length} book(s)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 rounded-lg text-xs font-bold"
          >
            <ChevronLeft className="size-3.5 mr-1" />
            Previous
          </Button>
          <span className="text-xs font-bold text-slate-500 min-w-[60px] text-center">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 rounded-lg text-xs font-bold"
          >
            Next
            <ChevronRight className="size-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
