# 05 — Finance, Reports & Documents

The read-and-analyse half of the system, plus the paperwork registers.

---

## 1. Finance — the money screens

*Sidebar → **Finance***

⚠️ **Clicking the Finance group itself shows only the word "page"** — there is no Finance landing
screen. Always pick a sub-menu.

---

### 1.1 Finance → Payments Due — *start here*

*"Outstanding debts from orders and round distributions"*

**Four summary numbers** across the top: **Order Debt** · **Round Debt** · **Prev. Debt** ·
**Total Debt**.

**Table** (sorted with the biggest debtor first): Shop Name · Order Debt · Round Debt · Prev.
Debt · Last Order · **Total Debt**. Two buttons per row — **Payment Detail** (their full payment
record) and **Shop Profile** (their order history).

Filters: a search box and a chip counting shops with debt. **"Print PDF"** produces a landscape
sheet with both calendar dates and a Grand Total row.

💡 **This is your single most useful finance screen.** The order is the highest-value table on
the system. Check it weekly and chase the top debtors.

⚠️ **"Prev. Debt"** is the opening balance you typed into each shop, reduced by any payments you
marked **"For previous debts"**. If you recorded those payments on a *different* shop page, this
number will not drop. Keep previous-debt payments on the shop they belong to.

⚠️ **"Last Order"** is the newest order's outstanding amount, shown separately. It is *already
included* in Total Debt — it is not extra.

---

### 1.2 Finance → Book Shop — the collection view

Title **"Retail Finance Hub"**, with **Total Receivable** at the top.

One card per shop, **worst debtor first**: shop name, branch, **Total Distributed**, **Total
Collected**, **Current Debt**, and a **donut showing the collection rate** as a percentage.

💡 The collection rate is the quickest way to spot a shop that has been slipping. Click any card
to open that shop.

---

### 1.3 Finance → Shop Table — the ledger

Title **"Financial Ledger"**. One row per shop:

| Column | Meaning |
|---|---|
| **Total Books** | Units the shop holds |
| **Previous Debt** | Their opening balance |
| **Gross Value** | Everything they've been given |
| **Paid** | Everything they've paid |
| **Debt** | What's left |
| **Health** | A bar and percentage — green above 70%, amber above 30%, red below |

---

### 1.4 Finance → Books — revenue by title

Title **"Inventory Revenue Analysis"**.

One card per book showing **Total Sell** and six tiles: **Editions** · **In store** · **Locked**
· **Sold (order)** · **Sold (round)** · **Produced**.

Searchable (title, author, ISBN) and paginated — 50 per page.

⚠️ **Locked** is stock reserved by pending orders. If it climbs and **In store** stays flat,
approval is the bottleneck.

---

### 1.5 Finance → Edition Table — where you actually make money

Title **"Production Profitability"*.

Per edition: **Market Price** (selling price) · **Prod. Cost** (the sum of all production costs) ·
**Unit Profit** (price − cost) · **Inventory** · **Total Profit** (unit profit × total printed).

**Total Net Profit** across all editions is at the top, and the table is sorted so you can find
loss-makers and top performers.

⚠️ **Profit here is a projection, not realised cash.** It assumes every printed copy sells at full
price. A book that printed 5,000 copies and sold 300 shows a large "profit" that's mostly unsold
inventory. Cross-check against **Books → Sold (order)**.

💡 **Use this to set prices.** Any edition with a low or negative unit profit is either
under-priced or over-costed — fix the cost entries (file 02) before changing the price.

---

### 1.6 Finance → Costs — where the money goes

Nine summed cost fields per book: Translator · Cover Design · Text Design · Editor ·
Typewriting · Store · Distribution · Advertisement · Purchasing Right.

⚠️ **This sums book-level costs *and* every edition's costs.** If you've entered the same cost
on both the book and its editions, it is counted twice. Pick one level and use it consistently —
editions are usually more accurate.

---

### 1.7 Finance → Round Info — consignment outstanding

Three numbers: **Total Books** · **Total Paid** · **Total Remaining**.

Per shop: rounds, books received, total price, paid, remaining — **worst balance first**, with a
Grand Total row.

💡 Cross-check against **Manage Rounds**. If a shop's round debt here looks wrong, the payments
may have been recorded against the wrong shop.

