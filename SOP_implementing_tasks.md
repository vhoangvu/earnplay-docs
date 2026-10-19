# SOP: Implementing build tasks

How any coding agent (Copilot, Claude Code, Kiro, a human contributor) turns the task
cards in `03-build-task-breakdown.md` into working code, one task at a time.

## 1. When to use this

- The 10-day iOS build (Epics 0–7).
- The pilot web PoC (Epic 8) — use the pilot as a trial run of this SOP before the
  hackathon starts.

This SOP does not change the docs. If a task card looks wrong, report it (section 7);
do not edit the docs yourself — doc changes follow `SOP_updating_docs.md`.

## 2. Prerequisites

1. Read `00-source-of-truth.md` fully first. It is the authority on what the product is.
2. Read the task card you are implementing in `03-build-task-breakdown.md`, plus every
   section its **References** field cites. Do not guess at behavior the docs define.
3. Check the dependency graph: start a task only when every task in its **Depends on**
   list is Done. (`tasks.json` holds the same graph in machine-readable form.)
4. Know your target environment:
   - Pilot (Epic 8): any modern browser; plain HTML/JS, no build step, no backend.
   - iOS build (Epics 0–7): Xcode on a Mac; two targets (child app + admin app).

## 3. The implementation loop (per task)

1. **Claim.** Say which task you are starting (comment on the issue or PR). One task
   at a time.
2. **Read.** The task card plus all referenced sections (step 2 of Prerequisites).
3. **Implement.** Write the code, following these rules:
   - Build exactly what the task card says — no more, no less. Demo scope means the
     demo version, not the v1 version.
   - Do not do another task's work inside this task.
   - Follow the module names and contracts in the LLD.
   - No secrets, credentials, or API keys in code, logs, or committed files.
4. **Automated test.** Run the task card's named automated check; it must pass.
   If the card says "Automated test: N/A", state that explicitly — it is a valid
   answer, not a gap.
5. **Manual test.** Perform every numbered manual step on the real target
   (device or browser). Record expected vs. observed for each step.
6. **Acceptance criteria.** Check each criterion off in writing, pass or fail.
7. **Report.** Post the report (section 6) and open a pull request.

## 4. Task selection order

Work in dependency order. Eligible tasks are the ones whose dependencies are all Done;
when several are eligible, prefer the one on the longest chain (the critical path).
The Demo definition of done is 38 tasks; T5.4 (demo staging) runs after all of them,
T5.5 (submission) last.

## 5. Scope discipline

- The task card is the spec. If you believe the card is wrong, report it — do not
  silently "fix" it by building something different.
- Do not refactor unrelated code, rename shared modules, or change public contracts
  to suit one task. Contract changes are doc changes; see section 1.
- Pilot code is throwaway: it must not leak into the iOS app.

## 6. Report format

Post this on the issue or PR when the task is done:

- Task ID + title.
- What changed (files added/modified).
- Automated test: name + result (or "N/A per task card").
- Manual test: each numbered step + observed result.
- Acceptance criteria: each one, pass or fail.
- Ambiguous decisions: what was unclear and what you chose.

## 7. Blocked protocol

If you cannot proceed — missing dependency, ambiguous spec, environment failure:

1. Stop. Do not work around it by inventing behavior.
2. Report: what is blocked, what you need, who can unblock it.
3. Pick up a different eligible task if one exists; otherwise wait.

A task whose dependency is Blocked is itself Blocked. Say so; do not skip the
dependency.

## 8. Verification

Verification is a separate SOP: `SOP_reviewing_tasks.md`. Do not mark your own task
Done — the reviewer does that after the review passes.

## 9. Troubleshooting

- "The task has no automated test." → Follow the card; "N/A" is valid.
- "Two tasks seem to conflict." → Stop, report both, let the maintainer resolve.
- "The docs don't say how." → Report it as ambiguous (section 6); do not invent.
- "I finished early and see nearby work." → Do not pull it in. Claim it as a new
  task or leave it.
