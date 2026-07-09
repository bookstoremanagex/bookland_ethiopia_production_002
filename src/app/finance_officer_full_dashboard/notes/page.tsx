import { getNotes } from "../../actions/notes-actions";
import { getCurrentSession } from "@/app/actions/auth-actions";
import { notFound } from "next/navigation";
import { NotesTable } from "@/components/admin_dashboard_components/NotesTable";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
    const session = await getCurrentSession();

    if (!session || !session.id) {
        notFound();
    }

    const response = await getNotes(session.id);
    const notes = response.success ? response.data : [];

    return (
        <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
            <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="mb-6 flex justify-center">
                    <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor">
                        <FileText className="size-7" />
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-primarycolor/5">
                        <h2 className="text-lg font-black uppercase tracking-widest">Notes</h2>
                    </div>
                    {response.success ? (
                        <NotesTable data={notes as any[]} />
                    ) : (
                        <div className="p-8 text-center text-muted-foreground font-bold">
                            Failed to load notes.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}