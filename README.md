# Elsewhere

> **Your taste stays the same. Your intent changes.**

Elsewhere is a cultural place-discovery instrument for **Tokyo**. You tell it what you
*durably love* — an artist, a director, a brand — and then turn a dial on how you feel
*right now* (more social / more quiet / more experimental). The instrument recomposes
the city around your taste while your intent shifts, with every recommendation traced
to a real Qloo data signal.

Built for the [Qloo Agentic Hackathon](https://qloo.devpost.com/).

---

## How it works

```
free-text intent ──► DeepSeek (structured intent: mode + constraints)
                          │
taste objects ──► Qloo /search (resolve names → entity ids)
                          │
                          ▼
          Qloo /v2/insights (places, STRICT Tokyo filter,
                             per-entity explainability)
                          │
                          ▼
          three real places + a traceable "why" per place
```

The product's central claim is encoded directly in the data model:

- **Taste** — the durable, editable set of cultural objects you love. It *does not change*
  when you switch intent.
- **Intent** — the mutable mode (`social` / `quiet` / `experimental`). Flipping it re-runs
  the same Qloo query with *different place tags*, so recommendations change while taste
  stays fixed.
- **Discovery** — the computed result, showing each place plus the Qloo explainability
  contributions that surfaced it.

### Honesty contract

- We **never fabricate** a place, image, or fact. Every recommendation comes from a real
  Qloo call.
- If Qloo is not configured or returns nothing, the UI shows an explicit *not configured*
  / *no results* state — never a mock.
- `Tokyo` is applied as a **strict filter** (`signal.location.query` + `filter.geocode.country_code=JP`),
  not merely a soft preference. Results are additionally filtered server-side to drop any
  entity whose geocode country is not Japan.

---

## Getting started

### Prerequisites

- Node.js 18+ (developed on Node 24)
- A Qloo Hackathon API key (from the [developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide))
- (Optional) A DeepSeek API key for structured intent parsing

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `QLOO_API_KEY` | **yes** | Qloo Hackathon API key (sent via `X-Api-Key` header) |
| `DEEPSEEK_API_KEY` | no | DeepSeek key for intent parsing; falls back to local heuristics if unset |
| `QLOO_API_BASE_URL` | no | Override the Qloo base URL (defaults to `https://hackathon.api.qloo.com`) |
| `DEEPSEEK_BASE_URL` | no | Override DeepSeek base URL (defaults to `https://api.deepseek.com`) |
| `DEEPSEEK_MODEL` | no | Defaults to `deepseek-chat` |
| `ELSEWHERE_CITY` | no | Defaults to `Tokyo` |

> **Security:** API keys live **only** in `.env.local` (git-ignored) and are read
> exclusively on the server. They are never exposed to the browser. All Qloo and
> DeepSeek requests originate from the Next.js server.

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000.

---

## Project structure

```
src/
  app/
    page.tsx               # the instrument UI (client)
    layout.tsx
    globals.css
    instrument.css         # design system + component styles
    api/discover/route.ts  # server-side agent endpoint
  lib/
    types.ts               # domain model (Taste / Intent / Discovery)
    qloo.ts                # Qloo API client (auth, retry, cache)
    deepseek.ts            # DeepSeek intent-parsing client
    intent.ts              # intent → Qloo tag profiles
    agent.ts               # orchestration pipeline
```

## API

- `GET  /api/discover` — reports configuration status (no secrets).
- `POST /api/discover` — run discovery. Body:
  ```json
  {
    "taste": ["Brian Eno", "Wong Kar-wai", "Aesop"],
    "intent": "quiet",
    "freeText": "I want somewhere calm to think",
    "previousIntent": "social"
  }
  ```

## License

[MIT](./LICENSE)

---

*This project was built with AI coding assistance under human direction.*
