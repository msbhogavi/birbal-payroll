import type { Employee, PayrollRow } from "@/lib/payroll-types";
import { EMPLOYEE_PHOTO_URLS } from "@/data/employee-photos";

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, code: "EMP-001", name: "Rahul Sharma", brand: "Birbal Kitchen", location: "Indiranagar", basic: 12000, hra: 4000, other: 2000, bonus: 1000, legacyPerDay: 0, esi: true, pf: true, account: "****1000", photoUrl: EMPLOYEE_PHOTO_URLS[1] },
  { id: 2, code: "EMP-002", name: "Priya Nair", brand: "Birbal Kitchen", location: "Koramangala", basic: 8000, hra: 2000, other: 0, bonus: 500, legacyPerDay: 0, esi: true, pf: true, account: "****1001", photoUrl: EMPLOYEE_PHOTO_URLS[2] },
  { id: 3, code: "EMP-003", name: "Amit Patel", brand: "Spice Route", location: "Whitefield", basic: 0, hra: 0, other: 0, bonus: 0, legacyPerDay: 450, esi: true, pf: false, account: "****1002", photoUrl: EMPLOYEE_PHOTO_URLS[3] },
  { id: 4, code: "EMP-004", name: "Sneha Reddy", brand: "Spice Route", location: "HSR Layout", basic: 18000, hra: 6000, other: 3000, bonus: 2000, legacyPerDay: 0, esi: false, pf: true, account: "****1003", photoUrl: EMPLOYEE_PHOTO_URLS[4] },
  { id: 5, code: "EMP-005", name: "Vikram Singh", brand: "Masala Bay", location: "JP Nagar", basic: 9000, hra: 2500, other: 500, bonus: 0, legacyPerDay: 0, esi: true, pf: true, account: "****1004", photoUrl: EMPLOYEE_PHOTO_URLS[5] },
  { id: 6, code: "EMP-006", name: "Anita Das", brand: "Curry House", location: "MG Road", basic: 11000, hra: 3500, other: 1500, bonus: 800, legacyPerDay: 0, esi: true, pf: true, account: "****1005", photoUrl: EMPLOYEE_PHOTO_URLS[6] },
  { id: 7, code: "EMP-007", name: "Karan Mehta", brand: "Curry House", location: "Brigade Road", basic: 7500, hra: 2000, other: 0, bonus: 0, legacyPerDay: 0, esi: true, pf: true, account: "****1006", photoUrl: EMPLOYEE_PHOTO_URLS[7] },
  { id: 9, code: "EMP-009", name: "Mohammed Ali", brand: "Birbal Kitchen", location: "Indiranagar", basic: 0, hra: 0, other: 0, bonus: 0, legacyPerDay: 400, esi: true, pf: true, account: "****1008", photoUrl: EMPLOYEE_PHOTO_URLS[9] },
  { id: 10, code: "EMP-010", name: "Lakshmi V", brand: "Masala Bay", location: "JP Nagar", basic: 8200, hra: 2200, other: 0, bonus: 500, legacyPerDay: 0, esi: true, pf: true, account: "****1009", photoUrl: EMPLOYEE_PHOTO_URLS[10] },
  { id: 11, code: "EMP-011", name: "Rajesh Kumar", brand: "Spice Route", location: "Whitefield", basic: 13000, hra: 4500, other: 2000, bonus: 1200, legacyPerDay: 0, esi: true, pf: true, account: "****1010", photoUrl: EMPLOYEE_PHOTO_URLS[11] },
  { id: 12, code: "EMP-012", name: "Fatima Khan", brand: "Curry House", location: "MG Road", basic: 7800, hra: 2000, other: 0, bonus: 0, legacyPerDay: 0, esi: true, pf: true, account: "****1011", photoUrl: EMPLOYEE_PHOTO_URLS[12] },
];

export const INITIAL_PAYROLL: Record<number, PayrollRow> = {
  1: { days: 28, outletAdv: 0, companyAdv: 500, otherDed: 0, saved: true, dirty: false, payment: "paid", rowEsi: true, rowPf: true, notes: "" },
  2: { days: 26, outletAdv: 200, companyAdv: 0, otherDed: 0, saved: true, dirty: false, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
  3: { days: 30, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, dirty: false, payment: "paid", rowEsi: true, rowPf: false, notes: "" },
  4: { days: 30, outletAdv: 0, companyAdv: 1000, otherDed: 0, saved: true, dirty: false, payment: "hold", rowEsi: false, rowPf: true, notes: "Advance recovery" },
  5: { days: 27.5, outletAdv: 0, companyAdv: 0, otherDed: 100, saved: true, dirty: false, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
  6: { days: 28, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, dirty: false, payment: "paid", rowEsi: true, rowPf: true, notes: "" },
  7: { days: 25, outletAdv: 150, companyAdv: 0, otherDed: 0, saved: false, dirty: true, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
  9: { days: 29, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: false, dirty: true, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
  10: { days: 26, outletAdv: 0, companyAdv: 300, otherDed: 0, saved: true, dirty: false, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
  11: { days: 30, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, dirty: false, payment: "paid", rowEsi: true, rowPf: true, notes: "" },
  12: { days: 0, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, dirty: false, payment: "hold", rowEsi: true, rowPf: true, notes: "On leave entire month" },
};
