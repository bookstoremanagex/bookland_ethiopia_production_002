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
                            bookeditionprinters: {
                                where: { is_deleted: false },
                                include: { printer: true },
                            },
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

    const [books, editions, printers] = await Promise.all([
        (prisma as any).books.findMany({
            where: { is_deleted: false },
            orderBy: { title: "asc" },
            include: {
                bookedition: {
                    where: { is_deleted: false },
                },
            },
        }),
        (prisma as any).bookedition.findMany({
            where: { is_deleted: false },
            include: {
                books: true,
                bookeditionprinters: {
                    where: { is_deleted: false },
                    include: { printer: true },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        (prisma as any).printer.findMany({
            where: { is_deleted: false },
            orderBy: { name: "asc" },
        }),
    ]);

    const isAutoDeliveryOrder = (order: any): boolean => {
        const name = order.project_name || "";
        return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
    };

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

    const items = orders
        .filter((o: any) => !isAutoDeliveryOrder(o))
        .flatMap((order: any) =>
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

            const edition = item.bookedition as any;
            const printerStocks = edition?.bookeditionprinters || [];

            const totalPrint = parseInt(edition?.total_print_count) || 0;
            const inStore = parseInt(edition?.count_remening_for_transfer) || 0;

            const assignedStock =
                edition?.bookeditionprinters?.reduce(
                    (sum: number, p: any) => sum + (parseInt(p.quantity) || 0),
                    0
                ) || 0;

            return {
                id: item.id,
                editionId: edition?.id ?? item.id,
                orderId: order.id,
                projectName:
                    order.project_name || `Project #${order.id}`,
                printerName: order.printer?.name || "",
                printerLocation: order.printer?.location || "",
                bookTitle,
                editionName,
                quantity: qty,
                pricePerBook: ppb,
                totalPrice,
                status: item.status || "NOT_STARTED",
                remaining:
                    edition?.count_remening_for_transfer ?? null,
                createdAt:
                    order.createdAt?.toISOString?.() || order.createdAt,
                paidAmount: editionPaidMap[editionLabel] || 0,
                totalPrinterStock: assignedStock,
                totalPrintCount: totalPrint,
                inStore: inStore,
                printerStocks,
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

    // Editions already present in a project (from the orders above)
    const projectEditionIds = new Set(deduped.map((d: any) => d.editionId));

    // Build rows for editions that exist but are NOT in any print project
    const notInProject = editions
        .filter((ed: any) => !projectEditionIds.has(ed.id))
        .map((ed: any) => {
            const printerStocks = ed.bookeditionprinters || [];
            const assignedStock = printerStocks.reduce(
                (sum: number, p: any) => sum + (parseInt(p.quantity) || 0),
                0
            );
            return {
                id: ed.id,
                editionId: ed.id,
                orderId: 0,
                projectName: "",
                printerName: "",
                printerLocation: "",
                bookTitle: ed.books?.title || "Unknown Book",
                editionName: ed.edition_name || "Unknown Edition",
                quantity: 0,
                pricePerBook: 0,
                totalPrice: 0,
                status: "NOT_IN_PROJECT",
                remaining: parseInt(ed.count_remening_for_transfer) || 0,
                createdAt: ed.createdAt?.toISOString?.() || String(ed.createdAt || ""),
                paidAmount: 0,
                totalPrinterStock: assignedStock,
                totalPrintCount: parseInt(ed.total_print_count) || 0,
                inStore: parseInt(ed.count_remening_for_transfer) || 0,
                printerStocks,
            };
        });

    // Rows for books that have NO editions at all (still found in system)
    const notAssignedBooks = books
        .filter((b: any) => !(b.bookedition || []).some((e: any) => projectEditionIds.has(e.id)))
        .map((b: any) => ({
            id: -b.id,
            editionId: -b.id,
            orderId: 0,
            projectName: "",
            printerName: "",
            printerLocation: "",
            bookTitle: b.title || "Unknown Book",
            editionName: "—",
            quantity: 0,
            pricePerBook: 0,
            totalPrice: 0,
            status: "NOT_IN_PROJECT",
            remaining: 0,
            createdAt: "",
            paidAmount: 0,
            totalPrinterStock: 0,
            totalPrintCount: 0,
            inStore: 0,
            printerStocks: [],
        }));

    const allItems = [...deduped, ...notInProject, ...notAssignedBooks];

    // Available target projects = all non-deleted, non-auto-delivery print orders
    const availableProjects = orders
        .filter((o: any) => !isAutoDeliveryOrder(o) && o.is_deleted === false)
        .map((o: any) => ({
            id: o.id,
            projectName: o.project_name || `Project #${o.id}`,
            printerName: o.printer?.name || "",
        }));

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
            <PrintingBooksListTable items={allItems} printers={printers} projects={availableProjects} />
        </div>
    );
}
