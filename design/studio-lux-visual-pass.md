# Lux Visual Pass — Grow [G0] · Preview [Q2] · Light Edit [Q4]

**Reviewer:** Lux (Chief Design Officer)  
**Date:** 2026-08-07  
**Inputs reviewed:** `design/studio-mira-flow-specs.md` v1.0 (screens G0, Q2, Q4); `design/studio-hifi-mock.html` (reference only — legacy Studio flow)  
**Verdict:** **CONDITIONAL APPROVE** — IA and interaction logic are shippable. Visual, motion, and token layers must be applied before engineering or updated hi-fi mock. Do **not** implement from current hi-fi mock; it contradicts Grow-first IA.

---

## Executive summary

Mira’s repositioning is correct: **Grow is a partner surface, not a design tool.** The three priority screens establish the emotional arc *“something noticed → something made for me → small tweak → done.”* That arc is right for ReFunction, kirana, and Mela-style operators.

What’s missing is **visual specificity** — the spec describes *what* appears, not *how it should feel*. The existing hi-fi mock (dark sidebar, “Brief for Tara,” Card Studio hero) sends **website-factory / martech** signals. That fails Principle 3 (“Growth partner, not website factory”).

This pass adds:
1. Light-first token baseline for Grow  
2. Pixel-level layout direction for G0, Q2, Q4  
3. Motion and micro-interaction specs  
4. 17-category grades with remediation  
5. Mira action items for spec v1.1  

---

## Alignment check: hi-fi mock vs Mira spec

| Dimension | Mira spec | Current hi-fi mock | Lux ruling |
|-----------|-----------|-------------------|------------|
| Product name | **Grow** | “Studio” in nav/title | Replace |
| Entry | Insight → preview | Overview stats → Brief | Replace |
| Agent visibility | Hidden | “Brief for Tara” | Remove |
| OAuth timing | On publish | Connect as early step | Fix order |
| Editor scope | Light edit | Full Card Studio | Demote / hide |
| Theme | Light-first | Dark sidebar + light content split | Unify light shell |
| WA | Co-equal block | Secondary | Promote |

**Direction for next mock:** Re-skin `studio-hifi-mock.html` to G0 → Q2 → Q4 → Q5 only; drop Overview/Brief/Studio-as-home.

---

## 17-category grades (G0 · Q2 · Q4 scope)

Scale: A+ / A / B / C / D — ship bar: **A in all**.

| # | Category | Grade | Notes |
|---|----------|-------|-------|
| 1 | Visual Design | **B+** | Spec is structurally sound; no distinctive visual language yet. Risk: generic SaaS card stack. |
| 2 | Typography | **B** | No type roles assigned to insight headline vs data vs CTA. |
| 3 | Color & Contrast | **B** | Semantic colors implied; tier/upgrade not visually differentiated in spec. |
| 4 | Information Architecture | **A** | Grow nesting, preview-before-connect, WA co-equal — excellent. |
| 5 | Interaction Design | **A-** | Flow budget ≤5 actions is right; Q2 action hierarchy needs one primary only. |
| 6 | Microcopy | **B+** | §8 placeholders good; insight headlines need Suki templates. |
| 7 | Onboarding | **A-** | G0 *is* onboarding for Grow — first visit must explain in one line. |
| 8 | Emotional Design | **B** | “Why this post” panel is the soul — must feel personal, not analytics dashboard. |
| 9 | Motion Design | **C+** | Not specified in Mira doc; remediated below. |
| 10 | Micro-interactions | **C+** | Copy, crop, regenerate lack feedback spec; remediated below. |
| 11 | Empty States | **B+** | G0 empty defined; needs illustration direction. |
| 12 | Feedback & Responsiveness | **B** | Generating skeleton OK; progressive reveal for Event kit not in G0/Q2/Q4 scope. |
| 13 | Delight & Personality | **B-** | Earned delight at Q6/Q2 approve — not decoration on G0. |
| 14 | Consistency | **C** | Hi-fi mock tokens ≠ future Owner Portal; must inherit portal shell. |
| 15 | Accessibility | **B+** | 44px targets in Mira; focus order on Q2 split layout not defined. |
| 16 | Habit Formation | **A-** | Insight card drives return — good. Needs “last post” subtlety on G0. |
| 17 | Virality | **B** | Screenshot-able moment is **Q2 phone preview** — frame it for sharing. |

