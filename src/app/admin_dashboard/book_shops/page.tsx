import React from 'react';
import { getBookShops, checkCurrentUserRole } from '../../actions/book-shop-actions';
import BookShopManagement from '../book_shops/BookShopManagement';

export default async function BookShopsPage() {
    const permission = await checkCurrentUserRole("Viewing BookShops")
    if (!permission.enabled) {
        return (
            <div className="w-full py-10 px-4 md:px-8 max-w-none mx-auto">
                <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl text-center">
                    <h2 className="text-2xl font-black text-destructive uppercase tracking-tight mb-2">Access Denied</h2>
                    <p className="text-muted-foreground font-bold">You do not have the privilege to view book shops.</p>
                </div>
            </div>
        )
    }

    const response = await getBookShops();

    return (
        <div className="p-4 md:p-8 space-y-8 md:space-y-10 min-h-screen bg-primarycolor/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Book <span className="text-secondarycolor not-italic">Shops</span>
                    </h1>
                    <p className="text-muted-foreground font-bold mt-2 md:mt-4 text-xs md:text-lg tracking-tight uppercase">Management & Partner Distribution</p>
                </div>
            </div>

            <BookShopManagement initialShops={response.data || []} />
        </div>
    );
}
