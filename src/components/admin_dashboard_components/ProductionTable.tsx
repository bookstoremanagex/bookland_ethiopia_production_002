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
import { Search, ChevronLeft, ChevronRight, Eye, Activity, Filter } from "lucide-react";
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

export type Book = {
  id: number;
  unique_identification_code: string;
  isbn: string | null;
  title: string;
  author: string;
  edition: string;
  category: string;
  status: string;
  productionstatus: string | null;
  book_image_url: string | null;
};

const productionStatusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "On Production", value: "ON_PRODUCTION" },
  { label: "Translation", value: "TRANSLATION" },
  { label: "Design", value: "DESIGN" },
  { label: "Printing", value: "PRINTING" },
  { label: "Pre-printing", value: "PREPRINTING" },
  { label: "Distribution", value: "DISTRIBUTION" },
  { label: "Sales", value: "SALES" },
];

interface ProductionTableProps {
  data: Book[];
}

export function ProductionTable({ data }: ProductionTableProps) {
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
      cell: ({ row }) => <div className="font-medium text-secondarycolor/80">{row.getValue("author")}</div>,
    },
    {
      accessorKey: "productionstatus",
      header: "Production Status",
      cell: ({ row }) => {
        const status = row.getValue("productionstatus") as string;
        return (
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2",
            "bg-secondarycolor/5 text-secondarycolor border-secondarycolor/10"
          )}>
            <Activity className="size-3" />
            {status?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
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
      header: "View",
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
  ], [dashboardRoot]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

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

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    table.getColumn("productionstatus")?.setFilterValue(value === "all" ? undefined : value);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all" />
          <Input
            placeholder="Search books..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor rounded-2xl"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-secondarycolor/5 px-4 py-2 rounded-2xl border-2 border-secondarycolor/10">
            <Filter className="size-4 text-secondarycolor" />
            <select 
              className="bg-transparent text-sm font-bold text-secondarycolor outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {productionStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest bg-primarycolor/5 px-4 py-3 rounded-2xl border-2 border-primarycolor/10">
            Total: <span className="text-primarycolor underline">{table.getFilteredRowModel().rows.length}</span>
          </div>
        </div>
      </div>

      {/* Table Section (Desktop) */}
      <div className="hidden md:block rounded-3xl border-2 border-primarycolor/10 bg-card overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
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
                    className="group hover:bg-primarycolor/5 transition-all border-primarycolor/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-6 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-80 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-40">
                      <Activity className="size-16 text-primarycolor animate-pulse" />
                      <p className="text-2xl font-black uppercase tracking-widest text-primarycolor">No books in this stage</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Card View (Mobile) */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const book = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex gap-5">
                  <div className="size-24 shrink-0 rounded-2xl overflow-hidden border-2 border-primarycolor/10 bg-muted">
                    {book.book_image_url ? (
                      <img src={book.book_image_url} alt="" className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center text-[8px] text-muted-foreground font-black uppercase p-2 text-center">
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-black text-primarycolor text-lg leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs font-bold text-secondarycolor/80">
                      {book.author}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-secondarycolor/5 text-secondarycolor border border-secondarycolor/10">
                        <Activity className="size-3" />
                        {book.productionstatus?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-primarycolor/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {book.category}
                  </span>
                  <Button size="sm" variant="ghost" asChild className="text-primarycolor font-black hover:bg-primarycolor/10 rounded-xl gap-2 px-4 h-9">
                    <Link href={`${dashboardRoot}/books/${book.unique_identification_code}`}>
                      <Eye className="size-4" />
                      Details
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center opacity-30">
            <Activity className="size-16 mx-auto text-primarycolor animate-pulse mb-4" />
            <p className="font-black uppercase tracking-widest">No results</p>
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
