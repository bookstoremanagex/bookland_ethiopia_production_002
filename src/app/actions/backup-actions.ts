"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "./auth-actions";
import { convertToEthiopian } from "@/lib/calendar-utils";

async function ensureBackupTable() {
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
    } catch (error) {
        console.error("Failed to ensure backup table:", error);
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
        "SELECT table_name AS t FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name <> 'local_backup_records' ORDER BY table_name"
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

        // Read rows in small keyed batches so no single statement exceeds the
        // MySQL max_statement_time limit (large tables like activityLogs /
        // notification used to abort the whole dump).
        const pkResult: any[] = await (prisma as any).$queryRawUnsafe(
            "SELECT COLUMN_NAME AS c FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND COLUMN_KEY = 'PRI' LIMIT 1",
            table
        );
        const pk: string | null = pkResult[0]?.c ?? null;
        const BATCH = 100;

        let lastId = 0;
        let keepGoing = true;
        while (keepGoing) {
            const rows: any[] = pk
                ? await (prisma as any).$queryRawUnsafe(
                      `SELECT * FROM \`${table}\` WHERE \`${pk}\` > ${lastId} ORDER BY \`${pk}\` ASC LIMIT ${BATCH}`
                  )
                : await (prisma as any).$queryRawUnsafe(
                      `SELECT * FROM \`${table}\` LIMIT ${BATCH}`
                  );

            if (rows.length === 0) break;

            const columns = Object.keys(rows[0]);
            const colList = columns.map((c) => `\`${c}\``).join(", ");

            const valueRows = rows.map((row) => {
                const vals = columns.map((c) => escapeSqlValue(row[c]));
                return `(${vals.join(", ")})`;
            });
            lines.push(`INSERT INTO \`${table}\` (${colList}) VALUES`);
            lines.push(valueRows.join(",\n") + ";");

            if (pk) {
                lastId = Number(rows[rows.length - 1][pk]);
                keepGoing = rows.length >= BATCH;
            } else {
                keepGoing = false;
            }
        }
        lines.push("");
    }

    lines.push("SET FOREIGN_KEY_CHECKS=1;");
    lines.push("");

    return { sql: lines.join("\n"), databaseName: fileName };
}

export async function getLastBackupTime() {
    try {
        await ensureBackupTable();
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

        await ensureBackupTable();

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

        await ensureBackupTable();

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
            const record = await (prisma as any).local_backup_records.create({
                data: {
                    databaseName: dump.databaseName,
                    fileSizeBytes,
                    status: "success",
                },
            });
            recordId = record.id;
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

        return {
            success: true,
            data: { id: recordId, fileName: dump.databaseName, fileSizeBytes, content: dump.sql },
        };
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