# KaushalStack Grow — Desktop Workspace Architecture

**Version:** 1.0  
**Date:** 2026-08-07  
**Author:** Jonny Ive (UI Architecture)  
**Scope:** One connected desktop workspace (≥1280px) covering the full campaign lifecycle for a solo SMB owner. Not a screen catalog; a single persistent environment with progressive disclosure.  
**Sample tenant:** ReFunction Rehab, Pune (Dr. Priya — physiotherapy, B2C, booking-driven)

---

## 1. Workspace Information Architecture

### The single workspace model

Grow is **one room**, not a collection of pages. The owner never loses campaign context. Borrow from:
- **Meta Ads Manager:** persistent left rail for campaign hierarchy + real-time status
- **Canva:** central canvas that morphs per task + right-side property panels

But clone neither. This is a **bounded growth partner** — the workspace always answers "what should I do next?" and "how did it go?"

### Persistent shell (always visible)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ ┌──────┐                                                                        │
│ │ Logo │  Grow           [Campaign: Monsoon Knee Care ▾]    [Dr. Priya ●]       │
│ └──────┘                                                                        │
├───────────┬────────────────────────────────────────────────────────────────────┤
│           │                                                                    │
│  RAIL     │   CANVAS (morphs per phase)                                        │
│           │                                                                    │
│           │                                                                    │
│           │                                                                    │
│           │                                                                    │
│           │                                                                    │
│           │                                                                    │
│           │                                                                    │
│           │                                                                    │
│           │                                                                    │
├───────────┴────────────────────────────────────────────────────────────────────┤
│  DOCK: [Next best action chip]   [WhatsApp ●]   [Schedule queue 2]   [Help]    │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Three structural zones

| Zone | Width | Role | Persistence |
|------|-------|------|-------------|
| **Top bar** | Full width, 56px | Campaign selector, tenant identity, global actions | Always |
| **Left rail** | 240px (collapsible to 56px icons) | Phase navigation + campaign timeline | Always |
| **Canvas** | Remaining (min 800px) | Active work surface — morphs per phase | Content changes per state |
| **Bottom dock** | Full width, 48px | Next best action, WhatsApp, schedule queue, help | Always (contextual content) |

### Left rail — campaign timeline (not page links)

The rail is NOT traditional sidebar nav. It is a **vertical campaign timeline** showing phases as a stepper, with the active phase expanded.

```
RAIL (240px)
─────────────────
● Start                    ← completed checkmark
│
◉ Objective & Audience     ← active (blue dot, expanded)
│   Keywords ✓
│   Demographics ✓
│   Interests…
│
○ Creative & Copy          ← upcoming (gray)
│
○ Review & Schedule
│
○ Boost Budget
│
○ Live & Optimize

─────────────────
[+ New Campaign]
─────────────────
Recent
  Monsoon Knee Care (Live)
  Fri Slots Offer (Done)
```

**Behavior:**
- Tap any phase = canvas jumps to that state
- Completed phases show green checkmark, tappable to review/edit
- Active phase expanded to show sub-steps with completion state
- "Recent" below stepper: 2–3 past campaigns as quick-switch
- Collapse rail (chevron) → icon-only mode for maximum canvas width during editing

---

## 2. Exact Flow and State Transitions

### Campaign lifecycle states (7 canvas states)

```
S0: HOME (no active campaign)
 │
 ├── [Insight card "Use suggestion"] ────→ S1 (auto-creates campaign)
 ├── [+ New Campaign] ──────────────────→ S1
 │
S1: OBJECTIVE & AUDIENCE
 │ Sub-states: S1a Objective → S1b Keywords → S1c Demographics → S1d Location+Interests
 │
 ├── [Continue] ────────────────────────→ S2
 │
S2: CREATIVE & COPY
 │ Sub-states: S2a Generation → S2b Preview → S2c Light Editor
 │
 ├── [Approve & continue] ──────────────→ S3
 │
S3: REVIEW & COLLABORATE
 │ Sub-states: S3a Summary → S3b Share for review → S3c Approval status
 │
 ├── [Schedule] ────────────────────────→ S4
 ├── [Publish now] ─────────────────────→ S4 (immediate)
 │
S4: SCHEDULE & PUBLISH
 │ Sub-states: S4a Pick time → S4b Connect channels (if needed) → S4c Confirm
 │
 ├── [Done — boost later] ──────────────→ S6 (Live)
 ├── [Add boost] ───────────────────────→ S5
 │
S5: GUIDED BOOST BUDGET
 │ Sub-states: S5a Objective → S5b Audience → S5c Budget/Duration → S5d Confirm
 │
 ├── [Start boost] ─────────────────────→ S6
 │
S6: LIVE & OPTIMIZE
 │ Sub-states: S6a Performance → S6b Recommendations → S6c Actions
 │
 ├── [Scale boost] ─────────────────────→ S5 (pre-filled)
 ├── [Create variant] ──────────────────→ S2 (duplicate + edit)
 ├── [Complete campaign] ───────────────→ S0 with summary
```

