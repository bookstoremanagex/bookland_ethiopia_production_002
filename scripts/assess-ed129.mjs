import { PrismaClient } from "../src/generated/prisma/index.js";
import { readFileSync } from "fs";

const raw = readFileSync(".env", "utf8");
const m = raw.match(/^DATABASE_URL="?([^\n"]+)"?/m);
process.env.DATABASE_URL = m[1];

const p = new PrismaClient();

const ed = await p.bookedition.findUnique({
  where: { id: 129 },
  include: {
    bookeditionstores: { where: { is_deleted: false } },
    order_items: { include: { order: true } },
    printorder_items: { where: { is_deleted: false }, include: { printer_delivery_records: { where: { is_deleted: false } } } },
  },
});

const inStore = ed.bookeditionstores.reduce((s, b) => s + (b.quantity || 0), 0);
const fulfilled = (o) => o?.is_approved === true || o?.status === "Approved";
const approvedQty = ed.order_items.filter(i => i.order?.order_type === "requested" && i.order?.is_approved === true).reduce((s, i) => s + (i.quantity || 0), 0);
const legacyQty = ed.order_items.filter(i => i.order?.order_type === "requested" && i.order?.is_approved === false && i.order?.status === "Approved").reduce((s, i) => s + (i.quantity || 0), 0);
const pendingQty = ed.order_items.filter(i => i.order?.order_type === "requested" && i.order?.is_approved === false && i.order?.status !== "Approved").reduce((s, i) => s + (i.quantity || 0), 0);
const deliveredToStores = ed.printorder_items.reduce((s, pi) => s + pi.printer_delivery_records.reduce((x, r) => x + (r.quantity_deliverd || 0), 0), 0);
const printOrderQty = ed.printorder_items.reduce((s, pi) => s + (pi.quantity || 0), 0);

const total = Number(ed.total_print_count);
const central = Number(ed.count_remening_for_transfer);

console.log(`total_print_count           = ${total}`);
console.log(`count_remening_for_transfer = ${central}`);
console.log(`inStore (store2)            = ${inStore}`);
console.log(`sold approved orders        = ${approvedQty}`);
console.log(`legacy orders (Approved,!approved)= ${legacyQty}`);
console.log(`pending orders (not ded.)    = ${pendingQty}`);
console.log(`printorder_items qty         = ${printOrderQty}`);
console.log(`delivery records total       = ${deliveredToStores}`);
console.log(``);
console.log(`User's calc: total - (inStore + sold incl legacy) = ${total} - ${inStore + approvedQty + legacyQty} = ${total - (inStore + approvedQty + legacyQty)}`);
console.log(`Remaining for transfer (shown) = ${central}`);
console.log(`Difference = ${(total - (inStore + approvedQty + legacyQty)) - central}`);
console.log(``);
console.log(`Reconciliation (what we now display):`);
console.log(`  central=${central} + inStore=${inStore} + sold(${approvedQty}+${legacyQty}) = ${central + inStore + approvedQty + legacyQty}`);
console.log(`  vs total=${total} -> residual gap = ${total - (central + inStore + approvedQty + legacyQty)}`);
console.log(``);
console.log(`5000 - 1980 = ${5000 - 1980}`);
console.log(`central ${central} - 20 = ${central - 20}`);

await p.$disconnect();