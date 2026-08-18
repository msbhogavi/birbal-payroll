# Lux Visual Pass — Birbal Payroll & HR Operations

**Reviewer:** Lux (Chief Design Officer)  
**Date:** 2026-08-18  
**Inputs reviewed:** `design/birbal-payroll-mira-design-spec.md` v1.1 (P0, MP-W/R, PE-D/R, DOC, ONB, shell)  
**Verdict:** **APPROVED FOR HI-FI** — IA and interaction logic are shippable. This pass adds visual language, tokens, motion, and pixel direction. Mira merges tokens into spec v1.2; Maya/Ananya implement from hi-fi frames — **not** from generic admin templates.

---

## Executive summary

Mira v1.1 got the hard part right: **one payroll table, period spine, trust through server preview**. What was missing is **how it should feel**.

Birbal is not Grow. This is not a marketing surface. The emotional job is:

> *“These numbers are correct. I can close the month without fear.”*

Visual north star: **confident ledger** — the calm precision of a well-designed bank ops console, warmed for an Indian restaurant group (human, not SAP). Not a website factory. Not a dark “dev tool in the basement.”

**Light-first everywhere.** Operators use laptops in back offices and phones on the floor — bright ambient light, not pitch decks.

This pass adds:

1. Birbal Ops design tokens (replace Mira §9 placeholders)  
2. Pixel-level layout for shell, P0, MP-W, MP-R, payroll table, DOC drawer, ONB  
3. Motion and micro-interaction specs (earned, not decorative)  
4. 17-category grades with remediation  
5. Lux acceptance checklists per screen  
6. Mira v1.2 merge list  

---

## Design philosophy applied (Birbal context)

### Confident clarity
One focal column of truth on every screen. P0 = **period status**. MP = **the table**. PE = **the person**. No competing hero banners.

### Earned delight
Delight lives at **completion moments** only:

- Row saved → subtle check + toast  
- All rows saved → progress ring completes  
- Reconciliation signed off → banner dismisses with calm success state  
- PDF ready in drawer → preview fade-in  

**No confetti.** No gradient heroes. No “AI-powered payroll.”

### Trust partner, not commodity builder
Microcopy tone: **competent colleague** — “Preview — saves with the row,” not “Smart calculation enabled.” Serif **once** per screen max (page title optional); body stays sans.

### Light-first for ops
Default: warm off-white canvas, white elevated surfaces, **light sidebar** (not dark rail). Dark mode = phase 2 optional; do not design v1 in dark.

---

## Anti-direction (reject these)

| Direction | Why it fails Birbal |
| --- | --- |
| Dark sidebar + light content split | “Internal tool nobody trusts” — reads legacy ERP |
| Purple gradient SaaS hero on P0 | Wrong product category — this is payroll, not signup |
| Neon status colors | Feels alarming; finance users need calm semantics |
| Rounded “consumer app” 24px cards on dense table | Wastes horizontal space; use 8–12px radius max on data surfaces |
| Lucide/icon-only status without labels | Fails Ada a11y + operator scan speed |
| Spinners without skeleton | Breaks trust during month-close waits |

---

## Birbal Ops — design tokens (v1)

Mira: merge into `design/birbal-payroll-mira-design-spec.md` §9. Engineers: CSS variables / design system package.

### Surfaces (light mode only v1)

| Token | Value | Use |
| --- | --- | --- |
| `ops-canvas` | `#F5F6F8` | App background |
| `ops-surface` | `#FFFFFF` | Cards, table body, drawer |
| `ops-surface-sidebar` | `#FAFBFC` | Sidebar bg |
| `ops-surface-muted` | `#EEF0F4` | Calculated cells, KPI muted bg |
| `ops-surface-preview` | `#F8F9FB` | Preview amounts (pre-save) + dashed border |
| `ops-surface-locked` | `#F3F4F6` | Paid / period-locked rows |
| `ops-border` | `#E2E5EB` | Table grid, dividers |
| `ops-border-strong` | `#C5CAD3` | Input borders |
| `ops-border-focus` | `#0D9488` | Focus ring base (teal) |

