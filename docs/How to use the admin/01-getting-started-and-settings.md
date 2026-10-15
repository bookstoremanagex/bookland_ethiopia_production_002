# 01 — Getting Started & Settings

---

## 1. Signing in

1. Open the application URL. You land on the sign-in page.
2. Enter your **email address or phone number**.
3. Enter your **password**.
4. Press **Sign In**.

You are sent straight to your role's dashboard. As the main admin that is the **Admin Panel**.

⚠️ If you get *"Invalid email or password"* the account may be deleted, deactivated, or you may
be using the wrong identifier. Passwords are case sensitive.

💡 **Printer accounts** can sign in with either their printer email or their phone number — that
is a special fallback built into the login.

---

## 2. The header (top bar)

Four controls, left to right:

| Control | What it does |
|---|---|
| ☰ **Sidebar toggle** | Collapses or expands the left menu |
| **Search menus…** | Type any menu name to jump straight to it. Use the **"All Groups"** dropdown to narrow to one section. `↑`/`↓` to move, `Enter` to open, `Esc` to close. **Hidden on phones** — use the sidebar there |
| **GC ⇄ EC** | Switches every date in the app between **Gregorian** and **Ethiopian (EC)** calendars. Remember your choice |
| **Your name + role** | Opens your profile, theme settings, and **Sign Out** |

⚠️ There is **no notification bell** in the header. Unread notifications show as a number badge
next to **Notifications** in the sidebar, and as a panel on the Home screen.

**Signing out:** click your name → **Sign Out** → confirm in the dialog. You return to the login
page.

⚠️ Your session lasts **7 days** and is not extended by activity. After a week you will be signed
out and must log in again. Unsaved work will be lost — save before you leave.

---

## 3. Your profile and password

`Profile` in the sidebar, or your name in the header → **Profile**.

You can change:

- **Full Name**
- **Email Address**
- **Password** — needs your current password and at least 6 characters

💡 Change your email carefully: it is also your username for signing in.

---

## 4. The Home screen

This is your overview. Reading it top to bottom:

### 4.1 The banner

Three big numbers:

- **Books in catalog** — total titles (not editions)
- **Gross revenue (ETB)** — total value distributed to shops
- **Pending orders** — orders waiting for your approval

### 4.2 Backup Status card

Directly under the banner. Colour tells you what to do:

| Card colour | Meaning | Action |
|---|---|---|
| Grey — *"No backup recorded yet"* | Never backed up | Make one today (below) |
| Green — *"Backup up to date"* | Under 12 hours old | Nothing to do |
| Amber — *"Backup getting old"* | 12–24 hours old | Back up soon |
| Red — *"Backup is overdue"* | Over 24 hours old | **Back up now** |

Press **"Record Backup"**. The file downloads to your computer and the card resets to green.

### 4.3 Quick Actions

Eight tiles that jump to the screens you use most:

Manage Orders · Manage Payments · Payments Due · Check Dates · Store Options · Manage Printing ·
Manage Rounds · Book Shops

### 4.4 Unread Notifications panel

Only appears if you have unread items. Each one is a button — click it to read the full message.
**"Go to Notifications →"** takes you to the full list.

### 4.5 Stats Overview — six tiles

| Tile | Meaning |
|---|---|
| Books in catalog | Active titles |
| Partner shops | Retail locations |
| Gross revenue | Distributed value, with a % growth arrow |
| Outstanding | **Pending collection — this is your biggest number to watch** |
| Pending orders | Awaiting approval |
| Low stock items | Below the threshold |

These tiles are read-only — click nothing.

### 4.6 Charts

- **Orders by Day** — approved orders over the last 30 days. The best day is highlighted; a pill
  at the bottom names it.
- **Production pipeline** — a donut showing how copies are spread across your stores, with total
  copies and the top store.

### 4.7 Recent Orders + Low Stock Alerts

- **Recent Orders** — the latest five approved orders, with **"View all →"** to Manage Orders.
- **Low Stock Alerts** — books with fewer than **500 copies across all stores**, tagged:
  **Critical** (10 or fewer) · **Low** (25 or fewer) · **Running low** (above 25). Each row also
  shows how many copies are **ready to transfer** — i.e. already printed and waiting to be moved
  to a store. **"Show More →"** goes to Production → Low Stock.

### 4.8 Activity Log preview

The last five actions by anyone. **"View all →"** opens the full audit trail.

### 4.9 Top 20% Best Sellers

A scrolling strip of your all-time best sellers, ranked `#1`, `#2`, … **Click any cover to open
that book.** You can also grab the strip and drag it with the mouse.

---

## 5. Settings → Accounts

*Sidebar → **Settings** → **Accounts***

### 5.1 The list

Columns: Name · Email · Type (the role) · Status (Active / Inactive) · an eye button to open it.

Toolbar: a **"Search accounts..."** box and an **"Add Account"** button. Paginated 10 per page.

### 5.2 Adding an account

Press **"Add Account"**. Four fields, all required:

