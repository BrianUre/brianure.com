import "server-only"

import type React from "react"
import { Resend } from "resend"
import { z } from "zod"

import { err, ok } from "@/types/result"
import type { Result } from "@/types/result"

const SendEmailBaseSchema = z.object({
  from: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1),
  replyTo: z.string().email().optional(),
})

type SendEmailBase = z.infer<typeof SendEmailBaseSchema>

type SendEmailOptions =
  | (SendEmailBase & { react: React.ReactElement; html?: never })
  | (SendEmailBase & { html: string; react?: never })

type SendEmailErrorCode = "VALIDATION_FAILED" | "RESEND_SEND_FAILED"

type SendEmailError = {
  code: SendEmailErrorCode
  message: string
}

async function sendEmail(
  options: SendEmailOptions,
): Promise<Result<void, SendEmailError>> {
  const parsed = SendEmailBaseSchema.safeParse(options)

  if (!parsed.success) {
    return err({
      code: "VALIDATION_FAILED",
      message: parsed.error.message,
    })
  }

  const { from, to, subject, replyTo } = parsed.data
  const body = "react" in options && options.react
    ? { react: options.react }
    : { html: (options as { html: string }).html }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      ...(replyTo ? { replyTo } : {}),
      ...body,
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
