"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
    ArrowUpDown,
    ExternalLink,
    Building2,
    Search,
    TrendingUp,
    Printer,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { convertToEthiopian, ETHIOPIAN_MONTHS } from "@/lib/calendar-utils"

export interface PaymentsDueData {
    id: number
    name: string
    branch: string
    location: string
    orderDebt: number
    roundDebt: number
    totalDebt: number
}

export const columns: ColumnDef<PaymentsDueData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
          Shop Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor">
                <Building2 className="size-4" />
            </div>
            <div>
                <div className="font-black text-primarycolor uppercase text-xs">{row.getValue("name")}</div>
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{row.original.branch}</div>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "orderDebt",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
            Order Debt
            <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
        const val = row.getValue<number>("orderDebt");
        return (
            <div className={`font-black ${val > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {val.toLocaleString()} <span className="text-[8px] opacity-50">ETB</span>
            </div>
        );
    },
  },
  {
    accessorKey: "roundDebt",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
            Round Debt
            <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
        const val = row.getValue<number>("roundDebt");
        return (
            <div className={`font-black ${val > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {val.toLocaleString()} <span className="text-[8px] opacity-50">ETB</span>
            </div>
        );
    },
  },
  {
    accessorKey: "totalDebt",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-[10px] font-black uppercase tracking-widest hover:bg-transparent p-0"
        >
            Total Debt
            <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
        const val = row.getValue<number>("totalDebt");
        return (
            <div className={`font-black ${val > 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                {val.toLocaleString()} <span className="text-[8px] opacity-50">ETB</span>
            </div>
        );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const shop = row.original

      return (
        <Link href={`/admin_dashboard/book_shops/${shop.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all">
                <ExternalLink className="size-4" />
            </Button>
        </Link>
      )
    },
  },
]

