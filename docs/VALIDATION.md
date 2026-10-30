# Validation — 2026-10-28

## Running delivery
- Public application: https://orimeri.vercel.app
- Final deployment: dpl_2VzZ3tXcpXvqDsgQfsW7VZt1mhCw, Vercel READY. Both frontend and server-only APIs deployed.
- Source baseline preserved in commit 6a500db; original WorkBuddy directory untouched.

## Internally tested
- Production build and TypeScript passed.
- Six core unit/integration checks passed: geography, dictionary coverage/fixed slogans, Qloo schema handling, provider failures, invalid model plans and hard-filter/exclusion enforcement. Synthetic fixtures are isolated to tests.
- Six browser tests against the PUBLIC URL passed in 56.8 seconds: desktop real investigation; 390×844 mobile viewport real investigation; real Paris 2km geographic change; synthetic error/edit/privacy controls; synthetic empty/network failure; honest guest entry.
- Desktop and mobile real flows cover Brian Eno resolution, selected count, deselect/reselect, identity inspection, deletion/re-add, Tokyo/Shibuya 5km query, list and map selection, unsupported live-atmosphere question, book-store replacement, Undo, language preservation, completed Chinese/Japanese explanations and local saved inputs.
- Paris 2km returned HTTP 200 and 3 places; each returned coordinate was checked against the selected radius. No boundary was widened.
- Public browser script audit checked 7 received JavaScript bundles and found zero configured credential values. Local tracked-source/client-bundle scan also found zero; .env.local is untracked. This is not a comprehensive third-party security audit.

## Actual recorded demonstration
`scripts/record-demo.mjs` operated the public application in a real Chrome browser and recorded:
1. HTTP 200: Sahsya Kanetanaka, Spiral, PARADISE TOKYO / WACKO MARIA.
2. Clicked Brian Eno identity details, selected another venue and expanded Qloo evidence.
3. Asked whether the selected place was quiet now: actual CONDITION_UNVERIFIABLE response, original proposal kept.
4. Asked for a book store with no cafes: a real replacement, Utrecht, returned.
5. Undo restored the preceding proposals.

Local evidence (excluded from the public source tree):
- artifacts/result-desktop.png — populated desktop result.
- artifacts/mobile-live.png and mobile-live-ja.png — populated mobile viewport.
- artifacts/cultural-identity.png and source-evidence.png — direct object/evidence interactions.
- artifacts/question-unverified.png — explicit unsupported live condition.
- artifacts/proposal-revised.png and proposal-undone.png — real replacement and restoration.
- artifacts/orimeri-real-interaction.webm — actual browser recording, not a motion mockup.
- artifacts/playwright-results.json — browser test report.
- artifacts/demo-provenance.private.json — private actual request/response evidence; not a public Qloo dataset.

## Corrections discovered by testing
- Original key rejection resolved with user's updated server credential.
- Incorrect API response shape, soft geography and false success states corrected during takeover.
- Map initialization, clustered-place selection and hidden-container viewport recovery corrected from actual browser failures.
- Stale local cultural entries can receive current image metadata from resolved examples. A 30×30 Dieter Rams image was observed from Qloo; low-resolution, failed and timed-out previews now use typography, never fabricated art.
- Chinese/Japanese screenshots initially captured pending translations. Tests now wait for completion and assert English unknown-condition text has changed.
- The earlier three-loop visual direction was replaced with a folded-aperture candidate and cut-terminal wordmark. The user has NOT approved the final visual design.

- Final video inspection found and corrected small-avatar fallback overflow and an image-cache/load timeout race. Final browser recording was regenerated after correction. One recording attempt timed out waiting for the selected entity control; its network cause was not independently established. Waiting for client readiness and rerunning the actual flow succeeded (HTTP 200 discovery, explicit unsupported-condition response, Utrecht replacement and Undo).

## Current scope and gaps
Latest user direction restricts this round to the real result experience and brand system. No further homepage expansion or full account system was pursued. Public GitHub publication and final Devpost submission are not completed in this round.

No physical-phone testing or independent real-user validation. Mobile tests are Chrome viewport emulation. No verified current opening hours, noise, crowd or availability. Individual image-license/photographer metadata is not consistently supplied by Qloo; see IMAGE-SOURCES.md. Email authentication, cloud synchronization, brand clearance and native-Japanese human editorial review remain unverified/unimplemented. Internal checks and reviewer inspection do not constitute user design acceptance or a guarantee of competition success.


## 2026-10-31 result workspace redesign

Implemented graphite/mint design tokens, editable stencil SVG wordmark, photographic primary proposal, nearby image strip, and direct condition-question controls. Existing Qloo/DeepSeek contracts and Undo remain intact.

Local production build passed. Browser suite: 12 passed (30.8s), including live desktop/mobile investigation and Paris 2 km constraints. Actual Shibuya query returned HTTP 200. Contextual quietness question returned CONDITION_UNVERIFIABLE, without inventing a live noise assessment. Axe scans at 390/768/1440: zero reported violations; no horizontal page overflow or browser exceptions. Language switching issued translation requests, no extra discovery requests.

Evidence: artifacts/studio/{desktop,mobile,tablet,question}.png, browser-observations.json, video/; artifacts/audit/studio-tests.txt and studio-build.txt. These are local, ignored artifacts. Automated scans do not establish comprehensive accessibility or aesthetic acceptance. User visual acceptance remains pending. Venue imagery is supplied by Qloo; no fabricated covers or live venue properties added.

Production release: 7093dc0, Vercel dpl_AHc3hjuBrMq1ZnGLANsF3vxWH9kC, https://orimeri.vercel.app. Production live suite: 3 passed (34.9s). Additional 390px real-query check verified all three direct condition buttons update selected state and focus the contextual input. Production axe 390/768/1440 reported zero violations and no page overflow. Production browser screenshots/video are in artifacts/studio-public/.

Observed limitation: the production desktop capture showed coordinate markers and radius before external OpenStreetMap tiles rendered; four tile requests were aborted during the viewport sequence. Local captured map tiles rendered. Do not claim universal basemap availability. Qloo coordinates and list selection remain available. Current quietness/opening conditions remain unverified; no independent aesthetic acceptance or comprehensive accessibility certification.