### Transition rules

| From | To | Trigger | Animation | Reversible? |
|------|----|---------|-----------|-------------|
| S0 → S1 | Insight tap or +New | Canvas crossfade 200ms | Yes: back to S0 |
| S1a → S1b → S1c → S1d | Continue button within S1 | Horizontal slide within canvas (steps, not pages) | Yes: back button or rail tap |
| S1 → S2 | Final "Continue" from S1d | Canvas crossfade | Yes: rail tap to S1 |
| S2a → S2b | Generation complete | Fade skeleton → preview 200ms | N/A (auto) |
| S2b → S2c | "Edit" tap | Panel slides in from right (overlay, not page change) | Close panel = back to S2b |
| S2 → S3 | "Approve" | Canvas crossfade | Yes |
| S3 → S4 | "Schedule" | Canvas crossfade | Yes |
| S4 → S5 | "Add boost" | Canvas crossfade | Yes: skip with "boost later" |
| S4/S5 → S6 | Published/Boost started | Celebratory check (400ms) then canvas transition | No (forward-only) |
| S6 → S2 | "Create variant" | Canvas shows S2 with duplication context | Yes |

### Skip logic (progressive disclosure)

- **S0 → S1 via insight:** Objective auto-selected ("More bookings"), demographics pre-filled from existing customers → S1 shows pre-filled review, not blank form
- **S3 (Review) can be skipped:** Solo owner without collaborator sees "Looks good — schedule" directly from S2
- **S5 (Boost) is optional:** Always reachable later from S6 ("Promote this post")
- **WhatsApp copy available at S2b onward:** Dock shows "WA ready" — never blocks publishing flow

---

## 3. Key Component Layout for Each Main State

### S0: HOME (No active campaign)

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌─ INSIGHT CARD (max 640px, centered) ─────────────────────────────────┐  │
│  │                                                                       │  │
│  │  Suggested for you                                                    │  │
│  │                                                                       │  │
│  │  "3 Friday slots are still open this week"          (H1, 22px/600)   │  │
│  │                                                                       │  │
│  │  • Thursday has 0 bookings vs your usual 4                            │  │
│  │  • Similar Pune clinics post offers on Wednesday                      │  │
│  │  • Your last post was 9 days ago                                      │  │
│  │                                                                       │  │
│  │  ┌──────────────────────────────────┐                                 │  │
│  │  │  Start a campaign to fill slots  │  ← Primary CTA (blue fill)     │  │
│  │  └──────────────────────────────────┘                                 │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌─ RECENT CAMPAIGNS (table, max 640px) ────────────────────────────────┐  │
│  │  Campaign                    Status        Result                     │  │
│  │  Back Pain Awareness Week    Completed     12 bookings                │  │
│  │  Monsoon Joint Care          Live          4 bookings so far          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Rail state:** Collapsed to icons (no active campaign context).  
**Dock:** `[+ New campaign]  [View all campaigns]  [Help: How Grow works]`

---

### S1: OBJECTIVE & AUDIENCE (4 inline steps)

Canvas shows a **horizontal step indicator** at top, with content below. Steps flow left-to-right as cards within one scrollable canvas — not separate pages.

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Step: [● Objective] — [○ Keywords] — [○ Demographics] — [○ Targeting]    │
│                                                                            │
│  ┌─ S1a: OBJECTIVE (active) ────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  "What do you want more of?"                        (H1)             │  │
│  │                                                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐         │  │
│  │  │ 📅       │  │ 👥       │  │ 🔗           │  │ 💬       │         │  │
│  │  │Bookings  │  │Footfall  │  │Link clicks   │  │Messages  │         │  │
│  │  │(selected)│  │          │  │              │  │          │         │  │
│  │  └──────────┘  └──────────┘  └──────────────┘  └──────────┘         │  │
│  │                                                                       │  │
│  │  Pre-selected: "Bookings" (from insight context)                      │  │
│  │  Subtext: "We'll suggest keywords and audience to drive              │  │
│  │  appointments at ReFunction Rehab."                                   │  │
│  │                                                                       │  │
│  │                                         [Continue →]                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### S1b: Keywords

