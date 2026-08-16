import prisma from "@/lib/prisma";
import { 
    Building2, 
    Banknote, 
    Receipt, 
    AlertCircle, 
    TrendingUp,
    Search
} from "lucide-react";
import ShopFinanceDetailLink from "./ShopFinanceDetailLink";

export default async function FinanceBookShopPage() {
    const shops = await (prisma as any).bookshopes.findMany({
        where: { is_deleted: false },
        include: {
            orders: {
                where: { is_deleted: false },
                select: { id: true, total_amount: true, amount_paid: true, order_type: true, is_approved: true, createdAt: true },
            },
            payments: {
                where: { is_deleted: false },
                select: { amount: true, status: true, payment_type: true, is_for_previous_debts: true },
            },
        }
    });

    const roundRecordsAll = await (prisma as any).roundrecords.findMany({
        where: { is_deleted: false },
        include: {
            round_payments: {
                where: { is_deleted: false, status: "APPROVED" },
                select: { amount: true },
            },
        },
    });

    const shopsWithFinance = (shops as any[]).map(shop => {
        const shopRoundRecords = roundRecordsAll.filter((r: any) => r.bookshop_id === shop.id);

        const requestedOrders = (shop.orders || []).filter((o: any) => o.order_type === "requested");
        const lastRequestedOrder = [...requestedOrders].sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        // ── Debt components (matches payments-due table) ──
        let orderDebtUnpaid = 0;
        let roundDebt = 0;

        for (const order of shop.orders || []) {
            const unpaid = (order.total_amount || 0) - (order.amount_paid || 0);
            if (unpaid <= 0) continue;
            if (order.order_type === "requested" && order.is_approved) {
                orderDebtUnpaid += unpaid;
            } else if (order.order_type === "on round") {
                roundDebt += unpaid;
            }
        }

        for (const record of shopRoundRecords) {
            const paid = (record.round_payments || []).reduce((s: number, p: any) => s + (p.amount || 0), 0);
            const remaining = (record.totalprice || 0) - paid;
            if (remaining > 0) roundDebt += remaining;
        }

        const lastOrderDebt = lastRequestedOrder
            ? Math.max(0, (lastRequestedOrder.total_amount || 0) - (lastRequestedOrder.amount_paid || 0))
            : 0;
        const lastIncludedInOrderDebt = lastRequestedOrder?.is_approved && lastOrderDebt > 0;
        const orderDebt = Math.max(0, orderDebtUnpaid - (lastIncludedInOrderDebt ? lastOrderDebt : 0));

        const previousDebtAmount = shop.previousDebt || 0;
        const approvedPrevPayments = (shop.payments || []).filter(
            (p: any) => p.is_for_previous_debts && p.status === "APPROVED"
        );
        const approvedPrevPaid = approvedPrevPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const previousDebtRemaining = Math.max(0, previousDebtAmount - approvedPrevPaid);

        const totalDebt = Math.max(0, orderDebt + roundDebt + previousDebtRemaining + lastOrderDebt);

        // ── Distributed amounts (what was sent) ──
        const approvedRequestedExclLast = (shop.orders || []).filter(
            (o: any) => o.order_type === "requested" && o.is_approved &&
            (!lastIncludedInOrderDebt || o.id !== lastRequestedOrder?.id)
        );
        const approvedRequestedDistributed = approvedRequestedExclLast.reduce(
            (s: number, o: any) => s + (o.total_amount || 0), 0
        );
        const lastOrderDistributed = lastRequestedOrder ? (lastRequestedOrder.total_amount || 0) : 0;
        const roundOrderDistributed = (shop.orders || [])
            .filter((o: any) => o.order_type === "on round")
            .reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
        const roundRecordDistributed = shopRoundRecords.reduce(
            (s: number, r: any) => s + (r.totalprice || 0), 0
        );
        const totalDistributed = approvedRequestedDistributed + lastOrderDistributed + roundOrderDistributed + roundRecordDistributed + previousDebtAmount;

        // ── Collected amounts (what was paid) ──
        const approvedRequestedPaid = approvedRequestedExclLast.reduce(
            (s: number, o: any) => s + (o.amount_paid || 0), 0
        );
        const lastOrderPaid = lastRequestedOrder ? (lastRequestedOrder.amount_paid || 0) : 0;
        const roundOrderPaid = (shop.orders || [])
            .filter((o: any) => o.order_type === "on round")
            .reduce((s: number, o: any) => s + (o.amount_paid || 0), 0);
        const roundRecordPaid = shopRoundRecords.reduce(
            (s: number, r: any) => s + (r.round_payments || []).reduce((a: number, p: any) => a + (p.amount || 0), 0), 0
        );
        const totalCollected = approvedRequestedPaid + lastOrderPaid + roundOrderPaid + roundRecordPaid + approvedPrevPaid;

        const collectionRate = totalDistributed > 0 ? (totalCollected / totalDistributed) * 100 : 0;

        return {
            ...shop,
            totalValue: totalDistributed,
            totalPaid: totalCollected,
            totalDebt,
            collectionRate,
            orderDebt,
            roundDebt,
            previousDebt: previousDebtRemaining,
            lastOrderDebt,
        };
    });

    shopsWithFinance.sort((a, b) => b.totalDebt - a.totalDebt);

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Retail <span className="text-secondarycolor not-italic">Finance Hub</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
                        Financial oversight of book shop partnerships
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border-2 border-primarycolor/5 shadow-sm flex items-center gap-3">
                        <TrendingUp className="size-5 text-emerald-500" />
                        <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Receivable</p>
                            <p className="text-xl font-black text-primarycolor mt-1">
                                {shopsWithFinance.reduce((acc, s) => acc + s.totalDebt, 0).toLocaleString()} <span className="text-xs opacity-50">ETB</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {shopsWithFinance.map((shop) => (
                    <div key={shop.id} className="group bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl hover:border-primarycolor/20 transition-all overflow-hidden">
                        <div className="p-8 flex flex-col lg:flex-row items-center gap-8">
                            {/* Shop Identity */}
                            <div className="flex items-center gap-6 min-w-[300px]">
                                <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                                    <Building2 className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-primarycolor uppercase tracking-tight">{shop.name}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{shop.branch || 'Main Branch'}</p>
                                </div>
                            </div>

                            {/* Financial Stats */}
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Distributed</p>
                                    <p className="text-base font-black text-primarycolor">{shop.totalValue.toLocaleString()} ETB</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Collected</p>
                                    <p className="text-base font-black text-emerald-700">{shop.totalPaid.toLocaleString()} ETB</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                                    <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mb-1">Current Debt</p>
                                    <p className="text-base font-black text-rose-700">{shop.totalDebt.toLocaleString()} ETB</p>
                                </div>
                            </div>

                            {/* Collection Progress */}
                            <div className="flex items-center gap-6 min-w-[150px]">
                                <div className="relative size-16">
                                    <svg className="size-full" viewBox="0 0 100 100">
                                        <circle className="text-slate-100 stroke-current" strokeWidth="12" cx="50" cy="50" r="40" fill="transparent"></circle>
                                        <circle 
                                            className="text-primarycolor stroke-current" 
                                            strokeWidth="12" 
                                            strokeDasharray={251.2} 
                                            strokeDashoffset={251.2 - (251.2 * shop.collectionRate) / 100} 
                                            strokeLinecap="round" 
                                            cx="50" cy="50" r="40" 
                                            fill="transparent" 
                                            transform="rotate(-90 50 50)"
                                        ></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primarycolor">
                                        {Math.round(shop.collectionRate)}%
                                    </div>
                                </div>
                                <ShopFinanceDetailLink shopId={shop.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