---

### 1.8 Finance → Daily Report — yesterday in one screen

Pick a date (with **Today** / **Yesterday** shortcuts) and read four sections:

| Section | Numbers |
|---|---|
| **Orders** | Orders made · Books ordered · Total sold · Total paid · Remaining · Shops involved |
| **Rounds** | Rounds made · Round revenue · Unpaid · Shops in round |
| **Payments** | Recorded · Approved · Approved amount |
| **Summary** | **Total Revenue** (orders + rounds) |

There's a **Grid / Table** view toggle and a **Print** button.

💡 **Use this every morning and at month end.** If *Total Sold* doesn't match what you expect,
check whether an order was approved after midnight.

⚠️ The date follows your EC/GC calendar preference. Switching calendars changes which date you're
looking at.

---

### 1.9 Finance → Period Report — a date range

Identical to the Daily Report but with **Start Date** and **End Date**.

⚠️ **Nothing loads until you press "Generate".** Changing the dates alone does nothing.

---

### 1.10 Revenue Analysis and Financial Stats

⚠️ These two work but aren't in the sidebar — reach them by URL or the header search:

- `/admin_dashboard/finance/revenue_analysis` — an accordion of books, each expandable to per-edition
  **Cost / Revenue / Collected / Profit**, with a **Download Excel** button.
- `/admin_dashboard/finance/stats` — a **Financial Intelligence** dashboard with a range selector
  (Last 3 Days / One Week / One Month / Six Months / All Time), Gross Distribution, Collected
  Revenue, Collection Rate, Outstanding Debt, Recovery Success and Transaction Volume.

💡 The **Download Excel** export is the most practical way to hand numbers to an accountant.

---

## 2. Statistics

*Sidebar → **Statistics***

### 2.1 General

Range selector: **Last 3 Days · One Week · One Month · Six Months · All Time**.

Gross Distribution, Collected Revenue, Collection Rate, then **Outstanding Debt**, **Recovery
Success** and **Transaction Volume**.

Below that, **Network Footprint** (Active Shops, Live Titles) and two ranking tables:

- **Top 10 High-Selling Books** — Book · Volume · Revenue
- **Top 10 Performant Shops** — Store · Location · Revenue, ranked by what's been **paid**, not
  what's owed

⚠️ **Revenue ≠ cash.** "Revenue" here is the value distributed; "Collected Revenue" is what was
actually paid in. The gap between them is your debt.

### 2.2 Books — what people are ordering

Columns: Book · Time (with *"2 hours ago"*) · Qty Ordered · Total Price.

Range dropdown with ten options — **Last 24 Hours** through **All Time**. Default is 30 days. An
**Excel** button exports the table.

### 2.3 Stores — where stock is going

Per shop: total units, approved value, paid, and outstanding.

### 2.4 Income — money in

Entries with amount and total. Same range dropdown.

💡 Book the 80/20 screen (below) with the General statistics — together they answer "what should
we print more of, and who isn't paying?"

---

## 3. Production → 80 20 (best sellers)

*Sidebar → **Production** → **80 20***

The classic Pareto view: the top 20% of titles by quantity sold.

Range selector: **This Week · This Month · This Year · All Time**.

Columns: Book (cover, title, author) · Order Qty · Round Qty · **Total** · Share %.

⚠️ **Round quantities only count while a round is active.** A closed round's sales stop appearing,
so a title can drop down the list without anything actually changing.

💡 **This is what to print more of** — and, read alongside Finance → Edition Table, what to
consider reprinting.

---

## 4. Delivery reports

*Sidebar → **Reports***

**Completed Deliveries** — every order marked delivered. Each has a printable **Delivery Receipt**
with the shop's details, the items, and signatures.

**Pending Deliveries** — approved orders not yet delivered. 💡 Your daily run sheet.

⚠️ An order only appears here if someone actually marked it delivered. Approving an order does not
deliver it.

---

## 5. Document Management

*Sidebar → **Document Managment*** *(spelled this way in the app)*

Five standalone paperwork registers. Each has a list page with search and filters, a **create
dialog**, and a detail page with **Edit** and **Delete**.

