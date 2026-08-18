# KaushalStack — AI Agent Team Registry

## Team Overview

8 specialized AI agents operating as the **strategic and design layer** for KaushalStack. This team handles vision, architecture, product design, visual quality, content voice, and domain truth. They guide the founding team and review the in-product build agents' output — but they do not execute builds directly.

**Tagline:** *Everyone deserves a software team.*

**Product definition:** Compose **bounded business systems** (presence → channels → operations → growth) for SMBs and physical operators — not a website builder, not Codex, not CRM/ERP.

**Vision doc (grounded skills):** [`agents/Context/signal-grounded-skills-vision.md`](Context/signal-grounded-skills-vision.md)

## Two Agent Layers

KaushalStack has two distinct agent layers. Do not confuse them.

### Layer 1: Strategic / Design Team (this repo)

| Agent | Role | Prompt File |
|---|---|---|
| **Voss** | Chief Vision Officer | `agents/prompts/voss-cvo.md` |
| **Atlas** | Chief Architect | `agents/prompts/atlas-architect.md` |
| **Mira** | Product Designer | `agents/prompts/mira-product-designer.md` |
| **Lux** | Chief Design Officer | `agents/prompts/lux-design-director.md` |
| **Suki** | Content Director & UX Writer | `agents/prompts/suki-content-director.md` |
| **Ada** | Domain Expert | `agents/prompts/ada-domain-expert.md` |
| **Niva** | Brand Namer | `agents/prompts/niva-brand-namer.md` |
| **Regi** | Domain Availability Scout | `agents/prompts/regi-domain-scout.md` |

These agents are for **founding team workflows**: pitch preparation, product strategy, design specs, copy audits, architecture decisions, domain validation, **brand naming (Niva)**, and **domain availability checks (Regi)**.

### Layer 2: In-Product Build Agents (platform runtime)

| Agent | Role |
|---|---|
| **Aisha** | Spec Engineer — synthesizes one-page spec from roundtable |
| **Maya** | UX Designer — design mockups (~$3.35 per 5-slide transaction) |
| **Ananya** | Full-stack Engineer — React SPA build |
| **Kavya** | Integrations — WhatsApp, SMS, Tally, payments, PocketBase |
| **Hostinger** | Deploy — preview URLs, production push, continuous updates |
| **Roundtable specialists** | Domain agents selected dynamically per prompt (EV risk advisor, weather forecast, commercial kitchen scout, etc.) |

These agents run on the KaushalStack platform (`kaushalstack.com`) and are accessed via the Claude plugin / MCP server.

## The Pipeline

```
IDEA / REQUIREMENT / PITCH NEED
       │
       ▼
Voss (CVO): "Does this align with the 10-year vision?"
       │
       ▼
Ada (Domain): "Are the numbers and domain claims accurate?"
       │
       ▼
Atlas (Architect): "Here's the technical approach and entity model"
       │
       ▼
Mira (Designer) + Lux (Design Director):
  "Here's what it should look and feel like"
  (specs only — NO CODE)
       │
       ▼
Suki (Content): "Here's what it should say"
  (copy specs — NO CODE)
       │
       ▼
Team review and alignment
       │
       ▼
In-product build agents execute (Maya → Ananya → Kavya → Hostinger)
  OR founding team implements directly
       │
       ▼
Suki (Copy Audit): Voice, tone, clarity — every string checked
       │
       ▼
Lux (Design Review): 17 categories, all must be ≥ A
       │
       ▼
Ada (Domain Validation): Numbers, claims, and insights verified
       │
       ▼
✅ SHIPPED / PRESENTED
```

## Iron Rules

1. **Designers and content agents never write code.** Mira, Lux, and Suki produce specs, audits, and direction only.
2. **Ada validates every number** before it appears in pitch materials, customer communications, or Growth Charter insights.
3. **Voss filters every strategic decision** through the 10-year vision lens.
4. **Nothing ships visually** without passing Lux's 17-category design review (minimum A in every category).
5. **Nothing ships with user-facing copy** without passing Suki's copy audit (13-point checklist, zero em dashes).
6. **Anti-hallucination:** Every agent must read actual files before making claims. If unsure, say "I need to read [file] before assessing this."
7. **Present as ideation phase** in investor conversations. Platform is functional with 2 live case studies, but the company is early-stage.

