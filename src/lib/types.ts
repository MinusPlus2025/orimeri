/**
 * Core domain types for Elsewhere.
 *
 * The product's central claim — "Your taste stays the same. Your intent
 * changes." — is expressed directly in the type system:
 *
 *   - `TasteObject`  : the durable, editable set of cultural objects a person
 *                      loves (an artist, a director, a brand, ...). These
 *                      persist across intent changes.
 *   - `Intent`       : the mutable, momentary mode of being (more social,
 *                      more quiet, more experimental).
 *   - `PlaceRecommendation` : a computed result that carries *evidence* — the
 *                      Qloo explainability contributions that justify it.
 */

/** A cultural object a person loves, resolved to a Qloo entity. */
export type TasteObjectKind =
  | "artist"
  | "director"
  | "brand"
  | "author"
  | "book"
  | "movie"
  | "tv_show"
  | "podcast"
  | "person"
  | "other";

export interface TasteObject {
  /** Stable client-side id (used for the editable collection UI). */
  id: string;
  /** The label the user typed, before resolution (e.g. "Brian Eno"). */
  label: string;
  /** Resolved Qloo entity id, if resolution succeeded. */
  entityId: string | null;
  /** Resolved Qloo entity type URN. */
  type: TasteObjectKind | null;
  /** Qloo entity name after resolution. */
  resolvedName: string | null;
  /** Qloo image url for the entity, if any. */
  imageUrl: string | null;
  /** Resolution status. */
  status: "pending" | "resolved" | "unresolved";
}

/** The three intent modes offered by the instrument. */
export type IntentMode = "social" | "quiet" | "experimental";

export interface Intent {
  mode: IntentMode;
  label: string;
  /** Natural-language description used to steer the recommendation. */
  description: string;
}

/** A single Qloo explainability contribution: which input signal moved this place. */
export interface EvidenceItem {
  /** The input entity or tag label that contributed. */
  source: string;
  /** Normalized contribution, 0..1. */
  weight: number;
  /** Human-readable note (e.g. "Brian Eno → ambient listening rooms"). */
  note: string;
}

/** A recommended place, grounded in Qloo data. */
export interface PlaceRecommendation {
  /** Qloo entity id. */
  entityId: string;
  name: string;
  /** Place category tag (e.g. "record_store", "cafe", "jazz_club"). */
  category: string | null;
  /** Address / neighborhood, if Qloo returned one. */
  address: string | null;
  /** Qloo image url, if available (we never fabricate images). */
  imageUrl: string | null;
  /** Qloo properties snippet (description, etc). */
  description: string | null;
  /** The evidence trail: why Qloo surfaced this place for this taste+intent. */
  evidence: EvidenceItem[];
  /** Raw affinity score from Qloo, if present. */
  affinity: number | null;
}

/** The full state of one discovery computation. */
export interface DiscoveryResult {
  /** The taste objects that were held constant for this computation. */
  taste: TasteObject[];
  /** The intent that produced this result. */
  intent: Intent;
  places: PlaceRecommendation[];
  /** Human-readable explanation of *what changed* vs the previous intent. */
  deltaNote: string | null;
  /** Warning/notice, e.g. "some taste objects could not be resolved". */
  notices: string[];
  /** True when the Qloo API was actually reached (never fake a result). */
  live: boolean;
}

/** Parsed intent + constraints extracted by DeepSeek from a free-text query. */
export interface ParsedIntent {
  mode: IntentMode;
  /** Structured constraints for Qloo (tags to include / exclude). */
  tags: { include: string[]; exclude: string[] };
  /** Free-text location, always forced to the configured city. */
  location: string;
  /** Extra notes surfaced to the user about how the intent was understood. */
  summary: string;
}
