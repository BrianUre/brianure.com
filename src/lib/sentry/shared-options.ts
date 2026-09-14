const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? null;

// Vercel injects NEXT_PUBLIC_VERCEL_ENV ("production" | "preview" | "development") on every build.
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV;

// Sample 10% of transactions in production to stay within quota; trace everything elsewhere.
const TRACES_SAMPLE_RATE = SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0;

const sharedSentryOptions = {
  dsn: SENTRY_DSN ?? undefined,
  // Without a DSN the SDK is a no-op, so local dev and CI never send events.
  enabled: SENTRY_DSN !== null,
  environment: SENTRY_ENVIRONMENT,
  tracesSampleRate: TRACES_SAMPLE_RATE,
  sendDefaultPii: false,
};

export { sharedSentryOptions };
