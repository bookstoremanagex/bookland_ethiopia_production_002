import prisma from "@/lib/prisma";
import { FileText, Banknote } from "lucide-react";

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
            author: book.author,
            bookCost,
            editionCost,
            totalCost: bookCost + editionCost,
            editionCount: book.bookedition.length,
        };
    });

    const grandTotal = data.reduce((s, r) => s + r.totalCost, 0);

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Banknote className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Books</p>
                        <h2 className="text-2xl font-black text-primarycolor italic mt-2">{data.length}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-primarycolor/5 shadow-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Banknote className="size-16" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total All Costs</p>
                        <h2 className="text-2xl font-black text-rose-500 italic mt-2">ETB {grandTotal.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Costs Table */}
            <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-primarycolor/5">
                    <div className="flex items-center gap-3">
                        <FileText className="size-6 text-primarycolor" />
                        <h2 className="text-lg font-black uppercase tracking-widest">Costs Breakdown</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-primarycolor/5 text-left">
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Book</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Author</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Editions</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Book Cost</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Edition Cost</th>
                                <th className="p-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={row.id} className="border-b border-primarycolor/5 hover:bg-primarycolor/[0.02] transition-colors">
                                    <td className="p-4 font-bold">{row.title}</td>
                                    <td className="p-4 text-muted-foreground">{row.author}</td>
                                    <td className="p-4 text-right font-bold">{row.editionCount}</td>
                                    <td className="p-4 text-right text-muted-foreground">ETB {row.bookCost.toLocaleString()}</td>
                                    <td className="p-4 text-right text-muted-foreground">ETB {row.editionCost.toLocaleString()}</td>
                                    <td className="p-4 text-right font-bold text-rose-500">ETB {row.totalCost.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}