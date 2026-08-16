"use client";

import React from 'react';
import { 
  PenTool,
  Printer,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';

interface DesignInfoProps {
  book: any;
  editingField: string | null;
  editValue: any;
  isUpdating: boolean;
  onStartEdit: (field: string, value: any) => void;
  onCancelEdit: () => void;
  onSaveEdit: (field: string) => void;
  onValueChange: (value: any) => void;
}

export default function DesignInfo({ 
  book, 
  editingField, 
  editValue, 
  isUpdating,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onValueChange
}: DesignInfoProps) {

  const renderEditableField = (field: string, label: string, icon: React.ElementType) => {
    const isEditing = editingField === field;
    const value = book[field];

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 group relative p-4 md:p-6 rounded-2xl hover:bg-primarycolor/5 transition-all border-2 border-transparent hover:border-primarycolor/10">
        <div className="flex items-center gap-3">
            <div className="p-3 md:p-4 rounded-xl bg-primarycolor/5 text-primarycolor shrink-0">
                {React.createElement(icon, { className: "size-5 md:size-6" })}
            </div>
            <span className="sm:hidden text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
        </div>
        <div className="flex flex-col flex-1">
          <span className="hidden sm:block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">{label}</span>
          {isEditing ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1">
              <Input
                value={editValue ?? ''}
                onChange={(e) => onValueChange(e.target.value)}
                className="h-10 md:h-12 font-black text-lg md:text-xl border-2 border-primarycolor/20 focus:border-primarycolor rounded-xl"
                autoFocus
              />
              <div className="flex items-center gap-2 justify-end">
                <Button size="icon" className="h-10 md:h-12 w-10 md:w-12 bg-emerald-500 hover:bg-emerald-600 rounded-xl shrink-0" onClick={() => onSaveEdit(field)} disabled={isUpdating}>
                  <Check className="size-5 md:size-6" />
                </Button>
                <Button size="icon" variant="outline" className="h-10 md:h-12 w-10 md:w-12 border-2 rounded-xl shrink-0" onClick={onCancelEdit} disabled={isUpdating}>
                  <X className="size-5 md:size-6 text-rose-500" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="font-black text-secondarycolor text-xl md:text-2xl flex items-center gap-3 cursor-pointer group/value"
              onClick={() => onStartEdit(field, value)}
            >
              <span className="truncate">{value || "Not Assigned"}</span>
              <Edit2 className="size-4 md:size-5 opacity-40 sm:opacity-0 sm:group-hover/value:opacity-100 transition-opacity text-primarycolor" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-10 border-2 border-primarycolor/10 shadow-2xl space-y-6 md:space-y-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="size-14 md:size-20 rounded-2xl md:rounded-[2rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shrink-0">
                    <PenTool className="size-7 md:size-10" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-4xl font-black text-primarycolor uppercase tracking-tight">Design & <span className="text-secondarycolor">Identity</span></h2>
                    <p className="text-muted-foreground font-bold tracking-tight text-xs md:text-base">Manage visual aesthetics and identification batch IDs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {renderEditableField('designer', 'Lead Designer', PenTool)}
                {renderEditableField('print_batch_id', 'Print Batch ID', Printer)}
                {renderEditableField('book_sku', 'System SKU', Edit2)}
            </div>
        </div>

        <div className="p-6 md:p-10 bg-secondarycolor/5 rounded-2xl md:rounded-3xl border-2 border-secondarycolor/10 space-y-3 md:space-y-4">
            <h4 className="text-[10px] md:text-sm font-black text-secondarycolor uppercase tracking-widest flex items-center gap-2">
                <Printer className="size-3 md:size-4" />
                Production Status
            </h4>
            <p className="text-muted-foreground font-medium text-xs md:text-base leading-relaxed">
                The design identity of a book is tied to its batch ID and SKU. Ensure these values match your physical inventory tracking for accurate warehouse management.
            </p>
        </div>
    </div>
  );
}
