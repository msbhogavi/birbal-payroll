# Birbal Group — Payroll & HR Operations System  
## Requirements specification (Ada domain review)

**Source:** `Context/Birbal_Group_Payroll_RFP.pdf` (32-page reconstruction specification)  
**Prepared for:** Proposal / discovery discussion with Birbal Group  
**Status:** Requirements extracted from RFP; **not** signed off by Birbal until open items are confirmed  
**Last reviewed:** 2026-08-18  
**Confidence:** Functional scope = **verified from RFP text**; commercial/timeline = **not in RFP** (proposal to supply)

---

## 1. Engagement summary

| Field | Value | Source |
| --- | --- | --- |
| Client | Birbal Group | RFP |
| System | Web-based **Payroll & HR Operations** for multi-brand restaurants | RFP |
| Engagement type | **Clean rebuild** of existing application (preserve calculation intent, fix inconsistencies) | RFP |
| Locale | India — **INR**, `en-IN` | RFP |
| Current scale (snapshot only) | 4 brands, 8 locations, ~41 employees, ~₹6.1–6.32 lakh/month payroll | RFP — do not hard-code |
| Users | Internal: admin, HR, payroll, finance, management | RFP |
| Primary outcome | Replace spreadsheet payroll with one auditable operational app | RFP |

### Ada domain classification (KaushalStack)

| Dimension | Assessment |
| --- | --- |
| Skill category | **Operate** — payroll, HR documents, statutory deductions |
| Vertical | Multi-brand **restaurant / F&B** group |
| Build complexity | **High** — calculation authority, PII, statutory rules, multi-entity filters, PDFs |
| Network effect | **Low** for payroll itself; **medium** if Birbal becomes lighthouse for restaurant groups |
| Relation to lead-gen USP | **Separate product lane** — ops trust first; do not sell this as “AI marketing” |

---

## 2. Goals and success criteria

### 2.1 Business goals

1. Single source of truth for employees across brands and locations.
2. Monthly payroll entry with **consistent, server-authoritative** salary math.
3. Visible payment status (paid / not paid / hold) and management dashboard.
4. Professional salary slips and HR letters with **per-brand letterheads**.
5. CSV export for finance and reconciliation.
6. Reduce duplicate payroll rows and manual spreadsheet errors.
7. Protect sensitive employee, statutory, and bank data.

### 2.2 Definition of done (from RFP)

Rebuild is complete when:

- Approved employee data migrated and **reconciled**.
- All core modules live and navigable.
- Calculations **identical** on every screen and document.
- Payroll unique per `(employee, month, year)`.
- Payment statuses persist correctly.
- Reports and CSV exports match filters and period.
- Salary slips and HR letters render correctly (with/without letterhead).
- Approved users operate without developer assistance.
- Security, backup, deployment, and handover documentation delivered.
- **All acceptance criteria in Section 10 pass.**

---

## 3. Scope

### 3.1 In scope (base reconstruction)

| Area | Capability |
| --- | --- |
| **Shell** | Responsive web app; desktop sidebar + mobile/tablet nav; Birbal branding |
| **Dashboard** | Month/year/brand/location/status filters; paid/pending totals; location grouping; CSV export |
| **Employees** | CRUD; search/filter; 5-section form; active/left status; HR letter generation entry point |
| **Master Employee** | Cross-brand register; statutory columns; print; ESI/PF reference display |
| **Payroll Entry** | Monthly upsert per active employee; half-days; advances/deductions; ESI/PF toggles; notes |
| **Payroll Summary** | Review view; payment status; bank (masked); salary-slip action |
| **Settings** | Lookups: brand, location, department, designation, employment type |
| **Letterheads** | Per-brand upload/replace/remove (PNG/JPG/WebP, max 2 MB) |
| **Documents** | Salary slip PDF; joining; experience; termination letters |
| **Sharing** | Print; PDF download; **browser/device WhatsApp share** (not API unless optional) |
| **Platform** | Backend API, PostgreSQL (or equivalent), migrations, import template, deployment docs |
| **Quality** | Validation, error handling, loading/empty states, destructive confirm dialogs |

### 3.2 Explicitly out of scope (minimum quote)

Unless Birbal approves and prices separately:

- Direct salary disbursement through bank
- Tax filing submission
- Legal/statutory compliance advice
- Biometric attendance hardware
- Full accounting/ERP replacement
- Employee self-service login
- Native Android/iOS apps

### 3.3 Optional / separately priced (RFP lists — quote each line)