| Field | Notes |
|---|---|
| **Full Name** | The person's name as it should appear on the system |
| **Email Address** | Must be unique. This is their sign-in name |
| **Initial Password** | Give them something temporary; ask them to change it in Profile |
| **Account Role** | Pick from the 7 options listed below |

Press **"Save Account"**.

**What happens automatically:** the new account is given **view-only** access to books, stores,
book shops, damaged books, notes and the document registers. **Nothing else** — they cannot add
or change anything until you grant more.

⚠️ The new account is created **Active** by default. Remember to deactivate or delete it when
someone leaves.

### 5.3 The roles you can assign

| Role | Lands in |
|---|---|
| **Operations Manager** | Production, printing, orders, delivery reports |
| **Inventory Manager** | Books, editions, stores, low stock, damage |
| **Finance Officer** | Read-only finance and reporting screens |
| **Sales Staff** | ⚠️ No dashboard exists — this role cannot sign in successfully |
| **Printer** | Their own print projects, stock and deliveries |
| **Viewer** | Read-only portal across the catalogue and reports |
| **Delivery Account** | Shop orders, walk-in sales, rounds, payments |

⚠️ When you *edit* an account the list is slightly different — it offers **Delivery and Sales
Management** and **Delivery Sample** (which have no dashboards) but not **Delivery Account**.
This is a known inconsistency. If you need to create a Delivery Account, set the role at creation
time.

⚠️ **Never assign "Sales Staff", "Delivery and Sales Management" or "Delivery Sample"** — those
users will be redirected to a page that doesn't exist.

### 5.4 Opening an account

Click the eye icon. You see **Name, Email, Phone Number, Account Role, Status**.

Press **"Edit Account"** to change Name, Email, Phone Number, Role and to toggle **Active /
Inactive**. Press **"Save Changes"** when done, or **"Cancel"** to discard.

💡 **Deactivating is better than deleting.** An inactive account cannot sign in but keeps its
history — orders it created, notes it wrote, activity log entries.

### 5.5 Resetting a password

On the account page, scroll to **Security Settings** → press **"Reset Account Password"** → type
the new password → **"Update Password"**.

The password must be at least **6 characters**.

### 5.6 Deleting an account

Press **"Delete Account"** → confirm with **"Yes, Delete"**.

⚠️ This only marks the account as deleted. Two important consequences:

1. **Anyone already signed in on that account stays signed in until their session expires.** You
   cannot force-log them out. Ask them to sign out.
2. **It cannot be undone from the dashboard.** The account disappears from the list.

💡 Use **Inactive** instead wherever possible.

### 5.7 About permissions — read this

The system has a larger permission list (things like *Adding Books*, *Editing Stores*, *Record
Payment*), and **there is currently no screen for managing them per account.** They are set once
when the account is created, and only the admin's own account bypasses them automatically.

What this means in practice: **you, as the main admin, can do everything.** Other roles can see
their own dashboards but many actions will be refused. If someone tells you "the button is
missing" or "I got Access Denied", that's the permission system — not a bug in their account.

---

## 6. Settings → Menu Management

*Sidebar → **Settings** → **Menu Management***

Use this to control **what other staff can see**. You cannot hide your own admin menus here.

### 6.1 Which dashboards are affected

Only four. The list on the left shows each with a count of currently-enabled menus:

- **Operations Manager**
- **Inventory Manager**
- **Finance Officer**
- **Viewer**

Your own Admin dashboard, the Delivery dashboard and the Printer dashboard are **not** affected —
those menus are fixed in the app.

⚠️ Accounts of other types (Printer, Delivery Account, and the broken roles) have **no** menu
settings here — their menus are always on.

### 6.2 Turning a menu on or off

1. Pick the account type from the left rail.
2. Read the cards. Each parent card shows **"N of M enabled"**.
3. Flip a toggle. It saves **immediately** — there is no Save button.
4. Toggle the whole parent, or individual sub-items under it.

**Home** cannot be switched off. Trying shows the message *"Home is always enabled for every
dashboard"*.

⚠️ **Turning a menu off does more than hide the link.** Anyone who types the URL directly gets a
**404 Not Found** page. That is intentional — it's how access is actually blocked.

⚠️ Changes can take **up to 10 seconds** to take effect. If someone reports they still see an old
menu, ask them to refresh.

⚠️ Nothing goes wrong if you toggle something off by accident — toggle it back on.

### 6.3 "Seed Menus"

The **"Seed Menus"** button at the top resets things.

⚠️ **It turns every menu ON for all four dashboards and wipes any custom hiding you have done.**
Only use it after adding a brand-new section, or to recover from a mess.

The page reloads when it finishes.

---

## 7. Settings → Theme Customization

*Sidebar → **Settings** → **Theme Customization*** (also reachable from your name menu → Settings)

### 7.1 What you can change

Four colours:

