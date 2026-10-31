# EarnPlay --- Source of Truth \[SSOT-earnplay-source-of-truth\]

Single canonical reference for all EarnPlay documents

  ------------------------------------------------------------------------------------------------
  *This document is the authority: where any derived doc disagrees with it, this document wins.*
  ------------------------------------------------------------------------------------------------

  ------------------------------------------------------------------------------------------------

Every shared fact lives here exactly once. The derived documents --- Hackathon Application Draft, High-Level Design, Low-Level Design, Build Task Breakdown, and FamilyControls Entitlement Justification --- must match this document. Do not invent facts.

## 1. The sync rule \[SSOT-the-sync-rule\]

This section is the mechanism: how sync works across all EarnPlay documents.

> **1. Rule 1:** Edit a shared fact HERE first, never only in a derived doc. A fact edited only in a derived doc is drift.
>
> **2. Rule 2:** After editing here, propagate the change to every derived doc listed in the Doc map for that section.
>
> **3. Rule 3:** Impact tracing --- before editing, list every LLD module/section and every build task the change touches, including indirect ones (new modules, algorithm variants, new tasks). The checker catches drift (names, IDs, phrases, references) but NOT completeness --- it cannot know that a new concept implies a new module or new tasks. If unsure whether a change is derived-doc-only detail or a shared concept, treat it as shared and trace its impact.
>
> **4. Rule 4:** Run the checker script (check_md_pack.py) for the Markdown pack after propagation. Fix until it reports green. (check_docs.py checks the .docx sources only.) References in the task breakdown cite section IDs, never section numbers; the checker also verifies every cited ID exists.
>
> **5. Rule 5:** Log every change in the Changelog with the date, what changed, and which docs were updated.

The assistant (or the builder) is the sync executor: when the user says "change X", update this document first, then the derived docs, then run the checker.

## Section IDs \[SSOT-section-ids\]

Every section heading in every EarnPlay document carries a stable unique ID, appended to the heading text as " \[ID\]".

- **Format:** ID = PREFIX + "-" + slug. This document\'s prefix is SSOT-.

- **Slug:** Lowercase the heading text; drop a leading pure-numeric prefix matching a pattern like "6. " or "6.4 "; replace every run of non-alphanumeric characters with one "-"; strip leading and trailing "-".

- **Duplicates:** If two headings in this document produce the same slug, append "-2", "-3", and so on, in document order.

- **Permanence:** IDs are permanent: never rename an ID and never reuse one. New sections get new IDs; deleted sections retire their IDs; moving a section never changes its ID.

- **References:** References in the task breakdown cite section IDs, never section numbers. The checker verifies every cited ID exists.

## 2. Canonical facts --- Identity \[SSOT-canonical-facts-identity\]

- **Project name:** EarnPlay. Former working names (never use): Pocket Tutor, Kids Screen Guard.

- **One-liner (verbatim):** "An on-device AI tutor and motivation engine for kids that is never trusted alone --- deterministic code holds every safety-critical decision, every AI decision is justified and checked by a second AI auditor --- where practice, movement, and chores earn screen time. No child data ever leaves the device."

- **Track:** Indie Dev Track (solo).

- **Theme:** Theme 1 --- Build for Your World.

- **Platform:** iOS-only. Two apps: child app (AI tutor + app locker + challenge gate; enforces policy) and admin/parent app (dashboard, policy, decision log, audit; sets policy, enforces nothing directly).

- **Child app main screen:** a conversational chat interface --- the child talks to the AI tutor in a message thread. Questions, hints, probes, encouragement, answers, and revisions all flow as chat messages; the chat is the main practice surface. The chat is the surface only: the hint ladder levels, the floor rule, the effort threshold, and the unlock decision are enforced in deterministic code --- the model can never reveal a full answer or grant an unlock through chat, and the child's free-text input is treated as untrusted (prompt-injection defense), per the assurance layers in section 8.

- Grade is a content-level parameter; product target is grades 1--5 (two UX bands: 1--2 early readers, 3--5 fluent readers); the architecture is grade-agnostic --- new grades later mean new content packs, not redesign; the demo ships 4th-grade content only.

## 3. Canonical facts --- Locking model \[SSOT-canonical-facts-locking-model\]

