import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { PageAudit } from "../types/audit.js";
import type { PlanPage, PlanSection, RebuildPlan } from "../types/plan.js";
import { planPrompt } from "./prompts.js";
import { skipAi } from "../config/load.js";

function skipped(reason: string): RebuildPlan {
  return {
    skipped: true,
    reason: reason,
    projectName: "",
    verdict: "",
    destroyFirst: false,
    font: "",
    colors: "",
    images: "",
    css: "",
    pages: [],
  };
}

function pngDataUrl(shotPath: string): string {
  const buf = readFileSync(shotPath);
  return "data:image/png;base64," + buf.toString("base64");
}

function asSections(raw: unknown): PlanSection[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: PlanSection[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    out.push({
      name: String(o.name ?? o.title ?? ""),
      what: String(o.what ?? o.purpose ?? ""),
    });
  }
  return out;
}

function asPages(raw: unknown): PlanPage[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: PlanPage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    const layout = String(o.layout ?? "");
    let sections = asSections(o.sections);
    if (sections.length === 0 && layout) {
      sections = [{ name: "Layout", what: layout }];
    }
    out.push({
      order: Number(o.order ?? out.length + 1),
      route: String(o.route ?? ""),
      title: String(o.title ?? ""),
      purpose: String(o.purpose ?? ""),
      h1: String(o.h1 ?? ""),
      primaryButton: String(o.primaryButton ?? ""),
      from: String(o.from ?? ""),
      sections: sections,
      html: String(o.html ?? ""),
    });
  }
  return out;
}

function asText(v: unknown): string {
  if (v == null) {
    return "";
  }
  if (typeof v === "string") {
    return v;
  }
  try {
    return JSON.stringify(v);
  } catch {
    return "";
  }
}

function parsePlan(raw: string): RebuildPlan {
  let t = raw.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  }
  const j = JSON.parse(t) as Record<string, unknown>;
  const pages = asPages(j.pages ?? j.steps);
  let css = String(j.css ?? "");
  if (!css && pages[0]) {
    const first = (j.pages ?? j.steps) as unknown;
    if (Array.isArray(first) && first[0] && typeof first[0] === "object") {
      css = String((first[0] as Record<string, unknown>).css ?? "");
    }
  }
  return {
    skipped: false,
    reason: "",
    projectName: String(j.projectName ?? ""),
    verdict: String(j.verdict ?? ""),
    destroyFirst: Boolean(j.destroyFirst),
    font: String(j.font ?? ""),
    colors: asText(j.colors),
    images: String(j.images ?? ""),
    css: css,
    pages: pages,
  };
}

function compact(r: PageAudit) {
  if (r.kind === "example") {
    return {
      url: r.url,
      kind: r.kind,
      steal: r.taste.steal,
      themeSpec: r.taste.themeSpec,
      extras: r.taste.extras,
      features: r.taste.features,
    };
  }
  return {
    url: r.url,
    passed: r.passed,
    notes: r.notes,
    readyFor: r.taste.readyFor,
    factSummary: r.taste.factSummary,
    issues: r.taste.issues,
    slopHits: r.taste.slopHits,
    themeSpec: r.taste.themeSpec,
    features: r.taste.features,
    extras: r.taste.extras,
    pagesToAdd: r.taste.pagesToAdd,
  };
}

export async function buildPlan(
  product: string,
  goal: string,
  yours: PageAudit[],
  examples: PageAudit[]
): Promise<RebuildPlan> {
  const key = process.env.FRESP_API_KEY;
  if (skipAi()) {
    return skipped("FRESP_SKIP_AI");
  }
  if (!key) {
    return skipped("no API key");
  }
  const base = process.env.FRESP_API_BASE ?? "https://openrouter.ai/api/v1";
  const model = process.env.FRESP_MODEL ?? "google/gemini-3.5-flash-lite";
  const textPart = {
    type: "text",
    text:
      "Product: " +
      product +
      "\nGoal: " +
      goal +
      "\nYour pages:\n" +
      JSON.stringify(yours.map(compact)) +
      "\nExample pages:\n" +
      JSON.stringify(examples.map(compact)) +
      "\nWrite complete pasteable files. css = full style.css. each pages[].html = full HTML document.",
  };
  const content: { type: string; text?: string; image_url?: { url: string } }[] = [
    textPart,
  ];
  const home = yours[0];
  if (home && home.shot) {
    const shotPath = join("fixtures", "baselines", home.shot);
    if (existsSync(shotPath)) {
      content.push({
        type: "image_url",
        image_url: { url: pngDataUrl(shotPath) },
      });
    }
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
      max_tokens: 12000,
      messages: [
        { role: "system", content: planPrompt() },
        { role: "user", content: content },
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
    return parsePlan(text);
  } catch {
    return skipped("bad JSON from model");
  }
}
