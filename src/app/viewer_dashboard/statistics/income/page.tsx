import { BarChart3 } from "lucide-react";
import { getIncomeStats } from "@/app/actions/statistics-actions";
import IncomeStats from "./IncomeStats";

export const dynamic = "force-dynamic";

export default async function IncomeStatisticsPage() {
    const { entries, grandTotal, totalPayments } = await getIncomeStats("30d");

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Income{" "}
                    <span className="text-secondarycolor not-italic">
                        Statistics
                    </span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Approved payments broken down by type
                </p>
            </div>
            <IncomeStats
                initialEntries={entries}
                initialGrandTotal={grandTotal}
                initialTotalPayments={totalPayments}
            />
        </div>
    );
}
