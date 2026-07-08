import prisma from "@/lib/prisma";
import { Info, AlertCircle, Clock, CheckCircle2, BarChart3 } from "lucide-react";
import PrintingInfoTable from "./PrintingInfoTable";

export const dynamic = "force-dynamic";

export default async function PrintingInfoPage() {
    const orders = await (prisma as any).printorder.findMany({
        where: { is_deleted: false },
        include: {
            printer: true,
            printorder_items: {
                include: {
                    bookedition: {
                        include: {
                            books: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const items = orders.flatMap((order: any) =>
        (order.printorder_items || []).map((item: any) => ({
            id: item.id,
            orderId: order.id,
            projectName: order.project_name || `Project #${order.id}`,
            printerName: order.printer?.name || "—",
            bookTitle: item.bookedition?.books?.title || "Unknown Book",
            author: item.bookedition?.books?.author || "—",
            editionName: item.bookedition?.edition_name || "—",
            quantity: item.quantity || 0,
            status: item.status || "NOT_STARTED",
            remaining: item.bookedition?.count_remening_for_transfer ?? null,
        }))
    );

    const notStarted = items.filter((i: any) => i.status === "NOT_STARTED").length;
    const started = items.filter((i: any) => i.status === "STARTED" || i.status === "ONPROGRESS").length;
    const completed = items.filter((i: any) => i.status === "COMPLETED").length;
    const total = items.length;

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Printing <span className="text-secondarycolor not-italic">Info</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Overview of book statuses across all printing projects
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-xl flex items-center gap-5">
                    <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                        <BarChart3 className="size-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Books</p>
                        <p className="text-2xl font-black text-slate-800">{total}</p>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-xl flex items-center gap-5">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Clock className="size-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Not Started</p>
                        <p className="text-2xl font-black text-slate-800">{notStarted}</p>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-xl flex items-center gap-5">
                    <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <AlertCircle className="size-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Started / In Progress</p>
                        <p className="text-2xl font-black text-blue-600">{started}</p>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-xl flex items-center gap-5">
                    <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                        <CheckCircle2 className="size-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Completed</p>
                        <p className="text-2xl font-black text-emerald-600">{completed}</p>
                    </div>
                </div>
            </div>

            <PrintingInfoTable items={items} />
        </div>
    );
}
