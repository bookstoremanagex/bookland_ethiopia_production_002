import React from 'react'
import { getBooks } from '../../actions/get-books'
import { BooksTable } from '../../../components/admin_dashboard_components/BooksTable'
import { checkCurrentUserRole } from '../../actions/book-shop-actions'

export default async function BooksPage() {
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

    const response = await getBooks()
    const books = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Books <span className="text-secondarycolor not-italic">Management</span></h1>
                    <p className="text-muted-foreground font-bold tracking-tight">Precision control over your inventory with advanced filtering.</p>
                </div>
            </div>

            {response.success ? (
                <BooksTable data={books as never[]} />
            ) : (
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center text-destructive font-bold">
                    Failed to load books. Please refresh the page.
                </div>
            )}
        </div>
    )
}
