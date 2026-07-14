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
        },
      },
    },
  });

  if (!roundbook) notFound();

  const unitPrice = roundbook.editions?.selling_price || 0;

  const data = {
    id: roundbook.id,
    status: roundbook.status,
    book: roundbook.book,
    starting_amount: roundbook.starting_amount ?? 0,
    returned_amount: roundbook.returned_amount ?? 0,
    unitPrice,
    storeCount: roundbook.round_records.length,
    stores: roundbook.round_records.map((rr: any) => ({
      id: rr.id,
      shopId: rr.bookshop_id,
      storeName: rr.bookshop?.name || "Unknown",
      location: rr.bookshop?.location || "",
      branch: rr.bookshop?.branch || "",
      totalprice: rr.totalprice ?? 0,
    })),
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