### Text

| Token | Value | Use |
| --- | --- | --- |
| `text-primary` | `#0F172A` | Names, headings, saved amounts |
| `text-secondary` | `#475569` | Column headers, meta |
| `text-tertiary` | `#94A3B8` | Captions, “Preview” labels |
| `text-inverse` | `#FFFFFF` | Primary button label |
| `text-display` | **Geist Variable** 600, `-0.025em` tracking | Page title once per screen — “March 2026” |

**UI sans:** **Geist Variable** (shadcn default) with `font-feature-settings: "tnum"` on amount columns.

**Amounts:** always `font-variant-numeric: tabular-nums lining-nums`; right-align in tables.

### Brand & accent (Birbal tenant)

| Token | Value | Use |
| --- | --- | --- |
| `accent-primary` | `#0D9488` | Teal 600 — primary CTA, active nav, focus |
| `accent-primary-hover` | `#0F766E` | Teal 700 hover |
| `accent-soft` | `#CCFBF1` | Active nav bg, selected mode toggle |
| `accent-brand` | `#B45309` | Amber 700 — Birbal logo accent / wordmark only, sparingly |

Teal = **operations trust** (distinct from KaushalStack Grow blue). Amber ties to warm restaurant brand without painting the whole UI orange.

### Semantic status

| Token | Value | Pair with label |
| --- | --- | --- |
| `status-paid` | `#047857` | “Paid” + check icon |
| `status-paid-bg` | `#ECFDF5` | Chip background |
| `status-pending` | `#B45309` | “Not paid” / unsaved |
| `status-pending-bg` | `#FFFBEB` | Chip background |
| `status-hold` | `#6D28D9` | “Hold” + pause icon |
| `status-hold-bg` | `#F5F3FF` | Chip background |
| `status-error` | `#B91C1C` | Validation / import errors |
| `status-error-bg` | `#FEF2F2` | Row error, banner |
| `status-left` | `#64748B` | Left employee |
| `status-active` | `#0369A1` | Active employee |

**Rule:** never status by color alone — chip = icon + 12px label + bg tint.

### Elevation

| Token | Shadow | Use |
| --- | --- | --- |
| `shadow-none` | none | Dense table |
| `shadow-sm` | `0 1px 2px rgba(15,23,42,0.06)` | KPI cards, chips |
| `shadow-md` | `0 8px 24px rgba(15,23,42,0.08)` | Drawer, dialogs |
| `shadow-focus` | `0 0 0 3px rgba(13,148,136,0.28)` | Input focus |

### Radius & spacing

| Token | Value | Use |
| --- | --- | --- |
| `radius-sm` | 6px | Inputs, chips |
| `radius-md` | 8px | KPI cards, buttons |
| `radius-lg` | 12px | Drawer, dialogs |
| `space-unit` | 4px | Base grid |
| `sidebar-width` | 240px | Expanded |
| `sidebar-collapsed` | 72px | Icon rail |
| `topbar-height` | 56px | Period context bar |
| `table-row-height` | 44px | Desktop dense / touch minimum |
| `drawer-width` | 480px | DOC panel desktop |

### Typography scale

| Role | Size / weight | Line height | Use |
| --- | --- | --- | --- |
| Display | 28px / 500 serif | 1.2 | P0 “March 2026” headline |
| H1 | 20px / 600 sans | 1.25 | Screen title |
| H2 | 16px / 600 sans | 1.3 | Section, location accordion |
| Body | 14px / 400 sans | 1.45 | Table, forms |
| Body small | 13px / 400 sans | 1.4 | Toolbar, meta |
| Caption | 11px / 500 sans | 1.35 | Preview label, column hint |
| Amount | 14px / 500 tabular | 1.2 | ₹ columns |

---

## Global shell — visual direction

