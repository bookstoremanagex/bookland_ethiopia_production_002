"use client";

import React from 'react';
import { 
  BookOpen, 
  User, 
  Globe, 
  Calendar, 
  Layers, 
  Hash, 
  Info,
  Activity,
  Check,
  X,
  Edit2,
  Copyright
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';

interface BasicInfoProps {
  book: any;
  editingField: string | null;
  editValue: any;
  isUpdating: boolean;
  onStartEdit: (field: string, value: any) => void;
  onCancelEdit: () => void;
  onSaveEdit: (field: string) => void;
  onValueChange: (value: any) => void;
}

export default function BasicInfo({ 
  book, 
  editingField, 
  editValue, 
  isUpdating,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onValueChange
}: BasicInfoProps) {

  const renderEditableField = (field: string, label: string, icon: React.ElementType, type: 'text' | 'number' | 'select' | 'textarea' = 'text', options?: { label: string, value: string }[]) => {
    const isEditing = editingField === field;
    const value = book[field];

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group relative p-3 sm:p-4 rounded-xl hover:bg-primarycolor/5 transition-all border border-transparent hover:border-primarycolor/10">
        <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-lg bg-primarycolor/5 text-primarycolor shrink-0">
                {React.createElement(icon, { className: "size-4 sm:size-5" })}
            </div>
            <span className="sm:hidden text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        </div>
        <div className="flex flex-col flex-1">
          <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</span>
          {isEditing ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {type === 'select' ? (
                <select
                  value={editValue ?? ''}
                  onChange={(e) => onValueChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border-2 border-primarycolor/20 bg-background px-3 py-1 text-sm font-bold outline-none focus:border-primarycolor"
                >
                  {options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : type === 'textarea' ? (
                <textarea
                  value={editValue ?? ''}
                  onChange={(e) => onValueChange(e.target.value)}
                  className="flex min-h-[80px] sm:min-h-[100px] w-full rounded-md border-2 border-primarycolor/20 bg-background px-3 py-2 text-sm font-bold outline-none focus:border-primarycolor"
                />
              ) : (
                <Input
                  type={type}
                  value={editValue ?? ''}
                  onChange={(e) => onValueChange(type === 'number' ? Number(e.target.value) : e.target.value)}
                  className="h-10 font-bold border-2 border-primarycolor/20 focus:border-primarycolor"
                  autoFocus
                />
              )}
              <div className="flex items-center gap-1 justify-end">
                <Button size="icon" variant="ghost" className="h-10 w-10 text-emerald-600 hover:bg-emerald-50 bg-emerald-50/50 sm:bg-transparent" onClick={() => onSaveEdit(field)} disabled={isUpdating}>
                  {isUpdating ? <Activity className="size-5 animate-spin" /> : <Check className="size-5" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10 text-rose-600 hover:bg-rose-50 bg-rose-50/50 sm:bg-transparent" onClick={onCancelEdit} disabled={isUpdating}>
                  <X className="size-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="font-black text-secondarycolor text-base sm:text-lg flex items-center gap-2 cursor-pointer group/value"
              onClick={() => onStartEdit(field, value)}
            >
              <span className="truncate">{field === 'productionstatus' ? value?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase()) : (value || "N/A")}</span>
              <div className="opacity-40 sm:opacity-0 sm:group-hover/value:opacity-100 transition-opacity bg-primarycolor/10 p-1 rounded-md">
                <Edit2 className="size-3 text-primarycolor" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 max-w-full overflow-x-hidden">
      {/* Mobile Side-by-Side Header / Desktop Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Image & Basic Title Info (Mobile Side-by-Side) */}
        <div className="lg:col-span-5 xl:col-span-4 w-full">
            <div className="flex flex-row lg:flex-col gap-4 md:gap-0">
                {/* Image Section */}
                <div className="w-[120px] sm:w-[160px] lg:w-full shrink-0">
                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-1 md:-inset-2 bg-linear-to-br from-primarycolor to-secondarycolor rounded-[1.2rem] md:rounded-[3rem] blur-lg md:blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative aspect-[3/4.2] md:aspect-[3/4.5] rounded-[1rem] md:rounded-[2.5rem] overflow-hidden bg-card border-2 md:border-4 border-white shadow-xl md:shadow-2xl transform-gpu transition-transform duration-700 md:group-hover:rotate-y-6">
                            {book.book_image_url ? (
                                <img 
                                    src={book.book_image_url} 
                                    alt={book.title} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-emerald-600 flex flex-col items-center justify-center p-4 md:p-12 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/linen.png')]" />
                                    <BookOpen className="size-6 md:size-12 text-white/40" />
                                </div>
                            )}
                            
                            {/* Edit Triggers */}
                            <div 
                                className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                                onClick={() => onStartEdit('book_image_url', book.book_image_url || '')}
                            >
                                <div className="bg-white/20 backdrop-blur-xl px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-2xl border border-white/30 text-white font-black uppercase tracking-widest text-[8px] md:text-sm shadow-2xl scale-90 md:group-hover:scale-100 transition-transform">
                                    Edit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Title Info (Only visible on mobile/tablet) */}
                <div className="flex-1 lg:hidden space-y-2 py-1">
                    <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-primarycolor/60 uppercase tracking-[0.2em]">Book Title</h4>
                        <h1 className="text-lg font-black text-primarycolor leading-tight line-clamp-3">{book.title}</h1>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-primarycolor/60 uppercase tracking-[0.2em]">Author</h4>
                        <p className="text-sm font-bold text-secondarycolor">{book.author}</p>
                    </div>
                    {book.pen_name && (
                      <div className="space-y-1">
                          <h4 className="text-[10px] font-black text-primarycolor/60 uppercase tracking-[0.2em]">Pen Name</h4>
                          <p className="text-sm font-bold text-secondarycolor italic">{book.pen_name}</p>
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primarycolor/10 border border-primarycolor/20 text-[9px] font-black text-primarycolor uppercase tracking-widest mt-2">
                        <Layers className="size-3" /> Edition {book.edition}
                    </div>
                </div>
            </div>
        </div>

        {/* Info Content Section */}
        <div className="lg:col-span-7 xl:col-span-8 w-full space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border-2 border-primarycolor/5 shadow-xl space-y-4 md:space-y-6">
                    <h3 className="text-sm md:text-lg font-black text-primarycolor uppercase tracking-widest flex items-center gap-3">
                        <div className="size-8 md:size-10 rounded-lg md:rounded-xl bg-primarycolor/10 flex items-center justify-center">
                            <Info className="size-4 md:size-5" />
                        </div>
                        Identity & Specs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1 md:gap-4">
                        <div className="hidden lg:block">{renderEditableField('title', 'Book Title', BookOpen)}</div>
                        <div className="hidden lg:block">{renderEditableField('author', 'Lead Author', User)}</div>
                        {renderEditableField('pen_name', 'Pen Name', User)}
                        {renderEditableField('language', 'Language', Globe)}
                        {renderEditableField('category', 'Book Category', Layers)}
                        {renderEditableField('publication_year', 'Year', Calendar)}
                        <div className="hidden lg:block">{renderEditableField('edition', 'Edition', Layers)}</div>
                        {renderEditableField('isbn', 'ISBN Code', Hash)}
                        {renderEditableField('copyright_registration_number', 'Copyright Reg. No', Copyright)}
                        {renderEditableField('number_of_pages', 'Pages', BookOpen, 'number')}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border-2 border-primarycolor/5 shadow-xl space-y-4 md:space-y-6">
                <h3 className="text-sm md:text-lg font-black text-primarycolor uppercase tracking-widest flex items-center gap-3">
                    <div className="size-8 md:size-10 rounded-lg md:rounded-xl bg-primarycolor/10 flex items-center justify-center">
                        <Info className="size-4 md:size-5" />
                    </div>
                    Narrative Summary
                </h3>
                <div className="relative group/desc">
                    {editingField === 'info' ? (
                        <div className="space-y-4">
                            <textarea
                                value={editValue}
                                onChange={(e) => onValueChange(e.target.value)}
                                className="w-full min-h-[150px] md:min-h-[200px] p-4 md:p-8 rounded-2xl border-2 border-primarycolor/20 bg-background font-bold text-sm md:text-lg outline-none focus:border-primarycolor transition-all"
                            />
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <Button className="h-12 md:h-14 bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest rounded-xl md:rounded-2xl text-[10px] md:text-base" onClick={() => onSaveEdit('info')}>Save Changes</Button>
                                <Button variant="outline" className="h-12 md:h-14 border-2 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-base" onClick={onCancelEdit}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <p 
                            className="text-muted-foreground font-bold text-sm md:text-lg leading-relaxed cursor-pointer hover:text-secondarycolor transition-colors whitespace-pre-wrap px-1 md:px-2"
                            onClick={() => onStartEdit('info', book.info)}
                        >
                            {book.info || "Provide a detailed synopsis for this title to help your team understand its context."}
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
