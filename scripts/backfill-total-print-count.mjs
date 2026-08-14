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
    bookeditionprinters: { where: { is_deleted: false } },
    order_items: { where: { order: { is_approved: true, is_deleted: false } }, include: { order: true } },
    round_books: { where: { is_deleted: false, status: false, allocated: true } },
  },
});

let changed = 0;
let increaseTotal = 0;
for (const ed of eds) {
  const inStore = ed.bookeditionstores.reduce((s, b) => s + (b.quantity || 0), 0);
  const printer = ed.bookeditionprinters.reduce((s, b) => s + (b.quantity || 0), 0);
  const soldOrder = ed.order_items.filter(i => i.order?.order_type === "requested").reduce((s, i) => s + (i.quantity || 0), 0);
  const soldOnRound = ed.order_items.filter(i => i.order?.order_type === "on round").reduce((s, i) => s + (i.quantity || 0), 0);
  const soldRoundBooks = ed.round_books.reduce((s, rb) => s + ((rb.starting_amount || 0) - (rb.returned_amount || 0)), 0);
  const sold = soldOrder + soldOnRound + soldRoundBooks;

  const reconciledTotal = (ed.count_remening_for_transfer || 0) + printer + inStore + sold;
  const current = Number(ed.total_print_count || 0);
  if (reconciledTotal > current) {
    const updated = await p.bookedition.update({
      where: { id: ed.id },
      data: { total_print_count: reconciledTotal },
    });
    changed++;
    increaseTotal += reconciledTotal - current;
    console.log(`ED${ed.id}: total ${current} -> ${updated.total_print_count} (+${reconciledTotal - current})`);
  }
}
console.log(`\nDone. Editions updated: ${changed} | total increase: ${increaseTotal}`);
await p.$disconnect();
