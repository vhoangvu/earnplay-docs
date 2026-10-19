#!/usr/bin/env python3
"""Check the EarnPlay Markdown pack for drift against the canonical facts.

Reads the .md files under ~/workspace/earnplay-docs/md-pack/ (generated from
the .docx docs by SOP_docx_to_markdown.md) and verifies:
  1. Forbidden old project names appear nowhere.
  2. "EarnPlay" appears in every doc.
  3. Canonical phrases appear verbatim in the docs that must carry them.
  4. Every section heading carries a stable unique ID, IDs are unique
     within/across docs, and every References entry in the task breakdown
     cites an existing ID.

This is the md-pack mirror of check_docs.py (which checks the .docx files).
External agents working from the pack run THIS checker, not check_docs.py.

Usage: python3 check_md_pack.py [pack_dir]
Exit 0 = all checks pass, 1 = drift found.
"""
import re
import sys
from pathlib import Path

PACK = Path(sys.argv[1]) if len(sys.argv) > 1 else \
    Path.home() / "workspace" / "earnplay-docs" / "md-pack"

# md file -> (short name, ID prefix). Mirrors check_docs.py DOCS.
DOCS = {
    "06-hackathon-application.md": ("application", "APP"),
    "01-high-level-design.md": ("hld", "HLD"),
    "02-low-level-design.md": ("lld", "LLD"),
    "03-build-task-breakdown.md": ("tasks", "TASKS"),
    "04-entitlement-justification.md": ("entitlement", "ENT"),
    "00-source-of-truth.md": ("ssot", "SSOT"),
}
# Light check only (no IDs required): must not contain forbidden names,
# must contain "EarnPlay".
LIGHT_DOCS = ["05-kickoff-checklist.md"]

FORBIDDEN = ["Pocket Tutor", "Kids Screen Guard"]
REQUIRED_ALL = ["EarnPlay"]

CANONICAL = [
    ("never trusted alone", ["application", "hld", "lld", "ssot"]),
    ("deterministic code holds every safety-critical decision",
     ["application", "hld", "lld", "ssot"]),
    ("MultipeerConnectivity", ["hld", "lld", "tasks", "ssot"]),
    ("ManagedSettings", ["hld", "lld", "tasks", "entitlement", "ssot"]),
    ("FamilyControls", ["application", "hld", "lld", "tasks",
                         "entitlement", "ssot"]),
]

HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
# IDs render escaped in pandoc output: \[SSOT-...\]
ID_RE = re.compile(r"\\?\[([A-Z]+-[a-z0-9][a-z0-9-]*)\\?\]\s*$")
REF_ID_RE = re.compile(r"^(SSOT|HLD|LLD|TASKS|APP|ENT)-[a-z0-9][a-z0-9-]*$")
TASK_RE = re.compile(r"T(\d+)\.(\d+)")


def read_pack():
    texts, headings = {}, {}
    for fname, (short, _prefix) in DOCS.items():
        p = PACK / fname
        if not p.exists():
            return None, None, f"MISSING: {fname}"
        text = p.read_text()
        texts[short] = text
        hs = []
        for line in text.splitlines():
            m = HEADING_RE.match(line)
            if not m:
                continue
            htext = m.group(2).strip()
            im = ID_RE.search(htext)
            hs.append((htext, im.group(1) if im else None))
        headings[short] = hs
    for fname in LIGHT_DOCS:
        p = PACK / fname
        if p.exists():
            texts["light:" + fname] = p.read_text()
    return texts, headings, None


def main() -> int:
    failures = 0
    texts, headings, err = read_pack()
    if err:
        print(err)
        return 1

    for short, text in texts.items():
        for term in FORBIDDEN:
            allowed = 1 if short == "ssot" else 0
            if text.count(term) > allowed:
                print(f"DRIFT: forbidden term '{term}' found in {short}")
                failures += 1
        for term in REQUIRED_ALL:
            if term not in text:
                print(f"DRIFT: required term '{term}' missing in {short}")
                failures += 1

    for phrase, owners in CANONICAL:
        for short in owners:
            if short not in texts:
                continue
            if phrase not in texts[short]:
                print(f"DRIFT: canonical phrase missing in {short}: "
                      f"'{phrase[:60]}...'")
                failures += 1

    # ID registry
    id_owner = {}
    for fname, (short, prefix) in DOCS.items():
        seen = set()
        for htext, hid in headings[short]:
            if hid is None:
                print(f"DRIFT: heading without ID in {short}: "
                      f"{htext[:70]!r}")
                failures += 1
                continue
            if not hid.startswith(prefix + "-"):
                print(f"DRIFT: ID {hid!r} in {short} has wrong prefix "
                      f"(expected {prefix}-)")
                failures += 1
            if hid in seen:
                print(f"DRIFT: duplicate ID {hid!r} within {short}")
                failures += 1
            seen.add(hid)
            if hid in id_owner and id_owner[hid] != short:
                print(f"DRIFT: ID {hid!r} used in both {id_owner[hid]} "
                      f"and {short}")
                failures += 1
            id_owner.setdefault(hid, short)

    # References in the tasks doc
    task_id = "?"
    refs_found = 0
    for line in texts["tasks"].splitlines():
        stripped = line.strip()
        m = TASK_RE.search(stripped)
        if m and stripped.startswith("#"):
            task_id = f"T{m.group(1)}.{m.group(2)}"
        if "References" not in stripped or ":" not in stripped:
            continue
        body = stripped.split(":", 1)[1]
        for token in re.split(r"[;,]", body):
            token = token.strip().strip("*\\").strip()
            if not token:
                continue
            refs_found += 1
            if not REF_ID_RE.match(token):
                print(f"DRIFT: {task_id}: reference is not a section ID: "
                      f"{token!r}")
                failures += 1
            elif token not in id_owner:
                print(f"DRIFT: {task_id}: cited ID does not exist: "
                      f"{token!r}")
                failures += 1
    if not refs_found:
        print("DRIFT: no References fields found in tasks doc")
        failures += 1

    if failures:
        print(f"\n{failures} drift issue(s) found.")
        return 1
    print(f"OK: md-pack consistent, no drift.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
