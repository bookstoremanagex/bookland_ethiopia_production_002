"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    ChevronLeft,
    Store,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Clock,
    Settings,
    Building2,
    AlertCircle,
    Save,
    Trash2,
    Edit3,
    X,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { updateStore, deleteStore } from '@/app/actions/store-actions';
import { StoreInventoryTable } from './StoreInventoryTable';

interface StoreDetailsClientProps {
    store: any;
}

export default function StoreDetailsClient({ store: initialStore }: StoreDetailsClientProps) {
    const [store, setStore] = useState(initialStore);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: initialStore.name,
        location: initialStore.location,
        phone: initialStore.phone || "",
        email: initialStore.email || "",
        status: initialStore.status
    });

    const router = useRouter();
    const pathname = usePathname();
    const dashboardRoot = pathname.split('/').slice(0, 2).join('/');

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const res = await updateStore(store.id, formData);
            if (res.success) {
                toast.success("Store updated successfully");
                setStore(res.data);
                setIsEditing(false);
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this store? This will hide it from the system.")) return;

        setIsUpdating(true);
        try {
            const res = await deleteStore(store.id);
            if (res.success) {
                toast.success("Store deleted");
                router.push(`${dashboardRoot}/stores`);
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("Delete failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const totalStock = (store.bookeditionstores || []).reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <Link href={`${dashboardRoot}/stores`}>
                        <Button variant="ghost" className="rounded-2xl gap-3 font-bold text-muted-foreground hover:text-primarycolor h-12 px-6 hover:bg-white shadow-sm border-2 border-transparent hover:border-primarycolor/5 transition-all">
                            <ChevronLeft className="size-5" />
                            Back to Stores
                        </Button>
                    </Link>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-xl h-12 md:w-12 px-6 md:px-0 shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 className="size-5" />
                            <span className="md:hidden text-[10px] font-black uppercase tracking-widest">Delete Branch</span>
                        </Button>
                        <Button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            disabled={isUpdating}
                            className={cn(
                                "flex-1 md:flex-none rounded-xl md:rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-xl transition-all gap-3 active:scale-95 flex items-center justify-center",
                                isEditing ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-primarycolor shadow-primarycolor/20"
                            )}
                        >
                            {isEditing ? <Save className="size-5" /> : <Edit3 className="size-5" />}
                            {isUpdating ? 'Processing...' : isEditing ? 'Confirm Changes' : 'Edit Store'}
                        </Button>
                        {isEditing && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="rounded-xl h-12 md:w-12 px-6 md:px-0 border-2 flex items-center justify-center gap-2"
                            >
                                <X className="size-5" />
                                <span className="md:hidden text-[10px] font-black uppercase tracking-widest">Cancel</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Form & Visuals */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 border-2 border-primarycolor/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 size-80 bg-primarycolor/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:scale-110 transition-transform duration-1000" />

                            <div className="relative space-y-12">
                                <div className="flex flex-col md:flex-row md:items-center gap-8">
                                    <div className="size-24 rounded-[2.5rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-xl border-4 border-white shrink-0 group-hover:rotate-3 transition-transform duration-500">
                                        <Store className="size-12" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondarycolor/5 rounded-lg border border-secondarycolor/10">
                                            <Building2 className="size-3.5 text-secondarycolor" />
                                            <span className="text-[10px] font-black text-secondarycolor uppercase tracking-[0.2em]">Store Identity</span>
                                        </div>
                                        <h1 className="text-4xl md:text-6xl font-black text-primarycolor tracking-tighter italic uppercase leading-none">
                                            {isEditing ? "Modify" : ""} <span className="text-secondarycolor not-italic">{isEditing ? "Branch" : store.name}</span>
                                        </h1>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Branch Name</label>
                                        <Input
                                            value={formData.name}
                                            disabled={!isEditing}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-16 pl-8 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50 disabled:border-transparent"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Operating Status</label>
                                        <Select
                                            disabled={!isEditing}
                                            value={formData.status}
                                            onValueChange={(v) => setFormData({ ...formData, status: v })}
                                        >
                                            <SelectTrigger className="h-16 pl-8 rounded-2xl border-2 border-slate-100 focus:ring-0 font-bold text-lg disabled:bg-slate-50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl p-2 border-2">
                                                <SelectItem value="available" className="rounded-xl h-12 font-bold">Available</SelectItem>
                                                <SelectItem value="closed" className="rounded-xl h-12 font-bold">Closed</SelectItem>
                                                <SelectItem value="maintenance" className="rounded-xl h-12 font-bold">Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Physical Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <Input
                                                value={formData.location}
                                                disabled={!isEditing}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Primary Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <Input
                                                value={formData.phone}
                                                disabled={!isEditing}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Email Channel</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <Input
                                                value={formData.email}
                                                disabled={!isEditing}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-lg transition-all disabled:bg-slate-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Section */}
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-primarycolor uppercase tracking-tight italic leading-none">
                                        Current <span className="text-secondarycolor not-italic">Inventory</span>
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Real-time stock across editions</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="px-6 py-2 rounded-full bg-primarycolor text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primarycolor/20">
                                        {totalStock.toLocaleString()} Global Units
                                    </div>
                                </div>
                            </div>

                            <StoreInventoryTable data={store.bookeditionstores || []} />
                        </div>
                    </div>

                    {/* Right Column: Metadata & Stats */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-primarycolor rounded-[3rem] p-10 text-white shadow-2xl shadow-primarycolor/30 space-y-12 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mb-32 blur-3xl group-hover:scale-125 transition-transform duration-1000" />

                            <div className="space-y-8 relative">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                                        <Calendar className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Registry</p>
                                        <p className="text-lg font-black">{new Date(store.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20">
                                        <Clock className="size-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Last Sync</p>
                                        <p className="text-lg font-black">{new Date(store.updatedAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Account Integrity</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold opacity-80">Reference ID</span>
                                        <span className="font-black tracking-widest">STORE-{store.id.toString().padStart(4, '0')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 border-2 border-primarycolor/5 shadow-xl space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <Settings className="size-6" />
                                </div>
                                <h4 className="text-sm font-black text-primarycolor uppercase tracking-widest italic">Operational <span className="text-secondarycolor not-italic">Logic</span></h4>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-white shadow-inner flex flex-col items-center text-center space-y-2">
                                    <Package className="size-8 text-primarycolor opacity-20" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Stock Items</p>
                                    <p className="text-3xl font-black text-primarycolor">{(store.bookeditionstores || []).length}</p>
                                </div>

                                <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-primarycolor/[0.02] border-2 border-primarycolor/5 italic">
                                    <AlertCircle className="size-5 text-primarycolor/40 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                                        Branch metadata and inventory levels are synchronized in real-time across the production and sales grid.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
