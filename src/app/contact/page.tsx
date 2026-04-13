import { getServices } from "@/features/services/actions/get-services"
import { ContactTabs } from "./contact-tabs"

export default async function ContactPage() {
  const servicesResult = await getServices()
  const serviceOptions = servicesResult.ok
    ? [
        ...servicesResult.value.weeklyPackages.map((p) => ({
          value: p.priceId,
          label: `Weekly ${p.hours} Hours`,
        })),
        ...servicesResult.value.oneTimeServices.map((s) => ({
          value: s.priceId,
          label: s.title,
        })),
        { value: "other", label: "Other" },
      ]
    : [{ value: "other", label: "Other" }]

  return (
    <main className="min-h-screen bg-background px-6 pb-24 pt-32">
      <div className="mx-auto max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-balance text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-muted-foreground">Choose how you&apos;d like to connect</p>
        </header>

        <ContactTabs serviceOptions={serviceOptions} />
      </div>
    </main>
  )
}