| Item | Notes |
| --- | --- |
| Warning letter generation | Referenced in overview; **not** in current UI — confirm need |
| User authentication & RBAC | RFP expects role model; phase 1 may be single admin — **state risk** |
| Payroll approval / payroll locking | |
| Attendance import from external device | |
| Bank payment file generation | |
| Direct WhatsApp Business API | v1 = browser share only |
| Email delivery of salary slips | |
| Automated statutory filing | |
| Employee self-service portal | |
| Leave management | |
| Advances ledger & recovery schedule | |
| Historical audit log | Recommended for production; clarify phase |

---

## 4. Actors and permissions

### 4.1 Personas

| Persona | Primary tasks |
| --- | --- |
| **Payroll operator** | Monthly entry, status updates, exports |
| **HR admin** | Employee master, letters, master register |
| **Finance / management** | Dashboard, summaries, reconciliation |
| **System admin** | Lookups, letterheads, users (if RBAC) |

### 4.2 Role model (target)

| Role | Capabilities |
| --- | --- |
| **Super admin** | All settings, users, employees, payroll, letterheads, exports |
| **HR admin** | Employees, master register, HR letters, view payroll |
| **Payroll operator** | Payroll entry/summary, status, exports; bank view if authorized |
| **Read-only** | Dashboard/summary/export per policy; no edits |

**Ada note:** If phase 1 ships without auth/RBAC, proposal must document **exposure of PAN, Aadhaar, bank data** and migration path to roles without rewrite.

---

## 5. Functional requirements by module

### 5.1 Navigation

**FR-NAV-01** Persistent nav to: Dashboard, Employees, Master Employee, Payroll Entry, Payroll Summary, Settings.  
**FR-NAV-02** Clear active page; responsive collapse on narrow screens.  
**FR-NAV-03** Toast/inline confirmation on save, update, delete, status change.  
**FR-NAV-04** Confirm before destructive delete; no silent API failures.

### 5.2 Dashboard

**FR-DASH-01** Filters: month, year, brand, location, payment status (all / paid / not paid / on hold).  
**FR-DASH-02** Aggregates for selection: total paid, total pending, paid count, pending count, employee count, total net, total advances, processed vs pending payroll rows.  
**FR-DASH-03** Employee list grouped by **location** with: name, brand, processed/pending, days worked, gross, net, payment status, ESI/PF flags.  
**FR-DASH-04** Location subtotals: employee count, gross, net.  
**FR-DASH-05** CSV download for selected month/filters (minimum columns per RFP p.7).

### 5.3 Employees

**FR-EMP-01** List with search: name, employee ID, brand, location, department, designation.  
**FR-EMP-02** Brand filter cascades location options.  
**FR-EMP-03** Sort predictable (prefer name); show status active/left.  
**FR-EMP-04** Actions: edit, delete (confirmed), generate HR letter.  
**FR-EMP-05** Prefer **inactive/left** over delete when payroll history exists.

#### Employee form sections

| Section | Key fields | Validation |
| --- | --- | --- |
| Basic | code, name, phone, email, address | Name + status required; email format if present |
| Work | brand, location, department, designation, joining date, employment type, status | Brand, location, status required |
| Salary | basic, HRA, other allowance, standard bonus, legacy per-day | Non-negative currency; show component total & effective daily rate |
| Statutory | ESI/PF applicable (default true), PAN, Aadhaar, PF UAN, ESI number | Mask in lists |
| Bank | bank name, account name, account number, IFSC, UPI | IFSC pattern; mask account in lists |

**FR-EMP-06** Duplicate lookup values rejected case-insensitively.

### 5.4 Master Employee register

**FR-MST-01** Cross-brand search and filters; print view.  
**FR-MST-02** Columns include per-day/gross, ESI/PF applicability and amounts, net after employee deductions.  
**FR-MST-03** Display current statutory rate **assumptions** from configurable rule source (not duplicated hard-coded in UI).  
**FR-MST-04** Inline ESI/PF toggles with immediate save feedback.

### 5.5 Payroll Entry

**FR-PAY-01** Month/year selectors; default period rule **must be confirmed** (RFP: January uses previous month in current system).  
**FR-PAY-02** Include **active** employees only for new entry; **exclude left** from new rows.  
**FR-PAY-03** Preserve historical payroll for left employees in past months.  
**FR-PAY-04** Per-row fields: days worked (0–60, **half-day** increments), per-day, gross (calc), outlet/company advance, other deduction, ESI/PF toggle & amounts, final salary, notes, save.  
**FR-PAY-05** Unsaved rows visually distinct; save creates or updates same `(employee, month, year)`.  
**FR-PAY-06** Allow save with **zero days worked**.  
**FR-PAY-07** New employee without saved row = pending unsaved row in UI.

