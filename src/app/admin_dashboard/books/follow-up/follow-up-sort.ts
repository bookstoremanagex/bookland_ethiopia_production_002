// Pure sorting / status helpers for the Book Follow Up table.
// Kept separate from the component so the ordering rules can be unit-tested.

import type { BookFollowUpRow } from "@/app/actions/book-follow-up-actions";

export type SortMode =
  | "alphabet-amharic"
  | "alphabet-english"
  | "edition-created"
  | "book-created";

export type TitleGroup = "amharic" | "english" | "numbered";

export const NO_STATUS = "__none__";

/** Enum order from `books_productionstatus` in the Prisma schema. */
export const STATUS_ORDER = [
  "ON_PRODUCTION",
  "TRANSLATION",
  "DESIGN",
  "PRINTING",
  "PREPRINTING",
];

export const STATUS_LABELS: Record<string, string> = {
  ON_PRODUCTION: "On Production",
  TRANSLATION: "Translation",
  DESIGN: "Design",
  PRINTING: "Printing",
  PREPRINTING: "Pre-Printing",
  [NO_STATUS]: "No Status",
};

const GROUP_ORDER: Record<"amharic" | "english", TitleGroup[]> = {
  amharic: ["amharic", "english", "numbered"],
  english: ["english", "amharic", "numbered"],
};

const isEthiopicChar = (ch: string) => {
  const cp = ch.codePointAt(0) ?? 0;
  return cp >= 0x1200 && cp <= 0x137f;
};

export const classifyTitle = (title: string): TitleGroup => {
  const t = (title || "").trim();
  if (!t) return "english";
  if (/[0-9]/.test(t[0])) return "numbered";
  if (isEthiopicChar(t[0])) return "amharic";
  return "english";
};

// Code-point comparison: the Unicode Ethiopic block follows the traditional
// fidel order (ሀ ሁ ሂ ... ለ ሉ ሊ ...), so per-code-point comparison sorts
// Amharic in its own alphabet order.
export function compareEthiopic(a: string, b: string) {
  const A = Array.from(a);
  const B = Array.from(b);
  const len = Math.min(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const ca = A[i].codePointAt(0) ?? 0;
    const cb = B[i].codePointAt(0) ?? 0;
    if (ca !== cb) return ca - cb;
  }
  return A.length - B.length;
}

const latinCollator = new Intl.Collator("en", {
  sensitivity: "base",
  numeric: true,
});

const GROUP_COMPARATORS: Record<
  TitleGroup,
  (a: BookFollowUpRow, b: BookFollowUpRow) => number
> = {
  amharic: (a, b) => compareEthiopic(a.title, b.title),
  english: (a, b) => latinCollator.compare(a.title, b.title),
  numbered: (a, b) => latinCollator.compare(a.title, b.title),
};

const time = (iso: string | null | undefined) => {
  if (!iso) return Number.NEGATIVE_INFINITY;
  const value = Date.parse(iso);
  return Number.isNaN(value) ? Number.NEGATIVE_INFINITY : value;
};

/**
 * Positive result = `a` sorts before `b`.
 *
 * - `alphabet-amharic` / `alphabet-english`: group the titles by script, then
 *   sort inside each group with that script's own alphabet.
 * - `edition-created`: newest latest-edition first, books without an edition
 *   last.
 * - `book-created`: most recently added book first.
 */
export function compareRows(
  a: BookFollowUpRow,
  b: BookFollowUpRow,
  mode: SortMode
) {
  switch (mode) {
    case "alphabet-amharic":
    case "alphabet-english": {
      const order = GROUP_ORDER[mode === "alphabet-amharic" ? "amharic" : "english"];
      const groupA = classifyTitle(a.title);
      const groupB = classifyTitle(b.title);
      const indexA = order.indexOf(groupA);
      const indexB = order.indexOf(groupB);
      if (indexA !== indexB) return indexA - indexB;

      const primary = GROUP_COMPARATORS[groupA](a, b);
      if (primary !== 0) return primary;
      return latinCollator.compare(a.title, b.title);
    }
    case "edition-created": {
      const editionA = time(a.latestEdition?.createdAt);
      const editionB = time(b.latestEdition?.createdAt);
      if (editionA !== editionB) return editionB - editionA;
      return time(b.createdAt) - time(a.createdAt);
    }
    case "book-created":
      return time(b.createdAt) - time(a.createdAt);
    default:
      return 0;
  }
}

export function statusKey(status: string | null) {
  return status && status.trim() ? status : NO_STATUS;
}

/** Production status shown for a book = its latest edition's status. */
export function rowStatus(row: BookFollowUpRow) {
  return row.latestEdition?.status ?? null;
}

export function statusLabel(status: string | null) {
  const key = statusKey(status);
  return (
    STATUS_LABELS[key] ??
    key
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** Statuses present in the data, in enum order, with "no status" last. */
export function buildStatusCounts(rows: BookFollowUpRow[]) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = statusKey(rowStatus(row));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const known = STATUS_ORDER.filter((status) => counts.has(status));
  const unknown = Array.from(counts.keys()).filter(
    (key) => key !== NO_STATUS && !STATUS_ORDER.includes(key)
  );
  const list = [...known, ...unknown];
  if (counts.has(NO_STATUS)) list.push(NO_STATUS);

  return { counts, list };
}

export function filterAndSortRows(
  rows: BookFollowUpRow[],
  options: {
    search: string;
    statuses: string[];
    sortMode: SortMode;
    reversed: boolean;
  }
) {
  const needle = options.search.trim().toLowerCase();

  const filtered = rows.filter((row) => {
    if (
      options.statuses.length > 0 &&
      !options.statuses.includes(statusKey(rowStatus(row)))
    ) {
      return false;
    }
    if (!needle) return true;
    return row.title.toLowerCase().includes(needle);
  });

  return [...filtered].sort((a, b) => {
    const result = compareRows(a, b, options.sortMode);
    return options.reversed ? -result : result;
  });
}
