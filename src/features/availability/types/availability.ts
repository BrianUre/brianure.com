interface DayAvailability {
  dayOfWeek: number
  enabled: boolean
  from: string // Display form in the zone below, e.g. "11:00 AM"
  to: string
  zone: string // IANA zone the `from`/`to` wall-clock times are expressed in
}

interface AvailabilityError {
  code: "FETCH_FAILED" | "SAVE_FAILED"
  message: string
}

export type { DayAvailability, AvailabilityError }
