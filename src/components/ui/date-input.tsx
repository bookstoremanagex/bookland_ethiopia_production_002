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

function safeInitial(value: string | undefined) {
  const now = new Date()
  if (!value) {
    const eth = convertToEthiopian(now)
    return {
      year: eth.year || now.getFullYear(),
      month: eth.month || now.getMonth() + 1,
      day: eth.day || now.getDate(),
    }
  }
  const d = new Date(value + "T12:00:00")
  if (isNaN(d.getTime())) {
    const eth = convertToEthiopian(now)
    return { year: eth.year, month: eth.month, day: eth.day }
  }
  const eth = convertToEthiopian(d)
  return {
    year: isNaN(eth.year) ? now.getFullYear() : eth.year,
    month: isNaN(eth.month) ? now.getMonth() + 1 : eth.month,
    day: isNaN(eth.day) ? now.getDate() : eth.day,
  }
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
  const initialValue = typeof value === "string" ? value : undefined
  const initial = safeInitial(initialValue)
  const [ethYear, setEthYear] = useState(initial.year)
  const [ethMonth, setEthMonth] = useState(initial.month)
  const [ethDay, setEthDay] = useState(initial.day)

  useEffect(() => {
    const strValue = typeof value === "string" ? value : undefined
    if (strValue) {
      const d = new Date(strValue + "T12:00:00")
      if (!isNaN(d.getTime())) {
        const e = convertToEthiopian(d)
        if (!isNaN(e.year)) setEthYear(e.year)
        if (!isNaN(e.month)) setEthMonth(e.month)
        if (!isNaN(e.day)) setEthDay(e.day)
      }
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

  const safeMonth = isNaN(ethMonth) ? 1 : ethMonth
  const safeYear = isNaN(ethYear) ? new Date().getFullYear() : ethYear
  const safeDay = isNaN(ethDay) ? 1 : ethDay
  const daysInMonth = safeMonth <= 12 ? 30 : safeYear % 4 === 0 ? 6 : 5

  return (
    <div className={cn("relative", containerClassName)}>
      <input ref={hiddenRef} type="hidden" value={initialValue || ""} readOnly aria-hidden />
      <div className={cn("flex gap-1", className)}>
        <select
          value={safeMonth}
          onChange={(e) => {
            const m = Number(e.target.value)
            setEthMonth(m)
            const d = Math.min(safeDay, m <= 12 ? 30 : safeYear % 4 === 0 ? 6 : 5)
            setEthDay(d)
            emitChange(safeYear, m, d)
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
          value={safeDay}
          onChange={(e) => {
            const d = Number(e.target.value)
            setEthDay(d)
            emitChange(safeYear, safeMonth, d)
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
          value={safeYear}
          onChange={(e) => {
            const y = Number(e.target.value)
            setEthYear(y)
            emitChange(y, safeMonth, safeDay)
          }}
          className="w-[90px] h-10 rounded-xl border-2 border-primarycolor/20 bg-background px-2 py-1 text-sm font-bold outline-none focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={1900}
          max={2200}
        />
      </div>
      {showECLabel && initialValue && (
        <p className="text-[10px] font-bold text-secondarycolor/80 mt-0.5">
          GC: {initialValue}
        </p>
      )}
    </div>
  )
}
