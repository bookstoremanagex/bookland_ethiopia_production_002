# 04 — Orders, Shops & Payments

This is where the business earns money. **Approving orders and approving payments are the two
things only the main admin can do**, and the sidebar badges tell you when each is waiting.

---

## 1. The sales model in one page

```
Book Shop  ──►  Order  ──►  [you approve]  ──►  stock leaves the store
   ▲                                                      │
   │                                                      ▼
   └────  they owe you  ◄──  Payment (cash or cheque)  ◄──  Book Shop
```

- An **order** reserves (locks) stock so nobody else can sell it while you decide.
- **Approving** the order is what actually removes the stock and records the debt.
- **Payments** reduce the debt. Cheques only count once the cheque is **cleared**.

Three order types affect debt:
- **Requested** — an ordinary sale
- **On Round** — consignment: goods go out on credit, tracked through rounds
- **Walk-in / individual** — sold directly to a customer with no shop involved (file §9)

---

## 2. Book Shops

*Sidebar → **Book Shop***

Your retail partners. Columns include name, branch, contact and outstanding debt.

**"+ Add Book Shop"** needs a name and location, plus branch, phone and email.

⚠️ **Deleting a book shop is destructive.** Its holdings, orders and payment history all go with
it. Consider marking it out of use instead.

Each shop's page shows its profile, its orders, its per-edition holdings (**Assignments**), and
buttons to create an order or record a payment.

---

## 3. Manage Orders — the list

*Sidebar → **Manage Orders***

Title **"Manage Orders"** — *"Review, allocate stock, and approve bookstore orders"*.

An amber banner at the top shows **"{n} Pending Approval"** whenever anything is waiting. Four
tiles: **Total Orders**, **Pending**, **Approved**, **Total Value**.

Columns:

| Column | Shows |
|---|---|
| **Order #** | `ORD-{number}` |
| **Book Shop** | Name and location |
| **Type** | *requested* or *on round*, the date, and the time with a marker: **Mr** (5–12), **An** (12–17), **Ev** (17–20), **Ng** (20–5) |
| **Books** | First title and "+N more" |
| **Financials** | Total, and either the outstanding debt or "paid" |
| **Status** | **Approved** (green) or **Pending** (amber) |

⚠️ **Delivery staff also create orders here.** An order may already exist when you open the screen
— the notification on Home tells you when.

💡 Clicking a row opens the order. Arriving at the page with `?orderId=` in the URL opens that
order straight away — useful for links in notifications.

---

## 4. Creating an order

**"+ Add a New Order"** → two steps.

### 4.1 Pick the shop

Search **"Search shops…"**. Each card shows the shop's name, branch, and a debt figure — **red**
if they owe you, green if they're clear. On a wide screen you also get five tiles: Order · Round ·
Prev. · Last · Total.

Press **"+ Create Order"**.

### 4.2 Build the order

A full-screen **"New Order"** window with three tabs.

**Tab: Select**

- Search books by title or author.
- ⚠️ **Only books that currently have stock in a store appear.** If a book is missing, it has no
  sellable stock — check the edition's store inventory (file 02).
- Click a row to select it. A quantity row expands with **−** / **+** and a counter showing the
  maximum available.
- **"Review"** moves on. Selecting nothing gives *"Select at least one book first."*

**Tab: Selected**

- Every chosen book, with its quantity, and an **✕** to remove it.
- **"Clear all"** empties the list.
- **"Continue"** moves on.

**Tab: Info** — this is where the money happens:

| Field | What it does |
|---|---|
| **Order Summary** | One row per book with quantity and line total |
| **Auto / Manual** | **Auto** (default) prices each copy at its edition's selling price, filling from the **oldest edition first**. **Manual** lets you type any Grand Total, which **overrides** that |
| **Order Type** | **Requested** or **On Round** |
| **Amount Paid (ETB)** | Anything already paid up front |
| **Lock Books** | **On by default.** Reserves the stock so another order can't take it while you wait |

Press **"Create Order — {total} ETB"**.

⚠️ **Use Manual carefully.** The Grand Total you type becomes the order's official value and drives
the debt split across every edition. A typo here becomes a permanent accounting error.

⚠️ **Leave Lock Books on** unless you specifically want other orders to be able to consume this
stock.

---

## 5. Approving an order — the most important screen

Click any order row.