**Blockers before build:** Categories 9, 10, 14 (motion, micro-interactions, token consistency).

---

## Design philosophy applied

### Confident clarity
One primary action per screen. G0 = preview suggestion. Q2 = approve. Q4 = save. Secondary actions visually subdued (ghost or text).

### Earned delight
- G0 insight card: subtle **250ms slide-up** on first load — not on every revisit.  
- Q2 generation complete: preview frame **fade-in 200ms** — no confetti.  
- Q6 (out of scope here): single checkmark scale 400ms — delight lives at *completion*, not browsing.

### Light-first for SMB
Default shell: **warm off-white canvas**, white elevated surfaces, **no dark sidebar** in Grow module v1. Owner Portal global nav may stay dark *only if* content area is consistently light and contrast verified — prefer **light nav + accent** for Grow to avoid “admin tool in basement.”

### Growth partner, not website factory
- Serif **only** for page title (“Grow”) — one display moment per screen.  
- Body UI stays sans (DM Sans or portal token).  
- No gradient hero blobs behind every card (current hi-fi mock is too “startup landing”). Use **one** soft ambient gradient on G0 only.

---

## Grow module — design tokens (v1)

Mira to merge into token file; engineers consume CSS variables / design system.

### Surfaces (light mode default)

| Token | Value | Use |
|-------|-------|-----|
| `grow-canvas` | `#F7F8FA` | Page background |
| `grow-surface` | `#FFFFFF` | Cards, panels |
| `grow-surface-muted` | `#F1F3F7` | Insight card inner highlight, WA block bg |
| `grow-border` | `#E4E8EF` | Card borders |
| `grow-border-strong` | `#CBD2E0` | Input borders, crop frame |

### Text

| Token | Value | Use |
|-------|-------|-----|
| `text-primary` | `#111827` | Headlines, captions in preview |
| `text-secondary` | `#4B5563` | Body, why bullets |
| `text-tertiary` | `#9CA3AF` | Meta, timestamps |
| `text-display` | Instrument Serif / portal display | “Grow” page title only |

### Brand & semantic

| Token | Value | Use |
|-------|-------|-----|
| `accent-primary` | `#1D4ED8` | Primary CTA fill |
| `accent-primary-hover` | `#1E40AF` | Hover |
| `accent-soft` | `#EFF6FF` | Insight card left accent bar, selected chip |
| `success` | `#059669` | Copied, scheduled |
| `success-soft` | `#ECFDF5` | WA copied banner |
| `warning` | `#D97706` | Char limit soft warn |
| `tier-growth` | `#7C3AED` | Upgrade pill border/text (distinct from primary blue) |

### Elevation

| Token | Shadow | Use |
|-------|--------|-----|
| `shadow-sm` | `0 1px 2px rgba(16,24,40,0.06)` | Chips, tabs |
| `shadow-md` | `0 8px 24px rgba(16,24,40,0.08)` | Insight card, phone frame |
| `shadow-focus` | `0 0 0 3px rgba(29,78,216,0.25)` | Focus ring |

### Radius & spacing

- Base unit: **4px**  
- Card radius: **16px** (Grow feels friendlier than 8px admin tiles)  
- Button radius: **12px** (primary), **999px** (chips)  
- Page padding: **24px** mobile, **32px** desktop  
- Section gap: **24px** mobile, **32px** desktop  

### Typography scale (Grow screens)

| Role | Size / weight | Line height |
|------|---------------|-------------|
| Display (page title) | 32px / 400 serif | 1.15 |
| H1 (insight headline) | 22px / 600 sans | 1.25 |
| H2 (panel title) | 16px / 600 sans | 1.3 |
| Body | 15px / 400 sans | 1.5 |
| Body small | 13px / 400 sans | 1.45 |
| Caption | 12px / 500 sans | 1.4 |
| Mono (optional WA) | 14px / 400 system mono | 1.5 |

---

## [G0] Grow Home — visual direction

