/**
 * DeepSeek client — intent parsing.
 *
 * DeepSeek's only job in Elsewhere is to turn a free-text request into a
 * *structured* intent (mode + constraints). It does NOT invent places or
 * cultural facts — those come exclusively from Qloo. This keeps the product's
 * cultural grounding honest.
 */

import type { IntentMode, ParsedIntent } from "./types";

const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export class DeepSeekError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "DeepSeekError";
  }
}

function apiKey(): string {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new DeepSeekError("DEEPSEEK_API_KEY is not configured", 401);
  }
  return key;
}

const SYSTEM_PROMPT = `You are the intent parser inside "Elsewhere", a cultural place-discovery instrument.
You classify a user's request into a structured intent. You NEVER invent places, facts, or cultural claims — you only classify intent and map it to searchable Qloo tags.

The instrument has exactly three intent modes:
- "social"       — the user wants to be around people, lively, communal.
- "quiet"        — the user wants calm, solitude, low noise.
- "experimental" — the user wants something novel, unconventional, avant-garde.

The location is always "Tokyo" (fixed for this version). Do not change it.

Respond with STRICT JSON only, no markdown fences, matching this schema:
{
  "mode": "social" | "quiet" | "experimental",
  "tags": {
    "include": ["urn:tag:..." or plain english tag keywords],
    "exclude": ["plain english tag keywords"]
  },
  "summary": "one short sentence restating how you understood the request"
}

Rules:
- "include" tags should be concepts Qloo place tags can express (quiet, local, experimental, cafe, jazz, book_store, live_music_venue, bar, gallery, etc). Prefer plain English keywords over guessed URNs.
- "exclude" tags should capture what the user wants to avoid given the mode (e.g. loud, crowded, noisy when quiet).
- Keep summary under 140 characters.
- If the request mixes signals, pick the dominant mode and note the tension in summary.`;

interface DeepSeekChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  choices?: { message?: { content?: string } }[];
}

/** Parse a free-text request into a structured intent. */
export async function parseIntent(input: string): Promise<ParsedIntent> {
  const messages: DeepSeekChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: input },
  ];

  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new DeepSeekError(
      `DeepSeek failed: HTTP ${res.status} — ${text.slice(0, 300)}`,
      res.status,
    );
  }

  const data = (await res.json()) as DeepSeekResponse;
  const raw = data.choices?.[0]?.message?.content ?? "";
  return parseIntentJson(raw);
}

function parseIntentJson(raw: string): ParsedIntent {
  try {
    const obj = JSON.parse(raw) as Partial<ParsedIntent>;
    const mode = normalizeMode(obj.mode);
    const tags = obj.tags ?? { include: [], exclude: [] };
    return {
      mode,
      tags: {
        include: sanitizeTags(tags.include),
        exclude: sanitizeTags(tags.exclude),
      },
      location: "Tokyo",
      summary: typeof obj.summary === "string" ? obj.summary : "",
    };
  } catch {
    // Never crash the instrument on a malformed LLM response.
    return {
      mode: "social",
      tags: { include: [], exclude: [] },
      location: "Tokyo",
      summary: "intent could not be parsed — defaulting to social",
    };
  }
}

function normalizeMode(m: unknown): IntentMode {
  if (m === "quiet" || m === "experimental" || m === "social") return m;
  return "social";
}

function sanitizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    .map((t) => t.trim())
    .slice(0, 12);
}
