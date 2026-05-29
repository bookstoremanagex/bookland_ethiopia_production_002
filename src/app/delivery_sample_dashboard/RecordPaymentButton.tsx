"use client";

import React, { useState } from "react";
import { Banknote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import RecordPaymentModal from "@/app/admin_dashboard/book_shops/[id]/RecordPaymentModal";
import { getShopsFinanceData } from "@/app/delivery_and_sales_dashboard/actions";

interface ShopOption {
    id: number;
    name: string;
}

export default function RecordPaymentButton() {
    const [shops, setShops] = useState<ShopOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [showShopPicker, setShowShopPicker] = useState(false);
    const [selectedShop, setSelectedShop] = useState<ShopOption | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const openShopPicker = async () => {
        setLoading(true);
        setShowShopPicker(true);
        const res = await getShopsFinanceData();
        if (res.success && res.data) {
            setShops(res.data.map((s: any) => ({ id: s.id, name: s.name })));
        }
        setLoading(false);
    };

    return (
        <>
            <Button
                onClick={openShopPicker}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2"
            >
                <Banknote className="size-4" />
                Record Payment
            </Button>

            <Dialog open={showShopPicker} onOpenChange={(o) => { if (!o) { setShowShopPicker(false); setSelectedShop(null); } }}>
                <DialogContent className="sm:max-w-md rounded-[2rem] p-6 md:p-8">
                    <DialogHeader className="p-0 pb-4">
                        <DialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
                            Select <span className="text-secondarycolor not-italic">Shop</span>
                        </DialogTitle>
                    </DialogHeader>
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground font-bold">
                            <Loader2 className="size-4 animate-spin" /> Loading shops...
                        </div>
                    ) : shops.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground font-bold text-sm">No shops available</div>
                    ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {shops.map((shop) => (
                                <button
                                    key={shop.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedShop(shop);
                                        setShowShopPicker(false);
                                        setShowPaymentModal(true);
                                    }}
                                    className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-primarycolor/30 bg-white transition-all cursor-pointer font-black text-primarycolor"
                                >
                                    {shop.name}
                                </button>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {selectedShop && (
                <RecordPaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedShop(null);
                    }}
                    shopId={selectedShop.id}
                    shopName={selectedShop.name}
                />
            )}
        </>
    );
}
