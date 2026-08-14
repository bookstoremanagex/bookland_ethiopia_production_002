"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ChevronLeft, 
    ClipboardList, 
    Trash2, 
    ShieldAlert, 
    AlertTriangle,
    Layers,
    Printer,
    Calendar,
    Settings,
    Activity,
    Clock,
    Check,
    ChevronsUpDown,
    CheckCircle2,
    RotateCcw,
    XCircle,
    Info,
    BookOpen,
    Calculator,
    DollarSign,
    Wallet,
    Receipt,
    Plus,
    X,
    Eye,
    EyeOff,
    Printer as PrinterIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateInput } from '@/components/ui/date-input'
import { Textarea } from '@/components/ui/textarea'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import { useCalendar } from "@/lib/calendar-context"
import { updatePrintOrder, deletePrintOrder, addPrintOrderPayment, updatePrintOrderPayment, deletePrintOrderPayment } from '@/app/actions/print-order-actions'
import { toggleEditionVisibilityToPrinter, toggleProjectEditionsVisibilityToPrinter } from '@/app/actions/edition-actions'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'

interface PrintOrderItem {
    id: number;
    bookId: number;
    bookEditionId: number;
    quantity: string;
    total_price: string;
    price_per_book: string;
    content: string;
    status: string;
}

interface PrintOrderDetailClientProps {
    order: any
    printers: any[]
    editions: any[]
    books: any[]
}

