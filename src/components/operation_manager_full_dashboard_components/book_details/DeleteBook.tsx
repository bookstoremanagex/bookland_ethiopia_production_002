"use client";

import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../../ui/button';
import { deleteBook } from '../../../app/actions/book-actions';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DeleteBookProps {
  bookId: string;
  bookTitle: string;
}

export default function DeleteBook({ bookId, bookTitle }: DeleteBookProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      const response = await deleteBook(bookId);
      if (response.success) {
        toast.success("Book deleted successfully");
        router.push(`${dashboardRoot}/production/books`);
      } else {
        toast.error(response.error || "Failed to delete book");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-card rounded-3xl p-10 border-2 border-rose-500/10 shadow-2xl space-y-10">
        <div className="flex items-center gap-6">
          <div className="size-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20">
            <ShieldAlert className="size-10" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-rose-500 uppercase tracking-tight">Danger <span className="text-secondarycolor">Zone</span></h2>
            <p className="text-muted-foreground font-bold tracking-tight">You are about to remove this title from the active inventory.</p>
          </div>
        </div>

        <div className="p-8 bg-rose-500/5 rounded-3xl border-2 border-rose-500/10 space-y-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="size-6 text-rose-500 shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-rose-950 font-black uppercase tracking-widest text-sm">Permanent Action Warning</p>
              <p className="text-rose-900/70 font-bold leading-relaxed">
                Deleting <span className="text-rose-600 font-black italic">"{bookTitle}"</span> will hide it from all public listings and admin views. While this is a soft delete, it cannot be undone via the standard dashboard interface.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-rose-500/10">
            <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em]">Type <span className="text-rose-600 underline">DELETE</span> to confirm</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="flex-1 h-14 px-6 rounded-2xl bg-white border-2 border-rose-500/20 text-xl font-black text-rose-600 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 transition-all"
                placeholder="Type here..."
              />
              <Button
                variant="destructive"
                className={cn(
                  "h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 transition-all",
                  confirmText === "DELETE" ? "opacity-100 scale-100" : "opacity-50 scale-95 grayscale cursor-not-allowed"
                )}
                onClick={handleDelete}
                disabled={isDeleting || confirmText !== "DELETE"}
              >
                {isDeleting ? "Processing..." : "Confirm Deletion"}
                <Trash2 className="ml-2 size-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold text-sm italic">
          <ArrowRight className="size-4" />
          This will also archive all associated translation project history
        </div>
      </div>
    </div>
  );
}