```
┌─ S1b: KEYWORDS ─────────────────────────────────────────────────────────────┐
│                                                                              │
│  "Search terms people use to find services like yours"         (H1)         │
│                                                                              │
│  Suggested (tap to add):                                                     │
│  ┌───────────────┐ ┌──────────────────┐ ┌─────────────────────┐            │
│  │physiotherapy  │ │knee pain pune    │ │back pain treatment  │            │
│  │near me  ✓    │ │              ✓   │ │                 +   │            │
│  └───────────────┘ └──────────────────┘ └─────────────────────┘            │
│  ┌──────────────────┐ ┌────────────────────┐ ┌───────────────────┐         │
│  │sports injury     │ │rehabilitation      │ │posture correction │         │
│  │clinic        +   │ │center pune     +   │ │              +    │         │
│  └──────────────────┘ └────────────────────┘ └───────────────────┘         │
│                                                                              │
│  Selected (3):  [physiotherapy near me ×] [knee pain pune ×] [+ Add own]    │
│                                                                              │
│  Monthly searches in Pune: ~2,400 combined                                   │
│                                                                              │
│                              [← Back]  [Continue →]                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Keyword chips:** Toggle on/off (filled = selected, outline = suggested). "Add own" opens inline text input. System shows combined local search volume — honest, not inflated.

#### S1c: Demographics

```
┌─ S1c: DEMOGRAPHICS ─────────────────────────────────────────────────────────┐
│                                                                              │
│  "Who are your ideal patients?"                                (H1)         │
│                                                                              │
│  Age range                                                                   │
│  [25] ════════●════════●═══════ [65]                                         │
│        Selected: 25–65                                                       │
│                                                                              │
│  Gender                                                                      │
│  (●) All   ( ) Women   ( ) Men                                              │
│                                                                              │
│  Language                                                                    │
│  [English ✓] [Hindi ✓] [Marathi +]                                          │
│                                                                              │
│  ┌─ Smart default ──────────────────────────────────────────────────────┐   │
│  │ 💡 Based on your existing patients: 70% are 35–55, mostly women.    │   │
│  │    [Apply this] or keep your selection above.                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│                              [← Back]  [Continue →]                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Smart default panel:** Blue-tint card (`accent-soft` bg) with data from existing booking records. One-tap apply. This is the "ops-linked" advantage — we know her patients.

#### S1d: Location + Interests

