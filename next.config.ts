import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only needed at build time for source map upload; when absent the upload is skipped and the build still passes.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Upload a larger set of client source maps so stack traces stay readable.
  widenClientFileUpload: true,
  // Route events through the app so ad blockers don't drop them.
  tunnelRoute: "/monitoring",
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
});
