"use client";

import * as React from "react";
import { Check, ChevronsUpDown, User, X } from "lucide-react";

import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";

export type TranslatorOption = { id: number; name: string | null };

interface TranslatorMultiSelectProps {
  translators: TranslatorOption[];
  /** Selected translator ids, in pick order (first = lead translator). */
  value: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Searchable multi-select for translators. The popover stays open while
 * toggling so several translators can be picked in one go.
 */
export default function TranslatorMultiSelect({
  translators,
  value,
  onChange,
  placeholder = "Choose translators...",
  error,
  disabled,
  className,
}: TranslatorMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(
    () =>
      value
        .map((id) => translators.find((translator) => translator.id === id))
        .filter((translator): translator is TranslatorOption => Boolean(translator)),
    [value, translators]
  );

  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((current) => current !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl justify-between font-bold",
              selected.length === 0 && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <User className="size-4 shrink-0 opacity-60" />
              {selected.length === 0
                ? placeholder
                : selected.length === 1
                  ? selected[0].name || "Unnamed translator"
                  : `${selected.length} translators selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl">
          <Command className="rounded-2xl">
            <CommandInput placeholder="Search translators..." className="h-12" />
            <CommandList className="max-h-[240px]">
              <CommandEmpty>No translator found.</CommandEmpty>
              <CommandGroup>
                {translators.map((translator) => {
                  const isSelected = value.includes(translator.id);
                  return (
                    <CommandItem
                      key={translator.id}
                      value={`${translator.name ?? ""} ${translator.id}`}
                      onSelect={() => toggle(translator.id)}
                      className="h-12 px-4 font-bold text-secondarycolor hover:bg-primarycolor/10 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primarycolor",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {translator.name || "Unnamed translator"}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((translator, index) => (
            <span
              key={translator.id}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-primarycolor/10 bg-primarycolor/5 pl-3 pr-1.5 py-1 text-[11px] font-black text-secondarycolor"
            >
              {translator.name || "Unnamed translator"}
              {index === 0 && (
                <span className="text-[9px] uppercase tracking-widest text-primarycolor/70">
                  Lead
                </span>
              )}
              <button
                type="button"
                onClick={() => toggle(translator.id)}
                disabled={disabled}
                aria-label={`Remove ${translator.name || "translator"}`}
                className="rounded-full p-0.5 hover:bg-primarycolor/15 transition-colors disabled:opacity-50"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-xs font-bold text-destructive ml-1">{error}</p>}
    </div>
  );
}
