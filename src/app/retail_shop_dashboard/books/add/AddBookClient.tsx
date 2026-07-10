"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Layers,
  Plus,
  Search,
  ArrowLeft,
  Package,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRetailBook, addRetailEdition, getRetailEligibleBooksWithEditions, importBookToRetail } from "@/app/actions/retail-actions";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ExistingBook {
  id: number;
  title: string;
  author: string;
}

interface MainBookEdition {
  id: number;
  edition_name: string;
  selling_price: number | null;
}

interface MainBook {
  id: number;
  title: string;
  author: string | null;
  book_image_url: string | null;
  bookedition: MainBookEdition[];
}

export function AddBookClient({ existingBooks }: { existingBooks: ExistingBook[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"new" | "edition" | "from-our-book">("new");
  const [isLoading, setIsLoading] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  // From Our Book state
  const [ourBookSearch, setOurBookSearch] = useState("");
  const [ourBooks, setOurBooks] = useState<MainBook[]>([]);
  const [searchingOurBooks, setSearchingOurBooks] = useState(false);
  const [selectedOurBook, setSelectedOurBook] = useState<MainBook | null>(null);
  const [selectedOurEdition, setSelectedOurEdition] = useState<MainBookEdition | null>(null);
  const [ourBookPrice, setOurBookPrice] = useState("");

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
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (mode === "new" && name === "title") {
        next.edition_name = value;
      }
      return next;
    });
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

  // Load all retail-eligible books once when mode switches to "from-our-book"
  useEffect(() => {
    if (mode === "from-our-book" && ourBooks.length === 0 && !searchingOurBooks) {
      setSearchingOurBooks(true);
      getRetailEligibleBooksWithEditions().then((res) => {
        if (res.success && res.data) {
          setOurBooks(res.data);
        }
        setSearchingOurBooks(false);
      });
    }
  }, [mode, ourBooks.length, searchingOurBooks]);

  // Client-side filter
  const filteredOurBooks = useMemo(() => {
    if (!ourBookSearch) return ourBooks;
    const q = ourBookSearch.toLowerCase();
    return ourBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q))
    );
  }, [ourBooks, ourBookSearch]);

  const handleSelectOurBook = (book: MainBook) => {
    setSelectedOurBook(book);
    setSelectedOurEdition(null);
    setOurBookPrice("");
    setOurBookSearch("");
  };

  const handleImportBook = async () => {
    if (!selectedOurBook || !selectedOurEdition) {
      toast.error("Please select a book and edition");
      return;
    }
    const price = parseFloat(ourBookPrice) || selectedOurEdition.selling_price || 0;
    setIsLoading(true);
    try {
      const res = await importBookToRetail({
        mainBookId: selectedOurBook.id,
        mainEditionId: selectedOurEdition.id,
        editionName: selectedOurEdition.edition_name,
        price,
      });
      if (res.success) {
        toast.success("Book imported to retail successfully");
        router.push("/retail_shop_dashboard/books");
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to import book");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "from-our-book") {
      await handleImportBook();
      return;
    }
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
          ourbook: false,
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
            Add a new book, a new edition, or import from our catalog
          </p>
        </div>

        {/* Toggle */}
        <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 w-fit gap-1">
          <button
            onClick={() => {
              setMode("new");
              setSelectedBookId(null);
              setSelectedOurBook(null);
              setSelectedOurEdition(null);
            }}
            className={`px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              mode === "new"
                ? "bg-white text-primarycolor shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <BookOpen className="size-3.5 inline mr-1" />
            New Book
          </button>
          <button
            onClick={() => {
              setMode("edition");
              setSelectedOurBook(null);
              setSelectedOurEdition(null);
            }}
            className={`px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              mode === "edition"
                ? "bg-white text-primarycolor shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Layers className="size-3.5 inline mr-1" />
            Add Edition
          </button>
          <button
            onClick={() => {
              setMode("from-our-book");
              setSelectedBookId(null);
            }}
            className={`px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              mode === "from-our-book"
                ? "bg-white text-primarycolor shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Package className="size-3.5 inline mr-1" />
            From Our Book
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden p-6 sm:p-10 space-y-6">
          {/* Edition mode: select existing retail book */}
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

          {/* From Our Book mode */}
          {mode === "from-our-book" && (
            <div className="space-y-6">
              {/* Step 1: Search and select a book */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-2">
                  Search Our Catalog <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
                    placeholder="Search by title or author..."
                    value={ourBookSearch}
                    onChange={(e) => setOurBookSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                  {searchingOurBooks ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                      <Loader2 className="size-4 animate-spin" />
                      Loading books...
                    </div>
                  ) : filteredOurBooks.length === 0 ? (
                    <p className="text-center text-sm font-bold text-gray-300 py-6">
                      No books found
                    </p>
                  ) : (
                    filteredOurBooks.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => handleSelectOurBook(book)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all hover:bg-primarycolor/5 ${
                          selectedOurBook?.id === book.id
                            ? "bg-primarycolor/10 border-l-2 border-primarycolor"
                            : ""
                        }`}
                      >
                        <BookOpen className="size-4 text-primarycolor/60 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-700 truncate">{book.title}</p>
                          <p className="text-xs font-semibold text-gray-400 truncate">
                            {book.author} &middot; {book.bookedition.length} edition{book.bookedition.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        {selectedOurBook?.id === book.id && (
                          <Check className="size-4 text-primarycolor shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Step 2: Show selected book info and select edition */}
              {selectedOurBook && (
                <div className="space-y-4 p-4 rounded-xl bg-primarycolor/5 border border-primarycolor/10">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center shrink-0">
                      <BookOpen className="size-5 text-primarycolor" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-primarycolor uppercase">{selectedOurBook.title}</p>
                      <p className="text-xs text-gray-500">{selectedOurBook.author}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOurBook(null);
                        setSelectedOurEdition(null);
                        setOurBookPrice("");
                      }}
                      className="ml-auto text-xs font-bold text-gray-400 hover:text-gray-600"
                    >
                      Change
                    </button>
                  </div>

                  {/* Edition selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">
                      Select Edition <span className="text-red-400">*</span>
                    </label>
                    {selectedOurBook.bookedition.length === 0 ? (
                      <p className="text-sm text-gray-400 italic py-3">No editions available for this book</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedOurBook.bookedition.map((edition) => (
                          <button
                            key={edition.id}
                            type="button"
                            onClick={() => {
                              setSelectedOurEdition(edition);
                              setOurBookPrice(edition.selling_price?.toString() || "");
                            }}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left",
                              selectedOurEdition?.id === edition.id
                                ? "border-primarycolor bg-primarycolor/5"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                            )}
                          >
                            <div>
                              <p className="text-sm font-bold text-gray-700">{edition.edition_name}</p>
                              <p className="text-xs text-gray-400">
                                {edition.selling_price ? `${edition.selling_price.toLocaleString()} ETB` : "No price set"}
                              </p>
                            </div>
                            {selectedOurEdition?.id === edition.id && (
                              <Check className="size-4 text-primarycolor shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price input */}
                  {selectedOurEdition && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Price (ETB)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">ETB</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={ourBookPrice}
                          onChange={(e) => setOurBookPrice(e.target.value)}
                          placeholder={selectedOurEdition.selling_price?.toString() || "0.00"}
                          className="h-12 pl-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* New book mode fields */}
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

            {/* Edition + Price for new and edition modes */}
            {mode !== "from-our-book" && (
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
                      placeholder={mode === "new" ? "Auto-filled from title" : "e.g. 1st Edition, Paperback"}
                      className="h-12 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-2">Price (ETB)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">ETB</span>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="h-12 pl-14 bg-gray-50 border-transparent focus:border-primarycolor focus:bg-white rounded-xl transition-all"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/retail_shop_dashboard/books"
            className="h-12 px-8 rounded-xl font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all inline-flex items-center"
          >
            Cancel
          </Link>
          {mode === "from-our-book" ? (
            <Button
              type="button"
              onClick={handleImportBook}
              disabled={isLoading || !selectedOurBook || !selectedOurEdition}
              className="h-12 px-8 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Package className="size-4" />
                  Import to Retail
                </>
              )}
            </Button>
          ) : (
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
          )}
        </div>
        </form>
      </div>
    </div>
  );
}
