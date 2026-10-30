# ORIMERI — Gate 1, two unapproved directions

Status: Stage 0 evidence inspected; Stage 1 implemented for visual comparison. Neither direction has user approval. Gate 2/3 integration must wait. Existing `/`, Qloo adapter, DeepSeek planning, geographic filtering, state/Undo and locale implementation were preserved.

## Primary evidence and constraints
Read current page/state handling, CSS, SourceImage, MapView, Language, Brand, types, discover handler, Qloo adapter, DeepSeek planner, guard and image-rights record. Inspected prior full private request/response, then made a fresh query using all five required references: Brian Eno, The Little Prince, In the Mood for Love, Dieter Rams, Aesop. Query asks for quiet reading, some everyday life, Shibuya 5km and no bars. A and B share the same actual response ID via bounded server cache and session storage. They do not substitute authored venue data.

Actual response fields: entity ID, name, primary category, address, coordinates, calculated distance, Qloo image URL, website, normalized contribution evidence, parsed request, unknowns and investigation steps. Qloo photo quality varies: Dieter Rams returned a tiny image, handled by typographic identity fallback. Author/individual image-license metadata, current noise, seats and hours remain unavailable. API delivery provenance is not a copyright-license assertion.

Rejected visual directions are explicit anti-references: overlapping rings, cream/gray/purple/brick-red form, conventional result cards plus map, empty cultural placeholders, static presentation composition. Existing public deployment is not the approved visual source of truth.

## Three actual reference products
Research scope: official product descriptions, manuals and their published interface examples, not a claim of logged-in hands-on testing.

1. Ableton Live Session View — https://www.ableton.com/en/manual/session-view/
   Clips occupy stable positions, can be selected independently from launching, and alternatives can be revisited without destroying the session. Borrow: keep stable cultural inputs anchored while switching the proposed object; visible selection and keyboard-operable switches. Do not copy the clip matrix or claim music playback.
2. Lightroom local masking — https://helpx.adobe.com/lightroom/desktop/edit-photos/masking.html
   Select an image region, expose controls tied to that selection and preserve the original image. Borrow: a specific disputed property becomes the focus of a local inspection area; the proposal stays visible while the working area changes. Do not imply the venue photo proves noise or generate segmentation overlays.
3. Are.na — https://www.are.na/
   Images, text and other media retain their content identities in editable collections; content can be reused across contexts. Its custom typeface also demonstrates identity through functional typography. Borrow: varying cultural media proportions, persistent named objects and provenance, rather than identical blank containers. Do not invent recommendation relationships or copy its interface.

## A — Image workbench
Dark green-black surface selected for an image-editing viewing context, not because the product uses AI. Pale, high-contrast type and a single lime action signal keep the original images visually dominant. Space Grotesk handles both operation and object titles. Original cut-square vector lettering carries the identity without a separate pictogram.

Topology: stable vertical cultural reference track; primary image and two narrower alternate image windows; place title and three direct evidence controls beneath. On phones the cultural track becomes a compact horizontal strip before the proposal. Clicking evidence expands an inspection region and reduces the image height; switching candidate replaces the image/title in-place. Risk: the software-tool character may feel too technical; long-session comfort still requires human use.

## B — Cultural editorial workspace
Bright white reading surface with a saturated blue identity band, dark blue body text, and Newsreader for object titles. Space Grotesk provides smaller operational text. Independent geometric index mark plus a lighter, rounded custom wordmark; all are editable vectors.

Topology: title and direct evidence controls on the left, a large real image on the right, alternatives as small content-linked switches, and a horizontal cultural reference collection. On mobile the title precedes the image. Risk: editorial hierarchy may communicate reading more strongly than active manipulation; inspect the actual focus interaction before selecting it.

## Tokens and typography
All new palette values live in the two root blocks in `src/app/directions/directions.css`; incumbent global tokens are untouched. Foreground, secondary, accent/on-accent, warning, error, focus, surfaces, typography and motion duration are centralized. Open fonts are self-hosted from Fontsource: Space Grotesk and Newsreader, with bundled OFL files. Chinese/Japanese use specified platform fallbacks; native-language editorial review is not claimed.

`scripts/check-direction-contrast.mjs` checks 16 actual token pairings. Lowest normal-text ratio is 6.04:1, exceeding 4.5:1. This is a color-pair check, not comprehensive WCAG conformance. Image credit labels use solid surfaces; no text depends on photo contrast.

## Exact Gate 1 implementation boundary
Working: real five-reference retrieval, same-result A/B switch, candidate selection, culture identity/source inspection, evidence expansion, question draft, actual coordinate view, responsive composition, reduced-motion behavior. Candidate transitions and focus-region compression run 240ms. Unknown conditions remain explicitly unknown.

Intentionally not wired in these previews: submitting the question to Agent, revising results, Undo, reference editing, language switching and account operations. Question submission is visibly disabled and labelled Gate 2. Existing production functionality remains available at `/`; none of the unwired preview actions is represented as complete. Current page is a review surface in the existing project, not a second independent product.

## Editable files
- src/app/directions/page.tsx — two actual compositions and local focus state.
- src/app/directions/directions.css — two scoped token systems, layout and motion.
- src/components/directions/Identity.tsx — original vector identities.
- src/app/api/design-preview/route.ts — bounded shared real query, existing Agent reused.
- public/brand/directions/{a-wordmark,b-wordmark,b-symbol}.svg — editable source.
- scripts/review-directions.mjs — actual browser captures and click checks.
- scripts/review-direction-marks.mjs — 16/32/64px positive/inverse inspection.
- scripts/check-direction-contrast.mjs — reproducible contrast measurements.

## Review artifacts
Private `artifacts/gate1/`: A/B desktop 1440×900 and mobile 390×844 screenshots, full-length captures, question states, real interaction recording, logo size/inverse sheet, contrast JSON and full private actual response. No Qloo response dump is committed or bundled as public sample data.

Gate 1 awaits the user's actual visual choice. Gate 2/3 are not declared passed on the basis of these preview tests.

## Internal checks — 2026-10-29
The final browser run used response `ab72c3b2-9e20-4ef4-b0ae-d544932c233e`: Sahsya Kanetanaka (1132 m), Salon de Thé ROND (2382 m), Fleur Universelle (2216 m). All five references resolved; the parsed exclusion includes bar. Distances are calculated straight-line distances, not travel routes. A/B retain the identical response.

Build and type checking passed. Browser checks exercised culture identity, candidate selection, evidence, question drafting, both viewport sizes and reduced motion. Final four viewport screenshots were visually inspected: primary imagery loads, no horizontal overflow was observed, and the five cultural objects are visible on mobile. The 18 vector size/polarity renderings were inspected; this establishes rendering, not brand clearance or user approval.

Remaining findings: the motion detector flags an animated height property; smoothness under low-powered devices has not been profiled. The existing Agent response also lists the requested geographic bound among unknowns even though the server independently verifies coordinates/distances. The preview presents the verified geometry separately; reconciling that model wording belongs to the next functional integration. Quietness, seating and current opening hours remain unverified. Image delivery from Qloo is verified; individual reuse licenses are not supplied by the response.
