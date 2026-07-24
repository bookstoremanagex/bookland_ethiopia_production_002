import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentDetail from "./PaymentDetail";

export default async function ShopPaymentDetailPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const parsedShopId = parseInt(shopId);
  if (isNaN(parsedShopId)) notFound();

  const shop = await (prisma as any).bookshopes.findFirst({
    where: { id: parsedShopId, is_deleted: false },
    include: {
      orders: {
        where: { is_deleted: false },
        orderBy: { createdAt: "desc" },
        include: {
          bookshopes: true,
          order_items: {
            include: {
              bookedition: {
                include: { books: true },
              },
            },
          },
          checks: true,
        },
      },
      payments: {
        where: { is_deleted: false },
        include: { check: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shop) notFound();

  // Fetch round records for this shop
  const roundRecords = await (prisma as any).roundrecords.findMany({
    where: { bookshop_id: parsedShopId, is_deleted: false },
    include: {
      RoundBooks: {
        include: {
          book: {
            select: { id: true, title: true, author: true },
          },
        },
      },
      round_payments: {
        where: { is_deleted: false },
        include: {
          check: {
            select: { id: true, bankname: true, username: true, amount: true, status: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all round payments for this shop directly
  const allRoundPayments = await (prisma as any).round_payments.findMany({
    where: { shopId: parsedShopId, is_deleted: false },
    include: {
      check: {
        select: { id: true, bankname: true, username: true, amount: true, status: true },
      },
      roundrecord: {
        include: {
          RoundBooks: {
            include: {
              book: {
                select: { id: true, title: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const previousDebt = shop.previousDebt || 0;
  const totalDebt = (shop.orders || []).reduce(
    (sum: number, o: any) => sum + (o.total_amount || 0),
    0
  ) + previousDebt;
  const totalPaid = (shop.payments || []).filter(
    (p: any) => p.status === "APPROVED"
  ).reduce(
    (sum: number, p: any) => sum + (p.amount || 0),
    0
  );
  const remaining = totalDebt - totalPaid;

  const serialized = JSON.parse(
    JSON.stringify({
      id: shop.id,
      name: shop.name,
      branch: shop.branch || shop.location || "",
      remaining,
      payments: shop.payments,
      orders: shop.orders.map((o: any) => ({
        id: o.id,
        order_type: o.order_type,
        total_amount: o.total_amount,
        amount_paid: o.amount_paid,
        hide_remaining: o.hide_remaining ?? false,
        payment_type: o.payment_type,
        check_id: o.check_id,
        status: o.status,
        is_approved: o.is_approved,
        memo: o.memo,
        allocation_summary: o.allocation_summary,
        delivery: o.delivery,
        delivered_by: o.delivered_by,
        createdAt: o.createdAt,
        bookShopId: o.bookShopId,
        bookshopes: o.bookshopes ? {
          id: o.bookshopes.id,
          name: o.bookshopes.name,
          location: o.bookshopes.location,
          branch: o.bookshopes.branch,
          phone: o.bookshopes.phone,
          email: o.bookshopes.email,
        } : { id: 0, name: "", location: "", branch: null, phone: null, email: null },
        checks: o.checks ? {
          id: o.checks.id,
          bankname: o.checks.bankname,
          username: o.checks.username,
          amount: o.checks.amount,
          type: o.checks.type,
          status: o.checks.status,
          imageUrl: o.checks.imageUrl,
        } : null,
        order_items: o.order_items?.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price_at_order: item.price_at_order,
          bookEditionId: item.bookEditionId,
          bookedition: item.bookedition ? {
            edition_name: item.bookedition.edition_name,
            bookId: item.bookedition.bookId,
            book_image_url: item.bookedition.book_image_url,
            books: item.bookedition.books ? {
              title: item.bookedition.books.title,
              book_image_url: item.bookedition.books.book_image_url,
            } : { title: "", book_image_url: null },
          } : { edition_name: "", bookId: 0, book_image_url: null, books: { title: "", book_image_url: null } },
        })) || [],
      })),
      roundRecords: roundRecords.map((r: any) => ({
        id: r.id,
        totalprice: r.totalprice ?? 0,
        status: r.status,
        createdAt: r.createdAt,
        bookTitle: r.RoundBooks?.book?.title || "Unknown",
        bookAuthor: r.RoundBooks?.book?.author || "",
        startingAmount: r.RoundBooks?.starting_amount ?? 0,
        returnedAmount: r.RoundBooks?.returned_amount ?? 0,
        payments: (r.round_payments || []).map((p: any) => ({
          id: p.id,
          amount: p.amount,
          payment_type: p.payment_type,
          status: p.status,
          check: p.check ? {
            bankname: p.check.bankname,
            username: p.check.username,
            amount: p.check.amount,
            status: p.check.status,
          } : null,
        })),
      })),
      roundPayments: allRoundPayments.map((p: any) => ({
        id: p.id,
        amount: p.amount,
        payment_type: p.payment_type,
        status: p.status,
        createdAt: p.createdAt,
        memo: p.memo || null,
        check: p.check ? {
          bankname: p.check.bankname,
          username: p.check.username,
          amount: p.check.amount,
          status: p.check.status,
        } : null,
        bookTitle: p.roundrecord?.RoundBooks?.book?.title || "Unknown",
      })),
    })
  );

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PaymentDetail shop={serialized} />
      </div>
    </div>
  );
}
