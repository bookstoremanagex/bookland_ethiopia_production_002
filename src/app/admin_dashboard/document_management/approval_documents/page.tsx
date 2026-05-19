"use client";

import React, { useState, useEffect } from "react";
import { 
    FileText, 
    Search, 
    Plus, 
    Filter, 
    ArrowUpDown, 
    Calendar,
    User,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { 
    getApprovalDocuments, 
    createApprovalDocument, 
    deleteApprovalDocument, 
    ApprovalDocumentInput 
} from "@/app/actions/approval-document-actions";
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

interface DbApprovalDocument {
    id: number;
    documentNumber: string;
    title: string;
    requestedBy: string;
    approvedBy: string | null;
    status: string;
    approvalDate: Date | null;
    details: string;
    memo: string | null;
    createdAt: Date;
}

export default function ApprovalDocumentsPage() {
    const [documents, setDocuments] = useState<DbApprovalDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs state
    const [formDocumentNumber, setFormDocumentNumber] = useState("");
    const [formTitle, setFormTitle] = useState("");
    const [formRequestedBy, setFormRequestedBy] = useState("");
    const [formApprovedBy, setFormApprovedBy] = useState("");
    const [formStatus, setFormStatus] = useState("Pending");
    const [formApprovalDate, setFormApprovalDate] = useState("");
    const [formDetails, setFormDetails] = useState("");
    const [formMemo, setFormMemo] = useState("");

    // TanStack states
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const fetchAllDocuments = async () => {
        setLoading(true);
        const res = await getApprovalDocuments();
        if (res.success && res.data) {
            const mapped = (res.data as any[]).map(d => ({
                ...d,
                approvalDate: d.approvalDate ? new Date(d.approvalDate) : null,
                createdAt: new Date(d.createdAt)
            }));
            setDocuments(mapped);
        } else {
            toast.error(res.error || "Failed to load approval documents");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllDocuments();
    }, []);

    const resetForm = () => {
        setFormDocumentNumber("");
        setFormTitle("");
        setFormRequestedBy("");
        setFormApprovedBy("");
        setFormStatus("Pending");
        setFormApprovalDate("");
        setFormDetails("");
        setFormMemo("");
    };

    const handleCreateDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formDocumentNumber || !formTitle || !formRequestedBy || !formDetails) {
            toast.error("Please fill out all required fields: Document Number, Title, Requested By, and Details.");
            return;
        }

        setSubmitting(true);
        const inputData: ApprovalDocumentInput = {
            documentNumber: formDocumentNumber,
            title: formTitle,
            requestedBy: formRequestedBy,
            approvedBy: formApprovedBy || null,
            status: formStatus,
            approvalDate: formApprovalDate || null,
            details: formDetails,
            memo: formMemo || null,
        };

        const res = await createApprovalDocument(inputData);
        if (res.success) {
            toast.success("Approval document submitted successfully!");
            setIsCreateOpen(false);
            resetForm();
            fetchAllDocuments();
        } else {
            toast.error(res.error || "Failed to submit approval document");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this approval document?")) return;
        const res = await deleteApprovalDocument(id);
        if (res.success) {
            toast.success("Approval document deleted successfully!");
            fetchAllDocuments();
        } else {
            toast.error(res.error || "Failed to delete approval document");
        }
    };

    const columns: ColumnDef<DbApprovalDocument>[] = [
        {
            accessorKey: "documentNumber",
            header: "Doc Ref",
            cell: ({ row }) => (
                <span className="text-xs font-black text-primarycolor">
                    {row.getValue("documentNumber")}
                </span>
            )
        },
        {
            accessorKey: "title",
            header: "Document Title",
            cell: ({ row }) => (
                <div className="max-w-[240px] truncate">
                    <span className="font-bold text-secondarycolor text-sm">{row.getValue("title")}</span>
                </div>
            )
        },
        {
            accessorKey: "requestedBy",
            header: "Requested By",
            cell: ({ row }) => (
                <span className="text-xs font-semibold text-secondarycolor/80">{row.getValue("requestedBy")}</span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                let statusClass = "bg-slate-50 text-slate-600 border-slate-200/50";
                let icon = <Clock className="size-3.5" />;

                if (status === "Approved") {
                    statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
                    icon = <CheckCircle2 className="size-3.5" />;
                } else if (status === "Rejected") {
                    statusClass = "bg-rose-50 text-rose-700 border-rose-200/50";
                    icon = <XCircle className="size-3.5" />;
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
            accessorKey: "approvalDate",
            header: "Approval Date",
            cell: ({ row }) => {
                const val = row.getValue("approvalDate") as Date | null;
                return (
                    <span className="text-xs font-semibold text-secondarycolor/70 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primarycolor/60" />
                        {val ? val.toLocaleDateString() : "—"}
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
                        href={`/admin_dashboard/document_management/approval_documents/${row.original.id}`}
                        className="p-2 rounded-xl hover:bg-primarycolor/10 text-primarycolor transition-all" 
                        title="View Detailed Clauses & Memo"
                    >
                        <Eye className="size-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(row.original.id)} 
                        className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-500 transition-all" 
                        title="Delete Document"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: documents,
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
                        <FileText className="size-3.5 text-primarycolor" /> Approvals
                    </div>
                    <h1 className="text-4xl font-black text-secondarycolor uppercase tracking-tight mt-2">
                        Approval Documents
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Track system requests, purchase requisitions, operational approvals, and authorization memo details.
                    </p>
                </div>

                <button 
                    onClick={() => setIsCreateOpen(true)} 
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-primarycolor text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="size-4" /> Add Approval Document
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Approved Requests</p>
                    <h3 className="text-3xl font-black text-emerald-600">
                        {documents.filter(d => d.status === "Approved").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pending Clearances</p>
                    <h3 className="text-3xl font-black text-amber-600">
                        {documents.filter(d => d.status === "Pending").length}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Rejected / Declined</p>
                    <h3 className="text-3xl font-black text-rose-600">
                        {documents.filter(d => d.status === "Rejected").length}
                    </h3>
                </div>
            </div>

            {/* Filtering Controls */}
            <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                    <Input 
                        placeholder="Search approvals by title, requester..." 
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
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* TanStack Table Container */}
            <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 text-primarycolor animate-spin" />
                        <span className="font-bold text-secondarycolor">Retrieving clearances ledger...</span>
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
                                            No approval documents recorded in the database.
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

            {/* Create Approval Document Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-secondarycolor uppercase tracking-tight flex items-center gap-2">
                            <FileText className="size-6 text-primarycolor animate-pulse" /> Register Approval Document
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateDocument} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Document Ref *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. APR-2026-0045" 
                                    value={formDocumentNumber}
                                    onChange={(e) => setFormDocumentNumber(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Document Title *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Purchase of Berhanena Selam Binding Offset paper" 
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Requested By *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. kidus (Operations)" 
                                    value={formRequestedBy}
                                    onChange={(e) => setFormRequestedBy(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Approved By (Authorizer)</label>
                                <Input 
                                    placeholder="e.g. Management Board" 
                                    value={formApprovedBy}
                                    onChange={(e) => setFormApprovedBy(e.target.value)}
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
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Approval Date</label>
                                <Input 
                                    type="date" 
                                    value={formApprovalDate}
                                    onChange={(e) => setFormApprovalDate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Memo Note</label>
                            <Input 
                                placeholder="Add optional clearing remarks or authorizer conditions..." 
                                value={formMemo}
                                onChange={(e) => setFormMemo(e.target.value)}
                                className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Approval Purpose / Details *</label>
                            <Textarea 
                                required 
                                rows={4}
                                placeholder="Specify exact operational purpose, cost split estimation, requisition terms, or clearance requirements..." 
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
                                {submitting ? "Signing clearance..." : "Save Approval Document"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
