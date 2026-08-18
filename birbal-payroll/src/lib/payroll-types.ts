export type PaymentStatus = "paid" | "not_paid" | "hold";

export interface Employee {
  id: number;
  code: string;
  name: string;
  brand: string;
  location: string;
  basic: number;
  hra: number;
  other: number;
  bonus: number;
  legacyPerDay: number;
  esi: boolean;
  pf: boolean;
  account: string;
  photoUrl?: string;
}

export interface PayrollRow {
  days: number;
  outletAdv: number;
  companyAdv: number;
  otherDed: number;
  rowEsi: boolean;
  rowPf: boolean;
  notes: string;
  saved: boolean;
  dirty: boolean;
  payment: PaymentStatus;
}

export interface CalculationResult {
  perDay: number;
  gross: number;
  esiEmp: number;
  pfEmp: number;
  net: number;
  ruleVersion: string;
}

export interface PaidRecord {
  method: string;
  date: string;
  actor: string;
}
