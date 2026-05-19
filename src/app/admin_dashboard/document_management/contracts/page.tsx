"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    FileSignature, 
    Search, 
    Plus, 
    Filter, 
    ArrowUpDown, 
    Calendar,
    User,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    Eye,
    Trash2,
    DollarSign,
    ClipboardList,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { 
    getContracts, 
    createContract, 
    deleteContract, 
    ContractInput 
} from "@/app/actions/contract-actions";
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

// Define the contract type mapped from Prisma model
interface DbContract {
    id: number;
    title: string;
    party: string;
    type: string;
    status: string;
    details: string;
    value: number | null;
    memo: string | null;
    dateSigned: Date | null;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
}

export default function ContractsPage() {
    const [contracts, setContracts] = useState<DbContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<DbContract | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs state
    const [formTitle, setFormTitle] = useState("");
    const [formParty, setFormParty] = useState("");
    const [formType, setFormType] = useState("Author Agreement");
    const [formStatus, setFormStatus] = useState("Active");
    const [formDetails, setFormDetails] = useState("");
    const [formValue, setFormValue] = useState("");
    const [formMemo, setFormMemo] = useState("");
    const [formDateSigned, setFormDateSigned] = useState("");
    const [formStartDate, setFormStartDate] = useState("");
    const [formEndDate, setFormEndDate] = useState("");

    // TanStack states
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const fetchAllContracts = async () => {
        setLoading(true);
        const res = await getContracts();
        if (res.success && res.data) {
            // Map raw database outputs to proper Frontend structures
            const mapped = (res.data as any[]).map(c => ({
                ...c,
                dateSigned: c.dateSigned ? new Date(c.dateSigned) : null,
                startDate: c.startDate ? new Date(c.startDate) : null,
                endDate: c.endDate ? new Date(c.endDate) : null,
                createdAt: new Date(c.createdAt)
            }));
            setContracts(mapped);
        } else {
            toast.error(res.error || "Failed to load contracts");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllContracts();
    }, []);

    const resetForm = () => {
        setFormTitle("");
        setFormParty("");
        setFormType("Author Agreement");
        setFormStatus("Active");
        setFormDetails("");
        setFormValue("");
        setFormMemo("");
        setFormDateSigned("");
        setFormStartDate("");
        setFormEndDate("");
    };

    const handleCreateContract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle || !formParty || !formDetails) {
            toast.error("Please fill out all required fields: Title, Party, Details.");
            return;
        }

        setSubmitting(true);
        const inputData: ContractInput = {
            title: formTitle,
            party: formParty,
            type: formType,
            status: formStatus,
            details: formDetails,
            value: formValue ? parseFloat(formValue) : null,
            memo: formMemo || null,
            dateSigned: formDateSigned || null,
            startDate: formStartDate || null,
            endDate: formEndDate || null,
        };

        const res = await createContract(inputData);
        if (res.success) {
            toast.success("Contract created successfully!");
            setIsCreateOpen(false);
            resetForm();
            fetchAllContracts();
        } else {
            toast.error(res.error || "Failed to create contract");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this contract?")) return;
        const res = await deleteContract(id);
        if (res.success) {
            toast.success("Contract deleted successfully!");
            fetchAllContracts();
        } else {
            toast.error(res.error || "Failed to delete contract");
        }
    };

    // Define TanStack Table Columns
    const columns: ColumnDef<DbContract>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span className="text-xs font-black text-primarycolor/70">
                    CON-{String(row.getValue("id")).padStart(4, "0")}
                </span>
            )
        },
        {
            accessorKey: "title",
            header: "Contract Title",
            cell: ({ row }) => (
                <div className="max-w-[240px] truncate">
                    <span className="font-bold text-secondarycolor text-sm">{row.getValue("title")}</span>
                    {row.original.memo && (
                        <div className="text-[10px] text-muted-foreground truncate font-medium mt-0.5">
                            Memo: {row.original.memo}
                        </div>
                    )}
                </div>
            )
        },
        {
            accessorKey: "party",
            header: "Party / Vendor",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-primarycolor/10 flex items-center justify-center">
                        <User className="size-3 text-primarycolor" />
                    </div>
                    <span className="text-sm font-semibold text-secondarycolor/80">{row.getValue("party")}</span>
                </div>
            )
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <span className="text-xs font-bold text-secondarycolor/60">{row.getValue("type")}</span>
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                let statusClass = "bg-slate-50 text-slate-600 border-slate-200/50";
                let icon = <AlertCircle className="size-3.5" />;

                if (status === "Active") {
                    statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
                    icon = <CheckCircle2 className="size-3.5" />;
                } else if (status === "Pending") {
                    statusClass = "bg-amber-50 text-amber-700 border-amber-200/50";
                    icon = <Clock className="size-3.5 animate-pulse" />;
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
            accessorKey: "dateSigned",
            header: "Signed Date",
            cell: ({ row }) => {
                const val = row.getValue("dateSigned") as Date | null;
                return (
                    <span className="text-xs font-semibold text-secondarycolor/70 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primarycolor/60" />
                        {val ? val.toLocaleDateString() : "—"}
                    </span>
                );
            }
        },
        {
            accessorKey: "value",
            header: "Financial Value",
            cell: ({ row }) => {
                const val = row.getValue("value") as number | null;
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
                        href={`/admin_dashboard/document_management/contracts/${row.original.id}`}
                        className="p-2 rounded-xl hover:bg-primarycolor/10 text-primarycolor transition-all" 
                        title="View Detailed Document"
                    >
                        <Eye className="size-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(row.original.id)} 
                        className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-500 transition-all" 
                        title="Delete Contract"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: contracts,
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
                        <FileSignature className="size-3.5 text-primarycolor" /> Secured Ledger
                    </div>
                    <h1 className="text-4xl font-black text-secondarycolor uppercase tracking-tight mt-2">
                        Contracts & Agreements
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Securely manage publishing intellectual properties, translators, and printers.
                    </p>
                </div>

                <button 
                    onClick={() => setIsCreateOpen(true)} 
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-primarycolor text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="size-4" /> Add New Contract
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Active Contracts</p>
                    <h3 className="text-3xl font-black text-secondarycolor">
                        {contracts.filter(c => c.status === "Active").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pending Sign-off</p>
                    <h3 className="text-3xl font-black text-amber-600">
                        {contracts.filter(c => c.status === "Pending").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Portfolio Value</p>
                    <h3 className="text-3xl font-black text-emerald-600">
                        ${contracts.reduce((acc, c) => acc + (c.value || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            {/* Filtering Controls */}
            <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                    <Input 
                        placeholder="Search contracts by title, party..." 
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
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
                        <option value="Expired">Expired</option>
                    </select>
                </div>
            </div>

            {/* TanStack Table Container */}
            <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 text-primarycolor animate-spin" />
                        <span className="font-bold text-secondarycolor">Retrieving contract database...</span>
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
                                            No contracts recorded in the database ledger.
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

            {/* Create Contract Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-secondarycolor uppercase tracking-tight flex items-center gap-2">
                            <FileSignature className="size-6 text-primarycolor" /> Add New Contract
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateContract} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Contract Title *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Fikir Eske Mekabir Publishing Agreement" 
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Signee Party / Vendor *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Kidus T. (Author)" 
                                    value={formParty}
                                    onChange={(e) => setFormParty(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Contract Type *</label>
                                <select 
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl border border-primarycolor/10 bg-background text-sm font-semibold text-secondarycolor outline-none focus:border-primarycolor transition-all"
                                >
                                    <option value="Author Agreement">Author Agreement</option>
                                    <option value="Translation License">Translation License</option>
                                    <option value="Printing Service">Printing Service</option>
                                    <option value="Retail Distribution">Retail Distribution</option>
                                    <option value="Freelance Design">Freelance Design</option>
                                    <option value="Other Service">Other Service</option>
                                </select>
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
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Financial Value ($)</label>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="0.00" 
                                    value={formValue}
                                    onChange={(e) => setFormValue(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Date Signed</label>
                                <Input 
                                    type="date" 
                                    value={formDateSigned}
                                    onChange={(e) => setFormDateSigned(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Start Date</label>
                                <Input 
                                    type="date" 
                                    value={formStartDate}
                                    onChange={(e) => setFormStartDate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">End Date</label>
                                <Input 
                                    type="date" 
                                    value={formEndDate}
                                    onChange={(e) => setFormEndDate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Memo Note</label>
                            <Input 
                                placeholder="Add a memo note about this contract..." 
                                value={formMemo}
                                onChange={(e) => setFormMemo(e.target.value)}
                                className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Contract Details / Text *</label>
                            <Textarea 
                                required 
                                rows={4}
                                placeholder="Paste or type the terms, responsibilities, and conditions of this contract..." 
                                value={formDetails}
                                onChange={(e) => setFormDetails(e.target.value)}
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
                                {submitting ? "Signing Ledger..." : "Save Contract"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
