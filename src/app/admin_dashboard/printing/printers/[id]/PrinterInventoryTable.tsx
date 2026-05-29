"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  BookOpen,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  deletePrinterInventory,
  updatePrinterInventory,
} from "@/app/actions/printer-inventory-actions"
import { getEditionById, updateEdition } from "@/app/actions/edition-actions"

interface InventoryItem {
  id: number
  quantity: number
  editionId: number
  bookedition: {
    id: number
    edition_name: string
    count_remening_for_transfer: number
    books: {
      title: string
    }
  }
}

export function PrinterInventoryTable({ data }: { data: InventoryItem[] }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null)
  const [editQuantity, setEditQuantity] = React.useState<number>(0)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item)
    setEditQuantity(item.quantity)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  const onConfirmDelete = async () => {
    if (!selectedItem) return
    setIsProcessing(true)
    try {
      const editionRes = await getEditionById(selectedItem.bookedition.id)
      if (!editionRes.success) throw new Error("Could not fetch edition data")

      const currentEdition = editionRes.data
      const newRemaining = currentEdition.count_remening_for_transfer + selectedItem.quantity

      await updateEdition(selectedItem.bookedition.id, {
        ...currentEdition,
        count_remening_for_transfer: newRemaining,
      })

      const res = await deletePrinterInventory(selectedItem.id, selectedItem.bookedition.id)
      if (res.success) {
        toast.success("Item removed from printer and quantity returned to stock")
        router.refresh()
        setIsDeleteModalOpen(false)
      } else {
        toast.error(res.error || "Failed to delete")
      }
    } catch (error) {
      toast.error("An error occurred during deletion")
    } finally {
      setIsProcessing(false)
    }
  }

  const onConfirmEdit = async () => {
    if (!selectedItem) return

    const difference = editQuantity - selectedItem.quantity

    setIsProcessing(true)
    try {
      const editionRes = await getEditionById(selectedItem.bookedition.id)
      if (!editionRes.success) throw new Error("Could not fetch edition data")

      const currentEdition = editionRes.data
      const available = currentEdition.count_remening_for_transfer

      if (difference > available) {
        toast.error(`Not enough stock. Only ${available} units remaining for transfer.`)
        setIsProcessing(false)
        return
      }

      await updateEdition(selectedItem.bookedition.id, {
        ...currentEdition,
        count_remening_for_transfer: available - difference,
      })

      const res = await updatePrinterInventory(selectedItem.id, editQuantity, selectedItem.bookedition.id)
      if (res.success) {
        toast.success("Inventory updated successfully")
        router.refresh()
        setIsEditModalOpen(false)
      } else {
        toast.error(res.error || "Failed to update")
      }
    } catch (error) {
      toast.error("An error occurred during update")
    } finally {
      setIsProcessing(false)
    }
  }

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "bookedition.books.title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-black"
        >
          Book Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="font-black text-primarycolor leading-tight">
              {row.original.bookedition.books.title}
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {row.original.bookedition.edition_name}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Current Stock",
      cell: ({ row }) => {
        const quantity = row.original.quantity
        return (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                quantity > 10
                  ? "bg-emerald-100 text-emerald-700"
                  : quantity > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700",
              )}
            >
              <Package className="size-3" />
              {quantity.toLocaleString()} Units
            </div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(row.original)}
            className="h-8 w-8 p-0 text-primarycolor hover:bg-primarycolor/10 rounded-lg"
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.original)}
            className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50 rounded-lg"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-6">
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
        <Input
          placeholder="Search by book title..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-12 pl-12 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl overflow-hidden transition-all hover:border-primarycolor/10">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-2 border-slate-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-16 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor/40">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="h-20 border-b border-slate-50 hover:bg-primarycolor/[0.02] transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-8">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Package className="size-12" />
                      <p className="text-sm font-black uppercase tracking-widest">No inventory records</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-8 py-6 flex items-center justify-between border-t border-slate-50">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Showing {table.getRowModel().rows.length} records
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-10 px-4 rounded-xl border-2 border-slate-100 font-black text-[10px] uppercase"
            >
              <ChevronLeft className="size-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-10 px-4 rounded-xl border-2 border-slate-100 font-black text-[10px] uppercase"
            >
              Next <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const item = row.original
            const quantity = item.quantity
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-slate-100 p-5 space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                      <BookOpen className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-primarycolor text-sm leading-tight truncate">
                        {item.bookedition.books.title}
                      </div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                        {item.bookedition.edition_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(item)}
                      className="h-8 w-8 p-0 text-primarycolor hover:bg-primarycolor/10 rounded-lg"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                      className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                      quantity > 10
                        ? "bg-emerald-100 text-emerald-700"
                        : quantity > 0
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700",
                    )}
                  >
                    <Package className="size-3" />
                    {quantity.toLocaleString()} Units
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-16 text-center space-y-4 opacity-30">
            <Package className="size-12 mx-auto" />
            <p className="text-sm font-black uppercase tracking-widest">No inventory records</p>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="rounded-[2rem] max-w-md p-8">
          <DialogHeader className="space-y-4">
            <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor mb-2">
              <Edit2 className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-primarycolor uppercase italic">
                Adjust <span className="text-secondarycolor not-italic">Stock</span>
              </DialogTitle>
              <DialogDescription className="font-bold text-xs uppercase tracking-widest mt-1">
                Updating inventory for: {selectedItem?.bookedition.books.title}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Current Quantity at Printer
              </label>
              <Input
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                className="h-14 px-6 rounded-2xl border-2 font-bold text-lg"
              />
              <p className="text-[9px] font-bold text-primarycolor uppercase tracking-widest ml-1">
                Stock Remaining for transfer: {selectedItem?.bookedition.count_remening_for_transfer} Units
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="h-12 rounded-xl font-black uppercase tracking-widest text-[10px] flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirmEdit}
              disabled={isProcessing}
              className="h-12 rounded-xl bg-primarycolor font-black uppercase tracking-widest text-[10px] flex-1 shadow-lg shadow-primarycolor/20"
            >
              {isProcessing ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-[2rem] max-w-md p-8">
          <DialogHeader className="space-y-4">
            <div className="size-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-rose-600 uppercase italic">
                Remove <span className="text-rose-400 not-italic">Stock</span>
              </DialogTitle>
              <DialogDescription className="font-bold text-xs uppercase tracking-widest mt-1">
                This will remove {selectedItem?.quantity} units from this printer.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-100/50">
            <p className="text-xs font-bold text-rose-700 leading-relaxed italic">
              Are you sure? This will return all units back to the central stock inventory.
            </p>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-12 rounded-xl font-black uppercase tracking-widest text-[10px] flex-1"
            >
              No, Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isProcessing}
              className="h-12 rounded-xl font-black uppercase tracking-widest text-[10px] flex-1 shadow-lg shadow-rose-500/20"
            >
              {isProcessing ? "Removing..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
