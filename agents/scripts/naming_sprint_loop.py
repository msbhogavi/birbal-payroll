#!/usr/bin/env python3
"""Niva + Regi iterative naming sprint — domain-check loop with state.

Niva proposes brand names → this script expands domains and checks availability
→ available names accumulate in state → rejected names feed back to Niva for
the next round (up to 5 rounds by default).

Usage:
  python3 agents/scripts/naming_sprint_loop.py reset
  python3 agents/scripts/naming_sprint_loop.py status
  python3 agents/scripts/naming_sprint_loop.py check --names "Name1,Name2,Name3"
  python3 agents/scripts/naming_sprint_loop.py check --file agents/tmp/round1-names.txt
  python3 agents/scripts/naming_sprint_loop.py niva-handoff

Options:
  --round N           Set round number (auto-increments if omitted)
  --max-rounds N      Default 5
  --target N          Stop suggesting reruns once pool has N names (default 15)
  --per-round N       Expected names per round for handoff text (default 15)
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
STATE_PATH = REPO_ROOT / "agents" / "tmp" / "naming-sprint-state.json"
CHECK_SCRIPT = REPO_ROOT / "agents" / "scripts" / "check_domains.py"

AVAILABLE_STATUSES = frozenset({"likely_available"})
TAKEN_STATUSES = frozenset({"taken"})


def default_state() -> dict:
    return {
        "started_at": None,
        "max_rounds": 5,
        "current_round": 0,
        "target_count": 15,
        "per_round": 15,
        "available_pool": [],
        "rejected_brands": [],
        "round_history": [],
    }


def load_state() -> dict:
    if not STATE_PATH.exists():
        return default_state()
    with STATE_PATH.open(encoding="utf-8") as handle:
        data = json.load(handle)
    base = default_state()
    base.update(data)
    return base


def save_state(state: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with STATE_PATH.open("w", encoding="utf-8") as handle:
        json.dump(state, handle, indent=2)
        handle.write("\n")


def slugify_brand(name: str) -> str | None:
    raw = name.strip().lower()
    raw = re.sub(r"[^a-z0-9]+", "", raw)
    if not raw or len(raw) < 2:
        return None
    return raw


def expand_domains(brand: str) -> list[str]:
    slug = slugify_brand(brand)
    if not slug:
        return []
    domains = [
        f"{slug}.com",
        f"{slug}.in",
        f"get{slug}.com",
        f"{slug}.co",
    ]
    if len(slug) <= 3:
        domains.append(f"use{slug}.com")
    return domains


def run_domain_checks(domains: list[str]) -> list[dict[str, str]]:
    if not domains:
        return []
    proc = subprocess.run(
        [sys.executable, str(CHECK_SCRIPT), *domains],
        capture_output=True,
        text=True,
        check=False,
        cwd=str(REPO_ROOT),
    )
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr or "check_domains.py failed\n")
        raise SystemExit(proc.returncode)
    return json.loads(proc.stdout)


def load_names_from_file(path: str) -> list[str]:
    names: list[str] = []
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "|" in line:
                line = line.split("|", 1)[0].strip()
            for part in re.split(r"[\s,]+", line):
                part = part.strip()
                if part:
                    names.append(part)
    return names


def brand_already_processed(state: dict, brand: str) -> bool:
    key = brand.strip().lower()
    for entry in state["available_pool"]:
        if entry["brand"].strip().lower() == key:
            return True
    for rejected in state["rejected_brands"]:
        if rejected.strip().lower() == key:
            return True
    return False


def process_names(
    state: dict,
    names: list[str],
    strategies: dict[str, str] | None = None,
) -> dict:
    strategies = strategies or {}
    added: list[dict] = []
    rejected: list[str] = []
    skipped: list[str] = []

    for brand in names:
        brand = brand.strip()
        if not brand:
            continue
        if brand_already_processed(state, brand):
            skipped.append(brand)
            continue

        domains = expand_domains(brand)
        if not domains:
            skipped.append(brand)
            continue

        results = run_domain_checks(domains)
        available_domains = [
            r["domain"] for r in results if r.get("status") in AVAILABLE_STATUSES
        ]
        taken_domains = [
            r["domain"] for r in results if r.get("status") in TAKEN_STATUSES
        ]

        if available_domains:
            entry = {
                "brand": brand,
                "strategy": strategies.get(brand, ""),
                "available_domains": available_domains,
                "taken_domains": taken_domains,
                "round_added": state["current_round"],
            }
            state["available_pool"].append(entry)
            added.append(entry)
        else:
            state["rejected_brands"].append(brand)
            rejected.append(brand)

    round_summary = {
        "round": state["current_round"],
        "checked": len(names) - len(skipped),
        "added": len(added),
        "rejected": len(rejected),
        "skipped": len(skipped),
    }
    state["round_history"].append(round_summary)
    return {
        "added": added,
        "rejected": rejected,
        "skipped": skipped,
        "round_summary": round_summary,
    }


def should_continue(state: dict) -> bool:
    if state["current_round"] >= state["max_rounds"]:
        return False
    if len(state["available_pool"]) >= state["target_count"]:
        return False
    return True


def build_niva_handoff(state: dict) -> str:
    rejected = state["rejected_brands"]
    pool_count = len(state["available_pool"])
    nxt = state["current_round"] + 1
    if not should_continue(state):
        return (
            f"Sprint complete after round {state['current_round']}. "
            f"{pool_count} names with available domains in pool."
        )

    rejected_list = ", ".join(rejected) if rejected else "(none yet)"
    return (
        f"NIVA RERUN — Round {nxt} of {state['max_rounds']}\n"
        f"Generate {state['per_round']} NEW master brand names across different "
        f"strategies (portmanteau, Sanskrit, two-letter, truncation, cross-language).\n"
        f"Do NOT reuse these rejected or taken brands: {rejected_list}\n"
        f"Do NOT reuse brands already in the available pool.\n"
        f"Current available pool size: {pool_count} / target {state['target_count']}.\n"
        f"After generating, run:\n"
        f"  python3 agents/scripts/naming_sprint_loop.py check --names \"...\""
    )


def cmd_reset(args: argparse.Namespace) -> int:
    state = default_state()
    state["max_rounds"] = args.max_rounds
    state["target_count"] = args.target
    state["per_round"] = args.per_round
    save_state(state)
    print(json.dumps({"status": "reset", "state": state}, indent=2))
    return 0


def cmd_status(_args: argparse.Namespace) -> int:
    state = load_state()
    payload = {
        "current_round": state["current_round"],
        "max_rounds": state["max_rounds"],
        "target_count": state["target_count"],
        "pool_size": len(state["available_pool"]),
        "rejected_count": len(state["rejected_brands"]),
        "should_continue": should_continue(state),
        "available_pool": state["available_pool"],
        "rejected_brands": state["rejected_brands"],
        "round_history": state["round_history"],
    }
    print(json.dumps(payload, indent=2))
    return 0


def cmd_niva_handoff(_args: argparse.Namespace) -> int:
    state = load_state()
    print(build_niva_handoff(state))
    return 0


def cmd_check(args: argparse.Namespace) -> int:
    state = load_state()
    if state["started_at"] is None:
        state["started_at"] = datetime.now(timezone.utc).isoformat()

    if args.max_rounds is not None:
        state["max_rounds"] = args.max_rounds
    if args.target is not None:
        state["target_count"] = args.target
    if args.per_round is not None:
        state["per_round"] = args.per_round

    if args.round is not None:
        state["current_round"] = args.round
    else:
        state["current_round"] = max(1, state["current_round"] + 1)

    names: list[str] = []
    if args.names:
        if Path(args.names).is_file():
            names.extend(load_names_from_file(args.names))
        else:
            for part in args.names.split(","):
                part = part.strip()
                if part:
                    names.append(part)
    if args.file:
        names.extend(load_names_from_file(args.file))

    if not names:
        sys.stderr.write("No names provided. Use --names or --file.\n")
        return 1

    strategies: dict[str, str] = {}
    if args.file:
        with open(args.file, encoding="utf-8") as handle:
            for line in handle:
                if "|" not in line:
                    continue
                brand, strategy = line.split("|", 1)
                brand = brand.strip()
                if brand:
                    strategies[brand] = strategy.strip()

    result = process_names(state, names, strategies)
    save_state(state)

    payload = {
        "round": state["current_round"],
        "max_rounds": state["max_rounds"],
        "pool_size": len(state["available_pool"]),
        "target_count": state["target_count"],
        "should_continue": should_continue(state),
        "added_this_round": result["added"],
        "rejected_this_round": result["rejected"],
        "skipped_duplicates": result["skipped"],
        "available_pool": state["available_pool"],
        "niva_handoff": build_niva_handoff(state),
    }
    print(json.dumps(payload, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Niva + Regi naming sprint loop")
    sub = parser.add_subparsers(dest="command", required=True)

    reset_p = sub.add_parser("reset", help="Clear sprint state")
    reset_p.add_argument("--max-rounds", type=int, default=5)
    reset_p.add_argument("--target", type=int, default=15)
    reset_p.add_argument("--per-round", type=int, default=15)
    reset_p.set_defaults(func=cmd_reset)

    sub.add_parser("status", help="Show current pool and progress").set_defaults(
        func=cmd_status
    )
    sub.add_parser("niva-handoff", help="Print Niva rerun instructions").set_defaults(
        func=cmd_niva_handoff
    )

    check_p = sub.add_parser("check", help="Check a batch of brand names")
    check_p.add_argument("--names", help="Comma-separated brand names or path to file")
    check_p.add_argument("--file", "-f", help="File with brand names (optional strategy after |)")
    check_p.add_argument("--round", type=int, help="Round number (auto-increments if omitted)")
    check_p.add_argument("--max-rounds", type=int, default=None)
    check_p.add_argument("--target", type=int, default=None)
    check_p.add_argument("--per-round", type=int, default=None)
    check_p.set_defaults(func=cmd_check)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