```
┌─ S1d: LOCATION & INTERESTS ─────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────────────────────────┬────────────────────────────────────┐   │
│  │  Location                        │  Interests (optional)              │   │
│  │                                  │                                    │   │
│  │  📍 ReFunction Rehab, Kothrud   │  Suggested:                        │   │
│  │                                  │  [Fitness ✓] [Health ✓]           │   │
│  │  Radius: [5 km ▾]               │  [Yoga +] [Running +]             │   │
│  │                                  │  [Sports +] [Wellness +]          │   │
│  │  ┌──────────────────────────┐   │                                    │   │
│  │  │                          │   │  Or type your own:                 │   │
│  │  │     (map with radius     │   │  [________________]                │   │
│  │  │      circle overlay)     │   │                                    │   │
│  │  │                          │   │  Estimated reach:                  │   │
│  │  │     ● ReFunction         │   │  32,000 – 48,000 people            │   │
│  │  │                          │   │  in Kothrud, Pune                  │   │
│  │  └──────────────────────────┘   │                                    │   │
│  │                                  │                                    │   │
│  │  Include: Kothrud, Karve Nagar,  │                                    │   │
│  │  Bavdhan, Warje                  │                                    │   │
│  └─────────────────────────────────┴────────────────────────────────────┘   │
│                                                                              │
│  ┌─ Summary strip ──────────────────────────────────────────────────────┐   │
│  │ Bookings · 25–65 · 5 km around Kothrud · Fitness & Health            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│                              [← Back]  [Create post →]                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Map:** Static tile with radius overlay. Radius dropdown: 3 / 5 / 10 / 25 km. Locality names listed below map for clarity.  
**Summary strip:** Persistent at bottom of S1 — accumulates selections from all sub-steps. Tapping any chip in summary returns to that sub-step.

---

### S2: CREATIVE & COPY

#### S2a: Generation (2–8 seconds)

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌─ Phone frame (centered, 375×667 scaled) ──────────────────────────┐    │
│  │  ┌────────────────────────────┐                                    │    │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Skeleton image                 │    │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │                                    │    │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │                                    │    │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │                                    │    │
│  │  ├────────────────────────────┤                                    │    │
│  │  │ ░░░░░░░ ░░░░░░░░░░░░░░░  │  ← Skeleton caption lines         │    │
│  │  │ ░░░░░░░░░░░░░░ ░░░░░░░░  │                                    │    │
│  │  └────────────────────────────┘                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  Preparing your post…                                                      │
│  Based on: Bookings · Knee pain · Kothrud area                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### S2b: Preview (the hero moment)

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌─ LEFT: Preview (55%) ─────────────┬─ RIGHT: Context (45%) ──────────┐  │
│  │                                    │                                  │  │
│  │  ┌──── IG Chrome ────────────┐    │  Why this post                   │  │
│  │  │ ● refunction_rehab        │    │                                  │  │
│  │  ├───────────────────────────┤    │  • 3 Friday slots open           │  │
│  │  │                           │    │  • Knee pain searches peak        │  │
│  │  │                           │    │    in monsoon                     │  │
│  │  │     [POST IMAGE]          │    │  • Your last post: 9 days ago    │  │
│  │  │                           │    │                                  │  │
│  │  │                           │    │  ─────────────────────────────   │  │
│  │  ├───────────────────────────┤    │                                  │  │
│  │  │ ♡ 💬 ↗                    │    │  ┌─ WhatsApp ─────────────────┐  │  │
│  │  │                           │    │  │▌ Suffering from knee pain   │  │  │
│  │  │ Monsoon got your knees    │    │  │  this monsoon? Book a free  │  │  │
│  │  │ aching? Book a free       │    │  │  assessment at ReFunction.  │  │  │
│  │  │ assessment this Friday.   │    │  │  📅 bit.ly/refunction-book │  │  │
│  │  │ Link in bio 🔗            │    │  │                             │  │  │
│  │  │                           │    │  │  [Copy message]             │  │  │
│  │  │ #physiotherapy #pune      │    │  └─────────────────────────────┘  │  │
│  │  └───────────────────────────┘    │                                  │  │
│  │                                    │  ─────────────────────────────   │  │
│  │  Channel: [IG ●] [FB ○] [LI ○]   │                                  │  │
│  │                                    │  [Looks good — continue →]       │  │
│  │                                    │  Edit · Try another angle        │  │
│  └────────────────────────────────────┴──────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key interactions:**
- Channel toggle at bottom-left of preview: switching re-renders mock chrome (IG → FB → LinkedIn) and adapts caption length/format
- "Edit" opens the light editor (S2c) as a **right panel expansion** — preview stays visible on left
- "Try another angle" regenerates (max 2 on free, unlimited on Growth)
- WhatsApp block always visible in right panel — never a separate step

#### S2c: Light Editor (Canva-inspired, not Canva-cloned)

The editor is NOT a full-page takeover. It's a **panel replacement** on the right side (where "Why this post" was). Preview stays live on left.

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌─ LEFT: Live Preview (50%) ────────┬─ RIGHT: Editor Panel (50%) ──────┐ │
│  │                                    │                                  │ │
│  │  (Same IG frame, updates live)     │  Caption                         │ │
│  │                                    │  ┌──────────────────────────────┐│ │
│  │  ┌───────────────────────────┐    │  │Monsoon got your knees aching?││ │
│  │  │                           │    │  │Book a free assessment this   ││ │
│  │  │                           │    │  │Friday at ReFunction Rehab.   ││ │
│  │  │     [POST IMAGE]          │    │  │                              ││ │
│  │  │                           │    │  │Link in bio 🔗                ││ │
│  │  │                           │    │  └──────────────────────────────┘│ │
│  │  ├───────────────────────────┤    │  134 / 2,200 · Instagram         │ │
│  │  │ caption updates live…     │    │                                  │ │
│  │  └───────────────────────────┘    │  Hashtags                        │ │
│  │                                    │  [#physiotherapy ×] [#pune ×]    │ │
│  │                                    │  [+ Add]                         │ │
│  │                                    │                                  │ │
│  │                                    │  ─────────────────────────────   │ │
│  │                                    │                                  │ │
│  │                                    │  Image                           │ │
│  │                                    │  Format: [1:1 ●] [4:5] [9:16]   │ │
│  │                                    │                                  │ │
│  │                                    │  ┌──────────────────────────────┐│ │
│  │                                    │  │  ● (focal point — drag)     ││ │
│  │                                    │  │     [thumbnail crop]         ││ │
│  │                                    │  └──────────────────────────────┘│ │
│  │                                    │  [Upload own] [Suggest images]   │ │
│  │                                    │                                  │ │
│  │                                    │  ─────────────────────────────   │ │
│  │                                    │                                  │ │
│  │                                    │  Text overlay (optional)         │ │
│  │                                    │  [ Add text to image ]           │ │
│  │                                    │                                  │ │
│  │                                    │  ─────────────────────────────   │ │
│  │                                    │                                  │ │
│  │                                    │  [Cancel]     [Save changes]     │ │
│  └────────────────────────────────────┴──────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**What this is NOT:** A full Canva. No layers panel, no element library, no freeform drag. It's:
1. Caption textarea (live-linked to preview)
2. Hashtag chips
3. Format/crop with focal point
4. Image upload or AI suggestions
5. One text overlay option (headline on image)

**What makes it feel Canva-quality:** Live preview update on every change (300ms debounce), smooth crop animation on format switch, and the text overlay positions within the image with a simple drag handle — not a full design tool.

---

### S3: REVIEW & COLLABORATE

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Campaign summary                                                          │
│                                                                            │
│  ┌─ Post preview (small, 200px wide) ─┬─ Details ────────────────────────┐│
│  │  [thumbnail]                        │  Caption: "Monsoon got your…"   ││
│  │                                     │  Channel: Instagram              ││
│  │                                     │  Hashtags: #physiotherapy #pune  ││
│  │                                     │  Audience: 25–65, Kothrud 5km   ││
│  │                                     │  Est. reach: 32k–48k            ││
│  └─────────────────────────────────────┴─────────────────────────────────┘│
│                                                                            │
│  ┌─ Collaboration (collapsible) ─────────────────────────────────────────┐│
│  │                                                                        ││
│  │  Share for review                                                      ││
│  │  Anyone with link can view and comment (no login needed)               ││
│  │                                                                        ││
│  │  [Copy share link]   or   [Send via WhatsApp]                          ││
│  │                                                                        ││
│  │  Status: Not shared yet                                                ││
│  │                                                                        ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  [← Edit post]          [Schedule this post →]   [Publish now]      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Solo owner shortcut:** If no collaborator configured in settings, this step is compressed to a confirmation strip above S4. The campaign summary is still visible, but the "Share" section is a collapsed disclosure ("Need someone to review? Share link").

---

### S4: SCHEDULE & PUBLISH

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  When should this go live?                                                 │
│                                                                            │
│  ┌─ Timing ──────────────────────────────────────────────────────────────┐│
│  │                                                                        ││
│  │  (●) Best time (Wednesday 10:30 AM — when your audience is active)    ││
│  │  ( ) Pick a date and time                                              ││
│  │      [Aug 13 ▾]  [10:30 AM ▾]                                         ││
│  │  ( ) Publish right now                                                 ││
│  │                                                                        ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  ┌─ Channel connection ──────────────────────────────────────────────────┐│
│  │                                                                        ││
│  │  Instagram   ● Connected (refunction_rehab)         [Change]           ││
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                      ││
│  │  Facebook    ○ Not connected                        [Connect]          ││
│  │                                                                        ││
│  │  ℹ️ Connect accounts to publish. You can also just                     ││
│  │     copy the post and publish manually.                                ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  [Schedule for Wed 10:30 AM →]                                      │  │
│  │                                                                     │  │
│  │  or: [Download image + copy caption]  (manual publish fallback)     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  After publishing:                                                         │
│  [ ] Add a boost to reach more people (Rs 200/day for 7 days suggested)   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- "Best time" is default and pre-selected — system picks from audience activity data
- OAuth happens inline if not connected — no separate settings page redirect
- The boost checkbox at bottom is progressive disclosure: unchecked by default, checking it adds S5 to the flow
- "Download + copy" is always available as fallback — respects owner who prefers to post manually

---

### S5: GUIDED BOOST BUDGET

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Promote this post                                                         │
│  You pay Meta directly — no markup from KaushalStack.                      │
│                                                                            │
│  ┌─ LEFT: Post thumbnail ────────────┬─ RIGHT: Boost config ────────────┐ │
│  │                                    │                                  │ │
│  │  [small preview, 240px]            │  Goal                            │ │
│  │                                    │  (●) More bookings (link clicks) │ │
│  │  "Monsoon got your knees…"         │  ( ) More profile visits         │ │
│  │                                    │  ( ) More messages (WhatsApp)    │ │
│  │                                    │                                  │ │
│  │                                    │  Audience                        │ │
│  │                                    │  ┌──────────────────────────────┐│ │
│  │                                    │  │ 📍 5 km around Kothrud      ││ │
│  │                                    │  │ 25–65 · Fitness, Health      ││ │
│  │                                    │  │ [Edit audience]              ││ │
│  │                                    │  └──────────────────────────────┘│ │
│  │                                    │  (Pre-filled from S1 targeting)  │ │
│  │                                    │                                  │ │
│  │                                    │  Budget                          │ │
│  │                                    │  Daily: [Rs 200 ▾] × [7 days ▾] │ │
│  │                                    │  Total: Rs 1,400                 │ │
│  │                                    │                                  │ │
│  │                                    │  ┌──────────────────────────────┐│ │
│  │                                    │  │ Estimated reach:             ││ │
│  │                                    │  │ 4,200 – 8,600 people        ││ │
│  │                                    │  │ Est. link clicks: 80 – 160  ││ │
│  │                                    │  └──────────────────────────────┘│ │
│  │                                    │                                  │ │
│  │                                    │  Payment: Meta Ad Account ✓      │ │
│  │                                    │  (via connected Facebook)        │ │
│  │                                    │                                  │ │
│  │                                    │  [Start boost →]                 │ │
│  │                                    │  Runs Aug 13–20 · Pause anytime  │ │
│  └────────────────────────────────────┴──────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Design decisions:**
- Audience is PRE-FILLED from S1 targeting — no re-entering. "Edit audience" expands inline for tweaks.
- Budget uses a dropdown (Rs 200 / 300 / 500 / 1000 / custom) × duration (3 / 7 / 14 / 30 days). Not a complex slider.
- Estimated reach shown as an honest range, not a point estimate. "4,200 – 8,600" not "6,400."
- "You pay Meta directly" is stated plainly above the fold — trust signal.
- No advanced ad-set controls. If owner needs more: "Manage in Meta Business Suite →" link at bottom.

---

### S6: LIVE & OPTIMIZE

```
┌─ CANVAS ──────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Monsoon Knee Care                                    Live · Day 4 of 7    │
│                                                                            │
│  ┌─ KPI Strip (4 cards, equal width) ────────────────────────────────────┐│
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  ││
│  │ │ Reach    │ │ Clicks   │ │ Bookings │ │ Spend    │                  ││
│  │ │ 12,400   │ │ 186      │ │ 4        │ │ Rs 840   │                  ││
│  │ │ ↑ 34%    │ │ ↑ 12%    │ │ ★ best   │ │ of 1,400 │                  ││
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘                  ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  Cost per booking: Rs 210                                                  │
│                                                                            │
│  ┌─ NEXT BEST ACTION (highlight card, accent-soft bg) ───────────────────┐│
│  │                                                                        ││
│  │  💡 This post is performing well. Add Rs 300/day for 3 more days      ││
│  │     to reach ~2,400 more people before your Friday slots.             ││
│  │                                                                        ││
│  │  [Extend boost — Rs 900 total]        [Not now]                        ││
│  │                                                                        ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  ┌─ Post performance (sortable list) ────────────────────────────────────┐│
│  │                                                                        ││
│  │  Post                     Reach    Clicks   Bookings   Status          ││
│  │  ─────────────────────────────────────────────────────────────         ││
│  │  Friday offer post        8,200    142      3          Boost active    ││
│  │  Knee care education      4,200    44       1          Organic         ││
│  │                                                                        ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  [Pause boost]   [Create variant]   [Complete campaign]                    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- "Bookings" is the hero metric — larger type, star badge when it's the best-performing metric
- "Next Best Action" card is the system's primary optimization lever — one recommendation at a time, maximum 3 active per campaign
- Post list sorted by bookings (the objective) not reach
- "Complete campaign" archives and generates summary → returns to S0
- If no booking tracking linked: show "Add booking link to measure results" in place of bookings metric, with setup link

