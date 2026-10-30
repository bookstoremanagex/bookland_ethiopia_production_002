"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  Check,
  ChevronsUpDown,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";
import {
  quickCreateTranslationBook,
  quickCreateTranslationEdition,
} from "../../app/actions/translation-project-actions";

export type PickerEdition = {
  id: number;
  edition_name: string;
  productionstatus?: string | null;
};

export type PickerBook = {
  id: number;
  title: string;
  unique_identification_code: string;
  book_image_url?: string | null;
  bookedition?: PickerEdition[];
};

interface BookEditionPickerProps {
  books: PickerBook[];
  bookId?: number;
  editionId?: number;
  /** Both values are always sent together so the parent can keep them in sync. */
  onChange: (next: { bookId?: number; editionId?: number }) => void;
  bookError?: string;
  editionError?: string;
}

/** Defaults for the fields the admin rarely fills during quick creation. */
const NEW_BOOK_DEFAULTS = {
  author: "Sample Name",
  category: "Undecided",
  language: "Amharic",
};

/** Suggests "On Translation Edition 1", "… 2", … based on what exists. */
function suggestEditionName(editions: PickerEdition[]): string {
  return `On Translation Edition ${editions.length + 1}`;
}

/**
 * Book + edition selector for translation projects.
 *
 * - searches every book in the system (not just ones already in translation)
 * - can create a book inline with the bare minimum information
 * - can create an empty edition inline (name + TRANSLATION status only)
 */
