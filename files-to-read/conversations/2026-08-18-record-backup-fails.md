# Conversation — 2026-08-18 record-backup-fails

## Summary
User reported that creating a backup ("Record Backup" / "New Backup") fails, describing it as "schema does not match the data", and asked to alter the `local_backup_records` model in `prisma/schema.prisma`.

## Diagnosis (root cause — NOT a schema mismatch)
- Inspected `local_backup_records` table structure directly in BOTH the active DB (`newdatabase`) and `bookland_main_db`: columns are exactly `id, databaseName, fileSizeBytes, status, createdAt` — identical to the Prisma model. Inserts/deletes on the table work fine.
- Reproduced the real failure: `generateSqlDump()` ran one big `SELECT * FROM <table>` per table. On `activityLogs` (and later `notification`) the query exceeded MySQL `max_statement_time` (20s) → `Query execution was interrupted (max_statement_time exceeded)` → dump aborted → backup failed.
- Verified: `SELECT * FROM activityLogs` times out; chunked (keyed) selects complete all 41 tables.

## Fix
- `src/app/actions/backup-actions.ts` — `generateSqlDump()` now reads each table in small keyed batches:
  - Resolves the table's PRIMARY KEY via `information_schema`.
  - Batches rows with `WHERE <pk> > lastId ORDER BY <pk> ASC LIMIT 100` so no single statement nears the 20s limit.
  - Tables without a PK fall back to a single `LIMIT 100` pass.
  - INSERT emission logic unchanged (still 100-row INSERTs, same escaping).

## Files changed
- `src/app/actions/backup-actions.ts`

## Verification
- `npx eslint src/app/actions/backup-actions.ts` clean; `npx tsc --noEmit` clean.
- Replicated the new dump logic against `newdatabase`: all 41 tables dumped (14,896 rows, ~4.8 MB SQL) with no statement-timeout failures. Slowest tables: notification (~171s), activityLogs (~56s). Total ~6.5 min due to slow shared host.
- Explicitly did NOT modify `prisma/schema.prisma` — the model already matches both DBs; changing it would create a real mismatch.

## Blockers / notes
- Full backup takes ~6.5 minutes on this host (large LONGTEXT on notification/activityLogs + slow network). Works, but slow. If ever deployed to Vercel, server-action duration limits would need addressing.
- Generated Prisma client is still stale re: `locked_editions` / printer-payment fields (pre-existing, unrelated).
