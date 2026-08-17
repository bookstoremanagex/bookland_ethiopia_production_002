"use server";

import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "./auth-actions";
import { convertToEthiopian } from "@/lib/calendar-utils";

function backupsDir(): string {
    const dir = path.join(process.cwd(), "local_backups");
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch {
            // Vercel/serverless filesystem may be read-only — non-fatal.
        }
    }
    return dir;
}

function backupFilePath(fileName: string): string {
    return path.join(backupsDir(), fileName);
}

async function ensureBackupContentColumn() {
    try {
        const tables: any[] = await (prisma as any).$queryRawUnsafe(
            "SELECT TABLE_NAME AS t FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'local_backup_records'"
        );
        if (tables.length === 0) {
            await (prisma as any).$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS \`local_backup_records\` (
                    \`id\` INT NOT NULL AUTO_INCREMENT,
                    \`databaseName\` VARCHAR(255) NOT NULL,
                    \`fileSizeBytes\` INT NULL,
                    \`status\` VARCHAR(50) NOT NULL DEFAULT 'success',
                    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (\`id\`),
                    INDEX \`local_backup_records_createdAt_idx\` (\`createdAt\`)
                ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            `);
        }
        const columns: any[] = await (prisma as any).$queryRawUnsafe(
            "SELECT COLUMN_NAME AS c FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'local_backup_records'"
        );
        const hasContent = columns.some((r: any) => r.c === "backupContent");
        if (!hasContent) {
            await (prisma as any).$executeRawUnsafe(
                "ALTER TABLE `local_backup_records` ADD COLUMN `backupContent` LONGTEXT NULL"
            );
        }
    } catch (error) {
        console.error("Failed to ensure backup table/column:", error);
    }
}

function writeBackupFile(fileName: string, sql: string) {
    try {
        const filePath = backupFilePath(fileName);
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }
        fs.writeFileSync(filePath, sql, "utf8");
    } catch (error) {
        console.error("Failed to write backup file to disk (non-fatal):", error);
    }
}

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

const ETHIOPIAN_MONTHS = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታሕሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ",
];

function ethiopianPeriod(date: Date): string {
    const gh = date.getHours();
    if (gh >= 6 && gh < 12) return "ጠዋት";
    if (gh === 12) return "ቀትር";
    if (gh >= 13 && gh < 18) return "ከሰዓት";
    if (gh >= 18 && gh < 21) return "ምሽት";
    if (gh >= 21 || gh < 3) return "ሌሊት";
    return "ማለዳ";
}

function ethiopianClock(date: Date): { h12: number; min: number } {
    const totalMin = date.getHours() * 60 + date.getMinutes();
    const ethMin = totalMin >= 360 && totalMin < 1080
        ? totalMin - 360
        : (totalMin - 1080 + 1440) % 1440;
    const h = Math.floor(ethMin / 60);
    return { h12: h % 12 === 0 ? 12 : h % 12, min: ethMin % 60 };
}

function ethiopianNaturalName(date: Date): string {
    const eth = convertToEthiopian(date);
    const monthName = ETHIOPIAN_MONTHS[eth.month - 1] || "ጳጉሜ";
    const period = ethiopianPeriod(date);
    const { h12, min } = ethiopianClock(date);
    return `${monthName} ${eth.day} ${eth.year} ፣ ${period} ${h12}:${pad(min)}`;
}

function sanitizeFileName(name: string): string {
    return name.replace(/[:\\/]/g, "-").replace(/[*?"<>|]/g, "").trim();
}

function escapeSqlValue(value: any): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "boolean") return value ? "1" : "0";
    if (value instanceof Date) {
        if (isNaN(value.getTime())) return "NULL";
        return `'${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}'`;
    }
    if (Buffer.isBuffer(value)) {
        return `X'${value.toString("hex")}'`;
    }
    const str = String(value);
    const escaped = str.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\0/g, "\\0").replace(/\x1a/g, "\\Z");
    return `'${escaped}'`;
}

async function uniqueBackupFileName(base: string): Promise<string> {
    const ext = ".sql";
    const stem = base.endsWith(ext) ? base.slice(0, -ext.length) : base;
    let candidate = `${stem}${ext}`;
    let counter = 2;
    let exists = await (prisma as any).local_backup_records.count({
        where: { databaseName: candidate },
    });
    while (exists > 0) {
        candidate = `${stem}-${counter}${ext}`;
        counter++;
        exists = await (prisma as any).local_backup_records.count({
            where: { databaseName: candidate },
        });
    }
    return candidate;
}

