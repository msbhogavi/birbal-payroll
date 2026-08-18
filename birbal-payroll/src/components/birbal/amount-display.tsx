import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AmountDisplayProps {
  value: number;
  emphasis?: boolean;
  preview?: boolean;
  className?: string;
}

export function AmountDisplay({ value, emphasis, preview, className }: AmountDisplayProps) {
  return (
    <span
      className={cn(
        "tabular-nums",
        emphasis && "font-semibold",
        preview &&
          "rounded border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-preview)] px-1 text-[var(--color-status-pending)]",
        className,
      )}
    >
      {formatINR(value)}
    </span>
  );
}
