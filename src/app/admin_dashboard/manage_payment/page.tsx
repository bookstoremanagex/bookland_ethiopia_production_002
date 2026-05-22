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
                where: { is_deleted: false, status: "APPROVED" }
            }
        }
    });

    const data = shops.map((shop: any) => {
        const totalDebt = shop.orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
        const orderPaid = shop.orders.reduce((sum: number, order: any) => sum + (order.amount_paid || 0), 0);
        const paymentPaid = shop.payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        const totalPaid = orderPaid + paymentPaid;
        const totalRemaining = totalDebt - totalPaid;
        return {
            id: shop.id,
            name: shop.name,
            location: shop.location,
            totalDebt,
            totalPaid,
            totalRemaining
        };
    });

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <div className="flex items-center gap-3 text-primarycolor">
                    <BadgeDollarSign className="size-6" />
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
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
