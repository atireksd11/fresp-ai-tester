import type { PageAudit } from "../types/audit.js";
import type { RebuildPlan } from "../types/plan.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { writeReport } from "../report/report.js";

let lastResults: PageAudit = {
  url: "",
  passed: false,
  notes: "",
  shot: "",
  sections: [],
  taste: {
    skipped: true,
    reason: "",
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
    steal: { nav: "", type: "", colors: "", sections: "", cta: "", useFor: "" },
  },
  kind: "yours",
};

let allResults: PageAudit[] = [];

let lastPlan: RebuildPlan = {
  skipped: true,
  reason: "",
  projectName: "",
  verdict: "",
  destroyFirst: false,
  font: "",
  colors: "",
  images: "",
  css: "",
  pages: [],
};

export function savePlan(plan: RebuildPlan): void {
  lastPlan = plan;
}

export function saveResult(result: PageAudit): void {
  lastResults = result;
  allResults.push(result);
}

export function getResult(): PageAudit {
  return lastResults;
}

export function writeRun(): void {
  mkdirSync("logs", { recursive: true });
  writeFileSync("logs/last-run.json", JSON.stringify(allResults, null, 2));
  writeFileSync("logs/last-plan.json", JSON.stringify(lastPlan, null, 2));
  writeReport(allResults, lastPlan);
}

export function getAll(): PageAudit[] {
  return allResults;
}

export function clearRun(): void {
  allResults = [];
  lastPlan = {
    skipped: true,
    reason: "",
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