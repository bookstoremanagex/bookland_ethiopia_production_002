# 06 — Config and environment

> **Scope:** env vars, third-party services, deployment.
> See [`00-overview.md` §3](./00-overview.md) for the quick-start.

---

## 1. Environment variables

### 1.1 The complete list

The entire codebase references **exactly three** environment variables. There is **no
`.env.example`**, so this table is the only reference.

| Variable | Required | Default | Read by | Purpose |
|---|---|---|---|---|
| **`DATABASE_URL`** | ✅ | — | `prisma/schema.prisma` (`env("DATABASE_URL")`); `src/app/page.tsx:9` | MySQL connection string for Prisma |
| **`BLOB_READ_WRITE_TOKEN`** | ✅ for uploads | — | `@vercel/blob` SDK (implicit — never referenced by `process.env` in source) | Read/write token for the Vercel Blob store `bookland-ethiopia-productio-blob` |
| `BCRYPT_SALT_ROUNDS` | ❌ | `"10"` | 6 files (see below) | bcryptjs cost factor for password hashing |

Optional — **build/CI scripts only**, never used by the app:

| Variable | Default | Used by | Purpose |
|---|---|---|---|
| `REQUIRE_DATABASE` | `undefined` | `scripts/check-database.mjs:5` | `"true"` → exit 1 when the DB is unreachable |
| `DATABASE_CHECK_TIMEOUT_MS` | `8000` | `scripts/check-database.mjs:6` | Timeout for the `SELECT 1` probe |
| `CHECK_DATABASE_ON_BUILD` | `undefined` | `scripts/check-database.mjs:10` | `"true"` forces the check to run on Vercel/CI |
| `VERCEL`, `CI` | set by the platform | `scripts/check-database.mjs:10` | Presence **skips** the DB check unless the var above is `"true"` |

`NODE_ENV` is referenced once (`auth-actions.ts:91`, the `secure` cookie flag) but is set by
Next.js, not by you.

### 1.2 Explicitly absent

Verified absent from the entire repository:

```
NEXT_PUBLIC_*   NEXTAUTH_SECRET   AUTH_SECRET   JWT_SECRET   SESSION_SECRET
SMTP_*   AWS_*   GOOGLE_*   STRIPE_*   REDIS_*   SENTRY_*   VERCEL_*  (other than the
CI-skip flag in check-database.mjs)
```

⚠️ **There is no secret to sign the session cookie with.** See
[`04-auth-and-permissions.md` §2.4](./04-auth-and-permissions.md).

### 1.3 The actual `.env`

Three keys, gitignored via `.env*`:

```bash
BCRYPT_SALT_ROUNDS=…
DATABASE_URL=mysql://…
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_…
```

`.env` is correctly untracked (`git ls-files .env` → 0 results).

### 1.4 `BCRYPT_SALT_ROUNDS` consumers

```
src/app/actions/admin_dashboard/profile/actions.ts
src/app/actions/admin_dashboard/settings/accounts/[id]/actions.ts
src/app/actions/admin_dashboard/settings/accounts/add_account/actions.ts
src/app/inventory_manager_dashboard/profile/actions.ts
src/app/printer_full/profile/actions.ts
src/app/viewer_dashboard/profile/actions.ts
```

All use `parseInt(process.env.BCRYPT_SALT_ROUNDS || "10")`. Note
`delivery_dashboard_full/profile/actions.ts` is the exception — it has no password-change action.

### 1.5 The `DATABASE_URL`-to-the-client leak

`src/app/page.tsx` reads the connection string and passes it to a **client component**:

```tsx
// src/app/page.tsx:9-15
const databaseUrl = process.env.DATABASE_URL ?? "";
return <LoginPageClient printerName={…} printerFetchFailed={…} databaseUrl={databaseUrl} />;
```

`LoginPageClient.tsx:12` types the prop and destructures it. It is never rendered to the DOM, but
**React serializes props passed to client components into the RSC flight payload** — so the raw
MySQL connection string (host, user, password) is served to every visitor of `/`. **Remove the
prop.** It has no legitimate use.

### 1.6 Templates for a new environment

