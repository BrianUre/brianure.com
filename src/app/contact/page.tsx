import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getServices } from "@/features/services/actions/get-services"
import { CalendarWithSlots } from "./calendar-with-slots"

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
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 text-center">
          <h1 className="text-balance text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-muted-foreground">
            Choose how you&apos;d like to connect
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <ContactOption
            logo={{ src: "/images/gmail.webp", alt: "Gmail" }}
            title="Email"
            description="Send me a message directly"
            buttonText="Send Email"
          />
          <ContactOption
            logo={{ src: "/images/slack.png", alt: "Slack" }}
            title="Slack"
            description="Message me on Slack"
            buttonText="Open Slack"
            href={process.env.NEXT_PUBLIC_SLACK_URL}
          />
        </div>

        <section className="mt-24">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Image
              src="/images/google-meet.png"
              alt="Google Meet"
              width={24}
              height={24}
              className="size-6"
            />
            <h2 className="text-xl font-light tracking-tight text-foreground">
              Schedule a Meeting
            </h2>
          </div>
          <CalendarWithSlots serviceOptions={serviceOptions} />
        </section>
      </div>
    </main>
  )
}

function ContactOption({
  logo,
  title,
  description,
  buttonText,
  href,
}: {
  logo: { src: string; alt: string }
  title: string
  description: string
  buttonText: string
  href?: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border">
        <Image src={logo.src} alt={logo.alt} width={24} height={24} className="size-6" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      {href ? (
        <Button variant="outline" className="w-full" asChild>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {buttonText}
          </a>
        </Button>
      ) : (
        <Button variant="outline" className="w-full" disabled>
          {buttonText}
        </Button>
      )}
    </div>
  )
}