export default function PaymentsDueTable({ data }: { data: PaymentsDueData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "totalDebt", desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [includeZeroDebt, setIncludeZeroDebt] = React.useState(false);

  const handlePrintPDF = () => {
    const filtered = includeZeroDebt ? data : data.filter(d => d.totalDebt > 0);
    const totalOrderDebt = filtered.reduce((s, d) => s + d.orderDebt, 0);
    const totalRoundDebt = filtered.reduce((s, d) => s + d.roundDebt, 0);
    const totalDebt = filtered.reduce((s, d) => s + d.totalDebt, 0);

    const now = new Date();
    const gDate = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const eth = convertToEthiopian(now);
    const eDate = `${ETHIOPIAN_MONTHS[eth.month - 1]} ${eth.day}, ${eth.year}`;

    const rows = filtered.map((d, i) => `
      <tr${i % 2 === 0 ? '' : ' style="background:#f8f8f8"'}>
        <td style="padding:6px 12px;border:1px solid #ccc;font-size:11px;font-weight:700;color:#333">${d.name}</td>
        <td style="padding:6px 12px;border:1px solid #ccc;font-size:11px;color:#666">${d.branch}</td>
        <td style="padding:6px 12px;border:1px solid #ccc;font-size:11px;text-align:right;font-weight:600;color:#d97706">${d.orderDebt.toLocaleString()}</td>
        <td style="padding:6px 12px;border:1px solid #ccc;font-size:11px;text-align:right;font-weight:600;color:#e11d48">${d.roundDebt.toLocaleString()}</td>
        <td style="padding:6px 12px;border:1px solid #ccc;font-size:11px;text-align:right;font-weight:700;color:#1e293b">${d.totalDebt.toLocaleString()}</td>
      </tr>
    `).join('');

    const printContent = `
<!DOCTYPE html>
<html>
<head><title>Payments Due - Bookland Ethiopia</title>
<style>
  @page { size: A4 landscape; margin: 10mm; @bottom-center { content: "Page " counter(page); font-size:9px;color:#999; } }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; padding:20px 30px; color:#000; }
  h1 { font-size:18px; font-weight:700; margin-bottom:2px; }
  .sub { font-size:10px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
  table { width:100%; border-collapse:collapse; font-size:11px; }
  th { background:#1e293b; color:#fff; padding:8px 12px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border:1px solid #1e293b; }
  th.right { text-align:right; }
  .grand-row td { background:#f1f5f9; font-weight:700; border-top:2px solid #1e293b; }
  .grand-row td:last-child { font-size:12px; color:#1e293b; }
  .summary { display:flex; gap:32px; margin-bottom:16px; }
  .summary-item { font-size:10px; font-weight:700; color:#888; text-transform:uppercase; letter-spacing:1px; }
  .summary-item span { font-size:18px; font-weight:700; display:block; margin-top:2px; letter-spacing:0; text-transform:none; }
</style>
</head>
<body>
  <h1>Payments Due</h1>
  <div class="sub">Bookland Ethiopia — Outstanding Debts Report</div>
  <div style="font-size:10px;color:#888;margin-bottom:12px;">${gDate} &nbsp;|&nbsp; ${eDate}</div>
  <div class="summary">
    <div class="summary-item"><span style="color:#d97706">Order Debt</span><span style="color:#d97706">ETB ${totalOrderDebt.toLocaleString()}</span></div>
    <div class="summary-item"><span style="color:#e11d48">Round Debt</span><span style="color:#e11d48">ETB ${totalRoundDebt.toLocaleString()}</span></div>
    <div class="summary-item"><span style="color:#1e293b">Total Debt</span><span style="color:#1e293b">ETB ${totalDebt.toLocaleString()}</span></div>
  </div>
  <table>
    <thead><tr><th>Shop Name</th><th>Branch</th><th class="right">Order Debt (ETB)</th><th class="right">Round Debt (ETB)</th><th class="right">Total Debt (ETB)</th></tr></thead>
    <tbody>
      ${rows}
      <tr class="grand-row">
        <td colspan="2" style="padding:8px 12px;border:1px solid #ccc;font-size:11px;font-weight:700">Grand Total</td>
        <td style="padding:8px 12px;border:1px solid #ccc;text-align:right;font-size:11px;font-weight:700;color:#d97706">${totalOrderDebt.toLocaleString()}</td>
        <td style="padding:8px 12px;border:1px solid #ccc;text-align:right;font-size:11px;font-weight:700;color:#e11d48">${totalRoundDebt.toLocaleString()}</td>
        <td style="padding:8px 12px;border:1px solid #ccc;text-align:right;font-size:11px;font-weight:700;color:#1e293b">${totalDebt.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top:12px;font-size:9px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:8px;">
    Generated on ${new Date().toLocaleDateString()} — Bookland Ethiopia Bookstore Management System
  </div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 500);
    }
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
            <Input
                placeholder="Filter shops..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="h-12 pl-11 rounded-2xl border-2 border-primarycolor/5 focus:border-primarycolor bg-white shadow-sm font-bold"
            />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-primarycolor/5 shadow-sm text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                <TrendingUp className="size-3.5 text-emerald-500" />
                {data.filter(s => s.totalDebt > 0).length}
            </div>
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border-2 border-primarycolor/5 shadow-sm cursor-pointer select-none">
                <Checkbox
                    checked={includeZeroDebt}
                    onCheckedChange={(v) => setIncludeZeroDebt(v === true)}
                    className="border-primarycolor/30 data-[state=checked]:bg-primarycolor data-[state=checked]:border-primarycolor size-4"
                />
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Include cleared</span>
            </label>
            <Button
                onClick={handlePrintPDF}
                className="h-11 px-5 rounded-2xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primarycolor/20"
            >
                <Printer className="size-3.5 mr-1.5" />
                Print PDF
            </Button>
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-primarycolor/40">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-20 border-b border-slate-50 hover:bg-slate-50/50 transition-colors px-6"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
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
                  className="h-40 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  No shops found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const item = row.original
            return (
              <div key={item.id} className="bg-white rounded-2xl border-2 border-primarycolor/5 p-5 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center shrink-0">
                      <Building2 className="size-5 text-primarycolor" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-primarycolor uppercase text-sm truncate">{item.name}</div>
                      <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{item.branch}</div>
                    </div>
                  </div>
                  <Link href={`/admin_dashboard/book_shops/${item.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primarycolor hover:text-white transition-all shrink-0">
                      <ExternalLink className="size-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-amber-50 rounded-xl p-3 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-amber-600/60">Order Debt</p>
                    <p className={`font-black ${item.orderDebt > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {item.orderDebt.toLocaleString()} <span className="text-[7px] opacity-50">ETB</span>
                    </p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-3 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-rose-600/60">Round Debt</p>
                    <p className={`font-black ${item.roundDebt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {item.roundDebt.toLocaleString()} <span className="text-[7px] opacity-50">ETB</span>
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total Debt</p>
                    <p className={`font-black ${item.totalDebt > 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {item.totalDebt.toLocaleString()} <span className="text-[7px] opacity-50">ETB</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-16 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            No shops found matching your criteria.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {data.length} {data.length === 1 ? 'Shop' : 'Shops'} Total
        </div>
      </div>
    </div>
  )
}