The header shows **Order #ORD-{id}**, a status badge, the shop's name and location, **Placed on**
(date, time and part of day), **Order Made By** (who entered it), and a **Total Debt** strip
split into Order · Last · Round · Prev.

### 5.1 If it's already approved

Read-only summary: **Total**, **Paid**, **Remaining**; an **Ordered Items** table; and the
**Store Allocation Breakdown** — which store each edition's copies went to.

### 5.2 Allocating stock (pending orders)

**Step 1 — Choose a source.**

The **"Select Store for Allocation"** row shows a chip for **every distinct source** holding the
books on this order. Stores use a building icon; printers show a purple **Printer** tag.

**Step 2 — Auto-fill, or fill by hand.**

- **"Auto-Fill All"** fills each book's quantities into the store you selected, taking as much as
  each store can supply, zeroes the other inputs, and re-sorts the book cards so fully-satisfied
  books float to the top and problems sink to the bottom. 💡 **Start here.**
- By hand: each book card has one nested card per **edition**, showing the unit price, how many
  units are **Locked** by other pending orders (in red), and a two-column grid of **per-store
  quantity inputs**. Each shows *"Available: N"* and turns green when valid, red when over.

Each book card header shows **Requested**, **Allocated** (green when it matches), the FIFO chips
(`3× Edition A`), and a status of **Complete**, **"{n} remaining"** or **Ignored**.

**Step 3 — Check the validation strip.**

When something is short you'll see **"Allocation amounts must match requested quantities"** with a
list: *"• {book}: {n} more needed"*. You must fix every one, or explicitly ignore the book.

⚠️ **Ignoring a book silently removes it from the order.** The delivery staff are not told. If you
ignore something by accident, cancel and edit the order instead.

**Step 4 — Approve.**

**"Approve Order"** is only enabled when every book's allocation matches its request.

### 5.3 What approving actually does

In one atomic step:

1. Recalculates the order total from your allocations and **overwrites** it.
2. **Removes the stock** from every store or printer you allocated from.
3. **Adds the copies to the shop's holdings** with their share of what's already paid.
4. Rewrites the order's line items to match the allocations.
5. Releases the stock locks.
6. Marks the order **Approved**.
7. Saves a written allocation summary (used later by the Store Info print mode).
8. Tells the delivery team.

⚠️ **The total is recalculated from your allocations.** If you allocated at a different price than
the order was created with, the order total changes. Check the number before you approve.

⚠️ **The order's paid amount is split proportionally across all allocations.** If you changed the
total, the amount the shop is recorded as having paid may not match what was entered.

### 5.4 Payment summary

If the order already has an approved payment, a **Payment Summary** card appears above the
approve button showing total paid, remaining, and each linked payment with its date and memo.

---

## 6. Other things in the order window

### 6.1 Removing books

**⚙ Advanced** on a book card opens a dialog with a quantity input per edition and a
**FIFO Total** vs **Edited Total** comparison. You can **"Remove Book"** from the order here, or
**"Confirm"** to keep quantity edits.

To remove several books: **"Delete Selected"** at the bottom turns the cards into a multi-select;
tick them and press **"Delete Selected (N)"** → confirm.

⚠️ Removing a book reduces the order total but **does not reduce what the shop already paid.** If
you remove an item that was paid for, the order becomes overpaid and disappears from every debt
report.

### 6.2 Deleting a pending order

**"Delete Order"** → confirm.

This releases the stock locks, **deletes any payment made for this order**, and removes the order.
⚠️ It cannot be undone, and the payment record is gone too.

### 6.3 Marking as delivered

Once approved and physically delivered, there's a delivery action on the order. Marking an order
delivered:
- stamps it as delivered with your name as the deliverer
- notifies the admin
- feeds the **Completed Deliveries** report
- ⚠️ **does not move any stock or change any debt** — it's purely a flag

### 6.4 Printing

**"Print"** → a clean ORDER SUMMARY sheet with shop details, a Book/Edition/Qty/Price/Subtotal
table, and Total / Paid / Remaining. Good for the shop's paperwork.

**"Options"** → the **Print Options** dialog:

| Control | Options |
|---|---|
| **Print Mode** | **Custom** (configurable columns) or **Store Info** (fixed Book/Edition/Qty/Store) |
| **Font Size** | Big · Small (default) · V.Small · X.Small |
| **Page Width** | Full (default) or Half |
| **Include in print** | Book Shop · Date · Qty · Price · Subtotal · Edition · **Store (off by default)** · Status · Delivery |

