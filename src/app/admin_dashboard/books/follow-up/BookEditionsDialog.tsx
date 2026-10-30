"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendar } from "@/lib/calendar-context";
import { cn } from "@/lib/utils";
import {
  updateEditionStatus,
  type BookFollowUpRow,
} from "@/app/actions/book-follow-up-actions";
import { STATUS_ORDER, statusLabel } from "./follow-up-sort";
import { statusBadgeClass } from "./StatusBadge";

interface BookEditionsDialogProps {
  book: BookFollowUpRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookEditionsDialog({
  book,
  open,
  onOpenChange,
}: BookEditionsDialogProps) {
  const { formatDate } = useCalendar();
  const router = useRouter();

  // Optimistic status per edition while the server action runs.
  const [statusOverrides, setStatusOverrides] = useState<Record<number, string>>(
    {}
  );
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    setStatusOverrides({});
  }, [book?.id]);

  const formatWhen = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return formatDate(date, "MMM d, yyyy");
  };

  const revertStatus = (editionId: number, previous: string | undefined) => {
    setStatusOverrides((current) => {
      const next = { ...current };
      if (previous === undefined) delete next[editionId];
      else next[editionId] = previous;
      return next;
    });
  };

  const handleStatusChange = async (editionId: number, nextStatus: string) => {
    const previous = statusOverrides[editionId];
    setStatusOverrides((current) => ({ ...current, [editionId]: nextStatus }));
    setSavingId(editionId);

    try {
      const result = await updateEditionStatus(editionId, nextStatus);
      if (!result.success) {
        revertStatus(editionId, previous);
        toast.error(result.error || "Failed to update the status");
        return;
      }
      toast.success("Edition status updated");
      router.refresh();
    } catch (error) {
      console.error(error);
      revertStatus(editionId, previous);
      toast.error("Failed to update the status");
    } finally {
      setSavingId(null);
    }
  };

  const editions = book?.editions ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90dvh] flex flex-col gap-3 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-sm font-black uppercase italic text-primarycolor flex items-center gap-2 pr-8">
            <Layers className="size-4 shrink-0" />
            <span className="truncate">{book?.title || "Book editions"}</span>
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {editions.length} edition{editions.length === 1 ? "" : "s"} · newest
            first · change the status from the dropdown
          </DialogDescription>
        </DialogHeader>

        <div
          tabIndex={0}
          aria-label="Edition list"
          className="min-h-0 flex-1 max-h-[60dvh] overflow-y-auto overscroll-contain space-y-2 pr-2 -mr-1 outline-none focus-visible:ring-2 focus-visible:ring-primarycolor/30 rounded-lg [scrollbar-width:thin] [scrollbar-color:var(--primarycolor,#408A71)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primarycolor/25 [&::-webkit-scrollbar-thumb:hover]:bg-primarycolor/50"
        >
          {editions.length === 0 ? (
            <div className="py-16 text-center opacity-50">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                No editions for this book
              </p>
            </div>
          ) : (
            editions.map((edition, index) => {
              const isLatest = index === 0;
              const currentStatus =
                statusOverrides[edition.id] ?? edition.status ?? null;
              const isSaving = savingId === edition.id;

              return (
                <div
                  key={edition.id}
                  className={cn(
                    "rounded-2xl border-2 p-4 transition-colors",
                    isLatest
                      ? "border-primarycolor/25 bg-primarycolor/[0.03]"
                      : "border-slate-100 bg-white"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-primarycolor text-sm leading-tight">
                          {edition.edition_name || "—"}
                        </span>
                        {isLatest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-primarycolor text-white">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Created {formatWhen(edition.createdAt)}
                      </div>
                    </div>

                    <Select
                      value={currentStatus ?? ""}
                      onValueChange={(value) =>
                        handleStatusChange(edition.id, value)
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger
                        size="sm"
                        aria-label={`Production status for ${edition.edition_name || "edition"}`}
                        className={cn(
                          "h-7 w-auto gap-1.5 rounded-full border px-2.5 text-[10px] font-black uppercase tracking-widest self-start",
                          currentStatus
                            ? statusBadgeClass(currentStatus)
                            : "border-dashed border-slate-200 bg-slate-50 text-slate-400"
                        )}
                      >
                        <SelectValue placeholder="Set status" />
                        {isSaving && (
                          <Loader2 className="size-3 animate-spin" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_ORDER.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-[11px] font-bold"
                          >
                            {statusLabel(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Remaining copies
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-lg font-black text-primarycolor tabular-nums leading-none">
                        {edition.stock.total.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                        Central {edition.stock.central.toLocaleString()} · Stores{" "}
                        {edition.stock.stores.toLocaleString()} · Printers{" "}
                        {edition.stock.printers.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {editions.length > 3 && (
          <p className="shrink-0 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
            Scroll the list to see all {editions.length} editions
          </p>
        )}

        <DialogFooter className="shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] border-2"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
