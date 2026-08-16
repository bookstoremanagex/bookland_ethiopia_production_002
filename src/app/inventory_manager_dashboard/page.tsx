import { Warehouse } from "lucide-react";

export default function InventoryHomePage() {
    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 w-full md:w-auto">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <Warehouse className="size-6 md:size-8" />
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] opacity-50">Inventory</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Inventory <span className="text-secondarycolor not-italic">Manager</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl">
                        Inventory manager dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}
