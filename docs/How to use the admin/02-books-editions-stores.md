# 02 — Books, Editions & Stores

This is the catalogue and the warehouse side of the business. Nothing here involves selling to a
shop — that is file 04.

---

## 1. Books — the catalogue

*Sidebar → **Books***

Title: **Books Management**. Columns: Cover · Title · Author (with pen name) · Editions (count) ·
Category · a **Details** eye button.

Toolbar: **"Search titles, authors, ISBNs…"**, **Visual Shelf**, **+ Add Book**, plus a gear icon
to the Books Settings screen, and **Print Options**.

⚠️ There is **no Edit or Delete button in this table**. You open a book to change it.

---

## 2. Adding a book

*Sidebar → **Books** → **+ Add Book***

### 2.1 The required fields

| Field | Notes |
|---|---|
| **Title** | The full book title |
| **Author** | The author's name |
| **Category** | e.g. Fiction, Science |
| **Publication Year** | Just the year |

Everything else is optional but you'll want most of it.

### 2.2 The optional fields worth filling in

- **Short Name** — an abbreviated form used in printed lists. Very useful.
- **Pen Name** — if the author writes under one.
- **ISBN**
- **Copyright Registration Number**
- **Language**, **Edition**
- **Number of Pages**
- **Sort Index** — see §6 below. Lower number = higher in lists.
- **Translator**, **Designer**, **Print Batch ID**
- **Status** — Available / Out of Stock / Discontinued
- **Production Status** — On Production / Translation / Design / Printing / Pre-printing / Sales.
  This drives the pipeline views.

### 2.3 Production costs (optional)

A block of nine number fields: **Translator, Cover Design, Text Design, Editor, Typewriting,
Store Cost, Distribution, Advertisement, Purchasing Right**. All default to 0.

⚠️ These are **book-level** costs. For real accuracy, set the per-edition costs on the edition
instead (see §3). The Finance screens sum both, which can double-count. Decide on one approach and
stay consistent.

### 2.4 The cover image

Two modes, chosen with the **"Upload File"** / **"Provide Link"** buttons:

- **Upload File** — click the dashed box, pick a JPG/PNG/WEBP. **Maximum 4 MB.** You get a
  preview before saving.
- **Provide Link** — paste a URL.

💡 The image is only uploaded when you press **Save Book**, not when you pick it.

### 2.5 Saving

**"Reset Form"** clears everything. **"Save Book"** uploads the cover (if any) and creates the
book. You'll be returned to the list.

---

## 3. Editions — the thing you actually sell

An **edition** is a physical version of a book: *Collector's Hardcover*, *1st Edition*, *Pocket
Edition*. Each has its own price, its own cost breakdown, and its own stock.

**A book with no editions cannot be sold, stocked, printed or transferred.**

### 3.1 Opening a book

Click the **eye** icon in the Books table. The URL is based on the book's unique code, not its
number.

At the top you see the **SKU** and a **Publication Status** pill — click it to change the status
inline (Available / Out of Stock / Discontinued).

### 3.2 The eight tabs

| Tab | What it holds |
|---|---|
| **Info** | Cover, identity fields, description |
| **Editions** | The list of editions — **this is the important one** |
| **Costs** | Book-level cost summary |
| **Stores** | Where copies currently sit |
| **Shop** | Which book shops hold copies, and what they owe |
| **Design** | Designer, batch ID, SKU |
| **Translation** | Translation assignments for this title |
| **Delete** | Danger zone |

### 3.3 Inline editing (used almost everywhere)

Click any value and it turns into an input box. Press the green **✓** to save or the red **✗**
to cancel. Empty values show as **N/A**.

### 3.4 The Info tab

- **Cover** — hover it for an **Edit** overlay, then **"Update Cover"** → upload or link →
  **"Save Image"**.
- **Identity & Specs** — Title, Lead Author, Edition (desktop only), then Pen Name, Language,
  Category, Short Name, Year, ISBN, Copyright Reg. No., Pages, Sort Index, Production Status.
- **Narrative Summary** — a long description. Click the paragraph to edit it, then **"Save
  Changes"**.

### 3.5 The Editions tab

A table per edition showing: profile (cover + name + memo) · print metrics (units, pages) ·
central inventory (left to transfer) · the assigned printer · actions.

**"+ Add New Edition"** opens a dialog. Required: **Edition Name**, **Print Count**, **Selling
Price**. If the book already has an edition, a hint shows *"Last edition sold at {N} ETB"*.

