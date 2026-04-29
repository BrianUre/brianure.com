import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { overlapsBusy } from "./busy";
import type { BusyInterval } from "@/lib/google-calendar";

function getBrowserZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function wallClockToInstant(
  wallClock: string,
  zone: string,
  dateString: string,
): Date {
  const time = wallClock.length === 5 ? `${wallClock}:00` : wallClock;
  return fromZonedTime(`${dateString}T${time}`, zone);
}

function instantToWallClockInZone(instant: Date, zone: string): string {
  return formatInTimeZone(instant, zone, "h:mm a");
}

function instantToDateStringInZone(instant: Date, zone: string): string {
  return formatInTimeZone(instant, zone, "yyyy-MM-dd");
}

function instantToZoneAbbreviation(instant: Date, zone: string): string {
  return formatInTimeZone(instant, zone, "zzz");
}

function addDaysToDateString(dateString: string, days: number): string {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Returns day of week under the project's Mon=0..Sun=6 convention (matches the
// availability_schedule.day_of_week column).
function dayOfWeekFromDateString(dateString: string): number {
  const [y, m, d] = dateString.split("-").map(Number);
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return (jsDay + 6) % 7;
}

function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTimeString(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

interface Slot {
  utcInstant: Date;
  localLabel: string;
  busy: boolean;
  past: boolean;
}

interface WeeklyAvailability {
  dayOfWeek: number;
  enabled: boolean;
  fromWallClock: string;
  toWallClock: string;
}

interface BuildSlotsOptions {
  weeklyAvailability: WeeklyAvailability[];
  storedZone: string;
  visitorDateString: string;
  visitorZone: string;
  intervalMinutes: number;
  busy?: BusyInterval[];
  now?: Date;
}

function buildSlotsForDate({
  weeklyAvailability,
  storedZone,
  visitorDateString,
  visitorZone,
  intervalMinutes,
  busy,
  now,
}: BuildSlotsOptions): Slot[] {
  const visitorDayStart = fromZonedTime(
    `${visitorDateString}T00:00:00`,
    visitorZone,
  );
  const baseStoredDate = instantToDateStringInZone(visitorDayStart, storedZone);
  const slots: Slot[] = [];

  for (const offset of [-1, 0, 1]) {
    const storedDateString = addDaysToDateString(baseStoredDate, offset);
    const dow = dayOfWeekFromDateString(storedDateString);
    const dayAvailability = weeklyAvailability.find((a) => a.dayOfWeek === dow);
    if (!dayAvailability || !dayAvailability.enabled) {
      continue;
    }
    const startMinutes = parseTimeToMinutes(dayAvailability.fromWallClock);
    const endMinutes = parseTimeToMinutes(dayAvailability.toWallClock);
    for (
      let m = startMinutes;
      m + intervalMinutes <= endMinutes;
      m += intervalMinutes
    ) {
      const time = minutesToTimeString(m);
      const instant = wallClockToInstant(time, storedZone, storedDateString);
      if (
        instantToDateStringInZone(instant, visitorZone) !== visitorDateString
      ) {
        continue;
      }
      const slotEnd = new Date(instant.getTime() + intervalMinutes * 60_000);
      const isBusy = busy ? overlapsBusy(instant, slotEnd, busy) : false;
      const isPast = now ? instant.getTime() <= now.getTime() : false;
      slots.push({
        utcInstant: instant,
        localLabel: instantToWallClockInZone(instant, visitorZone),
        busy: isBusy,
        past: isPast,
      });
    }
  }

  slots.sort((a, b) => a.utcInstant.getTime() - b.utcInstant.getTime());
  return slots;
}

export {
  getBrowserZone,
  wallClockToInstant,
  instantToWallClockInZone,
  instantToDateStringInZone,
  instantToZoneAbbreviation,
  dayOfWeekFromDateString,
  addDaysToDateString,
  buildSlotsForDate,
};
export type { Slot, WeeklyAvailability };
