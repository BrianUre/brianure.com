"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

const packageCardVariants = cva(
  "group relative flex flex-col rounded-lg border p-8 transition-all duration-300",
  {
    variants: {
      emphasis: {
        default: "border-border bg-card hover:border-muted-foreground/50",
        popular: "border-foreground bg-foreground text-background",
      },
    },
    defaultVariants: {
      emphasis: "default",
    },
  },
);

interface PackageCardProps extends VariantProps<typeof packageCardVariants> {
  hours: number;
  price: number;
  description: string;
  onCheckout?: () => void;
  className?: string;
}

export function PackageCard({
  hours,
  price,
  description,
  emphasis,
  onCheckout,
  className,
}: PackageCardProps) {
  const isPopular = emphasis === "popular";

  return (
    <div className={cn(packageCardVariants({ emphasis }), className)}>
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-light tracking-tight">{hours}</span>
          <span
            className={cn(
              "text-sm",
              isPopular ? "text-background/60" : "text-muted-foreground",
            )}
          >
            hrs/week
          </span>
        </div>
      </div>

      <p
        className={cn(
          "mb-8 text-sm",
          isPopular ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {description}
      </p>

      <div className="mt-auto">
        <div className="mb-6">
          <span
            className={cn(
              "text-sm",
              isPopular ? "text-background/60" : "text-muted-foreground",
            )}
          >
            Starting at
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-medium">${price}</span>
            <span
              className={cn(
                "text-sm",
                isPopular ? "text-background/60" : "text-muted-foreground",
              )}
            >
              /week
            </span>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          className={cn(
            "w-full transition-all duration-300",
            isPopular
              ? "bg-background text-foreground hover:bg-background/90"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          Get started
        </Button>
      </div>
    </div>
  );
}
