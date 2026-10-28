"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./instrument.css";
import type { DiscoveryResult, IntentMode, TasteObject } from "@/lib/types";

interface ApiResponse {
  ok: boolean;
  live: boolean;
  configured?: { qloo: boolean; deepseek: boolean };
  message?: string;
  intent?: { mode: IntentMode; label: string };
  parsedIntent?: { summary: string } | null;
  taste?: TasteObject[];
  places?: DiscoveryResult["places"];
  deltaNote?: string | null;
  notices?: string[];
}

const INTENT_OPTIONS: { mode: IntentMode; label: string }[] = [
  { mode: "social", label: "More social" },
  { mode: "quiet", label: "More quiet" },
  { mode: "experimental", label: "More experimental" },
];

const SAMPLE_TASTE = ["Brian Eno", "Wong Kar-wai", "Aesop"];

export default function Home() {
  const [tasteLabels, setTasteLabels] = useState<string[]>(SAMPLE_TASTE);
  const [newTaste, setNewTaste] = useState("");
  const [intent, setIntent] = useState<IntentMode>("social");
  const [freeText, setFreeText] = useState(
    "I want to be around people, somewhere lively but still with real character.",
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<{ qloo: boolean; deepseek: boolean } | null>(null);

  const prevIntentRef = useRef<IntentMode | null>(null);
  const hasRunRef = useRef(false);

  // Fetch config status on mount.
  useEffect(() => {
    fetch("/api/discover")
      .then((r) => r.json())
      .then((d: ApiResponse & { configured?: { qloo: boolean; deepseek: boolean } }) => {
        setConfig(d.configured ?? { qloo: false, deepseek: false });
      })
      .catch(() => setConfig({ qloo: false, deepseek: false }));
  }, []);

  const runDiscovery = useCallback(
    async (targetIntent: IntentMode, previousIntent: IntentMode | null) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/discover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taste: tasteLabels,
            intent: targetIntent,
            freeText,
            previousIntent,
          }),
        });
        const data = (await res.json()) as ApiResponse;
        setResult(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [tasteLabels, freeText],
  );

  const handleDiscover = () => {
    prevIntentRef.current = result?.intent?.mode ?? null;
    runDiscovery(intent, prevIntentRef.current);
  };

  const handleIntentChange = (mode: IntentMode) => {
    if (mode === intent) return;
    const prev = intent;
    setIntent(mode);
    // Preserve taste, change intent, re-run.
    runDiscovery(mode, prev);
  };

  const addTaste = () => {
    const v = newTaste.trim();
    if (v && !tasteLabels.includes(v)) {
      setTasteLabels((s) => [...s, v]);
    }
    setNewTaste("");
  };

  const removeTaste = (label: string) => {
    setTasteLabels((s) => s.filter((x) => x !== label));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTaste();
  };

  const qlooLive = config?.qloo ?? false;
  const deepseekLive = config?.deepseek ?? false;

  return (
    <div className="shell">
      {/* Top bar */}
      <header className="topbar">
        <div className="brand">
          <span className="brandMark">Elsewhere</span>
          <span className="brandTagline">a taste instrument</span>
        </div>
        <div className="topMeta">
          <span className="cityBadge">
            <span className="cityDot" /> Tokyo
          </span>
          <span className={`statusPill ${qlooLive ? "statusLive" : "statusOff"}`}>
            {qlooLive ? "Qloo live" : "Qloo not configured"}
          </span>
        </div>
      </header>

      {/* Manifesto */}
      <div className="manifesto">
        <h1>
          Your taste stays <span className="dim">the same.</span>
          <br />
          Your intent <span className="dim">changes.</span>
        </h1>
        <p className="manifestoSub">
          A cultural instrument for discovering places in Tokyo. Tell it what you
          <em> love</em> — that part never moves — then turn the dial on how you feel
          <em> right now</em>, and watch the city recompose itself.
        </p>
      </div>

      {/* Workspace */}
      <div className="workspace">
        {/* Taste panel (fixed) */}
        <aside className="panel tastePanel">
          <div className="panelHeader">
            <span className="panelTitle">
              <span className="idx">01</span> Taste
            </span>
            <span className="resultCount">{tasteLabels.length} objects</span>
          </div>
          <div className="panelBody">
            {tasteLabels.length === 0 ? (
              <p className="tasteHint">No taste objects yet. Add what you love below.</p>
            ) : (
              tasteLabels.map((label) => (
                <div className="tasteRow" key={label}>
                  <div className="tasteThumb">
                    {label.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="tasteInfo">
                    <div className="tasteName">{label}</div>
                    <div className="tasteKind">cultural object</div>
                  </div>
                  <button
                    className="tasteRemove"
                    onClick={() => removeTaste(label)}
                    aria-label={`Remove ${label}`}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
            <div className="tasteAdd">
              <input
                value={newTaste}
                onChange={(e) => setNewTaste(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add an artist, director, brand…"
              />
              <button onClick={addTaste}>Add</button>
            </div>
            <p className="tasteHint">
              These are the things you love — they persist across every intent.
            </p>
          </div>
        </aside>

        {/* Main column */}
        <main>
          {/* Intent control */}
          <div className="intentBlock">
            <div className="intentLabel">
              <span className="idx">02</span> Intent
            </div>
            <div className="intentControls">
              {INTENT_OPTIONS.map((o) => (
                <button
                  key={o.mode}
                  className="intentBtn"
                  data-active={intent === o.mode}
                  data-mode={o.mode}
                  onClick={() => handleIntentChange(o.mode)}
                >
                  <span className="dot" />
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Query */}
          <div className="queryBlock">
            <textarea
              className="queryInput"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Describe where you are and what you need right now…"
              rows={2}
            />
            <div className="queryActions">
              <button
                className="primaryBtn"
                onClick={handleDiscover}
                disabled={loading || !qlooLive || tasteLabels.length === 0}
              >
                {loading ? "Discovering…" : "Discover"}
              </button>
              {!qlooLive && (
                <span style={{ fontSize: 12, color: "var(--red)" }}>
                  Configure QLOO_API_KEY to enable discovery.
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="panel">
            <div className="resultHeader">
              <span className="resultTitle">
                <span className="idx">03</span> Discovery
              </span>
              {result?.places && (
                <span className="resultCount">{result.places.length} places</span>
              )}
            </div>

            {error && (
              <div className="noticeBox">Something went wrong: {error}</div>
            )}

            {result?.deltaNote && (
              <div className="deltaNote">
                <strong>Taste unchanged · Intent changed.</strong> {result.deltaNote}
              </div>
            )}

            {result?.parsedIntent?.summary && (
              <div className="noticeBox">
                <em>{result.parsedIntent.summary}</em>
              </div>
            )}

            {result?.notices?.map((n, i) => (
              <div className="noticeBox" key={i}>
                {n}
              </div>
            ))}

            {loading && !result && (
              <div className="stateBox">
                <span className="loading">
                  <span className="spinner" /> Querying Qloo…
                </span>
              </div>
            )}

            {!loading && !result && qlooLive && (
              <div className="stateBox">
                <h3>Nothing discovered yet</h3>
                <p>
                  Set your taste, choose an intent, and press Discover. The
                  instrument will query Qloo in real time.
                </p>
              </div>
            )}

            {!loading && !result && !qlooLive && (
              <div className="stateBox">
                <h3>Not configured</h3>
                <p>
                  The Qloo API key is not set. Add <code>QLOO_API_KEY</code> to{" "}
                  <code>.env.local</code> and restart the server. Elsewhere never
                  shows mock recommendations.
                </p>
              </div>
            )}

            {!loading && result && result.places && result.places.length === 0 && (
              <div className="stateBox">
                <h3>No places surfaced</h3>
                <p>
                  Qloo returned no places for this taste + intent in Tokyo. Try a
                  different intent, or adjust your taste objects.
                </p>
              </div>
            )}

            {result?.places && result.places.length > 0 && (
              <div className="placeList">
                {result.places.map((p, i) => (
                  <article className="placeItem" key={p.entityId}>
                    <div className="placeMain">
                      <div className="placeIndex">
                        PLACE {String(i + 1).padStart(2, "0")}
                      </div>
                      <h2 className="placeName">{p.name}</h2>
                      <div className="placeMeta">
                        {p.category && (
                          <span className="placeCategory">{p.category}</span>
                        )}
                        {p.address && <span className="placeAddress">{p.address}</span>}
                      </div>
                      {p.description && (
                        <p className="placeDesc">{p.description}</p>
                      )}
                      {p.evidence && p.evidence.length > 0 && (
                        <div className="evidence">
                          <div className="evidenceLabel">Why — Qloo evidence</div>
                          {p.evidence.map((ev, j) => (
                            <div className="evidenceRow" key={j}>
                              <span className="evidenceSource">{ev.source}</span>
                              <span className="evidenceBar">
                                <span
                                  className="evidenceBarFill"
                                  style={{
                                    width: `${Math.max(
                                      4,
                                      Math.round(ev.weight * 100),
                                    )}%`,
                                  }}
                                />
                              </span>
                              <span className="evidenceWeight">
                                {ev.weight > 0 ? ev.weight.toFixed(2) : "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.imageUrl && (
                      <div className="placeImage">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.imageUrl} alt={p.name} loading="lazy" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <span>Elsewhere — taste stays, intent changes.</span>
        <span>
          Powered by Qloo taste graph · {deepseekLive ? "DeepSeek intent" : "heuristic intent"} ·
          Tokyo v0.1
        </span>
      </footer>
    </div>
  );
}
