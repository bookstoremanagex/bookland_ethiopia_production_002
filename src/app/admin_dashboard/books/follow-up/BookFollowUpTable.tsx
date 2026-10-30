"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpWideNarrow,
  BookMarked,
  Clock3,
  Languages,
  MoreHorizontal,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/lib/calendar-context";
import type { BookFollowUpRow } from "@/app/actions/book-follow-up-actions";
import {
  NO_STATUS,
  buildStatusCounts,
  filterAndSortRows,
  statusLabel,
  type SortMode,
} from "./follow-up-sort";
import StatusEditor from "./StatusEditor";
import BookEditionsDialog from "./BookEditionsDialog";

const SORT_OPTIONS: {
  value: SortMode;
  label: string;
  hint: string;
  icon: React.ElementType;
}[] = [
  {
    value: "alphabet-amharic",
    label: "Alphabet",
    hint: "Amharic first",
    icon: Languages,
  },
  {
    value: "alphabet-english",
    label: "Alphabet",
    hint: "English first",
    icon: Languages,
  },
  {
    value: "edition-created",
    label: "Latest edition",
    hint: "Newest edition created",
    icon: BookMarked,
  },
  {
    value: "book-created",
    label: "Book added",
    hint: "Newest book added",
    icon: Clock3,
  },
];

const PROJECT_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not started",
  STARTED: "Started",
  ONPROGRESS: "On progress",
  COMPLETED: "Completed",
};

const ACTION_LINK_CLASS =
  "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all active:scale-95";

/**
 * The action follows the latest edition's stage, because production status
 * lives on the edition:
 * - `TRANSLATION` → "Go to Translation" (links to the project, disabled with a
 *   hint when no project was started yet)
 * - any other status → "Edition Details", linking to that edition's page
 * - no edition → an em dash
 */
function StageAction({ book }: { book: BookFollowUpRow }) {
  const edition = book.latestEdition;

  if (!edition) {
    return (
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
        —
      </span>
    );
  }

  if (edition.status !== "TRANSLATION") {
    return (
      <div className="space-y-1">
        <Link
          href={`/admin_dashboard/books/editions/${edition.id}`}
          className={cn(
            ACTION_LINK_CLASS,
            "border-secondarycolor/20 bg-secondarycolor/5 text-secondarycolor hover:bg-secondarycolor hover:text-white hover:border-secondarycolor"
          )}
        >
          Edition Details
          <ArrowRight className="size-3.5" />
        </Link>
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
          {edition.edition_name || "Latest edition"}
        </p>
      </div>
    );
  }

  const project = book.translationProject;

  if (!project) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          disabled
          title="No translation project has been started for this book"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
        >
          Go to Translation
          <ArrowRight className="size-3.5" />
        </button>
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
          No project started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Link
        href={`/admin_dashboard/production/translation_work/${project.id}`}
        className={cn(
          ACTION_LINK_CLASS,
          "border-primarycolor/20 bg-primarycolor/5 text-primarycolor hover:bg-primarycolor hover:text-white hover:border-primarycolor"
        )}
      >
        Go to Translation
        <ArrowRight className="size-3.5" />
      </Link>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
        {PROJECT_STATUS_LABELS[project.status] ??
          project.status.toLowerCase().replace(/_/g, " ")}
      </p>
    </div>
  );
}

