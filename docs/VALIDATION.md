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


## Continuous proposal workspace — 2026-10-31
Implementation commit 7ca912c. Production deployment dpl_EnKMPpotUqz51FcDw8mbEnGdWDK3 is READY at https://orimeri.vercel.app. Culture identity focus, contextual response, before/after replacement and Undo share the selected proposal. Multi-place comparison is limited to the latest replacement.

Build passed. The 13-test browser run initially had one obsolete hidden-collection locator failure (12 passed); the test now enters Edit collection before inspecting restored selections. All seven audit tests then passed, including the new double-revision regression; the other six live/state tests passed in the preceding run. Axe at 390/768/1440 reported zero violations. These are internal tests, not visual approval.

Final production script scripts/verify-shared-space.mjs passed: real Shibuya response HTTP 200 with three places at 1132/1105/1426 m; a real bookstore replacement; Undo; mobile unsupported quietness response; real map tiles; deliberate tile failure followed by successful retry. Mobile question-state axe reported no violations; disabled submit uses dark text on mint. No page exceptions or mobile horizontal overflow. Initial production navigation timed out waiting for all load events; the script now waits for DOM readiness then explicitly verifies each required resource and action.

Raw evidence: artifacts/shared-production/report.json, desktop/culture-focus/question/revision/mobile/mobile-question/map-failure.png and video/. Local build/test logs: artifacts/audit/shared-*.txt. A tracked/browser-file secret scan checked 98 files and found no configured secret values; .env is not tracked.

Independent agent review checked the revision association and stable screenshots and marked those specific findings resolved; this is not independent human usability research or user aesthetic acceptance. External imagery rights/creator metadata remain incompletely supplied by Qloo; see IMAGE-SOURCES.md. Devpost submission has not been performed.


## Complete local moments and personal-space repair — 2026-10-31

Saved format v2 stores the complete investigation, selected place, all original enabled/disabled cultural references, twelve-step Undo history, local revisions and pending contextual question. Data is validated on load. Legacy v1 input-only records remain readable but never invent a missing result or automatically query. Historical snapshots show their save time. Failed browser writes do not announce success. Saving stale/unapplied inputs is disabled. Export includes complete snapshots; clearing local data removes legacy records too.

Removed the nonfunctional account entry; /login redirects to the public guest workspace. Personal panels use content height and explicit padding; empty saves provide a working exploration action. Desktop/mobile navigation and all new copy support EN/ZH/JA.

Local build passed. All 16 Playwright tests passed in 40.8s, including actual Qloo desktop/mobile queries, snapshot restoration after reload, persisted Undo, pending question, three-language local pages, legacy records and blocked storage. Personal-page axe checks and page-overflow checks passed at 390 and 1440. Separate real-data verification used Sahsya Kanetanaka → Utrecht, saved the revised result, reloaded, restored without another discovery request, then restored the original with Undo. See artifacts/audit/local-space-final.txt and artifacts/local-space-live/report.json. The saved.spec.ts fixtures are explicitly synthetic; the live script uses actual provider responses.

No cloud account/sync, independent user validation or design acceptance is claimed. Browser storage can be cleared by the user/browser; historical images and external provider URLs may later expire.

Production local-space verification passed after one transient example-resolution failure: actual API probe returned HTTP 200 with 8 matches, and the full retry restored Utrecht and Undo returned Sahsya Kanetanaka with exactly two discovery calls total. Evidence: artifacts/local-space-public/report.json and three-language desktop/mobile captures.

Follow-up input fix: the legacy white search wrapper conflicted with the dark input. The wrapper now owns the surface and the input is transparent; focused desktop/mobile colors were inspected after the 180 ms transition. Independent review also found that corrupt preference JSON could skip reading valid saves and an automatic persistence effect could overwrite them. Preference/snapshot reads are now independent; snapshots write only on explicit save/delete/clear. Added corrupt-preference regression passed with six other saved/state tests (7 passed, 11.5s). Evidence: artifacts/audit/input-save-tests.txt and artifacts/input-fix/.

## Motion and goal audit — 2026-10-31

Native Web Animations transitions now connect cultural-image focus/return, real local place replacement and reverse Undo. Animation owns presentation only; state commits once. Scroll/resize and repeated actions cancel transient overlays without reverting data. No dependency or backend contract changes.

Internal evidence: `artifacts/motion-desktop/report.json` and `artifacts/motion-mobile/report.json` record real HTTP 200 discovery, 3 Shibuya candidates within 5 km, real local replacement, Undo, actual running browser animations, reduced-motion zero spatial animations, tile failure/retry and no page errors/overflow. Browser-emulated mobile is not physical-device verification. `artifacts/audit/motion-regression.txt`: 17 passed; core tests: 8 passed. These runs precede the final scroll-cancellation adjustment; final regression is recorded separately.

Goal audit: functional progress is not design acceptance. The result remains a photograph/evidence/alternatives composition, cultural focus remains largely explanatory, and mobile content is long. No independent user task study, Qloo-versus-generic baseline, or evidence of superior user outcomes exists. Quietness, current hours and seat availability remain explicitly unverified. Do not market these as fulfilled preferences. Image delivery provenance is known; individual image display licenses and original-credit obligations are not fully verified. Personal eligibility and Devpost submission receipt remain unconfirmed. Cloud accounts are not implemented and are not required for the guest core.