---

## 4. Interaction Details and Edge Cases

### 4.1 Progressive disclosure rules

| Complexity level | What's hidden | How it appears |
|------------------|---------------|----------------|
| Keywords (S1b) | Advanced keyword research | "Add your own" input; system suggests first |
| Demographics (S1c) | Language and detailed targeting | Collapsed "More options" below age/gender |
| Editor (S2c) | Text overlay, advanced crop | "Add text to image" is a collapsed section; full Canva link hidden behind "Advanced edit →" text link |
| Review (S3) | Collaboration/approval | Collapsed unless collaborator exists in settings |
| Boost (S5) | Custom audience editing | "Edit audience" inline expand; full Ads Manager deferred to Meta |
| Optimize (S6) | Historical comparison, PDF export | "View full report" link → separate page (Pro mode) |

### 4.2 State persistence and recovery

| Scenario | Behavior |
|----------|----------|
| Browser close mid-S1 | Auto-save every field change; return shows "Continue where you left off?" toast with campaign name |
| Network drop during S2a generation | Retry automatically ×2; then show "Couldn't prepare your post. [Try again]" with last-saved S1 context preserved |
| OAuth failure at S4 | Inline error: "Couldn't connect Instagram. [Try again] or [Download post instead]" — never blocks entire flow |
| Boost rejected by Meta (S6) | Status changes to "Rejected" with reason from Meta API + plain-English fix: "Your image has too much text. Edit the image and re-submit." with [Edit post] CTA |
| Campaign completed then re-opened | Read-only S6 with "Duplicate as new campaign" CTA |

