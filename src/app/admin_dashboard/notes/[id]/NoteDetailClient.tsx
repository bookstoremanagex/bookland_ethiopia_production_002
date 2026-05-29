"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Save, Trash2, Edit3, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateNote, deleteNote } from "../../../actions/notes-actions";
import { toast } from "sonner";
import { useCalendar } from "@/lib/calendar-context";

interface NoteDetailClientProps {
  note: {
    id: number;
    title: string | null;
    note_content: string;
    accountId: number;
    createdAt: string;
    updatedAt: string;
    accounts: {
      name: string;
      account_email: string;
      account_type: string;
    };
  };
}

export function NoteDetailClient({ note }: NoteDetailClientProps) {
  const router = useRouter();
  const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
  
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.note_content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Note content cannot be empty.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateNote(note.id, title.trim() || "Untitled Note", content.trim());
      if (res.success) {
        toast.success("Note updated successfully");
        router.push("/admin_dashboard/notes");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update note");
      }
    } catch (err) {
      toast.error("An error occurred while updating the note");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteNote(note.id);
      if (res.success) {
        toast.success("Note deleted successfully");
        setIsDeleteDialogOpen(false);
        router.push("/admin_dashboard/notes");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete note");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back Navigation Header */}
      <div className="flex items-center justify-between border-b-2 border-primarycolor/5 pb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin_dashboard/notes")}
          className="group text-sm font-black uppercase tracking-widest text-primarycolor hover:bg-primarycolor/5 rounded-2xl px-5 py-3 md:py-6 gap-2"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Notes
        </Button>

        <span className="text-[10px] font-black text-secondarycolor/50 uppercase tracking-[0.2em]">
          Note Management ID: #{note.id}
        </span>
      </div>

      {/* Main Form Container */}
      <div className="bg-card rounded-[2.5rem] border-2 border-primarycolor/5 p-5 md:p-12 shadow-2xl hover:border-primarycolor/10 transition-all duration-300 space-y-8 bg-white">
        
        {/* Author / Metadata Card */}
        <div className="bg-primarycolor/5 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-full bg-primarycolor flex items-center justify-center text-white text-lg font-black uppercase italic shadow-md">
              {note.accounts.name.substring(0, 2)}
            </div>
            <div>
              <div className="font-black text-secondarycolor leading-snug flex items-center gap-1.5">
                {note.accounts.name}
                <span className="text-[10px] bg-secondarycolor/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-widest text-secondarycolor/80">
                  {note.accounts.account_type}
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-semibold">{note.accounts.account_email}</div>
            </div>
          </div>

          <div className="text-xs font-bold text-secondarycolor/60 tabular-nums space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primarycolor/50" />
              <span>Created: {formatDateTime(new Date(note.createdAt))}</span>
            </div>
            {note.updatedAt !== note.createdAt && (
              <div className="flex items-center gap-2 text-primarycolor">
                <Edit3 className="size-4 text-primarycolor/50" />
                <span>Last Updated: {formatDateTime(new Date(note.updatedAt))}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Note Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondarycolor uppercase tracking-widest block pl-1">
              Note Title
            </label>
            <Input
              type="text"
              placeholder="e.g. Strategic Plan Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 text-lg border-primarycolor/10 focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/5 rounded-2xl font-black text-primarycolor px-5"
            />
          </div>

          {/* Note Content Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondarycolor uppercase tracking-widest block pl-1">
              Note Content *
            </label>
            <textarea
              placeholder="Type detailed note content here..."
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 md:p-6 border-2 border-primarycolor/10 focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/5 outline-none rounded-3xl font-semibold text-sm md:text-base resize-y bg-background/50 transition-all min-h-[160px] md:min-h-[220px] leading-relaxed text-secondarycolor"
            />
          </div>

          {/* Form Actions Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
            {/* Delete Note permanently */}
            <Button
              type="button"
              disabled={isDeleting || isUpdating}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full sm:w-auto h-14 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl font-black transition-all active:scale-95 px-8 flex items-center justify-center gap-2.5 border-2 border-red-100 hover:border-red-200"
            >
              <Trash2 className="size-5" />
              Delete Note Permanently
            </Button>

            {/* Save / Update Button */}
            <Button
              type="submit"
              disabled={isUpdating || isDeleting}
              className="w-full sm:w-auto h-14 bg-primarycolor hover:bg-primarycolor/90 text-white rounded-2xl font-black transition-all active:scale-95 px-10 shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2.5"
            >
              {isUpdating ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Save className="size-5" />
              )}
              Update Note Details
            </Button>
          </div>
        </form>

      </div>

      {/* Delete Confirmation Modal (Radix UI) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl bg-white">
          <DialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="size-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900 text-center uppercase tracking-tight">
              Delete Note Permanently
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500 text-center font-medium leading-relaxed">
              Are you sure you want to permanently delete the note <strong className="text-gray-900">"{title || "Untitled Note"}"</strong>? This action is absolute and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-center w-full">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl font-bold h-12 px-6 w-full sm:w-auto hover:bg-gray-100 border-2 border-gray-100 text-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl font-black h-12 px-6 w-full sm:w-auto shadow-lg shadow-red-500/20 bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Note"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