const statusOptions = [
    { value: "NOT_STARTED", label: "Not Started", icon: Clock },
    { value: "STARTED", label: "Started", icon: Activity },
    { value: "ONPROGRESS", label: "In Progress", icon: RotateCcw },
    { value: "FAILED", label: "Failed", icon: XCircle },
    { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
    { value: "REPRINT", label: "Reprinting", icon: RotateCcw }
]

export default function PrintOrderDetailClient({ order, printers, editions, books }: PrintOrderDetailClientProps) {
    const router = useRouter()
    const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")

    const [bookOpen, setBookOpen] = useState(false)
    const [editionOpen, setEditionOpen] = useState(false)
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null)
    const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null)

    // Payments state
    const [isAddingPayment, setIsAddingPayment] = useState(false)
    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        payment_date: format(new Date(), "yyyy-MM-dd"),
        reference: ""
    })
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
    const [editingPaymentRef, setEditingPaymentRef] = useState<number | null>(null)
    const [editRefValue, setEditRefValue] = useState("")
    const [isSavingRef, setIsSavingRef] = useState(false)
    const [isEditingBooks, setIsEditingBooks] = useState(false)
    const [contentDialogItem, setContentDialogItem] = useState<PrintOrderItem | null>(null)
    const [contentDialogValue, setContentDialogValue] = useState("")
    const [isSavingContent, setIsSavingContent] = useState(false)
    const [editionsList, setEditionsList] = useState<any[]>(editions)
    const [visibilityDialogEdition, setVisibilityDialogEdition] = useState<any | null>(null)
    const [isTogglingVisibility, setIsTogglingVisibility] = useState(false)
    const [isTogglingProjectVisibility, setIsTogglingProjectVisibility] = useState(false)

    // Parse initial items
    const initialItems: PrintOrderItem[] = (order.printorder_items || []).map((item: any) => ({
        id: item.id,
        bookId: item.bookedition?.bookId || books.find((b: any) => editions.find((e: any) => e.id === item.bookEditionId)?.bookId === b.id)?.id,
        bookEditionId: item.bookEditionId,
        quantity: item.quantity.toString(),
        total_price: item.total_price?.toString() || "",
        price_per_book: (item.price_per_book ?? "").toString(),
        content: item.content || "",
        status: item.status
    }));

    const [formData, setFormData] = useState({
        project_name: order.project_name || "",
        printerId: order.printerId?.toString() || "",
        memo: order.memo || "",
        status: order.status,
        startDate: order.startDate ? format(new Date(order.startDate), "yyyy-MM-dd") : "",
        endDate: order.endDate ? format(new Date(order.endDate), "yyyy-MM-dd") : "",
        total_price: order.total_price?.toString() || "",
        auto_calculate: false,
        items: initialItems
    })

    const selectedBook = books.find(b => b.id === selectedBookId)
    const filteredEditions = selectedBookId 
        ? editionsList.filter(ed => ed.bookId === selectedBookId)
        : editionsList

    // Auto calculate total price
    useEffect(() => {
        if (formData.auto_calculate) {
            const total = formData.items.reduce((sum, item) => {
                const itemTotal = parseFloat(item.total_price);
                if (itemTotal > 0) return sum + itemTotal;
                const qty = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price_per_book) || 0;
                return sum + (qty * price);
            }, 0);
            setFormData(prev => ({ ...prev, total_price: total > 0 ? total.toString() : "" }));
        }
    }, [formData.items, formData.auto_calculate]);

    const handleAddBook = () => {
        if (!selectedEditionId) {
            toast.error("Please select an edition first")
            return
        }
        
        if (formData.items.some(item => item.bookEditionId === selectedEditionId)) {
            toast.error("This edition is already added to the project")
            return
        }

        const newItem: PrintOrderItem = {
            id: Date.now(),
            bookId: selectedBookId!,
            bookEditionId: selectedEditionId,
            quantity: (() => {
                const ed = editionsList.find(e => e.id === selectedEditionId);
                const total = ed?.total_print_count;
                return total != null && total > 0 ? total.toString() : "";
            })(),
            total_price: "",
            price_per_book: (() => {
                const ed = editionsList.find(e => e.id === selectedEditionId);
                const price = ed?.selling_price ?? ed?.production_price;
                return price != null && price > 0 ? price.toString() : "";
            })(),
            content: "",
            status: "NOT_STARTED"
        }

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }))

        setSelectedBookId(null)
        setSelectedEditionId(null)
    }

    const handleRemoveItem = (id: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }))
    }

    const updateItem = (id: number, field: keyof PrintOrderItem, value: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }))
    }

    const quantityChanged = formData.items.some(item => {
        const original = initialItems.find(i => i.id === item.id)?.quantity;
        return original !== undefined && item.quantity !== original;
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.printerId) {
            toast.error("Please assign a printer")
            return
        }
        if (formData.items.length === 0) {
            toast.error("Please add at least one book to the project")
            return
        }

        const invalidItem = formData.items.find(i => !i.quantity || parseFloat(i.quantity) <= 0);
        if (invalidItem) {
            toast.error("Please provide valid quantities for all books")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await updatePrintOrder(order.id, formData)
            if (response.success) {
                toast.success("Printing project updated successfully")
                router.refresh()
            } else {
                toast.error(response.error || "Failed to update project")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (deleteConfirmText !== "DELETE") return
        setIsDeleting(true)
        try {
            const response = await deletePrintOrder(order.id)
            if (response.success) {
                toast.success("Project removed successfully")
                router.push("/admin_dashboard/printing/manage")
            } else {
                toast.error(response.error || "Failed to remove project")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }
        setIsSubmittingPayment(true)
        try {
            const response = await addPrintOrderPayment(order.id, {
                amount: parseFloat(paymentForm.amount),
                payment_date: paymentForm.payment_date,
                reference: paymentForm.reference || undefined
            })
            if (response.success) {
                toast.success("Payment recorded successfully")
                setPaymentForm({
                    amount: "",
                    payment_date: format(new Date(), "yyyy-MM-dd"),
                    reference: ""
                })
                setIsAddingPayment(false)
                router.refresh()
            } else {
                toast.error(response.error || "Failed to record payment")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSubmittingPayment(false)
        }
    }

    const handleDeletePayment = async (paymentId: number) => {
        if (!confirm("Are you sure you want to remove this payment record?")) return
        try {
            const response = await deletePrintOrderPayment(paymentId, order.id)
            if (response.success) {
                toast.success("Payment removed")
                router.refresh()
            } else {
                toast.error(response.error || "Failed to remove payment")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const handleSaveReference = async (paymentId: number) => {
        setIsSavingRef(true)
        try {
            const response = await updatePrintOrderPayment(paymentId, order.id, { reference: editRefValue || null })
            if (response.success) {
                toast.success("Memo updated")
                setEditingPaymentRef(null)
                router.refresh()
            } else {
                toast.error(response.error || "Failed to update memo")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsSavingRef(false)
        }
    }

    const handlePrintPDF = () => {
        window.print()
    }

    const handleToggleVisibility = async (edition: any) => {
        setIsTogglingVisibility(true)
        try {
            const res = await toggleEditionVisibilityToPrinter(edition.id)
            if (res.success) {
                toast.success(res.data.visiblitiy_to_printer ? "Visible to printers" : "Hidden from printers")
                setEditionsList(prev => prev.map(e => e.id === edition.id ? res.data : e))
                setVisibilityDialogEdition(null)
                router.refresh()
            } else {
                toast.error(res.error || "Failed to update visibility")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsTogglingVisibility(false)
        }
    }

    const handleToggleProjectVisibility = async (visible: boolean) => {
        setIsTogglingProjectVisibility(true)
        try {
            const res = await toggleProjectEditionsVisibilityToPrinter(order.id, visible)
            if (res.success) {
                toast.success((res.updatedCount ?? 0) > 0
                    ? `All editions ${visible ? "visible" : "hidden"} to printers`
                    : "No editions to update")
                setEditionsList(prev => prev.map(e => e.visiblitiy_to_printer !== undefined ? { ...e, visiblitiy_to_printer: visible } : e))
                setVisibilityDialogEdition(null)
                router.refresh()
            } else {
                toast.error(res.error || "Failed to update project visibility")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsTogglingProjectVisibility(false)
        }
    }

    const totalBooks = formData.items.length;
    const totalUnits = formData.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

    const projectEditionIds = formData.items.map(item => item.bookEditionId);
    const projectEditions = editionsList.filter((e: any) => projectEditionIds.includes(e.id));
    const allProjectEditionsVisible = projectEditions.length > 0 && projectEditions.every((e: any) => e.visiblitiy_to_printer);
    
    // Financial Calculations
    const totalPrice = parseFloat(formData.total_price) || 0;
    const totalPaid = (order.printorder_payments || []).reduce((sum: number, p: any) => sum + p.amount, 0);
    const remainingBalance = Math.max(0, totalPrice - totalPaid);
    const isFullyPaid = totalPrice > 0 && totalPaid >= totalPrice;
    const lastPaymentDate = isFullyPaid && order.printorder_payments?.length > 0 
        ? new Date(order.printorder_payments[order.printorder_payments.length - 1].payment_date)
        : null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 print:bg-white print:p-0">
            {/* --- PRINT ONLY INVOICE VIEW --- */}
            <div className="hidden print:block max-w-4xl mx-auto space-y-8 bg-white text-black p-8">
                <div className="flex items-start justify-between border-b-2 border-black pb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Payment Receipt</h1>
                        <p className="text-sm font-bold uppercase tracking-widest mt-2">Bookland Ethiopia</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold uppercase tracking-widest">Project #{order.id.toString().padStart(4, '0')}</p>
                        <p className="text-sm">{formatDate(new Date())}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                        <p className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-1">Project Details</p>
                        <p className="font-black text-lg uppercase">{order.project_name || "Unnamed Project"}</p>
                        <p>{totalBooks} Books, {totalUnits.toLocaleString()} Units</p>
                        <p>Printer: {order.printer?.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-1">Status</p>
                        <p className="font-black">{order.status.replace("_", " ")}</p>
                        {isFullyPaid && <p className="font-black text-green-600 uppercase mt-1">FULLY PAID</p>}
                    </div>
                </div>

                <div className="py-6">
                    <p className="font-bold uppercase tracking-widest text-xs text-gray-500 mb-4 border-b border-gray-200 pb-2">Payment History</p>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left font-bold uppercase text-xs border-b border-gray-200">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Reference</th>
                                <th className="pb-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.printorder_payments?.map((payment: any) => (
                                <tr key={payment.id} className="border-b border-gray-100">
                                    <td className="py-3">{formatDate(new Date(payment.payment_date))}</td>
                                    <td className="py-3 text-gray-600">{payment.reference || "-"}</td>
                                    <td className="py-3 text-right font-bold">{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</td>
                                </tr>
                            ))}
                            {(!order.printorder_payments || order.printorder_payments.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="py-4 text-center text-gray-400 italic">No payments recorded</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="w-1/2 ml-auto space-y-3 pt-6 border-t-2 border-black">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold uppercase tracking-widest">Total Price:</span>
                        <span>{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-bold uppercase tracking-widest">Total Paid:</span>
                        <span>{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-3 border-t border-gray-200">
                        <span className="uppercase tracking-widest">Balance Due:</span>
                        <span>{remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</span>
                    </div>
                </div>
            </div>

            {/* --- WEB UI --- */}
            <div className="max-w-6xl mx-auto space-y-10 print:hidden">
                
                {/* Header Card */}
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <ClipboardList className="size-48" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="size-24 rounded-[2rem] bg-primarycolor/5 flex items-center justify-center text-primarycolor border-2 border-primarycolor/10 shadow-inner">
                                <Layers className="size-12" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                                        <Link href="/admin_dashboard/printing/manage" className="flex items-center gap-1">
                                            <ChevronLeft className="size-3" /> Back to Logs
                                        </Link>
                                    </Button>
                                    <div className="size-1 rounded-full bg-primarycolor/20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondarycolor">Project #PR-{order.id.toString().padStart(4, '0')}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-primarycolor uppercase tracking-tighter italic leading-none">
                                    {order.project_name || "Unnamed Project"}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <Printer className="size-4 text-primarycolor/40" />
                                    <span className="text-xs font-bold text-primarycolor/60 uppercase tracking-widest">{order.printer?.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button 
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="h-16 px-8 rounded-[1.5rem] font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-rose-500/20 transition-all active:scale-95"
                            >
                                <Trash2 className="size-5" /> Cancel Project
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Configuration Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Financial Tracking Section */}
                        <div className="bg-white rounded-[3rem] p-10 md:p-12 border-2 border-emerald-500/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <DollarSign className="size-40 text-emerald-500" />
                            </div>
                            
                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                    <div className="flex items-center gap-3">
                                        <Wallet className="size-6 text-emerald-500" />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600">Financial Tracking</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isFullyPaid && (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
                                                <CheckCircle2 className="size-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Fully Paid</span>
                                                {lastPaymentDate && <span className="text-[10px] font-bold opacity-70 ml-1">on {format(lastPaymentDate, "MMM dd")}</span>}
                                            </div>
                                        )}
                                        <Button 
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrintPDF}
                                            className="h-10 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] gap-2 text-slate-500 hover:text-primarycolor hover:border-primarycolor"
                                        >
                                            <PrinterIcon className="size-3" /> Print PDF
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</p>
                                        <p className="text-2xl font-black text-slate-800">{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Total Paid</p>
                                        <p className="text-2xl font-black text-emerald-600">{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className={cn("p-6 rounded-3xl border space-y-2", remainingBalance > 0 ? "bg-rose-50/50 border-rose-100" : "bg-slate-50 border-slate-100")}>
                                        <p className={cn("text-[10px] font-black uppercase tracking-widest", remainingBalance > 0 ? "text-rose-600/60" : "text-slate-400")}>Remaining Balance</p>
                                        <p className={cn("text-2xl font-black", remainingBalance > 0 ? "text-rose-600" : "text-slate-400")}>{remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Payment History</h4>
                                        {!isAddingPayment && !isFullyPaid && (
                                            <Button 
                                                variant="ghost"
                                                onClick={() => setIsAddingPayment(true)}
                                                className="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 gap-2"
                                            >
                                                <Plus className="size-3" /> Add Payment
                                            </Button>
                                        )}
                                    </div>

                                    {isAddingPayment && (
                                        <form onSubmit={handleAddPayment} className="bg-white rounded-2xl border-2 border-emerald-200 p-6 space-y-5 shadow-lg shadow-emerald-500/5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 ml-1">Amount (ETB) *</label>
                                                <Input 
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    value={paymentForm.amount}
                                                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                                                    className="h-14 px-5 rounded-xl border-2 border-emerald-200 focus-visible:ring-emerald-500 font-bold text-lg bg-white"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 ml-1">Payment Date *</label>
                                                <DateInput 
                                                    required
                                                    value={paymentForm.payment_date}
                                                    onChange={(e) => setPaymentForm({...paymentForm, payment_date: e.target.value})}
                                                    className="h-14 px-5 rounded-xl border-2 border-emerald-200 focus-visible:ring-emerald-500 font-bold bg-white"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 ml-1">Reference (Optional)</label>
                                                <Input 
                                                    value={paymentForm.reference}
                                                    onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                                                    className="h-14 px-5 rounded-xl border-2 border-emerald-200 focus-visible:ring-emerald-500 font-bold bg-white"
                                                    placeholder="Receipt number, check number, or memo"
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <Button 
                                                    type="submit"
                                                    disabled={isSubmittingPayment}
                                                    className="flex-[2] h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20"
                                                >
                                                    {isSubmittingPayment ? "Saving..." : "Record Payment"}
                                                </Button>
                                                <Button 
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsAddingPayment(false)}
                                                    className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] text-slate-500"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                            {order.printorder_payments && order.printorder_payments.length > 0 ? (
                                        <div className="space-y-3">
                                            {order.printorder_payments.map((payment: any) => (
                                                <div key={payment.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group">
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                            <Receipt className="size-4" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-sm text-slate-800">{formatLong(new Date(payment.payment_date))}</p>
                                                            {editingPaymentRef === payment.id ? (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Input
                                                                        value={editRefValue}
                                                                        onChange={(e) => setEditRefValue(e.target.value)}
                                                                        className="h-8 px-3 rounded-lg border-2 font-bold text-xs flex-1 min-w-0"
                                                                        placeholder="Receipt, check, or memo"
                                                                        autoFocus
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleSaveReference(payment.id)}
                                                                        disabled={isSavingRef}
                                                                        className="h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest shrink-0"
                                                                    >
                                                                        {isSavingRef ? "..." : "Save"}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => setEditingPaymentRef(null)}
                                                                        className="h-8 px-3 rounded-lg text-slate-400 hover:text-slate-600 font-black text-[9px] uppercase tracking-widest shrink-0"
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </div>
                                                            ) : payment.reference ? (
                                                                <p className="flex items-center gap-1.5">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ref: {payment.reference}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setEditRefValue(payment.reference || ""); setEditingPaymentRef(payment.id) }}
                                                                        className="opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase tracking-widest text-primarycolor hover:text-primarycolor/70 transition-all cursor-pointer"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </p>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setEditRefValue(""); setEditingPaymentRef(payment.id) }}
                                                                    className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-primarycolor transition-all cursor-pointer"
                                                                >
                                                                    + Add memo
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 shrink-0">
                                                        <span className="font-black text-emerald-600">+{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        <Button 
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeletePayment(payment.id)}
                                                            className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all size-8"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl">
                                            No payments recorded yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Tracking Sidebar */}
                    <div className="space-y-8">
                        {/* Status Management */}
                        <div className="bg-white rounded-[3rem] p-8 border-2 border-primarycolor/10 shadow-xl space-y-8">
                            <div className="flex items-center gap-3">
                                <Activity className="size-5 text-secondarycolor" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primarycolor">Operational Status</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Phase</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white text-primarycolor font-black text-xs outline-none focus:border-primarycolor transition-all appearance-none"
                                    >
                                        {statusOptions.map((opt) => {
                                            const Icon = opt.icon
                                            return (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-muted-foreground uppercase">Total Books</span>
                                    <span className="text-[10px] font-bold text-primarycolor">{totalBooks}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-muted-foreground uppercase">Total Units</span>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{totalUnits.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-muted-foreground uppercase">Last Sync</span>
                                    <span className="text-[10px] font-bold text-primarycolor">{formatDate(new Date(order.updatedAt), "HH:mm, MMM dd")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Metadata */}
                        <div className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl text-white space-y-6">
                            <div className="flex items-center gap-3 opacity-60">
                                <Info className="size-4" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Info</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Created At</p>
                                    <p className="text-xs font-bold">{formatLong(new Date(order.createdAt))}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Created By</p>
                                    <p className="text-xs font-bold">System Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Configuration Card */}
                <div className="bg-white rounded-[3rem] p-10 md:p-12 border-2 border-primarycolor/10 shadow-2xl relative">
                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
                        <Settings className="size-5 text-secondarycolor" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primarycolor">Project Configuration</h3>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Project Name (Optional)</label>
                                <Input 
                                    value={formData.project_name}
                                    onChange={(e) => setFormData({...formData, project_name: e.target.value})}
                                    className="h-14 px-6 rounded-2xl border-2 font-bold bg-white"
                                    placeholder="e.g. Summer Batch 2026"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Assigned Printer</label>
                                <select 
                                    value={formData.printerId}
                                    onChange={(e) => setFormData({...formData, printerId: e.target.value})}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white font-bold focus:border-primarycolor outline-none transition-all appearance-none"
                                >
                                    {printers.map(printer => (
                                        <option key={printer.id} value={printer.id}>{printer.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Overall Status</label>
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white font-bold focus:border-primarycolor outline-none transition-all appearance-none"
                                >
                                    <option value="NOT_STARTED">Not Started / Waiting</option>
                                    <option value="STARTED">Started</option>
                                    <option value="ONPROGRESS">On Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Start Date</label>
                                <DateInput 
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="h-14 px-6 rounded-2xl border-2 font-bold bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Target Completion</label>
                                <DateInput 
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="h-14 px-6 rounded-2xl border-2 font-bold bg-white"
                                />
                            </div>
                        </div>

                        {/* Books Section */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between gap-3">
                                <h4 className="font-black text-lg text-primarycolor uppercase tracking-widest">Books to Print</h4>
                                {projectEditionIds.length > 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => handleToggleProjectVisibility(!allProjectEditionsVisible)}
                                        disabled={isTogglingProjectVisibility}
                                        className={cn(
                                            "h-9 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2",
                                            allProjectEditionsVisible
                                                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                                                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                        )}
                                    >
                                        {allProjectEditionsVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                        {isTogglingProjectVisibility
                                            ? "Updating..."
                                            : allProjectEditionsVisible
                                                ? "Hide All from Printer"
                                                : "Show All to Printer"}
                                    </Button>
                                )}
                            </div>

                            {/* Add Book Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">
                                <div className="md:col-span-5 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Book</label>
                                    <Popover open={bookOpen} onOpenChange={setBookOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                role="combobox"
                                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white font-bold justify-between hover:bg-slate-100 transition-all text-slate-700"
                                            >
                                                <span className="truncate">{selectedBook?.title || "Choose Book..."}</span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search books..." className="h-12 font-bold" />
                                                <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                    <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No book found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {books.map((book) => (
                                                            <CommandItem
                                                                key={book.id}
                                                                value={book.title}
                                                                onSelect={() => {
                                                                    setSelectedBookId(book.id)
                                                                    setBookOpen(false)
                                                                    setSelectedEditionId(null)
                                                                }}
                                                                className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", selectedBookId === book.id ? "opacity-100" : "opacity-0")} />
                                                                <span className="truncate">{book.title}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="md:col-span-5 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Edition</label>
                                    <Popover open={editionOpen} onOpenChange={setEditionOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                role="combobox"
                                                disabled={!selectedBookId}
                                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white font-bold justify-between hover:bg-slate-100 transition-all text-slate-700 disabled:opacity-50"
                                            >
                                                <span className="truncate">{editionsList.find(e => e.id === selectedEditionId)?.edition_name || (selectedBookId ? "Choose Edition..." : "Select book first")}</span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0 rounded-2xl border-2 shadow-2xl overflow-hidden" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search editions..." className="h-12 font-bold" />
                                                <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                    <CommandEmpty className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">No edition found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {filteredEditions.map((ed) => (
                                                            <CommandItem
                                                                key={ed.id}
                                                                value={ed.edition_name}
                                                                onSelect={() => {
                                                                    setSelectedEditionId(ed.id)
                                                                    setEditionOpen(false)
                                                                }}
                                                                className="h-12 px-4 font-bold text-sm text-primarycolor cursor-pointer data-[selected=true]:bg-primarycolor data-[selected=true]:text-white"
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", selectedEditionId === ed.id ? "opacity-100" : "opacity-0")} />
                                                                <span className="truncate">{ed.edition_name}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="md:col-span-2">
                                    <Button 
                                        type="button"
                                        onClick={handleAddBook}
                                        disabled={!selectedEditionId}
                                        className="w-full h-12 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Add Book
                                    </Button>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="flex items-center justify-end gap-3 pb-2">
                                {!isEditingBooks && formData.items.length > 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditingBooks(true)}
                                        className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20 gap-2"
                                    >
                                        <Settings className="size-3.5" /> Edit
                                    </Button>
                                )}
                                {isEditingBooks && (
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditingBooks(false)}
                                        className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 gap-2"
                                    >
                                        <Check className="size-3.5" /> Done
                                    </Button>
                                )}
                            </div>
                            {formData.items.length > 0 ? (
                                <div className="overflow-x-auto rounded-2xl border-2 border-slate-100 bg-white">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                                                <th className="text-left py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">#</th>
                                                <th className="text-left py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Book & Edition</th>
                                                <th className="text-right py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Quantity</th>
                                                <th className="text-right py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Remaining</th>
                                                <th className="text-right py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Total Price</th>
                                                <th className="text-center py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                                <th className="text-center py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Content</th>
                                                {isEditingBooks && <th className="text-center py-3.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.items.map((item, index) => {
                                                const bookName = books.find(b => b.id === item.bookId)?.title;
                                                const editionName = editionsList.find(e => e.id === item.bookEditionId)?.edition_name;
                                                const rowEdition = editionsList.find((e: any) => e.id === item.bookEditionId);
                                                const qty = parseFloat(item.quantity) || 0;
                                                const price = parseFloat(item.price_per_book) || 0;
                                                const storedTotal = parseFloat(item.total_price);
                                                const totalPrice = storedTotal > 0 ? storedTotal : (qty * price);
                                                const remainingCount = editionsList.find((e: any) => e.id === item.bookEditionId)?.count_remening_for_transfer
                                                
                                                return (
                                                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-3.5 px-4 text-xs font-bold text-slate-400">{index + 1}</td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className={cn("size-2.5 rounded-full shrink-0", rowEdition?.visiblitiy_to_printer ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-slate-300")} title={rowEdition?.visiblitiy_to_printer ? "Visible to printers" : "Hidden from printers"} />
                                                                <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                                                                    <BookOpen className="size-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-sm text-slate-800 truncate max-w-[200px]" title={bookName}>{bookName || "Unknown Book"}</p>
                                                                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                                        {editionName || "Unknown Edition"}
                                                                        {rowEdition && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setVisibilityDialogEdition(rowEdition)}
                                                                                title="Printer visibility"
                                                                                className="ml-0.5 text-primarycolor/60 hover:text-primarycolor transition-colors"
                                                                            >
                                                                                {rowEdition.visiblitiy_to_printer ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                                                                            </button>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            {isEditingBooks ? (
                                                                <Input 
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                                                    className="h-9 w-24 ml-auto rounded-xl font-bold text-right text-sm bg-white border-slate-200"
                                                                />
                                                            ) : (
                                                                <span className="font-bold text-slate-800">{item.quantity}</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            <span className={cn(
                                                                "font-bold",
                                                                remainingCount != null && remainingCount > 0
                                                                    ? "text-amber-600"
                                                                    : "text-slate-300",
                                                            )}>
                                                                {remainingCount != null ? remainingCount.toLocaleString() : "—"}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            {isEditingBooks ? (
                                                                <Input 
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    value={item.total_price || (qty * price).toString()}
                                                                    onChange={(e) => updateItem(item.id, 'total_price', e.target.value)}
                                                                    className="h-9 w-28 ml-auto rounded-xl font-bold text-right text-sm bg-white border-slate-200"
                                                                    placeholder={(qty * price).toFixed(2)}
                                                                />
                                                            ) : (
                                                                <span className="font-black text-emerald-600">{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-center">
                                                            {isEditingBooks ? (
                                                                <select 
                                                                    value={item.status}
                                                                    onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                                                                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white font-bold text-xs outline-none"
                                                                >
                                                                    <option value="NOT_STARTED">Waiting</option>
                                                                    <option value="STARTED">Started</option>
                                                                    <option value="ONPROGRESS">On Progress</option>
                                                                    <option value="COMPLETED">Completed</option>
                                                                </select>
                                                            ) : (
                                                                <span className={cn(
                                                                    "inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                                    item.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" :
                                                                    item.status === "ONPROGRESS" ? "bg-amber-50 text-amber-600" :
                                                                    item.status === "STARTED" ? "bg-blue-50 text-blue-600" :
                                                                    "bg-slate-50 text-slate-400"
                                                                )}>
                                                                    {item.status.replace("_", " ")}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setContentDialogItem(item)
                                                                    setContentDialogValue(item.content)
                                                                }}
                                                                className={cn(
                                                                    "h-8 px-3 rounded-lg font-black text-[10px] uppercase tracking-widest gap-1.5",
                                                                    item.content
                                                                        ? "text-primarycolor bg-primarycolor/5 hover:bg-primarycolor/10"
                                                                        : "text-slate-300 hover:text-slate-500"
                                                                )}
                                                            >
                                                                <BookOpen className="size-3" />
                                                                {item.content ? "View" : "Add"}
                                                            </Button>
                                                        </td>
                                                        {isEditingBooks && (
                                                            <td className="py-3.5 px-4 text-center">
                                                                <Button 
                                                                    type="button" 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    onClick={() => handleRemoveItem(item.id)}
                                                                    className="text-red-400 hover:text-red-500 hover:bg-red-50 size-8 rounded-xl"
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </Button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                                    <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                                        <Layers className="size-8" />
                                    </div>
                                    <p className="font-bold text-slate-400">No books in this project.</p>
                                </div>
                            )}

                            {quantityChanged && (
                                <div className="flex items-start gap-4 p-4 rounded-2xl border-2 border-amber-300 bg-amber-50">
                                    <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-amber-700 uppercase tracking-widest">
                                            Quantity changed
                                        </p>
                                        <p className="text-xs font-bold text-amber-700/80 leading-relaxed">
                                            The edition's main total print count will be updated when you commit these changes. If the new quantity is lower, the edition's total print count (and central remaining count) will be reduced to match.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Totals & Memo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-slate-100 pt-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Total Project Amount</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.auto_calculate}
                                            onChange={(e) => setFormData({...formData, auto_calculate: e.target.checked})}
                                            className="rounded border-slate-300 text-primarycolor focus:ring-primarycolor"
                                        />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto Calculate</span>
                                    </label>
                                </div>
                                <div className="relative">
                                    <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                    <Input 
                                        disabled={formData.auto_calculate}
                                        type="number"
                                        step="0.01"
                                        value={formData.total_price}
                                        onChange={(e) => setFormData({...formData, total_price: e.target.value})}
                                        className="h-16 pl-12 rounded-2xl border-2 font-black text-xl text-primarycolor bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor/40 ml-1">Production Memo</label>
                                <Textarea 
                                    rows={3}
                                    value={formData.memo}
                                    onChange={(e) => setFormData({...formData, memo: e.target.value})}
                                    className="p-6 rounded-[2rem] border-2 border-slate-100 font-bold text-sm bg-white transition-all resize-none"
                                    placeholder="No instructions provided..."
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] h-16 rounded-[1.5rem] bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20"
                            >
                                {isSubmitting ? "Saving..." : "Commit Changes"}
                            </Button>
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setFormData({
                                        project_name: order.project_name || "",
                                        printerId: order.printerId?.toString() || "",
                                        memo: order.memo || "",
                                        status: order.status,
                                        startDate: order.startDate ? format(new Date(order.startDate), "yyyy-MM-dd") : "",
                                        endDate: order.endDate ? format(new Date(order.endDate), "yyyy-MM-dd") : "",
                                        total_price: order.total_price?.toString() || "",
                                        auto_calculate: true,
                                        items: initialItems
                                    })
                                }}
                                className="flex-1 h-16 rounded-[1.5rem] border-2 font-black uppercase tracking-widest"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Content Dialog */}
                {contentDialogItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20">
                                        <BookOpen className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-primarycolor text-lg uppercase tracking-tight">Content Notes</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {books.find(b => b.id === contentDialogItem.bookId)?.title || "Unknown Book"} — {editionsList.find(e => e.id === contentDialogItem.bookEditionId)?.edition_name || "Unknown Edition"}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setContentDialogItem(null)}>
                                    <X className="size-5" />
                                </Button>
                            </div>

                            <RichTextEditor
                                value={contentDialogValue}
                                onChange={setContentDialogValue}
                                placeholder="Write content notes, specifications, or instructions for this edition..."
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setContentDialogItem(null)}
                                    className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={isSavingContent}
                                    onClick={async () => {
                                        setIsSavingContent(true)
                                        updateItem(contentDialogItem.id, 'content', contentDialogValue)
                                        const res = await updatePrintOrder(order.id, {
                                            ...formData,
                                            items: formData.items.map(it =>
                                                it.id === contentDialogItem.id
                                                    ? { ...it, content: contentDialogValue }
                                                    : it
                                            )
                                        })
                                        if (res.success) {
                                            toast.success("Content updated")
                                        } else {
                                            toast.error(res.error || "Failed to save content")
                                        }
                                        setContentDialogItem(null)
                                        setIsSavingContent(false)
                                    }}
                                    className="flex-[2] h-12 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-2"
                                >
                                    {isSavingContent ? "Saving..." : "Save Content"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Printer Visibility Dialog */}
                {visibilityDialogEdition && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20">
                                        {visibilityDialogEdition.visiblitiy_to_printer ? <Eye className="size-6" /> : <EyeOff className="size-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-primarycolor text-lg uppercase tracking-tight">Printer Visibility</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {books.find(b => b.id === visibilityDialogEdition.bookId)?.title || "Unknown Book"} — {visibilityDialogEdition.edition_name || "Unknown Edition"}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setVisibilityDialogEdition(null)}>
                                    <X className="size-5" />
                                </Button>
                            </div>

                            <div className="p-8 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className={cn("size-3 rounded-full", visibilityDialogEdition.visiblitiy_to_printer ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-300")} />
                                    <p className="font-bold text-sm text-slate-700">
                                        {visibilityDialogEdition.visiblitiy_to_printer ? "Visible to printers" : "Hidden from printers"}
                                    </p>
                                </div>
                                <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                                    {visibilityDialogEdition.visiblitiy_to_printer
                                        ? "This edition is currently shown to printers. Turn it off to hide it from printer selection."
                                        : "This edition is currently hidden from printers. Turn it on to make it available to printers again."}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setVisibilityDialogEdition(null)}
                                    className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={isTogglingVisibility}
                                    onClick={() => handleToggleVisibility(visibilityDialogEdition)}
                                    className={cn(
                                        "flex-[2] h-12 rounded-xl font-black uppercase tracking-widest text-xs gap-2",
                                        visibilityDialogEdition.visiblitiy_to_printer
                                            ? "bg-rose-500 hover:bg-rose-600 text-white"
                                            : "bg-primarycolor hover:bg-secondarycolor text-white"
                                    )}
                                >
                                    {isTogglingVisibility
                                        ? "Updating..."
                                        : visibilityDialogEdition.visiblitiy_to_printer
                                            ? <><EyeOff className="size-4" /> Turn Off</>
                                            : <><Eye className="size-4" /> Turn On</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl space-y-10 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-8">
                                <div className="size-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20">
                                    <ShieldAlert className="size-10" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-rose-500 uppercase tracking-tighter italic">Batch <span className="text-secondarycolor not-italic">Cancellation</span></h3>
                                    <p className="text-muted-foreground font-bold leading-none">You are about to terminate this project.</p>
                                </div>
                            </div>

                            <div className="p-8 bg-rose-500/5 rounded-[2rem] border-2 border-rose-500/10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="size-6 text-rose-500 shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                                            Warning: Cancelling this batch will remove it from active logs. Historic data for <span className="text-rose-600 font-black">"{order.project_name || `Project #${order.id}`}"</span> will be permanently deleted.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">Type <span className="underline decoration-2 underline-offset-4">DELETE</span> to confirm permanent removal</p>
                                    <Input 
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="h-16 px-8 rounded-2xl border-2 border-rose-500/20 font-black text-rose-600 text-center text-xl tracking-[0.2em] focus-visible:ring-rose-500 uppercase"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button 
                                    variant="destructive"
                                    className="flex-1 h-16 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20 transition-all active:scale-95"
                                    onClick={handleDelete}
                                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                                >
                                    {isDeleting ? "Processing..." : "Confirm Termination"}
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="flex-1 h-16 rounded-[1.5rem] border-2 font-black uppercase tracking-widest transition-all active:scale-95"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Abort
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
