import type { PageAudit } from "../types/audit.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { writeReport } from "../report/report.js";

let lastResults: PageAudit = {
  url: "",
  passed: false,
  notes: "",
  shot: "",
};

let allResults: PageAudit[] = [];

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
  writeReport(allResults);
}

export function clearRun(): void {
  allResults = [];
}