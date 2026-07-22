import prisma from "@/lib/prisma";
import PaymentsDueTable from "./PaymentsDueTable";

export default async function PaymentsDuePage() {
    const shops = await (prisma as any).bookshopes.findMany({
        where: { is_deleted: false },
        include: {
            orders: {
                where: { is_deleted: false },
                select: { total_amount: true, amount_paid: true, order_type: true },
            },
            roundrecords: {
                where: { is_deleted: false },
                include: {
                    round_payments: {
                        where: { is_deleted: false, status: "APPROVED" },
                        select: { amount: true },
                    },
                },
            },
        },
    });

    const data = (shops as any[]).map((shop) => {
        let orderDebt = 0;
        let roundDebt = 0;

        for (const order of shop.orders || []) {
            const unpaid = (order.total_amount || 0) - (order.amount_paid || 0);
            if (unpaid <= 0) continue;
            if (order.order_type === "requested") {
                orderDebt += unpaid;
            } else if (order.order_type === "on round") {
                roundDebt += unpaid;
            }
        }

        for (const record of shop.roundrecords || []) {
            const totalPaid = (record.round_payments || []).reduce(
                (sum: number, p: any) => sum + (p.amount || 0),
                0
            );
            const remaining = (record.totalprice || 0) - totalPaid;
            if (remaining > 0) roundDebt += remaining;
        }

        return {
            id: shop.id,
            name: shop.name,
            branch: shop.branch || "Main",
            location: shop.location,
            orderDebt: Math.max(0, orderDebt),
            roundDebt: Math.max(0, roundDebt),
            totalDebt: Math.max(0, orderDebt + roundDebt),
        };
    });

    data.sort((a, b) => b.totalDebt - a.totalDebt);

    const totalOrderDebt = data.reduce((sum, s) => sum + s.orderDebt, 0);
    const totalRoundDebt = data.reduce((sum, s) => sum + s.roundDebt, 0);
    const totalDebt = totalOrderDebt + totalRoundDebt;

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Payments <span className="text-secondarycolor not-italic">Due</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Outstanding debts from orders and round distributions
                    </p>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Order Debt</p>
                        <p className="text-lg font-black text-amber-500">{totalOrderDebt.toLocaleString()} <span className="text-xs opacity-40">ETB</span></p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Round Debt</p>
                        <p className="text-lg font-black text-rose-500">{totalRoundDebt.toLocaleString()} <span className="text-xs opacity-40">ETB</span></p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total Debt</p>
                        <p className="text-lg font-black text-slate-800">{totalDebt.toLocaleString()} <span className="text-xs opacity-40">ETB</span></p>
                    </div>
                </div>
            </div>

            <PaymentsDueTable data={data} />
        </div>
    );
}
