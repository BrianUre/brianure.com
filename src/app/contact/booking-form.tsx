"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ServiceSelect } from "@/components/composed/service-select"
import type { ServiceOption } from "@/components/composed/service-select"
import { TEST_IDS } from "@/test-ids"
import { createBooking } from "@/features/booking/actions/create-booking"
import { instantToWallClockInZone } from "@/features/availability/utils/zone"
import type { Slot } from "@/features/availability/utils/zone"

interface BookingFormProps {
  serviceOptions: ServiceOption[]
  product: string
  onProductChange: (value: string) => void
  selectedSlot: Slot | null
  visitorZone: string
}

export function BookingForm({
  serviceOptions,
  product,
  onProductChange,
  selectedSlot,
  visitorZone,
}: BookingFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [eventId, setEventId] = useState<string | null>(null)

  async function handleSubmit() {
    if (!selectedSlot) {
      return
    }
    setStatus("loading")
    const result = await createBooking({
      name,
      email,
      utcInstant: selectedSlot.utcInstant.toISOString(),
    })
    if (result.ok) {
      setEventId(result.value.eventId)
      setStatus("success")
      return
    }
    setStatus("error")
    setErrorMessage(result.error.message)
  }

  const slotLabel = selectedSlot
    ? `${selectedSlot.utcInstant.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: visitorZone,
      })} at ${instantToWallClockInZone(selectedSlot.utcInstant, visitorZone)}`
    : null

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">Your Details</h3>
        <p className="mt-1 text-xs text-muted-foreground">Fill in your information to book</p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div>
          <label htmlFor="booking-name" className="mb-2 block text-xs font-medium text-muted-foreground">
            Name
          </label>
          <Input
            id="booking-name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid={TEST_IDS.booking.form.name}
          />
        </div>

        <div>
          <label htmlFor="booking-email" className="mb-2 block text-xs font-medium text-muted-foreground">
            Email
          </label>
          <Input
            id="booking-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid={TEST_IDS.booking.form.email}
          />
        </div>

        <div hidden>
          <label htmlFor="booking-product" className="mb-2 block text-xs font-medium text-muted-foreground">
            Product of Interest
          </label>
          <ServiceSelect
            id="booking-product"
            serviceOptions={serviceOptions}
            value={product}
            onValueChange={onProductChange}
            triggerTestId={TEST_IDS.booking.form.product}
            itemTestId={TEST_IDS.booking.form.productOption}
          />
        </div>
      </div>

      <div className="mt-6">
        {status === "success" ? (
          <div
            className="rounded-md border border-border bg-muted p-4 text-center"
            data-testid={TEST_IDS.booking.success}
            data-event-id={eventId ?? ""}
          >
            <p className="text-sm font-medium text-foreground">Booking confirmed!</p>
            {slotLabel && (
              <p className="mt-1 text-xs text-muted-foreground">{slotLabel}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Check your email for the calendar invite.</p>
          </div>
        ) : (
          <>
            <Button
              className="w-full"
              disabled={status === "loading" || !selectedSlot || !name || !email}
              onClick={handleSubmit}
              data-testid={TEST_IDS.booking.form.submit}
            >
              {status === "loading" ? "Booking…" : "Confirm Booking"}
            </Button>
            {status === "error" && (
              <p className="mt-2 text-center text-xs text-destructive">{errorMessage}</p>
            )}
            {slotLabel && status !== "error" && (
              <p className="mt-2 text-center text-xs text-muted-foreground">{slotLabel}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
