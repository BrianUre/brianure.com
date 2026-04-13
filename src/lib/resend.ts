import "server-only"

import { Resend } from "resend"
import { z } from "zod"

import { err, ok } from "@/types/result"
import type { Result } from "@/types/result"

const SendEmailSchema = z.object({
  from: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  replyTo: z.string().email().optional(),
})

type SendEmailOptions = z.infer<typeof SendEmailSchema>

type SendEmailErrorCode = "VALIDATION_FAILED" | "RESEND_SEND_FAILED"

type SendEmailError = {
  code: SendEmailErrorCode
  message: string
}

async function sendEmail(
  options: SendEmailOptions,
): Promise<Result<void, SendEmailError>> {
  const parsed = SendEmailSchema.safeParse(options)

  if (!parsed.success) {
    return err({
      code: "VALIDATION_FAILED",
      message: parsed.error.message,
    })
  }

  const { from, to, subject, html, replyTo } = parsed.data

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    })

    if (error) {
      console.error("[sendEmail] Resend error:", error)
      return err({ code: "RESEND_SEND_FAILED", message: error.message })
    }

    return ok(undefined)
  } catch (e) {
    console.error("[sendEmail] Resend error:", e)
    return err({
      code: "RESEND_SEND_FAILED",
      message: e instanceof Error ? e.message : "Failed to send email",
    })
  }
}

export { sendEmail }
export type { SendEmailError, SendEmailErrorCode, SendEmailOptions }
