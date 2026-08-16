"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createBook } from "@/app/actions/book-actions";
import { BookOpen, Plus, Languages, Loader2 } from "lucide-react";

interface BookItem {
    id: number;
    unique_identification_code: string;
    title: string;
    author: string;
    language: string | null;
    category: string;
    publication_year: string;
    isbn: string | null;
    status: string;
    productionstatus: string | null;
    createdAt: string;
}

const LANGUAGE_OPTIONS = [
    "Afan Oromo",
    "Amharic",
    "English",
    "Tigrigna",
    "Somali",
    "Other",
];

export default function TranslationBooksClient({
    books,
}: {
    books: BookItem[];
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        author: "",
        category: "",
        publication_year: "",
        language: "",
        isbn: "",
    });

    function resetForm() {
        setForm({
            title: "",
            author: "",
            category: "",
            publication_year: "",
            language: "",
            isbn: "",
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.title.trim() || !form.author.trim() || !form.category.trim() || !form.publication_year.trim()) {
            toast.error("Title, Author, Category, and Year are required");
            return;
        }
        setLoading(true);
        try {
            const res = await createBook({
                title: form.title.trim(),
                author: form.author.trim(),
                category: form.category.trim(),
                publication_year: form.publication_year.trim(),
                language: form.language || null,
                isbn: form.isbn || null,
                pen_name: null,
                translator: null,
                designer: null,
                edition: null,
                copyright_registration_number: null,
                print_batch_id: null,
                number_of_pages: null,
                info: null,
                book_image_url: null,
                book_sort_index: null,
                translator_cost: 0,
                cover_design_cost: 0,
                text_design_cost: 0,
                editor_cost: 0,
                typewriting_cost: 0,
                store_cost: 0,
                distribution_cost: 0,
                advertisement_cost: 0,
                purchasing_right_cost: 0,
                status: "available",
                productionstatus: "TRANSLATION",
            });
            if (res.success) {
                toast.success("Translation book added successfully");
                setOpen(false);
                resetForm();
                router.refresh();
            } else {
                toast.error(res.error || "Failed to add book");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Header with add button */}
            <div className="flex items-center gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-10 rounded-xl bg-primarycolor text-white font-black text-[11px] uppercase tracking-widest gap-1.5 px-4 shadow-md shadow-primarycolor/20 hover:shadow-lg transition-all">
                            <Plus className="size-3.5" />
                            Add Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-black uppercase tracking-widest text-primarycolor">
                                New Translation Book
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="overflow-y-auto max-h-[55vh] space-y-4 px-0.5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Title <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm({ ...form, title: e.target.value })
                                        }
                                        placeholder="Book title"
                                        className="h-10 rounded-xl border-2 border-slate-200 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Author <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={form.author}
                                        onChange={(e) =>
                                            setForm({ ...form, author: e.target.value })
                                        }
                                        placeholder="Author name"
                                        className="h-10 rounded-xl border-2 border-slate-200 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Category <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm({ ...form, category: e.target.value })
                                        }
                                        placeholder="e.g. Fiction"
                                        className="h-10 rounded-xl border-2 border-slate-200 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Publication Year <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={form.publication_year}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                publication_year: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. 2026"
                                        className="h-10 rounded-xl border-2 border-slate-200 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Language
                                    </label>
                                    <select
                                        value={form.language}
                                        onChange={(e) =>
                                            setForm({ ...form, language: e.target.value })
                                        }
                                        className="flex h-10 w-full rounded-xl border-2 border-slate-200 bg-background px-3 py-1 text-sm font-bold outline-none focus:border-primarycolor"
                                    >
                                        <option value="">Select language</option>
                                        {LANGUAGE_OPTIONS.map((lang) => (
                                            <option key={lang} value={lang}>
                                                {lang}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        ISBN
                                    </label>
                                    <Input
                                        value={form.isbn}
                                        onChange={(e) =>
                                            setForm({ ...form, isbn: e.target.value })
                                        }
                                        placeholder="Optional"
                                        className="h-10 rounded-xl border-2 border-slate-200 font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 border-2 border-slate-100 p-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    This book will be created with{" "}
                                    <span className="text-primarycolor">Translation</span>{" "}
                                    production status
                                </p>
                            </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2 border-t">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 rounded-lg text-xs font-black uppercase tracking-widest"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-9 rounded-lg bg-primarycolor text-white font-black text-xs uppercase tracking-widest gap-1.5"
                                >
                                    {loading && (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    )}
                                    Create Book
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Books table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Languages className="size-10 mb-3 opacity-40" />
                        <p className="font-bold text-xs uppercase tracking-widest">
                            No books in translation phase
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200 bg-slate-50">
                                    <Th>Title</Th>
                                    <Th>Author</Th>
                                    <Th>Language</Th>
                                    <Th>Category</Th>
                                    <Th>Year</Th>
                                    <Th>ISBN</Th>
                                    <Th className="text-right">Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        <Td>
                                            <span className="font-semibold text-sm text-slate-800">
                                                {book.title}
                                            </span>
                                        </Td>
                                        <Td>{book.author}</Td>
                                        <Td>{book.language || "—"}</Td>
                                        <Td>{book.category}</Td>
                                        <Td>{book.publication_year}</Td>
                                        <Td className="font-mono text-xs">
                                            {book.isbn || "—"}
                                        </Td>
                                        <Td className="text-right">
                                            <Link
                                                href={`/operation_manager_full_dashboard/books/${book.unique_identification_code}`}
                                                className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-primarycolor/10 text-primarycolor font-black text-[10px] uppercase tracking-widest hover:bg-primarycolor hover:text-white transition-all"
                                            >
                                                <BookOpen className="size-3" />
                                                View
                                            </Link>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function Th({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`font-black text-[10px] uppercase tracking-widest text-slate-500 h-10 px-4 text-left ${className || ""}`}
        >
            {children}
        </th>
    );
}

function Td({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <td className={`px-4 py-3 text-sm font-medium text-slate-600 ${className || ""}`}>
            {children}
        </td>
    );
}
