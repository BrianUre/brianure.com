"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/utils/cn"
import { TEST_IDS } from "@/test-ids"
import {
  buildSlotsForDate,
  instantToWallClockInZone,
  instantToZoneAbbreviation,
} from "@/features/availability/utils/zone"
import type { Slot, WeeklyAvailability } from "@/features/availability/utils/zone"

const SLOT_INTERVAL_MINUTES = 30

interface TimeSlotPickerProps {
  weeklyAvailability: WeeklyAvailability[]
  storedZone: string
  visitorZone: string
  selectedDateString: string | null
  selectedSlot: Slot | null
  onSelectSlot: (slot: Slot) => void
}

export function TimeSlotPicker({
  weeklyAvailability,
  storedZone,
  visitorZone,
  selectedDateString,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const slots = useMemo(() => {
    if (!selectedDateString) {
      return []
    }
    return buildSlotsForDate({
      weeklyAvailability,
      storedZone,
      visitorDateString: selectedDateString,
      visitorZone,
      intervalMinutes: SLOT_INTERVAL_MINUTES,
    })
  }, [selectedDateString, weeklyAvailability, storedZone, visitorZone])

  const nowLabel = instantToWallClockInZone(now, visitorZone)
  const zoneAbbr = instantToZoneAbbreviation(now, visitorZone)
  const headingDate = selectedDateString
    ? new Date(`${selectedDateString}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : null

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">
          {headingDate ?? "Select a date"}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {headingDate ? "Choose an available time slot" : "Pick a day to see available times"}
        </p>
        <p
          className="mt-2 text-xs text-muted-foreground"
          data-testid={TEST_IDS.booking.timeCaption}
        >
          Your time: {nowLabel} {zoneAbbr} ({visitorZone})
        </p>
      </div>

      <div className="flex-1">
        {selectedDateString ? (
          slots.length > 0 ? (
            <div className="grid gap-2">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.utcInstant.getTime() === slot.utcInstant.getTime()
                return (
                  <button
                    key={slot.utcInstant.toISOString()}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
                    aria-pressed={isSelected}
                    data-testid={TEST_IDS.booking.timeSlot}
                    data-utc-instant={slot.utcInstant.toISOString()}
                    className={cn(
                      "rounded-md border px-4 py-3 text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground",
                    )}
                  >
                    {slot.localLabel}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border">
              <p className="text-sm text-muted-foreground">No slots available on this day</p>
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border">
            <p className="text-sm text-muted-foreground">Select a date to view time slots</p>
          </div>
        )}
      </div>
    </div>
  )
}