```bash
# .env  — copy this; there is no checked-in example
BCRYPT_SALT_ROUNDS=10
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/bookland?connection_limit=10"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_…"
```

⚠️ `DATABASE_URL` is a MySQL/MariaDB URL. `AGENTS.md` says PostgreSQL — that is wrong; the
schema's `datasource db` uses `provider = "mysql"`.

---

## 2. Third-party services

### 2.1 Vercel Blob — the only external service

| | |
|---|---|
| SDK | `@vercel/blob@^2.3.3` (2.3.3) |
| Store | `bookland-ethiopia-productio-blob` (the typo "productio" is in the real bucket name) |
| Host | `bookland-ethiopia-productio-blob.public.blob.vercel-storage.com` |
| Access | **`public`** on every upload |
| Allowed in `next/image` | `next.config.ts:8-10` |

**Every upload** uses the same shape:

```ts
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
const fileExtension = file.name.split(".").pop();               // trusted from the client
const cleanFileName = `<folder>/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
const blob = await put(cleanFileName, buffer, { access: "public" });
```

| Prefix | Written by | Auth |
|---|---|---|
| `book_covers/` | `uploadBookImageAction` — `book-actions.ts:24` | **none** |
| `checks/` | `uploadCheckImageAction` — `check-actions.ts:73` **and** `POST /api/upload-check-image` | **none** |
| `payment_receipts/` | `POST /api/upload-payment-image` | **none** |
| `invoices/` | `uploadInvoiceImageAction` — `invoice-actions.ts:22` | **none** |

**No validation anywhere**: no MIME check, no size limit, no extension whitelist, and the whole
file is buffered into memory via `arrayBuffer()` before upload. The two `/api/upload-*` route
handlers are outside the middleware auth matcher, so they accept unauthenticated uploads of
arbitrary files to a public bucket.

**Deletion** happens in exactly one place — `deleteBlobIfExists` in `book-actions.ts:11-21`:
only acts if the URL contains `public.blob.vercel-storage.com`, then `del(url)`, and **never
throws**. It is called by `updateBook` (only when the cover URL actually changed) and
`deleteBook`.

Orphaned blobs: `deleteBook` handles the cover; **`invoice-actions.ts` imports `del` but never
uses it**, so deleting an invoice orphans its attachment. `check` and `payment` blobs are never
deleted at all.

### 2.2 Everything else: none

No auth provider, no payment gateway, no email/SMTP, no analytics, no error tracking, no
object store other than Vercel Blob, no external API.

Hosts appearing in source are **static assets or seed placeholders, not runtime calls**:

| Host | Where | Nature |
|---|---|---|
| `images.unsplash.com` | 4 × `books/[id]/EditableBookContent.tsx` | placeholder cover images |
| `fonts.googleapis.com` / `fonts.gstatic.com` | `stores/options/PrintContentDialog.tsx` ×2 | fonts inside generated print HTML |
| `picsum.photos` | `src/lib/seed.ts` | seed placeholders |
| `www.transparenttextures.com` | `BasicInfo.tsx` ×2 | texture swatches |
| `example.com` | `document_management/invoices/page.tsx`, `AddBookForm.tsx` | placeholder field values |
| `www.w3.org` | 5 files | SVG/XML namespace URIs |

---

## 3. Build configuration

### 3.1 `next.config.ts`

```ts
const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { remotePatterns: [ new URL("https://bookland-ethiopia-productio-blob.public.blob.vercel-storage.com/**") ] },
  // Custom Prisma output (prisma/schema.prisma → src/generated/prisma).
  outputFileTracingIncludes: { "**": ["./src/generated/prisma/**/*"] },
  serverExternalPackages: ["@prisma/client", "prisma"],
};
```

| Key | Effect |
|---|---|
| `eslint.ignoreDuringBuilds: true` | **Lint errors can never fail `next build`.** `npm run lint` must be run manually. |
| `images.remotePatterns` | Only the Vercel Blob host is allowed for `next/image`. |
| `outputFileTracingIncludes` | Traces `src/generated/prisma` so the committed client ships to Vercel. The comment notes: *"Only trace the generated client folder (not all of `@prisma/client` — that slows Vercel builds heavily)"*. |
| `serverExternalPackages` | Keeps Prisma out of the bundler. |

Not present: `redirects`, `rewrites`, `headers`, `env`, `output: 'standalone'`.

### 3.2 `tsconfig.json`

| Setting | Value |
|---|---|
| `target` | `ES2017` |
| `module` / `moduleResolution` | `esnext` / `bundler` |
| `jsx` | `preserve` |
| `strict` | **`true`** |
| `noEmit` | `true` |
| `allowJs` | `true` |
| `skipLibCheck` | `true` |
| `isolatedModules` / `esModuleInterop` / `resolveJsonModule` / `incremental` | all `true` |
| Paths | `"@/*": ["./src/*"]` |

**Not enabled:** `noUncheckedIndexedAccess`, `noImplicitOverride`,
`noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`, `noUnusedLocals`,
`noUnusedParameters`.

### 3.3 `eslint.config.mjs`

Flat config (ESLint 9) via `FlatCompat` from `@eslint/eslintrc`.

- `ignores: ["src/generated/prisma/**"]` — *"Prisma client output — CommonJS and generated types;
  not project-authored code."*
- Extends `next/core-web-vitals`, `next/typescript`
- Overrides: `@typescript-eslint/no-explicit-any: "off"`,
  `no-unused-vars: "warn"`, `react/no-unescaped-entities: "off"`

`npm run lint` is a bare `eslint` with no path argument.

### 3.4 Tailwind v4 — CSS-first, no config file

```
postcss.config.mjs  →  { plugins: { "@tailwindcss/postcss": {} } }
```

There is **no `tailwind.config.js/.ts/.mjs`**. All configuration lives in
`src/app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-primarycolor: #408A71;
  --color-secondarycolor: #285A48;
  --color-badgecolor: #059669;
  --color-toastbg: …;  --color-toasttext: …;
  --color-tertiarycolor: #B0E4CC;
  --color-quaternarycolor: #091413;
  /* … oklch() neutral scale + radius scale … */
}
```

`components.json` confirms `"tailwind": { "config": "" }`.

### 3.5 `components.json` (shadcn)

```json
{ "style": "new-york", "rsc": true, "tsx": true,
  "tailwind": { "css": "src/app/globals.css", "baseColor": "neutral",
                "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "aliases": { "components": "@/components", "ui": "@/components/ui",
               "utils": "@/lib/utils", "lib": "@/lib", "hooks": "@/hooks" } }
