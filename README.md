# ORIMERI

**Same taste. Different moments. / 品味如常，心境不同。**

A working-name, open-source place investigation app for the Qloo Agentic Hackathon. Keep cultural preferences stable while describing what you want to do now. Inspect the evidence, question one condition, replace one proposal and undo the change.

**Public demo:** https://orimeri.vercel.app

## What it does

The successful result leads with a real source-attributed venue image, a compact visual cultural collection and nearby alternatives. A secondary map provides geographic context; questions attach to specific evidence or unknowns. See [image provenance and rights](docs/IMAGE-SOURCES.md).

- Resolve an artist, film, book, brand, person, TV series or podcast through real Qloo search. Confirm the intended identity instead of blindly taking the first result.
- Describe a moment in natural language. DeepSeek extracts a bounded plan; it does not invent venues or cultural relationships.
- Resolve concrete place categories through Qloo tags, then call Qloo Insights with taste IDs and a hard geographic point/radius filter.
- Independently reject results without coordinates, outside the radius, explicitly excluded, marked closed, or inconsistent with resolved category tags.
- Show actual coordinates on an OpenStreetMap/Leaflet map with a real radius; select the same place in the list or map.
- Separate Qloo data, agent interpretation, measured distance and unverified live conditions. No invented affinity scores or cultural links.
- Challenge a specific condition. A replacement changes one proposal and preserves the other proposals and all long-term tastes. Unverifiable atmosphere questions produce an explicit limitation, not a fabricated answer. Undo restores the preceding result.
- EN / 中文 / 日本語 changes the UI without clearing the current input, selection, preferences, result or history. New agent explanations use the active language. Names and original source content are preserved.
- Save search inputs locally, reopen for a fresh investigation, export or delete local data. The full flow works without login.

**Why Qloo matters:** place candidates and cultural contributions come from the taste graph, not from language-model venue generation. Removing Qloo removes entity grounding, taste-conditioned recommendations and provider attribution. No claim of superior real-user outcomes has been validated yet.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
cp .env.example .env.local
# Set QLOO_API_KEY and DEEPSEEK_API_KEY in .env.local using an editor.
npm run dev -- --port 3107
```

Open http://localhost:3107. Stop with Ctrl+C; restart with the same command. For a production build:

```sh
npm run build
npm run start -- --port 3107
```

The Next.js server hosts both the frontend and `/api/taste` / `/api/discover`. A static-only deployment is insufficient. `.env.local` is ignored by Git. All provider modules use `server-only`; no key is prefixed with `NEXT_PUBLIC_`. Host credentials must be configured as server-side secrets.

## Tests

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e          # isolated synthetic browser error/empty-state tests
npm run test:live         # real browser flow; requires valid server credentials
```

The Playwright configuration uses installed Google Chrome. Override `BASE_URL` to test a deployed app. Browser tests use isolated contexts; their synthetic fixtures are explicitly named and never reachable from production application code. Screenshots, traces and Qloo response artifacts are excluded from Git because provider data must not become a public dataset.

## Boundaries and limitations

- Starting areas: Shibuya/Tokyo, Lower Manhattan/New York, Soho/London, Le Marais/Paris and Jing'an/Shanghai; radii 2/5/10 km. These are circles around named starting points, **not municipal boundaries or route distances**.
- At least one confirmed cultural reference is required. A one-click Brian Eno example is clearly marked as an example, not inferred user preference.
- Noise, crowds, current hours, availability and other live conditions are unverified unless stated otherwise. External map/venue links are for manual checking.
- Geographic and tag checks are internal software checks. They do not establish real-world suitability or independent user validation.
- Email auth, database, transactional mail and cross-device synchronization are **not connected**. `/login` describes that status and offers the working guest route. Local saved moments retain inputs, not historical copies of Qloo data.
- Rate limiting is best effort per server process (20 requests/minute/address/endpoint); this is not a distributed abuse-prevention service. Provider quotas still apply. Server cache is bounded and private, 60 seconds.
- Requests time out and return explicit errors; a 401, 429 or outage never becomes a successful recommendation. API key validity expires under the hackathon's terms; ongoing operation requires continuing provider access.
- Cultural attribution is Qloo's normalized input contribution, **not a probability, rating, or causal proof**.
- Brand name and logo are candidates; no trademark clearance or user acceptance is claimed.

## Architecture

- `src/lib/qloo.ts`: documented endpoints, private cache, safe failure handling.
- `src/lib/deepseek.ts`: schema-validated plan extraction with explicit output language.
- `src/lib/agent.ts`: entity revalidation, category resolution, bounded recommendation and evidence assembly.
- `src/lib/geo.ts`: geographic bounds and coordinate validation.
- `src/lib/i18n.ts`, `src/components/Language.tsx`: complete UI dictionaries and persistent locale.
- `src/components/MapView.tsx`: actual geospatial view.
- `src/app/page.tsx`: state, local preferences, scoped replacement, history and privacy controls.

The project continues an earlier WorkBuddy prototype. Source was preserved in the initial Git commit; the current implementation fixes its ignored free text, soft geographic signal, incorrect search response shape and false live-success states.

## Rules and sources

Verified 2026-10-28. [Hackathon overview](https://qloo.devpost.com/) and [official rules](https://qloo.devpost.com/rules): deadline October 30, 2026 23:45 EDT / October 31 11:45 China Standard Time. A public functional app, public source, open-source license and English description are required. A video is not required. Keep judging access available through the judging period.

[Qloo hackathon guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide), [parameters](https://docs.qloo.com/reference/parameters), [entity search](https://docs.qloo.com/reference/get-search), [tag search](https://docs.qloo.com/reference/search-tags). Only the hackathon base URL accepts hackathon keys. Unsupported parameters may be silently ignored, which is why local geographic validation is retained.

## License and attribution

MIT, see [LICENSE](LICENSE). Existing copyright notice retained. Original code contributions and SVG artwork are covered by the repository license. Qloo data, map tiles, third-party names and trademarks are not relicensed under MIT. Leaflet is BSD-2-Clause; DM Sans is SIL OFL; map attribution remains visible: © OpenStreetMap contributors. Third-party dependency licenses remain in their distributions.
