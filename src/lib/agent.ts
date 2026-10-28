/**
 * The Elsewhere agent — orchestration layer.
 *
 * Pipeline:
 *   1. parseIntent (DeepSeek)         free text → structured intent
 *   2. resolveTasteObjects            names → Qloo entity ids (search)
 *   3. resolvePlaceTags               intent → verified Qloo tag URNs
 *   4. recommendPlaces (Qloo insights) taste + intent + STRICT Tokyo filter
 *   5. buildEvidence                  explainability → traceable reasons
 *
 * Honesty contract:
 *   - We never fabricate a place, image, or fact.
 *   - If Qloo returns nothing, we return an empty result with a notice.
 *   - If an API key is missing, we return a clear "not configured" state
 *     rather than a mock.
 */

import type {
  DiscoveryResult,
  Intent,
  IntentMode,
  ParsedIntent,
  PlaceRecommendation,
  TasteObject,
  TasteObjectKind,
} from "./types";
import { parseIntent } from "./deepseek";
import {
  getPlaceInsights,
  searchEntities,
  searchTags,
  entityDescription,
  entityImageUrl,
  QlooError,
} from "./qloo";
import { INTENT_PROFILES, toIntentMode } from "./intent";

const CITY = process.env.ELSEWHERE_CITY ?? "Tokyo";
const CITY_COUNTRY_CODE = "JP";

/** Map a free-text type hint to a TasteObjectKind for /search `types`. */
const KIND_TO_URN: Record<TasteObjectKind, string> = {
  artist: "urn:entity:artist",
  director: "urn:entity:director",
  brand: "urn:entity:brand",
  author: "urn:entity:author",
  book: "urn:entity:book",
  movie: "urn:entity:movie",
  tv_show: "urn:entity:tv_show",
  podcast: "urn:entity:podcast",
  person: "urn:entity:person",
  other: "urn:entity:person",
};

function guessKind(label: string): TasteObjectKind {
  const s = label.toLowerCase();
  if (s.includes("brand") || s.includes("aesop")) return "brand";
  if (s.includes("director") || s.includes("wong")) return "director";
  if (s.includes("author") || s.includes("writer")) return "author";
  if (s.includes("book")) return "book";
  if (s.includes("movie") || s.includes("film")) return "movie";
  if (s.includes("show") || s.includes("tv")) return "tv_show";
  if (s.includes("podcast")) return "podcast";
  return "artist";
}

/* ------------------------------------------------------------------ */
/* Configuration check                                                 */
/* ------------------------------------------------------------------ */

export interface ConfigStatus {
  qloo: boolean;
  deepseek: boolean;
}

export function configStatus(): ConfigStatus {
  return {
    qloo: Boolean(process.env.QLOO_API_KEY),
    deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
  };
}

/* ------------------------------------------------------------------ */
/* Step 1: intent parsing                                              */
/* ------------------------------------------------------------------ */

export async function resolveIntent(freeText: string): Promise<ParsedIntent> {
  // If DeepSeek is not configured, fall back to keyword heuristics (still
  // honest — we never claim the LLM parsed it).
  if (!process.env.DEEPSEEK_API_KEY) {
    const mode = toIntentMode(freeText);
    return {
      mode,
      tags: { include: INTENT_PROFILES[mode].include, exclude: INTENT_PROFILES[mode].exclude },
      location: CITY,
      summary: `Intent classified as "${mode}" via local heuristics (DeepSeek not configured).`,
    };
  }
  try {
    const parsed = await parseIntent(freeText);
    // Always force the location to the fixed city, regardless of what the
    // model might emit.
    parsed.location = CITY;
    return parsed;
  } catch (e) {
    const mode = toIntentMode(freeText);
    return {
      mode,
      tags: { include: INTENT_PROFILES[mode].include, exclude: INTENT_PROFILES[mode].exclude },
      location: CITY,
      summary: `Intent classified as "${mode}" (DeepSeek unavailable: ${(e as Error).message}).`,
    };
  }
}

