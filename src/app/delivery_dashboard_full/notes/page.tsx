import { getNotes } from "../../actions/notes-actions";
import { getCurrentSession } from "@/app/actions/auth-actions";
import { notFound } from "next/navigation";
import NotesPageClient from "@/components/deliver_full_dashboard_components/NotesPageClient";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await getCurrentSession();

  if (!session || !session.id) {
    notFound();
  }

  const response = await getNotes(session.id);
  const notes = response.success
    ? response.data.map((note: any) => ({
        ...note,
        createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
        updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : note.updatedAt,
      }))
    : [];

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <NotesPageClient notes={notes as any[]} accountId={session.id} />
      </div>
    </div>
  );
}