Press **"Show more form parts"** to reveal: **Base Cost**, **Cover Price (Optional)**, the cost
breakdown (Printing, Binding, Design, Other Expenses), the additional production costs
(translator, cover design, text design, editor, typewriting, store, distribution, advertisement,
purchasing right), **Page Count**, and a **Production Memo**.

Press **"Create Edition"**.

⚠️ **Print Count is the total ever printed for this edition**, not what's currently in stock. It
sets the ceiling for everything else.

### 3.6 Assigning an edition to stores (from the book page)

Each edition row has an **"Add to"** button that opens a two-step sheet on the right:

**Step 1 — Select Stores.** Tick the stores that should receive copies. Stores already holding
this edition show a **"Update (qty)"** badge. Press **"Next (N store(s))"**.

**Step 2 — Assign to Stores.** A header shows **"Remaining for Transfer"** — the units already
printed but not yet sent anywhere. Enter a quantity per store. A live strip tells you what will
happen:

- *"Taking N of M remaining units"* (amber) — you're moving stock out of central
- *"Returning N units to remaining"* (emerald) — you're giving units back
- *"N units allocated"* (emerald) — no net change
- *"Net increase (X) exceeds remaining (Y)"* (red) — **too much**, reduce it

Press **"Confirm Assignment"**.

💡 This is the fastest way to distribute a new edition across several warehouses at once.

---

## 4. The edition detail screen

*Sidebar → **Books** → open a book → **Editions** → **"View Details"***

The most detailed page in the catalogue.

### 4.1 The five stat tiles

**In Stores** · **Sold (Order)** · **Sold (Round)** · **Damaged** · **Total**

Below them: **Connected Printer** and **Remaining for Transfer**.

### 4.2 Editing the edition

Press **"Edit"**. Only these fields are in the main form:

**Edition Name** · **Selling Price** · **Base Prod. Cost** · **Cover Price (Optional)** · **Cover
Image URL** · **Print Run** · **Remaining for Transfer** · **Page Count** · **Memo / Notes**

Everything else — all the individual cost buckets — is edited through the **cost cards** below:
hover a card, click the **✎**, type, press **✓**.

Two collapsible groups: **Cost Breakdown** (Printing, Binding, Design, Editing, Transport,
Translation, Other) and **Additional Production Costs** (the nine book-level costs). Each shows a
running **Total**.

⚠️ **Be careful with "Remaining for Transfer".** It is the pool of copies that are printed but not
yet in a store, not at a printer, not sold, and not damaged. Setting it by hand can desynchronise
your stock figures. Prefer letting transfers and print projects move it.

### 4.3 Printer visibility

On the right, a **"Visibility to Printer"** switch.

- **On** — the printer can see this edition and update its status.
- **Off** — the edition is hidden from the printer entirely.

Use this when you need to make a change to an edition mid-print without the printer seeing a
half-finished state.

### 4.4 Store inventory table

**"Retail Inventory"** — one row per store:

- **Stock Level** badge — green above 50, amber above 10, red below
- Hover the badge and click **✎** to edit the quantity inline. You'll see **"Max: N units"** —
  you can't add more than the central pool holds.
- The **🗑** button removes the store from the edition; the units go back to central.
- **"+ Add to Store"** opens an inline row: pick a store, type an initial quantity, press
  **"Assign Store"**.
- **↻ Refresh** reloads the numbers.

### 4.5 Transfer history

**"Transfer to Store History"** shows each store, how many times you transferred to it, and the
total copies moved.

### 4.6 Deleting an edition

**"Delete"** → type **DELETE** → **"Confirm Delete"**.

⚠️ A soft delete — it disappears from the app but its history stays in the database. You cannot
undo it from the dashboard.

---

## 5. Books Settings — the fast-edit screen

*Sidebar → **Books** → the **gear icon***

Purpose: **quick-edit everything currently in stock** on one screen. You don't have to open each
book.

⚠️ **Desktop only.** On a phone it says *"Books settings can only be viewed on desktop."*

Only editions with **1 or more units in a store** are listed.

Per book: **Title, Short Name, Year, Author, Pen Name**.
Per edition: **Edition Name**, **Print Metrics**, **Remaining for Transfer**, **In Store**
(read-only), **Single Price**, **Page Count**, **Cover Price**.