export default function BookFollowUpTable({
  data,
}: {
  data: BookFollowUpRow[];
}) {
  const { formatDate } = useCalendar();
  const [search, setSearch] = React.useState("");
  const [statuses, setStatuses] = React.useState<string[]>([]);
  const [sortMode, setSortMode] = React.useState<SortMode>("alphabet-amharic");
  const [reversed, setReversed] = React.useState(false);
  // Keep only the id in state so a `router.refresh()` (e.g. after a status
  // change) re-derives the dialog content from the fresh server data.
  const [detailsBookId, setDetailsBookId] = React.useState<number | null>(null);

  const detailsBook = React.useMemo(
    () => data.find((book) => book.id === detailsBookId) ?? null,
    [data, detailsBookId]
  );

  const statusCounts = React.useMemo(() => buildStatusCounts(data), [data]);

  const rows = React.useMemo(
    () => filterAndSortRows(data, { search, statuses, sortMode, reversed }),
    [data, search, statuses, sortMode, reversed]
  );

  const toggleStatus = (key: string) => {
    setStatuses((current) =>
      current.includes(key)
        ? current.filter((value) => value !== key)
        : [...current, key]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatuses([]);
    setSortMode("alphabet-amharic");
    setReversed(false);
  };

  const hasFilters =
    search.trim() !== "" || statuses.length > 0 || reversed || sortMode !== "alphabet-amharic";

  const formatWhen = (iso: string | null | undefined) => {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return formatDate(date, "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      {/* Search + result count */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primarycolor/40 pointer-events-none" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search a book by title..."
            className="h-12 pl-11 pr-11 rounded-2xl border-2 border-primarycolor/10 bg-white font-bold text-sm focus-visible:ring-primarycolor/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:bg-primarycolor/10 hover:text-primarycolor transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 h-12 px-4 rounded-2xl border-2 border-primarycolor/10 bg-white">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Showing
            </span>
            <span className="text-sm font-black text-primarycolor">
              {rows.length}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              of {data.length}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="h-12 px-4 rounded-2xl border-2 border-primarycolor/10 text-primarycolor font-black text-[10px] uppercase tracking-widest hover:bg-primarycolor/5 disabled:opacity-40"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Status filter */}
      <div className="rounded-3xl border-2 border-primarycolor/10 bg-white p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Filter by status
          </span>
          {statuses.length > 0 && (
            <button
              type="button"
              onClick={() => setStatuses([])}
              className="text-[10px] font-black uppercase tracking-widest text-secondarycolor hover:text-primarycolor transition-colors cursor-pointer"
            >
              Clear ({statuses.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatuses([])}
            aria-pressed={statuses.length === 0}
            className={cn(
              "px-3.5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
              statuses.length === 0
                ? "bg-primarycolor text-white border-primarycolor shadow-md shadow-primarycolor/20"
                : "bg-white text-primarycolor/70 border-slate-100 hover:border-primarycolor/30"
            )}
          >
            All ({data.length})
          </button>

          {statusCounts.list.map((key) => {
            const active = statuses.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleStatus(key)}
                aria-pressed={active}
                className={cn(
                  "px-3.5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
                  active
                    ? "bg-primarycolor text-white border-primarycolor shadow-md shadow-primarycolor/20"
                    : "bg-white text-slate-600 border-slate-100 hover:border-primarycolor/30"
                )}
              >
                {statusLabel(key === NO_STATUS ? null : key)} (
                {statusCounts.counts.get(key) ?? 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting */}
      <div className="rounded-3xl border-2 border-primarycolor/10 bg-white p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Sort by
          </span>
          <button
            type="button"
            onClick={() => setReversed((value) => !value)}
            aria-pressed={reversed}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
              reversed
                ? "bg-secondarycolor text-white border-secondarycolor"
                : "bg-white text-slate-600 border-slate-100 hover:border-primarycolor/30"
            )}
          >
            {reversed ? (
              <ArrowUpWideNarrow className="size-3.5" />
            ) : (
              <ArrowDownWideNarrow className="size-3.5" />
            )}
            Reverse {reversed ? "on" : "off"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
          {SORT_OPTIONS.map((option) => {
            const active = sortMode === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSortMode(option.value)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all cursor-pointer",
                  active
                    ? "bg-primarycolor/5 border-primarycolor shadow-sm"
                    : "bg-white border-slate-100 hover:border-primarycolor/30"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-primarycolor" : "text-primarycolor/40"
                  )}
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[11px] font-black uppercase tracking-widest truncate",
                      active ? "text-primarycolor" : "text-slate-700"
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="block text-[10px] font-bold text-muted-foreground truncate">
                    {option.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border-2 border-primarycolor/10 bg-white overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primarycolor/5 hover:bg-primarycolor/5">
                <TableHead className="w-16 text-[10px] font-black uppercase tracking-widest text-primarycolor">
                  No.
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                  Book Title
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                  Latest Edition
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                  Status
                </TableHead>
                <TableHead className="w-[190px] text-[10px] font-black uppercase tracking-widest text-primarycolor">
                  Action
                </TableHead>
                <TableHead className="w-[130px] text-right text-[10px] font-black uppercase tracking-widest text-primarycolor">
                  More
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <Search className="size-6 text-primarycolor" />
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        No books match these filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((book, index) => {
                  return (
                    <TableRow
                      key={book.id}
                      className="hover:bg-primarycolor/[0.03] transition-colors"
                    >
                      <TableCell className="text-xs font-black text-muted-foreground tabular-nums">
                        {index + 1}
                      </TableCell>
                      <TableCell className="max-w-[520px]">
                        <div className="font-black text-primarycolor text-sm leading-tight">
                          {book.title || "—"}
                        </div>
                        {(book.author || book.short_name) && (
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                            {book.author}
                            {book.author && book.short_name ? " · " : ""}
                            {book.short_name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {book.latestEdition ? (
                          <div className="space-y-0.5">
                            <div className="text-xs font-black text-slate-700">
                              {book.latestEdition.edition_name || "—"}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {formatWhen(book.latestEdition.createdAt)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            No edition
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {book.latestEdition ? (
                          <StatusEditor
                            editionId={book.latestEdition.id}
                            status={book.latestEdition.status}
                            editionName={book.latestEdition.edition_name}
                          />
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            No edition
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StageAction book={book} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDetailsBookId(book.id)}
                          className="rounded-xl border-2 border-primarycolor/15 text-primarycolor font-black text-[10px] uppercase tracking-widest hover:bg-primarycolor/5 gap-1.5"
                        >
                          <MoreHorizontal className="size-4" />
                          More
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-primarycolor/5">
          {rows.length === 0 ? (
            <div className="py-16 text-center opacity-50">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                No books match these filters
              </p>
            </div>
          ) : (
            rows.map((book, index) => {
              return (
                <div key={book.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-[10px] font-black text-muted-foreground tabular-nums pt-1">
                        {index + 1}.
                      </span>
                      <div className="min-w-0">
                        <div className="font-black text-primarycolor text-sm leading-tight">
                          {book.title || "—"}
                        </div>
                        {book.author && (
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                            {book.author}
                          </div>
                        )}
                      </div>
                    </div>
                    {book.latestEdition ? (
                      <StatusEditor
                        editionId={book.latestEdition.id}
                        status={book.latestEdition.status}
                        editionName={book.latestEdition.edition_name}
                        className="shrink-0"
                      />
                    ) : (
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                        No edition
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 pl-5">
                    <div className="text-[11px] font-bold text-slate-700 truncate">
                      {book.latestEdition?.edition_name || "No edition"}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
                      {formatWhen(book.latestEdition?.createdAt)}
                    </div>
                  </div>
                  <div className="pl-5 pt-1 flex flex-wrap items-start gap-2">
                    {book.latestEdition && <StageAction book={book} />}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailsBookId(book.id)}
                      className="rounded-xl border-2 border-primarycolor/15 text-primarycolor font-black text-[10px] uppercase tracking-widest hover:bg-primarycolor/5 gap-1.5"
                    >
                      <MoreHorizontal className="size-4" />
                      More options
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <BookEditionsDialog
        book={detailsBook}
        open={detailsBookId !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsBookId(null);
        }}
      />
    </div>
  );
}
