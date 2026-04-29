import { Suspense } from "react"
import { getServices } from "@/features/services/actions/get-services"
import { getAvailability } from "@/features/availability/actions/get-availability"
import { getBusyIntervals } from "@/lib/google-calendar"
import { ContactTabs } from "./contact-tabs"

const BOOKING_HORIZON_DAYS = 30

export default async function ContactPage() {
  const timeMin = new Date()
  const timeMax = new Date(timeMin.getTime() + BOOKING_HORIZON_DAYS * 24 * 60 * 60 * 1000)

  const [servicesResult, availabilityResult, busyResult] = await Promise.all([
    getServices(),
    getAvailability(),
    getBusyIntervals(timeMin.toISOString(), timeMax.toISOString()),
  ])

  const serviceOptions = servicesResult.ok
    ? [
        ...servicesResult.value.weeklyPackages.map((p) => ({
          value: p.priceId,
          label: `Weekly ${p.hours} Hours`,
        })),
        { value: "project-planning", label: "Project planning" },
        { value: "other", label: "Other" },
      ]
    : [{ value: "other", label: "Other" }]

  const availability = availabilityResult.ok ? availabilityResult.value : []
  const busyIntervals = busyResult.ok ? busyResult.value : []

  return (
    <main className="min-h-screen bg-background px-2 sm:px-6 pb-24 pt-32">
      <div className="mx-auto max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-balance text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-muted-foreground">Choose how you&apos;d like to connect</p>
        </header>

        <Suspense>
          <ContactTabs
            serviceOptions={serviceOptions}
            availability={availability}
            busyIntervals={busyIntervals}
          />
        </Suspense>
      </div>
    </main>
  )
}
