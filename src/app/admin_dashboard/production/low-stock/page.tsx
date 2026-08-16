import prisma from "@/lib/prisma";
import { AlertTriangle, PackageX } from "lucide-react";
import { LowStockTable } from "@/components/admin_dashboard_components/LowStockTable";
import { LowStockFilters } from "./LowStockFilters";
import { THRESHOLD_OPTIONS, DEFAULT_THRESHOLD } from "./low-stock-constants";

export const dynamic = "force-dynamic";

export default async function ProductionLowStockPage({
    searchParams,
}: {
    searchParams: Promise<{ threshold?: string; includeTransfer?: string }>;
}) {
    const params = await searchParams;
    const requestedThreshold = parseInt(params.threshold || "", 10);
    const threshold = THRESHOLD_OPTIONS.includes(requestedThreshold)
        ? requestedThreshold
        : DEFAULT_THRESHOLD;
    const includeTransfer = params.includeTransfer === "1";

    const [rawInventory, centralEditions] = await Promise.all([
        (prisma as any).bookeditionstores.findMany({
            where: { is_deleted: false },
            include: {
                bookedition: { include: { books: true } },
            },
        }),
        includeTransfer
            ? (prisma as any).bookedition.findMany({
                  where: { is_deleted: false, count_remening_for_transfer: { gt: 0 } },
                  include: { books: true },
              })
            : Promise.resolve([]),
    ]);

    // Aggregate all edition/store inventory per book
    const bookStockMap = new Map<number, { book: any; total: number; central: number; editionCount: number }>();
    for (const entry of rawInventory || []) {
        const book = entry.bookedition?.books;
        const bookId = book?.id;
        if (!bookId) continue;
        const existing = bookStockMap.get(bookId);
        if (existing) {
            existing.total += entry.quantity || 0;
            existing.editionCount += 1;
        } else {
            bookStockMap.set(bookId, { book, total: entry.quantity || 0, central: 0, editionCount: 1 });
        }
    }

    // When requested, add copies available to transfer (printed but not yet in the store).
    // Start from the editions that still hold central stock, so books with no store
    // inventory yet are also included.
    if (includeTransfer) {
        for (const edition of centralEditions || []) {
            const book = edition?.books;
            const bookId = book?.id;
            if (!bookId) continue;
            const existing = bookStockMap.get(bookId);
            if (existing) {
                existing.central += Number(edition.count_remening_for_transfer || 0);
            } else {
                bookStockMap.set(bookId, {
                    book,
                    total: 0,
                    central: Number(edition.count_remening_for_transfer || 0),
                    editionCount: 1,
                });
            }
        }
    }

    const lowStockBooks = Array.from(bookStockMap.values())
        .map((bs) => ({
            ...bs,
            total: includeTransfer ? bs.total + bs.central : bs.total,
        }))
        .filter((bs) => bs.total < threshold)
        .sort((a, b) => a.total - b.total);

    const items = lowStockBooks.map((bs) => ({
        id: bs.book.id,
        bookTitle: bs.book.title || "Unknown",
        author: bs.book.author || "",
        bookImage: bs.book.book_image_url || null,
        totalQuantity: bs.total,
        editionCount: bs.editionCount,
        uniqueCode: bs.book.unique_identification_code || "",
    }));

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-secondarycolor">
                        <AlertTriangle className="size-8" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] opacity-50">Operations</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Low <span className="text-secondarycolor not-italic">Stock</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-lg">
                        Books with fewer than {threshold} copies in total across all stores.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-3xl border-2 border-primarycolor/10 shadow-lg">
                    <div className="flex flex-col items-center px-6 border-r-2 border-primarycolor/5">
                        <span className="text-2xl font-black text-primarycolor">{items.length}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Low Stock Books</span>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <PackageX className="size-6 text-amber-500 animate-pulse mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Copies Left</span>
                        <span className="text-2xl font-black text-amber-600">
                            {items.reduce((acc: number, b: any) => acc + b.totalQuantity, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-8 space-y-8">
                <LowStockFilters threshold={threshold} includeTransfer={includeTransfer} />
                <LowStockTable items={items} />
            </div>
        </div>
    );
}
