# SOP: Convert EarnPlay .docx docs to a Markdown pack

## Purpose

Generate the Markdown files from the seven EarnPlay Word docs so the project
can be handed to any CLI coding harness (Claude Code, Kiro CLI, Muse Code,
Copilot cloud agent, etc.).

**Source-of-truth rule:** the `.md` files at the repo root are the source of
truth for any agent working from the repo. The conversion writes directly to
the repo root. Never hand-edit the generated Markdown to fix a conversion
problem — fix the `.docx` (or the script) and regenerate.

## When to run

- After any `.docx` doc changes (design edit, new task, scope change).
- Before handing the project to a CLI harness.
- The `.md` files are stale the moment a `.docx` changes. If in doubt,
  regenerate.

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
3. The docs must pass the consistency checker first. On the original VM:
   `python3 ~/workspace/earnplay-docs/check_docs.py`
   Expected output: `OK: all 6 docs consistent, no drift.` (exit 0).
   In the repo: `python3 check_md_pack.py .` from the repo root, expect
   `OK: md-pack consistent, no drift.`
   Do not convert a red (drifting) doc set.

## Source docs

Repo layout (primary):

| # | Output at repo root | Source `.docx` in `source-docx/` |
|---|---|---|
| 00 | `00-source-of-truth.md` | `00-source-of-truth.docx` |
| 01 | `01-high-level-design.md` | `01-high-level-design.docx` |
| 02 | `02-low-level-design.md` | `02-low-level-design.docx` |
| 03 | `03-build-task-breakdown.md` | `03-build-task-breakdown.docx` |
| 04 | `04-entitlement-justification.md` | `04-entitlement-justification.docx` |
| 05 | `05-kickoff-checklist.md` | `05-kickoff-checklist.docx` |
| 06 | `06-hackathon-application.md` | `06-hackathon-application.docx` |

(On the original VM the sources live under `~/workspace/your_files/<slug>/`
with longer filenames — set `SRC` below to that folder and adjust the
filenames in the `docs` list accordingly.)

## Procedure

Run from the repo root. The script overwrites the 7 `.md` files in place —
that is the point: the repo root is the published pack.

```bash
python3 - <<'EOF'
import pypandoc, json, shutil, os
from pathlib import Path

BASE = Path.cwd()  # repo root; change if running elsewhere
SRC = BASE / "source-docx"  # the 7 .docx files
OUT = BASE                  # repo root — the .md files here are the source of truth

os.chdir(OUT)  # pandoc resolves --extract-media relative to the working dir
(OUT / "media").mkdir(exist_ok=True)

docs = [
    ("00-source-of-truth.md",         "00-source-of-truth.docx"),
    ("01-high-level-design.md",        "01-high-level-design.docx"),
    ("02-low-level-design.md",         "02-low-level-design.docx"),
    ("03-build-task-breakdown.md",    "03-build-task-breakdown.docx"),
    ("04-entitlement-justification.md","04-entitlement-justification.docx"),
    ("05-kickoff-checklist.md",        "05-kickoff-checklist.docx"),
    ("06-hackathon-application.md",    "06-hackathon-application.docx"),
]

for name, src_name in docs:
    src = SRC / src_name
    assert src.exists(), f"MISSING: {src}"
    pypandoc.convert_file(str(src), "md", outputfile=str(OUT / name),
                          extra_args=["--extract-media=media", "--wrap=none"])
    print("converted", name)

# tasks.json lives at the repo root; refresh it from the task breakdown
shutil.copy(BASE / "tasks.json", OUT / "tasks.json")
json.load(open(OUT / "tasks.json"))  # validates
print("tasks.json refreshed and valid")
print("pack at", OUT)
EOF
```

`AGENTS.md` at the repo root is the pointer file (content = Appendix A). It is
not generated from the docs — leave it alone.

## Verification checklist

- [ ] The checker was green before converting.
- [ ] All 7 `.md` files exist at the repo root (fresh timestamps).
- [ ] `tasks.json` parses (`python3 -c "import json; json.load(open('tasks.json'))"` from the repo root).
- [ ] `AGENTS.md` exists at the repo root and matches Appendix A.
- [ ] Spot-check `00-source-of-truth.md`: headings present (`grep -c '^#'`),
      section IDs visible as `\[SSOT-...\]` (pandoc escapes the brackets;
      this is expected, do not "fix" it by hand), and the Doc map table
      reads correctly.
- [ ] `media/` contains extracted diagram images (HLD/LLD have figures; pandoc
      nests them at `media/media/` — expected). Verify every image ref resolves
      (run from the repo root — the `*.md` glob only matches there):
      `for f in $(grep -oh "media/[a-z0-9/._-]*\.\(png\|jpg\|jpeg\|gif\)" 0*.md | sort -u); do [ -f "$f" ] || echo "BROKEN: $f"; done`

## Rules

1. **The repo-root `.md` files are the source of truth for agents.** All
   agent edits happen there (see `SOP_updating_docs.md`). The `.docx` files
   under `source-docx/` are the originals — read-only for agents.
2. **Never hand-edit the generated `.md` to fix a conversion problem.**
   Fix the `.docx` (or the script) and regenerate.
3. **Regenerate after every `.docx` change** before giving the repo to a
   harness.
4. The `06-hackathon-application.md` is a frozen record (application already
   submitted). It converts like the rest but its `.docx` must not be edited.

## Troubleshooting

- `pypandoc` import error → `pip install pypandoc-binary`; on PEP 668 systems
  add `--break-system-packages` or use a venv (see Prerequisites).
- `MISSING:` assertion → a `.docx` was renamed/moved; check `source-docx/`.
- Checker red → fix the docs first; never convert a drifting set.
- A harness complains about `\[...\]` escapes → they are valid Markdown and
  the IDs remain searchable; leave them.

## Appendix A — AGENTS.md pointer file

The repo-root `AGENTS.md` carries this content. It is maintained by hand,
never generated.

```markdown
# EarnPlay — agent instructions

You are building EarnPlay, a private on-device iOS tutor + app gate for kids
(grades 1–5 target; demo ships 4th-grade content only).

## Source of truth

The `.md` files at the repo root are the source of truth. `source-docx/`
holds the original Word files — read-only, never edit them.

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
- Doc updates follow `SOP_updating_docs.md`: impact tracing in writing,
  SSOT first, propagate, `check_md_pack.py` until green, changelog entry.
```