### Layout (desktop ≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ Grow                                    [Growth report ↗]   │  ← display title + optional text link
│ Short subline: “Posts that match what’s happening in       │
│ your business.”                                             │
├─────────────────────────────────────────────────────────────┤
│ ┌─ INSIGHT CARD (full width, max 720px centered optional) ─┐│
│ │ ▌accent bar                                               ││
│ │ LABEL: “Suggested for you” (caption, tertiary)            ││
│ │ HEADLINE: “3 Friday slots are still open” (H1)            ││
│ │ • Thu has 0 bookings vs your usual 4                      ││
│ │ • Similar clinics post offers on Wed                      ││
│ │ [ Preview suggested post ]  (primary, full width mobile)  ││
│ └───────────────────────────────────────────────────────────┘│
│                                                             │
│ Quick actions (horizontal chips or 3 equal cards):          │
│ [ + New post ]  [ Promote event ]  [ View campaigns ]       │
│                                                             │
│ Optional footer row: “Last post: IG · 5 days ago · View”    │
└─────────────────────────────────────────────────────────────┘
```

**Max content width:** 720px for insight + actions (confident clarity — don’t stretch cards edge-to-edge on 1440px monitors).

### Insight card anatomy

- **Left accent bar:** 4px wide, `accent-soft` background with `accent-primary` bar — signals “this is for you” without alarm red.  
- **No chart junk** in v1 — bullets only. Charts belong in Growth report.  
- **Headline rule:** Must include a **number or day name** when data exists (“3 Friday slots,” not “Improve bookings”).  
- **Primary CTA:** Verb-first — “Preview suggested post” (not “Generate”). Full-width on mobile, inline on desktop below bullets.

### Quick actions

- **Visual weight:** Secondary — outline buttons or soft gray fill, never compete with insight CTA.  
- **Icon + label** for scan (calendar for event, list for campaigns).  
- **Do not** show four channel icons here — channel choice belongs in Q1/Q2.

### States (visual)

| State | Treatment |
|-------|-------------|
| Loading | Skeleton: 2 lines + pill CTA; shimmer 1.2s, respect reduced motion |
| Empty | Warm illustration (single line art: shop + speech bubble), headline “What do you want more of this week?”, CTA → Q1 |
| Growth locked | Small pill top-right of card: “Schedule with Growth” — `tier-growth` outline, no modal on load |

### Motion (G0)

- Insight card enter: `translateY(8px) → 0`, opacity 0→1, **250ms**, `cubic-bezier(0.22, 1, 0.36, 1)` — **once per session**.  
- CTA hover: background darken **150ms**; no scale bounce.  
- `prefers-reduced-motion`: instant show, no shimmer.

### G0 — Lux acceptance (visual)

- [ ] **L-G0-1:** One obvious focal point — insight CTA draws eye within 2s (squint test).  
- [ ] **L-G0-2:** Page readable in direct sunlight on phone — contrast ≥4.5:1 on all text.  
- [ ] **L-G0-3:** No agent names or “AI” badges visible.  
- [ ] **L-G0-4:** Sidebar/nav does not use dark-only treatment unless entire portal commits (prefer light content column).

---

## [Q2] Preview — visual direction

### Layout principle: **Phone first, context second**

The post preview is the product moment — not the sidebar, not the rationale panel.

**Desktop (≥1024px):** 55% preview / 45% context split.  
**Tablet:** Stacked — preview top, full width, max 400px centered.  
**Mobile:** Preview sticky top 50vh; scroll for why + WA + actions.

```
Desktop:
┌──────────────────────┬─────────────────────────┐
│  ┌──────────────┐    │ Why this post           │
│  │ IG/FB chrome │    │ • bullet                │
│  │              │    │ • bullet                │
│  │   [image]    │    │                         │
│  │              │    │ ┌─ WhatsApp ──────────┐ │
│  │  caption...  │    │ │ message text        │ │
│  └──────────────┘    │ │ [ Copy message ]    │ │
│  channel badge       │ └─────────────────────┘ │
│                      │ [Looks good — publish]  │
│                      │ Edit · Try another      │
└──────────────────────┴─────────────────────────┘
```

### Post preview frame

- Use **real channel chrome** (IG header dots, FB like bar ghost) — lightly muted (`opacity 0.7` on chrome) so content pops.  
- Frame shadow: `shadow-md`; outer padding 16px; background `#000` for IG letterbox only if image is 4:5 — otherwise white frame.  
- **Brand:** Tenant logo as avatar circle in mock header — not KaushalStack.  
- Caption: max 3 lines in frame + “more” expand inline — never truncate without affordance.

### “Why this post” panel

