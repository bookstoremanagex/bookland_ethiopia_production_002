import React from 'react'
import {
    Eye,
    BarChart3,
    BookOpen,
    Store,
    ShoppingBag,
    Activity
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import Link from "next/link"

import { getViewerStats } from '../actions/dashboard-stats'
import { getBooks } from '../actions/get-books'
import { getStores } from '../actions/get-stores'
import { getBookShops } from '../actions/book-shop-actions'

export default async function ViewerHomePage() {
    const statsResult = await getViewerStats();
    const stats = statsResult.success ? statsResult.data : { totalBooks: 0 };

    const booksRes = await getBooks();
    const storesRes = await getStores();
    const shopsRes = await getBookShops();

    const books = booksRes.success ? booksRes.data ?? [] : [];
    const stores = storesRes.success ? storesRes.data ?? [] : [];
    const shops = shopsRes.success ? shopsRes.data : [];

    const quickLinks = [
        { title: "Browse Books", desc: "Explore the full catalog", icon: BookOpen, href: "/viewer_dashboard/books" },
        { title: "Analytics", desc: "Platform statistics", icon: BarChart3, href: "/viewer_dashboard/statistics" },
        { title: "Stores", desc: "Physical locations", icon: Store, href: "/viewer_dashboard/stores" },
        { title: "Book Shops", desc: "Partner distribution", icon: ShoppingBag, href: "/viewer_dashboard/book_shops" },
    ];

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-10 bg-[#F8FAFC] min-h-screen">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 w-full md:w-auto">
                    <div className="flex items-center gap-3 text-secondarycolor">
                        <Eye className="size-6 md:size-8" />
                        <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] opacity-50">Public Data Portal</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Data <span className="text-secondarycolor not-italic">Viewer</span>
                    </h1>
                    <p className="text-muted-foreground font-bold tracking-tight text-sm md:text-lg max-w-xl">
                        Explore platform-wide statistics, browse the book catalog, and view public reports.
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-primarycolor/5 shadow-xl">
                    <div className="flex flex-col items-center px-6 border-r-2 border-primarycolor/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                        <span className="text-2xl font-black text-emerald-500">Online</span>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <Activity className="size-6 text-secondarycolor animate-pulse mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Read Only</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <BarChart3 className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Books Published</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">
                                {stats?.totalBooks.toLocaleString()}
                            </h2>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Store className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Stores</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">
                                {stores.length.toLocaleString()}
                            </h2>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-lg bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShoppingBag className="size-16 md:size-24" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Partner Book Shops</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl md:text-4xl font-black text-primarycolor italic leading-none">
                                {shops.length.toLocaleString()}
                            </h2>
                            <span className="text-xs font-black text-secondarycolor flex items-center mb-1 uppercase tracking-tighter">
                                {books.length.toLocaleString()} Titles
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {quickLinks.map((q) => (
                    <Link
                        key={q.title}
                        href={q.href}
                        className="group bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl flex items-center gap-6 hover:border-primarycolor/20 hover:shadow-2xl transition-all hover:-translate-y-1"
                    >
                        <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                            <q.icon className="size-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-primarycolor uppercase tracking-tight">{q.title}</h3>
                            <p className="text-muted-foreground font-bold text-sm">{q.desc}</p>
                        </div>
                        <div className="size-10 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                            →
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}