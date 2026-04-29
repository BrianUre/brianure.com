const TEST_IDS = {
  booking: {
    calendar: {
      day: "booking-calendar-day",
    },
    timeSlot: "booking-time-slot",
    timeCaption: "booking-time-caption",
    form: {
      name: "booking-form-name",
      email: "booking-form-email",
      product: "booking-form-product",
      productOption: "booking-form-product-option",
      submit: "booking-form-submit",
    },
    success: "booking-success",
  },
  contact: {
    method: {
      email: "contact-method-email",
    },
    emailForm: {
      name: "contact-email-form-name",
      email: "contact-email-form-email",
      message: "contact-email-form-message",
      submit: "contact-email-form-submit",
      success: "contact-email-form-success",
    },
  },
} as const

export { TEST_IDS }
