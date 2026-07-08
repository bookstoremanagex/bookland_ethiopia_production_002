import { BarChart3 } from "lucide-react";
import { getStoreStats } from "@/app/actions/statistics-actions";
import StoresStatsTable from "./StoresStatsTable";

export const dynamic = "force-dynamic";

export default async function StoresStatisticsPage() {
    const { entries, grandTotal } = await getStoreStats("30d");

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Stores{" "}
                    <span className="text-secondarycolor not-italic">
                        Statistics
                    </span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Approved orders per store within selected time period
                </p>
            </div>
            <StoresStatsTable
                initialData={entries}
                initialGrandTotal={grandTotal}
            />
        </div>
    );
}
