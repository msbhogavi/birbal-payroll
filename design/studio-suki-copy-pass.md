# Suki Copy Pass — Grow module (G0 · Q2 · Q4 · Q5)

**Reviewer:** Suki (Content Director)  
**Date:** 2026-08-07  
**Inputs:** `design/studio-mira-flow-specs.md` v1.0, `design/studio-lux-visual-pass.md` v1.0  
**Scope:** Insight headline templates, full UI string spec for Quick post flow, violations audit of legacy hi-fi mock  
**Status:** Ready for implementation in hi-fi mock and engineering string tables

---

## 1. Copy audit: legacy hi-fi mock (violations)

| Location | Current copy | Issue | Rewrite |
|----------|--------------|-------|---------|
| Page title | KaushalStack Studio | Wrong product name; agent/tool framing | KaushalStack Grow |
| Nav subtitle | Studio | Exposes internal module name | Grow |
| Overview H2 | Campaigns that look ready to publish | Martech factory tone | Grow |
| Overview body | From one brief to Instagram… edited in Studio | Multi-channel overwhelm; "Studio" | Posts that match what's happening in your business. |
| Brief label | Brief for Tara | Agent name forbidden | What are you promoting? |
| Brief CTA | Generate draft set with Tara | Agent + jargon | See preview |
| Brief body | Tara drafts platform-native posts | Agent exposure | We'll draft a post you can preview before connecting any account. |
| Insight tag | Growth insight | Dashboard jargon | Suggested for you |
| Drafts | Open in Studio | Wrong product frame | Edit post |
| Editor title | Card Studio | Canva clone signal | Edit post |
| Schedule preview | Preview — as it will appear | Em dash adjacent phrasing OK; label vague | As it will look on Instagram |
| Campaigns CTA | New campaign | "Campaign" overused | New post |

### Copy that was working (keep spirit, fix labels)

- Warm, specific offer copy for ReFunction ("Monsoon knee-care: 20% off assessments")
- Brand kit explanation without KaushalStack watermark
- WhatsApp as "copy to broadcast" (honest v1 scope)

---

## 2. Voice for Grow module

| Moment | Tone | Example |
|--------|------|---------|
| G0 insight | Specific, staff-member helpful | "3 Friday slots are still open" |
| Q2 preview | Confident, yours-not-ours | "Suggested post" (not "AI generated") |
| Q2 why panel | Plain reason, no analytics cosplay | "Why this post" |
| Q4 edit | Practical, low ceremony | "Save changes" |
| Q5 publish | Action + outcome | "Schedule for Instagram" |
| Errors | What happened + what to do | See §7 |
| Empty G0 | Forward-moving | See §4.2 |

**Reading level:** 6th–8th grade for all owner-facing Grow copy.  
**Currency:** Rs when pricing appears; Grow tier references "Growth" at Rs 3,000/month (confirm with Ada before production).

---

## 3. Insight headline templates

Lux rule: headline includes a **number or day name** when data exists.  
Structure: **[Observation headline]** + **2 bullets max** + **CTA: Preview suggested post**

### 3.1 Template matrix (by signal type)

| Signal ID | Persona | Headline template | Bullet 1 | Bullet 2 |
|-----------|---------|-------------------|----------|----------|
| `SLOT_GAP` | Service (ReFunction) | `{n} {day} slots are still open` | `{compare_day} has {actual} bookings vs your usual {usual}` | `Clinics like yours often post mid-week offers` |
| `FOOTFALL_DROP` | Retail / kirana | `{n} fewer walk-ins than last {period}` | `{competitor_or_area} shops posted {offer_type} this week` | `A short post with your hours and offer can bring people in` |
| `REVIEW_GAP` | Local D2C | `You're {n} reviews behind {benchmark} nearby` | `Shops with {n}+ Google reviews get more map clicks` | `A post asking happy customers to review takes 2 minutes to share` |
| `EVENT_SOON` | Event / Mela | `{event_name} is in {n} days` | `{tickets_or_rsvp} sign-ups so far` | `Event pages that post {n} times before the date fill faster` |
| `WORKSHOP` | Coach (Rachana) | `{n} seats open for {workshop_name}` | `Starts {date} · {location_or_online}` | `LinkedIn and WhatsApp work well for workshop invites` |
| `SEASONAL` | Any | `{season} is a strong month for {category}` | `Last {season} you ran `{offer_name}`` | `We can adapt that message for this year` |
| `WHATSAPP_HEAVY` | WA-first SMB | `Most of your bookings come from WhatsApp` | `You haven't shared an offer there in {n} days` | `We'll prepare a message you can paste to your list` |
| `GENERIC` | No data yet | `What do you want more of this week?` | `Bookings, footfall, and event sign-ups all start with one post` | `Tell us what you're promoting and we'll show a preview` |

