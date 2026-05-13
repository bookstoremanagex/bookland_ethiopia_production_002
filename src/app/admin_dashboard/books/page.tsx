import React from 'react'
import { getBooks } from '../../actions/get-books'
import { BooksTable } from '../../../components/admin_dashboard_components/BooksTable'

export default async function BooksPage() {
    const response = await getBooks()
    const books = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primarycolor uppercase italic">Books <span className="text-secondarycolor not-italic">Management</span></h1>
                    <p className="text-muted-foreground font-bold tracking-tight">Precision control over your inventory with advanced filtering.</p>
                </div>
                {/* <Button variant="outline" className="h-12 px-6 border-2 border-primarycolor/20 text-primarycolor font-bold hover:bg-primarycolor/5 rounded-xl flex items-center gap-2 transition-all active:scale-95" asChild>
                    <a href="/admin_dashboard/books/shelf">
                        <Library className="size-5" />
                        View in Book Shelf
                    </a>
                </Button> */}
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
