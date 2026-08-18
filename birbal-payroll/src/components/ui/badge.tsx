import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]",
        paid: "border-transparent bg-emerald-50 text-[var(--color-status-paid)]",
        pending: "border-transparent bg-amber-50 text-[var(--color-status-pending)]",
        hold: "border-transparent bg-violet-50 text-[var(--color-status-hold)]",
        error: "border-transparent bg-red-50 text-[var(--color-status-error)]",
        preview: "border-transparent bg-[var(--color-surface-preview)] text-[var(--color-status-pending)]",
        saved: "border-transparent bg-transparent text-[var(--color-text-tertiary)] font-medium",
        blocker: "border-transparent bg-red-50 text-[var(--color-status-error)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
