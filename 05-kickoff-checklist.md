**EarnPlay --- T0.1 + T0.4 Kickoff Checklist**

*Work through this in order: T0.1 first, then T0.4. T0.4 needs the bundle IDs and Team ID that T0.1 and enrollment produce.*

# Purpose

Start the EarnPlay build on its critical path. T0.1 → T0.4 comes first because Apple's entitlement review runs on Apple's clock --- it takes days to weeks and cannot be rushed. (The urgency is v1/TestFlight lead time; the demo itself runs on the simulated-shield fallback and needs nothing from Apple.) Everything else in the build can wait for the hackathon window; this filing cannot.

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Rule:** Use a PERSONAL Apple ID for everything in this checklist --- Xcode, enrollment, and the entitlement filing. Never a work Apple ID. EarnPlay is a personal project.
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# A --- T0.1 Project scaffolding

*Size S · Scope: Demo · Dependencies: none*

> **\[ \]** Sign into Xcode with your personal Apple ID (Xcode → Settings → Accounts).
>
> **\[ \]** Create the Xcode workspace with two app targets:
>
> **\[ \] EarnPlay** --- the child app
>
> **\[ \] EarnPlay Admin** --- the parent/admin app
>
> **\[ \] Add one shared Swift package** for the models and schemas both apps use.
>
> **\[ \]** Choose the bundle-ID prefix (reverse-domain, e.g. com.\<yourname\>.earnplay) and create one bundle ID per target.
>
> **Bundle-ID prefix:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
>
> **EarnPlay bundle ID:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
>
> **EarnPlay Admin bundle ID:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
>
> **\[ \]** Create the git repo and make the initial commit.
>
> **\[ \]** Verify the setup:
>
> **\[ \] xcodebuild build** succeeds for both schemes with zero errors.
>
> **\[ \]** The unit-test target runs.
>
> **\[ \]** Both targets build and run on a physical device.

## Acceptance criteria

> **\[ \]** Both targets build and run on a device.
>
> **\[ \]** Both bundle IDs are recorded above, in the project.

**References:** SSOT-canonical-facts-identity; HLD-product-overview; HLD-system-architecture; LLD-module-map; APP-technical-approach; ENT-placeholders-to-fill-before-filing

# B --- Apple Developer Program enrollment

*Prerequisite for the T0.4 distribution filing.*

> **\[ \]** Enroll at developer.apple.com with the SAME personal Apple ID used in Xcode. Paid membership, \$99/year --- needed for TestFlight / App Store distribution and for the distribution entitlement request.
>
> **\[ \]** After enrollment, find your Team ID: developer.apple.com → Account → Membership (also visible in Xcode → Settings → Accounts).
>
> **\[ \]** Record the Team ID and account name:
>
> **Team ID:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
>
> **Account name:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

# C --- T0.4 Entitlement filing

*Size S · Scope: v1 · Depends on: T0.1 (Section A) and enrollment (Section B)*

> **\[ \]** Fill every placeholder in the prepared Entitlement Justification draft:
>
> **\[ \] \[Bundle ID\]** --- both targets' bundle IDs, from Section A
>
> **\[ \] \[Team ID / account name\]** --- from Section B
>
> **\[ \] \[Contact name\]**
>
> **\[ \] \[Contact email\]**
>
> **\[ \] \[Intended distribution: TestFlight / App Store\]**
>
> **\[ \]** Sign in at developer.apple.com → Certificates, Identifiers & Profiles / entitlement requests, and file the FamilyControls (Distribution) entitlement request using the filled justification.
>
> **\[ \]** Enable the development entitlement in the Xcode project.
>
> **\[ \]** Verify:
>
> **\[ \]** The portal shows the request in submitted / pending state.
>
> **\[ \]** A build using the development entitlement compiles and runs locally.

## Acceptance criteria

> **\[ \]** The distribution request is filed.
>
> **\[ \]** A build using the development entitlement compiles and runs locally.

**References:** SSOT-canonical-facts-platform-and-entitlement; HLD-platform-constraints-and-open-questions; LLD-shield-manager; APP-10-day-build-and-demo-plan; ENT-app-overview; ENT-apis-used; ENT-why-the-entitlement-is-required; ENT-placeholders-to-fill-before-filing

# D --- After filing: what to track

> **\[ \]** Mark T0.1 and T0.4 Done in the EarnPlay Build Dashboard as each completes.
>
> **\[ \]** Watch for Apple's entitlement decision. It takes days to weeks; no action is needed while it is pending.
>
> **\[ \]** Next tasks, per the dashboard: T0.2 Model runtime spike, T0.3 Solver service, and T2.1 (unblocked once T0.1 is Done).
>
> **\[ \]** Filing is independent of hackathon acceptance --- it can and should happen before Oct 26. The hackathon approval notification arrives by Oct 26, 9:00 AM ET.
