import { notFound } from "next/navigation";
import { getAdminRoundDetail } from "../actions";
import RoundBookDetailClient from "./RoundBookDetailClient";

export const dynamic = "force-dynamic";

export default async function RoundBookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) notFound();

  const response = await getAdminRoundDetail(parsedId);
  if (!response.success || !response.data) notFound();

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <RoundBookDetailClient data={response.data} />
      </div>
    </div>
  );
}