- Title: **“Why this post”** — not “Growth insight” or “Analytics.”  
- Bullets: max 3, each ≤12 words.  
- Visual: no icons per bullet in v1 — whitespace is clarity.  
- Tone check: sounds like a helpful staff member, not a dashboard.

### WhatsApp block

- **Always visible** on Q2 — not a tab. Indian SMB primary channel.  
- Container: `grow-surface-muted` with **WhatsApp-green left border** 3px (`#25D366`) — semantic, not full green background.  
- Copy button: secondary solid or outline; on success → button label “Copied ✓” **2s** then revert (`success` color).  
- Message: plain sans, not monospace (monospace feels developer-facing).

### Action hierarchy

| Priority | Control | Style |
|----------|---------|-------|
| 1 | Looks good — publish | Primary fill, full width mobile |
| 2 | Edit caption or crop | Text link or ghost, below primary |
| 3 | Try another angle | Text link, tertiary color, with “2 left” caption for free tier |

**Never** two primary buttons side by side.

### Generating state

- Skeleton inside phone frame (image rect + 3 caption lines).  
- Copy: **“Preparing your post…”** — not “Tara is thinking.”  
- Duration >5s: show subtext “Usually ready in under a minute.”  
- No spinner alone — always skeleton of final layout.

### Motion (Q2)

- Preview ready: image **fade-in 200ms**; caption type optional **disabled in v1** (can feel gimmicky).  
- WA copy success: checkmark crossfade **150ms**.  
- Regenerate: brief **opacity 0.6 → 1** on frame **300ms** — communicates refresh without slide carousel.

### Q2 — Lux acceptance (visual)

- [ ] **L-Q2-1:** Squint test — user sees *their* offer in preview before any other UI.  
- [ ] **L-Q2-2:** WA block visible without scroll on 812px height mobile.  
- [ ] **L-Q2-3:** No OAuth/connect UI on this screen.  
- [ ] **L-Q2-4:** Channel badge (Instagram / Facebook) visible on frame.  
- [ ] **L-Q2-5:** Screenshot crop 390×844 looks share-worthy (peer demo test).

---

## [Q4] Light edit — visual direction

### Layout: **Edit beside preview, not instead of it**

User must never lose sight of outcome while tweaking.

**Desktop:** Left 50% live preview (same frame as Q2), right 50% control stack.  
**Mobile:** Preview pinned top 40%; controls scroll below; **sticky bottom bar** Save / Cancel.

```
┌──────────────────────┬─────────────────────────┐
│  (same Q2 frame)     │ Caption                 │
│  updates live        │ [ textarea ]            │
│                      │ 0 / 2200 · Instagram    │
│                      │ Format                  │
│                      │ [1:1] [4:5] [9:16]      │
│                      │ Image                   │
│                      │ [ Upload ] [ Library ]  │
│                      │ ┌─ focal crop ────────┐ │
│                      │ │  drag focal dot     │ │
│                      │ └─────────────────────┘ │
│                      │ Advanced edit ↗ (text)  │
└──────────────────────┴─────────────────────────┘
│        [ Cancel ]              [ Save changes ]  │ sticky mobile
└──────────────────────────────────────────────────┘
```

### Caption field

- Single textarea, min height 120px, grows with content.  
- Character hint bottom-right: `142 / 2200 · Instagram` — turns `warning` at 90% soft limit.  
- Live update in preview: debounce **300ms** — no flicker per keystroke.

### Format chips

- Segmented control style: selected = `accent-soft` bg + `accent-primary` text.  
- Switching format: crop animates **200ms** with focal point preserved — user sees image pan, not jump cut.

### Focal cropper

- **Dot** 24px, white ring 2px, shadow-sm — draggable.  
- Grid overlay optional on drag only (rule of thirds faint lines).  
- **Safe zone** for branded footer: if template has footer band, show dashed line — Rachana P0.  
- Do not expose zoom slider in v1 unless user uploads custom image.

### Image actions

- Upload + Library as equal secondary buttons.  
- “Suggest 3 images” (Growth): tertiary link with lock icon on free tier.  
- Upload progress: linear bar under preview, not modal.

### Advanced edit

- Text link bottom of panel: “Advanced edit” → legacy Card Studio if retained.  
- Visually de-emphasized — never primary.

### Motion (Q4)

- Format change: `transform` pan **200ms** `ease-out`.  
- Save: button → “Saving…” **disabled** 150ms min, then navigate Q2 with **toast** “Changes saved” optional (or rely on visual diff).  
- `prefers-reduced-motion`: instant crop snap.

