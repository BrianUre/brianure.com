interface BookingInput {
  name: string
  email: string
  utcInstant: string // ISO-8601 with Z suffix, start of the meeting
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
