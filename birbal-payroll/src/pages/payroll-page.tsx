import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { INITIAL_PAYROLL, MOCK_EMPLOYEES } from "@/data/mock";
import { AmountDisplay } from "@/components/birbal/amount-display";
import { CalculationBreakdown } from "@/components/birbal/calculation-breakdown";
import { EmployeeIdentity, SaveIndicator } from "@/components/birbal/employee-identity";
import { PaidConfirmDialog } from "@/components/birbal/paid-confirm-dialog";
import { PaymentStatusControl } from "@/components/birbal/payment-status-control";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculatePayroll,
  deductionsTotal,
  isRowPaidLocked,
  isRowPreview,
} from "@/lib/payroll-calc";
import type { Employee, PaidRecord, PaymentStatus, PayrollRow } from "@/lib/payroll-types";
import { cn } from "@/lib/utils";

function cloneRows(): Record<number, PayrollRow> {
  return structuredClone(INITIAL_PAYROLL);
}

export function PayrollPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "review" ? "review" : "work";
  const [mode, setMode] = useState<"work" | "review">(initialMode);
  const [rows, setRows] = useState(cloneRows);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [paidTarget, setPaidTarget] = useState<Employee | null>(null);
  const [paidRecords, setPaidRecords] = useState<Record<number, PaidRecord>>({});

  const employees = useMemo(
    () =>
      MOCK_EMPLOYEES.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.code.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const dirtyCount = useMemo(
    () => Object.values(rows).filter((r) => r.dirty || !r.saved).length,
    [rows],
  );

  const updateRow = (id: number, patch: Partial<PayrollRow>) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch, dirty: true, saved: false },
    }));
  };

  const saveRow = (id: number) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], saved: true, dirty: false },
    }));
  };

  const saveAll = () => {
    setRows((prev) => {
      const next = { ...prev };
      for (const id of Object.keys(next)) {
        const key = Number(id);
        if (next[key].dirty || !next[key].saved) {
          next[key] = { ...next[key], saved: true, dirty: false };
        }
      }
      return next;
    });
  };

  const onPaymentChange = (emp: Employee, status: PaymentStatus) => {
    const row = rows[emp.id];
    if (!row.saved || row.dirty) return;
    if (status === "paid" && row.payment !== "paid") {
      setPaidTarget(emp);
      return;
    }
    setRows((prev) => ({ ...prev, [emp.id]: { ...prev[emp.id], payment: status } }));
  };

  const confirmPaid = ({ method, date }: { method: string; date: string }) => {
    if (!paidTarget) return;
    setRows((prev) => ({
      ...prev,
      [paidTarget.id]: { ...prev[paidTarget.id], payment: "paid" },
    }));
    setPaidRecords((prev) => ({
      ...prev,
      [paidTarget.id]: { method, date, actor: "AK" },
    }));
    setPaidTarget(null);
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setPayrollMode = (next: "work" | "review") => {
    setMode(next);
    setSearchParams(next === "review" ? { mode: "review" } : {});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-md bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
        <span>March 2026 · All brands · All locations</span>
        <Link to="/" className="text-[var(--color-action)] hover:underline">
          Change period →
        </Link>
      </div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monthly payroll</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {mode === "work"
              ? "Enter days worked, advances, and ESI/PF for this month"
              : "Confirm payments, view salary slips, and mark who has been paid"}
          </p>
        </div>
        <Tabs value={mode} onValueChange={(v) => setPayrollMode(v as "work" | "review")}>
          <TabsList>
            <TabsTrigger value="work">Enter payroll</TabsTrigger>
            <TabsTrigger value="review">Payments &amp; slips</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <Input className="pl-9" placeholder="Search employee…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {mode === "work" ? (
          <>
            <span className="text-sm text-[var(--color-text-secondary)] tabular-nums">
              {Object.values(rows).filter((r) => r.saved).length} of {Object.keys(rows).length} saved · {dirtyCount} unsaved
            </span>
            <Button disabled={dirtyCount === 0} onClick={saveAll}>
              Save all changes{dirtyCount > 0 ? ` (${dirtyCount})` : ""}
            </Button>
          </>
        ) : null}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border bg-[var(--color-surface)] md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-[var(--color-surface)]">Employee</TableHead>
              <TableHead>Brand / outlet</TableHead>
              {mode === "work" ? (
                <>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead className="text-right">Advances &amp; deductions</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Save status</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Bank</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => {
              const row = rows[emp.id];
              const calc = calculatePayroll(emp, row);
              const preview = isRowPreview(row);
              const locked = isRowPaidLocked(row);
              const isOpen = expanded.has(emp.id);

              return (
                <WorkReviewRows
                  key={emp.id}
                  mode={mode}
                  employee={emp}
                  row={row}
                  calc={calc}
                  preview={preview}
                  locked={locked}
                  isOpen={isOpen}
                  paidRecord={paidRecords[emp.id]}
                  onToggle={() => toggleExpand(emp.id)}
                  onUpdate={(patch) => updateRow(emp.id, patch)}
                  onSave={() => saveRow(emp.id)}
                  onPaymentChange={(status) => onPaymentChange(emp, status)}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {employees.map((emp) => {
          const row = rows[emp.id];
          const calc = calculatePayroll(emp, row);
          const preview = isRowPreview(row);
          const locked = isRowPaidLocked(row);
          const isOpen = expanded.has(emp.id);

          return (
            <article
              key={emp.id}
              className={cn(
                "rounded-lg border bg-[var(--color-surface)] p-4 shadow-sm",
                preview && "border-l-2 border-l-[var(--color-status-pending)]",
                locked && "bg-[var(--color-surface-locked)]",
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <EmployeeIdentity id={emp.id} name={emp.name} code={emp.code} photoUrl={emp.photoUrl} location={emp.location} paidLocked={locked} showAvatar />
                {mode === "work" ? (
                  <SaveIndicator saved={row.saved} dirty={row.dirty} />
                ) : (
                  <PaymentStatusControl row={row} onChange={(s) => onPaymentChange(emp, s)} />
                )}
              </div>
              {mode === "work" && !locked ? (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Field label="Days" value={row.days} onChange={(v) => updateRow(emp.id, { days: v })} />
                  <Field label="Outlet advance" value={row.outletAdv} onChange={(v) => updateRow(emp.id, { outletAdv: v })} />
                  <Field label="Company advance" value={row.companyAdv} onChange={(v) => updateRow(emp.id, { companyAdv: v })} />
                  <Field label="Other deduction" value={row.otherDed} onChange={(v) => updateRow(emp.id, { otherDed: v })} />
                </div>
              ) : null}
              <div className="flex justify-between border-t pt-3 text-sm tabular-nums">
                <span>{row.days} days</span>
                <AmountDisplay value={calc.gross} preview={preview && mode === "work"} />
                <AmountDisplay value={calc.net} emphasis preview={preview && mode === "work"} />
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleExpand(emp.id)}>
                  {isOpen ? "Hide calculation" : "Pay calculation"}
                </Button>
                {mode === "work" && !locked && preview ? (
                  <Button size="sm" onClick={() => saveRow(emp.id)}>
                    Save
                  </Button>
                ) : null}
              </div>
              {isOpen ? (
                <div className="mt-3">
                  <CalculationBreakdown
                    employee={emp}
                    row={row}
                    calc={calc}
                    paidRecord={paidRecords[emp.id]}
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <PaidConfirmDialog
        open={paidTarget !== null}
        employee={paidTarget}
        netAmount={paidTarget ? calculatePayroll(paidTarget, rows[paidTarget.id]).net : 0}
        onOpenChange={(open) => !open && setPaidTarget(null)}
        onConfirm={confirmPaid}
      />

      {Object.keys(paidRecords).length > 0 ? (
        <p className="mt-4 text-xs text-[var(--color-text-tertiary)]" aria-live="polite">
          {Object.keys(paidRecords).length} payment(s) recorded this session.
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="text-xs font-semibold text-[var(--color-text-tertiary)]">
      {label}
      <Input
        type="number"
        className="mt-1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </label>
  );
}

function WorkReviewRows({
  mode,
  employee,
  row,
  calc,
  preview,
  locked,
  isOpen,
  onToggle,
  onUpdate,
  onSave,
  onPaymentChange,
  paidRecord,
}: {
  mode: "work" | "review";
  employee: Employee;
  row: PayrollRow;
  calc: ReturnType<typeof calculatePayroll>;
  preview: boolean;
  locked: boolean;
  isOpen: boolean;
  paidRecord?: PaidRecord;
  onToggle: () => void;
  onUpdate: (patch: Partial<PayrollRow>) => void;
  onSave: () => void;
  onPaymentChange: (status: PaymentStatus) => void;
}) {
  const readOnly = mode === "review" || locked;

  return (
    <>
      <TableRow data-state={preview ? "unsaved" : locked ? "locked" : undefined}>
        <TableCell className="sticky left-0 bg-inherit">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onToggle} aria-label="Toggle breakdown">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <EmployeeIdentity
              id={employee.id}
              name={employee.name}
              code={employee.code}
              photoUrl={employee.photoUrl}
              showAvatar
              paidLocked={locked && mode === "work"}
            />
          </div>
        </TableCell>
        <TableCell className="text-xs text-[var(--color-text-secondary)]">
          {employee.brand}
          <br />
          {employee.location}
        </TableCell>
        {mode === "work" ? (
          <>
            <TableCell className="text-right">
              {readOnly ? (
                row.days
              ) : (
                <Input
                  type="number"
                  step="0.5"
                  className="ml-auto w-20 text-right"
                  value={row.days}
                  onChange={(e) => onUpdate({ days: parseFloat(e.target.value) || 0 })}
                />
              )}
            </TableCell>
            <TableCell className="text-right">
              <AmountDisplay value={deductionsTotal(row)} />
              {!readOnly ? (
                <Button variant="link" size="sm" className="block text-xs" onClick={onToggle}>
                  Edit
                </Button>
              ) : null}
            </TableCell>
            <TableCell className="text-right">
              <AmountDisplay value={calc.gross} preview={preview} />
            </TableCell>
            <TableCell className="text-right">
              <AmountDisplay value={calc.net} emphasis preview={preview} />
            </TableCell>
            <TableCell>
              {preview && !locked ? (
                <Button variant="link" size="sm" onClick={onSave}>
                  Save row
                </Button>
              ) : (
                <SaveIndicator saved={row.saved} dirty={row.dirty} />
              )}
            </TableCell>
          </>
        ) : (
          <>
            <TableCell className="text-right tabular-nums">{row.days}</TableCell>
            <TableCell className="text-right">
              <AmountDisplay value={calc.gross} />
            </TableCell>
            <TableCell className="text-right">
              <AmountDisplay value={calc.net} emphasis />
            </TableCell>
            <TableCell>
              <PaymentStatusControl row={row} onChange={onPaymentChange} />
            </TableCell>
            <TableCell className="text-xs text-[var(--color-text-tertiary)]">{employee.account}</TableCell>
          </>
        )}
      </TableRow>
      {isOpen ? (
        <TableRow>
          <TableCell colSpan={mode === "work" ? 7 : 7} className="bg-[var(--color-surface-muted)]/30">
            {mode === "work" && !readOnly ? (
              <div className="mb-3 grid max-w-xl grid-cols-3 gap-2">
                <Field label="Outlet adv" value={row.outletAdv} onChange={(v) => onUpdate({ outletAdv: v })} />
                <Field label="Co adv" value={row.companyAdv} onChange={(v) => onUpdate({ companyAdv: v })} />
                <Field label="Other ded" value={row.otherDed} onChange={(v) => onUpdate({ otherDed: v })} />
                <label className="flex items-center gap-2 text-xs">
                  ESI <Switch checked={row.rowEsi} onCheckedChange={(c) => onUpdate({ rowEsi: c })} />
                </label>
                <label className="flex items-center gap-2 text-xs">
                  PF <Switch checked={row.rowPf} onCheckedChange={(c) => onUpdate({ rowPf: c })} />
                </label>
              </div>
            ) : null}
            <CalculationBreakdown employee={employee} row={row} calc={calc} paidRecord={paidRecord} />
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
