"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Layers,
  Plus,
  Search,
  ArrowLeft,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRetailBook, addRetailEdition } from "@/app/actions/retail-actions";
import { toast } from "sonner";
import Link from "next/link";

interface ExistingBook {
  id: number;
  title: string;
  author: string;
}

export function AddBookClient({ existingBooks }: { existingBooks: ExistingBook[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"new" | "edition">("new");
  const [isLoading, setIsLoading] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    language: "",
    category: "",
    publication_year: "",
    edition_name: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filteredBooks = useMemo(
    () =>
      existingBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
          b.author.toLowerCase().includes(bookSearch.toLowerCase())
      ),
    [existingBooks, bookSearch]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "new") {
        const res = await createRetailBook({
          title: form.title,
          author: form.author,
          language: form.language,
          category: form.category,
          publication_year: form.publication_year,
          edition_name: form.edition_name,
          price: form.price ? parseFloat(form.price) : undefined,
        });

        if (res.success) {
          toast.success("Book and edition created");
          router.push("/retail_shop_dashboard/books");
          router.refresh();
        } else {
          toast.error(res.error ?? "Failed to create book");
        }
      } else {
        if (!selectedBookId) {
          toast.error("Please select a book");
          setIsLoading(false);
          return;
        }
        const res = await addRetailEdition({
          bookId: selectedBookId,
          edition_name: form.edition_name,
          price: form.price ? parseFloat(form.price) : undefined,
        });

        if (res.success) {
          toast.success("Edition added to book");
          router.push("/retail_shop_dashboard/books");
          router.refresh();
        } else {
          toast.error(res.error ?? "Failed to add edition");
        }
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            href="/retail_shop_dashboard/books"
            className="inline-flex items-center text-sm font-bold text-primarycolor hover:text-primarycolor/80 transition-colors mb-2"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Books
          </Link>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Add Book
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Add a new book or a new edition to an existing book
          </p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 w-fit">
          <button
            onClick={() => {
              setMode("new");
              setSelectedBookId(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              mode === "new"
                ? "bg-white text-primarycolor shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <BookOpen className="size-3.5 inline mr-1.5" />
            New Book
          </button>
          <button
            onClick={() => setMode("edition")}
            className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              mode === "edition"
                ? "bg-white text-primarycolor shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Layers className="size-3.5 inline mr-1.5" />
            Add Edition
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden p-6 sm:p-10 space-y-6">
            {mode === "edition" && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-2">
                  Select Book <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
                    placeholder="Search existing books..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                  {filteredBooks.length === 0 ? (
                    <p className="text-center text-sm font-bold text-gray-300 py-6">
                      No books found
                    </p>
                  ) : (
                    filteredBooks.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => {
                          setSelectedBookId(book.id);
                          setBookSearch(book.title);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all hover:bg-primarycolor/5 ${
                          selectedBookId === book.id
                            ? "bg-primarycolor/10 border-l-2 border-primarycolor"
                            : ""
                        }`}
                      >
                        <BookOpen className="size-4 text-primarycolor/60 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-gray-700">{book.title}</p>
                          <p className="text-xs font-semibold text-gray-400">{book.author}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mode === "new" && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <Input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Book title"
                      className="h-12 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-2">
                      Author <span className="text-red-400">*</span>
                    </label>
                    <Input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      required
                      placeholder="Author name"
                      className="h-12 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-2">Language</label>
                    <Input
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      placeholder="e.g. English, Amharic"
                      className="h-12 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-2">Category</label>
                    <Input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g. Fiction, Academic"
                      className="h-12 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-2">Publication Year</label>
                    <Input
                      name="publication_year"
                      value={form.publication_year}
                      onChange={handleChange}
                      placeholder="e.g. 2024"
                      className="h-12 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                </>
              )}

              <>
                <div className={mode === "new" ? "" : "md:col-span-2"}>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-2">
                      Edition Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      name="edition_name"
                      value={form.edition_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 1st Edition, Paperback"
                      className="h-12 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-2">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="h-12 pl-11 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                </div>
              </>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              href="/retail_shop_dashboard/books"
              className="h-12 px-8 rounded-xl font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all inline-flex items-center"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="size-4" />
                  {mode === "new" ? "Create Book" : "Add Edition"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