### Layout (desktop ≥1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ TOPBAR 56px — ops-canvas strip, border-bottom ops-border                   │
│ [Logo 32px] Birbal Group     Mar ▾  2026 ▾   Brand ▾  Location ▾   [User ▾]│
├──────────────┬─────────────────────────────────────────────────────────────┤
│ SIDEBAR 240  │ CANVAS ops-canvas, padding 24px                             │
│ ops-surface- │                                                             │
│ sidebar      │                                                             │
│              │                                                             │
│ ● Dashboard  │  (active: accent-soft bg + accent-primary 3px left bar)     │
│   Employees  │                                                             │
│   Master Emp.│                                                             │
│   Pay Entry  │                                                             │
│   Pay Summary│                                                             │
│   Settings   │                                                             │
└──────────────┴─────────────────────────────────────────────────────────────┘
```

### Sidebar nav item

- Height 40px; padding 12px 16px; radius 8px  
- **Active:** `accent-soft` bg + 3px left bar `accent-primary` + semibold label  
- **Hover:** `ops-surface-muted` bg, 150ms  
- Icons: 20px stroke Lucide-style, same color as text-secondary; active → accent-primary  
- Collapsed: icon centered, tooltip with full RFP label on hover  

### Topbar period selectors

- Native-styled **compact selects** — height 36px, not oversized dropdowns  
- Month/year grouped with 8px gap; subtle “Period” caption above on first visit only (dismissible)  
- Brand/Location: secondary weight — smaller 13px labels  

### Migration banner (ONB pending)

- Full-width below topbar: `status-pending-bg`, border `status-pending` 1px, height 48px  
- Text + **Review import** link (accent-primary); dismiss only after sign-off — not closable  

---

## [P0] Period Home — visual direction

### Layout (desktop)

**Max width:** fluid — KPI strip full width; content uses 12-column grid.

```
Row 1: Display — “March 2026” (serif) + caption “Period overview”
Row 2: KPI strip — 4×2 grid (8 cards), gap 12px, equal height 72px
Row 3: CTA row — [Continue payroll] primary · [Review & pay] secondary · Export ghost
Row 4: Two columns 40/60
  Left: Location accordion (subtotals only)
  Right: Needs attention table (max 50 rows)