**Variables:** `{n}` always numeral. `{day}` = Monday–Sunday. `{period}` = week / month. Keep bullets ≤12 words each (Lux).

### 3.2 Worked examples (ReFunction demo tenant)

**G0 default (SLOT_GAP):**

- Label: `Suggested for you`
- Headline: `3 Friday slots are still open`
- Bullet: `Thursday has 0 bookings vs your usual 4`
- Bullet: `Similar clinics post offers on Wednesday`
- CTA: `Preview suggested post`

**G0 empty (GENERIC):**

- Headline: `What do you want more of this week?`
- Bullet: `Bookings, footfall, and event sign-ups all start with one post`
- CTA: `Start a new post`

**G0 EVENT_SOON (Mela-style):**

- Headline: `Heritage Mela is in 12 days`
- Bullet: `48 sign-ups so far on your landing page`
- Bullet: `Three posts before the event usually boost last-week tickets`
- CTA: `Preview suggested post`

**G0 REVIEW_GAP (kirana):**

- Headline: `You're 23 reviews behind top shops nearby`
- Bullet: `Sari stores with 50+ reviews show up first on Google Maps`
- Bullet: `A post with a happy customer photo helps ask for reviews gently`
- CTA: `Preview suggested post`

### 3.3 "Why this post" panel (Q2) templates

Mirror G0 insight in shorter form. Title always: **Why this post**

| Signal | Bullet templates |
|--------|------------------|
| SLOT_GAP | `Friday 1–4pm is usually quiet for you` · `This post mentions same-week booking` · `Offer ends Sunday to create urgency` |
| REVIEW_GAP | `Local search favors active pages` · `Post includes your Google review link` · `Warm tone, not a hard sell` |
| EVENT_SOON | `12 days left gives people time to plan` · `Copy matches your event landing page` · `Instagram reaches people who don't check email` |

---

## 4. Full UI string spec

### 4.1 [G0] Grow Home

| Element | Copy |
|---------|------|
| Page title (display) | Grow |
| Subline | Posts that match what's happening in your business. |
| Growth report link | Growth report |
| Insight label | Suggested for you |
| Primary CTA | Preview suggested post |
| Quick action 1 | New post |
| Quick action 2 | Promote event |
| Quick action 3 | View campaigns |
| Last post footer | Last post: Instagram · 5 days ago · View |
| Loading | Finding a suggestion for you… |
| Growth tier pill (on card) | Schedule with Growth |

### 4.2 [G0] Empty state

| Element | Copy |
|---------|------|
| Headline | What do you want more of this week? |
| Body | Tell us what you're promoting. We'll show a preview before you connect Facebook or Instagram. |
| CTA | Start a new post |

### 4.3 [Q1] Brief (reference, not in hi-fi v2)

| Element | Copy |
|---------|------|
| Page title | New post |
| Field label | What are you promoting? |
| Placeholder | Example: 20% off monsoon physio assessments in August |
| Goal chips | More bookings · More footfall · Announce offer · Other |
| Channel | Instagram · Facebook · WhatsApp message only |
| Tone chips | Warm · Professional · Urgent |
| Primary CTA | See preview |
| Secondary | Cancel |

### 4.4 [Q2] Preview

| Element | Copy |
|---------|------|
| Page title | Suggested post |
| Channel badge | Instagram |
| Why panel title | Why this post |
| Why bullets | (from §3.3 templates) |
| WA section title | WhatsApp message |
| WA helper | Paste this to your customer list or broadcast group |
| WA CTA default | Copy message |
| WA CTA success | Copied |
| Primary CTA | Looks good, publish |
| Secondary 1 | Edit caption or crop |
| Secondary 2 | Try another angle |
| Regenerate hint (free) | 2 tries left |
| Generating | Preparing your post… |
| Generating slow | Usually ready in under a minute |
| Error | We couldn't finish this post. Try again or copy the text below. |
| Error retry | Try again |

**Sample caption (ReFunction):**  
`Monsoon knee-care: 20% off physio assessments in August. Book via link in bio or WhatsApp us at +91 98765 43210.`

