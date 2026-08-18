import type { CalculationResult, Employee, PayrollRow } from "@/lib/payroll-types";

export function effectivePerDay(emp: Employee): number {
  const total = emp.basic + emp.hra + emp.other + emp.bonus;
  if (total > 0) return Math.round((total / 30) * 100) / 100;
  return emp.legacyPerDay || 0;
}

/** Prototype-only client calc. Production must use POST /api/payroll/preview. */
export function calculatePayroll(emp: Employee, row: PayrollRow): CalculationResult {
  const perDay = effectivePerDay(emp);
  const gross = Math.round(perDay * (row.days || 0) * 100) / 100;
  const pfWage = Math.min(gross, 15000);
  const esiEmp = row.rowEsi ? Math.round(gross * 0.0075 * 100) / 100 : 0;
  const pfEmp = row.rowPf ? Math.round(pfWage * 0.12 * 100) / 100 : 0;
  const net = Math.round(
    (gross - row.outletAdv - row.companyAdv - row.otherDed - esiEmp - pfEmp) * 100,
  ) / 100;

  return { perDay, gross, esiEmp, pfEmp, net, ruleVersion: "v2024.04" };
}

export function deductionsTotal(row: PayrollRow): number {
  return row.outletAdv + row.companyAdv + row.otherDed;
}

export function isRowPreview(row: PayrollRow): boolean {
  return !row.saved || row.dirty;
}

export function isRowPaidLocked(row: PayrollRow): boolean {
  return row.payment === "paid" && row.saved && !row.dirty;
}

export function canSetPayment(row: PayrollRow): boolean {
  return row.saved && !row.dirty;
}
