"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { ok, err } from "@/types/result"
import type { Result } from "@/types/result"
import { displayTimeToDb } from "../utils/time-convert"
import type { DayAvailability, AvailabilityError } from "../types/availability"

const DayAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  enabled: z.boolean(),
  from: z.string().min(1),
  to: z.string().min(1),
  zone: z.string().min(1),
})

const ScheduleSchema = z.array(DayAvailabilitySchema).length(7)

async function saveAvailability(
  schedule: DayAvailability[]
): Promise<Result<void, AvailabilityError>> {
  const parsed = ScheduleSchema.safeParse(schedule)
  if (!parsed.success) {
    return err({ code: "SAVE_FAILED", message: parsed.error.message })
  }

  const rows = parsed.data.map((day) => ({
    day_of_week: day.dayOfWeek,
    enabled: day.enabled,
    from_time: displayTimeToDb(day.from),
    to_time: displayTimeToDb(day.to),
    timezone: day.zone,
  }))

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("availability_schedule")
      .upsert(rows, { onConflict: "day_of_week" })

    if (error) {
      console.error("[saveAvailability] Supabase error:", error)
      return err({ code: "SAVE_FAILED", message: error.message })
    }

    return ok(undefined)
  } catch (e) {
    return err({
      code: "SAVE_FAILED",
      message: e instanceof Error ? e.message : "Failed to save availability",
    })
  }
}

export { saveAvailability }
