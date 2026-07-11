"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  Banknote,
  ExternalLink,
  ArrowUpDown,
  CalendarClock,
} from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";

type Check = {
  id: number;
  username: string | null;
  bankname: string | null;
  type: string | null;
  amount: string | null;
  status: string;
  expirydate: string | null;
  recordeddate: string | null;
  memo: string | null;
};

function getRemainingTime(expirydate: string): {
  label: string;
  days: number;
  urgent: boolean;
} {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expirydate);
  expiry.setHours(0, 0, 0, 0);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays >= 365) {
      const years = Math.floor(absDays / 365);
      const rem = absDays % 365;
      const months = Math.floor(rem / 30);
      return {
        label: `Expired ${years}y ${months}m ago`,
        days: diffDays,
        urgent: true,
      };
    }
    if (absDays >= 30) {
      const months = Math.floor(absDays / 30);
      const days = absDays % 30;
      return {
        label: `Expired ${months}m ${days}d ago`,
        days: diffDays,
        urgent: true,
      };
    }
    return {
      label: `Expired ${absDays}d ago`,
      days: diffDays,
      urgent: true,
    };
  }

  if (diffDays === 0) {
    return { label: "Expires today", days: 0, urgent: true };
  }

  if (diffDays <= 7) {
    return { label: `${diffDays}d remaining`, days: diffDays, urgent: true };
  }

  if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return {
      label: days > 0 ? `${weeks}w ${days}d remaining` : `${weeks}w remaining`,
      days: diffDays,
      urgent: false,
    };
  }

  if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return {
      label: days > 0 ? `${months}m ${days}d remaining` : `${months}m remaining`,
      days: diffDays,
      urgent: false,
    };
  }

  const years = Math.floor(diffDays / 365);
  const rem = diffDays % 365;
  const months = Math.floor(rem / 30);
  return {
    label: months > 0 ? `${years}y ${months}m remaining` : `${years}y remaining`,
    days: diffDays,
    urgent: false,
  };
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  BOUNCED: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function CheckDatesTable({ data }: { data: Check[] }) {
  const { formatDate } = useCalendar();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { active, expired } = useMemo(() => {
    const a: Check[] = [];
    const e: Check[] = [];
    for (const check of data) {
      if (!check.expirydate) continue;
      const remaining = getRemainingTime(check.expirydate);
      if (remaining.days < 0) {
        e.push(check);
      } else {
        a.push(check);
      }
    }
    return { active: a, expired: e };
  }, [data]);

  const columns: ColumnDef<Check>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor/40 text-xs">
          #{row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-black"
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-bold text-primarycolor">
          {row.original.username || "—"}
        </span>
      ),
    },
    {
      accessorKey: "bankname",
      header: "Bank",
      cell: ({ row }) => (
        <span className="font-bold text-primarycolor">
          {row.original.bankname || "—"}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
              type === "COLLATERAL"
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-purple-100 text-purple-700 border-purple-200"
            )}
          >
            {type || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor">
          {row.original.amount || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "PENDING";
        return (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
              statusStyles[status] || "bg-slate-100 text-slate-600"
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "expirydate",
      header: "Expiry Date",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-muted-foreground">
          {row.original.expirydate
            ? formatDate(new Date(row.original.expirydate))
            : "—"}
        </span>
      ),
    },
    {
      id: "remaining",
      header: "Remaining",
      cell: ({ row }) => {
        if (!row.original.expirydate) return <span>—</span>;
        const r = getRemainingTime(row.original.expirydate);
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
              r.urgent
                ? r.days < 0
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            )}
          >
            {r.urgent ? (
              r.days < 0 ? (
                <AlertTriangle className="size-3" />
              ) : (
                <Clock className="size-3" />
              )
            ) : (
              <CalendarClock className="size-3" />
            )}
            {r.label}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link href={`/admin_dashboard/checks/${row.original.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primarycolor hover:text-white transition-all shadow-sm"
          >
            <ExternalLink className="size-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const renderTable = (tableData: Check[]) => {
    const table = useReactTable({
      data: tableData,
      columns,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      state: { sorting, globalFilter },
      initialState: { pagination: { pageSize: 15 } },
    });

    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by username, bank..."
            className="h-10 pl-10 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-primarycolor"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-2xl border-2 border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="border-b-2 border-slate-100 bg-slate-50/50"
                >
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/40"
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50"
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
                    <Clock className="size-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      No checks found
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const c = row.original;
              const remaining = c.expirydate
                ? getRemainingTime(c.expirydate)
                : null;
              return (
                <Link
                  key={c.id}
                  href={`/admin_dashboard/checks/${c.id}`}
                  className="block bg-white rounded-2xl border-2 border-slate-100 p-4 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Banknote className="size-4 text-primarycolor" />
                      <span className="font-black text-primarycolor text-sm">
                        {c.username || "Unknown"}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground">
                        #{c.id}
                      </span>
                    </div>
                    {remaining && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black border",
                          remaining.urgent
                            ? remaining.days < 0
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {remaining.label}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-muted-foreground">
                    {c.bankname && <span>{c.bankname}</span>}
                    <span>{c.amount || "—"} ETB</span>
                    {c.expirydate && (
                      <span>Exp: {formatDate(new Date(c.expirydate))}</span>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <Clock className="size-8 text-slate-200 mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                No checks found
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
              >
                <ChevronLeft className="size-3 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 px-3 rounded-lg border-2 border-slate-100 font-black text-[9px] uppercase tracking-widest"
              >
                Next <ChevronRight className="size-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            Total Checks
          </p>
          <p className="text-xl font-black text-primarycolor mt-1">
            {data.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            Active
          </p>
          <p className="text-xl font-black text-emerald-600 mt-1">
            {active.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 col-span-2 sm:col-span-1">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            Expired
          </p>
          <p className="text-xl font-black text-rose-600 mt-1">
            {expired.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active">
        <TabsList className="w-full justify-start gap-0 rounded-none bg-transparent h-auto pb-0 border-b border-slate-100">
          <TabsTrigger
            value="active"
            className="pb-3 px-4 mr-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primarycolor font-black uppercase tracking-widest text-[10px] text-muted-foreground after:opacity-0 data-[state=active]:after:opacity-100 after:bg-primarycolor after:h-0.5 after:absolute after:inset-x-0 after:bottom-0"
          >
            <Clock className="size-3.5 mr-1.5" />
            Active ({active.length})
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="pb-3 px-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-rose-600 font-black uppercase tracking-widest text-[10px] text-muted-foreground after:opacity-0 data-[state=active]:after:opacity-100 after:bg-rose-500 after:h-0.5 after:absolute after:inset-x-0 after:bottom-0"
          >
            <AlertTriangle className="size-3.5 mr-1.5" />
            Expired ({expired.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          {renderTable(active)}
        </TabsContent>
        <TabsContent value="expired" className="mt-4">
          {renderTable(expired)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
