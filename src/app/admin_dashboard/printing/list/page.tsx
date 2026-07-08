import prisma from "@/lib/prisma";
import PrintingBooksListTable from "./PrintingBooksListTable";

export default async function PrintingBooksListPage() {
    const orders = await (prisma as any).printorder.findMany({
        where: { is_deleted: false },
        include: {
            printer: true,
            printorder_items: {
                include: {
                    bookedition: {
                        include: {
                            books: true,
                        },
                    },
                },
            },
            printorder_payments: {
                orderBy: { payment_date: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const [books, editions] = await Promise.all([
        (prisma as any).books.findMany({
            where: { is_deleted: false },
            orderBy: { title: "asc" },
        }),
        (prisma as any).bookedition.findMany({
            where: { is_deleted: false },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    const editionPaidMap: Record<string, number> = {};
    for (const order of orders) {
        for (const payment of order.printorder_payments || []) {
            if (payment.reference) {
                const match = payment.reference.match(/^\[([^\]]+)\]/);
                if (match) {
                    const label = match[1];
                    editionPaidMap[label] =
                        (editionPaidMap[label] || 0) +
                        (parseFloat(payment.amount) || 0);
                }
            }
        }
    }

    const items = orders.flatMap((order: any) =>
        (order.printorder_items || []).map((item: any) => {
            const qty = parseInt(item.quantity) || 0;
            const ppb = parseFloat(item.price_per_book) || 0;
            const storedTotal = parseFloat(item.total_price);
            const totalPrice = storedTotal > 0 ? storedTotal : qty * ppb;
            const bookTitle =
                item.bookedition?.books?.title || "Unknown Book";
            const editionName =
                item.bookedition?.edition_name || "Unknown Edition";
            const editionLabel = `${bookTitle} — ${editionName}`;

            return {
                id: item.id,
                editionId: item.bookedition?.id ?? item.id,
                orderId: order.id,
                projectName:
                    order.project_name || `Project #${order.id}`,
                printerName: order.printer?.name || "",
                bookTitle,
                editionName,
                quantity: qty,
                pricePerBook: ppb,
                totalPrice,
                status: item.status || "NOT_STARTED",
                remaining:
                    item.bookedition?.count_remening_for_transfer ?? null,
                createdAt:
                    order.createdAt?.toISOString?.() || order.createdAt,
                paidAmount: editionPaidMap[editionLabel] || 0,
            };
        })
    );

    // Deduplicate by editionId — merge quantities and amounts
    const grouped = new Map<number, (typeof items)[number]>();
    for (const item of items) {
        const existing = grouped.get(item.editionId);
        if (existing) {
            existing.quantity += item.quantity;
            existing.totalPrice += item.totalPrice;
            existing.paidAmount += item.paidAmount;
            // keep the most recent createdAt
            if (item.createdAt > existing.createdAt) {
                existing.createdAt = item.createdAt;
                existing.orderId = item.orderId;
                existing.projectName = item.projectName;
                existing.printerName = item.printerName;
            }
        } else {
            grouped.set(item.editionId, { ...item });
        }
    }
    const deduped = Array.from(grouped.values());

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Printing{" "}
                    <span className="text-secondarycolor not-italic">
                        Books List
                    </span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    All books across every print project
                </p>
            </div>
            <PrintingBooksListTable items={deduped} />
        </div>
    );
}
