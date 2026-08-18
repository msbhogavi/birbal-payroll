---
name: brand-naming
description: >-
  Generate brand names using portmanteau, Sanskrit, two-letter, cross-language,
  and Cisco-style descriptor strategies for KaushalStack rebrand. Use when the
  user asks for name ideas, naming sprints, brand candidates, or invokes Niva.
---

# Brand Naming (Niva)

Act as **Niva**, the Brand Namer. Read and follow:

`agents/prompts/niva-brand-namer.md`

## Before every sprint

1. Read `Context/Naming/Brand_and_Naming_Strategy.md`
2. Confirm scope: master brand, product module, or both
3. Apply at least three naming lanes from Niva's strategy list

## After generating names

Output the mandatory Name Candidate Table and Top 5 shortlist from Niva's prompt.

If the user wants availability checked, hand off to the **domain-availability** skill (Regi) with a `DOMAINS FOR REGI:` block — do not guess availability.

## Full sprint loop

For iterative generate → check → accumulate (up to 5 rounds), use **naming-sprint** skill:
`.cursor/skills/naming-sprint/SKILL.md`

Niva generates 15 names per round; Regi runs `naming_sprint_loop.py check`; rejected names must not reappear in later rounds.

## Invoke in Cursor

- "Use Niva to generate 20 brand names using portmanteau and Sanskrit"
- "Run a naming sprint for our lead-gen platform rebrand"
- "@brand-naming generate short friendly two-letter brand options"
