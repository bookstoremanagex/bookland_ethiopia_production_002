import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getCurrentSession } from "@/app/actions/auth-actions"
import CheckDetailClient from "./CheckDetailClient"

export const dynamic = "force-dynamic"

export default async function CheckDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const checkId = parseInt(id)

    const check = await (prisma as any).checks.findUnique({ where: { id: checkId } })
    if (!check || check.is_deleted) notFound()

    const session = await getCurrentSession()

    // Find orders linked via payments (payments.checkId → payments.orderid → orders.id)
    const linkedPayments = await (prisma as any).payments.findMany({
        where: { checkId: checkId, is_deleted: false },
        select: { orderid: true },
    })

    const orderIdsFromPayments = linkedPayments
        .map((p: any) => p.orderid)
        .filter(Boolean)
        .map((id: string) => parseInt(id))
        .filter((id: number) => !isNaN(id))

    // Find orders directly linked via orders.check_id
    const directOrders = await (prisma as any).orders.findMany({
        where: { check_id: checkId, is_deleted: false },
        include: {
            bookshopes: { select: { id: true, name: true, location: true } },
            order_items: {
                include: {
                    bookedition: {
                        include: { books: { select: { title: true } } }
                    }
                }
            }
        },
    })

    // Find orders linked via payments
    const paymentOrders = orderIdsFromPayments.length > 0
        ? await (prisma as any).orders.findMany({
            where: { id: { in: orderIdsFromPayments }, is_deleted: false },
            include: {
                bookshopes: { select: { id: true, name: true, location: true } },
                order_items: {
                    include: {
                        bookedition: {
                            include: { books: { select: { title: true } } }
                        }
                    }
                }
            },
        })
        : []

    // Merge and deduplicate
    const allOrdersMap = new Map<number, any>()
    for (const o of [...directOrders, ...paymentOrders]) {
        allOrdersMap.set(o.id, o)
    }
    const linkedOrders = Array.from(allOrdersMap.values()).sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return (
        <CheckDetailClient
            check={check}
            isAdmin={session?.role === "ADMIN"}
            linkedOrders={linkedOrders.map((o: any) => ({
                id: o.id,
                order_type: o.order_type,
                total_amount: o.total_amount,
                amount_paid: o.amount_paid,
                status: o.status,
                is_approved: o.is_approved,
                delivery: o.delivery,
                createdAt: o.createdAt,
                bookshopName: o.bookshopes?.name || "Unknown",
                bookshopId: o.bookshopes?.id || 0,
                itemCount: o.order_items?.length || 0,
                totalBooks: o.order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0,
                firstBookTitle: o.order_items?.[0]?.bookedition?.books?.title || null,
            }))}
        />
    )
}
