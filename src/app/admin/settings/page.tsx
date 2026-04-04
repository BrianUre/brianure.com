"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DayRow, type DaySchedule } from "./_components/day-row"

const DAYS = [
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

const DEFAULT_SCHEDULE: Schedule = DAYS.reduce((acc, day) => {
  acc[day] = {
    enabled: day !== "Saturday" && day !== "Sunday",
    from: "11:00 AM",
    to: "5:00 PM",
  }
  return acc
}, {} as Schedule)

export default function AdminSettingsPage() {
  const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE)

  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }))
  }

  return (
    <main className="min-h-screen bg-background pb-16 pt-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Availability Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure your available hours for booking
          </p>
        </header>

        <div className="space-y-4">
          {DAYS.map((day) => (
            <DayRow
              key={day}
              day={day}
              schedule={schedule[day]}
              timeSlots={TIME_SLOTS}
              onUpdate={(updates) => updateDay(day, updates)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="solid">Save Changes</Button>
        </div>
      </div>
    </main>
  )
}
