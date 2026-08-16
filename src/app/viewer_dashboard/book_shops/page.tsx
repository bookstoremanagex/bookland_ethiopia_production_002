import React from 'react';
import { getBookShops } from '../../actions/book-shop-actions';
import { BookShopsTable } from '../../../components/viewer_dashboard_components/BookShopsTable';

export default async function ViewerBookShopsPage() {
    const response = await getBookShops();

    return (
        <div className="p-4 md:p-8 space-y-8 md:space-y-10 min-h-screen bg-primarycolor/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Book <span className="text-secondarycolor not-italic">Shops</span>
                    </h1>
                    <p className="text-muted-foreground font-bold mt-2 md:mt-4 text-xs md:text-lg tracking-tight uppercase">Partner Distribution Network</p>
                </div>
            </div>

            <BookShopsTable data={response.data || []} />
        </div>
    );
}