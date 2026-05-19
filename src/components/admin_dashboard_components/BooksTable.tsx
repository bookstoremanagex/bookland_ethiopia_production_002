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
import { Search, ChevronLeft, ChevronRight, Eye, Library } from "lucide-react";

import Link from "next/link";
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

export type Book = {
  id: number;
  unique_identification_code: string;
  isbn: string | null;
  title: string;
  author: string;
  pen_name: string | null;
  edition: string;
  category: string;
  status: string;
  book_image_url: string | null;
};

interface BooksTableProps {
  data: Book[];
}

export function BooksTable({ data }: BooksTableProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');

  const columns = React.useMemo<ColumnDef<Book>[]>(() => [
    {
      accessorKey: "book_image_url",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("book_image_url") as string;
        return (
          <div className="size-14 rounded-lg overflow-hidden border-2 border-primarycolor/10 bg-muted shadow-sm transition-transform hover:scale-110">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase p-1 text-center leading-tight">
                No Cover
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-bold text-secondarycolor tabular-nums">#{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="min-w-[150px] max-w-[280px] font-black text-primarycolor leading-tight line-clamp-1" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => {
        const author = row.getValue("author") as string;
        const penName = row.original.pen_name;
        return (
          <div className="flex flex-col">
            <div className="font-medium text-secondarycolor/80">{author}</div>
            {penName && (
              <div className="text-[10px] font-black text-secondarycolor/40 italic uppercase tracking-wider">
                {penName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "edition",
      header: "Edition",
      cell: ({ row }) => <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{row.getValue("edition")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primarycolor/10 text-primarycolor border border-primarycolor/20 uppercase tracking-tighter">
          {row.getValue("category")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Details",
      cell: ({ row }) => {
        const book = row.original;
        return (
          <Button variant="ghost" size="icon" asChild className="size-10 hover:text-primarycolor hover:bg-primarycolor/10 rounded-full transition-all active:scale-90">
            <Link href={`${dashboardRoot}/books/${book.unique_identification_code}`}>
              <Eye className="size-5" />
            </Link>
          </Button>
        );
      },
    },
    {
      accessorKey: "isbn",
      header: () => null,
      cell: () => null,
    },
    {
      accessorKey: "unique_identification_code",
      header: () => null,
      cell: () => null,
    },
  ], [dashboardRoot]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    isbn: false,
    unique_identification_code: false,
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
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primarycolor/10">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search titles, authors, ISBNs..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all duration-300 focus:shadow-inner"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-12 px-6 border-2 border-primarycolor/20 text-primarycolor font-bold hover:bg-primarycolor/5 rounded-2xl transition-all active:scale-95 flex items-center gap-2" asChild>
            <Link href={`${dashboardRoot}/books/shelf`}>
              <Library className="size-5" />
              Visual Shelf
            </Link>
          </Button>
          <Button className="flex-1 sm:flex-none h-12 px-8 bg-primarycolor hover:bg-secondarycolor text-white font-black rounded-2xl shadow-lg shadow-primarycolor/20 transition-all active:scale-95 flex items-center gap-2 group" asChild>
            <Link href={`${dashboardRoot}/books/add_book`}>
              <span className="text-xl transition-transform group-hover:rotate-90">+</span> Add Book
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block rounded-3xl border-2 border-primarycolor/10 bg-card shadow-2xl transition-all duration-500 hover:border-primarycolor/20 w-full">
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
                    <p className="text-2xl font-black uppercase tracking-widest">No books found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View (Hidden on desktop) */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const book = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 active:scale-95 group"
              >
                <div className="flex gap-5">
                  <div className="size-28 shrink-0 rounded-2xl overflow-hidden border-2 border-primarycolor/10 bg-muted shadow-md transition-transform duration-500 group-hover:rotate-2">
                    {book.book_image_url ? (
                      <img src={book.book_image_url} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="size-full flex items-center justify-center text-[10px] text-muted-foreground font-black uppercase p-3 text-center leading-tight">
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-primarycolor text-xl leading-tight line-clamp-2">
                        {book.title}
                      </h3>
                      <span className="text-[10px] font-black text-secondarycolor/30 tabular-nums">#{book.id}</span>
                    </div>
                    <p className="text-sm font-black text-secondarycolor/80 flex items-center gap-2 flex-wrap">
                      <span className="size-2 rounded-full bg-primarycolor animate-pulse" />
                      {book.author}
                      {book.pen_name && (
                        <span className="text-xs font-medium text-secondarycolor/50 italic">
                          ({book.pen_name})
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-[10px] font-black bg-primarycolor/10 text-primarycolor px-3 py-1.5 rounded-xl uppercase tracking-tighter border-2 border-primarycolor/20">
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t-2 border-primarycolor/5 flex items-center justify-between">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
                    book.status === "available"
                      ? "bg-primarycolor/10 text-primarycolor border-primarycolor/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}>
                    {book.status.replace('_', ' ')}
                  </div>
                  <Button size="sm" variant="ghost" asChild className="text-primarycolor font-black hover:bg-primarycolor/10 rounded-2xl gap-2 px-6 h-10 transition-all group-hover:scale-105">
                    <Link href={`${dashboardRoot}/books/${book.unique_identification_code}`}>
                      <Eye className="size-5" />
                      Details
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-6 opacity-30">
            <Search className="size-20 mx-auto text-primarycolor animate-bounce" />
            <p className="text-2xl font-black uppercase tracking-widest">Inventory empty</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
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
    </div>
  );
}
