"use client";

import React, { useState, useRef } from "react";
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
  CheckCircle2,
  Clock,
  X,
  Truck,
  RotateCcw,
  BookOpen,
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { markOrderDelivered } from "@/app/actions/order-actions";
import { motion, AnimatePresence } from "framer-motion";

export type OrderRow = {
  id: number;
  order_type: string;
  total_amount: number;
  amount_paid: number;
  status: string;
  is_approved: boolean;
  delivery: boolean;
  createdAt: string | Date;
  bookShopId: number;
  bookshopes: {
    id: number;
    name: string;
    location: string;
    branch: string | null;
  };
  order_items?: {
    id: number;
    bookEditionId: number;
    quantity: number;
    price_at_order: number;
  }[];
};

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING: { label: "Pending", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  APPROVED: { label: "Approved", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  PROCESSING: { label: "Processing", bg: "bg-purple-50 border-purple-200", text: "text-purple-700", dot: "bg-purple-500" },
  DELIVERED: { label: "Delivered", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig.PENDING;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider border", cfg.bg, cfg.text)}>
      <span className={cn("size-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function DeliveryBadge({ delivered }: { delivered: boolean }) {
  if (delivered) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="size-3" /> Delivered
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="size-3" /> Pending
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
      delay: i * 0.04,
    },
  }),
  exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.15 } },
};

