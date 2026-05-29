import { cookies } from "next/headers"
import type { CalendarPreference } from "./calendar-utils"
import { formatDate, formatDateShort, formatDateLong, formatDateISO, formatDateTime } from "./calendar-utils"

export async function getServerCalendarPref(): Promise<CalendarPreference> {
  const cookieStore = await cookies()
  const val = cookieStore.get("calendar-preference")?.value
  if (val === "gregorian" || val === "ethiopian") return val
  return "gregorian"
}

export async function formatDateServer(date: Date, pattern = "MMM dd, yyyy"): Promise<string> {
  const pref = await getServerCalendarPref()
  return formatDate(date, pref, pattern)
}

export async function formatShortServer(date: Date): Promise<string> {
  const pref = await getServerCalendarPref()
  return formatDateShort(date, pref)
}

export async function formatLongServer(date: Date): Promise<string> {
  const pref = await getServerCalendarPref()
  return formatDateLong(date, pref)
}

export async function formatISOServer(date: Date): Promise<string> {
  const pref = await getServerCalendarPref()
  return formatDateISO(date, pref)
}

export async function formatDateTimeServer(date: Date): Promise<string> {
  const pref = await getServerCalendarPref()
  return formatDateTime(date, pref)
}
