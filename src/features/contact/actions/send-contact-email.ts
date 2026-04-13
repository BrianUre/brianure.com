"use server"

import { z } from "zod"

import { sendEmail } from "@/lib/resend"
import { err } from "@/types/result"
import type { Result } from "@/types/result"

const contactEmailSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  product: z.string().min(1),
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

  const { name, email, product, message } = parsed.data

  const html = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Product of Interest:</strong> ${product}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br>")}</p>
  `

  const result = await sendEmail({
    from: process.env.RESEND_CONTACT_EMAIL!,
    to: process.env.EMAIL_CONTACT_RECIPIENT!,
    subject: `New message from ${name} — ${product}`,
    html,
    replyTo: email,
  })

  if (!result.ok) {
    return err({ message: "Failed to send your message. Please try again." })
  }

  return result
}

export { sendContactEmail }
