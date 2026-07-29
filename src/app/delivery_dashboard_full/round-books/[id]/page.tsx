import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import RoundBookDetail from "./RoundBookDetail";

export default async function RoundBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) notFound();

  const roundbook = await (prisma as any).roundbooks.findFirst({
    where: { id: parsedId, is_deleted: false },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          unique_identification_code: true,
          book_sku: true,
        },
      },
      editions: {
        select: {
          id: true,
          edition_name: true,
          selling_price: true,
        },
      },
      round_records: {
        where: { is_deleted: false },
        include: {
          bookshop: {
            select: { id: true, name: true, location: true, branch: true },
          },
          round_payments: {
            where: { is_deleted: false },
            select: {
              id: true,
              amount: true,
              payment_type: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!roundbook) notFound();

  const unitPrice = roundbook.editions?.selling_price || 0;

  const totalSoldMoney = roundbook.round_records.reduce((sum: number, rr: any) => sum + (rr.totalprice || 0), 0);
  const booksSold = unitPrice > 0 ? Math.round(totalSoldMoney / unitPrice) : 0;

  const data = {
    id: roundbook.id,
    status: roundbook.status,
    book: roundbook.book,
    starting_amount: roundbook.starting_amount ?? 0,
    returned_amount: roundbook.returned_amount ?? 0,
    unitPrice,
    booksSold,
    storeCount: roundbook.round_records.length,
    stores: roundbook.round_records.map((rr: any) => {
      const payments = (rr.round_payments || []).map((p: any) => ({
        id: p.id,
        amount: p.amount,
        type: p.payment_type,
        status: p.status,
      }));
      const approvedSum = payments.filter((p: any) => p.status === "APPROVED").reduce((s: number, p: any) => s + (p.amount || 0), 0);
      const qty = unitPrice > 0 ? Math.round((rr.totalprice ?? 0) / unitPrice) : 0;
      return {
        id: rr.id,
        shopId: rr.bookshop_id,
        storeName: rr.bookshop?.name || "Unknown",
        location: rr.bookshop?.location || "",
        branch: rr.bookshop?.branch || "",
        totalprice: rr.totalprice ?? 0,
        payments,
        paid: approvedSum,
        remaining: (rr.totalprice ?? 0) - approvedSum,
        qty,
      };
    }),
    createdAt: roundbook.createdAt.toISOString(),
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <RoundBookDetail roundBook={data as any} />
      </div>
    </div>
  );
}
