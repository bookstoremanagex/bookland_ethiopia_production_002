"use client";

import { cn } from "@/lib/utils";
import { NO_STATUS, statusKey, statusLabel } from "./follow-up-sort";

const STATUS_STYLES: Record<string, string> = {
  ON_PRODUCTION: "bg-amber-50 text-amber-700 border-amber-200",
  TRANSLATION: "bg-sky-50 text-sky-700 border-sky-200",
  DESIGN: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  PRINTING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PREPRINTING: "bg-violet-50 text-violet-700 border-violet-200",
  READY: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [NO_STATUS]: "bg-slate-50 text-slate-500 border-slate-200",
};

export function statusBadgeClass(status: string | null) {
  const key = statusKey(status);
  return STATUS_STYLES[key] ?? STATUS_STYLES[NO_STATUS];
}

export default function StatusBadge({
  status,
  className,
}: {
  status: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap",
        statusBadgeClass(status),
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
