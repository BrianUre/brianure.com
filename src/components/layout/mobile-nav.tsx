"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { navLinks } from "@/config/navigation";
import { cn } from "@/utils/cn";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <SheetHeader className="flex justify-center border-b border-border gap-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/images/logo-dark.png"
              alt="Brian Ure"
              width={32}
              height={32}
              className="hidden dark:block"
            />
            <Image
              src="/images/logo-light.png"
              alt="Brian Ure"
              width={32}
              height={32}
              className="block dark:hidden"
            />
          </Link>
          <ThemeToggle />
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors",
                pathname === link.href
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
