import React from 'react';
import { getBookShops } from '../../actions/book-shop-actions';
import BookShopManagement from '../book_shops/BookShopManagement';

export default async function BookShopsPage() {
    const response = await getBookShops();

    return (
        <div className="p-4 md:p-8 space-y-8 md:space-y-10 min-h-screen bg-primarycolor/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-primarycolor uppercase tracking-tighter italic leading-tight md:leading-none">
                        Book <span className="text-secondarycolor not-italic">Shops</span>
                    </h1>
                    <p className="text-muted-foreground font-bold mt-2 md:mt-4 text-xs md:text-lg tracking-tight uppercase">Management & Partner Distribution</p>
                </div>
            </div>

            <BookShopManagement initialShops={response.data || []} />
        </div>
    );
}
