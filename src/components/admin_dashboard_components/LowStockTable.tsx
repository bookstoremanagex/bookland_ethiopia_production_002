"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, PackageX, Eye } from "lucide-react";
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

export interface LowStockItem {
  id: number;
  bookTitle: string;
  author: string;
  bookImage: string | null;
  totalQuantity: number;
  editionCount: number;
  uniqueCode: string;
}

interface LowStockTableProps {
  items: LowStockItem[];
}

export function LowStockTable({ items }: LowStockTableProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [includeZero, setIncludeZero] = React.useState(true);

  const displayData = React.useMemo(
    () => (includeZero ? items : items.filter((item) => item.totalQuantity > 0)),
    [items, includeZero]
  );

  const columns = React.useMemo<ColumnDef<LowStockItem>[]>(() => [
    {
      accessorKey: "bookImage",
      header: "Image",
      cell: ({ row }) => (
        <div className="size-14 rounded-lg overflow-hidden border-2 border-primarycolor/10 bg-muted shadow-sm">
          {row.getValue("bookImage") ? (
            <img src={row.getValue("bookImage")} alt="" className="size-full object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center text-slate-400">
              <PackageX className="size-5" />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "bookTitle",
      header: "Book Title",
      cell: ({ row }) => (
        <div className="min-w-[180px] max-w-[300px] font-black text-primarycolor leading-tight line-clamp-1" title={row.getValue("bookTitle")}>
          {row.getValue("bookTitle")}
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <div className="font-medium text-secondarycolor/80">{row.getValue("author")}</div>,
    },
    {
      accessorKey: "editionCount",
      header: "Editions",
      cell: ({ row }) => (
        <div className="font-bold text-slate-600">{row.getValue("editionCount")}</div>
      ),
    },
    {
      accessorKey: "totalQuantity",
      header: "Total Copies",
      cell: ({ row }) => {
        const qty = row.getValue("totalQuantity") as number;
        return (
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-black border-2",
              qty <= 10
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            )}>
              {qty}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">copies</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "View",
      cell: ({ row }) => {
        const item = row.original;
        return item.uniqueCode ? (
          <Button variant="ghost" size="icon" asChild className="size-10 hover:text-primarycolor hover:bg-primarycolor/10 rounded-full transition-all active:scale-90">
            <Link href={`${dashboardRoot}/books/${item.uniqueCode}`}>
              <Eye className="size-5" />
            </Link>
          </Button>
        ) : null;
      },
    },
  ], [dashboardRoot]);

  const table = useReactTable({
    data: displayData,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
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
          <label className="flex items-center gap-2.5 cursor-pointer select-none bg-primarycolor/5 px-4 py-3 rounded-2xl border-2 border-primarycolor/10 transition-colors hover:bg-primarycolor/10">
            <input
              type="checkbox"
              checked={includeZero}
              onChange={(e) => setIncludeZero(e.target.checked)}
              className="size-4 accent-primarycolor cursor-pointer"
            />
            <span className="text-xs font-black text-primarycolor uppercase tracking-widest">Include 0 copies</span>
          </label>

          <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest bg-primarycolor/5 px-4 py-3 rounded-2xl border-2 border-primarycolor/10">
            Showing: <span className="text-primarycolor underline">{table.getFilteredRowModel().rows.length}</span>
          </div>
        </div>
      </div>

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
                      <PackageX className="size-16 text-primarycolor animate-pulse" />
                      <p className="text-2xl font-black uppercase tracking-widest text-primarycolor">No low stock books</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const item = row.original;
            return (
              <div key={row.id} className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <div className="flex gap-5">
                  <div className="size-20 shrink-0 rounded-2xl overflow-hidden border-2 border-primarycolor/10 bg-muted">
                    {item.bookImage ? (
                      <img src={item.bookImage} alt="" className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center text-slate-400">
                        <PackageX className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-black text-primarycolor text-lg leading-tight line-clamp-2">{item.bookTitle}</h3>
                    <p className="text-xs font-bold text-secondarycolor/80">{item.author}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        item.totalQuantity <= 10
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      )}>
                        {item.totalQuantity} copies total
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-primarycolor/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {item.editionCount} {item.editionCount === 1 ? "edition" : "editions"}
                  </span>
                  {item.uniqueCode && (
                    <Button size="sm" variant="ghost" asChild className="text-primarycolor font-black hover:bg-primarycolor/10 rounded-xl gap-2 px-4 h-9">
                      <Link href={`${dashboardRoot}/books/${item.uniqueCode}`}>
                        <Eye className="size-4" />
                        Details
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center opacity-30">
            <PackageX className="size-16 mx-auto text-primarycolor animate-pulse mb-4" />
            <p className="font-black uppercase tracking-widest">No low stock books</p>
          </div>
        )}
      </div>

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