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

                <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 px-6 py-3 rounded-[2rem] shadow-2xl shadow-emerald-600/20 text-white flex items-center gap-4">
                        <Package className="size-8 opacity-40" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">Total Books</p>
                            <p className="text-2xl font-black mt-1">{grandTotalBooks.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-emerald-600 px-6 py-3 rounded-[2rem] shadow-2xl shadow-emerald-600/20 text-white flex items-center gap-4">
                        <Banknote className="size-8 opacity-40" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">Total Paid</p>
                            <p className="text-2xl font-black mt-1">{grandTotalPaid.toLocaleString()} <span className="text-sm opacity-60 font-bold">ETB</span></p>
                        </div>
                    </div>
                    <div className="bg-rose-600 px-6 py-3 rounded-[2rem] shadow-2xl shadow-rose-600/20 text-white flex items-center gap-4">
                        <Banknote className="size-8 opacity-40" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">Total Remaining</p>
                            <p className="text-2xl font-black mt-1">{grandTotalRemaining.toLocaleString()} <span className="text-sm opacity-60 font-bold">ETB</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-primarycolor/10 shadow-xl overflow-hidden">
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
                                <th className="text-center px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Collection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shopData.map((shop, index) => {
                                const collectionRate = shop.totalPrice > 0 ? (shop.totalPaid / shop.totalPrice) * 100 : 0;
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
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 justify-center">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                                        style={{ width: `${collectionRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-muted-foreground w-10 text-right">
                                                    {collectionRate.toFixed(0)}%
                                                </span>
                                            </div>
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
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3 justify-center">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full transition-all"
                                                    style={{ width: `${(grandTotalPaid / (shopData.reduce((a, s) => a + s.totalPrice, 0) || 1)) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-primarycolor w-10 text-right">
                                                {((grandTotalPaid / (shopData.reduce((a, s) => a + s.totalPrice, 0) || 1)) * 100).toFixed(0)}%
                                            </span>
                                        </div>
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
        </div>
    );
}