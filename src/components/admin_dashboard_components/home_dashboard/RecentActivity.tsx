import { 
    History, 
    ArrowRight, 
    Package, 
    Building2,
    Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentActivityProps {
    activities: {
        id: number;
        bookTitle: string;
        shopName: string;
        quantity: number;
        date: string;
    }[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <div className="bg-white rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-primarycolor">
                    <History className="size-7" />
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">
                        Recent <span className="text-secondarycolor not-italic">Distributions</span>
                    </h3>
                </div>
                <Link href="/admin_dashboard/shop_assignments">
                    <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                        View All <ArrowRight className="size-3" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-primarycolor/10 hover:bg-white transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-primarycolor shadow-sm group-hover:scale-110 transition-transform">
                                <Package className="size-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-primarycolor uppercase text-xs leading-tight line-clamp-1">{activity.bookTitle}</h4>
                                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Building2 className="size-3" /> {activity.shopName}</span>
                                    <span className="flex items-center gap-1"><Clock className="size-3" /> {activity.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-primarycolor">{activity.quantity}</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Units</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
