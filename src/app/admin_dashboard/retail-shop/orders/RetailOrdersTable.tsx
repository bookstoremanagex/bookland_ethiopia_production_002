"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  User,
  Phone,
  Package,
  Eye,
  X,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: number;
  quantity: number | null;
  total_price: number | null;
  created_at: string;
  phoneNumber: string | null;
  book: {
    edition_name: string;
    price: number | null;
    books: { title: string; author: string } | null;
  } | null;
  customer: {
    id: number;
    name: string | null;
    email: string | null;
    customerType: string | null;
    phonenumber: string | null;
  } | null;
}

interface OrderGroup {
  phone: string | null;
  customerId: number | null;
  customerName: string | null;
  customerType: string | null;
  orders: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
  createdAt: string;
}

interface Props {
  groups: OrderGroup[];
}

export function RetailOrdersTable({ groups }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<OrderGroup | null>(null);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnDef<OrderGroup>[] = [
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const g = row.original;
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn(
              "size-8 rounded-lg flex items-center justify-center shrink-0",
              g.customerId ? "bg-blue-100" : "bg-primarycolor/10"
            )}>
              {g.customerId ? (
                <User className="size-4 text-blue-600" />
              ) : (
                <Phone className="size-4 text-primarycolor" />
              )}
            </div>
            <div className="min-w-0">
              {g.customerName ? (
                <>
                  <p className="font-black text-primarycolor text-xs uppercase truncate">{g.customerName}</p>
                  <p className="text-[9px] font-bold text-muted-foreground truncate">{g.customerType}</p>
                </>
              ) : g.phone ? (
                <>
                  <p className="font-bold text-slate-700 text-xs truncate">{g.phone}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Individual</p>
                </>
              ) : (
                <p className="font-bold text-slate-400 text-xs italic">Walk-in</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "items",
      header: "Items",
      cell: ({ row }) => {
        const g = row.original;
        const uniqueBooks = new Set(
          g.orders.map((o) => o.book?.books?.title).filter(Boolean)
        );
        const first = g.orders[0]?.book?.books?.title || "Unknown";
        return (
          <div className="min-w-0">
            <p className="font-bold text-slate-700 text-xs truncate">{first}</p>
            {uniqueBooks.size > 1 && (
              <p className="text-[9px] font-bold text-muted-foreground">+{uniqueBooks.size - 1} more</p>
            )}
          </div>
        );
      },
    },
    {
      id: "quantity",
      header: "Qty",
      cell: ({ row }) => (
        <span className="font-black text-slate-700 text-xs">{row.original.totalQuantity}</span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-black text-primarycolor text-xs">
          {row.original.totalAmount.toLocaleString()} ETB
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedGroup(row.original)}
          className="h-7 px-2 rounded-lg text-[8px] font-black uppercase tracking-widest text-primarycolor hover:bg-primarycolor/5 gap-1"
        >
          <Eye className="size-3" /> View
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: groups,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Groups</p>
          <p className="text-xl font-black text-primarycolor mt-1">{groups.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Orders</p>
          <p className="text-xl font-black text-primarycolor mt-1">
            {groups.reduce((s, g) => s + g.orders.length, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 col-span-2 sm:col-span-1">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Revenue</p>
          <p className="text-xl font-black text-primarycolor mt-1">
            {groups.reduce((s, g) => s + g.totalAmount, 0).toLocaleString()} ETB
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search by customer, phone, or book..."
          className="h-10 pl-10 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-primarycolor"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-b-2 border-slate-100">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[9px] font-black uppercase tracking-widest text-muted-foreground h-12 px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => setSelectedGroup(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <ShoppingBag className="size-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    No orders found
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ({table.getFilteredRowModel().rows.length} groups)
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={(o) => { if (!o) setSelectedGroup(null); }}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-2 border-primarycolor/5 p-0 overflow-hidden max-h-[85dvh] flex flex-col">
          <DialogHeader className="bg-white p-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-black text-primarycolor uppercase tracking-tight italic">
                  Order Details
                </DialogTitle>
                <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  {selectedGroup?.orders.length} order{selectedGroup?.orders.length !== 1 ? "s" : ""} in this group
                </DialogDescription>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Customer Info */}
            <div className="bg-primarycolor/5 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-primarycolor">
                <User className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Customer Info</span>
              </div>
              {selectedGroup?.customerName ? (
                <div className="space-y-1">
                  <p className="font-black text-sm text-slate-800">{selectedGroup.customerName}</p>
                  <p className="text-xs text-muted-foreground">{selectedGroup.customerType}</p>
                </div>
              ) : selectedGroup?.phone ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="size-3 text-muted-foreground" />
                    <p className="font-bold text-sm text-slate-700">{selectedGroup.phone}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase">Individual Customer</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Walk-in customer</p>
              )}
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primarycolor">
                <Package className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Items</span>
              </div>
              {selectedGroup?.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-700 truncate">
                      {order.book?.books?.title ?? "Unknown"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {order.book?.edition_name} &middot; Qty: {order.quantity} &middot; {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span className="font-black text-primarycolor text-xs shrink-0 ml-3">
                    {(order.total_price ?? 0).toLocaleString()} ETB
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total</span>
              <span className="text-lg font-black text-primarycolor">
                {selectedGroup?.totalAmount.toLocaleString()} ETB
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