### 4.3 WhatsApp as co-equal channel

WhatsApp is never a "channel to publish to" — it's a **copy-and-send** companion that lives in the bottom dock.

| State | WhatsApp dock behavior |
|-------|------------------------|
| S0 (Home) | Hidden |
| S1 (Objective) | Hidden |
| S2b (Preview) | Visible in right panel AND dock badge shows "WA ready" |
| S2c (Editor) | Dock only (panel occupied by editor) — tap dock opens WA flyout with copy button |
| S3+ | Dock shows "WA: Copy message" — always accessible |

**Dock flyout (WA):** 320px wide panel slides up from dock. Contains: message preview + [Copy message] + "Customize for WhatsApp" link back to editor.

### 4.4 Tier gates (Growth at Rs 3,000/mo)

| Feature | Free behavior | Growth behavior |
|---------|---------------|-----------------|
| S1–S2 (Create) | Full access, 2 regenerations | Unlimited regenerations |
| S4 (Schedule) | Shows "Schedule with Growth" upgrade pill; can only publish now or download | Full scheduling |
| S5 (Boost) | Locked with explanation: "Boost available on Growth plan" | Full access |
| S6 (Optimize) | Basic reach/clicks only | Bookings + recommendations |
| Keywords (S1b) | 3 suggestions shown | All suggestions + search volume |

