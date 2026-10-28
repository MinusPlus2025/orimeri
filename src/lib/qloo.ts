/**
 * Qloo Hackathon API client.
 *
 * Endpoints used (verified against https://docs.qloo.com):
 *   - GET /search?query=…&types=…        resolve names → entity ids
 *   - GET /v2/tags?filter.query=…        search tag URNs
 *   - GET /v2/insights                    taste-driven recommendations
 *
 * Auth: `X-Api-Key` header (NOT Bearer).
 * Base URL: https://hackathon.api.qloo.com
 *
 * Behaviour guarantees (important for honesty of the product):
 *   - We retry 429 with exponential backoff; a 429 is NEVER treated as
 *     "no results".
 *   - We never fabricate a place or an image. If the API returns nothing,
 *     we return nothing.
 *   - `location` is applied as a *strict filter* (filter.geocode / locality),
 *     never merely as a soft preference signal.
 */

const QLOO_BASE_URL = process.env.QLOO_API_BASE_URL ?? "https://hackathon.api.qloo.com";

export class QlooError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "QlooError";
  }
}

function apiKey(): string {
  const key = process.env.QLOO_API_KEY;
  if (!key) {
    throw new QlooError("QLOO_API_KEY is not configured", 401);
  }
  return key;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface FetchOptions {
  /** Retry on 429 / transient network errors. */
  retries?: number;
  /** In-memory cache TTL in ms (server-side only). */
  cacheTtlMs?: number;
}

/** In-memory server cache. Qloo forbids publishing response data, but allows
 *  private server-side caching. */
const cache = new Map<string, { at: number; body: unknown }>();

async function qlooFetch<T>(
  path: string,
  params: Record<string, string | undefined>,
  opts: FetchOptions = {},
): Promise<T> {
  const retries = opts.retries ?? 3;
  const cacheTtlMs = opts.cacheTtlMs ?? 0;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.set(k, v);
  }
  const url = `${QLOO_BASE_URL}${path}?${qs.toString()}`;

  if (cacheTtlMs > 0) {
    const hit = cache.get(url);
    if (hit && Date.now() - hit.at < cacheTtlMs) {
      return hit.body as T;
    }
  }

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey(),
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (res.status === 429) {
        // Never treat rate-limiting as "no results".
        const backoff = 600 * Math.pow(2, attempt);
        await sleep(backoff);
        lastErr = new QlooError("rate limited", 429);
        continue;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new QlooError(
          `Qloo ${path} failed: HTTP ${res.status} — ${text.slice(0, 300)}`,
          res.status,
        );
      }

      const body = (await res.json()) as T;
      if (cacheTtlMs > 0) {
        cache.set(url, { at: Date.now(), body });
      }
      return body;
    } catch (e) {
      lastErr = e;
      if (e instanceof QlooError && e.status && e.status !== 429) {
        throw e; // non-retryable
      }
      if (attempt < retries) {
        await sleep(400 * Math.pow(2, attempt));
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new QlooError("unknown Qloo error");
}

/* ------------------------------------------------------------------ */
/* Response shapes (minimal, defensive — the API returns rich objects) */
/* ------------------------------------------------------------------ */

interface QlooEntity {
  name?: string;
  entity_id?: string;
  subtype?: string;
  type?: string;
  properties?: Record<string, unknown>;
  tags?: { id?: string; name?: string }[];
}

interface SearchResponse {
  success?: boolean;
  results?: { entities?: QlooEntity[] };
  entities?: QlooEntity[];
}

export interface QloTag {
  id?: string;
  name?: string;
  value?: string;
  tag_id?: string;
  type?: string;
}

interface TagsResponse {
  success?: boolean;
  results?: { tags?: QloTag[] };
  tags?: QloTag[];
}

interface InsightsResponse {
  success?: boolean;
  results?: {
    entities?: QlooEntity[];
    explainability?: Record<string, unknown>;
  };
  explainability?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* Public methods                                                      */
/* ------------------------------------------------------------------ */

/** Resolve a name to candidate Qloo entities of the given types. */
export async function searchEntities(
  query: string,
  types: string[],
): Promise<QlooEntity[]> {
  const body = await qlooFetch<SearchResponse>(
    "/search",
    {
      query,
      types: types.join(","),
      take: "10",
    },
    { retries: 3, cacheTtlMs: 60_000 },
  );
  const list = body.results?.entities ?? body.entities ?? [];
  return list;
}

/** Search valid tag URNs by keyword. */
export async function searchTags(query: string): Promise<QloTag[]> {
  const body = await qlooFetch<TagsResponse>(
    "/v2/tags",
    { "filter.query": query, take: "20" },
    { retries: 3, cacheTtlMs: 60_000 },
  );
  return body.results?.tags ?? body.tags ?? [];
}

export interface InsightsRequest {
  filterType: string;
  /** Strict location filter (natural-language, e.g. "Tokyo"). */
  locationQuery?: string;
  /** Strict country/city geocode filter (belt-and-suspenders for Tokyo). */
  countryCode?: string;
  filterTags?: string[];
  includeTags?: string[];
  excludeTags?: string[];
  interestEntities?: string[];
  interestTags?: string[];
  /** Ask Qloo for per-entity explainability contributions. */
  explainability?: boolean;
  take?: number;
}

export interface InsightsResult {
  entities: QlooEntity[];
  explainability: Record<string, unknown>;
  localities: unknown;
}

/** Run an insights request for places, strictly scoped to a location. */
export async function getPlaceInsights(req: InsightsRequest): Promise<InsightsResult> {
  const params: Record<string, string | undefined> = {
    "filter.type": req.filterType,
    // Strict location — the primary Tokyo guarantee.
    "signal.location.query": req.locationQuery,
    // Belt-and-suspenders: pin to Japan when a country code is available.
    "filter.geocode.country_code": req.countryCode,
    "filter.tags": req.filterTags?.join(","),
    "filter.include.tags": req.includeTags?.join(","),
    "filter.exclude.tags": req.excludeTags?.join(","),
    "signal.interests.entities": req.interestEntities?.join(","),
    "signal.interests.tags": req.interestTags?.join(","),
    "feature.explainability": req.explainability ? "true" : undefined,
    take: String(req.take ?? 12),
  };

  const body = await qlooFetch<InsightsResponse>(
    "/v2/insights",
    params,
    { retries: 3, cacheTtlMs: 30_000 },
  );

  return {
    entities: body.results?.entities ?? [],
    explainability: body.results?.explainability ?? body.explainability ?? {},
    localities: {},
  };
}

/** Extract a displayable image url from a Qloo entity (never fabricate). */
export function entityImageUrl(e: QlooEntity): string | null {
  const p = e.properties;
  if (!p) return null;
  const img = p.image as { url?: string } | undefined;
  return img?.url ?? null;
}

/** Extract a short description, if present. */
export function entityDescription(e: QlooEntity): string | null {
  const p = e.properties;
  if (!p) return null;
  if (typeof p.description === "string" && p.description) return p.description;
  const short = p.short_descriptions as { value?: string }[] | undefined;
  const first = short?.find((s) => s.value);
  return first?.value ?? null;
}
