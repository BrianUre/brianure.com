import type { BusyInterval } from "@/lib/google-calendar"

function overlapsBusy(slotStart: Date, slotEnd: Date, busy: BusyInterval[]): boolean {
  for (const interval of busy) {
    if (slotEnd > interval.start && slotStart < interval.end) {
      return true
    }
  }
  return false
}

export { overlapsBusy }
