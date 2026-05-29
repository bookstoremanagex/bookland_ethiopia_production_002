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
import { Search, ChevronLeft, ChevronRight, Bell, Check, Trash2, MailOpen, AlertCircle, ShoppingBag, User, Building2, DollarSign, Package, X, Banknote, FileText } from "lucide-react";
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

                {item.details && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-muted-foreground font-semibold overflow-x-auto break-all whitespace-normal">
                    <pre className="whitespace-pre-wrap break-all font-sans text-xs m-0">
                      {item.details}
                    </pre>
                  </div>
                )}

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

            {detailItem?.details && (() => {
              try {
                const parsed = JSON.parse(detailItem.details);
                if (parsed.purchaseId) {
                  return (
                    <div className="space-y-4 mt-6">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <p className="font-black text-primarycolor">{parsed.customerName || "Anonymous"}</p>
                        <p className="text-[9px] font-bold text-muted-foreground">{parsed.itemCount || 0} item(s) &middot; {parsed.totalAmount?.toLocaleString()} ETB</p>
                      </div>
                      <button
                        onClick={() => router.push(`/admin_dashboard/retail_management/${parsed.purchaseId}`)}
                        className="w-full p-4 rounded-2xl bg-primarycolor/5 border-2 border-primarycolor/10 hover:bg-primarycolor/10 hover:border-primarycolor/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="size-4 text-primarycolor" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primarycolor">View Retail Purchase →</span>
                      </button>
                    </div>
                  );
                }
                if (parsed.shopName) {
                  const isPayment = parsed.paymentType || parsed.paymentId;
                  return (
                    <div className="space-y-4 mt-6">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-primarycolor/40" />
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Shop</p>
                        </div>
                        <p className="font-black text-primarycolor">{parsed.shopName}</p>
                      </div>

                      {isPayment ? (
                        <>
                          <div className="p-4 rounded-2xl bg-primarycolor/5 border border-primarycolor/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="size-5 text-primarycolor" />
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Payment Amount</p>
                            </div>
                            <p className="text-xl font-black text-primarycolor">{parsed.amount?.toLocaleString()} ETB</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                              <div className="flex items-center gap-2">
                                <Banknote className="size-4 text-primarycolor/40" />
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Type</p>
                              </div>
                              <p className="font-black text-primarycolor">{parsed.paymentType || "—"}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                              <div className="flex items-center gap-2">
                                <FileText className="size-4 text-primarycolor/40" />
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Payment ID</p>
                              </div>
                              <p className="font-black text-primarycolor">#{parsed.paymentId}</p>
                            </div>
                          </div>
                          {parsed.shopId && (
                            <button
                              onClick={() => router.push(`/admin_dashboard/manage_payment/${parsed.shopId}`)}
                              className="w-full p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Banknote className="size-4 text-emerald-700" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">View Payment →</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="size-4 text-primarycolor/40" />
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Placed By</p>
                            </div>
                            <p className="font-black text-primarycolor">{parsed.placedBy}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="flex items-center gap-2">
                              <Package className="size-4 text-primarycolor/40" />
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Items</p>
                            </div>
                            <p className="font-bold text-primarycolor text-sm">{parsed.items}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-primarycolor/5 border border-primarycolor/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="size-5 text-primarycolor" />
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Amount</p>
                            </div>
                            <p className="text-xl font-black text-primarycolor">{parsed.totalAmount?.toLocaleString()} ETB</p>
                          </div>
                          {parsed.orderId && (
                            <button
                              onClick={() => router.push(`/admin_dashboard/manage_orders?orderId=${parsed.orderId}`)}
                              className="w-full p-4 rounded-2xl bg-primarycolor/5 border-2 border-primarycolor/10 hover:bg-primarycolor/10 hover:border-primarycolor/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <ShoppingBag className="size-4 text-primarycolor" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primarycolor">View Order ORD-{parsed.orderId} →</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                }
              } catch {
                return (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-muted-foreground font-semibold overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-all font-sans text-xs m-0">
                      {detailItem.details}
                    </pre>
                  </div>
                );
              }
              return null;
            })()}

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
