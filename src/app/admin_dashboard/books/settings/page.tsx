import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'
import { getBooksSettingsData } from '../../../actions/book-actions'
import { checkCurrentUserRole } from '../../../actions/book-shop-actions'
import BooksSettingsTable, { type SettingsBook } from './BooksSettingsTable'

export default async function BooksSettingsPage() {
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

    const response = await getBooksSettingsData()
    const books = response.success ? (response.data as SettingsBook[]) : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            {/* Mobile guard — this page is desktop-only */}
            <div className="md:hidden p-8 border-2 border-dashed border-primarycolor/20 bg-primarycolor/5 rounded-2xl text-center">
                <h2 className="text-lg font-black text-primarycolor uppercase tracking-tight mb-2">Desktop Only</h2>
                <p className="text-muted-foreground font-bold text-sm">Books settings can only be viewed on desktop. Please switch to a larger screen.</p>
                <Link
                    href="/admin_dashboard/books"
                    className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-black uppercase tracking-widest text-primarycolor hover:text-secondarycolor transition-colors"
                >
                    <ArrowLeft className="size-3.5" /> Back to Books
                </Link>
            </div>
            <div className="hidden md:flex mb-8 flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Link
                        href="/admin_dashboard/books"
                        className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-primarycolor/60 hover:text-primarycolor transition-colors"
                    >
                        <ArrowLeft className="size-3.5" /> Back to Books
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl flex items-center gap-3">
                        <span className="size-11 rounded-2xl border-2 border-primarycolor/20 text-primarycolor flex items-center justify-center bg-white">
                            <Settings className="size-5" />
                        </span>
                        Books <span className="text-secondarycolor not-italic">Settings</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight">Quick-edit book and edition info for everything currently in stock.</p>
                </div>
            </div>

            <div className="hidden md:block">
                {response.success ? (
                    <BooksSettingsTable initialBooks={books} />
                ) : (
                    <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center text-destructive font-bold">
                        Failed to load books settings. Please refresh the page.
                    </div>
                )}
            </div>
        </div>
    )
}
