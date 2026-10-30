"use client";

import React, { useState } from 'react';
import {
    updateTranslationProject,
    deleteTranslationProject
} from '@/app/actions/translation-project-actions';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
    ChevronLeft,
    PenTool,
    Clock,
    User,
    BookOpen,
    Calendar,
    Check,
    X,
    Trash2,
    AlertTriangle,
    ArrowRight,
    ShieldAlert,
    Edit2,
    Activity,
    Banknote,
    Layers
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { DateInput } from '../../../../../components/ui/date-input';
import TranslatorMultiSelect from '../../../../../components/form_components/TranslatorMultiSelect';
import BookEditionPicker from '../../../../../components/form_components/BookEditionPicker';
import { cn } from '../../../../../lib/utils';
import { format } from 'date-fns';
import { useCalendar } from '@/lib/calendar-context';

interface ProjectDetailsClientProps {
    initialProject: any;
    books: any[];
    translators: any[];
}

export default function ProjectDetailsClient({
    initialProject,
    books,
    translators
}: ProjectDetailsClientProps) {
    const [project, setProject] = useState(initialProject);
    const { formatLong } = useCalendar();
    const [isEditing, setIsEditing] = useState(false);

    // The relation is authoritative; fall back to the legacy single column for
    // projects created before multiple translators were supported.
    const getTranslatorIds = (source: any): number[] => {
        const fromRelation = (source.translator ?? []).map((t: any) => t.id).filter(Boolean);
        if (fromRelation.length > 0) return fromRelation;
        return source.translator_id ? [source.translator_id] : [];
    };

    // `translatorbook.edition` holds the bookedition id as a string.
    const toEditionId = (edition: unknown): number | undefined => {
        const numeric = Number(edition);
        return Number.isInteger(numeric) && numeric > 0 ? numeric : undefined;
    };

    const [editData, setEditData] = useState({
        bookId: project.bookId,
        edition_id: toEditionId(project.edition),
        translator_ids: getTranslatorIds(project),
        Status: project.Status,
        cost: project.cost ?? null,
        payment_status: project.payment_status || "PENDING",
        currently_paid: project.currently_paid ?? 0,
        info: project.info ?? "",
        startDate: project.startDate ? format(new Date(project.startDate), "yyyy-MM-dd") : "",
        endDate: project.endDate ? format(new Date(project.endDate), "yyyy-MM-dd") : "",
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const dashboardRoot = pathname.split('/').slice(0, 2).join('/');

    const projectEditions: { id: number; edition_name: string }[] =
        books.find((b: any) => b.id === project.bookId)?.bookedition ?? [];
    const currentEdition = projectEditions.find((e) => e.id === toEditionId(project.edition));
    const editionLabel =
        currentEdition?.edition_name ||
        (project.edition ? `Edition #${project.edition}` : "No edition");

    const projectTranslators: { id: number; name: string | null }[] =
        (project.translator ?? []).length > 0
            ? project.translator
            : translators.filter((t) => t.id === project.translator_id);

    const handleUpdate = async () => {
        if (!editData.edition_id) {
            toast.error("Select an edition for this book");
            return;
        }
        setIsUpdating(true);
        try {
            const response = await updateTranslationProject(project.id, editData);
            if (response.success) {
                toast.success("Project updated successfully!");
                const nextTranslators = (editData.translator_ids ?? [])
                    .map((id: number) => translators.find(t => t.id === id))
                    .filter(Boolean);
                setProject({
                    ...project,
                    ...response.data,
                    books: books.find(b => b.id === editData.bookId) || project.books,
                    translator: nextTranslators
                });
                setIsEditing(false);
                router.refresh();
            } else {
                toast.error(response.error || "Failed to update project");
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
            const response = await deleteTranslationProject(project.id);
            if (response.success) {
                toast.success("Project deleted successfully");
                router.push(`${dashboardRoot}/production/translation_work`);
                router.refresh();
            } else {
                toast.error(response.error || "Failed to delete project");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Superior Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5">
                    <div className="flex items-center gap-6">
                        <div className="size-20 rounded-3xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20">
                            <PenTool className="size-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                                    <Link href={`${dashboardRoot}/production/translation_work`} className="flex items-center gap-1">
                                        <ChevronLeft className="size-3" /> Pipeline
                                    </Link>
                                </Button>
                                <div className="size-1 rounded-full bg-primarycolor/20" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/60">Project ID: #{project.id}</span>
                            </div>
                            <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter leading-none">Project <span className="text-secondarycolor">Details</span></h1>
                            <p className="text-muted-foreground font-bold tracking-tight mt-1 flex items-center gap-2">
                                Managing translation for <span className="text-primarycolor italic">"{project.books.title}"</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-2 shadow-xl shadow-primarycolor/20 transition-all"
                            >
                                <Edit2 className="size-4" /> Edit Project
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-xl shadow-rose-500/20 transition-all"
                        >
                            <Trash2 className="size-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Core Project Card */}
                        <div className="bg-white rounded-[2.5rem] p-10 border-2 border-primarycolor/10 shadow-2xl space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-2xl bg-secondarycolor/5 flex items-center justify-center text-secondarycolor border-2 border-secondarycolor/10">
                                    <Activity className="size-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-primarycolor uppercase tracking-tight">Assignment <span className="text-secondarycolor">Specs</span></h2>
                                    <p className="text-muted-foreground font-bold">Comprehensive project attributes and status tracking.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Book + Edition Selector */}
                                {isEditing ? (
                                    <div className="md:col-span-2">
                                        <BookEditionPicker
                                            books={books}
                                            bookId={editData.bookId}
                                            editionId={editData.edition_id}
                                            onChange={({ bookId, editionId }) =>
                                                setEditData({ ...editData, bookId: bookId ?? editData.bookId, edition_id: editionId })
                                            }
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Title</label>
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent">
                                                <BookOpen className="size-5 text-primarycolor" />
                                                <span className="font-black text-secondarycolor">{project.books.title}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Edition</label>
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent">
                                                <Layers className="size-5 text-primarycolor" />
                                                <span className="font-black text-secondarycolor">{editionLabel}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Translator Selector (multiple) */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Translators</label>
                                    {isEditing ? (
                                        <TranslatorMultiSelect
                                            translators={translators}
                                            value={editData.translator_ids}
                                            onChange={(ids) => setEditData({ ...editData, translator_ids: ids })}
                                            placeholder="Choose one or more translators..."
                                        />
                                    ) : (
                                        <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent min-h-[56px]">
                                            {projectTranslators.length > 0 ? (
                                                projectTranslators.map((translator, index) => (
                                                    <span
                                                        key={translator.id}
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-primarycolor/15 px-3 py-1 text-xs font-black text-secondarycolor"
                                                    >
                                                        <User className="size-3 text-primarycolor" />
                                                        {translator.name || "Unknown"}
                                                        {index === 0 && projectTranslators.length > 1 && (
                                                            <span className="text-[9px] uppercase tracking-widest text-primarycolor/60">Lead</span>
                                                        )}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="font-black text-secondarycolor">Not assigned</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status Selector */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Production Phase</label>
                                    {isEditing ? (
                                        <select
                                            value={editData.Status}
                                            onChange={(e) => setEditData({ ...editData, Status: e.target.value })}
                                            className="w-full h-14 px-6 bg-primarycolor/5 border-2 border-primarycolor/10 rounded-2xl font-black outline-none focus:border-primarycolor transition-all"
                                        >
                                            <option value="NOT_STARTED">Not Started</option>
                                            <option value="STARTED">Started</option>
                                            <option value="ONPROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent">
                                            <Clock className="size-5 text-primarycolor" />
                                            <span className="font-black text-secondarycolor uppercase tracking-widest text-xs">{project.Status.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Cost */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cost (ETB)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={editData.cost ?? ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setEditData({ ...editData, cost: val === "" ? null : Number(val) });
                                            }}
                                            className="w-full h-14 px-6 bg-primarycolor/5 border-2 border-primarycolor/10 rounded-2xl font-black outline-none focus:border-primarycolor transition-all"
                                            placeholder="0.00"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent">
                                            <Banknote className="size-5 text-primarycolor" />
                                            <span className="font-black text-secondarycolor">{project.cost ? `${project.cost.toLocaleString()} ETB` : "—"}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Status */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Status</label>
                                    {isEditing ? (
                                        <select
                                            value={editData.payment_status}
                                            onChange={(e) => setEditData({ ...editData, payment_status: e.target.value })}
                                            className="w-full h-14 px-6 bg-primarycolor/5 border-2 border-primarycolor/10 rounded-2xl font-black outline-none focus:border-primarycolor transition-all"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="CURRENTLY_PAID">Currently Paid</option>
                                            <option value="SUCCEEDED">Succeeded</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent">
                                            <Clock className="size-5 text-primarycolor" />
                                            <span className="font-black text-secondarycolor uppercase tracking-widest text-xs">{project.payment_status?.replace('_', ' ') || "PENDING"}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Currently Paid */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount Paid (ETB)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={editData.currently_paid ?? ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setEditData({ ...editData, currently_paid: val === "" ? 0 : Number(val) });
                                            }}
                                            className="w-full h-14 px-6 bg-primarycolor/5 border-2 border-primarycolor/10 rounded-2xl font-black outline-none focus:border-primarycolor transition-all"
                                            placeholder="0.00"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent">
                                            <Banknote className="size-5 text-primarycolor" />
                                            <span className="font-black text-secondarycolor">{project.currently_paid ? `${project.currently_paid.toLocaleString()} ETB` : "0 ETB"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Translation memo */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Translation Memo</label>
                                {isEditing ? (
                                    <textarea
                                        value={editData.info}
                                        onChange={(e) => setEditData({ ...editData, info: e.target.value })}
                                        rows={4}
                                        placeholder="Notes about this translation work — scope, references, expectations..."
                                        className="w-full px-6 py-4 bg-primarycolor/5 border-2 border-primarycolor/10 rounded-2xl font-bold outline-none focus:border-primarycolor transition-all resize-y min-h-[120px]"
                                    />
                                ) : (
                                    <div className="p-4 rounded-2xl bg-primarycolor/5 border-2 border-transparent whitespace-pre-wrap font-bold text-sm text-secondarycolor min-h-[56px]">
                                        {project.info || "No memo yet."}
                                    </div>
                                )}
                            </div>

                            <div className="pt-10 border-t-2 border-primarycolor/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Initiation</label>
                                    {isEditing ? (
                                        <DateInput
                                            value={editData.startDate}
                                            onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                                            className="h-14 px-6 bg-primarycolor/5 border-2 border-primarycolor/10 rounded-2xl font-black"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondarycolor/5 border-2 border-transparent">
                                            <Calendar className="size-5 text-secondarycolor" />
                                            <span className="font-black text-secondarycolor">{project.startDate ? formatLong(new Date(project.startDate)) : "Not Set"}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Deadline</label>
                                    {isEditing ? (
                                        <DateInput
                                            value={editData.endDate}
                                            onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                                            className="h-14 px-6 bg-primarycolor/5 border-2 border-primarycolor/10 rounded-2xl font-black"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondarycolor/5 border-2 border-transparent">
                                            <Calendar className="size-5 text-secondarycolor" />
                                            <span className="font-black text-secondarycolor">{project.endDate ? formatLong(new Date(project.endDate)) : "Not Set"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-10 flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                    <Button
                                        onClick={handleUpdate}
                                        disabled={isUpdating}
                                        className="flex-1 h-16 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20"
                                    >
                                        {isUpdating ? "Processing..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Visual */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-primarycolor/10 shadow-xl space-y-6">
                            <div className="aspect-[3/4.5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                {project.books.book_image_url ? (
                                    <img src={project.books.book_image_url} alt={project.books.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-black text-4xl">
                                        {project.books.title[0]}
                                    </div>
                                )}
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="font-black text-primarycolor uppercase tracking-tight line-clamp-1">{project.books.title}</h4>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Global Production Asset</p>
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
                                    <p className="text-muted-foreground font-bold">This will permanently remove this assignment.</p>
                                </div>
                            </div>

                            <div className="p-6 bg-rose-500/5 rounded-2xl border-2 border-rose-500/10 space-y-4">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-1" />
                                    <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                                        You are about to delete the translation project for <span className="text-rose-600 font-black">"{project.books?.title}"</span>. This cannot be undone.
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
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest"
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
