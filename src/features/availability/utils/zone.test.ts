import { describe, it, expect } from "vitest"
import {
  wallClockToInstant,
  instantToWallClockInZone,
  instantToDateStringInZone,
  dayOfWeekFromDateString,
  buildSlotsForDate,
} from "./zone"
import type { WeeklyAvailability } from "./zone"

const WEEKDAY_11_TO_17_NY: WeeklyAvailability[] = [
  { dayOfWeek: 0, enabled: true, fromWallClock: "11:00", toWallClock: "17:00" },
  { dayOfWeek: 1, enabled: true, fromWallClock: "11:00", toWallClock: "17:00" },
  { dayOfWeek: 2, enabled: true, fromWallClock: "11:00", toWallClock: "17:00" },
  { dayOfWeek: 3, enabled: true, fromWallClock: "11:00", toWallClock: "17:00" },
  { dayOfWeek: 4, enabled: true, fromWallClock: "11:00", toWallClock: "17:00" },
  { dayOfWeek: 5, enabled: false, fromWallClock: "11:00", toWallClock: "17:00" },
  { dayOfWeek: 6, enabled: false, fromWallClock: "11:00", toWallClock: "17:00" },
]

describe("wallClockToInstant", () => {
  it("converts NY 11:00 in July to 15:00 UTC (EDT, UTC-4)", () => {
    const instant = wallClockToInstant("11:00:00", "America/New_York", "2026-07-15")
    expect(instant.toISOString()).toBe("2026-07-15T15:00:00.000Z")
  })

  it("converts NY 11:00 in January to 16:00 UTC (EST, UTC-5)", () => {
    const instant = wallClockToInstant("11:00:00", "America/New_York", "2026-01-15")
    expect(instant.toISOString()).toBe("2026-01-15T16:00:00.000Z")
  })

  it("accepts HH:MM form without seconds", () => {
    const instant = wallClockToInstant("11:00", "America/New_York", "2026-07-15")
    expect(instant.toISOString()).toBe("2026-07-15T15:00:00.000Z")
  })
})

describe("instantToWallClockInZone", () => {
  it("renders 15:00 UTC as 11:00 AM in NY summer", () => {
    expect(instantToWallClockInZone(new Date("2026-07-15T15:00:00Z"), "America/New_York")).toBe(
      "11:00 AM",
    )
  })

  it("renders 15:00 UTC as 12:00 AM in Tokyo", () => {
    expect(instantToWallClockInZone(new Date("2026-07-15T15:00:00Z"), "Asia/Tokyo")).toBe("12:00 AM")
  })
})

describe("dayOfWeekFromDateString", () => {
  it("returns 0 for Monday, 6 for Sunday", () => {
    expect(dayOfWeekFromDateString("2026-07-13")).toBe(0)
    expect(dayOfWeekFromDateString("2026-07-14")).toBe(1)
    expect(dayOfWeekFromDateString("2026-07-19")).toBe(6)
  })
})

describe("buildSlotsForDate DST stability", () => {
  it("returns NY 11 AM regardless of DST transition", () => {
    const summer = buildSlotsForDate({
      weeklyAvailability: WEEKDAY_11_TO_17_NY,
      storedZone: "America/New_York",
      visitorDateString: "2026-07-15",
      visitorZone: "America/New_York",
      intervalMinutes: 30,
    })
    const winter = buildSlotsForDate({
      weeklyAvailability: WEEKDAY_11_TO_17_NY,
      storedZone: "America/New_York",
      visitorDateString: "2026-01-14",
      visitorZone: "America/New_York",
      intervalMinutes: 30,
    })
    expect(summer[0]?.localLabel).toBe("11:00 AM")
    expect(winter[0]?.localLabel).toBe("11:00 AM")
  })

  it("emits 12 half-hour slots on a NY weekday for a NY visitor", () => {
    const slots = buildSlotsForDate({
      weeklyAvailability: WEEKDAY_11_TO_17_NY,
      storedZone: "America/New_York",
      visitorDateString: "2026-07-15",
      visitorZone: "America/New_York",
      intervalMinutes: 30,
    })
    expect(slots).toHaveLength(12)
    expect(slots[0].localLabel).toBe("11:00 AM")
    expect(slots[slots.length - 1].localLabel).toBe("4:30 PM")
  })

  it("emits zero slots on a disabled day (Saturday)", () => {
    const slots = buildSlotsForDate({
      weeklyAvailability: WEEKDAY_11_TO_17_NY,
      storedZone: "America/New_York",
      visitorDateString: "2026-07-18",
      visitorZone: "America/New_York",
      intervalMinutes: 30,
    })
    expect(slots).toHaveLength(0)
  })
})

describe("buildSlotsForDate cross-midnight for far zones", () => {
  it("shows Brian's Tuesday slots to a Tokyo visitor who picks the next Tokyo day", () => {
    // NY Tuesday July 14, 2026 — all 12 slots fall on Tokyo Wednesday July 15.
    const slots = buildSlotsForDate({
      weeklyAvailability: WEEKDAY_11_TO_17_NY,
      storedZone: "America/New_York",
      visitorDateString: "2026-07-15",
      visitorZone: "Asia/Tokyo",
      intervalMinutes: 30,
    })
    expect(slots).toHaveLength(12)
    expect(slots[0].localLabel).toBe("12:00 AM")
  })

  it("shows nothing to a Tokyo visitor on a Brian-weekend day", () => {
    // NY weekend: July 11 (Sat) and July 12 (Sun) are disabled.
    // Tokyo picks July 12 — corresponds to NY July 11 (disabled) + July 12 (disabled).
    const slots = buildSlotsForDate({
      weeklyAvailability: WEEKDAY_11_TO_17_NY,
      storedZone: "America/New_York",
      visitorDateString: "2026-07-12",
      visitorZone: "Asia/Tokyo",
      intervalMinutes: 30,
    })
    expect(slots).toHaveLength(0)
  })
})

describe("instantToDateStringInZone", () => {
  it("rolls date forward in Tokyo for late-UTC NY time", () => {
    const instant = new Date("2026-07-15T22:00:00Z")
    expect(instantToDateStringInZone(instant, "Asia/Tokyo")).toBe("2026-07-16")
    expect(instantToDateStringInZone(instant, "America/New_York")).toBe("2026-07-15")
  })
})