```

⚠️ `shadcn` (the CLI, 4.7.0) is a **runtime dependency**, not a devDependency.

### 3.6 `.vscode/settings.json`

```json
{ "prisma.pinToPrisma6": true }
```

That is the entire file — it pins the VS Code Prisma extension to Prisma 6 tooling. `.vscode/`
is **not** gitignored, so it is committed.

---

## 4. Build and run scripts

```json
"postinstall":            "prisma generate",
"dev":                    "next dev --turbopack",
"build":                  "prisma generate && node scripts/verify-prisma-engines.mjs && next build",
"build:turbo":            "prisma generate && node scripts/verify-prisma-engines.mjs && next build --turbopack",
"start":                  "next start",
"lint":                   "eslint",
"check:database":         "node scripts/check-database.mjs",
"verify:prisma-engines":  "node scripts/verify-prisma-engines.mjs"
```

| Script | What it actually does |
|---|---|
| `postinstall` | `prisma generate` → writes the client to `src/generated/prisma`. Runs automatically on install. Does **not** need a live DB, only a parseable `DATABASE_URL`. |
| `dev` | Turbopack dev server. **No `--port`** → default `http://localhost:3000`. |
| `build` | 3 stages: regenerate the client → assert the RHEL engine exists (**hard-fails the build** if missing) → `next build`. Lint cannot fail it (`ignoreDuringBuilds`). |
| `build:turbo` | Same + `--turbopack` (experimental in Next 15.5; **not** what Vercel runs by default). |
| `start` | `next start` — requires a prior build. |
| `lint` | Bare `eslint`. |
| `check:database` | `SELECT 1` probe. **Not** in the build chain — run manually. |

### 4.1 `scripts/verify-prisma-engines.mjs`

A build guard, 20 lines:

```js
const rhelEngine = path.join(process.cwd(), "src", "generated", "prisma",
                             "libquery_engine-rhel-openssl-3.0.x.so.node");
if (!existsSync(rhelEngine)) {
  console.error("[build] Prisma query engine missing (required for Vercel/Linux): …");
  process.exit(1);
}
```

Fails the build with `Run: npx prisma generate` rather than letting a runtime engine-missing
error surface in production.

### 4.2 `scripts/check-database.mjs`

```js
if ((process.env.VERCEL || process.env.CI) && process.env.CHECK_DATABASE_ON_BUILD !== "true") {
  console.log("[build] Database: skipped (Vercel/CI …)");
  process.exit(0);
}
```

Then `SELECT 1` with an 8 s `Promise.race` timeout; exits `requireDb ? 1 : 0`.

> ⚠️ The comment explains why: *"Vercel/CI builds must not block on DB reachability
> (firewalls/timeouts hang the deploy)."* So **the deploy never validates DB connectivity** — a
> bad `DATABASE_URL` surfaces at runtime, not at build time. Set
> `CHECK_DATABASE_ON_BUILD=true` if you want the check.

### 4.3 `scripts/load-env.mjs`

A 30-line `.env` parser used by `check-database.mjs` and `check_hierarchy.mjs`. It **only sets a
key when `process.env[key] === undefined`**, so real env vars always win. Strips matching
single/double quotes.

⚠️ The **six DB-writing scripts do not use it** — they each hardcode their own
`readFileSync(".env")` + regex. See §6.

---

## 5. Deployment

### 5.1 Target: Vercel

Evidence:

- `next.config.ts` hardcodes the Vercel Blob host for `images.remotePatterns`
- The Prisma schema declares `binaryTargets = ["native", "rhel-openssl-3.0.x"]` — RHEL is
  Amazon Linux 2023, Vercel's build image
- `src/lib/prisma.ts:15` — *"Reuse one client in dev and serverless (e.g. Vercel)"*
- `scripts/verify-prisma-engines.mjs` exists solely to catch a missing Linux engine
- `outputFileTracingIncludes` was added to speed up Vercel builds (per its own comment)
- `check-database.mjs` special-cases `process.env.VERCEL`

### 5.2 What does **not** exist

| File | Status |
|---|---|
| `vercel.json` | ❌ absent — build config, regions, env, crons all live in the Vercel dashboard |
| `.nvmrc` / `.node-version` / `.tool-versions` | ❌ absent |
| `package.json` → `engines` / `packageManager` | ❌ absent |
| `.npmrc` | ❌ absent |
| `Dockerfile` / `docker-compose.yml` / `.dockerignore` | ❌ absent — no containerization |
| `Procfile` | ❌ absent |
| `.github/` / any CI config | ❌ absent |
| `.env.example` | ❌ absent |

There is **no infrastructure-as-code**. Everything is configured by hand in the Vercel
dashboard, and nothing in the repo records what that configuration is.

### 5.3 Vercel environment variables to set

| Variable | Scope | Notes |
|---|---|---|
| `DATABASE_URL` | Production + Preview | Must reach MySQL from Vercel's network |
| `BLOB_READ_WRITE_TOKEN` | Production + Preview | Same token as local — **the Blob store is one bucket** |
| `BCRYPT_SALT_ROUNDS` | Production | Optional; defaults to 10 |
| `CHECK_DATABASE_ON_BUILD` | optional | `"true"` to make builds fail on an unreachable DB |

### 5.4 Build behaviour on Vercel

`postinstall` → `prisma generate` produces **both** binary targets, then
`verify-prisma-engines.mjs` confirms the RHEL engine, then `next build`.

Because `src/generated/prisma/` is **committed**, Vercel receives the engines in the source
upload regardless — `prisma generate` simply refreshes them. The commit exists precisely so
builds don't depend on `prisma generate` succeeding.

⚠️ Every dashboard layout and page is `export const dynamic = "force-dynamic"`, so the build
performs **zero** page pre-rendering and never needs the DB at build time. The comment at
`admin_dashboard/layout.tsx:8` says so explicitly: *"Admin pages use Prisma; avoid connecting
to MySQL during Vercel's build prerender pass."*

