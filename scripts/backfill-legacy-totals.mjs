import { PrismaClient } from "../src/generated/prisma/index.js";
import { readFileSync } from "fs";

const raw = readFileSync(".env", "utf8");
const m = raw.match(/^DATABASE_URL="?([^\n"]+)"?/m);
process.env.DATABASE_URL = m[1];

const p = new PrismaClient();

const eds = await p.bookedition.findMany({
  where: { is_deleted: false },
  include: {
    bookeditionstores: { where: { is_deleted: false } },
    order_items: { where: { order: { is_deleted: false } }, include: { order: true } },
    round_books: { where: { is_deleted: false, status: false, allocated: true } },
  },
});

const fulfilled = (o) => o?.is_approved === true || o?.status === "Approved";

let updated = 0;
let totalBumped = 0;
const changed = [];

for (const ed of eds) {
  const inStore = ed.bookeditionstores.reduce((s, b) => s + (b.quantity || 0), 0);
  const central = Number(ed.count_remening_for_transfer || 0);
  const total = Number(ed.total_print_count || 0);
  const soldAsOrder = ed.order_items.filter(i => i.order?.order_type === "requested" && fulfilled(i.order)).reduce((s, i) => s + (i.quantity || 0), 0);
  const soldAsOrderRounds = ed.order_items.filter(i => i.order?.order_type === "on round" && fulfilled(i.order)).reduce((s, i) => s + (i.quantity || 0), 0);
  const soldAsRoundBooks = ed.round_books.reduce((s, rb) => s + ((rb.starting_amount || 0) - (rb.returned_amount || 0)), 0);
  const base = central + inStore + soldAsOrder + soldAsOrderRounds + soldAsRoundBooks;

  if (base > total) {
    const diff = base - total;
    await p.bookedition.update({
      where: { id: ed.id },
      data: { total_print_count: base, updatedAt: new Date() },
    });
    updated++;
    totalBumped += diff;
    changed.push({ id: ed.id, oldTotal: total, newTotal: base, diff });
  }
}

console.log(`Updated editions: ${updated}`);
console.log(`Total units bumped: ${totalBumped}`);
for (const c of changed) console.log(`  ED${c.id}: ${c.oldTotal} -> ${c.newTotal} (+${c.diff})`);

await p.$disconnect();