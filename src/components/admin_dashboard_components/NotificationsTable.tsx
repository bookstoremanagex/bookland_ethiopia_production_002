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
import { Search, ChevronLeft, ChevronRight, Bell, Check, Trash2, MailOpen, AlertCircle, ShoppingBag, User, Building2, DollarSign, Package, X, Banknote, FileText, Filter } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "../../lib/utils";
import { markAsRead, deleteNotification } from "../../app/actions/notification-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCalendar } from "../../lib/calendar-context";

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
  const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
  const [data, setData] = React.useState<NotificationItem[]>(initialData || []);
  const safeData = React.useMemo(() => Array.isArray(data) ? data : [], [data]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "read" | "unread">("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [detailItem, setDetailItem] = React.useState<NotificationItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

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
        const handleClick = async () => {
          if (!isRead) {
            await handleMarkAsRead(row.original.id);
          }
          setDetailItem(row.original);
          setIsDetailOpen(true);
        };
        return (
          <button onClick={handleClick} className="text-left w-full">
            <div className="space-y-1 min-w-[200px] max-w-[300px]">
              <div className={cn(
                "line-clamp-1 leading-snug hover:underline cursor-pointer",
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
          </button>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="max-w-[400px] text-sm text-secondarycolor/80 leading-relaxed font-semibold line-clamp-2">
          {row.getValue("message")}
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
            {formatDateTime(new Date(date))}
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
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md rounded-[2rem] border border-slate-200 shadow-lg shadow-black/10 p-4 space-y-3">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all" />
          <Input
            placeholder="Search notifications..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl font-semibold text-base"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-semibold w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-semibold w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                    "group hover:bg-primarycolor/5 transition-all duration-300 border-primarycolor/5 hover:shadow-inner cursor-pointer",
                    !row.original.is_read && "bg-emerald-50/20"
                  )}
                  onClick={async () => {
                    if (!row.original.is_read) await handleMarkAsRead(row.original.id);
                    setDetailItem(row.original);
                    setIsDetailOpen(true);
                  }}
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
                    <button onClick={async () => {
                      if (!item.is_read) await handleMarkAsRead(item.id);
                      setDetailItem(item);
                      setIsDetailOpen(true);
                    }} className="text-left">
                      <h3 className={cn(
                        "text-lg line-clamp-1 leading-tight hover:underline cursor-pointer",
                        item.is_read ? "font-bold text-secondarycolor/70" : "font-black text-primarycolor"
                      )}>
                        {item.title || "Untitled"}
                      </h3>
                    </button>
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

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-secondarycolor/50 tabular-nums">
                    {formatDateTime(new Date(item.createdAt))}
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

      {/* Notification Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] rounded-[2.5rem] p-0 border-4 border-primarycolor/5 flex flex-col">
          <div className="shrink-0 p-8 pb-0">
            <DialogHeader className="space-y-4">
              <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor">
                <Bell className="size-7" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-primarycolor uppercase italic leading-tight">
                  {detailItem?.title || "Notification"}
                </DialogTitle>
                {detailItem?.notification_from && (
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                    From: {detailItem.notification_from}
                  </p>
                )}
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
            <p className="font-bold text-secondarycolor/80 leading-relaxed">
              {detailItem?.message}
            </p>

            {detailItem?.type && (
              <div className="flex items-center gap-2 mt-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-700 border-blue-200">
                  {detailItem.type}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {formatDateTime(new Date(detailItem.createdAt))}
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0 flex justify-end gap-3 p-8 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsDetailOpen(false)}
              className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination Section */}
      <div className="sticky bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-between gap-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <Button
          variant="ghost"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-11 px-3 rounded-xl text-slate-600 disabled:opacity-20 active:scale-90 active:bg-slate-100 transition-all min-w-24 flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="size-5 shrink-0" />
          <span className="text-xs font-semibold hidden xs:inline">Prev</span>
        </Button>
        <div className="flex items-center gap-0.5 text-xs font-semibold text-slate-500 select-none">
          {Array.from({ length: Math.min(table.getPageCount(), 5) }).map((_, i) => {
            const page = (() => {
              const total = table.getPageCount();
              const current = table.getState().pagination.pageIndex;
              if (total <= 5) return i;
              if (current <= 2) return i;
              if (current >= total - 3) return total - 5 + i;
              return current - 2 + i;
            })();
            return (
              <button
                key={page}
                onClick={() => table.setPageIndex(page)}
                className={`size-9 rounded-full text-sm font-semibold transition-all active:scale-90 ${
                  page === table.getState().pagination.pageIndex
                    ? "bg-primarycolor text-white shadow-md shadow-primarycolor/20"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {page + 1}
              </button>
            );
          })}
        </div>
        <Button
          variant="ghost"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-11 px-3 rounded-xl text-slate-600 disabled:opacity-20 active:scale-90 active:bg-slate-100 transition-all min-w-24 flex items-center justify-center gap-1.5"
        >
          <span className="text-xs font-semibold hidden xs:inline">Next</span>
          <ChevronRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