export default function BookEditionPicker({
  books,
  bookId,
  editionId,
  onChange,
  bookError,
  editionError,
}: BookEditionPickerProps) {
  const router = useRouter();
  const [localBooks, setLocalBooks] = React.useState<PickerBook[]>(books);

  // Keep in sync with the server list after router.refresh().
  React.useEffect(() => {
    setLocalBooks(books);
  }, [books]);

  const [bookOpen, setBookOpen] = React.useState(false);
  const [editionOpen, setEditionOpen] = React.useState(false);

  // Inline "new book" panel
  const [newBookOpen, setNewBookOpen] = React.useState(false);
  const [isCreatingBook, setIsCreatingBook] = React.useState(false);
  const [bookForm, setBookForm] = React.useState({
    title: "",
    ...NEW_BOOK_DEFAULTS,
    publication_year: String(new Date().getFullYear()),
  });

  // Inline "new edition" panel
  const [newEditionOpen, setNewEditionOpen] = React.useState(false);
  const [isCreatingEdition, setIsCreatingEdition] = React.useState(false);
  const [newEditionName, setNewEditionName] = React.useState("");

  const selectedBook = localBooks.find((book) => book.id === bookId);
  const editions = selectedBook?.bookedition ?? [];
  const selectedEdition = editions.find((edition) => edition.id === editionId);

  const handleSelectBook = (book: PickerBook) => {
    setBookOpen(false);
    setNewEditionOpen(false);
    setNewEditionName("");
    // Choosing another title invalidates the previously picked edition.
    onChange({ bookId: book.id, editionId: undefined });

    const bookEditions = book.bookedition ?? [];
    if (bookEditions.length === 0) {
      // A brand new title has nothing to translate yet — ask for an edition.
      setNewEditionName(suggestEditionName(bookEditions));
      setNewEditionOpen(true);
    }
  };

  const handleCreateBook = async () => {
    if (!bookForm.title.trim()) {
      toast.error("Book title is required");
      return;
    }

    setIsCreatingBook(true);
    try {
      const response = await quickCreateTranslationBook({
        title: bookForm.title,
        author: bookForm.author || undefined,
        category: bookForm.category || undefined,
        publication_year: bookForm.publication_year || undefined,
        language: bookForm.language || undefined,
      });

      if (!response.success || !response.data) {
        toast.error(response.error || "Failed to create book");
        return;
      }

      toast.success(`"${response.data.title}" added`);
      const created = response.data as PickerBook;
      setLocalBooks((current) => [...current, created]);
      setBookForm({
        title: "",
        ...NEW_BOOK_DEFAULTS,
        publication_year: String(new Date().getFullYear()),
      });
      setNewBookOpen(false);
      onChange({ bookId: created.id, editionId: undefined });
      setNewEditionName(suggestEditionName([]));
      setNewEditionOpen(true);
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsCreatingBook(false);
    }
  };

  const handleCreateEdition = async () => {
    if (!bookId) {
      toast.error("Select a book first");
      return;
    }
    if (!newEditionName.trim()) {
      toast.error("Edition name is required");
      return;
    }

    setIsCreatingEdition(true);
    try {
      const response = await quickCreateTranslationEdition({
        bookId,
        edition_name: newEditionName,
      });

      if (!response.success || !response.data) {
        toast.error(response.error || "Failed to create edition");
        return;
      }

      const created = response.data as PickerEdition;
      setLocalBooks((current) =>
        current.map((book) =>
          book.id === bookId
            ? { ...book, bookedition: [created, ...(book.bookedition ?? [])] }
            : book
        )
      );
      onChange({ bookId, editionId: created.id });
      setNewEditionOpen(false);
      setNewEditionName("");
      toast.success(`${created.edition_name} created and moved to Translation`);
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsCreatingEdition(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Book */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
            <BookOpen className="size-4 text-primarycolor" />
            Select Book
          </label>
          <button
            type="button"
            onClick={() => setNewBookOpen((open) => !open)}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primarycolor hover:text-secondarycolor transition-colors"
          >
            {newBookOpen ? <X className="size-3" /> : <Plus className="size-3" />}
            {newBookOpen ? "Cancel" : "New book"}
          </button>
        </div>

        <Popover open={bookOpen} onOpenChange={setBookOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={bookOpen}
              className={cn(
                "w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl justify-between font-bold",
                !selectedBook && "text-muted-foreground"
              )}
            >
              <span className="truncate">
                {selectedBook ? selectedBook.title : "Choose a book..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl">
            <Command className="rounded-2xl">
              <CommandInput placeholder="Search all books..." className="h-12" />
              <CommandList className="max-h-[240px]">
                <CommandEmpty>No book found.</CommandEmpty>
                <CommandGroup>
                  {localBooks.map((book) => (
                    <CommandItem
                      key={book.id}
                      value={`${book.title} ${book.unique_identification_code}`}
                      onSelect={() => handleSelectBook(book)}
                      className="h-12 px-4 font-bold text-secondarycolor hover:bg-primarycolor/10 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primarycolor",
                          bookId === book.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="line-clamp-1">{book.title}</span>
                        <span className="text-[10px] opacity-50">
                          {book.unique_identification_code}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {bookError && <p className="text-xs font-bold text-destructive ml-1">{bookError}</p>}

        {/* Inline new book */}
        {newBookOpen && (
          <div className="rounded-2xl border-2 border-dashed border-primarycolor/20 bg-primarycolor/[0.02] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primarycolor" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                Quick create book
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Title *
                </label>
                <Input
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="e.g. The Great Gatsby"
                  className="h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Author
                </label>
                <Input
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  placeholder="Author name"
                  className="h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Category
                </label>
                <Input
                  value={bookForm.category}
                  onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                  placeholder="e.g. Fiction"
                  className="h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Publication Year *
                </label>
                <Input
                  type="number"
                  value={bookForm.publication_year}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, publication_year: e.target.value })
                  }
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="e.g. 2026"
                  className="h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Language
                </label>
                <Input
                  value={bookForm.language}
                  onChange={(e) => setBookForm({ ...bookForm, language: e.target.value })}
                  placeholder="e.g. English"
                  className="h-12 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleCreateBook}
                disabled={isCreatingBook}
                className="h-11 px-6 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px] gap-2"
              >
                {isCreatingBook ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Create book
              </Button>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 self-center">
                Book code, SKU and status are generated automatically
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edition */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
            <Layers className="size-4 text-primarycolor" />
            Edition
          </label>
          {bookId && (
            <button
              type="button"
              onClick={() => {
                setNewEditionOpen((open) => !open);
                if (!newEditionOpen) setNewEditionName(suggestEditionName(editions));
              }}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primarycolor hover:text-secondarycolor transition-colors"
            >
              {newEditionOpen ? <X className="size-3" /> : <Plus className="size-3" />}
              {newEditionOpen ? "Cancel" : "New edition"}
            </button>
          )}
        </div>

        <Popover open={editionOpen} onOpenChange={setEditionOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              disabled={!selectedBook}
              aria-expanded={editionOpen}
              className={cn(
                "w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl justify-between font-bold disabled:opacity-60",
                !selectedEdition && "text-muted-foreground"
              )}
            >
              <span className="truncate">
                {!selectedBook
                  ? "Select a book first"
                  : selectedEdition
                    ? selectedEdition.edition_name
                    : editions.length === 0
                      ? "No editions yet — create one"
                      : "Choose an edition..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl">
            <Command className="rounded-2xl">
              <CommandInput placeholder="Search editions..." className="h-12" />
              <CommandList className="max-h-[240px]">
                <CommandEmpty>No edition found.</CommandEmpty>
                <CommandGroup>
                  {editions.map((edition) => (
                    <CommandItem
                      key={edition.id}
                      value={edition.edition_name}
                      onSelect={() => {
                        onChange({ bookId, editionId: edition.id });
                        setEditionOpen(false);
                      }}
                      className="h-12 px-4 font-bold text-secondarycolor hover:bg-primarycolor/10 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primarycolor",
                          editionId === edition.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1 line-clamp-1">{edition.edition_name}</span>
                      {edition.productionstatus && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                          {edition.productionstatus.replace("_", " ")}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {editions.length > 0 && <CommandSeparator />}
                <CommandGroup>
                  <CommandItem
                    value="__create_new_edition__"
                    onSelect={() => {
                      setEditionOpen(false);
                      setNewEditionOpen(true);
                      setNewEditionName(suggestEditionName(editions));
                    }}
                    className="h-12 px-4 font-black uppercase tracking-widest text-[10px] text-primarycolor cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new edition
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {editionError && (
          <p className="text-xs font-bold text-destructive ml-1">{editionError}</p>
        )}

        {/* Inline new edition */}
        {newEditionOpen && bookId && (
          <div className="rounded-2xl border-2 border-dashed border-primarycolor/20 bg-primarycolor/[0.02] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primarycolor" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                Quick create edition
              </span>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Edition Name *
              </label>
              <Input
                value={newEditionName}
                onChange={(e) => setNewEditionName(e.target.value)}
                placeholder="e.g. On Translation Edition 1"
                className="h-12 rounded-xl font-bold"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleCreateEdition}
                disabled={isCreatingEdition}
                className="h-11 px-6 rounded-xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px] gap-2"
              >
                {isCreatingEdition ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Create edition
              </Button>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 self-center">
                Created empty (all costs 0) with status Translation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
