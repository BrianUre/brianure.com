"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const currentMonth = "April 2026"

const dates = Array.from({ length: 35 }, (_, i) => {
  const day = i - 2
  if (day < 1) return { day: 29 + day, muted: true }
  if (day > 30) return { day: day - 30, muted: true }
  return { day, muted: false }
})

const availableDays = [7, 8, 9, 14, 15, 16, 21, 22, 23, 28, 29, 30]

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
]

export function CalendarWithSlots() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  return (
    <div className="rounded-lg border border-border bg-card p-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Calendar */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <Button size="icon" variant="ghost" aria-label="Previous month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <span className="text-sm font-medium text-foreground">{currentMonth}</span>
            <Button size="icon" variant="ghost" aria-label="Next month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dates.map((date, i) => {
              const isAvailable = !date.muted && availableDays.includes(date.day)
              const isSelected = !date.muted && selectedDate === date.day
              return (
                <button
                  key={i}
                  disabled={date.muted || !isAvailable}
                  onClick={() => {
                    setSelectedDate(date.day)
                    setSelectedTime(null)
                  }}
                  aria-label={date.muted ? undefined : `April ${date.day}, 2026`}
                  aria-pressed={isSelected}
                  className={cn(
                    "aspect-square rounded-md p-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    date.muted
                      ? "text-muted-foreground/30"
                      : isSelected
                        ? "bg-foreground text-background"
                        : isAvailable
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground/50",
                  )}
                >
                  {date.day}
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-foreground" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-muted-foreground/30" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground">
              {selectedDate ? `April ${selectedDate}, 2026` : "Select a date"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedDate ? "Choose an available time slot" : "Pick a day to see available times"}
            </p>
          </div>

          <div className="flex-1">
            {selectedDate ? (
              <div className="grid gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    aria-pressed={selectedTime === time}
                    className={cn(
                      "rounded-md border px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      selectedTime === time
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground",
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border">
                <p className="text-sm text-muted-foreground">Select a date to view time slots</p>
              </div>
            )}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-6">
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                Confirm Booking
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                April {selectedDate}, 2026 at {selectedTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
