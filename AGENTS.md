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