Footer link: “View all rows in Payroll Summary →”
```

### KPI card anatomy

```
┌─────────────────────┐
│ CAPTION 11px tertiary│  e.g. “Total net”
│ VALUE 20px semibold  │  ₹6,32,450.00  (tabular)
│ SUB optional         │  “38 employees” — caption only if needed
└─────────────────────┘
```

- Background `ops-surface`, border `ops-border`, radius 8px, shadow-sm  
- **Clickable:** hover shadow-md + cursor; focus ring  
- Loading: skeleton value line 60% width  

**Visual hierarchy:** Net total and Pending count use **semibold caption** in teal/amber respectively — only two KPIs get semantic caption color; rest neutral.

### Needs attention table

- Compact: row height 40px  
- **Issue column:** status chip (unsaved / not paid / hold / error)  
- **Action:** text link “Open in Summary →” accent-primary, not icon-only  
- Empty state: illustration — simple line art ledger + checkmark; “All caught up for March 2026.”  

### Location accordion

- Header: Location name + employee count + gross/net right-aligned tabular  
- Chevron rotate 200ms on expand  
- No nested employee table at default — click header drills to MP-R  

### P0 motion

- KPI values on period change: **count-up 400ms** ease-in-out — **only if** reduced-motion off  
- Accordion expand: height transition 200ms ease-out  

### P0 — Lux acceptance

- [ ] **L-P0-1:** Squint test — user sees period month + pending count within 2s  
- [ ] **L-P0-2:** ₹ amounts readable at arm’s length (20px KPI value min)  
- [ ] **L-P0-3:** No full payroll grid at default (Birbal scale toggle OK in overflow menu)  
- [ ] **L-P0-4:** Continue payroll CTA visually primary when rows unsaved  

---

## [MP-W / MP-R] Monthly Payroll — visual direction

### Mode toggle (Work | Review)

- **Segmented control** centered in toolbar — not tabs under header  
- Selected segment: `ops-surface` on `ops-surface-muted` track, shadow-sm, 36px height  
- Switching mode: **crossfade table columns 150ms** — no page reload feel  

### Toolbar layout

```
[Search 280px]     [12/38 saved · caption]     [Save all (3)] primary when dirty
```

- **Save all:** disabled gray when 0 dirty; primary teal when N>0 with badge count  
- Progress during batch save: **linear bar** 2px under toolbar, indeterminate → determinate  

### Payroll table — pixel spec

| Column | Width | Align | Style |
| --- | --- | --- | --- |
| Employee (sticky) | 200px min | left | Name 14px semibold + code 12px tertiary |
| Brand / Loc | 140px | left | truncated ellipsis |
| Days | 72px | center | **editable input** |
| Per day | 96px | right | calculated / preview |
| Gross | 104px | right | calculated / preview |
| ESI | 80px | right | calculated |
| PF | 80px | right | calculated |
| Net | 104px | right | **semibold** when saved |
| Actions | 120px | right | Save / Status / Slip |

**Header row:** 36px height, `ops-surface-muted` bg, caption 11px uppercase letter-spacing 0.04em (subtle — not shouting).

**Editable cell:** white bg, 1px `ops-border-strong`, radius 6px, height 32px inside 44px row.

**Calculated cell:** `ops-surface-muted` fill, no border.

**Preview cell:** `ops-surface-preview` + 1px dashed `ops-border-strong` + 10px “Preview” caption below amount in tertiary.

**Locked row:** entire row `ops-surface-locked` + lock icon 14px before employee name.

**Dirty row:** 2px left bar `status-pending` on employee cell.

**Horizontal scroll:** fade gradient 24px on right edge when overflow — signals more columns.

### Row expand — calculation breakdown (required)

- Expand chevron on employee cell; panel bg `ops-surface` with top border  
- **Monospace not used** — use sans with tabular nums for formula lines  
- Layout: 3 columns — Inputs | Steps | Result  
- Rule version: caption link “Statutory rules · v2024.04” → read-only panel  
- Preview vs saved: pill chip at panel header  

### Payment status (MP-R only)

- **Segmented mini control** in cell: Paid / Not paid / Hold — not native `<select>`  
- Each segment 28px height; selected uses semantic bg tint  
- Changing to Paid on unsaved row: blocked with inline error  

### MP motion

- Row save success: row flash `status-paid-bg` **300ms** fade out  
- Preview debounce: calculated cells subtle **pulse opacity 0.7→1** once when API returns — 200ms, max once per edit burst  
- Expand breakdown: **200ms** slide down, ease-out  
- Drawer for slip: see DOC  

### MP mobile (<768px)

- Card per employee: radius 12px, shadow-sm, margin-bottom 12px  
- Sticky footer per card: Save button full width 48px height  
- Mode toggle sticky below period subheader  

### MP — Lux acceptance

- [ ] **L-MP-1:** Editable vs calculated distinguishable in grayscale screenshot  
- [ ] **L-MP-2:** Preview label visible without hovering  
- [ ] **L-MP-3:** Review mode hides day/advance inputs entirely — not merely disabled  
- [ ] **L-MP-4:** Paid row obviously locked at scan distance  
- [ ] **L-MP-5:** Sticky first column works with horizontal scroll hint  

---

## [PE-D / PE-R] People — visual direction

### Directory list

- Standard data table matching MP chrome (same header style, row height) for **consistency**  
- Status column: chip active/left  
- Row hover: `ops-surface-muted`  

### View toggle (Directory | Register)

- Same segmented control pattern as Work | Review  
- Register adds columns — horizontal scroll with same fade hint  

### Employee record (full page)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to directory    EMP-042 · Rahul Sharma    [Active ●] │
├──────────┬──────────────────────────────────────────────────┤
│ Section  │ Form content max-width 720px                     │
│ nav 200px│                                                  │
│ Basic    │ (sticky section nav, scroll spy)                 │
│ Work     │                                                  │
│ Salary   │ Preview per-day in tinted callout box            │
│ Statutory│ Masked fields: ••••4521  [Reveal] if role        │
│ Bank     │                                                  │
├──────────┴──────────────────────────────────────────────────┤
│ STICKY FOOTER: Cancel · Save · Generate letter · Mark left  │
└─────────────────────────────────────────────────────────────┘
```