/* ------------------------------------------------------------------ */
/* Step 2: taste object resolution                                     */
/* ------------------------------------------------------------------ */

export async function resolveTasteObjects(
  labels: string[],
): Promise<TasteObject[]> {
  const out: TasteObject[] = [];
  for (const label of labels) {
    const clean = label.trim();
    if (!clean) continue;
    const kind = guessKind(clean);
    try {
      const results = await searchEntities(clean, [KIND_TO_URN[kind]]);
      const top = results[0];
      if (top?.entity_id) {
        out.push({
          id: `taste-${out.length}`,
          label: clean,
          entityId: top.entity_id,
          type: kind,
          resolvedName: top.name ?? clean,
          imageUrl: entityImageUrl(top),
          status: "resolved",
        });
      } else {
        out.push({
          id: `taste-${out.length}`,
          label: clean,
          entityId: null,
          type: kind,
          resolvedName: null,
          imageUrl: null,
          status: "unresolved",
        });
      }
    } catch {
      out.push({
        id: `taste-${out.length}`,
        label: clean,
        entityId: null,
        type: kind,
        resolvedName: null,
        imageUrl: null,
        status: "unresolved",
      });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Step 3: place tag resolution                                        */
/* ------------------------------------------------------------------ */

/** Resolve intent keywords to verified Qloo tag URNs. */
async function resolvePlaceTags(
  profile: { include: string[]; exclude: string[] },
): Promise<{ include: string[]; exclude: string[] }> {
  const resolve = async (keywords: string[]): Promise<string[]> => {
    const found: string[] = [];
    for (const kw of keywords) {
      try {
        const tags = await searchTags(kw);
        for (const t of tags) {
          const id = t.id ?? t.value;
          if (id && id.includes(":place:")) {
            found.push(id);
            break; // first matching place tag per keyword
          }
        }
      } catch {
        // skip unresolved keyword
      }
    }
    return found;
  };

  const include = await resolve(profile.include);
  const exclude = await resolve(profile.exclude);
  return { include, exclude };
}

/* ------------------------------------------------------------------ */
/* Step 4 + 5: place recommendation + evidence                         */
/* ------------------------------------------------------------------ */

function buildEvidence(
  place: { name?: string; entity_id?: string },
  explainability: Record<string, unknown>,
  tasteObjects: TasteObject[],
): PlaceRecommendation["evidence"] {
  const evidence: PlaceRecommendation["evidence"] = [];
  const eid = place.entity_id;
  if (!eid) return evidence;

  // Qloo's explainability is keyed by entity id; try several shapes.
  const raw = explainability?.[eid] ?? explainability;
  if (typeof raw === "object" && raw !== null) {
    const contributions = (raw as Record<string, unknown>).contributions as
      | Record<string, number>
      | undefined;
    if (contributions) {
      for (const [sourceId, weight] of Object.entries(contributions)) {
        const match = tasteObjects.find((t) => t.entityId === sourceId);
        const label = match?.label ?? sourceId.slice(0, 8);
        evidence.push({
          source: label,
          weight: typeof weight === "number" ? weight : 0,
          note: `${label} pulled this place into range`,
        });
      }
    }
  }

  // Fallback: if no structured explainability, attribute to the taste set
  // collectively, but mark it as low-confidence (never fabricate weights).
  if (evidence.length === 0 && tasteObjects.length > 0) {
    evidence.push({
      source: tasteObjects.map((t) => t.label).join(" · "),
      weight: 0,
      note: "Qloo surface signal (no per-entity explainability returned)",
    });
  }

  return evidence.sort((a, b) => b.weight - a.weight).slice(0, 4);
}

export async function discover(
  tasteLabels: string[],
  intentMode: IntentMode,
  previousResult: DiscoveryResult | null,
): Promise<DiscoveryResult> {
  const notices: string[] = [];
  const cfg = configStatus();

  if (!cfg.qloo) {
    return {
      taste: tasteLabels.map((label, i) => ({
        id: `taste-${i}`,
        label,
        entityId: null,
        type: null,
        resolvedName: null,
        imageUrl: null,
        status: "unresolved",
      })),
      intent: { mode: intentMode, label: INTENT_PROFILES[intentMode].label, description: "" },
      places: [],
      deltaNote: null,
      notices: ["Qloo API key is not configured. Add QLOO_API_KEY to .env.local."],
      live: false,
    };
  }

  const profile = INTENT_PROFILES[intentMode];
  const intent: Intent = {
    mode: intentMode,
    label: profile.label,
    description: "",
  };

  // 1. Resolve taste objects.
  const taste = await resolveTasteObjects(tasteLabels);
  const unresolved = taste.filter((t) => t.status === "unresolved");
  if (unresolved.length > 0) {
    notices.push(
      `Could not resolve: ${unresolved.map((t) => t.label).join(", ")}. These were skipped.`,
    );
  }
  const entityIds = taste
    .filter((t) => t.entityId)
    .map((t) => t.entityId as string);

  // 2. Resolve intent → tags.
  const tags = await resolvePlaceTags({ include: profile.include, exclude: profile.exclude });

  // 3. Recommend places with STRICT Tokyo filter.
  let places: PlaceRecommendation[] = [];
  try {
    const res = await getPlaceInsights({
      filterType: "urn:entity:place",
      locationQuery: CITY,
      countryCode: CITY_COUNTRY_CODE,
      includeTags: tags.include.length > 0 ? tags.include : undefined,
      excludeTags: tags.exclude.length > 0 ? tags.exclude : undefined,
      interestEntities: entityIds.length > 0 ? entityIds : undefined,
      explainability: true,
      take: 12,
    });

    // Strict filter: drop any place whose geocode country is not Japan.
    const geoFiltered = res.entities.filter((e) => {
      const geo = e.properties?.geocode as
        | { country_code?: string; country?: string; metro?: string }
        | undefined;
      if (!geo) return true; // no geo info → keep (can't prove it's wrong)
      const cc = geo.country_code ?? geo.country;
      return !cc || cc === "JP" || cc === "Japan";
    });

    places = geoFiltered.slice(0, 3).map((e) => ({
      entityId: e.entity_id ?? "",
      name: e.name ?? "Unnamed place",
      category: categoryOf(e),
      address: addressOf(e),
      imageUrl: entityImageUrl(e),
      description: entityDescription(e),
      evidence: buildEvidence(e, res.explainability, taste),
      affinity: affinityOf(e),
    }));
  } catch (e) {
    if (e instanceof QlooError) {
      notices.push(`Qloo request failed: ${e.message}`);
    } else {
      notices.push(`Qloo request failed: ${(e as Error).message}`);
    }
  }

  // 4. Delta note vs previous intent.
  let deltaNote: string | null = null;
  if (previousResult && previousResult.intent.mode !== intentMode) {
    deltaNote = buildDeltaNote(previousResult.intent.mode, intentMode, places);
  }

  return {
    taste,
    intent,
    places,
    deltaNote,
    notices,
    live: true,
  };
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function categoryOf(e: { tags?: { name?: string; value?: string; id?: string }[] }): string | null {
  const t = e.tags?.find((t) => (t.value ?? t.id ?? "").includes(":place:"));
  return t?.name ?? null;
}

function addressOf(e: { properties?: Record<string, unknown> }): string | null {
  const a = e.properties?.address;
  return typeof a === "string" && a ? a : null;
}

function affinityOf(e: { affinity?: number; properties?: Record<string, unknown> }): number | null {
  if (typeof e.affinity === "number") return e.affinity;
  const a = e.properties?.affinity;
  return typeof a === "number" ? a : null;
}

function buildDeltaNote(
  from: IntentMode,
  to: IntentMode,
  places: PlaceRecommendation[],
): string {
  const names = places.map((p) => p.name).join(", ");
  return `Intent shifted from "${from}" to "${to}". Taste unchanged — the same cultural signals now surface ${names || "a different set of places"}.`;
}
