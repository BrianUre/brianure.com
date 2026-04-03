"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun className="hidden size-4 text-muted-foreground dark:block" />
      <Moon className="block size-4 text-muted-foreground dark:hidden" />
      <Switch
        checked={resolvedTheme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
    </div>
  );
}
