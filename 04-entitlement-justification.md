**EarnPlay --- FamilyControls Entitlement Request Justification**

*Family Controls (Distribution) entitlement --- paste-ready draft • One request per bundle ID*

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Note --- how to use this draft:** Map each numbered section below to the closest field on Apple\'s Family Controls (Distribution) entitlement request form, and paste the text in. File early --- review typically takes days to weeks, and Apple processes one request per bundle ID. Fill in every \[bracketed\] placeholder in Section 8 before you submit.
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# 1. App overview \[ENT-app-overview\]

EarnPlay is a parental-control and tutoring app for families with elementary-school children. It has two apps: a child app (AI tutor + app locker + challenge gate) and a parent admin app (policy, progress dashboard, decision log, audit). All apps on the child\'s device are locked by default. In the admin app, the parent picks the \'unblockable\' list --- the only apps a challenge can open. The child earns timed unlocks by completing AI-tutored practice challenges, or through AI-offered movement or chore trades. There are no accounts, no ads, no tracking, and no child data ever leaves the devices.

# 2. APIs used \[ENT-apis-used\]

- **FamilyControls:** the parent grants authorization in Screen Time during setup. The app obtains opaque tokens for the apps and categories the parent picks via FamilyActivityPicker. The child app never learns which apps are installed beyond the parent\'s explicit picks.

- **ManagedSettings:** applies shields to locked apps, lifts a shield for the earned unlock duration, and re-applies the shield when the time expires. The child app enforces the parent\'s policy, cached offline.

- **DeviceActivity:** not used. Usage and effort are measured inside the tutor app\'s own sessions, not via DeviceActivity. We request only the access the app needs.

# 3. Why the entitlement is required \[ENT-why-the-entitlement-is-required\]

The app\'s core function --- keeping apps locked until the child completes a practice challenge --- cannot be implemented without ManagedSettings shields. There is no alternative public API for app-level locking on iOS. Without this entitlement, EarnPlay cannot exist.

# 4. Authorization and parental consent \[ENT-authorization-and-parental-consent\]

The parent (device organizer) grants FamilyControls authorization during setup in Screen Time. Only the parent\'s admin app sets policy: which apps are locked, unlock durations, the chore pool, and trade caps. The child cannot change policy, cannot grant themselves unlocks, and cannot delete the child app to escape locks if the parent enables Screen Time\'s prevent-deleting-apps setting, which setup documents.

# 5. Privacy and data handling \[ENT-privacy-and-data-handling\]

All processing happens on-device. There are no network calls at practice time, no accounts, and no child data stored off-device. Session logs sync between the two apps over Bluetooth (MultipeerConnectivity) only. No advertising, no analytics SDKs, no data sale, no third-party tracking. The app does not request the child\'s name, age, or any personal information beyond what the parent enters for policy.

# 6. Child safety \[ENT-child-safety\]

Content is age-appropriate tutoring in elementary math and reading. Unlocks reward effort, not perfection. The tutor AI\'s decisions are justified in writing and audited by a second on-device model; deterministic code holds every safety-critical decision (solver-verified answers, hard rule gates the model cannot override). There are no social features, no chat, no contact with strangers, and no user-generated content.

# 7. Who uses it \[ENT-who-uses-it\]

Parents and guardians of elementary-school children who want screen time earned through practice rather than enforced by timers alone.

# 8. Placeholders to fill before filing \[ENT-placeholders-to-fill-before-filing\]

Replace each placeholder below before submitting. Submit a separate request for each bundle ID that needs the entitlement.

- \[Bundle ID\]

- \[Apple Developer Team ID / account name\]

- \[Contact name\]

- \[Contact email\]

- \[Intended distribution: TestFlight / App Store\]

*End of draft --- copy Sections 1--7 into the matching fields on Apple\'s request form.*
