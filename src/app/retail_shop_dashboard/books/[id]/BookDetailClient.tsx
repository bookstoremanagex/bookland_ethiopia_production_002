"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Plus,
  Pencil,
  Save,
  X,
  Trash2,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  updateRetailBook,
  updateRetailEdition,
  deleteRetailEdition,
  deleteRetailBook,
  addRetailEditionDirect,
} from "@/app/actions/retail-actions";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Edition {
  id: number;
  edition_name: string;
  price: number | null;
}

interface Book {
  id: number;
  title: string;
  author: string;
  language: string;
  category: string;
  publication_year: string | null;
  book_image_url: string | null;
  status: string;
  ourbook: boolean;
  bookEditions: Edition[];
}

export function BookDetailClient({ book: initialBook }: { book: Book }) {
  const router = useRouter();
  const [book, setBook] = useState(initialBook);
  const [editingBook, setEditingBook] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: book.title,
    author: book.author,
    language: book.language,
    category: book.category,
    publication_year: book.publication_year || "",
  });
  const [savingBook, setSavingBook] = useState(false);

  const [editingEdition, setEditingEdition] = useState<number | null>(null);
  const [editionForm, setEditionForm] = useState({ edition_name: "", price: "" });
  const [savingEdition, setSavingEdition] = useState(false);

  const [addingEdition, setAddingEdition] = useState(false);
  const [newEdition, setNewEdition] = useState({ edition_name: "", price: "" });
  const [savingNewEdition, setSavingNewEdition] = useState(false);

  const [deletingEditionId, setDeletingEditionId] = useState<number | null>(null);
  const [showDeleteBookDialog, setShowDeleteBookDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingBook, setDeletingBook] = useState(false);

  const handleSaveBook = async () => {
    setSavingBook(true);
    try {
      const res = await updateRetailBook(book.id, bookForm);
      if (res.success) {
        setBook((prev) => ({ ...prev, ...bookForm }));
        setEditingBook(false);
        toast.success("Book updated");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update book");
    } finally {
      setSavingBook(false);
    }
  };

  const handleSaveEdition = async (editionId: number) => {
    setSavingEdition(true);
    try {
      const res = await updateRetailEdition(editionId, {
        edition_name: editionForm.edition_name,
        price: editionForm.price ? parseFloat(editionForm.price) : undefined,
      });
      if (res.success) {
        setBook((prev) => ({
          ...prev,
          bookEditions: prev.bookEditions.map((ed) =>
            ed.id === editionId
              ? {
                  ...ed,
                  edition_name: editionForm.edition_name,
                  price: editionForm.price ? parseFloat(editionForm.price) : ed.price,
                }
              : ed
          ),
        }));
        setEditingEdition(null);
        toast.success("Edition updated");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update edition");
    } finally {
      setSavingEdition(false);
    }
  };

  const handleDeleteEdition = async (editionId: number) => {
    try {
      const res = await deleteRetailEdition(editionId);
      if (res.success) {
        setBook((prev) => ({
          ...prev,
          bookEditions: prev.bookEditions.filter((ed) => ed.id !== editionId),
        }));
        setDeletingEditionId(null);
        toast.success("Edition deleted");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete edition");
    }
  };

  const handleAddEdition = async () => {
    if (!newEdition.edition_name.trim()) {
      toast.error("Edition name is required");
      return;
    }
    setSavingNewEdition(true);
    try {
      const res = await addRetailEditionDirect({
        book_id: book.id,
        edition_name: newEdition.edition_name,
        price: newEdition.price ? parseFloat(newEdition.price) : undefined,
      });
      if (res.success) {
        setBook((prev) => ({
          ...prev,
          bookEditions: [...prev.bookEditions, res.data],
        }));
        setNewEdition({ edition_name: "", price: "" });
        setAddingEdition(false);
        toast.success("Edition added");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to add edition");
      }
    } catch {
      toast.error("Failed to add edition");
    } finally {
      setSavingNewEdition(false);
    }
  };

  const handleDeleteBook = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeletingBook(true);
    try {
      const res = await deleteRetailBook(book.id);
      if (res.success) {
        toast.success("Book deleted");
        router.push("/retail_shop_dashboard/books");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete book");
      }
    } catch {
      toast.error("Failed to delete book");
    } finally {
      setDeletingBook(false);
      setShowDeleteBookDialog(false);
      setDeleteConfirmText("");
    }
  };

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href="/retail_shop_dashboard/books"
          className="inline-flex items-center text-sm font-bold text-primarycolor hover:text-primarycolor/80 transition-colors"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Books
        </Link>

        {/* Book info card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Image header */}
          {book.book_image_url ? (
            <div className="h-48 sm:h-64 bg-slate-50 overflow-hidden relative">
              <img
                src={book.book_image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-32 sm:h-40 bg-gradient-to-br from-primarycolor/5 to-primarycolor/10 flex items-center justify-center">
              <BookOpen className="size-16 text-primarycolor/15" />
            </div>
          )}

          {/* Book details */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {editingBook ? (
                  <div className="space-y-3">
                    <Input
                      value={bookForm.title}
                      onChange={(e) => setBookForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Title"
                      className="h-10 font-black text-sm rounded-xl"
                    />
                    <Input
                      value={bookForm.author}
                      onChange={(e) => setBookForm((f) => ({ ...f, author: e.target.value }))}
                      placeholder="Author"
                      className="h-10 text-sm rounded-xl"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={bookForm.language}
                        onChange={(e) => setBookForm((f) => ({ ...f, language: e.target.value }))}
                        placeholder="Language"
                        className="h-10 text-sm rounded-xl"
                      />
                      <Input
                        value={bookForm.category}
                        onChange={(e) => setBookForm((f) => ({ ...f, category: e.target.value }))}
                        placeholder="Category"
                        className="h-10 text-sm rounded-xl"
                      />
                    </div>
                    <Input
                      value={bookForm.publication_year}
                      onChange={(e) => setBookForm((f) => ({ ...f, publication_year: e.target.value }))}
                      placeholder="Publication Year"
                      className="h-10 text-sm rounded-xl"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
                      {book.title}
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 mt-1">{book.author}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {book.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                          {book.category}
                        </span>
                      )}
                      {book.language && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                          {book.language}
                        </span>
                      )}
                      {book.publication_year && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-50 text-slate-400">
                          {book.publication_year}
                        </span>
                      )}
                      {book.ourbook && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                          Our Book
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Edit/Save/Cancel buttons */}
              <div className="shrink-0">
                {editingBook ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBook(false);
                        setBookForm({
                          title: book.title,
                          author: book.author,
                          language: book.language,
                          category: book.category,
                          publication_year: book.publication_year || "",
                        });
                      }}
                      className="h-9 px-3 rounded-xl font-black text-[9px] uppercase tracking-widest gap-1"
                    >
                      <X className="size-3" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveBook}
                      disabled={savingBook}
                      className="h-9 px-3 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-[9px] uppercase tracking-widest gap-1"
                    >
                      {savingBook ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBook(true)}
                      className="h-9 px-3 rounded-xl font-black text-[9px] uppercase tracking-widest gap-1"
                    >
                      <Pencil className="size-3" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteBookDialog(true)}
                      className="h-9 px-3 rounded-xl font-black text-[9px] uppercase tracking-widest gap-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="size-3" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editions card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primarycolor" />
              <h2 className="font-black text-sm text-slate-800 uppercase tracking-tight">
                Editions ({book.bookEditions.length})
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingEdition(true)}
              className="h-8 px-3 rounded-xl font-black text-[9px] uppercase tracking-widest gap-1"
            >
              <Plus className="size-3" /> Add
            </Button>
          </div>

          <div className="divide-y divide-slate-50">
            {book.bookEditions.length === 0 ? (
              <div className="p-8 text-center">
                <Layers className="size-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400">No editions yet</p>
              </div>
            ) : (
              book.bookEditions.map((edition) => (
                <div key={edition.id} className="p-4 sm:px-6">
                  {editingEdition === edition.id ? (
                    <div className="flex items-center gap-3">
                      <Input
                        value={editionForm.edition_name}
                        onChange={(e) => setEditionForm((f) => ({ ...f, edition_name: e.target.value }))}
                        placeholder="Edition name"
                        className="h-9 text-sm rounded-xl flex-1"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">ETB</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editionForm.price}
                          onChange={(e) => setEditionForm((f) => ({ ...f, price: e.target.value }))}
                          placeholder="0.00"
                          className="h-9 pl-10 w-28 text-sm rounded-xl"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdition(edition.id)}
                        disabled={savingEdition}
                        className="h-9 px-3 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-[9px] uppercase gap-1"
                      >
                        {savingEdition ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEdition(null)}
                        className="h-9 w-9 p-0 rounded-xl"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-8 rounded-lg bg-primarycolor/10 flex items-center justify-center shrink-0">
                          <Layers className="size-4 text-primarycolor" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-700 truncate">{edition.edition_name}</p>
                          <p className="text-[10px] font-bold text-slate-400">
                            {edition.price != null ? `${edition.price.toLocaleString()} ETB` : "No price set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEdition(edition.id);
                            setEditionForm({
                              edition_name: edition.edition_name,
                              price: edition.price?.toString() || "",
                            });
                          }}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
                        >
                          <Pencil className="size-3.5 text-slate-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingEditionId(edition.id)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="size-3.5 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Add new edition form */}
            {addingEdition && (
              <div className="p-4 sm:px-6 bg-slate-50/50">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                  New Edition
                </p>
                <div className="flex items-center gap-3">
                  <Input
                    value={newEdition.edition_name}
                    onChange={(e) => setNewEdition((f) => ({ ...f, edition_name: e.target.value }))}
                    placeholder="Edition name (e.g. Paperback, 2nd Ed.)"
                    className="h-9 text-sm rounded-xl flex-1"
                    autoFocus
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">ETB</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newEdition.price}
                      onChange={(e) => setNewEdition((f) => ({ ...f, price: e.target.value }))}
                      placeholder="0.00"
                      className="h-9 pl-10 w-28 text-sm rounded-xl"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddEdition}
                    disabled={savingNewEdition || !newEdition.edition_name.trim()}
                    className="h-9 px-3 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black text-[9px] uppercase gap-1"
                  >
                    {savingNewEdition ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAddingEdition(false);
                      setNewEdition({ edition_name: "", price: "" });
                    }}
                    className="h-9 w-9 p-0 rounded-xl"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete edition confirmation */}
      <AlertDialog open={deletingEditionId !== null} onOpenChange={(o) => { if (!o) setDeletingEditionId(null); }}>
        <AlertDialogContent className="rounded-2xl border-2 border-primarycolor/5">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-black text-primarycolor uppercase tracking-tight italic">
              Delete Edition?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
              This will permanently remove this edition. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => deletingEditionId && handleDeleteEdition(deletingEditionId)}
                className="rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete book confirmation */}
      <AlertDialog open={showDeleteBookDialog} onOpenChange={(o) => { if (!o) { setShowDeleteBookDialog(false); setDeleteConfirmText(""); } }}>
        <AlertDialogContent className="rounded-2xl border-2 border-primarycolor/5">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-black text-primarycolor uppercase tracking-tight italic">
              Delete Book?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground space-y-2">
              <p>This will permanently remove <strong>{book.title}</strong> and all its editions from the retail shop.</p>
              <p>Type <strong className="text-rose-600">DELETE</strong> to confirm.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1">
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full h-10 px-4 rounded-xl border-2 border-slate-200 text-sm font-bold text-gray-700 outline-none focus:border-rose-400 transition-colors"
            />
          </div>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleDeleteBook}
                disabled={deleteConfirmText !== "DELETE" || deletingBook}
                className="rounded-xl h-10 px-5 font-black text-[9px] uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deletingBook ? <Loader2 className="size-3 animate-spin" /> : "Delete Book"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
