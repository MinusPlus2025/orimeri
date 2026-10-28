# Devpost submission draft — not submitted

## Project name
ORIMERI (candidate name)

## Tagline
Same taste. Different moments.

## Inspiration
A person's cultural taste can stay consistent while what they need from a place changes from one moment to the next. We wanted an interface where a person can change their mind without starting over, and see what evidence a recommendation actually rests on.

## What it does
ORIMERI turns confirmed cultural references and a natural-language moment into a small set of geographically bounded place proposals. It shows the places on a real map, exposes Qloo-supplied cultural evidence, distinguishes agent interpretation from unverified live conditions, and lets a person question one condition. A successful local revision replaces one place while leaving other proposals and long-term tastes unchanged. Undo restores the preceding result.

## How we built it
Next.js and React serve a three-language interface and server-only API routes. Qloo Search resolves identities with explicit confirmation; Qloo Tags resolves categories; Qloo Insights supplies taste-conditioned place recommendations and normalized input contributions. DeepSeek parses the changing request into a schema-validated plan and never generates venue facts. The server checks returned coordinates independently of Qloo's hard location filter and refuses out-of-range or unknown-location candidates. Leaflet and OpenStreetMap display actual geography. Local preferences and saved search inputs are usable without login.

## Challenges
The earlier prototype incorrectly used a soft location signal and discarded free-text constraints. We replaced those assumptions with documented hard filters and independent geographic checks. Live testing also identified ambiguous identity matches, a provider authentication failure and a map initialization defect; these were treated as failures, not hidden behind sample data.

## What is complete and what is not
The final test and deployment record is maintained in docs/VALIDATION.md. Do not submit this draft until its live URL, public repository and production test outcomes are filled in. Email login, cross-device sync, live noise/crowd/opening-hour verification, user-value validation and brand clearance are not claimed.

## Judge walkthrough
1. Continue without login. Use the explicitly labeled Brian Eno example, or search and confirm another cultural reference.
2. Choose Tokyo/Shibuya and 5 km. Enter “A quiet cafe to read for an hour.” Find places.
3. Select a map marker or list row. Inspect Qloo data, interpretation and unverified conditions.
4. Choose “Place category”; ask “Replace this with a book store. No cafes.” Reinvestigate.
5. Observe the retained/added/removed places; undo.
6. Switch EN → 中文 → 日本語 → EN without losing state. Save the moment, open Saved moments, export or clear local data in Privacy & data.
7. Ask to verify the current atmosphere. The app explains that Qloo cannot verify it and keeps the existing proposal.

## Before submission
- Functional public production URL: https://orimeri.vercel.app — public desktop/mobile browser tests passed; see VALIDATION.md.
- Public repository URL: pending publication.
- MIT license: present.
- English description and instructions: this file and README.
- Confirm personal eligibility, team details and ownership. Only the entrant can attest to personal eligibility.
- Final Devpost form submission is not performed by this draft.
