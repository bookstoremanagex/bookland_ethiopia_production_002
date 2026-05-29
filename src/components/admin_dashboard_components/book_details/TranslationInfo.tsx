"use client";

import Link from 'next/link';
import { 
  Globe, 
  Clock, 
  Check, 
  X,
  Edit2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import { useCalendar } from "@/lib/calendar-context";

interface TranslationInfoProps {
  book: any;
  editingField: string | null;
  editValue: any;
  isUpdating: boolean;
  onStartEdit: (field: string, value: any) => void;
  onCancelEdit: () => void;
  onUpdateStatus: (projectId: number, newStatus: string) => void;
  onValueChange: (value: any) => void;
}

export default function TranslationInfo({ 
  book, 
  editingField, 
  editValue, 
  isUpdating,
  onStartEdit,
  onCancelEdit,
  onUpdateStatus,
  onValueChange
}: TranslationInfoProps) {
  const { formatDate } = useCalendar();
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-10 border-2 border-primarycolor/10 shadow-2xl space-y-6 md:space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                    <div className="size-14 md:size-20 rounded-2xl md:rounded-[2rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shrink-0">
                        <Globe className="size-7 md:size-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black text-primarycolor uppercase tracking-tight">Translation <span className="text-secondarycolor">Projects</span></h2>
                        <p className="text-muted-foreground font-bold tracking-tight text-xs md:text-base">Monitor and update the translation status for this title.</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <div className="px-4 md:px-6 py-2 md:py-3 bg-primarycolor/10 text-primarycolor rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest border-2 border-primarycolor/20 shadow-lg shadow-primarycolor/5">
                        {book.translators?.length || 0} Assignments
                    </div>
                    <Button asChild className="h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl bg-secondarycolor hover:bg-primarycolor font-black uppercase tracking-widest text-[10px] md:text-xs gap-2 shadow-xl shadow-secondarycolor/20 transition-all flex-1 sm:flex-none">
                        <Link href={`/admin_dashboard/production/translation_work/new?bookId=${book.unique_identification_code}`}>
                            <Plus className="size-4" /> Add Assignment
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block overflow-hidden rounded-3xl border-2 border-primarycolor/10 shadow-sm">
                <table className="w-full text-left border-collapse">
                <thead className="bg-primarycolor/5">
                    <tr>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Lead Translator</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Current Phase</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Production Timeline</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-primarycolor/5">
                    {book.translators && book.translators.length > 0 ? (
                    book.translators.map((assignment: any) => {
                        const isEditing = editingField === `trans-status-${assignment.id}`;
                        return (
                        <tr key={assignment.id} className="group/row hover:bg-primarycolor/[0.02] transition-colors">
                            <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor font-black text-lg border-2 border-secondarycolor/20">
                                {assignment.translator?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Link 
                                            href={`/admin_dashboard/production/translators/${assignment.translator?.id}`}
                                            className="font-black text-secondarycolor text-lg hover:text-primarycolor hover:underline transition-all flex items-center gap-2"
                                        >
                                            {assignment.translator?.name || "Unknown"}
                                            <ExternalLink className="size-3 opacity-0 group-hover/row:opacity-50" />
                                        </Link>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{assignment.translator?.email || "No contact info"}</div>
                                </div>
                            </div>
                            </td>
                            <td className="p-6">
                            {isEditing ? (
                                <div className="flex items-center gap-3">
                                <select
                                    value={editValue ?? ''}
                                    onChange={(e) => onValueChange(e.target.value)}
                                    className="h-12 rounded-xl border-2 border-primarycolor/20 bg-background px-4 text-sm font-black outline-none focus:border-primarycolor transition-all"
                                    autoFocus
                                >
                                    <option value="NOT_STARTED">Not Started</option>
                                    <option value="STARTED">Started</option>
                                    <option value="ONPROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" className="h-12 w-12 bg-emerald-500 hover:bg-emerald-600 rounded-xl" onClick={() => onUpdateStatus(assignment.id, editValue)}>
                                        <Check className="size-6" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-12 w-12 border-2 rounded-xl" onClick={onCancelEdit}>
                                        <X className="size-6 text-rose-500" />
                                    </Button>
                                </div>
                                </div>
                            ) : (
                                <div 
                                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 bg-primarycolor/5 border-primarycolor/10 text-primarycolor cursor-pointer group/status-edit hover:bg-primarycolor/10 hover:border-primarycolor/20 transition-all shadow-md shadow-primarycolor/5"
                                    onClick={() => onStartEdit(`trans-status-${assignment.id}`, assignment.Status)}
                                >
                                    <Clock className="size-4" />
                                    {assignment.Status.replace('_', ' ')}
                                    <Edit2 className="size-3 opacity-0 group-hover/status-edit:opacity-100 transition-opacity" />
                                </div>
                            )}
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex flex-col gap-1">
                                    <div className="text-xs font-black text-secondarycolor uppercase tracking-widest flex items-center justify-end gap-2">
                                        <span className="text-muted-foreground opacity-50">Starts:</span>
                                        {assignment.startDate ? formatDate(new Date(assignment.startDate)) : "TBD"}
                                    </div>
                                    <div className="text-xs font-black text-primarycolor uppercase tracking-widest flex items-center justify-end gap-2">
                                        <span className="text-muted-foreground opacity-50">Ends:</span>
                                        {assignment.endDate ? formatDate(new Date(assignment.endDate)) : "TBD"}
                                    </div>
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <Button asChild variant="outline" className="h-12 border-2 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primarycolor hover:text-white transition-all">
                                    <Link href={`/admin_dashboard/production/translation_work/${assignment.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </td>
                        </tr>
                        )
                    })
                    ) : (
                    <tr>
                        <td colSpan={4} className="p-16 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <Globe className="size-16 text-muted-foreground/20" />
                                <p className="text-muted-foreground font-black uppercase tracking-widest text-sm">No translation assignments found for this title.</p>
                                <Button asChild variant="outline" className="border-2 rounded-xl font-black uppercase tracking-widest px-8">
                                    <Link href={`/admin_dashboard/production/translation_work/new?bookId=${book.unique_identification_code}`}>
                                        Assign Translator
                                    </Link>
                                </Button>
                            </div>
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>

            {/* Mobile Card View (Hidden on desktop) */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {book.translators && book.translators.length > 0 ? (
                    book.translators.map((assignment: any) => {
                        const isEditing = editingField === `trans-status-${assignment.id}`;
                        return (
                            <div key={assignment.id} className="p-5 rounded-2xl border-2 border-primarycolor/5 bg-primarycolor/[0.01] space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor font-black text-base border border-secondarycolor/20">
                                            {assignment.translator?.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <Link 
                                                href={`/admin_dashboard/production/translators/${assignment.translator?.id}`}
                                                className="font-black text-secondarycolor text-base hover:text-primarycolor hover:underline transition-all block"
                                            >
                                                {assignment.translator?.name || "Unknown"}
                                            </Link>
                                            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest truncate max-w-[150px]">{assignment.translator?.email || "No contact info"}</div>
                                        </div>
                                    </div>
                                    <Button asChild size="icon" variant="ghost" className="size-10 rounded-xl bg-primarycolor/5">
                                        <Link href={`/admin_dashboard/production/translation_work/${assignment.id}`}>
                                            <ExternalLink className="size-4" />
                                        </Link>
                                    </Button>
                                </div>

                                <div className="pt-3 border-t border-primarycolor/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Current Status</span>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={editValue ?? ''}
                                                    onChange={(e) => onValueChange(e.target.value)}
                                                    className="h-9 rounded-lg border-2 border-primarycolor/10 bg-white px-2 text-[10px] font-black outline-none focus:border-primarycolor"
                                                >
                                                    <option value="NOT_STARTED">Not Started</option>
                                                    <option value="STARTED">Started</option>
                                                    <option value="ONPROGRESS">In Progress</option>
                                                    <option value="COMPLETED">Completed</option>
                                                </select>
                                                <Button size="icon" className="size-8 bg-emerald-500 rounded-lg shrink-0" onClick={() => onUpdateStatus(assignment.id, editValue)}>
                                                    <Check className="size-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="size-8 rounded-lg shrink-0" onClick={onCancelEdit}>
                                                    <X className="size-4 text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div 
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-white shadow-sm cursor-pointer"
                                                onClick={() => onStartEdit(`trans-status-${assignment.id}`, assignment.Status)}
                                            >
                                                <Clock className="size-3" />
                                                {assignment.Status.replace('_', ' ')}
                                                <Edit2 className="size-2.5 opacity-40 ml-1" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <div className="flex flex-col p-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10">
                                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 opacity-60">Start Date</span>
                                            <span className="font-bold text-primarycolor text-[10px]">{assignment.startDate ? formatDate(new Date(assignment.startDate), "MMM dd") : "TBD"}</span>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-xl bg-primarycolor/5 border border-primarycolor/10">
                                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 opacity-60">End Date</span>
                                            <span className="font-bold text-primarycolor text-[10px]">{assignment.endDate ? formatDate(new Date(assignment.endDate), "MMM dd") : "TBD"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="py-12 text-center opacity-30">
                        <Globe className="size-12 mx-auto text-primarycolor mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs text-primarycolor">No Assignments</p>
                    </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="p-6 md:p-8 bg-card rounded-2xl md:rounded-3xl border-2 border-primarycolor/10 shadow-lg space-y-3 md:space-y-4">
                <h4 className="text-[10px] md:text-sm font-black text-primarycolor uppercase tracking-widest flex items-center gap-2">
                    <Clock className="size-3 md:size-4" />
                    Project Timeline
                </h4>
                <p className="text-muted-foreground font-medium text-xs md:text-base leading-relaxed">
                    Translation projects are tracked based on the assigned translator's progress. Ensure statuses are updated at the end of each sprint for accurate production reporting.
                </p>
            </div>
            <div className="p-6 md:p-8 bg-secondarycolor/5 rounded-2xl md:rounded-3xl border-2 border-secondarycolor/10 shadow-lg space-y-3 md:space-y-4">
                <h4 className="text-[10px] md:text-sm font-black text-secondarycolor uppercase tracking-widest flex items-center gap-2">
                    <Globe className="size-3 md:size-4" />
                    Global Reach
                </h4>
                <p className="text-muted-foreground font-medium text-xs md:text-base leading-relaxed">
                    By managing multiple translations simultaneously, you increase the global footprint of this title. Use the 'New Assignment' tool to add more languages.
                </p>
            </div>
        </div>
    </div>
  );
}
