import { loadEnvConfig } from "@next/env"
import { google } from "googleapis"

loadEnvConfig(process.cwd())

const CALENDAR_ID = "primary"
const SWEEP_LOOKBACK_MS = 60 * 60 * 1000
const SWEEP_LOOKAHEAD_MS = 60 * 24 * 60 * 60 * 1000

function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })
  return google.calendar({ version: "v3", auth: oauth2Client })
}

async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendar = getCalendarClient()
  await calendar.events.delete({
    calendarId: CALENDAR_ID,
    eventId,
    sendUpdates: "none",
  })
}

async function deleteCalendarEventsByAttendee(email: string): Promise<void> {
  const calendar = getCalendarClient()
  const now = Date.now()
  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    q: email,
    singleEvents: true,
    timeMin: new Date(now - SWEEP_LOOKBACK_MS).toISOString(),
    timeMax: new Date(now + SWEEP_LOOKAHEAD_MS).toISOString(),
  })

  const events = response.data.items ?? []
  const matches = events.filter((event) =>
    event.attendees?.some((attendee) => attendee.email === email),
  )

  await Promise.all(
    matches.map(async (event) => {
      if (!event.id) {
        return
      }
      await calendar.events.delete({
        calendarId: CALENDAR_ID,
        eventId: event.id,
        sendUpdates: "none",
      })
    }),
  )
}

export { deleteCalendarEvent, deleteCalendarEventsByAttendee }
