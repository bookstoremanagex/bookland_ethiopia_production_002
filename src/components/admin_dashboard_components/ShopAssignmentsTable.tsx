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
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  ExternalLink,
  Filter,
  ArrowUpDown,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { updateBookShopEdition } from "@/app/actions/book-shop-edition-actions";
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

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    assignmentEdits: Record<number, string>;
    setAssignmentEdits: React.Dispatch<
      React.SetStateAction<Record<number, string>>
    >;
    handleAssignmentPaymentUpdate: (id: number, val: string) => Promise<void>;
  }
}

export type ShopAssignment = {
  id: number;
  quantity: number;
  total_price: number | null;
  already_paid: number;
  remaining_amount: number;
  status: string | null;
  createdAt: string | Date;
  bookedition: {
    edition_name: string;
    books: {
      title: string;
    };
  };
};

const DetailsCell = ({ id }: { id: number }) => {
  const pathname = usePathname();
  const dashboardRoot = pathname.split("/").slice(0, 2).join("/");
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="rounded-xl hover:bg-primarycolor hover:text-white transition-all shadow-sm"
    >
      <Link href={`${dashboardRoot}/shop_assignments/${id}`}>
        <ExternalLink className="size-4" />
      </Link>
    </Button>
  );
};

const useColumns = (formatDate: (date: Date) => string): ColumnDef<ShopAssignment>[] => [
  {
    accessorKey: "bookedition.books.title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-black"
        >
          Book Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="font-black text-primarycolor leading-tight line-clamp-1">
          {row.original.bookedition.books.title}
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {row.original.bookedition.edition_name}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Package className="size-3.5 text-primarycolor/40" />
        <span className="font-bold text-primarycolor">
          {(row.getValue<number>("quantity") || 0).toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "total_price",
    header: "Total Value",
    cell: ({ row }) => (
      <div className="font-black text-primarycolor">
        {(row.getValue<number>("total_price") || 0).toLocaleString()}{" "}
        <span className="text-[10px] opacity-40">ETB</span>
      </div>
    ),
  },
  {
    id: "finance",
    header: "Financial Status",
    cell: ({ row, table }) => {
      const paid = row.original.already_paid;
      const remaining = row.original.remaining_amount;
      const total = row.original.total_price || 0;
      const isFullyPaid = (remaining || 0) <= 0 && total > 0;

      const {
        assignmentEdits,
        setAssignmentEdits,
        handleAssignmentPaymentUpdate,
      } = table.options.meta || {};

      if (
        !assignmentEdits ||
        !setAssignmentEdits ||
        !handleAssignmentPaymentUpdate
      ) {
        return null;
      }

      return (
        <div className="space-y-1.5 min-w-[180px]">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1">
            <span className="text-primarycolor/40">
              Value: {total.toLocaleString()}
            </span>
            <span
              className={cn(
                remaining > 0 ? "text-rose-500" : "text-emerald-500",
              )}
            >
              Due: {(remaining || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
              Paid:
            </span>
            <Input
              className="h-7 w-24 text-[10px] font-bold"
              value={assignmentEdits[row.original.id] ?? (paid || 0).toString()}
              onChange={(e) => {
                const newVal = e.target.value;
                setAssignmentEdits({
                  ...assignmentEdits,
                  [row.original.id]: newVal,
                });
                handleAssignmentPaymentUpdate(row.original.id, newVal);
              }}
            />
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
            <div
              className={cn(
                "h-full transition-all duration-1000",
                isFullyPaid ? "bg-emerald-500" : "bg-primarycolor",
              )}
              style={{
                width: `${Math.min(100, ((paid || 0) / (total || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Assigned Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="size-3.5" />
        <span className="font-bold text-[10px]">
          {formatDate(new Date(row.getValue("createdAt")))}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Details",
    cell: ({ row }) => <DetailsCell id={row.original.id} />,
  },
];

interface ShopAssignmentsTableProps {
  data: ShopAssignment[];
}

export function ShopAssignmentsTable({ data }: ShopAssignmentsTableProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dashboardRoot = pathname.split("/").slice(0, 2).join("/");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { formatDate } = useCalendar();
  const columns = React.useMemo(() => useColumns(formatDate), [formatDate]);
  const [assignmentEdits, setAssignmentEdits] = React.useState<
    Record<number, string>
  >({});

  const handleAssignmentPaymentUpdate = async (id: number, val: string) => {
    const amount = Number(val);
    if (isNaN(amount)) {
      toast.error("Invalid amount");
      return;
    }
    const res = await updateBookShopEdition(id, { already_paid: amount });
    if (res.success) {
      toast.success("Payment updated");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update payment");
    }
  };
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
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
    meta: {
      assignmentEdits,
      setAssignmentEdits,
      handleAssignmentPaymentUpdate,
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
          <Input
            placeholder="Search books by title..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-12 pl-12 bg-white border-slate-200 focus:border-primarycolor rounded-2xl font-bold"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <Filter className="size-3" /> {data.length} Records
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b-2 border-slate-100"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                    className="h-20 border-b border-slate-50 hover:bg-primarycolor/[0.02] transition-colors"
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
                    colSpan={columns.length}
                    className="h-48 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Package className="size-10" />
                      <p className="text-xs font-black uppercase tracking-widest">
                        No matching records
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const assignment = row.original;
            const paid = assignment.already_paid;
            const total = assignment.total_price || 0;
            const remaining = assignment.remaining_amount;
            const percent = total > 0 ? (paid / total) * 100 : 0;

            return (
              <div
                key={row.id}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6 space-y-6 shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-primarycolor leading-tight">
                      {assignment.bookedition.books.title}
                    </h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {assignment.bookedition.edition_name}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="rounded-xl shrink-0"
                  >
                    <Link
                      href={`${dashboardRoot}/shop_assignments/${assignment.id}`}
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Quantity
                    </p>
                    <div className="flex items-center gap-2 font-bold text-primarycolor text-sm">
                      <Package className="size-3.5 opacity-40" />
                      {assignment.quantity.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Total Value
                    </p>
                    <div className="font-black text-primarycolor text-sm">
                      {total.toLocaleString()}{" "}
                      <span className="text-[10px] opacity-40">ETB</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <div className="flex flex-col gap-1">
                      <span className="text-emerald-500">Paid:</span>
                      <Input
                        className="h-7 w-24 text-[10px] font-bold"
                        value={
                          assignmentEdits[assignment.id] ??
                          (paid || 0).toString()
                        }
                        onChange={(e) => {
                          const newVal = e.target.value;
                          setAssignmentEdits({
                            ...assignmentEdits,
                            [assignment.id]: newVal,
                          });
                          handleAssignmentPaymentUpdate(assignment.id, newVal);
                        }}
                      />
                    </div>
                    <span
                      className={cn(
                        remaining > 0 ? "text-rose-500" : "text-emerald-500",
                      )}
                    >
                      Due: {remaining.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000",
                        remaining <= 0 ? "bg-emerald-500" : "bg-primarycolor",
                      )}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground pt-2">
                  <Calendar className="size-3" />
                  Assigned{" "}
                  {formatDate(new Date(assignment.createdAt))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 opacity-30">
            <Package className="size-10 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              No matching records
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-4">
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Showing {table.getRowModel().rows.length} of {data.length} assignments
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-10 px-4 border-2 border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft className="size-4 mr-2" />
            Previous
          </Button>
          <div className="h-10 px-4 flex items-center bg-slate-50 border-2 border-slate-100 rounded-xl text-[10px] font-black text-primarycolor">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-10 px-4 border-2 border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest"
          >
            Next
            <ChevronRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
