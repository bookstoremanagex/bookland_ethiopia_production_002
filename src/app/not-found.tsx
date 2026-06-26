"use client";

import Link from "next/link";
import { BookOpen, Home, ArrowLeft, Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-2xl mx-auto text-center space-y-10">
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-3 mb-4">
          <div className="size-12 rounded-xl bg-primarycolor/10 flex items-center justify-center">
            <BookOpen className="size-6 text-primarycolor" />
          </div>
          <span className="text-lg font-black tracking-widest uppercase text-primarycolor">
            Book Land Ethiopia
          </span>
        </Link>

        {/* 404 Graphic */}
        <div className="relative">
          <div className="text-[12rem] md:text-[18rem] font-black text-primarycolor/5 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-28 md:size-36 rounded-[2.5rem] bg-primarycolor/5 border-4 border-primarycolor/10 flex items-center justify-center shadow-2xl shadow-primarycolor/10">
              <Frown className="size-14 md:size-20 text-primarycolor/40" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3 max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-primarycolor uppercase italic tracking-tight">
            Page Not <span className="text-secondarycolor not-italic">Found</span>
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 h-14 px-8 rounded-[1.5rem] bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
          >
            <Home className="size-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 h-14 px-8 rounded-[1.5rem] border-2 border-primarycolor/20 text-primarycolor font-black uppercase tracking-widest text-xs hover:bg-primarycolor/5 hover:border-primarycolor/30 transition-all duration-300 active:scale-[0.98]"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>

        {/* Decorative */}
        <div className="flex items-center justify-center gap-3 text-primarycolor/20">
          <div className="h-px w-16 bg-primarycolor/10" />
          <BookOpen className="size-4" />
          <div className="h-px w-16 bg-primarycolor/10" />
        </div>
      </div>
    </div>
  );
}
