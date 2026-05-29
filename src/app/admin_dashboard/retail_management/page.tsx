import prisma from "@/lib/prisma";
import RetailManagementTable from "./RetailManagementTable";
import { ShoppingBag } from "lucide-react";

export default async function RetailManagementPage() {
    const purchases = await (prisma as any).retail_purchases.findMany({
        where: { is_deleted: false },
        include: {
            items: {
                include: {
                    edition: {
                        include: { books: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <div className="flex items-center gap-3 text-primarycolor">
                    <ShoppingBag className="size-6" />
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Retail <span className="text-secondarycolor not-italic">Management</span>
                    </h1>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                    Manage retail purchases from walk-in customers
                </p>
            </div>

            <RetailManagementTable purchases={purchases} />
        </div>
    );
}
