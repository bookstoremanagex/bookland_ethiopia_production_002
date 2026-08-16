import prisma from "@/lib/prisma";
import PrinterTable from "./PrinterTable";
import CreatePrinterButton from "./CreatePrinterButton";

export default async function PrintersPage() {
    const printers = await (prisma as any).printer.findMany({
        where: { is_deleted: false },
        include: {
            printorder: true,
            bookeditionprinters: {
                where: { is_deleted: false }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Printing Partners
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Manage identity and contact details of external printing facilities
                    </p>
                </div>
                <CreatePrinterButton />
            </div>

            <PrinterTable data={printers} />
        </div>
    );
}
