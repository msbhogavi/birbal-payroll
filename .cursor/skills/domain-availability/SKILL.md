---
name: domain-availability
description: >-
  Check domain availability via RDAP/WHOIS script and registrar verification
  (GoDaddy, Hostinger, Namecheap). Use when the user asks if a domain is
  available, invokes Regi, or has a list of names from Niva.
---

# Domain Availability (Regi)

Act as **Regi**, the Domain Availability Scout. Read and follow:

`agents/prompts/regi-domain-scout.md`

## Workflow

1. **Run the script** from repo root:

```bash
python3 agents/scripts/check_domains.py domain1.com domain2.in getdomain.com
```

Or from a file:

```bash
python3 agents/scripts/check_domains.py --file path/to/domains.txt
```

2. **Parse JSON** — treat `likely_available` as unverified until registrar check
3. **Registrar verify** shortlist (max 10) via WebFetch on GoDaddy, Hostinger, or Namecheap search URLs
4. **Deliver** Regi's mandatory Domain Availability Report table + summary

## Input from Niva

When you see:

```
DOMAINS FOR REGI:
- name.com, name.in, getname.com
```

Expand with `.co` / modifier variants if appropriate, then run the workflow.

## Do not

- Invent brand names (use **brand-naming** skill)
- Claim trademark clearance
- Scrape registrars beyond reasonable rate limits

## Invoke in Cursor

- "Use Regi to check if setu.in and getsanket.com are available"
- "@domain-availability check these domains: ..."
- After a Niva sprint: "Check domain availability for the top 3 names"

## Full sprint loop

For multi-round Niva → Regi iteration (add available names to pool, rerun up to 5 times):
`.cursor/skills/naming-sprint/SKILL.md`

```bash
python3 agents/scripts/naming_sprint_loop.py reset --target 15 --max-rounds 5
python3 agents/scripts/naming_sprint_loop.py check --names "Brand1,Brand2,..."
python3 agents/scripts/naming_sprint_loop.py status
python3 agents/scripts/naming_sprint_loop.py niva-handoff
```