Click a value to edit. **Enter** saves, **Escape** cancels, or use the ✓ / ✗ buttons.

⚠️ Title, Author and Year refuse empty values. Short Name and Pen Name can be blanked.

💡 This is the fastest way to do a bulk price correction.

---

## 6. Book Shelf — visual catalogue and ordering

*Sidebar → **Book Shelf***

A cover-grid view with search, **five density modes** (List, Dense, Compact, Default,
Comfortable), and **Back to Table**.

### 6.1 Reordering the catalogue

The **Sort** button switches to drag-and-drop mode:

1. Each card gets a number showing its position. Search is disabled.
2. Drag a card onto another to move it.
3. A bar appears bottom-right with **Cancel** and **"Save Order"**.
4. **"Save Order"** writes the new order.

💡 This ordering (`Sort Index`) drives the catalogue order everywhere, including the printed store
list. Set it once, here.

**Right-click** any card for **Details**, **Sort** (anchors sort mode on that book), or **Edit
Sort Index** (set the number by hand — lower = higher).

⚠️ Clicking **Save Order** rewrites the sort index for every book at once. It takes a moment on
a large catalogue.

---

## 7. Damaged Books

*Sidebar → **Damaged Books***

The register of lost, spoiled or unsellable stock.

### 7.1 The list

Columns: **Book & Edition** · **Damage Context** (the type) · **Location** (store name, or
*"Direct / Production"* if it was never sent to a store) · **Quantity** · **Reported On**.

### 7.2 Reporting damage

Press **"Report Damaged Book"**.

1. **Select Book** — searchable.
2. **Select Edition** — appears once a book is chosen. Choosing it loads where the copies are.
3. **Damage Type** — In-Store Damage (default) · Printing Error · Design Flaw · Pre-production
   Error · Logistics / Distribution · Sales Return / Damage.
4. **Units Damaged (Total)** — the total number of copies lost.
5. **"Where did the damage come from?"** — the system lists every place those copies could be:
   **Central / Not Yet Transferred** and each store holding stock, with *"Available: N"*. Enter how
   many came from each source.

   ⚠️ **The allocations must add up exactly to "Units Damaged (Total)"** — the running strip shows
   *"Total Allocated: X / Y"* and turns green when they match. If they don't match you'll get
   *"Allocation total (X) must equal damaged count (Y)"*.

6. **Detailed Description** — what happened.
7. **"Review Deduction"** → a summary of where the stock will be taken from → **"Yes, Deduct
   Stock"**.

⚠️ Damaged stock is **really deducted** from central and/or from that store's count. This is not a
note — it changes your inventory. Double-check the allocation numbers.

⚠️ **The printer's copy of the delivery ledger is not corrected.** If you reduce a store's stock
by reporting damage, the printer still believes they delivered those copies. That only affects the
printer's delivery history, not your stock figures.

### 7.3 Editing or discarding a report

Open a report. **"Edit Report"** unlocks the fields; **"Save Changes"** returns the old stock and
takes the new amount. **"Discard Report"** → type **DELETE** → **"Confirm Delete"**.

Each report shows a derived **Impact Level**: **Significant Loss** (more than 10 units) or
**Minor Damage**.

---

## 8. Stores — your warehouses

*Sidebar → **Stores***

Shows **Stores Management** (your warehouses) and, below it, **Printing Partners** (a quick view
of your printers).

Columns: Store · ID · Store Name · Location · Contact (phone and email) · Status (available /
closed / maintenance) · eye button.

### 8.1 Adding a store

**"+ Add Store"** → **Store Name** · **Location / Address** (both required) · Phone · Email ·
**Operational Status** (Available / Closed / Maintenance) → **"Register Store"**.

### 8.2 A store's page

**"Back to Stores"** at the top, then **Edit Store** to change Branch Name, Operating Status,
Physical Address, Phone and Email. **Delete Branch** hides the store.

The **Current Inventory** section lists every edition with its stock, plus the store's **Global
Units** total.

Filters:
- **View:** `Edition Based` (one row per edition) or `Book Based` (editions merged into one row)
- **"Show editions/books with 0 units"** checkbox
- **Filter stock…** — All · Low stock (less than 15 units) · Less than 50 / 100 / 200 · Above 200
  · 0 units
- **Search by book title…**

Row actions: **✎ Edit** opens *"Adjust Stock"*; **🗑 Delete** opens *"Remove Stock"*, which warns
*"This will return all units back to the central stock inventory."*