💡 Turning on **Store** automatically turns on **Edition**. **Store Info** mode is the one to use
when the delivery driver needs to know which warehouse each copy comes from.

Both modes print Ethiopian and Gregorian dates on every page, a running header with the order
number, and a page counter.

---

## 7. Manage Payment — taking money

*Sidebar → **Manage Payment***

⚠️ An amber badge appears here whenever a payment is waiting for approval.

### 7.1 Recording a payment

From a shop's page, or from an order's window → **"Payment"**.

| Field | Notes |
|---|---|
| **Shop** | |
| **Amount (ETB)** | |
| **Payment Type** | **DIRECT** (cash / bank) or **CHECK** |
| **Check** | only for CHECK — pick which cheque |
| **Cheque image** | upload or paste a URL |
| **Applies to** | which order, or mark it **"For previous debts"** |
| **Memo** | |

Press **"Record Payment"**.

⚠️ **A cheque payment is recorded as *Pending*.** It does not reduce the shop's debt until the
cheque is cleared — see §8.

### 7.2 Approving

Pending payments appear in the Manage Payment list. Approving one:

- marks it **APPROVED**
- **applies the money to that one specific order** only
- reduces the shop's outstanding debt
- notifies the admin and the delivery team

⚠️ **Payments are never spread across a shop's other orders.** If the linked order is already
fully paid, approving does nothing to the debt — the money is recorded but not applied. This is
deliberate, but it surprises people.

⚠️ **If a payment is larger than the remaining balance on its order, the excess is silently
dropped.** Split the payment across orders deliberately rather than entering one large figure.

⚠️ A payment with **no order attached** (recorded against previous debts) approves without
reducing any order.

### 7.3 Other payment actions

- **Reject** — only possible while the payment is still Pending. Once approved it can't be
  rejected.
- **Set back to Pending** — reverses the amount from the order.
- **Delete** — soft delete; reverses the amount from the order.

⚠️ **Check these actions worked.** If the reversal fails partway the payment may end up Pending
while the order still shows the money applied. Verify the order's Paid figure afterwards.

---

## 8. Checks (cheques)

*Sidebar → **Manage Checks***

### 8.1 Recording a cheque

**"+ New Check"**:

| Field | Required |
|---|---|
| **Username** | ✅ |
| **Bank Name** | ✅ |
| **Type** | **Payment** or **Collateral** |
| **Amount** | |
| **Recorded Date** | |
| **Memo** | |

⚠️ There is **no Expiry Date field here** — you can only add it later from the check's detail
page. ⚠️ Cheques are stored as a text field, so type numbers only.

### 8.2 The list

Columns: # · Username · Bank · Type · Amount · Status · Expiry Date · eye button. Filter by Type
and Status.

### 8.3 Check types — this matters

| Type | Effect on debt |
|---|---|
| **Payment** | Approving the cheque **reduces** the shop's debt |
| **Collateral** | Approving the cheque **does not reduce debt.** The cheque is held as security. The full value stays owed |

### 8.4 A cheque's detail page

Shows the details, any uploaded cheque image, and **every order linked to it**.

**"Approve & Clear"** (only for admin, only while Pending) does all of this at once:

1. Marks the cheque **CLEARED**
2. Approves every pending payment attached to it
3. Walks the shop's orders oldest-first and pays them down until the money is used up
4. Approves any pending round payments attached to it

⚠️ **Step 3 is a real cascade across multiple orders** and any remainder is discarded silently if
the shop doesn't have enough outstanding orders. Approve small cheques individually if you want
to control exactly which order gets paid.

⚠️ **An order paid by cheque cannot be approved until its cheque is cleared.** You'll see
*"The associated check must be cleared before this order can be approved."*

### 8.5 Statuses

| Status | What it means | Money effect |
|---|---|---|
| **PENDING** | Just recorded | None |
| **DELIVERED** | Handed to the bank | None, but notifies the delivery team |
| **CLEARED** | The bank confirmed it | **Applies the money** |
| **BOUNCED** | Rejected by the bank | **None — money is not collected** |
| **CANCELLED** | Withdrawn | None |

⚠️ **Always check BOUNCED cheques.** The debt does not go back up automatically — if a cheque you
already counted on bounces, you must raise a new payment.

Changing a cheque's amount is ignored once it is **CLEARED**.

### 8.6 Check Dates — the expiry watchlist

*Manage Checks* → **Check Dates**

