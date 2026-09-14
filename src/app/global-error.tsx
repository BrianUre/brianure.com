"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Replaces the root layout when it throws, so it must render its own <html> and <body>.
export default function GlobalError({ error, reset }: GlobalErrorProps): React.ReactElement {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold md:text-3xl">Something went wrong</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              I&apos;ve been notified and will take a look. In the meantime, you can try again.
            </p>
          </div>
          <Button variant="solid" onClick={reset}>
            Try again
          </Button>
        </main>
      </body>
    </html>
  );
}
