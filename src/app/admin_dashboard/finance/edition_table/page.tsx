import prisma from "@/lib/prisma";
import EditionFinanceTable from "./EditionFinanceTable";

export default async function FinanceEditionTablePage() {
    const editions = await (prisma as any).bookedition.findMany({
        where: { is_deleted: false },
        include: {
            books: true
        }
    });

    const data = (editions as any[]).map(edition => {
        const totalCost = (
            (edition.production_price || 0) +
            (edition.printing_cost || 0) +
            (edition.binding_cost || 0) +
            (edition.design_cost || 0) +
            (edition.editing_cost || 0) +
            (edition.transportation_cost || 0) +
            (edition.translation_cost || 0) +
            (edition.other_expenses || 0)
        );

        const profitPerBook = (edition.selling_price || 0) - totalCost;
        const totalProfit = profitPerBook * (edition.total_print_count || 0);

        return {
            id: edition.id,
            edition_name: edition.edition_name,
            book_title: edition.books.title,
            selling_price: edition.selling_price || 0,
            total_cost: totalCost,
            profit_per_book: profitPerBook,
            total_print_count: edition.total_print_count || 0,
            total_profit: totalProfit,
            image: edition.book_image_url
        };
    });

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Production <span className="text-secondarycolor not-italic">Profitability</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Comprehensive analysis of production costs vs market revenue per edition
                </p>
            </div>
            
            <EditionFinanceTable data={data} />
        </div>
    );
}
