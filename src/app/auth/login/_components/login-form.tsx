"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = "idle" | "loading" | "sent" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    setGoogleLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setState("error");
      return;
    }

    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="text-center">
        <p className="text-foreground">Check your email</p>
        <p className="mt-1 text-sm text-muted-foreground">
          A sign-in link was sent to <span className="text-foreground">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || state === "loading"}
      >
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-muted-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={state === "loading"}
            autoComplete="email"
          />
        </div>

        {state === "error" && errorMessage !== null && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          variant="solid"
          className="w-full"
          disabled={state === "loading"}
        >
          {state === "loading" ? "Sending…" : "Send sign-in link"}
        </Button>
      </form>
    </div>
  );
}
