import prisma from "@/lib/prisma";
import { Printer, Banknote, BarChart3, CheckCircle2 } from "lucide-react";

export default async function FinancePrintingPage() {
    const orders = await (prisma as any).printorder.findMany({
        where: { is_deleted: false },
        include: {
            printer: true,
            printorder_items: {
                include: {
                    bookedition: {
                        include: { books: true }
                    }
                }
            },
            printorder_payments: true
        }
    });

    const printerSummary: Record<number, { name: string; totalCost: number; totalPaid: number; totalRemaining: number }> = {};

    orders.forEach((order: any) => {
        const printerId = order.printer?.id;
        if (!printerId) return;

        if (!printerSummary[printerId]) {
            printerSummary[printerId] = { name: order.printer.name, totalCost: 0, totalPaid: 0, totalRemaining: 0 };
        }

        const orderCost = order.printorder_items.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0);
        const orderPaid = order.printorder_payments.reduce((sum: number, p: any) => sum + (Number(p.paid_amount) || 0), 0);

        printerSummary[printerId].totalCost += orderCost;
        printerSummary[printerId].totalPaid += orderPaid;
        printerSummary[printerId].totalRemaining += (orderCost - orderPaid);
    });

    const printerRows = Object.values(printerSummary);
    const grandTotal = printerRows.reduce((s, r) => s + r.totalCost, 0);
    const grandPaid = printerRows.reduce((s, r) => s + r.totalPaid, 0);
    const grandRemaining = printerRows.reduce((s, r) => s + r.totalRemaining, 0);

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Printer className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Printers</p>
                        <h2 className="text-2xl font-black text-primarycolor italic mt-2">{printerRows.length}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Banknote className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Cost</p>
                        <h2 className="text-2xl font-black text-primarycolor italic mt-2">ETB {grandTotal.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle2 className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Remaining</p>
                        <h2 className="text-2xl font-black text-rose-500 italic mt-2">ETB {grandRemaining.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Printer Summary Table */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-primarycolor/5">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="size-6 text-primarycolor" />
                        <h2 className="text-lg font-black uppercase tracking-widest">Printer Financial Summary</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-primarycolor/5 text-left">
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Printer</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Total Cost</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Paid</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printerRows.map((row, i) => (
                                <tr key={i} className="border-b border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-colors">
                                    <td className="p-4 font-bold">{row.name}</td>
                                    <td className="p-4 text-right font-bold text-primarycolor">ETB {row.totalCost.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-emerald-600">ETB {row.totalPaid.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-rose-500">ETB {row.totalRemaining.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}