---

## 6. `scripts/` — maintenance tooling

10 files: 9 `.mjs` + 1 `.sql`. All import the generated client via the **relative** path
`../src/generated/prisma/index.js` (not `@/`), so they must run with the project root as CWD.

### 6.1 Read-only / diagnostic

| Script | What it does |
|---|---|
| `load-env.mjs` | Library. Parses `.env` into `process.env` (only when unset). |
| `verify-prisma-engines.mjs` | Build guard. Asserts the RHEL engine exists; `exit 1` if not. |
| `check-database.mjs` | `SELECT 1` probe with an 8 s timeout. |
| `diagnose-printer-mismatch.mjs` | Prints `editionId \| connectedPrinter \| orderProject \| orderPrinter \| deliveryCount \| autoDelivery`, then counts mismatches. |
| `diagnose-record-printers.mjs` | Prints `recId \| editionId \| book \| recordOrderPrinter \| auto? \| editionRealProjectPrinters`, flagging `<<< MISMATCH`. |
| `assess-ed129.mjs` | **Hardcoded to edition 129.** Prints a print-vs-sold reconciliation with scratch math (`5000 - 1980`, `central - 20`) hardcoded at L47-48. |

### 6.2 ⚠️ Scripts that WRITE to the database

| Script | Writes | Notes |
|---|---|---|
| `backfill-total-print-count.mjs` | `bookedition.update` | Recomputes `total_print_count = count_remning + Σ bookeditionprinters + Σ bookeditionstores + approved order qty + round qty`. **Monotonic** — only writes when the new value is greater. Does not touch `updatedAt`. |
| `backfill-legacy-totals.mjs` | `bookedition.update` | Similar but **excludes** `bookeditionprinters`, includes `count_remning_for_transfer`, counts orders where `is_approved === true \|\| status === "Approved"`, and **does** set `updatedAt`. Monotonic. |
| `fix-auto-delivery-printers.mjs` | `printorder.update` | Finds `printorder` rows whose `project_name` starts with `"Auto-delivery for"` and re-points each to a real printer: the newest `bookeditionprinters` row for any of its editions, else the printer of the newest non-auto print order. Accepts `--db-url=` to target another database. |

