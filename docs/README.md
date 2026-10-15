# Bookland Ethiopia — Technical Documentation

Documentation for the Bookland Ethiopia Bookstore Management System.

| # | Document | Status |
|---|----------|--------|
| 00 | [Overview](./00-overview.md) — what the app does, tech stack, running it locally | ✅ |
| 01 | [Architecture](./01-architecture.md) — folder structure, request flow, server vs. client components, rendering strategy | ✅ |
| 02 | [Data layer](./02-data-layer.md) — DB schema, ORM models, relationships, migrations | ✅ |
| 03 | [API layer](./03-api-layer.md) — route handlers + server actions (inputs, outputs, auth, errors) | ✅ |
| 04 | [Auth and permissions](./04-auth-and-permissions.md) — sessions, roles, protected routes, middleware | ✅ |
| 05 | [Business logic](./05-business-logic.md) — core modules and how they interact | ✅ |
| 06 | [Config and environment](./06-config-and-environment.md) — env vars, third-party services, deployment | ✅ |
| 07 | [Conventions](./07-conventions.md) — naming, error handling, patterns to follow | ✅ |

**Start with [00 Overview](./00-overview.md).** If you are about to write code, read
[07 Conventions](./07-conventions.md) §7 (the adding-a-feature recipe) first.

---

## How to use the admin — user guide

A separate, non-technical guide for the **main administrator**, explaining every menu and how to
operate the system day to day.

| File | What's in it |
|---|---|
| [How to use the admin — index](./How%20to%20use%20the%20admin/README.md) | The business flow, your daily routine, the full menu map, known problems |
| [01 — Getting started & Settings](./How%20to%20use%20the%20admin/01-getting-started-and-settings.md) | Signing in, the header, Home, accounts & permissions, menu on/off, theme, backup, activity log |
| [02 — Books, Editions & Stores](./How%20to%20use%20the%20admin/02-books-editions-stores.md) | Catalogue, editions & pricing, warehouse stock, shelf ordering, damaged books, translation |
| [03 — Printing](./How%20to%20use%20the%20admin/03-printing.md) | Printers, print projects, books in print, printing info, delivery records, payments |
| [04 — Orders, Shops & Payments](./How%20to%20use%20the%20admin/04-orders-shops-and-payments.md) | Book shops, creating and **approving orders**, delivering, payments, checks, rounds, walk-in |
| [05 — Finance, Reports & Documents](./How%20to%20use%20the%20admin/05-finance-reports-and-documents.md) | Debt screens, reports, statistics, 80/20, the document registers |

---

## Documented stack at a glance

- **Framework:** Next.js 15.5.15 (App Router, React 19, Server Actions)
- **Language:** TypeScript 5 (strict)
- **Database:** MySQL via Prisma 6 (client generated into `src/generated/prisma`)
- **Styling:** Tailwind CSS v4 (CSS-first config, no `tailwind.config`)
- **UI kit:** shadcn/ui on Radix, `lucide-react` icons, `sonner` toasts
- **State:** Zustand (slices), React Hook Form + Zod, TanStack Table, Recharts, TipTap
- **Storage:** Vercel Blob (uploads)
- **Hosting:** Vercel

See [Overview](./00-overview.md) for detail.