async function generateSqlDump(): Promise<{ sql: string; databaseName: string }> {
    const now = new Date();
    const eth = convertToEthiopian(now);
    const fileName = await uniqueBackupFileName(`${sanitizeFileName(ethiopianNaturalName(now))}.sql`);

    const tablesResult: any[] = await (prisma as any).$queryRawUnsafe(
        "SELECT table_name AS t FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name"
    );
    const tables: string[] = tablesResult.map((r: any) => r.t);

    const lines: string[] = [];
    lines.push("-- ======================================================");
    lines.push("-- Bookland Ethiopia Database Backup");
    lines.push(`-- Generated: ${now.toISOString()}`);
    lines.push(`-- Ethiopian: ${eth.year}-${pad(eth.month)}-${pad(eth.day)} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    lines.push("-- ======================================================");
    lines.push("");
    lines.push("SET FOREIGN_KEY_CHECKS=0;");
    lines.push("SET NAMES utf8mb4;");
    lines.push("");

    for (const table of tables) {
        const createResult: any[] = await (prisma as any).$queryRawUnsafe(`SHOW CREATE TABLE \`${table}\``);
        const createStmt: string = createResult[0]["Create Table"];
        lines.push(`DROP TABLE IF EXISTS \`${table}\`;`);
        lines.push(createStmt + ";");
        lines.push("");

        const rows: any[] = await (prisma as any).$queryRawUnsafe(`SELECT * FROM \`${table}\``);
        if (rows.length === 0) {
            lines.push("");
            continue;
        }

        const columns = Object.keys(rows[0]);
        const colList = columns.map((c) => `\`${c}\``).join(", ");

        for (let i = 0; i < rows.length; i += 200) {
            const batch = rows.slice(i, i + 200);
            const valueRows = batch.map((row) => {
                const vals = columns.map((c) => escapeSqlValue(row[c]));
                return `(${vals.join(", ")})`;
            });
            lines.push(`INSERT INTO \`${table}\` (${colList}) VALUES`);
            lines.push(valueRows.join(",\n") + ";");
        }
        lines.push("");
    }

    lines.push("SET FOREIGN_KEY_CHECKS=1;");
    lines.push("");

    return { sql: lines.join("\n"), databaseName: fileName };
}

export async function getLastBackupTime() {
    try {
        await ensureBackupContentColumn();
        const record = await (prisma as any).local_backup_records.findFirst({
            where: { status: "success" },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
        });
        const createdAt = record?.createdAt;
        return {
            success: true,
            data: createdAt instanceof Date ? createdAt.toISOString() : createdAt ?? null,
        };
    } catch (error) {
        console.error("Error fetching last backup time:", error);
        return { success: false, data: null };
    }
}

export async function getLocalBackups() {
    try {
        const session = await getCurrentSession();
        if (!session || session.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await ensureBackupContentColumn();

        const backups = await (prisma as any).local_backup_records.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: backups };
    } catch (error) {
        console.error("Error fetching backups:", error);
        return { success: false, error: "Failed to fetch backups" };
    }
}

export async function createLocalBackup() {
    try {
        const session = await getCurrentSession();
        if (!session || session.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await ensureBackupContentColumn();

        let dump: { sql: string; databaseName: string } | null = null;
        try {
            dump = await generateSqlDump();
        } catch (error) {
            console.error("Backup dump generation failed:", error);
            await (prisma as any).local_backup_records.create({
                data: { databaseName: "", status: "failed" },
            });
            return { success: false, error: "Failed to generate backup dump" };
        }

        const fileSizeBytes = Buffer.byteLength(dump.sql, "utf8");
        let recordId: number;
        try {
            writeBackupFile(dump.databaseName, dump.sql);
            const record = await (prisma as any).local_backup_records.create({
                data: {
                    databaseName: dump.databaseName,
                    fileSizeBytes,
                    status: "success",
                },
            });
            recordId = record.id;
            await (prisma as any).$executeRawUnsafe(
                "UPDATE `local_backup_records` SET `backupContent` = ? WHERE `id` = ?",
                dump.sql,
                record.id
            );
        } catch (error) {
            console.error("Failed to save backup:", error);
            try {
                await (prisma as any).local_backup_records.create({
                    data: { databaseName: dump.databaseName, fileSizeBytes, status: "failed" },
                });
            } catch (innerError) {
                console.error("Failed to record failed backup:", innerError);
            }
            return { success: false, error: "Failed to save backup file" };
        }

        return { success: true, data: { id: recordId, fileName: dump.databaseName, fileSizeBytes } };
    } catch (error) {
        console.error("Backup failed:", error);
        try {
            await (prisma as any).local_backup_records.create({
                data: { databaseName: "", status: "failed" },
            });
        } catch (innerError) {
            console.error("Failed to record failed backup:", innerError);
        }
        return { success: false, error: "Backup failed" };
    }
}

export async function deleteLocalBackup(id: number) {
    try {
        const session = await getCurrentSession();
        if (!session || session.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const record = await (prisma as any).local_backup_records.findUnique({
            where: { id },
        });
        if (!record) {
            return { success: false, error: "Backup record not found" };
        }

        if (record.databaseName) {
            try {
                const filePath = backupFilePath(record.databaseName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error("Failed to delete backup file:", error);
            }
        }

        await (prisma as any).local_backup_records.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting backup:", error);
        return { success: false, error: "Failed to delete backup" };
    }
}

export async function getBackupFile(id: number) {
    try {
        const session = await getCurrentSession();
        if (!session || session.role !== "ADMIN") {
            return null;
        }

        const record = await (prisma as any).local_backup_records.findUnique({
            where: { id },
        });
        if (!record || !record.databaseName || record.status !== "success") {
            return null;
        }

        // Prefer DB-stored content (works on serverless where filesystem is ephemeral).
        try {
            const rows: any[] = await (prisma as any).$queryRawUnsafe(
                "SELECT `backupContent` AS c FROM `local_backup_records` WHERE `id` = ?",
                id
            );
            if (rows.length && typeof rows[0].c === "string" && rows[0].c.length > 0) {
                return { fileName: record.databaseName, content: rows[0].c };
            }
        } catch (error) {
            console.error("Failed to read backup content from DB, falling back to disk:", error);
        }

        // Fallback for legacy records that only exist on disk.
        const filePath = backupFilePath(record.databaseName);
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const content = fs.readFileSync(filePath, "utf8");
        return { fileName: record.databaseName, content };
    } catch (error) {
        console.error("Error reading backup file:", error);
        return null;
    }
}