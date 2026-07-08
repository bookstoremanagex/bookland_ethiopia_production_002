import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ManagePaymentDetailClient from "./ManagePaymentDetailClient";

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
                include: { check: true },
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!shop) notFound();

    const previousDebt = shop.previousDebt || 0;
    const orderDebt = shop.orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const totalPaid = shop.payments
        .filter((p: any) => p.status === "APPROVED")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const totalDebt = orderDebt + previousDebt;
    const totalRemaining = totalDebt - totalPaid;

    const roundOrders = shop.orders.filter((o: any) => o.order_type === "on round");
    const roundTotalAmount = roundOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const roundTotalPaid = roundOrders.reduce((sum: number, o: any) => sum + (o.amount_paid || 0), 0);

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
            totals={{ totalDebt, totalPaid, totalRemaining }}
            previousDebt={previousDebt}
            roundBooksTotals={{
                orderCount: roundOrders.length,
                totalAmount: roundTotalAmount,
                totalPaid: roundTotalPaid,
                remaining: roundTotalAmount - roundTotalPaid,
            }}
        />
    );
}
