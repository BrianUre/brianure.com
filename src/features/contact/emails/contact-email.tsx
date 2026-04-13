import {
  Body,
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

interface ContactEmailProps {
  name: string
  email: string
  productLabel: string
  message: string
}

const colors = {
  background: "#1a1a1a",
  card: "#222222",
  foreground: "#f5f5f5",
  muted: "#a3a3a3",
  border: "#383838",
}

function ContactEmail({ name, email, productLabel, message }: ContactEmailProps) {
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo-dark.png`

  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: colors.background, margin: "0", padding: "0" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>

          {/* Header */}
          <Section style={{ textAlign: "center", paddingBottom: "32px" }}>
            <Img src={logoUrl} alt="Brian Ure" height={40} style={{ display: "inline-block" }} />
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "0 0 32px 0" }} />

          {/* Content */}
          <Section style={{ backgroundColor: colors.card, borderRadius: "8px" }}>
            <Row>
              <Column style={{ padding: "32px" }}>
                <Heading
                  style={{
                    margin: "0 0 24px 0",
                    fontSize: "20px",
                    fontWeight: "500",
                    color: colors.foreground,
                    letterSpacing: "-0.025em",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  New message from {name}
                </Heading>

                <Field label="Name" value={name} />
                <Field label="Email" value={email} />
                <Field label="Product of Interest" value={productLabel} />
                <Field label="Message" value={message} last />
              </Column>
            </Row>
          </Section>

          {/* Footer */}
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
              You received this email because someone submitted the contact form at brianure.com.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

function Field({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <Section style={{ marginBottom: last ? "0" : "20px" }}>
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

export { ContactEmail }
export type { ContactEmailProps }