| Control | Default | What it affects |
|---|---|---|
| **Primary colour** | `#408A71` (Emerald Mint) | Buttons, links, active highlights, headings — the whole brand colour |
| **Badge count colour** | `#059669` | The number badges in the sidebar (pending orders, notifications) |
| **Toast background** | `#FFFFFF` | The little pop-up messages |
| **Toast text colour** | `#1E293B` | The text inside those pop-ups |

For the primary colour there are **6 presets** — Emerald Mint, Royal Indigo, Deep Amethyst,
Crimson Rose, Amber Ochre, Classic Slate — or you can enter any hex code yourself.

### 7.2 How it works

1. Pick a colour. The **whole page changes instantly** so you can see it.
2. Look at the **Live Component Canvas** on the right — a real button, badge and card.
3. Check the **Sidebar Preview** for the badge colour and **Toast Preview** for the toasts.
4. Press **"Save Theme"** to make it stick for everyone.

⚠️ **"Reset Default" only changes your screen**, not the saved setting. You still have to press
**Save Theme**.

⚠️ These colours are **global**. Changing them affects every user on every dashboard immediately.

---

## 8. Backup

*Sidebar → **Backup***

### 8.1 Making a backup

1. Press **"New Backup"** (top right).
2. The button shows "Creating Backup…" while it works. On a large database this can take a
   minute.
3. When it finishes, a **`.sql` file downloads** to your computer.
4. A row is added to the table below.

The filename is the **Ethiopian date and time**, e.g. `ጥር 15 2018 ፣ ጠዋት 9:05.sql`, with `-2`, `-3`
added if that name has been used before.

⚠️ **Only your computer holds the backup.** The server keeps a record of the *name, size and time*
— not the file itself. If you clear your downloads, that backup is gone.

⚠️ **There is no "Restore" button anywhere in the system.** Restoring is a job for a developer. A
backup is only useful if someone knows how to load it.

💡 **Put backups somewhere safe and long-lived** — a dated folder, an external drive, cloud
storage. Don't leave them in your Downloads folder.

### 8.2 The table

Columns: **File Name** · **Size** · **Status** · **Created**. Searchable, sortable, 10 per page.

- **Status** is green `success` or red `failed`. A failed row means the dump did not complete —
  the file may be incomplete, so don't rely on it.
- The **Created** date follows your calendar preference (EC or GC).
- ⚠️ There is no way to delete rows or re-download an old backup from here; the list just grows.

### 8.3 How often

The Home dashboard turns the backup card amber after 12 hours and red after 24. **Back up at
least daily**, and always before anything unusual — bulk deletions, a printer changeover, or
before giving someone access.

💡 A backup that takes one minute is far cheaper than a day of lost data.

---

## 9. Activity Log

*Sidebar → **Activity Log***

Every significant action in the system, newest first. This is your audit trail — use it to answer
"who approved this order?" or "when did this payment change?".

**Columns:** ID · User Account (email + role) · Action Performed · Activity Details · Network IP ·
Timestamp

**Controls:**
- **Search** across all fields
- **USER** dropdown — filter to one person
- **"All Accounts"** resets the filter
- 20 rows per page

**"Activity Details"** is a JSON blob rendered readably. Store-allocation entries show as
`Store: N units` lines. Other entries show as `Label: value` lines.

⚠️ The **Timestamp** column shows the browser's own date format and ignores your calendar
preference — a known inconsistency.

💡 Useful checks: search for `Approved` to see order approvals; `payment` to see money movements.

---

## 10. Notifications

*Sidebar → **Notifications***

Where the system tells you things. Most notifications are created automatically:

| You get told when… | Sent to |
|---|---|
| A new order is placed | Admin |
| An order is approved | Delivery staff |
| An order is marked delivered | Admin |
| A payment is recorded or approved | Admin, Delivery staff |
| A check is delivered or cleared | Admin, Delivery staff |

Open an item to read the full message. Mark as read, or delete it.

💡 The unread count in the sidebar refreshes every 30 seconds — no need to reload.

---

## 11. Notes

*Sidebar → **Notes***

Private notes attached to **your** account — phone numbers, reminders, anything.

**"Add Note"** takes a title and body. Click a note to read or edit it. Delete when it is no
longer useful.

Nobody else sees your notes.

---

## 12. Quick troubleshooting

| Symptom | What to do |
|---|---|
| "Access Denied" on a page | You're signed in as the wrong role, or an admin hid that menu in Menu Management |
| A menu link returns 404 | The menu was switched off in Menu Management — toggle it back on |
| Numbers on the Home screen look stale | Press `F5` — the screen doesn't auto-refresh |
| An action says "Not authenticated" | Your 7-day session expired — sign in again |
| A list shows only a few results | Narrow the search — pagination is unreliable on some screens |
| A page is blank while loading | Normal — there is no loading indicator. Wait a few seconds |
| Someone changed a password by mistake | Reset it from Settings → Accounts → their account |
| You can't find a menu | Use the header **"Search menus…"** box |
| Deleting something went to a blank page | Expected — press the browser Back button |