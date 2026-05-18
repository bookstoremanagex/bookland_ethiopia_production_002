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
import { Search, ChevronLeft, ChevronRight, Activity, Cpu, Monitor, Globe } from "lucide-react";
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

export type ActivityLogItem = {
  id: number;
  accountId: number;
  action: string;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  account: {
    account_email: string;
    account_type: string;
  };
};

interface ActivityLogsTableProps {
  data: ActivityLogItem[];
}

export function ActivityLogsTable({ data = [] }: ActivityLogsTableProps) {
  const safeData = React.useMemo(() => Array.isArray(data) ? data : [], [data]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [userFilter, setUserFilter] = React.useState<string>("all");

  // Custom filter for account/user selection
  const filteredData = React.useMemo(() => {
    if (userFilter === "all") return safeData;
    return safeData.filter((item) => item?.account?.account_email === userFilter);
  }, [safeData, userFilter]);

  const columns = React.useMemo<ColumnDef<ActivityLogItem>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-bold text-secondarycolor tabular-nums">
          #{row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "account.account_email",
      header: "User Account",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="space-y-1">
            <div className="font-black text-primarycolor leading-tight">
              {item.account?.account_email || "System/Unknown"}
            </div>
            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-wider inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              {item.account?.account_type || "SYSTEM"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action Performed",
      cell: ({ row }) => (
        <div className="font-black text-secondarycolor/80 leading-tight">
          {row.getValue("action")}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: "Activity Details",
      cell: ({ row }) => {
        const details = row.getValue("details") as string;
        return (
          <div className="max-w-[420px] text-xs font-semibold leading-relaxed text-secondarycolor/70 bg-slate-50 border border-slate-100 p-3 rounded-xl italic">
            {details || "No supplementary details provided."}
          </div>
        );
      },
    },
    {
      accessorKey: "ipAddress",
      header: "Network IP",
      cell: ({ row }) => {
        const ip = (row.getValue("ipAddress") as string) || "127.0.0.1";
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50/50 border border-blue-100 text-blue-700">
            <Globe className="size-3" />
            <span className="tabular-nums">{ip}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-xs font-bold text-secondarycolor/60 tabular-nums">
            {date.toLocaleString()}
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 20, // exactly 20 at a time
      },
    },
  });

  // Extract unique user emails for filter dropdown
  const uniqueUsers = React.useMemo(() => {
    const users = new Set<string>();
    safeData.forEach((item) => {
      if (item?.account?.account_email) {
        users.add(item.account.account_email);
      }
    });
    return Array.from(users);
  }, [safeData]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Search & Actions Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-card p-6 rounded-[2rem] border-2 border-primarycolor/5 shadow-md hover:shadow-xl hover:border-primarycolor/10 transition-all duration-300">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search activity records..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all duration-300 focus:shadow-inner font-semibold"
          />
        </div>

        {/* Dynamic Filter Select */}
        <div className="w-full lg:w-72 bg-background border-2 border-primarycolor/10 rounded-2xl px-4 py-2 flex items-center justify-between shadow-sm">
          <span className="text-[10px] font-black text-secondarycolor uppercase tracking-widest mr-2">User</span>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="text-xs font-black text-primarycolor bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-right uppercase"
          >
            <option value="all">All Accounts</option>
            {uniqueUsers.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-3xl border-2 border-primarycolor/10 bg-card shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-primarycolor/5 border-b-2 border-primarycolor/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 font-black text-secondarycolor py-4 text-[10px] uppercase tracking-[0.2em] px-6">
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
                    <TableCell key={cell.id} className="py-5 px-6 transition-transform duration-300 group-hover:translate-x-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-80 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <Activity className="size-16 text-primarycolor animate-pulse" />
                    <p className="text-xl font-black uppercase tracking-widest">No activity logs found</p>
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
            const item = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-primarycolor leading-tight">
                      {item.account?.account_email || "System"}
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-muted-foreground">
                      {item.account?.account_type || "SYSTEM"}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-secondarycolor/30 tabular-nums">
                    #{item.id}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] font-black text-secondarycolor/40 uppercase tracking-widest">Action</h4>
                    <p className="text-sm font-black text-secondarycolor">{item.action}</p>
                  </div>

                  {item.details && (
                    <div>
                      <h4 className="text-[10px] font-black text-secondarycolor/40 uppercase tracking-widest">Details</h4>
                      <p className="text-xs font-semibold leading-relaxed text-secondarycolor/70 bg-slate-50 border border-slate-100 p-3 rounded-xl italic mt-1">
                        {item.details}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-3 items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                      <Globe className="size-3" />
                      <span>{item.ipAddress || "127.0.0.1"}</span>
                    </div>
                    <div className="text-[10px] font-bold text-secondarycolor/50 tabular-nums">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-4 opacity-30">
            <Activity className="size-20 mx-auto text-primarycolor" />
            <p className="text-xl font-black uppercase tracking-widest">Audit log empty</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-4 py-8 border-t-2 border-primarycolor/5">
        <div className="text-sm font-black text-muted-foreground order-2 sm:order-1 uppercase tracking-widest">
          Showing <span className="text-primarycolor underline decoration-2 underline-offset-4">{table.getRowModel().rows.length}</span> /{" "}
          <span className="text-secondarycolor">{filteredData.length}</span> Records
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
