/**
 * Intent → Qloo tag mapping.
 *
 * This is where the product's core mechanic lives: the SAME taste objects
 * (Brian Eno, Wong Kar-wai, Aesop) get filtered and re-ranked through
 * DIFFERENT place tags depending on intent.
 *
 *   social        →  communal, lively spaces
 *   quiet         →  low-noise, intimate, local spaces
 *   experimental  →  unconventional, avant-garde, experimental spaces
 *
 * These are candidate tag *keywords* that we resolve against Qloo's tag
 * search (urn:tag:category:place:* and related families). We never hardcode
 * a URN we haven't verified; the tag resolver in agent.ts confirms them.
 */

import type { IntentMode } from "./types";

export interface IntentTagProfile {
  mode: IntentMode;
  /** English keywords used to find matching place-category/ambience tags. */
  include: string[];
  /** Tags to avoid for this mode. */
  exclude: string[];
  /** Short human label for the control surface. */
  label: string;
}

export const INTENT_PROFILES: Record<IntentMode, IntentTagProfile> = {
  social: {
    mode: "social",
    label: "More social",
    include: ["live_music_venue", "bar", "izakaya", "cafe", "community_space", "jazz_club"],
    exclude: ["quiet", "intimate", "solitude"],
  },
  quiet: {
    mode: "quiet",
    label: "More quiet",
    include: ["book_store", "library", "cafe", "tea_house", "museum", "quiet", "local"],
    exclude: ["live_music_venue", "nightclub", "loud"],
  },
  experimental: {
    mode: "experimental",
    label: "More experimental",
    include: ["art_gallery", "experimental", "gallery", "independent", "concept_store", "listening_bar"],
    exclude: ["mainstream", "chain"],
  },
};

/** Normalize an arbitrary free-text mode hint to one of the three modes. */
export function toIntentMode(input: string | null | undefined): IntentMode {
  const s = (input ?? "").toLowerCase();
  if (s.includes("quiet") || s.includes("calm") || s.includes("solo") || s.includes("alone")) {
    return "quiet";
  }
  if (s.includes("experiment") || s.includes("weird") || s.includes("avant") || s.includes("novel")) {
    return "experimental";
  }
  if (s.includes("social") || s.includes("lively") || s.includes("people") || s.includes("busy")) {
    return "social";
  }
  return "social";
}
