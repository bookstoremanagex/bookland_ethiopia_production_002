// Shared book-title ordering for the admin print dialogs.
//
// Titles are split into three groups (Amharic, English, numbered) and the user
// picks the group order. Inside a group the titles are sorted alphabetically in
// that group's own alphabet: Amharic follows the traditional fidel order (the
// Unicode Ethiopic block is laid out that way), English uses a case-insensitive
// locale comparison, and numbered titles compare numerically.

export type TitleGroup = "amharic" | "english" | "numbered";

/** Group order, e.g. "am-en-num" = Amharic, then English, then numbers. */
export type TitleSortOrder =
  | "am-en-num"
  | "am-num-en"
  | "en-am-num"
  | "en-num-am"
  | "num-en-am"
  | "num-am-en";

export const TITLE_GROUP_ORDERS: Record<TitleSortOrder, TitleGroup[]> = {
  "am-en-num": ["amharic", "english", "numbered"],
  "am-num-en": ["amharic", "numbered", "english"],
  "en-am-num": ["english", "amharic", "numbered"],
  "en-num-am": ["english", "numbered", "amharic"],
  "num-en-am": ["numbered", "english", "amharic"],
  "num-am-en": ["numbered", "amharic", "english"],
};

export const TITLE_SORT_OPTIONS: { value: TitleSortOrder; label: string }[] = [
  { value: "am-en-num", label: "Amharic → English → Numbers" },
  { value: "am-num-en", label: "Amharic → Numbers → English" },
  { value: "en-am-num", label: "English → Amharic → Numbers" },
  { value: "en-num-am", label: "English → Numbers → Amharic" },
  { value: "num-en-am", label: "Numbers → English → Amharic" },
  { value: "num-am-en", label: "Numbers → Amharic → English" },
];

export const DEFAULT_TITLE_SORT: TitleSortOrder = "am-en-num";

const isEthiopicChar = (ch: string): boolean => {
  const cp = ch.codePointAt(0) ?? 0;
  return cp >= 0x1200 && cp <= 0x137f;
};

export function classifyTitle(title: string): TitleGroup {
  const value = (title || "").trim();
  if (!value) return "english";
  if (/[0-9]/.test(value[0])) return "numbered";
  if (isEthiopicChar(value[0])) return "amharic";
  return "english";
}

// Code-point comparison: the Unicode Ethiopic block follows the traditional
// fidel order (ሀ ሁ ሂ ... ለ ሉ ሊ ...), so per-code-point comparison sorts
// Amharic in its own alphabet order.
export function compareEthiopic(a: string, b: string): number {
  const A = Array.from(a);
  const B = Array.from(b);
  const length = Math.min(A.length, B.length);
  for (let i = 0; i < length; i++) {
    const ca = A[i].codePointAt(0) ?? 0;
    const cb = B[i].codePointAt(0) ?? 0;
    if (ca !== cb) return ca - cb;
  }
  return A.length - B.length;
}

export function compareLatin(a: string, b: string): number {
  return a.localeCompare(b, "en", { sensitivity: "base", numeric: true });
}

const groupComparators: Record<TitleGroup, (a: string, b: string) => number> = {
  amharic: compareEthiopic,
  english: compareLatin,
  numbered: compareLatin,
};

/** Alphabetical comparison inside one group. */
export function compareTitles(
  a: string,
  b: string,
  group: TitleGroup
): number {
  return groupComparators[group](a, b);
}

/** Comparison across groups, following the chosen group order. */
export function compareTitlesByOrder(
  a: string,
  b: string,
  order: TitleSortOrder
): number {
  const groupA = classifyTitle(a);
  const groupB = classifyTitle(b);
  if (groupA === groupB) return compareTitles(a, b, groupA);
  const groups = TITLE_GROUP_ORDERS[order];
  return groups.indexOf(groupA) - groups.indexOf(groupB);
}

export function sortTitles<T>(
  items: T[],
  order: TitleSortOrder,
  getTitle: (item: T) => string
): T[] {
  return [...items].sort((a, b) =>
    compareTitlesByOrder(getTitle(a), getTitle(b), order)
  );
}
