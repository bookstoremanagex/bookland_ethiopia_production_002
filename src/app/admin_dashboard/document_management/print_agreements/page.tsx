"use client";

import React, { useState, useEffect } from "react";
import { 
    FileText, 
    Search, 
    Plus, 
    Filter, 
    ArrowUpDown, 
    Calendar,
    Printer as PrinterIcon,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    Eye,
    Trash2,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { 
    getPrintAgreements, 
    createPrintAgreement, 
    deletePrintAgreement, 
    PrintAgreementInput 
} from "@/app/actions/print-agreement-actions";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface DbPrintAgreement {
    id: number;
    bookTitle: string;
    printerName: string;
    quantity: number;
    status: string;
    commencementDate: Date | null;
    cost: number | null;
    terms: string | null;
    memo: string | null;
    createdAt: Date;
}

export default function PrintAgreementsPage() {
    const [agreements, setAgreements] = useState<DbPrintAgreement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs state
    const [formBookTitle, setFormBookTitle] = useState("");
    const [formPrinterName, setFormPrinterName] = useState("");
    const [formQuantity, setFormQuantity] = useState("");
    const [formStatus, setFormStatus] = useState("Active");
    const [formCommencementDate, setFormCommencementDate] = useState("");
    const [formCost, setFormCost] = useState("");
    const [formTerms, setFormTerms] = useState("");
    const [formMemo, setFormMemo] = useState("");

    // TanStack states
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const fetchAllAgreements = async () => {
        setLoading(true);
        const res = await getPrintAgreements();
        if (res.success && res.data) {
            const mapped = (res.data as any[]).map(a => ({
                ...a,
                commencementDate: a.commencementDate ? new Date(a.commencementDate) : null,
                createdAt: new Date(a.createdAt)
            }));
            setAgreements(mapped);
        } else {
            toast.error(res.error || "Failed to load print agreements");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllAgreements();
    }, []);

    const resetForm = () => {
        setFormBookTitle("");
        setFormPrinterName("");
        setFormQuantity("");
        setFormStatus("Active");
        setFormCommencementDate("");
        setFormCost("");
        setFormTerms("");
        setFormMemo("");
    };

    const handleCreateAgreement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formBookTitle || !formPrinterName || !formQuantity) {
            toast.error("Please fill out all required fields: Book Title, Printer Name, and Quantity.");
            return;
        }

        setSubmitting(true);
        const inputData: PrintAgreementInput = {
            bookTitle: formBookTitle,
            printerName: formPrinterName,
            quantity: parseInt(formQuantity),
            status: formStatus,
            commencementDate: formCommencementDate || null,
            cost: formCost ? parseFloat(formCost) : null,
            terms: formTerms || null,
            memo: formMemo || null,
        };

        const res = await createPrintAgreement(inputData);
        if (res.success) {
            toast.success("Print agreement recorded successfully!");
            setIsCreateOpen(false);
            resetForm();
            fetchAllAgreements();
        } else {
            toast.error(res.error || "Failed to create print agreement");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this print agreement?")) return;
        const res = await deletePrintAgreement(id);
        if (res.success) {
            toast.success("Print agreement deleted successfully!");
            fetchAllAgreements();
        } else {
            toast.error(res.error || "Failed to delete print agreement");
        }
    };

    const columns: ColumnDef<DbPrintAgreement>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span className="text-xs font-black text-primarycolor/70">
                    PAG-{String(row.getValue("id")).padStart(4, "0")}
                </span>
            )
        },
        {
            accessorKey: "bookTitle",
            header: "Book Title",
            cell: ({ row }) => (
                <div className="max-w-[240px] truncate">
                    <span className="font-bold text-secondarycolor text-sm">{row.getValue("bookTitle")}</span>
                    {row.original.memo && (
                        <div className="text-[10px] text-muted-foreground truncate font-medium mt-0.5">
                            Memo: {row.original.memo}
                        </div>
                    )}
                </div>
            )
        },
        {
            accessorKey: "printerName",
            header: "Printer / Press Shop",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-primarycolor/10 flex items-center justify-center">
                        <PrinterIcon className="size-3 text-primarycolor" />
                    </div>
                    <span className="text-sm font-semibold text-secondarycolor/80">{row.getValue("printerName")}</span>
                </div>
            )
        },
        {
            accessorKey: "quantity",
            header: "Target Volume",
            cell: ({ row }) => (
                <span className="text-xs font-black text-secondarycolor/80">
                    {(row.getValue("quantity") as number).toLocaleString()} units
                </span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                let statusClass = "bg-slate-50 text-slate-600 border-slate-200/50";
                let icon = <AlertCircle className="size-3.5" />;

                if (status === "Completed") {
                    statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
                    icon = <CheckCircle2 className="size-3.5" />;
                } else if (status === "Active") {
                    statusClass = "bg-sky-50 text-sky-700 border-sky-200/50";
                    icon = <PrinterIcon className="size-3.5 animate-pulse" />;
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
            accessorKey: "commencementDate",
            header: "Commencement",
            cell: ({ row }) => {
                const val = row.getValue("commencementDate") as Date | null;
                return (
                    <span className="text-xs font-semibold text-secondarycolor/70 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primarycolor/60" />
                        {val ? val.toLocaleDateString() : "—"}
                    </span>
                );
            }
        },
        {
            accessorKey: "cost",
            header: "Quoted Cost",
            cell: ({ row }) => {
                const val = row.getValue("cost") as number | null;
                return (
                    <span className="text-sm font-black text-secondarycolor">
                        {val ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
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
                        href={`/admin_dashboard/document_management/print_agreements/${row.original.id}`}
                        className="p-2 rounded-xl hover:bg-primarycolor/10 text-primarycolor transition-all" 
                        title="View Terms & Memo"
                    >
                        <Eye className="size-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(row.original.id)} 
                        className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-500 transition-all" 
                        title="Delete Agreement"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: agreements,
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
                        <FileText className="size-3.5 text-primarycolor" /> Printing Contracts
                    </div>
                    <h1 className="text-4xl font-black text-secondarycolor uppercase tracking-tight mt-2">
                        Print Agreements
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Track, monitor, and compile volume printing contracts with strategic print shops.
                    </p>
                </div>

                <button 
                    onClick={() => setIsCreateOpen(true)} 
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-primarycolor text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="size-4" /> Add Print Agreement
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Active Printers</p>
                    <h3 className="text-3xl font-black text-secondarycolor">
                        {agreements.filter(a => a.status === "Active").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pending Contracts</p>
                    <h3 className="text-3xl font-black text-amber-600">
                        {agreements.filter(a => a.status === "Pending").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Active Printing Cost</p>
                    <h3 className="text-3xl font-black text-emerald-600">
                        ${agreements.reduce((acc, a) => acc + (a.cost || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            {/* Filtering Controls */}
            <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                    <Input 
                        placeholder="Search agreements by book, printer..." 
                        value={(table.getColumn("bookTitle")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("bookTitle")?.setFilterValue(e.target.value)}
                        className="w-full h-12 pl-12 pr-6 rounded-2xl bg-background/50 border border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all text-sm font-medium"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <select
                        onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value === "ALL" ? "" : e.target.value)}
                        className="h-12 px-5 rounded-2xl border border-primarycolor/10 bg-background/50 text-sm font-bold text-secondarycolor transition-all outline-none"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* TanStack Table Container */}
            <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 text-primarycolor animate-spin" />
                        <span className="font-bold text-secondarycolor">Retrieving print agreements ledger...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
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
                                            No print agreements recorded in the database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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

            {/* Create Print Agreement Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-secondarycolor uppercase tracking-tight flex items-center gap-2">
                            <PrinterIcon className="size-6 text-primarycolor animate-pulse" /> Add Print Agreement
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAgreement} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Book Title *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Fikir Eske Mekabir (10th Print Batch)" 
                                    value={formBookTitle}
                                    onChange={(e) => setFormBookTitle(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Printer / Press Shop *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Berhanena Selam Enterprise" 
                                    value={formPrinterName}
                                    onChange={(e) => setFormPrinterName(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Target Quantity *</label>
                                <Input 
                                    type="number"
                                    required 
                                    placeholder="e.g. 5000" 
                                    value={formQuantity}
                                    onChange={(e) => setFormQuantity(e.target.value)}
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
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Quoted Cost ($)</label>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="0.00" 
                                    value={formCost}
                                    onChange={(e) => setFormCost(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Commencement Date</label>
                                <Input 
                                    type="date" 
                                    value={formCommencementDate}
                                    onChange={(e) => setFormCommencementDate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Memo Note</label>
                            <Input 
                                placeholder="Add a memo note about this print batch..." 
                                value={formMemo}
                                onChange={(e) => setFormMemo(e.target.value)}
                                className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Print Agreement Terms *</label>
                            <Textarea 
                                required 
                                rows={4}
                                placeholder="Specify paper density, ink layout, binding requirements, and print delivery clauses..." 
                                value={formTerms}
                                onChange={(e) => setFormTerms(e.target.value)}
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
                                {submitting ? "Saving Agreement..." : "Save Print Agreement"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
