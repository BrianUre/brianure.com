import { BookingConfirmationEmail } from "@/features/booking/emails/booking-confirmation-email"

export default function BookingConfirmationHostPreview() {
  return (
    <BookingConfirmationEmail
      audience="host"
      name="Jane Smith"
      email="jane@example.com"
      startWallClock="April 30, 2026 at 12:00 PM PDT"
      meetLink="https://meet.google.com/abc-defg-hij"
    />
  )
}
