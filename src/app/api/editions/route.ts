import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const editions = await (prisma as any).bookedition.findMany({
            where: { is_deleted: false },
            include: { books: true },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, data: editions });
    } catch {
        return NextResponse.json({ success: false, data: [] });
    }
}
