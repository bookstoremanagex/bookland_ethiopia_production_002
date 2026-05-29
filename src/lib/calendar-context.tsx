"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { CalendarPreference } from "./calendar-utils"
import { formatDate as formatDateUtil, formatDateShort, formatDateLong, formatDateISO, formatDateTime } from "./calendar-utils"

interface CalendarContextValue {
  calendar: CalendarPreference
  setCalendar: (pref: CalendarPreference) => void
  toggleCalendar: () => void
  formatDate: (date: Date, pattern?: string) => string
  formatShort: (date: Date) => string
  formatLong: (date: Date) => string
  formatISO: (date: Date) => string
  formatDateTime: (date: Date) => string
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [calendar, setCalendar] = useState<CalendarPreference>("gregorian")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("calendar-preference") as CalendarPreference | null
    if (stored === "ethiopian" || stored === "gregorian") {
      setCalendar(stored)
    }
    setMounted(true)
  }, [])

  const updateCalendar = useCallback((pref: CalendarPreference) => {
    setCalendar(pref)
    localStorage.setItem("calendar-preference", pref)
    document.cookie = `calendar-preference=${pref}; path=/; max-age=31536000; SameSite=Lax`
  }, [])

  const toggleCalendar = useCallback(() => {
    updateCalendar(calendar === "gregorian" ? "ethiopian" : "gregorian")
  }, [calendar, updateCalendar])

  const formatDate = useCallback(
    (date: Date, pattern = "MMM dd, yyyy") => formatDateUtil(date, calendar, pattern),
    [calendar],
  )

  const formatShort = useCallback((date: Date) => formatDateShort(date, calendar), [calendar])
  const formatLong = useCallback((date: Date) => formatDateLong(date, calendar), [calendar])
  const formatISO = useCallback((date: Date) => formatDateISO(date, calendar), [calendar])
  const formatDateTimeFn = useCallback((date: Date) => formatDateTime(date, calendar), [calendar])

  if (!mounted) {
    return (
      <CalendarContext.Provider
        value={{
          calendar: "gregorian",
          setCalendar: updateCalendar,
          toggleCalendar: () => {},
          formatDate: (date, pattern) => formatDateUtil(date, "gregorian", pattern),
          formatShort: (date) => formatDateShort(date, "gregorian"),
          formatLong: (date) => formatDateLong(date, "gregorian"),
          formatISO: (date) => formatDateISO(date, "gregorian"),
          formatDateTime: (date) => formatDateTime(date, "gregorian"),
        }}
      >
        {children}
      </CalendarContext.Provider>
    )
  }

  return (
    <CalendarContext.Provider
      value={{
        calendar,
        setCalendar: updateCalendar,
        toggleCalendar,
        formatDate,
        formatShort,
        formatLong,
        formatISO,
        formatDateTime: formatDateTimeFn,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext)
  if (!ctx) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return ctx
}
