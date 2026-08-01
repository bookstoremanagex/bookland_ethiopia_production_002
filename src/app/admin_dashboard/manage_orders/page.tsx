import { getAllOrders } from "@/app/actions/order-actions";
import { getCurrentSession } from "@/app/actions/auth-actions";
import ManageOrdersPageContent from "./ManageOrdersPageContent";
import { ShoppingBag } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ManageOrdersPage() {
    const res = await getAllOrders();
    const orders = res.success ? res.data || [] : [];
    const session = await getCurrentSession();

    const shops = await (prisma as any).bookshopes.findMany({
        where: { is_deleted: false },
        include: {
            bookshopeditions: {
                where: { is_deleted: false },
                select: { remaining_amount: true },
            },
        },
    });

    const shopData = (shops as any[]).map((shop: any) => {
        const remaining = (shop.bookshopeditions || []).reduce(
            (sum: number, a: any) => sum + (a.remaining_amount || 0),
            0
        );
        return {
            id: shop.id,
            name: shop.name,
            branch: shop.branch || shop.location || "",
            remaining,
        };
    });

    return (
        <>
            {!res.success && (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4 m-8">
                    <p className="text-destructive font-black text-xl uppercase">Failed to Load Orders</p>
                    <p className="text-muted-foreground font-bold">{(res as any).error}</p>
                </div>
            )}
            <ManageOrdersPageContent orders={orders as any} userRole={session?.role} shops={shopData} />
        </>
    );
}