function SwipeableCard({
  order,
  onDeliver,
}: {
  order: OrderRow;
  onDeliver: (id: number) => Promise<void>;
}) {
  const canDeliver = order.is_approved && !order.delivery;
  const [swiping, setSwiping] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalBooks = (order as any).order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;

  const handleDeliver = async () => {
    setLoading(true);
    await onDeliver(order.id);
    setLoading(false);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Hidden action behind the card */}
      {canDeliver && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={handleDeliver}
            disabled={loading}
            className="h-full w-24 bg-emerald-600 flex flex-col items-center justify-center gap-1 text-white font-black text-[9px] uppercase tracking-widest"
          >
            <Truck className="size-5" />
            {loading ? "..." : "Deliver"}
          </button>
        </div>
      )}

      <motion.div
        drag={canDeliver ? "x" : undefined}
        dragConstraints={{ left: canDeliver ? -96 : 0, right: 0 }}
        dragElastic={0.2}
        dragSnapToOrigin
        onDragStart={() => setSwiping(true)}
        onDragEnd={(_, info) => {
          setSwiping(false);
          if (info.offset.x < -80) {
            handleDeliver();
          }
        }}
        className={cn(
          "relative bg-white border-2 border-primarycolor/20 shadow-xl rounded-3xl p-5 space-y-4",
          "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primarycolor before:rounded-r-full",
          swiping && "cursor-grabbing",
          !swiping && "cursor-default",
        )}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <p className="font-black text-sm text-primarycolor">ORD-{order.id}</p>
              <p className="font-bold text-gray-800 text-sm leading-none mt-0.5">{order.bookshopes?.name || "Unknown"}</p>
              <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{order.bookshopes?.branch || order.bookshopes?.location || ""}</p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-primarycolor/10">
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount</p>
            <p className="font-bold text-sm">{order.total_amount?.toLocaleString() || 0} ETB</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Books</p>
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
              <BookOpen className="size-3.5 text-primarycolor/70" />
              {totalBooks}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-primarycolor/10">
          <DeliveryBadge delivered={order.delivery} />
          {canDeliver && (
            <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              ← swipe to deliver
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface ManageOrdersTableProps {
  orders: OrderRow[];
}

export default function ManageOrdersTable({ orders }: ManageOrdersTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = orders.filter((o) => {
    if (!globalFilter) return true;
    const q = globalFilter.toLowerCase();
    return (
      String(o.id).includes(q) ||
      o.bookshopes?.name?.toLowerCase().includes(q) ||
      o.bookshopes?.branch?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    );
  });

  const columns: ColumnDef<OrderRow>[] = [
    {
      accessorKey: "id",
      header: "ORDER ID",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor text-sm">ORD-{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "bookshopes.name",
      id: "shopName",
      header: "SHOP",
      cell: ({ row }) => {
        const shop = row.original.bookshopes;
        return (
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
              <ShoppingBag className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-800 truncate">{shop?.name || "Unknown"}</p>
              <p className="text-[9px] font-bold text-muted-foreground truncate">{shop?.branch || shop?.location || ""}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "items",
      header: "ITEMS",
      cell: ({ row }) => {
        const total = (row.original as any).order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
        return (
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <BookOpen className="size-3.5 text-primarycolor/70" />
            {total}
          </div>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "AMOUNT",
      cell: ({ row }) => {
        const total = row.original.total_amount || 0;
        return (
          <p className="font-bold text-sm">{total.toLocaleString()} <span className="text-[9px] text-muted-foreground">ETB</span></p>
        );
      },
    },
    {
      id: "delivery",
      header: "DELIVERY",
      cell: ({ row }) => <DeliveryBadge delivered={row.original.delivery} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const order = row.original;
        const canDeliver = order.is_approved && !order.delivery;
        const [loading, setLoading] = useState(false);

        const handleDeliver = async () => {
          setLoading(true);
          try {
            const res = await markOrderDelivered(order.id);
            if (res.success) {
              toast.success(`Order ORD-${order.id} marked as delivered`);
              router.refresh();
            } else {
              toast.error(res.error || "Failed to mark as delivered");
            }
          } catch {
            toast.error("An error occurred");
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className="flex items-center gap-2 justify-end">
            {canDeliver && (
              <Button
                onClick={handleDeliver}
                disabled={loading}
                size="sm"
                className="rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest h-9 px-4 gap-1.5"
              >
                <Truck className="size-3.5" />
                {loading ? "..." : "Mark Delivered"}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
    globalFilterFn: "includesString",
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleDeliver = async (orderId: number) => {
    try {
      const res = await markOrderDelivered(orderId);
      if (res.success) {
        toast.success(`Order ORD-${orderId} marked as delivered`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to mark as delivered");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-5">
      {/* Sticky search header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent -mt-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              ref={searchRef}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search orders..."
              className="h-12 pl-12 pr-10 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md font-bold text-sm focus:border-primarycolor shadow-sm"
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => router.refresh()}
            className="size-12 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 transition-all shrink-0 shadow-sm"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>



      {/* Desktop table */}
      <div className="hidden md:block rounded-[2rem] border-2 border-primarycolor/5 bg-white shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-primarycolor/[0.02]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-primarycolor/5">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondarycolor/60">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-primarycolor/[0.02] transition-all duration-300 border-b border-primarycolor/5">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center font-bold text-gray-400 uppercase tracking-widest text-xs">
                  {globalFilter ? "No orders match your search" : "No orders found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards with spring animation */}
      <div className="md:hidden">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <div className="space-y-3 pb-4">
              {filtered.map((order, i) => (
                <motion.div
                  key={order.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                  layout
                >
                  <SwipeableCard order={order} onDeliver={handleDeliver} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center"
            >
              <ShoppingBag className="size-10 mx-auto text-muted-foreground/20 mb-3" />
              <p className="font-black text-gray-300 uppercase tracking-widest text-[10px]">
                {globalFilter
                  ? "No orders match your search"
                  : "No orders"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination - mobile app style bottom bar */}
      <div className="sticky bottom-0 z-20 -mx-4 px-4 pb-4 pt-2 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="flex items-center justify-between gap-3 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-primarycolor/5 p-2 shadow-lg">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 pl-3">
            <span>{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="size-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] transition-all active:scale-90 disabled:opacity-20 flex items-center justify-center"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-[9px] font-black text-muted-foreground/50 px-2">
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="size-10 rounded-xl border-2 border-primarycolor/5 hover:bg-primarycolor/5 font-black text-[10px] transition-all active:scale-90 disabled:opacity-20 flex items-center justify-center"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