### 8.3 Adding a book to a store from here

**"+ Add Book"** opens a two-step wizard:

**Step 1** — search by title, author or ISBN. Only books that currently have stock appear. Click
**Select** on the one you want.

**Step 2** — one card per edition showing **"{n} Units Available in Central"** and a quantity box.
Enter what you want to move; you can't exceed what's available.

**"Confirm"** → the units leave central, appear in this store, and a delivery record is created
for the printer to approve.

---

## 9. Stores → Store Options

*Sidebar → **Stores** → **Store Options***

Pick a store from the radio grid. The **Inventory** panel shows a four-column table — Book ·
Total · Edition · Qty — grouped by book, **sorted with the lowest-stock books first**.

Two buttons at the top: **"Print Content"** and **"Transfer Books"**.

### 9.1 Transfer Books (store → store)

A four-step wizard: **Stores → Book → Quantity → Review**.

1. **From Store** and **To Store** — the lists exclude each other. Picking the same store twice
   shows *"Source and destination stores must be different"*.
2. **Book** — only books the source store holds. Then **Edition** — only editions with stock.
3. **Quantity** — shows *"Available in {store}"* and validates Min 1 / Max.
4. **Review** — the full summary. **"Confirm Transfer"**.

⚠️ **A store-to-store transfer does not touch central stock** — the total across all stores stays
the same. It also **does not create a printer delivery record**, so the printer's history is
unaffected. This is correct behaviour.

### 9.2 Print Content

Pick **one or two stores** (max two) and press **"Generate & Print"**.

- **One store** — a book-by-book listing with quantities per edition.
- **Two stores** — two sections: **"Books in Both Stores"** and **"Books in Only One Store"**, with
  a column per store. Both checkboxes can be switched off.

Options: font size (Extra Small / Small / Medium / Big) and **"Single edition shown inline"** to
collapse single-edition rows.

A new window opens and prints automatically. It carries both the Gregorian and Ethiopian dates on
every page.

💡 This is the practical way to answer *"what's actually in warehouse B?"* without walking the
floor.

---

## 10. Production → Books

*Sidebar → **Production** → **Books***

A pipeline view of titles by production state, so you can see what's being worked on versus what's
finished. Use the **Production Status** field on a book (Info tab) to move it along: On Production
→ Translation → Design → Printing → Pre-printing → Sales.

---

## 11. Production → Low Stock

*Sidebar → **Production** → **Low Stock***

Everything below 500 copies across all stores, with filters so you can narrow down. The dashboard
card on Home links here.

💡 Cross-reference with the **"Ready to transfer"** figure: a book showing low stock *but* with
copies ready to transfer is not a reprinting problem — it's a transfer you haven't made yet.

---

## 12. Translations

*Sidebar → **Translations***

### 12.1 Translators

The directory of translators — name, pen name, phone, email. **"Add Translator"** creates one.

### 12.2 Translation Work

Projects that assign a translator to a book. Each has a status (Not Started / Started / In
Progress / Completed), a cost, an amount paid, and start/end dates.

**"New Translation Project"** needs a book (only books with Production Status = *Translation*
appear) and a translator.

💡 You can also start from the book itself: **Info → Translation tab → "+ Add Assignment"**, which
pre-fills the book.

### 12.3 Books

Which books are currently being translated.

**Status changes can be made from either place** — the project page, or inline on a book's
Translation tab.

---

## 13. Quick reference — where things are

| I want to… | Go to |
|---|---|
| Add a title | Books → **+ Add Book** |
| Change a title's details | Books → **eye** icon → **Info** tab |
| Add a version of a book | Book → **Editions** tab → **+ Add New Edition** |
| Set prices and costs | Book → **Editions** → **View Details** → **Edit** |
| Move printed copies into a warehouse | Edition page → **+ Add to Store**, or Stores → your store → **+ Add Book** |
| Move copies between warehouses | Stores → **Store Options** → **Transfer Books** |
| Reorder the catalogue | **Book Shelf** → **Sort** |
| Quick-fix many prices at once | Books → **gear icon** |
| Write off damaged stock | **Damaged Books** → **Report Damaged Book** |
| See where copies physically are | Edition page → **Store Inventory** table |
| Print a warehouse inventory sheet | Stores → **Store Options** → **Print Content** |
| Check what's running out | **Production** → **Low Stock** |