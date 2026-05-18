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
import { Search, ChevronLeft, ChevronRight, Bell, Check, Trash2, MailOpen, AlertCircle } from "lucide-react";
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
import { markAsRead, deleteNotification } from "../../app/actions/notification-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type NotificationItem = {
  id: number;
  title: string | null;
  message: string | null;
  details: string | null;
  type: string | null;
  notification_to: string;
  notification_from: string | null;
  is_read: boolean;
  createdAt: Date;
};

interface NotificationsTableProps {
  data: NotificationItem[];
}

export function NotificationsTable({ data: initialData = [] }: NotificationsTableProps) {
  const router = useRouter();
  const [data, setData] = React.useState<NotificationItem[]>(initialData || []);
  const safeData = React.useMemo(() => Array.isArray(data) ? data : [], [data]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "read" | "unread">("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  React.useEffect(() => {
    setData(initialData || []);
  }, [initialData]);

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await markAsRead(id);
      if (res.success) {
        toast.success("Notification marked as read");
        setData((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        router.refresh();
      } else {
        toast.error(res.error || "Failed to mark as read");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      const res = await deleteNotification(id);
      if (res.success) {
        toast.success("Notification deleted");
        setData((prev) => prev.filter((n) => n.id !== id));
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete notification");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  // Filter based on custom state (read/unread and type)
  const filteredData = React.useMemo(() => {
    return safeData.filter((item) => {
      if (!item) return false;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "read" && item.is_read) ||
        (statusFilter === "unread" && !item.is_read);

      const matchesType =
        typeFilter === "all" ||
        item.type?.toLowerCase() === typeFilter.toLowerCase();

      return matchesStatus && matchesType;
    });
  }, [safeData, statusFilter, typeFilter]);

  const columns = React.useMemo<ColumnDef<NotificationItem>[]>(() => [
    {
      accessorKey: "is_read",
      header: "Status",
      cell: ({ row }) => {
        const isRead = row.getValue("is_read") as boolean;
        return (
          <div className="flex items-center justify-center">
            <span
              className={cn(
                "size-2.5 rounded-full ring-4 transition-all duration-300",
                isRead
                  ? "bg-slate-300 ring-slate-100"
                  : "bg-emerald-500 ring-emerald-100 animate-pulse"
              )}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const isRead = row.original.is_read;
        return (
          <div className="space-y-1 min-w-[200px] max-w-[300px]">
            <div className={cn(
              "line-clamp-1 leading-snug",
              isRead ? "font-bold text-secondarycolor/70" : "font-black text-primarycolor"
            )}>
              {row.getValue("title") || "Untitled Notification"}
            </div>
            {row.original.notification_from && (
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                From: {row.original.notification_from}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="max-w-[400px] text-sm text-secondarycolor/80 leading-relaxed font-semibold">
          {row.getValue("message")}
          {row.original.details && (
            <p className="text-[11px] text-muted-foreground font-semibold mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
              {row.original.details}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Category",
      cell: ({ row }) => {
        const type = (row.getValue("type") as string) || "INFO";
        return (
          <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
            type.toLowerCase() === "error" || type.toLowerCase() === "danger"
              ? "bg-red-50 text-red-700 border-red-200"
              : type.toLowerCase() === "warning"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : type.toLowerCase() === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}>
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Received At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-xs font-bold text-secondarycolor/60 tabular-nums">
            {date.toLocaleString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            {!item.is_read && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMarkAsRead(item.id)}
                className="size-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all active:scale-90"
                title="Mark as Read"
              >
                <Check className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(item.id)}
              className="size-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-90"
              title="Delete Notification"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ], [data]);

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
        pageSize: 20, // 20 items per page as requested
      },
    },
  });

  // Get unique types for filtering dropdown
  const uniqueTypes = React.useMemo(() => {
    const types = new Set<string>();
    safeData.forEach((n) => {
      if (n?.type) types.add(n.type);
    });
    return Array.from(types);
  }, [safeData]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Search, Filter & Actions Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 bg-card p-6 rounded-[2rem] border-2 border-primarycolor/5 shadow-md hover:shadow-xl hover:border-primarycolor/10 transition-all duration-300">
        <div className="relative w-full xl:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search notifications..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all duration-300 focus:shadow-inner font-semibold"
          />
        </div>

        {/* Dynamic Select Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-stretch sm:items-center">
          <div className="flex-1 sm:w-48 bg-background border-2 border-primarycolor/10 rounded-2xl px-4 py-2 flex items-center justify-between shadow-sm">
            <span className="text-[10px] font-black text-secondarycolor uppercase tracking-widest mr-2">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs font-black text-primarycolor bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-right uppercase"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="flex-1 sm:w-56 bg-background border-2 border-primarycolor/10 rounded-2xl px-4 py-2 flex items-center justify-between shadow-sm">
            <span className="text-[10px] font-black text-secondarycolor uppercase tracking-widest mr-2">Type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs font-black text-primarycolor bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-right uppercase"
            >
              <option value="all">All Categories</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
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
                  className={cn(
                    "group hover:bg-primarycolor/5 transition-all duration-300 border-primarycolor/5 hover:shadow-inner",
                    !row.original.is_read && "bg-emerald-50/20"
                  )}
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
                    <Bell className="size-16 text-primarycolor animate-bounce" />
                    <p className="text-xl font-black uppercase tracking-widest">No notifications found</p>
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
                className={cn(
                  "bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group",
                  !item.is_read && "border-emerald-200 bg-emerald-50/10"
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "size-3 rounded-full shrink-0 ring-4",
                        item.is_read ? "bg-slate-300 ring-slate-50" : "bg-emerald-500 ring-emerald-50 animate-pulse"
                      )}
                    />
                    <h3 className={cn(
                      "text-lg line-clamp-1 leading-tight",
                      item.is_read ? "font-bold text-secondarycolor/70" : "font-black text-primarycolor"
                    )}>
                      {item.title || "Untitled"}
                    </h3>
                  </div>
                  {item.type && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-primarycolor/5 px-2 py-1 rounded-md text-primarycolor border border-primarycolor/10">
                      {item.type}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-secondarycolor/80 leading-relaxed">
                  {item.message}
                </p>

                {item.details && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-muted-foreground italic font-semibold">
                    {item.details}
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-secondarycolor/50 tabular-nums">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    {!item.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl h-9 px-4 transition-all"
                      >
                        Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 font-bold hover:bg-red-50 rounded-xl h-9 px-4 transition-all"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-4 opacity-30">
            <Bell className="size-20 mx-auto text-primarycolor" />
            <p className="text-xl font-black uppercase tracking-widest">Inbox clean</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-4 py-8 border-t-2 border-primarycolor/5">
        <div className="text-sm font-black text-muted-foreground order-2 sm:order-1 uppercase tracking-widest">
          Showing <span className="text-primarycolor underline decoration-2 underline-offset-4">{table.getRowModel().rows.length}</span> /{" "}
          <span className="text-secondarycolor">{filteredData.length}</span> Notifications
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
