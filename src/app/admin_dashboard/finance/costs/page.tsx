import prisma from "@/lib/prisma";
import { FileText } from "lucide-react";
import CostsTable from "./CostsTable";

const costFields = [
    "translator_cost", "cover_design_cost", "text_design_cost",
    "editor_cost", "typewriting_cost", "store_cost",
    "distribution_cost", "advertisement_cost", "purchasing_right_cost"
];

function sumCosts(obj: any): number {
    return costFields.reduce((sum, f) => sum + (Number(obj[f]) || 0), 0);
}

export default async function FinanceCostsPage() {
    const books = await (prisma as any).books.findMany({
        where: { is_deleted: false },
        include: {
            bookedition: {
                where: { is_deleted: false }
            }
        }
    });

    const data = (books as any[]).map(book => {
        const bookCost = sumCosts(book);
        const editionCost = (book.bookedition as any[]).reduce((sum, e) => sum + sumCosts(e), 0);
        return {
            id: book.id,
            title: book.title,
            author: book.author || "Unknown",
            totalCost: bookCost + editionCost,
            editionCount: (book.bookedition as any[]).length,
        };
    });

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter italic">
                    Production <span className="text-secondarycolor not-italic">Costs</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Book-level and edition-level cost breakdowns
                </p>
            </div>

            <CostsTable data={data} />
        </div>
    );
}
