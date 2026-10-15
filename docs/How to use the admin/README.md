# How to Use the Admin Dashboard

A practical guide for the **main administrator**. It explains what each menu is for and exactly
how to use it — what to click, what to type, and what happens as a result.

Written for someone running the system day to day, not for developers.

---

## The files

| File | What's in it |
|---|---|
| **01 — Getting started & Settings** | Signing in, the header, the sidebar map, the Home dashboard, accounts & permissions, menu on/off, theme, backup, activity log |
| **02 — Books, Editions & Stores** | The catalogue, editions and pricing, warehouse stock, shelf ordering, damaged books, translation |
| **03 — Printing** | Printers, print projects, books in print, printing info, delivery records, payments to printers |
| **04 — Orders, Shops & Payments** | Book shops, creating and **approving orders**, delivering, recording payments, checks, rounds, walk-in sales |
| **05 — Finance, Reports & Documents** | Debt screens, daily/period reports, statistics, 80/20, production, and the five document registers |

---

## The one-paragraph version of how this system works

A **book** is the title. A **book** has one or more **editions** (the physical version you
actually sell), and each edition carries a selling price and a long list of production costs.
Copies are **printed** through a **printer** inside a **print project**. Finished copies move into
a **store** (warehouse) — that is your sellable stock. You then **sell** stock to a **book shop**
by raising an **order**, which you **approve**; approving moves the stock out of the store and
records what the shop now owes you. The shop **pays** you — by cash or by cheque — and whatever
it has not paid is its **debt**.

```
Book → Edition → Print project → Printer → Store → Order to a book shop → Approval → Payment → Debt cleared
```

Everything in the sidebar is one of those steps.

---

## Your daily routine (a suggested order)

1. **Sign in.** Look at **Home** — the Backup Status card, the unread notifications, and the
   low-stock list.
2. **Clear the badges.** The sidebar shows a number next to **Manage Orders** (waiting for your
   approval) and **Manage Payment** (payments waiting for you to approve). These are the two
   things only you can action.
3. **Approve today's orders** — `04 — Orders, Shops & Payments`.
4. **Approve incoming payments** — same file.
5. **Move stock** if printing finished — `03 — Printing` and `02 — Books, Editions & Stores`.
6. **Record a backup** if the Backup Status card is amber or red — `01 — Getting started`.
7. **Glance at Finance → Payments Due** before you sign off — `05 — Finance, Reports & Documents`.

---

## The full menu map

The sidebar is one flat list plus ten collapsible groups.

**Always at the top:**

| Menu | Use it for |
|---|---|
| **Home** | Your morning dashboard — see §1.4 of file 01 |
| **Notifications** | Things that need your attention (new orders, approved orders, deliveries) |
| **Notes** | Your own private notes |
| **Profile** | Your name, email and password |
| **Books** | The book catalogue |
| **Book Shelf** | Visual cover view + drag-to-reorder the catalogue |
| **Damaged Books** | Recording lost or damaged stock |
| **Book Shop** | The retailers you sell to |
| **Manage Orders** | Create, approve and deliver orders ← *your main job* |
| **Manage Rounds** | Credit/consignment rounds to shops |
| **Manage Payment** | Record and approve payments from shops |
| **Selling to individual** | Walk-in retail sales |
| **Activity Log** | Audit trail of who did what |
| **Backup** | Download a full copy of the database |

**Collapsible groups:**

| Group | Sub-menus |
|---|---|
| **Statistics** | General · Books · Stores · Income |
| **Manage Checks** | List · Check Dates |
| **Stores** | Manage Store · Store Options |
| **Production** | Books · Low Stock · 80 20 |
| **Translations** | Translators · Translation Work · Books |
| **Printing** | Printers · Manage Printing · Books List · Info · Delivery Records · Payments |
| **Document Managment** *(spelled this way in the app)* | Contracts · Print agreements · Delivery notes · Invoices · Approval documents |
| **Finance** | Book Shop · Books · Shop Table · Edition Table · Costs · Printing · Round Info · Payments Due · Daily Report · Period Report |
| **Reports** | Completed Deliveries · Pending Deliveries |
| **Settings** | Accounts · Menu Management · Theme Customization |

---

## Conventions used in these guides

- Menu names are shown in **bold** exactly as they appear in the sidebar.
- `File → Menu → Section` is the breadcrumb to that screen.
- Buttons and dialogs are in **"quotes"**.
- ⚠️ marks a mistake that is easy to make, or a known problem in the current build.
- 💡 marks a tip that will save you time.

---

## Known problems in this build (so you aren't surprised)

These are current behaviour, not instructions. Report them if they cause you trouble.

| What you see | Why |
|---|---|
| Clicking the **Finance** group title shows just the word "page" | There is no Finance landing screen — always use a sub-menu |
| **Settings** has no home page | The "← Back to Settings" button on Menu Management leads to a 404 — use the sidebar |
| Deleting a book drops you on a blank screen | After deleting, the app navigates to a page that doesn't exist. Go back and use the sidebar |
| The list on **Books List** and several tables sometimes shows only one page of search results | A pagination bug; narrow your search instead |
| Turning a menu off in Menu Management makes the page return **404**, not just disappear from the sidebar | This is intended — it blocks the page too |
| The **Backup** page has no "download again" or "restore" button | The file only exists where your browser saved it |
| **Printing → Payments** is not in the sidebar | Reach it at `/admin_dashboard/printing/payments`, or use the header search box |
| Some pages take a few seconds and show a blank frame | There is no loading indicator anywhere in the app — just wait |

---

_Last reviewed: 2026-10-14._