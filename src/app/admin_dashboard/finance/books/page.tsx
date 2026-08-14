import prisma from "@/lib/prisma";
import { BarChart3 } from "lucide-react";
import { FinanceBooksGrid } from "./FinanceBooksGrid";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

interface FinanceBook {
  id: number;
  title: string;
  author: string | null;
  isbn: string | null;
  book_image_url: string | null;
  unique_identification_code: string;
  editionCount: number;
  inStore: number;
  locked: number;
  soldAsOrder: number;
  soldAsRound: number;
  totalProduced: number;
  totalSell: number;
  orderRevenue: number;
  roundRevenue: number;
}

export default async function FinanceBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const where: any = { is_deleted: false };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
      { isbn: { contains: search } },
      { unique_identification_code: { contains: search } },
    ];
  }

  const [totalCount, books] = await Promise.all([
    prisma.books.count({ where }),
    prisma.books.findMany({
      where,
      include: {
        bookedition: {
          where: { is_deleted: false },
          include: {
            bookeditionstores: { where: { is_deleted: false } },
            locked_editions: { where: { is_deleted: false } },
            order_items: { include: { order: true } },
          },
        },
        round_book: {
          where: { is_deleted: false, status: false },
          include: {
            round_records: { where: { is_deleted: false } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const financeBooks: FinanceBook[] = books.map((book: any) => {
    let editionCount = 0;
    let inStore = 0;
    let locked = 0;
    let soldAsOrder = 0;
    let orderRevenue = 0;
    let soldAsRound = 0;
    let roundRevenue = 0;

    (book.bookedition || []).forEach((edition: any) => {
      editionCount += 1;
      inStore += (edition.bookeditionstores || []).reduce(
        (sum: number, bes: any) => sum + (bes.quantity || 0),
        0
      );
      locked += (edition.locked_editions || [])
        .filter((le: any) => le.status === "locked")
        .reduce((sum: number, le: any) => sum + (le.amount_locked || 0), 0);
      (edition.order_items || []).forEach((item: any) => {
        if (item.order?.is_approved === true && !item.order?.is_deleted) {
          if (item.order?.order_type === "on round") {
            soldAsRound += item.quantity || 0;
            roundRevenue += (item.quantity || 0) * (item.price_at_order || 0);
          } else {
            soldAsOrder += item.quantity || 0;
            orderRevenue += (item.quantity || 0) * (item.price_at_order || 0);
          }
        }
      });
    });

    let soldAsRoundBooks = 0;
    let roundRecordRevenue = 0;
    let unallocatedRoundSold = 0;
    (book.round_book || []).forEach((rb: any) => {
      const sold = (rb.starting_amount || 0) - (rb.returned_amount || 0);
      soldAsRoundBooks += sold;
      if (!rb.allocated) unallocatedRoundSold += sold;
      (rb.round_records || []).forEach((rr: any) => {
        roundRecordRevenue += rr.totalprice || 0;
      });
    });
    inStore -= unallocatedRoundSold;
    soldAsRound += soldAsRoundBooks;
    roundRevenue += roundRecordRevenue;
    const totalProduced = (book.bookedition || []).reduce(
      (sum: number, e: any) => sum + (e.total_print_count || 0),
      0
    );

    return {
      id: book.id,
      title: book.title,
      author: book.author || null,
      isbn: book.isbn || null,
      book_image_url: book.book_image_url || null,
      unique_identification_code: book.unique_identification_code,
      editionCount,
      inStore,
      locked,
      soldAsOrder,
      soldAsRound,
      totalProduced,
      totalSell: orderRevenue + roundRevenue,
      orderRevenue,
      roundRevenue,
    };
  });

  const globalRevenue = financeBooks.reduce((acc, b) => acc + b.totalSell, 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Inventory <span className="text-secondarycolor not-italic">Revenue Analysis</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
            Financial performance by book title
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-primarycolor px-8 py-4 rounded-[2rem] shadow-2xl shadow-primarycolor/20 text-white flex items-center gap-4">
            <BarChart3 className="size-8 opacity-40" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">Global Revenue</p>
              <p className="text-2xl font-black mt-1">
                {globalRevenue.toLocaleString()} <span className="text-sm opacity-60 font-bold">ETB</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <FinanceBooksGrid
        books={financeBooks}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={page}
        search={search}
      />
    </div>
  );
}
