import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrinterDetailClient from "./PrinterDetailClient";

export default async function PrinterDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const printerId = parseInt(id);
    
    const printer = await (prisma as any).printer.findUnique({
        where: { id: printerId },
        include: {
            printorder: true
        }
    });

    if (!printer || printer.is_deleted) {
        notFound();
    }

    return (
        <PrinterDetailClient printer={printer} />
    );
}
