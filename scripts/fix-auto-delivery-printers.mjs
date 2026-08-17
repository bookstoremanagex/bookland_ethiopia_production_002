import { PrismaClient } from "../src/generated/prisma/index.js";
import { readFileSync } from "fs";

const dbUrlArg = process.argv.find((a) => a.startsWith("--db-url="));
if (dbUrlArg) {
  process.env.DATABASE_URL = dbUrlArg.slice("--db-url=".length);
  console.log("Using DB URL from --db-url override.");
} else {
  const raw = readFileSync(".env", "utf8");
  const m = raw.match(/^DATABASE_URL="?([^\n"]+)"?/m);
  process.env.DATABASE_URL = m[1];
}

const p = new PrismaClient();

const isAuto = (name) =>
  (name || "").startsWith("Auto-delivery for") ||
  (name || "").startsWith("[Auto Delivery]");

const dummyOrders = await p.printorder.findMany({
  where: {
    is_deleted: false,
    project_name: { startsWith: "Auto-delivery for" },
  },
  include: {
    printorder_items: {
      where: { is_deleted: false },
      select: { bookEditionId: true },
    },
  },
});

let fixed = 0;
let skipped = 0;

for (const order of dummyOrders) {
  const editionIds = [...new Set(order.printorder_items.map((i) => i.bookEditionId).filter(Number.isInteger))];
  if (editionIds.length === 0) {
    skipped++;
    continue;
  }

  let targetPrinterId = null;
  for (const editionId of editionIds) {
    // 1. connected printer (bookeditionprinters)
    const bep = await p.bookeditionprinters.findFirst({
      where: { editionId, is_deleted: false },
      orderBy: { updatedAt: "desc" },
    });
    if (bep) {
      targetPrinterId = bep.printerId;
      break;
    }
    // 2. most recent real (non-auto-delivery) print order's printer
    const realItem = await p.printorder_items.findFirst({
      where: { bookEditionId: editionId, is_deleted: false },
      include: { printorder: true },
      orderBy: { createdAt: "desc" },
    });
    if (realItem?.printorder && !isAuto(realItem.printorder.project_name)) {
      targetPrinterId = realItem.printorder.printerId;
      break;
    }
  }

  if (!targetPrinterId) {
    console.log(`PO${order.id}: no connected/real-project printer for edition(s) ${editionIds.join(",")} — skipped`);
    skipped++;
    continue;
  }

  if (order.printerId === targetPrinterId) {
    skipped++;
    continue;
  }

  await p.printorder.update({
    where: { id: order.id },
    data: { printerId: targetPrinterId },
  });
  fixed++;
  console.log(`PO${order.id}: printerId ${order.printerId} -> ${targetPrinterId} (edition ${order.printorder_items[0]?.bookEditionId})`);
}

console.log(`\nDone. Print orders fixed: ${fixed} | skipped: ${skipped}`);
await p.$disconnect();