import { test, expect } from "@playwright/test"
import { TEST_IDS } from "@/test-ids"
import { deleteCalendarEvent, deleteCalendarEventsByAttendee } from "../helpers/calendar-cleanup"

const TEST_ATTENDEE_EMAIL = "playwright@brianure.test"
const TEST_ATTENDEE_NAME = "Playwright Test"

test.describe("Booking flow", () => {
  let eventIdToCleanup: string | null = null

  test.afterEach(async () => {
    if (eventIdToCleanup) {
      await deleteCalendarEvent(eventIdToCleanup)
      eventIdToCleanup = null
      return
    }
    await deleteCalendarEventsByAttendee(TEST_ATTENDEE_EMAIL)
  })

  test("confirms the booking and shows the success banner", async ({ page }) => {
    await page.goto("/contact")

    await page.getByTestId(TEST_IDS.booking.calendar.day).first().click()
    await page.getByTestId(TEST_IDS.booking.timeSlot).first().click()

    await page.getByTestId(TEST_IDS.booking.form.name).fill(TEST_ATTENDEE_NAME)
    await page.getByTestId(TEST_IDS.booking.form.email).fill(TEST_ATTENDEE_EMAIL)

    await page.getByTestId(TEST_IDS.booking.form.product).click()
    await page.getByTestId(TEST_IDS.booking.form.productOption).first().click()

    await page.getByTestId(TEST_IDS.booking.form.submit).click()

    const successBanner = page.getByTestId(TEST_IDS.booking.success)
    await expect(successBanner).toBeVisible({ timeout: 30_000 })

    const eventId = await successBanner.getAttribute("data-event-id")
    expect(eventId).toBeTruthy()
    eventIdToCleanup = eventId
  })
})
