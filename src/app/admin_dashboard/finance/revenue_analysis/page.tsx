import prisma from "@/lib/prisma";
import BookRevenueTable from "./BookRevenueTable";
import EditionRevenueTable from "./EditionRevenueTable";

const costFields = [
    "translator_cost", "cover_design_cost", "text_design_cost",
    "editor_cost", "typewriting_cost", "store_cost",
    "distribution_cost", "advertisement_cost", "purchasing_right_cost"
];

const editionCostFields = [
    "printing_cost", "binding_cost", "design_cost", "translation_cost",
    "editing_cost", "other_expenses", "transportation_cost",
    "translator_cost", "cover_design_cost", "text_design_cost",
    "editor_cost", "typewriting_cost", "store_cost",
    "distribution_cost", "advertisement_cost", "purchasing_right_cost"
];

function sumCosts(obj: any, fields: string[]): number {
    return fields.reduce((sum, f) => sum + (Number(obj[f]) || 0), 0);
}

export default async function RevenueAnalysisPage() {
    const books = await (prisma as any).books.findMany({
        where: { is_deleted: false },
        include: {
            bookedition: {
                where: { is_deleted: false },
                include: {
                    bookshopeditions: {
                        where: { is_deleted: false }
                    },
                    retail_purchase_items: {
                        where: { is_deleted: false }
                    }
                }
            }
        }
    });

    const bookData = (books as any[]).map(book => {
        const bookCost = sumCosts(book, costFields);
        let totalEditionCost = 0;
        let totalRevenue = 0;
        let totalPending = 0;

        for (const edition of book.bookedition) {
            totalEditionCost += sumCosts(edition, editionCostFields);

            for (const bse of edition.bookshopeditions) {
                totalRevenue += Number(bse.total_price) || 0;
                totalPending += Number(bse.remaining_amount) || 0;
            }

            for (const rpi of edition.retail_purchase_items) {
                totalRevenue += (Number(rpi.quantity) || 0) * (Number(rpi.unit_price) || 0);
            }
        }

        const totalCost = bookCost + totalEditionCost;
        const netProfit = totalRevenue - totalCost;

        return {
            id: book.id,
            title: book.title,
            author: book.author || "Unknown",
            totalCost,
            totalRevenue,
            totalPending,
            collected: totalRevenue - totalPending,
            netProfit,
            editionCount: book.bookedition.length
        };
    });

    const editionData = (books as any[]).flatMap(book =>
        book.bookedition.map((edition: any) => {
            const cost = sumCosts(edition, editionCostFields);
            let revenue = 0;
            let pending = 0;

            for (const bse of edition.bookshopeditions) {
                revenue += Number(bse.total_price) || 0;
                pending += Number(bse.remaining_amount) || 0;
            }

            for (const rpi of edition.retail_purchase_items) {
                revenue += (Number(rpi.quantity) || 0) * (Number(rpi.unit_price) || 0);
            }

            const collected = revenue - pending;
            const profit = revenue - cost;

            return {
                id: edition.id,
                edition_name: edition.edition_name,
                book_title: book.title,
                selling_price: edition.selling_price || 0,
                totalCost: cost,
                totalRevenue: revenue,
                totalPending: pending,
                collected,
                profit,
                image: edition.book_image_url
            };
        })
    );

    return (
        <div className="p-4 md:p-10 space-y-12 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Revenue <span className="text-secondarycolor not-italic">Analysis</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Total cost, revenue, and pending payments across books and editions
                </p>
            </div>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-primarycolor/20 to-transparent" />
                </div>
                <BookRevenueTable data={bookData} />
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-primarycolor/20 to-transparent" />
                </div>
                <EditionRevenueTable data={editionData} />
            </section>
        </div>
    );
}
