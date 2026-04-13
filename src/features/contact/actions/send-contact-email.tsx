"use server"

import { z } from "zod"

import { sendEmail } from "@/lib/resend"
import { ContactEmail } from "../emails/contact-email"
import { err } from "@/types/result"
import type { Result } from "@/types/result"

const contactEmailSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  productLabel: z.string().min(1),
  message: z.string().min(1),
})

type ContactEmailError = {
  message: string
}

async function sendContactEmail(input: unknown): Promise<Result<void, ContactEmailError>> {
  const parsed = contactEmailSchema.safeParse(input)
  if (!parsed.success) {
    return err({ message: "Please fill in all required fields." })
  }

  const { name, email, productLabel, message } = parsed.data

  const result = await sendEmail({
    from: process.env.RESEND_CONTACT_EMAIL!,
    to: process.env.EMAIL_CONTACT_RECIPIENT!,
    subject: `New message from ${name} — ${productLabel}`,
    react: <ContactEmail name={name} email={email} productLabel={productLabel} message={message} />,
    replyTo: email,
  })

  if (!result.ok) {
    return err({ message: "Failed to send your message. Please try again." })
  }

  return result
}

export { sendContactEmail }
