"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, PackageOpen } from "lucide-react";
import { THRESHOLD_OPTIONS, DEFAULT_THRESHOLD } from "./low-stock-constants";

interface LowStockFiltersProps {
  threshold: number;
  includeTransfer: boolean;
}

export function LowStockFilters({ threshold, includeTransfer }: LowStockFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const update = React.useCallback(
    (nextThreshold: number, nextInclude: boolean) => {
      const params = new URLSearchParams();
      if (nextThreshold !== DEFAULT_THRESHOLD) params.set("threshold", String(nextThreshold));
      if (nextInclude) params.set("includeTransfer", "1");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-card p-6 rounded-2xl border-2 border-primarycolor/5 shadow-md">
      <div className="flex items-center gap-3 text-primarycolor">
        <SlidersHorizontal className="size-6" />
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Low Stock Filters
        </span>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Max copies per book
          </span>
          <Select
            value={String(threshold)}
            onValueChange={(value) => update(Number(value), includeTransfer)}
          >
            <SelectTrigger className="h-12 w-full sm:w-56 rounded-2xl border-2 border-primarycolor/10 bg-background/50 focus:border-primarycolor data-[size=default]:h-12 px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THRESHOLD_OPTIONS.map((t) => (
                <SelectItem key={t} value={String(t)}>
                  Fewer than {t} copies
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none bg-primarycolor/5 px-4 py-3 rounded-2xl border-2 border-primarycolor/10 transition-colors hover:bg-primarycolor/10 h-12 mt-0 sm:mt-5">
          <Checkbox
            checked={includeTransfer}
            onCheckedChange={(checked) => update(threshold, checked === true)}
          />
          <span className="flex items-center gap-2 text-xs font-black text-primarycolor uppercase tracking-widest">
            <PackageOpen className="size-4" />
            Include ready-to-transfer
          </span>
        </label>
      </div>
    </div>
  );
}