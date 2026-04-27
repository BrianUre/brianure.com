"use client"

import { useMemo } from "react"
import { cva } from "class-variance-authority"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { TEST_IDS } from "@/test-ids"
import {
  buildSlotsForDate,
  instantToDateStringInZone,
} from "@/features/availability/utils/zone"
import type { WeeklyAvailability } from "@/features/availability/utils/zone"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const SLOT_INTERVAL_MINUTES = 30

const calendarDayVariants = cva(
  "aspect-square rounded-md sm:p-2 text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  {
    variants: {
      state: {
        muted: "text-muted-foreground/30",
        selected: "bg-foreground text-background",
        available: "text-foreground hover:bg-muted",
        unavailable: "text-muted-foreground/50",
      },
    },
  },
)

interface CalendarCell {
  year: number
  month: number
  day: number
  inCurrentMonth: boolean
}

function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7
  const cells: CalendarCell[] = []
  for (let i = 0; i < totalCells; i++) {
    if (i < firstDayOfWeek) {
      const day = daysInPrevMonth - firstDayOfWeek + 1 + i
      const prev = new Date(year, month - 1, day)
      cells.push({ year: prev.getFullYear(), month: prev.getMonth(), day, inCurrentMonth: false })
      continue
    }
    const offset = i - firstDayOfWeek + 1
    if (offset > daysInMonth) {
      const day = offset - daysInMonth
      const next = new Date(year, month + 1, day)
      cells.push({ year: next.getFullYear(), month: next.getMonth(), day, inCurrentMonth: false })
      continue
    }
    cells.push({ year, month, day: offset, inCurrentMonth: true })
  }
  return cells
}

function dateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

interface BookingCalendarProps {
  weeklyAvailability: WeeklyAvailability[]
  storedZone: string
  visitorZone: string
  year: number
  month: number
  onChangeMonth: (year: number, month: number) => void
  selectedDateString: string | null
  onSelectDate: (dateString: string) => void
}

export function BookingCalendar({
  weeklyAvailability,
  storedZone,
  visitorZone,
  year,
  month,
  onChangeMonth,
  selectedDateString,
  onSelectDate,
}: BookingCalendarProps) {
  const cells = useMemo(() => getCalendarCells(year, month), [year, month])
  const todayString = useMemo(
    () => instantToDateStringInZone(new Date(), visitorZone),
    [visitorZone],
  )

  const availabilityByDate = useMemo(() => {
    const map = new Map<string, boolean>()
    for (const cell of cells) {
      const ds = dateString(cell.year, cell.month, cell.day)
      if (ds < todayString) {
        map.set(ds, false)
        continue
      }
      const slots = buildSlotsForDate({
        weeklyAvailability,
        storedZone,
        visitorDateString: ds,
        visitorZone,
        intervalMinutes: SLOT_INTERVAL_MINUTES,
      })
      map.set(ds, slots.length > 0)
    }
    return map
  }, [cells, todayString, weeklyAvailability, storedZone, visitorZone])

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long" })

  function goToPrevMonth() {
    if (month === 0) {
      onChangeMonth(year - 1, 11)
      return
    }
    onChangeMonth(year, month - 1)
  }

  function goToNextMonth() {
    if (month === 11) {
      onChangeMonth(year + 1, 0)
      return
    }
    onChangeMonth(year, month + 1)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button type="button" size="icon" variant="ghost" aria-label="Previous month" onClick={goToPrevMonth}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <span className="text-sm font-medium text-foreground">{monthLabel}</span>
        <Button type="button" size="icon" variant="ghost" aria-label="Next month" onClick={goToNextMonth}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const ds = dateString(cell.year, cell.month, cell.day)
          const isAvailable = cell.inCurrentMonth && (availabilityByDate.get(ds) ?? false)
          const isSelected = selectedDateString === ds && cell.inCurrentMonth
          const state = !cell.inCurrentMonth
            ? "muted"
            : isSelected
              ? "selected"
              : isAvailable
                ? "available"
                : "unavailable"
          return (
            <button
              key={i}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectDate(ds)}
              aria-label={cell.inCurrentMonth ? `${monthName} ${cell.day}, ${cell.year}` : undefined}
              aria-pressed={isSelected}
              data-testid={isAvailable ? TEST_IDS.booking.calendar.day : undefined}
              className={cn(calendarDayVariants({ state }))}
            >
              {cell.day}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-foreground" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-muted-foreground/30" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}
