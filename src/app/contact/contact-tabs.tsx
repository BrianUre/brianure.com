"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"
import type { ServiceOption } from "@/components/composed/service-select"
import { CalendarWithSlots } from "./calendar-with-slots"
import { EmailContactForm } from "./email-contact-form"

type ContactMethod = "meeting" | "email"

interface ContactTabsProps {
  serviceOptions: ServiceOption[]
}

const methodCardVariants = cva(
  "flex flex-col items-center rounded-lg border p-6 text-center motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  {
    variants: {
      state: {
        active: "border-foreground bg-foreground text-background",
        inactive: "border-border bg-card text-foreground hover:border-foreground",
      },
    },
    defaultVariants: { state: "inactive" },
  },
)

const methodIconVariants = cva(
  "mb-3 flex h-10 w-10 items-center justify-center rounded-full border",
  {
    variants: {
      state: {
        active: "border-background/30",
        inactive: "border-border",
      },
    },
    defaultVariants: { state: "inactive" },
  },
)

const methodDescVariants = cva("text-xs", {
  variants: {
    state: {
      active: "text-background/70",
      inactive: "text-muted-foreground",
    },
  },
  defaultVariants: { state: "inactive" },
})

type MethodState = VariantProps<typeof methodCardVariants>["state"]

function ContactTabs({ serviceOptions }: ContactTabsProps) {
  const searchParams = useSearchParams()
  const [activeMethod, setActiveMethod] = useState<ContactMethod>("meeting")
  const [product, setProduct] = useState(searchParams.get("service") ?? "")

  const meetingState: MethodState = activeMethod === "meeting" ? "active" : "inactive"
  const emailState: MethodState = activeMethod === "email" ? "active" : "inactive"

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => setActiveMethod("meeting")}
          aria-pressed={activeMethod === "meeting"}
          className={cn(methodCardVariants({ state: meetingState }))}
        >
          <div className={cn(methodIconVariants({ state: meetingState }))}>
            <Image src="/images/google-meet.png" alt="Google Meet" width={20} height={20} className="size-5" />
          </div>
          <h3 className="mb-1 text-sm font-medium">Book a Meeting</h3>
          <p className={cn(methodDescVariants({ state: meetingState }))}>Schedule a call</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveMethod("email")}
          aria-pressed={activeMethod === "email"}
          className={cn(methodCardVariants({ state: emailState }))}
        >
          <div className={cn(methodIconVariants({ state: emailState }))}>
            <Image src="/images/gmail.webp" alt="Gmail" width={20} height={20} className="size-5" />
          </div>
          <h3 className="mb-1 text-sm font-medium">Email</h3>
          <p className={cn(methodDescVariants({ state: emailState }))}>Send a message</p>
        </button>

        <a
          href={process.env.NEXT_PUBLIC_SLACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(methodCardVariants({ state: "inactive" }))}
        >
          <div className={cn(methodIconVariants({ state: "inactive" }))}>
            <Image src="/images/slack.png" alt="Slack" width={20} height={20} className="size-5" />
          </div>
          <h3 className="mb-1 text-sm font-medium">Slack</h3>
          <p className={cn(methodDescVariants({ state: "inactive" }))}>Message on Slack</p>
        </a>
      </div>

      <section className="mt-12">
        {activeMethod === "meeting" ? (
          <CalendarWithSlots serviceOptions={serviceOptions} product={product} onProductChange={setProduct} />
        ) : (
          <EmailContactForm serviceOptions={serviceOptions} product={product} onProductChange={setProduct} />
        )}
      </section>
    </>
  )
}

export { ContactTabs }
