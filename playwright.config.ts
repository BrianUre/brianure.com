import { defineConfig } from "@playwright/test"
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

const baseURL = process.env.NEXT_PUBLIC_SITE_URL
if (!baseURL) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be set to run Playwright tests")
}

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL },
})
