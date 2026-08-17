import { PrismaClient } from "../src/generated/prisma/index.js";
import { readFileSync } from "fs";

const raw = readFileSync(".env", "utf8");
const m = raw.match(/^DATABASE_URL="?([^\n"]+)"?/m);
process.env.DATABASE_URL = m[1];

const p = new PrismaClient();

const editions = await p.bookedition.findMany({
  where: { is_deleted: false },
  include: {
    books: { select: { title: true } },
    bookeditionprinters: {
      where: { is_deleted: false },
      include: { printer: { select: { id: true, name: true } } },
    },
    printorder_items: {
      where: { is_deleted: false },
      include: {
        printorder: {
          include: { printer: { select: { id: true, name: true } } },
        },
        printer_delivery_records: {
          where: { is_deleted: false },
          select: { id: true, quantity_deliverd: true },
        },
      },
    },
  },
});

console.log("editionId | connectedPrinter | orderProject | orderPrinter | deliveryCount | autoDelivery");
for (const ed of editions) {
  const connected = ed.bookeditionprinters[0]?.printer?.name || "(none)";
  for (const item of ed.printorder_items || []) {
    const orderPrinter = item.printorder?.printer?.name || "(none)";
    const proj = item.printorder?.project_name || "";
    const isAuto = proj.startsWith("Auto-delivery for") || proj.startsWith("[Auto Delivery]");
    const deliveryCount = (item.printer_delivery_records || []).length;
    console.log(
      `${String(ed.id).padEnd(9)} | ${String(connected).padEnd(20)} | ${String(proj).slice(0, 26).padEnd(26)} | ${String(orderPrinter).padEnd(20)} | ${deliveryCount} | ${isAuto ? "AUTO" : "real"}`
    );
  }
}

const mismatched = editions.filter((ed) => {
  const connectedId = ed.bookeditionprinters[0]?.printerId ?? null;
  if (!connectedId) return false;
  return (ed.printorder_items || []).some((i) => i.printorder?.printerId !== connectedId);
});
console.log(`\nEditions where connected printer differs from a project printer: ${mismatched.length}`);

await p.$disconnect();