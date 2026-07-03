import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { getPrinterForSessionFull } from "@/app/actions/printer-full-actions";
import BooksCollectiveTable from "@/components/printer_full_dashboard_components/BooksCollectiveTable";

export const dynamic = "force-dynamic";

function buildBooksCollective(printer: any) {
  const editionPaidMap = new Map<string, { total: number; payments: any[] }>();
  printer.printorder.forEach((order: any) => {
    (order.printorder_payments || []).forEach((payment: any) => {
      if (payment.reference) {
        const match = payment.reference.match(/^\[([^\]]+)\]/);
        if (match) {
          const label = match[1];
          const entry = editionPaidMap.get(label) || { total: 0, payments: [] };
          entry.total += payment.amount;
          entry.payments.push(payment);
          editionPaidMap.set(label, entry);
        }
      }
    });
  });

  const rows: any[] = [];
  printer.printorder.forEach((order: any) => {
    (order.printorder_items || []).forEach((item: any) => {
      const book = item.bookedition?.books;
      const edition = item.bookedition;
      if (!book) return;
      const editionLabel = `${book.title} — ${edition?.edition_name || "Unknown Edition"}`;
      const paidData = editionPaidMap.get(editionLabel);
      rows.push({
        id: item.id,
        orderId: order.id,
        bookEditionId: item.bookEditionId,
        projectName: order.project_name || `Project #${order.id}`,
        bookTitle: book.title || "Unknown Book",
        bookAuthor: book.author || "—",
        editionName: edition?.edition_name || "—",
        quantity: item.quantity || 0,
        totalPrice: item.total_price || 0,
        remaining: edition?.count_remening_for_transfer ?? null,
        status: item.status || "NOT_STARTED",
        paidAmount: paidData?.total || 0,
        payments: paidData?.payments || [],
      });
    });
  });

  return rows;
}

export default async function BooksInCollectivePage() {
  const printer = await getPrinterForSessionFull();
  if (!printer) return notFound();

  const books = buildBooksCollective(printer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primarycolor/[0.03] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
            <BookOpen className="size-5 text-primarycolor" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Books in Collective</h1>
            <p className="text-sm font-bold text-slate-400">
              {books.length} items across {printer.printorder.length} projects
            </p>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="size-8 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-400">No books assigned yet</p>
          </div>
        ) : (
          <BooksCollectiveTable books={books} projectCount={printer.printorder.length} />
        )}
      </div>
    </div>
  );
}