⚠️ **These are completely separate from orders, print orders and deliveries.** Adding an invoice
here does not create an invoice in your accounts, and a delivery note here does not mark an order
delivered. They are registers for your paperwork, kept for the record.

| Register | Fields |
|---|---|
| **Contracts** | Title · Party · Type · Status · Details · Value · Memo · Date Signed · Start · End |
| **Print agreements** | Book Title · Printer Name · Quantity · Status · Commencement Date · Cost · Terms · Memo |
| **Delivery notes** | Delivery Number · Receiver Name · Driver Name · Vehicle Plate · Status · Delivery Date · Items (free text) · Memo |
| **Invoices** | Invoice Number · Customer Name · Amount · Status · Due Date · Issue Date · Image · Memo |
| **Approval documents** | Document Number · Title · Requested By · Approved By · Status · Approval Date · Details · Memo |

**Typical statuses:** Contracts and Print Agreements default to **Active**; Delivery Notes to
**Pending**; Invoices to **Unpaid**; Approval Documents to **Pending**.

**Invoice images** can be uploaded (or linked) as an attachment.

⚠️ **Deleting a document cannot be undone** and does not remove any uploaded image file.

💡 Record the **cheque** and **print agreement** here so you have one place to look when the
delivery staff say a printer is withholding delivery.

---

## 6. Activity Log

See file 01 §9. Useful for finance questions: *"who approved this payment?"*

⚠️ Not every action is logged. **Order creation is not logged** — only edits, approvals, deletions,
deliveries, payments and book changes are.

---

## 7. Month-end routine

A practical sequence:

1. **Backup** — press **Record Backup** and file the `.sql` safely.
2. **Finance → Payments Due** — export the debtor list. Chase the top five.
3. **Finance → Period Report** — first of the month → last day of the month. Press **Generate**.
   Check Total Revenue against your expectation.
4. **Statistics → General → All Time** — collection rate trend.
5. **Production → 80 20 → This Year** — what to reprint.
6. **Finance → Edition Table** — find any edition with a negative unit profit.
7. **Finance → Round Info** — collect on outstanding rounds.
8. **Manage Checks → Check Dates → Expired** — follow up every bounced or stale cheque.
9. **Reports → Pending Deliveries** — clear anything approved but never delivered.
10. **Activity Log** — scan for anything unexpected in the month's approvals.

---

## 8. Reading the numbers correctly

| Trap | What it really means |
|---|---|
| **Gross revenue** is high but cash isn't coming in | That's **distribution value**, not money received. Look at *Collected Revenue* and *Outstanding* |
| **Books → Sold** is low but **Total Profit** is high | Profit assumes every printed copy sells. You have unsold stock |
| **In store** is falling | Check **80/20** and **Low Stock** — you may need a reprint, not a transfer |
| **Locked** stock is climbing | Pending orders are waiting for approval. Go clear **Manage Orders** |
| **Debt** jumped without new orders | Check **Round Info** and **Prev. Debt** — a round allocation or a data entry will do it |
| **Collection rate** dropped this month | Compare **Payments Due** with last month's. The shop list will show who |
| **Prev. Debt** isn't reducing | Previous-debt payments were probably recorded on the wrong shop |
| Edition profit looks too good | Book-level **and** edition-level costs are both being summed |

---

## 9. Quick reference

| I want to… | Go to |
|---|---|
| See who owes the most | Finance → **Payments Due** |
| Track a specific shop's collections | Finance → **Book Shop** |
| See a shop's full ledger | Finance → **Shop Table** |
| Check a title's financial performance | Finance → **Books** |
| Check an edition's profit | Finance → **Edition Table** |
| Find where production costs go | Finance → **Costs** |
| Check outstanding consignment | Finance → **Round Info** |
| Review one day | Finance → **Daily Report** |
| Review a month | Finance → **Period Report** |
| Export numbers for an accountant | Finance → Revenue Analysis → **Download Excel** |
| See what's selling | **Statistics** → Books · **Production** → **80 20** |
| Track store performance | **Statistics** → Stores |
| Check the delivery run sheet | **Reports** → **Pending Deliveries** |
| Print a delivery receipt | **Reports** → **Completed Deliveries** → eye |
| Record a contract or invoice | **Document Managment** |