- **Three tiers:** always-allowed (never blocked: EarnPlay itself, Phone, Messages, plus parent picks) / unblockable (parent picks; locked by default; the ONLY apps a challenge can open) / locked, no challenge (everything else by default).

- Newly installed apps are locked by default. Parent can also mark specific apps never-unlockable.

- The unblockable list is app logic (which apps get a challenge offered), not a ManagedSettings exemption.

## 4. Canonical facts --- Effort model \[SSOT-canonical-facts-effort-model\]

- **Effort score inputs:** active minutes (idle-paused after \~20 seconds of no interaction), attempts, hint interactions, answer revisions, explanations given. The child never sees the number.

- **Per-session variable threshold:** roughly 8--14 effort points, so no learnable pattern.

- **Floor:** at least one genuine attempt + one real interaction with a hint/follow-up. Below the floor, no amount of time unlocks. Pure idling or guessing never unlocks.

- **Unlock durations:** practice challenge → 30 minutes; movement trade → 15 minutes; chore trade → parent-set minutes.

- Unlocks reward effort, not perfection. Rewards are narrated (what the child did that earned it).

## 5. Canonical facts --- Questions and hints \[SSOT-canonical-facts-questions-and-hints\]

- Questions must NOT be in normal textbook form. Forms: stories, reverse problems, estimation, "which one is wrong and why", problems with irrelevant numbers to ignore. Same skill, different surface.

- **Hint ladder,** 3 levels: nudge → strategy → one worked step, then the child finishes. Hint use counts toward effort when the child uses it and then works.

- Every math problem and answer is verified by a deterministic solver BEFORE it reaches the child. Reading questions are checked against passage text.

## 6. Canonical facts --- Trades \[SSOT-canonical-facts-trades\]

### Movement trade \[SSOT-movement-trade\]

- AI-initiated ONLY (child can never request it); offered only when the AI judges patience exhausted despite wanting the unlock; verified by CoreMotion (accelerometer/gyroscope, phone in pocket, live rep counter); iPad weaker (no pocket); frequency cap: at most once per session + parent-set weekly max (suggested 2--3); taper: if trade becomes the pattern (e.g., 4 of 5 sessions), offer less often + require a short practice attempt first; admin flags the pattern.

### Chore trade \[SSOT-chore-trade\]

- Parent stocks the chore pool in the admin app (chore, unlock minutes, expiry, weekly cap, verification mode); AI offers exactly ONE trade mid-session (movement OR one chore); child never sees a menu/list at the beginning; AI varies movement vs chore vs no offer so no pattern is learnable; AI picks chore by rotation, time-of-day fit, effort matched to unlock; floor still applies; child accepts/declines; parent confirms completion (only the parent can judge); optional async mode: photo proof + trust, unlock granted, parent reviews later and can revoke; child cannot create own chores; offers are one-time; parent controls supply.

- Parent CANNOT push a chore on demand through the app. No admin approval required for challenge/movement unlocks (automatic); chores are the exception because the parent offered them and verifies completion.

## 7. Canonical facts --- Audit and justification \[SSOT-canonical-facts-audit-and-justification\]

- The tutor writes a justification summary for every consequential decision: decision + evidence observed + reasoning + alternative considered + confidence. Routine actions get a one-line reason.

- A second, separate auditor model in the admin app analyzes session logs at sync time and flags: leniency drift, false negatives (trying hard but denied), gaming patterns, question-quality / difficulty miscalibration, behavior shifts, inconsistency, justifications that don\'t match the raw log.

- Each flag carries severity (info / watch / act), evidence, and a suggested action. Parent can dismiss, adjust a setting, or open the session transcript. The auditor never acts autonomously on policy.

## 8. Canonical facts --- Model behavior assurance (six layers) \[SSOT-canonical-facts-model-behavior-assurance-six-layers\]

> **1.** The model proposes, code disposes.
>
> **2.** The child\'s input is untrusted (prompt-injection defense).
>
> **3.** Every output validated before it reaches the child.
>
> **4.** Eval harness + red-teaming must pass before any model/prompt update ships.
>
> **5.** Auditor + parent transcripts watch in production.
>
> **6.** Version everything, roll back on regression.

  ---------------------------------------------------------------------------------------------------------------------
  *Core claim: "The tutor model is never trusted alone --- deterministic code holds every safety-critical decision."*
  ---------------------------------------------------------------------------------------------------------------------

  ---------------------------------------------------------------------------------------------------------------------

