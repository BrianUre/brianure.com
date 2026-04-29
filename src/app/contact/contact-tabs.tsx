"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ServiceOption } from "@/components/composed/service-select"
import type { DayAvailability } from "@/features/availability/types/availability"
import type { BusyInterval } from "@/lib/google-calendar"
import { CalendarWithSlots } from "./calendar-with-slots"
import { EmailContactForm } from "./email-contact-form"

type ContactMethod = "meeting" | "email"

interface ContactTabsProps {
  serviceOptions: ServiceOption[]
  availability: DayAvailability[]
  busyIntervals: BusyInterval[]
}

const methodCardVariants = cva(
  "flex flex-col items-center rounded-lg border p-3 text-center motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:p-6",
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
  "sm:mb-3 flex h-10 w-10 items-center justify-center rounded-full border",
  {
    variants: {
      state: {
        active: "border-background/30 !bg-white/90 dark:bg-transparent",
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

function ContactTabs({ serviceOptions, availability, busyIntervals }: ContactTabsProps) {
  const searchParams = useSearchParams()
  const [activeMethod, setActiveMethod] = useState<ContactMethod>("meeting")
  const [product, setProduct] = useState(searchParams.get("service") ?? "")

  const meetingState: MethodState = activeMethod === "meeting" ? "active" : "inactive"
  const emailState: MethodState = activeMethod === "email" ? "active" : "inactive"

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveMethod("meeting")}
          aria-pressed={activeMethod === "meeting"}
          className={cn(methodCardVariants({ state: meetingState }))}
        >
          <div className={cn(methodIconVariants({ state: meetingState }))}>
            <Image src="/images/google-meet.png" alt="Google Meet" width={20} height={20} className="size-5" />
          </div>
          <h3 className="sm:mb-1 hidden text-sm font-medium sm:block">Book a Meeting</h3>
          <p className={cn(methodDescVariants({ state: meetingState }), "hidden sm:block")}>Let&apos;s talk about your project and get started</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveMethod("email")}
          aria-pressed={activeMethod === "email"}
          className={cn(methodCardVariants({ state: emailState }))}
        >
          <div className={cn(methodIconVariants({ state: emailState }))}>
            <Image src="/images/gmail.png" alt="Gmail" width={18} height={18} className="size-5 " />
          </div>
          <h3 className="sm:mb-1 hidden text-sm font-medium sm:block">Email</h3>
          <p className={cn(methodDescVariants({ state: emailState }), "hidden sm:block")}>Ask me any questions</p>
        </button>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className={cn(methodCardVariants({ state: "inactive" }))}
            >
              <div className={cn(methodIconVariants({ state: "inactive" }))}>
                <Image src="/images/whatsapp.png" alt="WhatsApp" width={20} height={20} className="size-6" />
              </div>
              <h3 className="sm:mb-1 hidden text-sm font-medium sm:block">WhatsApp</h3>
              <p className={cn(methodDescVariants({ state: "inactive" }), "hidden sm:block")}>Message me directly on WhatsApp</p>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open WhatsApp?</DialogTitle>
              <DialogDescription>
                You&apos;ll be taken to WhatsApp in a new tab to start a chat.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button asChild variant="solid">
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open WhatsApp
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <section className="mt-12">
        {activeMethod === "meeting" ? (
          <CalendarWithSlots
            serviceOptions={serviceOptions}
            availability={availability}
            busyIntervals={busyIntervals}
            product={product}
            onProductChange={setProduct}
          />
        ) : (
          <EmailContactForm serviceOptions={serviceOptions} product={product} onProductChange={setProduct} />
        )}
      </section>
    </>
  )
}

export { ContactTabs }
