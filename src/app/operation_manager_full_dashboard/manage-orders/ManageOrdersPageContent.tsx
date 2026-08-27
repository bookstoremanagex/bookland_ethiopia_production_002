"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Banknote,
  Building2,
  Eye,
  AlertTriangle,
  Plus,
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
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import ManageOrderDetailsModal from "./ManageOrderDetailsModal";
import AddOrderModal from "./AddOrderModal";
import type { ShopRow } from "@/components/deliver_full_dashboard_components/OrderModal";

export type AdminOrder = {
  id: number;
  order_type: string;
  total_amount: number;
  amount_paid: number;
  payment_type: string | null;
  check_id: number | null;
  status: string;
  is_approved: boolean;
  hide_remaining: boolean;
  memo: string | null;
  allocation_summary: string | null;
  delivery: boolean;
  delivered_by: number | null;
  createdAt: string | Date;
  bookShopId: number;
  bookshopes: {
    id: number;
    name: string;
    location: string;
    branch: string | null;
    phone: string | null;
    email: string | null;
  };
  checks: {
    id: number;
    bankname: string | null;
    username: string | null;
    amount: string | null;
    type: string | null;
    status: string | null;
    imageUrl: string | null;
  } | null;
  order_items: {
    id: number;
    quantity: number;
    price_at_order: number;
    bookEditionId: number;
    bookedition: {
      edition_name: string;
      bookId: number;
      book_image_url: string | null;
      books: { title: string; book_image_url: string | null };
    };
  }[];
  locked_editions?: {
    id: number;
    editionId: number;
    amount_locked: number;
    order_id: number;
    status: string;
    is_deleted: boolean;
  }[];
};

interface ManageOrdersPageContentProps {
  orders: AdminOrder[];
  userRole?: string | null;
  shops: ShopRow[];
}