**All three:**
- read `DATABASE_URL` out of `.env` with their **own** regex (they don't use `load-env.mjs`)
- have **no `--dry-run`, no confirmation prompt, and no environment guard**
- therefore **silently target production data** if run from the wrong checkout

> Run them only against a database you intend to change, and consider `git stash`-ing a local
> `.env` override first. `fix-auto-delivery-printers.mjs --db-url=…` is the only one with an
> explicit target override.

### 6.3 `scripts/add-fulltext-index.sql`

Not wired to any npm script, and **not** represented in `prisma/schema.prisma` or
`prisma/migrations/`:

```sql
CREATE FULLTEXT INDEX books_fulltext_title_author_isbn_idx
  ON Books(title, author, isbn);
```

`searchBooks` (`transfer-actions.ts:15`) depends on this index. On a database provisioned
without it, the raw query throws and the code silently falls back to a `LIKE` scan — no error,
no telemetry. See [`05-business-logic.md`](./05-business-logic.md).

### 6.4 `check_hierarchy.mjs` (repo root, not in `scripts/`)

```js
const rows = await p.$queryRaw`SELECT id, name, parentId, \`order\` FROM menus ORDER BY id`;
```

Prints `id ⇥ name ← parent: <parentName> (<parentId>)` so the `menus` self-referencing hierarchy
(`parentId` → `id`, relation `MenuHierarchy`) can be eyeballed for orphans, loops and ordering.
Read-only, not wired to a script, requires a live DB.

---

## 7. Dependencies worth knowing about

### 7.1 Package manager: pnpm (though both lockfiles are committed)

| Artifact | Present | Implication |
|---|---|---|
| `pnpm-lock.yaml` | ✅ 339 KB, `lockfileVersion: 9.0` | the real lockfile |
| `package-lock.json` | ✅ 530 KB, `lockfileVersion: 3` | **stale duplication — don't use npm** |
| `node_modules/.pnpm/` | ✅ | pnpm store layout was used |
| `package.json` → `pnpm.onlyBuiltDependencies` | `["@prisma/client", "@prisma/engines", "prisma"]` | explicit pnpm signal |
| `pnpm-workspace.yaml` | ✅ | only `ignoredBuiltDependencies: [sharp, unrs-resolver]` — **no workspace packages** |

**Use `pnpm install`.** `npm install` would resolve different versions from the two lockfiles.

### 7.2 Versions

| Package | Declared | Installed |
|---|---|---|
| `next` | **`15.5.15` (exact)** | 15.5.15 |
| `react` / `react-dom` | **`19.1.0` (exact)** | 19.1.0 |
| `prisma` / `@prisma/client` | `^6.19.3` | 6.19.3 |
| `typescript` | `^5` | 5.9.3 |
| `tailwindcss` / `@tailwindcss/postcss` | `^4` | 4.3.0 |
| `eslint` / `eslint-config-next` | `^9` / `15.5.15` | 9.39.4 / 15.5.15 |
| `zod` | `^4.3.6` | 4.4.3 |
| `@vercel/blob` | `^2.3.3` | 2.3.3 |
| `shadcn` | `^4.4.0` | 4.7.0 |
| `@types/node` | `^20` | — (types for Node 20; **Node 24 is installed**) |
| Node.js | — | **v24.11.0 locally** |

`next` and `react` are pinned **exactly** (no caret); everything else uses caret ranges.

### 7.3 Notable dependencies

| Package | Used for |
|---|---|
| `ethiopian-date` | Ethiopian ⇄ Gregorian conversion. Typed via the hand-written `src/types/ethiopian-date.d.ts` (the package ships no types). |
| `date-fns` | date arithmetic in reports/statistics |
| `xlsx` | Excel export |
| `@tiptap/react` | the `rich-text-editor.tsx` primitive (print-order content) |
| `@dnd-kit/*` | menu/sidebar reordering and the `reorderBooks` drag-and-drop shelf |
| `recharts` | charts — but imported only **2×** (`FinancialChart`, `ProductionOverview`) |
| `framer-motion` | animation |
| `vaul` | the `drawer` primitive (1 usage) |
| `cmdk` | the `command` primitive |
| `sonner` | toasts |

---

## 8. Repository hygiene

### 8.1 `.gitignore`

Standard Next.js template plus `.env*`. Nothing project-specific is ignored.

### 8.2 ⚠️ `src/generated/prisma/` is committed — 33 files, **152 MB**

| File | Size |
|---|---|
| `query_engine-windows.dll.node` | 21.2 MB |
| `query_engine-windows.dll.node.tmp17720` | 21.2 MB |
| `.tmp10404` | 21.2 MB |
| `.tmp13540` | 21.2 MB |
| `.tmp12104` | 21.2 MB |
| `.tmp6524` | 21.2 MB |
| `libquery_engine-rhel-openssl-3.0.x.so.node` | 17.5 MB |
| `index.d.ts` | 3.1 MB |

**Five `.tmpNNNNN` files** (106 MB combined) are interrupted-download leftovers from Prisma
engine installs. They should be deleted and gitignored.

This is deliberate — `next.config.ts` and the schema's custom `output` both rely on the folder
being present — but it is 152 MB of binaries in version control.

A copy of the schema also lives at `src/generated/prisma/schema.prisma` (893 lines vs. the
900-line source). It is Prisma's normalized rewrite, **not** stale: both declare the same 43
models and 11 enums.

### 8.3 Other untracked/ignored items present in the working tree

| Item | Status |
|---|---|
| `.env` | ignored, untracked ✅ |
| `tsconfig.tsbuildinfo` (420 KB) | ignored, untracked ✅ |
| `.next/` | ignored |
| `.mimocode/` | **a separate vendored tool with its own `package.json`, `package-lock.json` and `node_modules`** — unrelated to the app build. `.mimocode/.cron-lock` is tracked. |
| `files to read/` (with a space) vs `files-to-read/` | two directories with confusingly similar names; the first holds a single `Untitled.jpg` |
| `public/` | only the 5 default `create-next-app` SVGs (`file`, `globe`, `next`, `vercel`, `window`) — the app uses Blob for all real assets |
| `src/app/faviconxx.ico` | an orphan alongside `favicon.ico` |

---

## 9. Backup — how the app backs itself up

`admin_dashboard/settings/backup` → `createLocalBackup()` (`backup-actions.ts`, ADMIN-only):

1. `ensureBackupTable()` — `CREATE TABLE IF NOT EXISTS local_backup_records`
2. `generateSqlDump()` — walks `information_schema.tables`, `SHOW CREATE TABLE` per table, then
   keyset-paginated `SELECT * … WHERE pk > ? ORDER BY pk LIMIT 100` batches, wrapped in
   `SET FOREIGN_KEY_CHECKS=0/1`. `local_backup_records` is excluded from its own dump.
3. Writes one ledger row `{ databaseName, fileSizeBytes, status: "success" }`
4. **Returns the entire SQL string to the browser**:
   ```ts
   return { success: true, data: { id: recordId, fileName, fileSizeBytes, content: dump.sql } };
   ```

`BackupClient.tsx:82-104` then triggers a client-side download.

⚠️ **Nothing is written to server disk** — the backup is a browser download. On Vercel
(serverless, ephemeral filesystem) there is no other place it *could* go.

⚠️ **Tables with no primary key are truncated to 100 rows** — the keyset pagination falls back to
`SELECT * FROM t LIMIT 100`.

⚠️ Filenames are Ethiopian natural-language timestamps (`ጥር 15 2018 ፣ ጠዋት 9:05.sql`, then `-2.sql`
on collision) — cosmetically inconsistent with any server-side backup naming.

---

## 10. Risk table

| Risk | Location | Impact |
|---|---|---|
| `DATABASE_URL` serialized to the browser | `app/page.tsx:9-15` | The MySQL connection string, including credentials, is served on `/` |
| No `.env.example` | repo root | A new developer has no template; values must be guessed |
| `BLOB_READ_WRITE_TOKEN` never referenced in source | implicit SDK read | Not greppable — easy to miss when auditing |
| Unauthenticated, unvalidated uploads to a **public** bucket | `book-actions.ts:24`, `check-actions.ts:73`, `invoice-actions.ts:22`, both `/api/upload-*` | Arbitrary file storage; no size, MIME or extension checks; whole file buffered in memory |
| No secret exists to sign sessions with | no `AUTH_SECRET` | Blocks any session hardening without adding one |
| Deploys never validate DB connectivity | `check-database.mjs:11` | A bad `DATABASE_URL` fails at runtime, not build time |
| Three scripts write to the DB with no dry-run | §6.2 | Silently mutate production if run from the wrong checkout |
| Fulltext index not in schema or migrations | `scripts/add-fulltext-index.sql` | Search silently degrades to a `LIKE` scan on a fresh DB |
| `src/generated/prisma/` committed — 152 MB | repo | 106 MB of it is five stale `.tmpNNNNN` engine leftovers |
| `package-lock.json` + `pnpm-lock.yaml` both committed | repo root | `npm install` resolves different versions from the real lockfile |
| No `.nvmrc` / `engines` / `packageManager` | repo root | Nothing pins the Node version; `@types/node@20` vs Node 24 in use |
| No `vercel.json`, Dockerfile, or CI config | repo root | Deployment is undocumented and unreproducible |
| `eslint.ignoreDuringBuilds: true` | `next.config.ts` | Lint errors can never fail a build |
| Invoice blobs never deleted (`del` imported unused) | `invoice-actions.ts:6` | Unbounded public-bucket growth |
| Check and payment blobs never deleted at all | §2.1 | Unbounded public-bucket growth |
| `createLocalBackup` returns a full SQL dump | `backup-actions.ts` | Any ADMIN session can exfiltrate the entire database; ADMIN is not MFA-protected |
| Backup truncates PK-less tables to 100 rows | `generateSqlDump` | Incomplete backups |
| Serverless deployment means no server-side disk | §9 | The only backup path is a browser download; nobody has to remember to run it |
| `recharts` imported for 2 charts | `package.json` | Bundle and build-time cost for marginal value |

---

_Last reviewed: 2026-10-14._