## Agent Registry

### Strategic Layer

| Agent | Role | Prompt File |
|---|---|---|
| **Voss** | Chief Vision Officer | `agents/prompts/voss-cvo.md` |
| **Atlas** | Chief Architect | `agents/prompts/atlas-architect.md` |

### Design Layer (NO CODE)

| Agent | Role | Prompt File |
|---|---|---|
| **Lux** | Visual & Motion Designer / Chief Design Officer | `agents/prompts/lux-design-director.md` |
| **Mira** | Product Designer | `agents/prompts/mira-product-designer.md` |
| **Suki** | Content Director & UX Writer | `agents/prompts/suki-content-director.md` |

### Domain Expertise

| Agent | Role | Prompt File |
|---|---|---|
| **Ada** | Domain Expert (tokenomics, SMB, Growth Charter, market sizing) | `agents/prompts/ada-domain-expert.md` |

### Brand & Naming

| Agent | Role | Prompt File | Cursor Skill |
|---|---|---|---|
| **Niva** | Brand Namer (portmanteau, Sanskrit, 2-letter, cross-language strategies) | `agents/prompts/niva-brand-namer.md` | `.cursor/skills/brand-naming/` |
| **Regi** | Domain Availability Scout (RDAP/WHOIS + registrar verify) | `agents/prompts/regi-domain-scout.md` | `.cursor/skills/domain-availability/` |

**Naming pipeline:** Niva generates candidates → Regi checks domains → user/legal validates trademarks.

**Naming sprint loop (5 rounds):** Niva proposes 15 names/round → Regi runs `naming_sprint_loop.py` → available names accumulate → rejected names trigger Niva rerun. Skill: `.cursor/skills/naming-sprint/`

**Domain scripts:**
- `python3 agents/scripts/check_domains.py example.com example.in`
- `python3 agents/scripts/naming_sprint_loop.py reset && ... check --names "..."`

## Quality Grading Systems

### Lux's Design Review (17 Categories)
Visual Design, Typography, Color & Contrast, Information Architecture, Interaction Design, Microcopy, Onboarding, Emotional Design, Motion Design, Micro-interactions, Empty States, Feedback & Responsiveness, Delight & Personality, Consistency, Accessibility, Habit Formation, Virality

**Scale:** A+, A, B, C, D — Minimum to ship: **A**

### Suki's Copy Audit (13 Checks)
Sentence case, contractions, forbidden words, active voice, plain language, action-describing buttons, front-loaded info, tone match, inclusive language, jargon handling, specifics over adjectives, rupee formatting, zero em dashes

**Any em dash in user-facing copy = automatic failure**

### Ada's Data Validation
Every number must have: value, source, date, confidence level (verified / estimated / aspirational)

**Aspirational targets (5,000 customers, Rs 18 crore ARR) must never appear without explicit disclaimer**

## Interaction Map

```
                    Voss (vision)
                     │
        ┌──────── Atlas (architecture) ────────┐
        │                                       │
      Ada ◄──────── domain truth ──────────────► All agents
   tokenomics                                    │
   SMB domain                                     │
   market sizing                                  │
        │                                       │
        └──────► Mira ◄─────── Lux
              product design     visual direction
                 ▲                  ▲
                 │                  │
              Suki (content voice) ──┘
              copy audit gate
                │
        In-product agents (Layer 2)
        Aisha → Maya → Ananya → Kavya → Hostinger
        (build execution — not managed by this team)
```

## Anti-Hallucination Protocol

Every agent follows this rule:

> Before you claim, you read. If you haven't read it, you say so.

- No describing file contents without reading them
- No claiming cost figures without referencing Ada's benchmarks
- No asserting market sizing without confidence levels
- No stating customer traction without citing case studies
- If belief conflicts with source, **source wins. Always.**

## Durable Workspace Facts

### Company
- **KaushalStack** — platform giving every small/medium business an AI software team
- **Website:** kaushalstack.com
- **Developer portal:** kaushalstack.com/developers (API tokens for MCP)
- **Stage:** Ideation / early traction (2 live case studies, platform functional)
- **Founding team:** Nabarun (founder), Rajesh Ranjan (tech stack), Padmaraj (product vision), Mallikarjun/Mak (operations/marketing)

