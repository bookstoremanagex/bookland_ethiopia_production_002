"use client";

import React, { useMemo, useState } from "react";
import { Pencil, Check, X, Search, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateBook } from "../../../actions/book-actions";
import { updateEditionField } from "../../../actions/edition-actions";

export interface SettingsEdition {
  id: number;
  edition_name: string;
  total_print_count: number;
  count_remening_for_transfer: number;
  selling_price: number | null;
  number_of_pages: number | null;
  cover_price: number | null;
  store_quantity: number;
}

export interface SettingsBook {
  id: number;
  unique_identification_code: string;
  title: string;
  short_name: string | null;
  publication_year: string;
  author: string | null;
  pen_name: string | null;
  editions: SettingsEdition[];
}

type EditingKey = string | null;

function EditableValue({
  editKey,
  currentKey,
  value,
  display,
  type = "text",
  saving,
  onStart,
  onCancel,
  onSave,
}: {
  editKey: EditingKey;
  currentKey: string;
  value: string;
  display: string;
  type?: "text" | "number";
  saving: boolean;
  onStart: () => void;
  onCancel: () => void;
  onSave: (v: string) => void;
}) {
  const isEditing = editKey === currentKey;
  const [draft, setDraft] = useState(value);

  React.useEffect(() => {
    if (isEditing) setDraft(value);
  }, [isEditing, value]);

  if (!isEditing) {
    return (
      <div
        className="group flex items-center gap-1.5 cursor-pointer min-w-0"
        onClick={onStart}
        title="Click to edit"
      >
        <span className="truncate font-black text-slate-800 text-sm">{display}</span>
        <Pencil className="size-3.5 text-primarycolor opacity-0 group-hover:opacity-60 shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 min-w-0" onClick={(e) => e.stopPropagation()}>
      <Input
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(draft);
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
        className="h-9 text-sm font-bold px-2.5"
      />
      <button
        onClick={() => onSave(draft)}
        disabled={saving}
        className="size-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 shrink-0 cursor-pointer"
        title="Save"
      >
        {saving ? <span className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="size-4" />}
      </button>
      <button
        onClick={onCancel}
        disabled={saving}
        className="size-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200 shrink-0 cursor-pointer"
        title="Cancel"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function FieldBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50/80 rounded-2xl border border-slate-100 p-3 space-y-1 min-w-0">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

const fmtNum = (v: number | null | undefined) =>
  v == null ? "—" : Number(v).toLocaleString();

export default function BooksSettingsTable({ initialBooks }: { initialBooks: SettingsBook[] }) {
  const [books, setBooks] = useState<SettingsBook[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [editingKey, setEditingKey] = useState<EditingKey>(null);
  const [savingKey, setSavingKey] = useState<EditingKey>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;
    return books
      .map((b) => ({
        ...b,
        editions: b.editions.filter(
          (e) =>
            b.title.toLowerCase().includes(q) ||
            (b.short_name || "").toLowerCase().includes(q) ||
            (b.author || "").toLowerCase().includes(q) ||
            e.edition_name.toLowerCase().includes(q)
        ),
      }))
      .filter((b) => b.editions.length > 0);
  }, [books, search]);

  const rowCount = useMemo(
    () => filtered.reduce((n, b) => n + b.editions.length, 0),
    [filtered]
  );

  const patchBook = (code: string, field: string, value: any) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.unique_identification_code === code ? { ...b, [field]: value } : b
      )
    );
  };

  const patchEdition = (editionId: number, field: string, value: any, extra?: Partial<SettingsEdition>) => {
    setBooks((prev) =>
      prev.map((b) => ({
        ...b,
        editions: b.editions.map((e) =>
          e.id === editionId ? { ...e, [field]: value, ...extra } : e
        ),
      }))
    );
  };

  const saveBookField = async (
    book: SettingsBook,
    field: "title" | "short_name" | "publication_year" | "author" | "pen_name",
    raw: string,
    key: string
  ) => {
    const v = raw.trim();
    if (["title", "author", "publication_year"].includes(field) && !v) {
      toast.error("This field is required");
      return;
    }
    const current = String((book as any)[field] ?? "");
    if (v === current) {
      setEditingKey(null);
      return;
    }
    setSavingKey(key);
    try {
      const payload: any = {};
      payload[field] = field === "short_name" || field === "pen_name" ? (v === "" ? null : v) : v;
      const res = await updateBook(book.unique_identification_code, payload);
      if (!res.success) {
        toast.error(res.error || "Failed to save");
        return;
      }
      patchBook(book.unique_identification_code, field, (res.data as any)?.[field] ?? payload[field]);
      toast.success("Saved");
      setEditingKey(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setSavingKey(null);
    }
  };

  const saveEditionField = async (
    edition: SettingsEdition,
    field: "edition_name" | "total_print_count" | "count_remening_for_transfer" | "selling_price" | "number_of_pages" | "cover_price",
    raw: string,
    key: string
  ) => {
    const v = raw.trim();
    if (field === "edition_name" && !v) {
      toast.error("Edition name is required");
      return;
    }
    const current = String((edition as any)[field] ?? "");
    if (v === current || (v === "" && (edition as any)[field] == null)) {
      setEditingKey(null);
      return;
    }
    setSavingKey(key);
    try {
      const res = await updateEditionField(edition.id, field, v);
      if (!res.success) {
        toast.error(res.error || "Failed to save");
        return;
      }
      const updated: any = res.data;
      if (field === "total_print_count") {
        patchEdition(edition.id, field, updated.total_print_count, {
          count_remening_for_transfer: updated.count_remening_for_transfer,
        });
      } else {
        patchEdition(edition.id, field, updated[field] ?? (v === "" ? null : Number(v)));
      }
      toast.success("Saved");
      setEditingKey(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <p className="text-xs font-bold text-muted-foreground">
          {filtered.length} books · {rowCount} editions in store. Only editions with store quantity ≥ 1 are listed (editions with 0 in store are hidden). Click any value to edit — changes save per field.
        </p>
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, short name, author, edition..."
            className="h-10 pl-9 rounded-xl border-2 text-sm font-bold"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-primarycolor/10 rounded-3xl">
          <BookOpen className="size-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-black uppercase tracking-widest text-sm text-muted-foreground">
            No books with stock found
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((book, bi) => {
            const bk = (f: string) => `b${book.id}-${f}`;
            return (
              <section
                key={book.id}
                className="bg-white rounded-[1.75rem] border-2 border-primarycolor/10 shadow-sm overflow-hidden"
              >
                {/* Book header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-primarycolor/5 border-b-2 border-primarycolor/10">
                  <span className="size-9 rounded-xl bg-primarycolor text-white flex items-center justify-center font-black text-sm shrink-0">
                    {bi + 1}
                  </span>
                  <BookOpen className="size-4 text-primarycolor shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-black text-primarycolor text-base truncate">{book.title}</h2>
                    <p className="text-[10px] font-bold text-muted-foreground">
                      {book.editions.length} edition{book.editions.length > 1 ? "s" : ""} with stock
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Part 1 — Main book info */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primarycolor mb-2.5">
                      Book Info
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                      <FieldBox label="Title">
                        <EditableValue
                          editKey={editingKey}
                          currentKey={bk("title")}
                          value={book.title}
                          display={book.title}
                          saving={savingKey === bk("title")}
                          onStart={() => setEditingKey(bk("title"))}
                          onCancel={() => setEditingKey(null)}
                          onSave={(v) => saveBookField(book, "title", v, bk("title"))}
                        />
                      </FieldBox>
                      <FieldBox label="Short Name">
                        <EditableValue
                          editKey={editingKey}
                          currentKey={bk("short_name")}
                          value={book.short_name ?? ""}
                          display={book.short_name || "—"}
                          saving={savingKey === bk("short_name")}
                          onStart={() => setEditingKey(bk("short_name"))}
                          onCancel={() => setEditingKey(null)}
                          onSave={(v) => saveBookField(book, "short_name", v, bk("short_name"))}
                        />
                      </FieldBox>
                      <FieldBox label="Year">
                        <EditableValue
                          editKey={editingKey}
                          currentKey={bk("publication_year")}
                          value={book.publication_year}
                          display={book.publication_year}
                          saving={savingKey === bk("publication_year")}
                          onStart={() => setEditingKey(bk("publication_year"))}
                          onCancel={() => setEditingKey(null)}
                          onSave={(v) => saveBookField(book, "publication_year", v, bk("publication_year"))}
                        />
                      </FieldBox>
                      <FieldBox label="Author">
                        <EditableValue
                          editKey={editingKey}
                          currentKey={bk("author")}
                          value={book.author ?? ""}
                          display={book.author || "—"}
                          saving={savingKey === bk("author")}
                          onStart={() => setEditingKey(bk("author"))}
                          onCancel={() => setEditingKey(null)}
                          onSave={(v) => saveBookField(book, "author", v, bk("author"))}
                        />
                      </FieldBox>
                      <FieldBox label="Pen Name">
                        <EditableValue
                          editKey={editingKey}
                          currentKey={bk("pen_name")}
                          value={book.pen_name ?? ""}
                          display={book.pen_name || "—"}
                          saving={savingKey === bk("pen_name")}
                          onStart={() => setEditingKey(bk("pen_name"))}
                          onCancel={() => setEditingKey(null)}
                          onSave={(v) => saveBookField(book, "pen_name", v, bk("pen_name"))}
                        />
                      </FieldBox>
                    </div>
                  </div>

                  {/* Part 2 — Editions listed under the book */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondarycolor mb-2.5 flex items-center gap-1.5">
                      <Layers className="size-3.5" /> Editions
                    </p>
                    <div className="space-y-2.5">
                      {book.editions.map((ed) => {
                        const ek = (f: string) => `e${ed.id}-${f}`;
                        return (
                          <div
                            key={ed.id}
                            className="rounded-2xl border-2 border-secondarycolor/10 bg-secondarycolor/[0.03] p-3.5"
                          >
                            <p className="text-xs font-black text-secondarycolor mb-2.5 truncate">
                              {ed.edition_name}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
                              <FieldBox label="Edition Name">
                                <EditableValue
                                  editKey={editingKey}
                                  currentKey={ek("edition_name")}
                                  value={ed.edition_name}
                                  display={ed.edition_name}
                                  saving={savingKey === ek("edition_name")}
                                  onStart={() => setEditingKey(ek("edition_name"))}
                                  onCancel={() => setEditingKey(null)}
                                  onSave={(v) => saveEditionField(ed, "edition_name", v, ek("edition_name"))}
                                />
                              </FieldBox>
                              <FieldBox label="Print Metrics">
                                <EditableValue
                                  editKey={editingKey}
                                  currentKey={ek("total_print_count")}
                                  value={String(ed.total_print_count ?? 0)}
                                  display={fmtNum(ed.total_print_count)}
                                  type="number"
                                  saving={savingKey === ek("total_print_count")}
                                  onStart={() => setEditingKey(ek("total_print_count"))}
                                  onCancel={() => setEditingKey(null)}
                                  onSave={(v) => saveEditionField(ed, "total_print_count", v, ek("total_print_count"))}
                                />
                              </FieldBox>
                              <FieldBox label="Remaining for Transfer">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex px-2 py-0.5 rounded-lg bg-secondarycolor/10 text-secondarycolor text-xs font-black border border-secondarycolor/20 shrink-0">
                                    {fmtNum(ed.count_remening_for_transfer)}
                                  </span>
                                  <EditableValue
                                    editKey={editingKey}
                                    currentKey={ek("count_remening_for_transfer")}
                                    value={String(ed.count_remening_for_transfer ?? 0)}
                                    display="edit"
                                    type="number"
                                    saving={savingKey === ek("count_remening_for_transfer")}
                                    onStart={() => setEditingKey(ek("count_remening_for_transfer"))}
                                    onCancel={() => setEditingKey(null)}
                                    onSave={(v) => saveEditionField(ed, "count_remening_for_transfer", v, ek("count_remening_for_transfer"))}
                                  />
                                </div>
                              </FieldBox>
                              <FieldBox label="In Store">
                                <span className="text-sm font-black text-slate-800">{fmtNum(ed.store_quantity)}</span>
                              </FieldBox>
                              <FieldBox label="Single Price">
                                <EditableValue
                                  editKey={editingKey}
                                  currentKey={ek("selling_price")}
                                  value={ed.selling_price != null ? String(ed.selling_price) : ""}
                                  display={ed.selling_price != null ? fmtNum(ed.selling_price) : "—"}
                                  type="number"
                                  saving={savingKey === ek("selling_price")}
                                  onStart={() => setEditingKey(ek("selling_price"))}
                                  onCancel={() => setEditingKey(null)}
                                  onSave={(v) => saveEditionField(ed, "selling_price", v, ek("selling_price"))}
                                />
                              </FieldBox>
                              <FieldBox label="Page Count">
                                <EditableValue
                                  editKey={editingKey}
                                  currentKey={ek("number_of_pages")}
                                  value={ed.number_of_pages != null ? String(ed.number_of_pages) : ""}
                                  display={ed.number_of_pages != null ? fmtNum(ed.number_of_pages) : "—"}
                                  type="number"
                                  saving={savingKey === ek("number_of_pages")}
                                  onStart={() => setEditingKey(ek("number_of_pages"))}
                                  onCancel={() => setEditingKey(null)}
                                  onSave={(v) => saveEditionField(ed, "number_of_pages", v, ek("number_of_pages"))}
                                />
                              </FieldBox>
                              <FieldBox label="Cover Price">
                                <EditableValue
                                  editKey={editingKey}
                                  currentKey={ek("cover_price")}
                                  value={ed.cover_price != null ? String(ed.cover_price) : ""}
                                  display={ed.cover_price != null ? fmtNum(ed.cover_price) : "—"}
                                  type="number"
                                  saving={savingKey === ek("cover_price")}
                                  onStart={() => setEditingKey(ek("cover_price"))}
                                  onCancel={() => setEditingKey(null)}
                                  onSave={(v) => saveEditionField(ed, "cover_price", v, ek("cover_price"))}
                                />
                              </FieldBox>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