## 9. Canonical facts --- Privacy \[SSOT-canonical-facts-privacy\]

- No network calls at practice time. The one-time first-launch model download (see [SSOT-tech-stack]) is not practice time; after a successful download, practice is fully offline. No accounts. No child data off-device. Session logs sync between the two apps over Bluetooth via MultipeerConnectivity only. FamilyControls tokens are opaque (app never learns installed apps beyond parent picks). No ads, analytics SDKs, data sale, or third-party tracking. The app does not request the child\'s name, age, or personal info beyond what the parent enters for policy.

## 10. Canonical facts --- Platform and entitlement \[SSOT-canonical-facts-platform-and-entitlement\]

- Locking uses Apple\'s FamilyControls + ManagedSettings shields (gated entitlement), with Screen Time authorization granted by the parent during setup.

- Two entitlements: development (local testing) vs distribution (TestFlight/App Store, Apple approval required, per bundle ID, review typically days to weeks). Demo uses the development entitlement or a simulated shield fallback if it is unavailable.

- **RESOLVED-as-default:** no per-app exemption API exists in public docs/examples for ManagedSettings. Architecture is enumeration-first: shield every app on the device except the allowlist, via FamilyActivityPicker at setup; category shields serve as backstop for newly installed apps. The one-afternoon prototype (shield a category, try to exempt one app in it) remains as confirmation only. Caveat: absence from public docs is not proof; only the on-device prototype settles it for certain.

- iOS will not keep Bluetooth sync alive in the background (sync works when both apps are open and nearby).

- **Entitlement request status:** justification draft ready; NOT yet filed. Bundle ID and Team ID are placeholders until the project is created.

## Tech stack \[SSOT-tech-stack\]

