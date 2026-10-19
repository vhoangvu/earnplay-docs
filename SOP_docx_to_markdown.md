# SOP: Convert EarnPlay .docx docs to a Markdown pack

## Purpose

Generate a Markdown pack from the seven EarnPlay Word docs so the project can be
handed to any CLI coding harness (Claude Code, Kiro CLI, Muse Code, etc.).
The .docx files remain the source of truth; the Markdown pack is a generated
export. Never hand-edit the Markdown — regenerate it.

## When to run

- After any .docx doc changes (design edit, new task, scope change).
- Before handing the project to a CLI harness.
- The pack is stale the moment a .docx changes. If in doubt, regenerate.

## Prerequisites

1. Python 3.
2. `pypandoc-binary` (bundles pandoc, no system install needed):
   `pip install pypandoc-binary`
   On Debian/Ubuntu systems with PEP 668 enforcement, plain `pip install`
   fails with `externally-managed-environment`. Use one of:
   `pip install --break-system-packages pypandoc-binary`, or
   `python3 -m venv ~/earnplay-venv && ~/earnplay-venv/bin/pip install pypandoc-binary`
   (then run the conversion script with `~/earnplay-venv/bin/python3`).
   (On macOS, `brew install pandoc` also works; the script below uses
   pypandoc so either is fine.)
3. The docs must pass the consistency checker first:
   `python3 ~/workspace/earnplay-docs/check_docs.py`
   Expected output: `OK: all 6 docs consistent, no drift.` (exit 0).
   Do not convert a red (drifting) doc set.

## Source docs

| # | Markdown name | Source .docx |
|---|---|---|
| 00 | `00-source-of-truth.md` | `~/workspace/your_files/earnplay-source-of-truth/EarnPlay — Source of Truth.docx` |
| 01 | `01-high-level-design.md` | `~/workspace/your_files/earnplay-high-level-design/EarnPlay — High-Level Design.docx` |
| 02 | `02-low-level-design.md` | `~/workspace/your_files/earnplay-low-level-design/EarnPlay — Low-Level Design.docx` |
| 03 | `03-build-task-breakdown.md` | `~/workspace/your_files/earnplay-build-task-breakdown/EarnPlay — Build Task Breakdown.docx` |
| 04 | `04-entitlement-justification.md` | `~/workspace/your_files/earnplay-familycontrols-entitlement-justification/EarnPlay — FamilyControls Entitlement Request Justification.docx` |
| 05 | `05-kickoff-checklist.md` | `~/workspace/your_files/earnplay-t01-t04-kickoff-checklist/EarnPlay T0.1 + T0.4 Kickoff Checklist.docx` |
| 06 | `06-hackathon-application.md` | `~/workspace/your_files/pocket-tutor-hackathon-application/EarnPlay — Hackathon Application Draft.docx` (submitted — read-only, do not edit the .docx either) |

## Procedure

Run from any directory. The script wipes and recreates the pack directory, so
it is always a clean export.

```bash
python3 - <<'EOF'
import pypandoc, json, shutil, os
from pathlib import Path

home = Path.home()
BASE = home / "workspace"  # <-- change this if your files live elsewhere
out = BASE / "earnplay-docs/md-pack"
shutil.rmtree(out, ignore_errors=True)
(out / "media").mkdir(parents=True)
os.chdir(out)  # pandoc resolves --extract-media relative to the working dir

docs = [
    ("00-source-of-truth.md",        BASE/your_files/earnplay-source-of-truth/EarnPlay — Source of Truth.docx"),
    ("01-high-level-design.md",       BASE/your_files/earnplay-high-level-design/EarnPlay — High-Level Design.docx"),
    ("02-low-level-design.md",        BASE/your_files/earnplay-low-level-design/EarnPlay — Low-Level Design.docx"),
    ("03-build-task-breakdown.md",   BASE/your_files/earnplay-build-task-breakdown/EarnPlay — Build Task Breakdown.docx"),
    ("04-entitlement-justification.md", BASE/your_files/earnplay-familycontrols-entitlement-justification/EarnPlay — FamilyControls Entitlement Request Justification.docx"),
    ("05-kickoff-checklist.md",       BASE/your_files/earnplay-t01-t04-kickoff-checklist/EarnPlay T0.1 + T0.4 Kickoff Checklist.docx"),
    ("06-hackathon-application.md",   BASE/your_files/pocket-tutor-hackathon-application/EarnPlay — Hackathon Application Draft.docx"),
]

for name, src in docs:
    assert src.exists(), f"MISSING: {src}"
    pypandoc.convert_file(str(src), "md", outputfile=str(out/name),
                          extra_args=["--extract-media=media", "--wrap=none"])
    print("converted", name)

# tasks.json rides along for machine-readable task iteration
shutil.copy(BASE/earnplay-docs/tasks.json", out/"tasks.json")
json.load(open(out/"tasks.json"))  # validates
print("tasks.json copied and valid")
print("pack at", out)
EOF
```