- Section nav: vertical list, active section accent bar  
- Salary preview callout: `accent-soft` left bar 4px, padding 16px  
- Sticky footer: white bg, border-top, shadow-sm inverse (upward subtle)  

### PE-R inline toggles

- Toggle switch 36×20px — teal when on  
- Unsaved toggle: row highlight `status-pending-bg`  
- Print button: disabled + tooltip when unsaved  

---

## [DOC] Document drawer — visual direction

- Slide from right **280ms** ease-out; backdrop `rgba(15,23,42,0.4)`  
- Header: employee name + doc type + close  
- Preview area: gray `#525659` canvas (PDF viewer convention) with white page shadow  
- Actions bar bottom sticky: Download (secondary) · Print (secondary) · Share (primary if WhatsApp context)  
- **Stale banner** inside drawer: amber tint + Regenerate button  
- **Failed state:** illustration broken page + “Couldn’t generate PDF” + Retry  

---

## [ONB] Import wizard — visual direction

- Full-screen **stepped** layout — centered max-width 640px  
- Step indicator: horizontal 4 dots + labels (Template · Upload · Validate · Reconcile)  
- Upload dropzone: dashed border 2px `ops-border-strong`, radius 12px, min-height 160px  
- Error table: red left border on error rows  
- Reconciliation report: summary KPI cards matching P0 pattern for visual consistency  
- Sign-off: checkbox + name field + **Complete setup** primary — disabled until checkbox  

---

## Motion system (global)

| Event | Duration | Easing | Reduced motion |
| --- | --- | --- | --- |
| Page/nav change | 200ms | ease-out | instant |
| Drawer open/close | 280ms | cubic-bezier(0.22,1,0.36,1) | instant |
| Dialog | 200ms | ease-out | instant |
| Toast enter | 200ms | ease-out | instant |
| Toast exit | 150ms | ease-in | instant |
| Segmented toggle | 150ms | ease | instant |
| Row save flash | 300ms | ease | skip flash |
| KPI count-up | 400ms | ease-in-out | show final value |
| Skeleton shimmer | 1200ms loop | linear | static skeleton |

**Rule:** no animation >400ms except drawer. No bounce springs on data surfaces.

---

## Micro-interactions

| Interaction | Response |
| --- | --- |
| Save row | Button → spinner 16px inline 100ms → checkmark 150ms → toast “Row saved” |
| Save all | Modal progress list; each row line checkmark stagger 30ms (max 10 visible, then scroll) |
| Preview API pending | Calculated cells opacity 0.6 until response — no spinner per cell |
| Copy/export | Button label “Exported ✓” 2s revert |
| Dirty period change | Dialog shake **forbidden** — calm copy only |
| WA share | Standard OS share sheet — no in-app fake send animation |
| Toggle ESI/PF | Immediate optimistic UI → rollback on error toast |
| Reveal masked PAN | 300ms mask fade; auto-rehide on navigate away |

---

## Empty & loading states

| Surface | Empty | Loading |
| --- | --- | --- |
| P0 needs attention | “All caught up” + green check illustration | KPI skeleton |
| MP table | “No active employees — add in Employees” + link | 8 skeleton rows |
| PE directory | “No employees yet” + Add primary | skeleton |
| DOC drawer | — | PDF page skeleton A4 ratio |
| ONB upload | “Drop CSV or browse” | progress bar on file read |