### 5.6 Payroll Summary

**FR-SUM-01** Same filters as entry + payment status + CSV export.  
**FR-SUM-02** Totals: gross, deductions, net, employee count.  
**FR-SUM-03** Payment status: Paid / Not Paid / Hold — save immediately, refresh aggregates.  
**FR-SUM-04** Salary-slip preview/action per row.  
**FR-SUM-05** Bank account subject to permission/masking rules.

### 5.7 Salary slip

**FR-SLP-01** Content: identity, code, designation, department, DOJ, PAN (if authorized), brand, location, period, days/30, earnings, deductions, gross, total deductions, net, notes, generated date, disclaimer.  
**FR-SLP-02** A4 PDF download and print.  
**FR-SLP-03** Letterhead as full-page background when configured; content in approved safe area; standalone layout when not.  
**FR-SLP-04** WhatsApp/browser share without corrupting PDF; **do not claim delivery** without API.

### 5.8 HR letters

| Letter | Required content (summary) |
| --- | --- |
| **Joining / appointment** | Issue date, role, compensation, probation, welcome text, **18 conduct rules** (RFP p.16–17), signatures |
| **Experience** | To whom it may concern, tenure, satisfactory service statement |
| **Termination** | Last working date, exit formalities, property handover, F&F statement |

**FR-LTR-01** Dates and tenure computed from employee record; Indian locale formatting.  
**FR-LTR-02** Multi-page PDF; no clipping of conduct rules or signatures.  
**FR-LTR-03** Warning letter — **optional**; scope only if Birbal confirms.

### 5.9 Settings & letterheads

**FR-SET-01** CRUD lookups: brand, location, department, designation, employment type.  
**FR-SET-02** Usage count; warn on delete if in use; preserve historical employee text.  
**FR-LHR-01** Letterhead per brand: upload/replace/remove; PNG/JPEG/WebP; max 2 MB; prefer object storage in production.

---

## 6. Business rules — payroll calculation (authoritative)

**BR-01** All calculations via **single backend service**. Frontend may preview; server is source of truth.  
**BR-02** Persist gross, statutory deductions, final salary, and **calculation version/metadata** on payroll record.

### 6.1 Salary components

```
Monthly Component Total = Basic + HRA + Other Allowance + Standard Bonus
```

If any component present:

```
Effective Per-Day = Monthly Component Total / 30
```

Else:

```
Effective Per-Day = Legacy Per-Day Salary (employee record)
```

```
Gross = Effective Per-Day × Days Worked
```

**BR-03** **Standard Bonus** must be in authoritative formula everywhere (fix current preview inconsistency).  
**BR-04** Monthly denominator **30 days** — **confirm** with Birbal (including component proration).

### 6.2 Statutory (defaults; must be versioned for law changes)

| Rule | Rate |
| --- | --- |
| Employee ESI | 0.75% of gross (if applicable) |
| Employer ESI | 3.25% of gross (reporting; not deducted from net) |
| Employee PF | 12% of PF wage (if applicable) |
| Employer PF | 12% of PF wage (reporting) |
| PF wage cap | min(gross, ₹15,000) |

**BR-05** Round to 2 decimal places — **rounding policy must be confirmed**.  
**BR-06** ESI/PF toggles at employee level and per payroll row.

### 6.3 Net pay

```
Final = Gross − Outlet Advance − Company Advance − Other Deduction − Employee ESI − Employee PF
```

**BR-07** Deductions ≥ 0; handle **deductions > gross** per approved policy (RFP acceptance test).  
**BR-08** Same numbers on: Payroll Entry, Summary, Dashboard, Master Employee, salary slip.

### 6.4 Uniqueness & lifecycle

**BR-09** Unique constraint: `(employee_id, month, year)`.  
**BR-10** Payment status independent of “row saved” state.  
**BR-11** Left employees: no new entry rows; historical months remain accessible.

---

## 7. Data model (minimum)

### 7.1 Core entities

- **employees** — master record (fields per RFP p.19–20)
- **payroll** — monthly rows with calculation fields + payment_status
- **lookups** — type + value (unique per type, case-insensitive)
- **letterheads** — per brand (prefer object storage key)

### 7.2 Recommended production extensions

- users, roles, permissions  
- audit_log (employee/payroll/status/delete)  
- statutory_rule_versions (effective dates)  
- document_template_versions  
- import_batches + import_errors  
- payroll_period_lock (optional phase)

---