Then copy the pointer file into the pack. If `md-pack-AGENTS.md` does not exist
yet, create it from Appendix A first, then copy it verbatim on every run
(it is not generated from the docs):

```bash
cp ~/workspace/earnplay-docs/md-pack-AGENTS.md ~/workspace/earnplay-docs/md-pack/AGENTS.md
```

(If you changed `BASE` because your files live elsewhere, use your base path
in place of `~/workspace` in the `cp` command too.)

## Transferring the pack to your machine

The SOP runs wherever the .docx files live. To use the pack with a CLI
harness on a different machine (e.g. your Mac):

1. Zip the pack: `cd ~/workspace/earnplay-docs && zip -r earnplay-md-pack.zip md-pack`
2. Download `earnplay-md-pack.zip` (via chat or the Library) and unzip it
   on the target machine.
3. Alternatively, download the 7 .docx files, set `BASE` in the script to
   their parent folder, and run the SOP there.

## Handing the pack to the harness

The pack is complete at `md-pack/`. Point the CLI at that directory
(or open `AGENTS.md` inside it first) — it contains the doc hierarchy,
the rules, and the machine-readable `tasks.json`.

## Verification checklist

- [ ] `check_docs.py` was green before converting.
- [ ] All 7 `.md` files exist in `md-pack/`.
- [ ] `tasks.json` exists and parses
      (`cd ~/workspace/earnplay-docs/md-pack && python3 -c "import json; json.load(open('tasks.json'))"`).
- [ ] `AGENTS.md` exists in the pack.
- [ ] Spot-check `00-source-of-truth.md`: headings present (`grep -c '^#'`),
      section IDs visible as `\[SSOT-...\]` (pandoc escapes the brackets;
      this is expected, do not "fix" it by hand), and the Doc map table
      reads correctly.
- [ ] `media/` contains extracted diagram images (HLD/LLD have figures; pandoc
      nests them at `media/media/` — expected). Verify every image ref resolves
      (run from inside the pack dir — the `*.md` glob only matches there):
      `cd ~/workspace/earnplay-docs/md-pack && for f in $(grep -oh "media/[a-z0-9/._-]*\.\(png\|jpg\|jpeg\|gif\)" *.md | sort -u); do [ -f "$f" ] || echo "BROKEN: $f"; done`

## Rules

1. **.docx is the source of truth.** All edits go through the doc pipeline
   (SSOT first, propagate, checker green). The Markdown pack is downstream.
2. **Never hand-edit the pack.** A hand edit will be wiped on the next run.
   Fix the .docx and regenerate.
3. **Regenerate after every doc change** before giving the pack to a harness.
4. The `06-hackathon-application.md` is a frozen record (application already
   submitted). It converts like the rest but its .docx must not be edited.

## Troubleshooting

- `pypandoc` import error → `pip install pypandoc-binary`; on PEP 668 systems
  add `--break-system-packages` or use a venv (see Prerequisites).
- `MISSING:` assertion → a .docx was renamed/moved; the artifact folders are
  the build directories — do not move them (see 2026-10-18 decision).
- Checker red → fix the docs first; never convert a drifting set.
- A harness complains about `\[...\]` escapes → they are valid Markdown and
  the IDs remain searchable; leave them.

## Appendix A — AGENTS.md pointer file (write once)

Save the following as `~/workspace/earnplay-docs/md-pack-AGENTS.md`.
It is copied verbatim into every pack.

```markdown
# EarnPlay — agent instructions

You are building EarnPlay, a private on-device iOS tutor + app gate for kids
(grades 1–5 target; demo ships 4th-grade content only).

## Document hierarchy

1. `00-source-of-truth.md` — canonical facts. Where any doc disagrees, this wins.
2. `01-high-level-design.md` — product design: architecture, flows, UX, scope.
3. `02-low-level-design.md` — modules, data schemas, algorithms.
4. `03-build-task-breakdown.md` — the work list. Each task has inputs, outputs,
   automated test, manual test, acceptance criteria.
5. `tasks.json` — machine-readable task list (id, title, epic, size, scope,
   dependencies, description, status).
6. `04-entitlement-justification.md`, `05-kickoff-checklist.md`,
   `06-hackathon-application.md` — reference only.

## Rules

- Section IDs look like `[HLD-...]`, `[LLD-...]`, `[TASKS-...]`, `[SSOT-...]`
  (rendered `\[...\]`). They are permanent: never rename or reuse one.
- Task `References` cite section IDs, never section numbers.
- Scope tags: Demo (10-day hackathon), v1 (App Store), Future. Do not build
  v1/Future scope unless asked.
- T0.4 (entitlement filing) is v1-blocking, not demo-blocking. The demo uses
  the simulated-shield fallback and needs no Apple Developer account.
- The tutor model is never trusted alone — deterministic code holds every
  safety-critical decision. Every math answer is solver-verified.
- Do not invent facts. If a doc is ambiguous, the Source of Truth decides;
  if it is silent, ask before inventing.
```
