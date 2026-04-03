import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

export default function ContactPage() {
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
          <div className="rounded-lg border border-border bg-card p-8">
            <CalendarUI />
          </div>
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
}: {
  logo: { src: string; alt: string }
  title: string
  description: string
  buttonText: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border">
        <Image src={logo.src} alt={logo.alt} width={24} height={24} className="size-6" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      <Button variant="outline" className="w-full">
        {buttonText}
      </Button>
    </div>
  )
}

function CalendarUI() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const currentMonth = "April 2026"

  const dates = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2
    if (day < 1) return { day: 29 + day, muted: true }
    if (day > 30) return { day: day - 30, muted: true }
    return { day, muted: false }
  })

  const availableDays = [7, 8, 9, 14, 15, 16, 21, 22, 23, 28, 29, 30]

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex items-center justify-between">
        <Button size="icon" variant="ghost" aria-label="Previous month">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <span className="text-sm font-medium text-foreground">{currentMonth}</span>
        <Button size="icon" variant="ghost" aria-label="Next month">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, i) => {
          const isAvailable = !date.muted && availableDays.includes(date.day)
          return (
            <button
              key={i}
              disabled={date.muted || !isAvailable}
              className={cn(
                "aspect-square rounded-md p-2 text-sm transition-colors",
                date.muted
                  ? "text-muted-foreground/30"
                  : isAvailable
                    ? "text-foreground hover:bg-foreground hover:text-background"
                    : "text-muted-foreground/50",
              )}
            >
              {date.day}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-foreground"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-muted-foreground/30"></span>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}
