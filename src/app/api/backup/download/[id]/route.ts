import { NextRequest, NextResponse } from "next/server";
import { getBackupFile } from "@/app/actions/backup-actions";

export const dynamic = "force-dynamic";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const backupId = Number(id);
    if (!Number.isInteger(backupId)) {
        return new NextResponse("Invalid backup id", { status: 400 });
    }

    const file = await getBackupFile(backupId);
    if (!file) {
        return new NextResponse("Backup file not found", { status: 404 });
    }

    const buffer = Buffer.from(file.content, "utf8");
    const asciiName = file.fileName.replace(/[^\x20-\x7E]/g, "_");
    const encodedName = encodeURIComponent(file.fileName).replace(/'/g, "%27");

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": "application/sql",
            "Content-Length": String(buffer.length),
            "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
        },
    });
}