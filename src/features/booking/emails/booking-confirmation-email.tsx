import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components"

interface BookingConfirmationEmailProps {
  audience: "visitor" | "host"
  name: string
  email: string
  startWallClock: string
  meetLink: string | null
}

const colors = {
  background: "#1a1a1a",
  card: "#222222",
  foreground: "#f5f5f5",
  muted: "#a3a3a3",
  border: "#383838",
  accent: "#f5f5f5",
}

function BookingConfirmationEmail({
  audience,
  name,
  email,
  startWallClock,
  meetLink,
}: BookingConfirmationEmailProps) {
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo-dark.png`
  const heading =
    audience === "visitor"
      ? "Your booking with Brian is confirmed"
      : `New booking from ${name}`
  const intro =
    audience === "visitor"
      ? "Thanks for booking — I'm looking forward to our conversation. Here are the details:"
      : "A new meeting has just been booked. Details below:"
  const footerLine =
    audience === "visitor"
      ? "You received this email because you booked a meeting at brianure.com."
      : "You received this email because someone booked a meeting at brianure.com."

  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: colors.background, margin: "0", padding: "0" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
          <Section style={{ textAlign: "center", paddingBottom: "32px" }}>
            <Img src={logoUrl} alt="Brian Ure" height={40} style={{ display: "inline-block" }} />
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "0 0 32px 0" }} />

          <Section style={{ backgroundColor: colors.card, borderRadius: "8px" }}>
            <Row>
              <Column style={{ padding: "32px" }}>
                <Heading
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "20px",
                    fontWeight: "500",
                    color: colors.foreground,
                    letterSpacing: "-0.025em",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {heading}
                </Heading>

                <Text
                  style={{
                    margin: "0 0 24px 0",
                    fontSize: "14px",
                    color: colors.muted,
                    lineHeight: "1.6",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {intro}
                </Text>

                {audience === "host" && (
                  <>
                    <Field label="Name" value={name} />
                    <Field label="Email" value={email} />
                  </>
                )}
                <Field label="When" value={startWallClock} />

                {meetLink && (
                  <Section style={{ marginTop: "8px" }}>
                    <Text
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "11px",
                        fontWeight: "500",
                        color: colors.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      Google Meet
                    </Text>
                    <Button
                      href={meetLink}
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        padding: "10px 20px",
                        backgroundColor: colors.accent,
                        color: colors.background,
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "500",
                        textDecoration: "none",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      Join the meeting
                    </Button>
                    <Text
                      style={{
                        margin: "12px 0 0 0",
                        fontSize: "12px",
                        color: colors.muted,
                        wordBreak: "break-all",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {meetLink}
                    </Text>
                  </Section>
                )}
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "32px 0 24px 0" }} />

          <Section style={{ textAlign: "center" }}>
            <Text
              style={{
                margin: "0 0 4px 0",
                fontSize: "14px",
                fontWeight: "500",
                color: colors.foreground,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Brian Ure
            </Text>
            <Text
              style={{
                margin: "0 0 16px 0",
                fontSize: "13px",
                color: colors.muted,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Helping startups bring their businesses online.
            </Text>
            <Text
              style={{
                margin: "0",
                fontSize: "12px",
                color: colors.border,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {footerLine}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ marginBottom: "20px" }}>
      <Text
        style={{
          margin: "0 0 4px 0",
          fontSize: "11px",
          fontWeight: "500",
          color: colors.muted,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          margin: "0",
          fontSize: "14px",
          color: colors.foreground,
          lineHeight: "1.6",
          fontFamily: "system-ui, -apple-system, sans-serif",
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </Text>
    </Section>
  )
}

export { BookingConfirmationEmail }
export type { BookingConfirmationEmailProps }
