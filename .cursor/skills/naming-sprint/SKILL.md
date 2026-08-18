---
name: naming-sprint
description: >-
  Run the Niva + Regi iterative naming sprint: generate names across strategies,
  check domain availability, add available names to a pool, rerun up to 5 rounds
  until enough unique available names are collected. Use when the user wants
  a full naming sprint with domain filtering loop.
---

# Naming Sprint Loop (Niva + Regi)

Orchestrate **Niva** (name generation) and **Regi** (domain scouting) in a loop until the available-name pool is full or 5 rounds complete.

Read:
- `agents/prompts/niva-brand-namer.md`
- `agents/prompts/regi-domain-scout.md`

## Loop (max 5 rounds)

```
┌─────────────────────────────────────────────────────────┐
│  Round N (N = 1 … 5)                                    │
│                                                         │
│  1. NIVA → Generate 15 NEW brand names (mixed lanes)    │
│  2. REGI → Run naming_sprint_loop.py check              │
│  3. Available domain? → Add to pool                     │
│     All taken?          → Add brand to rejected list    │
│  4. Pool ≥ target OR N = 5? → STOP                      │
│     Else → Niva-handoff → go to Round N+1               │
└─────────────────────────────────────────────────────────┘
```

## Commands (run from repo root)

**Start fresh:**
```bash
python3 agents/scripts/naming_sprint_loop.py reset --target 15 --max-rounds 5
```

**After Niva generates names for a round:**
```bash
python3 agents/scripts/naming_sprint_loop.py check --names "Brand1,Brand2,Brand3,..."
```

Or with strategy tags in a file:
```bash
# agents/tmp/round1-names.txt
Lednal | portmanteau
Spandan | sanskrit
Kova | two-letter

python3 agents/scripts/naming_sprint_loop.py check --file agents/tmp/round1-names.txt
```

**Check progress:**
```bash
python3 agents/scripts/naming_sprint_loop.py status
```

**Get Niva rerun prompt:**
```bash
python3 agents/scripts/naming_sprint_loop.py niva-handoff
```

## Agent responsibilities per round

### Niva (each round)

1. Read `Context/Naming/Brand_and_Naming_Strategy.md`
2. Generate **15 new names** — rotate strategies each round:
   - Round 1: portmanteau + Sanskrit
   - Round 2: two-letter + truncation
   - Round 3: cross-language + repurposed word
   - Round 4: modifier-friendly + portmanteau
   - Round 5: wild card / blend of best lanes
3. **Never reuse** brands in `rejected_brands` or `available_pool` (read from `status` or last check output)
4. Output comma-separated list for the check command

### Regi (each round)

1. Run `naming_sprint_loop.py check` with Niva's batch
2. Parse JSON: `added_this_round`, `rejected_this_round`, `should_continue`
3. For `likely_available` domains on shortlist, optionally verify on GoDaddy/Hostinger
4. Append confirmed available names to the **Available Names Master List**
5. If `should_continue` is true → print `niva_handoff` and start next round as Niva

## Acceptance rule

A brand **enters the pool** if at least one of these is available:
- `[brand].com`
- `[brand].in`
- `get[brand].com`
- `[brand].co`
- `use[brand].com` (only for ≤3 letter brands)

All checked variants taken → brand goes to `rejected_brands` → Niva must invent replacements next round.

## Final deliverable

After loop ends, produce:

### Available Names Master List

| Brand | Strategy | Available Domain(s) | Round | Registrar Verified? |
|-------|----------|---------------------|-------|---------------------|

### Sprint summary

- Rounds completed
- Names checked vs names in pool
- Top 5 recommendations for human review (radio test + SMB friendliness — Niva ranks)
- Names rejected for domain only vs rejected for quality

## Defaults

| Setting | Default |
|---------|---------|
| Max rounds | 5 |
| Names per round | 15 |
| Target pool size | 15 |

User can override: `--target 20 --max-rounds 5`

## Invoke in Cursor

- "Run a full Niva + Regi naming sprint loop — 5 rounds, collect all names with available domains"
- "Start naming sprint: reset, round 1, keep looping until we have 15 available names"
- "@naming-sprint run the domain availability loop"

## Do not

- Skip the script and guess availability
- Reuse rejected brand names in later rounds
- Stop early without telling the user pool size vs target
