"use client";

import React, { useState, useEffect } from 'react';
import {
    updateEdition,
    deleteEdition
} from '../../../../actions/edition-actions';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
    ChevronLeft,
    Layers,
    DollarSign,
    FileText,
    Activity,
    Check,
    X,
    Trash2,
    TrendingUp,
    Edit2,
    Store,
    Printer,
    Scissors,
    Palette,
    PenTool,
    Truck,
    Languages,
    PlusCircle,
    ShieldAlert,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { cn } from '../../../../../lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../../../components/ui/popover";
import StoreInventoryTable from './StoreInventoryTable';

interface EditionDetailsClientProps {
    initialEdition: any;
    stores: any[];
}

export default function EditionDetailsClient({ initialEdition, stores }: EditionDetailsClientProps) {
    const [edition, setEdition] = useState(initialEdition);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        edition_name: edition.edition_name,
        selling_price: edition.selling_price?.toString() || "",
        production_price: edition.production_price?.toString() || "",
        printing_cost: edition.printing_cost?.toString() || "",
        binding_cost: edition.binding_cost?.toString() || "",
        design_cost: edition.design_cost?.toString() || "",
        editing_cost: edition.editing_cost?.toString() || "",
        other_expenses: edition.other_expenses?.toString() || "",
        transportation_cost: edition.transportation_cost?.toString() || "",
        translation_cost: edition.translation_cost?.toString() || "",
        translator_cost: edition.translator_cost?.toString() || "",
        cover_design_cost: edition.cover_design_cost?.toString() || "",
        text_design_cost: edition.text_design_cost?.toString() || "",
        editor_cost: edition.editor_cost?.toString() || "",
        typewriting_cost: edition.typewriting_cost?.toString() || "",
        store_cost: edition.store_cost?.toString() || "",
        distribution_cost: edition.distribution_cost?.toString() || "",
        advertisement_cost: edition.advertisement_cost?.toString() || "",
        purchasing_right_cost: edition.purchasing_right_cost?.toString() || "",
        memo: edition.memo || "",
        book_image_url: edition.book_image_url || "",
        total_print_count: edition.total_print_count?.toString() || "",
        count_remening_for_transfer: edition.count_remening_for_transfer?.toString() || "",
        number_of_pages: edition.number_of_pages?.toString() || "",
    });

    useEffect(() => {
        setFormData({
            edition_name: edition.edition_name,
            selling_price: edition.selling_price?.toString() || "",
            production_price: edition.production_price?.toString() || "",
            printing_cost: edition.printing_cost?.toString() || "",
            binding_cost: edition.binding_cost?.toString() || "",
            design_cost: edition.design_cost?.toString() || "",
            editing_cost: edition.editing_cost?.toString() || "",
            other_expenses: edition.other_expenses?.toString() || "",
            transportation_cost: edition.transportation_cost?.toString() || "",
            translation_cost: edition.translation_cost?.toString() || "",
            translator_cost: edition.translator_cost?.toString() || "",
            cover_design_cost: edition.cover_design_cost?.toString() || "",
            text_design_cost: edition.text_design_cost?.toString() || "",
            editor_cost: edition.editor_cost?.toString() || "",
            typewriting_cost: edition.typewriting_cost?.toString() || "",
            store_cost: edition.store_cost?.toString() || "",
            distribution_cost: edition.distribution_cost?.toString() || "",
            advertisement_cost: edition.advertisement_cost?.toString() || "",
            purchasing_right_cost: edition.purchasing_right_cost?.toString() || "",
            memo: edition.memo || "",
            book_image_url: edition.book_image_url || "",
            total_print_count: edition.total_print_count?.toString() || "",
            count_remening_for_transfer: edition.count_remening_for_transfer?.toString() || "",
            number_of_pages: edition.number_of_pages?.toString() || "",
        });
    }, [edition]);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const dashboardRoot = pathname.split('/').slice(0, 2).join('/');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const response = await updateEdition(edition.id, formData);
            if (response.success) {
                toast.success("Edition updated successfully!");
                setEdition(response.data);
                setIsEditing(false);
                router.refresh();
            } else {
                toast.error(response.error || "Failed to update edition");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmText !== "DELETE") return;
        setIsDeleting(true);
        try {
            const response = await deleteEdition(edition.id, edition.books.unique_identification_code);
            if (response.success) {
                toast.success("Edition deleted successfully");
                router.push(`${dashboardRoot}/books/${edition.books.unique_identification_code}`);
                router.refresh();
            } else {
                toast.error(response.error || "Failed to delete edition");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveField = async (field: string, value: string) => {
        setIsUpdating(true);
        try {
            const dataToUpdate = { ...formData, [field]: value };
            const response = await updateEdition(edition.id, dataToUpdate);
            if (response.success) {
                toast.success(`${field.replace('_', ' ')} updated`);
                setEdition(response.data);
                router.refresh();
            } else {
                toast.error(response.error || "Update failed");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const CostCard = ({ label, field, value, icon: Icon }: { label: string, field: string, value: any, icon: any }) => (
        <div className="group relative bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl hover:border-primarycolor/20 transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="size-8 md:size-10 rounded-lg md:rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                        <Icon className="size-4 md:size-5" />
                    </div>
                    <p className="text-[10px] md:text-[12px] font-black text-primarycolor uppercase tracking-widest">{label}</p>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-lg opacity-0 md:opacity-100 group-hover:opacity-100 transition-all hover:bg-primarycolor/10 text-primarycolor">
                            <Edit2 className="size-3" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 rounded-2xl p-4 shadow-2xl border-2 border-primarycolor/10">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">Update {label}</p>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    defaultValue={value}
                                    className="h-10 rounded-xl font-bold"
                                    id={`input-${field}`}
                                />
                                <Button
                                    size="icon"
                                    className="size-10 rounded-xl bg-primarycolor shrink-0"
                                    onClick={() => {
                                        const val = (document.getElementById(`input-${field}`) as HTMLInputElement).value;
                                        handleSaveField(field, val);
                                    }}
                                >
                                    <Check className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-xl md:text-2xl font-black text-primarycolor tracking-tight">{Number(value || 0).toLocaleString()}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase">ETB</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Superior Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="size-14 md:size-20 rounded-2xl md:rounded-3xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor border-2 border-secondarycolor/20 shrink-0">
                            <Layers className="size-7 md:size-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 md:gap-3 mb-1">
                                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[8px] md:text-[10px]">
                                    <Link href={`${dashboardRoot}/books/${edition.books.unique_identification_code}`} className="flex items-center gap-1">
                                        <ChevronLeft className="size-2 md:size-3" /> Back
                                    </Link>
                                </Button>
                                <div className="size-1 rounded-full bg-primarycolor/20" />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-secondarycolor/60">Edition Profile</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-primarycolor uppercase tracking-tighter leading-tight">{edition.edition_name}</h1>
                            <p className="text-muted-foreground font-bold tracking-tight text-xs md:text-base mt-0.5 md:mt-1">
                                Configuration for <span className="text-primarycolor italic">"{edition.books.title}"</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 md:flex-none h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px] md:text-xs gap-2 shadow-xl shadow-primarycolor/20 transition-all"
                            >
                                <Edit2 className="size-3 md:size-4" /> Edit
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex-1 md:flex-none h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs gap-2 shadow-xl shadow-rose-500/20 transition-all"
                        >
                            <Trash2 className="size-3 md:size-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border-2 border-primarycolor/10 shadow-2xl space-y-8 md:space-y-10">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor border-2 border-primarycolor/10 shrink-0">
                                    <Activity className="size-6 md:size-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight">Financial <span className="text-secondarycolor">& Production</span></h2>
                                    <p className="text-muted-foreground font-bold text-xs md:text-base">Manage costs and pricing for this release.</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Edition Name</label>
                                        <Input
                                            disabled={!isEditing}
                                            value={formData.edition_name}
                                            onChange={(e) => setFormData({ ...formData, edition_name: e.target.value })}
                                            className="h-12 md:h-14 px-4 md:px-6 bg-primarycolor/5 border-2 border-transparent focus:border-primarycolor rounded-xl md:rounded-2xl font-black text-sm md:text-base"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Selling Price</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3 md:size-4 text-muted-foreground" />
                                                <Input
                                                    disabled={!isEditing}
                                                    type="number" step="0.01"
                                                    value={formData.selling_price}
                                                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                                                    className="h-12 md:h-14 pl-8 md:pl-10 bg-primarycolor/5 border-2 border-transparent focus:border-primarycolor rounded-xl md:rounded-2xl font-black text-sm md:text-base"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Base Prod. Cost</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-3 md:size-4 text-muted-foreground" />
                                                <Input
                                                    disabled={!isEditing}
                                                    type="number" step="0.01"
                                                    value={formData.production_price}
                                                    onChange={(e) => setFormData({ ...formData, production_price: e.target.value })}
                                                    className="h-12 md:h-14 pl-8 md:pl-10 bg-primarycolor/5 border-2 border-transparent focus:border-primarycolor rounded-xl md:rounded-2xl font-black text-sm md:text-base"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Image URL</label>
                                        <Input
                                            disabled={!isEditing}
                                            value={formData.book_image_url}
                                            onChange={(e) => setFormData({ ...formData, book_image_url: e.target.value })}
                                            className="h-12 md:h-14 px-4 md:px-6 bg-primarycolor/5 border-2 border-transparent focus:border-primarycolor rounded-xl md:rounded-2xl font-black text-sm md:text-base"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Print Run</label>
                                            <Input
                                                disabled={!isEditing}
                                                type="number"
                                                value={formData.total_print_count}
                                                onChange={(e) => setFormData({ ...formData, total_print_count: e.target.value })}
                                                className="h-12 md:h-14 px-4 md:px-6 bg-primarycolor/5 border-2 border-transparent focus:border-primarycolor rounded-xl md:rounded-2xl font-black text-sm md:text-base"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Remaining for Transfer</label>
                                            <Input
                                                disabled={!isEditing}
                                                type="number"
                                                value={formData.count_remening_for_transfer}
                                                onChange={(e) => setFormData({ ...formData, count_remening_for_transfer: e.target.value })}
                                                className="h-12 md:h-14 px-4 md:px-6 bg-secondarycolor/5 border-2 border-transparent focus:border-secondarycolor rounded-xl md:rounded-2xl font-black text-sm md:text-base text-secondarycolor"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Page Count</label>
                                        <Input
                                            disabled={!isEditing}
                                            type="number"
                                            value={formData.number_of_pages}
                                            onChange={(e) => setFormData({ ...formData, number_of_pages: e.target.value })}
                                            className="h-12 md:h-14 px-4 md:px-6 bg-primarycolor/5 border-2 border-transparent focus:border-primarycolor rounded-xl md:rounded-2xl font-black text-sm md:text-base"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Memo / Notes</label>
                                        <textarea
                                            disabled={!isEditing}
                                            value={formData.memo}
                                            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                                            rows={4}
                                            className="w-full p-4 md:p-6 rounded-xl md:rounded-2xl bg-primarycolor/5 border-2 border-transparent focus:border-primarycolor outline-none font-bold text-xs md:text-sm transition-all resize-none disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="md:col-span-2 pt-6 md:pt-10 flex gap-3 md:gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="flex-1 h-12 md:h-16 rounded-xl md:rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px] md:text-base shadow-2xl shadow-primarycolor/20"
                                        >
                                            {isUpdating ? "Saving..." : "Save"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-12 md:h-16 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] md:text-base"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Central Inventory Quick Stat */}
                        <div className="bg-secondarycolor/5 p-8 md:p-10 rounded-[2.5rem] border-2 border-secondarycolor/10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-[2rem] bg-secondarycolor/10 flex items-center justify-center text-secondarycolor border-2 border-secondarycolor/20 shadow-lg">
                                    <Store className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-primarycolor uppercase tracking-tight italic">Central <span className="text-secondarycolor not-italic">Inventory</span></h3>
                                    <p className="text-muted-foreground font-bold text-sm tracking-tight italic">Copies reserved at headquarters specifically for store distribution requests.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end">
                                <div className="text-5xl font-black text-secondarycolor italic tabular-nums leading-none mb-1">
                                    {Number(edition.count_remening_for_transfer || 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor/40">Units Available for Transfer</div>
                            </div>
                        </div>

                        {/* Expanded Cost Ecosystem Section */}
                        <div className="bg-slate-50/50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border-2 border-primarycolor/5 space-y-6 md:space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3 md:gap-4 text-primarycolor">
                                    <TrendingUp className="size-5 md:size-7" />
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">Cost <span className="text-secondarycolor not-italic">Breakdown</span></h3>
                                </div>
                                <div className="px-4 md:px-6 py-2 rounded-full bg-white border border-primarycolor/10 shadow-sm text-[8px] md:text-[10px] font-black text-primarycolor uppercase tracking-widest">
                                    Total: {Number(
                                        (parseFloat(formData.printing_cost) || 0) +
                                        (parseFloat(formData.binding_cost) || 0) +
                                        (parseFloat(formData.design_cost) || 0) +
                                        (parseFloat(formData.editing_cost) || 0) +
                                        (parseFloat(formData.transportation_cost) || 0) +
                                        (parseFloat(formData.translation_cost) || 0) +
                                        (parseFloat(formData.other_expenses) || 0) +
                                        (parseFloat(formData.translator_cost) || 0) +
                                        (parseFloat(formData.cover_design_cost) || 0) +
                                        (parseFloat(formData.text_design_cost) || 0) +
                                        (parseFloat(formData.editor_cost) || 0) +
                                        (parseFloat(formData.typewriting_cost) || 0) +
                                        (parseFloat(formData.store_cost) || 0) +
                                        (parseFloat(formData.distribution_cost) || 0) +
                                        (parseFloat(formData.advertisement_cost) || 0) +
                                        (parseFloat(formData.purchasing_right_cost) || 0)
                                    ).toLocaleString()} ETB
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CostCard label="Printing" field="printing_cost" value={edition.printing_cost} icon={Printer} />
                                <CostCard label="Binding" field="binding_cost" value={edition.binding_cost} icon={Scissors} />
                                <CostCard label="Design" field="design_cost" value={edition.design_cost} icon={Palette} />
                                <CostCard label="Editing" field="editing_cost" value={edition.editing_cost} icon={PenTool} />
                                <CostCard label="Transport" field="transportation_cost" value={edition.transportation_cost} icon={Truck} />
                                <CostCard label="Translation" field="translation_cost" value={edition.translation_cost} icon={Languages} />
                                <CostCard label="Other" field="other_expenses" value={edition.other_expenses} icon={PlusCircle} />
                            </div>

                            {/* Additional Costs Section */}
                            <div className="pt-4 border-t-2 border-primarycolor/5">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="size-2 rounded-full bg-emerald-500" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Additional Production Costs</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <CostCard label="Translator" field="translator_cost" value={edition.translator_cost} icon={Languages} />
                                    <CostCard label="Cover Design" field="cover_design_cost" value={edition.cover_design_cost} icon={Palette} />
                                    <CostCard label="Text Design" field="text_design_cost" value={edition.text_design_cost} icon={PenTool} />
                                    <CostCard label="Editor" field="editor_cost" value={edition.editor_cost} icon={Edit2} />
                                    <CostCard label="Typewriting" field="typewriting_cost" value={edition.typewriting_cost} icon={FileText} />
                                    <CostCard label="Store Cost" field="store_cost" value={edition.store_cost} icon={Store} />
                                    <CostCard label="Distribution" field="distribution_cost" value={edition.distribution_cost} icon={Truck} />
                                    <CostCard label="Advertisement" field="advertisement_cost" value={edition.advertisement_cost} icon={TrendingUp} />
                                    <CostCard label="Purchasing Right" field="purchasing_right_cost" value={edition.purchasing_right_cost} icon={ShieldAlert} />
                                </div>
                            </div>
                        </div>

                        <StoreInventoryTable
                            editionId={edition.id}
                            inventory={edition.bookeditionstores || []}
                            allStores={stores}
                            remainingForTransfer={Number(edition.count_remening_for_transfer || 0)}
                            onRemainingChange={(newRemaining: number) => {
                                setEdition((prev: any) => ({ ...prev, count_remening_for_transfer: newRemaining }));
                                setFormData((prev: any) => ({ ...prev, count_remening_for_transfer: newRemaining.toString() }));
                            }}
                        />
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border-2 border-primarycolor/10 shadow-xl space-y-6">
                            <div className="aspect-3/4 md:aspect-3/4.5 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
                                {edition.book_image_url ? (
                                    <img src={edition.book_image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primarycolor/5 flex items-center justify-center text-primarycolor/20">
                                        <Layers className="size-16 md:size-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/30">Cover Preview</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-5 md:p-6 rounded-[1.2rem] md:rounded-3xl bg-secondarycolor/5 border-2 border-secondarycolor/10">
                                    <div className="text-[8px] md:text-[10px] font-black text-secondarycolor uppercase tracking-[0.2em] mb-2">Projected Margin</div>
                                    <div className="text-2xl md:text-3xl font-black text-primarycolor flex items-baseline gap-2">
                                        <span>ETB</span>
                                        {(
                                            (parseFloat(formData.selling_price) || 0) -
                                            (
                                                (parseFloat(formData.production_price) || 0) +
                                                (parseFloat(formData.printing_cost) || 0) +
                                                (parseFloat(formData.binding_cost) || 0) +
                                                (parseFloat(formData.design_cost) || 0) +
                                                (parseFloat(formData.editing_cost) || 0) +
                                        (parseFloat(formData.transportation_cost) || 0) +
                                        (parseFloat(formData.translation_cost) || 0) +
                                        (parseFloat(formData.other_expenses) || 0) +
                                        (parseFloat(formData.translator_cost) || 0) +
                                        (parseFloat(formData.cover_design_cost) || 0) +
                                        (parseFloat(formData.text_design_cost) || 0) +
                                        (parseFloat(formData.editor_cost) || 0) +
                                        (parseFloat(formData.typewriting_cost) || 0) +
                                        (parseFloat(formData.store_cost) || 0) +
                                        (parseFloat(formData.distribution_cost) || 0) +
                                        (parseFloat(formData.advertisement_cost) || 0) +
                                        (parseFloat(formData.purchasing_right_cost) || 0)
                                    )
                                        ).toLocaleString()}
                                        <span className="text-[10px] md:text-sm font-bold text-muted-foreground">/ unit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20">
                                    <ShieldAlert className="size-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tight">Danger <span className="text-secondarycolor">Zone</span></h3>
                                    <p className="text-muted-foreground font-bold">Discontinuing this edition profile.</p>
                                </div>
                            </div>

                            <div className="p-6 bg-rose-500/5 rounded-2xl border-2 border-rose-500/10 space-y-4">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-1" />
                                    <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                                        You are about to discontinue <span className="text-rose-600 font-black">"{edition.edition_name}"</span>. This will remove it from active inventory management.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Type <span className="underline">DELETE</span> to confirm</p>
                                    <Input
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="h-14 px-6 rounded-xl border-2 border-rose-500/20 font-black text-rose-600"
                                        placeholder="Type here..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="destructive"
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20"
                                    onClick={handleDelete}
                                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                                >
                                    {isDeleting ? "Processing..." : "Confirm Delete"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
