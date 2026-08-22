import prisma from "@/lib/prisma";
import PrinterPaymentsTable from "./PrinterPaymentsTable";

export const dynamic = "force-dynamic";

function parseOrderId(orderid: string | null | undefined): number | null {
    if (!orderid) return null;
    const match = String(orderid).match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

export default async function PrinterPaymentsPage() {
    // Source of truth is now payment_records_from_shop_to_printer — merge same order + same printer
    const rawRecords = await (prisma as any).payment_records_from_shop_to_printer.findMany({
        where: { is_deleted: false },
        include: {
            printer: true,
            shop: true,
            orders: { select: { id: true, total_amount: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const orderIds = [...new Set((rawRecords as any[]).map((r) => r.orderId).filter((id: any): id is number => Number.isInteger(id)))];
    const orders = orderIds.length
        ? await (prisma as any).orders.findMany({
              where: { id: { in: orderIds } },
              select: { id: true, total_amount: true, status: true },
          })
        : [];

    const orderMap = Object.fromEntries(orders.map((o: any) => [o.id, o]));

    // Individual records (one row per payment) — client will group when toggle is on
    const records = (rawRecords as any[]).map((r) => {
        const orderId: number | null = r.orderId ?? r.orders?.id ?? null;
        const amt = Number(r.amount || 0);
        const entry = {
            id: r.id,
            amount: amt,
            memo: r.memo || null,
            status: r.status || "PENDING",
            createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
            updatedAt: r.updatedAt?.toISOString?.() ?? r.updatedAt,
        };
        return {
            id: r.id,
            printerName: r.printer?.name || "Unknown",
            printerLocation: r.printer?.location || null,
            printerPhone: r.printer?.phone || null,
            printerEmail: r.printer?.email || null,
            orderId,
            orderTotal: orderId != null ? orderMap[orderId]?.total_amount ?? r.orders?.total_amount ?? null : null,
            orderStatus: orderId != null ? orderMap[orderId]?.status ?? r.orders?.status ?? null : null,
            shopName: r.shop?.name || "Unknown",
            amount: amt,
            paymentType: "SHOP_TO_PRINTER",
            status: r.status || "PENDING",
            checkInfo: null,
            createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
            updatedAt: r.updatedAt?.toISOString?.() ?? r.updatedAt,
            memo: r.memo || null,
            printerPaymentMemo: r.memo || null,
            image: null,
            count: 1,
            entries: [entry],
        };
    });

    return (
        <div className="p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Printing{" "}
                    <span className="text-secondarycolor not-italic">
                        Payments
                    </span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Payments recorded to printers
                </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm">
                <PrinterPaymentsTable payments={records} />
            </div>
        </div>
    );
}