Shows only live, uncleared cheques **that have an expiry date**, soonest first. Each row shows the
remaining time: *"Expires today"* · *"5d remaining"* · *"3w 2d remaining"* · *"Expired 4d ago"*.

Tabs split **Active** and **Expired**, with counts.

💡 **Use this weekly.** It's the fastest way to find a cheque about to bounce.

---

## 9. Selling to individuals (walk-in)

*Sidebar → **Selling to individual***

Retail sales to customers who aren't book shops — no debt ledger, paid on the spot.

**"Add Retail Purchase"** → customer name, date, memo, amount paid, then pick editions and
quantities.

A purchase starts as **PENDING**. Approving it removes the stock from the store. As money comes in,
the status moves **PENDING → PARTIALLY PAID → PAID**.

⚠️ **You cannot edit a walk-in purchase.** There is no edit — only record payment, approve, or
delete. Get it right the first time.

---

## 10. Manage Rounds

*Sidebar → **Manage Rounds***

A **round** is consignment: books go out to shops on credit and come back unsold. Unlike an order,
the shop only pays for what sells.

**The lifecycle:**

1. **Delivery staff create a round** with a book/edition pool and a starting amount. This is the
   Delivery dashboard's job, not yours.
2. You **allocate** the round — distribute the pool across shops. Guards: you can't allocate a
   round that's already active, or one that's already been allocated.
3. Each shop gets a **round record** showing what they owe.
4. They **pay against the round** — by cash or cheque.
5. You **approve** round payments, or use **"Pay Full Shop"** / **"Pay and Approve All Shops"** to
   settle several at once.
6. At the end, **deduct** what came back in.

Columns show the book, edition, starting amount, returned amount, and per-shop status.

⚠️ **Round debt is tracked separately from order debt**, but both appear together in
**Payments Due** and in a shop's Total Debt.

⚠️ Unlike orders, **rounds do not lock stock**. Copies allocated to a round are gone but are not
recorded as sold — so "in store" figures can look lower than reality while a round is open.

---

## 11. Reports

*Sidebar → **Reports***

**Completed Deliveries** — orders marked as delivered, with a receipt view you can print per
delivery.

**Pending Deliveries** — approved orders not yet delivered. 💡 Use this as your delivery run sheet.

---

## 12. Shop Assignments

Reached from a book's **Shop** tab, or `/admin_dashboard/shop_assignments/{id}`.

Shows one book-shop's holding of one edition: quantity, price per piece, total price, what's been
paid and what's remaining.

**"Add Edition to Shop"** creates these directly — useful for recording stock given to a shop
outside the normal order flow (samples, goodwill stock).

---

## 13. Quick reference

| I want to… | Go to |
|---|---|
| See what's waiting for me | **Manage Orders** (amber badge) and **Manage Payment** |
| Create an order | **Manage Orders** → **+ Add a New Order** |
| **Approve an order** | **Manage Orders** → click the row → **Auto-Fill All** → **Approve Order** |
| Print an order for the shop | Order window → **Print** or **Options** |
| Remove a book from a pending order | Order window → **⚙ Advanced** → **Remove Book** |
| Cancel a pending order | Order window → **Delete Order** |
| Record a payment | Shop page, or order window → **Payment** |
| Approve a payment | **Manage Payment** → Approve |
| Record a cheque | **Manage Checks** → **+ New Check** |
| Clear a cheque (releases the money) | Check page → **Approve & Clear** |
| Find a cheque about to expire | **Manage Checks** → **Check Dates** |
| Sell to a walk-in customer | **Selling to individual** |
| Handle consignment | **Manage Rounds** |
| See what still needs delivering | **Reports** → **Pending Deliveries** |
| See who owes the most | File **05** → **Payments Due** |

---

## 14. Two-minute approval routine

If you're catching up after time away:

1. **Manage Payment** — clear the amber badge. Approve or reject each pending payment.
2. **Manage Checks** → **Check Dates** — spot anything expiring. Clear the ones that have come back.
3. **Manage Orders** — work top to bottom:
   - Open the order → pick a source store → **Auto-Fill All**
   - Check the validation strip
   - If anything is genuinely unavailable, ⚙ **Advanced** → **Ignore** it — but note it and tell
     the delivery team afterwards
   - **Approve Order**
4. **Reports** → **Pending Deliveries** — confirm the approved orders have actually gone out.
5. **Finance** → **Payments Due** — sanity check the totals before you sign off.