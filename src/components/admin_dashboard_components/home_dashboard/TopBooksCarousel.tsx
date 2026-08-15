"use client";

import { useRef, useState } from "react";
import { TrendingUp, BookOpen, Crown } from "lucide-react";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue, wrap } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopBook {
  id: number;
  uniqueCode: string;
  title: string;
  author: string;
  bookImage: string | null;
  totalQty: number;
}

interface TopBooksCarouselProps {
  books: TopBook[];
}

const BASE_VELOCITY = 24;

export function TopBooksCarousel({ books }: TopBooksCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, clientX: 0, moved: false });

  const visibleBooks = books.filter((b) => !failedImages.has(b.id));

  const copyWidth = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const gap = 16;
    return Math.max(1, (track.scrollWidth - gap) / 2);
  };

  useAnimationFrame((_, delta) => {
    if (isDragging.current) return;
    const width = copyWidth();
    if (width <= 0) return;
    const moveBy = BASE_VELOCITY * (delta / 1000);
    x.set(wrap(-width, 0, x.get() - moveBy));
  });

  const markFailed = (id: number) => {
    setFailedImages((prev) => new Set(prev).add(id));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: x.get(), clientX: e.clientX, moved: false };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.clientX;
    if (Math.abs(dx) > 5) dragStart.current.moved = true;
    const width = copyWidth();
    x.set(width > 0 ? wrap(-width, 0, dragStart.current.x + dx) : dragStart.current.x + dx);
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStart.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragStart.current.moved = false;
  };

  const renderCards = (keyPrefix: string) =>
    visibleBooks.map((book, index) => (
      <Link
        key={`${keyPrefix}-${book.id}`}
        href={`/admin_dashboard/books/${book.uniqueCode}`}
        className="group relative flex flex-col shrink-0 w-[240px] overflow-hidden rounded-2xl border-2 border-slate-100 bg-white snap-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primarycolor/30"
      >
        <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
          {book.bookImage ? (
            <img
              src={book.bookImage}
              alt={book.title}
              loading="lazy"
              onError={() => markFailed(book.id)}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full flex items-center justify-center">
              <BookOpen className="size-10 text-slate-200" />
            </div>
          )}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur text-white font-black text-[10px] uppercase tracking-widest",
              index === 0 && "bg-gradient-to-r from-amber-500 to-yellow-500"
            )}>
              {index === 0 && <Crown className="size-3" />}
              #{index + 1}
            </span>
          </div>
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-black text-xs shadow-lg">
              <TrendingUp className="size-3" />
              {book.totalQty.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 p-4">
          <h3 className="font-black text-sm text-slate-800 leading-tight line-clamp-2 group-hover:text-primarycolor transition-colors">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-[11px] font-bold text-slate-400 truncate">
              {book.author}
            </p>
          )}
        </div>
      </Link>
    ));

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-white p-4 gradient-shadow sm:p-6 lg:rounded-3xl lg:p-8">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor" aria-hidden />
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)" }} aria-hidden />

      <div className="relative mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30">
            <TrendingUp className="size-5" />
            <span className="absolute inset-0 -z-10 rounded-2xl bg-primarycolor/40 animate-ping" style={{ animationDuration: "2.2s" }} aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              Top 20% <span className="bg-gradient-to-r from-primarycolor to-secondarycolor bg-clip-text text-transparent">Best Sellers</span>
            </h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              All-time performance · {visibleBooks.length} books
            </p>
          </div>
        </div>
      </div>

      {visibleBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <BookOpen className="size-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500">No best sellers yet</p>
          <p className="text-xs text-slate-400">Books sold through approved orders and active rounds will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden" onClickCapture={handleClickCapture}>
          <motion.div
            ref={trackRef}
            style={{ x, touchAction: "pan-y", willChange: "transform" }}
            className="flex gap-4 cursor-grab active:cursor-grabbing select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {renderCards("a")}
            {renderCards("b")}
          </motion.div>
        </div>
      )}
    </div>
  );
}