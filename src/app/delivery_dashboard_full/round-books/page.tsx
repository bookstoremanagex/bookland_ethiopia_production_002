import { getRoundBooks } from "./actions";
import RoundBooksList from "./RoundBooksList";

export default async function RoundBooksPage() {
  const response = await getRoundBooks();
  const roundBooks = response.success ? response.data : [];

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <RoundBooksList initialData={roundBooks as any[]} />
      </div>
    </div>
  );
}
