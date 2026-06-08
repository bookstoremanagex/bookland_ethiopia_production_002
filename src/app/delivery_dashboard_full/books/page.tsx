import { getBooks } from "@/app/actions/get-books";
import BooksList from "./BooksList";

export default async function BooksPage() {
  const response = await getBooks();
  const books = response.success ? response.data : [];

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <BooksList initialBooks={books as any[]} />
      </div>
    </div>
  );
}
