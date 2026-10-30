import React from 'react'
import { BookOpen, ClipboardList } from 'lucide-react'
import { checkCurrentUserRole } from '../../../actions/book-shop-actions'
import { getBooksForFollowUp } from '../../../actions/book-follow-up-actions'
import BookFollowUpTable from './BookFollowUpTable'

export default async function BookFollowUpPage() {
    const permission = await checkCurrentUserRole("Viewing Books")
    if (!permission.enabled) {
        return (
            <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center">
                    <h2 className="text-2xl font-black text-destructive uppercase tracking-tight mb-2">Access Denied</h2>
                    <p className="text-muted-foreground font-bold">You do not have the privilege to view books.</p>
                </div>
            </div>
        )
    }

    const response = await getBooksForFollowUp()
    const books = response.success ? (response.data ?? []) : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-secondarycolor">
                        <ClipboardList className="size-8" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] opacity-50">Book Shelf</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Book <span className="text-secondarycolor not-italic">Follow Up</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight">
                        Track every book&apos;s latest edition and where it sits in production.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border-2 border-primarycolor/10 bg-white px-4 py-3">
                    <BookOpen className="size-4 text-primarycolor/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Total books
                    </span>
                    <span className="text-sm font-black text-primarycolor">{books.length}</span>
                </div>
            </div>

            {response.success ? (
                <BookFollowUpTable data={books} />
            ) : (
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center text-destructive font-bold">
                    Failed to load books. Please refresh the page.
                </div>
            )}
        </div>
    )
}
