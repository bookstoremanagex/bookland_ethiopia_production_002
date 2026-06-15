import prisma from "@/lib/prisma";
import ManagePaymentTable from "./ManagePaymentTable";
import { BadgeDollarSign } from "lucide-react";

export default async function ManagePaymentPage() {
    const shops = await (prisma as any).bookshopes.findMany({
        where: { is_deleted: false },
        include: {
            orders: {
                where: { is_deleted: false }
            },
            payments: {
                where: { is_deleted: false }
            }
        }
    });

    const data = shops.map((shop: any) => {
        const totalDebt = shop.orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
        const totalPaid = shop.orders.reduce((sum: number, order: any) => sum + (order.amount_paid || 0), 0);
        const totalRemaining = totalDebt - totalPaid;
        const hasPendingPayments = shop.payments.some((p: any) => p.status === "PENDING");
        const paymentDates = shop.payments
            .map((p: any) => p.createdAt ? new Date(p.createdAt).getTime() : 0)
            .filter((t: number) => t > 0);
        const latestPaymentDate = paymentDates.length > 0 ? Math.max(...paymentDates) : 0;
        return {
            id: shop.id,
            name: shop.name,
            location: shop.location,
            totalDebt,
            totalPaid,
            totalRemaining,
            hasPendingPayments,
            latestPaymentDate,
        };
    });

    data.sort((a: any, b: any) => b.latestPaymentDate - a.latestPaymentDate);

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <div className="flex items-center gap-3 text-primarycolor">
                    <BadgeDollarSign className="size-6" />
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Manage <span className="text-secondarycolor not-italic">Payment</span>
                    </h1>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                    Track shop debts and payments
                </p>
            </div>

            <ManagePaymentTable data={data} />
        </div>
    );
}
