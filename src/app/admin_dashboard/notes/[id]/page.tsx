import React from "react";
import { getNoteById } from "../../../actions/notes-actions";
import { getCurrentSession } from "@/app/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import { NoteDetailClient } from "./NoteDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({ params }: PageProps) {
  const session = await getCurrentSession();

  if (!session || !session.id) {
    redirect("/login");
  }

  const { id } = await params;
  const noteId = Number(id);

  if (isNaN(noteId)) {
    notFound();
  }

  const response = await getNoteById(noteId);

  if (!response.success || !response.data) {
    notFound();
  }

  const note = response.data;

  // Serialize Dates to ISO strings before transferring to the Client Component
  const serializedNote = {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };

  return (
    <div className="w-full py-10 px-4 md:px-8 max-w-4xl mx-auto">
      <NoteDetailClient note={serializedNote as any} />
    </div>
  );
}
