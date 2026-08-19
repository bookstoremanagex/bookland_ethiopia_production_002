import prisma from "@/lib/prisma";
import PrinterPaymentsTable from "./PrinterPaymentsTable";

export const dynamic = "force-dynamic";

function parseOrderId(orderid: string | null | undefined): number | null {
    if (!orderid) return null;
    const match = String(orderid).match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

export default async function PrinterPaymentsPage() {
    const [payments, orders] = await Promise.all([
        (prisma as any).payments.findMany({
            where: { is_for_printer: true, is_deleted: false },
            include: {
                printer: true,
                shop: true,
                check: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        (async () => {
            const paymentRows = await (prisma as any).payments.findMany({
                where: { is_for_printer: true, is_deleted: false },
                select: { orderid: true },
            });
            const orderIds = [
                ...new Set(
                    paymentRows
                        .map((p: any) => parseOrderId(p.orderid))
                        .filter((id: any): id is number => Number.isInteger(id))
                ),
            ];
            if (!orderIds.length) return [];
            return (prisma as any).orders.findMany({
                where: { id: { in: orderIds } },
                select: { id: true, total_amount: true, status: true },
            });
        })(),
    ]);

    const orderMap = Object.fromEntries(
        orders.map((o: any) => [o.id, o])
    );

    const records = payments.map((p: any) => {
        const orderId = parseOrderId(p.orderid);
        return {
            id: p.id,
            printerName: p.printer?.name || "Unknown",
            printerLocation: p.printer?.location || null,
            printerPhone: p.printer?.phone || null,
            printerEmail: p.printer?.email || null,
            orderId,
            orderTotal: orderMap[orderId as number]?.total_amount ?? null,
            orderStatus: orderMap[orderId as number]?.status ?? null,
            shopName: p.shop?.name || "Unknown",
            amount: p.amount,
            paymentType: p.payment_type,
            status: p.status,
            checkInfo: p.check
                ? `${p.check.bankname || "Unknown"} - ${p.check.username || ""}`
                : null,
            createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
            updatedAt: p.updatedAt?.toISOString?.() ?? p.updatedAt,
            memo: p.memo || null,
            printerPaymentMemo: p.printer_payment_memo || null,
            image: p.image || null,
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