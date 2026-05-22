import { getAllOrders } from "@/app/actions/order-actions";
import ManageOrdersPageContent from "./ManageOrdersPageContent";
import { ShoppingBag } from "lucide-react";

export default async function ManageOrdersPage() {
    const res = await getAllOrders();
    const orders = res.success ? res.data || [] : [];

    return (
        <>
            {!res.success && (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4 m-8">
                    <p className="text-destructive font-black text-xl uppercase">Failed to Load Orders</p>
                    <p className="text-muted-foreground font-bold">{(res as any).error}</p>
                </div>
            )}
            <ManageOrdersPageContent orders={orders as any} />
        </>
    );
}
