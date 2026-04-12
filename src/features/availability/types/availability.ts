interface DayAvailability {
  dayOfWeek: number
  enabled: boolean
  from: string // "11:00 AM"
  to: string   // "5:00 PM"
}

interface AvailabilityError {
  code: "FETCH_FAILED" | "SAVE_FAILED"
  message: string
}

export type { DayAvailability, AvailabilityError }
