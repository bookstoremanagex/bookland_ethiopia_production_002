"use client";

import React, { useState, useEffect } from "react";
import { 
    Truck, 
    Search, 
    Plus, 
    Filter, 
    ArrowUpDown, 
    Calendar,
    User,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { 
    getDeliveryNotes, 
    createDeliveryNote, 
    deleteDeliveryNote, 
    DeliveryNoteInput 
} from "@/app/actions/delivery-note-actions";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";

interface DbDeliveryNote {
    id: number;
    deliveryNumber: string;
    receiverName: string;
    driverName: string;
    vehiclePlate: string | null;
    status: string;
    deliveryDate: Date | null;
    items: string;
    memo: string | null;
    createdAt: Date;
}

export default function DeliveryNotesPage() {
    const { formatDate } = useCalendar();
    const [notes, setNotes] = useState<DbDeliveryNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs state
    const [formDeliveryNumber, setFormDeliveryNumber] = useState("");
    const [formReceiverName, setFormReceiverName] = useState("");
    const [formDriverName, setFormDriverName] = useState("");
    const [formVehiclePlate, setFormVehiclePlate] = useState("");
    const [formStatus, setFormStatus] = useState("Pending");
    const [formDeliveryDate, setFormDeliveryDate] = useState("");
    const [formItems, setFormItems] = useState("");
    const [formMemo, setFormMemo] = useState("");

    // TanStack states
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const fetchAllNotes = async () => {
        setLoading(true);
        const res = await getDeliveryNotes();
        if (res.success && res.data) {
            const mapped = (res.data as any[]).map(n => ({
                ...n,
                deliveryDate: n.deliveryDate ? new Date(n.deliveryDate) : null,
                createdAt: new Date(n.createdAt)
            }));
            setNotes(mapped);
        } else {
            toast.error(res.error || "Failed to load delivery notes");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllNotes();
    }, []);

    const resetForm = () => {
        setFormDeliveryNumber("");
        setFormReceiverName("");
        setFormDriverName("");
        setFormVehiclePlate("");
        setFormStatus("Pending");
        setFormDeliveryDate("");
        setFormItems("");
        setFormMemo("");
    };

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formDeliveryNumber || !formReceiverName || !formDriverName || !formItems) {
            toast.error("Please fill out all required fields: Delivery Number, Receiver, Driver, and Delivered Items.");
            return;
        }

        setSubmitting(true);
        const inputData: DeliveryNoteInput = {
            deliveryNumber: formDeliveryNumber,
            receiverName: formReceiverName,
            driverName: formDriverName,
            vehiclePlate: formVehiclePlate || null,
            status: formStatus,
            deliveryDate: formDeliveryDate || null,
            items: formItems,
            memo: formMemo || null,
        };

        const res = await createDeliveryNote(inputData);
        if (res.success) {
            toast.success("Delivery dispatch note saved successfully!");
            setIsCreateOpen(false);
            resetForm();
            fetchAllNotes();
        } else {
            toast.error(res.error || "Failed to save delivery note");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this delivery note?")) return;
        const res = await deleteDeliveryNote(id);
        if (res.success) {
            toast.success("Delivery note deleted successfully!");
            fetchAllNotes();
        } else {
            toast.error(res.error || "Failed to delete delivery note");
        }
    };

    const columns: ColumnDef<DbDeliveryNote>[] = [
        {
            accessorKey: "deliveryNumber",
            header: "Note Ref",
            cell: ({ row }) => (
                <span className="text-xs font-black text-primarycolor">
                    {row.getValue("deliveryNumber")}
                </span>
            )
        },
        {
            accessorKey: "receiverName",
            header: "Receiver / Entity",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate">
                    <span className="font-bold text-secondarycolor text-sm">{row.getValue("receiverName")}</span>
                </div>
            )
        },
        {
            accessorKey: "driverName",
            header: "Driver / Transit Courier",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-primarycolor/10 flex items-center justify-center">
                        <User className="size-3 text-primarycolor" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-secondarycolor">{row.getValue("driverName")}</p>
                        {row.original.vehiclePlate && (
                            <p className="text-[10px] text-muted-foreground font-black uppercase">{row.original.vehiclePlate}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                let statusClass = "bg-slate-50 text-slate-600 border-slate-200/50";
                let icon = <AlertCircle className="size-3.5" />;

                if (status === "Delivered") {
                    statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
                    icon = <CheckCircle2 className="size-3.5" />;
                } else if (status === "In Transit") {
                    statusClass = "bg-sky-50 text-sky-700 border-sky-200/50";
                    icon = <Truck className="size-3.5 animate-bounce" />;
                } else if (status === "Pending") {
                    statusClass = "bg-amber-50 text-amber-700 border-amber-200/50";
                    icon = <Clock className="size-3.5" />;
                }

                return (
                    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider", statusClass)}>
                        {icon}
                        {status}
                    </div>
                );
            }
        },
        {
            accessorKey: "deliveryDate",
            header: "Dispatch Date",
            cell: ({ row }) => {
                const val = row.getValue("deliveryDate") as Date | null;
                return (
                    <span className="text-xs font-semibold text-secondarycolor/70 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primarycolor/60" />
                        {val ? formatDate(new Date(val)) : "Ã¢â‚¬â€"}
                    </span>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right uppercase tracking-widest text-[10px] font-black">Actions</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <Link 
                        href={`/admin_dashboard/document_management/delivery_notes/${row.original.id}`}
                        className="p-2 rounded-xl hover:bg-primarycolor/10 text-primarycolor transition-all" 
                        title="View Detailed Items & Memo"
                    >
                        <Eye className="size-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(row.original.id)} 
                        className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-500 transition-all" 
                        title="Delete Note"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: notes,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-top-3 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primarycolor/60 bg-primarycolor/5 border border-primarycolor/10 px-3 py-1 rounded-full w-fit">
                        <Truck className="size-3.5 text-primarycolor" /> Dispatch Ledger
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Delivery Notes
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Manage shipping manifest records, drivers, plate numbers, and delivery confirmation terms.
                    </p>
                </div>

                <button 
                    onClick={() => setIsCreateOpen(true)} 
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-primarycolor text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="size-4" /> Add Delivery Note
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">In Transit Shipment</p>
                    <h3 className="text-3xl font-black text-sky-600">
                        {notes.filter(n => n.status === "In Transit").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pending Dispatch</p>
                    <h3 className="text-3xl font-black text-amber-600">
                        {notes.filter(n => n.status === "Pending").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Delivered Success</p>
                    <h3 className="text-3xl font-black text-emerald-600">
                        {notes.filter(n => n.status === "Delivered").length}
                    </h3>
                </div>
            </div>

            {/* Filtering Controls */}
            <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                    <Input 
                        placeholder="Search notes by receiver, delivery ref..." 
                        value={(table.getColumn("receiverName")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("receiverName")?.setFilterValue(e.target.value)}
                        className="w-full h-12 pl-12 pr-6 rounded-2xl bg-background/50 border border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all text-sm font-medium"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <select
                        onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value === "ALL" ? "" : e.target.value)}
                        className="h-12 px-5 rounded-2xl border border-primarycolor/10 bg-background/50 text-sm font-bold text-secondarycolor transition-all outline-none"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {/* TanStack Table Container */}
            <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 text-primarycolor animate-spin" />
                        <span className="font-bold text-secondarycolor">Retrieving delivery manifest...</span>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id} className="border-b border-primarycolor/10 bg-primarycolor/5">
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} className="p-5 text-[10px] font-black uppercase tracking-widest text-secondarycolor/60">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="divide-y divide-primarycolor/5">
                                    {table.getRowModel().rows.length > 0 ? (
                                        table.getRowModel().rows.map(row => (
                                            <tr key={row.id} className="hover:bg-primarycolor/5 transition-colors">
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id} className="p-5">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={columns.length} className="p-16 text-center text-muted-foreground font-black">
                                                No delivery manifest recorded in the database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => {
                                    const item = row.original
                                    const status = item.status || "Pending"
                                    let statusClass = "bg-slate-50 text-slate-600 border-slate-200/50"
                                    let icon = <AlertCircle className="size-2.5" />
                                    if (status === "Delivered") {
                                        statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                                        icon = <CheckCircle2 className="size-2.5" />
                                    } else if (status === "In Transit") {
                                        statusClass = "bg-sky-50 text-sky-700 border-sky-200/50"
                                        icon = <Truck className="size-2.5 animate-bounce" />
                                    } else if (status === "Pending") {
                                        statusClass = "bg-amber-50 text-amber-700 border-amber-200/50"
                                        icon = <Clock className="size-2.5" />
                                    }
                                    return (
                                        <div key={item.id} className="bg-white rounded-2xl border-2 border-primarycolor/5 p-5 space-y-4 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-primarycolor">{item.deliveryNumber}</span>
                                                        <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider", statusClass)}>
                                                            {icon}
                                                            {status}
                                                        </span>
                                                    </div>
                                                    <div className="font-black text-primarycolor text-sm leading-tight mt-1 truncate">{item.receiverName}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-primarycolor/10 flex items-center justify-center shrink-0">
                                                    <User className="size-3 text-primarycolor" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-secondarycolor truncate">{item.driverName}</p>
                                                    {item.vehiclePlate && (
                                                        <p className="text-[9px] text-muted-foreground font-black uppercase">{item.vehiclePlate}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                                                {item.deliveryDate && (
                                                    <span className="font-semibold text-secondarycolor/70 flex items-center gap-1">
                                                        <Calendar className="size-3 text-primarycolor/60" /> {formatDate(new Date(item.deliveryDate))}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                                <Link href={`/admin_dashboard/document_management/delivery_notes/${item.id}`} className="flex-1">
                                                    <Button variant="outline" className="w-full h-9 rounded-xl border-primarycolor/20 font-black uppercase tracking-widest text-[10px]">
                                                        <Eye className="size-3.5 mr-1" /> View
                                                    </Button>
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="h-9 px-4 rounded-xl border border-rose-200 text-rose-500 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 transition-all">
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="p-16 text-center text-muted-foreground font-black">
                                    No delivery manifest recorded in the database.
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Pagination Controls */}
                {!loading && table.getRowModel().rows.length > 0 && (
                    <div className="p-5 border-t border-primarycolor/10 flex items-center justify-between bg-primarycolor/5">
                        <span className="text-xs font-bold text-secondarycolor/70">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => table.previousPage()} 
                                disabled={!table.getCanPreviousPage()}
                                className="rounded-xl border-primarycolor/10 text-secondarycolor font-black"
                            >
                                <ChevronLeft className="size-4" /> Previous
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => table.nextPage()} 
                                disabled={!table.getCanNextPage()}
                                className="rounded-xl border-primarycolor/10 text-secondarycolor font-black"
                            >
                                Next <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Delivery Note Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-secondarycolor uppercase tracking-tight flex items-center gap-2">
                            <Truck className="size-6 text-primarycolor animate-bounce" /> Record Delivery Note
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateNote} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Delivery Note Ref *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. DN-2026-0089" 
                                    value={formDeliveryNumber}
                                    onChange={(e) => setFormDeliveryNumber(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Receiver / Destination Entity *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Merkato Bookstore Branch, Kidus T. (Partner)" 
                                    value={formReceiverName}
                                    onChange={(e) => setFormReceiverName(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Driver Name *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Abebe Kebede" 
                                    value={formDriverName}
                                    onChange={(e) => setFormDriverName(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Vehicle Plate Number</label>
                                <Input 
                                    placeholder="e.g. AA-3-B45920" 
                                    value={formVehiclePlate}
                                    onChange={(e) => setFormVehiclePlate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Status *</label>
                                <select 
                                    value={formStatus}
                                    onChange={(e) => setFormStatus(e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl border border-primarycolor/10 bg-background text-sm font-semibold text-secondarycolor outline-none focus:border-primarycolor transition-all"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Dispatch Date</label>
                                <DateInput 
                                    value={formDeliveryDate}
                                    onChange={(e) => setFormDeliveryDate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Memo Note</label>
                            <Input 
                                placeholder="Add custom tracking instructions or dispatch comments..." 
                                value={formMemo}
                                onChange={(e) => setFormMemo(e.target.value)}
                                className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Delivered Items Detail *</label>
                            <Textarea 
                                required 
                                rows={4}
                                placeholder="e.g. 500 copies of Fikir Eske Mekabir (10th Edition), 200 copies of Oromiffa Dictionary..." 
                                value={formItems}
                                onChange={(e) => setFormItems(e.target.value)}
                                className="rounded-xl border-primarycolor/10 focus:border-primarycolor min-h-[100px]"
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsCreateOpen(false)}
                                className="rounded-xl border-primarycolor/10 text-secondarycolor font-black"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="rounded-xl bg-primarycolor text-white font-black uppercase tracking-wider"
                            >
                                {submitting ? "Signing Note..." : "Save Delivery Note"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
