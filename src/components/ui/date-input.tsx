"use client"

import React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { useCalendar } from "@/lib/calendar-context"
import { formatDate } from "@/lib/calendar-utils"

interface DateInputProps extends React.ComponentProps<"input"> {
  containerClassName?: string
  showECLabel?: boolean
}

export function DateInput({ containerClassName, showECLabel = true, value, onChange, ...props }: DateInputProps) {
  const { calendar: calPref } = useCalendar()

  const ethDisplay = value && typeof value === "string" && value
    ? formatDate(new Date(value + "T12:00:00"), "ethiopian", "MMM dd, yyyy")
    : null

  return (
    <div className={cn("relative", containerClassName)}>
      <Input type="date" value={value} onChange={onChange} {...props} />
      {calPref === "ethiopian" && showECLabel && ethDisplay && (
        <p className="text-[10px] font-bold text-secondarycolor/80 mt-0.5">
          EC: {ethDisplay}
        </p>
      )}
    </div>
  )
}
