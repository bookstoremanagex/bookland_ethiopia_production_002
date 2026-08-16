import prisma from "@/lib/prisma";
import TranslationBooksClient from "./TranslationBooksClient";

export const dynamic = "force-dynamic";

export default async function TranslationBooksPage() {
    const books = await (prisma as any).books.findMany({
        where: {
            is_deleted: false,
            productionstatus: "TRANSLATION",
        },
        orderBy: { createdAt: "desc" },
    });

    const serialized = books.map((b: any) => ({
        id: b.id,
        unique_identification_code: b.unique_identification_code,
        title: b.title,
        author: b.author,
        language: b.language,
        category: b.category,
        publication_year: b.publication_year,
        isbn: b.isbn,
        status: b.status,
        productionstatus: b.productionstatus,
        createdAt: b.createdAt.toISOString(),
    }));

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Translation{" "}
                        <span className="text-secondarycolor not-italic">Books</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Books currently in translation phase
                    </p>
                </div>
            </div>
            <TranslationBooksClient books={serialized} />
        </div>
    );
}