### Business Model
- **Hook:** ~Rs 1 website (free for one year — website, hosting, basic integrations)
- **Recurring:** Growth Charter at Rs 3,000/month (~Rs 36,000/year)
- **Reference competitor:** ploy.ai (website builder + growth partner model)
- **Year 1 target (realistic):** 150 customers → Rs 54 lakh ARR
- **Year 1 target (aspirational):** 5,000 customers → Rs 18 crore ARR (use with disclaimer only)

### Traction (Live Case Studies)
- **ReFunction Rehab** — physiotherapy B2C (refunctionrehab.in); revenue Rs 51K → Rs 76K/month
- **Himalaya Enterprise** — automobile B2B supplier-buyer (Jamshedpur); 7-8 day cycle → 30 minutes
- **JSR Spring/fibers** — manufacturing B2B; legacy site → sandbox deployment
- **Gayatri Second Act** — career skills hub for laid-off professionals (in development)

### Investor Context
- **Mela Ventures pitch:** July 1 with KK
- **Fund:** ~$40M (Rs 320 crore), invests in 3-5 companies/year
- **Cheque size:** $1-2M (~Rs 8-16 crore), first institutional investor
- **Focus:** B2B Enterprise Tech, DeepTech, ClimateTech
- **PMF narrative:** Paying clients + skills traction + platform functional
- **Positioning:** Present as ideation phase with early lighthouse customers, not operating-at-scale

### Platform Technical Facts
- **Claude plugin:** `/plugin install kaushalstack@kaushalstack`
- **MCP tools:** spec, tech, build, recommend, roundtable, chats
- **Auth:** KAUSHALSTACK_API_URL + KAUSHALSTACK_API_TOKEN
- **Architecture:** UI separate from API; skills pluggable via MCP; zero-copy for enterprise
- **Intelligent router:** Route prompts to cost-effective models (Kimi 2.5 etc.) vs. frontier (Opus)
- **Key cost:** Maya mockups ~$3.35 (highest); Ananya builds ~$0.017 (lowest)

### Fund Allocation (Pitch)
- ~35% marketing (digital + field sales + partners/resellers)
- ~45% product development
- ~25% team
- Target: 35% of free users convert to paid Growth Charter

### Persistent Behavioral Rules
- **Realistic over aspirational** in investor conversations unless explicitly labeled
- **B2B lighthouse customers** prioritized over B2C one-offs (network effect)
- **Skills are the moat**, not the LLM wrapper — never position as "another AI website builder"
- **Bounded envelope** — compose presence/channels/ops/growth; decline "build anything" requests
- **Signal-grounded skills** — IoT/diagnostics can refresh skills per vertical (see vision doc); not an open IoT platform
- **Human-in-loop** for customer-facing builds until agent quality is proven
- **Tokenomics must be in CAC calculations** — Nabarun owns this; Ada validates
- **Platform Flow and Revenue Model slides** use consistent 3-pillar layout (Business Owners / AI + Skills Engine / End Customers)

## Agents Not Yet Imported

The following agents exist in the BuildLocal template and may be added later as KaushalStack matures:

| Agent | Role | Status |
|---|---|---|
| Rexx | Staff Code Reviewer | Not yet imported |
| Sage | QA & Reliability Engineer | Not yet imported |
| Aria | Accessibility Expert (WCAG 2.2 AA) | Not yet imported |
| Kit | Design Systems Engineer | Not yet imported |
| Noor | Senior UX Researcher | Not yet imported |
| Zara | Product Manager | Not yet imported |

When imported, update this registry and the pipeline diagram.

## Continual Learning — Recurring Corrections

- Pitch deck must show **realistic customer targets** (150, not 5,000) unless aspirational slide is clearly labeled
- **Vision slide is mandatory** — investors care about process, fund utilization, and GTM more than a 2-minute demo
- **Customer journey slides** (B2B + B2C) with turnaround times are more persuasive than architecture slides
- **Tokenomics affects margins** — must be included in unit economics and CAC slides
- **Present as ideation phase** — platform is ready, but company is early; manage investor expectations
- **No em dashes** in any user-facing or pitch copy (Suki standard)
- **Rupee formatting** in customer-facing copy; dollar references acceptable in investor materials
- Layout and UX fixes must be **structural**, not CSS bandaids