**Sample WA message:**  
`Hi! ReFunction Rehab has 20% off physio assessments this August. Rainy season knee stiffness? Book a slot: [link] Reply STOP to opt out.`

### 4.5 [Q4] Light edit

| Element | Copy |
|---------|------|
| Page title | Edit post |
| Caption label | Caption |
| Char hint | `{count} / 2200 · Instagram` |
| Format label | Format |
| Format chips | 1:1 · 4:5 · 9:16 |
| Image label | Image |
| Upload | Upload photo |
| Library | Choose from library |
| Suggest (Growth) | Suggest 3 photos |
| Focal hint | Drag the dot to keep faces and your logo in frame |
| Advanced link | Advanced edit |
| Primary CTA | Save changes |
| Secondary | Cancel |

### 4.6 [Q5] Publish

| Element | Copy |
|---------|------|
| Page title | Publish |
| Subline | Choose when this goes live on Instagram |
| Publish now | Publish now |
| Schedule | Schedule |
| Schedule growth lock | Schedule with Growth |
| WA only | Copy WhatsApp message only |
| Connect banner | Connect Instagram to publish. WhatsApp copy still works. |
| Connect CTA | Connect Instagram |
| Repeat toggle | Repeat every week |
| Date label | Date |
| Time label | Time |
| Validation past | Pick a date and time in the future |
| Free quota modal title | You've used your free publish for this month |
| Free quota body | You can still copy your WhatsApp message or download the image. Growth is Rs 3,000/month for scheduling and unlimited posts. |
| Free quota primary | Copy WhatsApp message |
| Free quota secondary | See Growth plans |

### 4.7 [Q6] Confirmation

| Element | Copy |
|---------|------|
| Success scheduled | Scheduled for Fri 9 Aug, 10:00 AM on Instagram |
| Success published | Published on Instagram |
| Success WA | Message copied. Paste it in WhatsApp when you're ready. |
| View campaign | View post |
| Create another | Create another post |

### 4.8 Navigation (Owner Portal)

| Nav item | Copy |
|----------|------|
| Grow (active) | Grow |
| Site | Site |
| Operations | Operations |
| Settings | Settings |

---

## 5. CTA hierarchy (one primary per screen)

| Screen | Primary | Secondary |
|--------|---------|-----------|
| G0 | Preview suggested post | New post, Promote event, View campaigns |
| Q2 | Looks good, publish | Edit caption or crop · Try another angle |
| Q4 | Save changes | Cancel · Advanced edit (text link) |
| Q5 | Publish now or Schedule | Copy WhatsApp message only |

Note: Primary on Q2 uses comma not em dash: "Looks good, publish" reads as two beats; alternative approved: **Publish this post**.

**Lux/Suki aligned primary for Q2:** `Publish this post` (clearer outcome). Use in hi-fi mock.

---

## 6. Tier and upgrade copy

| Context | Copy |
|---------|------|
| Schedule locked | Schedule with Growth |
| Tooltip | Scheduling and repeat posts are part of Growth at Rs 3,000/month. Cancel anytime after your trial. |
| Suggest 3 photos lock | Growth feature |
| Insight depth (future) | Full competitor reports in Growth report |

---

## 7. Error messages

| Scenario | Copy |
|----------|------|
| OAuth denied | We couldn't connect Instagram. Check that you selected a Facebook Page with a linked business account, then try again. |
| No IG business | This Facebook Page doesn't have an Instagram business account linked. Link one in Meta Business Settings, then try again. |
| Publish failed | Instagram didn't accept this post. Your draft is saved. Try again or edit the caption. |
| Upload too large | This photo is over 10 MB. Use a smaller file or take a new photo on your phone. |
| Generation failed | We couldn't finish this post. Try again or copy the text below. |
| Network | You're offline. Check your connection and try again. |

---

## 8. Em dash audit

All strings in §4–§7 verified: **zero em dashes.**  
Hi-fi mock must not introduce em dashes in user-visible text.

---

## 9. Implementation checklist

- [x] Insight templates by signal type
- [x] Full string table G0, Q2, Q4, Q5, Q6
- [x] Legacy mock violation audit
- [ ] Ada: confirm Rs 3,000/month Growth price in Q5 modal
- [ ] Apply strings to `design/studio-hifi-mock.html` (step 2)
- [ ] Lux microcopy grade re-run after hi-fi refresh

---

*Suki copy pass v1.0*
