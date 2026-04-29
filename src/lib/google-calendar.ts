import { google } from "googleapis"
import { z } from "zod"
import { ok, err } from "@/types/result"
import type { Result } from "@/types/result"

export const CALENDAR_ID = "primary"

export function getCalendar() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })

  return google.calendar({ version: "v3", auth: oauth2Client })
}

export interface BusyInterval {
  start: Date
  end: Date
}

export interface BusyError {
  code: "FETCH_FAILED"
  message: string
}

const FreeBusyInputSchema = z.object({
  timeMinISO: z.iso.datetime(),
  timeMaxISO: z.iso.datetime(),
})

export async function getBusyIntervals(
  timeMinISO: string,
  timeMaxISO: string,
): Promise<Result<BusyInterval[], BusyError>> {
  const parsed = FreeBusyInputSchema.safeParse({ timeMinISO, timeMaxISO })
  if (!parsed.success) {
    return err({ code: "FETCH_FAILED", message: parsed.error.message })
  }

  try {
    const calendar = getCalendar()
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: parsed.data.timeMinISO,
        timeMax: parsed.data.timeMaxISO,
        timeZone: "UTC",
        items: [{ id: CALENDAR_ID }],
      },
    })

    const calendarData = response.data.calendars?.[CALENDAR_ID]
    if (calendarData?.errors && calendarData.errors.length > 0) {
      return err({
        code: "FETCH_FAILED",
        message: calendarData.errors
          .map((calendarError) => calendarError.reason ?? "unknown")
          .join(", "),
      })
    }

    const busyIntervals: BusyInterval[] = (calendarData?.busy ?? [])
      .filter(
        (rawInterval): rawInterval is { start: string; end: string } =>
          Boolean(rawInterval.start && rawInterval.end),
      )
      .map((rawInterval) => ({
        start: new Date(rawInterval.start),
        end: new Date(rawInterval.end),
      }))

    return ok(busyIntervals)
  } catch (error) {
    console.error("[getBusyIntervals] Failed to query freebusy:", error)
    return err({
      code: "FETCH_FAILED",
      message: error instanceof Error ? error.message : "Failed to query freebusy",
    })
  }
}
