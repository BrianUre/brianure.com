import { test, expect } from "@playwright/test"
import { TEST_IDS } from "@/test-ids"

const TEST_VISITOR_EMAIL = "test@brianure.com"
const TEST_VISITOR_NAME = "Playwright Test"
const TEST_MESSAGE = "Automated end-to-end test message — please ignore."

test.describe("Contact email flow", () => {
  test("submits the email form and shows the confirmation view", async ({ page }) => {
    await page.goto("/contact")

    await page.getByTestId(TEST_IDS.contact.method.email).click()

    await page.getByTestId(TEST_IDS.contact.emailForm.name).fill(TEST_VISITOR_NAME)
    await page.getByTestId(TEST_IDS.contact.emailForm.email).fill(TEST_VISITOR_EMAIL)
    await page.getByTestId(TEST_IDS.contact.emailForm.message).fill(TEST_MESSAGE)

    await page.getByTestId(TEST_IDS.contact.emailForm.submit).click()

    await expect(page.getByTestId(TEST_IDS.contact.emailForm.success)).toBeVisible({
      timeout: 30_000,
    })
  })
})
