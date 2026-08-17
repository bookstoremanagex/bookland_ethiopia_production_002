import { PrismaClient } from "../src/generated/prisma/index.js";
import { readFileSync } from "fs";

const raw = readFileSync(".env", "utf8");
const m = raw.match(/^DATABASE_URL="?([^\n"]+)"?/m);
process.env.DATABASE_URL = m[1];

const p = new PrismaClient();

const records = await p.printer_delivery_records.findMany({
  where: { is_deleted: false },
  include: {
    printorderId: {
      include: {
        printorder: { include: { printer: { select: { id: true, name: true } } } },
        bookedition: {
          select: {
            id: true,
            edition_name: true,
            books: { select: { title: true } },
          },
        },
      },
    },
  },
  orderBy: { id: "asc" },
});

const isAuto = (n) => (n || "").startsWith("Auto-delivery for") || (n || "").startsWith("[Auto Delivery]");

// For each edition, gather its real (non-auto) printorder printers
const realPrinterByEdition = new Map();
const rawEditions = await p.bookedition.findMany({
  where: { is_deleted: false },
  include: {
    printorder_items: {
      where: { is_deleted: false },
      include: {
        printorder: {
          include: { printer: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    },
  },
});
for (const ed of rawEditions) {
  const real = (ed.printorder_items || [])
    .map((i) => i.printorder)
    .filter((o) => o && !isAuto(o.project_name));
  const printers = [...new Map(real.map((o) => [o.printerId, o.printer.name])).values()];
  realPrinterByEdition.set(ed.id, printers);
}

console.log("recId | editionId | book | recordOrderPrinter | auto? | editionRealProjectPrinters");
for (const r of records) {
  const ed = r.printorderId?.bookedition;
  const order = r.printorderId?.printorder;
  const auto = isAuto(order?.project_name);
  const realPrinters = ed ? realPrinterByEdition.get(ed.id) || [] : [];
  const mismatch =
    auto && realPrinters.length > 0 && !realPrinters.includes(order?.printer?.name);
  console.log(
    `${String(r.id).padEnd(5)} | ${String(ed?.id ?? "?").padEnd(7)} | ${String(ed?.books?.title || "").slice(0, 22).padEnd(22)} | ${String(order?.printer?.name || "?").padEnd(18)} | ${auto ? "AUTO" : "real"} | [${realPrinters.join(", ")}]${mismatch ? "   <<< MISMATCH" : ""}`
  );
}

await p.$disconnect();