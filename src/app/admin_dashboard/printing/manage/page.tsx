import prisma from "@/lib/prisma";
import PrintOrderTable from "./PrintOrderTable";
import CreatePrintOrderButton from "./CreatePrintOrderButton";

export default async function ManagePrintingPage() {
    const [orders, printers, editions, books] = await Promise.all([
        (prisma as any).printorder.findMany({
            where: { is_deleted: false },
            include: {
                printer: true,
                printorder_items: {
                    include: {
                        bookedition: {
                            include: {
                                bookeditionprinters: {
                                    where: { is_deleted: false },
                                    include: { printer: true }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        (prisma as any).printer.findMany({ where: { is_deleted: false } }),
        (prisma as any).bookedition.findMany({ 
            where: { is_deleted: false },
            include: { books: true }
        }),
        (prisma as any).books.findMany({ where: { is_deleted: false } })
    ]);

    const isAutoDeliveryOrder = (order: any): boolean => {
        const name = order.project_name || "";
        return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
    };

    const printOrders = orders.filter((o: any) => !isAutoDeliveryOrder(o));
    const deliveryOrders = orders.filter(isAutoDeliveryOrder);

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Print <span className="text-secondarycolor not-italic">Logistics</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Track batches, quality, and printer performance across the network
                    </p>
                </div>
                <CreatePrintOrderButton printers={printers} editions={editions} books={books} />
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    Print <span className="text-secondarycolor not-italic">Projects</span>
                </h2>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Manually created printing batches
                </p>
            </div>
            <PrintOrderTable data={printOrders} label="Projects" searchPlaceholder="Search projects..." />

            {deliveryOrders.length > 0 && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                            Auto <span className="text-secondarycolor not-italic">Delivery</span>
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                            Auto-generated records created when editions are assigned to stores
                        </p>
                    </div>
                    <PrintOrderTable data={deliveryOrders} label="Auto Deliveries" searchPlaceholder="Search auto deliveries..." />
                </div>
            )}
        </div>
    );
}
