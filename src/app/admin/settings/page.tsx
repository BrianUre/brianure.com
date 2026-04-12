import { getAvailability } from "@/features/availability/actions/get-availability"
import { AvailabilityForm } from "./_components/availability-form"

export default async function AdminSettingsPage() {
  const result = await getAvailability()

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-background pb-16 pt-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-muted-foreground">Unable to load availability settings.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-16 pt-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Availability Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure your available hours for booking
          </p>
        </header>
        <AvailabilityForm initialSchedule={result.value} />
      </div>
    </main>
  )
}
