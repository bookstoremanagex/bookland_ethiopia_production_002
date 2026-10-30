"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { updateEditionStatus } from "@/app/actions/book-follow-up-actions";
import { STATUS_ORDER, statusLabel } from "./follow-up-sort";
import { statusBadgeClass } from "./StatusBadge";

interface StatusEditorProps {
  /** Edition whose status is being changed. */
  editionId: number;
  status: string | null;
  editionName?: string | null;
  className?: string;
}

/**
 * Status chip that opens a dropdown to change the edition's production status.
 * The new status is shown immediately (optimistic) and the table refreshes
 * through `router.refresh()` once the server action succeeds.
 */
export default function StatusEditor({
  editionId,
  status,
  editionName,
  className,
}: StatusEditorProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Clear the optimistic value when the server data (or the edition) changes.
  useEffect(() => {
    setPending(null);
  }, [editionId, status]);

  const current = pending ?? status;

  const handleSelect = async (next: string) => {
    if (saving || next === current) return;

    setPending(next);
    setSaving(true);

    try {
      const result = await updateEditionStatus(editionId, next);
      if (!result.success) {
        setPending(null);
        toast.error(result.error || "Failed to update the status");
        return;
      }
      toast.success("Edition status updated");
      router.refresh();
    } catch (error) {
      console.error(error);
      setPending(null);
      toast.error("Failed to update the status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={saving}
          title={`Change the status of ${editionName || "this edition"}`}
          aria-label={`Production status: ${statusLabel(
            current
          )}. Click to change.`}
          className={cn(
            "group inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap transition-colors",
            "hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-70",
            current
              ? statusBadgeClass(current)
              : "border-dashed border-slate-200 bg-slate-50 text-slate-400",
            className
          )}
        >
          {statusLabel(current)}
          {saving ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <ChevronDown className="size-3 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest">
          Set production status
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_ORDER.map((option) => {
          const isCurrent = option === current;
          return (
            <DropdownMenuItem
              key={option}
              disabled={saving || isCurrent}
              onSelect={() => handleSelect(option)}
              className="text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <span className="flex-1">{statusLabel(option)}</span>
              {isCurrent && <Check className="size-3.5 text-primarycolor" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