**Upgrade moment:** Never a blocking modal. Always an inline pill or strip: `[🟣 Schedule with Growth — Rs 3,000/mo]` styled in `tier-growth` purple. Tapping opens a slide-over with plan comparison, not a redirect.

### 4.5 Error states and empty states

| State | Treatment |
|-------|-----------|
| S0 with no insight data | Warm illustration + "What do you want more of this week?" + manual brief start |
| S1b with no keyword data | "We'll suggest keywords after your first post performs" + allow manual entry |
| S2a generation failure | Retry ×2 auto, then: "We couldn't create a post right now. [Try again] [Start from scratch]" |
| S4 with no connected channels | Inline connection flow; fallback: "Download and post manually" always works |
| S5 with no ad account | "Connect your Meta ad account to boost. You'll pay Meta directly." [Connect] — no KS billing |
| S6 with 0 data (just published) | "Results usually appear within 24 hours. We'll notify you." with illustration |

### 4.6 Keyboard and accessibility

| Screen | Focus order | Key shortcuts |
|--------|-------------|---------------|
| S1 (all) | Steps left-to-right → Continue button | Tab through chips; Enter = select; Escape = deselect |
| S2b | Preview → Why panel → WA → Primary CTA → Secondary links | `E` = open editor; `R` = regenerate |
| S2c | Caption → Hashtags → Format → Crop → Upload → Save | `Cmd+S` = save; `Escape` = cancel |
| S5 | Goal → Audience → Budget → Duration → Start | Enter on last field = submit |
| S6 | KPI strip → Action card → Post list → Actions | Arrow keys navigate post list |

### 4.7 Campaign context persistence (the "Ads Manager" borrow)

The **top bar campaign selector** is always visible during S1–S6:

```
[Campaign: Monsoon Knee Care ▾]
```

- Dropdown shows all active/draft campaigns with status badges
- Switching campaigns preserves state of current one (auto-saved) and loads the other at its last-active phase
- New campaign always starts at S1
- Badge on selector shows phase: "Draft," "Scheduled," "Live," "Boost active"

---

## 5. Visual Principles

### 5.1 Light-first, warm, professional

