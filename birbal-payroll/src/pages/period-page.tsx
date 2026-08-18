import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LIFECYCLE = ["Import done", "Payroll entered", "Totals checked", "Salaries paid", "Month locked"] as const;
const CURRENT_STEP = 0;
const IMPORT_BLOCKING = true;

const EXCEPTIONS = [
  { name: "Karan Mehta", issue: "Unsaved", net: "₹18,420" },
  { name: "Mohammed Ali", issue: "Unsaved", net: "₹11,600" },
  { name: "Priya Nair", issue: "Not paid", net: "₹14,850" },
  { name: "Vikram Singh", issue: "Not paid", net: "₹12,200" },
];

export function PeriodPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)]">
        <PeriodField label="Month" defaultValue="2">
          <option value="2">March</option>
        </PeriodField>
        <PeriodField label="Year" defaultValue="2026">
          <option value="2026">2026</option>
        </PeriodField>
        <PeriodField label="Brand" defaultValue="">
          <option value="">All brands</option>
          <option value="birbal">Birbal Kitchen</option>
        </PeriodField>
        <PeriodField label="Location" defaultValue="">
          <option value="">All locations</option>
        </PeriodField>
        <Button variant="ghost" size="sm" className="mb-0.5">
          Reset filters
        </Button>
      </div>

      <header className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight">March 2026</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Finish payroll, confirm payments, then lock the month
        </p>
        <nav className="mt-4 flex flex-wrap items-center gap-0 text-[11px] font-semibold uppercase tracking-wide" aria-label="Period lifecycle">
          {LIFECYCLE.map((step, i) => (
            <span key={step} className="flex items-center">
              {i > 0 ? (
                <span
                  className={cn(
                    "mx-1.5 h-px w-6",
                    i <= CURRENT_STEP ? "bg-[var(--color-text-tertiary)]" : "bg-[var(--color-border-strong)]",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "flex items-center gap-1.5 py-1",
                  i < CURRENT_STEP
                    ? "text-[var(--color-text-secondary)]"
                    : i === CURRENT_STEP
                      ? "text-[var(--color-action)]"
                      : "text-[var(--color-text-tertiary)]",
                )}
              >
                {i < CURRENT_STEP ? (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--color-status-paid)] text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full border-2",
                      i === CURRENT_STEP
                        ? "border-[var(--color-action)] bg-[var(--color-action)]"
                        : "border-current bg-transparent",
                    )}
                  />
                )}
                {step}
              </span>
            </span>
          ))}
        </nav>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="blocker">Blocked</Badge>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Import review required before you can close the month
          </span>
        </div>
      </header>

      <section
        className={cn(
          "mb-6 rounded-lg border bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]",
          IMPORT_BLOCKING ? "border-l-4 border-l-[var(--color-status-error)]" : "border-l-4 border-l-[var(--color-action)]",
        )}
      >
        <h2 className="text-base font-semibold">Fix import issues first</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          3 import issue(s) block month close for March 2026. 4 payroll items are tracked separately below.
        </p>
        <Button className="mt-3">Review import →</Button>
      </section>

      <section
        className={cn(
          "mb-6 rounded-lg border bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]",
          IMPORT_BLOCKING && "opacity-70",
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Items needing attention
          </h2>
          <Badge variant="pending">4 to resolve</Badge>
        </div>
        {IMPORT_BLOCKING ? (
          <p className="mb-3 text-xs text-[var(--color-text-tertiary)]">
            Finish the import review first. Then work through the items below.
          </p>
        ) : null}
        <ul
          className={cn(
            "divide-y rounded-lg border bg-[var(--color-surface)]",
            IMPORT_BLOCKING && "pointer-events-none",
          )}
        >
          {EXCEPTIONS.map((ex) => (
            <li key={ex.name} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{ex.name}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {ex.issue} · {ex.net}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
          Next after import
        </h2>
        <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
          Save 2 unsaved payroll entries once import is confirmed.
        </p>
        <Button asChild variant="secondary">
          <Link to="/payroll?mode=work">Enter payroll</Link>
        </Button>
      </section>
    </div>
  );
}

function PeriodField({
  label,
  defaultValue,
  children,
}: {
  label: string;
  defaultValue: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {label}
      </span>
      <select
        defaultValue={defaultValue}
        className="h-9 min-w-[100px] rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 text-sm"
      >
        {children}
      </select>
    </label>
  );
}