## 8. API requirements (minimum)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/healthz` | Health |
| GET/POST | `/api/employees` | List/create |
| GET/PATCH/DELETE | `/api/employees/{id}` | Read/update/delete |
| GET | `/api/payroll?month=&year=` | Saved + pending rows for active employees |
| POST | `/api/payroll/upsert` | Create/update monthly row |
| PATCH | `/api/payroll/{id}/status` | Payment status |
| GET/POST/PATCH/DELETE | `/api/settings` | Lookups |
| GET/PUT/DELETE | `/api/letterheads/{brandName}` | Letterhead assets |

**API-01** Validate all inputs; recalculate gross/final server-side; never trust client totals.  
**API-02** Enforce uniqueness at DB; consistent error codes; no secrets in logs.  
**API-03** OpenAPI or equivalent documentation required in deliverables.

---

## 9. Non-functional requirements

### 9.1 Security & privacy

- HTTPS in production; auth on all non-public routes (or documented exception).  
- RBAC when enabled; server-side authorization on every mutation.  
- Mask PAN, Aadhaar, bank in lists unless role allows.  
- CSRF protection, rate limiting on auth, secrets in env/vault.  
- Audit trail for sensitive changes; backup/restore documented.  
- Retention/deletion policy **approved by Birbal**.

### 9.2 Performance & scale (targets from RFP)

| Dimension | Target |
| --- | --- |
| Brands | ≥ 10 |
| Locations | ≥ 50 |
| Employees | ≥ 1,000 |
| Payroll history | ≥ 10 years |

Dashboard/lists responsive at current scale; payroll save with immediate feedback; PDF progress for large batches.

### 9.3 UX & accessibility

- Clear editable vs calculated fields; paid/pending/hold not color-only.  
- Wide tables: horizontal scroll, sticky headers/first column where helpful.  
- Keyboard-friendly forms; labels; focus states; no emoji controls.  
- Professional internal-ops aesthetic — readability over decoration.

### 9.4 Engineering quality

- Modular frontend/backend; documented schema; reproducible local dev.  
- Automated tests: **unit tests for all calculation cases** (Section 10.2).  
- Type/build checks; structured error logging.

### 9.5 Architecture constraints (must avoid)

- Client-only payroll as source of truth  
- Hard-coded brands/locations/departments  
- Hard-coded statutory rates scattered in UI  
- Spreadsheet dependence for routine monthly processing  

---

## 10. Acceptance criteria

### 10.1 Functional checklist (condensed from RFP p.27–28)

- [ ] Employee CRUD with validation; active ↔ left; delete policy  
- [ ] Component salary + legacy per-day fallback  
- [ ] Gross, ESI, PF, final consistent everywhere  
- [ ] Payroll upsert idempotent; no duplicates  
- [ ] Left employee rules for entry vs history  
- [ ] Payment status persistence and dashboard reconciliation  
- [ ] CSV export matches filters  
- [ ] Salary slip PDF/print/share; letterhead on/off  
- [ ] Three HR letter types with correct dates/tenure/conduct text  
- [ ] Lookup CRUD with usage warnings  
- [ ] Letterhead upload lifecycle  
- [ ] Import + reconciliation report  
- [ ] Security/masking per approved role model  

### 10.2 Required calculation test cases

1. Legacy per-day only (no components)  
2. Basic only  
3. Basic + HRA  
4. All components including Standard Bonus  
5. Zero days worked  
6. Half-day values  
7. ESI on/off  
8. PF on/off  
9. PF wage above ₹15,000 cap  
10. Multiple deductions  
11. Deductions exceeding gross (approved handling)  
12. Fractional paise rounding boundaries  

---

## 11. Data migration

**MIG-01** Support import from: existing DB, directory PDF/DOCX, salary spreadsheet, reviewed CSV.  
**MIG-02** Template with row-level errors, preview before commit, import batch metadata.  
**MIG-03** Reconciliation report: counts, missing fields, duplicates, salary totals before/after, active vs left, manual review list.  
**MIG-04** No third-party transfer of sensitive data without written approval.

---

## 12. Deliverables (vendor)

- Source code (frontend + backend)  
- DB schema + migrations  
- API documentation  
- Import template + migration/reconciliation report  
- Salary calculation documentation  
- PDF templates (slip + letters)  
- CSV export  
- Test suite (calculation + API + PDF)  
- Deployment + backup/restore docs  
- Admin guide + payroll operator guide  
- Technical handover + ownership transfer terms  

---

## 13. Open confirmations (blockers for fixed quote)

Proposal should list these as **assumptions** until Birbal answers:

