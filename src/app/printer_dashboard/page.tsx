import React from 'react'
import { notFound } from 'next/navigation'
import {
    Printer,
    MapPin,
    Phone,
    Mail,
    Package,
    ClipboardList,
    Building2,
    Activity,
    BookOpen,
    Banknote,
    ArrowUpRight
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { getCurrentSession } from "@/app/actions/auth-actions"

export default async function PrinterHomePage() {
    const session = await getCurrentSession()
    if (!session?.email) return notFound()

    const printer = await (prisma as any).printer.findFirst({
        where: {
            email: session.email,
            is_deleted: false,
        },
        include: {
            printorder: {
                include: {
                    printorder_items: {
                        include: {
                            bookedition: {
                                include: { books: true }
                            }
                        }
                    },
                    printorder_payments: true
                }
            },
            bookeditionprinters: {
                where: { is_deleted: false },
                include: {
                    bookedition: {
                        include: { books: true }
                    }
                }
            }
        }
    })

    if (!printer) return notFound()

    const activeOrders = printer.printorder.filter((o: any) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
    const totalStock = printer.bookeditionprinters.reduce((sum: number, bp: any) => sum + (bp.quantity || 0), 0)
    const stockItems = printer.bookeditionprinters.length

    const statusColorMap: Record<string, string> = {
        available: "text-emerald-500",
        maintenance: "text-amber-500",
        closed: "text-rose-500",
    }

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#F8FAFC] min-h-screen">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 w-full md:w-auto">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <Printer className="size-6 md:size-8" />
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] opacity-50">Printing Dashboard</span>
                    </div>
                    <h1 className="text-3xl md:text-6xl font-black tracking-tight text-primarycolor uppercase italic leading-none">
                        {printer.name}
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl flex items-center gap-2">
                        <MapPin className="size-4" /> {printer.location}
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-primarycolor/5 shadow-xl">
                    <div className="flex flex-col items-center px-6 border-r-2 border-primarycolor/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                        <span className={`text-2xl font-black ${statusColorMap[printer.status] || "text-emerald-500"}`}>
                            {printer.status}
                        </span>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <Activity className="size-6 text-secondarycolor animate-pulse mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Jobs</span>
                        <span className="text-2xl font-black text-primarycolor">{activeOrders.length}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Package className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Stock</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">
                                {totalStock.toLocaleString()}
                            </h2>
                            <span className="text-xs font-black text-secondarycolor flex items-center mb-1 uppercase tracking-tighter">
                                {stockItems} items
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ClipboardList className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Orders</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">
                                {printer.printorder.length}
                            </h2>
                            <span className="text-xs font-black text-secondarycolor flex items-center mb-1 uppercase tracking-tighter">
                                {activeOrders.length} active
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Building2 className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Facility Info</p>
                        <div className="space-y-2">
                            {printer.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="size-4 text-muted-foreground" />
                                    <span className="text-sm font-bold text-primarycolor">{printer.phone}</span>
                                </div>
                            )}
                            {printer.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4 text-muted-foreground" />
                                    <span className="text-sm font-bold text-primarycolor">{printer.email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Printing Projects Table */}
            <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="size-6 text-secondarycolor" />
                        <h2 className="text-2xl font-black text-primarycolor uppercase tracking-tighter italic">
                            Printing <span className="text-secondarycolor not-italic">Projects</span>
                        </h2>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {printer.printorder.length} Projects
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-primarycolor/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <th className="pb-4 pr-4">Project</th>
                                <th className="pb-4 pr-4">Books</th>
                                <th className="pb-4 pr-4">Status</th>
                                <th className="pb-4 pr-4">Count</th>
                                <th className="pb-4 pr-4">Total Price</th>
                                <th className="pb-4 pr-4">Quality</th>
                                <th className="pb-4 pr-4">Start Date</th>
                                <th className="pb-4 pr-4">End Date</th>
                                <th className="pb-4">Tracking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printer.printorder.map((order: any) => {
                                const booksList = order.printorder_items
                                    ?.map((item: any) => item.bookedition?.books?.title)
                                    .filter(Boolean)
                                    .join(", ") || "—"
                                return (
                                    <tr key={order.id} className="border-b border-primarycolor/5 last:border-0 hover:bg-primarycolor/[0.02] transition-colors">
                                        <td className="py-4 pr-4">
                                            <div className="font-black text-primarycolor text-sm leading-tight">
                                                {order.project_name || `Project #${order.id}`}
                                            </div>
                                            {order.memo && (
                                                <div className="text-[10px] text-muted-foreground font-bold mt-0.5 max-w-[200px] truncate">
                                                    {order.memo}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className="text-xs font-bold text-muted-foreground max-w-[200px] block truncate" title={booksList}>
                                                {booksList}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap ${
                                                order.status === "COMPLETED"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : order.status === "CANCELLED"
                                                    ? "bg-rose-50 text-rose-600"
                                                    : order.status === "STARTED" || order.status === "IN_PROGRESS"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-amber-50 text-amber-600"
                                            }`}>
                                                {order.status?.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 font-black text-primarycolor">
                                            {order.count?.toLocaleString() || "—"}
                                        </td>
                                        <td className="py-4 pr-4 font-black text-primarycolor whitespace-nowrap">
                                            {order.total_price ? `${order.total_price.toLocaleString()} ETB` : "—"}
                                        </td>
                                        <td className="py-4 pr-4 text-xs font-bold text-muted-foreground uppercase">
                                            {order.quality || "—"}
                                        </td>
                                        <td className="py-4 pr-4 text-xs font-bold text-muted-foreground whitespace-nowrap">
                                            {order.startDate ? new Date(order.startDate).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="py-4 pr-4 text-xs font-bold text-muted-foreground whitespace-nowrap">
                                            {order.endDate ? new Date(order.endDate).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                order.tracking === "SET" ? "text-emerald-500" : "text-amber-500"
                                            }`}>
                                                {order.tracking?.replace(/_/g, " ") || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            {printer.printorder.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-muted-foreground font-bold text-sm">
                                        No printing projects yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BookOpen className="size-6 text-secondarycolor" />
                        <h2 className="text-2xl font-black text-primarycolor uppercase tracking-tighter italic">
                            Store <span className="text-secondarycolor not-italic">Inventory</span>
                        </h2>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {stockItems} Editions
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-primarycolor/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <th className="pb-4 pr-4">Book Title</th>
                                <th className="pb-4 pr-4">Edition</th>
                                <th className="pb-4 pr-4">ISBN</th>
                                <th className="pb-4 pr-4">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printer.bookeditionprinters.map((bp: any) => {
                                const edition = bp.bookedition
                                const book = edition?.books
                                return (
                                    <tr key={bp.id} className="border-b border-primarycolor/5 last:border-0">
                                        <td className="py-4 pr-4 font-bold text-primarycolor text-sm">
                                            {book?.title || "Unknown Book"}
                                        </td>
                                        <td className="py-4 pr-4 text-muted-foreground font-bold text-sm">
                                            {edition?.edition || "—"}
                                        </td>
                                        <td className="py-4 pr-4 text-muted-foreground font-bold text-sm font-mono">
                                            {edition?.isbn || "—"}
                                        </td>
                                        <td className="py-4">
                                            <span className="font-black text-primarycolor text-lg">
                                                {bp.quantity?.toLocaleString() || 0}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            {printer.bookeditionprinters.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-muted-foreground font-bold text-sm">
                                        No books in inventory
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Tracking Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Banknote className="size-6 text-secondarycolor" />
                    <h2 className="text-2xl font-black text-primarycolor uppercase tracking-tighter italic">
                        Payment <span className="text-secondarycolor not-italic">Tracking</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {printer.printorder.filter((o: any) => o.total_price).map((order: any) => {
                        const totalPaid = (order.printorder_payments || []).reduce((sum: number, p: any) => sum + p.amount, 0)
                        const remaining = order.total_price - totalPaid
                        return (
                            <div key={order.id} className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl p-6 md:p-8 space-y-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-black text-primarycolor">
                                            {order.project_name || `Project #${order.id}`}
                                        </h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                            {order.printorder_items?.length || 0} items · {order.count?.toLocaleString() || 0} units
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                                            <p className="text-xl font-black text-primarycolor">{order.total_price.toLocaleString()} ETB</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Paid</p>
                                            <p className="text-xl font-black text-emerald-600">{totalPaid.toLocaleString()} ETB</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Remaining</p>
                                            <p className={`text-xl font-black ${remaining <= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                                {remaining <= 0 ? "Paid in Full" : `${remaining.toLocaleString()} ETB`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {order.printorder_payments?.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-primarycolor/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                    <th className="pb-3 pr-4">Date</th>
                                                    <th className="pb-3 pr-4">Amount</th>
                                                    <th className="pb-3">Reference</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.printorder_payments.map((payment: any) => (
                                                    <tr key={payment.id} className="border-b border-primarycolor/5 last:border-0">
                                                        <td className="py-3 pr-4 text-sm font-bold text-primarycolor whitespace-nowrap">
                                                            {new Date(payment.payment_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-3 pr-4 text-sm font-black text-emerald-600">
                                                            {payment.amount.toLocaleString()} ETB
                                                        </td>
                                                        <td className="py-3 text-sm font-bold text-muted-foreground">
                                                            {payment.reference || "—"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {(!order.printorder_payments || order.printorder_payments.length === 0) && (
                                    <p className="text-sm font-bold text-muted-foreground text-center py-4">
                                        No payments recorded yet
                                    </p>
                                )}
                            </div>
                        )
                    })}
                    {printer.printorder.filter((o: any) => o.total_price).length === 0 && (
                        <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl p-12 text-center">
                            <Banknote className="size-12 mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-sm font-bold text-muted-foreground">
                                No projects with pricing to track payments
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
