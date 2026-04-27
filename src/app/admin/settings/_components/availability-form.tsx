"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DayRow, type DaySchedule } from "./day-row"
import { saveAvailability } from "@/features/availability/actions/save-availability"
import type { DayAvailability } from "@/features/availability/types/availability"
import {
  getBrowserZone,
  instantToWallClockInZone,
  wallClockToInstant,
  instantToDateStringInZone,
} from "@/features/availability/utils/zone"
import { displayTimeToDb } from "@/features/availability/utils/time-convert"

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
type Mode = "individual" | "all"

// Converts a "11:00 AM" display time in `fromZone` to the equivalent display
// time in `toZone`, using today as the reference date so DST is accounted for.
function convertDisplayBetweenZones(
  display: string,
  fromZone: string,
  toZone: string,
  referenceDate: string,
): string {
  if (fromZone === toZone) {
    return display
  }
  const dbTime = displayTimeToDb(display)
  const instant = wallClockToInstant(dbTime, fromZone, referenceDate)
  return instantToWallClockInZone(instant, toZone)
}

function toScheduleRecord(
  availability: DayAvailability[],
  browserZone: string,
  referenceDate: string,
): Schedule {
  return availability.reduce<Schedule>((acc, day) => {
    acc[DAY_NAMES[day.dayOfWeek]] = {
      enabled: day.enabled,
      from: convertDisplayBetweenZones(day.from, day.zone, browserZone, referenceDate),
      to: convertDisplayBetweenZones(day.to, day.zone, browserZone, referenceDate),
    }
    return acc
  }, {})
}

function pickBulkSeed(schedule: Schedule): { from: string; to: string } {
  const firstEnabled = DAY_NAMES.find((name) => schedule[name].enabled)
  const source = schedule[firstEnabled ?? DAY_NAMES[0]]
  return { from: source.from, to: source.to }
}

interface AvailabilityFormProps {
  initialSchedule: DayAvailability[]
}

export function AvailabilityForm({ initialSchedule }: AvailabilityFormProps) {
  const browserZone = useMemo(() => getBrowserZone(), [])
  const referenceDate = useMemo(
    () => instantToDateStringInZone(new Date(), browserZone),
    [browserZone],
  )
  const [schedule, setSchedule] = useState<Schedule>(() =>
    toScheduleRecord(initialSchedule, browserZone, referenceDate),
  )
  const [mode, setMode] = useState<Mode>("individual")
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const bulk = mode === "all" ? pickBulkSeed(schedule) : null

  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }))
    setStatus("idle")
  }

  const updateBulkTimes = (updates: { from?: string; to?: string }) => {
    setSchedule((prev) => {
      const next: Schedule = {}
      for (const name of DAY_NAMES) {
        next[name] = { ...prev[name], ...updates }
      }
      return next
    })
    setStatus("idle")
  }

  const handleToggleMode = (checked: boolean) => {
    setMode(checked ? "all" : "individual")
    if (checked) {
      const seed = pickBulkSeed(schedule)
      updateBulkTimes(seed)
    }
  }

  const handleSave = async () => {
    setStatus("saving")
    const payload: DayAvailability[] = DAY_NAMES.map((name, index) => ({
      dayOfWeek: index,
      enabled: schedule[name].enabled,
      from: schedule[name].from,
      to: schedule[name].to,
      zone: browserZone,
    }))
    const result = await saveAvailability(payload)
    setStatus(result.ok ? "saved" : "error")
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        All times shown in your browser&apos;s timezone: <strong>{browserZone}</strong>. Saved
        schedules are tagged with this zone so daylight saving is handled automatically.
      </p>

      <div className="mb-6 flex items-center justify-between rounded-lg border border-border/50 bg-card p-4">
        <div className="flex items-center gap-3">
          <Switch checked={mode === "all"} onCheckedChange={handleToggleMode} />
          <div>
            <p className="text-sm font-medium text-foreground">Apply same hours to all days</p>
            <p className="text-xs text-muted-foreground">
              Per-day enabled toggles still work; only times are shared.
            </p>
          </div>
        </div>

        {bulk && (
          <div className="flex items-center gap-3">
            <BulkTimeSelect
              value={bulk.from}
              placeholder="From"
              onChange={(value) => updateBulkTimes({ from: value })}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <BulkTimeSelect
              value={bulk.to}
              placeholder="To"
              onChange={(value) => updateBulkTimes({ to: value })}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {DAY_NAMES.map((day) => (
          <DayRow
            key={day}
            day={day}
            schedule={schedule[day]}
            timeSlots={TIME_SLOTS}
            timesDisabled={mode === "all"}
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

interface BulkTimeSelectProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

function BulkTimeSelect({ value, placeholder, onChange }: BulkTimeSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {TIME_SLOTS.map((slot) => (
          <SelectItem key={slot} value={slot}>
            {slot}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