| Principle | Implementation |
|-----------|----------------|
| **No dark sidebar** | Left rail is `grow-canvas` (#F7F8FA) with white active-phase highlight — never #1a1a1a |
| **One accent** | `accent-primary` blue (#1D4ED8) for all primary CTAs. Purple only for tier-growth upgrade pills. |
| **Serif sparingly** | "Grow" page title only (32px display). Everything else DM Sans. |
| **Elevation = importance** | Insight card, post preview, action cards get `shadow-md`. Flat = background. No drop-shadows on every element. |
| **Max content width** | 720px for single-column content (S0, S3). Full canvas width used only for split layouts (S2, S4, S5). |

### 5.2 Typography hierarchy (desktop)

| Role | Spec | Usage |
|------|------|-------|
| Display | 32px / 400 / Serif | "Grow" title only |
| H1 | 22px / 600 / DM Sans | Insight headline, phase titles |
| H2 | 16px / 600 / DM Sans | Panel titles, card headers |
| Body | 15px / 400 / DM Sans | Descriptions, bullets, form labels |
| Body small | 13px / 400 / DM Sans | Helper text, metadata |
| Caption | 12px / 500 / DM Sans | Character counts, timestamps, badge text |
| Mono | 14px / 400 / System | WA message preview only |

### 5.3 Color system

| Token | Value | Role |
|-------|-------|------|
| `grow-canvas` | #F7F8FA | Page background |
| `grow-surface` | #FFFFFF | Cards, panels, inputs |
| `grow-surface-muted` | #F1F3F7 | Insight inner, WA block |
| `accent-primary` | #1D4ED8 | Primary buttons, active states |
| `accent-soft` | #EFF6FF | Selected chips, smart-default cards |
| `success` | #059669 | Published, connected, copied states |
| `warning` | #D97706 | Character limit, attention |
| `error` | #DC2626 | Rejection, failure |
| `tier-growth` | #7C3AED | Upgrade pill, Growth badge |
| `whatsapp` | #25D366 | WA border accent |

### 5.4 Spatial rhythm

- **Base unit:** 4px
- **Card radius:** 16px (friendlier than enterprise 8px)
- **Button radius:** 12px (primary), 999px (chips/pills)
- **Page padding:** 32px on all sides
- **Section gap:** 24px between cards
- **Rail width:** 240px (56px collapsed)
- **Min canvas:** 800px

### 5.5 Motion philosophy

| Category | Approach |
|----------|----------|
| **Page transitions** | Crossfade 200ms — no slides, no parallax |
| **Panel reveals** | SlideY 8px + opacity, 250ms, ease-out expo |
| **Generating states** | Skeleton shimmer 1.2s cycle; respect `prefers-reduced-motion` |
| **Success moments** | Single checkmark scale 400ms at completion (S4 confirm, S5 boost start). No confetti. |
| **Live preview updates** | Opacity pulse 300ms on regenerate; debounced 300ms on caption edit |
| **Crop/format change** | Transform pan 200ms ease-out |

**Rule:** Delight lives at *completion*, not at every click. Earned, not sprinkled.

### 5.6 Component consistency

| Component | Behavior across states |
|-----------|----------------------|
| **Phone preview frame** | Same component S2a→S2b→S2c→S3. Modes: skeleton / static / live-edit |
| **Chip** | Toggle (selected/unselected) for keywords, interests, demographics. 999px radius, accent-soft when active. |
| **Summary strip** | Horizontal pill row showing accumulated selections. Appears at S1 bottom, persists through S4. Tap any pill → jump to that sub-step. |
| **Action card** | accent-soft background, H2 title, body explanation, primary + secondary CTA. Used for insight (S0), smart default (S1c), next best action (S6). |
| **Tier pill** | `tier-growth` outline, small, always inline — never modal, never pulsing. |

### 5.7 Borrowed patterns (attribution)

| Pattern | Source | How we adapt |
|---------|--------|--------------|
| Campaign selector in top bar | Meta Ads Manager | Simplified: no ad-set/ad hierarchy — just campaign name + status |
| Left rail as phase stepper | Linear.app (project tracker) | Campaign-specific timeline, not generic nav |
| Split preview + editor | Canva | Fixed left preview, right controls — but no layers, no element library, no freeform canvas |
| Smart defaults with "Apply" | Mailchimp audience builder | One card with ops-linked insight, not a separate "recommendations" section |
| Estimated reach range | Meta boost | Honest range, not inflated point estimate |
| Bottom dock with contextual actions | Figma (toolbar) | WhatsApp lives here — always accessible, never blocking |

---

## Summary: What this workspace IS and ISN'T

| IS | ISN'T |
|----|-------|
| One persistent room with campaign context | A page-per-step wizard |
| Progressive — hides complexity until needed | A simple/pro mode toggle (complexity reveals naturally) |
| Preview-centric — the post is always visible | Dashboard-first with charts and tables |
| Ops-linked — bookings are the hero metric | Vanity-metric obsessed |
| Honest — "you pay Meta," range estimates, no fake ROAS | Attribution theater |
| WhatsApp co-equal — always one tap away | Social-only tool |
| Light, warm, serif-as-punctuation | Dark admin panel |
| Bounded — boost is guided, not full Ads Manager | Full Meta replacement |

---

*End of workspace architecture — ready for Figma wireframes and engineering handoff.*