### Q4 — Lux acceptance (visual)

- [ ] **L-Q4-1:** Preview updates for caption + crop without full page reload.  
- [ ] **L-Q4-2:** Format switch never chops footer text on branded templates.  
- [ ] **L-Q4-3:** Control count ≤6 visible without expand — no tool palette.  
- [ ] **L-Q4-4:** Sticky save bar clears iOS safe area (34px bottom padding).  
- [ ] **L-Q4-5:** Focus order: caption → format → image → save (keyboard).

---

## Shared components — Lux refinements

### Insight card (G0)
- One card only in v1 — no carousel of insights (overwhelming).  
- Rotate insight on weekly return, not every visit.

### Post preview frame (Q2, Q4)
- Single component, two modes: `static` | `live-edit`.  
- Export PNG for download uses same render path.

### Tier upgrade pill
- Copy: “Schedule with Growth” — not “Upgrade now”.  
- Style: outline `tier-growth`, no pulsing glow (anti-aggressive per Lux micro-interaction rules).

### Connect banner (Q5 — reference)
- Inline yellow-amber **soft** banner, not error red — user did nothing wrong.

---

## Motion system summary (Grow Quick post)

| Moment | Duration | Easing | Reduced motion |
|--------|----------|--------|----------------|
| G0 insight enter | 250ms | ease-out expo | instant |
| G0 → Q2 route | 200ms | crossfade | instant |
| Q2 skeleton → ready | 200ms | opacity | instant |
| Q2 regenerate | 300ms | opacity pulse | instant |
| Q4 format crop | 200ms | ease-out | instant |
| WA copied | 150ms | check swap | instant |
| Q6 success (ref) | 400ms | check scale | instant |

**No** page slide transitions >8px — feels mobile-web cheap on desktop.

---

## Accessibility (Lux addendum to Mira)

- Focus ring: `shadow-focus` on all interactive elements — never `outline: none` without replacement.  
- Q2 mobile: announce preview ready via `aria-live="polite"`.  
- WA copy: button `aria-label="Copy WhatsApp message"`.  
- Format chips: `role="tablist"` with `aria-selected`.  
- Color alone never indicates tier — include lock icon + text “Growth”.  
- Minimum touch 44×44 — Mira already has; verify spacing between “Edit” and “Try another” links.

---

## Remediation — Mira spec v1.1 tasks

| ID | Owner | Action |
|----|-------|--------|
| R1 | Mira | Add §Design tokens — paste Grow token table from this doc |
| R2 | Mira | Expand G0 layout with max-width 720px + last-post footer |
| R3 | Mira | Expand Q2 with 55/45 split, WA block spec, action hierarchy table |
| R4 | Mira | Expand Q4 with sticky save bar, focal cropper, live debounce |
| R5 | Mira | Add Lux acceptance IDs (L-G0-*, L-Q2-*, L-Q4-*) alongside AC |
| R6 | Mira | Add focus order + aria-live notes to Q2, Q4 |
| R7 | Suki | Insight headline templates with number/day pattern |
| R8 | Engineer | Deprecate hi-fi mock screens: Overview, Brief, Card Studio as home |
| R9 | Lux | Re-review updated hi-fi mock after Mira v1.1 |

---

## Open decisions (Lux recommendations)

| Question | Lux recommendation |
|----------|---------------------|
| G0 on portal home vs Grow nav only? | **Teaser on portal home** — one insight card widget linking to G0; full experience under Grow. |
| Dark sidebar globally? | **Light shell for Grow v1** even if rest of portal stays dark — consistency within module beats partial dark. |
| Advanced edit / Card Studio? | **Hidden behind text link** in Q4 — never primary nav item. |
| Instrument Serif? | **Page title only** — if portal already has display font, use portal token instead. |

---

## Approval status

| Screen | Status |
|--------|--------|
| G0 Grow Home | **Approved** after R2 + tokens |
| Q2 Preview | **Approved** after R3 + motion |
| Q4 Light edit | **Approved** after R4 + crop spec |

**Overall:** **CONDITIONAL APPROVE** — proceed to hi-fi mock refresh and Mira v1.1; do not start production UI from legacy Studio mock.

---

*Lux visual pass v1.0 — next gate: updated hi-fi for G0, Q2, Q4 only*
