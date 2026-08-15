import { TrendingUp } from "lucide-react";
import { getTopSellers } from "@/app/actions/top-sellers-actions";
import TopSellersTable from "./TopSellersTable";

export const dynamic = "force-dynamic";

export default async function TopTwentyPercentPage() {
    const initialData = await getTopSellers("this_month");

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <div className="flex items-center gap-3 text-secondarycolor">
                    <TrendingUp className="size-8" />
                    <span className="text-sm font-black uppercase tracking-[0.3em] opacity-50">
                        80 / 20 Analysis
                    </span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Top{" "}
                    <span className="text-secondarycolor not-italic">20%</span>{" "}
                    Sellers
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Top 20% of books driving sales (orders + round selling, approved only) in the selected period
                </p>
            </div>
            <TopSellersTable initialData={initialData} />
        </div>
    );
}