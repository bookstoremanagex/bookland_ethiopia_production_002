# 03 — Printing

Printing is where finished editions become physical copies. The flow is:

```
Create a print project → Assign a printer → Add editions with quantities
     ↓
The printer updates statuses and approves deliveries (their dashboard, not yours)
     ↓
Move copies from central into a store → they become sellable stock
     ↓
Record what you pay the printer
```

**Your role as admin** is to create and manage projects, control who sees what, and record
payments. **Status updates and delivery approvals happen on the printer's own dashboard.**

---

## 1. Printers

*Sidebar → **Printing** → **Printers***

### 1.1 The list

Title **"Printing Partners"**. Columns: Printer Name (with Partner ID) · Location · Contact Info
(phone and email) · number of Orders · eye button.

Search **"Search printers by name or location..."**.

### 1.2 Registering a printer

**"Register Printer"** opens the **"New Partner"** dialog:

| Field | Required | Notes |
|---|---|---|
| **Printer Identity** | ✅ | The facility's name |
| **Facility Location** | ✅ | City, area or address |
| **Phone Number** | — | |
| **Email Address** | — | ⚠️ **Important.** The system uses the printer's email to match their login. Get it right or they won't be able to sign in. |

**"Create Partner"**.

### 1.3 A printer's page

Click the eye icon. Shows **Facility Name, Operating Status** (Available / Closed /
Maintenance), **Physical Address**, **Primary Phone**, **Email Channel**.

Press **"Edit"** to change them; **Save Changes** or **Cancel**.

Also shows: **Active Orders** and **Stock Items** counts, created date and a reference ID.

### 1.4 Giving a printer stock

**"+ Add Book"** opens a two-step wizard:

**Step 1** — search by title, author or ISBN (only books with central stock appear). Click
**Select**.

**Step 2** — one card per edition showing **"{n} Units Available in Central"**. Enter what to send.

**"Confirm"** → the units leave central and are now attributed to that printer.

⚠️ Sending stock to a printer **does not** create a delivery record — the printer never has to
approve stock *going to* them. Approval only applies to copies going *out to a store*.

### 1.5 Editing or removing printer stock

In the **Current Inventory** table on the printer page:

- **✎ Edit** → *"Adjust Stock"* — set the absolute quantity. You can only increase by what central
  still holds.
- **🗑 Remove** → the units return to central stock.

### 1.6 Removing a printer

**"Remove"** → **"Termination Notice"** → type **DELETE** → **"Confirm"**.

⚠️ Removing a printer cascades: their print orders and their stock records go with it. Consider
marking them *Closed* in Operating Status instead.

---

## 2. Print projects — the core of printing

*Sidebar → **Printing** → **Manage Printing***

Title **"Print Logistics"**. Columns: Printing Project (name + printer + book count) · Project
Status · Total Units · Total Cost · Launch Date · eye button.

Status colours: Not Started (grey) · Started (blue) · On Progress (amber, pulsing) · Failed (red)
· Completed (green) · Reprinting (purple).

⚠️ **A project marked Completed can never be moved back** to another status. Once you are sure,
that's the end of it. There is no un-complete.

⚠️ Projects the system created automatically for stock movements (named *"Auto-delivery for…"*)
are hidden from this list. That is intentional — they aren't real projects.

💡 If a row shows an amber **"N edition printers"** chip, some editions in that project are
assigned to a *different* printer than the project's. Click through to the project page to fix it.

---

## 3. Creating a print project

**"+ New Print Project"** → the **"Initiate Project"** dialog.

### 3.1 Section A — General Project Info

| Field | Notes |
|---|---|
| **Project Name (Optional)** | e.g. "Summer Batch 2026". Helps you find it later |
| **Assign Printer** | ⚠️ **Required.** The printer who will do the work |
| **Overall Status** | Not Started / Started / On Progress / Completed |
| **Start Date** | |
| **Expected Completion** | |

### 3.2 Section B — Books to Print

Three modes, chosen with the pills at the top:

| Mode | Use when |
|---|---|
| **Existing Book & Edition** | The default — printing another run of something you already have |
| **New Edition** | A new version of an existing book |
| **New Book** | A brand-new title that isn't in the catalogue yet |

#### Mode 1 — existing editions

Pick **Select Book**, then **Select Edition**, then **"Add Book"**. Repeat for more.

Each added item is a card:

