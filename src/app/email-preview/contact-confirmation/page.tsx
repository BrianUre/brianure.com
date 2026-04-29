import { ContactConfirmationEmail } from "@/features/contact/emails/contact-confirmation-email"

export default function ContactConfirmationEmailPreview() {
  return (
    <ContactConfirmationEmail
      name="Jane Smith"
      message={"Hi Brian,\n\nI'd love to discuss a project with you.\n\nLooking forward to connecting!"}
    />
  )
}
