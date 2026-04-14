"use client";

import Link from "next/link";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

const serviceCardVariants = cva(
  "group relative flex flex-col rounded-lg border p-8 transition-all duration-300",
  {
    variants: {
      emphasis: {
        default: "border-border bg-card hover:border-muted-foreground/50",
        featured: "border-foreground bg-foreground text-background",
      },
    },
    defaultVariants: {
      emphasis: "default",
    },
  },
);

interface ServiceCardProps extends VariantProps<typeof serviceCardVariants> {
  title: string;
  price?: number;
  description: string;
  delivery?: string;
  actionLabel?: string;
  contactHref?: string;
  className?: string;
}

export function ServiceCard({
  title,
  price,
  description,
  delivery,
  actionLabel = "Purchase",
  emphasis,
  contactHref,
  className,
}: ServiceCardProps) {
  const isFeatured = emphasis === "featured";

  return (
    <div className={cn(serviceCardVariants({ emphasis }), className)}>
      <div className="mb-6">
        <h3 className="text-xl font-medium tracking-tight">{title}</h3>
        {delivery ? (
          <span
            className={cn(
              "mt-2 inline-block text-xs uppercase tracking-wider",
              isFeatured ? "text-background/60" : "text-muted-foreground",
            )}
          >
            {delivery}
          </span>
        ) : null}
      </div>

      <p
        className={cn(
          "mb-8 text-sm",
          isFeatured ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {description}
      </p>

      <div className="mt-auto">
        {price !== undefined && (
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-medium">
                ${price.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <Button
          variant={isFeatured ? "solid-inverse" : "solid"}
          className="w-full"
          asChild={!!contactHref}
        >
          {contactHref ? <Link href={contactHref}>{actionLabel}</Link> : actionLabel}
        </Button>
      </div>
    </div>
  );
}
