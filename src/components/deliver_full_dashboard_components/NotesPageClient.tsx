"use client";

import React, { useState } from "react";
import {
  Search,
  X,
  FileText,
  Plus,
  Trash2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNote, deleteNote, updateNote } from "@/app/actions/notes-actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/lib/calendar-context";

type Note = {
  id: number;
  title: string;
  note_content: string;
  createdAt: string;
  updatedAt: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
      delay: i * 0.04,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    x: 100,
    transition: { duration: 0.2 },
  },
};

function SwipeableNoteCard({
  note,
  onDelete,
  onEdit,
}: {
  note: Note;
  onDelete: (id: number) => Promise<void>;
  onEdit: (note: Note) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const { formatShort } = useCalendar();

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(note.id);
  };

  const dateStr = formatShort(new Date(note.createdAt)) + " " + new Date(note.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Hidden delete action behind the card */}
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="h-full w-24 bg-rose-600 flex flex-col items-center justify-center gap-1 text-white font-black text-[9px] uppercase tracking-widest"
        >
          <Trash2 className="size-5" />
          {deleting ? "..." : "Delete"}
        </button>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -96, right: 0 }}
        dragElastic={0.2}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) handleDelete();
        }}
        className="relative bg-white border-2 border-primarycolor/5 shadow-lg rounded-3xl p-5"
        style={{ touchAction: "pan-y" }}
        onClick={() => onEdit(note)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-sm text-gray-800 truncate">{note.title || "Untitled"}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5 line-clamp-2">
                {note.note_content || "No content"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-primarycolor/5">
          <Clock className="size-3 text-muted-foreground/50" />
          <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{dateStr}</span>
        </div>
      </motion.div>
    </div>
  );
}

interface NotesPageClientProps {
  notes: Note[];
  accountId: number;
}

export default function NotesPageClient({ notes: initialNotes, accountId }: NotesPageClientProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = notes.filter((n) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.note_content?.toLowerCase().includes(q)
    );
  });

  const openNew = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setModalOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.note_content || "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingNote) {
        const res = await updateNote(editingNote.id, title, content);
        if (res.success) {
          setNotes((prev) =>
            prev.map((n) =>
              n.id === editingNote.id
                ? { ...n, title, note_content: content, updatedAt: new Date().toISOString() }
                : n
            )
          );
          toast.success("Note updated");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createNote(title, content, accountId);
        if (res.success) {
          const newNote: Note = {
            id: res.data.id,
            title: res.data.title,
            note_content: res.data.note_content,
            createdAt: res.data.createdAt instanceof Date ? res.data.createdAt.toISOString() : res.data.createdAt,
            updatedAt: res.data.updatedAt instanceof Date ? res.data.updatedAt.toISOString() : res.data.updatedAt,
          };
          setNotes((prev) => [newNote, ...prev]);
          toast.success("Note created");
        } else {
          toast.error(res.error);
        }
      }
      setModalOpen(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteNote(id);
    if (res.success) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note deleted");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-5">
      {/* Sticky search header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent -mt-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="h-12 pl-12 pr-10 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md font-bold text-sm focus:border-primarycolor shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => router.refresh()}
            className="size-12 rounded-2xl border-2 border-primarycolor/5 bg-white/80 backdrop-blur-md flex items-center justify-center text-primarycolor hover:bg-primarycolor/5 transition-all shrink-0 shadow-sm"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {/* Note cards */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          filtered.map((note, i) => (
            <motion.div
              key={note.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={i}
              layout
            >
              <SwipeableNoteCard note={note} onDelete={handleDelete} onEdit={openEdit} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <FileText className="size-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-black text-gray-300 uppercase tracking-widest text-[10px]">
              {search ? "No notes match your search" : "No notes yet"}
            </p>
            {!search && (
              <p className="text-[10px] font-bold text-muted-foreground/50 mt-2">
                Tap the + button to create one
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button */}
      <button
        onClick={openNew}
        className="fixed bottom-8 right-6 z-30 size-14 rounded-2xl bg-primarycolor text-white shadow-xl shadow-primarycolor/30 flex items-center justify-center hover:bg-secondarycolor active:scale-90 transition-all"
      >
        <Plus className="size-6" />
      </button>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <FileText className="size-5" />
              </div>
              <DialogTitle className="text-lg font-black text-primarycolor uppercase italic">
                {editingNote ? "Edit Note" : "New Note"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="h-12 rounded-xl border-2 border-slate-100 font-bold text-sm focus:border-primarycolor"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                rows={6}
                className="w-full rounded-xl border-2 border-slate-100 p-3 font-medium text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20"
              />
            </div>
          </div>

          <DialogFooter className="bg-slate-50 p-4 border-t border-slate-100 shrink-0 flex flex-row items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="rounded-xl h-11 px-5 font-black text-[10px] uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="bg-primarycolor hover:bg-secondarycolor text-white rounded-xl h-11 px-5 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/20 gap-2"
            >
              {saving ? "..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
