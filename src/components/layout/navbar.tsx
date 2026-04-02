"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Switch } from "@/components/ui/switch";

const navLinks = [
  { href: "/trajectory", label: "Trajectory" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-12 lg:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-dark.png"
            alt="Brian Ure"
            width={40}
            height={40}
            className="hidden dark:block"
          />
          <Image
            src="/images/logo-light.png"
            alt="Brian Ure"
            width={40}
            height={40}
            className="block dark:hidden"
          />
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <Sun className="hidden size-4 text-muted-foreground dark:block" />
            <Moon className="block size-4 text-muted-foreground dark:hidden" />
            <Switch
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