Official sources rechecked: https://qloo.devpost.com/ and /rules. Deadline October 31, 2026 11:45 Asia/Shanghai. Public functional demo, public open-source repository, English submission material, third-party permissions, entrant eligibility and final form submission are separate gates. Four equally weighted judging dimensions: implementation, design, potential impact and quality of idea. Current tests cannot establish award readiness.

## Decision workspace revision
- 17 browser tests passed in 37.4 seconds (`artifacts/audit/decision-workspace-tests.txt`). Desktop and 390 px browser recordings each ran actual Qloo discovery, local bookstore replacement, Undo, failed verification, real map loading and injected map failure/retry (`artifacts/decision-desktop`, `artifacts/decision-mobile`). Question regions had zero violations in the configured axe scan. These are internal tests, not physical phone or independent user validation.
- Final recovery-link addition compiled; production behavior is checked separately after publishing.
- Commercial maturity remains unproven: no paid-user/retention evidence, no controlled taste-quality comparison, no cross-instance distributed rate limit or verified unit economics. The current in-memory rate limiter is demo protection, not a production-wide spend cap. Do not claim commercial launch readiness or complete legal eligibility.

Production decision-workspace deployment: `dpl_RLAqZ7UkonC4JoB61vsWc1h9HCrP`, READY, alias https://orimeri.vercel.app, code commit b0fcbdf. First production run failed to select Brian Eno within 30 seconds (`artifacts/audit/decision-public.txt`); root cause remains unresolved. A diagnostic returned HTTP 200 with 8 entity candidates. One complete retry then passed real discovery/replacement/Undo, loaded tiles, injected failure recovery, zero page errors and no horizontal overflow (`artifacts/decision-public-retry/report.json`). Do not describe one successful retry as proof of long-term reliability. The first diagnostic script itself had a status-property typo, corrected before the successful probe; this was not an application defect.

## Empty-intent root cause and repair — October 31
The user's live production DOM was inspected directly: `#moment.value === ""`, `defaultValue === ""`, while `placeholder` contained the long Chinese cafe example. The UI made an example look entered; the controlled state and submitted `moment` field were not inconsistent. The local `trim()` guard blocked the request before the API. The replacement uses a short instruction placeholder and a separate explicitly unentered example with a button that writes the actual controlled state. Empty/short input disables discovery, input correction clears needMoment, and direct validation focuses the field.

`verify-moment-input.mjs` tested Aesop selection, empty/cleared input, real example insertion, three languages, deselection/reselection without input loss, real HTTP 200 discovery and refresh policy. Request: moment = the user's full Chinese cafe request, areaId tokyo, radiusM 5000; real results Fuglen Tokyo (1078m), Tokyo Kenkyo (739m), Mocha Coffee (1194m). 0 invalid discovery requests. Evidence in artifacts/moment-input/report.json. Seven saved/error/browser tests passed in 8.3s. This is local production-build verification; public verification is separate.

The earlier entry fix additionally passed selection/reload/deselection and EN/ZH/JA at 1440 and 390 widths. A real five-reference mobile overflow was found and fixed, rather than treating the earlier one-reference test as adequate coverage.

## Final production gate — 0a8904b
Vercel deployment dpl_GD4KybSoAK6MPPUtkARdRdvaiXyP is READY on https://orimeri.vercel.app. Public Aesop input test: PASS, HTTP 200, exact nonempty Chinese moment, no invalid calls (artifacts/moment-input-public/report.json). Public 390 px five-reference Moment Space test: PASS for real query, coordinates within 5km, explicit unknown quietness, local replacement, before/after, Undo with five tastes preserved, reduced motion, real map and tile-failure recovery; zero page errors and horizontal overflow (artifacts/final-five-public/report.json). Per-place category exclusion is based on returned Qloo tags, not independent on-site verification. The configured axe scan of the question region reported no violations; full WCAG 2.2 conformance is NOT TESTED. Physical phone testing and independent user testing are NOT TESTED.

Devpost project https://devpost.com/software/orimeri has a saved submission draft (4/5), English description, public links and three real screenshots. This is NOT SUBMITTED. Final terms consent has not been provided; a website security check also interrupted further editing. Do not treat this URL as submission proof until the dashboard confirms submitted status.

## Appearance and spacing — October 31
Added independent system/light/dark appearance control with browser persistence and semantic studio tokens. No image inversion/filter. Composer padding is 16 px desktop / 14 px mobile; label gap is 14 px; focus is a single inset boundary. Compact selection labels replace full-width bars; mobile collection is a horizontally scrollable shelf. Existing culture focus, replacement and Undo motion retained; selection confirmation and local question reveal added with reduced-motion support.

Internal browser verification: artifacts/appearance/report.json covers 1440/390, three modes, three locales, system preference changes, persistence, preserved input/taste, zero discovery calls during switching, and no axe violations in settled states. Initial harness needed explicit browser context; a transient-state contrast result disappeared after waiting for the existing language transition. artifacts/ui-final/report.json records real HTTP 200 Qloo search, local replacement/Undo, all three result themes with no extra API calls, real tiles/failure recovery, reduced motion, no errors/overflow. Seven saved/error tests passed (artifacts/audit/ui-final-regression.txt). Final single focus-boundary styling is checked after deployment. This does not claim aesthetic acceptance, physical phone testing, full accessibility conformance or completed submission.
