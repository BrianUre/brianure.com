import * as Sentry from "@sentry/nextjs";

import { sharedSentryOptions } from "@/lib/sentry/shared-options";

Sentry.init(sharedSentryOptions);
