import { existsSync, readFileSync } from "node:fs";
import { skipAi } from "../config/load.js";
import type {
  DesignMove,
  PageToAdd,
  StealNotes,
  TasteIssue,
  TasteResult,
  ThemeSpec,
} from "../types/taste.js";
import { examplePrompt, exampleUserPrompt, prompt, userPrompt } from "./prompts.js";

function emptySteal(): StealNotes {
  return { nav: "", type: "", colors: "", sections: "", cta: "", useFor: "" };
}

function skipped(reason: string): TasteResult {
  return {
    skipped: true,
    reason: reason,
    assumedProduct: "",
    assumedGoal: "",
    factSummary: "",
    issues: [],
    slopHits: [],
    readyFor: "",
    confidence: "",
    theme: "",
    features: [],
    extras: [],
    pagesToAdd: [],
    designMoves: [],
    themeSpec: { bg: "", text: "", accent: "", font: "", note: "" },
    steal: emptySteal(),
  };
}

function pngDataUrl(shotPath: string): string {
  const buf = readFileSync(shotPath);
  return "data:image/png;base64," + buf.toString("base64");
}

function asIssues(raw: unknown): TasteIssue[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: TasteIssue[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    out.push({
      shot: String(o.shot ?? ""),
      severity: String(o.severity ?? ""),
      title: String(o.title ?? ""),
      why: String(o.why ?? ""),
      howToFix: String(o.howToFix ?? ""),
    });
  }
  return out;
}

function asPages(raw: unknown): PageToAdd[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: PageToAdd[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    out.push({
      route: String(o.route ?? ""),
      name: String(o.name ?? ""),
      purpose: String(o.purpose ?? ""),
    });
  }
  return out;
}

function asMoves(raw: unknown): DesignMove[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: DesignMove[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    out.push({
      selector: String(o.selector ?? ""),
      change: String(o.change ?? ""),
      css: String(o.css ?? ""),
    });
  }
  return out;
}

function asTheme(raw: unknown): ThemeSpec {
  if (!raw || typeof raw !== "object") {
    return { bg: "", text: "", accent: "", font: "", note: "" };
  }
  const o = raw as Record<string, unknown>;
  return {
    bg: String(o.bg ?? ""),
    text: String(o.text ?? ""),
    accent: String(o.accent ?? ""),
    font: String(o.font ?? ""),
    note: String(o.note ?? ""),
  };
}

function asSteal(raw: unknown): StealNotes {
  if (!raw || typeof raw !== "object") {
    return emptySteal();
  }
  const o = raw as Record<string, unknown>;
  return {
    nav: String(o.nav ?? ""),
    type: String(o.type ?? ""),
    colors: String(o.colors ?? ""),
    sections: String(o.sections ?? ""),
    cta: String(o.cta ?? ""),
    useFor: String(o.useFor ?? ""),
  };
}

function parseTaste(raw: string): TasteResult {
  let t = raw.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  }
  const j = JSON.parse(t) as Record<string, unknown>;
  const slop = Array.isArray(j.slopHits) ? j.slopHits.map(String) : [];
  return {
    skipped: false,
    reason: "",
    assumedProduct: String(j.assumedProduct ?? ""),
    assumedGoal: String(j.assumedGoal ?? ""),
    factSummary: String(j.factSummary ?? ""),
    issues: asIssues(j.issues),
    slopHits: slop,
    readyFor: String(j.readyFor ?? ""),
    confidence: String(j.confidence ?? ""),
    theme: String(j.theme ?? ""),
    features: Array.isArray(j.features) ? j.features.map(String) : [],
    extras: Array.isArray(j.extras) ? j.extras.map(String) : [],
    pagesToAdd: asPages(j.pagesToAdd),
    designMoves: asMoves(j.designMoves),
    themeSpec: asTheme(j.themeSpec),
    steal: asSteal(j.steal),
  };
}
export async function judgePage(
    url: string,
    product: string,
    goal: string,
    facts: string,
    shotPath: string,
    sectionFiles: string[],
    asExample: boolean,
    learnings: string,
    refShotPath: string
  ): Promise<TasteResult> {
  const key = process.env.FRESP_API_KEY;
  if (skipAi()) {
    return skipped("FRESP_SKIP_AI");
  }
  if (!key) {
    return skipped("no API key");
  }
  const base = process.env.FRESP_API_BASE ?? "https://openrouter.ai/api/v1";
  const model = process.env.FRESP_MODEL ?? "google/gemini-3.5-flash-lite";
  const names = [shotPath.split(/[/\\]/).pop() ?? "", ...sectionFiles].join(", ");
  const sys = asExample ? examplePrompt() : prompt();
  const user = asExample
    ? exampleUserPrompt(url, product, goal, facts, names)
    : userPrompt(url, product, goal, facts, names, learnings);
  const parts: { type: string; text?: string; image_url?: { url: string } }[] = [
    { type: "text", text: user },
    { type: "image_url", image_url: { url: pngDataUrl(shotPath) } },
  ];
  if (!asExample && refShotPath && existsSync(refShotPath)) {
    parts.push({ type: "image_url", image_url: { url: pngDataUrl(refShotPath) } });
  }
  const res = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/atireksd11/fresp-ai-tester",
      "X-Title": "Fresp",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: parts },
      ],
    }),
  });
  if (!res.ok) {
    return skipped("api " + String(res.status));
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  try {
    return parseTaste(text);
  } catch {
    return skipped("bad JSON from model");
  }
}