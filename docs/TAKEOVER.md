# Takeover — 2026-10-28
Original WorkBuddy source preserved in its original directory; this is the independent working copy. No Git history found in original. Existing MIT license preserved.

Confirmed defects in original: natural language ignored when explicit mode supplied; parsed tags not used; `signal.location.query` incorrectly described as strict; unsupported `filter.include.tags`; unknown coordinates allowed through; exceptions swallowed and `live: true` reported even on failure; guesses for explainability response shape; entity resolution automatically accepted first match.

Initial Qloo official live search probe: HTTP 401, API keys mismatch. This was an actual blocker at takeover; subsequently resolved with the user-provided replacement credential as recorded below.

Sources read 2026-10-28: https://qloo.devpost.com/ and /rules; https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide ; /parameters ; /get-search ; /available-parameters-by-entity-type . Official docs fetched directly because browsing tool failed. Deadline 2026-10-31 11:45 Asia/Shanghai. Public working app + source + open license + English submission required. Keep judging access through November 5 ET. API key expiry after judging is a real lifecycle dependency.

Design follows user's direct implementation instruction, overriding skill mockup/interview gates. Use a restrained spatial editor: stable taste rail, editable moment, geographic field, contextual evidence inspector. Neither mockups nor the rejected Figma define acceptance. Actual browser verification is required.

## Live recovery and sprint
User replaced the Qloo key. Subsequent real entity search, tag lookup, geofenced Insights and DeepSeek requests returned HTTP 200. The first browser pass exposed a same-origin mismatch in development (fixed); a later map initialization error arose from querying an unattached Leaflet circle (fixed using geographic bounds). Initial tests failed and were not counted as passes. UI now uses a lightweight empty-state guide, translated labels, real OSM-backed geographic view and a local-only personal space. Auth/database/mail were not configured; no pretend email authentication added.

## Current design decision
The user rejected the former text-heavy three-column dashboard. The working interface now centers a real venue image, nearby alternatives and secondary geographic context. The visual cultural collection supports selection and identity inspection; contextual questions attach to specific claims. Missing images use typography, never invented artwork. Brand status remains in documentation rather than repeated product chrome. The current contract is DESIGN.md.
