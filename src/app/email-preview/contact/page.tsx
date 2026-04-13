import { ContactEmail } from "@/features/contact/emails/contact-email"

export default function ContactEmailPreview() {
  return (
    <ContactEmail
      name="Jane Smith"
      email="jane@example.com"
      productLabel="Full Stack Development"
      message={"Hi Brian,\n\nI'd love to discuss a project with you.\n\nLooking forward to connecting!"}
    />
  )
}