| # | Question |
| --- | --- |
| 1 | Warning letters required in addition to joining / experience / termination? |
| 2 | Is monthly denominator always **30 days**? Standard Bonus prorated by days everywhere? |
| 3 | Statutory rates fixed or **versioned by effective date**? |
| 4 | Rounding method: half-up, banker’s, other? |
| 5 | Behavior when total deductions exceed gross? |
| 6 | Soft-deactivate vs hard delete for employees with history? |
| 7 | Which roles see PAN, Aadhaar, PF UAN, ESI, full bank account? |
| 8 | **Login required in phase 1?** If not, accepted risk? |
| 9 | Payroll lock after approval/payment? |
| 10 | Multiple legal entities or only brand/location grouping? |
| 11 | WhatsApp: browser share sufficient vs Business API? |
| 12 | Salary slips to employees via WhatsApp, email, or manual download only? |
| 13 | Employer ESI/PF reporting-only or employer-cost report required? |
| 14 | Authoritative source when PDF, DOCX, spreadsheet, and DB disagree? |
| 15 | Backup retention and employee-data retention policy? |
| 16 | Approved letterhead layouts and legal wording for conduct rules? |
| 17 | Approved payroll year range and period cutoff? |

---

## 14. Ada — domain risks and proposal guidance

### 14.1 Scope discipline

The RFP is a **reconstruction spec**, not a greenfield wish list. **Do not** bundle optional modules into base price without labeling them — warning letters, RBAC, attendance import, and WhatsApp API each expand timeline and liability.

### 14.2 Calculation liability

Payroll errors are **existential** for client trust. Quote must include:

- Dedicated calculation service + automated test matrix (Section 10.2)  
- Signed reconciliation after migration  
- Explicit exclusion of legal/tax advice  

### 14.3 Auth phase 1

If Birbal wants fast go-live without login, state clearly: **anyone with URL access sees PII**. Recommend minimal auth (single admin password + HTTPS) even in phase 1.

### 14.4 Statutory change

ESI/PF rates will change. Base build should include **versioned rule table**, not constants in code only.

### 14.5 WhatsApp

Browser/device share matches current RFP minimum. Do not promise delivery receipts without Business API (optional).

### 14.6 Realistic phasing (suggested for proposal)

| Phase | Contents | Duration (indicative — proposal to refine) |
| --- | --- | --- |
| **P0 — Discovery** | Confirm Section 13; sample data; letterhead assets | 1–2 weeks |
| **P1 — Core** | Employees, lookups, calculation service, payroll entry/summary, auth minimum | 4–6 weeks |
| **P2 — Outputs** | Dashboard, CSV, salary slip PDF, letterheads | 2–3 weeks |
| **P3 — HR letters + import** | Three letters, conduct template, migration + reconciliation | 2–3 weeks |
| **P4 — Hardening** | RBAC (if in scope), audit log, performance, UAT, training, handover | 2–3 weeks |

*Indicative only — **estimated**, not verified against team capacity.*

### 14.7 Commercial notes (proposal must supply)

RFP does **not** specify budget. Proposal should include:

- Base reconstruction (Section 3.1)  
- Line-item optionals (Section 3.3)  
- Hosting/ops assumptions (client-hosted vs vendor-hosted)  
- Warranty/bug-fix period  
- Support retainer  
- Validity period  

---

## 15. Proposal response outline (for discussion)

1. **Understanding** — rebuild intent, multi-brand restaurant context, spreadsheet replacement  
2. **Feature mapping** — table: RFP requirement ID → our approach  
3. **Architecture** — web + API + PostgreSQL + calculation service + PDF pipeline + object storage  
4. **Migration plan** — sources, reconciliation, cutover  
5. **Security** — auth/RBAC phase, masking, audit  
6. **Testing** — calculation matrix, UAT with Birbal payroll operator  
7. **Timeline & team**  
8. **Assumptions & exclusions** — Section 13 answers or explicit assumptions  
9. **Commercial** — base + options  

---

## 16. Traceability index

| RFP section | This doc section |
| --- | --- |
| Overview & modules (p.1–5) | §1–3 |
| Dashboard & employees (p.6–11) | §5.2–5.4 |
| Payroll entry/summary (p.12–14) | §5.5–5.7 |
| Letters & conduct (p.15–17) | §5.8 |
| Settings, letterheads, calc (p.17–19) | §5.9, §6 |
| Data model & API (p.19–23) | §7–8 |
| Export, UX, security (p.23–26) | §9 |
| Deliverables & acceptance (p.27–32) | §10–12, §13 |

---

*Next step for Atlas: entity diagram and deployment topology from §7–8. Next step for Mira: module IA and payroll-entry table UX from §5.5. Next step for proposal: fill Section 13 with Birbal answers and attach commercial terms.*
