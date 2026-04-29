"use server"

import { z } from "zod"
import { randomUUID } from "crypto"
import { formatInTimeZone } from "date-fns-tz"
import { getCalendar, CALENDAR_ID, getBusyIntervals } from "@/lib/google-calendar"
import { sendEmail } from "@/lib/resend"
import { getAvailability } from "@/features/availability/actions/get-availability"
import { BookingConfirmationEmail } from "../emails/booking-confirmation-email"
import { ok, err } from "@/types/result"
import type { Result } from "@/types/result"
import type { BookingInput, BookingConfirmation, BookingError } from "../types/booking"

const MEETING_DURATION_MS = 30 * 60 * 1000

const BookingSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  utcInstant: z.iso.datetime(),
  visitorZone: z.string().min(1),
})

function formatStartWallClock(start: Date, zone: string): string {
  return formatInTimeZone(start, zone, "MMMM d, yyyy 'at' h:mm a zzz")
}

async function getStoredZone(): Promise<string> {
  const result = await getAvailability()
  if (!result.ok) {
    return "UTC"
  }
  return result.value[0]?.zone ?? "UTC"
}

interface SendBookingEmailsArgs {
  name: string
  email: string
  start: Date
  visitorZone: string
  meetLink: string | null
}

async function sendBookingEmails({
  name,
  email,
  start,
  visitorZone,
  meetLink,
}: SendBookingEmailsArgs): Promise<void> {
  const storedZone = await getStoredZone()
  const sender = process.env.RESEND_BOOKING_CONFIRMATION_EMAIL!
  const hostInbox = process.env.EMAIL_CONTACT_RECIPIENT!

  const visitorResult = await sendEmail({
    from: sender,
    to: email,
    subject: "Your booking with Brian is confirmed",
    react: (
      <BookingConfirmationEmail
        audience="visitor"
        name={name}
        email={email}
        startWallClock={formatStartWallClock(start, visitorZone)}
        meetLink={meetLink}
      />
    ),
  })
  if (!visitorResult.ok) {
    console.error("[createBooking] visitor email failed:", visitorResult.error)
  }

  const hostResult = await sendEmail({
    from: sender,
    to: hostInbox,
    subject: `New booking from ${name}`,
    react: (
      <BookingConfirmationEmail
        audience="host"
        name={name}
        email={email}
        startWallClock={formatStartWallClock(start, storedZone)}
        meetLink={meetLink}
      />
    ),
    replyTo: email,
  })
  if (!hostResult.ok) {
    console.error("[createBooking] host email failed:", hostResult.error)
  }
}

async function createBooking(
  input: BookingInput,
): Promise<Result<BookingConfirmation, BookingError>> {
  const parsed = BookingSchema.safeParse(input)
  if (!parsed.success) {
    return err({ code: "VALIDATION_FAILED", message: parsed.error.message })
  }

  const { name, email, utcInstant, visitorZone } = parsed.data
  const start = new Date(utcInstant)
  const end = new Date(start.getTime() + MEETING_DURATION_MS)

  const summary = `Meeting with ${name}`

  const busyResult = await getBusyIntervals(start.toISOString(), end.toISOString())
  if (busyResult.ok && busyResult.value.length > 0) {
    return err({
      code: "SLOT_UNAVAILABLE",
      message: "That slot is no longer available",
    })
  }

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

    await sendBookingEmails({
      name,
      email,
      start,
      visitorZone,
      meetLink,
    })

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
