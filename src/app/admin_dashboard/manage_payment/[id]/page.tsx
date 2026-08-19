import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ManagePaymentDetailClient from "./ManagePaymentDetailClient";

export const dynamic = "force-dynamic";

export default async function ManagePaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const shopId = parseInt(id);
    if (isNaN(shopId)) notFound();

    const shop = await (prisma as any).bookshopes.findFirst({
        where: { id: shopId, is_deleted: false },
        include: {
            orders: {
                where: { is_deleted: false },
                include: {
                    bookshopes: true,
                    order_items: {
                        include: {
                            bookedition: {
                                include: { books: true }
                            }
                        }
                    },
                    checks: true
                }
            },
            payments: {
                where: { is_deleted: false },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    amount: true,
                    payment_type: true,
                    checkId: true,
                    status: true,
                    image: true,
                    createdAt: true,
                    orderid: true,
                    memo: true,
                    is_for_printer: true,
                    printer_id: true,
                    printer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    check: {
                        select: {
                            id: true,
                            bankname: true,
                            username: true,
                            amount: true,
                            status: true,
                            type: true,
                            recordeddate: true,
                            memo: true,
                            imageUrl: true,
                        },
                    },
                },
            }
        }
    });

    if (!shop) notFound();

    // Fetch round records for this shop
    const roundRecords = await (prisma as any).roundrecords.findMany({
        where: { bookshop_id: shopId, is_deleted: false },
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

    // Fetch all round payments for this shop
    const allRoundPayments = await (prisma as any).round_payments.findMany({
        where: { shopId: shopId, is_deleted: false },
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
    const approvedRequestedOrders = shop.orders.filter((o: any) => o.is_approved && o.order_type === "requested");
    const orderDebt = approvedRequestedOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const totalPaid = approvedRequestedOrders.reduce((sum: number, o: any) => sum + (o.amount_paid || 0), 0);
    const totalDebt = orderDebt + previousDebt;
    const totalRemaining = totalDebt - totalPaid;

    const roundOrders = shop.orders.filter((o: any) => o.order_type === "on round");
    const roundOrderTotalAmount = roundOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const roundOrderTotalPaid = roundOrders.reduce((sum: number, o: any) => sum + (o.amount_paid || 0), 0);

    const roundRecordTotalAmount = roundRecords.reduce((sum: number, r: any) => sum + (r.totalprice || 0), 0);
    const roundRecordTotalPaid = roundRecords.reduce((sum: number, r: any) => {
        const approvedPayments = (r.round_payments || []).filter((p: any) => p.status === "APPROVED");
        return sum + approvedPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
    }, 0);

    const combinedCount = roundOrders.length + roundRecords.length;
    const combinedAmount = roundOrderTotalAmount + roundRecordTotalAmount;
    const combinedPaid = roundOrderTotalPaid + roundRecordTotalPaid;
    const unpaidRoundDebt = combinedAmount - combinedPaid;

    return (
        <ManagePaymentDetailClient
            shop={{
                id: shop.id,
                name: shop.name,
                location: shop.location,
                phone: shop.phone || "",
                email: shop.email || "",
                branch: shop.branch || "",
                createdAt: shop.createdAt,
                previousDebt,
            }}
            payments={shop.payments.map((p: any) => ({
                id: p.id,
                amount: p.amount,
                payment_type: p.payment_type,
                status: p.status,
                checkId: p.checkId,
                is_for_previous_debts: p.is_for_previous_debts ?? false,
                check: p.check ? {
                    id: p.check.id,
                    bankname: p.check.bankname,
                    username: p.check.username,
                    status: p.check.status,
                    type: p.check.type,
                    amount: p.check.amount,
                    recordeddate: p.check.recordeddate,
                    memo: p.check.memo,
                    imageUrl: p.check.imageUrl,
                } : null,
                image: p.image || null,
                createdAt: p.createdAt,
                orderid: p.orderid || null,
                memo: p.memo || null,
                is_for_printer: p.is_for_printer ?? false,
                printerId: p.printer_id ?? null,
                printerName: p.printer?.name ?? null,
            }))}
            orders={shop.orders.map((o: any) => ({
                id: o.id,
                order_type: o.order_type,
                total_amount: o.total_amount,
                amount_paid: o.amount_paid,
                payment_type: o.payment_type,
                check_id: o.check_id,
                status: o.status,
                is_approved: o.is_approved,
                hide_remaining: o.hide_remaining ?? false,
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
            }))}
            roundRecords={roundRecords.map((r: any) => ({
                id: r.id,
                shopId: r.bookshop_id ?? 0,
                totalprice: r.totalprice ?? 0,
                status: r.status,
                createdAt: r.createdAt,
                bookTitle: r.RoundBooks?.book?.title || "Unknown",
                bookAuthor: r.RoundBooks?.book?.author || "",
                startingAmount: r.RoundBooks?.starting_amount ?? 0,
                returnedAmount: r.RoundBooks?.returned_amount ?? 0,
                shopName: shop.name,
                shopLocation: shop.location,
                payments: (r.round_payments || []).map((p: any) => ({
                    id: p.id,
                    amount: p.amount,
                    payment_type: p.payment_type,
                    status: p.status,
                    createdAt: p.createdAt,
                    check: p.check ? {
                        id: p.check.id,
                        bankname: p.check.bankname,
                        username: p.check.username,
                        amount: p.check.amount,
                        status: p.check.status,
                    } : null,
                })),
            }))}
            roundPayments={allRoundPayments.map((p: any) => ({
                id: p.id,
                amount: p.amount,
                payment_type: p.payment_type,
                status: p.status,
                createdAt: p.createdAt,
                memo: p.memo || null,
                check: p.check ? {
                    id: p.check.id,
                    bankname: p.check.bankname,
                    username: p.check.username,
                    amount: p.check.amount,
                    status: p.check.status,
                } : null,
                bookTitle: p.roundrecord?.RoundBooks?.book?.title || "Unknown",
            }))}
            totals={{ totalDebt, totalPaid, totalRemaining, unpaidRoundDebt }}
            previousDebt={previousDebt}
            roundBooksTotals={{
                orderCount: combinedCount,
                totalAmount: combinedAmount,
                totalPaid: combinedPaid,
                remaining: combinedAmount - combinedPaid,
            }}
        />
    );
}
