import * as Sentry from "@sentry/nextjs";

async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Captures errors thrown in Server Components, Server Actions, and Route Handlers.
const onRequestError = Sentry.captureRequestError;

export { register, onRequestError };
