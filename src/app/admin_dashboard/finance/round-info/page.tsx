import prisma from "@/lib/prisma";
import { Repeat, Package, Banknote } from "lucide-react";

export default async function RoundInfoPage() {
    const shops = await prisma.bookshopes.findMany({
        where: { is_deleted: false },
        include: {
            roundrecords: {
                where: { is_deleted: false },
                include: {
                    RoundBooks: true,
                    round_payments: {
                        where: { is_deleted: false, status: "APPROVED" },
                    },
                },
            },
        },
    });

    const shopData = shops
        .map((shop) => {
            let totalBooksReceived = 0;
            let totalPrice = 0;
            let totalPaid = 0;

            for (const record of shop.roundrecords) {
                totalBooksReceived += record.RoundBooks?.starting_amount || 0;
                totalPrice += record.totalprice || 0;
                for (const payment of record.round_payments) {
                    totalPaid += payment.amount || 0;
                }
            }

            const remainingBirr = totalPrice - totalPaid;

            return {
                id: shop.id,
                name: shop.name,
                location: shop.location,
                totalBooksReceived,
                totalPrice,
                totalPaid,
                remainingBirr,
                roundCount: shop.roundrecords.length,
            };
        })
        .filter((s) => s.roundCount > 0)
        .sort((a, b) => b.remainingBirr - a.remainingBirr);

    const grandTotalBooks = shopData.reduce((acc, s) => acc + s.totalBooksReceived, 0);
    const grandTotalRemaining = shopData.reduce((acc, s) => acc + s.remainingBirr, 0);
    const grandTotalPaid = shopData.reduce((acc, s) => acc + s.totalPaid, 0);

    return (
        <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Round <span className="text-secondarycolor not-italic">Info</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
                        Book shop round distribution overview
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                    <div className="bg-white px-5 sm:px-6 py-3 rounded-[2rem] border-2 border-primarycolor/5 shadow-xl flex items-center gap-3 sm:gap-4">
                        <div className="size-10 sm:size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border-2 border-emerald-500/10 shrink-0">
                            <Package className="size-5 sm:size-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Total Books</p>
                            <p className="text-lg sm:text-2xl font-black text-primarycolor mt-1">{grandTotalBooks.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white px-5 sm:px-6 py-3 rounded-[2rem] border-2 border-primarycolor/5 shadow-xl flex items-center gap-3 sm:gap-4">
                        <div className="size-10 sm:size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border-2 border-emerald-500/10 shrink-0">
                            <Banknote className="size-5 sm:size-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Total Paid</p>
                            <p className="text-lg sm:text-2xl font-black text-primarycolor mt-1">{grandTotalPaid.toLocaleString()} <span className="text-xs sm:text-sm font-bold text-muted-foreground">ETB</span></p>
                        </div>
                    </div>
                    <div className="bg-white px-5 sm:px-6 py-3 rounded-[2rem] border-2 border-primarycolor/5 shadow-xl flex items-center gap-3 sm:gap-4">
                        <div className="size-10 sm:size-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 border-2 border-rose-500/10 shrink-0">
                            <Banknote className="size-5 sm:size-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Total Remaining</p>
                            <p className="text-lg sm:text-2xl font-black text-primarycolor mt-1">{grandTotalRemaining.toLocaleString()} <span className="text-xs sm:text-sm font-bold text-muted-foreground">ETB</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-primarycolor/10 shadow-xl overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-primarycolor/10 bg-slate-50">
                                <th className="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">#</th>
                                <th className="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shop Name</th>
                                <th className="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</th>
                                <th className="text-right px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rounds</th>
                                <th className="text-right px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Books Received</th>
                                <th className="text-right px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Price (ETB)</th>
                                <th className="text-right px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paid (ETB)</th>
                                <th className="text-right px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Remaining (ETB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shopData.map((shop, index) => {
                                return (
                                    <tr key={shop.id} className="border-b border-primarycolor/5 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 text-sm font-bold text-muted-foreground">{index + 1}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-primarycolor uppercase">{shop.name}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-muted-foreground">{shop.location}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-center">{shop.roundCount}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-right">{shop.totalBooksReceived.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-right">{shop.totalPrice.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-right text-emerald-600">{shop.totalPaid.toLocaleString()}</td>
                                        <td className={`px-6 py-5 text-sm font-bold text-right ${shop.remainingBirr > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {shop.remainingBirr.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Grand total row */}
                            {shopData.length > 0 && (
                                <tr className="bg-primarycolor/5 border-t-2 border-primarycolor/20">
                                    <td colSpan={4} className="px-6 py-5 text-sm font-black text-primarycolor uppercase">Grand Total</td>
                                    <td className="px-6 py-5 text-sm font-black text-right text-primarycolor">{grandTotalBooks.toLocaleString()}</td>
                                    <td className="px-6 py-5 text-sm font-black text-right text-primarycolor">{shopData.reduce((a, s) => a + s.totalPrice, 0).toLocaleString()}</td>
                                    <td className="px-6 py-5 text-sm font-black text-right text-emerald-600">{grandTotalPaid.toLocaleString()}</td>
                                    <td className={`px-6 py-5 text-sm font-black text-right ${grandTotalRemaining > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {grandTotalRemaining.toLocaleString()}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {shopData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Repeat className="size-16 mb-4 opacity-20" />
                        <p className="text-lg font-bold uppercase tracking-widest">No round data found</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Shops have no round records yet</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
                {shopData.length > 0 ? (
                    shopData.map((shop, index) => {
                        return (
                            <div key={shop.id} className="bg-white rounded-2xl border-2 border-primarycolor/5 p-5 space-y-4 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center shrink-0">
                                            <span className="text-sm font-black text-primarycolor">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-black text-primarycolor uppercase text-sm truncate">{shop.name}</div>
                                            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{shop.location}</div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 bg-slate-50 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        {shop.roundCount} Round{shop.roundCount !== 1 ? "s" : ""}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Books Received</p>
                                        <p className="text-base font-black text-primarycolor mt-0.5">{shop.totalBooksReceived.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total Price</p>
                                        <p className="text-base font-black text-primarycolor mt-0.5">{shop.totalPrice.toLocaleString()} <span className="text-[9px] font-bold text-muted-foreground">ETB</span></p>
                                    </div>
                                    <div className="bg-emerald-500/5 rounded-xl px-4 py-3">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Paid</p>
                                        <p className="text-base font-black text-emerald-600 mt-0.5">{shop.totalPaid.toLocaleString()} <span className="text-[9px] font-bold text-emerald-600/60">ETB</span></p>
                                    </div>
                                    <div className={`rounded-xl px-4 py-3 ${shop.remainingBirr > 0 ? 'bg-rose-500/5' : 'bg-emerald-500/5'}`}>
                                        <p className={`text-[8px] font-black uppercase tracking-widest ${shop.remainingBirr > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>Remaining</p>
                                        <p className={`text-base font-black mt-0.5 ${shop.remainingBirr > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{shop.remainingBirr.toLocaleString()} <span className={`text-[9px] font-bold ${shop.remainingBirr > 0 ? 'text-rose-600/60' : 'text-emerald-600/60'}`}>ETB</span></p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-white rounded-2xl border-2 border-primarycolor/5">
                        <Repeat className="size-16 mb-4 opacity-20" />
                        <p className="text-lg font-bold uppercase tracking-widest">No round data found</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Shops have no round records yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}