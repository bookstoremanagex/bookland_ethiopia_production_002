"use client";

import React, { useState, useEffect } from "react";
import { 
    FileSpreadsheet, 
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
    DollarSign,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Image as ImageIcon,
    Upload,
    Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { 
    getInvoices, 
    createInvoice, 
    deleteInvoice, 
    uploadInvoiceImageAction,
    InvoiceInput 
} from "@/app/actions/invoice-actions";
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

interface DbInvoice {
    id: number;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    status: string;
    dueDate: Date | null;
    issueDate: Date | null;
    imageUrl: string | null;
    memo: string | null;
    createdAt: Date;
}

export default function InvoicesPage() {
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const [invoices, setInvoices] = useState<DbInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs state
    const [formInvoiceNumber, setFormInvoiceNumber] = useState("");
    const [formCustomerName, setFormCustomerName] = useState("");
    const [formAmount, setFormAmount] = useState("");
    const [formStatus, setFormStatus] = useState("Unpaid");
    const [formDueDate, setFormDueDate] = useState("");
    const [formIssueDate, setFormIssueDate] = useState("");
    const [formMemo, setFormMemo] = useState("");
    
    // Attachment image state
    const [imageType, setImageType] = useState<"upload" | "link">("upload");
    const [imageLinkUrl, setImageLinkUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // TanStack states
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const fetchAllInvoices = async () => {
        setLoading(true);
        const res = await getInvoices();
        if (res.success && res.data) {
            const mapped = (res.data as any[]).map(i => ({
                ...i,
                dueDate: i.dueDate ? new Date(i.dueDate) : null,
                issueDate: i.issueDate ? new Date(i.issueDate) : null,
                createdAt: new Date(i.createdAt)
            }));
            setInvoices(mapped);
        } else {
            toast.error(res.error || "Failed to load invoices");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllInvoices();
    }, []);

    const resetForm = () => {
        setFormInvoiceNumber("");
        setFormCustomerName("");
        setFormAmount("");
        setFormStatus("Unpaid");
        setFormDueDate("");
        setFormIssueDate("");
        setFormMemo("");
        setImageFile(null);
        setImagePreview(null);
        setImageLinkUrl("");
        setImageType("upload");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formInvoiceNumber || !formCustomerName || !formAmount) {
            toast.error("Please fill out all required fields: Invoice Number, Customer, and Amount.");
            return;
        }

        setSubmitting(true);
        let finalImageUrl = "";

        // Handle Image Attachment via Vercel Blob or Link URL
        if (imageType === "upload" && imageFile) {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("file", imageFile);

            const uploadRes = await uploadInvoiceImageAction(formData);
            if (!uploadRes.success) {
                toast.error(uploadRes.error || "Failed to upload invoice attachment to Vercel Blob");
                setSubmitting(false);
                setUploadingImage(false);
                return;
            }
            finalImageUrl = uploadRes.url || "";
            setUploadingImage(false);
        } else if (imageType === "link" && imageLinkUrl) {
            finalImageUrl = imageLinkUrl;
        }

        const inputData: InvoiceInput = {
            invoiceNumber: formInvoiceNumber,
            customerName: formCustomerName,
            amount: parseFloat(formAmount),
            status: formStatus,
            dueDate: formDueDate || null,
            issueDate: formIssueDate || null,
            imageUrl: finalImageUrl || null,
            memo: formMemo || null,
        };

        const res = await createInvoice(inputData);
        if (res.success) {
            toast.success("Invoice recorded successfully!");
            setIsCreateOpen(false);
            resetForm();
            fetchAllInvoices();
        } else {
            toast.error(res.error || "Failed to create invoice");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this invoice?")) return;
        const res = await deleteInvoice(id);
        if (res.success) {
            toast.success("Invoice deleted successfully!");
            fetchAllInvoices();
        } else {
            toast.error(res.error || "Failed to delete invoice");
        }
    };

    const columns: ColumnDef<DbInvoice>[] = [
        {
            accessorKey: "invoiceNumber",
            header: "Invoice ID",
            cell: ({ row }) => (
                <span className="text-xs font-black text-primarycolor">
                    {row.getValue("invoiceNumber")}
                </span>
            )
        },
        {
            accessorKey: "customerName",
            header: "Customer / Billed Party",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate">
                    <span className="font-bold text-secondarycolor text-sm">{row.getValue("customerName")}</span>
                </div>
            )
        },
        {
            accessorKey: "amount",
            header: "Total Due ($)",
            cell: ({ row }) => (
                <span className="text-sm font-black text-secondarycolor flex items-center gap-0.5">
                    <DollarSign className="size-3.5 text-primarycolor/60" />
                    {(row.getValue("amount") as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

                if (status === "Paid") {
                    statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
                    icon = <CheckCircle2 className="size-3.5" />;
                } else if (status === "Unpaid") {
                    statusClass = "bg-sky-50 text-sky-700 border-sky-200/50";
                    icon = <Clock className="size-3.5" />;
                } else if (status === "Overdue") {
                    statusClass = "bg-rose-50 text-rose-700 border-rose-200/50";
                    icon = <AlertCircle className="size-3.5" />;
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
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => {
                const val = row.getValue("dueDate") as Date | null;
                return (
                    <span className="text-xs font-semibold text-secondarycolor/70 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primarycolor/60" />
{val ? formatDate(new Date(val)) : "Ã¢â‚¬â€"}
                                </span>
                            );
                        }
                    },
                    {
                        accessorKey: "imageUrl",
            header: "Attachment",
            cell: ({ row }) => {
                const val = row.getValue("imageUrl") as string | null;
                return val ? (
                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 w-fit">
                        <ImageIcon className="size-3" /> Attached
                    </div>
                ) : (
                    <span className="text-xs font-semibold text-muted-foreground">None</span>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right uppercase tracking-widest text-[10px] font-black">Actions</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <Link 
                        href={`/admin_dashboard/document_management/invoices/${row.original.id}`}
                        className="p-2 rounded-xl hover:bg-primarycolor/10 text-primarycolor transition-all" 
                        title="View Full Invoice & Memo"
                    >
                        <Eye className="size-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(row.original.id)} 
                        className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-500 transition-all" 
                        title="Delete Invoice"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: invoices,
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
                        <FileSpreadsheet className="size-3.5 text-primarycolor" /> Billings
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Invoices Ledger
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Track payments, pending billings, amounts, due dates, and attached digital receipts.
                    </p>
                </div>

                <button 
                    onClick={() => setIsCreateOpen(true)} 
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-primarycolor text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="size-4" /> Create Invoice
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Paid Invoices Value</p>
                    <h3 className="text-3xl font-black text-emerald-600">
                        ETB {invoices.filter(i => i.status === "Paid").reduce((acc, i) => acc + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Unpaid Bills Out</p>
                    <h3 className="text-3xl font-black text-sky-600">
                        ETB {invoices.filter(i => i.status === "Unpaid").reduce((acc, i) => acc + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Overdue Billing</p>
                    <h3 className="text-3xl font-black text-rose-600">
                        ETB {invoices.filter(i => i.status === "Overdue").reduce((acc, i) => acc + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            {/* Filtering Controls */}
            <div className="bg-card rounded-3xl border-2 border-primarycolor/10 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                    <Input 
                        placeholder="Search invoices by customer, ID..." 
                        value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("customerName")?.setFilterValue(e.target.value)}
                        className="w-full h-12 pl-12 pr-6 rounded-2xl bg-background/50 border border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all text-sm font-medium"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <select
                        onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value === "ALL" ? "" : e.target.value)}
                        className="h-12 px-5 rounded-2xl border border-primarycolor/10 bg-background/50 text-sm font-bold text-secondarycolor transition-all outline-none"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>

            {/* TanStack Table Container */}
            <div className="bg-card rounded-[2rem] border-2 border-primarycolor/10 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 text-primarycolor animate-spin" />
                        <span className="font-bold text-secondarycolor">Retrieving billing ledger...</span>
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
                                                No invoices recorded in the database.
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
                                    const status = item.status || "Unpaid"
                                    let statusClass = "bg-sky-50 text-sky-700 border-sky-200/50"
                                    let icon = <Clock className="size-2.5" />
                                    if (status === "Paid") {
                                        statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                                        icon = <CheckCircle2 className="size-2.5" />
                                    } else if (status === "Overdue") {
                                        statusClass = "bg-rose-50 text-rose-700 border-rose-200/50"
                                        icon = <AlertCircle className="size-2.5" />
                                    }
                                    return (
                                        <div key={item.id} className="bg-white rounded-2xl border-2 border-primarycolor/5 p-5 space-y-4 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-primarycolor">{item.invoiceNumber}</span>
                                                        <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider", statusClass)}>
                                                            {icon}
                                                            {status}
                                                        </span>
                                                    </div>
                                                    <div className="font-black text-primarycolor text-sm leading-tight mt-1 truncate">{item.customerName}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <DollarSign className="size-4 text-primarycolor/60" />
                                                <span className="text-lg font-black text-secondarycolor">
                                                    ETB {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                                                {item.issueDate && (
                                                    <span className="font-semibold text-secondarycolor/70 flex items-center gap-1">
                                                        <Calendar className="size-3 text-primarycolor/60" /> Issued: {formatDate(new Date(item.issueDate))}
                                                    </span>
                                                )}
                                                {item.dueDate && (
                                                    <span className="font-semibold text-secondarycolor/70 flex items-center gap-1">
                                                        <Calendar className="size-3 text-primarycolor/60" /> Due: {formatDate(new Date(item.dueDate))}
                                                    </span>
                                                )}
                                                {item.imageUrl && (
                                                    <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                                        <ImageIcon className="size-2.5" /> Receipt Attached
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                                <Link href={`/admin_dashboard/document_management/invoices/${item.id}`} className="flex-1">
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
                                    No invoices recorded in the database.
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

            {/* Create Invoice Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-secondarycolor uppercase tracking-tight flex items-center gap-2">
                            <FileSpreadsheet className="size-6 text-primarycolor animate-pulse" /> Register Digital Invoice
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateInvoice} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Invoice Number *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. INV-2026-9041" 
                                    value={formInvoiceNumber}
                                    onChange={(e) => setFormInvoiceNumber(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Customer / Billed Party *</label>
                                <Input 
                                    required 
                                    placeholder="e.g. Merkato Main Bookstore, Kidus T." 
                                    value={formCustomerName}
                                    onChange={(e) => setFormCustomerName(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Billing Amount ($) *</label>
                                <Input 
                                    type="number"
                                    step="0.01"
                                    required 
                                    placeholder="0.00" 
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
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
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Issue Date</label>
                                <DateInput 
                                    value={formIssueDate}
                                    onChange={(e) => setFormIssueDate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                                <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Due Date</label>
                                <DateInput 
                                    value={formDueDate}
                                    onChange={(e) => setFormDueDate(e.target.value)}
                                    className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                />
                            </div>
                        </div>

                        {/* Image Attachment (Togglable Choice) */}
                        <div className="space-y-4 border-2 border-primarycolor/10 rounded-2xl p-6 bg-primarycolor/5">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor block">
                                Digital Receipt / Billing Attachment
                            </label>
                            
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setImageType("upload")}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer flex items-center justify-center gap-2",
                                        imageType === "upload"
                                            ? "bg-primarycolor text-white border-primarycolor"
                                            : "bg-white text-primarycolor/70 border-primarycolor/10 hover:border-primarycolor/20"
                                    )}
                                >
                                    <Upload className="size-3.5" /> Upload File (Vercel Blob)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageType("link")}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer flex items-center justify-center gap-2",
                                        imageType === "link"
                                            ? "bg-primarycolor text-white border-primarycolor"
                                            : "bg-white text-primarycolor/70 border-primarycolor/10 hover:border-primarycolor/20"
                                    )}
                                >
                                    <LinkIcon className="size-3.5" /> Provide URL Link
                                </button>
                            </div>

                            {imageType === "upload" ? (
                                <div className="space-y-4">
                                    <div className={cn(
                                        "border-2 border-dashed border-primarycolor/20 rounded-xl p-8 text-center bg-white cursor-pointer hover:border-primarycolor/40 transition-colors relative flex flex-col items-center justify-center min-h-[160px]",
                                        imageFile && "border-solid border-primarycolor/30"
                                    )}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        {imagePreview ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-24 h-36 object-cover rounded-lg shadow-md border-2 border-primarycolor/10"
                                                />
                                                <span className="text-xs font-bold text-secondarycolor/80 bg-primarycolor/5 px-3 py-1 rounded-full">
                                                    File selected: {imageFile?.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="size-8 text-primarycolor/40" />
                                                <span className="text-sm font-bold text-secondarycolor">Click or drag receipt image here to upload</span>
                                                <span className="text-[10px] text-muted-foreground font-semibold">Supports PNG, JPG, JPEG</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/50">Attachment Image URL</label>
                                    <Input 
                                        type="url"
                                        placeholder="https://example.com/receipt.jpg"
                                        value={imageLinkUrl}
                                        onChange={(e) => setImageLinkUrl(e.target.value)}
                                        className="h-11 rounded-xl border-primarycolor/10 focus:border-primarycolor"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/80">Memo Note</label>
                            <Textarea 
                                rows={3}
                                placeholder="Add invoice conditions, bank account references, or payment split details..." 
                                value={formMemo}
                                onChange={(e) => setFormMemo(e.target.value)}
                                className="rounded-xl border-primarycolor/10 focus:border-primarycolor"
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
                                disabled={submitting || uploadingImage}
                                className="rounded-xl bg-primarycolor text-white font-black uppercase tracking-wider"
                            >
                                {submitting ? "Processing..." : "Save Invoice"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
