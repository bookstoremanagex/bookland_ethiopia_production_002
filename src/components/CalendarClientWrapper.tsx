"use client"

import React from "react"
import { CalendarProvider } from "@/lib/calendar-context"
import CalendarToggle from "./CalendarToggle"

export default function CalendarClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CalendarProvider>
      {children}
    </CalendarProvider>
  )
}

export function CalendarToggleButton() {
  return <CalendarToggle />
}
