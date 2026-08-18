# Birbal Group Payroll RFP — reference for naming and portfolio

**Source:** `Context/Birbal_Group_Payroll_RFP.pdf`  
**Use:** Procurement-style vertical rebuild; how buyers write requirements; how our master brand should relate to descriptive product names.

---

## What this RFP is

Birbal Group wants a **clean rebuild** of an existing **Payroll & HR Operations System** for multi-brand restaurants (4 brands, 8 locations, ~41 employees in the snapshot). It is not a greenfield “AI idea” — it is an operational replacement for spreadsheets with explicit acceptance criteria.

Core scope:

- Employee master (multi-brand, multi-location)
- Monthly payroll entry, ESI/PF, advances, payment status
- Dashboard, summary, CSV export
- Salary slips (PDF, print, WhatsApp share)
- HR letters (joining, experience, termination) + brand letterheads
- Settings / lookups, data import, security and handover

Explicit **out of scope** unless priced separately: warning letters, RBAC phase 1, attendance hardware, bank files, WhatsApp Business API, employee self-service, leave, full ERP.

---

## What this teaches about naming (Cisco-style, adapted)

### 1. Buyers name outcomes in plain English

The RFP title is not a coined brand. It is:

> **Birbal Group | Payroll & HR Operations System**

That matches Cisco’s rule: **descriptive names inform; messaging persuades.** The customer never asks for “PayrollNexus” or “HRStack” — they ask for payroll entry, statutory deductions, and salary slips.

**Implication for us:** The **master brand** can be short and ownable (Setu, Sanjay, etc.). The **product** for this buyer should read like Birbal’s title:

```text
[Master brand] Payroll & HR Operations
or
Payroll Operations for [Master brand]
```

Not a second startup name per vertical.

### 2. One parent product, paths not domains

Birbal does not need `payroll.birbal.com` as a separate company. They need one trusted system with modules:

```text
Dashboard · Employees · Master Employee · Payroll Entry · Payroll Summary · Settings
```

**Implication:** Same as our domain correction — `setu.in/payroll` or `birbal.setu.in` (tenant) beats hunting for `payrollops.com`.

### 3. Two commercial motions, one platform story

| Motion | Birbal RFP | Shailesh / interiors / physio conversations |
| --- | --- | --- |
| Primary pain | Replace manual payroll; statutory accuracy; multi-outlet ops | **Lead generation** — who to reach, push insights, surveys, bookings |
| Evidence | Days worked, salary components, ESI/PF rules | Social, website, WhatsApp, field survey, calendar gaps |
| Buyer language | “Payroll entry,” “payment status,” “salary slip” | “Leads,” “analytics,” “who should I contact?” |
| Success | Reconciled totals, unique employee/month/year, PDFs | Qualified enquiries, filled slots, attributable bookings |

**USP for GTM remains lead generation and demand signals.** Birbal shows the **second lane**: bounded **operations systems** for multi-location SMBs (restaurants, societies, dealerships) once trust exists.

Naming must **not** collapse everything into “lead gen tool” or “payroll app.” Structure:

```text
[Master brand] — customer discovery and growth (descriptor)
  ├── Lead Finder / Social Signals / Field Survey   ← growth USP
  ├── Business Page                                  ← digital presence
  └── Payroll & HR Operations                        ← vertical ops (Birbal-class)
```

### 4. “Reconstruction specification” = trust pattern

The PDF is a **reconstruction spec**: preserve calculation intent, fix inconsistencies (e.g. Standard Bonus server-side), confirm ambiguities before build. That is how operational buyers buy — not hype.

**Implication for brand voice:** Humane, structural, methodical (Cisco/Jeetu plain English). Avoid “autonomous AI growth engine” in proposals; use Birbal’s tone: modules, acceptance criteria, reconciliation.

---

## Industry mapping (restaurant / multi-outlet)

| Birbal need | Our capability angle |
| --- | --- |
| Multi-brand, multi-location employees | Same pattern as multi-outlet physio, garage unions, society associations |
| WhatsApp salary-slip share | Aligns with WhatsApp-first GTM; manual/device share in v1 |
| Letterheads per brand | Same as per-tenant brand kit in Grow prototype |
| Statutory ESI/PF (India) | Vertical **skills** + configurable rules — not generic LLM |
| CSV + dashboard for management | Push-model analytics Shailesh asked for — but for **payroll** not marketing |

Restaurant group is a **credible vertical** under master brand + descriptive product name; it does not replace **lead gen** as the headline USP for solopreneurs and interiors.

---

## RFP structure to reuse

When we respond or write specs for similar clients, mirror Birbal’s sections:

1. Executive summary (brands, locations, replace spreadsheets)
2. Current state and snapshot numbers (reference only)
3. Module list and navigation
4. Business rules with **must confirm** items (rates, 30-day denominator, rounding)
5. In-scope vs optional vs explicit exclusions
6. Roles (even if phase 2)
7. Security (PII, bank, masking, audit)
8. Scale targets (brands, locations, employees, history)
9. Acceptance criteria (checklist — calculations match every screen)
10. Proposal contents (architecture, feature map, phases, migration, commercial)

---

## Naming checklist when Birbal-style work appears

- [ ] Master brand stays **one** — not “KaushalPayroll”
- [ ] Product line name is **descriptive**: Payroll & HR Operations (or Payroll Operations)
- [ ] Domain: parent brand + path or tenant subdomain
- [ ] Sales deck leads with **their words** (payroll entry, ESI, salary slip) not “agents” or “skills”
- [ ] Growth products (Lead Finder, surveys) stay separate modules — upsell after ops trust
- [ ] Optional items priced separately (same as RFP pages 3–4)

---

## Open confirmations (from RFP — mirror in our discovery)

Before quoting Birbal-class builds, confirm:

- Letter types (warning vs joining/experience/termination)
- Payroll period rules (January → previous month?)
- Statutory rates versioned vs fixed
- Rounding and deduction > gross handling
- Soft delete vs hard delete for employees with history
- Auth / RBAC in phase 1 or 2
- WhatsApp: browser share vs Business API

---

## Link to main naming doc

See `Brand_and_Naming_Strategy.md` for master-brand candidates, domain architecture, and lead-generation USP. This file is the **vertical procurement reference** — proof that customers buy **descriptive operational products** under a trusted parent, not a new coined name per RFP.
