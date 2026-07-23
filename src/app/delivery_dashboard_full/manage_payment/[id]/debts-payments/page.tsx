import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import DebtsPaymentsClient from "@/app/admin_dashboard/manage_payment/[id]/debts-payments/DebtsPaymentsClient";

export const dynamic = "force-dynamic";

export default async function DeliveryDebtsPaymentsPage({ params }: { params: Promise<{ id: string }> }) {
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

    const roundRecords = await (prisma as any).roundrecords.findMany({
        where: { bookshop_id: shopId, is_deleted: false },
        include: {
            RoundBooks: {
                include: {
                    book: { select: { id: true, title: true, author: true } },
                },
            },
            round_payments: {
                where: { is_deleted: false },
                include: {
                    check: { select: { id: true, bankname: true, username: true, amount: true, status: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const allRoundPayments = await (prisma as any).round_payments.findMany({
        where: { shopId: shopId, is_deleted: false },
        include: {
            check: { select: { id: true, bankname: true, username: true, amount: true, status: true } },
            roundrecord: {
                include: {
                    RoundBooks: {
                        include: { book: { select: { id: true, title: true } } },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <Link href={`/delivery_dashboard_full/payments-due`}>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primarycolor transition-colors w-fit">
                    <ArrowLeft className="size-3.5" /> Back to Payments Due
                </div>
            </Link>

            <div className="flex items-center gap-3 text-primarycolor">
                <BarChart3 className="size-6" />
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Debts &amp; Payments <span className="text-secondarycolor not-italic">Detail</span>
                </h1>
            </div>

            <DebtsPaymentsClient
                shopName={shop.name}
                orders={shop.orders}
                payments={shop.payments}
                roundRecords={roundRecords}
                roundPayments={allRoundPayments}
                previousDebt={shop.previousDebt || 0}
            />
        </div>
    );
}
