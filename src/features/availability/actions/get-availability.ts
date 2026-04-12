"use server"

import { createClient } from "@/lib/supabase/server"
import { ok, err } from "@/types/result"
import type { Result } from "@/types/result"
import { dbTimeToDisplay } from "../utils/time-convert"
import type { DayAvailability, AvailabilityError } from "../types/availability"

async function getAvailability(): Promise<Result<DayAvailability[], AvailabilityError>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("availability_schedule")
      .select("*")
      .order("day_of_week")

    if (error) {
      return err({ code: "FETCH_FAILED", message: error.message })
    }

    const availability: DayAvailability[] = data.map((row) => ({
      dayOfWeek: row.day_of_week,
      enabled: row.enabled,
      from: dbTimeToDisplay(row.from_time),
      to: dbTimeToDisplay(row.to_time),
    }))

    return ok(availability)
  } catch (e) {
    return err({
      code: "FETCH_FAILED",
      message: e instanceof Error ? e.message : "Failed to fetch availability",
    })
  }
}

export { getAvailability }
