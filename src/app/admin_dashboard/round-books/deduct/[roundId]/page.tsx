import { notFound } from "next/navigation";
import { getRoundDeductData } from "../../actions";
import DeductForm from "./DeductForm";

export default async function DeductPage({
  params,
}: {
  params: Promise<{ roundId: string }>;
}) {
  const { roundId } = await params;
  const parsed = parseInt(roundId);
  if (isNaN(parsed)) notFound();

  const res = await getRoundDeductData(parsed);
  if (!res.success || !res.data) notFound();

  return (
    <div className="w-full py-10 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Deduct Books <span className="text-secondarycolor not-italic">from Stock</span>
        </h1>
        <p className="text-muted-foreground font-bold tracking-tight mt-1">
          {res.data.bookTitle} &middot; {res.data.totalToDeduct} books to deduct
        </p>
      </div>
      <DeductForm data={res.data as any} />
    </div>
  );
}