- **Quantity** — pre-filled with the edition's print count. ⚠️ It is **locked** for existing
  editions. Use the **Settings** button on the card to change the edition's total print count
  first (it will refuse any value below what's already been transferred).
- **Unit Price** and **Total Price** — what you're paying the printer for this run.
- **Content** — a rich-text editor for production notes (paper quality, binding, etc.).
- **Status** — Waiting / Started / On Progress / Completed.
- **Remove** — takes it out of the project.

⚠️ Adding the same edition twice is rejected: *"This edition is already added to the project."*

#### Mode 2 / 3 — creating on the fly

An amber panel appears with **"Open Edition Creator"** or **"Open Book Creator"**. A drawer slides
in from the right.

*New Edition*: **Select Book** → the drawer auto-fills a suggested name (*"Edition 2"* for the
second one, *"First Edition"* for the first) and the page count from the book. You can change the
name. Shared fields: **Print Quantity**, **Number of Pages**, **Total Price**, **Unit Production
Price**, **Cover Price (Optional, ETB)**.

*New Book*: **Title**, **Author**, **Category**, **Publication Year**, **Language**, plus the same
edition fields.

Press **"Create & Add to Project"**.

⚠️ A book created this way is **very sparse** — no ISBN, no short name, no description, no cover.
Fill it in properly from the catalogue afterwards.

### 3.3 Section C — Totals & Memo

- **Total Project Amount** — with **"Auto Calculate from Items"** ticked by default, which locks
  the field and sums quantity × price for you.
- **Production Memo** — printing instructions.

### 3.4 Launching

**"Launch Printing Project"**.

⚠️ Before you launch: once the printer marks an item **Completed** you cannot change its
quantity or status. Check your quantities carefully.

---

## 4. A print project's page

Click the eye icon in Manage Printing.

### 4.1 Header

Project reference (`PR-0000`), name, printer. One red button: **"Cancel Project"**.

### 4.2 Financial tracking

Three tiles: **Total Price** · **Total Paid** · **Remaining Balance**. When fully paid a green
**"Fully Paid"** pill appears.

**"+ Add Payment"** → **Amount (ETB)**, **Payment Date** (defaults to today), **Reference
(Optional)** — a receipt or cheque number → **"Record Payment"**.

Each payment row shows the date, the reference (click **Edit** or **"+ Add memo"** to change it)
and the amount. The **trash** icon deletes a payment after a confirmation.

**"Print PDF"** prints a clean payment receipt with the project details, payment history and
**Balance Due**.

### 4.3 Operational status (right sidebar)

**Current Phase** — a dropdown with six options: Not Started · Started · In Progress · Failed ·
Completed · Reprinting.

Also **Total Books**, **Total Units**, **Last Sync**, and the creation date.

⚠️ There are **two** status controls on this page — the sidebar **Current Phase** (6 options) and
the one inside **Project Configuration** (4 options, no Failed/Reprinting). The one inside the
form wins when you save. 💡 Use the sidebar one for routine status changes.

### 4.4 Books to Print — the items table

Columns: Book & Edition · Quantity · Remaining · Total Price · Status · Content · Action.

- Press **"Edit"** to turn quantities, prices and statuses into editable fields. **"Done"** to
  finish. **"Commit Changes"** at the bottom saves.
- Each row has an **eye** button opening the **Printer Visibility** dialog — turn an individual
  edition on or off for the printer.
- **"Show All to Printer"** / **"Hide All from Printer"** at the top toggles the whole project at
  once.

⚠️ **When you reduce an edition's quantity**, the edition's total print count and central
remaining stock are reduced to match. You will see a warning banner before you commit. Make sure
you haven't already transferred those copies to a store — if you have, the numbers will not
reconcile.

### 4.5 Content notes

The **Content** column shows **View** or **Add**. Clicking opens a rich-text editor for that
edition's production notes. **"Save Content"** saves immediately.

### 4.6 Project configuration

Project Name · Assigned Printer (**this is how you move a project to a different printer** — all
of that edition's stock moves with it) · Overall Status · Start Date · Target Completion, plus
the totals and memo.

### 4.7 Cancelling a project

**"Cancel Project"** → **"Batch Cancellation"** → type **DELETE** → **"Confirm Termination"**.

⚠️ A soft delete. It disappears from the list but the record stays in the database. The edition's
print count is **not** restored automatically — check and fix it on the edition page.

---

## 5. Printing Books List

*Sidebar → **Printing** → **Books List***

A cross-project view: every edition that is in any print project, with quantities summed.
Editions not in any project appear with the status **"Not in a project"** — a useful way to spot
titles nobody is printing.

Columns: Book & Edition (with a visibility dot) · Project (+ printer, + a **Change Printer**
button) · Copies · Remaining · Status · eye button.

### 5.1 The assignment dialog

Click the eye button, or the **Change Printer** pencil, to open **"Edit Book Assignment"**. This
is the most powerful printing control in the app:

1. **Current Printer** and **Current Project** — read-only summary.
2. **Visibility toggle** — "Visible to printers" / "Hidden from printers".
3. **Move to Another Project** — search and pick a target. Press **"Move to Project"**. If the
   edition is already in that project the quantities are **merged**.
4. Three tiles: **Total Print**, **In Store**, **Remaining at Printer**.
5. **New Printer** — search and pick. **"Save Changes"** re-points the project to that printer and
   moves the edition's stock with it.

⚠️ Moving an edition to another project **does not** update its total print count. If you move a
whole batch, check the edition's numbers afterwards.

💡 Use **Hidden from printers** when you need to reorganise a project without the printer seeing
it change mid-run.

---

## 6. Printing Info

*Sidebar → **Printing** → **Info***

A status overview across all projects.

Four KPI cards: **Total Books** · **Not Started** · **Started / In Progress** · **Completed**.

Table: Book · Project · Printer · Qty · Status. Search box, and a **Status** dropdown whose
options show live counts.

**Print** opens an options dialog (All Statuses / Not Started / Started / In Progress / Completed)
and prints a summary sheet with both Gregorian and Ethiopian dates.

### 6.1 The panel you will care about most

Below the main table, an orange panel appears **only when a completed edition still has copies not
yet transferred**: **"Completed — Not Yet Transferred"** with columns Book, Project, Printer,
Total Qty, Remaining.

💡 **This is your "print is done, now move the stock" worklist.** Every row here is finished
copies sitting in central that nobody has transferred to a store yet.

---

## 7. Delivery Records

*Sidebar → **Printing** → **Delivery Records***

Two panels, both **read-only**.

**Panel 1** — pick a Book then an Edition to see that edition's delivery history: Printer · Store
· Qty · Status (Approved / Pending) · Created · Approved At.

**Panel 2** — the complete history: Book · Edition · Qty · Status · Store · Printer · Created ·
Approved At. Sortable, 15 per page.

⚠️ **You cannot approve deliveries here.** Approval is done by the printer on their own
dashboard (*Printer → Deliveries*). A **Pending** record simply means the printer hasn't
confirmed it yet.

💡 If a delivery shows the **wrong printer**, the copies were moved when the edition had no real
print project, and the system created a placeholder record. Check the edition's printer
assignment on its detail page.

---

## 8. Printing → Payments (money you pay printers)

*Sidebar → **Printing** → **Payments*** — ⚠️ **not in the sidebar.** Reach it at
`/admin_dashboard/printing/payments`, or type **"Printing Payments"** in the header search box.

Tracks money a **book shop hands to a printer** for a specific order.

### 8.1 Filters

Search (printer, shop, order) · Status (All / Approved / Pending / Rejected) · Printer dropdown ·
Shop dropdown · a **"Grouped by Order"** vs **"List All"** toggle, and **"Clear Filters"**.

A counter shows *"{filtered} of {total} payments · {amount} ETB"*.

Table: Printer · Order · Shop · Amount · Status (letter badge **A**/**P**/**R**) · When · Memo
(✓ if present) · eye button.

### 8.2 A payment's detail dialog

The eye button opens **"Payment Details"**:

- Banner with the amount and status.
- **"Approve Payment"** — only shown for **direct** payments that are Pending. It warns *"This
  action cannot be reversed"* and asks you to **"Confirm & Approve"**.
  ⚠️ Check-based payments can't be approved here.
- **Danger Zone** → **"Delete Payment"** requires typing the full sentence
  **`I am sure I want to delete payment #{id}`**.
- **Individual Records** — a sub-table where each row's **Amount**, **Status** and **Memo** can be
  edited inline.
- A detail grid: Printer (changeable via a dropdown), Order, Order Total, Order Status, Shop,
  Amount, Payment Type, Status, Recorded, Updated.

⚠️ Approving or deleting printer payments **only changes this screen's records**. It does not
change the shop's debt or the order's paid amount — those are handled under
**Manage Payment**.

### 8.3 Printing this screen

The **Print** button opens a config dialog: status/shop/printer filters, title and subtitle, a
**Recorded Date** selector (Ethiopian or Gregorian), print mode (Grouped / List All), which columns
to include, memo display style, font size and an **All Bold** toggle. A live preview is shown
before printing.

---

## 9. Finance → Printing

*Sidebar → **Finance** → **Printing***

Two summary tables.

**Printers Summary** — Printer · Total Cost · Total Paid · Remaining · **Collection Rate** (green
at 100% and above, amber at 50%+, red below), with a totals footer.

**Books in Printers** — Book & Edition · Printer · Copies · Total Cost · Paid · Remaining,
**sorted with the highest outstanding balance first**. This is your list of who you owe the most.

⚠️ Payments are matched to editions by reading a `[Book — Edition]` prefix out of the payment's
reference text. If you type free-text references, some payments will show as unattributed.

---

## 10. Quick reference

| I want to… | Go to |
|---|---|
| Add a printer | Printing → **Printers** → **Register Printer** |
| Start a printing run | Printing → **Manage Printing** → **+ New Print Project** |
| Check a project's progress | Printing → **Manage Printing** → click the project |
| Record a payment to a printer | Project page → **+ Add Payment** |
| Print a payment receipt | Project page → **Print PDF** |
| Change which printer runs an edition | **Books List** → **Change Printer** |
| Move an edition to a different project | **Books List** → eye button → **Move to Another Project** |
| Hide an edition from a printer mid-run | **Books List** → eye button → visibility toggle |
| See finished copies not yet moved to a store | Printing → **Info** → orange panel at the bottom |
| Check whether a printer approved a delivery | **Delivery Records** (read-only) |
| See who you owe the most | Finance → **Printing** |
| Move printed copies into a store | File **02** → store inventory or **Store Options** |