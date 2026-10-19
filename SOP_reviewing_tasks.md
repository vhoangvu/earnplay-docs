# SOP: Reviewing completed tasks

How the maintainer (Vu, or a reviewer agent acting for him) verifies a task the
implementer reports as done, before it is marked Done.

## 1. When to use this

- After the implementer posts the implementation SOP's section-6 report and opens a PR.
- The pilot build (T8.1–T8.4) is the trial run of this SOP.

This SOP does not change the docs. Findings that mean the task card itself was wrong
go back through `SOP_updating_docs.md`.

## 2. Prerequisites

1. The implementer followed `SOP_implementing_tasks.md` and posted the report.
2. You have the PR diff, the task card in `03-build-task-breakdown.md`, and every
   section the card's References field cites.
3. You can run the automated test yourself (or have a runner that can).

## 3. The review loop (per task)

1. **Read the task.** The task card plus every section its References field cites, plus
   the relevant design (HLD/LLD). This is the spec you judge everything against —
   read it before the report, so you know what was supposed to be built.
2. **Read the report.** It must be complete: every automated and manual test and every
   acceptance criterion addressed, ambiguous decisions stated. An incomplete report
   goes back before any code is read.
3. **Re-run the automated test.** It must pass on your side, not just on the
   implementer's. (If the card says "N/A", confirm there is genuinely nothing to run.)
4. **Review the diff.** Check:
   - Only this task's work is in the diff — no unrelated refactors, no other tasks'
     work pulled in.
   - Module names and contracts match the LLD.
   - No secrets, credentials, or API keys in code, logs, or committed files.
   - Scope matches the card: Demo work is the demo version, not the v1 version.
5. **Spot-check the manual steps.** Re-perform a sample of the numbered manual steps
   on the real target (device or browser). Every sampled step must match its expected
   result. If any fail, expand the sample to all steps.
6. **Confirm the acceptance criteria.** Every criterion passes. One fail means the task
   is not done.
7. **Decide.** Pass → section 4. Fail → section 5.

## 4. Passing

1. Merge the PR.
2. Mark the task Done (dashboard / `tasks.json`).
3. Optional, one line: note anything the implementer did well that the next task
   should copy.

## 5. Failing

1. Do not silently fix it yourself. Send it back with specifics:
   - Which test or criterion failed, and how (expected vs. observed).
   - What needs to change, citing the task card or doc section.
2. The implementer reworks and re-reports (implementation SOP from its step 4).
3. If the failure shows the task card itself was wrong, the fix is a doc change via
   `SOP_updating_docs.md`; the task is then re-done against the corrected card.

## 6. Pilot grading note

T8.5 grades the pilot build on correctness, completeness, and code quality. This SOP
produces the evidence: keep the review notes — they are the grading input.

## 7. Troubleshooting

- "Automated test passes for them, fails for me." → Environment difference. Treat as
  blocked; resolve it before passing.
- "Manual steps need their device; I can't re-perform them." → Have the implementer
  record a screen capture and review the capture.
- "The diff is too big to review." → Send it back: split the change or justify it.
- "The report is complete but I disagree with an ambiguous decision." → If the card
  allows the reading, it passes; note the disagreement for the doc backlog. If the
  card does not allow it, fail it under section 5.
