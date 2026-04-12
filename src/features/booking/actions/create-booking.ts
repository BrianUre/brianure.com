"use server"

import { z } from "zod"
import { randomUUID } from "crypto"
import { getCalendar, CALENDAR_ID, CALENDAR_TIMEZONE } from "@/lib/google-calendar"
import { ok, err } from "@/types/result"
import type { Result } from "@/types/result"
import type { BookingInput, BookingConfirmation, BookingError } from "../types/booking"

const BookingSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  product: z.string().min(1),
  year: z.number().int().min(2024),
  month: z.number().int().min(0).max(11),
  day: z.number().int().min(1).max(31),
  time: z.string().min(1),
})

function parseTime(time: string): { hours: number; minutes: number } {
  // "9:00 AM" | "12:30 PM"
  const [timePart, period] = time.split(" ")
  const [h, m] = timePart.split(":").map(Number)
  const hours = period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h
  return { hours, minutes: m }
}

async function createBooking(
  input: BookingInput,
): Promise<Result<BookingConfirmation, BookingError>> {
  const parsed = BookingSchema.safeParse(input)
  if (!parsed.success) {
    return err({ code: "VALIDATION_FAILED", message: parsed.error.message })
  }

  const { name, email, product, year, month, day, time } = parsed.data
  const { hours, minutes } = parseTime(time)

  const start = new Date(year, month, day, hours, minutes)
  const end = new Date(start.getTime() + 30 * 60 * 1000)

  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:00`

  const summary = `Meeting with ${name}`
  const description = `Product of interest: ${product}`

  try {
    const calendar = getCalendar()
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary,
        description,
        start: { dateTime: toISO(start), timeZone: CALENDAR_TIMEZONE },
        end: { dateTime: toISO(end), timeZone: CALENDAR_TIMEZONE },
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
