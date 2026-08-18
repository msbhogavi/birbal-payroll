#!/usr/bin/env python3
"""Check domain registration status via RDAP with WHOIS fallback.

Usage:
  python3 agents/scripts/check_domains.py example.com example.in
  python3 agents/scripts/check_domains.py --file domains.txt

Output: JSON array to stdout.
Statuses: taken | likely_available | unknown | whois_unavailable | invalid
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request

RDAP_BOOTSTRAP = "https://rdap.org/domain/"

TLD_RDAP_DIRECT: dict[str, str] = {
    "com": "https://rdap.verisign.com/com/v1/domain/",
    "net": "https://rdap.verisign.com/net/v1/domain/",
    "org": "https://rdap.publicinterestregistry.org/rdap/domain/",
    "in": "https://rdap.registry.in/domain/",
    "co": "https://rdap.nic.co/domain/",
    "io": "https://rdap.nic.io/domain/",
}

DOMAIN_RE = re.compile(
    r"^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$",
    re.IGNORECASE,
)

WHOIS_AVAILABLE_PHRASES = (
    "no match",
    "not found",
    "no entries found",
    "no data found",
    "status: free",
    "domain not found",
    "available for registration",
    "no object found",
)

WHOIS_TAKEN_PHRASES = (
    "domain name:",
    "registrar:",
    "creation date:",
    "registry domain id:",
)


def normalize_domain(raw: str) -> str | None:
    value = raw.strip().lower()
    value = value.removeprefix("http://").removeprefix("https://")
    value = value.split("/")[0]
    if value.startswith("www."):
        value = value[4:]
    if not value or "." not in value:
        return None
    if not DOMAIN_RE.match(value):
        return None
    return value


def check_rdap(domain: str) -> str | None:
    labels = domain.rsplit(".", 1)
    if len(labels) != 2:
        return None
    tld = labels[1].lower()
    direct = TLD_RDAP_DIRECT.get(tld)
    urls = []
    if direct:
        urls.append(direct + domain.upper())
    urls.append(RDAP_BOOTSTRAP + domain)

    headers = {"Accept": "application/rdap+json, application/json"}
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    return "taken"
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return "likely_available"
        except (urllib.error.URLError, TimeoutError, OSError):
            continue
    return None


def check_whois(domain: str) -> str:
    try:
        proc = subprocess.run(
            ["whois", domain],
            capture_output=True,
            text=True,
            timeout=20,
            check=False,
        )
    except FileNotFoundError:
        return "whois_unavailable"
    except (subprocess.TimeoutExpired, OSError):
        return "unknown"

    blob = (proc.stdout + "\n" + proc.stderr).lower()
    for phrase in WHOIS_AVAILABLE_PHRASES:
        if phrase in blob:
            return "likely_available"
    for phrase in WHOIS_TAKEN_PHRASES:
        if phrase in blob:
            return "taken"
    return "unknown"


def check_domain(domain: str) -> dict[str, str]:
    normalized = normalize_domain(domain)
    if not normalized:
        return {"domain": domain.strip().lower(), "status": "invalid"}

    rdap_status = check_rdap(normalized)
    if rdap_status in ("taken", "likely_available"):
        return {"domain": normalized, "status": rdap_status}

    whois_status = check_whois(normalized)
    if whois_status == "whois_unavailable" and rdap_status is None:
        return {"domain": normalized, "status": "whois_unavailable"}
    if whois_status in ("taken", "likely_available"):
        return {"domain": normalized, "status": whois_status}

    return {"domain": normalized, "status": "unknown"}


def load_domains_from_file(path: str) -> list[str]:
    domains: list[str] = []
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            for part in re.split(r"[\s,]+", line):
                part = part.strip()
                if part:
                    domains.append(part)
    return domains


def main() -> int:
    parser = argparse.ArgumentParser(description="Check domain availability via RDAP/WHOIS")
    parser.add_argument("domains", nargs="*", help="Domain names to check")
    parser.add_argument("--file", "-f", help="File with one or more domains per line")
    args = parser.parse_args()

    domains: list[str] = list(args.domains)
    if args.file:
        domains.extend(load_domains_from_file(args.file))

    if not domains:
        parser.print_help()
        return 1

    seen: set[str] = set()
    results: list[dict[str, str]] = []
    for domain in domains:
        normalized = normalize_domain(domain)
        key = normalized or domain.strip().lower()
        if key in seen:
            continue
        seen.add(key)
        results.append(check_domain(domain))

    json.dump(results, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
