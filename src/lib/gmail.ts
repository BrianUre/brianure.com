import "server-only";

import { google } from "googleapis";
import { z } from "zod";

import { err, ok } from "@/types/result";
import type { Result } from "@/types/result";

const SendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  replyTo: z.string().email().optional(),
});

type SendEmailOptions = z.infer<typeof SendEmailSchema>;

type SendEmailErrorCode = "VALIDATION_FAILED" | "GMAIL_SEND_FAILED";

type SendEmailError = {
  code: SendEmailErrorCode;
  message: string;
};

function getGmail() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
}

async function sendEmail(
  options: SendEmailOptions,
): Promise<Result<void, SendEmailError>> {
  const parsed = SendEmailSchema.safeParse(options);

  if (!parsed.success) {
    return err({
      code: "VALIDATION_FAILED",
      message: parsed.error.message,
    });
  }

  const { to, subject, html, replyTo } = parsed.data;

  const fromName = "Brian Ure";
  const fromEmail = process.env.GOOGLE_SENDER_EMAIL!;

  const headers = [
    `From: ${fromName} <${fromEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
  ]
    .filter(Boolean)
    .join("\r\n");

  const raw = `${headers}\r\n\r\n${html}`;
  const encoded = Buffer.from(raw).toString("base64url");

  try {
    const gmail = getGmail();

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encoded },
    });

    return ok(undefined);
  } catch (e) {
    console.error("[sendEmail] Gmail API error:", e);

    return err({
      code: "GMAIL_SEND_FAILED",
      message: e instanceof Error ? e.message : "Failed to send email",
    });
  }
}

export { sendEmail };
export type { SendEmailError, SendEmailErrorCode, SendEmailOptions };
