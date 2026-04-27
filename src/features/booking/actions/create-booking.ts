"use server"

import { z } from "zod"
import { randomUUID } from "crypto"
import { getCalendar, CALENDAR_ID } from "@/lib/google-calendar"
import { ok, err } from "@/types/result"
import type { Result } from "@/types/result"
import type { BookingInput, BookingConfirmation, BookingError } from "../types/booking"

const MEETING_DURATION_MS = 30 * 60 * 1000

const BookingSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  utcInstant: z.iso.datetime(),
})

async function createBooking(
  input: BookingInput,
): Promise<Result<BookingConfirmation, BookingError>> {
  const parsed = BookingSchema.safeParse(input)
  if (!parsed.success) {
    return err({ code: "VALIDATION_FAILED", message: parsed.error.message })
  }

  const { name, email, utcInstant } = parsed.data
  const start = new Date(utcInstant)
  const end = new Date(start.getTime() + MEETING_DURATION_MS)

  const summary = `Meeting with ${name}`

  try {
    const calendar = getCalendar()
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary,
        start: { dateTime: start.toISOString(), timeZone: "UTC" },
        end: { dateTime: end.toISOString(), timeZone: "UTC" },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    })

    const event = response.data
    const meetLink =
      event.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === "video")?.uri ?? null

    return ok({
      eventId: event.id!,
      meetLink,
      summary,
    })
  } catch (e) {
    console.error("[createBooking] Failed to create calendar event:", e)
    return err({
      code: "CALENDAR_ERROR",
      message: e instanceof Error ? e.message : "Failed to create calendar event",
    })
  }
}

export { createBooking }
