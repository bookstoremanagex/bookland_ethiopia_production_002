import { getCurrentSession } from "../../actions/auth-actions";
import { notFound } from "next/navigation";
import NotesPageClient from "./NotesPageClient";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await getCurrentSession();

  if (!session || !session.id) {
    notFound();
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <NotesPageClient accountId={session.id} />
      </div>
    </div>
  );
}
