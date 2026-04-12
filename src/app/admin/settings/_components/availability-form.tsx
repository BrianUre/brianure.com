"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DayRow, type DaySchedule } from "./day-row"
import { saveAvailability } from "@/features/availability/actions/save-availability"
import type { DayAvailability } from "@/features/availability/types/availability"

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour % 12 || 12
      const m = minute.toString().padStart(2, "0")
      const period = hour < 12 ? "AM" : "PM"
      slots.push(`${h}:${m} ${period}`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

type Schedule = Record<string, DaySchedule>

function toScheduleRecord(availability: DayAvailability[]): Schedule {
  return availability.reduce<Schedule>((acc, day) => {
    acc[DAY_NAMES[day.dayOfWeek]] = {
      enabled: day.enabled,
      from: day.from,
      to: day.to,
    }
    return acc
  }, {})
}

interface AvailabilityFormProps {
  initialSchedule: DayAvailability[]
}

export function AvailabilityForm({ initialSchedule }: AvailabilityFormProps) {
  const [schedule, setSchedule] = useState<Schedule>(() =>
    toScheduleRecord(initialSchedule)
  )
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }))
    setStatus("idle")
  }

  const handleSave = async () => {
    setStatus("saving")
    const payload: DayAvailability[] = DAY_NAMES.map((name, index) => ({
      dayOfWeek: index,
      enabled: schedule[name].enabled,
      from: schedule[name].from,
      to: schedule[name].to,
    }))
    const result = await saveAvailability(payload)
    setStatus(result.ok ? "saved" : "error")
  }

  return (
    <>
      <div className="space-y-4">
        {DAY_NAMES.map((day) => (
          <DayRow
            key={day}
            day={day}
            schedule={schedule[day]}
            timeSlots={TIME_SLOTS}
            onUpdate={(updates) => updateDay(day, updates)}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        {status === "saved" && (
          <span className="text-sm text-muted-foreground">Saved</span>
        )}
        {status === "error" && (
          <span className="text-sm text-destructive">Failed to save</span>
        )}
        <Button variant="solid" onClick={handleSave} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </>
  )
}
