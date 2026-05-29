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
import { Search, ChevronLeft, ChevronRight, PenTool, Calendar, User, BookOpen, Plus, Clock, Banknote } from "lucide-react";
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
import { useCalendar } from "@/lib/calendar-context";

export type TranslationProject = {
  id: number;
  books: {
    title: string;
    unique_identification_code: string;
  };
  translator: {
    name: string;
  };
  Status: string;
  cost: number | null;
  payment_status: string;
  currently_paid: number;
  startDate: string | Date | null;
  endDate: string | Date | null;
  createdAt: string | Date;
};

const statusConfig = {
  NOT_STARTED: { label: "Not Started", color: "bg-muted text-muted-foreground border-muted-foreground/20" },
  STARTED: { label: "Started", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  ONPROGRESS: { label: "In Progress", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

const paymentConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "text-amber-600" },
  CURRENTLY_PAID: { label: "Partially Paid", color: "text-blue-600" },
  SUCCEEDED: { label: "Paid", color: "text-emerald-600" },
};

interface TranslationProjectsTableProps {
  data: TranslationProject[];
}

export function TranslationProjectsTable({ data }: TranslationProjectsTableProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const { formatDate } = useCalendar();

  const columns = React.useMemo<ColumnDef<TranslationProject>[]>(() => [
    {
      accessorKey: "books.title",
      header: "Book Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-black text-primarycolor leading-tight line-clamp-1">{row.original.books?.title}</div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{row.original.books?.unique_identification_code}</div>
        </div>
      ),
    },
    {
      accessorKey: "translator.name",
      header: "Translator",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-secondarycolor/10 flex items-center justify-center text-secondarycolor font-black text-xs border border-secondarycolor/20">
            {row.original.translator?.name ? row.original.translator.name[0]?.toUpperCase() : "?"}
          </div>
          <div className="font-bold text-secondarycolor">{row.original.translator?.name || "Unknown"}</div>
        </div>
      ),
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("Status") as keyof typeof statusConfig;
        const config = statusConfig[status] || statusConfig.NOT_STARTED;
        return (
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", config.color)}>
            <Clock className="size-3" />
            {config.label}
          </div>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Timeline",
      cell: ({ row }) => {
        const start = row.getValue("startDate") as string;
        const end = row.original.endDate as string;
        return (
          <div className="flex flex-col text-[11px] font-bold text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="size-3 text-primarycolor/40" />
              S: {start ? formatDate(new Date(start)) : "N/A"}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="size-3 text-secondarycolor/40" />
              E: {end ? formatDate(new Date(end)) : "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      id: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const p = row.original;
        const payCfg = paymentConfig[p.payment_status] || paymentConfig.PENDING;
        const remaining = p.cost ? p.cost - p.currently_paid : 0;
        return (
          <div className="flex flex-col text-[11px] font-bold">
            {p.cost != null && (
              <span className="text-muted-foreground">{p.cost.toLocaleString()} ETB</span>
            )}
            <span className={cn(payCfg.color)}>
              {payCfg.label}
              {p.currently_paid > 0 && ` (${p.currently_paid.toLocaleString()} ETB)`}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Manage",
      cell: ({ row }) => (
        <Button asChild variant="ghost" size="sm" className="hover:bg-primarycolor/10 text-primarycolor font-black rounded-xl">
          <Link href={`${dashboardRoot}/production/translation_work/${row.original.id}`}>
            Update
          </Link>
        </Button>
      ),
    },
  ], [dashboardRoot]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
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
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all" />
          <Input
            placeholder="Search projects..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor rounded-2xl"
          />
        </div>
        
        <Button className="w-full lg:w-auto h-12 px-8 bg-primarycolor hover:bg-secondarycolor text-white font-black rounded-2xl shadow-lg shadow-primarycolor/20 flex items-center gap-2 group transition-all active:scale-95" asChild>
          <Link href={`${dashboardRoot}/production/translation_work/new`}>
            <Plus className="size-5 transition-transform group-hover:rotate-90" />
            New Translation Project
          </Link>
        </Button>
      </div>

      {/* Desktop Table */}
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
                    <PenTool className="size-12 text-primarycolor" />
                    <p className="text-xl font-black uppercase tracking-widest text-primarycolor">No active projects</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const project = row.original;
            const config = statusConfig[project.Status as keyof typeof statusConfig] || statusConfig.NOT_STARTED;
            return (
              <div key={row.id} className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-black text-primarycolor text-lg leading-tight">{project.books?.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-secondarycolor">
                      <User className="size-3" />
                      {project.translator?.name || "Unknown"}
                    </div>
                  </div>
                  <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border", config.color)}>
                    {config.label}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-t-2 border-primarycolor/5">
                  <div className="space-y-1">
                    <span className="opacity-40">Start Date</span>
                    <div className="text-primarycolor">{project.startDate ? formatDate(new Date(project.startDate)) : "TBD"}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="opacity-40">Deadline</span>
                    <div className="text-secondarycolor">{project.endDate ? formatDate(new Date(project.endDate)) : "TBD"}</div>
                  </div>
                </div>

                {(project.cost != null || project.currently_paid > 0) && (
                  <div className="flex items-center gap-4 pt-2 text-[10px] font-black uppercase tracking-widest border-t-2 border-primarycolor/5">
                    <div className="flex items-center gap-1.5">
                      <Banknote className="size-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{project.cost?.toLocaleString() || "—"} ETB</span>
                    </div>
                    <div className={cn(paymentConfig[project.payment_status]?.color || "text-muted-foreground")}>
                      {paymentConfig[project.payment_status]?.label || "Pending"}
                      {project.currently_paid > 0 && ` (${project.currently_paid.toLocaleString()} ETB)`}
                    </div>
                  </div>
                )}

                <Button asChild variant="ghost" className="w-full hover:bg-primarycolor/10 text-primarycolor font-black rounded-xl h-10 border border-primarycolor/10">
                  <Link href={`${dashboardRoot}/production/translation_work/${project.id}`}>
                    Update Progress
                  </Link>
                </Button>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center opacity-30">
            <PenTool className="size-16 mx-auto text-primarycolor mb-4" />
            <p className="font-black uppercase tracking-widest">No Projects Found</p>
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