export default function ManageOrdersPageContent({
  orders,
  userRole,
  shops,
}: ManageOrdersPageContentProps) {
  const { formatDate } = useCalendar();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [orderList, setOrderList] = useState<AdminOrder[]>(orders);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Hydration-safe restore: server and initial client both render page 0, then
  // after mount we jump to the saved page without causing a hydration mismatch.
  useEffect(() => {
    const saved = localStorage.getItem("mo_page_op");
    const idx = saved ? parseInt(saved, 10) : 0;
    if (!isNaN(idx) && idx >= 0 && idx !== 0) {
      setPagination((prev) => (prev.pageIndex === idx ? prev : { ...prev, pageIndex: idx }));
    }
  }, []);

  // Persist page — stays exactly where the user left it across reloads / revalidations
  useEffect(() => {
    localStorage.setItem("mo_page_op", String(pagination.pageIndex));
  }, [pagination.pageIndex]);

  // Sync server data without losing the current page (router.refresh / revalidatePath)
  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  // Clamp pageIndex if the list shrinks (e.g. delete last item on last page)
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(orderList.length / pagination.pageSize) - 1);
    if (pagination.pageIndex > maxPage) {
      setPagination((prev) => ({ ...prev, pageIndex: maxPage }));
    }
  }, [orderList.length, pagination.pageIndex, pagination.pageSize]);

  // Save page index before modal opens
  const openOrderModal = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Auto-open order detail modal from notification link
  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      const order = orderList.find((o) => o.id === Number(orderId));
      if (order) {
        setSelectedOrder(order);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, orderList]);

  const pendingCount = useMemo(
    () => orderList.filter((o) => !o.is_approved).length,
    [orderList],
  );

  const columns: ColumnDef<AdminOrder>[] = [
    {
      accessorKey: "id",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor text-base">
          ORD-{row.original.id}
        </span>
      ),
    },
    {
      id: "shop",
      accessorFn: (row) => `${row.bookshopes?.name || ""} ${row.bookshopes?.location || ""}`,
      header: "Book Shop",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 rounded-xl bg-primarycolor/10 flex items-center justify-center shrink-0">
            <Building2 className="size-4 text-primarycolor" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-primarycolor truncate">
              {row.original.bookshopes?.name}
            </p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">
              {row.original.bookshopes?.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "order_type",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex flex-col items-start gap-0.5">
          <div
            className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit",
              row.original.order_type === "requested"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700",
            )}
          >
            {row.original.order_type}
          </div>
          <span className="text-[8px] text-muted-foreground font-semibold tracking-wider whitespace-nowrap">
            {formatDate(new Date(row.original.createdAt))}
          </span>
        </div>
      ),
    },
    {
      id: "books",
      header: "Books",
      cell: ({ row }) => {
        const items = row.original.order_items || [];
        const uniqueBooks = [
          ...new Map(
            items.map((i) => [i.bookedition?.books?.title, i]),
          ).values(),
        ];
        const first = uniqueBooks[0]?.bookedition?.books?.title || "Unknown";
        const more = uniqueBooks.length - 1;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-700 truncate max-w-[160px]">
              {first}
            </span>
            {more > 0 && (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                +{more} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "Financials",
      cell: ({ row }) => {
        const debt = row.original.total_amount - row.original.amount_paid;
        return (
          <div className="flex flex-col">
            <span className="font-black text-primarycolor">
              {row.original.total_amount.toLocaleString()}{" "}
              <span className="text-[10px] opacity-40">ETB</span>
            </span>
            {debt > 0 && (
              <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                <Banknote className="size-3" /> {debt.toLocaleString()} debt
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_approved",
      header: "Status",
      cell: ({ row }) =>
        row.original.is_approved ? (
          <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 className="size-3.5" /> Approved
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest">
            <Clock className="size-3.5" /> Pending
          </div>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold">
          <Calendar className="size-3.5" />
          {formatDate(new Date(row.original.createdAt))}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: orderList,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    state: { sorting, globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center">
              <ShoppingBag className="size-6 text-primarycolor" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-primarycolor uppercase italic tracking-tight">
                Manage{" "}
                <span className="text-secondarycolor not-italic">Orders</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Review, allocate stock, and approve bookstore orders
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {pendingCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-100 rounded-2xl px-5 py-3 animate-pulse">
              <AlertTriangle className="size-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-black text-amber-800 text-sm">
                  {pendingCount} Pending Approval
                </p>
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">
                  Awaiting your review
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={() => setIsAddOrderOpen(true)}
            className="h-12 px-6 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/30 gap-2"
          >
            <Plus className="size-4" /> Add a New Order
          </Button>
        </div>
      </div>

      {/* Stats Cards — admin only */}
      {userRole === "ADMIN" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: orderList.length,
              color: "bg-primarycolor/10 text-primarycolor",
              icon: ShoppingBag,
            },
            {
              label: "Pending",
              value: pendingCount,
              color: "bg-amber-50 text-amber-700",
              icon: Clock,
            },
            {
              label: "Approved",
              value: orderList.filter((o) => o.is_approved).length,
              color: "bg-emerald-50 text-emerald-700",
              icon: CheckCircle2,
            },
            {
              label: "Total Value",
              value:
                orderList
                  .reduce((s, o) => s + o.total_amount, 0)
                  .toLocaleString() + " ETB",
              color: "bg-blue-50 text-blue-700",
              icon: Banknote,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-2xl p-5 border flex items-center gap-4",
                stat.color,
                "bg-opacity-50 border-current border-opacity-20",
              )}
            >
              <stat.icon className="size-6 shrink-0 opacity-60" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                  {stat.label}
                </p>
                <p className="text-xl font-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
            <Input
              placeholder="Search by order ID, shop, type..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-12 pl-12 bg-slate-50 border-slate-200 focus:border-primarycolor rounded-2xl font-bold"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">
            <Filter className="size-3" /> {orderList.length} Orders
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="hover:bg-transparent border-b-2 border-slate-100"
                >
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className="h-14 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40"
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
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
                      "h-20 border-b border-slate-50 transition-colors cursor-pointer",
                      !row.original.is_approved
                        ? "hover:bg-amber-50/30"
                        : "hover:bg-primarycolor/[0.02]",
                    )}
                    onClick={() => openOrderModal(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-48 text-center text-muted-foreground italic"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile card layout */}
        <div className="block md:hidden space-y-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const o = row.original;
              const items = o.order_items || [];
              const firstTitle = items[0]?.bookedition?.books?.title || "Unknown";
              const extraCount = items.length - 1;
              return (
                <div
                  key={row.id}
                  className={cn(
                    "bg-white rounded-2xl p-4 border-2 shadow-sm cursor-pointer active:scale-[0.98] transition-transform",
                    o.is_approved ? "border-emerald-100" : "border-amber-100"
                  )}
                  onClick={() => openOrderModal(o)}
                >
                  {/* Row 1: Order # + Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-primarycolor text-base">ORD-{o.id}</span>
                    {o.is_approved ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="size-3" /> Approved
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest">
                        <Clock className="size-3" /> Pending
                      </div>
                    )}
                  </div>

                  {/* Row 2: Shop + Type */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Building2 className="size-3.5 text-primarycolor/60 shrink-0" />
                      <span className="font-bold text-slate-700 text-xs truncate">{o.bookshopes?.name}</span>
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shrink-0 ml-2",
                      o.order_type === "requested" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    )}>
                      {o.order_type}
                    </div>
                  </div>

                  {/* Row 3: Books + Amount */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-[9px] font-bold text-muted-foreground truncate">
                        {firstTitle}
                        {extraCount > 0 && <span className="text-primarycolor font-black"> +{extraCount} more</span>}
                      </span>
                    </div>
                    <span className="font-black text-primarycolor text-xs shrink-0 ml-2">
                      {o.total_amount.toLocaleString()} ETB
                    </span>
                  </div>

                  {/* Row 4: Date */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Calendar className="size-3" />
                    {formatDate(new Date(o.createdAt))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-muted-foreground italic font-bold text-sm">
              No orders found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div suppressHydrationWarning className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
            <span className="ml-4 opacity-50">
              ({table.getFilteredRowModel().rows.length} results)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-10 w-10 p-0 border-2 border-slate-100 rounded-xl"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-10 w-10 p-0 border-2 border-slate-100 rounded-xl"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Details/Approval Modal */}
      <ManageOrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onApproved={(updatedOrder) => {
          setOrderList((prev) =>
            prev.map((o) =>
              o.id === updatedOrder.id
                ? { ...o, is_approved: true, status: "Approved" }
                : o,
            ),
          );
          setIsModalOpen(false);
        }}
        onDeleted={(deletedOrderId) => {
          setOrderList((prev) => prev.filter((o) => o.id !== deletedOrderId));
          setSelectedOrder(null);
          setIsModalOpen(false);
        }}
        onUpdated={(updatedOrder) => {
          setOrderList((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
          );
          setSelectedOrder(updatedOrder);
        }}
      />

      {/* Add a New Order Modal */}
      <AddOrderModal
        shops={shops}
        open={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
      />
    </div>
  );
}
