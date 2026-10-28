import { NextRequest, NextResponse } from "next/server";
import { configStatus, discover, resolveIntent } from "@/lib/agent";
import { toIntentMode } from "@/lib/intent";
import type { IntentMode } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DiscoverBody {
  taste: string[];
  intent?: string;
  freeText?: string;
  previousIntent?: string;
}

/**
 * POST /api/discover
 *
 * Body: { taste: string[], intent?: "social"|"quiet"|"experimental",
 *         freeText?: string, previousIntent?: string }
 *
 * This route runs entirely server-side. API keys never leave the server.
 */
export async function POST(req: NextRequest) {
  let body: DiscoverBody;
  try {
    body = (await req.json()) as DiscoverBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const taste = Array.isArray(body.taste)
    ? body.taste.map((t) => String(t).trim()).filter(Boolean)
    : [];

  if (taste.length === 0) {
    return NextResponse.json(
      { error: "At least one taste object is required" },
      { status: 400 },
    );
  }

  const cfg = configStatus();
  if (!cfg.qloo) {
    // Explicit not-configured state — never a mock.
    return NextResponse.json(
      {
        ok: false,
        live: false,
        configured: cfg,
        message: "Qloo API key is not configured. Add QLOO_API_KEY to .env.local.",
      },
      { status: 200 },
    );
  }

  // Determine intent: explicit mode beats free-text parsing.
  let intentMode: IntentMode;
  let parsedIntent = null;
  if (body.intent && ["social", "quiet", "experimental"].includes(body.intent)) {
    intentMode = body.intent as IntentMode;
  } else if (body.freeText) {
    parsedIntent = await resolveIntent(body.freeText);
    intentMode = parsedIntent.mode;
  } else {
    intentMode = "social";
  }

  try {
    const previousIntent = body.previousIntent
      ? toIntentMode(body.previousIntent)
      : null;

    const result = await discover(
      taste,
      intentMode,
      previousIntent
        ? {
            taste: [],
            intent: {
              mode: previousIntent,
              label: "",
              description: "",
            },
            places: [],
            deltaNote: null,
            notices: [],
            live: true,
          }
        : null,
    );

    return NextResponse.json({
      ok: true,
      live: result.live,
      configured: cfg,
      intent: result.intent,
      parsedIntent: parsedIntent ? { summary: parsedIntent.summary } : null,
      taste: result.taste,
      places: result.places,
      deltaNote: result.deltaNote,
      notices: result.notices,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        live: false,
        configured: cfg,
        message: `Discovery failed: ${(e as Error).message}`,
      },
      { status: 500 },
    );
  }
}

/** GET /api/discover — report configuration status (no secrets). */
export async function GET() {
  const cfg = configStatus();
  return NextResponse.json({
    ok: true,
    configured: cfg,
    city: process.env.ELSEWHERE_CITY ?? "Tokyo",
    note: cfg.qloo
      ? "Qloo configured. DeepSeek " + (cfg.deepseek ? "configured." : "not configured (heuristic fallback active).")
      : "Qloo not configured — the instrument will show an unconfigured state.",
  });
}
