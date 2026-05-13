import React from 'react'
import { getBooks } from '../../../actions/get-books'
import { BooksShelf } from '../../../../components/admin_dashboard_components/BooksShelf'

export default async function BookShelfPage() {
    const response = await getBooks()
    const books = response.success ? response.data : []

    return (
        <div className="w-full py-10 px-4 md:px-8 max-w-[1600px] mx-auto">
            <div className="mb-10 space-y-2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primarycolor uppercase italic">Book <span className="text-secondarycolor not-italic">Shelf</span></h1>
                <p className="text-muted-foreground font-bold tracking-tight">Browse your collection visually with high-resolution covers and quick access.</p>
            </div>

            {response.success ? (
                <BooksShelf data={books as never[]} />
            ) : (
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center text-destructive font-bold">
                    Failed to load shelf. Please refresh the page.
                </div>
            )}
        </div>
    )
}
