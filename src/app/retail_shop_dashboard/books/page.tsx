import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { getRetailBooks } from "../../actions/retail-actions";
import { BooksClient } from "./BooksClient";

export const dynamic = "force-dynamic";

export default async function RetailBooksPage() {
  const res = await getRetailBooks();
  const books = res.success ? res.data : [];
  const error = !res.success ? res.error : null;

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Books
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              Browse retail book inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/retail_shop_dashboard/books/add"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus className="size-3.5" />
              Add Book
            </Link>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <BookOpen className="size-4" />
              {books.length} books
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <BooksClient books={books} />
      </div>
    </div>
  );
}
