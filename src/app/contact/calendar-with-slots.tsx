"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import type { ServiceOption } from "@/components/composed/service-select"
import type { DayAvailability } from "@/features/availability/types/availability"
import {
  getBrowserZone,
  instantToDateStringInZone,
} from "@/features/availability/utils/zone"
import type { Slot, WeeklyAvailability } from "@/features/availability/utils/zone"
import { displayTimeToDb } from "@/features/availability/utils/time-convert"
import { BookingCalendar } from "./booking-calendar"
import { TimeSlotPicker } from "./time-slot-picker"
import { BookingForm } from "./booking-form"

function subscribeZone() {
  return () => {}
}

function useVisitorZone(): string | null {
  return useSyncExternalStore(
    subscribeZone,
    () => getBrowserZone(),
    () => null,
  )
}

interface CalendarWithSlotsProps {
  serviceOptions: ServiceOption[]
  availability: DayAvailability[]
  product: string
  onProductChange: (value: string) => void
}

export function CalendarWithSlots({
  serviceOptions,
  availability,
  product,
  onProductChange,
}: CalendarWithSlotsProps) {
  const visitorZone = useVisitorZone()

  if (!visitorZone) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 sm:p-8">
        <div className="flex min-h-100 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <BookingWidget
      serviceOptions={serviceOptions}
      availability={availability}
      product={product}
      onProductChange={onProductChange}
      visitorZone={visitorZone}
    />
  )
}

interface BookingWidgetProps extends CalendarWithSlotsProps {
  visitorZone: string
}

function BookingWidget({
  serviceOptions,
  availability,
  product,
  onProductChange,
  visitorZone,
}: BookingWidgetProps) {
  const storedZone = availability[0]?.zone ?? "UTC"

  const weeklyAvailability: WeeklyAvailability[] = useMemo(
    () =>
      availability.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        enabled: day.enabled,
        fromWallClock: displayTimeToDb(day.from),
        toWallClock: displayTimeToDb(day.to),
      })),
    [availability],
  )

  const [year, setYear] = useState(() => {
    const todayInVisitorZone = instantToDateStringInZone(new Date(), visitorZone)
    return Number(todayInVisitorZone.split("-")[0])
  })
  const [month, setMonth] = useState(() => {
    const todayInVisitorZone = instantToDateStringInZone(new Date(), visitorZone)
    return Number(todayInVisitorZone.split("-")[1]) - 1
  })
  const [selectedDateString, setSelectedDateString] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  function handleChangeMonth(nextYear: number, nextMonth: number) {
    setYear(nextYear)
    setMonth(nextMonth)
    setSelectedDateString(null)
    setSelectedSlot(null)
  }

  function handleSelectDate(ds: string) {
    setSelectedDateString(ds)
    setSelectedSlot(null)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <BookingCalendar
          weeklyAvailability={weeklyAvailability}
          storedZone={storedZone}
          visitorZone={visitorZone}
          year={year}
          month={month}
          onChangeMonth={handleChangeMonth}
          selectedDateString={selectedDateString}
          onSelectDate={handleSelectDate}
        />
        <TimeSlotPicker
          weeklyAvailability={weeklyAvailability}
          storedZone={storedZone}
          visitorZone={visitorZone}
          selectedDateString={selectedDateString}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
        />
        <BookingForm
          serviceOptions={serviceOptions}
          product={product}
          onProductChange={onProductChange}
          selectedSlot={selectedSlot}
          visitorZone={visitorZone}
        />
      </div>
    </div>
  )
}
