import { BookingConfirmationEmail } from "@/features/booking/emails/booking-confirmation-email"

export default function BookingConfirmationVisitorPreview() {
  return (
    <BookingConfirmationEmail
      audience="visitor"
      name="Jane Smith"
      email="jane@example.com"
      startWallClock="April 30, 2026 at 3:00 PM EDT"
      meetLink="https://meet.google.com/abc-defg-hij"
    />
  )
}
