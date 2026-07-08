import { notFound } from "next/navigation";
import { Truck } from "lucide-react";
import { getPrinterForSessionFull } from "@/app/actions/printer-full-actions";
import { getPrinterDeliveries } from "@/app/actions/printer-delivery-actions";
import DeliveriesClient from "./DeliveriesClient";

export const dynamic = "force-dynamic";

export default async function DeliveriesPage() {
    const printer = await getPrinterForSessionFull();
    if (!printer) return notFound();

    const records = await getPrinterDeliveries(printer.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primarycolor/[0.03] p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-9 md:size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center shrink-0">
                        <Truck className="size-4 md:size-5 text-primarycolor" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg md:text-2xl font-black text-slate-800 truncate">
                            Deliveries
                        </h1>
                        <p className="text-[10px] md:text-sm font-bold text-slate-400">
                            {records.length} delivery records
                        </p>
                    </div>
                </div>

                <DeliveriesClient
                    printerId={printer.id}
                    records={records}
                />
            </div>
        </div>
    );
}
