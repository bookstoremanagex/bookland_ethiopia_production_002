"use client";

import { useState, useEffect } from "react";
import {
  StickyNote,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Clock,
  Calendar,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNotes, createNote, updateNote, deleteNote } from "@/app/actions/notes-actions";
import { useCalendar } from "@/lib/calendar-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NotesPageClient({ accountId }: { accountId: number }) {
  const { formatDate } = useCalendar();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getNotes(accountId);
      if (res.success) setNotes(res.data || []);
      else toast.error("Failed to load notes");
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.note_content?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const res = await createNote(title.trim(), content.trim(), accountId);
    setSaving(false);
    if (res.success) {
      toast.success("Note created");
      setNotes((prev) => [res.data, ...prev]);
      setSelected(res.data);
      setCreating(false);
      setTitle("");
      setContent("");
    } else {
      toast.error(res.error || "Failed to create note");
    }
  };

  const handleUpdate = async () => {
    if (!selected || !title.trim()) return;
    setSaving(true);
    const res = await updateNote(selected.id, title.trim(), content.trim());
    setSaving(false);
    if (res.success) {
      toast.success("Note updated");
      setNotes((prev) =>
        prev.map((n) => (n.id === selected.id ? { ...n, title: title.trim(), note_content: content.trim() } : n)),
      );
      setSelected((prev: any) => ({ ...prev, title: title.trim(), note_content: content.trim() }));
    } else {
      toast.error(res.error || "Failed to update note");
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    const res = await deleteNote(id);
    setDeleting(null);
    if (res.success) {
      toast.success("Note deleted");
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selected?.id === id) { setSelected(null); setTitle(""); setContent(""); }
    } else {
      toast.error(res.error || "Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 min-h-[60vh]">
        <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center animate-pulse">
          <Loader2 className="size-6 text-primarycolor animate-spin" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading notes...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Notes</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-white border-slate-200 focus:border-primarycolor text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => { setCreating(true); setSelected(null); setTitle(""); setContent(""); }}
            className="h-11 px-5 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primarycolor/20 gap-2"
          >
            <Plus className="size-4" />
            New Note
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Notes List */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center flex-1">
              <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <StickyNote className="size-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">
                {search ? "No notes match your search" : "No notes yet"}
              </p>
              {!search && (
                <Button
                  onClick={() => { setCreating(true); setSelected(null); setTitle(""); setContent(""); }}
                  variant="outline"
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs text-slate-600 gap-1.5"
                >
                  <Plus className="size-3.5" />
                  Create your first note
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
              {filtered.map((note) => (
                <div
                  key={note.id}
                  onClick={() => { setSelected(note); setCreating(false); setTitle(note.title); setContent(note.note_content || ""); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(note); setCreating(false); setTitle(note.title); setContent(note.note_content || ""); } }}
                  className={cn(
                    "w-full text-left p-4 md:p-5 hover:bg-slate-50 transition-colors relative group cursor-pointer",
                    selected?.id === note.id && "bg-primarycolor/[0.04] border-l-2 border-primarycolor",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-bold truncate",
                        selected?.id === note.id ? "text-primarycolor" : "text-slate-700",
                      )}>
                        {note.title || "Untitled"}
                      </p>
                      {note.note_content && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-medium">{note.note_content}</p>
                      )}
                      <p className="text-[9px] font-bold text-slate-300 mt-2 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {note.updatedAt ? formatDate(new Date(note.updatedAt)) : "—"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                      disabled={deleting === note.id}
                      className="size-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      {deleting === note.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                    </button>
                  </div>
                  </div>
                ))}
              </div>
          )}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col">
          {!selected && !creating ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center flex-1">
              <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                <FileText className="size-8 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Select a note or create a new one</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Choose from the list on the left</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                    <FileText className="size-4.5 text-primarycolor" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">
                      {creating ? "New Note" : "Edit Note"}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400">
                      {creating ? "Create a new note" : `Last updated ${selected?.updatedAt ? formatDate(new Date(selected.updatedAt)) : "—"}`}
                    </p>
                  </div>
                </div>
                {!creating && (
                  <button
                    onClick={() => handleDelete(selected.id)}
                    disabled={deleting === selected.id}
                    className="size-9 rounded-xl hover:bg-rose-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
                  >
                    {deleting === selected.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                <Input
                  placeholder="Note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primarycolor text-sm font-bold"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content</label>
                <textarea
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 min-h-[200px] w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-primarycolor focus:ring-2 focus:ring-primarycolor/20 text-sm font-medium text-slate-700 p-4 outline-none resize-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                {creating ? (
                  <Button
                    onClick={handleCreate}
                    disabled={saving || !title.trim()}
                    className="h-11 px-6 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primarycolor/20 gap-2"
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    {saving ? "Creating..." : "Create Note"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpdate}
                    disabled={saving || !title.trim()}
                    className="h-11 px-6 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primarycolor/20 gap-2"
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                )}
                <Button
                  onClick={() => { setSelected(null); setCreating(false); setTitle(""); setContent(""); }}
                  variant="ghost"
                  className="h-11 px-6 rounded-xl font-bold text-xs text-slate-500"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
