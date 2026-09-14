import * as Sentry from "@sentry/nextjs";

import { sharedSentryOptions } from "@/lib/sentry/shared-options";

Sentry.init(sharedSentryOptions);

// Lets Sentry trace App Router navigations as transactions.
const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

export { onRouterTransitionStart };
