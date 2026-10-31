// Shared naming for generated PDFs across the admin print dialogs.
//
// The name is built from the Ethiopian calendar and a 12-hour clock:
// "የ ነሐሴ 18 2019 3:20 ከሰዓት" (the ".pdf" extension is added on download).

import { formatDate } from "@/lib/calendar-utils";

// Traditional Ethiopian day parts, used instead of AM/PM:
// 12:00 AM – 5:59 AM  → ሌሊት
//  6:00 AM – 11:59 AM → ጠዋት
// 12:00 PM – 6:00 PM  → ከሰዓት
//  6:01 PM – 11:59 PM → ማታ
export function getDayPart(hours: number, minutes: number): string {
  if (hours < 6) return "ሌሊት";
  if (hours < 12) return "ጠዋት";
  if (hours < 18) return "ከሰዓት";
  if (hours === 18 && minutes === 0) return "ከሰዓት";
  return "ማታ";
}

export function buildPrintFileName(date: Date): string {
  const ethDate = formatDate(date, "ethiopian", "MMMM d yyyy");
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours % 12 || 12;
  const minutesText = minutes.toString().padStart(2, "0");
  return `የ ${ethDate} ${hours12}:${minutesText} ${getDayPart(hours, minutes)}`;
}