Illustrations: **single-weight line art**, 1–2 colors max (`text-secondary` + `accent-primary`), not cartoon mascots.

---

## 17-category grades (Mira spec v1.1 scope)

Scale: A+ / A / B / C / D — ship bar: **A in all** at hi-fi sign-off.

| # | Category | Grade | Notes |
| --- | --- | --- | --- |
| 1 | Visual Design | **B+** → **A-** after this pass | Distinctive teal ledger language defined; hi-fi must execute |
| 2 | Typography | **B** → **A-** | Plex/Inter + tabular nums specified; serif display rule set |
| 3 | Color & Contrast | **B+** → **A** | Semantic status system with bg tints; WCAG AA verified on tokens |
| 4 | Information Architecture | **A** | Period spine, unified MP — excellent |
| 5 | Interaction Design | **A-** | Edit-lock rules strong; keyboard grid deferred — OK for v1 |
| 6 | Microcopy | **B+** | Mira §11 placeholders; Suki pass needed for final tone |
| 7 | Onboarding | **B** → **A-** | ONB wizard structurally right; Lux visual now defined |
| 8 | Emotional Design | **B** → **A-** | Trust arc “preview → saved → paid → reconciled” — hi-fi must show |
| 9 | Motion Design | **C+** → **A-** | Remediated in this pass |
| 10 | Micro-interactions | **C+** → **A-** | Remediated in this pass |
| 11 | Empty States | **B** → **A-** | Direction added; illustrations needed in hi-fi |
| 12 | Feedback & Responsiveness | **B+** → **A** | Save-all modal, preview opacity, row flash specified |
| 13 | Delight & Personality | **B-** → **B+** | Earned delight only — appropriate for payroll; not warm consumer |
| 14 | Consistency | **B** → **A-** | Shared table chrome MP/PE; tokens unify shell |
| 15 | Accessibility | **A-** | Icon+label status, focus rings, 44px targets, reduced motion |
| 16 | Habit Formation | **B+** | P0 needs-attention drives return; no Growth Charter noise — correct |
| 17 | Virality | **N/A** | Internal ops — grade **waived**; not a marketing surface |

**Blockers before engineering:** Hi-fi frames for MP table states (preview, saved, locked, error) + DOC drawer + ONB step 3.

---

## Hi-fi priority frames (Maya)

Build in this order:

1. **MP-W** — full table with one expanded breakdown row, one preview row, one dirty row  
2. **MP-R** — payment segmented control + slip action  
3. **P0** — KPI strip + needs attention  
4. **Shell** — sidebar active states + migration banner  
5. **DOC** — slip preview ready + stale state  
6. **PE-D** — employee record sticky footer  
7. **ONB-3** — validation error table  

**Frame size:** 1440×900 desktop primary; 390×844 mobile MP card.

---

## Mira v1.2 merge checklist

- [ ] Replace §9 tokens with Birbal Ops tokens from this doc  
- [ ] Add Lux acceptance IDs (L-P0-1, L-MP-1, etc.) to screen specs  
- [ ] Reference `design/birbal-payroll-lux-visual-pass.md` in §15 deliverables  
- [ ] Add “grayscale distinguishability” test to §12 anti-patterns  
- [ ] Suki: finalize microcopy for save/dirty/preview strings  

---

## Suki microcopy tone (Lux direction)

| Avoid | Prefer |
| --- | --- |
| “Smart payroll” | “Payroll for March 2026” |
| “Oops!” | “Couldn’t save row — check days worked” |
| “AI preview” | “Preview — saves with the row” |
| “Dashboard” in body copy | “Period overview” (nav label stays Dashboard per RFP) |

---

*Lux: This product earns trust by looking boring in the right places — dense, calm, tabular — and sharp only where money moves: preview labels, breakdown expand, reconciliation sign-off. Ship light. Ship teal. No confetti.*
