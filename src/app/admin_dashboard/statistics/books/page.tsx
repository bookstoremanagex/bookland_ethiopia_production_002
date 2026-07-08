import { BarChart3 } from "lucide-react";
import { getOrderedBooks } from "@/app/actions/statistics-actions";
import BooksOrderedTable from "./BooksOrderedTable";

export const dynamic = "force-dynamic";

export default async function BooksStatisticsPage() {
    const initialData = await getOrderedBooks("30d");

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Books{" "}
                    <span className="text-secondarycolor not-italic">
                        Ordered
                    </span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Books ordered by shops within selected time period
                </p>
            </div>
            <BooksOrderedTable initialData={initialData} />
        </div>
    );
}
