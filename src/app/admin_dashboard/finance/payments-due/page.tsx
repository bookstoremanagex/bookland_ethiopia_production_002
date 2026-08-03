import { getAllShopsDebt } from "@/app/actions/order-actions";
import PaymentsDueTable from "./PaymentsDueTable";

export default async function PaymentsDuePage() {
    const res = await getAllShopsDebt();

    if (!res.success) {
        return (
            <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4">
                    <p className="text-destructive font-black text-xl uppercase">Failed to Load Payments Due</p>
                    <p className="text-muted-foreground font-bold">{(res as any).error}</p>
                </div>
            </div>
        );
    }

    const data = res.data || [];

    data.sort((a, b) => b.totalDebt - a.totalDebt);

    const totalOrderDebt = data.reduce((sum, s) => sum + s.orderDebt, 0);
    const totalRoundDebt = data.reduce((sum, s) => sum + s.roundDebt, 0);
    const totalPreviousDebt = data.reduce((sum, s) => sum + s.previousDebt, 0);
    const totalDebt = totalOrderDebt + totalRoundDebt + totalPreviousDebt;

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
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Prev. Debt</p>
                        <p className="text-lg font-black text-purple-500">{totalPreviousDebt.toLocaleString()} <span className="text-xs opacity-40">ETB</span></p>
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
