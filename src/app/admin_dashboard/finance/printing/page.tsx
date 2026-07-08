import prisma from "@/lib/prisma";
import { BarChart3 } from "lucide-react";
import PrintersSummaryTable from "./PrintersSummaryTable";
import BooksInPrintersTable from "./BooksInPrintersTable";

export const dynamic = "force-dynamic";

export interface PrinterSummaryRow {
  id: number;
  name: string;
  totalCost: number;
  totalPaid: number;
  totalRemaining: number;
}

export interface BookPrintRow {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  editionName: string;
  printerName: string;
  quantity: number;
  itemCost: number;
  paid: number;
  remaining: number;
}

export default async function FinancePrintingPage() {
  const orders = await (prisma as any).printorder.findMany({
    where: { is_deleted: false },
    include: {
      printer: true,
      printorder_items: {
        include: {
          bookedition: {
            include: { books: true },
          },
        },
      },
      printorder_payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const printerMap = new Map<number, { name: string; totalCost: number; totalPaid: number }>();

  const bookRows: BookPrintRow[] = [];

  for (const order of orders) {
    const printerName = order.printer?.name || "Unknown Printer";
    const totalOrderPaid = (order.printorder_payments || []).reduce((sum: number, p: any) => sum + p.amount, 0);

    const editionPaidMap = new Map<string, number>();
    for (const payment of order.printorder_payments || []) {
      if (payment.reference) {
        const match = payment.reference.match(/^\[([^\]]+)\]/);
        if (match) {
          const label = match[1];
          editionPaidMap.set(label, (editionPaidMap.get(label) || 0) + payment.amount);
        }
      }
    }

    if (!printerMap.has(order.printerId)) {
      printerMap.set(order.printerId, { name: printerName, totalCost: 0, totalPaid: 0 });
    }

    for (const item of order.printorder_items || []) {
      const book = item.bookedition?.books;
      const edition = item.bookedition;
      if (!book) continue;

      const itemCost = item.total_price || (item.quantity || 0) * (item.price_per_book || 0);
      const editionLabel = `${book.title} — ${edition?.edition_name || "Unknown Edition"}`;
      const allocatedPaid = editionPaidMap.get(editionLabel) || 0;

      bookRows.push({
        id: item.id,
        bookTitle: book.title || "Unknown Book",
        bookAuthor: book.author || "—",
        editionName: edition?.edition_name || "—",
        printerName,
        quantity: item.quantity || 0,
        itemCost,
        paid: allocatedPaid,
        remaining: Math.max(0, itemCost - allocatedPaid),
      });

      const printerEntry = printerMap.get(order.printerId)!;
      printerEntry.totalCost += itemCost;
      printerEntry.totalPaid += allocatedPaid;
    }
  }

  const printerRows: PrinterSummaryRow[] = Array.from(printerMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    totalCost: data.totalCost,
    totalPaid: data.totalPaid,
    totalRemaining: Math.max(0, data.totalCost - data.totalPaid),
  }));

  const grandTotalRemaining = printerRows.reduce((s, r) => s + r.totalRemaining, 0);

  bookRows.sort((a, b) => b.remaining - a.remaining);

  return (
    <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Printing <span className="text-secondarycolor not-italic">Finance</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
            Track payments and remaining balances per book and printer
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-primarycolor px-8 py-4 rounded-[2rem] shadow-2xl shadow-primarycolor/20 text-white flex items-center gap-4">
            <BarChart3 className="size-8 opacity-40" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">Total Debt</p>
              <p className="text-2xl font-black mt-1">
                {grandTotalRemaining.toLocaleString()} <span className="text-sm opacity-60 font-bold">ETB</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <PrintersSummaryTable data={printerRows} />
      <BooksInPrintersTable data={bookRows} />
    </div>
  );
}
