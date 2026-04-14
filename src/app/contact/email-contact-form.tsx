"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ServiceSelect } from "@/components/composed/service-select"
import type { ServiceOption } from "@/components/composed/service-select"
import { sendContactEmail } from "@/features/contact/actions/send-contact-email"

interface EmailContactFormProps {
  serviceOptions: ServiceOption[]
  product: string
  onProductChange: (value: string) => void
}

function EmailContactForm({ serviceOptions, product, onProductChange }: EmailContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit() {
    setStatus("loading")
    const productLabel = serviceOptions.find((option) => option.value === product)?.label ?? product
    const result = await sendContactEmail({ name, email, productLabel, message })
    if (result.ok) {
      setStatus("success")
    } else {
      setStatus("error")
      setErrorMessage(result.error.message)
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-foreground">Message sent!</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-border bg-card p-3 sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-lg font-medium text-foreground">Send a Message</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill out the form and I&apos;ll get back to you soon
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="email-form-name" className="mb-2 block text-xs font-medium text-muted-foreground">
            Name
          </label>
          <Input
            id="email-form-name"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email-form-address" className="mb-2 block text-xs font-medium text-muted-foreground">
            Email
          </label>
          <Input
            id="email-form-address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email-form-product" className="mb-2 block text-xs font-medium text-muted-foreground">
            Product of Interest
          </label>
          <ServiceSelect
            id="email-form-product"
            serviceOptions={serviceOptions}
            value={product}
            onValueChange={onProductChange}
          />
        </div>

        <div>
          <label htmlFor="email-form-message" className="mb-2 block text-xs font-medium text-muted-foreground">
            Message
          </label>
          <Textarea
            id="email-form-message"
            placeholder="Tell me about your project..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-32"
          />
        </div>

        <Button
          className="mt-2 w-full"
          variant="solid"
          disabled={status === "loading" || !name || !email || !product || !message}
          onClick={handleSubmit}
        >
          {status === "loading" ? "Sending…" : "Send Message"}
        </Button>

        {status === "error" && (
          <p className="text-center text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    </div>
  )
}

export { EmailContactForm }
export type { EmailContactFormProps }
