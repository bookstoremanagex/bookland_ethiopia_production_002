import { toEthiopian, toGregorian } from "ethiopian-date"

export type CalendarPreference = "gregorian" | "ethiopian"

const ETHIOPIAN_MONTHS = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Magabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume",
]

const ETHIOPIAN_MONTHS_SHORT = [
  "Mes", "Tik", "Hid", "Tah", "Tir", "Yek",
  "Mag", "Mia", "Gin", "Sen", "Ham", "Neh", "Pag",
]

const ETHIOPIAN_WEEKDAYS = [
  "Ehud", "Segno", "Maksegno", "Erob", "Hamus", "Arb", "Kidam",
]

const ETHIOPIAN_WEEKDAYS_SHORT = [
  "Ehu", "Seg", "Mak", "Ero", "Ham", "Arb", "Kid",
]

function pad(n: number): string {
  return n.toString().padStart(2, "0")
}

function gregorianWeekdayName(date: Date, short = false): string {
  const day = date.getDay()
  const names = short
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return names[day]
}

function gregorianMonthName(month: number, short = false): string {
  const names = short
    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  return names[month - 1]
}

export function convertToEthiopian(date: Date): { year: number; month: number; day: number } {
  const [y, m, d] = toEthiopian(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return { year: y, month: m, day: d }
}

export function convertFromEthiopian(year: number, month: number, day: number): Date {
  const [gy, gm, gd] = toGregorian(year, month, day)
  return new Date(gy, gm - 1, gd)
}

export function formatDate(date: Date, calendar: CalendarPreference, pattern: string = "MMM dd, yyyy"): string {
  if (calendar === "gregorian") {
    return formatGregorian(date, pattern)
  }
  return formatEthiopian(date, pattern)
}

function formatGregorian(date: Date, pattern: string): string {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const min = date.getMinutes()
  const s = date.getSeconds()
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  const map: Record<string, string> = {
    yyyy: y.toString(),
    yy: y.toString().slice(-2),
    MMMM: gregorianMonthName(m, false),
    MMM: gregorianMonthName(m, true),
    MM: pad(m),
    M: m.toString(),
    dd: pad(d),
    d: d.toString(),
    HH: pad(h),
    hh: pad(h12),
    mm: pad(min),
    ss: pad(s),
    a: ampm,
    EEEE: gregorianWeekdayName(date, false),
    EEE: gregorianWeekdayName(date, true),
  }
  let result = pattern
  for (const [key, val] of Object.entries(map)) {
    result = result.replace(key, val)
  }
  return result
}

function formatEthiopian(date: Date, pattern: string): string {
  const eth = convertToEthiopian(date)
  const h = date.getHours()
  const min = date.getMinutes()
  const s = date.getSeconds()
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  const map: Record<string, string> = {
    yyyy: eth.year.toString(),
    yy: eth.year.toString().slice(-2),
    MMMM: ETHIOPIAN_MONTHS[eth.month - 1] || "Pagume",
    MMM: ETHIOPIAN_MONTHS_SHORT[eth.month - 1] || "Pag",
    MM: pad(eth.month),
    M: eth.month.toString(),
    dd: pad(eth.day),
    d: eth.day.toString(),
    HH: pad(h),
    hh: pad(h12),
    mm: pad(min),
    ss: pad(s),
    a: ampm,
    EEEE: ETHIOPIAN_WEEKDAYS[date.getDay()],
    EEE: ETHIOPIAN_WEEKDAYS_SHORT[date.getDay()],
  }
  let result = pattern
  for (const [key, val] of Object.entries(map)) {
    result = result.replace(key, val)
  }
  return result
}

export function formatDateShort(date: Date, calendar: CalendarPreference): string {
  return formatDate(date, calendar, "MMM dd, yyyy")
}

export function formatDateLong(date: Date, calendar: CalendarPreference): string {
  if (calendar === "gregorian") {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  const eth = convertToEthiopian(date)
  const wd = ETHIOPIAN_WEEKDAYS[date.getDay()]
  const mn = ETHIOPIAN_MONTHS[eth.month - 1] || "Pagume"
  return `${wd}, ${mn} ${eth.day}, ${eth.year}`
}

export function formatDateISO(date: Date, calendar: CalendarPreference): string {
  if (calendar === "gregorian") {
    const y = date.getFullYear()
    const m = pad(date.getMonth() + 1)
    const d = pad(date.getDate())
    return `${y}-${m}-${d}`
  }
  const eth = convertToEthiopian(date)
  return `${eth.year}-${pad(eth.month)}-${pad(eth.day)}`
}

export function formatDateTime(date: Date, calendar: CalendarPreference): string {
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  const dateStr = formatDateShort(date, calendar)
  return `${dateStr}, ${time}`
}
