import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DamagedBookDetailClient from "./DamagedBookDetailClient";

export const dynamic = "force-dynamic";

export default async function DamagedBookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const reportId = parseInt(id);

    const [report, books, editions, stores] = await Promise.all([
        (prisma as any).damagedbooks.findUnique({
            where: { id: reportId },
            include: {
                books: true,
                bookedition: true,
                stores: true,
                accounts: true
            }
        }),
        (prisma as any).books.findMany({ where: { is_deleted: false } }),
        (prisma as any).bookedition.findMany({ where: { is_deleted: false } }),
        (prisma as any).stores.findMany({ where: { is_deleted: false } })
    ]);

    if (!report || report.is_deleted) {
        notFound();
    }

    return (
        <DamagedBookDetailClient
            report={report}
            books={books}
            editions={editions}
            stores={stores}
        />
    );
}
