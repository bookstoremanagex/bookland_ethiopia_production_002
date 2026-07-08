"use client"

import React, { useRef, useCallback, useEffect, useState } from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { useCalendar } from "@/lib/calendar-context"
import { convertToEthiopian, convertFromEthiopian, ETHIOPIAN_MONTHS } from "@/lib/calendar-utils"

interface DateInputProps extends React.ComponentProps<"input"> {
  containerClassName?: string
  showECLabel?: boolean
}

function pad(n: number): string {
  return n.toString().padStart(2, "0")
}

export function DateInput({ containerClassName, showECLabel = true, value, onChange, className, ...props }: DateInputProps) {
  const { calendar: calPref } = useCalendar()

  if (calPref === "gregorian") {
    return (
      <div className={cn("relative", containerClassName)}>
        <Input type="date" value={value} onChange={onChange} className={className} {...props} />
      </div>
    )
  }

  return (
    <EthiopianDateInput
      value={value}
      onChange={onChange}
      containerClassName={containerClassName}
      className={className}
      showECLabel={showECLabel}
      {...props}
    />
  )
}

function EthiopianDateInput({
  value,
  onChange,
  containerClassName,
  className,
  showECLabel = true,
  ...props
}: DateInputProps) {
  const hiddenRef = useRef<HTMLInputElement>(null)
  const gregDate = value ? new Date(value + "T12:00:00") : new Date()
  const initial = convertToEthiopian(gregDate)
  const [ethYear, setEthYear] = useState(initial.year)
  const [ethMonth, setEthMonth] = useState(initial.month)
  const [ethDay, setEthDay] = useState(initial.day)

  useEffect(() => {
    if (value) {
      const d = new Date(value + "T12:00:00")
      const e = convertToEthiopian(d)
      setEthYear(e.year)
      setEthMonth(e.month)
      setEthDay(e.day)
    }
  }, [value])

  const emitChange = useCallback(
    (year: number, month: number, day: number) => {
      const greg = convertFromEthiopian(year, month, day)
      const iso = `${greg.getFullYear()}-${pad(greg.getMonth() + 1)}-${pad(greg.getDate())}`
      if (hiddenRef.current) {
        const native = hiddenRef.current
        native.value = iso
        native.dispatchEvent(new Event("input", { bubbles: true }))
      }
      const event = {
        target: { value: iso },
        currentTarget: { value: iso },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(event)
    },
    [onChange],
  )

  const daysInMonth = ethMonth <= 12 ? 30 : ethYear % 4 === 0 ? 6 : 5

  return (
    <div className={cn("relative", containerClassName)}>
      <input ref={hiddenRef} type="hidden" value={value} readOnly aria-hidden />
      <div className={cn("flex gap-1", className)}>
        <select
          value={ethMonth}
          onChange={(e) => {
            const m = Number(e.target.value)
            setEthMonth(m)
            const d = Math.min(ethDay, m <= 12 ? 30 : ethYear % 4 === 0 ? 6 : 5)
            setEthDay(d)
            emitChange(ethYear, m, d)
          }}
          className="flex-1 h-10 rounded-xl border-2 border-primarycolor/20 bg-background px-2 py-1 text-sm font-bold outline-none focus:border-primarycolor"
        >
          {ETHIOPIAN_MONTHS.map((name, i) => (
            <option key={i + 1} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={ethDay}
          onChange={(e) => {
            const d = Number(e.target.value)
            setEthDay(d)
            emitChange(ethYear, ethMonth, d)
          }}
          className="w-[70px] h-10 rounded-xl border-2 border-primarycolor/20 bg-background px-2 py-1 text-sm font-bold outline-none focus:border-primarycolor"
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {pad(d)}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={ethYear}
          onChange={(e) => {
            const y = Number(e.target.value)
            setEthYear(y)
            emitChange(y, ethMonth, ethDay)
          }}
          className="w-[90px] h-10 rounded-xl border-2 border-primarycolor/20 bg-background px-2 py-1 text-sm font-bold outline-none focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={1900}
          max={2200}
        />
      </div>
      {showECLabel && value && (
        <p className="text-[10px] font-bold text-secondarycolor/80 mt-0.5">
          GC: {value}
        </p>
      )}
    </div>
  )
}
