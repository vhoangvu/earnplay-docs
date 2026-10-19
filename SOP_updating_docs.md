# SOP: Updating EarnPlay docs (for any agent)

## Purpose

The executable version of the EarnPlay doc-sync process. Give this SOP to any
agent (or use it to define a custom agent on any harness) and it can update
the docs without breaking consistency.

## The lane rule (read this first)

## The lane rule (read this first)

- **The `.md` files at the repo root are the source of truth.** All doc edits
  happen here. When any doc disagrees, `00-source-of-truth.md` wins.
- **The `.docx` files under `source-docx/` are the originals** the `.md`
  files were generated from. Agents must NEVER hand-edit them.
- **Regeneration:** if the `.docx` originals change, the `.md` files are
  regenerated over the repo root via `SOP_docx_to_markdown.md`. The agent's
  job ends at a green, changelogged set of `.md` files.

## File map

| File (repo root) | Role |
|---|---|
| `00-source-of-truth.md` | Canonical facts. Disagreements resolve in its favor. Edit shared facts HERE first. |
| `01-high-level-design.md` | Product design. |
| `02-low-level-design.md` | Modules, schemas, algorithms. |
| `03-build-task-breakdown.md` | Task list. References cite section IDs, never numbers. |
| `04-entitlement-justification.md` | Reference. |
| `05-kickoff-checklist.md` | Reference. |
| `06-hackathon-application.md` | FROZEN — application already submitted. Read-only. Never edit. |
| `AGENTS.md` | Pointer file. Do not edit. |
| `tasks.json` | Regenerated from the task breakdown; do not hand-edit. |

## Prerequisites

1. The repo's current `.md` files (regenerate via `SOP_docx_to_markdown.md` if the `.docx` originals changed).
2. Baseline must be green, run from the repo root: `python3 check_md_pack.py .` →
   `OK: md-pack consistent, no drift.`

## The sync process (execute in order)

### Step 1 — Read the Source of Truth first
Read `00-source-of-truth.md` fully before touching anything. Understand what
the requested change means for the canonical facts.

### Step 2 — Impact tracing (write it down)
Before editing, write out the impact list:
- Which SSOT sections change (or: "no SSOT change — derived-doc detail only").
- Every LLD module/section the change touches, including indirect ones
  (new modules, algorithm variants, new tasks).
- Every build task the change touches (modified, added, or rescoped).
- Rule: the checker catches drift (names, IDs, phrases, references) but NOT
  completeness. If unsure whether a change is derived-doc-only detail or a
  shared concept, treat it as shared and trace its impact.

### Step 3 — Edit the Source of Truth first
If the change involves a shared fact, edit `00-source-of-truth.md` FIRST.
A fact edited only in a derived doc is drift. Skip this step only when Step 2
concluded the change is purely derived-doc detail.

### Step 4 — Propagate
Apply the change to every derived doc the impact list names, per the Doc map
in the SSOT. Keep all docs mutually consistent — no doc may contradict the
SSOT or another derived doc.

### Step 5 — Verify
Run `python3 check_md_pack.py .` from the repo root until it reports green. Fix every DRIFT line.
Do not declare done while any check fails.

### Step 6 — Changelog
Add a row to the Changelog in `00-source-of-truth.md`: date (YYYY-MM-DD),
what changed, which docs were updated.

## Editing rules

1. **Section IDs are permanent.** Every heading carries a stable ID
   (`[PREFIX-slug]`, rendered `\[PREFIX-slug\]`). Never rename an ID, never
   reuse one. New sections get new IDs; deleted sections retire theirs;
   moving a section never changes its ID.
2. **New ID slug recipe:** lowercase the heading text; drop a leading
   pure-numeric prefix (e.g. `6. `); keep task codes like `T2.2` (dots become
   dashes); replace every run of non-alphanumeric characters with one `-`;
   strip leading/trailing `-`; on collision append `-2`, `-3` in document
   order. Prefix must match the file: `00`→`SSOT`, `01`→`HLD`, `02`→`LLD`,
   `03`→`TASKS`, `04`→`ENT`, `06`→`APP`.
3. **References cite IDs, never section numbers.**
4. **Canonical phrases stay verbatim:** `never trusted alone`,
   `deterministic code holds every safety-critical decision`.
5. **Forbidden names:** `Pocket Tutor`, `Kids Screen Guard` — must not appear
   (the SSOT's own "Former working names" line is the single allowed mention).
6. **Scope tags** (Demo / v1 / Future) change only on explicit instruction.
7. **`06-hackathon-application.md` is frozen.** Read it, never edit it.

## Verification checklist

- [ ] `check_md_pack.py .` green before starting (baseline).
- [ ] Impact list written before any edit.
- [ ] SSOT edited first (or explicitly skipped as derived-only with reason).
- [ ] All impacted derived docs updated; no contradictions with SSOT.
- [ ] `check_md_pack.py .` green after editing.
- [ ] Changelog row added to `00-source-of-truth.md`.
- [ ] `06-hackathon-application.md` untouched.

## Report format

When done, report:
1. What changed (one line per doc).
2. The impact list from Step 2.
3. Final checker output (paste it).
4. The changelog entry added.
5. Anything ambiguous you had to decide, and what you chose.

## Promotion to .docx (maintainer step, not the agent's)

The agent's deliverable is the green, changelogged `.md` set at the repo root + the report above. If the `.docx` originals change, the `.md` files are regenerated over the repo root via `SOP_docx_to_markdown.md` — a separate maintainer step the agent must not attempt.

## New tasks and tasks.json

If the change requires a NEW build task: write the full task (all five
fields — inputs, outputs, automated test, manual test, acceptance criteria —
plus a References list citing section IDs) into the task breakdown doc, but
do NOT hand-edit `tasks.json`. Instead, include the new task's full text in
the report (Section "Report format", item 5) and flag `tasks.json`
regeneration as a maintainer step alongside `.docx` promotion.

## Troubleshooting

- Checker red on baseline → do not start. Report it; the pack is stale or
  drifted. Regenerate the pack from the .docx sources first.
- `06` needs changing → it doesn't. The application is submitted; propose an
  addendum note instead and flag it.
- Unsure whether a fact is shared → treat as shared (Step 2 rule).
- A derived doc contradicts the SSOT → the SSOT wins; fix the derived doc.
- Change needs a new task → draft it fully in the task breakdown doc, flag
  `tasks.json` regeneration for the maintainer; never hand-edit `tasks.json`.

## Appendix A — role prompt for defining a custom agent

Paste the following as the agent's system/role prompt on any harness:

```markdown
You maintain the EarnPlay design docs. The Markdown pack is your editable
layer; never touch .docx files. Read 00-source-of-truth.md first — it is
canonical and wins every disagreement. 06-hackathon-application.md is frozen.

Follow SOP_updating_docs.md for every change: impact tracing in writing,
SSOT first, propagate to derived docs, check_md_pack.py . until green,
changelog entry, then report what changed plus the final checker output.

Section IDs are permanent: never rename or reuse one. References cite IDs,
never numbers. Scope tags (Demo/v1/Future) change only on explicit
instruction. If a fact's home is ambiguous, treat it as shared.
```
