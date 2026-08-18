import type { CalculationResult, Employee, PaidRecord, PayrollRow } from "@/lib/payroll-types";
import { formatINR } from "@/lib/format";
import { AmountDisplay } from "@/components/birbal/amount-display";
import { Badge } from "@/components/ui/badge";
import { isRowPreview } from "@/lib/payroll-calc";

interface CalculationBreakdownProps {
  employee: Employee;
  row: PayrollRow;
  calc: CalculationResult;
  paidRecord?: PaidRecord;
}

export function CalculationBreakdown({ employee, row, calc, paidRecord }: CalculationBreakdownProps) {
  const preview = isRowPreview(row);
  const monthly = employee.basic + employee.hra + employee.other + employee.bonus;

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)]/40 p-4 text-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          Pay calculation
        </span>
        <Badge variant={preview ? "preview" : "saved"}>{preview ? "Preview" : "Saved"}</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <section>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            What you entered
          </h4>
          <dl className="space-y-1 text-xs">
            <div><dt className="inline text-[var(--color-text-tertiary)]">Monthly package:</dt> <dd className="inline tabular-nums">{formatINR(monthly)}/mo</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">Days worked:</dt> <dd className="inline tabular-nums">{row.days} / 30</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">Outlet advance:</dt> <dd className="inline tabular-nums">{formatINR(row.outletAdv)}</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">Company advance:</dt> <dd className="inline tabular-nums">{formatINR(row.companyAdv)}</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">Other deduction:</dt> <dd className="inline tabular-nums">{formatINR(row.otherDed)}</dd></div>
          </dl>
        </section>
        <section>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            How pay was calculated
          </h4>
          <dl className="space-y-1 text-xs">
            <div><dt className="inline text-[var(--color-text-tertiary)]">Daily rate:</dt> <dd className="inline tabular-nums">{formatINR(calc.perDay)}</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">Gross:</dt> <dd className="inline tabular-nums">{formatINR(calc.gross)}</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">ESI 0.75%:</dt> <dd className="inline tabular-nums">{row.rowEsi ? formatINR(calc.esiEmp) : "N/A"}</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">PF 12%:</dt> <dd className="inline tabular-nums">{row.rowPf ? formatINR(calc.pfEmp) : "N/A"}</dd></div>
            <div><dt className="inline text-[var(--color-text-tertiary)]">Rules:</dt> <dd className="inline">{calc.ruleVersion}</dd></div>
          </dl>
        </section>
        <section>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Final amount
          </h4>
          <p className="text-xs text-[var(--color-text-tertiary)]">Net pay</p>
          <AmountDisplay value={calc.net} emphasis preview={preview} className="text-base" />
          {paidRecord ? (
            <p className="mt-2 text-xs text-[var(--color-status-paid)]">
              Payment recorded · {paidRecord.method} · {paidRecord.date} · {paidRecord.actor}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