- **iOS apps:** Swift + **SwiftUI** (picked over UIKit: faster to build for a 10-day deadline, FamilyActivityPicker is SwiftUI-native, concise declarative code for agents to generate). Xcode workspace with two app targets (child + admin) and one shared Swift package for models/schemas.
- **Apple frameworks:** FamilyControls + ManagedSettings (shielding), MultipeerConnectivity (sync), CoreMotion (movement verification), AVSpeechSynthesizer (read-aloud).
- **On-device model and distribution (decided 2026-10-29; code-repo tracking issue vhoangvu/earnplay#53):** bartowski Llama-3.2-1B-Instruct-GGUF, Q4_K_M (807,694,464 bytes), llama.cpp/MLC-style route; runs on the device, no server. The model is NOT bundled in the app. On first launch, over Wi-Fi, the app downloads the model file to Application Support (NOT Caches --- iOS can purge Caches under storage pressure), verifies the sha256 checksum after download (checksum beginning 6f85a640), and discards and retries on mismatch; an unverified model is never run. The download shows progress with retry on failure; after a successful download the app works fully offline. The downloaded file is picked up by the existing ModelRuntime lookup, with Application Support joining the lookup order. Llama 3.2 Community License attribution is in the app, on an About screen. Explicitly NOT: bundling the model in the app binary, on-demand resources (rejected for purge risk), or shrinking the quant (Q4_K_M is already 4-bit). Purpose: defensive App Store publish, with a review submission target of Oct 31--Nov 2, 2026, before the repo goes public at the Nov 4 submission. The hackathon submission itself is unaffected: the fresh-extract repo includes the setup script and lookup logic.
- **Child-side practice pipeline (decided 2026-10-30; code-repo tracking issue vhoangvu/earnplay#63):** practice sessions in the child app record per-question detail (question, skill, correctness, idle-paused active time, hints used, error type for incorrect answers only) plus the session effort snapshot (T1.4 score vs threshold) into the SessionLog, carried by the existing sync to the admin app. The dashboard's five detail cards (accuracy, active time, hint rate, top error, effort trend) populate from these records; until the pipeline lands, the dashboard shows explicit 'not yet' states for detail cards, never zeroes or invented data. The detail fields are named `questionRecords` / `effort` on SessionLog to avoid colliding with the auditor's `questions` field. Explicitly NOT: dashboard changes (T4.2's territory), sync transport changes, or any user-visible score, timer, or pass/fail language.
- **CI:** Xcode Cloud or GitHub Actions macOS runners.
- **Pilot:** plain HTML/JS, no build step, no backend.
- **Source layout (iOS code repo, when created):** `EarnPlay/` (child app target), `EarnPlayAdmin/` (admin app target), `EarnPlayCore/` (shared Swift package: models, schemas, solver), `EarnPlayTests/` (unit-test target), `EarnPlayUITests/` (XCUITest UI smoke-test target for the child app).
- **Source layout (pilot, in this repo):** `pilot/` --- single page (`index.html`, `app.js`, `questions.js`), no build step; the Copilot agent builds it here because the build issue lives in this repo.
- **Design system (canonical):** color palette — Primary #4361EE, Secondary #FFB703, Background #F7F8FC, Surface #FFFFFF, Text #1B1B2F, Text-secondary #6C6C80, Success #2EC4B6, Warning #FF9F1C, Error #E71D36. Typography — iOS SF Pro / pilot system-ui stack; Title 28 bold, Headline 20 semibold, Body 17, Caption 13 (Band A grades 1–2 uses one step larger minimums). Spacing scale 4/8/12/16/24/32; corner radius 14 cards, 10 buttons. Core components: PrimaryButton, SecondaryButton, QuestionCard, HintButton, ProgressBar, UnlockBanner, ShieldView, StatCard. Single theme source — iOS: `DesignSystem` in EarnPlayCore (no hardcoded colors/fonts outside it); pilot: CSS custom properties in `:root` (no hardcoded hex outside). Color is never the only signal (per accessibility).

## 11. Canonical facts --- Scope \[SSOT-canonical-facts-scope\]

- **Pilot (pre-kickoff, Demo scope):** a quick web-based proof of concept of the core tutor loop --- varied-form challenge questions, the 3-level hint ladder, deterministic effort scoring with the floor rule, a simulated unlock with justification, and an admin transcript view. A switchable model backend drafts tutor messages --- encouragement, probes, hint wording within the code-chosen ladder level --- and judges effort in parallel with the deterministic scorer. Three backends behind one interface: in-browser (WebLLM, small open-weights, lazy-loaded on first user gesture; the default), local (any OpenAI-compatible endpoint on localhost, e.g. Ollama, for testing with bigger models), and cloud (any OpenAI-compatible HTTPS endpoint, key held in memory only, for testing with frontier models). The model's judgment is advisory only (shown beside the scorer's verdict with the backend named, disagreements flagged), the scorer still gates every unlock, and every model draft is validated before display (never reveals an answer; falls back to canned lines) --- identical guardrails on all three backends. The switchable backends are a pilot testing affordance, not the product's selectable-auditor-endpoint design. Two jobs: validate the interaction design with a real child before the iOS build, and test coding-agent (Copilot) build performance on a small, well-specified feature. Web-only: no iOS, no FamilyControls/shields, no trades, no sync. Throwaway code --- nothing from the pilot ships in the iOS app.

- **10-day demo:** child app (diagnostic + challenge questions + shield on 1--2 apps + pass → timed unlock → re-lock) + admin app (pick unblockable apps, set question count / pass bar / unlock duration, see progress --- synced over Bluetooth). Demo moments: hard-trying child earns unlock despite wrong answers; idling child earns nothing; three ways to earn one unlock (practice / movement / chore); auditor catches a staged leniency error. CI pipeline (build/test automation) is Demo scope; archive/TestFlight upload automation is v1 (T7.2).

- **v1:** full flows (including photo-proof async mode, App Store submission).

- **Future (not v1/demo):** parent-selectable audit endpoint (on-device local default; self-hosted; cloud opt-in with bring-your-own key, summaries-only mode, disclosure, no app-side cloud storage); multi-child; speech scoring; fuller curriculum; opt-in cloud sync.

## CI/CD and release \[SSOT-ci-cd-and-release\]

- **CI pipeline:** On every push, CI (Xcode Cloud or GitHub Actions macOS runners) builds the project and runs the test suite automatically (Demo) --- unit tests plus, from T7.6, XCUITest UI smoke tests for the child app (launch and first-screen only; no model-download waiting) and, from T7.7, the full feature-walkthrough suite covering every child and admin feature with example data; archiving and uploading to TestFlight automatically is v1 (T7.2).

- **Division of responsibility:** The assistant generates all code plus the CI configuration; the user does one-time account linking (push code to repo, connect repo to Xcode Cloud / add the App Store Connect API key), files the entitlement (T0.4), tests on-device, and owns App Store review.

- **Signing:** Signing and submission are tied to the user\'s Apple Developer account; the assistant never takes Apple ID credentials.

- **TestFlight entitlement:** TestFlight distribution requires the approved distribution entitlement (T0.4).

- T0.4 (distribution entitlement filing) is v1-blocking, not demo-blocking --- the demo uses the simulated-shield fallback and needs nothing from Apple; the approved entitlement is required only for TestFlight/App Store distribution.

- **Submission scope:** App Store submission is v1 scope, not demo scope; the hackathon submission (Nov 4) is the demo.

## 12. Canonical facts --- Hackathon status \[SSOT-canonical-facts-hackathon-status\]

- Application SUBMITTED 2026-10-17; event page status Pending. Approval notification by Oct 26, 9:00 AM ET. Hackathon Oct 26--Nov 4. Project submissions due Nov 4, 9:00 PM ET.

## 13. Doc map \[SSOT-doc-map\]

Which derived docs mirror which sections of this document.

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Derived document**                                    **Mirrors these sections**
  ------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------
  **Hackathon Application Draft**                         Identity, Product idea (Locking + Effort + Trades + Audit), Assurance, Technical approach, Demo plan, Roadmap (Scope Future)

  **High-Level Design**                                   Identity, Locking, Effort, Questions, Trades, Audit, Assurance, Privacy, Platform, Scope, Pilot

  **High-Level Design --- UX design \[HLD-ux-design\]**   HLD-only detail: screen inventory, key screen descriptions, kids-UX principles, accessibility (no SSOT canonical fact; no LLD/tasks changes)

  **Low-Level Design**                                    Locking, Effort, Questions, Trades, Audit, Assurance, Privacy, Platform, Scope (demo mapping), Pilot (§14.1 module mapping)

  **Build Task Breakdown**                                Scope (Demo/v1/Future tags), Effort numbers, Trade caps, Audit checks, Assurance layers, Pilot (Epic 8)

  **Entitlement Justification**                           Identity (app overview), Platform (APIs), Privacy, Audit/safety (child safety)
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 14. Changelog \[SSOT-changelog\]

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Date**                **Change**                                                                                                                                                                                                                    **Docs updated**
  ----------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- --------------------------------
  2026-10-17              Created from the five existing docs. No fact changes.                                                                                                                                                                         ---

  2026-10-17              Shield exemption question resolved-as-default: enumeration-first architecture; prototype demoted to confirmation-only.                                                                                                        HLD, LLD, Task Breakdown

  2026-10-17              CI/CD and release facts added (Epic 7 tasks; HLD/LLD updated).                                                                                                                                                                HLD, LLD

  2026-10-18              HLD gained a UX design section (screen inventory, key screens, kids-UX principles, accessibility); SSOT doc map updated.                                                                                                      SSOT, HLD

  2026-10-18              Grade made a data-model parameter (demo stays 4th grade); SSOT canonical fact added.                                                                                                                                          SSOT

  2026-10-18              Product target widened to grades 1--5 with grade-adaptive UX bands; HLD UX section updated; demo stays 4th grade.                                                                                                             SSOT, HLD

  2026-10-18              Sync rule gained an impact-tracing step (checker catches drift, not completeness) after grade-band propagation missed LLD/tasks updates.                                                                                      SSOT

  2026-10-18              T0.4 re-labeled v1-blocking (demo uses simulated-shield fallback); no Apple account or entitlement needed for the Nov 4 demo.                                                                                                 SSOT

  2026-10-18              Pilot section added: web PoC of the core tutor loop (validates the interaction design + tests Copilot build performance); HLD §10, LLD §14.1, Epic 8 (T8.1--T8.5, Demo scope); 49 tasks, 38 in the demo definition of done.   SSOT, HLD, LLD, Task Breakdown

  2026-10-18              Tech stack section added: Swift + SwiftUI picked over UIKit (build speed, FamilyActivityPicker is SwiftUI-native, concise for agents); Xcode workspace + shared Swift package; Apple frameworks; quantized on-device model; CI options; pilot plain HTML/JS.                                                                                  SSOT

  2026-10-18              Source layout defined: iOS code repo (EarnPlay/, EarnPlayAdmin/, EarnPlayCore/, EarnPlayTests/); pilot at pilot/ in this repo (index.html, app.js, questions.js).                                                                                                                                               SSOT

  2026-10-19              Design system added (canonical palette hex values, typography, spacing, core components, single-theme-source rule); HLD gained a Design system usage section. Keeps UI code consistent across parallel agents/threads.                                                                                                                    SSOT, HLD
  2026-10-19              Child app main screen is now a conversational chat interface (questions, hints, probes, answers as messages; chat is the surface only, safety-critical decisions stay in deterministic code). HLD Challenge screen rewritten as chat; kids-UX gained a session-script principle; LLD TutorEngine/ReadAloudService updated. New task T1.8 Chat conversation UI (Demo, M); T1.3/T1.7/T6.7 reworded; Demo definition of done 38 → 39 tasks (50 total).                                                                                                                    SSOT, HLD, LLD, Task Breakdown
  2026-10-19              Pilot gains an in-browser model (WebLLM, small open-weights): drafts tutor messages within the code-chosen ladder level + parallel advisory effort judge (scorer still gates unlocks; drafts validated, canned fallback). HLD pilot section, LLD pilot module mapping, new task T8.6 (Demo, M); Demo definition of done 40 tasks (51 total).
  2026-10-19              Pilot model backend becomes switchable (one interface, three backends: in-browser WebLLM default, local OpenAI-compatible localhost endpoint, cloud OpenAI-compatible endpoint with in-memory key); identical guardrails on all backends; judge panel names the backend. HLD pilot section, LLD pilot module mapping, new task T8.7 (Demo, M); Demo definition of done 41 tasks (52 total).
    2026-10-26              M1 doc review resolution (Wonder run): T0.4 scope corrected to v1 in kickoff checklist; T2.2 de-gated from T0.4; T7.2 moved to v1 and T7.5 switched to dev-build verification; T4.3/T4.4 moved to v1 with Demo excerpt-via-flag; T1.4 Band B only; T0.3 gains the reading passage check; LLD gains the skill list + diagnostic set; sync Bluetooth-only; read-aloud Band A auto-read to v1; ChorePoolEntry weekly cap; tasks.json descriptions restored; Demo definition of done 41 → 38 tasks (52 total).   SSOT, HLD, LLD, Task Breakdown, Entitlement, Kickoff
  2026-10-26              Re-review fix: archive/TestFlight upload automation scoped to v1 (T7.2) in SSOT scope + CI sections, HLD demo moments + CI section, LLD §15 jobs tagged v1; Demo pipeline is build+test only (T7.1); tasks.json T5.4 depends order normalized to 03.   SSOT, HLD, LLD, Task Breakdown  
  2026-10-27              Review-request format documented: how to ask Copilot to review a PR with related docs (Review context section in the PR body, @copilot comment for already-open PRs, Start-new-session caveat).   SOP_reviewing_tasks  
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

2026-10-29              Model distribution decided (code-repo issue vhoangvu/earnplay#53): first-launch Wi-Fi download to Application Support, not bundled and not on-demand resources, sha256-verified; SSOT, HLD, LLD
2026-10-30              Child-side practice pipeline decided (code-repo issue vhoangvu/earnplay#63): practice sessions record per-question detail + effort snapshot into SessionLog (questionRecords/effort); new task T4.7 (Demo, M); Demo definition of done 38 -> 39 tasks (53 total). SSOT, HLD, LLD, Task Breakdown 
2026-10-31              XCUITest UI automation added (code-repo issue vhoangvu/earnplay#69): EarnPlayUITests target in project.yml for the child app, wired into the xcodebuild test CI invocation, launch/first-screen smoke tests only; new task T7.6 (Demo, S); Demo definition of done 39 -> 40 tasks (54 total). SSOT, HLD, LLD, Task Breakdown
2026-10-31              XCUITest full feature walkthrough added (code-repo issue vhoangvu/earnplay#71): EarnPlayUITests feature-walkthrough suite driving the production UI through every child and admin feature with example data; new task T7.7 (Demo, L); Demo definition of done 40 -> 41 tasks (55 total). SSOT, HLD, LLD, Task Breakdown
