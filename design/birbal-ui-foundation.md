# Birbal UI Foundation — shadcn/ui Adoption

Implementation foundation for Birbal Payroll & HR Operations. shadcn/ui distributes component source into our repository; we own and maintain the final components.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 + CSS variables |
| Primitives | Radix UI (dialog, tabs, switch, select, slot) |
| Icons | Lucide React |
| Components | shadcn-style copies in `src/components/ui/` |

Location: `birbal-payroll/` (run `npm run dev` from that directory).

## Design tokens

Tokens live in `src/index.css` as semantic CSS variables:

- Canvas / surface / muted / preview / locked surfaces
- Primary, secondary, tertiary text
- Border, action (teal), focus ring
- Status: paid, pending, hold, error, locked, active
- Spacing: input height, table row height
- Typography: Geist Variable (UI + headings), Geist Mono (codes)

**Rule:** No raw hex in page-level components. Extend tokens for tenant branding later.

## Component ownership

### Shared foundation (`src/components/ui/`)

- `button`, `input`, `badge`, `tabs`, `dialog`, `switch`, `table`

### Birbal-specific (`src/components/birbal/`)

- `amount-display` — INR + tabular nums + preview styling
- `employee-identity` — name, code, paid badge
- `save-indicator` — quiet saved vs unsaved (in employee-identity)
- `calculation-breakdown` — Employee inputs / Applied rules / Final amount
- `payment-status-control` — Paid / Not paid / Hold with **Save required** gate
- `paid-confirm-dialog` — confirmation before marking paid

### Pages migrated

- **Monthly Payroll Work & Review** — `src/pages/payroll-page.tsx` (first workflow)

### Planned (not yet built)

- Import wizard, document drawer, save-all progress modal (React), period lock confirmation (React)
- Storybook, server preview API integration

### Built in app shell (v0.2)

- Four-area navigation: Period, People, Monthly Payroll, Settings
- Period home with lifecycle rail, next action, exceptions (stub data)
- Geist fonts via `@fontsource-variable/geist`

## Payroll rules (enforced in UI)

1. Unsaved rows show **Save required** in Review — cannot set payment status
2. **Paid** opens confirmation dialog (method, date, actor)
3. Calculation preview vs saved visually distinct (`AmountDisplay`, `Badge`)
4. Production: all calculations from `POST /api/payroll/preview` — client calc in `payroll-calc.ts` is prototype-only

## State model

| State | Meaning | Visual |
|-------|---------|--------|
| Unsaved | Edits not persisted | Amber border, Unsaved label |
| Saved | Row persisted | Quiet dot + Saved |
| Preview | Unsaved calculation | Preview badge on amounts |
| Paid | Payment recorded | Strong Paid control / badge |
| Locked | Paid + saved, no edits | Locked row background |

## Responsive

- **Desktop:** dense table, sticky employee column, deductions grouped column
- **Mobile:** employee cards, inline inputs, calculation expandable

## HTML prototype (stakeholder demo)

`design/birbal-payroll-prototype.html` — v3 includes period lifecycle, import blockers vs payroll exceptions split, reconciliation checklist, compact mobile banner.

## Next engineering steps

1. Storybook catalog for shared + Birbal components
2. Wire preview API; single calculation response shape everywhere
3. Migrate Period home with lifecycle rail and reconciliation panel
4. Visual regression on Work, Review, Period, People, salary slip

## Acceptance checklist

- [x] Token layer centralized
- [x] shadcn-style UI primitives in repo
- [x] Monthly Payroll Work/Review separate render paths
- [x] Unsaved rows cannot be marked Paid
- [ ] Locked periods read-only (app-wide)
- [ ] Server preview endpoint
- [ ] Storybook / visual regression
- [x] Full four-area navigation shell
- [x] Geist typography applied app-wide
