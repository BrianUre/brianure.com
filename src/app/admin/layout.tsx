"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <>
      <div className="flex justify-end px-6 py-3">
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
      {children}
    </>
  );
}
