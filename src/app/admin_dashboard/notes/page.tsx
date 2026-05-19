import React from "react";
import { getNotes } from "../../actions/notes-actions";
import { NotesTable } from "../../../components/admin_dashboard_components/NotesTable";
import { getCurrentSession } from "@/app/actions/auth-actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await getCurrentSession();
  
  if (!session || !session.id) {
    notFound();
  }

  const response = await getNotes();
  const notes = response.success ? response.data.map(note => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString()
  })) : [];

  return (
    <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primarycolor uppercase italic">
            Memo & <span className="text-secondarycolor not-italic">Notes Center</span>
          </h1>
          <p className="text-muted-foreground font-bold tracking-tight">
            Record details, keep personal reminders, or track important internal updates.
          </p>
        </div>
      </div>

      {response.success ? (
        <NotesTable data={notes as any[]} currentUserId={session.id} />
      ) : (
        <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center text-destructive font-bold">
          Failed to load notes. Please refresh the page.
        </div>
      )}
    </div>
  );
}
