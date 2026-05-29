"use client"

import React from "react"
import { CalendarDays } from "lucide-react"
import { useCalendar } from "@/lib/calendar-context"

export default function CalendarToggle() {
  const { calendar, toggleCalendar } = useCalendar()

  return (
    <button
      onClick={toggleCalendar}
      title={`Switch to ${calendar === "gregorian" ? "Ethiopian" : "Gregorian"} calendar`}
      className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-primarycolor/10 bg-white hover:bg-primarycolor/5 transition-all cursor-pointer outline-none text-[10px] font-black uppercase tracking-wider"
    >
      <CalendarDays className="size-3.5 text-secondarycolor" />
      <span className="hidden sm:inline">{calendar === "gregorian" ? "GC" : "EC"}</span>
      <span className="sm:hidden">{calendar === "gregorian" ? "G" : "E"}</span>
    </button>
  )
}
