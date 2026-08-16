import { getAllOrders, getAllShopsDebt } from "@/app/actions/order-actions";
import { getCurrentSession } from "@/app/actions/auth-actions";
import ManageOrdersPageContent from "./ManageOrdersPageContent";

export default async function ManageOrdersPage() {
    const res = await getAllOrders();
    const orders = res.success ? res.data || [] : [];
    const session = await getCurrentSession();

    const debtRes = await getAllShopsDebt();
    const shopData = (debtRes.success ? debtRes.data || [] : []).map((shop) => ({
        id: shop.id,
        name: shop.name,
        branch: shop.branch,
        remaining: shop.totalDebt,
        orderDebt: shop.orderDebt,
        roundDebt: shop.roundDebt,
        previousDebt: shop.previousDebt,
        lastOrderDebt: shop.lastOrderDebt,
        totalDebt: shop.totalDebt,
    }));

    return (
        <>
            {!res.success && (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4 m-8">
                    <p className="text-destructive font-black text-xl uppercase">Failed to Load Orders</p>
                    <p className="text-muted-foreground font-bold">{(res as any).error}</p>
                </div>
            )}
            {!debtRes.success && (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4 m-8">
                    <p className="text-destructive font-black text-xl uppercase">Failed to Load Shop Debts</p>
                    <p className="text-muted-foreground font-bold">{(debtRes as any).error}</p>
                </div>
            )}
            <ManageOrdersPageContent orders={orders as any} userRole={session?.role} shops={shopData} />
        </>
    );
}
