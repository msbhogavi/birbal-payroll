import { CircleDashed } from "lucide-react";
import type { PaymentStatus, PayrollRow } from "@/lib/payroll-types";
import { canSetPayment } from "@/lib/payroll-calc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OPTIONS: { key: PaymentStatus; label: string; active: string }[] = [
  { key: "paid", label: "Paid", active: "bg-emerald-100 text-[var(--color-status-paid)]" },
  { key: "not_paid", label: "Not paid", active: "bg-amber-100 text-[var(--color-status-pending)]" },
  { key: "hold", label: "Hold", active: "bg-violet-100 text-[var(--color-status-hold)]" },
];

interface PaymentStatusControlProps {
  row: PayrollRow;
  readOnly?: boolean;
  onChange: (status: PaymentStatus) => void;
}

export function PaymentStatusControl({ row, readOnly, onChange }: PaymentStatusControlProps) {
  if (readOnly) {
    const variant = row.payment === "paid" ? "paid" : row.payment === "hold" ? "hold" : "pending";
    return <Badge variant={variant}>{OPTIONS.find((o) => o.key === row.payment)?.label}</Badge>;
  }

  if (!canSetPayment(row)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-surface-preview)] px-2 py-1 text-xs font-semibold text-[var(--color-status-pending)]">
        <CircleDashed className="h-3.5 w-3.5" />
        Save required
      </span>
    );
  }

  return (
    <div className="inline-flex overflow-hidden rounded-md border border-[var(--color-border-strong)]" role="group" aria-label="Payment status">
      {OPTIONS.map((opt) => (
        <Button
          key={opt.key}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 rounded-none px-2.5 text-xs font-semibold",
            row.payment === opt.key ? opt.active : "text-[var(--color-text-secondary)]",
          )}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
