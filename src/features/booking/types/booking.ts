interface BookingInput {
  name: string
  email: string
  product: string // priceId or "other"
  year: number
  month: number // 0-indexed
  day: number
  time: string // "9:00 AM"
}

interface BookingConfirmation {
  eventId: string
  meetLink: string | null
  summary: string
}

type BookingErrorCode = "VALIDATION_FAILED" | "CALENDAR_ERROR"

interface BookingError {
  code: BookingErrorCode
  message: string
}

export type { BookingInput, BookingConfirmation, BookingError, BookingErrorCode }
