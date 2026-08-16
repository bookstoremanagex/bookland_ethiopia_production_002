"use client";

import React from 'react';
import {
    DollarSign,
    BookOpen,
    PenTool,
    Edit2,
    Check,
    X,
    User,
    Type,
    Store,
    Truck,
    Megaphone,
    FileText,
    Layers,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';

interface CostsInfoProps {
    book: any;
    editingField: string | null;
    editValue: any;
    isUpdating: boolean;
    onStartEdit: (field: string, value: any) => void;
    onCancelEdit: () => void;
    onSaveEdit: (field: string) => void;
    onValueChange: (value: any) => void;
}

const costFields: { field: string; label: string; icon: React.ElementType }[] = [
    { field: "translator_cost", label: "Translator", icon: User },
    { field: "cover_design_cost", label: "Cover Design", icon: PenTool },
    { field: "text_design_cost", label: "Text Design", icon: BookOpen },
    { field: "editor_cost", label: "Editor", icon: Edit2 },
    { field: "typewriting_cost", label: "Typewriting", icon: Type },
    { field: "store_cost", label: "Store Cost", icon: Store },
    { field: "distribution_cost", label: "Distribution", icon: Truck },
    { field: "advertisement_cost", label: "Advertisement", icon: Megaphone },
    { field: "purchasing_right_cost", label: "Purchasing Right", icon: FileText },
];

export default function CostsInfo({
    book,
    editingField,
    editValue,
    isUpdating,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onValueChange
}: CostsInfoProps) {

    const totalCost = costFields.reduce((sum, { field }) => sum + (Number(book[field]) || 0), 0);

    return (
        <div className="p-6 md:p-10 bg-white rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl space-y-8">
            <div className="flex items-center gap-6">
                <div className="size-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 border-2 border-emerald-500/20">
                    <DollarSign className="size-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-primarycolor uppercase tracking-tight italic">
                        Production <span className="text-emerald-600 not-italic">Costs</span>
                    </h2>
                    <p className="text-muted-foreground font-bold text-sm">
                        Manage cost allocations for this publication.
                    </p>
                </div>
                <div className="ml-auto px-5 py-2.5 bg-emerald-50 rounded-2xl border-2 border-emerald-100 text-right shrink-0">
                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600/60">Total Costs</p>
                    <p className="text-xl font-black text-emerald-700">{totalCost.toLocaleString()} <span className="text-[10px] font-bold opacity-60">ETB</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {costFields.map(({ field, label, icon: Icon }) => {
                    const isEditing = editingField === field;
                    const value = book[field];

                    return (
                        <div
                            key={field}
                            className={cn(
                                "group relative p-4 md:p-6 rounded-2xl border-2 transition-all",
                                isEditing
                                    ? "border-primarycolor bg-primarycolor/5 shadow-lg"
                                    : "border-primarycolor/5 bg-slate-50/50 hover:bg-white hover:border-primarycolor/20 hover:shadow-xl"
                            )}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                                        <Icon className="size-4" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor/70">{label}</p>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => onStartEdit(field, value ?? '')}
                                        className="size-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primarycolor/10 flex items-center justify-center text-primarycolor/40 hover:text-primarycolor transition-all"
                                    >
                                        <Edit2 className="size-3" />
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ETB</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={editValue}
                                            onChange={(e) => onValueChange(e.target.value)}
                                            className="h-10 pl-10 pr-3 rounded-xl border-2 font-bold text-sm"
                                            autoFocus
                                        />
                                    </div>
                                    <Button size="icon" className="size-10 rounded-xl bg-emerald-500 shrink-0" onClick={() => onSaveEdit(field)} disabled={isUpdating}>
                                        <Check className="size-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="size-10 rounded-xl shrink-0" onClick={onCancelEdit}>
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-primarycolor tracking-tight">
                                        {Number(value || 0).toLocaleString()}
                                    </span>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">ETB</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {book.bookedition && book.bookedition.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200">
                    <div className="flex items-start gap-3">
                        <Layers className="size-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-800/70">Edition-Level Costs</p>
                            <p className="text-sm font-bold text-amber-800/60 mt-1">
                                This book has {book.bookedition.length} edition{book.bookedition.length > 1 ? 's' : ''}. 
                                Each edition can have its own cost breakdown in the <span className="text-amber-900 underline">Editions</span> tab.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
